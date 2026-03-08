// ---------------------------------------------------------------
// MODULE: Test — Ceiling Quality
// ---------------------------------------------------------------
import { describe, it, expect } from 'vitest';

import {
  computeCeilingFromGroundTruth,
  interpretCeilingVsBaseline,
  type CeilingEvalOptions,
  type CeilingQuery,
  type CeilingMemory,
} from '../lib/eval/eval-ceiling';

import {
  computeQualityProxy,
  WEIGHTS,
  DEFAULT_LATENCY_TARGET_MS,
} from '../lib/eval/eval-quality-proxy';

import type { GroundTruthEntry } from '../lib/eval/eval-metrics';

/* ---------------------------------------------------------------
   FIXTURES
--------------------------------------------------------------- */

const QUERIES: CeilingQuery[] = [
  { id: 1, query: 'how to add a feature' },
  { id: 2, query: 'fix authentication bug' },
];

const MEMORIES: CeilingMemory[] = [
  { id: 10, title: 'Feature addition guide', summary: 'How to add features' },
  { id: 20, title: 'Auth bug fix', summary: 'Fix authentication issues' },
  { id: 30, title: 'Unrelated memory', summary: 'Something else entirely' },
];

// Ground truth: q1 → m10 (relevant=3), q2 → m20 (relevant=2), m30 → neither
const GROUND_TRUTH: GroundTruthEntry[] = [
  { queryId: 1, memoryId: 10, relevance: 3 },
  { queryId: 1, memoryId: 30, relevance: 0 },
  { queryId: 2, memoryId: 20, relevance: 2 },
  { queryId: 2, memoryId: 30, relevance: 0 },
];

/* ---------------------------------------------------------------
   T006f — CEILING EVALUATION
--------------------------------------------------------------- */

describe('T006f: computeCeilingFromGroundTruth', () => {
  // -- T006f-01 --------------------------------------------------
  it('T006f-01: perfect ranking → ceilingMRR = 1.0', () => {
    const options: CeilingEvalOptions = {
      queries: [{ id: 1, query: 'test query' }],
      memories: [{ id: 10, title: 'Perfect match' }],
      groundTruth: [{ queryId: 1, memoryId: 10, relevance: 3 }],
    };
    const result = computeCeilingFromGroundTruth(options);

    // Single query, top-ranked memory is the only relevant one → rank 1
    expect(result.ceilingMRR).toBeCloseTo(1.0, 5);
    expect(result.perQueryCeiling).toHaveLength(1);
    expect(result.perQueryCeiling[0].reciprocalRank).toBeCloseTo(1.0, 5);
    expect(result.perQueryCeiling[0].ceilingRank).toBe(1);
  });

  // -- T006f-02 --------------------------------------------------
  it('T006f-02: no relevant results in ground truth → ceilingMRR = 0.0', () => {
    const options: CeilingEvalOptions = {
      queries: [{ id: 1, query: 'test query' }],
      memories: [{ id: 10, title: 'Not relevant' }],
      groundTruth: [{ queryId: 1, memoryId: 10, relevance: 0 }],
    };
    const result = computeCeilingFromGroundTruth(options);

    expect(result.ceilingMRR).toBe(0);
    expect(result.perQueryCeiling[0].reciprocalRank).toBe(0);
  });

  // -- T006f-03 --------------------------------------------------
  it('T006f-03: gap = ceilingMRR − systemMRR when systemMRR provided', () => {
    const options: CeilingEvalOptions = {
      queries: QUERIES,
      memories: MEMORIES,
      groundTruth: GROUND_TRUTH,
      systemMRR: 0.4,
    };
    const result = computeCeilingFromGroundTruth(options);

    expect(result.systemMRR).toBe(0.4);
    // Both queries have their best result at rank 1 → ceilingMRR = 1.0
    expect(result.ceilingMRR).toBeCloseTo(1.0, 5);
    expect(result.gap).toBeCloseTo(1.0 - 0.4, 5);
  });

  // -- T006f-04 --------------------------------------------------
  it('T006f-04: gap equals ceilingMRR when systemMRR is not provided', () => {
    const options: CeilingEvalOptions = {
      queries: QUERIES,
      memories: MEMORIES,
      groundTruth: GROUND_TRUTH,
    };
    const result = computeCeilingFromGroundTruth(options);

    expect(result.systemMRR).toBeUndefined();
    expect(result.gap).toBeCloseTo(result.ceilingMRR, 5);
  });

  // -- T006f-05 --------------------------------------------------
  it('T006f-05: per-query ceiling has correct shape for each query', () => {
    const options: CeilingEvalOptions = {
      queries: QUERIES,
      memories: MEMORIES,
      groundTruth: GROUND_TRUTH,
    };
    const result = computeCeilingFromGroundTruth(options);

    expect(result.perQueryCeiling).toHaveLength(2);

    // Query 1: m10 is most relevant → rank 1
    const q1 = result.perQueryCeiling.find(p => p.queryId === 1);
    expect(q1).toBeDefined();
    expect(q1!.ceilingRank).toBe(1);
    expect(q1!.reciprocalRank).toBeCloseTo(1.0, 5);

    // Query 2: m20 is most relevant → rank 1
    const q2 = result.perQueryCeiling.find(p => p.queryId === 2);
    expect(q2).toBeDefined();
    expect(q2!.ceilingRank).toBe(1);
    expect(q2!.reciprocalRank).toBeCloseTo(1.0, 5);
  });

  // -- T006f-06 --------------------------------------------------
  it('T006f-06: ceiling rank reflects ideal ordering (less-relevant item not at rank 1)', () => {
    // Query with two relevant items: m1=relevance 1, m2=relevance 3
    // Ideal ordering: m2 first, then m1 → first relevant at rank 1
    const options: CeilingEvalOptions = {
      queries: [{ id: 1, query: 'q' }],
      memories: [
        { id: 1, title: 'Partial match' },
        { id: 2, title: 'Full match' },
      ],
      groundTruth: [
        { queryId: 1, memoryId: 1, relevance: 1 },
        { queryId: 1, memoryId: 2, relevance: 3 },
      ],
    };
    const result = computeCeilingFromGroundTruth(options);

    // m2 (relevance 3) should be ranked first → ceilingRank = 1
    expect(result.perQueryCeiling[0].ceilingRank).toBe(1);
    expect(result.ceilingMRR).toBeCloseTo(1.0, 5);
  });

  // -- T006f-07 --------------------------------------------------
  it('T006f-07: empty queries → ceilingMRR = 0 and empty perQueryCeiling', () => {
    const options: CeilingEvalOptions = {
      queries: [],
      memories: MEMORIES,
      groundTruth: GROUND_TRUTH,
    };
    const result = computeCeilingFromGroundTruth(options);

    expect(result.ceilingMRR).toBe(0);
    expect(result.perQueryCeiling).toHaveLength(0);
  });

  // -- T006f-08 --------------------------------------------------
  it('T006f-08: empty groundTruth → ceilingMRR = 0', () => {
    const options: CeilingEvalOptions = {
      queries: QUERIES,
      memories: MEMORIES,
      groundTruth: [],
    };
    const result = computeCeilingFromGroundTruth(options);

    expect(result.ceilingMRR).toBe(0);
  });

  // -- T006f-09 --------------------------------------------------
  it('T006f-09: ceilingMRR is always in [0, 1]', () => {
    const options: CeilingEvalOptions = {
      queries: QUERIES,
      memories: MEMORIES,
      groundTruth: GROUND_TRUTH,
    };
    const result = computeCeilingFromGroundTruth(options);

    expect(result.ceilingMRR).toBeGreaterThanOrEqual(0);
    expect(result.ceilingMRR).toBeLessThanOrEqual(1);
  });

  // -- T006f-10 --------------------------------------------------
  it('T006f-10: interpretation string is non-empty', () => {
    const options: CeilingEvalOptions = {
      queries: QUERIES,
      memories: MEMORIES,
      groundTruth: GROUND_TRUTH,
    };
    const result = computeCeilingFromGroundTruth(options);

    expect(typeof result.interpretation).toBe('string');
    expect(result.interpretation.length).toBeGreaterThan(0);
  });
});

/* ---------------------------------------------------------------
   T006f — 2x2 INTERPRETATION MATRIX
--------------------------------------------------------------- */

describe('T006f: interpretCeilingVsBaseline — 2×2 matrix', () => {
  // -- T006f-11 --------------------------------------------------
  it('T006f-11: high ceiling + low baseline → under-performing quadrant', () => {
    const result = interpretCeilingVsBaseline(0.8, 0.3);

    expect(result.quadrant).toBe('high-ceiling-low-baseline');
    expect(result.interpretation).toMatch(/under-performing|high improvement/i);
    expect(typeof result.recommendation).toBe('string');
    expect(result.recommendation.length).toBeGreaterThan(0);
  });

  // -- T006f-12 --------------------------------------------------
  it('T006f-12: high ceiling + high baseline → performing well quadrant', () => {
    const result = interpretCeilingVsBaseline(0.9, 0.75);

    expect(result.quadrant).toBe('high-ceiling-high-baseline');
    expect(result.interpretation).toMatch(/performing well|diminishing/i);
  });

  // -- T006f-13 --------------------------------------------------
  it('T006f-13: low ceiling + low baseline → data quality issue quadrant', () => {
    const result = interpretCeilingVsBaseline(0.3, 0.2);

    expect(result.quadrant).toBe('low-ceiling-low-baseline');
    expect(result.interpretation).toMatch(/data quality/i);
  });

  // -- T006f-14 --------------------------------------------------
  it('T006f-14: low ceiling + high baseline → near optimal quadrant', () => {
    const result = interpretCeilingVsBaseline(0.5, 0.65);

    expect(result.quadrant).toBe('low-ceiling-high-baseline');
    expect(result.interpretation).toMatch(/near optimal|ceiling/i);
  });

  // -- T006f-15 --------------------------------------------------
  it('T006f-15: boundary value 0.6 is treated as high (≥ threshold)', () => {
    const highCeilingHighBaseline = interpretCeilingVsBaseline(0.6, 0.6);
    expect(highCeilingHighBaseline.quadrant).toBe('high-ceiling-high-baseline');

    const highCeilingLowBaseline = interpretCeilingVsBaseline(0.6, 0.59);
    expect(highCeilingLowBaseline.quadrant).toBe('high-ceiling-low-baseline');
  });
});

/* ---------------------------------------------------------------
   T006g — QUALITY PROXY FORMULA
--------------------------------------------------------------- */

describe('T006g: computeQualityProxy', () => {
  // -- T006g-01 --------------------------------------------------
  it('T006g-01: all perfect inputs → score = 1.0', () => {
    const result = computeQualityProxy({
      avgRelevance: 1.0,
      topResultRelevance: 1.0,
      resultCount: 10,
      expectedCount: 10,
      latencyMs: 0,
      latencyTargetMs: 500,
    });

    expect(result.score).toBeCloseTo(1.0, 5);
    expect(result.interpretation).toBe('excellent');
  });

  // -- T006g-02 --------------------------------------------------
  it('T006g-02: all zero inputs → score = 0.0', () => {
    const result = computeQualityProxy({
      avgRelevance: 0,
      topResultRelevance: 0,
      resultCount: 0,
      expectedCount: 10,
      latencyMs: 1000,
      latencyTargetMs: 500,
    });

    // latencyMs (1000) > latencyTargetMs (500) → penalty = 0
    // countSaturation = 0/10 = 0
    // avgRelevance = 0, topResult = 0
    expect(result.score).toBeCloseTo(0.0, 5);
    expect(result.interpretation).toBe('poor');
  });

  // -- T006g-03 --------------------------------------------------
  it('T006g-03: only top result is good → weighted contribution = 0.25', () => {
    const result = computeQualityProxy({
      avgRelevance: 0,
      topResultRelevance: 1.0,
      resultCount: 0,
      expectedCount: 10,
      latencyMs: 1000, // at/over target → 0
      latencyTargetMs: 500,
    });

    // Expected score = 0 * 0.40 + 1.0 * 0.25 + 0 * 0.20 + 0 * 0.15 = 0.25
    expect(result.score).toBeCloseTo(0.25, 5);
    expect(result.components.topResult).toBeCloseTo(0.25, 5);
    expect(result.components.avgRelevance).toBeCloseTo(0, 5);
    expect(result.components.countSaturation).toBeCloseTo(0, 5);
    expect(result.components.latencyPenalty).toBeCloseTo(0, 5);
  });

  // -- T006g-04 --------------------------------------------------
  it('T006g-04: latency at target → latencyPenalty component = 0', () => {
    const result = computeQualityProxy({
      avgRelevance: 0,
      topResultRelevance: 0,
      resultCount: 0,
      expectedCount: 1,
      latencyMs: 500,
      latencyTargetMs: 500,
    });

    // 1 - 500/500 = 0 → penalty component = 0 * 0.15 = 0
    expect(result.components.latencyPenalty).toBeCloseTo(0, 5);
  });

  // -- T006g-05 --------------------------------------------------
  it('T006g-05: latency at 0 ms → latencyPenalty component = 0.15 (full credit)', () => {
    const result = computeQualityProxy({
      avgRelevance: 0,
      topResultRelevance: 0,
      resultCount: 0,
      expectedCount: 1,
      latencyMs: 0,
      latencyTargetMs: 500,
    });

    // 1 - 0/500 = 1 → penalty component = 1 * 0.15 = 0.15
    expect(result.components.latencyPenalty).toBeCloseTo(WEIGHTS.latencyPenalty, 5);
  });

  // -- T006g-06 --------------------------------------------------
  it('T006g-06: resultCount over expectedCount → countSaturation capped at 1.0', () => {
    const result = computeQualityProxy({
      avgRelevance: 0,
      topResultRelevance: 0,
      resultCount: 20, // 2x over expected
      expectedCount: 10,
      latencyMs: 500,
      latencyTargetMs: 500,
    });

    // min(1, 20/10) = 1 → component = 1 * 0.20 = 0.20
    expect(result.components.countSaturation).toBeCloseTo(WEIGHTS.countSaturation, 5);
  });

  // -- T006g-07 --------------------------------------------------
  it('T006g-07: components sum correctly to composite score', () => {
    const input = {
      avgRelevance: 0.7,
      topResultRelevance: 0.8,
      resultCount: 8,
      expectedCount: 10,
      latencyMs: 200,
      latencyTargetMs: 500,
    };
    const result = computeQualityProxy(input);

    const expectedSum =
      result.components.avgRelevance +
      result.components.topResult +
      result.components.countSaturation +
      result.components.latencyPenalty;

    expect(result.score).toBeCloseTo(expectedSum, 10);
  });

  // -- T006g-08 --------------------------------------------------
  it('T006g-08: interpretation threshold — excellent (≥ 0.8)', () => {
    // Force all components to max
    const result = computeQualityProxy({
      avgRelevance: 1.0,
      topResultRelevance: 1.0,
      resultCount: 10,
      expectedCount: 10,
      latencyMs: 0,
    });
    expect(result.interpretation).toBe('excellent');
    expect(result.score).toBeGreaterThanOrEqual(0.8);
  });

  // -- T006g-09 --------------------------------------------------
  it('T006g-09: interpretation threshold — good (≥ 0.6, < 0.8)', () => {
    // avgRelevance=0.6 → 0.24, topResult=0.6 → 0.15, count full=0.20, latency@0→0.15 = 0.74
    // Use a combination that lands in [0.6, 0.8)
    const result = computeQualityProxy({
      avgRelevance: 0.6,
      topResultRelevance: 0.6,
      resultCount: 10,
      expectedCount: 10,
      latencyMs: 0,
    });
    // 0.6*0.40 + 0.6*0.25 + 1*0.20 + 1*0.15 = 0.24 + 0.15 + 0.20 + 0.15 = 0.74
    expect(result.interpretation).toBe('good');
    expect(result.score).toBeGreaterThanOrEqual(0.6);
    expect(result.score).toBeLessThan(0.8);
  });

  // -- T006g-10 --------------------------------------------------
  it('T006g-10: interpretation threshold — acceptable (≥ 0.4, < 0.6)', () => {
    // avgRelevance=0.3 → 0.12, topResult=0.3 → 0.075, count=0/10=0, latency@500→0
    // 0.12 + 0.075 = 0.195 too low; adjust
    // avgRelevance=0.5 → 0.20, topResult=0.5 → 0.125, count=0, latency=0→0.15 = 0.475
    const result = computeQualityProxy({
      avgRelevance: 0.5,
      topResultRelevance: 0.5,
      resultCount: 0,
      expectedCount: 10,
      latencyMs: 0,
    });
    expect(result.interpretation).toBe('acceptable');
    expect(result.score).toBeGreaterThanOrEqual(0.4);
    expect(result.score).toBeLessThan(0.6);
  });

  // -- T006g-11 --------------------------------------------------
  it('T006g-11: interpretation threshold — poor (< 0.4)', () => {
    const result = computeQualityProxy({
      avgRelevance: 0.1,
      topResultRelevance: 0.1,
      resultCount: 1,
      expectedCount: 10,
      latencyMs: 1000,
      latencyTargetMs: 500,
    });
    // 0.1*0.40 + 0.1*0.25 + 0.1*0.20 + 0*0.15 = 0.04 + 0.025 + 0.02 + 0 = 0.085
    expect(result.interpretation).toBe('poor');
    expect(result.score).toBeLessThan(0.4);
  });

  // -- T006g-12 --------------------------------------------------
  it('T006g-12: score is always in [0, 1] regardless of inputs', () => {
    const edgeCases = [
      { avgRelevance: 2.0, topResultRelevance: 2.0, resultCount: 100, expectedCount: 1, latencyMs: -100 },
      { avgRelevance: -1.0, topResultRelevance: -1.0, resultCount: 0, expectedCount: 0, latencyMs: 0 },
      { avgRelevance: 1.0, topResultRelevance: 1.0, resultCount: 0, expectedCount: 0, latencyMs: 0 },
    ];

    for (const input of edgeCases) {
      const result = computeQualityProxy({ ...input, latencyTargetMs: 500 });
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    }
  });

  // -- T006g-13 --------------------------------------------------
  it('T006g-13: weights sum to 1.0 (design invariant)', () => {
    const weightSum =
      WEIGHTS.avgRelevance +
      WEIGHTS.topResult +
      WEIGHTS.countSaturation +
      WEIGHTS.latencyPenalty;

    expect(weightSum).toBeCloseTo(1.0, 10);
  });

  // -- T006g-14 --------------------------------------------------
  it('T006g-14: default latencyTargetMs is 500 when omitted', () => {
    // At 500ms latency with default target → latency component = 0
    const withDefault = computeQualityProxy({
      avgRelevance: 0,
      topResultRelevance: 0,
      resultCount: 0,
      expectedCount: 1,
      latencyMs: 500,
      // latencyTargetMs intentionally omitted
    });

    const withExplicit = computeQualityProxy({
      avgRelevance: 0,
      topResultRelevance: 0,
      resultCount: 0,
      expectedCount: 1,
      latencyMs: 500,
      latencyTargetMs: DEFAULT_LATENCY_TARGET_MS,
    });

    expect(withDefault.score).toBeCloseTo(withExplicit.score, 10);
  });

  // -- T006g-15 --------------------------------------------------
  it('T006g-15: expectedCount = 0 is handled safely (no division by zero)', () => {
    expect(() =>
      computeQualityProxy({
        avgRelevance: 0.5,
        topResultRelevance: 0.5,
        resultCount: 5,
        expectedCount: 0, // edge case — division by zero guard
        latencyMs: 100,
      }),
    ).not.toThrow();

    const result = computeQualityProxy({
      avgRelevance: 0.5,
      topResultRelevance: 0.5,
      resultCount: 5,
      expectedCount: 0,
      latencyMs: 100,
    });

    expect(Number.isFinite(result.score)).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(1);
  });

  // -- T006g-16 --------------------------------------------------
  it('T006g-16: each component weight matches specification (0.40 / 0.25 / 0.20 / 0.15)', () => {
    expect(WEIGHTS.avgRelevance).toBeCloseTo(0.40, 10);
    expect(WEIGHTS.topResult).toBeCloseTo(0.25, 10);
    expect(WEIGHTS.countSaturation).toBeCloseTo(0.20, 10);
    expect(WEIGHTS.latencyPenalty).toBeCloseTo(0.15, 10);
  });
});
