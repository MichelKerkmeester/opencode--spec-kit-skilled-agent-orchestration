import type Database from 'better-sqlite3';
import type { RankComparisonResult, RankedItem } from './rank-metrics.js';
export { classifyDirection, computeKendallTau, computeNDCG, computeMRR, compareRanks } from './rank-metrics.js';
export type { RankDirection, RankDelta, RankComparisonMetrics, RankComparisonResult, RankedItem } from './rank-metrics.js';
/** Default holdout percentage (20% of queries). */
export declare const DEFAULT_HOLDOUT_PERCENT = 0.2;
/** Number of consecutive improvement weeks required for promotion. */
export declare const PROMOTION_THRESHOLD_WEEKS = 2;
/** Standard evaluation window: 7 days in milliseconds. */
export declare const EVALUATION_WINDOW_MS: number;
/** Row shape stored in shadow_scoring_log table. */
export interface ShadowScoringLogRow {
    id: number;
    query_id: string;
    result_id: string;
    live_rank: number;
    shadow_rank: number;
    delta: number;
    direction: string;
    evaluated_at: number;
    cycle_id: string;
}
/** Aggregated result for a weekly evaluation cycle. */
export interface CycleResult {
    cycleId: string;
    evaluatedAt: number;
    queryCount: number;
    /** Mean NDCG delta across holdout queries. */
    meanNdcgDelta: number;
    /** Mean MRR delta across holdout queries. */
    meanMrrDelta: number;
    /** Mean Kendall tau across holdout queries. */
    meanKendallTau: number;
    /** Total improved / degraded / unchanged across all queries. */
    totalImproved: number;
    totalDegraded: number;
    totalUnchanged: number;
    /** Whether this cycle counts as an improvement (meanNdcgDelta >= 0). */
    isImprovement: boolean;
}
/** Row shape stored in shadow_cycle_results table. */
export interface CycleResultRow {
    id: number;
    cycle_id: string;
    evaluated_at: number;
    query_count: number;
    mean_ndcg_delta: number;
    mean_mrr_delta: number;
    mean_kendall_tau: number;
    total_improved: number;
    total_degraded: number;
    total_unchanged: number;
    is_improvement: number;
}
/** Promotion gate evaluation result. */
export interface PromotionGateResult {
    ready: boolean;
    consecutiveWeeks: number;
    recommendation: 'promote' | 'wait' | 'rollback';
}
/** Options for `selectHoldoutQueries`. */
export interface HoldoutOptions {
    /** Fraction of queries to hold out (default 0.20). */
    holdoutPercent?: number;
    /** Seed for deterministic selection. */
    seed?: number;
    /** Optional intent classes for representative coverage. */
    intentClasses?: Map<string, string>;
}
/** Options for `runShadowEvaluation`. */
export interface ShadowEvaluationOptions {
    holdoutPercent?: number;
    seed?: number;
    cycleId?: string;
    evaluatedAt?: number;
    intentClasses?: Map<string, string>;
}
/** Comprehensive report from a shadow evaluation run. */
export interface ShadowEvaluationReport {
    cycleId: string;
    evaluatedAt: number;
    holdoutQueryIds: string[];
    comparisons: RankComparisonResult[];
    cycleResult: CycleResult;
    promotionGate: PromotionGateResult;
}
/**
 * Check whether shadow feedback evaluation is enabled.
 * Default: TRUE (graduated, default ON). Set SPECKIT_SHADOW_FEEDBACK=false to disable.
 */
export declare function isShadowFeedbackEnabled(): boolean;
declare const SHADOW_SCORING_LOG_SCHEMA_SQL = "\n  CREATE TABLE IF NOT EXISTS shadow_scoring_log (\n    id           INTEGER PRIMARY KEY AUTOINCREMENT,\n    query_id     TEXT NOT NULL,\n    result_id    TEXT NOT NULL,\n    live_rank    INTEGER NOT NULL,\n    shadow_rank  INTEGER NOT NULL,\n    delta        INTEGER NOT NULL,\n    direction    TEXT NOT NULL CHECK(direction IN ('improved','degraded','unchanged')),\n    evaluated_at INTEGER NOT NULL,\n    cycle_id     TEXT NOT NULL\n  )\n";
declare const SHADOW_SCORING_LOG_INDICES_SQL = "\n  CREATE INDEX IF NOT EXISTS idx_shadow_log_query_id     ON shadow_scoring_log(query_id);\n  CREATE INDEX IF NOT EXISTS idx_shadow_log_cycle_id     ON shadow_scoring_log(cycle_id);\n  CREATE INDEX IF NOT EXISTS idx_shadow_log_evaluated_at ON shadow_scoring_log(evaluated_at);\n  CREATE INDEX IF NOT EXISTS idx_shadow_log_direction    ON shadow_scoring_log(direction)\n";
declare const SHADOW_CYCLE_RESULTS_SCHEMA_SQL = "\n  CREATE TABLE IF NOT EXISTS shadow_cycle_results (\n    id               INTEGER PRIMARY KEY AUTOINCREMENT,\n    cycle_id         TEXT NOT NULL UNIQUE,\n    evaluated_at     INTEGER NOT NULL,\n    query_count      INTEGER NOT NULL DEFAULT 0,\n    mean_ndcg_delta  REAL NOT NULL DEFAULT 0.0,\n    mean_mrr_delta   REAL NOT NULL DEFAULT 0.0,\n    mean_kendall_tau REAL NOT NULL DEFAULT 0.0,\n    total_improved   INTEGER NOT NULL DEFAULT 0,\n    total_degraded   INTEGER NOT NULL DEFAULT 0,\n    total_unchanged  INTEGER NOT NULL DEFAULT 0,\n    is_improvement   INTEGER NOT NULL DEFAULT 0 CHECK(is_improvement IN (0,1))\n  )\n";
declare const SHADOW_CYCLE_RESULTS_INDICES_SQL = "\n  CREATE INDEX IF NOT EXISTS idx_shadow_cycle_evaluated_at ON shadow_cycle_results(evaluated_at)\n";
/**
 * Ensure the shadow_scoring_log and shadow_cycle_results tables exist.
 * Idempotent — safe to call multiple times.
 */
export declare function initShadowScoringLog(db: Database.Database): void;
/**
 * Simple seeded PRNG (mulberry32).
 * Returns a function that produces deterministic floats in [0, 1).
 */
export declare function seededRandom(seed: number): () => number;
/**
 * Select a holdout subset of query IDs for shadow evaluation.
 *
 * Uses a seeded PRNG for deterministic selection. When intentClasses
 * is provided, applies stratified sampling to ensure representative
 * coverage across intent categories.
 *
 * @param queryIds - Full set of available query IDs
 * @param opts - Holdout configuration options
 * @returns Array of selected holdout query IDs
 */
export declare function selectHoldoutQueries(queryIds: string[], opts?: HoldoutOptions): string[];
/**
 * Log rank deltas from a comparison to the shadow_scoring_log table.
 *
 * Shadow-only: this function has NO effect on live ranking.
 * Errors are caught and logged as warnings.
 *
 * @param db - Database instance
 * @param comparison - The comparison result to log
 * @param cycleId - Identifier for the evaluation cycle
 * @param evaluatedAt - Epoch-ms timestamp of the evaluation
 * @returns Number of rows inserted, or 0 on error / flag off
 */
export declare function logRankDelta(db: Database.Database, comparison: RankComparisonResult, cycleId: string, evaluatedAt: number): number;
/**
 * Query past shadow scoring evaluations from the log.
 *
 * @param db - Database instance
 * @param opts - Optional filters
 * @returns Array of log rows
 */
export declare function getShadowScoringHistory(db: Database.Database, opts?: {
    queryId?: string;
    cycleId?: string;
    limit?: number;
}): ShadowScoringLogRow[];
/**
 * Record an aggregated cycle result into the shadow_cycle_results table.
 *
 * @param db - Database instance
 * @param result - The cycle result to record
 * @returns The inserted row ID, or null on error
 */
export declare function recordCycleResult(db: Database.Database, result: CycleResult): number | null;
/**
 * Get the count of consecutive improvement cycles, reading from most
 * recent backward.
 *
 * @param db - Database instance
 * @returns Number of consecutive recent improvement cycles
 */
export declare function getConsecutiveImprovements(db: Database.Database): number;
/**
 * Check whether promotion is ready based on consecutive improvements.
 *
 * @param db - Database instance
 * @returns true when PROMOTION_THRESHOLD_WEEKS consecutive improvements exist
 */
export declare function isPromotionReady(db: Database.Database): boolean;
/**
 * Get all recorded cycle results, ordered by evaluated_at descending.
 */
export declare function getCycleResults(db: Database.Database): CycleResult[];
/**
 * Evaluate whether learned signals should be promoted to production.
 *
 * Promotion requires PROMOTION_THRESHOLD_WEEKS (2) consecutive weekly
 * evaluations where shadow NDCG@10 >= live NDCG@10 (no regression).
 *
 * @param db - Database instance
 * @returns Promotion gate result with recommendation
 */
export declare function evaluatePromotionGate(db: Database.Database): PromotionGateResult;
/**
 * Run an end-to-end shadow evaluation pipeline.
 *
 * Workflow:
 *   1. Check feature flag
 *   2. Select holdout queries
 *   3. For each holdout query, compute live and shadow ranks via callbacks
 *   4. Compare rankings
 *   5. Log deltas to shadow_scoring_log
 *   6. Aggregate into a cycle result
 *   7. Record cycle result
 *   8. Evaluate promotion gate
 *   9. Return comprehensive report
 *
 * @param db - Database instance
 * @param allQueryIds - Full pool of available query IDs
 * @param computeLiveRanks - Callback to compute live ranking for a query
 * @param computeShadowRanks - Callback to compute shadow ranking for a query
 * @param opts - Evaluation options
 * @returns Comprehensive report, or null when feature flag is OFF
 */
export declare function runShadowEvaluation(db: Database.Database, allQueryIds: string[], computeLiveRanks: (queryId: string) => RankedItem[], computeShadowRanks: (queryId: string) => RankedItem[], opts?: ShadowEvaluationOptions): ShadowEvaluationReport | null;
export { SHADOW_SCORING_LOG_SCHEMA_SQL, SHADOW_SCORING_LOG_INDICES_SQL, SHADOW_CYCLE_RESULTS_SCHEMA_SQL, SHADOW_CYCLE_RESULTS_INDICES_SQL, };
//# sourceMappingURL=shadow-scoring.d.ts.map