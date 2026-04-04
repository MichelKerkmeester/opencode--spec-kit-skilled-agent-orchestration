/** Direction of rank change for a single result. */
export type RankDirection = 'improved' | 'degraded' | 'unchanged';
/** Per-result rank delta between live and shadow ranking. */
export interface RankDelta {
    /** Opaque result identifier. */
    resultId: string;
    /** Position in the live ranking (1-based). */
    liveRank: number;
    /** Position in the shadow (learned-signals) ranking (1-based). */
    shadowRank: number;
    /** Signed delta: liveRank - shadowRank (positive = shadow improved). */
    delta: number;
    /** Classification of direction. */
    direction: RankDirection;
}
/** Metrics computed from a rank comparison. */
export interface RankComparisonMetrics {
    /** Kendall tau correlation coefficient in [-1, 1]. */
    kendallTau: number;
    /** NDCG delta: shadow NDCG@k minus live NDCG@k. */
    ndcgDelta: number;
    /** MRR delta: shadow MRR minus live MRR. */
    mrrDelta: number;
    /** Count of results that improved. */
    improvedCount: number;
    /** Count of results that degraded. */
    degradedCount: number;
    /** Count of results unchanged. */
    unchangedCount: number;
}
/** Full result of a rank comparison for one query. */
export interface RankComparisonResult {
    queryId: string;
    deltas: RankDelta[];
    metrics: RankComparisonMetrics;
}
/** A ranked item: result ID and its rank position. */
export interface RankedItem {
    resultId: string;
    rank: number;
    /** Optional relevance score (used for NDCG). */
    relevanceScore?: number;
}
/**
 * Classify the direction of a rank delta.
 *
 * "improved" means the result ranked higher in shadow (lower rank number).
 * delta = liveRank - shadowRank: positive means improvement.
 */
export declare function classifyDirection(delta: number): RankDirection;
/**
 * Compute Kendall tau rank correlation between two ordered lists.
 *
 * Only considers items present in both lists.
 * Returns 0 for lists with fewer than 2 overlapping items.
 *
 * @param liveRanks - Map from resultId to live rank
 * @param shadowRanks - Map from resultId to shadow rank
 * @returns Kendall tau in [-1, 1]
 */
export declare function computeKendallTau(liveRanks: Map<string, number>, shadowRanks: Map<string, number>): number;
/**
 * Compute NDCG@k for a ranked list given relevance scores.
 *
 * Uses the log2 discount: DCG = sum(rel_i / log2(rank_i + 1)).
 * NDCG = DCG / IDCG where IDCG uses the ideal ordering.
 *
 * Accepts sparse rankings with gaps. Missing positions are treated as
 * zero-relevance items in the production ranking.
 *
 * @param rankedItems - Items in rank order (rank 1 first)
 * @param k - Cutoff depth (default: rankedItems.length)
 * @returns NDCG in [0, 1]
 */
export declare function computeNDCG(rankedItems: RankedItem[], k?: number): number;
/**
 * Compute MRR (Mean Reciprocal Rank) for a single query.
 *
 * Returns 1/rank of the first relevant result (relevanceScore > 0),
 * or 0 if no relevant result is found.
 */
export declare function computeMRR(rankedItems: RankedItem[]): number;
/**
 * Compare live and shadow ranked lists for a single query.
 *
 * Computes per-result rank deltas and aggregate metrics including
 * Kendall tau correlation, NDCG delta, and MRR delta.
 *
 * @param queryId - Identifier for the query being evaluated
 * @param liveRanked - Results as ranked by the live system
 * @param shadowRanked - Results as ranked by shadow (learned-signals) system
 * @returns Full comparison result with deltas and metrics
 */
export declare function compareRanks(queryId: string, liveRanked: RankedItem[], shadowRanked: RankedItem[]): RankComparisonResult;
//# sourceMappingURL=rank-metrics.d.ts.map