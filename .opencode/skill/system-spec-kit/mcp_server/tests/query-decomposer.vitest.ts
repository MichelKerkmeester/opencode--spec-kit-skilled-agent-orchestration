// TEST: Query Decomposer (D2 REQ-D2-001) — Bounded Facet Detection
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  isMultiFacet,
  decompose,
  mergeByFacetCoverage,
  MAX_FACETS,
  __testables,
} from '../lib/search/query-decomposer';
import type { FacetPool } from '../lib/search/query-decomposer';

const { MIN_FRAGMENT_TOKEN_COUNT, MIN_QUERY_LENGTH_FOR_DECOMPOSITION } = __testables;

// ───────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────

function makeRow(id: number, score?: number): { id: number; score?: number } {
  return score !== undefined ? { id, score } : { id };
}

// ───────────────────────────────────────────────────────────────
// isMultiFacet
// ───────────────────────────────────────────────────────────────

describe('isMultiFacet()', () => {
  it('returns false for a single-facet simple query', () => {
    expect(isMultiFacet('embedding vectors')).toBe(false);
  });

  it('returns false for very short queries', () => {
    expect(isMultiFacet('what and how')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isMultiFacet('')).toBe(false);
  });

  it('returns false for non-string input', () => {
    // @ts-expect-error testing runtime guard
    expect(isMultiFacet(null)).toBe(false);
  });

  it('detects AND conjunction as multi-facet', () => {
    expect(isMultiFacet('how does memory retrieval work and what is the scoring system')).toBe(true);
  });

  it('detects OR conjunction as multi-facet', () => {
    expect(isMultiFacet('find embedding results or return graph search candidates')).toBe(true);
  });

  it('detects "also" conjunction as multi-facet', () => {
    expect(isMultiFacet('what is the pipeline configuration also how does scoring work')).toBe(true);
  });

  it('detects multiple distinct wh-question words as multi-facet', () => {
    expect(isMultiFacet('what is the retrieval pipeline and how does it score results')).toBe(true);
  });

  it('returns false for single wh-word with no conjunction', () => {
    expect(isMultiFacet('what are the retrieval pipeline stages')).toBe(false);
  });

  it('detects sentence boundary split as multi-facet', () => {
    expect(isMultiFacet('Explain the hybrid search. Describe the scoring algorithm.')).toBe(true);
  });

  it('detects question-mark boundary as multi-facet', () => {
    expect(isMultiFacet('What is retrieval? How does scoring work?')).toBe(true);
  });

  it('returns false for a single sentence with no conjunctions', () => {
    expect(isMultiFacet('describe the hybrid search pipeline scoring approach')).toBe(false);
  });
});

// ───────────────────────────────────────────────────────────────
// decompose
// ───────────────────────────────────────────────────────────────

describe('decompose()', () => {
  it('returns empty array for a single-facet query (no meaningful split)', () => {
    // "fast retrieval for large datasets" has no conjunction/sentence boundary
    const facets = decompose('fast retrieval for large datasets');
    expect(facets).toEqual([]);
  });

  it('splits on AND conjunction', () => {
    const facets = decompose('how does memory retrieval work and what is the scoring system');
    expect(facets.length).toBeGreaterThanOrEqual(2);
    expect(facets.length).toBeLessThanOrEqual(MAX_FACETS);
  });

  it('splits on OR conjunction', () => {
    const facets = decompose('return embedding results or return graph search candidates');
    expect(facets.length).toBeGreaterThanOrEqual(2);
    expect(facets.length).toBeLessThanOrEqual(MAX_FACETS);
  });

  it('caps at MAX_FACETS (3)', () => {
    // Multi-conjunction query
    const q = 'explain retrieval and describe scoring and explain reranking and show filters';
    const facets = decompose(q);
    expect(facets.length).toBeLessThanOrEqual(MAX_FACETS);
  });

  it('returns empty array for empty string', () => {
    expect(decompose('')).toEqual([]);
  });

  it('deduplicates identical fragments', () => {
    // "A and A" should produce only one unique fragment
    const facets = decompose('search for memories and search for memories in deep mode');
    // All fragments should be unique
    const unique = new Set(facets);
    expect(unique.size).toBe(facets.length);
  });

  it('splits on sentence boundary', () => {
    const facets = decompose('Explain the hybrid search pipeline. Describe the scoring algorithm.');
    expect(facets.length).toBeGreaterThanOrEqual(2);
    expect(facets.length).toBeLessThanOrEqual(MAX_FACETS);
  });

  it('returns empty array for non-string input', () => {
    // @ts-expect-error testing runtime guard
    expect(decompose(null)).toEqual([]);
  });

  it('each facet contains meaningful tokens', () => {
    const facets = decompose('how does retrieval work and why does scoring matter');
    for (const facet of facets) {
      const tokens = facet.split(/\s+/).filter(Boolean);
      expect(tokens.length).toBeGreaterThanOrEqual(MIN_FRAGMENT_TOKEN_COUNT);
    }
  });
});

// ───────────────────────────────────────────────────────────────
// mergeByFacetCoverage
// ───────────────────────────────────────────────────────────────

describe('mergeByFacetCoverage()', () => {
  it('returns empty array when pools are empty', () => {
    expect(mergeByFacetCoverage([])).toEqual([]);
  });

  it('returns all results from a single pool', () => {
    const pool: FacetPool<{ id: number; score: number }> = {
      query: 'memory retrieval',
      results: [makeRow(1, 0.9), makeRow(2, 0.7), makeRow(3, 0.5)] as { id: number; score: number }[],
    };
    const merged = mergeByFacetCoverage([pool]);
    expect(merged.map((r) => r.id)).toEqual([1, 2, 3]);
  });

  it('deduplicates items appearing in multiple pools', () => {
    const pool1: FacetPool<{ id: number; score: number }> = {
      query: 'retrieval pipeline',
      results: [makeRow(1, 0.9), makeRow(2, 0.7)] as { id: number; score: number }[],
    };
    const pool2: FacetPool<{ id: number; score: number }> = {
      query: 'scoring system',
      results: [makeRow(2, 0.8), makeRow(3, 0.6)] as { id: number; score: number }[],
    };
    const merged = mergeByFacetCoverage([pool1, pool2]);
    const ids = merged.map((r) => r.id);
    // All 3 unique IDs present
    expect(ids.sort()).toEqual([1, 2, 3]);
    // No duplicates
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ranks items by facet coverage (cross-facet items first)', () => {
    const pool1: FacetPool<{ id: number; score: number }> = {
      query: 'retrieval pipeline',
      results: [makeRow(1, 0.9), makeRow(2, 0.7)] as { id: number; score: number }[],
    };
    const pool2: FacetPool<{ id: number; score: number }> = {
      query: 'scoring system',
      results: [makeRow(2, 0.8), makeRow(3, 0.6)] as { id: number; score: number }[],
    };
    const merged = mergeByFacetCoverage([pool1, pool2]);
    // ID 2 appears in both pools — should rank first
    expect(merged[0].id).toBe(2);
  });

  it('uses best score as tie-breaker when coverage is equal', () => {
    const pool1: FacetPool<{ id: number; score: number }> = {
      query: 'query one',
      results: [makeRow(10, 0.9), makeRow(20, 0.3)] as { id: number; score: number }[],
    };
    const merged = mergeByFacetCoverage([pool1]);
    // Both IDs have coverage 1 — higher score first
    expect(merged[0].id).toBe(10);
    expect(merged[1].id).toBe(20);
  });

  it('handles rrfScore as score input', () => {
    const pool: FacetPool<{ id: number; rrfScore: number }> = {
      query: 'test query',
      results: [
        { id: 5, rrfScore: 0.95 },
        { id: 6, rrfScore: 0.4 },
      ],
    };
    const merged = mergeByFacetCoverage([pool]);
    expect(merged[0].id).toBe(5);
  });

  it('handles similarity (percentage-scale) as score input', () => {
    const pool: FacetPool<{ id: number; similarity: number }> = {
      query: 'test query',
      results: [
        { id: 7, similarity: 85 }, // 85 / 100 = 0.85
        { id: 8, similarity: 40 }, // 40 / 100 = 0.40
      ],
    };
    const merged = mergeByFacetCoverage([pool]);
    expect(merged[0].id).toBe(7);
  });

  it('handles items with no score field', () => {
    const pool: FacetPool<{ id: number }> = {
      query: 'no score query',
      results: [{ id: 100 }, { id: 200 }],
    };
    const merged = mergeByFacetCoverage([pool]);
    expect(merged.length).toBe(2);
  });
});

// ───────────────────────────────────────────────────────────────
// Feature flag behavior (SPECKIT_QUERY_DECOMPOSITION)
// ───────────────────────────────────────────────────────────────

describe('feature flag: isQueryDecompositionEnabled()', () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.SPECKIT_QUERY_DECOMPOSITION;
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.SPECKIT_QUERY_DECOMPOSITION;
    } else {
      process.env.SPECKIT_QUERY_DECOMPOSITION = originalEnv;
    }
  });

  it('is enabled by default (graduated — no env var set)', async () => {
    delete process.env.SPECKIT_QUERY_DECOMPOSITION;
    const { isQueryDecompositionEnabled } = await import('../lib/search/search-flags');
    expect(isQueryDecompositionEnabled()).toBe(true);
  });

  it('is enabled when env var is "true"', async () => {
    process.env.SPECKIT_QUERY_DECOMPOSITION = 'true';
    // Re-import to pick up env change (modules are cached — test via direct env check)
    const { isQueryDecompositionEnabled } = await import('../lib/search/search-flags');
    expect(isQueryDecompositionEnabled()).toBe(true);
  });

  it('decompose() still works correctly regardless of flag state', () => {
    // decompose() is a pure function — the flag is checked by the caller in stage1
    const facets = decompose('how does retrieval work and why does scoring matter');
    expect(facets.length).toBeGreaterThanOrEqual(1);
  });
});
