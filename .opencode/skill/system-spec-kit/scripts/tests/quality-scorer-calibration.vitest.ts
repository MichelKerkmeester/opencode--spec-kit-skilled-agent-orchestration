// TEST: Live Quality Scorer Calibration (extractors/quality-scorer.ts)
// Ensures the scorer has discriminative power: clean sessions score high, penalised sessions score low.
// Phase 002: import fixed from core/quality-scorer → extractors/quality-scorer (live scorer).
import { describe, expect, it } from 'vitest';

import { scoreMemoryQuality } from '../extractors/quality-scorer';

const RICH_CONTENT = [
  '---',
  'title: "Claude Capture Fallback Hardening"',
  '---',
  '',
  '# Claude Capture Fallback Hardening',
  '',
  ...Array.from({ length: 80 }, (_, index) => (
    `Line ${index + 1}: Detailed fallback behavior, provenance checks, and transcript parsing evidence.`
  )),
].join('\n');

const THIN_CONTENT = [
  '---',
  'title: "Development session"',
  '---',
  '',
  '# Development session',
  '',
  'Done.',
  'Updated stuff.',
  'More work later.',
].join('\n');

describe('scoreMemoryQuality calibration — live scorer (extractors/quality-scorer.ts)', () => {
  it('scores a clean session at 1.0 (no V-rule failures)', () => {
    const result = scoreMemoryQuality({
      content: RICH_CONTENT,
      validatorSignals: [],
    });

    expect(result.score01).toBe(1.0);
    expect(result.score100).toBe(100);
    expect(result.score).toBe(100);
    expect(result.score01).toBeCloseTo(result.score100 / 100, 5);
  });

  it('scores a session with five MEDIUM V-rule failures meaningfully below 0.90', () => {
    // V2 and V12 are the two MEDIUM-severity rules that do not block writes.
    // We simulate 5 failures via repeated signals (scorer sums all failures).
    // With MEDIUM penalty = 0.03: 5 × 0.03 = 0.15 → score = 0.85.
    const result = scoreMemoryQuality({
      content: THIN_CONTENT,
      validatorSignals: [
        { ruleId: 'V2', passed: false },
        { ruleId: 'V2', passed: false },
        { ruleId: 'V2', passed: false },
        { ruleId: 'V2', passed: false },
        { ruleId: 'V12', passed: false },
      ],
    });

    expect(result.score01).toBeLessThan(0.90);
    expect(result.score01).toBeGreaterThan(0.60);
    expect(result.score01).toBeCloseTo(0.85, 2);
  });

  it('scores a clean session higher than one with multiple V-rule failures', () => {
    const clean = scoreMemoryQuality({
      content: RICH_CONTENT,
      validatorSignals: [],
    });

    const penalised = scoreMemoryQuality({
      content: THIN_CONTENT,
      validatorSignals: [
        { ruleId: 'V2', passed: false },
        { ruleId: 'V4', passed: false },
        { ruleId: 'V5', passed: false },
        { ruleId: 'V7', passed: false },
        { ruleId: 'V12', passed: false },
      ],
    });

    // 2 MEDIUM (0.03 each) + 3 LOW (0.01 each) = 0.09 penalty → score ≈ 0.91
    // The clean session (1.0) is clearly above the penalised one, demonstrating discriminative power.
    expect(clean.score01).toBeGreaterThan(penalised.score01);
    expect(clean.score01).toBe(1.0);
    expect(penalised.score01).toBeLessThan(1.0);
    expect(penalised.score01).toBeLessThan(0.95);
  });

  it('applies high-severity contamination cap at 0.60', () => {
    const clean = scoreMemoryQuality({
      content: RICH_CONTENT,
      validatorSignals: [],
      hadContamination: false,
    });

    const contaminated = scoreMemoryQuality({
      content: RICH_CONTENT,
      validatorSignals: [],
      hadContamination: true,
      contaminationSeverity: null, // null defaults to medium → cap 0.85
    });

    const highContaminated = scoreMemoryQuality({
      content: RICH_CONTENT,
      validatorSignals: [],
      hadContamination: true,
      contaminationSeverity: 'high',
    });

    expect(highContaminated.score01).toBeLessThanOrEqual(0.60);
    expect(highContaminated.score01).toBeLessThan(clean.score01);
    expect(highContaminated.score100).toBe(Math.round(highContaminated.score01 * 100));
    expect(highContaminated.qualityFlags).toContain('has_contamination');

    // null severity treated as medium: capped at 0.85
    expect(contaminated.score01).toBeLessThanOrEqual(0.85);
    expect(contaminated.score01).toBeGreaterThan(highContaminated.score01);
  });

  describe('contamination severity tiers', () => {
    it('applies a small penalty for low severity contamination (no cap applied)', () => {
      const result = scoreMemoryQuality({
        content: RICH_CONTENT,
        validatorSignals: [],
        hadContamination: true,
        contaminationSeverity: 'low',
      });

      // Low severity: warning added but no cap → score stays at 1.0 (no V-rule failures)
      expect(result.score01).toBeGreaterThan(0.60);
      expect(result.qualityFlags).toContain('has_contamination');
    });

    it('caps medium severity contamination at 0.85', () => {
      const result = scoreMemoryQuality({
        content: RICH_CONTENT,
        validatorSignals: [],
        hadContamination: true,
        contaminationSeverity: 'medium',
      });

      expect(result.score01).toBeLessThanOrEqual(0.85);
      expect(result.qualityFlags).toContain('has_contamination');
    });

    it('caps high severity contamination at 0.60', () => {
      const result = scoreMemoryQuality({
        content: RICH_CONTENT,
        validatorSignals: [],
        hadContamination: true,
        contaminationSeverity: 'high',
      });

      expect(result.score01).toBeLessThanOrEqual(0.60);
      expect(result.qualityFlags).toContain('has_contamination');
    });

    it('keeps low severity score above the 0.60 cap used for high severity', () => {
      const lowSeverity = scoreMemoryQuality({
        content: RICH_CONTENT,
        validatorSignals: [],
        hadContamination: true,
        contaminationSeverity: 'low',
      });

      const highSeverity = scoreMemoryQuality({
        content: RICH_CONTENT,
        validatorSignals: [],
        hadContamination: true,
        contaminationSeverity: 'high',
      });

      expect(lowSeverity.score01).toBeGreaterThan(highSeverity.score01);
      expect(lowSeverity.score01).toBeGreaterThan(0.60);
      expect(highSeverity.score01).toBeLessThanOrEqual(0.60);
    });

    it('treats null severity as medium (default behavior)', () => {
      const withNull = scoreMemoryQuality({
        content: RICH_CONTENT,
        validatorSignals: [],
        hadContamination: true,
        contaminationSeverity: null,
      });

      const withMedium = scoreMemoryQuality({
        content: RICH_CONTENT,
        validatorSignals: [],
        hadContamination: true,
        contaminationSeverity: 'medium',
      });

      expect(withNull.score01).toBe(withMedium.score01);
    });
  });

  it('returns correct score01/score100 relationship for all result shapes', () => {
    const cases = [
      { validatorSignals: [] as Array<{ ruleId: 'V2'; passed: boolean }>, hadContamination: false as const },
      { validatorSignals: [{ ruleId: 'V2' as const, passed: false }], hadContamination: false as const },
      { validatorSignals: [] as Array<{ ruleId: 'V2'; passed: boolean }>, hadContamination: true as const, contaminationSeverity: 'high' as const },
    ];

    for (const params of cases) {
      const result = scoreMemoryQuality({ content: RICH_CONTENT, ...params });
      expect(result.score01).toBeCloseTo(result.score100 / 100, 5);
      expect(result.score100).toBe(Math.round(result.score01 * 100));
    }
  });
});
