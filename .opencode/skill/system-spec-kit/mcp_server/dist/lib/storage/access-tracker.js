import { recordAdaptiveSignal } from '../cognitive/adaptive-ranking.js';
/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
----------------------------------------------------------------*/
const ACCUMULATOR_THRESHOLD = 0.5;
const INCREMENT_VALUE = 0.1;
const FLUSH_INTERVAL_MS = 30_000;
const DEFAULT_RECENCY_DECAY_DAYS = 90;
const MAX_USAGE_BOOST = 3.0;
// P4-14 FIX: Cap accumulator Map size to prevent unbounded memory growth
const MAX_ACCUMULATOR_SIZE = 10000;
function getRecencyDecayDays() {
    const configuredDays = process.env.SPECKIT_RECENCY_DECAY_DAYS;
    if (!configuredDays) {
        return DEFAULT_RECENCY_DECAY_DAYS;
    }
    const parsedDays = Number.parseFloat(configuredDays);
    return Number.isFinite(parsedDays) && parsedDays > 0
        ? parsedDays
        : DEFAULT_RECENCY_DECAY_DAYS;
}
function clampUsageBoost(boost) {
    return Math.min(boost, MAX_USAGE_BOOST);
}
function normalizeAccessCount(accessCount) {
    return Number.isFinite(accessCount) && accessCount > 0 ? accessCount : 0;
}
/* ───────────────────────────────────────────────────────────────
   3. MODULE STATE
----------------------------------------------------------------*/
let db = null;
const accumulators = new Map();
let exitHandlersInstalled = false;
let flushInterval = null;
/* ───────────────────────────────────────────────────────────────
   4. INITIALIZATION
----------------------------------------------------------------*/
function init(database) {
    if (db && db !== database) {
        // A DB swap starts a new accounting context. Pending accumulator state
        // must not bleed into the newly active database.
        accumulators.clear();
    }
    db = database;
    initExitHandlers();
    if (!flushInterval) {
        flushInterval = setInterval(() => {
            reset();
        }, FLUSH_INTERVAL_MS);
        flushInterval.unref?.();
    }
}
/* ───────────────────────────────────────────────────────────────
   5. CORE FUNCTIONS
----------------------------------------------------------------*/
/**
 * Track a memory access, accumulating until threshold is reached.
 */
function trackAccess(memoryId) {
    // P4-14 FIX: If accumulator map exceeds max size, flush all and clear
    // To prevent unbounded memory growth.
    if (accumulators.size > MAX_ACCUMULATOR_SIZE) {
        console.warn(`[access-tracker] Accumulator map exceeded ${MAX_ACCUMULATOR_SIZE} entries, flushing all`);
        if (db) {
            for (const [id] of accumulators) {
                flushAccessCounts(id);
            }
        }
        accumulators.clear();
    }
    const current = accumulators.get(memoryId) || 0;
    const newValue = current + INCREMENT_VALUE;
    if (newValue >= ACCUMULATOR_THRESHOLD) {
        // Flush to database
        const success = flushAccessCounts(memoryId);
        if (success) {
            accumulators.delete(memoryId);
        }
        else {
            accumulators.set(memoryId, newValue);
        }
        return success;
    }
    accumulators.set(memoryId, newValue);
    return true;
}
/**
 * Track multiple accesses at once.
 */
function trackMultipleAccesses(memoryIds) {
    let tracked = 0;
    let flushed = 0;
    for (const id of memoryIds) {
        const current = accumulators.get(id) || 0;
        const newValue = current + INCREMENT_VALUE;
        if (newValue >= ACCUMULATOR_THRESHOLD) {
            const success = flushAccessCounts(id);
            if (success) {
                flushed++;
                accumulators.delete(id);
            }
            else {
                accumulators.set(id, newValue);
            }
        }
        else {
            accumulators.set(id, newValue);
        }
        tracked++;
    }
    return { tracked, flushed };
}
/**
 * Flush accumulated access count to database.
 */
function flushAccessCounts(memoryId) {
    if (!db) {
        console.warn('[access-tracker] Database not initialized. Server may still be starting up.');
        return false;
    }
    try {
        const now = Date.now();
        const result = db.prepare(`
      UPDATE memory_index
      SET access_count = access_count + 1,
          last_accessed = ?
      WHERE id = ?
    `).run(now, memoryId);
        if (result.changes > 0) {
            try {
                recordAdaptiveSignal(db, {
                    memoryId,
                    signalType: 'access',
                    signalValue: 1,
                    actor: 'access-tracker',
                });
            }
            catch (_error) {
                // Adaptive signal capture must never block core access tracking
            }
        }
        return result.changes > 0;
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[access-tracker] flushAccessCounts error: ${msg}`);
        return false;
    }
}
/**
 * Get accumulator state for a memory.
 */
function getAccumulatorState(memoryId) {
    return {
        memoryId,
        accumulated: accumulators.get(memoryId) || 0,
    };
}
/**
 * Calculate popularity score based on access patterns.
 *
 * @returns Popularity score in the range [0, 1].
 */
function calculatePopularityScore(accessCount, lastAccessed, _createdAt) {
    const safeAccessCount = normalizeAccessCount(accessCount);
    if (safeAccessCount === 0)
        return 0;
    // Access frequency component
    const freqScore = Math.min(1.0, Math.log2(safeAccessCount + 1) / 5);
    // Recency component
    let recencyScore = 0;
    if (lastAccessed) {
        const ageMs = Date.now() - lastAccessed;
        const ageDays = ageMs / (1000 * 60 * 60 * 24);
        const decayDays = getRecencyDecayDays();
        recencyScore = Math.max(0, Math.min(1, 1 - (ageDays / decayDays)));
    }
    return (freqScore * 0.6) + (recencyScore * 0.4);
}
/**
 * Calculate usage boost for search ranking.
 *
 * @returns Usage boost in the range [0, 3.0].
 */
function calculateUsageBoost(accessCount, lastAccessed) {
    const safeAccessCount = normalizeAccessCount(accessCount);
    if (safeAccessCount === 0)
        return 0;
    const boost = Math.min(0.2, safeAccessCount * 0.02);
    // Extra boost for recently accessed
    if (lastAccessed) {
        const ageMs = Date.now() - lastAccessed;
        const ageHours = ageMs / (1000 * 60 * 60);
        if (ageHours < 1)
            return clampUsageBoost(boost * 2);
        if (ageHours < 24)
            return clampUsageBoost(boost * 1.5);
    }
    return clampUsageBoost(boost);
}
/**
 * Reset all accumulators.
 */
function reset() {
    // Flush remaining accumulators before reset
    if (db) {
        for (const [id] of accumulators) {
            flushAccessCounts(id);
        }
    }
    accumulators.clear();
}
/* ───────────────────────────────────────────────────────────────
   6. EXIT HANDLERS
----------------------------------------------------------------*/
// Store handler refs for process.removeListener()
let _exitFlushHandler = null;
function initExitHandlers() {
    if (exitHandlersInstalled)
        return;
    const flush = () => {
        // P4-15 FIX: Defensive check — during shutdown the DB handle may
        // Already be closed. Wrap the entire flush in try/catch and verify
        // Db is still usable before attempting writes.
        try {
            if (!db || !accumulators.size)
                return;
            // Quick liveness check: attempt a no-op query to detect closed handle
            try {
                db.prepare('SELECT 1').get();
            }
            catch {
                // DB is closed/unusable — skip flush silently
                accumulators.clear();
                return;
            }
            for (const [id] of accumulators) {
                try {
                    flushAccessCounts(id);
                }
                catch { /* ignore during shutdown */ }
            }
            accumulators.clear();
        }
        catch {
            // Ignore all errors during shutdown flush
        }
    };
    _exitFlushHandler = flush;
    process.on('beforeExit', flush);
    process.on('SIGTERM', flush);
    process.on('SIGINT', flush);
    exitHandlersInstalled = true;
}
function cleanupExitHandlers() {
    if (_exitFlushHandler) {
        process.removeListener('beforeExit', _exitFlushHandler);
        process.removeListener('SIGTERM', _exitFlushHandler);
        process.removeListener('SIGINT', _exitFlushHandler);
        _exitFlushHandler = null;
    }
    exitHandlersInstalled = false;
}
function dispose() {
    if (flushInterval) {
        clearInterval(flushInterval);
        flushInterval = null;
    }
    cleanupExitHandlers();
    reset();
    db = null;
}
/* ───────────────────────────────────────────────────────────────
   7. EXPORTS
----------------------------------------------------------------*/
export { ACCUMULATOR_THRESHOLD, INCREMENT_VALUE, MAX_ACCUMULATOR_SIZE, init, trackAccess, trackMultipleAccesses, flushAccessCounts, getAccumulatorState, calculatePopularityScore, calculateUsageBoost, reset, dispose, initExitHandlers, cleanupExitHandlers, };
//# sourceMappingURL=access-tracker.js.map