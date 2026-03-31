// ───────────────────────────────────────────────────────────────
// TEST: Hook Shared Utilities
// ───────────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest';
import {
  formatHookOutput,
  truncateToTokenBudget,
  HOOK_TIMEOUT_MS,
  COMPACTION_TOKEN_BUDGET,
  SESSION_PRIME_TOKEN_BUDGET,
} from '../hooks/claude/shared.js';

describe('shared hook utilities', () => {
  describe('constants', () => {
    it('HOOK_TIMEOUT_MS is under 2s', () => {
      expect(HOOK_TIMEOUT_MS).toBeLessThan(2000);
    });

    it('COMPACTION_TOKEN_BUDGET is 4000', () => {
      expect(COMPACTION_TOKEN_BUDGET).toBe(4000);
    });

    it('SESSION_PRIME_TOKEN_BUDGET is 2000', () => {
      expect(SESSION_PRIME_TOKEN_BUDGET).toBe(2000);
    });
  });

  describe('formatHookOutput', () => {
    it('formats sections with headers', () => {
      const result = formatHookOutput([
        { title: 'Section A', content: 'Content A' },
        { title: 'Section B', content: 'Content B' },
      ]);
      expect(result).toContain('## Section A');
      expect(result).toContain('Content A');
      expect(result).toContain('## Section B');
    });

    it('filters empty sections', () => {
      const result = formatHookOutput([
        { title: 'Full', content: 'Has content' },
        { title: 'Empty', content: '   ' },
      ]);
      expect(result).toContain('Full');
      expect(result).not.toContain('Empty');
    });
  });

  describe('truncateToTokenBudget', () => {
    it('returns text unchanged if within budget', () => {
      const text = 'short text';
      expect(truncateToTokenBudget(text, 1000)).toBe(text);
    });

    it('truncates text exceeding budget', () => {
      const text = 'a'.repeat(20000); // ~5000 tokens
      const result = truncateToTokenBudget(text, 100);
      expect(result.length).toBeLessThan(text.length);
      expect(result).toContain('[...truncated');
    });

    it('handles empty text', () => {
      expect(truncateToTokenBudget('', 1000)).toBe('');
    });
  });
});
