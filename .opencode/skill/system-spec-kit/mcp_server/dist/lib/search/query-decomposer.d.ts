/** Maximum number of facets to extract from a multi-faceted query. */
export declare const MAX_FACETS = 3;
/** A single candidate pool from one search variant, tagged by query. */
export interface FacetPool<T extends {
    id: number;
}> {
    query: string;
    results: T[];
}
/**
 * Heuristic detection: does the query span multiple distinct facets?
 *
 * A query is considered multi-faceted when ANY of these hold:
 *   1. Contains a coordinating conjunction (AND / OR / also / …)
 *   2. Contains 2+ distinct wh-question words (what … how … / where … why …)
 *   3. Sentence-boundary split ('. ' or '? ' or '; ') yields 2+ fragments
 *      each with at least MIN_FRAGMENT_TOKEN_COUNT tokens
 *
 * Short queries (< MIN_QUERY_LENGTH_FOR_DECOMPOSITION chars) are never
 * multi-faceted — avoids false positives on "what and how".
 *
 * @param query - The input search query.
 * @returns True when the query is detected as multi-faceted.
 */
export declare function isMultiFacet(query: string): boolean;
/**
 * Split on coordinating conjunctions, returning non-empty fragments.
 * Uses a fresh regex instance to avoid stateful lastIndex issues.
 */
declare function splitOnConjunctions(query: string): string[];
/**
 * Split on sentence boundaries (.  ?  ;).
 */
declare function splitOnSentences(query: string): string[];
/**
 * Decompose a multi-faceted query into distinct sub-query facets.
 *
 * Strategy (applied in order, first non-trivial split wins):
 *   1. Split on coordinating conjunctions (and / or / also / …)
 *   2. Split on sentence boundaries (. ? ;)
 *
 * The result is capped at MAX_FACETS. Duplicate fragments are removed.
 * If splitting produces only the original query, an empty array is returned
 * (caller should not add facets when decomposition adds no value).
 *
 * @param query - The input search query.
 * @returns Array of distinct sub-query facets (max MAX_FACETS), possibly empty.
 */
export declare function decompose(query: string): string[];
/**
 * Merge result pools from multiple facet searches, prioritising items that
 * appear across the most facets (cross-facet coverage) and deduplicating by ID.
 *
 * Algorithm:
 *   1. Count how many pools each item ID appears in (coverage count).
 *   2. Sort all unique items: first by coverage (descending), then by their
 *      best score within any pool (descending).
 *   3. Return the deduplicated list.
 *
 * The "score" used for tie-breaking is resolved from `score`, `rrfScore`,
 * `similarity`, or 0 — mirroring the pipeline's resolveEffectiveScore logic.
 *
 * @param pools - Array of facet pools, each containing a query and results.
 * @returns Merged, deduplicated, coverage-ranked result array.
 */
export declare function mergeByFacetCoverage<T extends {
    id: number;
    score?: number;
    rrfScore?: number;
    similarity?: number;
}>(pools: FacetPool<T>[]): T[];
/**
 * Resolve a numeric score from a result item using the pipeline's fallback chain.
 * Handles both percentage similarity (>1) and fractional scores (0-1).
 */
declare function resolveItemScore(item: {
    score?: number;
    rrfScore?: number;
    similarity?: number;
}): number;
/**
 * Internal functions exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export declare const __testables: {
    MAX_FACETS: number;
    MIN_FRAGMENT_TOKEN_COUNT: number;
    MIN_QUERY_LENGTH_FOR_DECOMPOSITION: number;
    splitOnConjunctions: typeof splitOnConjunctions;
    splitOnSentences: typeof splitOnSentences;
    resolveItemScore: typeof resolveItemScore;
};
export {};
//# sourceMappingURL=query-decomposer.d.ts.map