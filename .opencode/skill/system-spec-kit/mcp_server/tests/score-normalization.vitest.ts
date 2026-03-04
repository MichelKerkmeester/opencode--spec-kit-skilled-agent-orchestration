// @ts-nocheck
// ---------------------------------------------------------------
// MODULE: Test — Score Normalization
// ---------------------------------------------------------------
// Score Normalization & K-Value Analysis

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the problematic @spec-kit/shared dependency chain
// so composite-scoring.ts can be imported without the shared workspace being linked
vi.mock('../lib/scoring/folder-scoring', () => ({
  computeRecencyScore: (_ts: string, _tier: string, _rate: number) => 0.5,
  DECAY_RATE: 0.01,
}));

vi.mock('../lib/storage/access-tracker', () => ({
  calculatePopularityScore: () => 0.5,
}));

vi.mock('../lib/scoring/importance-tiers', () => ({
  getTierConfig: (tier: string) => ({
    value: tier === 'constitutional' ? 1.0 : tier === 'critical' ? 0.8 : 0.5,
  }),
}));

import {
  fuseResultsMulti,
  fuseResultsCrossVariant,
  isScoreNormalizationEnabled,
  normalizeRrfScores,
} from '@spec-kit/shared/algorithms/rrf-fusion';
import type { FusionResult, RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';
import {
  normalizeCompositeScores,
  isCompositeNormalizationEnabled,
} from '../lib/scoring/composite-scoring';
import {
  analyzeKValueSensitivity,
  kendallTau,
  mrr5,
  K_VALUES,
  BASELINE_K,
} from '../lib/eval/k-value-analysis';

/* ---------------------------------------------------------------
   Helpers
   --------------------------------------------------------------- */

/** Build a simple RankedList for testing. */
function makeList(source: string, ids: number[], weight?: number): RankedList {
  return {
    source,
    results: ids.map(id => ({ id })),
    weight,
  };
}

/** Build a FusionResult stub for normalizeRrfScores tests. */
function makeFusionResult(id: number, rrfScore: number): FusionResult {
  return {
    id,
    rrfScore,
    sources: ['test'],
    sourceScores: { test: rrfScore },
    convergenceBonus: 0,
  };
}

/* ---------------------------------------------------------------
   1. RRF Score Normalization
   --------------------------------------------------------------- */

describe('RRF Score Normalization (T004)', () => {
  const originalEnv = process.env.SPECKIT_SCORE_NORMALIZATION;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.SPECKIT_SCORE_NORMALIZATION;
    } else {
      process.env.SPECKIT_SCORE_NORMALIZATION = originalEnv;
    }
  });

  describe('normalizeRrfScores (direct)', () => {
    it('normalizes scores to [0,1] range', () => {
      const results = [
        makeFusionResult(1, 0.5),
        makeFusionResult(2, 0.3),
        makeFusionResult(3, 0.1),
      ];

      normalizeRrfScores(results);

      // Max (0.5) -> 1.0, Min (0.1) -> 0.0, Mid (0.3) -> 0.5
      expect(results[0].rrfScore).toBeCloseTo(1.0, 5);
      expect(results[1].rrfScore).toBeCloseTo(0.5, 5);
      expect(results[2].rrfScore).toBeCloseTo(0.0, 5);

      // All in [0,1]
      for (const r of results) {
        expect(r.rrfScore).toBeGreaterThanOrEqual(0);
        expect(r.rrfScore).toBeLessThanOrEqual(1);
      }
    });

    it('single result normalizes to 1.0', () => {
      const results = [makeFusionResult(1, 0.42)];
      normalizeRrfScores(results);
      expect(results[0].rrfScore).toBe(1.0);
    });

    it('equal scores normalize to 1.0', () => {
      const results = [
        makeFusionResult(1, 0.25),
        makeFusionResult(2, 0.25),
        makeFusionResult(3, 0.25),
      ];

      normalizeRrfScores(results);

      for (const r of results) {
        expect(r.rrfScore).toBe(1.0);
      }
    });

    it('empty array is a no-op', () => {
      const results: FusionResult[] = [];
      normalizeRrfScores(results);
      expect(results).toEqual([]);
    });
  });

  describe('fuseResultsMulti with normalization', () => {
    it('produces [0,1] scores when normalization enabled', () => {
      process.env.SPECKIT_SCORE_NORMALIZATION = 'true';

      const lists: RankedList[] = [
        makeList('vector', [1, 2, 3, 4, 5]),
        makeList('bm25', [3, 1, 5, 6, 7]),
      ];

      const results = fuseResultsMulti(lists);

      expect(results.length).toBeGreaterThan(0);
      for (const r of results) {
        expect(r.rrfScore).toBeGreaterThanOrEqual(0);
        expect(r.rrfScore).toBeLessThanOrEqual(1);
      }
      // Top result should be 1.0
      expect(results[0].rrfScore).toBeCloseTo(1.0, 5);
      // Bottom result should be 0.0 (assuming more than one distinct score)
      expect(results[results.length - 1].rrfScore).toBeCloseTo(0.0, 5);
    });

    it('normalization enabled by default (graduated-ON)', () => {
      delete process.env.SPECKIT_SCORE_NORMALIZATION;

      const lists: RankedList[] = [
        makeList('vector', [1, 2, 3]),
        makeList('bm25', [2, 3, 4]),
      ];

      const results = fuseResultsMulti(lists);

      // Graduated-ON: normalization is active when env var is unset
      expect(results.length).toBeGreaterThan(0);
      expect(isScoreNormalizationEnabled()).toBe(true);
    });

    it('normalization disabled when flag is explicitly "false"', () => {
      process.env.SPECKIT_SCORE_NORMALIZATION = 'false';

      expect(isScoreNormalizationEnabled()).toBe(false);

      const lists: RankedList[] = [
        makeList('vector', [1, 2]),
      ];

      const results = fuseResultsMulti(lists);
      // Raw scores should be present (not normalized to [0,1])
      expect(results.length).toBe(2);
    });
  });

  describe('fuseResultsCrossVariant with normalization', () => {
    it('cross-variant fusion normalizes to [0,1] when enabled', () => {
      process.env.SPECKIT_SCORE_NORMALIZATION = 'true';

      const variant1: RankedList[] = [
        makeList('vector', [1, 2, 3]),
        makeList('bm25', [2, 3, 4]),
      ];
      const variant2: RankedList[] = [
        makeList('vector', [3, 5, 1]),
        makeList('bm25', [1, 5, 6]),
      ];

      const results = fuseResultsCrossVariant([variant1, variant2]);

      expect(results.length).toBeGreaterThan(0);
      for (const r of results) {
        expect(r.rrfScore).toBeGreaterThanOrEqual(0);
        expect(r.rrfScore).toBeLessThanOrEqual(1);
      }
      // Top result should be 1.0
      expect(results[0].rrfScore).toBeCloseTo(1.0, 5);
    });
  });
});

/* ---------------------------------------------------------------
   2. Composite Score Normalization
   --------------------------------------------------------------- */

describe('Composite Score Normalization (T004)', () => {
  const originalEnv = process.env.SPECKIT_SCORE_NORMALIZATION;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.SPECKIT_SCORE_NORMALIZATION;
    } else {
      process.env.SPECKIT_SCORE_NORMALIZATION = originalEnv;
    }
  });

  it('normalizes a batch of composite scores to [0,1]', () => {
    process.env.SPECKIT_SCORE_NORMALIZATION = 'true';

    const scores = [0.8, 0.4, 0.6, 0.2];
    const normalized = normalizeCompositeScores(scores);

    expect(normalized).toHaveLength(4);
    expect(normalized[0]).toBeCloseTo(1.0, 5);   // max -> 1.0
    expect(normalized[3]).toBeCloseTo(0.0, 5);   // min -> 0.0
    expect(normalized[2]).toBeCloseTo(2 / 3, 4); // (0.6-0.2)/(0.8-0.2) = 0.667

    for (const s of normalized) {
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(1);
    }
  });

  it('returns scores unchanged when flag is disabled', () => {
    process.env.SPECKIT_SCORE_NORMALIZATION = 'false';

    const scores = [0.8, 0.4, 0.6];
    const result = normalizeCompositeScores(scores);

    expect(result).toEqual(scores);
  });

  it('handles empty array', () => {
    process.env.SPECKIT_SCORE_NORMALIZATION = 'true';
    expect(normalizeCompositeScores([])).toEqual([]);
  });

  it('equal scores normalize to 1.0', () => {
    process.env.SPECKIT_SCORE_NORMALIZATION = 'true';

    const scores = [0.5, 0.5, 0.5];
    const normalized = normalizeCompositeScores(scores);

    for (const s of normalized) {
      expect(s).toBe(1.0);
    }
  });

  it('single score normalizes to 1.0', () => {
    process.env.SPECKIT_SCORE_NORMALIZATION = 'true';

    const normalized = normalizeCompositeScores([0.42]);
    expect(normalized).toEqual([1.0]);
  });
});

/* ---------------------------------------------------------------
   3. K-Value Sensitivity Analysis (T004a)
   --------------------------------------------------------------- */

describe('K-Value Sensitivity Analysis (T004a)', () => {
  const testLists: RankedList[] = [
    makeList('vector', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    makeList('bm25', [3, 1, 5, 7, 2, 9, 10, 4, 6, 8]),
    makeList('fts', [5, 3, 7, 1, 9, 2, 8, 10, 4, 6]),
  ];

  it('produces results for all 5 K values', () => {
    const analysis = analyzeKValueSensitivity(testLists, 1);

    expect(Object.keys(analysis.results)).toHaveLength(5);
    for (const k of K_VALUES) {
      expect(analysis.results[k]).toBeDefined();
      expect(analysis.results[k].mrr5).toBeDefined();
      expect(analysis.results[k].kendallTau).toBeDefined();
      expect(analysis.results[k].avgScore).toBeDefined();
    }
  });

  it('baseline K is 60', () => {
    const analysis = analyzeKValueSensitivity(testLists, 1);
    expect(analysis.baselineK).toBe(60);
  });

  it('K=60 has kendallTau = 1.0 (correlation with itself)', () => {
    const analysis = analyzeKValueSensitivity(testLists, 1);
    expect(analysis.results[60].kendallTau).toBeCloseTo(1.0, 5);
  });

  it('K=60 has highest mrr5 (self-retrieval)', () => {
    const analysis = analyzeKValueSensitivity(testLists, 1);
    // MRR@5 for self-retrieval = mean(1/1, 1/2, 1/3, 1/4, 1/5) = ~0.4567
    // This is correct: MRR averages the reciprocal ranks of top-5 items
    const selfMrr = analysis.results[60].mrr5;
    expect(selfMrr).toBeCloseTo(0.4567, 2);
    // K=60 should have the highest or equal MRR since it's the baseline
    for (const k of K_VALUES) {
      expect(selfMrr).toBeGreaterThanOrEqual(analysis.results[k].mrr5 - 0.001);
    }
  });

  it('Kendall tau is in [-1, 1] range for all K values', () => {
    const analysis = analyzeKValueSensitivity(testLists, 1);

    for (const k of K_VALUES) {
      expect(analysis.results[k].kendallTau).toBeGreaterThanOrEqual(-1);
      expect(analysis.results[k].kendallTau).toBeLessThanOrEqual(1);
    }
  });

  it('MRR@5 is in [0, 1] range for all K values', () => {
    const analysis = analyzeKValueSensitivity(testLists, 1);

    for (const k of K_VALUES) {
      expect(analysis.results[k].mrr5).toBeGreaterThanOrEqual(0);
      expect(analysis.results[k].mrr5).toBeLessThanOrEqual(1);
    }
  });

  it('avgScore is non-negative for all K values', () => {
    const analysis = analyzeKValueSensitivity(testLists, 1);

    for (const k of K_VALUES) {
      expect(analysis.results[k].avgScore).toBeGreaterThanOrEqual(0);
    }
  });

  it('totalItems reflects unique IDs across all fusions', () => {
    const analysis = analyzeKValueSensitivity(testLists, 1);
    // All lists contain IDs 1-10, so total should be 10
    expect(analysis.totalItems).toBe(10);
  });

  it('handles empty lists gracefully', () => {
    const analysis = analyzeKValueSensitivity([], 0);

    for (const k of K_VALUES) {
      expect(analysis.results[k]).toBeDefined();
      expect(analysis.results[k].avgScore).toBe(0);
    }
    expect(analysis.totalItems).toBe(0);
  });
});

/* ---------------------------------------------------------------
   4. Kendall Tau Unit Tests
   --------------------------------------------------------------- */

describe('Kendall Tau (statistical helper)', () => {
  it('identical rankings have tau = 1.0', () => {
    expect(kendallTau([1, 2, 3, 4, 5], [1, 2, 3, 4, 5])).toBeCloseTo(1.0, 5);
  });

  it('reversed rankings have tau = -1.0', () => {
    expect(kendallTau([1, 2, 3, 4, 5], [5, 4, 3, 2, 1])).toBeCloseTo(-1.0, 5);
  });

  it('single element has tau = 1.0', () => {
    expect(kendallTau([1], [1])).toBe(1.0);
  });

  it('empty rankings have tau = 1.0', () => {
    expect(kendallTau([], [])).toBe(1.0);
  });

  it('partially shuffled ranking has 0 < tau < 1', () => {
    const tau = kendallTau([1, 2, 3, 4, 5], [1, 3, 2, 4, 5]);
    expect(tau).toBeGreaterThan(0);
    expect(tau).toBeLessThan(1);
  });
});

/* ---------------------------------------------------------------
   5. MRR@5 Unit Tests
   --------------------------------------------------------------- */

describe('MRR@5 (statistical helper)', () => {
  it('identical rankings produce correct MRR@5', () => {
    // MRR@5 = mean(1/1, 1/2, 1/3, 1/4, 1/5) = ~0.4567
    // because each baseline top-5 item is at its same rank in the candidate
    expect(mrr5([1, 2, 3, 4, 5], [1, 2, 3, 4, 5])).toBeCloseTo(0.4567, 3);
  });

  it('empty baseline returns 0', () => {
    expect(mrr5([], [1, 2, 3])).toBe(0);
  });

  it('items shifted down reduce MRR', () => {
    // Baseline top-5: [1,2,3,4,5]. Candidate shifts them all down by 5 positions.
    const candidateRanking = [10, 11, 12, 13, 14, 1, 2, 3, 4, 5];
    const result = mrr5([1, 2, 3, 4, 5], candidateRanking);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(1);
  });
});
