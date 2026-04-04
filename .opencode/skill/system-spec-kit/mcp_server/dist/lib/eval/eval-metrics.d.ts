/** A single retrieved result from a search query. */
export interface EvalResult {
    /** Unique memory identifier. */
    memoryId: number;
    /** Retrieval score assigned by the search system. */
    score: number;
    /** 1-based rank position in the result list. */
    rank: number;
}
/** A single ground truth relevance judgment for a query-memory pair. */
export interface GroundTruthEntry {
    /** Identifier of the query this judgment belongs to. */
    queryId: number;
    /** Unique memory identifier. */
    memoryId: number;
    /**
     * Relevance grade:
     *   0 = not relevant
     *   1 = partially relevant
     *   2 = relevant
     *   3 = highly relevant
     */
    relevance: number;
    /** Optional importance tier (e.g. 'constitutional', 'critical', 'important', 'normal'). */
    tier?: string;
    /** Optional creation timestamp for cold-start detection. */
    createdAt?: Date;
}
/** All computed metrics returned by computeAllMetrics(). */
export interface AllMetrics {
    mrr: number;
    ndcg: number;
    recall: number;
    hitRate: number;
    inversionRate: number;
    constitutionalSurfacingRate: number;
    importanceWeightedRecall: number;
    coldStartDetectionRate: number;
    precision: number;
    f1: number;
    map: number;
    intentWeightedNdcg: number;
}
/**
 * Mean Reciprocal Rank at K (default K=5).
 *
 * For each query: find rank of first relevant result in top-K,
 * take 1/rank. If no relevant result in top-K, contribution = 0.
 * Average across all queries (treated as single query here since
 * results are pre-filtered per call).
 *
 * @returns Value in [0, 1]. Returns 0 for empty inputs.
 */
export declare function computeMRR(results: EvalResult[], groundTruth: GroundTruthEntry[], k?: number): number;
/**
 * Normalized Discounted Cumulative Gain at K (default K=10).
 *
 * DCG  = sum(relevance_i / log2(i+2)) for i in 0..K-1 (0-indexed)
 * IDCG = DCG of ideal ranking (relevance sorted descending)
 * NDCG = DCG / IDCG
 *
 * @returns Value in [0, 1]. Returns 0 for empty inputs or zero IDCG.
 */
export declare function computeNDCG(results: EvalResult[], groundTruth: GroundTruthEntry[], k?: number): number;
/**
 * Recall at K (default K=20).
 *
 * What fraction of all relevant memories (relevance > 0) in ground
 * truth appear in the top-K results?
 *
 * @returns Value in [0, 1]. Returns 0 when no relevant items exist.
 */
export declare function computeRecall(results: EvalResult[], groundTruth: GroundTruthEntry[], k?: number): number;
/**
 * Compute Precision@K — fraction of retrieved results that are relevant.
 * Precision = |relevant ∩ retrieved@K| / K
 */
export declare function computePrecision(results: EvalResult[], groundTruth: GroundTruthEntry[], k?: number): number;
/**
 * Compute F1@K — harmonic mean of Precision@K and Recall@K.
 * F1 = 2 * (P * R) / (P + R), or 0 if both are 0.
 */
export declare function computeF1(results: EvalResult[], groundTruth: GroundTruthEntry[], k?: number): number;
/**
 * Mean Average Precision (MAP).
 *
 * AP = (1 / |relevant|) × Σ(Precision@k × rel(k)) for k = 1..K
 * where rel(k) is 1 if the k-th result is relevant, 0 otherwise.
 *
 * MAP is the mean of AP across queries (single query here since
 * results are pre-filtered per call).
 *
 * @param results - Retrieved results for the query.
 * @param groundTruth - Ground truth relevance judgments.
 * @param k - Cutoff. Defaults to 20.
 * @returns Value in [0, 1]. Returns 0 for empty inputs.
 */
export declare function computeMAP(results: EvalResult[], groundTruth: GroundTruthEntry[], k?: number): number;
/**
 * Hit Rate at K (default K=1).
 *
 * Binary: is the top-K result relevant? Returns 1 if any of the top-K
 * results are relevant, 0 otherwise. Designed as Hit Rate@1 by default.
 *
 * @returns 0 or 1. Returns 0 for empty inputs.
 */
export declare function computeHitRate(results: EvalResult[], groundTruth: GroundTruthEntry[], k?: number): number;
/**
 * T006a: Inversion Rate.
 *
 * Counts pairwise ranking inversions versus ground truth relevance
 * ordering. A pair (i, j) is inverted when result at rank i has
 * lower relevance than result at rank j (i < j).
 *
 * Normalized by the total number of pairs so the result is in [0, 1].
 * Lower is better (0 = perfect ordering, 1 = fully inverted).
 *
 * @returns Value in [0, 1]. Returns 0 for fewer than 2 results.
 */
export declare function computeInversionRate(results: EvalResult[], groundTruth: GroundTruthEntry[]): number;
/**
 * T006b: Constitutional Surfacing Rate.
 *
 * Percentage of queries where constitutional-tier memories appear
 * in the top-K results.
 *
 * Since this function operates on a single query's results, it returns
 * 1 if ANY constitutional memory appears in top-K, 0 otherwise.
 *
 * @param results          Retrieved results for the query.
 * @param constitutionalIds Memory IDs that are constitutional tier.
 * @param k                Top-K cutoff (default 5).
 * @returns 0 or 1. Returns 0 when constitutionalIds is empty.
 */
export declare function computeConstitutionalSurfacingRate(results: EvalResult[], constitutionalIds: number[], k?: number): number;
/**
 * T006c: Importance-Weighted Recall.
 *
 * Recall@K but each relevant item is weighted by its tier:
 *   constitutional = 3x, critical = 2x, important = 1.5x, normal = 1x
 *
 * @param results      Retrieved results.
 * @param groundTruth  Ground truth with optional tier field.
 * @param tierWeights  Override default tier weights.
 * @param k            Top-K cutoff (default 20).
 * @returns Value in [0, 1]. Returns 0 when no relevant items exist.
 */
export declare function computeImportanceWeightedRecall(results: EvalResult[], groundTruth: GroundTruthEntry[], tierWeights?: Record<string, number>, k?: number): number;
/**
 * T006d: Cold-Start Detection Rate.
 *
 * Percentage of queries where recently created memories (< cutoffHours
 * old at query time) surface in top-K when they are relevant.
 *
 * Returns 1 if at least one recent relevant memory appears in top-K,
 * 0 otherwise. Returns 0 when no recent relevant memories exist in
 * ground truth (metric is not applicable).
 *
 * @param results            Retrieved results.
 * @param groundTruth        Ground truth entries.
 * @param memoryTimestamps   Map from memoryId → creation Date.
 * @param cutoffHours        Age threshold in hours (default 48).
 * @returns 0 or 1. Returns 0 when no cold-start candidates exist.
 */
export declare function computeColdStartDetectionRate(results: EvalResult[], groundTruth: GroundTruthEntry[], memoryTimestamps: Record<number, Date>, cutoffHours?: number, k?: number, evaluatedAt?: number): number;
/**
 * T006e: Intent-Weighted NDCG.
 *
 * NDCG@K but relevance grades are scaled by intent-type-specific
 * multipliers. Different intent types weight relevance differently:
 *
 *   add_feature     — boosts highly relevant (3x) over partial (1x)
 *   fix_bug         — heavily boosts highly relevant (4x), penalizes partial
 *   refactor        — balanced, slight boost for high relevance
 *   security_audit  — maximum boost for highly relevant (5x), zero for partial
 *   understand      — progressive, rewards all grades
 *   find_spec       — rewards exact matches heavily (3x), moderate partial
 *   find_decision   — similar to find_spec with slight differentiation
 *
 * The intent multiplier is applied to relevance before NDCG calculation.
 * Final score is still normalized to [0, 1].
 *
 * @param results     Retrieved results.
 * @param groundTruth Ground truth entries.
 * @param intentType  One of the 7 known intent types.
 * @param k           Top-K cutoff (default 10).
 * @returns Value in [0, 1]. Returns 0 for empty inputs.
 */
export declare function computeIntentWeightedNDCG(results: EvalResult[], groundTruth: GroundTruthEntry[], intentType: string, k?: number): number;
/**
 * Compute all 12 metrics (7 core + 5 diagnostic) in one call.
 *
 * @param params.results             Retrieved results for the query.
 * @param params.groundTruth         Ground truth relevance judgments.
 * @param params.constitutionalIds   Memory IDs that are constitutional tier.
 * @param params.memoryTimestamps    Map from memoryId → creation Date.
 * @param params.intentType          Intent type for intent-weighted NDCG.
 * @param params.evaluatedAt         Optional query-time timestamp for cold-start checks.
 * @returns Record mapping metric name to computed value in [0, 1].
 */
export declare function computeAllMetrics(params: {
    results: EvalResult[];
    groundTruth: GroundTruthEntry[];
    constitutionalIds?: number[];
    memoryTimestamps?: Record<number, Date>;
    intentType?: string;
    evaluatedAt?: number;
}): AllMetrics;
//# sourceMappingURL=eval-metrics.d.ts.map