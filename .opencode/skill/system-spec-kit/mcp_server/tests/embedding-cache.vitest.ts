// ───────────────────────────────────────────────────────────────
// 1. TEST — EMBEDDING CACHE
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import {
  initEmbeddingCache,
  lookupEmbedding,
  storeEmbedding,
  evictOldEntries,
  getCacheStats,
  clearCache,
  computeContentHash,
} from '../lib/cache/embedding-cache';

let db: InstanceType<typeof Database>;

function makeEmbeddingBuffer(dims: number): Buffer {
  const floats = new Float32Array(dims);
  for (let i = 0; i < dims; i++) {
    floats[i] = Math.random();
  }
  return Buffer.from(floats.buffer);
}

describe('Embedding Cache (T015)', () => {
  beforeEach(() => {
    db = new Database(':memory:');
    initEmbeddingCache(db);
  });

  afterEach(() => {
    try {
      db.close();
    } catch { /* ignore */ }
  });

  // T015-01: initEmbeddingCache creates table successfully
  it('T015-01: initEmbeddingCache creates table successfully', () => {
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='embedding_cache'")
      .all();
    expect(tables).toHaveLength(1);
  });

  it('T015-01b: initEmbeddingCache is idempotent', () => {
    // Call init a second time — should not throw
    expect(() => initEmbeddingCache(db)).not.toThrow();

    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='embedding_cache'")
      .all();
    expect(tables).toHaveLength(1);
  });

  // T015-02: storeEmbedding + lookupEmbedding round-trip works
  it('T015-02: store and lookup round-trip', () => {
    const hash = computeContentHash('hello world');
    const model = 'text-embedding-ada-002';
    const dims = 128;
    const embedding = makeEmbeddingBuffer(dims);

    storeEmbedding(db, hash, model, embedding, dims);
    const result = lookupEmbedding(db, hash, model, dims);

    expect(result).not.toBeNull();
    expect(Buffer.isBuffer(result)).toBe(true);
    expect(result!.length).toBe(embedding.length);
    // Verify content matches
    expect(Buffer.compare(result!, embedding)).toBe(0);
  });

  // T015-03: Cache miss returns null for unknown hash
  it('T015-03: cache miss returns null', () => {
    const result = lookupEmbedding(db, 'nonexistent_hash', 'any-model', 384);
    expect(result).toBeNull();
  });

  // T015-04: Different model_id triggers cache miss (same content)
  it('T015-04: different model_id triggers cache miss', () => {
    const hash = computeContentHash('same content');
    const dims = 64;
    const embedding = makeEmbeddingBuffer(dims);

    storeEmbedding(db, hash, 'model-A', embedding, dims);

    // Same hash, different model — should miss
    const result = lookupEmbedding(db, hash, 'model-B', dims);
    expect(result).toBeNull();

    // Original model — should hit
    const hit = lookupEmbedding(db, hash, 'model-A', dims);
    expect(hit).not.toBeNull();
  });

  it('T015-04b: different dimensions trigger cache miss for same hash and model', () => {
    const hash = computeContentHash('same content');
    const model = 'model-A';
    const originalDims = 1536;
    const replacementDims = 1024;

    storeEmbedding(db, hash, model, makeEmbeddingBuffer(originalDims), originalDims);

    expect(lookupEmbedding(db, hash, model, replacementDims)).toBeNull();
    expect(lookupEmbedding(db, hash, model, originalDims)).not.toBeNull();
  });

  it('T015-04c: same hash and model can store multiple dimension variants', () => {
    const hash = computeContentHash('same content different dims');
    const model = 'model-A';
    const dimsA = 768;
    const dimsB = 1024;
    const embA = makeEmbeddingBuffer(dimsA);
    const embB = makeEmbeddingBuffer(dimsB);

    storeEmbedding(db, hash, model, embA, dimsA);
    storeEmbedding(db, hash, model, embB, dimsB);

    expect(getCacheStats(db).totalEntries).toBe(2);
    expect(Buffer.compare(lookupEmbedding(db, hash, model, dimsA)!, embA)).toBe(0);
    expect(Buffer.compare(lookupEmbedding(db, hash, model, dimsB)!, embB)).toBe(0);
  });

  // T015-05: lookupEmbedding updates last_used_at on hit
  it('T015-05: lookupEmbedding updates last_used_at on hit', () => {
    const hash = computeContentHash('track usage');
    const model = 'test-model';
    const dims = 32;
    const embedding = makeEmbeddingBuffer(dims);

    storeEmbedding(db, hash, model, embedding, dims);

    // Read initial last_used_at
    const before = db
      .prepare('SELECT last_used_at FROM embedding_cache WHERE content_hash = ? AND model_id = ? AND dimensions = ?')
      .get(hash, model, dims) as { last_used_at: string };

    // Manually set last_used_at to an old value so we can detect the update
    db.prepare(
      "UPDATE embedding_cache SET last_used_at = datetime('now', '-1 day') WHERE content_hash = ? AND model_id = ? AND dimensions = ?",
    ).run(hash, model, dims);

    const afterBackdate = db
      .prepare('SELECT last_used_at FROM embedding_cache WHERE content_hash = ? AND model_id = ? AND dimensions = ?')
      .get(hash, model, dims) as { last_used_at: string };

    // Lookup triggers last_used_at refresh
    lookupEmbedding(db, hash, model, dims);

    const afterLookup = db
      .prepare('SELECT last_used_at FROM embedding_cache WHERE content_hash = ? AND model_id = ? AND dimensions = ?')
      .get(hash, model, dims) as { last_used_at: string };

    // After lookup, last_used_at should be more recent than the backdated value
    expect(afterLookup.last_used_at > afterBackdate.last_used_at).toBe(true);
  });

  // T015-06: evictOldEntries removes entries older than threshold
  it('T015-06: evictOldEntries removes old entries', () => {
    const hash = computeContentHash('evict me');
    const model = 'test-model';
    const dims = 16;
    const embedding = makeEmbeddingBuffer(dims);

    storeEmbedding(db, hash, model, embedding, dims);

    // Backdate last_used_at to 10 days ago
    db.prepare(
      "UPDATE embedding_cache SET last_used_at = datetime('now', '-10 days') WHERE content_hash = ? AND model_id = ? AND dimensions = ?",
    ).run(hash, model, dims);

    // Store a fresh entry that should survive
    const freshHash = computeContentHash('keep me');
    storeEmbedding(db, freshHash, model, embedding, dims);

    // Evict entries older than 5 days
    const evicted = evictOldEntries(db, 5);
    expect(evicted).toBe(1);

    // Old entry gone
    expect(lookupEmbedding(db, hash, model, dims)).toBeNull();
    // Fresh entry still there
    expect(lookupEmbedding(db, freshHash, model, dims)).not.toBeNull();
  });

  // T015-07: getCacheStats returns correct counts
  it('T015-07: getCacheStats returns correct counts', () => {
    // Empty stats
    const empty = getCacheStats(db);
    expect(empty.totalEntries).toBe(0);
    expect(empty.totalSizeBytes).toBe(0);
    expect(empty.oldestEntry).toBeNull();
    expect(empty.newestEntry).toBeNull();

    // Add some entries
    const dims = 64;
    const emb = makeEmbeddingBuffer(dims);
    storeEmbedding(db, computeContentHash('a'), 'model', emb, dims);
    storeEmbedding(db, computeContentHash('b'), 'model', emb, dims);
    storeEmbedding(db, computeContentHash('c'), 'model', emb, dims);

    const stats = getCacheStats(db);
    expect(stats.totalEntries).toBe(3);
    expect(stats.totalSizeBytes).toBeGreaterThan(0);
    expect(stats.oldestEntry).not.toBeNull();
    expect(stats.newestEntry).not.toBeNull();
  });

  // T015-08: clearCache removes all entries
  it('T015-08: clearCache removes all entries', () => {
    const dims = 32;
    const emb = makeEmbeddingBuffer(dims);
    storeEmbedding(db, computeContentHash('x'), 'model', emb, dims);
    storeEmbedding(db, computeContentHash('y'), 'model', emb, dims);

    expect(getCacheStats(db).totalEntries).toBe(2);

    clearCache(db);

    expect(getCacheStats(db).totalEntries).toBe(0);
  });

  // T015-09: Duplicate store (same hash+model) replaces existing
  it('T015-09: duplicate store replaces existing entry', () => {
    const hash = computeContentHash('replace test');
    const model = 'test-model';
    const dims = 32;

    const emb1 = makeEmbeddingBuffer(dims);
    storeEmbedding(db, hash, model, emb1, dims);

    const emb2 = makeEmbeddingBuffer(dims);
    storeEmbedding(db, hash, model, emb2, dims);

    // Should only have one entry
    expect(getCacheStats(db).totalEntries).toBe(1);

    // Should return the second embedding
    const result = lookupEmbedding(db, hash, model, dims);
    expect(result).not.toBeNull();
    expect(Buffer.compare(result!, emb2)).toBe(0);
  });

  // T015-10: computeContentHash returns consistent SHA-256
  it('T015-10: computeContentHash returns consistent SHA-256', () => {
    const content = 'deterministic hashing test';

    const hash1 = computeContentHash(content);
    const hash2 = computeContentHash(content);

    // Consistent
    expect(hash1).toBe(hash2);

    // 64-char hex string (256 bits / 4 bits per hex char)
    expect(hash1).toMatch(/^[0-9a-f]{64}$/);

    // Different content produces different hash
    const hash3 = computeContentHash('different content');
    expect(hash3).not.toBe(hash1);
  });

  // T015-11: Cache lookup performance (<1ms for simple ops)
  it('T015-11: cache lookup performance benchmark', () => {
    const hash = computeContentHash('perf test');
    const model = 'test-model';
    const dims = 384;
    const emb = makeEmbeddingBuffer(dims);

    storeEmbedding(db, hash, model, emb, dims);

    // Warm up
    lookupEmbedding(db, hash, model, dims);

    // Benchmark 100 lookups
    const iterations = 100;
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      lookupEmbedding(db, hash, model, dims);
    }
    const elapsed = performance.now() - start;
    const avgMs = elapsed / iterations;

    // P95 approximation: average should be well under 1ms for in-memory SQLite
    expect(avgMs).toBeLessThan(1);
  });
});
