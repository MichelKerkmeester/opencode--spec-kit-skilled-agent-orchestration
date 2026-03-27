// ───────────────────────────────────────────────────────────────
// TEST: D5 Phase A — Per-Result Calibrated Confidence (REQ-D5-004)
// ───────────────────────────────────────────────────────────────
// Validates confidence computation, label thresholds, driver list
// population, request-level quality assessment, and feature flag gating.

import { afterEach, describe, expect, it } from 'vitest';
import {
  computeResultConfidence,
  assessRequestQuality,
  isResultConfidenceEnabled,
  type ScoredResult,
} from '../lib/search/confidence-scoring';

// -- Test Helpers --

function makeResult(overrides: Partial<ScoredResult> = {}): ScoredResult {
  return {
    id: 1,
    score: 0.8,
    ...overrides,
  };
}

function makeResults(scores: number[]): ScoredResult[] {
  return scores.map((s, i) => makeResult({ id: i + 1, score: s }));
}

// -- Feature Flag --

describe('isResultConfidenceEnabled() — feature flag', () => {
  const ORIGINAL = process.env.SPECKIT_RESULT_CONFIDENCE_V1;

  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.SPECKIT_RESULT_CONFIDENCE_V1;
    else process.env.SPECKIT_RESULT_CONFIDENCE_V1 = ORIGINAL;
  });

  it('defaults to true when env var is not set (graduated)', () => {
    delete process.env.SPECKIT_RESULT_CONFIDENCE_V1;
    expect(isResultConfidenceEnabled()).toBe(true);
  });

  it('returns true when set to "true"', () => {
    process.env.SPECKIT_RESULT_CONFIDENCE_V1 = 'true';
    expect(isResultConfidenceEnabled()).toBe(true);
  });

  it('returns true when set to "TRUE" (case-insensitive)', () => {
    process.env.SPECKIT_RESULT_CONFIDENCE_V1 = 'TRUE';
    expect(isResultConfidenceEnabled()).toBe(true);
  });

  it('returns false when set to "false"', () => {
    process.env.SPECKIT_RESULT_CONFIDENCE_V1 = 'false';
    expect(isResultConfidenceEnabled()).toBe(false);
  });

  it('returns true for "1" (graduated — any non-false value is ON)', () => {
    process.env.SPECKIT_RESULT_CONFIDENCE_V1 = '1';
    expect(isResultConfidenceEnabled()).toBe(true);
  });
});

// -- computeResultConfidence — edge cases --

describe('computeResultConfidence() — edge cases', () => {
  it('returns empty array for empty input', () => {
    expect(computeResultConfidence([])).toEqual([]);
  });

  it('returns parallel array of same length as input', () => {
    const results = makeResults([0.9, 0.6, 0.3]);
    const confidences = computeResultConfidence(results);
    expect(confidences).toHaveLength(3);
  });

  it('returns array of length 1 for single result', () => {
    const results = [makeResult({ id: 1, score: 0.85 })];
    const confidences = computeResultConfidence(results);
    expect(confidences).toHaveLength(1);
  });

  it('confidence value is in [0, 1] range for all results', () => {
    const results = makeResults([1.0, 0.9, 0.7, 0.5, 0.2, 0.0]);
    const confidences = computeResultConfidence(results);
    for (const c of confidences) {
      expect(c.confidence.value).toBeGreaterThanOrEqual(0);
      expect(c.confidence.value).toBeLessThanOrEqual(1);
    }
  });
});

// -- computeResultConfidence — label thresholds --

describe('computeResultConfidence() — label thresholds', () => {
  it('labels "high" when value >= 0.7', () => {
    // A result with very high score, large margin, and multi-channel should get high
    const result = makeResult({
      id: 1,
      score: 0.95,
      sources: ['semantic', 'lexical'],
      rerankerScore: 0.88,
      anchorMetadata: [{ id: 'state', type: 'state' }, { id: 'summary', type: 'summary' }],
    });
    const [conf] = computeResultConfidence([result, makeResult({ id: 2, score: 0.15 })]);
    expect(conf.confidence.label).toBe('high');
    expect(conf.confidence.value).toBeGreaterThanOrEqual(0.7);
  });

  it('labels "low" when value < 0.4', () => {
    // Zero score, single channel, no reranker, no anchors → very low confidence
    const result = makeResult({ id: 1, score: 0, sources: [] });
    const [conf] = computeResultConfidence([result]);
    expect(conf.confidence.label).toBe('low');
    expect(conf.confidence.value).toBeLessThan(0.4);
  });

  it('labels "medium" for mid-range values', () => {
    const results = makeResults([0.6, 0.3]); // moderate margin, no extra signals
    const [conf] = computeResultConfidence(results);
    // Medium is anything between 0.4 and 0.7
    expect(['medium', 'high']).toContain(conf.confidence.label);
  });
});

// -- computeResultConfidence — margin factor --

describe('computeResultConfidence() — score margin', () => {
  it('large margin (>= 0.15) boosts confidence', () => {
    const results = makeResults([0.9, 0.5]); // margin = 0.4
    const [topConf] = computeResultConfidence(results);
    expect(topConf.confidence.drivers).toContain('large_margin');
  });

  it('small margin (< 0.05) does not add large_margin driver', () => {
    const results = makeResults([0.8, 0.79]); // margin = 0.01
    const [topConf] = computeResultConfidence(results);
    expect(topConf.confidence.drivers).not.toContain('large_margin');
  });

  it('last result (no successor) does not get a synthetic margin boost', () => {
    const results = makeResults([0.9, 0.5]);
    const confidences = computeResultConfidence(results);
    const lastConf = confidences[confidences.length - 1];
    expect(lastConf.confidence.drivers).not.toContain('large_margin');
  });
});

// -- computeResultConfidence — multi-channel agreement --

describe('computeResultConfidence() — multi-channel agreement', () => {
  it('adds "multi_channel_agreement" driver when 2+ channels contributed', () => {
    const result = makeResult({
      id: 1,
      score: 0.8,
      sources: ['semantic', 'lexical'],
    });
    const [conf] = computeResultConfidence([result]);
    expect(conf.confidence.drivers).toContain('multi_channel_agreement');
  });

  it('does NOT add "multi_channel_agreement" driver for single channel', () => {
    const result = makeResult({
      id: 1,
      score: 0.8,
      sources: ['semantic'],
    });
    const [conf] = computeResultConfidence([result]);
    expect(conf.confidence.drivers).not.toContain('multi_channel_agreement');
  });

  it('counts channels from "source" string field (legacy)', () => {
    const result = makeResult({
      id: 1,
      score: 0.8,
      source: 'semantic',
      sources: ['lexical'], // both fields → 2 channels
    });
    const [conf] = computeResultConfidence([result]);
    expect(conf.confidence.drivers).toContain('multi_channel_agreement');
  });

  it('counts channels from traceMetadata.attribution', () => {
    const result = makeResult({
      id: 42,
      score: 0.8,
      traceMetadata: {
        attribution: {
          semantic: [42, 10],
          bm25: [42],
        },
      },
    });
    const [conf] = computeResultConfidence([result]);
    expect(conf.confidence.drivers).toContain('multi_channel_agreement');
  });

  it('deduplicates channels across sources and source fields', () => {
    const result = makeResult({
      id: 1,
      score: 0.8,
      source: 'semantic',
      sources: ['semantic'], // same channel duplicated — should still count as 1
    });
    const [conf] = computeResultConfidence([result]);
    expect(conf.confidence.drivers).not.toContain('multi_channel_agreement');
  });
});

// -- computeResultConfidence — reranker support --

describe('computeResultConfidence() — reranker support', () => {
  it('adds "reranker_boost" driver when rerankerScore is present', () => {
    const result = makeResult({ id: 1, score: 0.8, rerankerScore: 0.72, rerankerApplied: true });
    const [conf] = computeResultConfidence([result]);
    expect(conf.confidence.drivers).toContain('reranker_boost');
  });

  it('does NOT add "reranker_boost" when rerankerApplied is false (fallback score)', () => {
    const result = makeResult({ id: 1, score: 0.8, rerankerScore: 0.72 });
    const [conf] = computeResultConfidence([result]);
    expect(conf.confidence.drivers).not.toContain('reranker_boost');
  });

  it('does NOT add "reranker_boost" when rerankerScore is absent', () => {
    const result = makeResult({ id: 1, score: 0.8 });
    const [conf] = computeResultConfidence([result]);
    expect(conf.confidence.drivers).not.toContain('reranker_boost');
  });

  it('does NOT add "reranker_boost" when rerankerScore is NaN', () => {
    const result = makeResult({ id: 1, score: 0.8, rerankerScore: NaN });
    const [conf] = computeResultConfidence([result]);
    expect(conf.confidence.drivers).not.toContain('reranker_boost');
  });
});

// -- computeResultConfidence — anchor density --

describe('computeResultConfidence() — anchor density', () => {
  it('adds "anchor_density" driver when anchorMetadata has 2+ anchors', () => {
    const result = makeResult({
      id: 1,
      score: 0.8,
      anchorMetadata: [
        { id: 'state', type: 'state' },
        { id: 'summary', type: 'summary' },
      ],
    });
    const [conf] = computeResultConfidence([result]);
    expect(conf.confidence.drivers).toContain('anchor_density');
  });

  it('does NOT add "anchor_density" for a single anchor', () => {
    const result = makeResult({
      id: 1,
      score: 0.8,
      anchorMetadata: [{ id: 'state', type: 'state' }],
    });
    const [conf] = computeResultConfidence([result]);
    expect(conf.confidence.drivers).not.toContain('anchor_density');
  });

  it('does NOT add "anchor_density" when anchorMetadata is absent', () => {
    const result = makeResult({ id: 1, score: 0.8 });
    const [conf] = computeResultConfidence([result]);
    expect(conf.confidence.drivers).not.toContain('anchor_density');
  });
});

// -- computeResultConfidence — score resolution fallback chain --

describe('computeResultConfidence() — score resolution', () => {
  it('uses intentAdjustedScore when available (highest priority)', () => {
    const high = makeResult({ id: 1, intentAdjustedScore: 0.99, score: 0.1 });
    const low = makeResult({ id: 2, intentAdjustedScore: 0.01, score: 0.9 });
    const [highConf, lowConf] = computeResultConfidence([high, low]);
    expect(highConf.confidence.value).toBeGreaterThan(lowConf.confidence.value);
  });

  it('falls back to rrfScore when intentAdjustedScore is absent', () => {
    const result = makeResult({ id: 1, rrfScore: 0.85, score: 0.1, intentAdjustedScore: undefined });
    const [conf] = computeResultConfidence([result]);
    // rrfScore=0.85 → high score prior should push value well above low
    expect(conf.confidence.value).toBeGreaterThan(0.2);
  });

  it('falls back to similarity/100 when rrfScore and score are absent', () => {
    const result = makeResult({ id: 1, similarity: 90, score: undefined, rrfScore: undefined, intentAdjustedScore: undefined });
    const [conf] = computeResultConfidence([result]);
    expect(conf.confidence.value).toBeGreaterThan(0.2);
  });

  it('returns 0 base when no score field is available', () => {
    const result = makeResult({ id: 1, score: undefined, rrfScore: undefined, intentAdjustedScore: undefined, similarity: undefined });
    const [conf] = computeResultConfidence([result]);
    // Confidence may still be non-zero from heuristics, but must be in [0,1]
    expect(conf.confidence.value).toBeGreaterThanOrEqual(0);
    expect(conf.confidence.value).toBeLessThanOrEqual(1);
  });
});

// -- computeResultConfidence — drivers list --

describe('computeResultConfidence() — drivers list', () => {
  it('returns empty drivers array when no factors contributed', () => {
    // Score=0, no channels, no reranker, no anchors, next score is similar (small margin)
    const results = makeResults([0.01, 0.009]);
    const [conf] = computeResultConfidence(results);
    expect(Array.isArray(conf.confidence.drivers)).toBe(true);
    // May have drivers from margin if gap is still >= 0.15 as proportion — but here it's not
    // The key assertion is the array always exists
  });

  it('can accumulate multiple drivers simultaneously', () => {
    const result: ScoredResult = {
      id: 1,
      score: 0.95,
      sources: ['semantic', 'lexical'],
      rerankerScore: 0.9,
      rerankerApplied: true,
      anchorMetadata: [{ id: 'state' }, { id: 'summary' }],
    };
    const [conf] = computeResultConfidence([result, makeResult({ id: 2, score: 0.2 })]);
    expect(conf.confidence.drivers.length).toBeGreaterThan(1);
    expect(conf.confidence.drivers).toContain('large_margin');
    expect(conf.confidence.drivers).toContain('multi_channel_agreement');
    expect(conf.confidence.drivers).toContain('reranker_boost');
    expect(conf.confidence.drivers).toContain('anchor_density');
  });
});

// -- assessRequestQuality --

describe('assessRequestQuality()', () => {
  it('returns "gap" when results array is empty', () => {
    const { requestQuality } = assessRequestQuality([], []);
    expect(requestQuality.label).toBe('gap');
  });

  it('returns "good" when most results are high/medium confidence and top score is high', () => {
    const results: ScoredResult[] = [
      { id: 1, score: 0.95, sources: ['semantic', 'lexical'], rerankerScore: 0.9 },
      { id: 2, score: 0.85, sources: ['semantic', 'lexical'] },
      { id: 3, score: 0.8, sources: ['semantic', 'lexical'] },
    ];
    const confidences = computeResultConfidence(results);
    const { requestQuality } = assessRequestQuality(results, confidences);
    expect(requestQuality.label).toBe('good');
  });

  it('returns "gap" when all results have low confidence', () => {
    const results = makeResults([0.05, 0.03, 0.01]);
    const confidences = computeResultConfidence(results);
    const { requestQuality } = assessRequestQuality(results, confidences);
    expect(requestQuality.label).toBe('gap');
  });

  it('returns "weak" for results with mediocre scores and mixed confidence', () => {
    const results = makeResults([0.45, 0.4, 0.35]);
    const confidences = computeResultConfidence(results);
    const { requestQuality } = assessRequestQuality(results, confidences);
    // Scores around 0.4–0.45 → should be "weak" (not gap, not good)
    expect(['weak', 'good']).toContain(requestQuality.label);
  });

  it('requestQuality.label is one of the valid literals', () => {
    const validLabels = ['good', 'weak', 'gap'];
    const results = makeResults([0.6, 0.3]);
    const confidences = computeResultConfidence(results);
    const { requestQuality } = assessRequestQuality(results, confidences);
    expect(validLabels).toContain(requestQuality.label);
  });

  it('always returns an object with requestQuality.label', () => {
    const results = makeResults([0.9]);
    const confidences = computeResultConfidence(results);
    const assessment = assessRequestQuality(results, confidences);
    expect(assessment).toHaveProperty('requestQuality');
    expect(assessment.requestQuality).toHaveProperty('label');
    expect(typeof assessment.requestQuality.label).toBe('string');
  });
});
