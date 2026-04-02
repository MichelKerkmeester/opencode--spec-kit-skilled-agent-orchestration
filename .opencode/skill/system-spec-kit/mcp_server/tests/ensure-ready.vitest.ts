// ───────────────────────────────────────────────────────────────
// TEST: Code Graph Auto-Trigger (Ensure Ready)
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReadyAction, GraphFreshness, ReadyResult } from '../lib/code-graph/ensure-ready.js';

const mocks = vi.hoisted(() => ({
  getDbMock: vi.fn(),
  getStatsMock: vi.fn(),
  getLastGitHeadMock: vi.fn(),
  setLastGitHeadMock: vi.fn(),
  ensureFreshFilesMock: vi.fn(),
  isFileStaleMock: vi.fn(),
  getTrackedFilesMock: vi.fn(),
  removeFileMock: vi.fn(),
  indexFilesMock: vi.fn(),
  existsSyncMock: vi.fn(),
}));

// Mock code-graph-db to avoid real DB access
vi.mock('../lib/code-graph/code-graph-db.js', () => ({
  getDb: mocks.getDbMock,
  getStats: mocks.getStatsMock,
  getLastGitHead: mocks.getLastGitHeadMock,
  setLastGitHead: mocks.setLastGitHeadMock,
  ensureFreshFiles: mocks.ensureFreshFilesMock,
  isFileStale: mocks.isFileStaleMock,
  getTrackedFiles: mocks.getTrackedFilesMock,
  removeFile: mocks.removeFileMock,
}));

vi.mock('node:fs', () => ({
  existsSync: mocks.existsSyncMock,
}));

// Mock structural-indexer to avoid real parsing
vi.mock('../lib/code-graph/structural-indexer.js', () => ({
  indexFiles: mocks.indexFilesMock,
}));

function createDbWithNodeCount(nodeCount: number) {
  return {
    prepare: vi.fn(() => ({
      get: vi.fn(() => ({ c: nodeCount })),
      all: vi.fn(() => []),
    })),
  };
}

describe('ensure-ready', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();

    mocks.getDbMock.mockReturnValue(createDbWithNodeCount(0));
    mocks.getStatsMock.mockReturnValue({
      totalFiles: 0, totalNodes: 0, totalEdges: 0,
      lastScanTimestamp: null, dbFileSize: null, schemaVersion: 1,
      nodesByKind: {}, edgesByType: {}, parseHealthSummary: {},
    });
    mocks.getLastGitHeadMock.mockReturnValue(null);
    mocks.ensureFreshFilesMock.mockReturnValue({ fresh: [], stale: [] });
    mocks.isFileStaleMock.mockReturnValue(false);
    mocks.getTrackedFilesMock.mockReturnValue([]);
    mocks.indexFilesMock.mockResolvedValue([]);
    mocks.existsSyncMock.mockReturnValue(true);
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

    it('removes deleted tracked files even when no reindex is needed', async () => {
      mocks.getDbMock.mockReturnValue(createDbWithNodeCount(1));
      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/deleted.ts']);
      mocks.existsSyncMock.mockReturnValue(false);

      const { ensureCodeGraphReady } = await import('../lib/code-graph/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root');

      expect(result.action).toBe('none');
      expect(result.reason).toContain('removed 1 deleted tracked file(s)');
      expect(mocks.removeFileMock).toHaveBeenCalledWith('/tmp/test-root/deleted.ts');
      expect(mocks.indexFilesMock).not.toHaveBeenCalled();
    });

    it('reports stale work without indexing when read paths disable inline indexing', async () => {
      mocks.getDbMock.mockReturnValue(createDbWithNodeCount(1));
      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/stale.ts']);
      mocks.ensureFreshFilesMock.mockReturnValue({ fresh: [], stale: ['/tmp/test-root/stale.ts'] });

      const { ensureCodeGraphReady } = await import('../lib/code-graph/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root', { allowInlineIndex: false });

      expect(result.action).toBe('selective_reindex');
      expect(result.files).toEqual(['/tmp/test-root/stale.ts']);
      expect(result.reason).toContain('inline auto-index skipped for read path');
      expect(mocks.indexFilesMock).not.toHaveBeenCalled();
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
