// ───────────────────────────────────────────────────────────────
// MODULE: LLM Cache
// ───────────────────────────────────────────────────────────────
// Shared result cache for LLM calls made during search.
//
// CONSUMERS: llm-reformulation.ts, hyde.ts
//
// Cache key: { query (normalised), mode } → serialised string key.
// TTL-based expiry (default 1 hour).  In-process Map — no DB, no disk.
//
// Design constraints:
//   - Zero external dependencies (no Redis, no SQLite)
//   - Singleton module — shared across reformulation and HyDE callers
//   - Lazy TTL cleanup on get() — no background sweep needed
//   - Thread-safety is not required (Node.js single-threaded event loop)
/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */
/** Default TTL for cached LLM results: 1 hour in milliseconds. */
export const DEFAULT_TTL_MS = 60 * 60 * 1000;
const MAX_CACHE_SIZE = 500;
/* ───────────────────────────────────────────────────────────────
   3. LLM CACHE CLASS
──────────────────────────────────────────────────────────────── */
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
export class LlmCache {
    store = new Map();
    ttlMs;
    constructor(ttlMs = DEFAULT_TTL_MS) {
        this.ttlMs = ttlMs;
    }
    /**
     * Serialise a structured LlmCacheKey to a stable string.
     *
     * @param key - Structured key.
     * @returns String representation for the internal Map.
     */
    toKey(key) {
        return `${key.mode}::${key.query}`;
    }
    /**
     * Look up a cached LLM result.
     *
     * Returns the cached value when it exists and has not expired.
     * Expired entries are deleted on access (lazy cleanup).
     *
     * @param key - Structured cache key.
     * @returns Cached value cast to T, or null on miss / expiry.
     */
    get(key) {
        const serialised = this.toKey(key);
        const entry = this.store.get(serialised);
        if (!entry)
            return null;
        if (Date.now() > entry.expiresAt) {
            // Lazy TTL eviction
            this.store.delete(serialised);
            return null;
        }
        return entry.value;
    }
    /**
     * Store a value in the cache with the configured TTL.
     *
     * Overwrites any existing entry for the same key.
     *
     * @param key   - Structured cache key.
     * @param value - Value to store.
     */
    set(key, value) {
        const serialised = this.toKey(key);
        this.store.set(serialised, {
            value,
            expiresAt: Date.now() + this.ttlMs,
        });
        // Evict oldest entry when cache exceeds max size
        if (this.store.size > MAX_CACHE_SIZE) {
            let oldestKey = null;
            let oldestExpiry = Infinity;
            for (const [k, v] of this.store) {
                if (v.expiresAt < oldestExpiry) {
                    oldestExpiry = v.expiresAt;
                    oldestKey = k;
                }
            }
            if (oldestKey)
                this.store.delete(oldestKey);
        }
    }
    /**
     * Remove a specific entry from the cache.
     *
     * @param key - Structured cache key.
     * @returns True if the entry existed (and was deleted), false otherwise.
     */
    delete(key) {
        return this.store.delete(this.toKey(key));
    }
    /** Remove ALL entries from the cache. */
    clear() {
        this.store.clear();
    }
    /**
     * Return the number of entries currently in the cache
     * (including entries that may have expired but not yet been lazily evicted).
     */
    get size() {
        return this.store.size;
    }
    /**
     * Return cache hit/miss statistics for observability.
     * Note: these are lifetime counters, not per-window.
     */
    stats() {
        return { entries: this.store.size, ttlMs: this.ttlMs };
    }
}
/* ───────────────────────────────────────────────────────────────
   4. SINGLETON
──────────────────────────────────────────────────────────────── */
/** Module-level singleton cache instance. */
let _sharedCache = null;
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
export function getLlmCache() {
    if (_sharedCache === null) {
        _sharedCache = new LlmCache();
    }
    return _sharedCache;
}
/**
 * Reset the shared cache singleton.
 *
 * Intended for testing and server restarts.
 * A new instance is created with the given TTL (default: DEFAULT_TTL_MS).
 *
 * @param ttlMs - Optional TTL for the new instance.
 * @returns The newly created cache instance.
 */
export function resetLlmCache(ttlMs) {
    _sharedCache = new LlmCache(ttlMs ?? DEFAULT_TTL_MS);
    return _sharedCache;
}
/* ───────────────────────────────────────────────────────────────
   5. TEST EXPORTS
──────────────────────────────────────────────────────────────── */
/**
 * Internal constants exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export const __testables = {
    DEFAULT_TTL_MS,
};
//# sourceMappingURL=llm-cache.js.map