/** Structured cache key. Serialised to a string for the internal Map. */
export interface LlmCacheKey {
    /** Normalised query string (lowercase, trimmed, collapsed whitespace). */
    query: string;
    /** Cache namespace / mode — distinguishes reformulation from HyDE entries. */
    mode: 'reformulation' | 'hyde';
}
/** Default TTL for cached LLM results: 1 hour in milliseconds. */
export declare const DEFAULT_TTL_MS: number;
/**
 * TTL-based in-process cache for LLM search results.
 *
 * Usage:
 *   const cache = getLlmCache();
 *   const hit = cache.get<ReformulationResult>(key);
 *   if (hit === null) {
 *     const result = await callLlm(...);
 *     cache.set(key, result);
 *   }
 */
export declare class LlmCache {
    private readonly store;
    private readonly ttlMs;
    constructor(ttlMs?: number);
    /**
     * Serialise a structured LlmCacheKey to a stable string.
     *
     * @param key - Structured key.
     * @returns String representation for the internal Map.
     */
    private toKey;
    /**
     * Look up a cached LLM result.
     *
     * Returns the cached value when it exists and has not expired.
     * Expired entries are deleted on access (lazy cleanup).
     *
     * @param key - Structured cache key.
     * @returns Cached value cast to T, or null on miss / expiry.
     */
    get<T>(key: LlmCacheKey): T | null;
    /**
     * Store a value in the cache with the configured TTL.
     *
     * Overwrites any existing entry for the same key.
     *
     * @param key   - Structured cache key.
     * @param value - Value to store.
     */
    set<T>(key: LlmCacheKey, value: T): void;
    /**
     * Remove a specific entry from the cache.
     *
     * @param key - Structured cache key.
     * @returns True if the entry existed (and was deleted), false otherwise.
     */
    delete(key: LlmCacheKey): boolean;
    /** Remove ALL entries from the cache. */
    clear(): void;
    /**
     * Return the number of entries currently in the cache
     * (including entries that may have expired but not yet been lazily evicted).
     */
    get size(): number;
    /**
     * Return cache hit/miss statistics for observability.
     * Note: these are lifetime counters, not per-window.
     */
    stats(): {
        entries: number;
        ttlMs: number;
    };
}
/**
 * Return the shared LLM cache singleton.
 *
 * The cache is created lazily on first access with the default 1-hour TTL.
 * To inject a custom TTL (e.g., in tests), call `resetLlmCache(ttlMs)` before
 * the first `getLlmCache()` call — or use `resetLlmCache()` to reset with
 * default TTL.
 *
 * @returns The shared LlmCache instance.
 */
export declare function getLlmCache(): LlmCache;
/**
 * Reset the shared cache singleton.
 *
 * Intended for testing and server restarts.
 * A new instance is created with the given TTL (default: DEFAULT_TTL_MS).
 *
 * @param ttlMs - Optional TTL for the new instance.
 * @returns The newly created cache instance.
 */
export declare function resetLlmCache(ttlMs?: number): LlmCache;
/**
 * Internal constants exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export declare const __testables: {
    DEFAULT_TTL_MS: number;
};
//# sourceMappingURL=llm-cache.d.ts.map