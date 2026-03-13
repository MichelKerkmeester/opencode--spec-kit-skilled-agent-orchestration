// TEST: RSF Fusion Edge Cases (A3-P2-5)
// Tests edge-case behavior for fuseResultsRsfCrossVariant()
// Including zero variants, single variant, extreme scores,
// And duplicate IDs across variants.
import { describe, it, expect } from 'vitest';
import {
  fuseResultsRsfCrossVariant,
  fuseResultsRsfMulti,
  clamp01,
} from '../lib/search/rsf-fusion';

type CrossVariantResult = ReturnType<typeof fuseResultsRsfCrossVariant>[number];

function expectDefined<T>(value: T | undefined, label: string): T {
  expect(value).toBeDefined();
  if (value === undefined) {
    throw new Error(`Expected ${label} to be defined`);
  }
  return value;
}

describe('RSF Cross-Variant Fusion – Zero Variants', () => {
  it('returns empty array when given an empty variants array', () => {
    const results = fuseResultsRsfCrossVariant([]);
    expect(results).toEqual([]);
  });

  it('returns empty array when all variants contain empty lists', () => {
    const results = fuseResultsRsfCrossVariant([
      [{ source: 'vector', results: [] }],
      [{ source: 'bm25', results: [] }],
    ]);
    expect(results).toEqual([]);
  });
});

describe('RSF Cross-Variant Fusion – Single Variant', () => {
  it('returns results without cross-variant bonus for a single variant', () => {
    const results = fuseResultsRsfCrossVariant([
      [
        { source: 'vector', results: [{ id: 1, score: 0.9 }] },
        { source: 'bm25', results: [{ id: 1, score: 0.8 }] },
      ],
    ]);

    expect(results.length).toBe(1);
    expect(results[0].id).toBe(1);
    // Single variant: no cross-variant bonus should be applied
    // The rsfScore comes from fuseResultsRsfMulti only
    const multiResult = fuseResultsRsfMulti([
      { source: 'vector', results: [{ id: 1, score: 0.9 }] },
      { source: 'bm25', results: [{ id: 1, score: 0.8 }] },
    ]);
    expect(results[0].rsfScore).toBeCloseTo(multiResult[0].rsfScore, 5);
  });

  it('single variant with single source applies single-source penalty', () => {
    const results = fuseResultsRsfCrossVariant([
      [{ source: 'vector', results: [{ id: 'doc1', score: 0.7 }] }],
    ]);

    expect(results.length).toBe(1);
    expect(results[0].id).toBe('doc1');
    // Single source in single variant: no cross-variant bonus
    expect(results[0].rsfScore).toBeLessThanOrEqual(1.0);
    expect(results[0].rsfScore).toBeGreaterThanOrEqual(0);
  });
});

describe('RSF Cross-Variant Fusion – Extreme Scores', () => {
  it('handles items with score of 0', () => {
    const results = fuseResultsRsfCrossVariant([
      [{ source: 'vector', results: [{ id: 'zero', score: 0 }] }],
    ]);

    expect(results.length).toBe(1);
    expect(results[0].id).toBe('zero');
    expect(results[0].rsfScore).toBeGreaterThanOrEqual(0);
    expect(results[0].rsfScore).toBeLessThanOrEqual(1);
  });

  it('handles items with score of 1', () => {
    const results = fuseResultsRsfCrossVariant([
      [{ source: 'vector', results: [{ id: 'perfect', score: 1 }] }],
    ]);

    expect(results.length).toBe(1);
    expect(results[0].id).toBe('perfect');
    expect(results[0].rsfScore).toBeGreaterThanOrEqual(0);
    expect(results[0].rsfScore).toBeLessThanOrEqual(1);
  });

  it('handles mix of 0 and 1 scores within the same source', () => {
    const results = fuseResultsRsfCrossVariant([
      [
        {
          source: 'vector',
          results: [
            { id: 'high', score: 1.0 },
            { id: 'low', score: 0.0 },
          ],
        },
      ],
    ]);

    expect(results.length).toBe(2);
    // The item with score=1 should rank above the item with score=0
    const highIdx = results.findIndex((r: CrossVariantResult) => r.id === 'high');
    const lowIdx = results.findIndex((r: CrossVariantResult) => r.id === 'low');
    expect(highIdx).toBeLessThan(lowIdx);
  });

  it('all scores clamped to [0, 1] even with cross-variant bonus', () => {
    // Two variants both containing the same item with score=1
    // Cross-variant bonus of +0.10 would push avgScore=1.0 to 1.10
    // But clamp01 should cap it at 1.0
    const results = fuseResultsRsfCrossVariant([
      [{ source: 'vector', results: [{ id: 'hot', score: 1.0 }] }],
      [{ source: 'vector', results: [{ id: 'hot', score: 1.0 }] }],
    ]);

    expect(results.length).toBe(1);
    expect(results[0].id).toBe('hot');
    expect(results[0].rsfScore).toBeLessThanOrEqual(1.0);
    expect(results[0].rsfScore).toBeGreaterThanOrEqual(0);
  });
});

describe('RSF Cross-Variant Fusion – Duplicate IDs Across Variants', () => {
  it('merges duplicate IDs across two variants and applies cross-variant bonus', () => {
    // The target item ('shared') must NOT be the top scorer in its source.
    // Min-max normalization always maps the max to 1.0, which makes the
    // Cross-variant bonus invisible after clamp01. Using 3 items where
    // 'shared' is in the middle produces a normalized score < 1.0.
    const mkVariantList = (src: string) => [{ source: src, results: [
      { id: 'top_' + src, score: 1.0 },
      { id: 'shared', score: 0.5 },
      { id: 'low_' + src, score: 0.0 },
    ]}];

    const results = fuseResultsRsfCrossVariant([
      mkVariantList('vector'),
      mkVariantList('bm25'),
    ]);

    const shared = expectDefined(results.find((r: CrossVariantResult) => r.id === 'shared'), 'shared');

    // Compare against single-variant result to verify cross-variant bonus
    const singleVariant = fuseResultsRsfCrossVariant([
      mkVariantList('vector'),
    ]);
    const sharedSingle = expectDefined(
      singleVariant.find((r: CrossVariantResult) => r.id === 'shared'),
      'shared'
    );
    expect(shared.rsfScore).toBeGreaterThan(sharedSingle.rsfScore);
  });

  it('items unique to one variant do not receive cross-variant bonus', () => {
    const results = fuseResultsRsfCrossVariant([
      [{ source: 'vector', results: [
        { id: 'shared', score: 0.8 },
        { id: 'unique_a', score: 0.7 },
      ]}],
      [{ source: 'bm25', results: [
        { id: 'shared', score: 0.6 },
        { id: 'unique_b', score: 0.5 },
      ]}],
    ]);

    const shared = expectDefined(results.find((r: CrossVariantResult) => r.id === 'shared'), 'shared');
    const uniqueA = expectDefined(results.find((r: CrossVariantResult) => r.id === 'unique_a'), 'unique_a');
    const uniqueB = expectDefined(results.find((r: CrossVariantResult) => r.id === 'unique_b'), 'unique_b');

    // Shared item should rank higher due to cross-variant bonus
    expect(shared.rsfScore).toBeGreaterThan(uniqueA.rsfScore);
    expect(shared.rsfScore).toBeGreaterThan(uniqueB.rsfScore);
  });

  it('duplicate IDs across three variants receive proportional bonus', () => {
    // Target item must not be the max scorer — see note in the 2-variant test above.
    const mkVariantList = (src: string) => [{ source: src, results: [
      { id: 'top_' + src, score: 1.0 },
      { id: 'triple', score: 0.5 },
      { id: 'low_' + src, score: 0.0 },
    ]}];

    const results = fuseResultsRsfCrossVariant([
      mkVariantList('vector'),
      mkVariantList('bm25'),
      mkVariantList('fts'),
    ]);

    const triple = expectDefined(results.find((r: CrossVariantResult) => r.id === 'triple'), 'triple');

    // 3 variants: bonus = 0.10 * (3-1) = 0.20
    // Compare against 2-variant result which gets bonus = 0.10 * (2-1) = 0.10
    const twoVariant = fuseResultsRsfCrossVariant([
      mkVariantList('vector'),
      mkVariantList('bm25'),
    ]);
    const tripleTwoVar = expectDefined(
      twoVariant.find((r: CrossVariantResult) => r.id === 'triple'),
      'triple'
    );

    expect(triple.rsfScore).toBeGreaterThan(tripleTwoVar.rsfScore);
  });

  it('results are sorted descending by rsfScore', () => {
    const results = fuseResultsRsfCrossVariant([
      [{ source: 'vector', results: [
        { id: 'a', score: 0.9 },
        { id: 'b', score: 0.3 },
        { id: 'c', score: 0.6 },
      ]}],
      [{ source: 'bm25', results: [
        { id: 'c', score: 0.7 },
      ]}],
    ]);

    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].rsfScore).toBeGreaterThanOrEqual(results[i].rsfScore);
    }
  });

  it('source deduplication: same source name across variants is not duplicated in sources array', () => {
    const results = fuseResultsRsfCrossVariant([
      [{ source: 'vector', results: [{ id: 'dedup', score: 0.8 }] }],
      [{ source: 'vector', results: [{ id: 'dedup', score: 0.7 }] }],
    ]);

    expect(results.length).toBe(1);
    // Sources should be deduplicated — "vector" appears once
    const vectorCount = results[0].sources.filter((s: string) => s === 'vector').length;
    expect(vectorCount).toBe(1);
  });
});

describe('RSF Helpers – clamp01', () => {
  it('clamps negative values to 0', () => {
    expect(clamp01(-0.5)).toBe(0);
    expect(clamp01(-100)).toBe(0);
  });

  it('clamps values above 1 to 1', () => {
    expect(clamp01(1.5)).toBe(1);
    expect(clamp01(100)).toBe(1);
  });

  it('passes through values in [0, 1] unchanged', () => {
    expect(clamp01(0)).toBe(0);
    expect(clamp01(0.5)).toBe(0.5);
    expect(clamp01(1)).toBe(1);
  });
});
