import { clearDegreeCacheForDb } from '../search/graph-search-fn.js';
import { clearGraphSignalsCache } from '../graph/graph-signals.js';
import { detectContradictions } from '../graph/contradiction-detection.js';
import { ensureTemporalColumns } from '../graph/temporal-edges.js';
import { isTemporalEdgesEnabled } from '../search/search-flags.js';
import { runInTransaction } from './transaction-manager.js';
/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
----------------------------------------------------------------*/
const RELATION_TYPES = Object.freeze({
    CAUSED: 'caused',
    ENABLED: 'enabled',
    SUPERSEDES: 'supersedes',
    CONTRADICTS: 'contradicts',
    DERIVED_FROM: 'derived_from',
    SUPPORTS: 'supports',
});
/**
 * C138: Relation weight multipliers applied during traversal scoring.
 * Higher values amplify the propagated strength; values < 1.0 dampen it.
 */
const RELATION_WEIGHTS = {
    supersedes: 1.5, // Strongest signal — new info replaces old
    caused: 1.3, // Strong causal link
    enabled: 1.1, // Weak causal link
    supports: 1.0, // Neutral / default
    derived_from: 1.0, // Neutral / default
    contradicts: 0.8, // Dampened — conflicting signals lower confidence
};
const DEFAULT_MAX_DEPTH = 3;
const MAX_EDGES_LIMIT = 100;
// Edge bounds for the lightweight runtime path (NFR-R01, SC-005)
const MAX_EDGES_PER_NODE = 20;
const MAX_AUTO_STRENGTH = 0.5;
const MAX_STRENGTH_INCREASE_PER_CYCLE = 0.05;
const STALENESS_THRESHOLD_DAYS = 90;
const DECAY_STRENGTH_AMOUNT = 0.1;
const DECAY_PERIOD_DAYS = 30;
function isFiniteNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}
function clampStrength(strength) {
    if (!Number.isFinite(strength))
        return null;
    return Math.max(0, Math.min(1, strength));
}
/* ───────────────────────────────────────────────────────────────
   3. MODULE STATE
----------------------------------------------------------------*/
let db = null;
function invalidateDegreeCache() {
    try {
        // H1 FIX: Use db-specific cache invalidation instead of the no-op global version
        if (db) {
            clearDegreeCacheForDb(db);
        }
    }
    catch (_error) {
        // Cache invalidation is best-effort; never block edge mutations
    }
    try {
        clearGraphSignalsCache();
    }
    catch (_error) {
        // Graph signals cache invalidation is best-effort
    }
}
/* ───────────────────────────────────────────────────────────────
   4. INITIALIZATION
----------------------------------------------------------------*/
function init(database) {
    db = database;
    // Defensive traversal indexes — the canonical creation lives in
    // Vector-index-impl.ts migration v8 (CHK-062).  These IF NOT EXISTS guards
    // Ensure the indexes are present even when the module is initialised outside
    // The normal migration path (e.g. tests, standalone scripts).
    try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_causal_source ON causal_edges(source_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_causal_target ON causal_edges(target_id)');
        ensureTemporalColumns(database);
    }
    catch (_e) {
        // Best-effort: table may not exist yet during early startup sequencing
    }
}
/* ───────────────────────────────────────────────────────────────
   5. EDGE OPERATIONS
----------------------------------------------------------------*/
function insertEdge(sourceId, targetId, relation, strength = 1.0, evidence = null, shouldInvalidateCache = true, createdBy = 'manual') {
    if (!db) {
        console.warn('[causal-edges] Database not initialized. Server may still be starting up.');
        return null;
    }
    const database = db;
    // NFR-R01: Auto edges capped at MAX_AUTO_STRENGTH
    const effectiveStrength = createdBy === 'auto'
        ? Math.min(strength, MAX_AUTO_STRENGTH)
        : strength;
    // Prevent self-loops
    if (sourceId === targetId) {
        return null;
    }
    // Fix #26 (FK check) deferred — test environments use synthetic IDs not in memory_index.
    // Implementing FK validation would require seeding memory_index in 20+ causal edge tests.
    // NFR-R01: Edge bounds — reject if node already has MAX_EDGES_PER_NODE auto edges
    if (createdBy === 'auto') {
        const edgeCount = countEdgesForNode(sourceId);
        if (edgeCount >= MAX_EDGES_PER_NODE) {
            console.warn(`[causal-edges] Edge bounds: node ${sourceId} has ${edgeCount} edges (max ${MAX_EDGES_PER_NODE}), rejecting auto edge`);
            return null;
        }
    }
    try {
        const clampedStrength = clampStrength(effectiveStrength);
        if (clampedStrength === null) {
            console.warn('[causal-edges] insertEdge rejected non-finite strength');
            return null;
        }
        // Wrap SELECT + UPSERT + logWeightChange in a transaction for atomicity
        const rowId = database.transaction(() => {
            if (isTemporalEdgesEnabled()) {
                detectContradictions(database, Number.parseInt(sourceId, 10), Number.parseInt(targetId, 10), relation);
            }
            // Check if edge exists (for weight_history logging on conflict update).
            // This SELECT is intentional: we need the old strength to decide whether
            // To write a weight_history row after the upsert. The subsequent INSERT
            // Uses last_insert_rowid() to avoid a second post-upsert SELECT.
            const existing = database.prepare(`
        SELECT id, strength FROM causal_edges
        WHERE source_id = ? AND target_id = ? AND relation = ?
      `).get(sourceId, targetId, relation);
            database.prepare(`
        INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence, created_by)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(source_id, target_id, relation) DO UPDATE SET
          strength = excluded.strength,
          evidence = COALESCE(excluded.evidence, causal_edges.evidence)
      `).run(sourceId, targetId, relation, clampedStrength, evidence, createdBy);
            const row = database.prepare(`
        SELECT id FROM causal_edges WHERE source_id = ? AND target_id = ? AND relation = ?
      `).get(sourceId, targetId, relation);
            const rowId = row ? row.id : 0;
            // T001d: Log weight change on conflict update
            if (existing && rowId && isFiniteNumber(existing.strength) && existing.strength !== clampedStrength) {
                logWeightChange(rowId, existing.strength, clampedStrength, createdBy, 'insert-upsert');
            }
            return rowId;
        })();
        if (shouldInvalidateCache) {
            invalidateDegreeCache();
        }
        return rowId || null;
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[causal-edges] insertEdge error: ${msg}`);
        if (/SQLITE_BUSY|SQLITE_LOCKED|database is locked/i.test(msg)) {
            throw error;
        }
        return null;
    }
}
function insertEdgesBatch(edges) {
    if (!db)
        return { inserted: 0, failed: edges.length };
    let inserted = 0;
    let failed = 0;
    const insertTx = db.transaction(() => {
        for (const edge of edges) {
            const id = insertEdge(edge.sourceId, edge.targetId, edge.relation, edge.strength ?? 1.0, edge.evidence ?? null, false, edge.createdBy ?? 'manual');
            if (id !== null)
                inserted++;
            else
                failed++;
        }
    });
    try {
        insertTx();
        if (inserted > 0) {
            invalidateDegreeCache();
        }
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[causal-edges] insertEdgesBatch error: ${msg}`);
    }
    return { inserted, failed };
}
function bulkInsertEdges(edges) {
    if (!db)
        return { inserted: 0, failed: edges.length };
    const database = db;
    let inserted = 0;
    let failed = 0;
    try {
        const edgeColumns = database.prepare('PRAGMA table_info(causal_edges)').all()
            .map((column) => column.name)
            .filter((name) => typeof name === 'string' && name.length > 0 && name !== 'id');
        if (edgeColumns.length === 0) {
            return { inserted: 0, failed: edges.length };
        }
        const insertEdgeStmt = database.prepare(`
      INSERT OR IGNORE INTO causal_edges (${edgeColumns.join(', ')})
      VALUES (${edgeColumns.map(() => '?').join(', ')})
    `);
        const insertTx = database.transaction(() => {
            for (const edge of edges) {
                if (!edge || typeof edge.source_id !== 'string' || typeof edge.target_id !== 'string') {
                    failed++;
                    continue;
                }
                if (typeof edge.relation !== 'string' || edge.relation.trim().length === 0) {
                    failed++;
                    continue;
                }
                if (edge.source_id === edge.target_id) {
                    failed++;
                    continue;
                }
                const result = insertEdgeStmt.run(...edgeColumns.map((column) => edge[column] ?? null));
                if (result.changes > 0) {
                    inserted++;
                }
            }
        });
        insertTx();
        if (inserted > 0) {
            invalidateDegreeCache();
        }
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[causal-edges] bulkInsertEdges error: ${msg}`);
    }
    return { inserted, failed };
}
function createEdgeQueryResult(edges, limit, truncated) {
    const result = edges;
    result.truncated = truncated;
    result.limit = limit;
    return result;
}
function getEdgesFrom(sourceId, limit = MAX_EDGES_LIMIT) {
    if (!db)
        return createEdgeQueryResult([], limit, false);
    try {
        const rows = db.prepare(`
      SELECT * FROM causal_edges
      WHERE source_id = ?
      ORDER BY strength DESC
      LIMIT ?
    `).all(sourceId, limit + 1);
        const truncated = rows.length > limit;
        const edges = truncated ? rows.slice(0, limit) : rows;
        for (const edge of edges) {
            try {
                touchEdgeAccess(edge.id);
            }
            catch (e) {
                console.warn(`[causal-edges] touchEdgeAccess failed for edge ${edge.id}: ${e instanceof Error ? e.message : String(e)}`);
            }
        }
        return createEdgeQueryResult(edges, limit, truncated);
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[causal-edges] getEdgesFrom error: ${msg}`);
        return createEdgeQueryResult([], limit, false);
    }
}
function getEdgesTo(targetId, limit = MAX_EDGES_LIMIT) {
    if (!db)
        return createEdgeQueryResult([], limit, false);
    try {
        const rows = db.prepare(`
      SELECT * FROM causal_edges
      WHERE target_id = ?
      ORDER BY strength DESC
      LIMIT ?
    `).all(targetId, limit + 1);
        const truncated = rows.length > limit;
        const edges = truncated ? rows.slice(0, limit) : rows;
        for (const edge of edges) {
            try {
                touchEdgeAccess(edge.id);
            }
            catch (e) {
                console.warn(`[causal-edges] touchEdgeAccess failed for edge ${edge.id}: ${e instanceof Error ? e.message : String(e)}`);
            }
        }
        return createEdgeQueryResult(edges, limit, truncated);
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[causal-edges] getEdgesTo error: ${msg}`);
        return createEdgeQueryResult([], limit, false);
    }
}
function getAllEdges(limit = MAX_EDGES_LIMIT) {
    if (!db)
        return createEdgeQueryResult([], limit, false);
    try {
        const rows = db.prepare(`
      SELECT * FROM causal_edges
      ORDER BY extracted_at DESC
      LIMIT ?
    `).all(limit + 1);
        const truncated = rows.length > limit;
        const edges = truncated ? rows.slice(0, limit) : rows;
        return createEdgeQueryResult(edges, limit, truncated);
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[causal-edges] getAllEdges error: ${msg}`);
        return createEdgeQueryResult([], limit, false);
    }
}
/* ───────────────────────────────────────────────────────────────
   6. GRAPH TRAVERSAL
----------------------------------------------------------------*/
function getCausalChain(rootId, maxDepth = DEFAULT_MAX_DEPTH, direction = 'forward', edgeLimit = MAX_EDGES_LIMIT) {
    const root = {
        id: rootId,
        depth: 0,
        relation: RELATION_TYPES.CAUSED,
        strength: 1.0,
        children: [],
        truncated: false,
        truncationLimit: null,
    };
    if (!db)
        return root;
    function traverse(node, depth, path) {
        if (depth >= maxDepth)
            return;
        const edges = direction === 'forward'
            ? getEdgesFrom(node.id, edgeLimit)
            : getEdgesTo(node.id, edgeLimit);
        if (edges.truncated) {
            root.truncated = true;
            root.truncationLimit = edgeLimit;
        }
        for (const edge of edges) {
            const nextId = direction === 'forward' ? edge.target_id : edge.source_id;
            if (path.has(nextId))
                continue;
            // C138: apply cumulative path strength with relation weight multiplier,
            // then clamp back to [0, 1].
            const weight = RELATION_WEIGHTS[edge.relation] ?? 1.0;
            const weightedStrength = clampStrength(node.strength * edge.strength * weight) ?? 0;
            const child = {
                id: nextId,
                edgeId: edge.id, // T202: preserve edge ID for unlink workflow
                depth: depth + 1,
                relation: edge.relation,
                strength: weightedStrength,
                children: [],
            };
            node.children.push(child);
            const nextPath = new Set(path);
            nextPath.add(nextId);
            traverse(child, depth + 1, nextPath);
        }
    }
    traverse(root, 0, new Set([rootId]));
    return root;
}
/* ───────────────────────────────────────────────────────────────
   7. EDGE MANAGEMENT
----------------------------------------------------------------*/
function updateEdge(edgeId, updates, changedBy = 'manual', reason = null) {
    if (!db)
        return false;
    const database = db;
    try {
        const parts = [];
        const params = [];
        let nextStrength;
        if (updates.strength !== undefined) {
            const clampedStrength = clampStrength(updates.strength);
            if (clampedStrength === null) {
                console.warn('[causal-edges] updateEdge rejected non-finite strength');
                return false;
            }
            nextStrength = clampedStrength;
            parts.push('strength = ?');
            params.push(clampedStrength);
        }
        if (updates.evidence !== undefined) {
            parts.push('evidence = ?');
            params.push(updates.evidence);
        }
        if (parts.length === 0)
            return false;
        params.push(edgeId);
        // Wrap SELECT + UPDATE + logWeightChange in a transaction for atomicity
        const changed = database.transaction(() => {
            // T001d: Capture old strength for weight_history logging
            let oldStrength;
            if (updates.strength !== undefined) {
                const existing = database.prepare('SELECT strength FROM causal_edges WHERE id = ?').get(edgeId);
                oldStrength = existing?.strength;
            }
            // String interpolation constructs IN(?,?,?) placeholder list only —
            // All user values are parameterized. Accepted exception per audit H-08.
            const result = database.prepare(`UPDATE causal_edges SET ${parts.join(', ')} WHERE id = ?`).run(...params);
            const changed = result.changes > 0;
            // T001d: Log weight change to weight_history
            if (changed && nextStrength !== undefined && isFiniteNumber(oldStrength)) {
                if (oldStrength !== nextStrength) {
                    logWeightChange(edgeId, oldStrength, nextStrength, changedBy, reason);
                }
            }
            return changed;
        })();
        if (changed) {
            invalidateDegreeCache();
        }
        return changed;
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[causal-edges] updateEdge error: ${msg}`);
        return false;
    }
}
function deleteEdge(edgeId) {
    if (!db)
        return false;
    try {
        const result = db.prepare('DELETE FROM causal_edges WHERE id = ?').run(edgeId);
        if (result.changes > 0) {
            invalidateDegreeCache();
        }
        return result.changes > 0;
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[causal-edges] deleteEdge error: ${msg}`);
        return false;
    }
}
// Let errors propagate so callers inside transactions see failures.
// Previously errors were caught and swallowed, which hid edge-cleanup failures
// From transactional callers (e.g., memory-bulk-delete, memory-crud-delete).
function deleteEdgesForMemory(memoryId) {
    if (!db)
        return 0;
    const result = db.prepare(`
    DELETE FROM causal_edges
    WHERE source_id = ? OR target_id = ?
  `).run(memoryId, memoryId);
    if (result.changes > 0) {
        invalidateDegreeCache();
    }
    return result.changes;
}
/* ───────────────────────────────────────────────────────────────
   8. STATS & QUERIES
----------------------------------------------------------------*/
function getGraphStats() {
    if (!db) {
        return { totalEdges: 0, byRelation: {}, avgStrength: 0, uniqueSources: 0, uniqueTargets: 0 };
    }
    try {
        const total = db.prepare('SELECT COUNT(*) as count FROM causal_edges').get();
        const byRelation = db.prepare('SELECT relation, COUNT(*) as count FROM causal_edges GROUP BY relation').all();
        const avgStrength = db.prepare('SELECT AVG(strength) as avg FROM causal_edges').get();
        const sources = db.prepare('SELECT COUNT(DISTINCT source_id) as count FROM causal_edges').get();
        const targets = db.prepare('SELECT COUNT(DISTINCT target_id) as count FROM causal_edges').get();
        const relationMap = {};
        for (const row of byRelation) {
            relationMap[row.relation] = row.count;
        }
        return {
            totalEdges: total.count,
            byRelation: relationMap,
            avgStrength: Math.round((avgStrength.avg || 0) * 100) / 100,
            uniqueSources: sources.count,
            uniqueTargets: targets.count,
        };
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[causal-edges] getGraphStats error: ${msg}`);
        return { totalEdges: 0, byRelation: {}, avgStrength: 0, uniqueSources: 0, uniqueTargets: 0 };
    }
}
function findOrphanedEdges() {
    if (!db)
        return [];
    try {
        return db.prepare(`
      SELECT ce.* FROM causal_edges ce
      WHERE NOT EXISTS (SELECT 1 FROM memory_index m WHERE CAST(m.id AS TEXT) = ce.source_id)
        OR NOT EXISTS (SELECT 1 FROM memory_index m WHERE CAST(m.id AS TEXT) = ce.target_id)
    `).all();
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[causal-edges] findOrphanedEdges error: ${msg}`);
        return [];
    }
}
// Automated orphan edge cleanup
function cleanupOrphanedEdges() {
    if (!db)
        return { deleted: 0 };
    try {
        const orphaned = findOrphanedEdges();
        const deleted = runInTransaction(db, () => {
            let count = 0;
            for (const edge of orphaned) {
                if (deleteEdge(edge.id))
                    count++;
            }
            return count;
        });
        return { deleted };
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[causal-edges] cleanupOrphanedEdges error: ${msg}`);
        return { deleted: 0 };
    }
}
/* ───────────────────────────────────────────────────────────────
   9. SPEC DOCUMENT CHAINS (Spec 126)
----------------------------------------------------------------*/
/**
 * Create causal relationship chain between spec folder documents.
 * Links: spec -> plan (CAUSED), plan -> tasks (CAUSED), tasks -> impl-summary (CAUSED)
 * Also: checklist SUPPORTS spec, decision-record SUPPORTS plan, research SUPPORTS spec
 *
 * @param documentIds Map of document_type -> memory_index.id for documents in the same spec folder
 */
function createSpecDocumentChain(documentIds) {
    if (!db)
        return { inserted: 0, failed: 0 };
    const edges = [];
    const ids = documentIds;
    // Primary chain: spec -> plan -> tasks -> implementation_summary
    if (ids.spec && ids.plan) {
        edges.push({ sourceId: String(ids.spec), targetId: String(ids.plan), relation: RELATION_TYPES.CAUSED, strength: 0.9, evidence: 'Spec 126: spec -> plan chain' });
    }
    if (ids.plan && ids.tasks) {
        edges.push({ sourceId: String(ids.plan), targetId: String(ids.tasks), relation: RELATION_TYPES.CAUSED, strength: 0.9, evidence: 'Spec 126: plan -> tasks chain' });
    }
    if (ids.tasks && ids.implementation_summary) {
        edges.push({ sourceId: String(ids.tasks), targetId: String(ids.implementation_summary), relation: RELATION_TYPES.CAUSED, strength: 0.8, evidence: 'Spec 126: tasks -> impl-summary chain' });
    }
    // Support relationships
    if (ids.checklist && ids.spec) {
        edges.push({ sourceId: String(ids.checklist), targetId: String(ids.spec), relation: RELATION_TYPES.SUPPORTS, strength: 0.7, evidence: 'Spec 126: checklist supports spec' });
    }
    if (ids.decision_record && ids.plan) {
        edges.push({ sourceId: String(ids.decision_record), targetId: String(ids.plan), relation: RELATION_TYPES.SUPPORTS, strength: 0.8, evidence: 'Spec 126: decision-record supports plan' });
    }
    if (ids.research && ids.spec) {
        edges.push({ sourceId: String(ids.research), targetId: String(ids.spec), relation: RELATION_TYPES.SUPPORTS, strength: 0.7, evidence: 'Spec 126: research supports spec' });
    }
    if (edges.length === 0)
        return { inserted: 0, failed: 0 };
    return insertEdgesBatch(edges);
}
/* ───────────────────────────────────────────────────────────────
   10. WEIGHT HISTORY & AUDIT (T001d)
----------------------------------------------------------------*/
function logWeightChange(edgeId, oldStrength, newStrength, changedBy = 'manual', reason = null) {
    if (!db)
        return;
    db.prepare(`
    INSERT INTO weight_history (edge_id, old_strength, new_strength, changed_by, reason)
    VALUES (?, ?, ?, ?, ?)
  `).run(edgeId, oldStrength, newStrength, changedBy, reason);
}
function getWeightHistory(edgeId, limit = 50) {
    if (!db)
        return [];
    try {
        return db.prepare(`
      SELECT * FROM weight_history
      WHERE edge_id = ?
      ORDER BY changed_at DESC, id DESC
      LIMIT ?
    `).all(edgeId, limit);
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[causal-edges] getWeightHistory error: ${msg}`);
        return [];
    }
}
function rollbackWeights(edgeId, toTimestamp) {
    if (!db)
        return false;
    const database = db;
    try {
        // Wrap SELECTs + UPDATE + logWeightChange in a transaction for atomicity
        const changed = database.transaction(() => {
            // Get current strength before rollback
            const current = database.prepare('SELECT strength FROM causal_edges WHERE id = ?').get(edgeId);
            if (!current)
                return null;
            // Prefer the latest exact-timestamp row to make same-second
            // History entries deterministic when callers pass a value from getWeightHistory().
            let entry = database.prepare(`
        SELECT old_strength FROM weight_history
        WHERE edge_id = ? AND changed_at = ?
        ORDER BY id DESC LIMIT 1
      `).get(edgeId, toTimestamp);
            // Find the earliest history entry strictly after the target timestamp.
            // This preserves legacy "rollback to before next change" semantics for
            // Timestamps that do not exactly match a stored history row.
            if (!entry) {
                entry = database.prepare(`
        SELECT old_strength FROM weight_history
        WHERE edge_id = ? AND changed_at > ?
        ORDER BY changed_at ASC, id ASC LIMIT 1
      `).get(edgeId, toTimestamp);
            }
            if (!entry) {
                // Fall back: get the oldest entry's old_strength (pre-change baseline)
                entry = database.prepare(`
          SELECT old_strength FROM weight_history
          WHERE edge_id = ?
          ORDER BY changed_at ASC, id ASC LIMIT 1
        `).get(edgeId);
            }
            if (!entry)
                return null;
            // Restore the edge to the old_strength value
            const result = database.prepare('UPDATE causal_edges SET strength = ? WHERE id = ?').run(entry.old_strength, edgeId);
            // Log the rollback
            if (isFiniteNumber(current.strength) && current.strength !== entry.old_strength) {
                logWeightChange(edgeId, current.strength, entry.old_strength, 'rollback', `rollback to ${toTimestamp}`);
            }
            return result.changes > 0;
        })();
        if (changed === null)
            return false;
        invalidateDegreeCache();
        return changed;
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[causal-edges] rollbackWeights error: ${msg}`);
        return false;
    }
}
/* ───────────────────────────────────────────────────────────────
   11. EDGE BOUNDS & COUNTING (N3-lite NFR-R01)
----------------------------------------------------------------*/
function countEdgesForNode(nodeId) {
    if (!db)
        return 0;
    try {
        const row = db.prepare(`
      SELECT COUNT(*) as count FROM causal_edges
      WHERE source_id = ? OR target_id = ?
    `).get(nodeId, nodeId);
        return row.count;
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[causal-edges] countEdgesForNode error: ${msg}`);
        return 0;
    }
}
function touchEdgeAccess(edgeId) {
    if (!db)
        return;
    db.prepare("UPDATE causal_edges SET last_accessed = datetime('now') WHERE id = ?").run(edgeId);
}
function getStaleEdges(thresholdDays = STALENESS_THRESHOLD_DAYS) {
    if (!db)
        return [];
    try {
        return db.prepare(`
      SELECT * FROM causal_edges
      WHERE (last_accessed IS NULL AND extracted_at < datetime('now', '-' || ? || ' days'))
         OR (last_accessed IS NOT NULL AND last_accessed < datetime('now', '-' || ? || ' days'))
      ORDER BY COALESCE(last_accessed, extracted_at) ASC
    `).all(thresholdDays, thresholdDays);
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[causal-edges] getStaleEdges error: ${msg}`);
        return [];
    }
}
/* ───────────────────────────────────────────────────────────────
   12. EXPORTS
----------------------------------------------------------------*/
export { RELATION_TYPES, RELATION_WEIGHTS, DEFAULT_MAX_DEPTH, MAX_EDGES_LIMIT, MAX_EDGES_PER_NODE, MAX_AUTO_STRENGTH, MAX_STRENGTH_INCREASE_PER_CYCLE, STALENESS_THRESHOLD_DAYS, DECAY_STRENGTH_AMOUNT, DECAY_PERIOD_DAYS, init, insertEdge, insertEdgesBatch, bulkInsertEdges, getEdgesFrom, getEdgesTo, getAllEdges, getCausalChain, updateEdge, deleteEdge, deleteEdgesForMemory, getGraphStats, findOrphanedEdges, cleanupOrphanedEdges, createSpecDocumentChain, 
// T001d: Weight history & audit
logWeightChange, getWeightHistory, rollbackWeights, 
// N3-lite: Edge bounds & counting
countEdgesForNode, touchEdgeAccess, getStaleEdges, };
//# sourceMappingURL=causal-edges.js.map