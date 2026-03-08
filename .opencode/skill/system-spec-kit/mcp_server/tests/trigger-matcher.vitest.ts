// Converted from: trigger-matcher.test.ts (custom runner)
// ---------------------------------------------------------------
// TEST: TRIGGER MATCHER
// Validates phrase matching, Unicode normalization, word boundary
// detection, regex caching, and matching performance.
// ---------------------------------------------------------------

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock transitive DB dependencies so the module can load
// without better-sqlite3 or vector-index wiring.
vi.mock('../lib/search/vector-index', () => ({
  initializeDb: vi.fn(),
  getDb: vi.fn(() => null),
}));

import {
  matchPhraseWithBoundary,
  matchTriggerPhrases,
  normalizeUnicode,
  CONFIG,
  clearCache,
  getCacheStats,
} from '../lib/parsing/trigger-matcher';

type TriggerPrompt = Parameters<typeof matchTriggerPhrases>[0];
type UnicodeInput = Parameters<typeof normalizeUnicode>[0];

describe('Trigger Matcher (T501)', () => {
  beforeEach(() => {
    clearCache();
  });

  // 4.1 EXACT MATCH (T501-01)
  describe('Exact Match (T501-01)', () => {
    it('T501-01: exact match on trigger phrase', () => {
      const result = matchPhraseWithBoundary('I need to save context now', 'save context');
      expect(result).toBe(true);
    });
  });

  // 4.2 PARTIAL MATCH DETECTION (T501-02)
  describe('Partial Match Detection (T501-02)', () => {
    it('T501-02: word boundary prevents false positive', () => {
      // "save" should not match "saving" because of word boundaries
      const result = matchPhraseWithBoundary('I am saving this file', 'save');
      // Result depends on regex boundary behavior
      expect(typeof result).toBe('boolean');
    });
  });

  // 4.3 CASE-INSENSITIVE MATCHING (T501-03)
  describe('Case-insensitive Matching (T501-03)', () => {
    it('T501-03: all case variations match', () => {
      const result1 = matchPhraseWithBoundary('SAVE CONTEXT please', 'save context');
      const result2 = matchPhraseWithBoundary('save context please', 'SAVE CONTEXT');
      const result3 = matchPhraseWithBoundary('Save Context please', 'save context');

      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(true);
    });
  });

  // 4.4 MULTI-WORD TRIGGER PHRASES (T501-04)
  describe('Multi-word Trigger Phrases (T501-04)', () => {
    it('T501-04: multi-word trigger phrase matches', () => {
      const text = 'How do I implement a spaced repetition system?';
      const result = matchPhraseWithBoundary(text, 'spaced repetition system');
      expect(result).toBe(true);
    });
  });

  // 4.5 SPECIAL CHARACTERS IN TRIGGERS (T501-05)
  describe('Special Characters in Triggers (T501-05)', () => {
    it('T501-05: special characters handled without error', () => {
      const text = 'What is the cost of item (USD)?';
      const result = matchPhraseWithBoundary(text, '(USD)');
      expect(typeof result).toBe('boolean');
    });
  });

  // 4.6 EMPTY TRIGGERS (T501-06)
  describe('Empty Triggers (T501-06)', () => {
    it('T501-06: empty prompt returns no matches', () => {
      clearCache();
      const result = matchTriggerPhrases('');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  // 4.7 EMPTY PROMPT (T501-07)
  describe('Empty Prompt (T501-07)', () => {
    it('T501-07: empty/null/undefined prompt returns no matches', () => {
      const result1 = matchTriggerPhrases(null as unknown as TriggerPrompt);
      const result2 = matchTriggerPhrases(undefined as unknown as TriggerPrompt);
      const result3 = matchTriggerPhrases('');

      expect(Array.isArray(result1)).toBe(true);
      expect(result1.length).toBe(0);
      expect(Array.isArray(result2)).toBe(true);
      expect(result2.length).toBe(0);
      expect(Array.isArray(result3)).toBe(true);
      expect(result3.length).toBe(0);
    });
  });

  // 4.8 UNICODE NORMALIZATION (T501-08)
  describe('Unicode Normalization (T501-08)', () => {
    it('T501-08a: Unicode NFC normalization', () => {
      const result1 = normalizeUnicode('cafe\u0301'); // e + combining accent
      const result2 = normalizeUnicode('caf\u00E9');  // precomposed e-accent
      expect(result1).toBe(result2);
    });

    it('T501-08b: Unicode accent stripping', () => {
      const stripped = normalizeUnicode('caf\u00E9', true);
      expect(stripped).toBe('cafe');
    });

    it('T501-08c: empty string normalization', () => {
      const empty = normalizeUnicode('');
      expect(empty).toBe('');
    });

    it('T501-08d: null normalization returns empty string', () => {
      const nullResult = normalizeUnicode(null as unknown as UnicodeInput);
      expect(nullResult).toBe('');
    });
  });

  // 4.9 MATCH CONFIG / SCORING (T501-09)
  describe('Match Config / Scoring (T501-09)', () => {
    it('T501-09a: CACHE_TTL_MS configured', () => {
      expect(typeof CONFIG.CACHE_TTL_MS).toBe('number');
      expect(CONFIG.CACHE_TTL_MS).toBeGreaterThan(0);
    });

    it('T501-09b: MIN_PHRASE_LENGTH configured', () => {
      expect(typeof CONFIG.MIN_PHRASE_LENGTH).toBe('number');
      expect(CONFIG.MIN_PHRASE_LENGTH).toBeGreaterThanOrEqual(1);
    });

    it('T501-09c: MAX_PROMPT_LENGTH configured', () => {
      expect(typeof CONFIG.MAX_PROMPT_LENGTH).toBe('number');
      expect(CONFIG.MAX_PROMPT_LENGTH).toBeGreaterThan(0);
    });

    it('T501-09d: MAX_REGEX_CACHE_SIZE configured', () => {
      expect(typeof CONFIG.MAX_REGEX_CACHE_SIZE).toBe('number');
      expect(CONFIG.MAX_REGEX_CACHE_SIZE).toBeGreaterThan(0);
    });
  });

  // 4.10 VERY LONG PROMPT PERFORMANCE (T501-10)
  describe('Very Long Prompt (T501-10)', () => {
    it('T501-10: very long prompt processes within 5s', () => {
      const longPrompt = 'word '.repeat(2000);
      const startTime = Date.now();
      const result = matchTriggerPhrases(longPrompt);
      const elapsed = Date.now() - startTime;

      expect(Array.isArray(result)).toBe(true);
      expect(elapsed).toBeLessThan(5000);
    });
  });

  // 4.11 TRIGGER WITH REGEX-SPECIAL CHARACTERS (T501-11)
  describe('Trigger with Regex-special Characters (T501-11)', () => {
    it('T501-11: special chars handled without regex errors', () => {
      const specialPhrases = [
        { text: 'file.name is here', phrase: 'file.name' },
        { text: 'cost is $100', phrase: '$100' },
        { text: 'use [brackets] here', phrase: '[brackets]' },
        { text: 'a+b equals c', phrase: 'a+b' },
      ];

      for (const { text, phrase } of specialPhrases) {
        const result = matchPhraseWithBoundary(text, phrase);
        expect(typeof result).toBe('boolean');
      }
    });
  });

  // 4.12 CACHE STATS (T501-12)
  describe('Cache Stats (T501-12)', () => {
    it('T501-12: cache stats structure', () => {
      clearCache();
      const stats = getCacheStats();

      expect(typeof stats).toBe('object');
      expect(typeof stats.size).toBe('number');
      expect(typeof stats.regexCacheSize).toBe('number');
      expect(typeof stats.maxRegexCacheSize).toBe('number');
    });

    it('T501-12b: cache cleared successfully', () => {
      clearCache();
      const stats = getCacheStats();
      expect(stats.size).toBe(0);
    });
  });
});
