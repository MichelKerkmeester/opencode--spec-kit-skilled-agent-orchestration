import { isUsageRankingEnabled } from '../search/search-flags.js';
// ───────────────────────────────────────────────────────────────
// 1. SCHEMA MIGRATION
// ───────────────────────────────────────────────────────────────
/**
 * Add access_count column to memory_index if not present.
 * Uses ALTER TABLE with try/catch for idempotency.
 */
export function ensureUsageColumn(db) {
    if (!isUsageRankingEnabled()) {
        return;
    }
    try {
        db.exec(`ALTER TABLE memory_index ADD COLUMN access_count INTEGER DEFAULT 0`);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (!/duplicate column name/i.test(message)) {
            console.warn(`[usage-tracking] ensureUsageColumn failed (fail-open): ${message}`);
        }
    }
}
// ───────────────────────────────────────────────────────────────
// 2. ACCESS COUNT OPERATIONS
// ───────────────────────────────────────────────────────────────
/**
 * Increment access count for a memory.
 * No-op if the memory ID does not exist.
 */
export function incrementAccessCount(db, memoryId) {
    if (!isUsageRankingEnabled()) {
        return;
    }
    try {
        ensureUsageColumn(db);
        db.prepare(`
      UPDATE memory_index SET access_count = COALESCE(access_count, 0) + 1 WHERE id = ?
    `).run(memoryId);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[usage-tracking] incrementAccessCount failed (fail-open): ${message}`);
    }
}
/**
 * Get access count for a memory.
 * Returns 0 if the memory does not exist or on error.
 */
export function getAccessCount(db, memoryId) {
    if (!isUsageRankingEnabled()) {
        return 0;
    }
    try {
        ensureUsageColumn(db);
        const row = db.prepare(`
      SELECT COALESCE(access_count, 0) AS access_count FROM memory_index WHERE id = ?
    `).get(memoryId);
        return row?.access_count ?? 0;
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[usage-tracking] getAccessCount failed (fail-open): ${message}`);
        return 0;
    }
}
//# sourceMappingURL=usage-tracking.js.map