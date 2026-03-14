// ───────────────────────────────────────────────────────────────
// 1. SEARCH RESULTS FORMAT VITEST
// ───────────────────────────────────────────────────────────────
// Converted from: search-results-format.test.ts (custom runner)
import { describe, it, expect } from 'vitest';
import {
  safeJsonParse,
  validateFilePathLocal,
  formatSearchResults,
  type MemoryResultEnvelope,
} from '../formatters/search-results';
import { formatAgeString } from '../lib/utils/format-helpers';
import type { MCPEnvelope, MCPResponse } from '../lib/response/envelope';
import path from 'path';

/* ==================================================================
   Helper: Parse MCP response envelope
================================================================== */

interface SearchResultsResponseData {
  count: number;
  results: MemoryResultEnvelope[];
  constitutionalCount?: number;
  searchType?: string;
  evidenceGapWarning?: string;
  retrievalTrace?: unknown;
  appliedBoosts?: unknown;
  graphContribution?: unknown;
  myExtra?: string;
}

type SearchResultsEnvelope = MCPEnvelope<SearchResultsResponseData>;

function parseEnvelope(response: MCPResponse): SearchResultsEnvelope {
  expect(response.content).toBeDefined();
  expect(Array.isArray(response.content)).toBe(true);
  expect(response.content.length).toBeGreaterThan(0);
  const firstContent = response.content[0];
  expect(firstContent?.type).toBe('text');
  if (firstContent?.type !== 'text') {
    throw new Error('Expected text MCP content');
  }
  return JSON.parse(firstContent.text) as SearchResultsEnvelope;
}

/* ==================================================================
   SECTION A: safeJsonParse
================================================================== */

describe('safeJsonParse', () => {
  it('A1: Parses valid JSON object', () => {
    const result = safeJsonParse('{"key":"value"}', {});
    expect(result).toEqual({ key: 'value' });
  });

  it('A2: Parses valid JSON array', () => {
    const result = safeJsonParse('["a","b","c"]', []);
    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('A3: Parses valid JSON number', () => {
    const result = safeJsonParse('42', 0);
    expect(result).toBe(42);
  });

  it('A4: Invalid JSON returns fallback', () => {
    const result = safeJsonParse('{not-json}', 'fallback');
    expect(result).toBe('fallback');
  });

  it('A5: Empty string returns fallback', () => {
    const result = safeJsonParse('', 'default');
    expect(result).toBe('default');
  });

  it('A6: null input returns fallback', () => {
    const result = safeJsonParse(null, []);
    expect(result).toEqual([]);
  });

  it('A7: undefined input returns fallback', () => {
    const result = safeJsonParse(undefined, { x: 1 });
    expect(result).toEqual({ x: 1 });
  });

  it('A8: Truncated JSON returns fallback', () => {
    const result = safeJsonParse('{"key": "val', 'oops');
    expect(result).toBe('oops');
  });
});

/* ==================================================================
   SECTION B: validateFilePathLocal
================================================================== */

describe('validateFilePathLocal', () => {
  it('B1: Rejects path traversal (..)', () => {
    expect(() => validateFilePathLocal('/etc/../passwd')).toThrow();
  });

  it('B2: Rejects deep path traversal', () => {
    expect(() => validateFilePathLocal('/home/user/../../../etc/shadow')).toThrow();
  });

  it('B3: Rejects path outside allowed dirs', () => {
    expect(() => validateFilePathLocal('/tmp/some-random-file.txt')).toThrow();
  });

  it('B4: Accepts valid path within CWD', () => {
    const testPath = path.join(process.cwd(), 'package.json');
    try {
      const result = validateFilePathLocal(testPath);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    } catch (e: unknown) {
      // If CWD is not in ALLOWED_BASE_PATHS, this may throw — that's acceptable
      const message = e instanceof Error ? e.message : String(e);
      expect(message).toContain('Access denied');
    }
  });

  it('B5: Rejects null byte injection', () => {
    expect(() => validateFilePathLocal('/valid/path\0/evil')).toThrow();
  });

  it('B6: Rejects traversal from allowed base', () => {
    expect(() => validateFilePathLocal(path.join(process.cwd(), 'specs/../../../etc/passwd'))).toThrow();
  });
});

/* ==================================================================
   SECTION C: formatSearchResults
================================================================== */

describe('formatSearchResults', () => {
  it('C1: null results returns empty envelope', async () => {
    const res = await formatSearchResults(null, 'semantic');
    const envelope = parseEnvelope(res);
    expect(envelope.data.count).toBe(0);
    expect(envelope.summary.toLowerCase()).toContain('no');
  });

  it('C2: Empty array returns empty envelope', async () => {
    const res = await formatSearchResults([], 'trigger');
    const envelope = parseEnvelope(res);
    expect(envelope.data.count).toBe(0);
    expect(envelope.data.results).toEqual([]);
  });

  it('C2b: Empty array preserves extraData payload', async () => {
    const res = await formatSearchResults([], 'semantic', false, null, null, null, {
      retrievalTrace: { stages: [{ stage: 'routing', metadata: { channel: 'vector' } }] },
      evidenceGapWarning: 'No supporting evidence found',
    });
    const envelope = parseEnvelope(res);
    expect(envelope.data.evidenceGapWarning).toBe('No supporting evidence found');
    expect(envelope.data.retrievalTrace).toEqual({
      stages: [{ stage: 'routing', metadata: { channel: 'vector' } }],
    });
  });

  it('C3: Single result maps fields correctly', async () => {
    const mockResults = [{
      id: 1,
      spec_folder: 'specs/001-test',
      file_path: '/test/file.md',
      title: 'Test Memory',
      similarity: 85.5,
      isConstitutional: false,
      importance_tier: 'normal',
      triggerPhrases: '["hello","world"]',
      created_at: '2025-01-01T00:00:00Z'
    }];
    const res = await formatSearchResults(mockResults, 'semantic');
    const envelope = parseEnvelope(res);
    expect(envelope.data.count).toBe(1);
    expect(envelope.data.results[0].id).toBe(1);
    expect(envelope.data.results[0].specFolder).toBe('specs/001-test');
    expect(envelope.data.results[0].title).toBe('Test Memory');
    expect(envelope.data.results[0].similarity).toBe(85.5);
    expect(envelope.data.results[0].isConstitutional).toBe(false);
  });

  it('C4: triggerPhrases parsed from JSON string', async () => {
    const mockResults = [{
      id: 2,
      spec_folder: 'specs/002-test',
      file_path: '/test/file2.md',
      title: null,
      triggerPhrases: '["phrase1","phrase2"]'
    }];
    const res = await formatSearchResults(mockResults, 'semantic');
    const envelope = parseEnvelope(res);
    expect(envelope.data.results[0].triggerPhrases).toEqual(['phrase1', 'phrase2']);
  });

  it('C5: triggerPhrases as array preserved', async () => {
    const mockResults = [{
      id: 3,
      spec_folder: 'specs/003-test',
      file_path: '/test/file3.md',
      title: 'Array Triggers',
      triggerPhrases: ['already', 'an', 'array']
    }];
    const res = await formatSearchResults(mockResults, 'semantic');
    const envelope = parseEnvelope(res);
    expect(envelope.data.results[0].triggerPhrases).toEqual(['already', 'an', 'array']);
  });

  it('C6: Constitutional results counted in summary', async () => {
    const mockResults = [
      { id: 10, spec_folder: 's1', file_path: '/f1.md', title: 'A', isConstitutional: true },
      { id: 11, spec_folder: 's2', file_path: '/f2.md', title: 'B', isConstitutional: false },
      { id: 12, spec_folder: 's3', file_path: '/f3.md', title: 'C', isConstitutional: true },
    ];
    const res = await formatSearchResults(mockResults, 'semantic');
    const envelope = parseEnvelope(res);
    expect(envelope.data.constitutionalCount).toBe(2);
    expect(envelope.data.count).toBe(3);
    expect(envelope.summary).toContain('2 constitutional');
  });

  it('C7: averageSimilarity used as fallback similarity', async () => {
    const mockResults = [{
      id: 20,
      spec_folder: 'specs/020',
      file_path: '/f.md',
      title: 'Multi-concept',
      averageSimilarity: 72.3,
    }];
    const res = await formatSearchResults(mockResults, 'multi-concept');
    const envelope = parseEnvelope(res);
    expect(envelope.data.results[0].similarity).toBe(72.3);
  });

  it('C8: Response is valid MCP envelope structure', async () => {
    const mockResults = [{ id: 30, spec_folder: 's', file_path: '/f.md', title: 'T' }];
    const res = await formatSearchResults(mockResults, 'semantic');
    expect(Array.isArray(res.content)).toBe(true);
    expect(res.content[0].type).toBe('text');
    expect(typeof res.content[0].text).toBe('string');
    expect(res.isError).toBe(false);
  });

  it('C9: Hints suggest includeContent when content not requested', async () => {
    const mockResults = [{ id: 31, spec_folder: 's', file_path: '/f.md', title: 'T' }];
    const res = await formatSearchResults(mockResults, 'semantic', false);
    const envelope = parseEnvelope(res);
    const hasHint = envelope.hints.some((h: string) => h.toLowerCase().includes('includecontent'));
    expect(hasHint).toBe(true);
  });

  it('C10: Empty response includes search-broadening hints', async () => {
    const res = await formatSearchResults([], 'semantic');
    const envelope = parseEnvelope(res);
    expect(envelope.hints.length).toBeGreaterThan(0);
    const hasBroadenHint = envelope.hints.some((h: string) => h.toLowerCase().includes('broaden'));
    expect(hasBroadenHint).toBe(true);
  });

  it('C10b: Empty response preserves extraData for trace-aware callers', async () => {
    const res = await formatSearchResults([], 'semantic', false, null, null, null, {
      retrievalTrace: { stages: [{ stage: 'router' }] },
      appliedBoosts: { session: true },
    });
    const envelope = parseEnvelope(res);
    expect(envelope.data.retrievalTrace).toEqual({ stages: [{ stage: 'router' }] });
    expect(envelope.data.appliedBoosts).toEqual({ session: true });
  });

  it('C10c: includeTrace preserves graph contribution details and top-level graph metadata', async () => {
    const mockResults = [{
      id: 41,
      spec_folder: 'specs/041-test',
      file_path: '/test/file41.md',
      title: 'Graph Trace',
      score: 0.63,
      graphContribution: {
        sources: ['graph-signals'],
        totalDelta: 0.03,
        injected: false,
        raw: 2,
        normalized: 1,
        appliedBonus: 0.03,
        capApplied: true,
        rolloutState: 'bounded_runtime',
      },
    }];

    const res = await formatSearchResults(
      mockResults,
      'semantic',
      false,
      null,
      null,
      null,
      {
        graphContribution: { rolloutState: 'bounded_runtime', totalGraphInjected: 1 },
      },
      true,
    );

    const envelope = parseEnvelope(res);
    expect((envelope.data.graphContribution as Record<string, unknown>).rolloutState).toBe('bounded_runtime');
    expect(envelope.data.results[0].trace?.graphContribution).toEqual({
      sources: ['graph-signals'],
      totalDelta: 0.03,
      injected: false,
      raw: 2,
      normalized: 1,
      appliedBonus: 0.03,
      capApplied: true,
      rolloutState: 'bounded_runtime',
    });
  });

  it('C10d: includeTrace=false omits per-result graph trace even when raw results carry graphContribution', async () => {
    const mockResults = [{
      id: 42,
      spec_folder: 'specs/042-test',
      file_path: '/test/file42.md',
      title: 'No Trace',
      graphContribution: {
        sources: ['graph-signals'],
        totalDelta: 0.03,
        raw: 1,
        normalized: 0.5,
        appliedBonus: 0.015,
        capApplied: false,
        rolloutState: 'trace_only',
      },
    }];

    const res = await formatSearchResults(mockResults, 'semantic', false, null, null, null, {}, false);
    const envelope = parseEnvelope(res);
    expect(envelope.data.results[0].trace).toBeUndefined();
  });

  it('C10e: malformed graphContribution degrades safely instead of throwing', async () => {
    const mockResults = [{
      id: 43,
      spec_folder: 'specs/043-test',
      file_path: '/test/file43.md',
      title: 'Malformed Graph Trace',
      graphContribution: {
        sources: 'not-an-array',
        totalDelta: 'bad',
        raw: 'bad',
        normalized: 0.25,
        appliedBonus: 'bad',
        capApplied: 'bad',
        rolloutState: 99,
      },
    }];

    const res = await formatSearchResults(mockResults, 'semantic', false, null, null, null, {}, true);
    const envelope = parseEnvelope(res);
    expect(envelope.data.results[0].trace?.graphContribution).toEqual({
      sources: [],
      totalDelta: 0,
      injected: false,
      raw: undefined,
      normalized: 0.25,
      appliedBonus: undefined,
      capApplied: false,
      rolloutState: null,
    });
  });

  it('C11: extraData merged into response data', async () => {
    const mockResults = [{ id: 40, spec_folder: 's', file_path: '/f.md', title: 'T' }];
    const res = await formatSearchResults(mockResults, 'semantic', false, null, null, null, { myExtra: 'data' }, true);
    const envelope = parseEnvelope(res);
    expect(envelope.data.myExtra).toBe('data');
  });

  it('C12: searchType propagated to response data', async () => {
    const mockResults = [{ id: 41, spec_folder: 's', file_path: '/f.md', title: 'T' }];
    const res = await formatSearchResults(mockResults, 'multi-concept');
    const envelope = parseEnvelope(res);
    expect(envelope.data.searchType).toBe('multi-concept');
  });

  it('C13: Response meta.tool is memory_search', async () => {
    const mockResults = [{ id: 42, spec_folder: 's', file_path: '/f.md', title: 'T' }];
    const res = await formatSearchResults(mockResults, 'semantic');
    const envelope = parseEnvelope(res);
    expect(envelope.meta.tool).toBe('memory_search');
  });

  it('C14: Invalid file path records contentError', async () => {
    const mockResults = [{
      id: 50,
      spec_folder: 's',
      file_path: '/nonexistent/path/that/does/not/exist.md',
      title: 'Bad Path',
    }];
    const res = await formatSearchResults(mockResults, 'semantic', true);
    const envelope = parseEnvelope(res);
    const result = envelope.data.results[0];
    expect(result.content).toBe(null);
    expect(typeof result.contentError).toBe('string');
    expect(result.contentError?.length ?? 0).toBeGreaterThan(0);
  });

  it('C15: precomputed chunk content bypasses file read', async () => {
    const mockResults = [{
      id: 51,
      spec_folder: 'specs/010-test',
      file_path: '/nonexistent/path.md',
      title: 'Chunk Parent',
      isChunk: true,
      parentId: 999,
      chunkIndex: 0,
      chunkLabel: 'intro',
      chunkCount: 3,
      contentSource: 'reassembled_chunks',
      precomputedContent: 'Reassembled content from chunks.',
    }];
    const res = await formatSearchResults(mockResults, 'semantic', true);
    const envelope = parseEnvelope(res);
    const result = envelope.data.results[0];
    expect(result.content).toBe('Reassembled content from chunks.');
    expect(result.contentError).toBeUndefined();
    expect(result.isChunk).toBe(true);
    expect(result.parentId).toBe(999);
    expect(result.chunkCount).toBe(3);
    expect(result.contentSource).toBe('reassembled_chunks');
  });

  it('C16: trace.channelsUsed includes row-level provenance and attribution matches', async () => {
    const mockResults = [{
      id: 52,
      spec_folder: 'specs/010-test',
      file_path: '/tmp/mock.md',
      title: 'Trace Parent',
      source: 'vector',
      sources: ['vector', 'fts'],
      traceMetadata: {
        attribution: {
          trigger: [52],
          graph: [999],
        },
      },
    }];
    const res = await formatSearchResults(
      mockResults,
      'semantic',
      false,
      null,
      null,
      null,
      {},
      true,
    );
    const envelope = parseEnvelope(res);
    const trace = envelope.data.results[0]?.trace;
    expect(trace).toBeDefined();
    expect(trace?.channelsUsed).toEqual(expect.arrayContaining(['vector', 'fts', 'trigger']));
    expect(trace?.channelsUsed).not.toContain('graph');
  });

  it('C17: trace.queryComplexity falls back to row traceMetadata when stages omit it', async () => {
    const mockResults = [{
      id: 53,
      spec_folder: 'specs/011-test',
      file_path: '/tmp/query-complexity.md',
      title: 'Trace Complexity',
      traceMetadata: {
        queryComplexity: 'moderate',
      },
    }];
    const res = await formatSearchResults(mockResults, 'semantic', false, null, null, null, {}, true);
    const envelope = parseEnvelope(res);
    expect(envelope.data.results[0]?.trace?.queryComplexity).toBe('moderate');
  });
});

/* ==================================================================
   SECTION D: formatAgeString
================================================================== */

describe('formatAgeString', () => {
  it('D1: null returns "never"', () => {
    expect(formatAgeString(null)).toBe('never');
  });

  it('D2: Empty string returns "never"', () => {
    expect(formatAgeString('')).toBe('never');
  });

  it('D3: Current date returns "today"', () => {
    const now = new Date().toISOString();
    expect(formatAgeString(now)).toBe('today');
  });

  it('D4: 5 hours ago returns "today"', () => {
    const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString();
    expect(formatAgeString(fiveHoursAgo)).toBe('today');
  });

  it('D5: 1.5 days ago returns "yesterday"', () => {
    const oneDayAgo = new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatAgeString(oneDayAgo)).toBe('yesterday');
  });

  it('D6: 3 days ago returns "3 days ago"', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatAgeString(threeDaysAgo)).toBe('3 days ago');
  });

  it('D7: 10 days ago returns "1 week ago"', () => {
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatAgeString(tenDaysAgo)).toBe('1 week ago');
  });

  it('D8: 20 days ago returns "2 weeks ago"', () => {
    const twentyDaysAgo = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatAgeString(twentyDaysAgo)).toBe('2 weeks ago');
  });

  it('D9: 45 days ago returns "1 month ago"', () => {
    const fortyFiveDaysAgo = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatAgeString(fortyFiveDaysAgo)).toBe('1 month ago');
  });

  it('D10: 90 days ago returns "3 months ago"', () => {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatAgeString(ninetyDaysAgo)).toBe('3 months ago');
  });

  it('D11: Very old date returns months-based string', () => {
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
    const result = formatAgeString(oneYearAgo);
    expect(result).toContain('month');
  });

  it('D12: Future date returns "today" (negative age < 1)', () => {
    const futureDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatAgeString(futureDate)).toBe('today');
  });

  it('D13: Invalid date string returns a string (no crash)', () => {
    const result = formatAgeString('not-a-date');
    expect(typeof result).toBe('string');
  });
});
