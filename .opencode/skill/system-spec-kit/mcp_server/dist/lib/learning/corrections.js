import { clearGraphSignalsCache } from '../graph/graph-signals.js';
import { clearDegreeCacheForDb } from '../search/graph-search-fn.js';
/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS & CONFIGURATION
──────────────────────────────────────────────────────────────── */
function areRelationsEnabled() {
    return process.env.SPECKIT_RELATIONS !== 'false';
}
/**
 * Defines the CORRECTION_TYPES constant.
 */
export const CORRECTION_TYPES = Object.freeze({
    SUPERSEDED: 'superseded',
    DEPRECATED: 'deprecated',
    REFINED: 'refined',
    MERGED: 'merged',
});
/**
 * Provides the get_correction_types helper.
 */
export function get_correction_types() {
    return Object.values(CORRECTION_TYPES);
}
/**
 * Defines the CORRECTION_STABILITY_PENALTY constant.
 */
export const CORRECTION_STABILITY_PENALTY = 0.5;
/**
 * Defines the REPLACEMENT_STABILITY_BOOST constant.
 */
export const REPLACEMENT_STABILITY_BOOST = 1.2;
const MAX_CORRECTIONS_HISTORY = 10;
/* ───────────────────────────────────────────────────────────────
   2. DATABASE STATE
──────────────────────────────────────────────────────────────── */
let db = null;
function invalidateGraphCaches(database) {
    try {
        clearDegreeCacheForDb(database);
    }
    catch (_error) {
        // Degree cache invalidation is best-effort for correction edge mutations.
    }
    try {
        clearGraphSignalsCache();
    }
    catch (_error) {
        // Graph signals cache invalidation is best-effort for correction edge mutations.
    }
}
function get_error_message(error) {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'object' && error !== null && 'message' in error) {
        const message = error.message;
        if (typeof message === 'string') {
            return message;
        }
    }
    return String(error);
}
/**
 * Provides the init helper.
 */
export function init(database) {
    if (!database) {
        throw new Error('[corrections] Database reference is required');
    }
    db = database;
    return ensure_schema();
}
/**
 * Provides the get_db helper.
 */
export function get_db() {
    return db;
}
/**
 * Provides the is_enabled helper.
 */
export function is_enabled() {
    return areRelationsEnabled();
}
/* ───────────────────────────────────────────────────────────────
   3. SCHEMA MANAGEMENT
──────────────────────────────────────────────────────────────── */
const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS memory_corrections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Original memory that was corrected
    original_memory_id INTEGER NOT NULL,

    -- Replacement/correction memory (null for deprecated)
    correction_memory_id INTEGER,

    -- Type of correction: superseded, deprecated, refined, merged
    correction_type TEXT NOT NULL CHECK(correction_type IN (
      'superseded', 'deprecated', 'refined', 'merged'
    )),

    -- Stability values at time of correction (for undo)
    original_stability_before REAL,
    original_stability_after REAL,
    correction_stability_before REAL,
    correction_stability_after REAL,

    -- Metadata
    reason TEXT,
    corrected_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    -- Undo tracking (CHK-070)
    is_undone INTEGER DEFAULT 0,
    undone_at TEXT,

    -- Foreign keys
    FOREIGN KEY (original_memory_id) REFERENCES memory_index(id) ON DELETE CASCADE,
    FOREIGN KEY (correction_memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
  );
`;
const INDEX_SQL = [
    'CREATE INDEX IF NOT EXISTS idx_corrections_original ON memory_corrections(original_memory_id);',
    'CREATE INDEX IF NOT EXISTS idx_corrections_correction ON memory_corrections(correction_memory_id);',
    'CREATE INDEX IF NOT EXISTS idx_corrections_type ON memory_corrections(correction_type);',
    'CREATE INDEX IF NOT EXISTS idx_corrections_created ON memory_corrections(created_at DESC);',
    'CREATE INDEX IF NOT EXISTS idx_corrections_active ON memory_corrections(original_memory_id, is_undone) WHERE is_undone = 0;',
];
/**
 * Provides the ensure_schema helper.
 */
export function ensure_schema() {
    if (!db) {
        throw new Error('[corrections] Database not initialized. Call init() first.');
    }
    if (!areRelationsEnabled()) {
        return { success: true, skipped: true, reason: 'SPECKIT_RELATIONS disabled' };
    }
    try {
        // Create table
        db.exec(SCHEMA_SQL);
        // Create indexes
        for (const index_sql of INDEX_SQL) {
            db.exec(index_sql);
        }
        return { success: true };
    }
    catch (error) {
        const error_message = get_error_message(error);
        console.error(`[corrections] Schema creation failed: ${error_message}`);
        return { success: false, error: error_message };
    }
}
/* ───────────────────────────────────────────────────────────────
   4. STABILITY HELPERS
──────────────────────────────────────────────────────────────── */
function get_memory_stability(memory_id) {
    if (!db) {
        return null;
    }
    try {
        const row = db.prepare(`
      SELECT stability FROM memory_index WHERE id = ?
    `).get(memory_id);
        return row ? (row.stability || 1.0) : null;
    }
    catch (error) {
        console.warn(`[corrections] Could not get stability for memory ${memory_id}: ${get_error_message(error)}`);
        return null;
    }
}
function set_memory_stability(memory_id, new_stability) {
    if (!db) {
        return false;
    }
    try {
        // Clamp stability to valid range
        const clamped_stability = Math.max(0.1, Math.min(365, new_stability));
        const result = db.prepare(`
      UPDATE memory_index
      SET stability = ?,
          updated_at = datetime('now')
      WHERE id = ?
    `).run(clamped_stability, memory_id);
        return result.changes > 0;
    }
    catch (error) {
        console.warn(`[corrections] Could not update stability for memory ${memory_id}: ${get_error_message(error)}`);
        return false;
    }
}
function map_correction_type_to_relation(correction_type) {
    switch (correction_type) {
        case CORRECTION_TYPES.SUPERSEDED:
        case CORRECTION_TYPES.DEPRECATED:
            return 'supersedes';
        case CORRECTION_TYPES.REFINED:
        case CORRECTION_TYPES.MERGED:
            return 'derived_from';
        default:
            return 'supersedes';
    }
}
function build_owned_edge_evidence(correction_id, correction_type, reason) {
    return `Correction#${correction_id}: ${correction_type}${reason ? ' - ' + reason : ''}`;
}
function build_legacy_edge_evidence(correction_type, reason) {
    return `Correction: ${correction_type}${reason ? ' - ' + reason : ''}`;
}
/* ───────────────────────────────────────────────────────────────
   5. CORE CORRECTION FUNCTIONS
──────────────────────────────────────────────────────────────── */
/**
 * Provides the record_correction helper.
 */
export function record_correction(params) {
    if (!db) {
        throw new Error('[corrections] Database not initialized. Call init() first.');
    }
    if (!areRelationsEnabled()) {
        return {
            success: false,
            skipped: true,
            reason: 'SPECKIT_RELATIONS disabled (CHK-069)'
        };
    }
    const { original_memory_id, correction_memory_id = null, correction_type, reason = null, corrected_by = null } = params;
    // Validate required fields
    if (!original_memory_id) {
        throw new Error('original_memory_id is required');
    }
    if (!correction_type) {
        throw new Error('correction_type is required');
    }
    // Validate correction type (T054)
    const valid_types = get_correction_types();
    if (!valid_types.includes(correction_type)) {
        throw new Error(`correction_type must be one of: ${valid_types.join(', ')}`);
    }
    // Prevent self-correction
    if (correction_memory_id && original_memory_id === correction_memory_id) {
        throw new Error('original_memory_id and correction_memory_id cannot be the same');
    }
    // Get current stability values
    const original_stability_before = get_memory_stability(original_memory_id);
    if (original_stability_before === null) {
        throw new Error(`Original memory ${original_memory_id} not found`);
    }
    let correction_stability_before = null;
    if (correction_memory_id) {
        correction_stability_before = get_memory_stability(correction_memory_id);
        if (correction_stability_before === null) {
            throw new Error(`Correction memory ${correction_memory_id} not found`);
        }
    }
    // Use transaction for atomicity
    const run_correction = db.transaction(() => {
        // Apply stability penalty to original memory (T053: 0.5x penalty)
        const original_stability_after = original_stability_before * CORRECTION_STABILITY_PENALTY;
        set_memory_stability(original_memory_id, original_stability_after);
        // Apply stability boost to correction memory if exists (T055: 1.2x boost)
        let correction_stability_after = null;
        if (correction_memory_id && correction_stability_before !== null) {
            correction_stability_after = correction_stability_before * REPLACEMENT_STABILITY_BOOST;
            set_memory_stability(correction_memory_id, correction_stability_after);
        }
        // Record the correction
        // Record_correction validates db before starting this transaction
        const stmt = db.prepare(`
      INSERT INTO memory_corrections (
        original_memory_id,
        correction_memory_id,
        correction_type,
        original_stability_before,
        original_stability_after,
        correction_stability_before,
        correction_stability_after,
        reason,
        corrected_by,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);
        const result = stmt.run(original_memory_id, correction_memory_id, correction_type, original_stability_before, original_stability_after, correction_stability_before, correction_stability_after, reason, corrected_by);
        // Also create a causal edge if causal_edges table exists
        try {
            // Record_correction validates db before starting this transaction
            const causal_table_exists = db.prepare(`
        SELECT name FROM sqlite_master
        WHERE type='table' AND name='causal_edges'
      `).get();
            if (causal_table_exists && correction_memory_id) {
                const relation = map_correction_type_to_relation(correction_type);
                const correctionId = Number(result.lastInsertRowid);
                const edgeEvidence = build_owned_edge_evidence(correctionId, correction_type, reason);
                // Record_correction validates db before starting this transaction
                // Undo_correction throws when db is not initialized before creating this transaction
                db.prepare(`
          INSERT OR IGNORE INTO causal_edges (
            source_id, target_id, relation, strength, evidence, extracted_at
          ) VALUES (?, ?, ?, 1.0, ?, datetime('now'))
        `).run(String(correction_memory_id), String(original_memory_id), relation, edgeEvidence);
                invalidateGraphCaches(db);
            }
        }
        catch (e) {
            // Causal edge creation is optional, don't fail if it errors
            console.warn(`[corrections] Could not create causal edge: ${get_error_message(e)}`);
        }
        return {
            correction_id: result.lastInsertRowid,
            original_memory_id,
            correction_memory_id,
            correction_type,
            stability_changes: {
                original: {
                    before: original_stability_before,
                    after: original_stability_after,
                    penalty_applied: CORRECTION_STABILITY_PENALTY
                },
                correction: correction_memory_id ? {
                    before: correction_stability_before,
                    after: correction_stability_after,
                    boost_applied: REPLACEMENT_STABILITY_BOOST
                } : null
            }
        };
    });
    try {
        const result = run_correction();
        return {
            success: true,
            ...result
        };
    }
    catch (error) {
        console.error(`[corrections] record_correction failed: ${get_error_message(error)}`);
        throw error;
    }
}
/* ───────────────────────────────────────────────────────────────
   6. UNDO CAPABILITY
──────────────────────────────────────────────────────────────── */
/**
 * Provides the undo_correction helper.
 */
export function undo_correction(correction_id) {
    if (!db) {
        throw new Error('[corrections] Database not initialized. Call init() first.');
    }
    if (!areRelationsEnabled()) {
        return {
            success: false,
            skipped: true,
            reason: 'SPECKIT_RELATIONS disabled'
        };
    }
    // Get the correction record
    const correction = db.prepare(`
    SELECT * FROM memory_corrections WHERE id = ? AND is_undone = 0
  `).get(correction_id);
    if (!correction) {
        return {
            success: false,
            error: `Correction ${correction_id} not found or already undone`
        };
    }
    // Use transaction for atomicity
    const run_undo = db.transaction(() => {
        // Restore original memory stability
        if (correction.original_stability_before !== null) {
            set_memory_stability(correction.original_memory_id, correction.original_stability_before);
        }
        // Restore correction memory stability
        if (correction.correction_memory_id && correction.correction_stability_before !== null) {
            set_memory_stability(correction.correction_memory_id, correction.correction_stability_before);
        }
        // Mark correction as undone
        db.prepare(`
      UPDATE memory_corrections
      SET is_undone = 1,
          undone_at = datetime('now')
      WHERE id = ?
    `).run(correction_id);
        // Try to remove the causal edge if it exists
        // T-02: Scope deletion by relation type to avoid removing unrelated edges
        // Between the same pair of memories (e.g., 'supersedes' vs 'derived_from').
        try {
            if (correction.correction_memory_id) {
                const undoRelation = map_correction_type_to_relation(correction.correction_type);
                const ownedEdgeEvidencePrefix = `Correction#${correction_id}:`;
                // Undo_correction throws when db is not initialized before creating this transaction
                const deleteResult = db.prepare(`
          DELETE FROM causal_edges
          WHERE source_id = ?
            AND target_id = ?
            AND relation = ?
            AND evidence LIKE ?
        `).run(String(correction.correction_memory_id), String(correction.original_memory_id), undoRelation, `${ownedEdgeEvidencePrefix}%`);
                invalidateGraphCaches(db);
                if (deleteResult.changes === 0) {
                    const legacyEdgeEvidence = build_legacy_edge_evidence(correction.correction_type, correction.reason);
                    const legacyDeleteResult = db.prepare(`
            DELETE FROM causal_edges
            WHERE source_id = ?
              AND target_id = ?
              AND relation = ?
              AND evidence = ?
          `).run(String(correction.correction_memory_id), String(correction.original_memory_id), undoRelation, legacyEdgeEvidence);
                    invalidateGraphCaches(db);
                    if (legacyDeleteResult.changes === 0) {
                        console.warn(`[corrections] undo: no causal edge found for (${correction.correction_memory_id} → ${correction.original_memory_id}, relation=${undoRelation})`);
                    }
                }
            }
        }
        catch (edgeErr) {
            // T-02: Surface edge-deletion errors instead of empty catch
            console.warn(`[corrections] undo: causal edge deletion failed: ${get_error_message(edgeErr)}`);
        }
        return {
            correction_id,
            original_memory_id: correction.original_memory_id,
            correction_memory_id: correction.correction_memory_id,
            stability_restored: {
                original: correction.original_stability_before,
                correction: correction.correction_stability_before
            }
        };
    });
    try {
        const result = run_undo();
        return {
            success: true,
            ...result
        };
    }
    catch (error) {
        console.error(`[corrections] undo_correction failed: ${get_error_message(error)}`);
        throw error;
    }
}
/* ───────────────────────────────────────────────────────────────
   7. QUERY FUNCTIONS
──────────────────────────────────────────────────────────────── */
/**
 * Provides the get_corrections_for_memory helper.
 */
export function get_corrections_for_memory(memory_id, options = {}) {
    if (!db) {
        return [];
    }
    if (!areRelationsEnabled()) {
        return [];
    }
    const { include_undone = false, limit = MAX_CORRECTIONS_HISTORY } = options;
    try {
        let query = `
      SELECT mc.*,
             m_orig.title as original_title,
             m_corr.title as correction_title
      FROM memory_corrections mc
      LEFT JOIN memory_index m_orig ON mc.original_memory_id = m_orig.id
      LEFT JOIN memory_index m_corr ON mc.correction_memory_id = m_corr.id
      WHERE mc.original_memory_id = ? OR mc.correction_memory_id = ?
    `;
        if (!include_undone) {
            query += ' AND mc.is_undone = 0';
        }
        query += ' ORDER BY mc.created_at DESC LIMIT ?';
        return db.prepare(query).all(memory_id, memory_id, limit);
    }
    catch (error) {
        console.warn(`[corrections] get_corrections_for_memory failed: ${get_error_message(error)}`);
        return [];
    }
}
/**
 * Provides the get_correction_chain helper.
 */
export function get_correction_chain(memory_id, options = {}) {
    if (!db || !areRelationsEnabled()) {
        return { memory_id, chain: [], total: 0 };
    }
    const { max_depth = 5 } = options;
    const visited = new Set();
    const chain = [];
    function traverse(id, depth, _direction) {
        if (depth > max_depth || visited.has(id)) {
            return;
        }
        visited.add(id);
        // Get corrections where this memory is the original
        // Get_correction_chain returns early when db is unavailable
        const as_original = db.prepare(`
      SELECT * FROM memory_corrections
      WHERE original_memory_id = ? AND is_undone = 0
      ORDER BY created_at DESC
    `).all(id);
        for (const correction of as_original) {
            chain.push({
                ...correction,
                direction: 'corrected_by',
                depth
            });
            if (correction.correction_memory_id) {
                traverse(correction.correction_memory_id, depth + 1, 'forward');
            }
        }
        // Get corrections where this memory is the correction
        // Get_correction_chain returns early when db is unavailable
        const as_correction = db.prepare(`
      SELECT * FROM memory_corrections
      WHERE correction_memory_id = ? AND is_undone = 0
      ORDER BY created_at DESC
    `).all(id);
        for (const correction of as_correction) {
            chain.push({
                ...correction,
                direction: 'corrects',
                depth
            });
            traverse(correction.original_memory_id, depth + 1, 'backward');
        }
    }
    try {
        traverse(memory_id, 0, 'both');
        return {
            memory_id,
            chain,
            total: chain.length,
            max_depth_reached: chain.some(c => c.depth === max_depth)
        };
    }
    catch (error) {
        const error_message = get_error_message(error);
        console.warn(`[corrections] get_correction_chain failed: ${error_message}`);
        return { memory_id, chain: [], total: 0, error: error_message };
    }
}
/**
 * Provides the get_corrections_stats helper.
 */
export function get_corrections_stats() {
    if (!db || !areRelationsEnabled()) {
        return {
            enabled: areRelationsEnabled(),
            total: 0,
            by_type: {},
            undone: 0,
            recent_24h: 0
        };
    }
    try {
        const stats = db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN is_undone = 1 THEN 1 ELSE 0 END) as undone,
        SUM(CASE WHEN created_at > datetime('now', '-24 hours') THEN 1 ELSE 0 END) as recent_24h
      FROM memory_corrections
    `).get();
        const by_type = db.prepare(`
      SELECT correction_type, COUNT(*) as count
      FROM memory_corrections
      WHERE is_undone = 0
      GROUP BY correction_type
    `).all();
        return {
            enabled: areRelationsEnabled(),
            total: stats.total || 0,
            by_type: by_type.reduce((acc, row) => {
                acc[row.correction_type] = row.count;
                return acc;
            }, {}),
            undone: stats.undone || 0,
            recent_24h: stats.recent_24h || 0
        };
    }
    catch (error) {
        const error_message = get_error_message(error);
        console.warn(`[corrections] get_corrections_stats failed: ${error_message}`);
        return {
            enabled: areRelationsEnabled(),
            total: 0,
            by_type: {},
            undone: 0,
            recent_24h: 0,
            error: error_message
        };
    }
}
/* ───────────────────────────────────────────────────────────────
   8. BATCH OPERATIONS
──────────────────────────────────────────────────────────────── */
/**
 * Provides the deprecate_memory helper.
 */
export function deprecate_memory(memory_id, reason = 'Deprecated') {
    return record_correction({
        original_memory_id: memory_id,
        correction_memory_id: null,
        correction_type: CORRECTION_TYPES.DEPRECATED,
        reason,
        corrected_by: 'system'
    });
}
/**
 * Provides the supersede_memory helper.
 */
export function supersede_memory(old_memory_id, new_memory_id, reason = 'Superseded by newer version') {
    return record_correction({
        original_memory_id: old_memory_id,
        correction_memory_id: new_memory_id,
        correction_type: CORRECTION_TYPES.SUPERSEDED,
        reason,
        corrected_by: 'system'
    });
}
/**
 * Provides the refine_memory helper.
 */
export function refine_memory(original_id, refined_id, reason = 'Content improved') {
    return record_correction({
        original_memory_id: original_id,
        correction_memory_id: refined_id,
        correction_type: CORRECTION_TYPES.REFINED,
        reason,
        corrected_by: 'system'
    });
}
/**
 * Provides the merge_memories helper.
 */
export function merge_memories(source_ids, merged_id, reason = 'Consolidated from multiple memories') {
    if (!Array.isArray(source_ids) || source_ids.length === 0) {
        throw new Error('source_ids must be a non-empty array');
    }
    const results = [];
    for (const source_id of source_ids) {
        if (source_id === merged_id)
            continue;
        try {
            const result = record_correction({
                original_memory_id: source_id,
                correction_memory_id: merged_id,
                correction_type: CORRECTION_TYPES.MERGED,
                reason,
                corrected_by: 'system'
            });
            results.push(result);
        }
        catch (error) {
            results.push({
                success: false,
                reason: get_error_message(error)
            });
        }
    }
    return results;
}
/* ───────────────────────────────────────────────────────────────
   9. CAMELCASE ALIASES (backward compatibility)
──────────────────────────────────────────────────────────────── */
export { record_correction as recordCorrection, undo_correction as undoCorrection, get_corrections_for_memory as getCorrectionsForMemory, get_correction_chain as getCorrectionChain, get_corrections_stats as getCorrectionsStats, get_correction_types as getCorrectionTypes, deprecate_memory as deprecateMemory, supersede_memory as supersedeMemory, refine_memory as refineMemory, merge_memories as mergeMemories, is_enabled as isEnabled, ensure_schema as ensureSchema, get_db as getDb, };
//# sourceMappingURL=corrections.js.map