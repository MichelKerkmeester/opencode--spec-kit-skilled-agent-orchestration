/** A single scored result from either production or shadow path. */
export interface ScoredResult {
    /** Memory ID. */
    memoryId: number;
    /** Score assigned by the scoring algorithm. */
    score: number;
    /** 1-based rank position. */
    rank: number;
}
/**
 * Configuration for shadow scoring.
 * The shadowScoringFn receives the query and production results and
 * must return an alternate scored/ranked result list.
 */
export interface ShadowConfig {
    /** Human-readable name for this shadow algorithm (e.g. "rrf-v2", "weighted-bm25"). */
    algorithmName: string;
    /**
     * The alternative scoring function to run in shadow mode.
     * Receives the raw query and a copy of production results (read-only).
     * Must return a new array of ScoredResult — must NOT mutate the input.
     */
    shadowScoringFn: (query: string, productionResults: ScoredResult[]) => ScoredResult[] | Promise<ScoredResult[]>;
    /** Optional metadata to attach to comparison logs. */
    metadata?: Record<string, unknown>;
}
/** Per-result comparison between production and shadow scores. */
export interface ResultDelta {
    memoryId: number;
    productionScore: number;
    productionRank: number;
    shadowScore: number;
    shadowRank: number;
    /** shadow score - production score */
    scoreDelta: number;
    /** shadow rank - production rank (negative = promoted in shadow) */
    rankDelta: number;
}
/** Comparison metrics between production and shadow scoring. */
export interface ShadowComparison {
    /** ISO timestamp of the comparison. */
    timestamp: string;
    /** The query that was scored. */
    query: string;
    /** Name of the shadow algorithm. */
    algorithmName: string;
    /** Per-result deltas. */
    deltas: ResultDelta[];
    /** Summary statistics. */
    summary: ShadowComparisonSummary;
    /** Optional metadata. */
    metadata?: Record<string, unknown>;
}
/** Summary statistics for a shadow comparison. */
export interface ShadowComparisonSummary {
    /** Number of results in production. */
    productionCount: number;
    /** Number of results in shadow. */
    shadowCount: number;
    /** Number of results that appear in both. */
    overlapCount: number;
    /** Mean absolute score delta across overlapping results. */
    meanAbsScoreDelta: number;
    /** Mean absolute rank delta across overlapping results. */
    meanAbsRankDelta: number;
    /** Kendall tau-like rank correlation (1 = same order, -1 = reversed). */
    rankCorrelation: number;
    /** IDs only in production (not in shadow). */
    productionOnlyIds: number[];
    /** IDs only in shadow (not in production). */
    shadowOnlyIds: number[];
}
/** Aggregated shadow scoring statistics over a time range. */
export interface ShadowStats {
    /** Total number of shadow comparisons logged. */
    totalComparisons: number;
    /** Distinct algorithm names used. */
    algorithms: string[];
    /** Average rank correlation across all comparisons. */
    avgRankCorrelation: number;
    /** Average mean absolute score delta. */
    avgMeanAbsScoreDelta: number;
    /** Average overlap count. */
    avgOverlapCount: number;
    /** Time range of the data. */
    timeRange: {
        earliest: string;
        latest: string;
    };
}
/**
 * Reset hook retained for test compatibility.
 */
export declare function _resetSchemaFlag(): void;
/**
 * Run an alternative scoring algorithm in shadow mode alongside production results.
 *
 * Shadow scoring runtime is retired. The SPECKIT_SHADOW_SCORING flag is retained
 * for compatibility only, so this returns null without running the shadow function.
 *
 * CRITICAL: Shadow scoring must NEVER affect production search results.
 *
 * @param query - The search query.
 * @param productionResults - The production scoring results (will NOT be modified).
 * @param shadowConfig - Configuration including the shadow scoring function.
 * @returns ShadowComparison when enabled and successful, null when disabled or on error.
 * @deprecated Shadow scoring runtime is retired; this always returns null.
 */
export declare function runShadowScoring(query: string, productionResults: ScoredResult[], shadowConfig: ShadowConfig): Promise<ShadowComparison | null>;
/**
 * Compute comparison metrics between production and shadow results.
 *
 * This comparison function is always available (not gated by SPECKIT_SHADOW_SCORING)
 * since it is a pure computation with no side effects.
 *
 * @param query - The original search query.
 * @param production - Production scored results.
 * @param shadow - Shadow scored results.
 * @param algorithmName - Name of the shadow algorithm.
 * @param metadata - Optional metadata.
 * @returns ShadowComparison with deltas and summary statistics.
 */
export declare function compareShadowResults(query: string, production: ScoredResult[], shadow: ScoredResult[], algorithmName: string, metadata?: Record<string, unknown>): ShadowComparison;
/**
 * Persist a shadow comparison to the eval database.
 *
 * Shadow scoring runtime is retired. The SPECKIT_SHADOW_SCORING flag is retained
 * for compatibility only, so this returns false immediately without writing.
 *
 * @param comparison - The ShadowComparison to persist.
 * @returns true if persisted, false if disabled or on error.
 * @deprecated Shadow scoring persistence is retired; this always returns false.
 */
export declare function logShadowComparison(comparison: ShadowComparison): boolean;
/**
 * Retrieve aggregated shadow scoring statistics over an optional time range.
 *
 * The retired SPECKIT_SHADOW_SCORING flag no longer enables write paths, so the
 * zero-case object is returned unless historical rows already exist in the table.
 *
 * @param timeRange - Optional ISO timestamp bounds. Omit for all data.
 * @returns ShadowStats with aggregated metrics, or null on error.
 */
export declare function getShadowStats(timeRange?: {
    start?: string;
    end?: string;
}): ShadowStats | null;
//# sourceMappingURL=shadow-scoring.d.ts.map