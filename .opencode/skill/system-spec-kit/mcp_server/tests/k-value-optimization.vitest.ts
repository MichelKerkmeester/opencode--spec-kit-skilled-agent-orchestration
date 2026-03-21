// ───────────────────────────────────────────────────────────────
// 1. TEST — K-VALUE OPTIMIZATION
// ───────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';
import {
  BASELINE_K,
  K_VALUES,
  argmaxK,
  computeMrrAtK,
  computeNdcgAtK,
  optimizeKValuesByIntent,
  resolveOptimalRrfK,
} from '../lib/eval/k-value-analysis';
import type { IntentKOptimizationQuery } from '../lib/eval/k-value-analysis';

function makeQuery(
  intent: string,
  rankingsByK: IntentKOptimizationQuery['rankingsByK'],
): IntentKOptimizationQuery {
  return {
    intent,
    judgments: [
      { id: 1, relevance: 3 },
      { id: 2, relevance: 2 },
      { id: 3, relevance: 1 },
    ],
    rankingsByK,
  };
}

describe('D1 Phase A: K-value optimization', () => {
  const originalFlag = process.env.SPECKIT_RRF_K_EXPERIMENTAL;

  afterEach(() => {
    if (originalFlag === undefined) {
      delete process.env.SPECKIT_RRF_K_EXPERIMENTAL;
    } else {
      process.env.SPECKIT_RRF_K_EXPERIMENTAL = originalFlag;
    }
  });

  it('uses the D1 K sweep grid {10,20,40,60,80,100,120}', () => {
    expect(K_VALUES).toEqual([10, 20, 40, 60, 80, 100, 120]);
  });

  it('computes NDCG@10 correctly for a known non-perfect ranking', () => {
    const ndcg = computeNdcgAtK(
      [2, 1, 3],
      [
        { id: 1, relevance: 3 },
        { id: 2, relevance: 2 },
        { id: 3, relevance: 1 },
      ],
      10,
    );

    const expectedDcg = (2 / Math.log2(2)) + (3 / Math.log2(3)) + (1 / Math.log2(4));
    const expectedIdcg = (3 / Math.log2(2)) + (2 / Math.log2(3)) + (1 / Math.log2(4));
    expect(ndcg).toBeCloseTo(expectedDcg / expectedIdcg, 8);
  });

  it('computes MRR@5 correctly from the first relevant hit', () => {
    const mrr = computeMrrAtK(
      [5, 3, 1, 2, 4],
      [
        { id: 1, relevance: 3 },
        { id: 3, relevance: 1 },
      ],
      5,
    );

    expect(mrr).toBeCloseTo(1 / 2, 8);
  });

  it('argmax selection chooses the highest ndcg10 K', () => {
    const bestK = argmaxK({
      10: { ndcg10: 0.82 },
      20: { ndcg10: 0.84 },
      40: { ndcg10: 0.81 },
      60: { ndcg10: 0.79 },
    });

    expect(bestK).toBe(20);
  });

  it('tie-breaking prefers the lower K value', () => {
    const bestK = argmaxK({
      10: { ndcg10: 0.84 },
      20: { ndcg10: 0.84 },
      40: { ndcg10: 0.81 },
      60: { ndcg10: 0.79 },
    });

    expect(bestK).toBe(10);
  });

  it('optimizes K per intent across the full sweep', () => {
    const result = optimizeKValuesByIntent([
      makeQuery('literal_lookup', {
        10: [1, 2, 3],
        20: [1, 2, 3],
        40: [2, 1, 3],
        60: [2, 3, 1],
        80: [3, 2, 1],
        100: [3, 1, 2],
        120: [3, 2, 1],
      }),
      makeQuery('understand', {
        10: [3, 2, 1],
        20: [2, 3, 1],
        40: [2, 1, 3],
        60: [1, 3, 2],
        80: [1, 2, 3],
        100: [2, 1, 3],
        120: [3, 1, 2],
      }),
    ]);

    expect(result.bestKByIntent.literal_lookup).toBe(10);
    expect(result.bestKByIntent.understand).toBe(80);
    expect(Object.keys(result.metricsByIntent.literal_lookup).map(Number).sort((left, right) => left - right))
      .toEqual([...K_VALUES]);
  });

  it('handles an empty query set without throwing', () => {
    expect(optimizeKValuesByIntent([])).toEqual({
      bestKByIntent: {},
      metricsByIntent: {},
    });
  });

  it('uses baseline K=60 when experimental K optimization is OFF', () => {
    process.env.SPECKIT_RRF_K_EXPERIMENTAL = 'false';

    const resolved = resolveOptimalRrfK('literal_lookup', {
      literal_lookup: 10,
    });

    expect(resolved).toBe(BASELINE_K);
  });

  it('uses the optimized intent-specific K when the feature flag is ON', () => {
    process.env.SPECKIT_RRF_K_EXPERIMENTAL = 'true';

    const resolved = resolveOptimalRrfK('literal_lookup', {
      literal_lookup: 10,
    });

    expect(resolved).toBe(10);
  });
});
