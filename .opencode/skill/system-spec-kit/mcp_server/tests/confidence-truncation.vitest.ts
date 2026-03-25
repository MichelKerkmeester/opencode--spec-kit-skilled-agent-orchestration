// ───────────────────────────────────────────────────────────────
// 1. TEST — CONFIDENCE TRUNCATION
// ───────────────────────────────────────────────────────────────
// Query Intelligence
// 24 tests covering:
// Basic truncation, minimum result count, no-truncation, flag disabled,
// Edge cases, >30% tail reduction verification, algorithm boundaries

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  truncateByConfidence,
  isConfidenceTruncationEnabled,
  computeGaps,
  computeMedian,
  DEFAULT_MIN_RESULTS,
  GAP_THRESHOLD_MULTIPLIER,
  type ScoredResult,
  type TruncationResult,
} from '../lib/search/confidence-truncation';

/* ───────────────────────────────────────────────────────────────
   HELPERS
   ──────────────────────────────────────────────────────────────── */

const FLAG = 'SPECKIT_CONFIDENCE_TRUNCATION';

function enableFlag(): void {
  process.env[FLAG] = 'true';
}

function disableFlag(): void {
  delete process.env[FLAG];
}

function withFlag(fn: () => void): void {
  const original = process.env[FLAG];
  process.env[FLAG] = 'true';
  try {
    fn();
  } finally {
    if (original === undefined) {
      delete process.env[FLAG];
    } else {
      process.env[FLAG] = original;
    }
  }
}

/** Build a simple scored result list from (id, score) pairs. */
function makeResults(pairs: Array<[string | number, number]>): ScoredResult[] {
  return pairs.map(([id, score]) => ({ id, score }));
}

/* ───────────────────────────────────────────────────────────────
   T029-01: FEATURE FLAG
   ──────────────────────────────────────────────────────────────── */

describe('T029-01: Feature Flag (SPECKIT_CONFIDENCE_TRUNCATION)', () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env[FLAG];
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env[FLAG];
    } else {
      process.env[FLAG] = originalEnv;
    }
  });

  it('T1: defaults to enabled when env var not set (graduated flag)', () => {
    delete process.env[FLAG];
    expect(isConfidenceTruncationEnabled()).toBe(true);
  });

  it('T2: disabled when env var is "false"', () => {
    process.env[FLAG] = 'false';
    expect(isConfidenceTruncationEnabled()).toBe(false);
  });

  it('T3: disabled when env var is "0"', () => {
    process.env[FLAG] = '0';
    expect(isConfidenceTruncationEnabled()).toBe(false);
  });

  it('T4: enabled when env var is empty string (graduated flag)', () => {
    process.env[FLAG] = '';
    expect(isConfidenceTruncationEnabled()).toBe(true);
  });

  it('T5: enabled when env var is "true"', () => {
    process.env[FLAG] = 'true';
    expect(isConfidenceTruncationEnabled()).toBe(true);
  });

  it('T6: enabled when env var is "TRUE" (case-insensitive)', () => {
    process.env[FLAG] = 'TRUE';
    expect(isConfidenceTruncationEnabled()).toBe(true);
  });
});

/* ───────────────────────────────────────────────────────────────
   T029-02: FLAG DISABLED — PASS-THROUGH BEHAVIOUR
   ──────────────────────────────────────────────────────────────── */

describe('T029-02: Flag Disabled — Pass-Through', () => {
  beforeEach(() => { process.env[FLAG] = 'false'; });
  afterEach(disableFlag);

  it('T6: returns all results unchanged when flag disabled', () => {
    const results = makeResults([[1, 0.9], [2, 0.5], [3, 0.4], [4, 0.05]]);
    const out = truncateByConfidence(results);
    expect(out.truncated).toBe(false);
    expect(out.results).toHaveLength(4);
    expect(out.truncatedCount).toBe(4);
    expect(out.originalCount).toBe(4);
  });

  it('T7: applied flag is false when flag disabled', () => {
    const results = makeResults([[1, 0.9], [2, 0.1]]);
    const out = truncateByConfidence(results);
    expect(out.truncated).toBe(false);
    expect(out.medianGap).toBe(0);
    expect(out.cutoffGap).toBe(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   T029-03: BASIC TRUNCATION — CLEAR GAP
   ──────────────────────────────────────────────────────────────── */

describe('T029-03: Basic Truncation with Clear Score Gap', () => {
  beforeEach(enableFlag);
  afterEach(disableFlag);

  it('T8: truncates at clear gap above threshold', () => {
    // Scores: 0.9, 0.85, 0.82, 0.10, 0.08
    // Gaps:   0.05, 0.03, 0.72, 0.02
    // Median gap (of 4): sort=[0.02,0.03,0.05,0.72] → (0.03+0.05)/2 = 0.04
    // Threshold = 2 * 0.04 = 0.08
    // Gap[2] = 0.72 > 0.08 → cutoffIndex = 2 (keep 0,1,2)
    const results = makeResults([
      [1, 0.9], [2, 0.85], [3, 0.82], [4, 0.10], [5, 0.08],
    ]);
    const out = truncateByConfidence(results);
    expect(out.truncated).toBe(true);
    expect(out.truncatedCount).toBe(3);
    expect(out.cutoffIndex).toBe(2);
    expect(out.results.map(r => r.id)).toEqual([1, 2, 3]);
  });

  it('T9: truncation result preserves original data of kept results', () => {
    const results: ScoredResult[] = [
      { id: 'a', score: 0.95, meta: 'hello' },
      { id: 'b', score: 0.90, meta: 'world' },
      { id: 'c', score: 0.85, meta: 'foo' },
      { id: 'd', score: 0.10, meta: 'bar' },
      { id: 'e', score: 0.05, meta: 'baz' },
    ];
    const out = truncateByConfidence(results);
    expect(out.truncated).toBe(true);
    expect(out.results[0].meta).toBe('hello');
    expect(out.results[2].meta).toBe('foo');
  });

  it('T10: originalCount reflects pre-truncation count', () => {
    const results = makeResults([[1, 0.9], [2, 0.85], [3, 0.82], [4, 0.10], [5, 0.08]]);
    const out = truncateByConfidence(results);
    expect(out.originalCount).toBe(5);
    expect(out.truncatedCount).toBe(3);
  });

  it('T11: cutoffGap reflects the gap that triggered truncation', () => {
    // Gap[2] = 0.82 - 0.10 = 0.72
    const results = makeResults([[1, 0.9], [2, 0.85], [3, 0.82], [4, 0.10], [5, 0.08]]);
    const out = truncateByConfidence(results);
    expect(out.cutoffGap).toBeCloseTo(0.72, 5);
  });

  it('T12: medianGap is reported correctly', () => {
    // Gaps: 0.05, 0.03, 0.72, 0.02 → sorted: 0.02, 0.03, 0.05, 0.72 → median = (0.03+0.05)/2 = 0.04
    const results = makeResults([[1, 0.9], [2, 0.85], [3, 0.82], [4, 0.10], [5, 0.08]]);
    const out = truncateByConfidence(results);
    expect(out.medianGap).toBeCloseTo(0.04, 5);
  });
});

/* ───────────────────────────────────────────────────────────────
   T029-04: MINIMUM RESULT COUNT ENFORCEMENT
   ──────────────────────────────────────────────────────────────── */

describe('T029-04: Minimum Result Count (3)', () => {
  beforeEach(enableFlag);
  afterEach(disableFlag);

  it('T13: does not truncate below minResults (default 3)', () => {
    // Even if there is a gap at index 0, we must respect minResults=3
    // Gap[0] between index 0 and 1 = 0.9-0.1 = 0.8; median gap with 4 items = large
    // Since minResults=3 and we start search at index 2, gap[0] is skipped
    const results = makeResults([
      [1, 0.9], [2, 0.1], [3, 0.05], [4, 0.04], [5, 0.03],
    ]);
    // Gaps: 0.80, 0.05, 0.01, 0.01
    // Sorted: 0.01, 0.01, 0.05, 0.80 → median = (0.01 + 0.05)/2 = 0.03
    // Threshold = 2 * 0.03 = 0.06
    // Start search at i=2 (minResults-1 = 2):
    // Gap[2] = 0.01, not > 0.06
    // Gap[3] = 0.01, not > 0.06
    // No truncation
    const out = truncateByConfidence(results);
    // With the actual numbers the large gap at 0 is not searched; no truncation
    expect(out.results.length).toBeGreaterThanOrEqual(DEFAULT_MIN_RESULTS);
  });

  it('T14: custom minResults=2 allows earlier truncation', () => {
    // With minResults=2 we start searching at gap[1]
    const results = makeResults([
      [1, 0.9], [2, 0.85], [3, 0.10], [4, 0.05], [5, 0.04],
    ]);
    // Gaps: 0.05, 0.75, 0.05, 0.01  → sorted: 0.01, 0.05, 0.05, 0.75 → median = (0.05+0.05)/2 = 0.05
    // Threshold = 0.10
    // Start at i=1 (minResults-1=1): gap[1] = 0.75 > 0.10 → cutoffIndex=1 (keep 2 results)
    const out = truncateByConfidence(results, { minResults: 2 });
    expect(out.truncated).toBe(true);
    expect(out.truncatedCount).toBe(2);
    expect(out.results.map(r => r.id)).toEqual([1, 2]);
  });

  it('T15: returns all results when count equals minResults exactly', () => {
    const results = makeResults([[1, 0.9], [2, 0.5], [3, 0.1]]);
    const out = truncateByConfidence(results);
    expect(out.truncated).toBe(false);
    expect(out.truncatedCount).toBe(3);
  });

  it('T16: DEFAULT_MIN_RESULTS constant is 3', () => {
    expect(DEFAULT_MIN_RESULTS).toBe(3);
  });

  it('T17: GAP_THRESHOLD_MULTIPLIER constant is 2', () => {
    expect(GAP_THRESHOLD_MULTIPLIER).toBe(2);
  });
});

/* ───────────────────────────────────────────────────────────────
   T029-05: NO TRUNCATION WHEN GAPS ARE SIMILAR
   ──────────────────────────────────────────────────────────────── */

describe('T029-05: No Truncation When All Gaps Are Similar', () => {
  beforeEach(enableFlag);
  afterEach(disableFlag);

  it('T18: no truncation when all gaps are equal', () => {
    // Uniformly spaced: 1.0, 0.8, 0.6, 0.4, 0.2
    // Gaps: 0.2, 0.2, 0.2, 0.2 → median = 0.2, threshold = 0.4
    // No gap exceeds threshold
    const results = makeResults([[1, 1.0], [2, 0.8], [3, 0.6], [4, 0.4], [5, 0.2]]);
    const out = truncateByConfidence(results);
    expect(out.truncated).toBe(false);
    expect(out.truncatedCount).toBe(5);
  });

  it('T19: no truncation when all results have same score', () => {
    const results = makeResults([[1, 0.5], [2, 0.5], [3, 0.5], [4, 0.5]]);
    const out = truncateByConfidence(results);
    expect(out.truncated).toBe(false);
    expect(out.truncatedCount).toBe(4);
  });

  it('T20: no truncation returned with correct metadata when no gap found', () => {
    const results = makeResults([[1, 1.0], [2, 0.8], [3, 0.6], [4, 0.4], [5, 0.2]]);
    const out = truncateByConfidence(results);
    expect(out.truncated).toBe(false);
    expect(out.cutoffGap).toBe(0);
    expect(out.cutoffIndex).toBe(4); // last index
    expect(out.medianGap).toBeCloseTo(0.2, 5);
  });
});

/* ───────────────────────────────────────────────────────────────
   T029-06: EDGE CASES
   ──────────────────────────────────────────────────────────────── */

describe('T029-06: Edge Cases', () => {
  beforeEach(enableFlag);
  afterEach(disableFlag);

  it('T21: empty array returns unchanged with truncated=false', () => {
    const out = truncateByConfidence([]);
    expect(out.truncated).toBe(false);
    expect(out.results).toHaveLength(0);
    expect(out.originalCount).toBe(0);
    expect(out.truncatedCount).toBe(0);
  });

  it('T22: single result returns unchanged', () => {
    const results = makeResults([[1, 0.9]]);
    const out = truncateByConfidence(results);
    expect(out.truncated).toBe(false);
    expect(out.truncatedCount).toBe(1);
    expect(out.cutoffIndex).toBe(0);
  });

  it('T23: two results with small count returns unchanged (≤ minResults)', () => {
    const results = makeResults([[1, 0.9], [2, 0.1]]);
    const out = truncateByConfidence(results);
    expect(out.truncated).toBe(false);
    expect(out.truncatedCount).toBe(2);
  });

  it('T24: string IDs are preserved correctly', () => {
    const results = makeResults([
      ['abc', 0.9], ['def', 0.85], ['ghi', 0.82], ['jkl', 0.10], ['mno', 0.08],
    ]);
    const out = truncateByConfidence(results);
    expect(out.truncated).toBe(true);
    expect(out.results[0].id).toBe('abc');
    expect(out.results[2].id).toBe('ghi');
  });
});

/* ───────────────────────────────────────────────────────────────
   T029-07: >30% TAIL REDUCTION VERIFICATION
   ──────────────────────────────────────────────────────────────── */

describe('T029-07: >30% Tail Reduction on Realistic Distribution', () => {
  beforeEach(enableFlag);
  afterEach(disableFlag);

  it('T25: reduces tail by >30% on a realistic score distribution', () => {
    // Realistic distribution: top results are good, then a cliff, then irrelevant.
    // 4 relevant (high scores, tight gaps) + 8 irrelevant (low scores, tight gaps).
    // Cliff at index 3→4 (gap ≈ 0.65, vs tiny gaps elsewhere).
    // Reduction = 8/12 ≈ 0.667 > 0.30 ✓
    const results = makeResults([
      [1, 0.92], [2, 0.90], [3, 0.88], [4, 0.87],
      [5, 0.22], [6, 0.20], [7, 0.18], [8, 0.16],
      [9, 0.14], [10, 0.12], [11, 0.10], [12, 0.08],
    ]);
    const out = truncateByConfidence(results);

    // Verify truncation happened
    expect(out.truncated).toBe(true);

    // Verify >30% reduction
    const reductionRatio = (out.originalCount - out.truncatedCount) / out.originalCount;
    expect(reductionRatio).toBeGreaterThan(0.30);
  });

  it('T26: larger tail removal — 10 results with 4 good, 6 irrelevant', () => {
    // 4 relevant (high scores) + 6 irrelevant (low scores)
    const results = makeResults([
      [1, 0.95], [2, 0.91], [3, 0.89], [4, 0.87],
      [5, 0.15], [6, 0.12], [7, 0.10], [8, 0.09], [9, 0.08], [10, 0.07],
    ]);
    const out = truncateByConfidence(results);

    expect(out.truncated).toBe(true);
    // 6 of 10 removed = 60% reduction, well above 30%
    const reductionRatio = (out.originalCount - out.truncatedCount) / out.originalCount;
    expect(reductionRatio).toBeGreaterThan(0.30);
    expect(out.truncatedCount).toBe(4);
  });
});

/* ───────────────────────────────────────────────────────────────
   T029-08: HELPER FUNCTIONS
   ──────────────────────────────────────────────────────────────── */

describe('T029-08: Helper Functions (computeGaps, computeMedian)', () => {
  it('T27: computeGaps returns correct consecutive differences', () => {
    const gaps = computeGaps([1.0, 0.8, 0.5, 0.1]);
    expect(gaps).toHaveLength(3);
    expect(gaps[0]).toBeCloseTo(0.2, 10);
    expect(gaps[1]).toBeCloseTo(0.3, 10);
    expect(gaps[2]).toBeCloseTo(0.4, 10);
  });

  it('T28: computeGaps returns empty array for fewer than 2 scores', () => {
    expect(computeGaps([])).toHaveLength(0);
    expect(computeGaps([0.9])).toHaveLength(0);
  });

  it('T29: computeMedian for odd-length array returns middle value', () => {
    expect(computeMedian([1, 2, 3])).toBe(2);
    expect(computeMedian([0.1, 0.3, 0.5])).toBe(0.3);
  });

  it('T30: computeMedian for even-length array returns average of two middle values', () => {
    expect(computeMedian([1, 2, 3, 4])).toBeCloseTo(2.5, 10);
    expect(computeMedian([0.1, 0.2, 0.4, 0.8])).toBeCloseTo(0.3, 10);
  });

  it('T31: computeMedian returns 0 for empty array', () => {
    expect(computeMedian([])).toBe(0);
  });

  it('T32: computeMedian is order-independent (sorts internally)', () => {
    expect(computeMedian([3, 1, 2])).toBe(2);
    expect(computeMedian([1, 2, 3])).toBe(2);
  });
});

/* ───────────────────────────────────────────────────────────────
   T029-09: NaN/INFINITY GUARD & SORT VALIDATION
   ──────────────────────────────────────────────────────────────── */

describe('T029-09: NaN/Infinity Guard & Sort Validation', () => {
  beforeEach(enableFlag);
  afterEach(disableFlag);

  it('T33: NaN scores are filtered out before truncation', () => {
    const results = makeResults([
      [1, 0.9], [2, NaN], [3, 0.85], [4, 0.82], [5, 0.10], [6, 0.08],
    ]);
    const out = truncateByConfidence(results);
    // NaN result removed, remaining 5 valid results processed
    expect(out.results.every(r => Number.isFinite(r.score))).toBe(true);
    expect(out.originalCount).toBe(5); // NaN filtered out
  });

  it('T34: Infinity scores are filtered out before truncation', () => {
    const results = makeResults([
      [1, Infinity], [2, 0.9], [3, 0.85], [4, 0.82], [5, 0.10],
    ]);
    const out = truncateByConfidence(results);
    expect(out.results.every(r => Number.isFinite(r.score))).toBe(true);
    expect(out.originalCount).toBe(4); // Infinity filtered out
  });

  it('T35: -Infinity scores are filtered out before truncation', () => {
    const results = makeResults([
      [1, 0.9], [2, 0.85], [3, 0.82], [4, -Infinity],
    ]);
    const out = truncateByConfidence(results);
    expect(out.results.every(r => Number.isFinite(r.score))).toBe(true);
    expect(out.originalCount).toBe(3);
  });

  it('T36: unsorted input is sorted internally before truncation', () => {
    // Deliberately unsorted input
    const results = makeResults([
      [1, 0.10], [2, 0.85], [3, 0.08], [4, 0.82], [5, 0.9],
    ]);
    const out = truncateByConfidence(results);
    // Should produce same result as sorted input
    expect(out.truncated).toBe(true);
    expect(out.truncatedCount).toBe(3);
    // Results should be in descending score order
    expect(out.results[0].score).toBeGreaterThanOrEqual(out.results[1].score);
    expect(out.results[1].score).toBeGreaterThanOrEqual(out.results[2].score);
  });

  it('T37: computeGaps filters NaN from scores', () => {
    const gaps = computeGaps([0.9, NaN, 0.5]);
    // NaN filtered out, only finite scores [0.9, 0.5] remain
    expect(gaps).toHaveLength(1);
    expect(gaps[0]).toBeCloseTo(0.4, 10);
  });

  it('T38: computeGaps filters Infinity from scores', () => {
    const gaps = computeGaps([Infinity, 0.9, 0.5]);
    // Infinity filtered out, only [0.9, 0.5] remain
    expect(gaps).toHaveLength(1);
    expect(gaps[0]).toBeCloseTo(0.4, 10);
  });
});
