// TEST: End-to-End Pipeline Integration
// Validates the full search pipeline works with the graph channel
// By testing the PUBLIC API surface without requiring a real DB.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type Database from 'better-sqlite3';
import type { GraphSearchFn } from '../lib/search/hybrid-search';

type MockFusionInput = {
  source: string;
  results: Array<Record<string, unknown> & { id: string | number; score?: number }>;
};

type MockFusionResult = Record<string, unknown> & {
  id: string | number;
  score: number;
  source: string;
  rrfScore: number;
  sources: string[];
  sourceScores: Record<string, number>;
  convergenceBonus: number;
};

/* ───────────────────────────────────────────────────────────────
   MOCKS — declared before any module imports so vi.mock hoisting
   picks them up correctly.
──────────────────────────────────────────────────────────────── */

// Mock the BM25 index so no filesystem reads are attempted.
vi.mock('../lib/search/bm25-index', () => ({
  getIndex: vi.fn(() => ({
    search: vi.fn(() => []),
    getStats: vi.fn(() => ({ documentCount: 0 })),
  })),
  isBm25Enabled: vi.fn(() => true),
  sanitizeFTS5Query: vi.fn((q: string) => q),
}));

// Mock the RRF fusion so we can control its output.
vi.mock('../../shared/algorithms/rrf-fusion', () => ({
  fuseResultsMulti: vi.fn((lists: MockFusionInput[]) => {
    // Flatten all results from all lists, deduplicate by id, return sorted.
    const seen = new Map<string | number, MockFusionResult>();
    for (const list of lists) {
      for (const r of list.results) {
        if (!seen.has(r.id)) {
          const score = r.score ?? 0.5;
          seen.set(r.id, {
            ...r,
            score,
            rrfScore: score,
            source: list.source,
            sources: [list.source],
            sourceScores: { [list.source]: score },
            convergenceBonus: 0,
          });
        }
      }
    }
    return Array.from(seen.values()).sort((a, b) => b.score - a.score);
  }),
}));

// Mock adaptive fusion using the current public export surface.
vi.mock('../../shared/algorithms/adaptive-fusion', () => ({
  getAdaptiveWeights: vi.fn(() => ({
    semanticWeight: 0.7,
    keywordWeight: 0.2,
    recencyWeight: 0.1,
    graphWeight: 0.15,
  })),
  isAdaptiveFusionEnabled: vi.fn(() => true),
}));

// Mock co-activation spreading so it never touches the DB.
vi.mock('../lib/cognitive/co-activation', () => ({
  spreadActivation: vi.fn(() => []),
}));

/* ───────────────────────────────────────────────────────────────
   MINIMAL MOCK DATABASE
──────────────────────────────────────────────────────────────── */

const mockDb = {
  prepare: () => ({ all: () => [], get: () => undefined }),
} as unknown as Database.Database;

/* ───────────────────────────────────────────────────────────────
   FAKE GRAPH RESULTS (3 results as specified in T021)
──────────────────────────────────────────────────────────────── */

const FAKE_GRAPH_RESULTS: ReturnType<GraphSearchFn> = [
  { id: 'graph-001', score: 0.9, source: 'graph', title: 'Graph Result Alpha' },
  { id: 'graph-002', score: 0.7, source: 'graph', title: 'Graph Result Beta' },
  { id: 'graph-003', score: 0.5, source: 'graph', title: 'Graph Result Gamma' },
];

const mockGraphFn = vi.fn(
  (_query: string, _options: Record<string, unknown>): ReturnType<GraphSearchFn> => FAKE_GRAPH_RESULTS,
);

/* ───────────────────────────────────────────────────────────────
   ENV HELPERS
──────────────────────────────────────────────────────────────── */

function saveEnv() {
  return {
    SPECKIT_GRAPH_UNIFIED: process.env.SPECKIT_GRAPH_UNIFIED,
  };
}

function restoreEnv(saved: ReturnType<typeof saveEnv>) {
  for (const [key, val] of Object.entries(saved)) {
    if (val === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = val;
    }
  }
}

// ================================================================
// SUITE 1: MODULE WIRING VERIFICATION
// All exported symbols must be accessible from their source modules.
// ================================================================

describe('Suite 1 — Module wiring: all exports are accessible', () => {

  it('hybrid-search exports: init, hybridSearch, hybridSearchEnhanced, searchWithFallback, getGraphMetrics, resetGraphMetrics', async () => {
    const mod = await import('../lib/search/hybrid-search');
    expect(typeof mod.init).toBe('function');
    expect(typeof mod.hybridSearch).toBe('function');
    expect(typeof mod.hybridSearchEnhanced).toBe('function');
    expect(typeof mod.searchWithFallback).toBe('function');
    expect(typeof mod.getGraphMetrics).toBe('function');
    expect(typeof mod.resetGraphMetrics).toBe('function');
  });

  it('graph-search-fn exports: createUnifiedGraphSearchFn', async () => {
    const mod = await import('../lib/search/graph-search-fn');
    expect(typeof mod.createUnifiedGraphSearchFn).toBe('function');
  });

  it('graph-flags exports: isGraphUnifiedEnabled', async () => {
    const mod = await import('../lib/search/graph-flags');
    expect(typeof mod.isGraphUnifiedEnabled).toBe('function');
  });

  it('query-expander exports: expandQuery', async () => {
    const mod = await import('../lib/search/query-expander');
    expect(typeof mod.expandQuery).toBe('function');
  });

  it('evidence-gap-detector exports: detectEvidenceGap, predictGraphCoverage', async () => {
    const mod = await import('../lib/search/evidence-gap-detector');
    expect(typeof mod.detectEvidenceGap).toBe('function');
    expect(typeof mod.predictGraphCoverage).toBe('function');
  });

  it('fsrs exports: computeStructuralFreshness, computeGraphCentrality', async () => {
    const mod = await import('../lib/search/fsrs');
    expect(typeof mod.computeStructuralFreshness).toBe('function');
    expect(typeof mod.computeGraphCentrality).toBe('function');
  });

  it('mmr-reranker exports: applyMMR, computeCosine', async () => {
    const mod = await import('../../shared/algorithms/mmr-reranker');
    expect(typeof mod.applyMMR).toBe('function');
    expect(typeof mod.computeCosine).toBe('function');
  });
});

// ================================================================
// SUITE 2: PIPELINE CONTRACT TESTS
// Wire mock graph fn via init(), call hybridSearch(), verify graph
// Channel inclusion/exclusion and metric tracking.
// ================================================================

describe('Suite 2 — Pipeline contract tests', () => {
  let init: typeof import('../lib/search/hybrid-search').init;
  let hybridSearch: typeof import('../lib/search/hybrid-search').hybridSearch;
  let hybridSearchEnhanced: typeof import('../lib/search/hybrid-search').hybridSearchEnhanced;
  let getGraphMetrics: typeof import('../lib/search/hybrid-search').getGraphMetrics;
  let resetGraphMetrics: typeof import('../lib/search/hybrid-search').resetGraphMetrics;
  const savedComplexityRouter = process.env.SPECKIT_COMPLEXITY_ROUTER;

  beforeEach(async () => {
    // Disable complexity router so all channels (including graph) are active for short test queries
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'false';
    vi.clearAllMocks();
    const mod = await import('../lib/search/hybrid-search');
    init = mod.init;
    hybridSearch = mod.hybridSearch;
    hybridSearchEnhanced = mod.hybridSearchEnhanced;
    getGraphMetrics = mod.getGraphMetrics;
    resetGraphMetrics = mod.resetGraphMetrics;

    // Wire mock graph function into the module.
    init(mockDb, null, mockGraphFn);
  });

  afterEach(() => {
    if (savedComplexityRouter === undefined) {
      delete process.env.SPECKIT_COMPLEXITY_ROUTER;
    } else {
      process.env.SPECKIT_COMPLEXITY_ROUTER = savedComplexityRouter;
    }
  });

  it('hybridSearch with useGraph:true calls the graphSearchFn and returns graph results', async () => {
    const results = await hybridSearch('test query', null, { useGraph: true });

    expect(mockGraphFn).toHaveBeenCalledTimes(1);
    const graphResults = results.filter(r => r.source === 'graph');
    expect(graphResults.length).toBeGreaterThan(0);
  });

  it('hybridSearch with useGraph:false does NOT call the graphSearchFn', async () => {
    await hybridSearch('test query', null, { useGraph: false });

    expect(mockGraphFn).not.toHaveBeenCalled();
  });

  it('hybridSearch with useGraph:false returns NO graph-sourced results', async () => {
    const results = await hybridSearch('test query', null, { useGraph: false });

    const graphResults = results.filter(r => r.source === 'graph');
    expect(graphResults.length).toBe(0);
  });

  it('hybridSearchEnhanced runs without throwing', async () => {
    await expect(
      hybridSearchEnhanced('test query', null, {})
    ).resolves.toBeDefined();
  });

  it('S4: hybridSearchEnhanced forwards specFolder to graphSearchFn', async () => {
    await hybridSearchEnhanced('test query', null, { useGraph: true, specFolder: '003-root/007-child' });

    expect(mockGraphFn).toHaveBeenCalled();
    const firstCall = mockGraphFn.mock.calls[0];
    expect(firstCall).toBeDefined();
    const [, options] = firstCall!;
    expect(options).toMatchObject({ specFolder: '003-root/007-child' });
  });

  it('getGraphMetrics().totalQueries increases after hybridSearchEnhanced calls', async () => {
    resetGraphMetrics();
    const before = getGraphMetrics().totalQueries;

    // HybridSearchEnhanced tracks metrics (it checks useGraph flag internally).
    await hybridSearchEnhanced('test query', null, { useGraph: true });

    const after = getGraphMetrics().totalQueries;
    expect(after).toBeGreaterThan(before);
  });

  it('resetGraphMetrics zeroes all counters', async () => {
    // Run one enhanced search to accumulate a non-zero count.
    await hybridSearchEnhanced('test query', null, { useGraph: true });

    resetGraphMetrics();

    const metrics = getGraphMetrics();
    expect(metrics.totalQueries).toBe(0);
    expect(metrics.graphHits).toBe(0);
    expect(metrics.graphOnlyResults).toBe(0);
    expect(metrics.multiSourceResults).toBe(0);
  });
});

// ================================================================
// SUITE 3: FEATURE FLAG CONTRACT
// Graph unified flag defaults to true when unset; setting SPECKIT_GRAPH_UNIFIED=true
// Keeps isGraphUnifiedEnabled() enabled.
// ================================================================

describe('Suite 3 — Feature flag contract', () => {
  let savedEnv: ReturnType<typeof saveEnv>;

  beforeEach(() => {
    savedEnv = saveEnv();
    // Ensure the flag is unset at the start of each test.
    delete process.env.SPECKIT_GRAPH_UNIFIED;
  });

  afterEach(() => {
    restoreEnv(savedEnv);
  });

  it('isGraphUnifiedEnabled defaults to true when SPECKIT_GRAPH_UNIFIED is unset', async () => {
    const { isGraphUnifiedEnabled } = await import('../lib/search/graph-flags');
    expect(isGraphUnifiedEnabled()).toBe(true);
  });

  it('setting SPECKIT_GRAPH_UNIFIED=true enables the graph channel flag', async () => {
    process.env.SPECKIT_GRAPH_UNIFIED = 'true';
    const { isGraphUnifiedEnabled } = await import('../lib/search/graph-flags');
    expect(isGraphUnifiedEnabled()).toBe(true);
  });
});

// ================================================================
// SUITE 4: RESULT SHAPE CONTRACT
// All hybridSearch results must have id, score, source fields.
// Graph-sourced results must carry source='graph'.
// Scores must be non-negative numbers.
// ================================================================

describe('Suite 4 — Result shape contract', () => {
  let init: typeof import('../lib/search/hybrid-search').init;
  let hybridSearch: typeof import('../lib/search/hybrid-search').hybridSearch;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import('../lib/search/hybrid-search');
    init = mod.init;
    hybridSearch = mod.hybridSearch;
    init(mockDb, null, mockGraphFn);
  });

  it('all results have id, score, and source fields', async () => {
    const results = await hybridSearch('test query', null, { useGraph: true });

    for (const r of results) {
      expect(r).toHaveProperty('id');
      expect(r).toHaveProperty('score');
      expect(r).toHaveProperty('source');
    }
  });

  it('graph results have source === "graph"', async () => {
    const results = await hybridSearch('test query', null, { useGraph: true });

    const graphResults = results.filter(r => r.source === 'graph');
    // We injected 3 fake graph results, so we expect to find at least some of them.
    expect(graphResults.length).toBeGreaterThan(0);
    for (const r of graphResults) {
      expect(r.source).toBe('graph');
    }
  });

  it('all score values are non-negative numbers', async () => {
    const results = await hybridSearch('test query', null, { useGraph: true });

    for (const r of results) {
      expect(typeof r.score).toBe('number');
      expect(r.score).toBeGreaterThanOrEqual(0);
    }
  });

  it('hybridSearch respects the limit option', async () => {
    const limit = 2;
    const results = await hybridSearch('test query', null, { useGraph: true, limit });

    expect(results.length).toBeLessThanOrEqual(limit);
  });
});
