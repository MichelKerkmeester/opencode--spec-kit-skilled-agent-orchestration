export interface RerankResult {
    id: string | number;
    score: number;
    [key: string]: unknown;
}
export interface RerankOptions {
    limit?: number;
}
/**
 * Rerank results by score (descending). Preserves all fields on
 * each result object. Returns a new array — does not mutate input.
 *
 * @param results - Array of scored result objects
 * @param options - Optional config (limit: max results to return)
 * @returns Sorted (and optionally truncated) results
 */
export declare function rerankResults(results: Array<RerankResult>, options?: RerankOptions): Array<RerankResult>;
//# sourceMappingURL=reranker.d.ts.map