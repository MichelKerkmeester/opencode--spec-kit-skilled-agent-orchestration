// ───────────────────────────────────────────────────────────────
// 1. TIER CLASSIFIER VITEST
// ───────────────────────────────────────────────────────────────
// TEST: TIER CLASSIFIER (5-STATE MODEL) — vitest
// Aligned with production tier-classifier.ts named exports
import { describe, it, expect } from 'vitest';
import * as tierClassifier from '../lib/cognitive/tier-classifier';

const tierClassifierModule = tierClassifier as unknown as Record<string, unknown>;

describe('Tier Classifier (5-State Model)', () => {

  /* ───────────────────────────────────────────────────────────────
     State Classification (T201-T210)
     Production classifyState() accepts:
       - A number (retrievability, elapsedDays): classifyState(0.95, 0)
       - A memory object: classifyState(memoryObj) reads .retrievability or .attentionScore
       - null/undefined: returns 'DORMANT'
     Thresholds: HOT >= 0.80, WARM >= 0.25, COLD >= 0.05, else DORMANT
     ARCHIVED: > 90 days AND r < 0.02
  ──────────────────────────────────────────────────────────────── */

  describe('State Classification (T201-T210)', () => {
    // Using numeric call: classifyState(retrievability, elapsedDays)

    it('T201: R=0.95 => HOT', () => {
      expect(tierClassifier.classifyState(0.95, 0)).toBe('HOT');
    });

    it('T202: R=0.80 (boundary) => HOT', () => {
      expect(tierClassifier.classifyState(0.80, 0)).toBe('HOT');
    });

    it('T203: R=0.79 => WARM', () => {
      expect(tierClassifier.classifyState(0.79, 0)).toBe('WARM');
    });

    it('T204: R=0.50 => WARM', () => {
      expect(tierClassifier.classifyState(0.50, 0)).toBe('WARM');
    });

    it('T205: R=0.25 (boundary) => WARM', () => {
      expect(tierClassifier.classifyState(0.25, 0)).toBe('WARM');
    });

    it('T206: R=0.24 => COLD', () => {
      expect(tierClassifier.classifyState(0.24, 0)).toBe('COLD');
    });

    it('T207: R=0.10 => COLD', () => {
      expect(tierClassifier.classifyState(0.10, 0)).toBe('COLD');
    });

    it('T208: R=0.05 (boundary) => COLD', () => {
      expect(tierClassifier.classifyState(0.05, 0)).toBe('COLD');
    });

    it('T209: R=0.04 => DORMANT', () => {
      expect(tierClassifier.classifyState(0.04, 0)).toBe('DORMANT');
    });

    it('T210: R=0.01 => DORMANT', () => {
      expect(tierClassifier.classifyState(0.01, 0)).toBe('DORMANT');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Archive Detection (T211-T215)
     ARCHIVED: days > 90 AND r < 0.02
  ──────────────────────────────────────────────────────────────── */

  describe('Archive Detection (T211-T215)', () => {
    it('T211: 89 days + low R => NOT archived', () => {
      expect(tierClassifier.classifyState(0.01, 89)).not.toBe('ARCHIVED');
    });

    it('T212: 91 days + R=0.01 => ARCHIVED', () => {
      expect(tierClassifier.classifyState(0.01, 91)).toBe('ARCHIVED');
    });

    it('T213: 100 days + R=0.01 => ARCHIVED', () => {
      expect(tierClassifier.classifyState(0.01, 100)).toBe('ARCHIVED');
    });

    it('T214: 91 days + R=0.80 => HOT (R overrides)', () => {
      expect(tierClassifier.classifyState(0.80, 91)).toBe('HOT');
    });

    it('T215: null => DORMANT', () => {
      expect(tierClassifier.classifyState(null)).toBe('DORMANT');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Retrievability Calculation (T216-T220)
     Production: calculateRetrievability(stability: number, elapsedDays: number): number
     R = (1 + (19/81) * t / S)^(-0.5)
  ──────────────────────────────────────────────────────────────── */

  describe('Retrievability Calculation (T216-T220)', () => {
    it('T216: t=0 => R=1.0', () => {
      const r = tierClassifier.calculateRetrievability(10, 0);
      expect(r).toBeGreaterThanOrEqual(0.99);
      expect(r).toBeLessThanOrEqual(1.0);
    });

    it('T217: t=S => R via FSRS formula', () => {
      const r = tierClassifier.calculateRetrievability(1.0, 1.0);
      const expected = Math.pow(1 + (19 / 81) * 1, -0.5); // ~0.9000
      expect(r).toBeCloseTo(expected, 2);
    });

    it('T218: High stability (S=100, t=10) => very high R', () => {
      const r = tierClassifier.calculateRetrievability(100, 10);
      expect(r).toBeGreaterThan(0.98);
    });

    it('T219: Low stability (S=1, t=10) => lower R', () => {
      const r = tierClassifier.calculateRetrievability(1, 10);
      expect(r).toBeLessThan(0.85);
      expect(r).toBeGreaterThan(0);
    });

    it('T220: S=0 => R=0', () => {
      expect(tierClassifier.calculateRetrievability(0, 5)).toBe(0);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     classifyTier() (T221-T225)
     Production: classifyTier(memory: TierInput) returns {state, retrievability, effectiveHalfLife}
  ──────────────────────────────────────────────────────────────── */

  describe('classifyTier() (T221-T225)', () => {
    it('T221: Constitutional => HOT with R=1.0', () => {
      const r = tierClassifier.classifyTier({ id: 1, importance_tier: 'constitutional', stability: 1.0 });
      expect(r.state).toBe('HOT');
      expect(r.retrievability).toBe(1.0);
    });

    it('T222: Pinned memory => HOT', () => {
      const r = tierClassifier.classifyTier({ id: 2, is_pinned: 1, stability: 1.0 });
      expect(r.state).toBe('HOT');
    });

    it('T223: Critical => HOT, null halfLife', () => {
      const r = tierClassifier.classifyTier({ id: 3, importance_tier: 'critical', stability: 1.0 });
      expect(r.state).toBe('HOT');
      expect(r.effectiveHalfLife).toBeNull();
    });

    it('T224: Returns {state, retrievability, effectiveHalfLife}', () => {
      const r = tierClassifier.classifyTier({ id: 4, stability: 1.0 });
      expect(r).toHaveProperty('state');
      expect(r).toHaveProperty('retrievability');
      expect(r).toHaveProperty('effectiveHalfLife');
    });

    it('T225: Normal tier has numeric effectiveHalfLife', () => {
      const r = tierClassifier.classifyTier({ id: 4, stability: 1.0 });
      expect(typeof r.effectiveHalfLife).toBe('number');
      expect(r.effectiveHalfLife).toBeGreaterThan(0);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     shouldArchive() (T226-T230)
  ──────────────────────────────────────────────────────────────── */

  describe('shouldArchive() (T226-T230)', () => {
    it('T226: Constitutional => never archive', () => {
      expect(tierClassifier.shouldArchive({ id: 1, importance_tier: 'constitutional', stability: 0.01, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(false);
    });

    it('T227: Critical => never archive', () => {
      expect(tierClassifier.shouldArchive({ id: 2, importance_tier: 'critical', stability: 0.01, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(false);
    });

    it('T228: Pinned => never archive', () => {
      expect(tierClassifier.shouldArchive({ id: 3, is_pinned: 1, stability: 0.01, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(false);
    });

    it('T229: Old low-stability normal => should archive', () => {
      expect(tierClassifier.shouldArchive({ id: 4, importance_tier: 'normal', stability: 0.01, half_life_days: 0.001, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(true);
    });

    it('T230: Recent high-stability => should NOT archive', () => {
      expect(tierClassifier.shouldArchive({ id: 5, importance_tier: 'normal', stability: 100, created_at: new Date().toISOString() })).toBe(false);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     getStateStats() (T236-T240)
     Production: getStateStats(memories) returns { HOT, WARM, COLD, DORMANT, ARCHIVED, total }
  ──────────────────────────────────────────────────────────────── */

  describe('getStateStats() (T236-T240)', () => {
    it('T236: Empty array => all zeros', () => {
      const s = tierClassifier.getStateStats([]);
      expect(s.HOT).toBe(0);
      expect(s.WARM).toBe(0);
      expect(s.COLD).toBe(0);
      expect(s.DORMANT).toBe(0);
      expect(s.ARCHIVED).toBe(0);
      expect(s.total).toBe(0);
    });

    it('T237: Stats count memories correctly', () => {
      const memories = [
        { id: 1, importance_tier: 'constitutional', stability: 1.0 },
        { id: 2, importance_tier: 'critical', stability: 1.0 },
        { id: 3, importance_tier: 'normal', stability: 100, created_at: new Date().toISOString() },
      ];
      const s = tierClassifier.getStateStats(memories);
      expect(s.total).toBe(3);
      expect(s.HOT).toBeGreaterThanOrEqual(2);
    });

    it('T238: Stats has uppercase keys', () => {
      const memories = [
        { id: 1, importance_tier: 'constitutional', stability: 1.0 },
        { id: 2, importance_tier: 'critical', stability: 1.0 },
        { id: 3, importance_tier: 'normal', stability: 100, created_at: new Date().toISOString() },
      ];
      const s = tierClassifier.getStateStats(memories);
      expect(s).toHaveProperty('HOT');
      expect(s).toHaveProperty('WARM');
      expect(s).toHaveProperty('COLD');
      expect(s).toHaveProperty('DORMANT');
      expect(s).toHaveProperty('ARCHIVED');
    });

    it('T239: total = sum of all states', () => {
      const memories = [
        { id: 1, importance_tier: 'constitutional', stability: 1.0 },
        { id: 2, importance_tier: 'critical', stability: 1.0 },
        { id: 3, importance_tier: 'normal', stability: 100, created_at: new Date().toISOString() },
      ];
      const s = tierClassifier.getStateStats(memories);
      const sum = s.HOT + s.WARM + s.COLD + s.DORMANT + s.ARCHIVED;
      expect(s.total).toBe(sum);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     getStateContent() (T241-T245)
     Production: getStateContent(memories[], targetState, limit) returns { state, memories, count }
  ──────────────────────────────────────────────────────────────── */

  describe('getStateContent() (T241-T245)', () => {
    const memories = [
      { id: 1, importance_tier: 'constitutional', stability: 1.0 },
      { id: 2, importance_tier: 'critical', stability: 1.0 },
      { id: 3, importance_tier: 'normal', stability: 100, created_at: new Date().toISOString() },
    ];

    it('T241: Returns {state, memories, count}', () => {
      const r = tierClassifier.getStateContent(memories, 'HOT');
      expect(r.state).toBe('HOT');
      expect(Array.isArray(r.memories)).toBe(true);
      expect(typeof r.count).toBe('number');
    });

    it('T242: Filters to target state', () => {
      const r = tierClassifier.getStateContent(memories, 'HOT');
      expect(r.count).toBeGreaterThanOrEqual(2);
    });

    it('T243: Respects limit parameter', () => {
      const r = tierClassifier.getStateContent(memories, 'HOT', 1);
      expect(r.count).toBeLessThanOrEqual(1);
    });

    it('T244: Empty result for non-matching state', () => {
      const r = tierClassifier.getStateContent(memories, 'ARCHIVED');
      expect(r.count).toBe(0);
    });

    it('T245: Empty memories => count=0', () => {
      const r = tierClassifier.getStateContent([], 'HOT');
      expect(r.count).toBe(0);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     formatStateResponse() (T246-T250)
     Production: formatStateResponse(memories) returns [{id, title, state, retrievability, specFolder, filePath}]
  ──────────────────────────────────────────────────────────────── */

  describe('formatStateResponse() (T246-T250)', () => {
    const memories = [
      { id: 1, title: 'Test Memory', spec_folder: 'specs/001', file_path: '/test.md', importance_tier: 'constitutional', stability: 1.0 },
      { id: 2, title: 'Another', spec_folder: 'specs/002', file_path: '/other.md', importance_tier: 'normal', stability: 100, created_at: new Date().toISOString() },
    ];

    it('T246: Returns formatted array', () => {
      const r = tierClassifier.formatStateResponse(memories);
      expect(Array.isArray(r)).toBe(true);
      expect(r).toHaveLength(2);
    });

    it('T247: Entry has {id, title, state, retrievability, specFolder, filePath}', () => {
      const r = tierClassifier.formatStateResponse(memories);
      const entry = r[0];
      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('title');
      expect(entry).toHaveProperty('state');
      expect(entry).toHaveProperty('retrievability');
      expect(entry).toHaveProperty('specFolder');
      expect(entry).toHaveProperty('filePath');
    });

    it('T248: State is valid TierState', () => {
      const r = tierClassifier.formatStateResponse(memories);
      const validStates = ['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED'];
      expect(validStates).toContain(r[0].state);
    });

    it('T249: Retrievability in [0, 1]', () => {
      const r = tierClassifier.formatStateResponse(memories);
      expect(typeof r[0].retrievability).toBe('number');
      expect(r[0].retrievability).toBeGreaterThanOrEqual(0);
      expect(r[0].retrievability).toBeLessThanOrEqual(1);
    });

    it('T250: Missing title => "Untitled"', () => {
      const r = tierClassifier.formatStateResponse([{ id: 99, importance_tier: 'constitutional', stability: 1.0 }]);
      expect(r[0].title).toBe('Untitled');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     filterAndLimitByState() (T251-T255)
     Production: filterAndLimitByState(memories, targetState?, limit?)
  ──────────────────────────────────────────────────────────────── */

  describe('filterAndLimitByState() (T251-T255)', () => {
    const memories = [
      { id: 1, importance_tier: 'constitutional', stability: 1.0 },
      { id: 2, importance_tier: 'critical', stability: 1.0 },
      { id: 3, importance_tier: 'normal', stability: 100, created_at: new Date().toISOString() },
    ];

    it('T251: Returns array', () => {
      expect(Array.isArray(tierClassifier.filterAndLimitByState(memories))).toBe(true);
    });

    it('T252: targetState=HOT filters correctly', () => {
      const r = tierClassifier.filterAndLimitByState(memories, 'HOT');
      // _classification is intentionally stripped from returned objects (internal only)
      // Verify filtering works by checking results are returned and don't leak internals
      expect(r.every((m: Record<string, unknown>) => m._classification === undefined)).toBe(true);
      expect(r.length).toBeGreaterThanOrEqual(2);
    });

    it('T253: limit=1 limits results', () => {
      const r = tierClassifier.filterAndLimitByState(memories, null, 1);
      expect(r.length).toBeLessThanOrEqual(1);
    });

    it('T254: Default returns within total limit', () => {
      const r = tierClassifier.filterAndLimitByState(memories);
      expect(r.length).toBeLessThanOrEqual(20);
    });

    it('T255: ARCHIVED filter on HOT memories => empty', () => {
      const r = tierClassifier.filterAndLimitByState(memories, 'ARCHIVED');
      expect(r).toHaveLength(0);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     getEffectiveHalfLife() (T256-T260)
  ──────────────────────────────────────────────────────────────── */

  describe('getEffectiveHalfLife() (T256-T260)', () => {
    it('T256: Constitutional => null (no decay)', () => {
      expect(tierClassifier.getEffectiveHalfLife({ id: 1, importance_tier: 'constitutional' })).toBeNull();
    });

    it('T257: Critical => null (no decay)', () => {
      expect(tierClassifier.getEffectiveHalfLife({ id: 2, importance_tier: 'critical' })).toBeNull();
    });

    it('T258: Explicit half_life_days=30 used', () => {
      expect(tierClassifier.getEffectiveHalfLife({ id: 3, half_life_days: 30 })).toBe(30);
    });

    it('T259: Normal tier => default 60 days', () => {
      expect(tierClassifier.getEffectiveHalfLife({ id: 4, importance_tier: 'normal' })).toBe(60);
    });

    it('T260: null memory => 60 (default)', () => {
      expect(tierClassifier.getEffectiveHalfLife(null)).toBe(60);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     halfLifeToStability() (T261-T263)
  ──────────────────────────────────────────────────────────────── */

  describe('halfLifeToStability() (T261-T263)', () => {
    it('T261: null => infinite stability', () => {
      expect(tierClassifier.halfLifeToStability(null)).toBeGreaterThan(100000);
    });

    it('T262: 60 days => ~4.69 stability (FSRS)', () => {
      // FSRS v4 uses power-law R = (1 + 19/81 * t/S)^-0.5, yielding S = (19/243) * h.
      const r = tierClassifier.halfLifeToStability(60);
      const expected = (19 / 243) * 60; // ~4.691
      expect(r).toBeCloseTo(expected, 2);
    });

    it('T263: 0 => infinite stability', () => {
      expect(tierClassifier.halfLifeToStability(0)).toBeGreaterThan(100000);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Threshold Configuration (T266-T270)
  ──────────────────────────────────────────────────────────────── */

  describe('Threshold Configuration (T266-T270)', () => {
    it('T266: HOT threshold is 0.80', () => {
      expect(tierClassifier.TIER_CONFIG.hotThreshold).toBe(0.80);
    });

    it('T267: WARM threshold is 0.25', () => {
      expect(tierClassifier.TIER_CONFIG.warmThreshold).toBe(0.25);
    });

    it('T268: COLD threshold is 0.05', () => {
      expect(tierClassifier.TIER_CONFIG.coldThreshold).toBe(0.05);
    });

    it('T269: Thresholds ordered: HOT > WARM > COLD', () => {
      const config = tierClassifier.TIER_CONFIG;
      expect(config.hotThreshold).toBeGreaterThan(config.warmThreshold);
      expect(config.warmThreshold).toBeGreaterThan(config.coldThreshold);
    });

    it('T270: Limits: maxHot=5, maxWarm=10', () => {
      expect(tierClassifier.TIER_CONFIG.maxHotMemories).toBe(5);
      expect(tierClassifier.TIER_CONFIG.maxWarmMemories).toBe(10);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     STATE_THRESHOLDS Constants (T094-T099)
  ──────────────────────────────────────────────────────────────── */

  describe('STATE_THRESHOLDS Constants (T094-T099)', () => {
    it('T094: STATE_THRESHOLDS is valid', () => {
      const thresholds = tierClassifier.STATE_THRESHOLDS;
      expect(typeof thresholds.HOT).toBe('number');
      expect(typeof thresholds.WARM).toBe('number');
      expect(typeof thresholds.COLD).toBe('number');
      expect(typeof thresholds.DORMANT).toBe('number');
    });

    it('T095: Threshold values correct', () => {
      const thresholds = tierClassifier.STATE_THRESHOLDS;
      expect(thresholds.HOT).toBe(0.80);
      expect(thresholds.WARM).toBe(0.25);
      expect(thresholds.COLD).toBe(0.05);
      expect(thresholds.DORMANT).toBe(0.02);
    });

    it('T096: ARCHIVED_DAYS_THRESHOLD=90', () => {
      expect(tierClassifier.ARCHIVED_DAYS_THRESHOLD).toBe(90);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Module Exports
  ──────────────────────────────────────────────────────────────── */

  describe('Module Exports', () => {
    const expectedExports = [
      'STATE_THRESHOLDS', 'ARCHIVED_DAYS_THRESHOLD', 'TIER_CONFIG',
      'classifyState', 'calculateRetrievability', 'classifyTier',
      'getEffectiveHalfLife', 'halfLifeToStability',
      'getStateContent', 'filterAndLimitByState', 'formatStateResponse',
      'getStateStats', 'shouldArchive',
    ];

    for (const name of expectedExports) {
      it(`Export: ${name}`, () => {
        expect(tierClassifierModule[name]).toBeDefined();
      });
    }
  });
});
