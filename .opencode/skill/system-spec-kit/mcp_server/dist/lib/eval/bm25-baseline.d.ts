import type Database from 'better-sqlite3';
/** Configuration options for the BM25 baseline runner. */
export interface BM25BaselineConfig {
    /** Maximum number of queries to run. Defaults to all 110. */
    queryLimit?: number;
    /** Top-K cutoff for NDCG and Recall metrics. MRR always uses k=5 for contingency compatibility. */
    k?: number;
    /** Exclude hard-negative queries from the run. Default: false. */
    skipHardNegatives?: boolean;
}
/** Metrics produced by a single BM25 baseline run. */
export interface BM25BaselineMetrics {
    mrr5: number;
    /** NDCG at configured K (default 10). Named ndcg10 for backwards compatibility. */
    ndcg10: number;
    /** Recall at configured K (default 20). Named recall20 for backwards compatibility. */
    recall20: number;
    hitRate1: number;
}
/** Full result returned by runBM25Baseline(). */
export interface BM25BaselineResult {
    metrics: BM25BaselineMetrics;
    queryCount: number;
    timestamp: string;
    contingencyDecision: ContingencyDecision;
    /** Per-query MRR@5 values for bootstrap CI computation. */
    perQueryMRR?: number[];
    /** Bootstrap 95% CI for MRR@5 (computed if perQueryMRR available). */
    bootstrapCI?: BootstrapCIResult;
}
/** Decision produced by evaluateContingency() or evaluateContingencyRelative(). */
export interface ContingencyDecision {
    /** The MRR@5 value used to derive the decision. */
    bm25MRR: number;
    /** Human-readable threshold band: '>=0.8' | '0.5-0.8' | '<0.5'. */
    threshold: string;
    /** Gate action: 'PAUSE' | 'RATIONALIZE' | 'PROCEED'. */
    action: 'PAUSE' | 'RATIONALIZE' | 'PROCEED';
    /** Plain-language interpretation for humans reading the exit gate report. */
    interpretation: string;
    /** Comparison mode: 'absolute' (the rollout) or 'relative' (the original rollout+). */
    mode?: 'absolute' | 'relative';
    /** Hybrid MRR@5 used as reference (relative mode only). */
    hybridMRR?: number;
    /** BM25/hybrid ratio (relative mode only). */
    ratio?: number;
}
/**
 * A single search result as returned by the injected BM25 search function.
 * Mirrors the shape used in hybrid-search.ts so callers can reuse the same
 * function reference.
 */
export interface BM25SearchResult {
    /** Memory ID (numeric). */
    id: number;
    /** Retrieval score (raw BM25 / FTS5 rank). */
    score: number;
    /** Source channel identifier. Expected: 'bm25' or 'fts'. */
    source: string;
}
/**
 * A relevance judgment loaded from eval_ground_truth for a single query.
 * Used to evaluate results returned by the injected search function.
 */
export interface QueryGroundTruth {
    queryId: number;
    memoryId: number;
    relevance: number;
}
/**
 * Injected BM25-only search function signature.
 *
 * The function receives the query text and a limit and must return results
 * using ONLY the BM25/FTS5 channel (vector, graph, trigger disabled).
 * For production use, wire up the FTS5 path from hybrid-search with all
 * other channels explicitly disabled.
 */
export type BM25SearchFn = (query: string, limit: number) => BM25SearchResult[] | Promise<BM25SearchResult[]>;
/**
 * Evaluate the BM25 MRR@5 value against the contingency decision matrix.
 *
 * Matrix:
 *   MRR@5 >= 0.80 → PAUSE
 *     BM25 alone is very strong — semantic/graph additions may not
 *     justify the added complexity. Evaluate whether the multi-channel
 *     architecture is warranted before proceeding.
 *
 *   MRR@5 0.50–0.79 → RATIONALIZE
 *     BM25 is moderate — semantic/graph channels must demonstrably
 *     improve over this baseline. Each additional channel needs
 *     positive delta evidence.
 *
 *   MRR@5 < 0.50 → PROCEED
 *     BM25 alone is weak — strong justification for multi-channel
 *     retrieval. Proceed with hybrid search implementation.
 *
 * @param bm25MRR - The measured MRR@5 value (must be in [0, 1]).
 * @returns ContingencyDecision with threshold label, action, and interpretation.
 */
export declare function evaluateContingency(bm25MRR: number): ContingencyDecision;
/**
 * Evaluate BM25 performance relative to hybrid MRR@5 (spec-compliant).
 *
 * The spec defines contingency thresholds as ratios:
 *   ratio = bm25MRR / hybridMRR
 *
 *   ratio >= 0.80 → PAUSE
 *     BM25 achieves ≥80% of hybrid — multi-channel adds little value.
 *
 *   ratio 0.50–0.79 → RATIONALIZE
 *     BM25 achieves 50-79% of hybrid — channels need per-channel evidence.
 *
 *   ratio < 0.50 → PROCEED
 *     BM25 achieves <50% of hybrid — multi-channel clearly justified.
 *
 * @param bm25MRR   - BM25-only MRR@5 (must be in [0, 1]).
 * @param hybridMRR - Hybrid/multi-channel MRR@5 (must be in (0, 1]).
 * @returns ContingencyDecision with ratio, mode='relative', and interpretation.
 */
export declare function evaluateContingencyRelative(bm25MRR: number, hybridMRR: number): ContingencyDecision;
/** Result of bootstrap confidence interval computation. */
export interface BootstrapCIResult {
    /** Point estimate (mean MRR@5 across all queries). */
    pointEstimate: number;
    /** Lower bound of 95% CI. */
    ciLower: number;
    /** Upper bound of 95% CI. */
    ciUpper: number;
    /** CI width (ciUpper - ciLower). Narrower is more confident. */
    ciWidth: number;
    /** Number of bootstrap iterations. */
    iterations: number;
    /** Number of queries in the sample. */
    sampleSize: number;
    /** Whether the CI excludes the contingency threshold boundaries.
     *  true = the decision is statistically significant at p<0.05. */
    isSignificant: boolean;
    /** Which threshold boundary was tested. */
    testedBoundary: number;
}
/**
 * Compute bootstrap 95% confidence interval for MRR@5.
 *
 * Uses percentile bootstrap with 10,000 iterations (default).
 * Statistical significance is determined by whether the CI
 * excludes the nearest contingency threshold boundary.
 *
 * @param perQueryMRR - Array of per-query MRR@5 values (one per query).
 * @param iterations - Number of bootstrap iterations (default: 10000).
 * @returns BootstrapCIResult with CI bounds and significance.
 */
export declare function computeBootstrapCI(perQueryMRR: number[], iterations?: number): BootstrapCIResult;
/**
 * Record BM25 baseline metrics to the eval DB (eval_metric_snapshots table).
 *
 * Inserts one row per metric (mrr@5, ndcg@10, recall@20, hit_rate@1) plus
 * one metadata row containing the full contingency decision.
 *
 * Channel is recorded as 'bm25' to distinguish from multi-channel runs.
 *
 * @param evalDb - An initialized better-sqlite3 Database instance.
 * @param result - The BM25BaselineResult to persist.
 */
export declare function recordBaselineMetrics(evalDb: Database.Database, result: BM25BaselineResult): void;
/**
 * Run the BM25-only baseline measurement over the ground truth query set.
 *
 * IMPORTANT: This function requires a live, populated database to produce
 * meaningful metrics. The injected `searchFn` must return results from
 * the BM25/FTS5 path ONLY — vector, graph, and trigger channels must be
 * explicitly disabled before calling.
 *
 * For testing without a live DB, inject a mock `searchFn` that returns
 * deterministic results (see tests/bm25-baseline.vitest.ts).
 *
 * The ground truth relevance judgments use the dataset from T007
 * (ground-truth-data.ts) with real production memory IDs mapped via
 * multi-strategy FTS5 matching (scripts/map-ground-truth-ids.ts).
 * Each non-hard-negative query has 1-3 graded relevance entries
 * (grades 3=highly relevant, 2=relevant, 1=partial).
 *
 * @param searchFn - Injected BM25-only search function (dependency injection).
 * @param config   - Optional configuration overrides.
 * @returns        - BM25BaselineResult with metrics, timestamp, and contingency.
 */
export declare function runBM25Baseline(searchFn: BM25SearchFn, config?: BM25BaselineConfig): Promise<BM25BaselineResult>;
//# sourceMappingURL=bm25-baseline.d.ts.map