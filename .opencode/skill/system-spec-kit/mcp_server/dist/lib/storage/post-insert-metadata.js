// ───────────────────────────────────────────────────────────────
// MODULE: Post Insert Metadata
// ───────────────────────────────────────────────────────────────
// Shared post-insert metadata updates extracted from handlers/save
// so storage-layer writers do not depend on handler modules.
// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────
/** Allowed column names for the dynamic UPDATE builder (injection guard). */
export const ALLOWED_POST_INSERT_COLUMNS = new Set([
    'content_hash', 'context_type', 'importance_tier', 'memory_type',
    'type_inference_source', 'stability', 'difficulty', 'review_count',
    'file_mtime_ms', 'embedding_status', 'encoding_intent', 'document_type',
    'spec_level', 'quality_score', 'quality_flags', 'parent_id',
    'chunk_index', 'chunk_label', 'tenant_id', 'user_id', 'agent_id',
    'session_id',
    'shared_space_id', 'provenance_source', 'provenance_actor',
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
export function applyPostInsertMetadata(db, memoryId, fields) {
    const setClauses = [];
    const values = [];
    for (const [col, val] of Object.entries(fields)) {
        if (val === undefined)
            continue;
        if (!ALLOWED_POST_INSERT_COLUMNS.has(col))
            continue;
        if (col === 'encoding_intent') {
            setClauses.push('encoding_intent = COALESCE(?, encoding_intent)');
        }
        else {
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
//# sourceMappingURL=post-insert-metadata.js.map