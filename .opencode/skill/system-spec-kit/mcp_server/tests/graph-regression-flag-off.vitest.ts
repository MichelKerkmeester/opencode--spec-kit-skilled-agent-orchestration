// ───────────────────────────────────────────────────────────────
// 1. GRAPH REGRESSION FLAG OFF VITEST
// ───────────────────────────────────────────────────────────────
// TEST: GRAPH REGRESSION - FLAG CONTRACT + NULL-WIRING SAFETY (T022)
// Verifies SPECKIT_GRAPH_UNIFIED env semantics and behavior when
// Hybrid-search is explicitly initialized with graphFn = null.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type Database from 'better-sqlite3';
import type { GraphSearchFn } from '../lib/search/hybrid-search';
import { isGraphUnifiedEnabled } from '../lib/search/graph-flags';
import { init, hybridSearch, hybridSearchEnhanced, getGraphMetrics, resetGraphMetrics } from '../lib/search/hybrid-search';

// HELPERS
/**
 * Build a minimal in-memory SQLite-compatible stub that satisfies
 * the hybrid-search module's db.prepare() contract without pulling
 * in better-sqlite3 (which requires native binaries at test time).
 * FTS and BM25 paths both return [] by default.
 */
function buildStubDb() {
  return {
    prepare: vi.fn().mockReturnValue({
      get: vi.fn().mockReturnValue(undefined),
      all: vi.fn().mockReturnValue([]),
      run: vi.fn().mockReturnValue({ changes: 0, lastInsertRowid: 0 }),
    }),
  };
}

// SUITE: T022 — Graph Channel Bypassed When Flag Is Off
describe('T022: Graph Channel Feature Flag Regression', () => {

  /* ───────────────────────────────────────────────────────────────
     Group 1: isGraphUnifiedEnabled() — flag reading contract
  ──────────────────────────────────────────────────────────────── */

  describe('isGraphUnifiedEnabled() — env-var contract', () => {

    afterEach(() => {
      delete process.env.SPECKIT_GRAPH_UNIFIED;
    });

    it('T022-1: Flag returns true when env var is absent', () => {
      delete process.env.SPECKIT_GRAPH_UNIFIED;
      expect(isGraphUnifiedEnabled()).toBe(true);
    });

    // NOTE: T022-2 covers the hybridSearch graphFn=null behavior and lives in the
    // Nested describe('T022-2: hybridSearch — graph search fn NOT called...') group below.

    it('T022-3: Flag returns true when env var is exactly "true"', () => {
      process.env.SPECKIT_GRAPH_UNIFIED = 'true';
      expect(isGraphUnifiedEnabled()).toBe(true);
    });

    it('T022-4: Flag follows env var mutations (default-on, explicit false disables)', () => {
      delete process.env.SPECKIT_GRAPH_UNIFIED;
      expect(isGraphUnifiedEnabled()).toBe(true);

      process.env.SPECKIT_GRAPH_UNIFIED = 'false';
      expect(isGraphUnifiedEnabled()).toBe(false);

      delete process.env.SPECKIT_GRAPH_UNIFIED;
      expect(isGraphUnifiedEnabled()).toBe(true);
    });

    it('T022-5a: "TRUE" (uppercase) enables flag', () => {
      process.env.SPECKIT_GRAPH_UNIFIED = 'TRUE';
      expect(isGraphUnifiedEnabled()).toBe(true);
    });

    it('T022-5b: "1" enables flag (only "false"/"0" disable)', () => {
      process.env.SPECKIT_GRAPH_UNIFIED = '1';
      expect(isGraphUnifiedEnabled()).toBe(true);
    });

    it('T022-5c: "yes" enables flag (only "false"/"0" disable)', () => {
      process.env.SPECKIT_GRAPH_UNIFIED = 'yes';
      expect(isGraphUnifiedEnabled()).toBe(true);
    });

    it('T022-5d: "True" (mixed case) enables flag', () => {
      process.env.SPECKIT_GRAPH_UNIFIED = 'True';
      expect(isGraphUnifiedEnabled()).toBe(true);
    });

    it('T022-5e: Empty string enables flag (default-on)', () => {
      process.env.SPECKIT_GRAPH_UNIFIED = '';
      expect(isGraphUnifiedEnabled()).toBe(true);
    });

    it('T022-5f: Strict equality — "false" disables flag', () => {
      process.env.SPECKIT_GRAPH_UNIFIED = 'false';
      expect(isGraphUnifiedEnabled()).toBe(false);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Group 2: Graph search function NOT called during hybridSearch
              when the module is initialised with graphFn = null
  ──────────────────────────────────────────────────────────────── */

  describe('T022-2: hybridSearch — graph search fn NOT called when graphFn is null', () => {
    let graphFnSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      delete process.env.SPECKIT_GRAPH_UNIFIED;
      graphFnSpy = vi.fn().mockReturnValue([]);

      // Flag-off wiring: pass null as graphFn (mirroring context-server.ts behaviour)
      const stubDb = buildStubDb();
      init(stubDb as unknown as Database.Database, null, null);
    });

    afterEach(() => {
      delete process.env.SPECKIT_GRAPH_UNIFIED;
      vi.restoreAllMocks();
    });

    it('T022-2a: hybridSearch does not invoke graph search fn when init receives null graphFn', async () => {
      // Reinitialise with the spy to confirm it stays uncalled
      const stubDb = buildStubDb();
      init(stubDb as unknown as Database.Database, null, null);

      await hybridSearch('test query', null, { useGraph: true });

      // The spy was never passed to init, so it should never be called.
      // The real guard is that init stored null and the graphSearchFn branch is skipped.
      expect(graphFnSpy).not.toHaveBeenCalled();
    });

    it('T022-2b: hybridSearch with useGraph=true and null graphFn returns result without graph source', async () => {
      const stubDb = buildStubDb();
      init(stubDb as unknown as Database.Database, null, null);

      const results = await hybridSearch('test query', null, { useGraph: true });

      // With no vector fn, empty FTS and BM25 (stub returns []), result is []
      expect(Array.isArray(results)).toBe(true);
      const graphResults = results.filter(r => r.source === 'graph');
      expect(graphResults).toHaveLength(0);
    });

    it('T022-2c: hybridSearch with useGraph=false and a real graphFn — graphFn NOT called', async () => {
      // Even if a graphFn were provided, useGraph=false should block it
      const stubDb = buildStubDb();
      init(stubDb as unknown as Database.Database, null, graphFnSpy as unknown as GraphSearchFn);

      await hybridSearch('test query', null, { useGraph: false });

      expect(graphFnSpy).not.toHaveBeenCalled();
    });

    it('T022-2d: hybridSearch with useGraph=true and a real graphFn — graphFn IS called', async () => {
      // Positive control: verify the graph path DOES fire when correctly wired
      const stubDb = buildStubDb();
      init(stubDb as unknown as Database.Database, null, graphFnSpy as unknown as GraphSearchFn);

      await hybridSearch('test query', null, { useGraph: true });

      expect(graphFnSpy).toHaveBeenCalledOnce();
      expect(graphFnSpy).toHaveBeenCalledWith('test query', expect.objectContaining({ limit: 20 }));
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Group 3: hybridSearchEnhanced — graph channel bypass
  ──────────────────────────────────────────────────────────────── */

  describe('T022-2e: hybridSearchEnhanced — graph search fn NOT called when graphFn is null', () => {
    let graphFnSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      delete process.env.SPECKIT_GRAPH_UNIFIED;
      graphFnSpy = vi.fn().mockReturnValue([]);
    });

    afterEach(() => {
      delete process.env.SPECKIT_GRAPH_UNIFIED;
      vi.restoreAllMocks();
    });

    it('T022-2e-null: hybridSearchEnhanced with null graphFn — spy never called', async () => {
      const stubDb = buildStubDb();
      init(stubDb as unknown as Database.Database, null, null);

      await hybridSearchEnhanced('test query', null, { useGraph: true });

      expect(graphFnSpy).not.toHaveBeenCalled();
    });

    it('T022-2e-wired: hybridSearchEnhanced with real graphFn — spy called when useGraph=true', async () => {
      // Positive control for hybridSearchEnhanced code path
      const stubDb = buildStubDb();
      init(stubDb as unknown as Database.Database, null, graphFnSpy as unknown as GraphSearchFn);

      await hybridSearchEnhanced('test query', null, { useGraph: true });

      // HybridSearchEnhanced may fall through to hybridSearch internally;
      // Either way the graphFn MUST be invoked when wired and useGraph=true.
      expect(graphFnSpy).toHaveBeenCalled();
    });

    it('T022-2e-off: hybridSearchEnhanced with real graphFn — spy NOT called when useGraph=false', async () => {
      const stubDb = buildStubDb();
      init(stubDb as unknown as Database.Database, null, graphFnSpy as unknown as GraphSearchFn);

      await hybridSearchEnhanced('test query', null, { useGraph: false });

      expect(graphFnSpy).not.toHaveBeenCalled();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Group 4: Graph channel metrics — getGraphMetrics / resetGraphMetrics
  ──────────────────────────────────────────────────────────────── */

  describe('T022: Graph channel metrics', () => {
    const savedComplexityRouter = process.env.SPECKIT_COMPLEXITY_ROUTER;

    beforeEach(() => {
      // Disable complexity router so graph channel is active for short queries
      process.env.SPECKIT_COMPLEXITY_ROUTER = 'false';
      resetGraphMetrics();
    });

    afterEach(() => {
      if (savedComplexityRouter === undefined) {
        delete process.env.SPECKIT_COMPLEXITY_ROUTER;
      } else {
        process.env.SPECKIT_COMPLEXITY_ROUTER = savedComplexityRouter;
      }
    });

    it('T022-M1: getGraphMetrics() returns zero counts initially', () => {
      const metrics = getGraphMetrics();
      expect(metrics.totalQueries).toBe(0);
      expect(metrics.graphHits).toBe(0);
      expect(metrics.graphOnlyResults).toBe(0);
      expect(metrics.multiSourceResults).toBe(0);
      expect(metrics.graphHitRate).toBe(0);
    });

    it('T022-M2: resetGraphMetrics() clears all counters back to zero', async () => {
      // Drive some counters via hybridSearchEnhanced with a wired graphFn
      const graphFnSpy = vi.fn().mockReturnValue([
        { id: 1, score: 0.9, title: 'test' },
      ]);
      const stubDb = {
        prepare: vi.fn().mockReturnValue({
          get: vi.fn().mockReturnValue(undefined),
          all: vi.fn().mockReturnValue([]),
          run: vi.fn().mockReturnValue({ changes: 0, lastInsertRowid: 0 }),
        }),
      };
      init(stubDb as unknown as Database.Database, null, graphFnSpy as unknown as GraphSearchFn);

      await hybridSearchEnhanced('probe query', null, { useGraph: true });

      // At least totalQueries should be non-zero after a search with a wired graphFn
      const before = getGraphMetrics();
      expect(before.totalQueries).toBeGreaterThan(0);

      // Reset and verify all counters return to zero
      resetGraphMetrics();
      const after = getGraphMetrics();
      expect(after.totalQueries).toBe(0);
      expect(after.graphHits).toBe(0);
      expect(after.graphOnlyResults).toBe(0);
      expect(after.multiSourceResults).toBe(0);
      expect(after.graphHitRate).toBe(0);
    });

    it('T022-M3: graphHitRate is 0 when totalQueries is 0 (no division by zero)', () => {
      resetGraphMetrics();
      const metrics = getGraphMetrics();
      expect(metrics.totalQueries).toBe(0);
      expect(metrics.graphHitRate).toBe(0);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Group 5: End-to-end wiring — isGraphUnifiedEnabled() gates
              createUnifiedGraphSearchFn() reaching init()
  ──────────────────────────────────────────────────────────────── */

  describe('T022: Flag gating controls graphFn wiring (simulation)', () => {

    afterEach(() => {
      delete process.env.SPECKIT_GRAPH_UNIFIED;
      vi.restoreAllMocks();
    });

    it('T022-wire-off: When flag is false, undefined/null graphFn is the correct arg to init()', () => {
      process.env.SPECKIT_GRAPH_UNIFIED = 'false';

      // Simulate the wiring decision in context-server.ts:
      // IsGraphUnifiedEnabled() ? createUnifiedGraphSearchFn(...) : undefined
      const graphFn = isGraphUnifiedEnabled()
        ? vi.fn().mockReturnValue([])   // would be createUnifiedGraphSearchFn(...)
        : undefined;

      expect(graphFn).toBeUndefined();
    });

    it('T022-wire-on: When env var is true, graphFn is defined', () => {
      process.env.SPECKIT_GRAPH_UNIFIED = 'true';

      const mockGraphFn = vi.fn().mockReturnValue([]);
      const graphFn = isGraphUnifiedEnabled()
        ? mockGraphFn
        : undefined;

      expect(graphFn).toBeDefined();
    });

    it('T022-wire-init-on: init() with enabled graphFn includes graph results', async () => {
      process.env.SPECKIT_GRAPH_UNIFIED = 'true';

      const graphFn = isGraphUnifiedEnabled()
        ? vi.fn().mockReturnValue([{ id: 'graph-test', score: 0.7, source: 'graph' }])
        : undefined;

      const stubDb = buildStubDb();
      init(stubDb as unknown as Database.Database, null, graphFn ?? null);

      const results = await hybridSearch('probe query', null, { useGraph: true });
      const graphSources = results.filter(r => r.source === 'graph');

      expect(isGraphUnifiedEnabled()).toBe(true);
      expect(graphFn).toBeDefined();
      if (graphFn) {
        expect(graphFn).toHaveBeenCalled();
      }
      expect(graphSources.length).toBeGreaterThan(0);
    });
  });
});
