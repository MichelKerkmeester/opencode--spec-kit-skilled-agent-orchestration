import * as fs from 'fs';
import * as path from 'path';
import { resolveDatabasePaths } from '../../core/config.js';
/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
----------------------------------------------------------------*/
const PENDING_SUFFIX = '_pending';
const TEMP_SUFFIX = '.tmp';
const PENDING_UNIQUE_SUFFIX_PATTERN = /^(?:[0-9a-f]{8}|[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})$/i;
/* ───────────────────────────────────────────────────────────────
   3. MODULE STATE
----------------------------------------------------------------*/
const metrics = {
    totalAtomicWrites: 0,
    totalDeletes: 0,
    totalRecoveries: 0,
    totalErrors: 0,
    lastOperationTime: null,
};
const activeTransactions = new WeakMap();
/* ───────────────────────────────────────────────────────────────
   4. METRICS
----------------------------------------------------------------*/
function getMetrics() {
    return { ...metrics };
}
function resetMetrics() {
    metrics.totalAtomicWrites = 0;
    metrics.totalDeletes = 0;
    metrics.totalRecoveries = 0;
    metrics.totalErrors = 0;
    metrics.lastOperationTime = null;
}
/* ───────────────────────────────────────────────────────────────
   5. PATH HELPERS
----------------------------------------------------------------*/
function getPendingPath(filePath) {
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const base = path.basename(filePath, ext);
    return path.join(dir, `${base}${PENDING_SUFFIX}${ext}`);
}
function parsePendingPath(filePath) {
    const parseBasePendingPath = (candidatePath) => {
        const dir = path.dirname(candidatePath);
        const ext = path.extname(candidatePath);
        const base = path.basename(candidatePath, ext);
        if (!base.endsWith(PENDING_SUFFIX)) {
            return null;
        }
        const originalBase = base.slice(0, -PENDING_SUFFIX.length);
        return {
            originalPath: path.join(dir, `${originalBase}${ext}`),
            basePendingPath: candidatePath,
            uniqueSuffix: null,
        };
    };
    const suffixExt = path.extname(filePath);
    if (suffixExt) {
        const uniqueSuffix = suffixExt.slice(1);
        const basePendingPath = filePath.slice(0, -suffixExt.length);
        const suffixedMatch = parseBasePendingPath(basePendingPath);
        if (suffixedMatch &&
            path.extname(suffixedMatch.basePendingPath) &&
            PENDING_UNIQUE_SUFFIX_PATTERN.test(uniqueSuffix)) {
            return {
                ...suffixedMatch,
                uniqueSuffix,
            };
        }
    }
    return parseBasePendingPath(filePath);
}
function isPendingFile(filePath) {
    return parsePendingPath(filePath) !== null;
}
function getOriginalPath(pendingPath) {
    return parsePendingPath(pendingPath)?.originalPath ?? pendingPath;
}
function runInTransaction(database, callback) {
    const runCallback = () => {
        const depth = activeTransactions.get(database) ?? 0;
        activeTransactions.set(database, depth + 1);
        try {
            return callback();
        }
        finally {
            const nextDepth = (activeTransactions.get(database) ?? 1) - 1;
            if (nextDepth > 0) {
                activeTransactions.set(database, nextDepth);
            }
            else {
                activeTransactions.delete(database);
            }
        }
    };
    if ((activeTransactions.get(database) ?? 0) > 0 || database.inTransaction) {
        return runCallback();
    }
    return database.transaction(() => runCallback())();
}
/* ───────────────────────────────────────────────────────────────
   6. ATOMIC FILE OPERATIONS
----------------------------------------------------------------*/
/**
 * Write a file atomically using write-to-temp-then-rename pattern.
 * This prevents partial writes if the process crashes mid-write.
 */
function atomicWriteFile(filePath, content, encoding = 'utf-8') {
    const tempPath = filePath + TEMP_SUFFIX;
    try {
        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        // Write to temp file
        fs.writeFileSync(tempPath, content, encoding);
        // Atomic rename
        fs.renameSync(tempPath, filePath);
        metrics.totalAtomicWrites++;
        metrics.lastOperationTime = new Date().toISOString();
        return true;
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[transaction-manager] atomicWriteFile error: ${msg}`);
        metrics.totalErrors++;
        // Clean up temp file
        try {
            if (fs.existsSync(tempPath))
                fs.unlinkSync(tempPath);
        }
        catch { /* ignore cleanup errors */ }
        return false;
    }
}
/**
 * Delete a file if it exists.
 */
function deleteFileIfExists(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            metrics.totalDeletes++;
            metrics.lastOperationTime = new Date().toISOString();
            return true;
        }
        return false;
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[transaction-manager] deleteFileIfExists error: ${msg}`);
        metrics.totalErrors++;
        return false;
    }
}
/**
 * Execute an atomic save with pending file pattern.
 * 1. Write to pending path
 * 2. Execute database operations
 * 3. Rename pending to final
 *
 * This function provides file-system-level atomicity (write-to-pending + rename),
 * NOT database transaction isolation. Callers needing transactional guarantees for
 * dbOperation() must wrap it in their own db.transaction() call. The rename step
 * ensures the file is either fully written or not present, but the DB operation
 * is not rolled back if the rename fails (extremely rare on local filesystems).
 */
function executeAtomicSave(filePath, content, dbOperation) {
    const pendingPath = getPendingPath(filePath);
    try {
        // Step 1: Write to pending path
        const dir = path.dirname(pendingPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(pendingPath, content, 'utf-8');
        // Flag-based rollback coordination.
        // The dbOperation callback runs synchronously (better-sqlite3 transaction). If it
        // Succeeds but the rename (Step 3) fails, the DB change is already committed and
        // Cannot be rolled back. The dbCommitted flag tracks this state so the error path
        // Can report which step failed. No SAVEPOINT is used — better-sqlite3 transactions
        // Are all-or-nothing within the dbOperation() callback itself.
        let dbCommitted = false;
        // Step 2: Execute database operation
        try {
            dbOperation();
            dbCommitted = true;
        }
        catch (dbError) {
            // Database failed - clean up pending file
            try {
                fs.unlinkSync(pendingPath);
            }
            catch { /* ignore */ }
            const msg = dbError instanceof Error ? dbError.message : String(dbError);
            metrics.totalErrors++;
            return { success: false, filePath, error: `DB operation failed: ${msg}` };
        }
        // Step 3: Rename pending to final (atomic)
        // P1-020 KNOWN LIMITATION: If renameSync fails after dbOperation() committed,
        // The DB contains the new state but the file is not at its final path. This is
        // A window of vulnerability that cannot be eliminated without two-phase commit.
        // The `dbCommitted` flag on the returned error result enables callers to detect
        // This state and trigger recovery (e.g., re-index from DB or replay the write).
        // Mitigation: `recoverAllPendingFiles()` can be called on startup to find
        // Orphaned pending files and rename them to their final paths.
        try {
            fs.renameSync(pendingPath, filePath);
        }
        catch (renameError) {
            // Rename failed after DB committed — DB has new state but file wasn't renamed.
            // Leave pending file for startup recovery and report failure with dbCommitted flag.
            const msg = renameError instanceof Error ? renameError.message : String(renameError);
            console.warn(`[transaction-manager] rename failed after DB commit; pending file kept for recovery: ${pendingPath} (${msg})`);
            metrics.totalErrors++;
            return { success: false, filePath, error: `Rename failed after DB commit: ${msg}`, dbCommitted };
        }
        metrics.totalAtomicWrites++;
        metrics.lastOperationTime = new Date().toISOString();
        return { success: true, filePath };
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        metrics.totalErrors++;
        // Clean up pending file
        try {
            if (fs.existsSync(pendingPath))
                fs.unlinkSync(pendingPath);
        }
        catch { /* ignore */ }
        return { success: false, filePath, error: msg };
    }
}
/* ───────────────────────────────────────────────────────────────
   7. RECOVERY
----------------------------------------------------------------*/
/**
 * Find pending files in a directory (crash recovery).
 */
function listFilesRecursive(dirPath) {
    const files = [];
    const stack = [dirPath];
    while (stack.length > 0) {
        const current = stack.pop();
        if (!current)
            continue;
        const entries = fs.readdirSync(current, { withFileTypes: true, encoding: 'utf-8' });
        for (const entry of entries) {
            const fullPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                stack.push(fullPath);
            }
            else if (entry.isFile()) {
                files.push(fullPath);
            }
        }
    }
    return files;
}
function findPendingFiles(dirPath) {
    try {
        if (!fs.existsSync(dirPath))
            return [];
        let files;
        try {
            files = fs.readdirSync(dirPath, { recursive: true, encoding: 'utf-8' }).map((f) => path.join(dirPath, f));
        }
        catch {
            // Node 18 compatibility fallback when recursive readdir is unavailable.
            files = listFilesRecursive(dirPath);
        }
        return files.filter((filePath) => parsePendingPath(filePath) !== null && fs.statSync(filePath).isFile());
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[transaction-manager] findPendingFiles error: ${msg}`);
        return [];
    }
}
/**
 * Recover a single pending file by renaming to its original path.
 */
function recoverPendingFile(pendingPath, isCommittedInDb, databasePathOverride) {
    try {
        // Guard: verify pending file still exists before attempting recovery
        if (!fs.existsSync(pendingPath)) {
            return { path: pendingPath, recovered: false, error: 'Pending file no longer exists' };
        }
        const pendingInfo = parsePendingPath(pendingPath);
        if (!pendingInfo) {
            return { path: pendingPath, recovered: false, error: 'File does not match pending-file naming contract' };
        }
        const originalPath = pendingInfo.originalPath;
        const originalExists = fs.existsSync(originalPath);
        let committedInDb = null;
        if (isCommittedInDb) {
            const databasePath = databasePathOverride ?? resolveDatabasePaths().databasePath;
            if (!fs.existsSync(databasePath)) {
                console.warn(`[transaction-manager] Skipping pending recovery because DB file is missing: ${databasePath}`);
                return { path: pendingPath, recovered: false, error: 'Database file missing during recovery' };
            }
            committedInDb = isCommittedInDb(originalPath);
        }
        // If original exists and is newer, delete pending
        if (originalExists) {
            const pendingStats = fs.statSync(pendingPath);
            const originalStats = fs.statSync(originalPath);
            if (originalStats.mtimeMs > pendingStats.mtimeMs) {
                fs.unlinkSync(pendingPath);
                return { path: pendingPath, recovered: false, error: 'Original is newer' };
            }
        }
        // Stale detection: if DB check is provided and row was never committed,
        // Log and leave for manual review instead of renaming.
        if (committedInDb === false) {
            console.warn(`[transaction-manager] Stale pending file detected (no committed DB row): ${pendingPath}`);
            return { path: pendingPath, recovered: false, error: 'Stale pending file: DB row not committed' };
        }
        // Rename pending to original
        fs.renameSync(pendingPath, originalPath);
        metrics.totalRecoveries++;
        metrics.lastOperationTime = new Date().toISOString();
        return { path: pendingPath, recovered: true };
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        metrics.totalErrors++;
        return { path: pendingPath, recovered: false, error: msg };
    }
}
/**
 * Recover all pending files in a directory.
 */
function recoverAllPendingFiles(dirPath, isCommittedInDb, databasePathOverride) {
    const pendingFiles = findPendingFiles(dirPath);
    return pendingFiles.map((f) => recoverPendingFile(f, isCommittedInDb, databasePathOverride));
}
/* ───────────────────────────────────────────────────────────────
   8. EXPORTS
----------------------------------------------------------------*/
export { PENDING_SUFFIX, TEMP_SUFFIX, 
// Metrics
getMetrics, resetMetrics, 
// Path helpers
getPendingPath, isPendingFile, getOriginalPath, runInTransaction, 
// Atomic operations
atomicWriteFile, deleteFileIfExists, executeAtomicSave, 
// Recovery
findPendingFiles, recoverPendingFile, recoverAllPendingFiles, };
//# sourceMappingURL=transaction-manager.js.map