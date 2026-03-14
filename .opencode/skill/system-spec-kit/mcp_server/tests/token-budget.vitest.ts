// ───────────────────────────────────────────────────────────────
// 1. TEST — TOKEN BUDGET
// ───────────────────────────────────────────────────────────────
// Verifies token estimation, greedy truncation, single-result
// Summary fallback, overflow logging, and env var configuration.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  estimateTokenCount,
  estimateResultTokens,
  truncateToBudget,
  getTokenBudget,
  DEFAULT_TOKEN_BUDGET,
  SUMMARY_MAX_CHARS,
} from '../lib/search/hybrid-search';

import type {
  HybridSearchResult,
  OverflowLogEntry,
  TruncateToBudgetResult,
} from '../lib/search/hybrid-search';

/** Helper: create a minimal HybridSearchResult with optional content. */
function makeResult(
  overrides: Partial<HybridSearchResult> & { id: number; score: number }
): HybridSearchResult {
  return {
    source: 'test',
    ...overrides,
  };
}

/** Helper: create a result with a large content field. */
function makeLargeResult(id: number, score: number, contentChars: number): HybridSearchResult {
  return makeResult({
    id,
    score,
    title: `Result ${id}`,
    content: 'x'.repeat(contentChars),
  });
}

describe('estimateTokenCount', () => {
  it('returns 0 for empty string', () => {
    expect(estimateTokenCount('')).toBe(0);
  });

  it('estimates tokens as ceil(chars / 4)', () => {
    expect(estimateTokenCount('abcd')).toBe(1); // 4/4 = 1
    expect(estimateTokenCount('abcde')).toBe(2); // 5/4 = 1.25 → 2
    expect(estimateTokenCount('a'.repeat(100))).toBe(25); // 100/4 = 25
    expect(estimateTokenCount('a'.repeat(7))).toBe(2); // 7/4 = 1.75 → 2
  });

  it('handles varying text lengths accurately', () => {
    // Short text
    expect(estimateTokenCount('Hi')).toBe(1); // 2/4 = 0.5 → 1
    // Medium text
    expect(estimateTokenCount('a'.repeat(400))).toBe(100);
    // Long text
    expect(estimateTokenCount('a'.repeat(8000))).toBe(2000);
  });
});

describe('estimateResultTokens', () => {
  it('accounts for key names and string values', () => {
    const result = makeResult({ id: 1, score: 0.9, title: 'Test Result' });
    const tokens = estimateResultTokens(result);
    // Should be non-zero and reasonable
    expect(tokens).toBeGreaterThan(0);
    expect(tokens).toBeLessThan(100);
  });

  it('produces higher estimates for results with content', () => {
    const small = makeResult({ id: 1, score: 0.9, title: 'Small' });
    const large = makeLargeResult(2, 0.8, 4000);
    expect(estimateResultTokens(large)).toBeGreaterThan(estimateResultTokens(small));
  });
});

describe('getTokenBudget', () => {
  const originalEnv = process.env['SPECKIT_TOKEN_BUDGET'];

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env['SPECKIT_TOKEN_BUDGET'] = originalEnv;
    } else {
      delete process.env['SPECKIT_TOKEN_BUDGET'];
    }
  });

  it('returns DEFAULT_TOKEN_BUDGET (2000) when env var is not set', () => {
    delete process.env['SPECKIT_TOKEN_BUDGET'];
    expect(getTokenBudget()).toBe(DEFAULT_TOKEN_BUDGET);
    expect(getTokenBudget()).toBe(2000);
  });

  it('reads budget from SPECKIT_TOKEN_BUDGET env var', () => {
    process.env['SPECKIT_TOKEN_BUDGET'] = '5000';
    expect(getTokenBudget()).toBe(5000);
  });

  it('falls back to default for invalid env var values', () => {
    process.env['SPECKIT_TOKEN_BUDGET'] = 'not-a-number';
    expect(getTokenBudget()).toBe(DEFAULT_TOKEN_BUDGET);

    process.env['SPECKIT_TOKEN_BUDGET'] = '-100';
    expect(getTokenBudget()).toBe(DEFAULT_TOKEN_BUDGET);

    process.env['SPECKIT_TOKEN_BUDGET'] = '0';
    expect(getTokenBudget()).toBe(DEFAULT_TOKEN_BUDGET);
  });
});

describe('truncateToBudget', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns all results when total tokens fit within budget', () => {
    const results = [
      makeResult({ id: 1, score: 0.9, title: 'A' }),
      makeResult({ id: 2, score: 0.8, title: 'B' }),
    ];

    const { results: output, truncated, overflow } = truncateToBudget(results, 10000);

    expect(truncated).toBe(false);
    expect(overflow).toBeUndefined();
    expect(output).toHaveLength(2);
  });

  it('returns empty results without truncation for empty input', () => {
    const { results, truncated, overflow } = truncateToBudget([], 100);

    expect(results).toEqual([]);
    expect(truncated).toBe(false);
    expect(overflow).toBeUndefined();
  });

  it('truncates to highest-scoring results (greedy, not round-robin)', () => {
    // Create results where total exceeds a small budget
    const results = [
      makeLargeResult(1, 0.5, 200),   // ~60 tokens
      makeLargeResult(2, 0.9, 200),   // ~60 tokens
      makeLargeResult(3, 0.7, 200),   // ~60 tokens
      makeLargeResult(4, 0.3, 200),   // ~60 tokens
    ];

    // Budget enough for ~2 results but not all 4
    const budget = 120;
    const { results: output, truncated, overflow } = truncateToBudget(results, budget);

    expect(truncated).toBe(true);
    expect(output.length).toBeLessThan(results.length);
    // Results should be sorted by score descending (greedy highest-first)
    for (let i = 1; i < output.length; i++) {
      expect(output[i - 1]!.score).toBeGreaterThanOrEqual(output[i]!.score);
    }
    // Highest scorer (id=2, score=0.9) must be first
    expect(output[0]!.id).toBe(2);
    // Overflow log must be present
    expect(overflow).toBeDefined();
    expect(overflow!.candidateCount).toBe(4);
    expect(overflow!.truncatedToCount).toBe(output.length);
    expect(overflow!.budgetLimit).toBe(budget);
  });

  it('handles single-result overflow with includeContent=true using summary fallback', () => {
    const bigContent = 'x'.repeat(40000); // ~10000 tokens
    const results = [
      makeResult({ id: 1, score: 0.95, title: 'Big Doc', content: bigContent }),
    ];

    const budget = 200;
    const { results: output, truncated, overflow } = truncateToBudget(
      results,
      budget,
      { includeContent: true, queryId: 'test-q1' }
    );

    expect(truncated).toBe(true);
    expect(output).toHaveLength(1);
    // Content should be replaced with summary
    const content = output[0]!['content'] as string;
    expect(content).toContain('[Summary]');
    expect(content).toContain('Big Doc');
    // Should have _summarized flag
    expect(output[0]!['_summarized']).toBe(true);
    // Summary content should be shorter than original
    expect(content.length).toBeLessThan(bigContent.length);
    // Overflow log
    expect(overflow).toBeDefined();
    expect(overflow!.queryId).toBe('test-q1');
    expect(overflow!.candidateCount).toBe(1);
    expect(overflow!.truncatedToCount).toBe(1);
  });

  it('single-result overflow without includeContent falls back to greedy (keeps result)', () => {
    const bigContent = 'x'.repeat(40000);
    const results = [
      makeResult({ id: 1, score: 0.95, title: 'Big Doc', content: bigContent }),
    ];

    const budget = 200;
    const { results: output, truncated, overflow } = truncateToBudget(
      results,
      budget,
      { includeContent: false }
    );

    expect(truncated).toBe(true);
    expect(output).toHaveLength(1);
    // Content should NOT be summarized (includeContent=false)
    expect(output[0]!['_summarized']).toBeUndefined();
    expect(overflow).toBeDefined();
  });

  it('overflow log entry contains all required fields', () => {
    const results = [
      makeLargeResult(1, 0.9, 4000),
      makeLargeResult(2, 0.8, 4000),
    ];

    const { overflow } = truncateToBudget(results, 100, { queryId: 'eval-test' });

    expect(overflow).toBeDefined();
    const log = overflow as OverflowLogEntry;
    expect(log.queryId).toBe('eval-test');
    expect(log.candidateCount).toBe(2);
    expect(typeof log.totalTokens).toBe('number');
    expect(log.totalTokens).toBeGreaterThan(0);
    expect(log.budgetLimit).toBe(100);
    expect(typeof log.truncatedToCount).toBe('number');
    expect(log.truncatedToCount).toBeLessThanOrEqual(log.candidateCount);
    // Timestamp should be valid ISO string
    expect(new Date(log.timestamp).toISOString()).toBe(log.timestamp);
  });

  it('preserves greedy order even when input is unsorted', () => {
    // Input deliberately out of order
    const results = [
      makeResult({ id: 3, score: 0.3, title: 'Low' }),
      makeResult({ id: 1, score: 0.9, title: 'High' }),
      makeResult({ id: 2, score: 0.6, title: 'Mid' }),
    ];

    const { results: output } = truncateToBudget(results, 10000);

    // Output should be sorted by score descending regardless of input order
    expect(output[0]!.score).toBe(0.9);
    expect(output[1]!.score).toBe(0.6);
    expect(output[2]!.score).toBe(0.3);
  });

  it('uses default budget when budget param is 0 or undefined', () => {
    const results = [makeResult({ id: 1, score: 0.9, title: 'A' })];

    // With undefined budget — should use getTokenBudget()
    const r1 = truncateToBudget(results);
    expect(r1.truncated).toBe(false); // tiny result fits in 2000

    // With 0 budget — should also use default
    const r2 = truncateToBudget(results, 0);
    expect(r2.truncated).toBe(false);
  });
});

/* ───────────────────────────────────────────────────────────────
   CHK-023: adjustedBudget = max(dynamicBudget - (resultCount * 26), 200)
   The formula lives inline in hybrid-search.ts (line ~971).
   We test the formula's math directly since it is not exported as a function.
   ──────────────────────────────────────────────────────────────── */

describe('CHK-023: adjustedBudget formula (header overhead deduction)', () => {
  /**
   * Replicates the inline formula from hybrid-search.ts:
   *   const headerOverhead = resultCount * 26;
   *   const adjustedBudget = Math.max(dynamicBudget - headerOverhead, 200);
   */
  function computeAdjustedBudget(dynamicBudget: number, resultCount: number): number {
    const headerOverhead = resultCount * 26;
    return Math.max(dynamicBudget - headerOverhead, 200);
  }

  it('T1: produces expected values for typical inputs', () => {
    // 2500 budget, 10 results → 2500 - 260 = 2240
    expect(computeAdjustedBudget(2500, 10)).toBe(2240);
    // 4000 budget, 20 results → 4000 - 520 = 3480
    expect(computeAdjustedBudget(4000, 20)).toBe(3480);
    // 1500 budget, 5 results → 1500 - 130 = 1370
    expect(computeAdjustedBudget(1500, 5)).toBe(1370);
  });

  it('T2: budget never goes below 200 (the floor)', () => {
    // 500 budget, 100 results → 500 - 2600 = -2100 → clamped to 200
    expect(computeAdjustedBudget(500, 100)).toBe(200);
    // 200 budget, 1 result → 200 - 26 = 174 → clamped to 200
    expect(computeAdjustedBudget(200, 1)).toBe(200);
    // 0 budget, 0 results → 0 - 0 = 0 → clamped to 200
    expect(computeAdjustedBudget(0, 0)).toBe(200);
  });

  it('T3: large result counts trigger the floor', () => {
    // 4000 budget, 500 results → 4000 - 13000 = -9000 → clamped to 200
    expect(computeAdjustedBudget(4000, 500)).toBe(200);
    // 1500 budget, 200 results → 1500 - 5200 = -3700 → clamped to 200
    expect(computeAdjustedBudget(1500, 200)).toBe(200);
  });

  it('T4: zero results produce no overhead deduction', () => {
    expect(computeAdjustedBudget(2500, 0)).toBe(2500);
    expect(computeAdjustedBudget(4000, 0)).toBe(4000);
  });

  it('T5: truncateToBudget respects the adjusted budget when passed', () => {
    // Simulate what hybrid-search.ts does: compute adjusted budget, pass to truncateToBudget
    const dynamicBudget = 1500;
    const resultCount = 20;
    const adjusted = computeAdjustedBudget(dynamicBudget, resultCount);
    // 1500 - 520 = 980
    expect(adjusted).toBe(980);

    // Create results that exceed 980 tokens when combined.
    const results = [
      makeLargeResult(1, 0.9, 2000),  // ~500 tokens
      makeLargeResult(2, 0.8, 2000),  // ~500 tokens
    ];

    const { truncated } = truncateToBudget(results, adjusted);
    // Two ~500-token results should truncate under 980 budget
    expect(truncated).toBe(true);
  });
});
