// ---------------------------------------------------------------
// MODULE: Index Refresh
// ---------------------------------------------------------------
// Manages embedding index freshness on the memory_index table
// ---------------------------------------------------------------

// External packages
import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const RETRY_THRESHOLD = 3;

/* -------------------------------------------------------------
   2. INTERFACES
----------------------------------------------------------------*/

/**
 * Describes the IndexStats shape.
 */
export interface IndexStats {
  total: number;
  success: number;
  pending: number;
  retry: number;
  failed: number;
  partial: number;
}

/**
 * Describes the UnindexedDocument shape.
 */
export interface UnindexedDocument {
  id: number;
  spec_folder: string;
  file_path: string;
  embedding_status: string;
  retry_count: number;
}

/* -------------------------------------------------------------
   3. MODULE STATE
----------------------------------------------------------------*/

let db: Database.Database | null = null;

/* -------------------------------------------------------------
   4. INIT
----------------------------------------------------------------*/

/**
 * Provides the init helper.
 */
export function init(database: Database.Database): void {
  db = database;
}

/* -------------------------------------------------------------
   5. PUBLIC API
----------------------------------------------------------------*/

/**
 * Count rows in memory_index grouped by embedding_status.
 */
export function getIndexStats(): IndexStats {
  assertDb();

  // AI-SAFETY: assertDb() above throws unless db has been initialized
  const rows = db!.prepare(`
    SELECT embedding_status, COUNT(*) as cnt
    FROM memory_index
    GROUP BY embedding_status
  `).all() as Array<{ embedding_status: string; cnt: number }>;

  const stats: IndexStats = {
    total: 0,
    success: 0,
    pending: 0,
    retry: 0,
    failed: 0,
    partial: 0,
  };

  for (const row of rows) {
    const count = row.cnt;
    stats.total += count;
    switch (row.embedding_status) {
      case 'success': stats.success = count; break;
      case 'pending': stats.pending = count; break;
      case 'retry':   stats.retry = count;   break;
      case 'failed':  stats.failed = count;  break;
      case 'partial': stats.partial = count;  break;
    }
  }

  return stats;
}

/**
 * True if any pending/retry/partial entries exist in memory_index.
 */
export function needsRefresh(): boolean {
  assertDb();

  // AI-SAFETY: assertDb() above throws unless db has been initialized
  // AI-SAFETY: assertDb() above throws unless db has been initialized
  const row = db!.prepare(`
    SELECT COUNT(*) as cnt
    FROM memory_index
    WHERE embedding_status IN ('pending', 'retry', 'partial')
  `).get() as { cnt: number };

  return row.cnt > 0;
}

/**
 * Returns rows where embedding_status is NOT 'success' and NOT 'failed'.
 * Order: retry entries before pending (so retries are prioritized).
 */
export function getUnindexedDocuments(): UnindexedDocument[] {
  assertDb();

  // AI-SAFETY: assertDb() above throws unless db has been initialized
  return db!.prepare(`
    SELECT id, spec_folder, file_path, embedding_status, retry_count
    FROM memory_index
    WHERE embedding_status NOT IN ('success', 'failed')
    ORDER BY
      CASE embedding_status
        WHEN 'retry' THEN 0
        WHEN 'partial' THEN 1
        WHEN 'pending' THEN 2
        ELSE 3
      END,
      id ASC
  `).all() as UnindexedDocument[];
}

/**
 * Update memory_index: set embedding_status='success', embedding_model=modelName.
 * Returns true if row was updated.
 */
export function markIndexed(id: number, modelName: string): boolean {
  assertDb();

  // AI-SAFETY: assertDb() above throws unless db has been initialized
  // AI-SAFETY: assertDb() above throws unless db has been initialized
  const result = db!.prepare(`
    UPDATE memory_index
    SET embedding_status = 'success',
        embedding_model = ?,
        embedding_generated_at = datetime('now'),
        updated_at = datetime('now')
    WHERE id = ?
  `).run(modelName, id);

  return result.changes > 0;
}

/**
 * If retry_count < 3: set embedding_status='retry', increment retry_count.
 * If retry_count >= 3: set embedding_status='failed'.
 * Store reason in failure_reason.
 * Returns true if row was updated.
 */
export function markFailed(id: number, reason: string): boolean {
  assertDb();

  const result = db!.prepare(`
    UPDATE memory_index
    SET embedding_status = CASE
          WHEN retry_count + 1 >= ? THEN 'failed'
          ELSE 'retry'
        END,
        retry_count = retry_count + 1,
        failure_reason = ?,
        last_retry_at = datetime('now'),
        updated_at = datetime('now')
    WHERE id = ?
  `).run(RETRY_THRESHOLD, reason, id);

  return result.changes > 0;
}

/**
 * Returns [] when nothing needs refresh (stub for now).
 */
export function ensureIndexFresh(): UnindexedDocument[] {
  assertDb();

  if (!needsRefresh()) {
    return [];
  }

  // Future: trigger re-indexing workflow
  return getUnindexedDocuments();
}

/* -------------------------------------------------------------
   6. INTERNAL HELPERS
----------------------------------------------------------------*/

function assertDb(): void {
  if (!db) {
    throw new Error('index-refresh: not initialized — call init(db) first');
  }
}
