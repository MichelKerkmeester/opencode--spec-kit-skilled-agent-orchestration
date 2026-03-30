// ───────────────────────────────────────────────────────────────
// MODULE: Db Helpers
// ───────────────────────────────────────────────────────────────
import type Database from 'better-sqlite3';

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Reconsolidation-on-save

export {
  ALLOWED_POST_INSERT_COLUMNS,
  applyPostInsertMetadata,
} from '../../lib/storage/post-insert-metadata.js';

/**
 * TM-06 safety gate: verify a pre-reconsolidation checkpoint exists.
 * Accepts either exact name `pre-reconsolidation` or prefixed variants.
 */
export function hasReconsolidationCheckpoint(database: Database.Database, specFolder: string): boolean {
  try {
    const tableExists = database.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='checkpoints'"
    ).get();

    if (!tableExists) {
      return false;
    }

    const row = database.prepare(`
      SELECT COUNT(*) AS count
      FROM checkpoints
      WHERE (name = 'pre-reconsolidation' OR name LIKE 'pre-reconsolidation-%')
        AND (spec_folder = ? OR spec_folder IS NULL OR spec_folder = '')
    `).get(specFolder) as { count?: number } | undefined;

    return (row?.count ?? 0) > 0;
  } catch (error: unknown) {
    console.warn('[db-helpers] hasReconsolidationCheckpoint lookup failed:', error instanceof Error ? error.message : String(error));
    return false;
  }
}
