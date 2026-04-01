// ───────────────────────────────────────────────────────────────
// 1. TEST — GRAPH-SCORING INTEGRATION
// ───────────────────────────────────────────────────────────────
// Verifies that graph signal activation and scoring calibration
// Changes to shared files are correctly integrated and do not conflict.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  fuseResultsMulti,
  fuseResultsCrossVariant,
  normalizeRrfScores,
} from '@spec-kit/shared/algorithms/rrf-fusion';

import {
  normalizeCompositeScores,
  calculateCompositeScore,
} from '../lib/scoring/composite-scoring';

import {
  applyInterferencePenalty,
  INTERFERENCE_PENALTY_COEFFICIENT,
} from '../lib/scoring/interference-scoring';

import {
  truncateToBudget,
  estimateTokenCount,
  estimateResultTokens,
} from '../lib/search/hybrid-search';

// A. RRF Score Normalization (S2 — Score Normalization)
describe('A. RRF Score Normalization', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('A1: fuseResultsMulti normalizes scores to [0,1] when SPECKIT_SCORE_NORMALIZATION=true', () => {
    vi.stubEnv('SPECKIT_SCORE_NORMALIZATION', 'true');

    const lists = [
      { source: 'vector', results: [{ id: 1 }, { id: 2 }, { id: 3 }] },
      { source: 'fts',    results: [{ id: 2 }, { id: 1 }] },
    ];

    const results = fuseResultsMulti(lists);

    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r.rrfScore).toBeGreaterThanOrEqual(0);
      expect(r.rrfScore).toBeLessThanOrEqual(1);
    }
  });

  it('A2: fuseResultsMulti returns raw (un-normalized) scores when normalization disabled', () => {
    vi.stubEnv('SPECKIT_SCORE_NORMALIZATION', 'false');

    const lists = [
      { source: 'vector', results: [{ id: 1 }, { id: 2 }] },
      { source: 'fts',    results: [{ id: 2 }] },
    ];

    const results = fuseResultsMulti(lists);

    // Raw RRF scores with k=60 are well below 1.0 (typically 0.01–0.05 range)
    // The highest possible raw single-source score is 1/(60+1) ≈ 0.016
    // With convergence bonus it can reach ~0.13, but never 1.0 unless single result
    const highestScore = Math.max(...results.map(r => r.rrfScore));
    // Raw scores should be much less than 1.0 when multiple results exist
    // (normalization to 1.0 would require top score = 1.0 exactly)
    if (results.length > 1) {
      // In raw mode, no score should be exactly 1.0 (that would only happen post-normalization)
      expect(results.filter(r => r.rrfScore === 1.0).length).toBe(0);
    }
    expect(highestScore).toBeGreaterThan(0);
  });

  it('A3: fuseResultsCrossVariant also normalizes scores when SPECKIT_SCORE_NORMALIZATION=true', () => {
    vi.stubEnv('SPECKIT_SCORE_NORMALIZATION', 'true');

    const variantLists = [
      [{ source: 'vector', results: [{ id: 1 }, { id: 2 }] }],
      [{ source: 'fts',    results: [{ id: 2 }, { id: 3 }] }],
    ];

    const results = fuseResultsCrossVariant(variantLists);

    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r.rrfScore).toBeGreaterThanOrEqual(0);
      expect(r.rrfScore).toBeLessThanOrEqual(1);
    }
  });

  it('A4: Normalized scores maintain relative ordering (highest raw score stays highest)', () => {
    vi.stubEnv('SPECKIT_SCORE_NORMALIZATION', 'true');

    // Id:1 appears in all 3 sources → highest raw score
    // Id:2 appears in 2 sources
    // Id:3 appears in 1 source
    const lists = [
      { source: 'vector', results: [{ id: 1 }, { id: 2 }, { id: 3 }] },
      { source: 'fts',    results: [{ id: 1 }, { id: 2 }] },
      { source: 'bm25',   results: [{ id: 1 }] },
    ];

    const normalized = fuseResultsMulti(lists);

    // After normalization, top result should still be id:1
    expect(normalized[0].id).toBe(1);
    // Scores must still be sorted descending
    for (let i = 0; i < normalized.length - 1; i++) {
      expect(normalized[i].rrfScore).toBeGreaterThanOrEqual(normalized[i + 1].rrfScore);
    }
  });
});

// B. Composite Score Normalization (S2 — Score Normalization)
describe('B. Composite Score Normalization', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('B1: normalizeCompositeScores returns [0,1] range when SPECKIT_SCORE_NORMALIZATION=true', () => {
    vi.stubEnv('SPECKIT_SCORE_NORMALIZATION', 'true');

    const scores = [0.2, 0.5, 0.8, 0.4, 0.9];
    const normalized = normalizeCompositeScores(scores);

    expect(normalized).toHaveLength(scores.length);
    for (const s of normalized) {
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(1);
    }
    // Max should be 1.0 and min should be 0.0 after min-max normalization
    expect(Math.max(...normalized)).toBeCloseTo(1.0, 5);
    expect(Math.min(...normalized)).toBeCloseTo(0.0, 5);
  });

  it('B2: normalizeCompositeScores returns unchanged scores when normalization disabled', () => {
    vi.stubEnv('SPECKIT_SCORE_NORMALIZATION', 'false');

    const scores = [0.2, 0.5, 0.8];
    const result = normalizeCompositeScores(scores);

    // Should return original values unchanged
    expect(result).toEqual(scores);
  });

  it('B3: normalizeCompositeScores maps single score to 0.0', () => {
    vi.stubEnv('SPECKIT_SCORE_NORMALIZATION', 'true');

    const scores = [0.42];
    const normalized = normalizeCompositeScores(scores);

    expect(normalized).toHaveLength(1);
    expect(normalized[0]).toBeCloseTo(0.0, 5);
  });
});

// C. TM-01 Interference Penalty (Phase D cleanup: N4 novelty boost removed)
describe('C. TM-01 Interference Penalty', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('C1: Interference penalty never produces a negative score', () => {
    vi.stubEnv('SPECKIT_INTERFERENCE_SCORE', 'true');

    // Very low base score to stress-test the floor
    const baseScore = 0.05;
    // High interference to maximize penalty
    const interferenceCount = 10;

    const afterPenalty = applyInterferencePenalty(baseScore, interferenceCount);

    expect(afterPenalty).toBeGreaterThanOrEqual(0);
  });

  it('C2: Composite score respects 0.95 cap', () => {
    vi.stubEnv('SPECKIT_INTERFERENCE_SCORE', 'true');

    const recentMs = Date.now() - 600_000; // 10 minutes ago
    const row = {
      id: 1,
      importance_tier: 'important',
      importance_weight: 0.9,
      similarity: 90,
      access_count: 50,
      interference_score: 0,
      created_at: new Date(recentMs).toISOString(),
      updated_at: new Date(recentMs).toISOString(),
    };

    const score = calculateCompositeScore(row);

    expect(score).toBeLessThanOrEqual(0.95 + 0.001); // small float tolerance
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('C3: Disabling TM-01 penalty removes interference effect', () => {
    vi.stubEnv('SPECKIT_INTERFERENCE_SCORE', 'false');

    const baseScore = 0.5;
    const score = applyInterferencePenalty(baseScore, 5);
    expect(score).toBe(baseScore); // no penalty applied
  });
});

// D. Token Budget with Results (S1 — PI-A3 token budget)
describe('D. Token Budget with Results', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('D1: truncateToBudget respects budget limit — returns fewer results when over budget', () => {
    // Build many results that would individually be small but together exceed budget
    const results = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      score: 1 - i * 0.01,
      source: 'vector',
      title: `Memory title number ${i + 1} with some content to pad the token count`,
      content: 'x'.repeat(200),
    }));

    const { results: truncated, truncated: wasTruncated } = truncateToBudget(results, 500);

    expect(truncated.length).toBeLessThan(results.length);
    expect(wasTruncated).toBe(true);
  });

  it('D2: estimateTokenCount uses chars/4 heuristic', () => {
    const text = 'a'.repeat(40); // exactly 40 chars → 10 tokens
    expect(estimateTokenCount(text)).toBe(10);

    const text2 = 'b'.repeat(41); // 41 chars → ceil(41/4) = 11 tokens
    expect(estimateTokenCount(text2)).toBe(11);

    expect(estimateTokenCount('')).toBe(0);
  });

  it('D3: truncateToBudget returns all results when they fit within budget', () => {
    const results = [
      { id: 1, score: 0.9, source: 'vector', title: 'Short result A' },
      { id: 2, score: 0.8, source: 'fts',    title: 'Short result B' },
    ];

    const { results: out, truncated } = truncateToBudget(results, 2000);

    expect(out.length).toBe(results.length);
    expect(truncated).toBe(false);
  });
});

// E. Feature Flag Independence
describe('E. Feature Flag Independence', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('E1: SPECKIT_DEGREE_BOOST alone does not affect RRF score normalization', () => {
    vi.stubEnv('SPECKIT_DEGREE_BOOST', 'true');
    vi.stubEnv('SPECKIT_SCORE_NORMALIZATION', 'false');

    const lists = [
      { source: 'vector', results: [{ id: 1 }, { id: 2 }, { id: 3 }] },
    ];
    const results = fuseResultsMulti(lists);

    // Without normalization, scores should still be in raw RRF range (< 1.0 for 3+ results)
    expect(results.some(r => r.rrfScore === 1.0)).toBe(false);
  });

  it('E2: SPECKIT_SCORE_NORMALIZATION works independently', () => {
    vi.stubEnv('SPECKIT_SCORE_NORMALIZATION', 'true');

    const scores = [0.3, 0.6, 0.9];
    const normalized = normalizeCompositeScores(scores);

    // Normalization should work independently
    expect(Math.max(...normalized)).toBeCloseTo(1.0, 5);
    expect(normalized).toHaveLength(3);
  });

  it('E3: Disabling interference prevents penalty', () => {
    vi.stubEnv('SPECKIT_INTERFERENCE_SCORE', 'false'); // explicitly disable (graduated: default ON)

    const score = 0.5;
    const afterPenalty = applyInterferencePenalty(score, 5);

    // With SPECKIT_INTERFERENCE_SCORE=false, penalty must not be applied
    expect(afterPenalty).toBe(score);
  });

  // E4 removed: N4 novelty boost dead code (Phase D cleanup)

  it('E5: All flags disabled = baseline behavior (no normalization, no penalty)', () => {
    vi.stubEnv('SPECKIT_SCORE_NORMALIZATION', 'false');
    vi.stubEnv('SPECKIT_INTERFERENCE_SCORE', 'false');

    // RRF scores unchanged
    const lists = [
      { source: 'vector', results: [{ id: 1 }, { id: 2 }] },
    ];
    const results = fuseResultsMulti(lists);
    expect(results.some(r => r.rrfScore === 1.0)).toBe(false); // not normalized

    // Composite scores not normalized
    const scores = [0.3, 0.7];
    expect(normalizeCompositeScores(scores)).toEqual(scores);

    // No interference penalty
    const base = 0.6;
    expect(applyInterferencePenalty(base, 5)).toBe(base);
  });

  // E6, E7 removed: NOVELTY_BOOST constants removed (Phase D cleanup)

  it('E8: INTERFERENCE_PENALTY_COEFFICIENT constant is negative (penalty)', () => {
    expect(INTERFERENCE_PENALTY_COEFFICIENT).toBeLessThan(0);
  });

  it('E9: normalizeRrfScores (standalone) maps array to [0,1] regardless of env flags', () => {
    // NormalizeRrfScores mutates in place and doesn't check env flags — it's called
    // By fuseResultsMulti only when the flag is set; testing it directly verifies math
    const results = [
      { id: 1, rrfScore: 0.02, sources: ['vector'], sourceScores: {}, convergenceBonus: 0 },
      { id: 2, rrfScore: 0.04, sources: ['fts'],    sourceScores: {}, convergenceBonus: 0 },
      { id: 3, rrfScore: 0.03, sources: ['bm25'],   sourceScores: {}, convergenceBonus: 0 },
    ];

    normalizeRrfScores(results);

    const scores = results.map(r => r.rrfScore);
    expect(Math.max(...scores)).toBeCloseTo(1.0, 5);
    expect(Math.min(...scores)).toBeCloseTo(0.0, 5);
  });

  it('E10: estimateResultTokens returns a positive number for a non-empty result', () => {
    const result = {
      id: 1,
      score: 0.8,
      source: 'vector',
      title: 'A memory about something interesting',
    };

    const tokens = estimateResultTokens(result);
    expect(tokens).toBeGreaterThan(0);
  });

  it('T-budget-boundary: exact budget fit handled correctly', () => {
    const results = [
      { id: 1, score: 0.9, source: 'vector', title: 'Exact fit A' },
      { id: 2, score: 0.8, source: 'fts', title: 'Exact fit B' },
    ];
    const budget = results.reduce((sum, result) => sum + estimateResultTokens(result), 0);

    const { results: output, truncated } = truncateToBudget(results, budget);

    expect(truncated).toBe(false);
    expect(output.map((result) => result.id)).toEqual([1, 2]);
  });
});
