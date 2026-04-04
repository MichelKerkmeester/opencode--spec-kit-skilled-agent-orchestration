import type Database from 'better-sqlite3';
declare const PENDING_SUFFIX = "_pending";
declare const TEMP_SUFFIX = ".tmp";
interface TransactionMetrics {
    totalAtomicWrites: number;
    totalDeletes: number;
    totalRecoveries: number;
    totalErrors: number;
    lastOperationTime: string | null;
    [key: string]: unknown;
}
interface AtomicSaveResult {
    success: boolean;
    filePath: string;
    error?: string;
    /** Fix #22: Set when DB committed but rename failed, indicating partial state */
    dbCommitted?: boolean;
}
interface RecoveryResult {
    path: string;
    recovered: boolean;
    error?: string;
}
/**
 * Optional database probe used during pending-file recovery.
 * Return `true` when the original path already has a committed `memory_index` row.
 * Return `false` to leave the `_pending` file in place for manual review.
 * Throwing aborts recovery for that file and surfaces the error message in `RecoveryResult.error`.
 */
type IsCommittedCheck = (originalPath: string) => boolean;
declare function getMetrics(): TransactionMetrics;
declare function resetMetrics(): void;
declare function getPendingPath(filePath: string): string;
declare function isPendingFile(filePath: string): boolean;
declare function getOriginalPath(pendingPath: string): string;
declare function runInTransaction<T>(database: Database.Database, callback: () => T): T;
/**
 * Write a file atomically using write-to-temp-then-rename pattern.
 * This prevents partial writes if the process crashes mid-write.
 */
declare function atomicWriteFile(filePath: string, content: string, encoding?: BufferEncoding): boolean;
/**
 * Delete a file if it exists.
 */
declare function deleteFileIfExists(filePath: string): boolean;
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
declare function executeAtomicSave(filePath: string, content: string, dbOperation: () => void): AtomicSaveResult;
declare function findPendingFiles(dirPath: string): string[];
/**
 * Recover a single pending file by renaming to its original path.
 */
declare function recoverPendingFile(pendingPath: string, isCommittedInDb?: IsCommittedCheck, databasePathOverride?: string): RecoveryResult;
/**
 * Recover all pending files in a directory.
 */
declare function recoverAllPendingFiles(dirPath: string, isCommittedInDb?: IsCommittedCheck, databasePathOverride?: string): RecoveryResult[];
export { PENDING_SUFFIX, TEMP_SUFFIX, getMetrics, resetMetrics, getPendingPath, isPendingFile, getOriginalPath, runInTransaction, atomicWriteFile, deleteFileIfExists, executeAtomicSave, findPendingFiles, recoverPendingFile, recoverAllPendingFiles, };
/**
 * Re-exports related public types.
 */
export type { TransactionMetrics, AtomicSaveResult, RecoveryResult, IsCommittedCheck, };
//# sourceMappingURL=transaction-manager.d.ts.map