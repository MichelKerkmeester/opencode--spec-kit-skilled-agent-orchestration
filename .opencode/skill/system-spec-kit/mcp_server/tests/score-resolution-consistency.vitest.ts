// ───────────────────────────────────────────────────────────────
// TEST: Score Resolution Consistency (G2)
// ───────────────────────────────────────────────────────────────
// After A1 unification, all 3 score resolution functions must agree
// on value and ordering for identical inputs.
import { describe, it, expect } from 'vitest';

import { resolveEffectiveScore } from '../lib/search/pipeline/types';
import type { PipelineRow, Stage4ReadonlyRow } from '../lib/search/pipeline/types';
import { compareDeterministicRows } from '../lib/search/pipeline/ranking-contract';
import { extractScoringValue } from '../lib/search/pipeline/stage4-filter';

/* ───────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────── */

function makeRow(overrides: Partial<PipelineRow> = {}): PipelineRow {
  return { id: 1, ...overrides };
}

function makeStage4Row(overrides: Partial<Stage4ReadonlyRow> = {}): Stage4ReadonlyRow {
  return { id: 1, ...overrides };
}

/* ───────────────────────────────────────────────────────────────
   TESTS
──────────────────────────────────────────────────────────────── */

describe('score resolution consistency', () => {
  describe('when all aliases are synced', () => {
    it('resolveEffectiveScore and compareDeterministicRows agree on ordering', () => {
      const rowA = makeRow({ id: 1, intentAdjustedScore: 0.9, rrfScore: 0.5, score: 0.3 });
      const rowB = makeRow({ id: 2, intentAdjustedScore: 0.7, rrfScore: 0.8, score: 0.6 });

      const scoreA = resolveEffectiveScore(rowA);
      const scoreB = resolveEffectiveScore(rowB);

      // resolveEffectiveScore says A > B (0.9 > 0.7)
      expect(scoreA).toBeGreaterThan(scoreB);
      // compareDeterministicRows should sort A before B (negative = a first)
      expect(compareDeterministicRows(rowA, rowB)).toBeLessThan(0);
    });

    it('resolveEffectiveScore and extractScoringValue return same value', () => {
      const row = makeRow({ id: 1, intentAdjustedScore: 0.85, rrfScore: 0.6, score: 0.4, similarity: 75 });
      const stage4Row = makeStage4Row({ id: 1, intentAdjustedScore: 0.85, rrfScore: 0.6, score: 0.4, similarity: 75 });

      expect(resolveEffectiveScore(row)).toBe(extractScoringValue(stage4Row));
    });

    it('all 3 functions agree for rows with only similarity set', () => {
      const row = makeRow({ id: 1, similarity: 80 });
      const stage4Row = makeStage4Row({ id: 1, similarity: 80 });

      const resolved = resolveEffectiveScore(row);
      const extracted = extractScoringValue(stage4Row);

      // similarity/100 = 0.8
      expect(resolved).toBe(0.8);
      expect(extracted).toBe(0.8);

      // Two rows with different similarity — ordering should agree
      const rowHigh = makeRow({ id: 10, similarity: 90 });
      const rowLow = makeRow({ id: 20, similarity: 60 });
      expect(resolveEffectiveScore(rowHigh)).toBeGreaterThan(resolveEffectiveScore(rowLow));
      expect(compareDeterministicRows(rowHigh, rowLow)).toBeLessThan(0);
    });

    it('all 3 functions agree for rows with only rrfScore set', () => {
      const row = makeRow({ id: 1, rrfScore: 0.65 });
      const stage4Row = makeStage4Row({ id: 1, rrfScore: 0.65 });

      expect(resolveEffectiveScore(row)).toBe(0.65);
      expect(extractScoringValue(stage4Row)).toBe(0.65);
    });
  });

  describe('edge cases', () => {
    it('handles NaN score fields gracefully', () => {
      const row = makeRow({ id: 1, intentAdjustedScore: NaN, rrfScore: NaN, score: NaN, similarity: NaN });
      const stage4Row = makeStage4Row({ id: 1, intentAdjustedScore: NaN, rrfScore: NaN, score: NaN, similarity: NaN });

      expect(resolveEffectiveScore(row)).toBe(0);
      expect(extractScoringValue(stage4Row)).toBe(0);
    });

    it('handles Infinity score fields gracefully', () => {
      const row = makeRow({ id: 1, intentAdjustedScore: Infinity, rrfScore: 0.5 });
      const stage4Row = makeStage4Row({ id: 1, intentAdjustedScore: Infinity, rrfScore: 0.5 });

      // Infinity is not finite, so skipped — falls through to rrfScore
      expect(resolveEffectiveScore(row)).toBe(0.5);
      expect(extractScoringValue(stage4Row)).toBe(0.5);
    });

    it('returns 0 for empty row', () => {
      const row = makeRow({ id: 1 });
      const stage4Row = makeStage4Row({ id: 1 });

      expect(resolveEffectiveScore(row)).toBe(0);
      expect(extractScoringValue(stage4Row)).toBe(0);
    });

    it('similarity is normalized by /100 in all functions', () => {
      // This was the A1 bug: extractScoringValue used raw similarity
      const row = makeRow({ id: 1, similarity: 85 });
      const stage4Row = makeStage4Row({ id: 1, similarity: 85 });

      const resolved = resolveEffectiveScore(row);
      const extracted = extractScoringValue(stage4Row);

      // Both should return 0.85, not 85
      expect(resolved).toBe(0.85);
      expect(extracted).toBe(0.85);
      expect(resolved).toBe(extracted);
    });

    it('negative scores are clamped to 0', () => {
      const row = makeRow({ id: 1, score: -0.5 });
      expect(resolveEffectiveScore(row)).toBe(0);
    });

    it('scores above 1 are clamped to 1', () => {
      const row = makeRow({ id: 1, score: 1.5 });
      expect(resolveEffectiveScore(row)).toBe(1);
    });
  });
});
