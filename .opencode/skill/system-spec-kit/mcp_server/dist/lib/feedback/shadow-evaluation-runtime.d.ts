import type Database from 'better-sqlite3';
import { type ShadowEvaluationReport } from './shadow-scoring.js';
/** Scheduler configuration for production shadow-feedback holdout runs. */
interface ShadowEvaluationSchedulerOptions {
    intervalMs?: number;
    holdoutPercent?: number;
    maxQueryPoolSize?: number;
    queryLookbackMs?: number;
    searchLimit?: number;
    seed?: number;
}
/** Re-check weekly due status every hour while the server is running. */
declare const DEFAULT_SCHEDULER_INTERVAL_MS: number;
/** Build holdout candidate pools from the last 30 days of search traffic. */
declare const DEFAULT_QUERY_LOOKBACK_MS: number;
/** Upper bound on distinct replayed queries available to the holdout sampler. */
declare const DEFAULT_MAX_QUERY_POOL_SIZE = 100;
/** Use the same top-k depth as normal interactive search responses. */
declare const DEFAULT_SEARCH_LIMIT = 10;
/** Deterministic seed so weekly holdout selection is stable across restarts. */
declare const DEFAULT_SEED = 42;
/**
 * Determine whether a new weekly evaluation cycle is due.
 */
declare function isShadowEvaluationDue(db: Database.Database, now?: number): boolean;
/**
 * Run one fail-safe production shadow evaluation cycle when a weekly run is due.
 */
declare function runScheduledShadowEvaluationCycle(db: Database.Database, options?: ShadowEvaluationSchedulerOptions): Promise<ShadowEvaluationReport | null>;
/**
 * Start the production shadow evaluation scheduler.
 */
declare function startShadowEvaluationScheduler(db: Database.Database, options?: ShadowEvaluationSchedulerOptions): boolean;
/**
 * Stop the production shadow evaluation scheduler.
 */
declare function stopShadowEvaluationScheduler(): boolean;
/**
 * Check whether the shadow evaluation scheduler is currently running.
 */
declare function isShadowEvaluationSchedulerRunning(): boolean;
export { DEFAULT_SCHEDULER_INTERVAL_MS, DEFAULT_QUERY_LOOKBACK_MS, DEFAULT_MAX_QUERY_POOL_SIZE, DEFAULT_SEARCH_LIMIT, DEFAULT_SEED, isShadowEvaluationDue, isShadowEvaluationSchedulerRunning, runScheduledShadowEvaluationCycle, startShadowEvaluationScheduler, stopShadowEvaluationScheduler, };
export type { ShadowEvaluationSchedulerOptions, };
//# sourceMappingURL=shadow-evaluation-runtime.d.ts.map