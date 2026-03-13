// TEST: Signal Vocabulary Expansion
// Validates CORRECTION and PREFERENCE signal detection in
// Trigger-matcher.ts, including boost application and env-flag gating.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock transitive DB dependencies so the module can load
// Without better-sqlite3 or vector-index wiring.
vi.mock('../lib/search/vector-index', () => ({
  initializeDb: vi.fn(),
  getDb: vi.fn(() => null),
}));

import {
  detectSignals,
  applySignalBoosts,
  matchTriggerPhrasesWithStats,
  clearCache,
  CORRECTION_KEYWORDS,
  PREFERENCE_KEYWORDS,
} from '../lib/parsing/trigger-matcher';

describe('Signal Vocabulary (T012)', () => {
  beforeEach(() => {
    clearCache();
    // Ensure flag is off before each test (backward compat default)
    delete process.env.SPECKIT_SIGNAL_VOCAB;
  });

  afterEach(() => {
    delete process.env.SPECKIT_SIGNAL_VOCAB;
  });

  // --- T012-01: CORRECTION signal detected ----------------------
  describe('T012-01: CORRECTION signal detection', () => {
    it('detects "actually" as a CORRECTION signal', () => {
      const signals = detectSignals('actually, I was wrong about that');
      const correction = signals.find(s => s.category === 'correction');
      expect(correction).toBeDefined();
      expect(correction!.keywords).toContain('actually');
      expect(correction!.boost).toBe(0.2);
    });

    it('detects "wait" as a CORRECTION signal', () => {
      const signals = detectSignals('wait, that approach is incorrect');
      const correction = signals.find(s => s.category === 'correction');
      expect(correction).toBeDefined();
      expect(correction!.keywords).toContain('wait');
    });

    it('detects "correction" keyword', () => {
      const signals = detectSignals('correction: the function name is wrong');
      const correction = signals.find(s => s.category === 'correction');
      expect(correction).toBeDefined();
      expect(correction!.keywords).toContain('correction');
    });

    it('detects "not quite" as a CORRECTION signal', () => {
      const signals = detectSignals('not quite, let me explain again');
      const correction = signals.find(s => s.category === 'correction');
      expect(correction).toBeDefined();
      expect(correction!.keywords).toContain('not quite');
    });
  });

  // --- T012-02: PREFERENCE signal detected ----------------------
  describe('T012-02: PREFERENCE signal detection', () => {
    it('detects "prefer" as a PREFERENCE signal', () => {
      const signals = detectSignals('I prefer to always use TypeScript');
      const preference = signals.find(s => s.category === 'preference');
      expect(preference).toBeDefined();
      expect(preference!.keywords).toContain('prefer');
      expect(preference!.boost).toBe(0.1);
    });

    it('detects "always use" as a PREFERENCE signal', () => {
      const signals = detectSignals('always use strict mode in TypeScript');
      const preference = signals.find(s => s.category === 'preference');
      expect(preference).toBeDefined();
      expect(preference!.keywords).toContain('always use');
    });

    it('detects "never use" as a PREFERENCE signal', () => {
      const signals = detectSignals('never use var, only const and let');
      const preference = signals.find(s => s.category === 'preference');
      expect(preference).toBeDefined();
      expect(preference!.keywords).toContain('never use');
    });

    it('detects "I want" as a PREFERENCE signal', () => {
      const signals = detectSignals('I want the function to return a string');
      const preference = signals.find(s => s.category === 'preference');
      expect(preference).toBeDefined();
      expect(preference!.keywords).toContain('i want');
    });

    it('detects "please use" as a PREFERENCE signal', () => {
      const signals = detectSignals('please use snake_case for variable names');
      const preference = signals.find(s => s.category === 'preference');
      expect(preference).toBeDefined();
      expect(preference!.keywords).toContain('please use');
    });
  });

  // --- T012-03: Neutral prompt — no signals detected ------------
  describe('T012-03: No signals for neutral prompt', () => {
    it('returns empty array for a neutral prompt', () => {
      const signals = detectSignals('search for memory context');
      expect(signals).toHaveLength(0);
    });

    it('returns empty array for an empty string', () => {
      const signals = detectSignals('');
      expect(signals).toHaveLength(0);
    });

    it('returns empty array for unrelated question', () => {
      const signals = detectSignals('how does the vector index work?');
      expect(signals).toHaveLength(0);
    });
  });

  // --- T012-04: Multiple signals in a single prompt -------------
  describe('T012-04: Multiple signals in one prompt', () => {
    it('detects both CORRECTION and PREFERENCE in same prompt', () => {
      const signals = detectSignals('actually, I prefer to use ESM imports');
      const categories = signals.map(s => s.category);
      expect(categories).toContain('correction');
      expect(categories).toContain('preference');
      expect(signals.length).toBe(2);
    });

    it('detects multiple keywords within the same CORRECTION signal', () => {
      const signals = detectSignals('wait, actually that was wrong');
      const correction = signals.find(s => s.category === 'correction');
      expect(correction).toBeDefined();
      expect(correction!.keywords.length).toBeGreaterThanOrEqual(2);
    });
  });

  // --- T012-05: Signal boost applied correctly ------------------
  describe('T012-05: Signal boost applied to importanceWeight', () => {
    it('applySignalBoosts increases importanceWeight by correction boost', () => {
      const matches = [
        {
          memoryId: 1,
          specFolder: 'test',
          filePath: '/test.md',
          title: 'Test',
          importanceWeight: 0.5,
          matchedPhrases: ['test phrase'],
        },
      ];
      const signals = detectSignals('actually, I was wrong');
      const boosted = applySignalBoosts(matches, signals);
      expect(boosted[0].importanceWeight).toBeCloseTo(0.7, 5); // 0.5 + 0.2
    });

    it('applySignalBoosts increases importanceWeight by preference boost', () => {
      const matches = [
        {
          memoryId: 1,
          specFolder: 'test',
          filePath: '/test.md',
          title: 'Test',
          importanceWeight: 0.5,
          matchedPhrases: ['test phrase'],
        },
      ];
      const signals = detectSignals('I prefer TypeScript');
      const boosted = applySignalBoosts(matches, signals);
      expect(boosted[0].importanceWeight).toBeCloseTo(0.6, 5); // 0.5 + 0.1
    });

    it('returns unchanged matches when signals array is empty', () => {
      const matches = [
        {
          memoryId: 1,
          specFolder: 'test',
          filePath: '/test.md',
          title: 'Test',
          importanceWeight: 0.5,
          matchedPhrases: ['test phrase'],
        },
      ];
      const boosted = applySignalBoosts(matches, []);
      expect(boosted[0].importanceWeight).toBe(0.5);
    });
  });

  // --- T012-06: importanceWeight capped at 1.0 ------------------
  describe('T012-06: importanceWeight capped at 1.0', () => {
    it('caps importanceWeight at 1.0 for high starting weight with correction boost', () => {
      const matches = [
        {
          memoryId: 1,
          specFolder: 'test',
          filePath: '/test.md',
          title: 'Test',
          importanceWeight: 0.95,
          matchedPhrases: ['test phrase'],
        },
      ];
      const signals = detectSignals('actually, I prefer this approach');
      const boosted = applySignalBoosts(matches, signals);
      expect(boosted[0].importanceWeight).toBe(1.0); // 0.95 + 0.3 capped at 1.0
    });

    it('caps importanceWeight at 1.0 even when already at 1.0', () => {
      const matches = [
        {
          memoryId: 1,
          specFolder: 'test',
          filePath: '/test.md',
          title: 'Test',
          importanceWeight: 1.0,
          matchedPhrases: ['test phrase'],
        },
      ];
      const signals = detectSignals('actually this needs correcting');
      const boosted = applySignalBoosts(matches, signals);
      expect(boosted[0].importanceWeight).toBe(1.0);
    });

    it('does not reduce importanceWeight when boost brings it exactly to 1.0', () => {
      const matches = [
        {
          memoryId: 1,
          specFolder: 'test',
          filePath: '/test.md',
          title: 'Test',
          importanceWeight: 0.8,
          matchedPhrases: ['test phrase'],
        },
      ];
      const signals = detectSignals('actually I prefer this');
      // Correction (0.2) + preference (0.1) = 0.3 boost; 0.8 + 0.3 = 1.1, capped to 1.0
      const boosted = applySignalBoosts(matches, signals);
      expect(boosted[0].importanceWeight).toBe(1.0);
    });
  });

  // --- T012-07: Flag disabled = no boost (backward compat) ------
  describe('T012-07: SPECKIT_SIGNAL_VOCAB flag controls activation', () => {
    it('does NOT apply signal boosts when SPECKIT_SIGNAL_VOCAB is explicitly false', () => {
      process.env.SPECKIT_SIGNAL_VOCAB = 'false';
      const result = matchTriggerPhrasesWithStats('actually I prefer TypeScript');
      // Stats.signals should be undefined when flag is explicitly disabled
      expect(result.stats.signals).toBeUndefined();
    });

    it('applies signal boosts when SPECKIT_SIGNAL_VOCAB is set', () => {
      process.env.SPECKIT_SIGNAL_VOCAB = '1';
      const result = matchTriggerPhrasesWithStats('actually I prefer TypeScript');
      // Stats.signals should be present when flag is on
      expect(result.stats.signals).toBeDefined();
      expect(Array.isArray(result.stats.signals)).toBe(true);
    });

    it('returns same match count with or without flag', () => {
      // With cache empty (db mocked to null), matches will always be []
      delete process.env.SPECKIT_SIGNAL_VOCAB;
      const withoutFlag = matchTriggerPhrasesWithStats('actually I prefer TypeScript');

      process.env.SPECKIT_SIGNAL_VOCAB = '1';
      const withFlag = matchTriggerPhrasesWithStats('actually I prefer TypeScript');

      expect(withoutFlag.matches.length).toBe(withFlag.matches.length);
    });
  });

  // --- T012-08: CORRECTION and PREFERENCE keyword lists exported --
  describe('T012-08: Exported keyword constants', () => {
    it('CORRECTION_KEYWORDS is a non-empty array of strings', () => {
      expect(Array.isArray(CORRECTION_KEYWORDS)).toBe(true);
      expect(CORRECTION_KEYWORDS.length).toBeGreaterThan(0);
      expect(CORRECTION_KEYWORDS.every(k => typeof k === 'string')).toBe(true);
    });

    it('PREFERENCE_KEYWORDS is a non-empty array of strings', () => {
      expect(Array.isArray(PREFERENCE_KEYWORDS)).toBe(true);
      expect(PREFERENCE_KEYWORDS.length).toBeGreaterThan(0);
      expect(PREFERENCE_KEYWORDS.every(k => typeof k === 'string')).toBe(true);
    });

    it('CORRECTION_KEYWORDS includes required spec keywords', () => {
      const required = ['actually', 'wait', 'correction'];
      for (const kw of required) {
        expect(CORRECTION_KEYWORDS).toContain(kw);
      }
    });

    it('PREFERENCE_KEYWORDS includes required spec keywords', () => {
      const required = ['prefer', 'want', 'always use', 'never use'];
      for (const kw of required) {
        expect(PREFERENCE_KEYWORDS).toContain(kw);
      }
    });
  });
});
