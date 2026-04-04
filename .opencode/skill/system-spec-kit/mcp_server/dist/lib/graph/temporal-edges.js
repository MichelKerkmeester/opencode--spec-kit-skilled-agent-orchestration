import { isTemporalEdgesEnabled } from '../search/search-flags.js';
// ───────────────────────────────────────────────────────────────
// 2. SCHEMA MIGRATION
// ───────────────────────────────────────────────────────────────
/**
 * Add valid_at and invalid_at columns to causal_edges if not present.
 * Uses ALTER TABLE with try/catch for idempotency — re-running is safe.
 */
export function ensureTemporalColumns(db) {
    if (!isTemporalEdgesEnabled()) {
        return;
    }
    try {
        db.exec(`ALTER TABLE causal_edges ADD COLUMN valid_at TEXT DEFAULT NULL`);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (!/duplicate column name/i.test(message)) {
            console.warn(`[temporal-edges] ensureTemporalColumns(valid_at) failed (fail-open): ${message}`);
        }
    }
    try {
        db.exec(`ALTER TABLE causal_edges ADD COLUMN invalid_at TEXT DEFAULT NULL`);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (!/duplicate column name/i.test(message)) {
            console.warn(`[temporal-edges] ensureTemporalColumns(invalid_at) failed (fail-open): ${message}`);
        }
    }
}
// ───────────────────────────────────────────────────────────────
// 3. EDGE INVALIDATION
// ───────────────────────────────────────────────────────────────
/**
 * Mark an edge as invalidated (set invalid_at to current ISO timestamp).
 * Optionally records the reason in the evidence column.
 * No-op if the edge does not exist or is already invalidated.
 */
export function invalidateEdge(db, sourceId, targetId, reason = 'Edge invalidated', relation) {
    if (!isTemporalEdgesEnabled()) {
        return;
    }
    try {
        ensureTemporalColumns(db);
        const now = new Date().toISOString();
        if (relation) {
            db.prepare(`
        UPDATE causal_edges
        SET invalid_at = ?, evidence = COALESCE(evidence || ' | ', '') || ?
        WHERE source_id = ? AND target_id = ? AND relation = ? AND invalid_at IS NULL
      `).run(now, reason, String(sourceId), String(targetId), relation);
            return;
        }
        db.prepare(`
      UPDATE causal_edges
      SET invalid_at = ?, evidence = COALESCE(evidence || ' | ', '') || ?
      WHERE source_id = ? AND target_id = ? AND invalid_at IS NULL
    `).run(now, reason, String(sourceId), String(targetId));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[temporal-edges] invalidateEdge failed (fail-open): ${message}`);
    }
}
// ───────────────────────────────────────────────────────────────
// 4. VALID EDGE RETRIEVAL
// ───────────────────────────────────────────────────────────────
/**
 * Get only currently valid edges for a node (invalid_at IS NULL).
 * Returns edges where the node appears as either source or target.
 */
export function getValidEdges(db, nodeId) {
    if (!isTemporalEdgesEnabled()) {
        return [];
    }
    try {
        ensureTemporalColumns(db);
        const rows = db.prepare(`
      SELECT source_id, target_id, relation, COALESCE(strength, 1.0) AS strength,
             valid_at, invalid_at
      FROM causal_edges
      WHERE (source_id = ? OR target_id = ?) AND invalid_at IS NULL
    `).all(String(nodeId), String(nodeId));
        return rows.map((row) => ({
            sourceId: Number.parseInt(row.source_id, 10),
            targetId: Number.parseInt(row.target_id, 10),
            relation: row.relation,
            strength: row.strength,
            validAt: row.valid_at,
            invalidAt: row.invalid_at,
        }));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[temporal-edges] getValidEdges failed (fail-open): ${message}`);
        return [];
    }
}
//# sourceMappingURL=temporal-edges.js.map