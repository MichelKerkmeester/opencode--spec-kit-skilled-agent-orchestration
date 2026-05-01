// ───────────────────────────────────────────────────────────────
// MODULE: F-011-C1-01 NDCG / MRR Metric Tests
// ───────────────────────────────────────────────────────────────
// Exercises the rank-sensitive metrics added to the search-quality harness.
// Closes packet 046 finding F-011-C1-01: precision@K cannot distinguish a
// top-1 hit from a top-3 hit; NDCG@K and MRR can.

import { describe, expect, it } from 'vitest';

import { mrr, ndcgAtK } from './metrics.js';

interface TestCandidate {
  id: string;
  channel: 'memory_search';
  title: string;
  rank: number;
}

function makeCandidates(ids: readonly string[]): TestCandidate[] {
  return ids.map((id, index) => ({
    id,
    channel: 'memory_search' as const,
    title: id,
    rank: index + 1,
  }));
}

describe('F-011-C1-01 NDCG@K', () => {
  it('returns 1.0 when the top result is relevant and only one relevant id exists', () => {
    const candidates = makeCandidates(['a', 'b', 'c']);
    expect(ndcgAtK(candidates, ['a'], 3)).toBe(1);
  });

  it('returns less than 1.0 when the relevant id is at rank 3 not rank 1', () => {
    const candidates = makeCandidates(['x', 'y', 'a']);
    const ndcg = ndcgAtK(candidates, ['a'], 3);
    expect(ndcg).toBeGreaterThan(0);
    expect(ndcg).toBeLessThan(1);
  });

  it('distinguishes top-1 from top-3 hit (rank-sensitivity is the whole point)', () => {
    const candidatesTop1 = makeCandidates(['a', 'x', 'y']);
    const candidatesTop3 = makeCandidates(['x', 'y', 'a']);
    const ndcgTop1 = ndcgAtK(candidatesTop1, ['a'], 3);
    const ndcgTop3 = ndcgAtK(candidatesTop3, ['a'], 3);
    expect(ndcgTop1).toBeGreaterThan(ndcgTop3);
  });

  it('NDCG@10 >= NDCG@3 when relevance is non-zero (monotonicity guard)', () => {
    // Two relevant items: one at rank 2, one at rank 7. NDCG@3 captures only
    // the first; NDCG@10 captures both, so the @10 score must be >= @3.
    const candidates = makeCandidates(['x', 'a', 'y', 'z', 'p', 'q', 'b', 'r', 's', 't']);
    const ndcg3 = ndcgAtK(candidates, ['a', 'b'], 3);
    const ndcg10 = ndcgAtK(candidates, ['a', 'b'], 10);
    expect(ndcg10).toBeGreaterThanOrEqual(ndcg3);
  });

  it('returns 0 when no relevant ids are provided', () => {
    const candidates = makeCandidates(['a', 'b', 'c']);
    expect(ndcgAtK(candidates, [], 3)).toBe(0);
  });

  it('returns 0 when k is zero or negative', () => {
    const candidates = makeCandidates(['a']);
    expect(ndcgAtK(candidates, ['a'], 0)).toBe(0);
    expect(ndcgAtK(candidates, ['a'], -1)).toBe(0);
  });

  it('returns 0 when no relevant id appears in the top-K window', () => {
    const candidates = makeCandidates(['x', 'y', 'z']);
    expect(ndcgAtK(candidates, ['a'], 3)).toBe(0);
  });

  it('result stays in [0, 1] across diverse inputs', () => {
    const fixtures: Array<{ candidates: TestCandidate[]; relevantIds: string[]; k: number }> = [
      { candidates: makeCandidates(['a', 'b', 'c']), relevantIds: ['a'], k: 3 },
      { candidates: makeCandidates(['x', 'a', 'b']), relevantIds: ['a', 'b'], k: 3 },
      { candidates: makeCandidates(['a', 'b', 'c', 'd', 'e']), relevantIds: ['a', 'b', 'c'], k: 5 },
    ];
    for (const { candidates, relevantIds, k } of fixtures) {
      const ndcg = ndcgAtK(candidates, relevantIds, k);
      expect(ndcg).toBeGreaterThanOrEqual(0);
      expect(ndcg).toBeLessThanOrEqual(1);
    }
  });
});

describe('F-011-C1-01 MRR', () => {
  it('returns 1.0 when the top result is relevant', () => {
    const candidates = makeCandidates(['a', 'b', 'c']);
    expect(mrr(candidates, ['a'])).toBe(1);
  });

  it('returns 0.5 when the relevant result is at rank 2', () => {
    const candidates = makeCandidates(['x', 'a', 'b']);
    expect(mrr(candidates, ['a'])).toBeCloseTo(0.5, 5);
  });

  it('returns ~0.333 when the relevant result is at rank 3', () => {
    const candidates = makeCandidates(['x', 'y', 'a']);
    expect(mrr(candidates, ['a'])).toBeCloseTo(1 / 3, 3);
  });

  it('returns 0 when no relevant id appears in candidates', () => {
    const candidates = makeCandidates(['x', 'y', 'z']);
    expect(mrr(candidates, ['a'])).toBe(0);
  });

  it('returns 0 when relevantIds is empty', () => {
    const candidates = makeCandidates(['a', 'b']);
    expect(mrr(candidates, [])).toBe(0);
  });

  it('only the FIRST relevant hit counts (subsequent relevant hits do not raise the score)', () => {
    // Two relevant ids: 'a' at rank 1, 'b' at rank 2.  MRR uses the first
    // hit's reciprocal rank only — should still be 1.0, not 1.5 or 1.0+0.5.
    const candidates = makeCandidates(['a', 'b', 'c']);
    expect(mrr(candidates, ['a', 'b'])).toBe(1);
  });

  it('result stays in [0, 1] (boundary guard)', () => {
    for (let position = 0; position < 5; position++) {
      const ids = ['x', 'y', 'z', 'p', 'q'];
      ids[position] = 'a';
      const candidates = makeCandidates(ids);
      const score = mrr(candidates, ['a']);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    }
  });
});
