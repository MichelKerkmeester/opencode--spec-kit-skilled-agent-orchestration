import type Database from 'better-sqlite3';
declare const ACCUMULATOR_THRESHOLD = 0.5;
declare const INCREMENT_VALUE = 0.1;
declare const MAX_ACCUMULATOR_SIZE = 10000;
interface AccumulatorState {
    memoryId: number;
    accumulated: number;
}
declare function init(database: Database.Database): void;
/**
 * Track a memory access, accumulating until threshold is reached.
 */
declare function trackAccess(memoryId: number): boolean;
/**
 * Track multiple accesses at once.
 */
declare function trackMultipleAccesses(memoryIds: number[]): {
    tracked: number;
    flushed: number;
};
/**
 * Flush accumulated access count to database.
 */
declare function flushAccessCounts(memoryId: number): boolean;
/**
 * Get accumulator state for a memory.
 */
declare function getAccumulatorState(memoryId: number): AccumulatorState;
/**
 * Calculate popularity score based on access patterns.
 *
 * @returns Popularity score in the range [0, 1].
 */
declare function calculatePopularityScore(accessCount: number, lastAccessed: number | null, _createdAt: string | null): number;
/**
 * Calculate usage boost for search ranking.
 *
 * @returns Usage boost in the range [0, 3.0].
 */
declare function calculateUsageBoost(accessCount: number, lastAccessed: number | null): number;
/**
 * Reset all accumulators.
 */
declare function reset(): void;
declare function initExitHandlers(): void;
declare function cleanupExitHandlers(): void;
declare function dispose(): void;
export { ACCUMULATOR_THRESHOLD, INCREMENT_VALUE, MAX_ACCUMULATOR_SIZE, init, trackAccess, trackMultipleAccesses, flushAccessCounts, getAccumulatorState, calculatePopularityScore, calculateUsageBoost, reset, dispose, initExitHandlers, cleanupExitHandlers, };
/**
 * Re-exports related public types.
 */
export type { AccumulatorState, };
//# sourceMappingURL=access-tracker.d.ts.map