// TEST: Feedback Denylist (A2-P2-3)
// Validates the stop-word denylist used to prevent noise injection
// Into learned relevance feedback trigger phrases.
import { describe, it, expect } from 'vitest';
import {
  DENYLIST,
  isOnDenylist,
  getDenylistSize,
} from '../lib/search/feedback-denylist';

describe('Feedback Denylist – getDenylistSize()', () => {
  it('returns a count >= 100 (denylist should contain at least 100 stop-words)', () => {
    const size = getDenylistSize();
    expect(size).toBeGreaterThanOrEqual(100);
  });

  it('matches the underlying DENYLIST set size', () => {
    expect(getDenylistSize()).toBe(DENYLIST.size);
  });
});

describe('Feedback Denylist – isOnDenylist() for stop-words', () => {
  const commonStopWords = ['the', 'is', 'and', 'or', 'a', 'an', 'in', 'of', 'to', 'for'];

  for (const word of commonStopWords) {
    it(`returns true for common English stop-word "${word}"`, () => {
      expect(isOnDenylist(word)).toBe(true);
    });
  }

  const codeStopWords = ['function', 'const', 'import', 'return', 'class', 'async'];

  for (const word of codeStopWords) {
    it(`returns true for code stop-word "${word}"`, () => {
      expect(isOnDenylist(word)).toBe(true);
    });
  }

  const domainStopWords = ['memory', 'session', 'context', 'query', 'search', 'result'];

  for (const word of domainStopWords) {
    it(`returns true for domain stop-word "${word}"`, () => {
      expect(isOnDenylist(word)).toBe(true);
    });
  }
});

describe('Feedback Denylist – isOnDenylist() for technical terms', () => {
  const technicalTerms = ['vector', 'pipeline', 'database', 'embedding', 'reranker', 'checkpoint', 'ablation'];

  for (const term of technicalTerms) {
    it(`returns false for technical term "${term}"`, () => {
      expect(isOnDenylist(term)).toBe(false);
    });
  }
});

describe('Feedback Denylist – Edge Cases', () => {
  it('returns false for empty string', () => {
    expect(isOnDenylist('')).toBe(false);
  });

  it('returns false for whitespace-only string', () => {
    expect(isOnDenylist('   ')).toBe(false);
  });

  it('handles case insensitivity – uppercase stop-word is still denylisted', () => {
    expect(isOnDenylist('THE')).toBe(true);
    expect(isOnDenylist('The')).toBe(true);
    expect(isOnDenylist('AND')).toBe(true);
  });

  it('handles case insensitivity – mixed case stop-word is still denylisted', () => {
    expect(isOnDenylist('FuNcTiOn')).toBe(true);
    expect(isOnDenylist('ConST')).toBe(true);
  });

  it('handles leading/trailing whitespace via trim', () => {
    expect(isOnDenylist('  the  ')).toBe(true);
    expect(isOnDenylist('\tand\n')).toBe(true);
  });

  it('does not false-positive on partial matches', () => {
    // "the" is denylisted but "theorem" should not be
    expect(isOnDenylist('theorem')).toBe(false);
    // "is" is denylisted but "island" should not be
    expect(isOnDenylist('island')).toBe(false);
  });
});
