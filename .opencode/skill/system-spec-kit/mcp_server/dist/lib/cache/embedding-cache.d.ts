import type Database from 'better-sqlite3';
interface EmbeddingCacheEntry {
    contentHash: string;
    modelId: string;
    embedding: Buffer;
    dimensions: number;
    createdAt: string;
    lastUsedAt: string;
}
interface EmbeddingCacheStats {
    totalEntries: number;
    totalSizeBytes: number;
    oldestEntry: string | null;
    newestEntry: string | null;
}
interface EmbeddingCacheHitStats {
    hits: number;
    misses: number;
    hitRate: number;
}
/**
 * Create the embedding_cache table if it does not exist.
 * Idempotent — safe to call on every startup.
 *
 * @param db - better-sqlite3 database instance
 */
declare function initEmbeddingCache(db: Database.Database): void;
/**
 * Look up a cached embedding by content hash, model ID, and embedding dimension.
 * On hit: updates last_used_at and returns the embedding Buffer.
 * On miss: returns null.
 *
 * @param db - better-sqlite3 database instance
 * @param contentHash - SHA-256 hex digest of the content
 * @param modelId - Embedding model identifier
 * @param dimensions - Expected embedding dimensions for this lookup
 * @returns Embedding buffer on cache hit, null on miss
 */
declare function lookupEmbedding(db: Database.Database, contentHash: string, modelId: string, dimensions: number): Buffer | null;
/**
 * Store an embedding in the cache.
 * Uses INSERT OR REPLACE so duplicate (content_hash, model_id, dimensions)
 * rows are overwritten with the latest embedding, while allowing multiple
 * dimension variants to coexist for the same content/model pair.
 *
 * NOTE: The count-then-delete below is a non-transactional read-then-update
 * pattern. Under concurrent writers the cache may briefly exceed
 * MAX_CACHE_ENTRIES, but this is acceptable for a performance cache — the
 * next store call will trim the overshoot.
 *
 * @param db - better-sqlite3 database instance
 * @param contentHash - SHA-256 hex digest of the content
 * @param modelId - Embedding model identifier
 * @param embedding - Raw embedding buffer
 * @param dimensions - Number of embedding dimensions
 */
declare function storeEmbedding(db: Database.Database, contentHash: string, modelId: string, embedding: Buffer, dimensions: number): void;
/**
 * Evict cache entries whose last_used_at is older than maxAgeDays.
 *
 * @param db - better-sqlite3 database instance
 * @param maxAgeDays - Maximum age in days before eviction
 * @returns Number of evicted entries
 */
declare function evictOldEntries(db: Database.Database, maxAgeDays: number): number;
/**
 * Return runtime hit/miss statistics for the embedding cache.
 *
 * @returns Cache hit/miss counters and derived hit rate
 */
declare function getCacheStats(): EmbeddingCacheHitStats;
/**
 * Return aggregate statistics about the embedding cache.
 *
 * @param db - better-sqlite3 database instance
 * @returns Cache statistics including total entries, size, oldest/newest timestamps
 */
declare function getCacheStats(db: Database.Database): EmbeddingCacheStats;
/**
 * Remove all entries from the embedding cache.
 *
 * @param db - better-sqlite3 database instance
 */
declare function clearCache(db: Database.Database): void;
/**
 * Compute a SHA-256 hex digest of the given content string.
 * Matches the pattern used elsewhere in the codebase
 * (e.g. memory-parser.ts computeContentHash).
 *
 * @param content - Raw content string to hash
 * @returns SHA-256 hex digest
 */
declare function computeContentHash(content: string): string;
export { initEmbeddingCache, lookupEmbedding, storeEmbedding, evictOldEntries, getCacheStats, clearCache, computeContentHash, };
/**
 * Re-exports related public types.
 */
export type { EmbeddingCacheEntry, EmbeddingCacheStats, EmbeddingCacheHitStats, };
//# sourceMappingURL=embedding-cache.d.ts.map