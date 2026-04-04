import type { Stage1Input, Stage1Output, PipelineRow } from './types.js';
/**
 * Filter results by a minimum quality score threshold.
 *
 * - If no threshold is provided or it is not a finite number, all results pass.
 * - Threshold is clamped to [0, 1].
 * - Rows with a missing or non-finite `quality_score` are treated as 0.
 *
 * @param results - Candidate rows to filter.
 * @param threshold - Minimum quality score in [0, 1] (inclusive).
 * @returns Filtered array; original array returned unchanged when no threshold applies.
 */
declare function filterByMinQualityScore(results: PipelineRow[], threshold?: number): PipelineRow[];
/**
 * Resolve the effective context type from a pipeline row.
 *
 * Rows may carry context type under either `contextType` (camelCase) or
 * `context_type` (snake_case). This function normalises the lookup.
 *
 * @param row - The pipeline row to inspect.
 * @returns The context type string, or `undefined` if absent.
 */
declare function resolveRowContextType(row: PipelineRow): string | undefined;
/**
 * Build deep-mode query variants using rule-based synonym expansion.
 *
 * The original query is always the first variant. Up to `MAX_DEEP_QUERY_VARIANTS - 1`
 * additional variants are produced by `expandQuery`. If expansion fails or produces
 * no new terms, the array contains only the original query.
 *
 * Simple-query bypass (038): When R15 classifies the query as "simple",
 * rule-based expansion is skipped — consistent with the R12 embedding-expansion
 * path's `isExpansionActive()` gate. Simple queries do not benefit from synonym
 * expansion and the additional search channels add latency without recall gain.
 *
 * Duplicates are eliminated via `Set` deduplication before slicing.
 *
 * @param query - The original search query string.
 * @returns Array of distinct query variants, original first, capped at MAX_DEEP_QUERY_VARIANTS.
 */
declare function buildDeepQueryVariants(query: string): Promise<string[]>;
declare function decomposeQueryFacets(query: string): string[];
declare function buildQueryDecompositionPool(query: string, mode?: string | null): string[];
declare function mergeQueryFacetCoverage(resultSets: PipelineRow[][]): PipelineRow[];
/**
 * Execute Stage 1: Candidate Generation.
 *
 * Selects and runs the appropriate search channel(s) based on `config.searchType`
 * and `config.mode`, then applies vector-channel temporal contiguity when
 * enabled, followed by constitutional injection, quality filtering, and
 * tier/contextType filtering.
 *
 * This stage does not apply Stage 2 fusion/reranking signals. Vector-channel
 * results may receive a temporal proximity boost before moving downstream.
 *
 * @param input - Stage 1 input containing the resolved pipeline configuration.
 * @returns Stage 1 output with raw candidate rows and channel metadata.
 */
export declare function executeStage1(input: Stage1Input): Promise<Stage1Output>;
/**
 * Internal functions exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export declare const __testables: {
    filterByMinQualityScore: typeof filterByMinQualityScore;
    resolveRowContextType: typeof resolveRowContextType;
    buildDeepQueryVariants: typeof buildDeepQueryVariants;
    DEFAULT_EXPANSION_CANDIDATE_LIMIT: number;
    decomposeQueryFacets: typeof decomposeQueryFacets;
    mergeByFacetCoverage: typeof mergeQueryFacetCoverage;
    buildQueryDecompositionPool: typeof buildQueryDecompositionPool;
    MAX_QUERY_DECOMPOSITION_FACETS: number;
};
export {};
//# sourceMappingURL=stage1-candidate-gen.d.ts.map