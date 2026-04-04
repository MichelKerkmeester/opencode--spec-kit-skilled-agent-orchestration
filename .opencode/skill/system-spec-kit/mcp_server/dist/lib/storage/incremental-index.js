// ───────────────────────────────────────────────────────────────
// MODULE: Incremental Index
// ───────────────────────────────────────────────────────────────
// Feature catalog: Deferred lexical-only indexing
// Mtime-based incremental indexing for fast re-indexing
// Node stdlib
import { createHash } from 'node:crypto';
import * as fs from 'fs';
// Internal modules
import { getCanonicalPathKey } from '../utils/canonical-path.js';
/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
----------------------------------------------------------------*/
const MTIME_FAST_PATH_MS = 1000; // Skip if mtime within 1 second
/* ───────────────────────────────────────────────────────────────
   3. MODULE STATE
----------------------------------------------------------------*/
let db = null;
let canonicalPathColumnAvailable = null;
function init(database) {
    db = database;
    canonicalPathColumnAvailable = null;
}
function hasCanonicalPathColumn() {
    if (!db)
        return false;
    if (canonicalPathColumnAvailable !== null) {
        return canonicalPathColumnAvailable;
    }
    try {
        const columns = db.prepare('PRAGMA table_info(memory_index)').all();
        canonicalPathColumnAvailable = columns.some((column) => column.name === 'canonical_file_path');
    }
    catch {
        canonicalPathColumnAvailable = false;
    }
    return canonicalPathColumnAvailable;
}
/* ───────────────────────────────────────────────────────────────
   4. FILE METADATA
----------------------------------------------------------------*/
function getFileMetadata(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return {
            path: filePath,
            mtime: stats.mtimeMs,
            size: stats.size,
            exists: true,
        };
    }
    catch {
        return {
            path: filePath,
            mtime: 0,
            size: 0,
            exists: false,
        };
    }
}
function getStoredMetadata(filePath) {
    if (!db)
        return null;
    try {
        const canonicalPath = getCanonicalPathKey(filePath);
        const row = hasCanonicalPathColumn()
            ? db.prepare(`
          SELECT file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status
          FROM memory_index
          WHERE canonical_file_path = ? OR file_path = ?
          ORDER BY CASE WHEN canonical_file_path = ? THEN 0 ELSE 1 END, id DESC
          LIMIT 1
        `).get(canonicalPath, filePath, canonicalPath)
            : db.prepare(`
          SELECT file_path, file_mtime_ms, content_hash, embedding_status
          FROM memory_index
          WHERE file_path = ?
        `).get(filePath);
        return row || null;
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[incremental-index] getStoredMetadata error: ${msg}`);
        return null;
    }
}
function computeFileContentHash(filePath) {
    try {
        const content = fs.readFileSync(filePath);
        return createHash('sha256').update(content).digest('hex');
    }
    catch {
        return null;
    }
}
/* ───────────────────────────────────────────────────────────────
   5. DECISION LOGIC
----------------------------------------------------------------*/
/**
 * 6-path decision logic for whether a file needs re-indexing.
 */
function shouldReindex(filePath) {
    const fileInfo = getFileMetadata(filePath);
    // Path 1: File doesn't exist on disk
    if (!fileInfo.exists) {
        const stored = getStoredMetadata(filePath);
        if (stored)
            return 'deleted';
        return 'skip';
    }
    // Path 2: No stored metadata (new file)
    const stored = getStoredMetadata(filePath);
    if (!stored)
        return 'new';
    // Path 3: No stored mtime (legacy entry, needs re-indexing)
    if (stored.file_mtime_ms === null)
        return 'reindex';
    // Path 4: Mtime unchanged (fast path - skip)
    if (Math.abs(fileInfo.mtime - stored.file_mtime_ms) < MTIME_FAST_PATH_MS) {
        // Still check if embedding status is pending
        if (stored.embedding_status === 'pending' || stored.embedding_status === 'failed') {
            return 'reindex';
        }
        if (stored.content_hash) {
            const currentContentHash = computeFileContentHash(filePath);
            if (currentContentHash && currentContentHash !== stored.content_hash) {
                return 'modified';
            }
        }
        return 'skip';
    }
    // Path 5: Mtime changed (file modified)
    return 'modified';
}
/* ───────────────────────────────────────────────────────────────
   6. MTIME MANAGEMENT
----------------------------------------------------------------*/
function updateFileMtime(filePath, mtimeMs) {
    if (!db)
        return false;
    try {
        const canonicalPath = getCanonicalPathKey(filePath);
        const result = hasCanonicalPathColumn()
            ? db.prepare(`
          UPDATE memory_index
          SET file_mtime_ms = ?
          WHERE canonical_file_path = ? OR file_path = ?
        `).run(mtimeMs, canonicalPath, filePath)
            : db.prepare(`
          UPDATE memory_index
          SET file_mtime_ms = ?
          WHERE file_path = ?
        `).run(mtimeMs, filePath);
        return result.changes > 0;
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[incremental-index] updateFileMtime error: ${msg}`);
        return false;
    }
}
function setIndexedMtime(filePath) {
    const fileInfo = getFileMetadata(filePath);
    if (!fileInfo.exists)
        return false;
    return updateFileMtime(filePath, fileInfo.mtime);
}
/* ───────────────────────────────────────────────────────────────
   7. BATCH OPERATIONS
----------------------------------------------------------------*/
function categorizeFilesForIndexing(filePaths) {
    const result = {
        toIndex: [],
        toUpdate: [],
        toSkip: [],
        toDelete: [],
    };
    for (const filePath of filePaths) {
        const decision = shouldReindex(filePath);
        switch (decision) {
            case 'new':
                result.toIndex.push(filePath);
                break;
            case 'modified':
            case 'reindex':
                result.toUpdate.push(filePath);
                break;
            case 'deleted':
                result.toDelete.push(filePath);
                break;
            case 'skip':
            default:
                result.toSkip.push(filePath);
                break;
        }
    }
    // Include stale indexed paths that are no longer discovered on disk.
    // Without this pass, removed files never enter toDelete during normal scans
    // Because discovery only returns files that currently exist.
    const staleIndexedPaths = listStaleIndexedPaths(filePaths);
    if (staleIndexedPaths.length > 0) {
        const seenDeleteKeys = new Set(result.toDelete.map((filePath) => getCanonicalPathKey(filePath)));
        for (const stalePath of staleIndexedPaths) {
            const staleKey = getCanonicalPathKey(stalePath);
            if (!seenDeleteKeys.has(staleKey)) {
                result.toDelete.push(stalePath);
                seenDeleteKeys.add(staleKey);
            }
        }
    }
    return result;
}
function listStaleIndexedPaths(scannedFilePaths) {
    if (!db)
        return [];
    const scannedCanonicalPaths = new Set(scannedFilePaths.map((filePath) => getCanonicalPathKey(filePath)));
    const stalePaths = new Set();
    try {
        const rows = hasCanonicalPathColumn()
            ? db.prepare(`
          SELECT DISTINCT file_path, canonical_file_path
          FROM memory_index
          WHERE file_path IS NOT NULL AND file_path != ''
        `).all()
            : db.prepare(`
          SELECT DISTINCT file_path
          FROM memory_index
          WHERE file_path IS NOT NULL AND file_path != ''
        `).all();
        for (const row of rows) {
            if (!row || typeof row.file_path !== 'string' || row.file_path.length === 0) {
                continue;
            }
            const rowCanonicalPath = typeof row.canonical_file_path === 'string' && row.canonical_file_path.length > 0
                ? row.canonical_file_path
                : getCanonicalPathKey(row.file_path);
            if (scannedCanonicalPaths.has(rowCanonicalPath)) {
                continue;
            }
            const filePathExists = getFileMetadata(row.file_path).exists;
            const canonicalPathExists = typeof row.canonical_file_path === 'string' && row.canonical_file_path.length > 0
                ? getFileMetadata(row.canonical_file_path).exists
                : false;
            if (!filePathExists && !canonicalPathExists) {
                stalePaths.add(row.file_path);
            }
        }
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[incremental-index] listStaleIndexedPaths error: ${msg}`);
    }
    return Array.from(stalePaths);
}
function listIndexedRecordIdsForDeletedPaths(filePaths) {
    if (!db || filePaths.length === 0)
        return [];
    const ids = new Set();
    const seenLookupKeys = new Set();
    try {
        for (const filePath of filePaths) {
            if (typeof filePath !== 'string' || filePath.length === 0) {
                continue;
            }
            const canonicalPath = getCanonicalPathKey(filePath);
            const lookupKey = `${canonicalPath}::${filePath}`;
            if (seenLookupKeys.has(lookupKey)) {
                continue;
            }
            seenLookupKeys.add(lookupKey);
            const rows = hasCanonicalPathColumn()
                ? db.prepare(`
            SELECT id, file_path, canonical_file_path
            FROM memory_index
            WHERE canonical_file_path = ? OR file_path = ?
          `).all(canonicalPath, filePath)
                : db.prepare(`
            SELECT id, file_path
            FROM memory_index
            WHERE file_path = ?
          `).all(filePath);
            for (const row of rows) {
                if (!row || typeof row.id !== 'number') {
                    continue;
                }
                const rowFileExists = typeof row.file_path === 'string' && row.file_path.length > 0
                    ? getFileMetadata(row.file_path).exists
                    : false;
                const rowCanonicalExists = typeof row.canonical_file_path === 'string' && row.canonical_file_path.length > 0
                    ? getFileMetadata(row.canonical_file_path).exists
                    : false;
                if (rowFileExists || rowCanonicalExists) {
                    continue;
                }
                ids.add(row.id);
            }
        }
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[incremental-index] listIndexedRecordIdsForDeletedPaths error: ${msg}`);
        return [];
    }
    return Array.from(ids).sort((a, b) => a - b);
}
function batchUpdateMtimes(filePaths) {
    if (!db)
        return { updated: 0, failed: filePaths.length };
    let updated = 0;
    let failed = 0;
    const updateTx = db.transaction(() => {
        for (const filePath of filePaths) {
            if (setIndexedMtime(filePath)) {
                updated++;
            }
            else {
                failed++;
            }
        }
    });
    try {
        updateTx();
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[incremental-index] batchUpdateMtimes error: ${msg}`);
    }
    return { updated, failed };
}
/* ───────────────────────────────────────────────────────────────
   8. EXPORTS
----------------------------------------------------------------*/
export { MTIME_FAST_PATH_MS, init, getFileMetadata, getStoredMetadata, shouldReindex, updateFileMtime, setIndexedMtime, categorizeFilesForIndexing, listStaleIndexedPaths, listIndexedRecordIdsForDeletedPaths, batchUpdateMtimes, };
//# sourceMappingURL=incremental-index.js.map