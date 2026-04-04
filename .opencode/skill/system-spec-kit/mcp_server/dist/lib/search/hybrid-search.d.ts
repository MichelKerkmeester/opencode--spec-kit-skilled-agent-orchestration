import type { GraphSearchFn } from './search-types.js';
export type { GraphSearchFn } from './search-types.js';
import { routeQuery } from './query-router.js';
import { getDynamicTokenBudget, isDynamicTokenBudgetEnabled } from './dynamic-token-budget.js';
import type Database from 'better-sqlite3';
type VectorSearchFn = (embedding: Float32Array | number[], options: Record<string, unknown>) => Array<Record<string, unknown>>;
interface HybridSearchOptions {
    limit?: number;
    specFolder?: string;
    minSimilarity?: number;
    useBm25?: boolean;
    useFts?: boolean;
    useVector?: boolean;
    useGraph?: boolean;
    includeArchived?: boolean;
    includeContent?: boolean;
    /**
     * Evaluation-only mode.
     * When true, preserve the requested top-K window by bypassing confidence
     * truncation and token-budget truncation without changing live defaults.
     */
    evaluationMode?: boolean;
    /** Classified query intent for adaptive fusion weight selection (e.g. 'understand', 'fix_bug'). */
    intent?: string;
    /** Optional trigger phrases for query-classifier trigger-match routing path. */
    triggerPhrases?: string[];
    /**
     * Internal fallback override: when true, bypass complexity routing and
     * enable all retrieval channels for this search call.
     */
    forceAllChannels?: boolean;
    /**
     * Internal raw-candidate mode used by the Stage 1 pipeline.
     * When true, stop after channel collection and return pre-fusion candidates.
     */
    skipFusion?: boolean;
    /**
     * Internal pipeline handoff mode.
     * When true, return immediately after adaptive/RRF fusion so Stage 2/3 can
     * apply the remaining pipeline scoring and aggregation steps.
     */
    stopAfterFusion?: boolean;
}
interface HybridSearchResult {
    id: number | string;
    /**
     * Normalized relevance score (0-1). Semantics depend on `source`:
     * - `'vector'` — cosine similarity from sqlite-vec (normalized from 0-100 to 0-1)
     * - `'bm25'` — BM25 term-frequency relevance (min-max normalized per source group)
     * - `'fts'` — FTS5 rank score (absolute value, min-max normalized per source group)
     * - `'graph'` — graph traversal relevance
     *
     * After hybrid merge, all source scores are min-max normalized to 0-1 within
     * their source group to ensure fair cross-method comparison (see P3-02 fix).
     */
    score: number;
    source: string;
    title?: string;
    [key: string]: unknown;
}
/**
 * Optional metadata about pipeline stages attached to enhanced search results.
 * Only populated when the corresponding feature flags are enabled.
 */
interface Sprint3PipelineMeta {
    /** Query complexity routing result (SPECKIT_COMPLEXITY_ROUTER). */
    routing?: {
        tier: string;
        channels: string[];
        skippedChannels: string[];
        featureFlagEnabled: boolean;
        confidence: string;
        features: Record<string, unknown>;
    };
    /** Channel enforcement result (SPECKIT_CHANNEL_MIN_REP). */
    enforcement?: {
        applied: boolean;
        promotedCount: number;
        underRepresentedChannels: string[];
    };
    /** Confidence truncation result (SPECKIT_CONFIDENCE_TRUNCATION). */
    truncation?: {
        truncated: boolean;
        originalCount: number;
        truncatedCount: number;
        medianGap: number;
        cutoffGap: number;
        cutoffIndex: number;
        thresholdMultiplier: number;
        minResultsGuaranteed: number;
        featureFlagEnabled: boolean;
    };
    /** Dynamic token budget result (SPECKIT_DYNAMIC_TOKEN_BUDGET). */
    tokenBudget?: {
        tier: string;
        budget: number;
        applied: boolean;
        featureFlagEnabled: boolean;
        configValues: Record<string, number>;
        headerOverhead: number;
        adjustedBudget: number;
    };
}
/** Fallback tier in the 3-tier degradation chain. */
type FallbackTier = 1 | 2 | 3;
/** Why degradation was triggered at a given tier. */
interface DegradationTrigger {
    reason: 'low_quality' | 'insufficient_results' | 'both';
    topScore: number;
    resultCount: number;
    relativeGap?: number;
}
/** Record of a single degradation event during tiered fallback. */
interface DegradationEvent {
    tier: FallbackTier;
    trigger: DegradationTrigger;
    resultCountBefore: number;
    resultCountAfter: number;
}
/**
 * Absolute quality floor for degradation checks.
 *
 * Raw RRF scores are typically small decimals (often <0.05), so a
 * high fixed threshold causes false degradations. Use a conservative floor and
 * pair it with a relative-gap check to avoid score-scale coupling.
 */
declare const DEGRADATION_QUALITY_THRESHOLD = 0.02;
/** Minimum result count: must have >= this many results to stay at current tier. */
declare const DEGRADATION_MIN_RESULTS = 3;
interface GraphChannelMetrics {
    totalQueries: number;
    graphHits: number;
    graphOnlyResults: number;
    multiSourceResults: number;
}
/**
 * Return current graph channel metrics for health check reporting.
 * graphHitRate is computed as graphHits / totalQueries.
 */
declare function getGraphMetrics(): GraphChannelMetrics & {
    graphHitRate: number;
};
/** Reset all graph channel metrics counters to zero. */
declare function resetGraphMetrics(): void;
/**
 * Initialize hybrid search with database, vector search, and optional graph search dependencies.
 * @param database - The better-sqlite3 database instance for FTS and graph queries.
 * @param vectorFn - Optional vector search function for semantic similarity.
 * @param graphFn - Optional graph search function for causal/structural retrieval.
 */
declare function init(database: Database.Database, vectorFn?: VectorSearchFn | null, graphFn?: GraphSearchFn | null): void;
/**
 * Search the BM25 index with optional spec folder filtering.
 * @param query - The search query string.
 * @param options - Optional limit and specFolder filter.
 * @returns Array of BM25-scored results tagged with source 'bm25'.
 */
declare function bm25Search(query: string, options?: {
    limit?: number;
    specFolder?: string;
}): HybridSearchResult[];
/**
 * Check whether the BM25 index is populated and available for search.
 * @returns True if the BM25 index exists and contains at least one document.
 */
declare function isBm25Available(): boolean;
/**
 * Check whether the FTS5 full-text search table exists in the database.
 * @returns True if the memory_fts table exists in the connected database.
 */
declare function isFtsAvailable(): boolean;
/**
 * Run FTS5 full-text search with weighted BM25 scoring and optional spec folder filtering.
 * @param query - The search query string.
 * @param options - Optional limit, specFolder filter, and includeArchived flag.
 * @returns Array of FTS-scored results tagged with source 'fts'.
 */
declare function ftsSearch(query: string, options?: {
    limit?: number;
    specFolder?: string;
    includeArchived?: boolean;
}): HybridSearchResult[];
/**
 * Merge FTS and BM25 search results, deduplicating by ID and preferring FTS scores.
 * @param query - The search query string.
 * @param options - Optional limit, specFolder filter, and includeArchived flag.
 * @returns Deduplicated array of merged results sorted by score descending.
 */
declare function combinedLexicalSearch(query: string, options?: {
    limit?: number;
    specFolder?: string;
    includeArchived?: boolean;
}): HybridSearchResult[];
declare function mergeRawCandidate(existing: HybridSearchResult | undefined, incoming: HybridSearchResult): HybridSearchResult;
/**
 * Run multi-channel hybrid search combining vector, FTS, BM25, and graph results with per-source normalization.
 * Prefer hybridSearchEnhanced() or searchWithFallback() instead. This function uses naive per-source
 * min-max normalization which produces different orderings than the RRF pipeline in hybridSearchEnhanced().
 * Retained as internal fallback only.
 */
declare function hybridSearch(query: string, embedding: Float32Array | number[] | null, options?: HybridSearchOptions): Promise<HybridSearchResult[]>;
/**
 * Enhanced hybrid search with RRF fusion.
 * All search channels use synchronous better-sqlite3; sequential execution
 * is correct — Promise.all would add overhead without achieving parallelism.
 */
declare function hybridSearchEnhanced(query: string, embedding: Float32Array | number[] | null, options?: HybridSearchOptions): Promise<HybridSearchResult[]>;
/**
 * Collect pipeline candidates through the adaptive fallback chain, returning
 * immediately after intra-query fusion and before downstream aggregation,
 * reranking, or post-processing.
 *
 * @param query - The search query string.
 * @param embedding - Optional embedding vector for semantic search.
 * @param options - Hybrid search configuration options.
 * @returns Unfused candidate results from the first non-empty collection stage.
 */
declare function collectRawCandidates(query: string, embedding: Float32Array | number[] | null, options?: HybridSearchOptions): Promise<HybridSearchResult[]>;
/**
 * Search with automatic fallback chain.
 * When SPECKIT_SEARCH_FALLBACK=true: delegates to the 3-tier quality-aware
 * fallback (searchWithFallbackTiered). Otherwise: C138-P0 two-pass adaptive
 * fallback — primary at minSimilarity=30, retry at 17.
 *
 * @param query - The search query string.
 * @param embedding - Optional embedding vector for semantic search.
 * @param options - Hybrid search configuration options.
 * @returns Results from the first non-empty stage.
 */
declare function searchWithFallback(query: string, embedding: Float32Array | number[] | null, options?: HybridSearchOptions): Promise<HybridSearchResult[]>;
/**
 * PI-A2: Last-resort structural search against the memory_index table.
 * Retrieves memories ordered by importance tier and weight, without
 * requiring embeddings or text similarity. Pure SQL fallback.
 *
 * @param options - Search options (specFolder for filtering, limit for cap).
 * @returns Array of HybridSearchResult with source='structural'.
 */
declare function structuralSearch(options?: Pick<HybridSearchOptions, 'specFolder' | 'limit'>): HybridSearchResult[];
/**
 * Normalize result IDs to a canonical key used for deduplication and source tracking.
 * Handles number-vs-string drift (`42` vs `"42"`) and legacy `mem:42` forms.
 */
declare function canonicalResultId(id: number | string): string;
declare function truncateChars(input: string, maxChars: number): string;
declare function extractSpecSegments(filePath: string): {
    left: string;
    right: string;
    tailKey: string;
} | null;
declare function injectContextualTree(row: HybridSearchResult, descCache: Map<string, string>): HybridSearchResult;
/** Apply caller limit after merges that can expand result count. */
declare function applyResultLimit(results: HybridSearchResult[], limit?: number): HybridSearchResult[];
/**
 * Keep Tier 3 structural fallback scores below established Tier 1/2 confidence.
 * Prevents structural placeholders from outranking stronger semantic/lexical hits.
 */
declare function calibrateTier3Scores(existing: HybridSearchResult[], tier3: HybridSearchResult[]): HybridSearchResult[];
/**
 * Evaluate whether results meet quality thresholds.
 * Returns null if thresholds are met, or a DegradationTrigger if not.
 */
declare function checkDegradation(results: HybridSearchResult[]): DegradationTrigger | null;
/**
 * Merge two result arrays, deduplicating by id and keeping the higher score.
 */
declare function mergeResults(existing: HybridSearchResult[], incoming: HybridSearchResult[]): HybridSearchResult[];
/** Default token budget — configurable via SPECKIT_TOKEN_BUDGET env var. */
declare const DEFAULT_TOKEN_BUDGET = 2000;
/** Maximum characters for a summary fallback when a single result overflows the budget. */
declare const SUMMARY_MAX_CHARS = 400;
/** Overflow log entry recording budget truncation events for eval infrastructure. */
interface OverflowLogEntry {
    queryId: string;
    candidateCount: number;
    totalTokens: number;
    budgetLimit: number;
    truncatedToCount: number;
    timestamp: string;
}
/** Result of budget-aware truncation. */
interface TruncateToBudgetResult {
    results: HybridSearchResult[];
    truncated: boolean;
    overflow?: OverflowLogEntry;
}
/**
 * Estimate token count for a text string using a chars/4 heuristic.
 * @param text - The text to estimate tokens for.
 * @returns Approximate token count (ceiling of length / 4).
 */
declare function estimateTokenCount(text: string): number;
/**
 * Estimate the token footprint of a single HybridSearchResult.
 * @param result - The search result to measure.
 * @returns Approximate token count based on serialized key-value lengths.
 */
declare function estimateResultTokens(result: HybridSearchResult): number;
/**
 * Read the configured token budget from SPECKIT_TOKEN_BUDGET env var,
 * falling back to DEFAULT_TOKEN_BUDGET (2000).
 * @returns The effective token budget for result truncation.
 */
declare function getTokenBudget(): number;
/**
 * Truncate a result set to fit within a token budget using greedy highest-scoring-first strategy.
 * @param results - The full result set to truncate.
 * @param budget - Optional token budget override (defaults to SPECKIT_TOKEN_BUDGET env / 2000).
 * @param options - Optional includeContent flag and queryId for overflow logging.
 * @returns Object with truncated results, truncation flag, and optional overflow log entry.
 */
declare function truncateToBudget(results: HybridSearchResult[], budget?: number, options?: {
    includeContent?: boolean;
    queryId?: string;
}): TruncateToBudgetResult;
export declare const __testables: {
    canonicalResultId: typeof canonicalResultId;
    truncateChars: typeof truncateChars;
    extractSpecSegments: typeof extractSpecSegments;
    injectContextualTree: typeof injectContextualTree;
    applyResultLimit: typeof applyResultLimit;
    calibrateTier3Scores: typeof calibrateTier3Scores;
    checkDegradation: typeof checkDegradation;
    mergeResults: typeof mergeResults;
    mergeRawCandidate: typeof mergeRawCandidate;
};
export { init, bm25Search, isBm25Available, combinedLexicalSearch, collectRawCandidates, isFtsAvailable, ftsSearch, hybridSearch, hybridSearchEnhanced, searchWithFallback, getGraphMetrics, resetGraphMetrics, estimateTokenCount, estimateResultTokens, truncateToBudget, getTokenBudget, DEFAULT_TOKEN_BUDGET, SUMMARY_MAX_CHARS, routeQuery, getDynamicTokenBudget, isDynamicTokenBudgetEnabled, structuralSearch, DEGRADATION_QUALITY_THRESHOLD, DEGRADATION_MIN_RESULTS, };
export type { HybridSearchOptions, HybridSearchResult, VectorSearchFn, OverflowLogEntry, TruncateToBudgetResult, Sprint3PipelineMeta, DegradationEvent, FallbackTier, };
//# sourceMappingURL=hybrid-search.d.ts.map