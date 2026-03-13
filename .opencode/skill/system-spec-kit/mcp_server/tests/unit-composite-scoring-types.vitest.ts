// Converted from: unit-composite-scoring-types.test.ts (custom runner)
// TEST: COMPOSITE SCORING — TYPE UNIFICATION (ScoringInput)
// Validates cast-removal: deprecated MemoryRow → ScoringInput accepts
// Partial objects, mixed casing, and extra arbitrary fields.
import { describe, it, expect } from 'vitest';
import type { ScoringInput } from '../lib/scoring/composite-scoring';
import {
  calculateRetrievabilityScore,
  calculateFiveFactorScore,
  applyFiveFactorScoring,
  applyCompositeScoring,
} from '../lib/scoring/composite-scoring';

/* --- Tests --- */

describe('Composite Scoring — Type Unification (ScoringInput)', () => {

  // 4.1 calculateRetrievabilityScore with partial objects (ScoringInput)
  describe('Retrievability with partial ScoringInput objects', () => {
    it('T-CS-01: only stability field', () => {
      const r = calculateRetrievabilityScore({ stability: 5.0 });
      expect(typeof r).toBe('number');
      expect(r).not.toBeNaN();
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(1);
    });

    it('T-CS-02: only lastReview field', () => {
      const r = calculateRetrievabilityScore({ lastReview: new Date().toISOString() });
      expect(typeof r).toBe('number');
      expect(r).not.toBeNaN();
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(1);
    });

    it('T-CS-03: empty object {} uses defaults', () => {
      const r = calculateRetrievabilityScore({});
      expect(typeof r).toBe('number');
      expect(r).not.toBeNaN();
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(1);
    });

    it('T-CS-04: extra arbitrary fields accepted', () => {
      const r = calculateRetrievabilityScore({
        stability: 5.0,
        lastReview: new Date(Date.now() - 86400000).toISOString(),
        customField: 'should-be-ignored',
        anotherExtra: 42,
      });
      expect(typeof r).toBe('number');
      expect(r).not.toBeNaN();
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(1);
    });
  });

  // 4.2 calculateFiveFactorScore with minimal ScoringInput
  describe('Five-factor score with minimal ScoringInput', () => {
    it('T-CS-05: minimal {importance_tier: "normal"}', () => {
      const score = calculateFiveFactorScore({ importance_tier: 'normal' });
      expect(typeof score).toBe('number');
      expect(score).not.toBeNaN();
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('T-CS-06: minimal {id: 1}', () => {
      const score = calculateFiveFactorScore({ id: 1 });
      expect(typeof score).toBe('number');
      expect(score).not.toBeNaN();
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('T-CS-07: empty object for five-factor', () => {
      const score = calculateFiveFactorScore({});
      expect(typeof score).toBe('number');
      expect(score).not.toBeNaN();
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('T-CS-08: both snake_case and camelCase fields', () => {
      const score = calculateFiveFactorScore({
        importance_tier: 'important',
        importanceTier: 'important',
        importance_weight: 0.8,
        importanceWeight: 0.8,
      });
      expect(typeof score).toBe('number');
      expect(score).not.toBeNaN();
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });

  // 4.3 applyFiveFactorScoring with mixed memory batch
  describe('applyFiveFactorScoring with mixed memory batch', () => {
    it('T-CS-09: batch of mixed memories scored', () => {
      const memories: ScoringInput[] = [
        { id: 1, importance_tier: 'constitutional', stability: 100, similarity: 90 },
        { id: 2, importance_tier: 'normal', access_count: 5 },
        { id: 3 },  // Truly minimal
        { id: 4, importance_tier: 'critical', customData: { nested: true } },
      ];

      const ranked = applyFiveFactorScoring(memories);

      expect(Array.isArray(ranked)).toBe(true);
      expect(ranked.length).toBe(4);

      const allScored = ranked.every((m) =>
        typeof m.composite_score === 'number' && !isNaN(m.composite_score)
      );
      expect(allScored).toBe(true);
    });

    it('T-CS-10: empty batch returns empty array', () => {
      const ranked = applyFiveFactorScoring([]);
      expect(Array.isArray(ranked)).toBe(true);
      expect(ranked.length).toBe(0);
    });
  });

  // 4.4 applyCompositeScoring with ScoringInput
  describe('applyCompositeScoring accepts ScoringInput objects', () => {
    it('T-CS-11: snake_case-only ScoringInput', () => {
      const memories: ScoringInput[] = [
        {
          id: 1,
          similarity: 80,
          importance_weight: 0.7,
          importance_tier: 'important',
          updated_at: new Date().toISOString(),
          access_count: 10,
          stability: 5.0,
        },
      ];

      const ranked = applyCompositeScoring(memories);
      expect(ranked.length).toBe(1);
      expect(typeof ranked[0].composite_score).toBe('number');
    });

    it('T-CS-12: camelCase ScoringInput accepted', () => {
      const memories: ScoringInput[] = [
        {
          id: 2,
          similarity: 80,
          importanceWeight: 0.7,
          importanceTier: 'important',
          updatedAt: new Date().toISOString(),
          accessCount: 10,
          stability: 5.0,
          lastReview: new Date().toISOString(),
        },
      ];

      const ranked = applyCompositeScoring(memories);
      expect(ranked.length).toBe(1);
      expect(typeof ranked[0].composite_score).toBe('number');
    });

    it('T-CS-13: extra unknown fields accepted', () => {
      const memories: ScoringInput[] = [
        {
          id: 3,
          similarity: 60,
          importance_tier: 'normal',
          randomField: 'hello',
          _internal: { x: 1 },
          __metadata: [1, 2, 3],
        },
      ];

      const ranked = applyCompositeScoring(memories);
      expect(ranked.length).toBe(1);
      expect(typeof ranked[0].composite_score).toBe('number');
    });
  });
});
