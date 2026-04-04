/**
 * Result produced by embedding-based query expansion.
 *
 * - `original`      — The unchanged input query string.
 * - `expanded`      — Array of semantically related terms extracted from
 *                     similar memories. May be empty when expansion is
 *                     suppressed or yields no new terms.
 * - `combinedQuery` — A single enriched query string built by appending
 *                     the top expanded terms to the original. Ready for
 *                     use as a search query in downstream channels.
 */
export interface ExpandedQuery {
    original: string;
    expanded: string[];
    combinedQuery: string;
}
/** Options accepted by expandQueryWithEmbeddings(). */
export interface EmbeddingExpansionOptions {
    /**
     * Maximum number of similar memories to retrieve when mining terms.
     * Defaults to DEFAULT_CANDIDATE_LIMIT.
     */
    limit?: number;
    /**
     * Maximum number of expanded terms to append to the combined query.
     * Defaults to MAX_EXPANSION_TERMS.
     */
    maxTerms?: number;
}
/**
 * Expand a query using embedding-based similarity to find semantically
 * related terms from the memory index.
 *
 * Guard conditions (returns identity result immediately if any apply):
 *   1. `SPECKIT_EMBEDDING_EXPANSION` flag is off (default).
 *   2. R15 mutual exclusion — query classified as "simple" by
 *      `classifyQueryComplexity()`. Simple queries benefit from exact-match
 *      retrieval; broadening them degrades precision without recall gain.
 *   3. Embedding vector is invalid (zero-length or non-finite values).
 *   4. Vector search returns no candidates with content.
 *
 * When expansion proceeds:
 *   a. Run a vector similarity search using the provided embedding.
 *   b. Collect `content` strings from the top-K similar memories.
 *   c. Extract high-frequency, non-trivial terms absent from the original query.
 *   d. Append the top expanded terms to the original query → `combinedQuery`.
 *
 * @param query     - Original query string.
 * @param embedding - Pre-computed query embedding (Float32Array from the
 *                    embeddings provider). Must not be empty.
 * @param options   - Optional tuning parameters (limit, maxTerms).
 * @returns ExpandedQuery with original, expanded terms, and combinedQuery.
 *
 * @throws Never — all errors are caught and logged; identity result returned.
 */
export declare function expandQueryWithEmbeddings(query: string, embedding: Float32Array, options?: EmbeddingExpansionOptions): Promise<ExpandedQuery>;
/**
 * Synchronous predicate that returns true when R12 embedding expansion
 * would actually run for a given query.
 *
 * Useful in Stage 1 for conditional branching without triggering the
 * full async expansion path.
 *
 * Conditions for expansion to be active:
 *   - SPECKIT_EMBEDDING_EXPANSION flag is on.
 *   - R15 complexity classification is NOT "simple".
 *
 * @param query - The candidate search query.
 * @returns True when embedding expansion should be applied.
 */
export declare function isExpansionActive(query: string): boolean;
//# sourceMappingURL=embedding-expansion.d.ts.map