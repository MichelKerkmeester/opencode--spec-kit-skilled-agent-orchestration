// ───────────────────────────────────────────────────────────────
// MODULE: Surrogate Storage
// ───────────────────────────────────────────────────────────────
// SQLite storage layer for query surrogates (REQ-D2-005).
// Extracted from query-surrogates.ts for modularization.
//
// Provides: table init, store, load, and batch-load operations.
// Self-contained — no imports from query-surrogates to avoid cycles.
//
// Surrogate storage is populated at index time and queried at search time via
// stage1-candidate-gen.ts which calls loadSurrogatesBatch() + matchSurrogates().
/* ───────────────────────────────────────────────────────────────
   2. TABLE INITIALIZATION
----------------------------------------------------------------*/
/**
 * Initialize the memory_surrogates table if it does not exist.
 *
 * Schema:
 *   memory_id      — FK to memory_index.id (unique)
 *   aliases_json   — JSON array of alias strings
 *   headings_json  — JSON array of heading strings
 *   summary        — extractive summary text
 *   questions_json — JSON array of surrogate question strings
 *   generated_at   — timestamp (epoch ms)
 *
 * @param db - SQLite database instance.
 */
export function initSurrogateTable(db) {
    db.exec(`
    CREATE TABLE IF NOT EXISTS memory_surrogates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER NOT NULL UNIQUE,
      aliases_json TEXT NOT NULL DEFAULT '[]',
      headings_json TEXT NOT NULL DEFAULT '[]',
      summary TEXT NOT NULL DEFAULT '',
      questions_json TEXT NOT NULL DEFAULT '[]',
      generated_at INTEGER NOT NULL DEFAULT 0
    )
  `);
}
/* ───────────────────────────────────────────────────────────────
   3. STORE
----------------------------------------------------------------*/
/**
 * Store surrogate metadata for a memory document.
 *
 * Uses INSERT OR REPLACE to handle re-indexing gracefully.
 * NOTE: Feature flag guard is the caller's responsibility.
 *
 * @param db        - SQLite database instance.
 * @param memoryId  - ID of the memory document.
 * @param surrogates - Generated surrogate metadata.
 */
export function storeSurrogates(db, memoryId, surrogates) {
    try {
        initSurrogateTable(db);
        const stmt = db.prepare(`
      INSERT OR REPLACE INTO memory_surrogates
        (memory_id, aliases_json, headings_json, summary, questions_json, generated_at)
      VALUES
        (?, ?, ?, ?, ?, ?)
    `);
        stmt.run(memoryId, JSON.stringify(surrogates.aliases), JSON.stringify(surrogates.headings), surrogates.summary, JSON.stringify(surrogates.surrogateQuestions), surrogates.generatedAt);
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[query-surrogates] Failed to store surrogates for memory ${memoryId}: ${msg}`);
    }
}
/* ───────────────────────────────────────────────────────────────
   4. LOAD (SINGLE)
----------------------------------------------------------------*/
/**
 * Load surrogate metadata for a memory document.
 *
 * Returns null when surrogates are not found or the table does not exist.
 * Backward compatible: missing surrogates = no boost (no errors).
 *
 * @param db       - SQLite database instance.
 * @param memoryId - ID of the memory document.
 * @returns StorableSurrogateMetadata or null.
 */
export function loadSurrogates(db, memoryId) {
    try {
        // Check if table exists to avoid errors on older databases
        const tableCheck = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='memory_surrogates'`).get();
        if (!tableCheck)
            return null;
        const row = db.prepare(`SELECT aliases_json, headings_json, summary, questions_json, generated_at
       FROM memory_surrogates WHERE memory_id = ?`).get(memoryId);
        if (!row)
            return null;
        return {
            aliases: JSON.parse(row.aliases_json),
            headings: JSON.parse(row.headings_json),
            summary: row.summary,
            surrogateQuestions: JSON.parse(row.questions_json),
            generatedAt: row.generated_at,
        };
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[query-surrogates] Failed to load surrogates for memory ${memoryId}: ${msg}`);
        return null;
    }
}
/* ───────────────────────────────────────────────────────────────
   5. LOAD (BATCH)
----------------------------------------------------------------*/
/**
 * Batch-load surrogate metadata for multiple memory documents.
 *
 * Efficient single-query approach for query-time matching across
 * a candidate set.
 *
 * @param db        - SQLite database instance.
 * @param memoryIds - Array of memory IDs to load surrogates for.
 * @returns Map of memoryId → StorableSurrogateMetadata.
 */
export function loadSurrogatesBatch(db, memoryIds) {
    const result = new Map();
    if (memoryIds.length === 0)
        return result;
    try {
        // Check if table exists
        const tableCheck = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='memory_surrogates'`).get();
        if (!tableCheck)
            return result;
        const placeholders = memoryIds.map(() => '?').join(', ');
        const rows = db.prepare(`SELECT memory_id, aliases_json, headings_json, summary, questions_json, generated_at
       FROM memory_surrogates WHERE memory_id IN (${placeholders})`).all(...memoryIds);
        for (const row of rows) {
            result.set(row.memory_id, {
                aliases: JSON.parse(row.aliases_json),
                headings: JSON.parse(row.headings_json),
                summary: row.summary,
                surrogateQuestions: JSON.parse(row.questions_json),
                generatedAt: row.generated_at,
            });
        }
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[query-surrogates] Failed to batch-load surrogates: ${msg}`);
    }
    return result;
}
//# sourceMappingURL=surrogate-storage.js.map