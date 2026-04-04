import type Database from 'better-sqlite3';
import type { EmbeddingInput, EnrichedSearchResult, MemoryRow, VectorSearchOptions } from './vector-index-types.js';
type UsageStatsOptions = {
    sortBy?: string;
    order?: string;
    limit?: number;
};
type CleanupOptions = {
    maxAgeDays?: number;
    maxAccessCount?: number;
    maxConfidence?: number;
    limit?: number;
};
/**
 * Gets one indexed memory by identifier.
 * @param id - The memory identifier.
 * @returns The matching memory row, if found.
 * @throws {VectorIndexError} Propagates store initialization failures from the vector index.
 * @example
 * ```ts
 * const memory = get_memory(42);
 * ```
 */
export declare function get_memory(id: number, database?: Database.Database): MemoryRow | null;
/**
 * Gets indexed memories for a spec folder.
 * @param spec_folder - The spec folder to query.
 * @returns The memory rows for the folder.
 */
export declare function get_memories_by_folder(spec_folder: string, database?: Database.Database): MemoryRow[];
/**
 * Gets the total number of indexed memories.
 * @returns The total memory count.
 */
export declare function get_memory_count(database?: Database.Database): number;
/**
 * Gets memory counts grouped by embedding status.
 * @returns The counts for each embedding status.
 */
export declare function get_status_counts(database?: Database.Database): {
    pending: number;
    success: number;
    failed: number;
    retry: number;
    partial: number;
};
/**
 * Gets summary counts for indexed memories.
 * @returns The aggregate memory statistics.
 */
export declare function get_stats(database?: Database.Database): {
    total: number;
    pending: number;
    success: number;
    failed: number;
    retry: number;
    partial: number;
};
/**
 * Searches indexed memories by vector similarity.
 * @param query_embedding - The query embedding to search with.
 * @param options - Search options.
 * @returns The matching memory rows.
 * @throws {VectorIndexError} Propagates store initialization failures from the vector index.
 * @example
 * ```ts
 * const rows = vector_search(queryEmbedding, { limit: 5, specFolder: 'specs/001-demo' });
 * ```
 */
export declare function vector_search(query_embedding: EmbeddingInput, options?: VectorSearchOptions, database?: Database.Database): MemoryRow[];
/**
 * Gets constitutional memories for prompt assembly.
 * @param options - Retrieval options.
 * @returns The constitutional memory rows.
 */
export declare function get_constitutional_memories_public(options?: {
    specFolder?: string | null;
    maxTokens?: number;
    includeArchived?: boolean;
}, database?: Database.Database): MemoryRow[];
/**
 * Searches indexed memories with multiple concept embeddings.
 * @param concept_embeddings - The concept embeddings to search with.
 * @param options - Search options.
 * @returns The matching memory rows.
 * @throws {VectorIndexError} When concept count or embedding dimensions are invalid, or when store initialization fails.
 * @example
 * ```ts
 * const rows = multi_concept_search([embA, embB], { limit: 8, specFolder: 'specs/001-demo' });
 * ```
 */
export declare function multi_concept_search(concept_embeddings: EmbeddingInput[], options?: {
    limit?: number;
    specFolder?: string | null;
    minSimilarity?: number;
    includeArchived?: boolean;
}): MemoryRow[];
/**
 * Extracts a display title from indexed content.
 * @param content - The content to inspect.
 * @param filename - The optional source filename.
 * @returns The extracted title.
 */
export declare function extract_title(content: unknown, filename?: string): string;
/**
 * Extracts a preview snippet from indexed content.
 * @param content - The content to inspect.
 * @param max_length - The maximum snippet length.
 * @returns The extracted snippet.
 */
export declare function extract_snippet(content: unknown, max_length?: number): string;
/**
 * Extracts tags from indexed content.
 * @param content - The content to inspect.
 * @returns The extracted tags.
 */
export declare function extract_tags(content: unknown): string[];
/**
 * Extracts a relevant date from indexed content or path.
 * @param content - The content to inspect.
 * @param file_path - The optional source file path.
 * @returns The extracted date, if available.
 */
export declare function extract_date(content: unknown, file_path?: string): string | null;
/**
 * Generates an embedding for a search query.
 * @param query - The search query.
 * @returns A promise that resolves to the embedding, if generated.
 */
export declare function generate_query_embedding(query: string): Promise<Float32Array | null>;
/**
 * Searches indexed memories using keyword matching.
 * @param query - The search query.
 * @param options - Search options.
 * @returns The matching memory rows.
 */
export declare function keyword_search(query: string, options?: {
    limit?: number;
    specFolder?: string | null;
    includeArchived?: boolean;
}, database?: Database.Database): MemoryRow[];
/**
 * Runs enriched vector search for a text query.
 * @param query - The search query.
 * @param limit - The maximum number of results to return.
 * @param options - Search options.
 * @returns A promise that resolves to enriched search results.
 * @throws {VectorIndexError} Propagates vector-store initialization failures from the underlying search pipeline.
 * @example
 * ```ts
 * const results = await vector_search_enriched('sqlite vec mismatch', 10, { specFolder: 'specs/001-demo' });
 * ```
 */
export declare function vector_search_enriched(query: string, limit?: number, options?: {
    specFolder?: string | null;
    minSimilarity?: number;
}, database?: Database.Database): Promise<EnrichedSearchResult[]>;
/**
 * Runs enriched search across multiple concepts.
 * @param concepts - The concept queries or embeddings.
 * @param limit - The maximum number of results to return.
 * @param options - Search options.
 * @returns A promise that resolves to enriched search results.
 * @throws {VectorIndexError} When concept validation fails or the vector search pipeline cannot execute.
 * @example
 * ```ts
 * const results = await multi_concept_search_enriched(['sqlite', 'vector'], 10, { specFolder: 'specs/001-demo' });
 * ```
 */
export declare function multi_concept_search_enriched(concepts: Array<string | EmbeddingInput>, limit?: number, options?: {
    specFolder?: string | null;
    minSimilarity?: number;
}): Promise<EnrichedSearchResult[]>;
/**
 * Runs keyword search for multiple concepts.
 * @param concepts - The concept terms to search for.
 * @param limit - The maximum number of results to return.
 * @param options - Search options.
 * @returns A promise that resolves to enriched search results.
 */
export declare function multi_concept_keyword_search(concepts: string[], limit?: number, options?: {
    specFolder?: string | null;
}): Promise<EnrichedSearchResult[]>;
/**
 * Parses quoted phrases from a search query.
 * @param query - The search query.
 * @returns The quoted search terms.
 */
export declare function parse_quoted_terms(query: string): string[];
/**
 * Applies smart ranking weights to enriched results.
 * @param results - The results to rank.
 * @returns The ranked results.
 */
export declare function apply_smart_ranking(results: EnrichedSearchResult[]): EnrichedSearchResult[];
/**
 * Applies diversity reordering to enriched results.
 * @param results - The results to diversify.
 * @param diversity_factor - The diversity weight to apply.
 * @returns The diversified results.
 */
export declare function apply_diversity(results: EnrichedSearchResult[], diversity_factor?: number): EnrichedSearchResult[];
/**
 * Gets memories related to a stored memory.
 * @param memory_id - The memory identifier.
 * @returns The related memory rows.
 */
export declare function get_related_memories(memory_id: number): MemoryRow[];
/**
 * Gets usage statistics for indexed memories.
 * @param options - Sorting and limit options.
 * @returns The usage statistics rows.
 */
export declare function get_usage_stats(options?: UsageStatsOptions): Array<{
    id: number;
    title: string | null;
    spec_folder: string;
    file_path: string;
    access_count: number;
    last_accessed: number | null;
    confidence: number | null;
    created_at: string;
}>;
/**
 * Finds memory records that are candidates for cleanup.
 * @param options - Cleanup thresholds and limits.
 * @returns The cleanup candidate details.
 */
export declare function find_cleanup_candidates(options?: CleanupOptions): Array<{
    id: number;
    specFolder: string;
    filePath: string;
    title: string;
    createdAt: string | undefined;
    lastAccessedAt: number | undefined;
    accessCount: number;
    confidence: number;
    ageString: string;
    lastAccessString: string;
    reasons: string[];
}>;
/**
 * Builds a preview payload for a stored memory.
 * @param memory_id - The memory identifier.
 * @param max_lines - The maximum number of file lines to include.
 * @returns The memory preview, if found.
 */
export declare function get_memory_preview(memory_id: number, max_lines?: number): {
    id: number;
    specFolder: string;
    filePath: string;
    title: string;
    createdAt: string | undefined;
    lastAccessedAt: number | undefined;
    accessCount: number;
    confidence: number;
    ageString: string;
    lastAccessString: string;
    content: string;
} | null;
/**
 * Verifies vector-index consistency and optional cleanup results.
 * @param options - Integrity verification options.
 * @returns The integrity summary.
 */
export declare function verify_integrity(options?: {
    autoClean?: boolean;
}, database?: Database.Database): {
    totalMemories: number;
    totalVectors: number;
    orphanedVectors: number;
    missingVectors: number;
    orphanedFiles: Array<{
        id: number;
        file_path: string;
        reason: string;
    }>;
    orphanedChunks: number;
    isConsistent: boolean;
    cleaned?: {
        vectors: number;
        chunks: number;
    };
};
export { get_memory as getMemory };
export { get_memories_by_folder as getMemoriesByFolder };
export { get_memory_count as getMemoryCount };
export { get_status_counts as getStatusCounts };
export { get_stats as getStats };
export { vector_search as vectorSearch };
export { get_constitutional_memories_public as getConstitutionalMemories };
export { multi_concept_search as multiConceptSearch };
export { extract_title as extractTitle };
export { extract_snippet as extractSnippet };
export { extract_tags as extractTags };
export { extract_date as extractDate };
export { generate_query_embedding as generateQueryEmbedding };
export { keyword_search as keywordSearch };
export { vector_search_enriched as vectorSearchEnriched };
export { multi_concept_search_enriched as multiConceptSearchEnriched };
export { multi_concept_keyword_search as multiConceptKeywordSearch };
export { parse_quoted_terms as parseQuotedTerms };
export { apply_smart_ranking as applySmartRanking };
export { apply_diversity as applyDiversity };
export { get_related_memories as getRelatedMemories };
export { get_usage_stats as getUsageStats };
export { find_cleanup_candidates as findCleanupCandidates };
export { get_memory_preview as getMemoryPreview };
export { verify_integrity as verifyIntegrity };
//# sourceMappingURL=vector-index-queries.d.ts.map