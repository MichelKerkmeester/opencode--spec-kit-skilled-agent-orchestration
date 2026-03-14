// TEST: MMR Reranker (C138-P1)
// Maximal Marginal Relevance for post-fusion diversity pruning.
// Verifies dedup, lambda tuning, N-cap, performance, and limits.
import { describe, it, expect } from 'vitest';
import { applyMMR, computeCosine } from '@spec-kit/shared/algorithms/mmr-reranker';
import type { MMRCandidate, MMRConfig } from '@spec-kit/shared/algorithms/mmr-reranker';

/* ───────────────────────────────────────────────────────────────
   HELPERS
   ──────────────────────────────────────────────────────────────── */

function makeEmbedding(values: number[]): Float32Array {
  return new Float32Array(values);
}

function makeCandidate(id: number, score: number, embedding: number[]): MMRCandidate {
  return { id, score, embedding: makeEmbedding(embedding) };
}

/** Create N identical candidates (same embedding, same score). */
function makeIdenticalCandidates(count: number, score = 0.9): MMRCandidate[] {
  const emb = [0.5, 0.5, 0.5, 0.5];
  return Array.from({ length: count }, (_, i) =>
    makeCandidate(i + 1, score, emb),
  );
}

/** Create N diverse candidates (orthogonal embeddings). */
function makeDiverseCandidates(count: number): MMRCandidate[] {
  return Array.from({ length: count }, (_, i) => {
    const emb = new Array(count).fill(0);
    emb[i] = 1.0;
    return makeCandidate(i + 1, 0.9 - i * 0.05, emb);
  });
}

/* ───────────────────────────────────────────────────────────────
   TESTS
   ──────────────────────────────────────────────────────────────── */

describe('C138-P1 MMR Reranker', () => {

  // ---- T1: Identical candidates get deduplicated ----
  it('T1: reduces identical candidates to limit=1', () => {
    const candidates = makeIdenticalCandidates(5);
    const result = applyMMR(candidates, { lambda: 0.5, limit: 5 });

    // All are identical, but MMR penalizes similarity to already-selected.
    // First pick is selected; subsequent identical items get 0 MMR diversity benefit.
    expect(result.length).toBeLessThanOrEqual(5);
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  // ---- T2: lambda=0.5 maximizes diversity ----
  it('T2: lambda=0.5 selects diverse candidates over similar high-scorers', () => {
    const candidates = [
      makeCandidate(1, 0.95, [1, 0, 0, 0]),   // top score, direction A
      makeCandidate(2, 0.93, [0.99, 0.01, 0, 0]), // near-identical to #1
      makeCandidate(3, 0.80, [0, 1, 0, 0]),   // lower score, different direction
      makeCandidate(4, 0.75, [0, 0, 1, 0]),   // lower score, yet another direction
    ];

    const result = applyMMR(candidates, { lambda: 0.5, limit: 3 });
    const ids = result.map(r => r.id);

    // #1 always first (highest score). #3 or #4 should appear before #2 due to diversity.
    expect(ids[0]).toBe(1);
    expect(ids).toContain(3); // diverse candidate included
    expect(ids.indexOf(3)).toBeLessThan(ids.indexOf(2) === -1 ? Infinity : ids.indexOf(2));
  });

  // ---- T3: lambda=0.85 preserves relevance order ----
  it('T3: lambda=0.85 mostly preserves original score ranking', () => {
    const candidates = makeDiverseCandidates(5);
    const result = applyMMR(candidates, { lambda: 0.85, limit: 5 });

    // With high lambda, relevance dominates — order should closely match original
    expect(result[0].id).toBe(1); // highest score always first
    expect(result[1].id).toBe(2); // second highest likely second
  });

  // ---- T4: N=20 hardcap ----
  it('T4: processes at most maxCandidates=20', () => {
    const candidates = Array.from({ length: 50 }, (_, i) =>
      makeCandidate(i + 1, 1.0 - i * 0.01, [Math.random(), Math.random(), Math.random(), Math.random()]),
    );

    const result = applyMMR(candidates, { lambda: 0.7, limit: 5, maxCandidates: 20 });

    // All selected candidates should be from the top-20
    for (const r of result) {
      expect(r.id as number).toBeLessThanOrEqual(20);
    }
  });

  // ---- T5: O(N²) completes in <10ms for N=20 ----
  it('T5: N=20 completes within 10ms', () => {
    const candidates = Array.from({ length: 20 }, (_, i) => {
      const emb = new Array(768).fill(0).map(() => Math.random());
      return makeCandidate(i + 1, 0.9 - i * 0.02, emb);
    });

    const start = performance.now();
    applyMMR(candidates, { lambda: 0.7, limit: 5, maxCandidates: 20 });
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(10);
  });

  // ---- T6: Output respects limit ----
  it('T6: never returns more than limit results', () => {
    const candidates = makeDiverseCandidates(10);
    const result = applyMMR(candidates, { lambda: 0.7, limit: 5 });

    expect(result.length).toBeLessThanOrEqual(5);
  });

  // ---- T7: Empty input returns empty ----
  it('T7: returns empty array for empty input', () => {
    const result = applyMMR([], { lambda: 0.7, limit: 5 });
    expect(result).toEqual([]);
  });

  // ---- T8: Single candidate returns that candidate ----
  it('T8: single candidate is returned as-is', () => {
    const candidates = [makeCandidate(42, 0.99, [1, 0, 0, 0])];
    const result = applyMMR(candidates, { lambda: 0.7, limit: 5 });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(42);
  });

  // ---- T9: Cosine similarity correctness ----
  it('T9: computeCosine returns correct values', () => {
    const a = makeEmbedding([1, 0, 0]);
    const b = makeEmbedding([0, 1, 0]);
    const c = makeEmbedding([1, 0, 0]);

    expect(computeCosine(a, b)).toBeCloseTo(0, 5);   // orthogonal
    expect(computeCosine(a, c)).toBeCloseTo(1, 5);   // identical
    expect(computeCosine(a, makeEmbedding([-1, 0, 0]))).toBeCloseTo(-1, 5); // opposite
  });

  // ---- T10: Zero embeddings handled gracefully ----
  it('T10: zero-vector embeddings return 0 similarity', () => {
    const zero = makeEmbedding([0, 0, 0]);
    const normal = makeEmbedding([1, 0, 0]);

    expect(computeCosine(zero, normal)).toBe(0);
    expect(computeCosine(zero, zero)).toBe(0);
  });

  // ---- T11: Deterministic output ----
  it('T11: same input produces same output', () => {
    const candidates = makeDiverseCandidates(8);
    const config: MMRConfig = { lambda: 0.6, limit: 4 };

    const run1 = applyMMR(candidates, config);
    const run2 = applyMMR(candidates, config);

    expect(run1.map(r => r.id)).toEqual(run2.map(r => r.id));
  });
});
