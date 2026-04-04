import type { RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';
/** Result metrics for a single K-value configuration. */
interface KValueMetrics {
    /** Mean Reciprocal Rank at cutoff 5, estimated against baseline ranking. */
    mrr5: number;
    /** Kendall tau rank correlation with the baseline (K=60) ranking. */
    kendallTau: number;
    /** Average RRF score across all fused results for this K-value. */
    avgScore: number;
}
/** Full analysis result mapping each tested K-value to its metrics. */
interface KValueAnalysisResult {
    baselineK: number;
    results: Record<number, KValueMetrics>;
    /** Number of unique items in the fused results (union across all K values). */
    totalItems: number;
}
/**
 * Compute Kendall tau rank correlation coefficient between two rankings.
 *
 * Both arrays must contain the same set of IDs (possibly in different order).
 * Returns a value in [-1, 1] where:
 *   1.0  = identical ranking
 *   0.0  = no correlation
 *  -1.0  = perfectly reversed ranking
 */
declare function kendallTau(rankingA: (number | string)[], rankingB: (number | string)[]): number;
/**
 * Compute Mean Reciprocal Rank at cutoff K for a candidate ranking
 * given a baseline (ground-truth) ranking.
 *
 * For each item in the baseline top-5, find its position in the candidate
 * ranking and compute 1/rank. MRR@5 is the mean of those reciprocal ranks.
 */
declare function mrr5(baselineRanking: (number | string)[], candidateRanking: (number | string)[]): number;
/** K-values to test in the grid search. */
declare const K_VALUES: readonly [10, 20, 40, 60, 80, 100, 120];
/** The baseline K-value (current production default). */
declare const BASELINE_K = 60;
/**
 * Run K-value sensitivity analysis on a set of ranked lists.
 *
 * For each K in {20, 40, 60, 80, 100}:
 * 1. Fuses the input lists using `fuseResultsMulti` with that K
 * 2. Extracts the ranked order of result IDs
 * 3. Computes Kendall tau correlation with the K=60 baseline
 * 4. Computes MRR@5 against the K=60 baseline
 * 5. Computes average RRF score
 *
 * @param lists Pre-computed ranked lists (no DB access needed)
 * @param _queryCount Number of queries represented (for documentation; not used in computation)
 * @returns Analysis result with per-K metrics
 */
declare function analyzeKValueSensitivity(lists: RankedList[], _queryCount?: number): KValueAnalysisResult;
/**
 * Run K-value sensitivity analysis across multiple independent query runs.
 *
 * Each query's ranked lists are analyzed independently, then averaged so the
 * final metrics reflect per-query sensitivity rather than a synthetic fusion
 * across unrelated queries.
 */
declare function analyzeKValueSensitivityBatch(queryLists: RankedList[][]): KValueAnalysisResult;
/** Formatted report returned by formatKValueReport(). */
interface KValueReport {
    baselineK: number;
    grid: Array<{
        k: number;
        mrr5: number;
        kendallTau: number;
        avgScore: number;
    }>;
    recommendation: string;
    sensitivityCurve: string;
}
/**
 * Format a KValueAnalysisResult into a human-readable structured report.
 *
 * - grid: sorted array of per-K metrics (ascending K order)
 * - recommendation: which K to use based on MRR@5 vs the baseline
 * - sensitivityCurve: prose description of score variation across the grid
 */
declare function formatKValueReport(analysis: KValueAnalysisResult): KValueReport;
/**
 * Intent classes aligned with adaptive-fusion.ts weight profiles.
 * Used for per-intent K-sweep segmentation.
 */
type IntentClass = 'understand' | 'find_spec' | 'fix_bug' | 'add_feature' | 'refactor' | 'security_audit' | 'find_decision' | 'unknown';
/**
 * A judged query with explicit relevance labels for NDCG/MRR evaluation.
 * REQ-D1-003: Judged query set for per-intent K sweep.
 */
interface JudgedQuery {
    /** The query string */
    query: string;
    /** Intent class for segmentation */
    intent: IntentClass;
    /** IDs considered relevant (binary relevance for MRR computation) */
    relevantIds: string[];
    /**
     * Graded relevance labels: id -> score (0=not relevant, 1=relevant, 2=highly relevant, 3=perfect).
     * Used for NDCG computation.
     */
    labels: Map<string, number>;
    /** Pre-computed ranked lists for fusion (one per retrieval channel) */
    channels: RankedList[];
}
/**
 * Per-K metrics computed against judged relevance labels.
 */
interface JudgedKMetrics {
    /** Normalized Discounted Cumulative Gain at cutoff 10 */
    ndcg10: number;
    /** Mean Reciprocal Rank at cutoff 5 (binary relevance) */
    mrr5Judged: number;
    /** Number of queries evaluated */
    queryCount: number;
}
/** Per-intent best-K selection result. */
interface BestKPerIntent {
    /** The selected K value (argmax of ndcg10, tie-broken by lower K) */
    bestK: number;
    /** NDCG@10 at the selected K */
    bestNdcg10: number;
    /** Full metrics for each K in the sweep */
    metricsPerK: Record<number, JudgedKMetrics>;
    /** Number of queries for this intent */
    queryCount: number;
}
/** Result of a full judged K sweep across all intents. */
interface JudgedKSweepResult {
    /** Per-intent best-K selections */
    byIntent: Partial<Record<IntentClass, BestKPerIntent>>;
    /** Global best-K (across all intents combined) */
    globalBestK: number;
    /** Whether SPECKIT_RRF_K_EXPERIMENTAL was enabled */
    experimentalMode: boolean;
}
/** K-values for the judged relevance sweep (REQ-D1-003). */
declare const JUDGED_K_SWEEP_VALUES: readonly [10, 20, 40, 60, 80, 100, 120];
interface OptimizationJudgment {
    id: number | string;
    relevance: number;
}
interface IntentKOptimizationQuery {
    intent: string;
    judgments: OptimizationJudgment[];
    rankingsByK: Partial<Record<number, Array<number | string>>>;
}
interface IntentKMetrics {
    ndcg10: number;
    mrr5: number;
}
interface IntentKOptimizationResult {
    bestKByIntent: Record<string, number>;
    metricsByIntent: Record<string, Record<number, IntentKMetrics>>;
}
declare function computeNdcgAtK(rankedIds: Array<string | number>, judgments: OptimizationJudgment[], cutoff: number): number;
declare function computeMrrAtK(rankedIds: Array<string | number>, judgments: OptimizationJudgment[], cutoff: number): number;
declare function argmaxK(metricsByK: Record<number, {
    ndcg10: number;
}>): number;
declare function optimizeKValuesByIntent(queries: IntentKOptimizationQuery[]): IntentKOptimizationResult;
declare function resolveOptimalRrfK(intent: string, bestKByIntent: Record<string, number>): number;
/**
 * Compute NDCG@10 for a single result ranking against judged labels.
 *
 * NDCG = DCG / IDCG where:
 *   DCG@n  = Σ (rel_i / log2(i+2)) for i in 0..n-1
 *   IDCG@n = DCG of ideal (sorted by relevance) ranking
 *
 * @param rankedIds - Ordered list of candidate IDs (descending by score)
 * @param labels - Map of id -> relevance grade (0-3)
 * @returns NDCG@10 in [0, 1]; returns 0 for empty/unlabeled rankings
 */
declare function computeNdcg10(rankedIds: (string | number)[], labels: Map<string, number>): number;
/**
 * Compute MRR@5 against judged relevant IDs (binary relevance).
 *
 * @param rankedIds - Ordered list of candidate IDs (descending by score)
 * @param relevantIds - Set of IDs considered relevant
 * @returns MRR@5 in [0, 1]
 */
declare function computeMrr5Judged(rankedIds: (string | number)[], relevantIds: string[]): number;
/**
 * Check if experimental K selection is enabled (REQ-D1-003).
 * Default: ON (graduated). Set SPECKIT_RRF_K_EXPERIMENTAL=false to disable.
 * When OFF, per-intent K selection is skipped and K=60 is used.
 * When ON, NDCG@10-maximizing K is selected per intent.
 */
declare function isKExperimentalEnabled(): boolean;
/**
 * Evaluate a set of judged queries at a given K, returning aggregate metrics.
 *
 * @param queries - Judged queries with channels, labels, and relevantIds
 * @param k - RRF smoothing constant to use for fusion
 * @returns Aggregate NDCG@10 and MRR@5 metrics across the query set
 */
declare function evalQueriesAtK(queries: JudgedQuery[], k: number): JudgedKMetrics;
/**
 * Select best K for an intent via argmax(NDCG@10), tie-broken by lower K.
 *
 * @param metricsPerK - Metrics keyed by K value
 * @returns The K value that maximizes NDCG@10 (lower K wins ties)
 */
declare function argmaxNdcg10(metricsPerK: Record<number, JudgedKMetrics>): number;
/**
 * Run a per-intent K sweep over JUDGED_K_SWEEP_VALUES and select the best K
 * per intent via argmax(NDCG@10).
 *
 * Feature flag: SPECKIT_RRF_K_EXPERIMENTAL (default ON, graduated).
 * When OFF, returns K=60 for all intents without running the sweep.
 *
 * @param queries - Judged queries to evaluate
 * @returns Per-intent best-K selections and global best-K
 */
declare function runJudgedKSweep(queries: JudgedQuery[]): JudgedKSweepResult;
export { analyzeKValueSensitivity, analyzeKValueSensitivityBatch, formatKValueReport, kendallTau, mrr5, K_VALUES, BASELINE_K, computeNdcgAtK, computeMrrAtK, argmaxK, optimizeKValuesByIntent, resolveOptimalRrfK, JUDGED_K_SWEEP_VALUES, computeNdcg10, computeMrr5Judged, evalQueriesAtK, argmaxNdcg10, runJudgedKSweep, isKExperimentalEnabled, };
export type { KValueMetrics, KValueAnalysisResult, KValueReport, IntentKOptimizationQuery, IntentClass, JudgedQuery, JudgedKMetrics, BestKPerIntent, JudgedKSweepResult, };
//# sourceMappingURL=k-value-analysis.d.ts.map