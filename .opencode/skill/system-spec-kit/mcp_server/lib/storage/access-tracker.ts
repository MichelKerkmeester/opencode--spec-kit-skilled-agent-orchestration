// ---------------------------------------------------------------
// MODULE: Access Tracker
// Batched access tracking with accumulator
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const ACCUMULATOR_THRESHOLD = 0.5;
const INCREMENT_VALUE = 0.1;
// P4-14 FIX: Cap accumulator Map size to prevent unbounded memory growth
const MAX_ACCUMULATOR_SIZE = 10000;

/* -------------------------------------------------------------
   2. INTERFACES
----------------------------------------------------------------*/

interface AccumulatorState {
  memoryId: number;
  accumulated: number;
}

/* -------------------------------------------------------------
   3. MODULE STATE
----------------------------------------------------------------*/

let db: Database.Database | null = null;
const accumulators = new Map<number, number>();
let exitHandlersInstalled = false;

/* -------------------------------------------------------------
   4. INITIALIZATION
----------------------------------------------------------------*/

function init(database: Database.Database): void {
  db = database;
  initExitHandlers();
}

/* -------------------------------------------------------------
   5. CORE FUNCTIONS
----------------------------------------------------------------*/

/**
 * Track a memory access, accumulating until threshold is reached.
 */
function trackAccess(memoryId: number): boolean {
  // P4-14 FIX: If accumulator map exceeds max size, flush all and clear
  // to prevent unbounded memory growth.
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
    accumulators.delete(memoryId);
    return success;
  }

  accumulators.set(memoryId, newValue);
  return true;
}

/**
 * Track multiple accesses at once.
 */
function trackMultipleAccesses(memoryIds: number[]): { tracked: number; flushed: number } {
  let tracked = 0;
  let flushed = 0;

  for (const id of memoryIds) {
    const current = accumulators.get(id) || 0;
    const newValue = current + INCREMENT_VALUE;

    if (newValue >= ACCUMULATOR_THRESHOLD) {
      if (flushAccessCounts(id)) flushed++;
      accumulators.delete(id);
    } else {
      accumulators.set(id, newValue);
    }
    tracked++;
  }

  return { tracked, flushed };
}

/**
 * Flush accumulated access count to database.
 */
function flushAccessCounts(memoryId: number): boolean {
  if (!db) {
    console.warn('[access-tracker] Database not initialized. Server may still be starting up.');
    return false;
  }

  try {
    const now = new Date().toISOString();
    const result = (db.prepare(`
      UPDATE memory_index
      SET access_count = access_count + 1,
          last_accessed = ?
      WHERE id = ?
    `) as Database.Statement).run(now, memoryId);

    return (result as { changes: number }).changes > 0;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[access-tracker] flushAccessCounts error: ${msg}`);
    return false;
  }
}

/**
 * Get accumulator state for a memory.
 */
function getAccumulatorState(memoryId: number): AccumulatorState {
  return {
    memoryId,
    accumulated: accumulators.get(memoryId) || 0,
  };
}

/**
 * Calculate popularity score based on access patterns.
 */
function calculatePopularityScore(
  accessCount: number,
  lastAccessed: number | null,
  _createdAt: string | null
): number {
  if (accessCount === 0) return 0;

  // Access frequency component
  const freqScore = Math.min(1.0, Math.log2(accessCount + 1) / 5);

  // Recency component
  let recencyScore = 0;
  if (lastAccessed) {
    const ageMs = Date.now() - lastAccessed;
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    recencyScore = Math.max(0, 1 - (ageDays / 90));
  }

  return (freqScore * 0.6) + (recencyScore * 0.4);
}

/**
 * Calculate usage boost for search ranking.
 */
function calculateUsageBoost(accessCount: number, lastAccessed: number | null): number {
  if (accessCount === 0) return 0;

  const boost = Math.min(0.2, accessCount * 0.02);

  // Extra boost for recently accessed
  if (lastAccessed) {
    const ageMs = Date.now() - lastAccessed;
    const ageHours = ageMs / (1000 * 60 * 60);
    if (ageHours < 1) return boost * 2;
    if (ageHours < 24) return boost * 1.5;
  }

  return boost;
}

/**
 * Reset all accumulators.
 */
function reset(): void {
  // Flush remaining accumulators before reset
  if (db) {
    for (const [id] of accumulators) {
      flushAccessCounts(id);
    }
  }
  accumulators.clear();
}

/* -------------------------------------------------------------
   6. EXIT HANDLERS
----------------------------------------------------------------*/

function initExitHandlers(): void {
  if (exitHandlersInstalled) return;

  const flush = (): void => {
    // P4-15 FIX: Defensive check — during shutdown the DB handle may
    // already be closed. Wrap the entire flush in try/catch and verify
    // db is still usable before attempting writes.
    try {
      if (!db || !accumulators.size) return;
      // Quick liveness check: attempt a no-op query to detect closed handle
      try {
        db.prepare('SELECT 1').get();
      } catch {
        // DB is closed/unusable — skip flush silently
        accumulators.clear();
        return;
      }
      for (const [id] of accumulators) {
        try { flushAccessCounts(id); } catch { /* ignore during shutdown */ }
      }
      accumulators.clear();
    } catch {
      // Ignore all errors during shutdown flush
    }
  };

  process.on('beforeExit', flush);
  process.on('SIGTERM', flush);
  process.on('SIGINT', flush);

  exitHandlersInstalled = true;
}

function cleanupExitHandlers(): void {
  // Cannot easily remove listeners, but mark as cleaned up
  exitHandlersInstalled = false;
}

/* -------------------------------------------------------------
   7. EXPORTS
----------------------------------------------------------------*/

export {
  ACCUMULATOR_THRESHOLD,
  INCREMENT_VALUE,
  MAX_ACCUMULATOR_SIZE,

  init,
  trackAccess,
  trackMultipleAccesses,
  flushAccessCounts,
  getAccumulatorState,
  calculatePopularityScore,
  calculateUsageBoost,
  reset,
  initExitHandlers,
  cleanupExitHandlers,
};

export type {
  AccumulatorState,
};
