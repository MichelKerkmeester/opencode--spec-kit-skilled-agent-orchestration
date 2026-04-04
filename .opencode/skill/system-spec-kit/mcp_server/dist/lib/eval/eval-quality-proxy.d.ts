/** Default latency target in milliseconds. */
declare const DEFAULT_LATENCY_TARGET_MS = 500;
/** Weights for each component — must sum to 1.0. */
declare const WEIGHTS: {
    readonly avgRelevance: 0.4;
    readonly topResult: 0.25;
    readonly countSaturation: 0.2;
    readonly latencyPenalty: 0.15;
};
/** Input parameters for the quality proxy computation. */
export interface QualityProxyInput {
    /**
     * Average relevance score of returned results.
     * Should be normalised to [0, 1] — typically avgRelevance / 3
     * when raw relevance is on a 0-3 scale.
     */
    avgRelevance: number;
    /**
     * Relevance of the top result (rank 1).
     * Should be normalised to [0, 1] — typically relevance / 3
     * when raw relevance is on a 0-3 scale.
     */
    topResultRelevance: number;
    /** Number of results actually returned by the search. */
    resultCount: number;
    /**
     * Expected / desired number of results (e.g. the limit parameter
     * passed to the search call).
     * Must be > 0 to avoid division by zero; defaults to 1 when ≤ 0.
     */
    expectedCount: number;
    /** Actual search latency in milliseconds. */
    latencyMs: number;
    /**
     * Target latency in milliseconds.
     * Defaults to 500 ms when omitted or ≤ 0.
     */
    latencyTargetMs?: number;
}
/** Breakdown of each component's weighted contribution. */
export interface QualityProxyComponents {
    /** avgRelevance × 0.40 */
    avgRelevance: number;
    /** topResultRelevance × 0.25 */
    topResult: number;
    /** countSaturation × 0.20 */
    countSaturation: number;
    /** latencyScore × 0.15 */
    latencyPenalty: number;
}
/** Result of the quality proxy computation. */
export interface QualityProxyResult {
    /** Composite quality score in [0, 1]. */
    score: number;
    /** Weighted contribution of each individual component. */
    components: QualityProxyComponents;
    /** Human-readable quality tier: 'excellent' | 'good' | 'acceptable' | 'poor'. */
    interpretation: 'excellent' | 'good' | 'acceptable' | 'poor';
}
/**
 * Compute the quality proxy score for a single search result set.
 *
 * All four components are normalised to [0, 1] before weighting:
 *
 *   avgRelevance    — direct pass-through (caller normalises to [0,1])
 *   topResult       — direct pass-through (caller normalises to [0,1])
 *   countSaturation — min(1, resultCount / expectedCount)
 *   latencyPenalty  — max(0, 1 − latencyMs / latencyTargetMs)
 *
 * The final score is clamped to [0, 1] to guard against floating-point
 * rounding errors.
 *
 * @returns QualityProxyResult with composite score, per-component
 *          weighted contributions, and a human-readable interpretation.
 */
export declare function computeQualityProxy(input: QualityProxyInput): QualityProxyResult;
export { WEIGHTS, DEFAULT_LATENCY_TARGET_MS };
//# sourceMappingURL=eval-quality-proxy.d.ts.map