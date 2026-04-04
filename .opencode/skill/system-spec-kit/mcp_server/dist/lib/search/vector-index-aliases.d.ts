import type Database from 'better-sqlite3';
type EnrichedSearchResult = {
    rank: number;
    similarity?: number;
    avgSimilarity?: number;
    conceptSimilarities?: number[];
    title: string;
    specFolder: string;
    filePath: string;
    date: string | null;
    tags: string[];
    snippet: string;
    id: number;
    importanceWeight: number;
    created_at?: string;
    access_count?: number;
    smartScore?: number;
    spec_folder?: string;
    searchMethod?: string;
    isConstitutional: boolean;
    [key: string]: unknown;
};
type EnhancedSearchOptions = {
    specFolder?: string | null;
    minSimilarity?: number;
    diversityFactor?: number;
    noDiversity?: boolean;
};
type CacheNode<TValue> = {
    key: string;
    value: TValue;
    timestamp: number;
    prev: CacheNode<TValue> | null;
    next: CacheNode<TValue> | null;
};
/** Maintains a TTL-based least-recently-used cache for search helpers. */
export declare class LRUCache<TValue> {
    max_size: number;
    ttl_ms: number;
    cache: Map<string, CacheNode<TValue>>;
    head: CacheNode<TValue>;
    tail: CacheNode<TValue>;
    constructor(max_size: number, ttl_ms: number);
    get(key: string): TValue | null;
    set(key: string, value: TValue): void;
    _add_to_front(node: CacheNode<TValue>): void;
    _remove(node: CacheNode<TValue>): void;
    _move_to_front(node: CacheNode<TValue>): void;
    clear(): void;
    keys(): IterableIterator<string>;
    delete(key: string): boolean;
    get size(): number;
}
type QueryCacheEntry = {
    results: EnrichedSearchResult[];
    specFolder: string | null;
};
/**
 * Returns the shared query cache instance.
 * @returns The initialized query cache.
 */
export declare function get_query_cache(): LRUCache<QueryCacheEntry>;
/**
 * Builds a stable cache key for a search request.
 * @param query - The search query.
 * @param limit - The requested result limit.
 * @param options - Additional search options.
 * @returns The cache key string.
 */
export declare function get_cache_key(query: string, limit: number, options: Record<string, unknown>): string;
/**
 * Runs an enriched search with LRU caching.
 * @param query - The search query.
 * @param limit - The maximum number of results to return.
 * @param options - Additional search options.
 * @returns The enriched search results.
 */
export declare function cached_search(query: string, limit?: number, options?: Record<string, unknown>): Promise<EnrichedSearchResult[]>;
/**
 * Clears cached search results globally or for one spec folder.
 * @param spec_folder - The optional spec folder to clear.
 * @returns The number of cleared cache entries.
 */
export declare function clear_search_cache(spec_folder?: string | null): number;
/**
 * Learns new trigger phrases from a selected result.
 * @param search_query - The original search query.
 * @param selected_memory_id - The selected memory identifier.
 * @returns True when trigger phrases were updated.
 */
export declare function learn_from_selection(search_query: string, selected_memory_id: number): boolean;
/**
 * Links a new memory to similar existing memories.
 * @param new_memory_id - The saved memory identifier.
 * @param content - The memory content to analyze.
 * @returns A promise that resolves when related links are updated.
 */
export declare function link_related_on_save(new_memory_id: number, content: string): Promise<void>;
/**
 * Records an access event for a memory.
 * @param memory_id - The memory identifier.
 * @returns True when the access update succeeds.
 */
export declare function record_access(memory_id: number): boolean;
/**
 * Runs enriched search with smart ranking and diversity controls.
 * @param query - The search query.
 * @param limit - The maximum number of results to return.
 * @param options - Search tuning options.
 * @returns The ranked search results.
 */
export declare function enhanced_search(query: string, limit?: number, options?: EnhancedSearchOptions, database?: Database.Database): Promise<EnrichedSearchResult[]>;
export { cached_search as cachedSearch };
export { clear_search_cache as clearSearchCache };
export { learn_from_selection as learnFromSelection };
export { link_related_on_save as linkRelatedOnSave };
export { record_access as recordAccess };
export { enhanced_search as enhancedSearch };
export { get_cache_key as getCacheKey };
//# sourceMappingURL=vector-index-aliases.d.ts.map