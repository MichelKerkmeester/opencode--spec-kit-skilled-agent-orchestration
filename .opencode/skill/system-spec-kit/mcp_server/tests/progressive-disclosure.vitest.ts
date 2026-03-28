// ───────────────────────────────────────────────────────────────
// TEST: D5 Phase C — Progressive Disclosure (REQ-D5-005)
// ───────────────────────────────────────────────────────────────
// Validates summary layer, snippet extraction, cursor creation/resolution,
// progressive response building, and feature flag gating.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  generateSummaryLayer,
  extractSnippets,
  createCursor,
  resolveCursor,
  buildProgressiveResponse,
  isProgressiveDisclosureEnabled,
  clearCursorStore,
  hashQuery,
  encodeCursor,
  decodeCursor,
  classifyByConfidence,
  buildDigest,
  type DisclosureResult,
  type CursorPayload,
  DEFAULT_PAGE_SIZE,
  DEFAULT_CURSOR_TTL_MS,
  SNIPPET_MAX_LENGTH,
} from '../lib/search/progressive-disclosure';

// -- Test Helpers --

function makeResult(overrides: Partial<DisclosureResult> = {}): DisclosureResult {
  return {
    id: 1,
    content: 'This is a test result with some content that can be used for snippets.',
    score: 0.8,
    ...overrides,
  };
}

function makeResults(count: number, opts?: { contentLength?: number }): DisclosureResult[] {
  const contentLength = opts?.contentLength ?? 50;
  return Array.from({ length: count }, (_, i) => makeResult({
    id: i + 1,
    content: 'A'.repeat(contentLength) + ` result ${i + 1}`,
    score: 0.9 - i * 0.05,
    confidence: {
      label: i < 2 ? 'high' : i < 4 ? 'medium' : 'low',
      value: 0.9 - i * 0.1,
    },
  }));
}

// -- Feature Flag --

describe('isProgressiveDisclosureEnabled() — feature flag', () => {
  const ORIGINAL = process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1;

  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1;
    else process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1 = ORIGINAL;
  });

  it('defaults to true when env var is not set (graduated)', () => {
    delete process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1;
    expect(isProgressiveDisclosureEnabled()).toBe(true);
  });

  it('returns true when set to "true"', () => {
    process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1 = 'true';
    expect(isProgressiveDisclosureEnabled()).toBe(true);
  });

  it('returns true when set to "TRUE" (case-insensitive)', () => {
    process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1 = 'TRUE';
    expect(isProgressiveDisclosureEnabled()).toBe(true);
  });

  it('returns false when set to "false"', () => {
    process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1 = 'false';
    expect(isProgressiveDisclosureEnabled()).toBe(false);
  });

  it('returns true for "1" (graduated — any non-false value is ON)', () => {
    process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1 = '1';
    expect(isProgressiveDisclosureEnabled()).toBe(true);
  });
});

// -- Summary Layer --

describe('generateSummaryLayer()', () => {
  it('returns count 0 and "0 results" for empty input', () => {
    const summary = generateSummaryLayer([]);
    expect(summary.count).toBe(0);
    expect(summary.digest).toBe('0 results');
  });

  it('returns correct count for non-empty results', () => {
    const results = makeResults(5);
    const summary = generateSummaryLayer(results);
    expect(summary.count).toBe(5);
  });

  it('produces correct digest with confidence classification', () => {
    const results: DisclosureResult[] = [
      makeResult({ id: 1, confidence: { label: 'high', value: 0.9 } }),
      makeResult({ id: 2, confidence: { label: 'high', value: 0.8 } }),
      makeResult({ id: 3, confidence: { label: 'medium', value: 0.5 } }),
      makeResult({ id: 4, confidence: { label: 'low', value: 0.2 } }),
    ];
    const summary = generateSummaryLayer(results);
    expect(summary.digest).toBe('2 strong, 1 moderate, 1 weak');
  });

  it('classifies results without confidence data as "weak"', () => {
    const results = [makeResult({ id: 1 }), makeResult({ id: 2 })];
    // No confidence property → defaults to low/weak
    const summary = generateSummaryLayer(results);
    expect(summary.digest).toBe('2 weak');
  });

  it('handles all-high results', () => {
    const results: DisclosureResult[] = [
      makeResult({ id: 1, confidence: { label: 'high', value: 0.95 } }),
      makeResult({ id: 2, confidence: { label: 'high', value: 0.85 } }),
    ];
    const summary = generateSummaryLayer(results);
    expect(summary.digest).toBe('2 strong');
    expect(summary.count).toBe(2);
  });
});

// -- classifyByConfidence (internal helper) --

describe('classifyByConfidence()', () => {
  it('counts high, medium, low correctly', () => {
    const results: DisclosureResult[] = [
      makeResult({ id: 1, confidence: { label: 'high', value: 0.9 } }),
      makeResult({ id: 2, confidence: { label: 'medium', value: 0.5 } }),
      makeResult({ id: 3, confidence: { label: 'low', value: 0.2 } }),
      makeResult({ id: 4, confidence: { label: 'low', value: 0.1 } }),
    ];
    const classification = classifyByConfidence(results);
    expect(classification).toEqual({ high: 1, medium: 1, low: 2 });
  });

  it('treats missing confidence as low', () => {
    const results = [makeResult({ id: 1 })];
    const classification = classifyByConfidence(results);
    expect(classification.low).toBe(1);
  });
});

// -- buildDigest (internal helper) --

describe('buildDigest()', () => {
  it('builds comma-separated digest', () => {
    expect(buildDigest({ high: 3, medium: 2, low: 1 })).toBe('3 strong, 2 moderate, 1 weak');
  });

  it('omits zero categories', () => {
    expect(buildDigest({ high: 0, medium: 2, low: 0 })).toBe('2 moderate');
  });

  it('returns "0 results" when all counts are zero', () => {
    expect(buildDigest({ high: 0, medium: 0, low: 0 })).toBe('0 results');
  });
});

// -- Snippet Extraction --

describe('extractSnippets()', () => {
  it('returns empty array for empty input', () => {
    expect(extractSnippets([])).toEqual([]);
  });

  it('truncates content at SNIPPET_MAX_LENGTH and adds "..."', () => {
    const longContent = 'A'.repeat(200);
    const results = [makeResult({ id: 1, content: longContent })];
    const snippets = extractSnippets(results);
    expect(snippets).toHaveLength(1);
    expect(snippets[0].snippet).toBe('A'.repeat(SNIPPET_MAX_LENGTH) + '...');
    expect(snippets[0].snippet.length).toBe(SNIPPET_MAX_LENGTH + 3);
  });

  it('does not truncate content shorter than SNIPPET_MAX_LENGTH', () => {
    const shortContent = 'Short content.';
    const results = [makeResult({ id: 1, content: shortContent })];
    const snippets = extractSnippets(results);
    expect(snippets[0].snippet).toBe(shortContent);
  });

  it('sets detailAvailable=true when content exists', () => {
    const results = [makeResult({ id: 1, content: 'Has content' })];
    const snippets = extractSnippets(results);
    expect(snippets[0].detailAvailable).toBe(true);
  });

  it('sets detailAvailable=false when content is empty', () => {
    const results = [makeResult({ id: 1, content: '' })];
    const snippets = extractSnippets(results);
    expect(snippets[0].detailAvailable).toBe(false);
  });

  it('sets detailAvailable=false when content is undefined', () => {
    const results = [makeResult({ id: 1, content: undefined })];
    const snippets = extractSnippets(results);
    expect(snippets[0].detailAvailable).toBe(false);
  });

  it('converts numeric ID to string in resultId', () => {
    const results = [makeResult({ id: 42 })];
    const snippets = extractSnippets(results);
    expect(snippets[0].resultId).toBe('42');
  });

  it('preserves string ID in resultId', () => {
    const results = [makeResult({ id: 'abc-123' as unknown as number })];
    const snippets = extractSnippets(results);
    expect(snippets[0].resultId).toBe('abc-123');
  });
});

// -- Cursor Creation --

describe('createCursor()', () => {
  beforeEach(() => clearCursorStore());
  afterEach(() => clearCursorStore());

  it('returns null when result set fits within page size', () => {
    const results = makeResults(3);
    const cursor = createCursor(results, 5, 'test query');
    expect(cursor).toBeNull();
  });

  it('returns null when result set equals page size', () => {
    const results = makeResults(5);
    const cursor = createCursor(results, 5, 'test query');
    expect(cursor).toBeNull();
  });

  it('returns cursor info when result set exceeds page size', () => {
    const results = makeResults(10);
    const cursorInfo = createCursor(results, 5, 'test query');
    expect(cursorInfo).not.toBeNull();
    expect(cursorInfo!.cursor).toBeTruthy();
    expect(cursorInfo!.remainingCount).toBe(5);
  });

  it('cursor is valid base64', () => {
    const results = makeResults(10);
    const cursorInfo = createCursor(results, 5, 'test query');
    expect(cursorInfo).not.toBeNull();
    // Should not throw when decoding
    const decoded = Buffer.from(cursorInfo!.cursor, 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded);
    expect(parsed).toHaveProperty('offset');
    expect(parsed).toHaveProperty('queryHash');
    expect(parsed).toHaveProperty('timestamp');
  });

  it('stores scope metadata in cursor payloads when provided', () => {
    const results = makeResults(10);
    const cursorInfo = createCursor(results, 5, 'scoped query', { scopeKey: 'tenant:user' });
    expect(cursorInfo).not.toBeNull();

    const payload = decodeCursor(cursorInfo!.cursor);
    expect(payload?.scopeKey).toBe('tenant:user');
  });

  it('reports correct remaining count', () => {
    const results = makeResults(12);
    const cursorInfo = createCursor(results, 5, 'test query');
    expect(cursorInfo).not.toBeNull();
    expect(cursorInfo!.remainingCount).toBe(7);
  });
});

// -- Cursor Resolution --

describe('resolveCursor()', () => {
  beforeEach(() => clearCursorStore());
  afterEach(() => clearCursorStore());

  it('returns next page of results', () => {
    const results = makeResults(10);
    const cursorInfo = createCursor(results, 5, 'test query');
    expect(cursorInfo).not.toBeNull();

    const resolved = resolveCursor(cursorInfo!.cursor, 5);
    expect(resolved).not.toBeNull();
    expect(resolved!.results).toHaveLength(5);
    // Second page should have IDs 6-10
    expect(resolved!.results[0].id).toBe(6);
    expect(resolved!.results[4].id).toBe(10);
  });

  it('returns null for invalid cursor', () => {
    const resolved = resolveCursor('not-valid-base64!!!');
    expect(resolved).toBeNull();
  });

  it('returns null for expired cursor', () => {
    const results = makeResults(10);
    // Create cursor with very short TTL
    const cursorInfo = createCursor(results, 5, 'test query');
    expect(cursorInfo).not.toBeNull();

    // Decode, modify timestamp to be old, re-encode
    const payload = decodeCursor(cursorInfo!.cursor)!;
    payload.timestamp = Date.now() - (DEFAULT_CURSOR_TTL_MS + 1000);
    const expiredCursor = encodeCursor(payload);

    const resolved = resolveCursor(expiredCursor, 5);
    expect(resolved).toBeNull();
  });

  it('returns continuation cursor when more pages remain', () => {
    const results = makeResults(15);
    const cursorInfo = createCursor(results, 5, 'test query');
    expect(cursorInfo).not.toBeNull();

    const resolved = resolveCursor(cursorInfo!.cursor, 5);
    expect(resolved).not.toBeNull();
    expect(resolved!.continuation).not.toBeNull();
    expect(resolved!.continuation!.remainingCount).toBe(5);
  });

  it('returns null continuation when at the last page', () => {
    const results = makeResults(10);
    const cursorInfo = createCursor(results, 5, 'test query');
    expect(cursorInfo).not.toBeNull();

    const resolved = resolveCursor(cursorInfo!.cursor, 5);
    expect(resolved).not.toBeNull();
    expect(resolved!.continuation).toBeNull();
  });

  it('returns null when cursor query hash not found in store', () => {
    // Manually create a cursor with a hash that has no stored data
    const payload: CursorPayload = {
      offset: 5,
      queryHash: 'nonexistent',
      timestamp: Date.now(),
    };
    const cursor = encodeCursor(payload);
    const resolved = resolveCursor(cursor, 5);
    expect(resolved).toBeNull();
  });

  it('keeps same-query cursors isolated across distinct searches', () => {
    const resultSetA = makeResults(12).map((result, index) => ({
      ...result,
      id: `A${index + 1}`,
    }));
    const resultSetB = makeResults(12).map((result, index) => ({
      ...result,
      id: `B${index + 1}`,
    }));

    const cursorA = createCursor(resultSetA, 5, 'same query');
    const cursorB = createCursor(resultSetB, 5, 'same query');

    expect(cursorA).not.toBeNull();
    expect(cursorB).not.toBeNull();

    const pageA = resolveCursor(cursorA!.cursor, 5);
    const pageB = resolveCursor(cursorB!.cursor, 5);

    expect(pageA?.results[0]?.id).toBe('A6');
    expect(pageB?.results[0]?.id).toBe('B6');
  });

  it('returns null when cursor scope does not match the resuming caller', () => {
    const results = makeResults(10);
    const cursorInfo = createCursor(results, 5, 'scoped query', { scopeKey: 'tenant-a:user-a' });
    expect(cursorInfo).not.toBeNull();

    const resolved = resolveCursor(cursorInfo!.cursor, 5, { scopeKey: 'tenant-b:user-a' });
    expect(resolved).toBeNull();
  });
});

// -- encodeCursor / decodeCursor --

describe('encodeCursor() / decodeCursor()', () => {
  it('round-trips a valid payload', () => {
    const payload: CursorPayload = { offset: 10, queryHash: 'abc123', timestamp: 1700000000000 };
    const encoded = encodeCursor(payload);
    const decoded = decodeCursor(encoded);
    expect(decoded).toEqual(payload);
  });

  it('decodeCursor returns null for malformed JSON', () => {
    const badCursor = Buffer.from('not json', 'utf-8').toString('base64');
    expect(decodeCursor(badCursor)).toBeNull();
  });

  it('decodeCursor returns null for valid JSON with wrong shape', () => {
    const wrongShape = Buffer.from(JSON.stringify({ foo: 'bar' }), 'utf-8').toString('base64');
    expect(decodeCursor(wrongShape)).toBeNull();
  });
});

// -- hashQuery --

describe('hashQuery()', () => {
  it('produces a deterministic hash', () => {
    expect(hashQuery('test query')).toBe(hashQuery('test query'));
  });

  it('produces different hashes for different queries', () => {
    expect(hashQuery('query A')).not.toBe(hashQuery('query B'));
  });

  it('handles empty string', () => {
    const result = hashQuery('');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

// -- Progressive Response Builder --

describe('buildProgressiveResponse()', () => {
  const ORIGINAL = process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1;

  beforeEach(() => clearCursorStore());

  afterEach(() => {
    clearCursorStore();
    if (ORIGINAL === undefined) delete process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1;
    else process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1 = ORIGINAL;
  });

  it('returns empty response for empty results', () => {
    const response = buildProgressiveResponse([]);
    expect(response.summaryLayer.count).toBe(0);
    expect(response.results).toEqual([]);
    expect(response.continuation).toBeNull();
  });

  it('when flag OFF: returns all results as snippets, no cursor', () => {
    process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1 = 'false';
    const results = makeResults(10);
    const response = buildProgressiveResponse(results, 5, 'test');
    // All 10 results returned as snippets (no pagination when flag OFF)
    expect(response.results).toHaveLength(10);
    expect(response.continuation).toBeNull();
    expect(response.summaryLayer.count).toBe(10);
  });

  it('when flag ON: paginates results and provides cursor', () => {
    process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1 = 'true';
    const results = makeResults(10);
    const response = buildProgressiveResponse(results, 5, 'test');
    // Only first page of 5 snippets
    expect(response.results).toHaveLength(5);
    // Summary covers all 10
    expect(response.summaryLayer.count).toBe(10);
    // Continuation cursor present
    expect(response.continuation).not.toBeNull();
    expect(response.continuation!.remainingCount).toBe(5);
  });

  it('when flag ON: no cursor if results fit in one page', () => {
    process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1 = 'true';
    const results = makeResults(3);
    const response = buildProgressiveResponse(results, 5, 'test');
    expect(response.results).toHaveLength(3);
    expect(response.continuation).toBeNull();
  });

  it('uses default page size of 5', () => {
    process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1 = 'true';
    const results = makeResults(8);
    const response = buildProgressiveResponse(results, undefined, 'test');
    expect(response.results).toHaveLength(DEFAULT_PAGE_SIZE);
    expect(response.continuation).not.toBeNull();
    expect(response.continuation!.remainingCount).toBe(3);
  });

  it('full pipeline: build response, then resolve cursor for remaining', () => {
    process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1 = 'true';
    const results = makeResults(12);
    const response = buildProgressiveResponse(results, 5, 'full pipeline test');

    // First page
    expect(response.results).toHaveLength(5);
    expect(response.continuation).not.toBeNull();

    // Resolve cursor for second page
    const page2 = resolveCursor(response.continuation!.cursor, 5);
    expect(page2).not.toBeNull();
    expect(page2!.results).toHaveLength(5);

    // Resolve cursor for third page (only 2 remaining)
    expect(page2!.continuation).not.toBeNull();
    const page3 = resolveCursor(page2!.continuation!.cursor, 5);
    expect(page3).not.toBeNull();
    expect(page3!.results).toHaveLength(2);
    expect(page3!.continuation).toBeNull();
  });

  it('passes cursor scope metadata through the progressive response builder', () => {
    process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1 = 'true';
    const results = makeResults(10);
    const response = buildProgressiveResponse(results, 5, 'scoped progressive response', {
      scopeKey: 'tenant-a:user-a',
    });

    expect(response.continuation).not.toBeNull();
    const resolved = resolveCursor(response.continuation!.cursor, 5, { scopeKey: 'tenant-a:user-a' });
    const rejected = resolveCursor(response.continuation!.cursor, 5, { scopeKey: 'tenant-b:user-a' });

    expect(resolved?.results).toHaveLength(5);
    expect(rejected).toBeNull();
  });
});

// -- Constants --

describe('constants', () => {
  it('DEFAULT_PAGE_SIZE is 5', () => {
    expect(DEFAULT_PAGE_SIZE).toBe(5);
  });

  it('DEFAULT_CURSOR_TTL_MS is 5 minutes', () => {
    expect(DEFAULT_CURSOR_TTL_MS).toBe(5 * 60 * 1000);
  });

  it('SNIPPET_MAX_LENGTH is 100', () => {
    expect(SNIPPET_MAX_LENGTH).toBe(100);
  });
});
