// ───────────────────────────────────────────────────────────────
// 1. TEST — FEATURE EVALUATION — SCORING CALIBRATION
// ───────────────────────────────────────────────────────────────
// Rigorous feature evaluation covering T001 (embedding cache),
// T004 (score normalization), T005 (interference TM-01), and
// T006 (classification-based decay TM-03).
// Phase D cleanup: T002 (cold-start N4) removed — NOVELTY_BOOST was dead code.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';

// --- T001: Embedding Cache ---
import {
  initEmbeddingCache,
  lookupEmbedding,
  storeEmbedding,
  evictOldEntries,
  getCacheStats,
  computeContentHash,
} from '../lib/cache/embedding-cache';

// --- T004: Composite Scoring (normalization) ---
import {
  calculateFiveFactorScore,
  normalizeCompositeScores,
  isCompositeNormalizationEnabled,
} from '../lib/scoring/composite-scoring';

// --- T005: Interference Scoring ---
import {
  applyInterferencePenalty,
  INTERFERENCE_PENALTY_COEFFICIENT,
} from '../lib/scoring/interference-scoring';

// --- T006: Classification-based Decay ---
const {
  IMPORTANCE_TIER_STABILITY_MULTIPLIER,
  CONTEXT_TYPE_STABILITY_MULTIPLIER,
  getClassificationDecayMultiplier,
  applyClassificationDecay,
} = require('../lib/cognitive/fsrs-scheduler.ts');

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

function makeEmbeddingBuffer(dims: number, seed = 0): Buffer {
  const floats = new Float32Array(dims);
  for (let i = 0; i < dims; i++) {
    floats[i] = Math.sin(seed + i);
  }
  return Buffer.from(floats.buffer);
}

function hoursAgo(hours: number): number {
  return Date.now() - hours * 3600000;
}

function makeRow(createdAtMs: number, overrides: Record<string, unknown> = {}) {
  return {
    created_at: new Date(createdAtMs).toISOString(),
    importance_tier: 'normal',
    importance_weight: 0.5,
    access_count: 0,
    similarity: 0,
    ...overrides,
  };
}

// ═══════════════════════════════════════════════════════════════════
// T001: EMBEDDING CACHE
// ═══════════════════════════════════════════════════════════════════

describe('T001: Embedding Cache', () => {
  let db: InstanceType<typeof Database>;

  beforeEach(() => {
    db = new Database(':memory:');
    initEmbeddingCache(db);
  });

  afterEach(() => {
    try { db.close(); } catch { /* ignore */ }
  });

  // T041-01: Store an embedding, look it up, verify exact match
  it('T041-01: store → lookup returns exact byte-identical embedding', () => {
    const hash = computeContentHash('sprint 2 feature eval');
    const model = 'text-embedding-3-small';
    const dims = 256;
    const embedding = makeEmbeddingBuffer(dims, 42);

    storeEmbedding(db, hash, model, embedding, dims);
    const result = lookupEmbedding(db, hash, model, dims);

    expect(result).not.toBeNull();
    expect(Buffer.isBuffer(result)).toBe(true);
    expect(result!.length).toBe(embedding.length);
    expect(Buffer.compare(result!, embedding)).toBe(0);
  });

  // T041-02: Cache miss returns null
  it('T041-02: cache miss returns null for unknown hash', () => {
    const result = lookupEmbedding(db, 'deadbeef00000000', 'any-model', 384);
    expect(result).toBeNull();
  });

  // T041-03: LRU eviction removes stale entries, keeps fresh ones
  it('T041-03: time-based eviction removes stale entries, preserves fresh', () => {
    const model = 'test-model';
    const dims = 64;
    const staleHash = computeContentHash('stale entry');
    const freshHash = computeContentHash('fresh entry');

    storeEmbedding(db, staleHash, model, makeEmbeddingBuffer(dims, 1), dims);
    storeEmbedding(db, freshHash, model, makeEmbeddingBuffer(dims, 2), dims);

    // Backdate stale entry to 15 days ago
    db.prepare(
      "UPDATE embedding_cache SET last_used_at = datetime('now', '-15 days') WHERE content_hash = ?",
    ).run(staleHash);

    // Evict entries older than 7 days
    const evicted = evictOldEntries(db, 7);
    expect(evicted).toBe(1);

    // Stale gone, fresh survives
    expect(lookupEmbedding(db, staleHash, model, dims)).toBeNull();
    expect(lookupEmbedding(db, freshHash, model, dims)).not.toBeNull();
  });

  // T041-04: computeContentHash is deterministic SHA-256
  it('T041-04: computeContentHash is deterministic 64-char hex SHA-256', () => {
    const content = 'reproducible hash test';
    const h1 = computeContentHash(content);
    const h2 = computeContentHash(content);
    expect(h1).toBe(h2);
    expect(h1).toMatch(/^[0-9a-f]{64}$/);
    expect(computeContentHash('different')).not.toBe(h1);
  });
});

// T002: COLD-START BOOST (N4) — removed in Phase D cleanup (dead code).

// ═══════════════════════════════════════════════════════════════════
// T005: INTERFERENCE SCORING (TM-01)
// ═══════════════════════════════════════════════════════════════════

describe('T005: Interference Scoring (TM-01)', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // T041-10: interference_score=0.5 → penalty = coefficient * 0.5 = -0.04
  it('T041-10: interference_score=0.5 applies penalty of -0.04', () => {
    vi.stubEnv('SPECKIT_INTERFERENCE_SCORE', 'true');
    const baseScore = 0.7;
    const interferenceScore = 0.5;
    const result = applyInterferencePenalty(baseScore, interferenceScore);
    const expectedPenalty = INTERFERENCE_PENALTY_COEFFICIENT * interferenceScore; // -0.08 * 0.5 = -0.04
    expect(result).toBeCloseTo(baseScore + expectedPenalty, 6);
    expect(result).toBeCloseTo(0.66, 2);
  });

  // T041-11: Flag explicitly disabled → no penalty applied
  it('T041-11: flag disabled returns score unchanged', () => {
    vi.stubEnv('SPECKIT_INTERFERENCE_SCORE', 'false');
    const baseScore = 0.7;
    const result = applyInterferencePenalty(baseScore, 5.0);
    expect(result).toBe(baseScore);
  });

  // T041-12: Penalty floors at zero (never negative)
  it('T041-12: penalty floors at 0 — score never goes negative', () => {
    vi.stubEnv('SPECKIT_INTERFERENCE_SCORE', 'true');
    const baseScore = 0.01;
    const interferenceScore = 10; // -0.08 * 10 = -0.80 penalty
    const result = applyInterferencePenalty(baseScore, interferenceScore);
    expect(result).toBe(0);
  });

  // T041-13: Zero interference score → no change
  it('T041-13: zero interference score leaves score unchanged', () => {
    vi.stubEnv('SPECKIT_INTERFERENCE_SCORE', 'true');
    const baseScore = 0.5;
    const result = applyInterferencePenalty(baseScore, 0);
    expect(result).toBe(baseScore);
  });
});

// ═══════════════════════════════════════════════════════════════════
// T006: CLASSIFICATION-BASED DECAY (TM-03)
// ═══════════════════════════════════════════════════════════════════

describe('T006: Classification-based Decay (TM-03)', () => {
  const originalFlag = process.env.SPECKIT_CLASSIFICATION_DECAY;

  afterEach(() => {
    if (originalFlag === undefined) {
      delete process.env.SPECKIT_CLASSIFICATION_DECAY;
    } else {
      process.env.SPECKIT_CLASSIFICATION_DECAY = originalFlag;
    }
  });

  // T041-14: Constitutional tier has Infinity multiplier (no decay)
  it('T041-14: constitutional tier → Infinity multiplier (never decays)', () => {
    expect(IMPORTANCE_TIER_STABILITY_MULTIPLIER['constitutional']).toBe(Infinity);

    const multiplier = getClassificationDecayMultiplier('general', 'constitutional');
    expect(multiplier).toBe(Infinity);
  });

  // T041-15: Temporary tier decays faster than normal
  it('T041-15: temporary tier decays faster than normal', () => {
    const tempMult = IMPORTANCE_TIER_STABILITY_MULTIPLIER['temporary'];
    const normalMult = IMPORTANCE_TIER_STABILITY_MULTIPLIER['normal'];
    expect(tempMult).toBeLessThan(normalMult);
    expect(tempMult).toBe(0.5);
    expect(normalMult).toBe(1.0);
  });

  // T041-16: applyClassificationDecay with flag enabled adjusts stability
  it('T041-16: flag enabled adjusts stability by combined multiplier', () => {
    process.env.SPECKIT_CLASSIFICATION_DECAY = 'true';
    const baseStability = 2.0;

    // "research" context (2.0) * "important" tier (1.5) = 3.0
    const adjusted = applyClassificationDecay(baseStability, 'research', 'important');
    expect(adjusted).toBeCloseTo(baseStability * 2.0 * 1.5, 6);
    expect(adjusted).toBe(6.0);
  });

  // T041-17: Flag explicitly disabled → stability unchanged
  it('T041-17: flag disabled returns stability unchanged', () => {
    process.env.SPECKIT_CLASSIFICATION_DECAY = 'false';
    const baseStability = 2.0;
    const result = applyClassificationDecay(baseStability, 'research', 'temporary');
    expect(result).toBe(baseStability);
  });

  // T041-18: Constitutional with any context → Infinity (no decay wins)
  it('T041-18: constitutional tier with any context type → Infinity', () => {
    const contexts = ['decision', 'research', 'implementation', 'general', 'unknown'];
    for (const ctx of contexts) {
      const mult = getClassificationDecayMultiplier(ctx, 'constitutional');
      expect(mult).toBe(Infinity);
    }
  });

  // T041-19: Decision context_type → Infinity regardless of tier
  it('T041-19: decision context → Infinity regardless of tier', () => {
    expect(CONTEXT_TYPE_STABILITY_MULTIPLIER['decision']).toBe(Infinity);
    const mult = getClassificationDecayMultiplier('decision', 'temporary');
    expect(mult).toBe(Infinity);
  });
});

// ═══════════════════════════════════════════════════════════════════
// T004: SCORE NORMALIZATION
// ═══════════════════════════════════════════════════════════════════

describe('T004: Score Normalization', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // T041-20: [0.2, 0.5, 0.8] normalizes to [0, 0.5, 1.0]
  it('T041-20: min-max normalizes [0.2, 0.5, 0.8] to [0, 0.5, 1.0]', () => {
    vi.stubEnv('SPECKIT_SCORE_NORMALIZATION', 'true');
    const input = [0.2, 0.5, 0.8];
    const result = normalizeCompositeScores(input);
    expect(result[0]).toBeCloseTo(0.0, 6);
    expect(result[1]).toBeCloseTo(0.5, 6);
    expect(result[2]).toBeCloseTo(1.0, 6);
  });

  // T041-21: Single-element array normalizes to [0.0]
  it('T041-21: single element normalizes to [0.0]', () => {
    vi.stubEnv('SPECKIT_SCORE_NORMALIZATION', 'true');
    const result = normalizeCompositeScores([0.42]);
    expect(result).toEqual([0]);
  });

  // T041-22: All-same-value normalizes to [0.0, 0.0, ...]
  it('T041-22: all-same values normalize to [0.0, 0.0, 0.0]', () => {
    vi.stubEnv('SPECKIT_SCORE_NORMALIZATION', 'true');
    const result = normalizeCompositeScores([0.5, 0.5, 0.5]);
    expect(result).toEqual([0, 0, 0]);
  });

  // T041-23: Empty array returns empty
  it('T041-23: empty array returns empty', () => {
    vi.stubEnv('SPECKIT_SCORE_NORMALIZATION', 'true');
    const result = normalizeCompositeScores([]);
    expect(result).toEqual([]);
  });

  // T041-24: Flag explicitly disabled returns scores unchanged
  it('T041-24: flag disabled returns scores unchanged', () => {
    vi.stubEnv('SPECKIT_SCORE_NORMALIZATION', 'false');
    const input = [0.2, 0.5, 0.8];
    const result = normalizeCompositeScores(input);
    expect(result).toEqual(input);
  });
});
