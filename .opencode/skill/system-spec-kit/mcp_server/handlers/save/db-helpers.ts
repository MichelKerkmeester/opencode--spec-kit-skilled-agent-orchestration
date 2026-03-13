// --- 1. DB HELPERS ---

import type Database from 'better-sqlite3';

import type { PostInsertMetadataFields } from './types';

/** Allowed column names for the dynamic UPDATE builder (injection guard). */
export const ALLOWED_POST_INSERT_COLUMNS = new Set<string>([
  'content_hash', 'context_type', 'importance_tier', 'memory_type',
  'type_inference_source', 'stability', 'difficulty', 'review_count',
  'file_mtime_ms', 'embedding_status', 'encoding_intent', 'document_type',
  'spec_level', 'quality_score', 'quality_flags', 'parent_id',
  'chunk_index', 'chunk_label', 'tenant_id', 'user_id', 'agent_id',
  'shared_space_id', 'provenance_source', 'provenance_actor',
  'governed_at', 'retention_policy', 'delete_after', 'governance_metadata',
]);

/**
 * Build and execute a dynamic `UPDATE memory_index SET ... WHERE id = ?`
 * from the supplied field map.  Reduces the five near-identical post-insert
 * UPDATE blocks to a single helper call.
 *
 * Special handling:
 * - `encoding_intent` → `COALESCE(?, encoding_intent)` (preserves existing value when NULL)
 * - `last_review` is always appended as `datetime('now')`
 * - `review_count` defaults to `0` when not explicitly supplied
 */
export function applyPostInsertMetadata(
  db: Database.Database,
  memoryId: number,
  fields: PostInsertMetadataFields,
): void {
  const setClauses: string[] = [];
  const values: unknown[] = [];

  for (const [col, val] of Object.entries(fields)) {
    if (val === undefined) continue; // skip unset fields
    if (!ALLOWED_POST_INSERT_COLUMNS.has(col)) continue; // injection guard

    if (col === 'encoding_intent') {
      setClauses.push('encoding_intent = COALESCE(?, encoding_intent)');
    } else {
      setClauses.push(`${col} = ?`);
    }
    values.push(val);
  }

  // Always refresh last_review and default review_count to 0 when omitted.
  setClauses.push("last_review = datetime('now')");
  if (!Object.prototype.hasOwnProperty.call(fields, 'review_count')) {
    setClauses.push('review_count = 0');
  }

  values.push(memoryId);

  db.prepare(`
    UPDATE memory_index
    SET ${setClauses.join(',\n        ')}
    WHERE id = ?
  `).run(...values);
}

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
  } catch (_error: unknown) {
    return false;
  }
}
