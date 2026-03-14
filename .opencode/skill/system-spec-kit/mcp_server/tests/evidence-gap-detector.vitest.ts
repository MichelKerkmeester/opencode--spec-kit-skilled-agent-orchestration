// TEST: Evidence Gap Detector / TRM (C138-P1)
// Transparent Reasoning Module: Z-score confidence check on RRF
// Scores to detect low-confidence retrieval and inject warnings.
import { describe, it, expect } from 'vitest';
import {
  detectEvidenceGap,
  formatEvidenceGapWarning,
  Z_SCORE_THRESHOLD,
} from '../lib/search/evidence-gap-detector';
import type { TRMResult } from '../lib/search/evidence-gap-detector';

/* ───────────────────────────────────────────────────────────────
   TESTS
   ──────────────────────────────────────────────────────────────── */

describe('C138-P1 Evidence Gap Detector (TRM)', () => {

  // ---- T1: Well-separated scores → no gap ----
  it('T1: high Z-score distribution returns gapDetected=false', () => {
    // One dominant score, rest much lower → high Z-score
    const scores = [0.95, 0.12, 0.10, 0.08, 0.05];
    const result = detectEvidenceGap(scores);

    expect(result.gapDetected).toBe(false);
    expect(result.zScore).toBeGreaterThan(Z_SCORE_THRESHOLD);
    expect(result.mean).toBeGreaterThan(0);
    expect(result.stdDev).toBeGreaterThan(0);
  });

  // ---- T2: Flat distribution → gap detected ----
  it('T2: uniform scores produce low Z-score and detect gap', () => {
    // All scores nearly identical → Z-score ≈ 0
    const scores = [0.50, 0.49, 0.51, 0.50, 0.48];
    const result = detectEvidenceGap(scores);

    expect(result.gapDetected).toBe(true);
    expect(result.zScore).toBeLessThan(Z_SCORE_THRESHOLD);
  });

  // ---- T3: All identical scores above threshold → no gap ----
  it('T3: identical scores above MIN_ABSOLUTE_SCORE return gapDetected=false', () => {
    const scores = [0.30, 0.30, 0.30, 0.30];
    const result = detectEvidenceGap(scores);

    // StdDev=0 but all scores (0.30) are above MIN_ABSOLUTE_SCORE (0.015) →
    // Uniform strong results, not an evidence gap.
    expect(result.gapDetected).toBe(false);
    expect(result.zScore).toBe(0);
    expect(result.stdDev).toBe(0);
  });

  // ---- T4: Empty array → gap detected ----
  it('T4: empty score array returns gap with zeroed stats', () => {
    const result = detectEvidenceGap([]);

    expect(result.gapDetected).toBe(true);
    expect(result.zScore).toBe(0);
    expect(result.mean).toBe(0);
    expect(result.stdDev).toBe(0);
  });

  // ---- T5: Single score above threshold → no gap ----
  it('T5: single high score returns no gap', () => {
    const result = detectEvidenceGap([0.85]);

    expect(result.gapDetected).toBe(false);
    expect(result.zScore).toBe(0);
    expect(result.mean).toBe(0.85);
  });

  // ---- T6: Single score below MIN_ABSOLUTE_SCORE → gap ----
  it('T6: single very low score triggers gap via absolute threshold', () => {
    const result = detectEvidenceGap([0.01]);

    expect(result.gapDetected).toBe(true);
    expect(result.mean).toBe(0.01);
  });

  // ---- T7: Scores near Z-score boundary ----
  it('T7: scores near Z=1.5 boundary behave correctly', () => {
    // Construct scores where Z-score is exactly near threshold
    // Z = (top - mean) / stdDev
    // With [0.5, 0.2, 0.2] → mean=0.3, stdDev≈0.1414, Z=(0.5-0.3)/0.1414≈1.414 < 1.5
    const belowThreshold = detectEvidenceGap([0.5, 0.2, 0.2]);
    expect(belowThreshold.gapDetected).toBe(true);

    // With [0.8, 0.2, 0.2] → mean=0.4, stdDev≈0.2828, Z=(0.8-0.4)/0.2828≈1.414 < 1.5
    // Still below. Need more separation.
    // With [0.9, 0.1, 0.1] → mean≈0.367, stdDev≈0.377, Z≈1.414
    const stillBelow = detectEvidenceGap([0.9, 0.1, 0.1]);
    expect(stillBelow.zScore).toBeGreaterThan(1.0); // meaningful Z but may still be below 1.5

    // With [0.95, 0.05, 0.05, 0.05] → clear separation
    const aboveThreshold = detectEvidenceGap([0.95, 0.05, 0.05, 0.05]);
    expect(aboveThreshold.gapDetected).toBe(false);
    expect(aboveThreshold.zScore).toBeGreaterThan(Z_SCORE_THRESHOLD);
  });

  // ---- T8: Top score below absolute minimum ----
  it('T8: all scores below MIN_ABSOLUTE_SCORE trigger gap regardless of Z', () => {
    const scores = [0.012, 0.001, 0.001]; // top=0.012 < 0.015
    const result = detectEvidenceGap(scores);

    expect(result.gapDetected).toBe(true);
  });

  // ---- T9: Mean and stdDev are mathematically correct ----
  it('T9: mean and stdDev computed correctly', () => {
    const scores = [1.0, 2.0, 3.0, 4.0, 5.0];
    const result = detectEvidenceGap(scores);

    expect(result.mean).toBeCloseTo(3.0, 5);
    // Population stdDev = sqrt(2)
    expect(result.stdDev).toBeCloseTo(Math.sqrt(2), 5);
  });

  // ---- T10: Warning format string ----
  it('T10: formatEvidenceGapWarning produces correct markdown', () => {
    const trm: TRMResult = { gapDetected: true, zScore: 0.87, mean: 0.3, stdDev: 0.15 };
    const warning = formatEvidenceGapWarning(trm);

    expect(warning).toContain('EVIDENCE GAP DETECTED');
    expect(warning).toContain('Z=0.87');
    expect(warning.startsWith('> **')).toBe(true);
  });

  // ---- T11: Large score arrays perform well ----
  it('T11: handles 1000 scores without issue', () => {
    const scores = Array.from({ length: 1000 }, (_, i) => 1 / (60 + i + 1));
    const start = performance.now();
    const result = detectEvidenceGap(scores);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(5); // should be sub-millisecond
    expect(typeof result.gapDetected).toBe('boolean');
    expect(typeof result.zScore).toBe('number');
  });

  // ---- T12: Negative scores handled ----
  it('T12: handles negative RRF scores gracefully', () => {
    const scores = [-0.1, -0.2, 0.3];
    const result = detectEvidenceGap(scores);

    expect(typeof result.gapDetected).toBe('boolean');
    expect(result.mean).toBeCloseTo(0, 1);
  });
});
