// ───────────────────────────────────────────────────────────────
// MODULE: Embedding Cache
// ───────────────────────────────────────────────────────────────
import { createHash } from 'crypto';
let cacheHits = 0;
let cacheMisses = 0;
/* --- 2. TABLE INITIALIZATION --- */
/**
 * Create the embedding_cache table if it does not exist.
 * Idempotent — safe to call on every startup.
 *
 * @param db - better-sqlite3 database instance
 */
function initEmbeddingCache(db) {
    db.exec(`
    CREATE TABLE IF NOT EXISTS embedding_cache (
      content_hash TEXT NOT NULL,
      model_id TEXT NOT NULL,
      embedding BLOB NOT NULL,
      dimensions INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_used_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (content_hash, model_id, dimensions)
    )
  `);
}
/* --- 3. CACHE LOOKUP --- */
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
function lookupEmbedding(db, contentHash, modelId, dimensions) {
    const row = db.prepare('SELECT embedding FROM embedding_cache WHERE content_hash = ? AND model_id = ? AND dimensions = ?').get(contentHash, modelId, dimensions);
    if (!row) {
        cacheMisses += 1;
        return null;
    }
    cacheHits += 1;
    // Update last_used_at on cache hit
    db.prepare("UPDATE embedding_cache SET last_used_at = datetime('now') WHERE content_hash = ? AND model_id = ? AND dimensions = ?").run(contentHash, modelId, dimensions);
    return row.embedding;
}
/* --- 4. CACHE STORE --- */
// 10 000 is ~2× the expected upper-bound memory count (~5 000 memories
// × model variants). Prevents unbounded SQLite table growth in long-running
// Server processes. Eviction uses LRU (oldest last_used_at first).
const MAX_CACHE_ENTRIES = 10000;
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
function storeEmbedding(db, contentHash, modelId, embedding, dimensions) {
    // Auto-evict oldest entries when cache exceeds size limit
    const countRow = db.prepare('SELECT COUNT(*) AS cnt FROM embedding_cache').get();
    if (countRow.cnt >= MAX_CACHE_ENTRIES) {
        const excess = countRow.cnt - MAX_CACHE_ENTRIES + 1; // +1 to make room for the new entry
        db.prepare(`DELETE FROM embedding_cache WHERE rowid IN (
         SELECT rowid FROM embedding_cache ORDER BY last_used_at ASC LIMIT ?
       )`).run(excess);
    }
    db.prepare(`INSERT OR REPLACE INTO embedding_cache
       (content_hash, model_id, embedding, dimensions, last_used_at)
     VALUES (?, ?, ?, ?, datetime('now'))`).run(contentHash, modelId, embedding, dimensions);
}
/* --- 5. LRU EVICTION --- */
/**
 * Evict cache entries whose last_used_at is older than maxAgeDays.
 *
 * @param db - better-sqlite3 database instance
 * @param maxAgeDays - Maximum age in days before eviction
 * @returns Number of evicted entries
 */
function evictOldEntries(db, maxAgeDays) {
    const result = db.prepare(`DELETE FROM embedding_cache
     WHERE last_used_at < datetime('now', ? || ' days')`).run(`-${maxAgeDays}`);
    return result.changes;
}
function getCacheStats(db) {
    if (!db) {
        const totalLookups = cacheHits + cacheMisses;
        return {
            hits: cacheHits,
            misses: cacheMisses,
            hitRate: totalLookups > 0 ? cacheHits / totalLookups : 0,
        };
    }
    const row = db.prepare(`
    SELECT
      COUNT(*) AS total_entries,
      COALESCE(SUM(LENGTH(embedding)), 0) AS total_size_bytes,
      MIN(last_used_at) AS oldest_entry,
      MAX(last_used_at) AS newest_entry
    FROM embedding_cache
  `).get();
    return {
        totalEntries: row.total_entries,
        totalSizeBytes: row.total_size_bytes,
        oldestEntry: row.oldest_entry,
        newestEntry: row.newest_entry,
    };
}
/* --- 7. CLEAR --- */
/**
 * Remove all entries from the embedding cache.
 *
 * @param db - better-sqlite3 database instance
 */
function clearCache(db) {
    db.exec('DELETE FROM embedding_cache');
}
/* --- 8. CONTENT HASHING --- */
/**
 * Compute a SHA-256 hex digest of the given content string.
 * Matches the pattern used elsewhere in the codebase
 * (e.g. memory-parser.ts computeContentHash).
 *
 * @param content - Raw content string to hash
 * @returns SHA-256 hex digest
 */
function computeContentHash(content) {
    return createHash('sha256').update(content, 'utf-8').digest('hex');
}
/* --- 9. EXPORTS --- */
export { initEmbeddingCache, lookupEmbedding, storeEmbedding, evictOldEntries, getCacheStats, clearCache, computeContentHash, };
//# sourceMappingURL=embedding-cache.js.map