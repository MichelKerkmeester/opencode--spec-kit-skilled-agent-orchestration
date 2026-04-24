// ───────────────────────────────────────────────────────────────
// MODULE: Post Insert Metadata
// ───────────────────────────────────────────────────────────────
// Shared post-insert metadata updates extracted from handlers/save
// so storage-layer writers do not depend on handler modules.

import type Database from 'better-sqlite3';
import { recordGovernanceAudit } from '../governance/scope-governance.js';
import { isConstitutionalPath } from '../utils/index-scope.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

/**
 * Field map accepted by the post-insert metadata update helper.
 * Keys align to the guarded `memory_index` columns below.
 */
export interface PostInsertMetadataFields {
  content_hash?: string;
  context_type?: string;
  importance_tier?: string;
  memory_type?: string;
  type_inference_source?: string;
  stability?: number;
  difficulty?: number;
  review_count?: number;
  file_mtime_ms?: number | null;
  embedding_status?: string;
  encoding_intent?: string | null;
  document_type?: string;
  spec_level?: number | null;
  quality_score?: number;
  quality_flags?: string;
  parent_id?: number;
  chunk_index?: number;
  chunk_label?: string;
  tenant_id?: string;
  user_id?: string;
  agent_id?: string;
  session_id?: string;
  provenance_source?: string;
  provenance_actor?: string;
  governed_at?: string;
  retention_policy?: string;
  delete_after?: string | null;
  governance_metadata?: string;
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

/** Allowed column names for the dynamic UPDATE builder (injection guard). */
export const ALLOWED_POST_INSERT_COLUMNS = new Set<string>([
  'content_hash', 'context_type', 'importance_tier', 'memory_type',
  'type_inference_source', 'stability', 'difficulty', 'review_count',
  'file_mtime_ms', 'embedding_status', 'encoding_intent', 'document_type',
  'spec_level', 'quality_score', 'quality_flags', 'parent_id',
  'chunk_index', 'chunk_label', 'tenant_id', 'user_id', 'agent_id',
  'session_id',
  'provenance_source', 'provenance_actor',
  'governed_at', 'retention_policy', 'delete_after', 'governance_metadata',
]);

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

/**
 * Build and execute a dynamic `UPDATE memory_index SET ... WHERE id = ?`
 * from the supplied field map.
 *
 * Special handling:
 * - `encoding_intent` uses `COALESCE(?, encoding_intent)`
 * - `last_review` is always refreshed to `datetime('now')`
 *
 * @param db - Database connection that stores memory rows.
 * @param memoryId - Inserted memory identifier to enrich.
 * @param fields - Column/value map for the metadata update.
 */
export function applyPostInsertMetadata(
  db: Database.Database,
  memoryId: number,
  fields: PostInsertMetadataFields,
): void {
  const normalizedFields: PostInsertMetadataFields = { ...fields };
  if (normalizedFields.importance_tier === 'constitutional') {
    const row = db.prepare(`
      SELECT spec_folder, anchor_id, file_path, canonical_file_path
      FROM memory_index
      WHERE id = ?
    `).get(memoryId) as {
      spec_folder: string | null;
      anchor_id: string | null;
      file_path: string | null;
      canonical_file_path: string | null;
    } | undefined;

    const guardPath = row?.canonical_file_path || row?.file_path || null;
    if (guardPath && !isConstitutionalPath(guardPath)) {
      normalizedFields.importance_tier = 'important';
      try {
        const normalizedAnchor = row?.anchor_id && row.anchor_id.trim().length > 0 ? row.anchor_id : '_';
        recordGovernanceAudit(db, {
          action: 'tier_downgrade_non_constitutional_path',
          decision: 'conflict',
          memoryId,
          logicalKey: row?.spec_folder && guardPath
            ? `${row.spec_folder}::${guardPath}::${normalizedAnchor}`
            : null,
          reason: 'non_constitutional_path',
          metadata: {
            source: 'applyPostInsertMetadata',
            requestedTier: 'constitutional',
            appliedTier: 'important',
            filePath: row?.file_path ?? null,
            canonicalFilePath: row?.canonical_file_path ?? null,
          },
        });
      } catch (error: unknown) {
        console.warn(
          '[post-insert-metadata] governance_audit insert failed for tier downgrade:',
          error instanceof Error ? error.message : String(error),
        );
      }
    }
  }

  const setClauses: string[] = [];
  const values: unknown[] = [];

  for (const [col, val] of Object.entries(normalizedFields)) {
    if (val === undefined) continue;
    if (!ALLOWED_POST_INSERT_COLUMNS.has(col)) continue;

    if (col === 'encoding_intent') {
      setClauses.push('encoding_intent = COALESCE(?, encoding_intent)');
    } else {
      setClauses.push(`${col} = ?`);
    }
    values.push(val);
  }

  setClauses.push("last_review = datetime('now')");

  values.push(memoryId);

  db.prepare(`
    UPDATE memory_index
    SET ${setClauses.join(',\n        ')}
    WHERE id = ?
  `).run(...values);
}
