// TEST: ATTENTION DECAY WITH FSRS INTEGRATION (vitest)
// Converted from: attention-decay.test.ts (custom runner)
// Aligned with production attention-decay.ts + fsrs-scheduler.ts named exports
import { describe, it, expect } from 'vitest';
import * as attentionDecay from '../lib/cognitive/attention-decay';
import * as fsrsScheduler from '../lib/cognitive/fsrs-scheduler';

type AttentionDecayDb = Parameters<typeof attentionDecay.init>[0];
const attentionDecayExports = attentionDecay as unknown as Record<string, unknown>;

/* ───────────────────────────────────────────────────────────────
   DECAY_CONFIG
──────────────────────────────────────────────────────────────── */

describe('Attention Decay Module', () => {
  describe('DECAY_CONFIG', () => {
    it('DECAY_CONFIG is exported', () => {
      expect(attentionDecay.DECAY_CONFIG).toBeTruthy();
    });

    it('defaultDecayRate is valid', () => {
      const defaultRate = attentionDecay.DECAY_CONFIG.defaultDecayRate;
      expect(typeof defaultRate).toBe('number');
      expect(defaultRate).toBeGreaterThanOrEqual(0);
      expect(defaultRate).toBeLessThanOrEqual(1);
    });

    it('All importance tiers defined', () => {
      const tiers = attentionDecay.DECAY_CONFIG.decayRateByTier;
      const expectedTiers = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];
      const missingTiers = expectedTiers.filter(t => (tiers as Record<string, unknown>)[t] === undefined);
      expect(missingTiers).toHaveLength(0);
    });

    it('minScoreThreshold is valid', () => {
      const minThreshold = attentionDecay.DECAY_CONFIG.minScoreThreshold;
      expect(typeof minThreshold).toBe('number');
      expect(minThreshold).toBeGreaterThan(0);
      expect(minThreshold).toBeLessThan(1);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     init()
     Production: init(database) throws if !database
  ──────────────────────────────────────────────────────────────── */

  describe('init()', () => {
    it('init(null) throws error', () => {
      expect(() => attentionDecay.init(null as unknown as AttentionDecayDb)).toThrow('Database reference is required');
    });

    it('init(undefined) throws error', () => {
      expect(() => attentionDecay.init(undefined as unknown as AttentionDecayDb)).toThrow('Database reference is required');
    });

    it('init(validDb) stores reference', () => {
      const mockDb = { prepare: () => { }, exec: () => { } };
      attentionDecay.init(mockDb as unknown as AttentionDecayDb);
      const db = attentionDecay.getDb();
      // @ts-ignore: test mock comparison
      expect(db).toBe(mockDb);

      // Reset to null state for remaining tests
      attentionDecay.clearSession();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     getDecayRate()
     Production: getDecayRate(importanceTier: string | null | undefined): number
     NOT case-insensitive - uses exact key lookup
  ──────────────────────────────────────────────────────────────── */

  describe('getDecayRate()', () => {
    it('constitutional tier returns 1.0', () => {
      expect(attentionDecay.getDecayRate('constitutional')).toBe(1.0);
    });

    it('critical tier returns 1.0', () => {
      expect(attentionDecay.getDecayRate('critical')).toBe(1.0);
    });

    it('normal tier returns 0.80', () => {
      expect(attentionDecay.getDecayRate('normal')).toBe(0.80);
    });

    it('temporary tier returns 0.60', () => {
      expect(attentionDecay.getDecayRate('temporary')).toBe(0.60);
    });

    it('unknown tier returns default', () => {
      const defaultRate = attentionDecay.DECAY_CONFIG.defaultDecayRate;
      expect(attentionDecay.getDecayRate('unknown_tier')).toBe(defaultRate);
    });

    it('null tier returns default', () => {
      const defaultRate = attentionDecay.DECAY_CONFIG.defaultDecayRate;
      expect(attentionDecay.getDecayRate(null)).toBe(defaultRate);
    });

    it('undefined tier returns default', () => {
      const defaultRate = attentionDecay.DECAY_CONFIG.defaultDecayRate;
      expect(attentionDecay.getDecayRate(undefined)).toBe(defaultRate);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     calculateRetrievabilityDecay()
     Production: calculateRetrievabilityDecay(stability: number, elapsedDays: number): number
     Uses FSRS formula: R = (1 + (19/81) * t / S)^(-0.5)
  ──────────────────────────────────────────────────────────────── */

  describe('calculateRetrievabilityDecay()', () => {
    it('At t=0, R=1.0', () => {
      expect(attentionDecay.calculateRetrievabilityDecay(1.0, 0)).toBe(1.0);
    });

    it('S=1, t=1: FSRS formula correct', () => {
      const r1 = attentionDecay.calculateRetrievabilityDecay(1.0, 1.0);
      const expected1 = Math.pow(1 + (19 / 81) * 1, -0.5);
      expect(r1).toBeCloseTo(expected1, 2);
    });

    it('Higher stability = slower decay', () => {
      const rS1 = attentionDecay.calculateRetrievabilityDecay(1.0, 5);
      const rS5 = attentionDecay.calculateRetrievabilityDecay(5.0, 5);
      expect(rS5).toBeGreaterThan(rS1);
    });

    it('S=0 returns 0', () => {
      expect(attentionDecay.calculateRetrievabilityDecay(0, 5)).toBe(0);
    });

    it('Negative elapsed returns 0', () => {
      expect(attentionDecay.calculateRetrievabilityDecay(1.0, -5)).toBe(0);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     applyFsrsDecay()
     Production: applyFsrsDecay(memory: object, baseScore?: number): number
  ──────────────────────────────────────────────────────────────── */

  describe('applyFsrsDecay()', () => {
    it('Recent review => ~1.0', () => {
      const recentMemory = {
        stability: 10.0,
        last_review: new Date().toISOString(),
      };
      const recentResult = attentionDecay.applyFsrsDecay(recentMemory, 1.0);
      expect(recentResult).toBeGreaterThanOrEqual(0.99);
      expect(recentResult).toBeLessThanOrEqual(1.0);
    });

    it('No last_review => returns baseScore', () => {
      const noReviewMemory = { stability: 5.0 };
      expect(attentionDecay.applyFsrsDecay(noReviewMemory, 0.8)).toBe(0.8);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     activateMemory() without DB
     Production: activateMemory(memoryId: number): boolean
  ──────────────────────────────────────────────────────────────── */

  describe('activateMemory() without DB', () => {
    it('activateMemory returns false without DB', () => {
      attentionDecay.clearSession();
      expect(attentionDecay.activateMemory(1)).toBe(false);
    });

    it('activateMemoryWithFsrs returns false without DB', () => {
      attentionDecay.clearSession();
      expect(attentionDecay.activateMemoryWithFsrs(1, 3)).toBe(false);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     getActiveMemories() without DB
     Production: getActiveMemories(limit?: number): Array<Record<string, unknown>>
  ──────────────────────────────────────────────────────────────── */

  describe('getActiveMemories() without DB', () => {
    it('getActiveMemories returns [] without DB', () => {
      attentionDecay.clearSession();
      const result = attentionDecay.getActiveMemories();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('getActiveMemories(5) returns [] without DB', () => {
      attentionDecay.clearSession();
      const result = attentionDecay.getActiveMemories(5);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     calculateCompositeAttention()
     Production: calculateCompositeAttention(memory, options?): number
  ──────────────────────────────────────────────────────────────── */

  describe('calculateCompositeAttention()', () => {
    it('calculateCompositeAttention is exported', () => {
      expect(typeof attentionDecay.calculateCompositeAttention).toBe('function');
    });

    it('Returns valid score for minimal memory', () => {
      const minimalMemory = { importance_tier: 'normal' };
      const score = attentionDecay.calculateCompositeAttention(minimalMemory);
      expect(typeof score).toBe('number');
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('Constitutional >= normal score', () => {
      const constMemory = { importance_tier: 'constitutional', importance_weight: 1.0 };
      const normalMemory = { importance_tier: 'normal', importance_weight: 0.5 };
      const constScore = attentionDecay.calculateCompositeAttention(constMemory);
      const normalScore = attentionDecay.calculateCompositeAttention(normalMemory);
      expect(constScore).toBeGreaterThanOrEqual(normalScore);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     getAttentionBreakdown()
     Production: getAttentionBreakdown(memory): { temporal, usage, importance, pattern, citation, composite, weights }
  ──────────────────────────────────────────────────────────────── */

  describe('getAttentionBreakdown()', () => {
    it('getAttentionBreakdown is exported', () => {
      expect(typeof attentionDecay.getAttentionBreakdown).toBe('function');
    });

    it('Breakdown has all 5 factors + composite + weights', () => {
      const memory = { importance_tier: 'normal', access_count: 5 };
      const breakdown = attentionDecay.getAttentionBreakdown(memory);
      const expectedFields = ['temporal', 'usage', 'importance', 'pattern', 'citation', 'composite', 'weights'];
      const missingFields = expectedFields.filter(f => !(f in breakdown));
      expect(missingFields).toHaveLength(0);
    });

    it('composite is a number', () => {
      const memory = { importance_tier: 'normal', access_count: 5 };
      const breakdown = attentionDecay.getAttentionBreakdown(memory);
      expect(typeof breakdown.composite).toBe('number');
    });

    it('weights is an object', () => {
      const memory = { importance_tier: 'normal', access_count: 5 };
      const breakdown = attentionDecay.getAttentionBreakdown(memory);
      expect(typeof breakdown.weights).toBe('object');
      expect(breakdown.weights).not.toBeNull();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     applyCompositeDecay()
     Production: applyCompositeDecay(memories: Array): Array (sorted by attentionScore)
  ──────────────────────────────────────────────────────────────── */

  describe('applyCompositeDecay()', () => {
    it('applyCompositeDecay is exported', () => {
      expect(typeof attentionDecay.applyCompositeDecay).toBe('function');
    });

    it('Returns array of same length', () => {
      const memories = [
        { importance_tier: 'normal', importance_weight: 0.5 },
        { importance_tier: 'constitutional', importance_weight: 1.0 },
      ];
      const result = attentionDecay.applyCompositeDecay(memories);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    });

    it('Each item has attentionScore', () => {
      const memories = [
        { importance_tier: 'normal', importance_weight: 0.5 },
        { importance_tier: 'constitutional', importance_weight: 1.0 },
      ];
      const result = attentionDecay.applyCompositeDecay(memories);
      expect(result.every((m) => typeof m.attentionScore === 'number')).toBe(true);
    });

    it('Sorted descending by attentionScore', () => {
      const memories = [
        { importance_tier: 'normal', importance_weight: 0.5 },
        { importance_tier: 'constitutional', importance_weight: 1.0 },
      ];
      const result = attentionDecay.applyCompositeDecay(memories);
      expect(result[0].attentionScore).toBeGreaterThanOrEqual(result[1].attentionScore);
    });

    it('Empty input => empty result', () => {
      const emptyResult = attentionDecay.applyCompositeDecay([]);
      expect(Array.isArray(emptyResult)).toBe(true);
      expect(emptyResult).toHaveLength(0);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     FSRS Scheduler Constants
     Production fsrs-scheduler.ts exports: FSRS_FACTOR=19/81, FSRS_DECAY=-0.5
  ──────────────────────────────────────────────────────────────── */

  describe('FSRS Configuration', () => {
    it('FSRS_FACTOR = 19/81', () => {
      expect(fsrsScheduler.FSRS_FACTOR).toBeCloseTo(19 / 81, 4);
    });

    it('FSRS_DECAY = -0.5', () => {
      expect(fsrsScheduler.FSRS_DECAY).toBe(-0.5);
    });

    it('DEFAULT_INITIAL_STABILITY = 1.0', () => {
      expect(fsrsScheduler.DEFAULT_INITIAL_STABILITY).toBe(1.0);
    });

    it('DEFAULT_INITIAL_DIFFICULTY = 5.0', () => {
      expect(fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY).toBe(5.0);
    });

    it('Grade constants correct', () => {
      expect(fsrsScheduler.GRADE_AGAIN).toBe(1);
      expect(fsrsScheduler.GRADE_HARD).toBe(2);
      expect(fsrsScheduler.GRADE_GOOD).toBe(3);
      expect(fsrsScheduler.GRADE_EASY).toBe(4);
    });

    it('FSRS_CONSTANTS bundled object exported', () => {
      expect(fsrsScheduler.FSRS_CONSTANTS).toBeTruthy();
      expect(fsrsScheduler.FSRS_CONSTANTS.FSRS_FACTOR).toBeCloseTo(19 / 81, 4);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     FSRS Decay Curve
     calculateRetrievability(stability, elapsedDays): number
  ──────────────────────────────────────────────────────────────── */

  describe('FSRS Decay Curve', () => {
    it('t=0 => R=1.0', () => {
      expect(fsrsScheduler.calculateRetrievability(1.0, 0)).toBe(1.0);
    });

    it('Monotonically decreasing', () => {
      const rValues = [0, 1, 2, 5, 10, 20, 50, 100].map(t =>
        fsrsScheduler.calculateRetrievability(1.0, t)
      );
      for (let i = 1; i < rValues.length; i++) {
        expect(rValues[i]).toBeLessThanOrEqual(rValues[i - 1]);
      }
    });

    it('Never reaches 0 (long tail)', () => {
      const rFar = fsrsScheduler.calculateRetrievability(1.0, 10000);
      expect(rFar).toBeGreaterThan(0);
    });

    it('Higher S = slower decay', () => {
      const rS1 = fsrsScheduler.calculateRetrievability(1.0, 5);
      const rS10 = fsrsScheduler.calculateRetrievability(10.0, 5);
      expect(rS10).toBeGreaterThan(rS1);
    });

    it('Clamped to [0, 1]', () => {
      const rNeg = fsrsScheduler.calculateRetrievability(1.0, -5);
      const rHuge = fsrsScheduler.calculateRetrievability(0.001, 1000000);
      expect(rNeg).toBeGreaterThanOrEqual(0);
      expect(rNeg).toBeLessThanOrEqual(1);
      expect(rHuge).toBeGreaterThanOrEqual(0);
      expect(rHuge).toBeLessThanOrEqual(1);
    });

    it('Invalid stability => 0', () => {
      expect(fsrsScheduler.calculateRetrievability(0, 1)).toBe(0);
      expect(fsrsScheduler.calculateRetrievability(-5, 1)).toBe(0);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Backward Compatibility
  ──────────────────────────────────────────────────────────────── */

  describe('Backward Compatibility', () => {
    // Legacy functions still exported (calculateDecayedScore and applyDecay removed in REC-017 Phase 4)
    const legacyExports = ['activateMemory', 'getDecayRate', 'DECAY_CONFIG', 'clearSession'];

    it.each(legacyExports)('Legacy export: %s', (name) => {
      expect(attentionDecayExports[name]).toBeDefined();
    });

    // FSRS exports
    const fsrsExports = ['applyFsrsDecay', 'calculateRetrievabilityDecay', 'activateMemoryWithFsrs'];

    it.each(fsrsExports)('FSRS export: %s', (name) => {
      expect(attentionDecayExports[name]).toBeDefined();
    });

    // Composite exports
    const compositeExports = ['calculateCompositeAttention', 'getAttentionBreakdown', 'applyCompositeDecay'];

    it.each(compositeExports)('Composite export: %s', (name) => {
      expect(attentionDecayExports[name]).toBeDefined();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Edge Cases
  ──────────────────────────────────────────────────────────────── */

  describe('Edge Cases', () => {
    // Constitutional tier = infinite half-life (rate 1.0, no decay)
    // REC-017: Use FSRS retrievability — high stability + any elapsed = ~1.0
    it('High stability = minimal decay after 1000 days', () => {
      const constRetrievability = attentionDecay.calculateRetrievabilityDecay(1000.0, 1000);
      expect(constRetrievability).toBeGreaterThanOrEqual(0.9);
    });

    // Deprecated tier also frozen — use applyFsrsDecay with no last_review to get baseScore back
    it('No last_review = frozen state (returns baseScore)', () => {
      const deprMemory = { importance_tier: 'deprecated', stability: 1.0 };
      expect(attentionDecay.applyFsrsDecay(deprMemory, 0.5)).toBe(0.5);
    });

    // Important tier has rate=1.0 (no decay)
    it('Important tier rate = 1.0', () => {
      expect(attentionDecay.getDecayRate('important')).toBe(1.0);
    });

    // ClearSession sets db to null
    it('clearSession sets db to null', () => {
      attentionDecay.clearSession();
      expect(attentionDecay.getDb()).toBeNull();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Module Exports
  ──────────────────────────────────────────────────────────────── */

  describe('Module Exports', () => {
    const expectedExports = [
      'DECAY_CONFIG', 'init', 'getDb',
      'getDecayRate', 'calculateRetrievabilityDecay',
      'applyFsrsDecay',
      'activateMemory', 'activateMemoryWithFsrs',
      'calculateCompositeAttention', 'getAttentionBreakdown',
      'applyCompositeDecay', 'getActiveMemories',
      'clearSession',
    ];

    it.each(expectedExports)('Export: %s', (name) => {
      expect(attentionDecayExports[name]).toBeDefined();
    });
  });
});
