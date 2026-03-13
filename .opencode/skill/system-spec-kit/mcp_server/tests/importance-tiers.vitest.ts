import { describe, it, expect } from 'vitest';
import * as mod from '../lib/scoring/importance-tiers';

type ImportanceTier = keyof typeof mod.IMPORTANCE_TIERS;

// TEST: IMPORTANCE TIERS
// Validates tier recognition, ordering, boost values, normalization,
// Comparison, and decay/search behavior per tier.
// Task ID: T504
describe('Importance Tiers (T504)', () => {

  // 4.1 TIER RECOGNITION (T504-01)
  describe('Tier Recognition (T504-01)', () => {
    it('T504-01: All 6 tiers recognized', () => {
      const expectedTiers: ImportanceTier[] = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];
      const allPresent = expectedTiers.every(t => mod.IMPORTANCE_TIERS[t] !== undefined);
      const tierCount = Object.keys(mod.IMPORTANCE_TIERS).length;

      expect(allPresent).toBe(true);
      expect(tierCount).toBe(6);
    });

    it('T504-01b: VALID_TIERS array has 6 entries', () => {
      expect(Array.isArray(mod.VALID_TIERS)).toBe(true);
      expect(mod.VALID_TIERS.length).toBe(6);
    });
  });

  // 4.2 TIER ORDERING (T504-02)
  describe('Tier Ordering (T504-02)', () => {
    it('T504-02: Tier ordering is correct (constitutional > ... > deprecated)', () => {
      const values = {
        constitutional: mod.getTierValue('constitutional'),
        critical: mod.getTierValue('critical'),
        important: mod.getTierValue('important'),
        normal: mod.getTierValue('normal'),
        temporary: mod.getTierValue('temporary'),
        deprecated: mod.getTierValue('deprecated'),
      };

      expect(values.constitutional).toBeGreaterThanOrEqual(values.critical);
      expect(values.critical).toBeGreaterThanOrEqual(values.important);
      expect(values.important).toBeGreaterThanOrEqual(values.normal);
      expect(values.normal).toBeGreaterThanOrEqual(values.temporary);
      expect(values.temporary).toBeGreaterThanOrEqual(values.deprecated);
    });
  });

  // 4.3 TIER BOOST VALUES (T504-03)
  describe('Tier Boost Values (T504-03)', () => {
    it('T504-03: Tier boost values are correct', () => {
      const expectedBoosts: Record<ImportanceTier, number> = {
        constitutional: 3.0,
        critical: 2.0,
        important: 1.5,
        normal: 1.0,
        temporary: 0.5,
        deprecated: 0.0,
      };

      for (const [tier, expectedBoost] of Object.entries(expectedBoosts) as Array<[ImportanceTier, number]>) {
        const config = mod.IMPORTANCE_TIERS[tier];
        expect(config).toBeDefined();
        expect(config.searchBoost).toBe(expectedBoost);
      }
    });

    it('T504-03b: applyTierBoost works correctly', () => {
      const boosted = mod.applyTierBoost(10, 'critical');
      expect(boosted).toBe(20); // 10 * 2.0
    });
  });

  // 4.4 UNKNOWN TIER RETURNS DEFAULT (T504-04)
  describe('Unknown Tier Returns Default (T504-04)', () => {
    it('T504-04a: DEFAULT_TIER is "normal"', () => {
      expect(mod.DEFAULT_TIER).toBe('normal');
    });

    it('T504-04b: Unknown tier returns default config', () => {
      const unknownConfig = mod.getTierConfig('nonexistent_tier');
      const normalConfig = mod.getTierConfig('normal');

      expect(unknownConfig).toBeDefined();
      expect(unknownConfig.value).toBe(normalConfig.value);
    });

    it('T504-04c: Null/undefined tier returns default', () => {
      const normalConfig = mod.getTierConfig('normal');
      const nullConfig = mod.getTierConfig(null);
      const undefConfig = mod.getTierConfig(undefined);

      expect(nullConfig.value).toBe(normalConfig.value);
      expect(undefConfig.value).toBe(normalConfig.value);
    });
  });

  // 4.5 TIER STRING NORMALIZATION (T504-05)
  describe('Tier String Normalization (T504-05)', () => {
    it('T504-05: Tier string normalization (case)', () => {
      const tests: Array<{ input: string | null | undefined; expected: ImportanceTier }> = [
        { input: 'CRITICAL', expected: 'critical' },
        { input: 'Critical', expected: 'critical' },
        { input: 'NORMAL', expected: 'normal' },
        { input: 'Constitutional', expected: 'constitutional' },
        { input: null, expected: 'normal' },
        { input: undefined, expected: 'normal' },
        { input: '', expected: 'normal' },
        { input: 'invalid', expected: 'normal' },
      ];

      for (const { input, expected } of tests) {
        expect(mod.normalizeTier(input)).toBe(expected);
      }
    });
  });

  // 4.6 TIER TRANSITIONS (T504-06)
  describe('Tier Transitions (T504-06)', () => {
    it('T504-06: Tier decay transitions work correctly', () => {
      const decayExpectations: Record<ImportanceTier, boolean> = {
        constitutional: false,
        critical: false,
        important: false,
        normal: true,
        temporary: true,
        deprecated: false,
      };

      for (const [tier, expectedDecay] of Object.entries(decayExpectations)) {
        expect(mod.allowsDecay(tier)).toBe(expectedDecay);
      }
    });

    it('T504-06b: Search exclusion by tier', () => {
      expect(mod.isExcludedFromSearch('deprecated')).toBe(true);
      expect(mod.isExcludedFromSearch('normal')).toBe(false);
    });
  });

  // 4.7 TIER COMPARISON (T504-07)
  describe('Tier Comparison (T504-07)', () => {
    it('T504-07: Tier comparison function', () => {
      const critVsNormal = mod.compareTiers('critical', 'normal');
      const normalVsCrit = mod.compareTiers('normal', 'critical');
      const sameVsSame = mod.compareTiers('normal', 'normal');

      expect(critVsNormal).toBeLessThan(0);
      expect(normalVsCrit).toBeGreaterThan(0);
      expect(sameVsSame).toBe(0);
    });
  });

  // 4.8 TIER VALUE AND MULTIPLIER (T504-08)
  describe('Tier Values (T504-08)', () => {
    it('T504-08: Tier value/multiplier values', () => {
      const expectedValues: Record<ImportanceTier, number> = {
        constitutional: 1.0,
        critical: 1.0,
        important: 0.8,
        normal: 0.5,
        temporary: 0.3,
        deprecated: 0.1,
      };

      for (const [tier, expectedVal] of Object.entries(expectedValues) as Array<[ImportanceTier, number]>) {
        const config = mod.IMPORTANCE_TIERS[tier];
        expect(config).toBeDefined();
        expect(config.value).toBe(expectedVal);
      }
    });

    it('T504-08b: Auto-expire days', () => {
      if (mod.getAutoExpireDays) {
        const tempExpire = mod.getAutoExpireDays('temporary');
        const normalExpire = mod.getAutoExpireDays('normal');

        expect(tempExpire).toBe(7);
        expect(normalExpire).toBeNull();
      }
    });

    it('T504-08c: getTiersByImportance returns sorted array', () => {
      if (mod.getTiersByImportance) {
        const sorted = mod.getTiersByImportance();

        expect(Array.isArray(sorted)).toBe(true);
        expect(sorted.length).toBe(6);
        expect(['constitutional', 'critical']).toContain(sorted[0]);
      }
    });
  });

  // 4.9 DOCUMENT TYPE DEFAULTS (T504-09)
  describe('Document Type Defaults (T504-09)', () => {
    it('T504-09a: Hyphenated and spaced document types normalize correctly', () => {
      expect(mod.getDefaultTierForDocumentType('decision-record')).toBe('important');
      expect(mod.getDefaultTierForDocumentType('implementation-summary')).toBe('normal');
      expect(mod.getDefaultTierForDocumentType('decision record')).toBe('important');
    });

    it('T504-09b: Normalization is case-insensitive and trims whitespace', () => {
      expect(mod.getDefaultTierForDocumentType('  SPEC  ')).toBe('important');
      expect(mod.getDefaultTierForDocumentType('Constitutional')).toBe('constitutional');
    });
  });
});
