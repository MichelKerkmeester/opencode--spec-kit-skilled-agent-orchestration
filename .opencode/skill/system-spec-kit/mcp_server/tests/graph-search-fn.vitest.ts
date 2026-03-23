// TEST: UNIFIED GRAPH SEARCH FUNCTION
// Causal edge channel only
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createUnifiedGraphSearchFn } from '../lib/search/graph-search-fn';

const mockAll = vi.fn();
const mockGet = vi.fn();
const mockStatement = { all: mockAll, get: mockGet };
const mockPrepare = vi.fn().mockReturnValue(mockStatement);
const mockDb = {
  prepare: mockPrepare,
} as unknown as import('better-sqlite3').Database;

function makeCausalRow(
  overrides: Partial<{
    id: string;
    source_id: string;
    target_id: string;
    relation: string;
    strength: number;
    fts_score: number;
  }> = {}
) {
  return {
    id: 'edge-001',
    source_id: '10',
    target_id: '20',
    relation: 'causes',
    strength: 0.85,
    fts_score: 1,
    ...overrides,
  };
}

describe('createUnifiedGraphSearchFn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: FTS table not available so fallback path is used
    mockGet.mockReturnValue(undefined);
    mockPrepare.mockReturnValue(mockStatement);
  });

  // G1 FIX: numeric ID correctness
  it('G1: returns numeric IDs (source_id) — not string-prefixed mem:edgeId', () => {
    mockAll.mockReturnValue([makeCausalRow({ source_id: '42', target_id: '99', id: 'edge-001' })]);

    const searchFn = createUnifiedGraphSearchFn(mockDb);
    const results = searchFn('memory', { limit: 5 });

    // Must have at least one result with numeric source_id
    const sourceResult = results.find(r => r['id'] === 42);
    expect(sourceResult).toBeDefined();
    expect(typeof sourceResult!['id']).toBe('number');
  });

  it('G1: returns numeric target_id as a separate candidate', () => {
    mockAll.mockReturnValue([makeCausalRow({ source_id: '42', target_id: '99', id: 'edge-001' })]);

    const searchFn = createUnifiedGraphSearchFn(mockDb);
    const results = searchFn('memory', { limit: 5 });

    const targetResult = results.find(r => r['id'] === 99);
    expect(targetResult).toBeDefined();
    expect(typeof targetResult!['id']).toBe('number');
  });

  it('G1: never returns a string-prefixed id like mem:edge-001', () => {
    mockAll.mockReturnValue([makeCausalRow({ source_id: '10', target_id: '20', id: 'edge-001' })]);

    const searchFn = createUnifiedGraphSearchFn(mockDb);
    const results = searchFn('memory', { limit: 5 });

    for (const r of results) {
      expect(typeof r['id']).toBe('number');
      expect(String(r['id'])).not.toMatch(/^mem:/);
    }
  });

  it('G1: skips candidates where source_id or target_id is non-numeric', () => {
    mockAll.mockReturnValue([
      makeCausalRow({ source_id: 'non-numeric-alpha', target_id: 'also-not-a-number', id: 'edge-bad' }),
    ]);

    const searchFn = createUnifiedGraphSearchFn(mockDb);
    const results = searchFn('memory', { limit: 5 });

    // Neither source nor target is numeric — no results expected
    expect(results).toHaveLength(0);
  });

  it('G1: deduplicates when source_id equals target_id (same numeric value)', () => {
    mockAll.mockReturnValue([
      makeCausalRow({ source_id: '55', target_id: '55', id: 'edge-self' }),
    ]);

    const searchFn = createUnifiedGraphSearchFn(mockDb);
    const results = searchFn('memory', { limit: 10 });

    // Source and target are the same node — should produce only one candidate
    const ids = results.map(r => r['id']);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length); // no duplicate entries
    expect(results.filter(r => r['id'] === 55)).toHaveLength(1);
  });

  it('G1: both source and target IDs from multiple rows are all numeric', () => {
    mockAll.mockReturnValue([
      makeCausalRow({ source_id: '1', target_id: '2', strength: 0.9 }),
      makeCausalRow({ source_id: '3', target_id: '4', strength: 0.7 }),
    ]);

    const searchFn = createUnifiedGraphSearchFn(mockDb);
    const results = searchFn('memory', { limit: 20 });

    // Expect 4 candidates: 1, 2, 3, 4
    expect(results).toHaveLength(4);
    for (const r of results) {
      expect(typeof r['id']).toBe('number');
    }
    const ids = results.map(r => r['id']).sort((a, b) => (a as number) - (b as number));
    expect(ids).toEqual([1, 2, 3, 4]);
  });

  // Existing behaviour: correct source, title, relation preserved
  it('sets source field to "graph" on all results', () => {
    mockAll.mockReturnValue([makeCausalRow({ source_id: '10', target_id: '20' })]);

    const searchFn = createUnifiedGraphSearchFn(mockDb);
    const results = searchFn('memory', { limit: 5 });

    for (const r of results) {
      expect(r['source']).toBe('graph');
    }
  });

  it('preserves relation and sourceId/targetId on candidates', () => {
    mockAll.mockReturnValue([makeCausalRow({ source_id: '10', target_id: '20', relation: 'causes' })]);

    const searchFn = createUnifiedGraphSearchFn(mockDb);
    const results = searchFn('memory', { limit: 5 });

    for (const r of results) {
      expect(r['relation']).toBe('causes');
      expect(r['sourceId']).toBe('10');
      expect(r['targetId']).toBe('20');
    }
  });

  it('uses memory_index content_text lookup in causal SQL', () => {
    mockAll.mockReturnValue([]);

    const searchFn = createUnifiedGraphSearchFn(mockDb);
    searchFn('spec', { limit: 5 });

    const sqlCalls = mockPrepare.mock.calls.map(call => String(call[0] ?? ''));
    const fallbackSql = sqlCalls.find(sql => sql.includes('FROM memory_index')) ?? '';
    expect(fallbackSql).toContain('FROM memory_index');
    expect(fallbackSql).toContain('content_text LIKE');
  });

  it('returns empty array when causal query throws', () => {
    mockPrepare.mockImplementation(() => {
      throw new Error('DB connection lost');
    });

    const searchFn = createUnifiedGraphSearchFn(mockDb);
    expect(searchFn('memory', { limit: 10 })).toEqual([]);
  });

  it('S4: augments graph retrieval with hierarchy memories when specFolder is provided', () => {
    mockPrepare.mockImplementation((sql: string) => {
      if (sql.includes("name='memory_fts'")) {
        return { get: () => undefined, all: () => [] };
      }
      if (sql.includes('FROM causal_edges ce')) {
        return { all: () => [], get: () => undefined };
      }
      if (sql.includes('FROM memory_index') && sql.includes('WHERE spec_folder IN')) {
        return {
          all: () => [{ id: 77, spec_folder: '003-root', title: 'hierarchy-parent' }],
          get: () => undefined,
        };
      }
      return { all: () => [], get: () => undefined };
    });

    const searchFn = createUnifiedGraphSearchFn(mockDb);
    const results = searchFn('memory', { limit: 5, specFolder: '003-root/007-child' });

    expect(results.some(r => r['id'] === 77)).toBe(true);
    expect(results.some(r => r['relation'] === 'hierarchy')).toBe(true);
  });

  it('preserves BM25-aware composite scores in the FTS5 path', () => {
    mockGet.mockReturnValue({ name: 'memory_fts' });
    mockAll.mockReturnValue([
      makeCausalRow({ source_id: '1', target_id: '2', strength: 0.5, fts_score: 4 }),
      makeCausalRow({ source_id: '3', target_id: '4', strength: 0.5, fts_score: 1 }),
    ]);

    const searchFn = createUnifiedGraphSearchFn(mockDb);
    const results = searchFn('memory', { limit: 20 });

    expect(results.slice(0, 2).map((row) => row['id'])).toEqual([1, 2]);
    expect(results[0]?.['score']).toBe(2);
    expect(results[0]?.['edgeStrength']).toBe(0.5);
    expect(results[0]?.['ftsScore']).toBe(4);
  });

  it('deduplicates FTS results using the highest composite score', () => {
    mockGet.mockReturnValue({ name: 'memory_fts' });
    mockAll.mockReturnValue([
      makeCausalRow({ source_id: '9', target_id: '10', strength: 0.8, fts_score: 1 }),
      makeCausalRow({ source_id: '9', target_id: '11', strength: 0.5, fts_score: 3 }),
    ]);

    const searchFn = createUnifiedGraphSearchFn(mockDb);
    const results = searchFn('memory', { limit: 20 });

    const sharedNode = results.find((row) => row['id'] === 9);
    expect(sharedNode?.['score']).toBe(1.5);
    expect(sharedNode?.['targetId']).toBe('11');
  });

  it('LIKE fallback sorts results by clamped strength descending', () => {
    mockAll.mockReturnValue([
      makeCausalRow({ source_id: '1', target_id: '2', strength: 1.5 }),
      makeCausalRow({ source_id: '3', target_id: '4', strength: -0.2 }),
      makeCausalRow({ source_id: '5', target_id: '6', strength: 0.7 }),
    ]);

    const searchFn = createUnifiedGraphSearchFn(mockDb);
    const results = searchFn('memory', { limit: 20 });

    const scores = results.map(r => (typeof r['score'] === 'number' ? r['score'] : 0));
    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i]!).toBeGreaterThanOrEqual(scores[i + 1]!);
    }
    for (const s of scores) {
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(1);
    }
  });
});
