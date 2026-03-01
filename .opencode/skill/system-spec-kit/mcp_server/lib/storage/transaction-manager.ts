// ---------------------------------------------------------------
// MODULE: Transaction Manager
// Atomic file + index operations with pending file recovery
// ---------------------------------------------------------------

import * as fs from 'fs';
import * as path from 'path';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const PENDING_SUFFIX = '_pending';
const TEMP_SUFFIX = '.tmp';

/* -------------------------------------------------------------
   2. INTERFACES
----------------------------------------------------------------*/

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
}

interface RecoveryResult {
  path: string;
  recovered: boolean;
  error?: string;
}

/* -------------------------------------------------------------
   3. MODULE STATE
----------------------------------------------------------------*/

const metrics: TransactionMetrics = {
  totalAtomicWrites: 0,
  totalDeletes: 0,
  totalRecoveries: 0,
  totalErrors: 0,
  lastOperationTime: null,
};

/* -------------------------------------------------------------
   4. METRICS
----------------------------------------------------------------*/

function getMetrics(): TransactionMetrics {
  return { ...metrics };
}

function resetMetrics(): void {
  metrics.totalAtomicWrites = 0;
  metrics.totalDeletes = 0;
  metrics.totalRecoveries = 0;
  metrics.totalErrors = 0;
  metrics.lastOperationTime = null;
}

/* -------------------------------------------------------------
   5. PATH HELPERS
----------------------------------------------------------------*/

function getPendingPath(filePath: string): string {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);
  return path.join(dir, `${base}${PENDING_SUFFIX}${ext}`);
}

function isPendingFile(filePath: string): boolean {
  const base = path.basename(filePath, path.extname(filePath));
  return base.endsWith(PENDING_SUFFIX);
}

function getOriginalPath(pendingPath: string): string {
  const dir = path.dirname(pendingPath);
  const ext = path.extname(pendingPath);
  const base = path.basename(pendingPath, ext);
  const originalBase = base.replace(new RegExp(`${PENDING_SUFFIX}$`), '');
  return path.join(dir, `${originalBase}${ext}`);
}

/* -------------------------------------------------------------
   6. ATOMIC FILE OPERATIONS
----------------------------------------------------------------*/

/**
 * Write a file atomically using write-to-temp-then-rename pattern.
 * This prevents partial writes if the process crashes mid-write.
 */
function atomicWriteFile(filePath: string, content: string, encoding: BufferEncoding = 'utf-8'): boolean {
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
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[transaction-manager] atomicWriteFile error: ${msg}`);
    metrics.totalErrors++;

    // Clean up temp file
    try {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    } catch { /* ignore cleanup errors */ }

    return false;
  }
}

/**
 * Delete a file if it exists.
 */
function deleteFileIfExists(filePath: string): boolean {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      metrics.totalDeletes++;
      metrics.lastOperationTime = new Date().toISOString();
      return true;
    }
    return false;
  } catch (error: unknown) {
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
 * AI-WHY: This function provides file-system-level atomicity (write-to-pending + rename),
 * NOT database transaction isolation. Callers needing transactional guarantees for
 * dbOperation() must wrap it in their own db.transaction() call. The rename step
 * ensures the file is either fully written or not present, but the DB operation
 * is not rolled back if the rename fails (extremely rare on local filesystems).
 */
function executeAtomicSave(
  filePath: string,
  content: string,
  dbOperation: () => void
): AtomicSaveResult {
  const pendingPath = getPendingPath(filePath);

  try {
    // Step 1: Write to pending path
    const dir = path.dirname(pendingPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(pendingPath, content, 'utf-8');

    // Step 2: Execute database operation
    try {
      dbOperation();
    } catch (dbError: unknown) {
      // Database failed - clean up pending file
      try { fs.unlinkSync(pendingPath); } catch { /* ignore */ }
      const msg = dbError instanceof Error ? dbError.message : String(dbError);
      metrics.totalErrors++;
      return { success: false, filePath, error: `DB operation failed: ${msg}` };
    }

    // Step 3: Rename pending to final (atomic)
    fs.renameSync(pendingPath, filePath);

    metrics.totalAtomicWrites++;
    metrics.lastOperationTime = new Date().toISOString();
    return { success: true, filePath };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    metrics.totalErrors++;

    // Clean up pending file
    try {
      if (fs.existsSync(pendingPath)) fs.unlinkSync(pendingPath);
    } catch { /* ignore */ }

    return { success: false, filePath, error: msg };
  }
}

/* -------------------------------------------------------------
   7. RECOVERY
----------------------------------------------------------------*/

/**
 * Find pending files in a directory (crash recovery).
 */
function listFilesRecursive(dirPath: string): string[] {
  const files: string[] = [];
  const stack: string[] = [dirPath];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;

    const entries = fs.readdirSync(current, { withFileTypes: true, encoding: 'utf-8' });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function findPendingFiles(dirPath: string): string[] {
  try {
    if (!fs.existsSync(dirPath)) return [];

    let files: string[];
    try {
      files = (fs.readdirSync(dirPath, { recursive: true, encoding: 'utf-8' }) as string[]).map((f) => path.join(dirPath, f));
    } catch {
      // Node 18 compatibility fallback when recursive readdir is unavailable.
      files = listFilesRecursive(dirPath);
    }

    return files.filter((f) => isPendingFile(f) && fs.statSync(f).isFile());
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[transaction-manager] findPendingFiles error: ${msg}`);
    return [];
  }
}

/**
 * Recover a single pending file by renaming to its original path.
 */
function recoverPendingFile(pendingPath: string): RecoveryResult {
  try {
    const originalPath = getOriginalPath(pendingPath);

    // If original exists and is newer, delete pending
    if (fs.existsSync(originalPath)) {
      const pendingStats = fs.statSync(pendingPath);
      const originalStats = fs.statSync(originalPath);

      if (originalStats.mtimeMs > pendingStats.mtimeMs) {
        fs.unlinkSync(pendingPath);
        return { path: pendingPath, recovered: false, error: 'Original is newer' };
      }
    }

    // Rename pending to original
    fs.renameSync(pendingPath, originalPath);
    metrics.totalRecoveries++;
    metrics.lastOperationTime = new Date().toISOString();

    return { path: pendingPath, recovered: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    metrics.totalErrors++;
    return { path: pendingPath, recovered: false, error: msg };
  }
}

/**
 * Recover all pending files in a directory.
 */
function recoverAllPendingFiles(dirPath: string): RecoveryResult[] {
  const pendingFiles = findPendingFiles(dirPath);
  return pendingFiles.map(recoverPendingFile);
}

/* -------------------------------------------------------------
   8. EXPORTS
----------------------------------------------------------------*/

export {
  PENDING_SUFFIX,
  TEMP_SUFFIX,

  // Metrics
  getMetrics,
  resetMetrics,

  // Path helpers
  getPendingPath,
  isPendingFile,
  getOriginalPath,

  // Atomic operations
  atomicWriteFile,
  deleteFileIfExists,
  executeAtomicSave,

  // Recovery
  findPendingFiles,
  recoverPendingFile,
  recoverAllPendingFiles,
};

export type {
  TransactionMetrics,
  AtomicSaveResult,
  RecoveryResult,
};
