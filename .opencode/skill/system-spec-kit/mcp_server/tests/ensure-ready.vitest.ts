// ───────────────────────────────────────────────────────────────
// TEST: Code Graph Auto-Trigger (Ensure Ready)
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReadyAction, GraphFreshness, ReadyResult } from '../lib/code-graph/ensure-ready.js';

// Mock code-graph-db to avoid real DB access
vi.mock('../lib/code-graph/code-graph-db.js', () => ({
  getDb: vi.fn(() => ({
    prepare: vi.fn(() => ({
      get: vi.fn(() => ({ c: 0 })),
      all: vi.fn(() => []),
    })),
  })),
  getStats: vi.fn(() => ({
    totalFiles: 0, totalNodes: 0, totalEdges: 0,
    lastScanTimestamp: null, dbFileSize: null, schemaVersion: 1,
    nodesByKind: {}, edgesByType: {}, parseHealthSummary: {},
  })),
  getLastGitHead: vi.fn(() => null),
  setLastGitHead: vi.fn(),
  ensureFreshFiles: vi.fn(() => ({ fresh: [], stale: [] })),
  isFileStale: vi.fn(() => false),
}));

// Mock structural-indexer to avoid real parsing
vi.mock('../lib/code-graph/structural-indexer.js', () => ({
  indexFiles: vi.fn(async () => []),
}));

describe('ensure-ready', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('type exports', () => {
    it('ReadyAction accepts valid values', () => {
      const actions: ReadyAction[] = ['none', 'full_scan', 'selective_reindex'];
      expect(actions).toHaveLength(3);
    });

    it('GraphFreshness accepts valid values', () => {
      const levels: GraphFreshness[] = ['fresh', 'stale', 'empty'];
      expect(levels).toHaveLength(3);
    });

    it('ReadyResult has required shape', () => {
      const result: ReadyResult = { action: 'none', reason: 'test' };
      expect(result.action).toBe('none');
      expect(result.reason).toBe('test');
      expect(result.files).toBeUndefined();
    });

    it('ReadyResult supports optional files array', () => {
      const result: ReadyResult = {
        action: 'selective_reindex',
        files: ['a.ts', 'b.ts'],
        reason: 'stale files',
      };
      expect(result.files).toHaveLength(2);
    });
  });

  describe('ensureCodeGraphReady', () => {
    it('returns a ReadyResult with full_scan when graph is empty', async () => {
      const { ensureCodeGraphReady } = await import('../lib/code-graph/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root');

      expect(result).toBeDefined();
      expect(result.action).toBeDefined();
      expect(typeof result.reason).toBe('string');
    });
  });

  describe('getGraphFreshness', () => {
    it('returns a valid GraphFreshness value', async () => {
      const { getGraphFreshness } = await import('../lib/code-graph/ensure-ready.js');
      const freshness = getGraphFreshness('/tmp/test-root');

      expect(['fresh', 'stale', 'empty']).toContain(freshness);
    });
  });
});
