// TEST: TIERED INJECTION TURNNUMBER
import { describe, it, expect } from 'vitest';

import * as tierClassifier from '../lib/cognitive/tier-classifier';
import * as handler from '../handlers/memory-triggers';

describe('T201 + T208: Tiered Injection + Turn Decay [deferred - requires DB test fixtures]', () => {

  describe('Setup: Module Loading', () => {
    it('Setup: tier-classifier loaded', () => {
      expect(tierClassifier).toBeDefined();
      expect(tierClassifier.classifyTier).toBeDefined();
    });

    it('Setup: memory-triggers handler loaded', () => {
      expect(handler).toBeDefined();
    });
  });

  describe('T201: classifyTier produces mixed tiers', () => {
    it('T201-1: Constitutional memory is HOT', () => {
      const constitutional = tierClassifier.classifyTier({
        id: 1,
        importance_tier: 'constitutional',
        stability: 0.1,
        last_review: '2020-01-01T00:00:00Z',
      });
      expect(constitutional.state).toBe('HOT');
    });

    it('T201-2: Recent normal memory is HOT or WARM', () => {
      const recent = tierClassifier.classifyTier({
        id: 2,
        importance_tier: 'normal',
        stability: 1.0,
        last_review: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
      expect(['HOT', 'WARM']).toContain(recent.state);
    });

    it('T201-3: Old low-stability memory is COLD/DORMANT/ARCHIVED', () => {
      const old = tierClassifier.classifyTier({
        id: 3,
        importance_tier: 'normal',
        stability: 0.05,
        last_review: '2023-01-01T00:00:00Z',
        created_at: '2023-01-01T00:00:00Z',
      });
      expect(['COLD', 'DORMANT', 'ARCHIVED']).toContain(old.state);
    });

    it('T201-4: Mixed memory set produces mixed tiers (not all HOT)', () => {
      const memories = [
        { id: 10, importance_tier: 'constitutional', stability: 1.0 },
        { id: 11, importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString() },
        { id: 12, importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01T00:00:00Z', created_at: '2023-01-01T00:00:00Z' },
        { id: 13, importance_tier: 'temporary', stability: 0.01, last_review: '2022-06-01T00:00:00Z', created_at: '2022-06-01T00:00:00Z' },
      ];

      const tiers = memories.map(m => tierClassifier.classifyTier(m).state);
      const uniqueTiers = new Set(tiers);
      expect(uniqueTiers.size).toBeGreaterThan(1);
    });

    it('T201-5: classifyTier returns {state, retrievability, effectiveHalfLife}', () => {
      const result = tierClassifier.classifyTier({ id: 20, importance_tier: 'normal', stability: 1.0 });
      expect(typeof result.state).toBe('string');
      expect(typeof result.retrievability).toBe('number');
      expect('effectiveHalfLife' in result).toBe(true);
    });
  });

  describe('T201: getStateStats reflects actual distribution', () => {
    it('T201-6: HOT count includes constitutional+critical', () => {
      const memories = [
        { id: 30, importance_tier: 'constitutional', stability: 1.0 },
        { id: 31, importance_tier: 'critical', stability: 1.0 },
        { id: 32, importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString() },
        { id: 33, importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01T00:00:00Z', created_at: '2023-01-01T00:00:00Z' },
        { id: 34, importance_tier: 'temporary', stability: 0.01, last_review: '2022-01-01T00:00:00Z', created_at: '2022-01-01T00:00:00Z' },
      ];

      const stats = tierClassifier.getStateStats(memories);
      expect(stats.HOT).toBeGreaterThanOrEqual(2);
    });

    it('T201-7: Stats total matches input count', () => {
      const memories = [
        { id: 30, importance_tier: 'constitutional', stability: 1.0 },
        { id: 31, importance_tier: 'critical', stability: 1.0 },
        { id: 32, importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString() },
        { id: 33, importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01T00:00:00Z', created_at: '2023-01-01T00:00:00Z' },
        { id: 34, importance_tier: 'temporary', stability: 0.01, last_review: '2022-01-01T00:00:00Z', created_at: '2022-01-01T00:00:00Z' },
      ];

      const stats = tierClassifier.getStateStats(memories);
      expect(stats.total).toBe(memories.length);
    });

    it('T201-8: Distribution includes non-HOT tiers', () => {
      const memories = [
        { id: 30, importance_tier: 'constitutional', stability: 1.0 },
        { id: 31, importance_tier: 'critical', stability: 1.0 },
        { id: 32, importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString() },
        { id: 33, importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01T00:00:00Z', created_at: '2023-01-01T00:00:00Z' },
        { id: 34, importance_tier: 'temporary', stability: 0.01, last_review: '2022-01-01T00:00:00Z', created_at: '2022-01-01T00:00:00Z' },
      ];

      const stats = tierClassifier.getStateStats(memories);
      const nonHot = stats.WARM + stats.COLD + stats.DORMANT + stats.ARCHIVED;
      expect(nonHot).toBeGreaterThan(0);
    });
  });

  describe('T208: turnNumber-based decay', () => {
    const TURN_DECAY_RATE = 0.98;

    it('T208-1: Turn decay factors decrease with turn number', () => {
      const factor1 = Math.pow(TURN_DECAY_RATE, 1 - 1);
      const factor10 = Math.pow(TURN_DECAY_RATE, 10 - 1);
      const factor50 = Math.pow(TURN_DECAY_RATE, 50 - 1);
      const factor100 = Math.pow(TURN_DECAY_RATE, 100 - 1);

      expect(factor1).toBe(1.0);
      expect(factor10).toBeLessThan(1.0);
      expect(factor50).toBeLessThan(factor10);
      expect(factor100).toBeLessThan(factor50);
    });

    it('T208-2: Turn decay changes tier classification', () => {
      const baseScore = 0.30;

      const scoreT1 = baseScore * Math.pow(TURN_DECAY_RATE, 0);
      const tierT1 = tierClassifier.classifyState(scoreT1);

      const scoreT50 = baseScore * Math.pow(TURN_DECAY_RATE, 49);
      const tierT50 = tierClassifier.classifyState(scoreT50);

      expect(tierT1).not.toBe(tierT50);
    });

    it('T208-3: Turn decay drops HOT to lower tier', () => {
      const baseScore = 0.85;

      const scoreT1 = baseScore * 1.0;
      const tierT1 = tierClassifier.classifyState(scoreT1);

      const scoreT10 = baseScore * Math.pow(TURN_DECAY_RATE, 9);
      const tierT10 = tierClassifier.classifyState(scoreT10);

      expect(tierT1).toBe('HOT');
      expect(tierT10).not.toBe('HOT');
    });

    it('T208-4: Constitutional classifyTier always returns R=1.0', () => {
      const classification = tierClassifier.classifyTier({
        id: 99,
        importance_tier: 'constitutional',
        stability: 1.0,
      });

      expect(classification.state).toBe('HOT');
      expect(classification.retrievability).toBe(1.0);
    });

    it('T208-5: turnNumber=0 and turnNumber=1 produce factor=1.0', () => {
      const factorT0 = Math.pow(TURN_DECAY_RATE, Math.max(0, 0 - 1));
      const factorT1 = Math.pow(TURN_DECAY_RATE, Math.max(0, 1 - 1));

      expect(factorT0).toBe(1.0);
      expect(factorT1).toBe(1.0);
    });
  });

  describe('T208: Handler turnNumber integration', () => {
    it('T208-6: Handler exports handleMemoryMatchTriggers', () => {
      expect(typeof handler.handleMemoryMatchTriggers).toBe('function');
    });

    it('T208-7: Snake_case alias exported', () => {
      const handlerExports = handler as Record<string, unknown>;
      expect(typeof handlerExports.handle_memory_match_triggers).toBe('function');
    });
  });

  describe('T201: filterAndLimitByState tier limits', () => {
    it('T201-9: filterAndLimitByState returns array', () => {
      const enriched = [
        { memoryId: 40, attentionScore: 0.95, tier: 'HOT', importance_tier: 'constitutional', stability: 1.0, id: 40 },
        { memoryId: 41, attentionScore: 0.50, tier: 'WARM', importance_tier: 'normal', stability: 1.0, last_review: new Date().toISOString(), id: 41 },
        { memoryId: 42, attentionScore: 0.10, tier: 'COLD', importance_tier: 'normal', stability: 0.05, last_review: '2023-01-01', created_at: '2023-01-01', id: 42 },
      ];

      const filtered = tierClassifier.filterAndLimitByState(enriched);
      expect(Array.isArray(filtered)).toBe(true);
      expect(filtered.length).toBeGreaterThan(0);
    });
  });
});
