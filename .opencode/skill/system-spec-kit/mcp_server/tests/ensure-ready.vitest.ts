// ───────────────────────────────────────────────────────────────
// TEST: Code Graph Auto-Trigger (Ensure Ready)
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReadyAction, GraphFreshness, ReadyResult } from '../code_graph/lib/ensure-ready.js';

const mocks = vi.hoisted(() => ({
  getDbMock: vi.fn(),
  getStatsMock: vi.fn(),
  getLastGitHeadMock: vi.fn(),
  setLastDetectorProvenanceMock: vi.fn(),
  setLastGitHeadMock: vi.fn(),
  upsertFileMock: vi.fn(),
  replaceNodesMock: vi.fn(),
  replaceEdgesMock: vi.fn(),
  ensureFreshFilesMock: vi.fn(),
  isFileStaleMock: vi.fn(),
  getTrackedFilesMock: vi.fn(),
  removeFileMock: vi.fn(),
  indexFilesMock: vi.fn(),
  existsSyncMock: vi.fn(),
  execSyncMock: vi.fn(),
}));

// Mock code-graph-db to avoid real DB access
vi.mock('../code_graph/lib/code-graph-db.js', () => ({
  getDb: mocks.getDbMock,
  getStats: mocks.getStatsMock,
  getLastGitHead: mocks.getLastGitHeadMock,
  setLastDetectorProvenance: mocks.setLastDetectorProvenanceMock,
  setLastGitHead: mocks.setLastGitHeadMock,
  upsertFile: mocks.upsertFileMock,
  replaceNodes: mocks.replaceNodesMock,
  replaceEdges: mocks.replaceEdgesMock,
  ensureFreshFiles: mocks.ensureFreshFilesMock,
  isFileStale: mocks.isFileStaleMock,
  getTrackedFiles: mocks.getTrackedFilesMock,
  removeFile: mocks.removeFileMock,
}));

vi.mock('node:fs', () => ({
  existsSync: mocks.existsSyncMock,
}));

vi.mock('node:child_process', () => ({
  execSync: mocks.execSyncMock,
}));

// Mock structural-indexer to avoid real parsing
vi.mock('../code_graph/lib/structural-indexer.js', () => ({
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
    mocks.upsertFileMock.mockReturnValue(1);
    mocks.ensureFreshFilesMock.mockReturnValue({ fresh: [], stale: [] });
    mocks.isFileStaleMock.mockReturnValue(false);
    mocks.getTrackedFilesMock.mockReturnValue([]);
    mocks.indexFilesMock.mockResolvedValue([{
      filePath: '/tmp/test-root/stale.ts',
      language: 'typescript',
      nodes: [],
      edges: [],
      detectorProvenance: 'structured',
      contentHash: 'hash-1',
      parseHealth: 'clean',
      parseErrors: [],
      parseDurationMs: 5,
    }]);
    mocks.existsSyncMock.mockReturnValue(true);
    mocks.execSyncMock.mockReturnValue('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n');
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
      const result: ReadyResult = {
        freshness: 'fresh',
        action: 'none',
        inlineIndexPerformed: false,
        reason: 'test',
      };
      expect(result.action).toBe('none');
      expect(result.reason).toBe('test');
      expect(result.files).toBeUndefined();
    });

    it('ReadyResult supports optional files array', () => {
      const result: ReadyResult = {
        freshness: 'stale',
        action: 'selective_reindex',
        files: ['a.ts', 'b.ts'],
        inlineIndexPerformed: true,
        reason: 'stale files',
      };
      expect(result.files).toHaveLength(2);
    });
  });

  describe('ensureCodeGraphReady', () => {
    it('returns refreshed readiness after a successful inline full scan', async () => {
      mocks.getDbMock
        .mockReturnValueOnce(createDbWithNodeCount(0))
        .mockReturnValue(createDbWithNodeCount(1));
      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/stale.ts']);
      mocks.ensureFreshFilesMock.mockReturnValue({ fresh: ['/tmp/test-root/stale.ts'], stale: [] });

      const { ensureCodeGraphReady } = await import('../code_graph/lib/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root');

      expect(result.freshness).toBe('fresh');
      expect(result.action).toBe('none');
      expect(result.inlineIndexPerformed).toBe(true);
      expect(result.reason).toBe('all tracked files are up-to-date');
      expect(mocks.indexFilesMock).toHaveBeenCalledTimes(1);
    });

    it('removes deleted tracked files even when no reindex is needed', async () => {
      mocks.getDbMock.mockReturnValue(createDbWithNodeCount(1));
      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/deleted.ts']);
      mocks.existsSyncMock.mockReturnValue(false);

      const { ensureCodeGraphReady } = await import('../code_graph/lib/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root');

      expect(result.action).toBe('none');
      expect(result.freshness).toBe('stale');
      expect(result.inlineIndexPerformed).toBe(false);
      expect(result.reason).toContain('removed 1 deleted tracked file(s)');
      expect(mocks.removeFileMock).toHaveBeenCalledWith('/tmp/test-root/deleted.ts');
      expect(mocks.indexFilesMock).not.toHaveBeenCalled();
    });

    it('reports stale work without indexing when read paths disable inline indexing', async () => {
      mocks.getDbMock.mockReturnValue(createDbWithNodeCount(1));
      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/stale.ts']);
      mocks.ensureFreshFilesMock.mockReturnValue({ fresh: [], stale: ['/tmp/test-root/stale.ts'] });

      const { ensureCodeGraphReady } = await import('../code_graph/lib/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root', { allowInlineIndex: false });

      expect(result.action).toBe('selective_reindex');
      expect(result.freshness).toBe('stale');
      expect(result.inlineIndexPerformed).toBe(false);
      expect(result.files).toEqual(['/tmp/test-root/stale.ts']);
      expect(result.reason).toContain('inline auto-index skipped for read path');
      expect(mocks.indexFilesMock).not.toHaveBeenCalled();
    });

    it('performs selective inline reindex for small stale sets when allowed', async () => {
      mocks.getDbMock.mockReturnValue(createDbWithNodeCount(1));
      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/stale.ts']);
      mocks.ensureFreshFilesMock
        .mockReturnValueOnce({ fresh: [], stale: ['/tmp/test-root/stale.ts'] })
        .mockReturnValueOnce({ fresh: ['/tmp/test-root/stale.ts'], stale: [] });

      const { ensureCodeGraphReady } = await import('../code_graph/lib/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root', {
        allowInlineIndex: true,
        allowInlineFullScan: false,
      });

      expect(result.action).toBe('none');
      expect(result.freshness).toBe('fresh');
      expect(result.inlineIndexPerformed).toBe(true);
      expect(result.files).toBeUndefined();
      expect(result.reason).toBe('all tracked files are up-to-date');
      expect(mocks.indexFilesMock).toHaveBeenCalledTimes(1);
      expect(mocks.setLastDetectorProvenanceMock).toHaveBeenCalledWith('structured');
    });

    it('allows selective inline reindex after git HEAD changes when the stale set is small', async () => {
      const newHead = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
      mocks.getDbMock.mockReturnValue(createDbWithNodeCount(1));
      mocks.getLastGitHeadMock
        .mockReturnValueOnce('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        .mockReturnValue(newHead);
      mocks.execSyncMock.mockReturnValue(`${newHead}\n`);
      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/stale.ts']);
      mocks.ensureFreshFilesMock
        .mockReturnValueOnce({ fresh: [], stale: ['/tmp/test-root/stale.ts'] })
        .mockReturnValueOnce({ fresh: ['/tmp/test-root/stale.ts'], stale: [] });

      const { ensureCodeGraphReady } = await import('../code_graph/lib/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root', {
        allowInlineIndex: true,
        allowInlineFullScan: false,
      });

      expect(result.action).toBe('none');
      expect(result.freshness).toBe('fresh');
      expect(result.inlineIndexPerformed).toBe(true);
      expect(result.files).toBeUndefined();
      expect(result.reason).toBe('all tracked files are up-to-date');
      expect(mocks.indexFilesMock).toHaveBeenCalledTimes(1);
      expect(mocks.setLastDetectorProvenanceMock).toHaveBeenCalledWith('structured');
      expect(mocks.setLastGitHeadMock).toHaveBeenCalledWith(newHead);
    });

    it('keeps git HEAD drift as full-scan territory when tracked files look up-to-date on disk', async () => {
      mocks.getDbMock.mockReturnValue(createDbWithNodeCount(1));
      mocks.getLastGitHeadMock.mockReturnValue('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
      mocks.execSyncMock.mockReturnValue('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\n');
      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/fresh.ts']);
      mocks.ensureFreshFilesMock.mockReturnValue({ fresh: ['/tmp/test-root/fresh.ts'], stale: [] });

      const { ensureCodeGraphReady } = await import('../code_graph/lib/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root', {
        allowInlineIndex: true,
        allowInlineFullScan: false,
      });

      expect(result.action).toBe('full_scan');
      expect(result.freshness).toBe('stale');
      expect(result.inlineIndexPerformed).toBe(false);
      expect(result.reason).toContain('git HEAD changed: aaaaaaaa -> bbbbbbbb');
      expect(result.reason).toContain('tracked files appear up-to-date on disk');
      expect(result.reason).toContain('inline full scan skipped for read path');
      expect(mocks.indexFilesMock).not.toHaveBeenCalled();
    });

    it('refuses inline full scan for read paths even when inline selective refresh is enabled', async () => {
      const staleFiles = Array.from({ length: 51 }, (_, index) => `/tmp/test-root/stale-${index}.ts`);
      mocks.getDbMock.mockReturnValue(createDbWithNodeCount(1));
      mocks.getTrackedFilesMock.mockReturnValue(staleFiles);
      mocks.ensureFreshFilesMock.mockReturnValue({ fresh: [], stale: staleFiles });

      const { ensureCodeGraphReady } = await import('../code_graph/lib/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root', {
        allowInlineIndex: true,
        allowInlineFullScan: false,
      });

      expect(result.action).toBe('full_scan');
      expect(result.freshness).toBe('stale');
      expect(result.inlineIndexPerformed).toBe(false);
      expect(result.reason).toContain('inline full scan skipped for read path');
      expect(mocks.indexFilesMock).not.toHaveBeenCalled();
    });
  });

  describe('getGraphFreshness', () => {
    it('returns a valid GraphFreshness value', async () => {
      const { getGraphFreshness } = await import('../code_graph/lib/ensure-ready.js');
      const freshness = getGraphFreshness('/tmp/test-root');

      expect(['fresh', 'stale', 'empty']).toContain(freshness);
    });
  });
});
