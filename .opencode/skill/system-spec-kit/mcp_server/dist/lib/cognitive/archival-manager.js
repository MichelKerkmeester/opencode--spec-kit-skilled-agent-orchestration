import { clearDegreeCache } from '../search/graph-search-fn.js';
import { clearGraphSignalsCache } from '../graph/graph-signals.js';
/* ───────────────────────────────────────────────────────────────
   1. DEPENDENCIES (lazy-loaded)
----------------------------------------------------------------*/
// Lazy-load tier-classifier to avoid circular dependencies
let tierClassifierModule = null;
let tierClassifierModulePromise = null;
async function loadTierClassifierModule() {
    if (tierClassifierModule !== null) {
        return tierClassifierModule;
    }
    if (tierClassifierModulePromise !== null) {
        return tierClassifierModulePromise;
    }
    const loadPromise = (async () => {
        try {
            tierClassifierModule = await import('./tier-classifier.js');
            return tierClassifierModule;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.warn(`[archival-manager] tier-classifier module unavailable: ${message}`);
            return null;
        }
    })();
    tierClassifierModulePromise = loadPromise;
    try {
        return await loadPromise;
    }
    finally {
        if (tierClassifierModulePromise === loadPromise) {
            tierClassifierModulePromise = null;
        }
    }
}
function getTierClassifier() {
    if (tierClassifierModule !== null)
        return tierClassifierModule;
    if (tierClassifierModulePromise === null) {
        void loadTierClassifierModule();
    }
    return null;
}
let bm25IndexModule = null;
let bm25IndexModulePromise = null;
async function loadBm25IndexModule() {
    if (bm25IndexModule !== null) {
        return bm25IndexModule;
    }
    if (bm25IndexModulePromise !== null) {
        return bm25IndexModulePromise;
    }
    const primaryModulePath = '../search/bm25-index.js';
    const fallbackModulePath = '../../search/bm25-index.js';
    const loadPromise = (async () => {
        try {
            bm25IndexModule = await import(primaryModulePath);
            return bm25IndexModule;
        }
        catch (error) {
            const primaryError = error instanceof Error ? error.message : String(error);
            try {
                // Support cognitive symlink import path in some runtime setups.
                bm25IndexModule = await import(fallbackModulePath);
                return bm25IndexModule;
            }
            catch (fallbackError) {
                const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
                console.warn(`[archival-manager] bm25-index module unavailable. primary="${primaryError}" fallback="${fallbackMessage}"`);
                return null;
            }
        }
    })();
    bm25IndexModulePromise = loadPromise;
    try {
        return await loadPromise;
    }
    finally {
        if (bm25IndexModulePromise === loadPromise) {
            bm25IndexModulePromise = null;
        }
    }
}
function getBm25Index() {
    if (bm25IndexModule !== null)
        return bm25IndexModule;
    if (bm25IndexModulePromise === null) {
        void loadBm25IndexModule();
    }
    return null;
}
let embeddingsModule = null;
let embeddingsModulePromise = null;
async function loadEmbeddingsModule() {
    if (embeddingsModule !== null) {
        return embeddingsModule;
    }
    if (embeddingsModulePromise !== null) {
        return embeddingsModulePromise;
    }
    const primaryModulePath = '../providers/embeddings.js';
    const fallbackModulePath = '../../providers/embeddings.js';
    const loadPromise = (async () => {
        try {
            embeddingsModule = await import(primaryModulePath);
            return embeddingsModule;
        }
        catch (error) {
            const primaryError = error instanceof Error ? error.message : String(error);
            try {
                // Support cognitive symlink import path in some runtime setups.
                embeddingsModule = await import(fallbackModulePath);
                return embeddingsModule;
            }
            catch (fallbackError) {
                const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
                console.warn(`[archival-manager] embeddings module unavailable. primary="${primaryError}" fallback="${fallbackMessage}"`);
                return null;
            }
        }
    })();
    embeddingsModulePromise = loadPromise;
    try {
        return await loadPromise;
    }
    finally {
        if (embeddingsModulePromise === loadPromise) {
            embeddingsModulePromise = null;
        }
    }
}
function _getEmbeddings() {
    if (embeddingsModule !== null)
        return embeddingsModule;
    if (embeddingsModulePromise === null) {
        void loadEmbeddingsModule();
    }
    return null;
}
function __setEmbeddingsModuleForTests(module) {
    embeddingsModule = module;
    embeddingsModulePromise = null;
}
const ARCHIVAL_CONFIG = {
    enabled: process.env.SPECKIT_ARCHIVAL !== 'false',
    scanIntervalMs: 3600000, // 1 hour
    batchSize: 50,
    maxAgeDays: 90,
    maxAccessCount: 2,
    maxConfidence: 0.4,
    protectedTiers: ['constitutional', 'critical'],
    backgroundJobIntervalMs: 7200000, // 2 hours
};
/* ───────────────────────────────────────────────────────────────
   4. MODULE STATE
----------------------------------------------------------------*/
let db = null;
let backgroundJob = null;
const archivalStats = {
    totalScanned: 0,
    totalArchived: 0,
    totalUnarchived: 0,
    lastScanTime: null,
    errors: [],
};
/* ───────────────────────────────────────────────────────────────
   5. INITIALIZATION
----------------------------------------------------------------*/
function init(database) {
    db = database;
    ensureArchivedColumn();
    ensureArchivalStatsTable();
    loadArchivalStats();
}
function ensureArchivedColumn() {
    if (!db)
        return;
    try {
        const columns = db.prepare('PRAGMA table_info(memory_index)').all();
        const hasArchived = columns.some(c => c.name === 'is_archived');
        if (!hasArchived) {
            db.exec('ALTER TABLE memory_index ADD COLUMN is_archived INTEGER DEFAULT 0');
            db.exec('CREATE INDEX IF NOT EXISTS idx_archived ON memory_index(is_archived)');
            console.error('[archival-manager] Added is_archived column');
        }
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        if (!msg.includes('duplicate column')) {
            console.warn(`[archival-manager] ensureArchivedColumn error: ${msg}`);
        }
    }
}
/**
 * Ensure the archival_stats metadata table exists for persisting stats across restarts (P5-06).
 */
function ensureArchivalStatsTable() {
    if (!db)
        return;
    try {
        db.exec(`
      CREATE TABLE IF NOT EXISTS archival_stats (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[archival-manager] ensureArchivalStatsTable error: ${msg}`);
    }
}
/**
 * Load archival stats from the database on startup (P5-06).
 */
function loadArchivalStats() {
    if (!db)
        return;
    try {
        const rows = db.prepare('SELECT key, value FROM archival_stats').all();
        for (const row of rows) {
            switch (row.key) {
                case 'totalScanned':
                    archivalStats.totalScanned = parseInt(row.value, 10) || 0;
                    break;
                case 'totalArchived':
                    archivalStats.totalArchived = parseInt(row.value, 10) || 0;
                    break;
                case 'totalUnarchived':
                    archivalStats.totalUnarchived = parseInt(row.value, 10) || 0;
                    break;
                case 'lastScanTime':
                    archivalStats.lastScanTime = row.value === '' ? null : row.value || null;
                    break;
            }
        }
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[archival-manager] loadArchivalStats error: ${msg}`);
    }
}
/**
 * Persist archival stats to the database (P5-06).
 */
function saveArchivalStats() {
    if (!db)
        return;
    try {
        const upsert = db.prepare(`
      INSERT INTO archival_stats (key, value, updated_at)
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `);
        const saveAll = db.transaction(() => {
            upsert.run('totalScanned', String(archivalStats.totalScanned));
            upsert.run('totalArchived', String(archivalStats.totalArchived));
            upsert.run('totalUnarchived', String(archivalStats.totalUnarchived));
            upsert.run('lastScanTime', archivalStats.lastScanTime ?? '');
        });
        saveAll();
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[archival-manager] saveArchivalStats error: ${msg}`);
    }
}
/* ───────────────────────────────────────────────────────────────
   6. ARCHIVAL FUNCTIONS
----------------------------------------------------------------*/
/**
 * Get archival candidates using SQL as a pre-filter, then FSRS tier classifier
 * as the authoritative decision.
 *
 * Strategy: SQL query fetches broad candidates (unarchived, not protected, not pinned).
 * The FSRS-based tier classifier then determines which should actually be archived.
 * This unifies the dual archival paths (P5-05) — FSRS is primary, SQL is pre-filter.
 */
function getArchivalCandidates(limit = ARCHIVAL_CONFIG.batchSize) {
    if (!db)
        return [];
    try {
        const protectedList = ARCHIVAL_CONFIG.protectedTiers.map(() => '?').join(',');
        // Broad SQL pre-filter: get unarchived, non-protected, non-pinned memories
        const rows = db.prepare(`
      SELECT *
      FROM memory_index
      WHERE (is_archived IS NULL OR is_archived = 0)
        AND importance_tier NOT IN (${protectedList})
        AND is_pinned = 0
      ORDER BY last_accessed ASC NULLS FIRST, access_count ASC
      LIMIT ?
    `).all(...ARCHIVAL_CONFIG.protectedTiers, limit * 3 // Fetch extra since FSRS will filter further
        );
        // Use FSRS-based tier classifier as authoritative archival decision
        const classifier = getTierClassifier();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - ARCHIVAL_CONFIG.maxAgeDays);
        const candidates = [];
        for (const row of rows) {
            let shouldArchiveRow = false;
            if (classifier && typeof classifier.shouldArchive === 'function') {
                // Primary: FSRS-based decision
                shouldArchiveRow = classifier.shouldArchive(row);
            }
            else {
                // Fallback: SQL-based criteria only when FSRS is unavailable
                shouldArchiveRow = (row.created_at != null &&
                    new Date(row.created_at) < cutoffDate &&
                    (row.access_count || 0) <= ARCHIVAL_CONFIG.maxAccessCount &&
                    (row.confidence || 0.5) <= ARCHIVAL_CONFIG.maxConfidence);
            }
            if (shouldArchiveRow) {
                candidates.push({
                    id: row.id,
                    title: row.title,
                    spec_folder: row.spec_folder,
                    file_path: row.file_path,
                    created_at: row.created_at,
                    importance_tier: row.importance_tier,
                    access_count: row.access_count || 0,
                    confidence: row.confidence || 0.5,
                    reason: determineArchivalReason(row, cutoffDate),
                });
                if (candidates.length >= limit)
                    break;
            }
        }
        return candidates;
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[archival-manager] getArchivalCandidates error: ${msg}`);
        return [];
    }
}
function determineArchivalReason(row, cutoffDate) {
    const reasons = [];
    if (row.created_at && new Date(row.created_at) < cutoffDate) {
        reasons.push('aged');
    }
    if (row.access_count <= ARCHIVAL_CONFIG.maxAccessCount) {
        reasons.push('low-access');
    }
    if (row.confidence <= ARCHIVAL_CONFIG.maxConfidence) {
        reasons.push('low-confidence');
    }
    return reasons.join(', ') || 'candidate';
}
function checkMemoryArchivalStatus(memoryId) {
    if (!db)
        return { isArchived: false, shouldArchive: false };
    try {
        const memory = db.prepare('SELECT * FROM memory_index WHERE id = ?').get(memoryId);
        if (!memory)
            return { isArchived: false, shouldArchive: false };
        const isArchived = memory.is_archived === 1;
        // Check with tier classifier if available
        const classifier = getTierClassifier();
        let shouldArchive = false;
        if (classifier && typeof classifier.shouldArchive === 'function') {
            shouldArchive = classifier.shouldArchive(memory);
        }
        return { isArchived, shouldArchive };
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[archival-manager] checkMemoryArchivalStatus error: ${msg}`);
        return { isArchived: false, shouldArchive: false };
    }
}
function getMemoryIndexColumns() {
    if (!db)
        return new Set();
    try {
        const columns = db.prepare('PRAGMA table_info(memory_index)').all();
        return new Set(columns.map(column => column.name));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[archival-manager] getMemoryIndexColumns failed: ${message}`);
        return new Set();
    }
}
function syncBm25OnArchive(memoryId) {
    const bm25 = getBm25Index();
    if (!db || !bm25 || !bm25.isBm25Enabled())
        return;
    try {
        bm25.getIndex().removeDocument(String(memoryId));
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[archival-manager] BM25 archive sync failed: ${msg}`);
    }
}
// Vector-only deletion — removes the vec_memories embedding row without
// Touching memory_index or ancillary tables. This preserves the archived row
// (is_archived=1) so unarchive can still find and restore it.
function syncVectorOnArchive(memoryId) {
    if (!db)
        return;
    try {
        db.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(memoryId));
    }
    catch (error) {
        // Expected to fail when sqlite-vec is not loaded or vec_memories doesn't exist
        const msg = error instanceof Error ? error.message : String(error);
        if (!msg.includes('no such table')) {
            console.warn(`[archival-manager] Vector archive sync failed: ${msg}`);
        }
    }
}
function syncBm25OnUnarchive(memoryId) {
    const bm25 = getBm25Index();
    if (!db || !bm25 || !bm25.isBm25Enabled())
        return;
    try {
        const columns = getMemoryIndexColumns();
        const availableColumns = ['title', 'content_text', 'trigger_phrases', 'file_path']
            .filter(column => columns.has(column));
        if (availableColumns.length === 0)
            return;
        const query = `SELECT ${availableColumns.join(', ')} FROM memory_index WHERE id = ? AND is_archived = 0`;
        const row = db.prepare(query).get(memoryId);
        if (!row)
            return;
        const text = bm25.buildBm25DocumentText(row);
        if (!text)
            return;
        bm25.getIndex().addDocument(String(memoryId), text);
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[archival-manager] BM25 unarchive sync failed: ${msg}`);
    }
}
/**
 * Defer vector re-embedding to the next index scan rather than rebuilding immediately.
 *
 * The playbook contract (scenario 124) requires that unarchive does NOT recreate the
 * vec_memories row inline — instead it logs a deferred-rebuild notice so the next
 * `memory_index_scan` picks up the gap and re-embeds the memory. This avoids blocking
 * the unarchive call on an async embedding generation round-trip and keeps the
 * archive/unarchive path lightweight.
 */
function syncVectorOnUnarchive(memoryId) {
    console.error(`[archival-manager] Deferred vector re-embedding for memory ${memoryId} until next index scan`);
}
function archiveMemory(memoryId) {
    if (!db)
        return false;
    try {
        const result = db.prepare(`
      UPDATE memory_index
      SET is_archived = 1,
          updated_at = datetime('now')
      WHERE id = ?
        AND (is_archived IS NULL OR is_archived = 0)
    `).run(memoryId);
        const success = result.changes > 0;
        if (success) {
            archivalStats.totalArchived++;
            syncBm25OnArchive(memoryId);
            syncVectorOnArchive(memoryId);
            clearDegreeCache();
            clearGraphSignalsCache();
            saveArchivalStats();
        }
        return success;
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        const MAX_ERROR_LOG = 100;
        archivalStats.errors.push(msg);
        if (archivalStats.errors.length > MAX_ERROR_LOG) {
            archivalStats.errors = archivalStats.errors.slice(-MAX_ERROR_LOG);
        }
        console.warn(`[archival-manager] archiveMemory error: ${msg}`);
        return false;
    }
}
function archiveBatch(memoryIds) {
    if (!db)
        return { archived: 0, failed: memoryIds.length };
    let archived = 0;
    let failed = 0;
    const batchTransaction = db.transaction(() => {
        for (const id of memoryIds) {
            try {
                // Db is guaranteed non-null because archiveBatch returns early when the module database is missing
                const result = db.prepare(`
          UPDATE memory_index
          SET is_archived = 1,
              updated_at = datetime('now')
          WHERE id = ?
            AND (is_archived IS NULL OR is_archived = 0)
        `).run(id);
                const success = result.changes > 0;
                if (success) {
                    archivalStats.totalArchived++;
                    syncBm25OnArchive(id);
                    syncVectorOnArchive(id);
                    archived++;
                }
                else {
                    failed++;
                }
            }
            catch (error) {
                const msg = error instanceof Error ? error.message : String(error);
                const MAX_ERROR_LOG = 100;
                archivalStats.errors.push(msg);
                if (archivalStats.errors.length > MAX_ERROR_LOG) {
                    archivalStats.errors = archivalStats.errors.slice(-MAX_ERROR_LOG);
                }
                console.warn(`[archival-manager] archiveMemory error: ${msg}`);
                failed++;
            }
        }
    });
    batchTransaction();
    saveArchivalStats();
    return { archived, failed };
}
function unarchiveMemory(memoryId) {
    if (!db)
        return false;
    try {
        const result = db.prepare(`
      UPDATE memory_index
      SET is_archived = 0,
          updated_at = datetime('now')
      WHERE id = ? AND is_archived = 1
    `).run(memoryId);
        const success = result.changes > 0;
        if (success) {
            archivalStats.totalUnarchived++;
            syncBm25OnUnarchive(memoryId);
            syncVectorOnUnarchive(memoryId);
            clearDegreeCache();
            clearGraphSignalsCache();
            saveArchivalStats();
        }
        return success;
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[archival-manager] unarchiveMemory error: ${msg}`);
        return false;
    }
}
/* ───────────────────────────────────────────────────────────────
   7. SCANNING & BACKGROUND JOBS
----------------------------------------------------------------*/
function runArchivalScan() {
    const candidates = getArchivalCandidates();
    archivalStats.totalScanned += candidates.length;
    archivalStats.lastScanTime = new Date().toISOString();
    const result = archiveBatch(candidates.map(c => c.id));
    // Persist updated stats (P5-06)
    saveArchivalStats();
    console.error(`[archival-manager] Scan complete: ${candidates.length} candidates, ${result.archived} archived`);
    return { scanned: candidates.length, archived: result.archived };
}
function startBackgroundJob(intervalMs = ARCHIVAL_CONFIG.backgroundJobIntervalMs) {
    if (!ARCHIVAL_CONFIG.enabled) {
        return;
    }
    if (backgroundJob) {
        clearInterval(backgroundJob);
    }
    backgroundJob = setInterval(() => {
        try {
            runArchivalScan();
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.warn(`[archival-manager] Background job error: ${msg}`);
        }
    }, intervalMs);
    if (backgroundJob.unref) {
        backgroundJob.unref();
    }
    console.error(`[archival-manager] Background job started (interval: ${intervalMs / 1000}s)`);
}
function stopBackgroundJob() {
    if (backgroundJob) {
        clearInterval(backgroundJob);
        backgroundJob = null;
        console.error('[archival-manager] Background job stopped');
    }
}
function isBackgroundJobRunning() {
    return backgroundJob !== null;
}
/* ───────────────────────────────────────────────────────────────
   8. STATS & CLEANUP
----------------------------------------------------------------*/
function getStats() {
    return { ...archivalStats };
}
function getRecentErrors(limit = 10) {
    return archivalStats.errors.slice(-limit);
}
function resetStats() {
    archivalStats.totalScanned = 0;
    archivalStats.totalArchived = 0;
    archivalStats.totalUnarchived = 0;
    archivalStats.lastScanTime = null;
    archivalStats.errors = [];
    saveArchivalStats();
}
function cleanup() {
    stopBackgroundJob();
    db = null;
}
/* ───────────────────────────────────────────────────────────────
   9. EXPORTS
----------------------------------------------------------------*/
export { ARCHIVAL_CONFIG, 
// Initialization
init, ensureArchivedColumn, 
// Archival operations
getArchivalCandidates, checkMemoryArchivalStatus, archiveMemory, archiveBatch, unarchiveMemory, 
// Scanning
runArchivalScan, startBackgroundJob, stopBackgroundJob, isBackgroundJobRunning, 
// Stats
getStats, getRecentErrors, resetStats, cleanup, 
// Tests
__setEmbeddingsModuleForTests, };
//# sourceMappingURL=archival-manager.js.map