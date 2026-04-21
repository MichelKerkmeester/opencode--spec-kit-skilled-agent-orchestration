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

function makeContinuityQuery(
  judgments: IntentKOptimizationQuery['judgments'],
  rankingsByK: IntentKOptimizationQuery['rankingsByK'],
): IntentKOptimizationQuery {
  return {
    intent: 'continuity',
    judgments,
    rankingsByK,
  };
}

const CONTINUITY_FIXTURES = [
  // These first rows model the generic resume ladder when a packet-local
  // handover.md is present. Later rows model shipped compact continuity and
  // canonical-doc fallback paths for packets that do not include handover.md.
  {
    query: 'Resume from the latest stop-state when handover.md exists for this packet',
    expectedPrimaryAt60: 'handover.md',
    evaluation: makeContinuityQuery(
      [
        { id: 'handover.md', relevance: 3 },
        { id: '_memory.continuity', relevance: 2 },
        { id: 'spec-docs', relevance: 1 },
      ],
      {
        10: ['_memory.continuity', 'handover.md', 'spec-docs'],
        20: ['handover.md', 'spec-docs', '_memory.continuity'],
        40: ['handover.md', 'spec-docs', '_memory.continuity'],
        60: ['handover.md', '_memory.continuity', 'spec-docs'],
        80: ['_memory.continuity', 'handover.md', 'spec-docs'],
        100: ['spec-docs', 'handover.md', '_memory.continuity'],
        120: ['spec-docs', '_memory.continuity', 'handover.md'],
      },
    ),
  },
  {
    query: 'What is the next safe action if I continue this phase later and handover.md exists',
    expectedPrimaryAt60: 'handover.md',
    evaluation: makeContinuityQuery(
      [
        { id: 'handover.md', relevance: 3 },
        { id: '_memory.continuity', relevance: 2 },
        { id: 'tasks.md', relevance: 1 },
      ],
      {
        10: ['_memory.continuity', 'handover.md', 'tasks.md'],
        20: ['handover.md', 'tasks.md', '_memory.continuity'],
        40: ['handover.md', 'tasks.md', '_memory.continuity'],
        60: ['handover.md', '_memory.continuity', 'tasks.md'],
        80: ['handover.md', 'tasks.md', '_memory.continuity'],
        100: ['tasks.md', '_memory.continuity', 'handover.md'],
        120: ['tasks.md', 'handover.md', '_memory.continuity'],
      },
    ),
  },
  {
    query: 'Which blocker was most recently recorded when handover.md exists for this packet',
    expectedPrimaryAt60: 'handover.md',
    evaluation: makeContinuityQuery(
      [
        { id: 'handover.md', relevance: 3 },
        { id: '_memory.continuity', relevance: 2 },
        { id: 'implementation-summary.md', relevance: 1 },
      ],
      {
        10: ['implementation-summary.md', 'handover.md', '_memory.continuity'],
        20: ['handover.md', 'implementation-summary.md', '_memory.continuity'],
        40: ['handover.md', 'implementation-summary.md', '_memory.continuity'],
        60: ['handover.md', '_memory.continuity', 'implementation-summary.md'],
        80: ['_memory.continuity', 'handover.md', 'implementation-summary.md'],
        100: ['implementation-summary.md', '_memory.continuity', 'handover.md'],
        120: ['implementation-summary.md', 'handover.md', '_memory.continuity'],
      },
    ),
  },
  {
    query: 'Show me the latest handover.md resume note before I restart work',
    expectedPrimaryAt60: 'handover.md',
    evaluation: makeContinuityQuery(
      [
        { id: 'handover.md', relevance: 3 },
        { id: '_memory.continuity', relevance: 2 },
        { id: 'plan.md', relevance: 1 },
      ],
      {
        10: ['_memory.continuity', 'handover.md', 'plan.md'],
        20: ['handover.md', 'plan.md', '_memory.continuity'],
        40: ['handover.md', 'plan.md', '_memory.continuity'],
        60: ['handover.md', '_memory.continuity', 'plan.md'],
        80: ['handover.md', 'plan.md', '_memory.continuity'],
        100: ['plan.md', '_memory.continuity', 'handover.md'],
        120: ['plan.md', 'handover.md', '_memory.continuity'],
      },
    ),
  },
  {
    query: 'What continuity fingerprint and packet pointer should I reuse',
    expectedPrimaryAt60: '_memory.continuity',
    evaluation: makeContinuityQuery(
      [
        { id: '_memory.continuity', relevance: 3 },
        { id: 'handover.md', relevance: 2 },
        { id: 'spec-docs', relevance: 1 },
      ],
      {
        10: ['handover.md', '_memory.continuity', 'spec-docs'],
        20: ['_memory.continuity', 'spec-docs', 'handover.md'],
        40: ['_memory.continuity', 'spec-docs', 'handover.md'],
        60: ['_memory.continuity', 'handover.md', 'spec-docs'],
        80: ['handover.md', '_memory.continuity', 'spec-docs'],
        100: ['spec-docs', '_memory.continuity', 'handover.md'],
        120: ['spec-docs', 'handover.md', '_memory.continuity'],
      },
    ),
  },
  {
    query: 'Find the compact continuity fields for this implementation summary',
    expectedPrimaryAt60: '_memory.continuity',
    evaluation: makeContinuityQuery(
      [
        { id: '_memory.continuity', relevance: 3 },
        { id: 'implementation-summary.md', relevance: 2 },
        { id: 'handover.md', relevance: 1 },
      ],
      {
        10: ['implementation-summary.md', '_memory.continuity', 'handover.md'],
        20: ['_memory.continuity', 'implementation-summary.md', 'handover.md'],
        40: ['_memory.continuity', 'handover.md', 'implementation-summary.md'],
        60: ['_memory.continuity', 'implementation-summary.md', 'handover.md'],
        80: ['implementation-summary.md', '_memory.continuity', 'handover.md'],
        100: ['handover.md', '_memory.continuity', 'implementation-summary.md'],
        120: ['handover.md', 'implementation-summary.md', '_memory.continuity'],
      },
    ),
  },
  {
    query: 'Which preflight and postflight continuity fields were last saved',
    expectedPrimaryAt60: '_memory.continuity',
    evaluation: makeContinuityQuery(
      [
        { id: '_memory.continuity', relevance: 3 },
        { id: 'handover.md', relevance: 2 },
        { id: 'implementation-summary.md', relevance: 1 },
      ],
      {
        10: ['handover.md', '_memory.continuity', 'implementation-summary.md'],
        20: ['_memory.continuity', 'handover.md', 'implementation-summary.md'],
        40: ['_memory.continuity', 'implementation-summary.md', 'handover.md'],
        60: ['_memory.continuity', 'handover.md', 'implementation-summary.md'],
        80: ['handover.md', '_memory.continuity', 'implementation-summary.md'],
        100: ['implementation-summary.md', '_memory.continuity', 'handover.md'],
        120: ['implementation-summary.md', 'handover.md', '_memory.continuity'],
      },
    ),
  },
  {
    query: 'Where is the machine-owned continuity state for this packet',
    expectedPrimaryAt60: '_memory.continuity',
    evaluation: makeContinuityQuery(
      [
        { id: '_memory.continuity', relevance: 3 },
        { id: 'handover.md', relevance: 2 },
        { id: 'tasks.md', relevance: 1 },
      ],
      {
        10: ['tasks.md', '_memory.continuity', 'handover.md'],
        20: ['_memory.continuity', 'tasks.md', 'handover.md'],
        40: ['_memory.continuity', 'handover.md', 'tasks.md'],
        60: ['_memory.continuity', 'handover.md', 'tasks.md'],
        80: ['handover.md', '_memory.continuity', 'tasks.md'],
        100: ['tasks.md', '_memory.continuity', 'handover.md'],
        120: ['tasks.md', 'handover.md', '_memory.continuity'],
      },
    ),
  },
  {
    query: 'Summarize the canonical documents after handover and continuity are exhausted',
    expectedPrimaryAt60: 'spec.md',
    evaluation: makeContinuityQuery(
      [
        { id: 'spec.md', relevance: 3 },
        { id: 'plan.md', relevance: 2 },
        { id: 'tasks.md', relevance: 1 },
      ],
      {
        10: ['tasks.md', 'spec.md', 'plan.md'],
        20: ['spec.md', 'tasks.md', 'plan.md'],
        40: ['spec.md', 'tasks.md', 'plan.md'],
        60: ['spec.md', 'plan.md', 'tasks.md'],
        80: ['plan.md', 'spec.md', 'tasks.md'],
        100: ['tasks.md', 'plan.md', 'spec.md'],
        120: ['tasks.md', 'spec.md', 'plan.md'],
      },
    ),
  },
  {
    query: 'Which canonical spec doc best explains the phase goal after the resume ladder',
    expectedPrimaryAt60: 'spec.md',
    evaluation: makeContinuityQuery(
      [
        { id: 'spec.md', relevance: 3 },
        { id: 'plan.md', relevance: 2 },
        { id: 'tasks.md', relevance: 1 },
      ],
      {
        10: ['plan.md', 'spec.md', 'tasks.md'],
        20: ['spec.md', 'tasks.md', 'plan.md'],
        40: ['spec.md', 'tasks.md', 'plan.md'],
        60: ['spec.md', 'plan.md', 'tasks.md'],
        80: ['plan.md', 'spec.md', 'tasks.md'],
        100: ['tasks.md', 'plan.md', 'spec.md'],
        120: ['tasks.md', 'spec.md', 'plan.md'],
      },
    ),
  },
  {
    query: 'Which document should I read for the step-by-step execution plan once resume notes are consumed',
    expectedPrimaryAt60: 'plan.md',
    evaluation: makeContinuityQuery(
      [
        { id: 'plan.md', relevance: 3 },
        { id: 'tasks.md', relevance: 2 },
        { id: 'spec.md', relevance: 1 },
      ],
      {
        10: ['tasks.md', 'plan.md', 'spec.md'],
        20: ['plan.md', 'spec.md', 'tasks.md'],
        40: ['plan.md', 'spec.md', 'tasks.md'],
        60: ['plan.md', 'tasks.md', 'spec.md'],
        80: ['tasks.md', 'plan.md', 'spec.md'],
        100: ['spec.md', 'plan.md', 'tasks.md'],
        120: ['spec.md', 'tasks.md', 'plan.md'],
      },
    ),
  },
  {
    query: 'Which canonical doc should I use to update completion state after resume context',
    expectedPrimaryAt60: 'tasks.md',
    evaluation: makeContinuityQuery(
      [
        { id: 'tasks.md', relevance: 3 },
        { id: 'plan.md', relevance: 2 },
        { id: 'spec.md', relevance: 1 },
      ],
      {
        10: ['plan.md', 'tasks.md', 'spec.md'],
        20: ['tasks.md', 'spec.md', 'plan.md'],
        40: ['tasks.md', 'spec.md', 'plan.md'],
        60: ['tasks.md', 'plan.md', 'spec.md'],
        80: ['plan.md', 'tasks.md', 'spec.md'],
        100: ['spec.md', 'tasks.md', 'plan.md'],
        120: ['spec.md', 'plan.md', 'tasks.md'],
      },
    ),
  },
] as const;

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
      makeQuery('continuity', {
        10: [3, 1, 2],
        20: [2, 1, 3],
        40: [1, 3, 2],
        60: [1, 2, 3],
        80: [2, 1, 3],
        100: [2, 3, 1],
        120: [3, 2, 1],
      }),
    ]);

    expect(result.bestKByIntent.literal_lookup).toBe(10);
    expect(result.bestKByIntent.understand).toBe(80);
    expect(result.bestKByIntent.continuity).toBe(60);
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

  it('keeps the continuity recommendation on baseline K=60 across generic handover and compact-continuity fixtures', () => {
    const result = optimizeKValuesByIntent(CONTINUITY_FIXTURES.map((fixture) => fixture.evaluation));

    expect(CONTINUITY_FIXTURES).toHaveLength(12);
    expect(CONTINUITY_FIXTURES.slice(0, 4).every((fixture) => fixture.query.includes('handover.md'))).toBe(true);
    expect(CONTINUITY_FIXTURES.slice(4).some((fixture) => fixture.expectedPrimaryAt60 === '_memory.continuity')).toBe(true);
    for (const fixture of CONTINUITY_FIXTURES) {
      expect(
        fixture.evaluation.rankingsByK[60]?.[0],
        `K=60 should surface ${fixture.expectedPrimaryAt60} first for "${fixture.query}"`,
      ).toBe(fixture.expectedPrimaryAt60);
    }

    expect(result.bestKByIntent.continuity).toBe(BASELINE_K);
    expect(result.metricsByIntent.continuity[60].ndcg10).toBeGreaterThan(result.metricsByIntent.continuity[40].ndcg10);
    expect(result.metricsByIntent.continuity[60].ndcg10).toBeGreaterThan(result.metricsByIntent.continuity[80].ndcg10);
    expect(result.bestKByIntent.continuity === BASELINE_K ? 'keep' : 'change').toBe('keep');
  });
});
