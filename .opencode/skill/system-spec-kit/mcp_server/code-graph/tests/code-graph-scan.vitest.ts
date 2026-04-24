// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Scan Tests
// ───────────────────────────────────────────────────────────────

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  execSyncMock: vi.fn(),
  existsSyncMock: vi.fn(),
  realpathSyncMock: vi.fn(),
  indexFilesMock: vi.fn(),
  getLastGitHeadMock: vi.fn(),
  setLastDetectorProvenanceMock: vi.fn(),
  setLastDetectorProvenanceSummaryMock: vi.fn(),
  setLastGraphEdgeEnrichmentSummaryMock: vi.fn(),
  clearLastGraphEdgeEnrichmentSummaryMock: vi.fn(),
  setLastGitHeadMock: vi.fn(),
  isFileStaleMock: vi.fn(),
  upsertFileMock: vi.fn(),
  replaceNodesMock: vi.fn(),
  replaceEdgesMock: vi.fn(),
  removeFileMock: vi.fn(),
  getTrackedFilesMock: vi.fn(),
  getStatsMock: vi.fn(),
}));

function withPreParseSkippedCount<T>(
  results: T[],
  preParseSkippedCount = 0,
): T[] & { preParseSkippedCount: number } {
  return Object.assign(results, { preParseSkippedCount });
}

vi.mock('node:child_process', () => ({
  execSync: mocks.execSyncMock,
}));

vi.mock('node:fs', () => ({
  existsSync: mocks.existsSyncMock,
  realpathSync: mocks.realpathSyncMock,
}));

vi.mock('../lib/structural-indexer.js', () => ({
  indexFiles: mocks.indexFilesMock,
}));

vi.mock('../lib/code-graph-db.js', () => ({
  getLastGitHead: mocks.getLastGitHeadMock,
  setLastDetectorProvenance: mocks.setLastDetectorProvenanceMock,
  setLastDetectorProvenanceSummary: mocks.setLastDetectorProvenanceSummaryMock,
  setLastGraphEdgeEnrichmentSummary: mocks.setLastGraphEdgeEnrichmentSummaryMock,
  clearLastGraphEdgeEnrichmentSummary: mocks.clearLastGraphEdgeEnrichmentSummaryMock,
  setLastGitHead: mocks.setLastGitHeadMock,
  isFileStale: mocks.isFileStaleMock,
  upsertFile: mocks.upsertFileMock,
  replaceNodes: mocks.replaceNodesMock,
  replaceEdges: mocks.replaceEdgesMock,
  removeFile: mocks.removeFileMock,
  getTrackedFiles: mocks.getTrackedFilesMock,
  getStats: mocks.getStatsMock,
}));

import { handleCodeGraphScan } from '../handlers/scan.js';

describe('handleCodeGraphScan', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.execSyncMock.mockReturnValue('new-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('old-head');
    mocks.isFileStaleMock.mockReturnValue(false);
    mocks.existsSyncMock.mockReturnValue(true);
    mocks.realpathSyncMock.mockImplementation((path: string) => path);
    mocks.upsertFileMock.mockReturnValue(1);
    mocks.getTrackedFilesMock.mockReturnValue(['/workspace/removed.ts']);
    mocks.getStatsMock.mockReturnValue({
      lastScanTimestamp: '2026-04-17T00:00:00.000Z',
      graphQualitySummary: {
        detectorProvenanceSummary: null,
        graphEdgeEnrichmentSummary: null,
      },
    });
    mocks.indexFilesMock.mockResolvedValue(withPreParseSkippedCount([{
      filePath: '/workspace/current.ts',
      language: 'typescript',
      contentHash: 'hash-1',
      nodes: [{
        symbolId: 'current::symbol',
      }],
      edges: [],
      detectorProvenance: 'structured',
      parseHealth: 'clean',
      parseDurationMs: 10,
      parseErrors: [],
    }]));
  });

  it('forces a full reindex when git HEAD changes', async () => {
    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: true,
    });

    const payload = JSON.parse(response.content[0].text) as {
      status: string;
      data: {
        filesIndexed: number;
        filesSkipped: number;
        fullReindexTriggered: boolean;
        currentGitHead: string | null;
        previousGitHead: string | null;
        canonicalReadiness: string;
        trustState: string;
        lastPersistedAt: string | null;
        detectorProvenanceSummary: {
          dominant: string;
          counts: Record<string, number>;
        };
      };
    };

    expect(payload.status).toBe('ok');
    expect(payload.data.filesIndexed).toBe(1);
    expect(payload.data.filesSkipped).toBe(0);
    expect(payload.data.fullReindexTriggered).toBe(true);
    expect(payload.data.previousGitHead).toBe('old-head');
    expect(payload.data.currentGitHead).toBe('new-head');
    expect(payload.data.canonicalReadiness).toBe('ready');
    expect(payload.data.trustState).toBe('live');
    expect(payload.data.lastPersistedAt).toBe('2026-04-17T00:00:00.000Z');
    expect(mocks.execSyncMock).toHaveBeenCalledWith('git rev-parse HEAD', expect.objectContaining({
      cwd: process.cwd(),
      encoding: 'utf-8',
    }));
    expect(mocks.removeFileMock).toHaveBeenCalledWith('/workspace/removed.ts');
    expect(mocks.isFileStaleMock).not.toHaveBeenCalled();
    expect(mocks.upsertFileMock).toHaveBeenCalled();
    expect(payload.data.detectorProvenanceSummary).toEqual({
      dominant: 'structured',
      counts: {
        structured: 1,
      },
    });
    expect(mocks.setLastDetectorProvenanceMock).toHaveBeenCalledWith('structured');
    expect(mocks.setLastDetectorProvenanceSummaryMock).toHaveBeenCalledWith({
      dominant: 'structured',
      counts: {
        structured: 1,
      },
    });
    expect(mocks.setLastGitHeadMock).toHaveBeenCalledWith('new-head');
  });

  it('clears the persisted edge-enrichment summary when a later scan reports no summary', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.isFileStaleMock.mockReturnValue(true);
    mocks.indexFilesMock
      .mockResolvedValueOnce(withPreParseSkippedCount([{
        filePath: '/workspace/current.ts',
        language: 'typescript',
        contentHash: 'hash-1',
        nodes: [{ symbolId: 'current::symbol' }],
        edges: [{
          sourceId: 'current::symbol',
          targetId: 'dep::symbol',
          edgeType: 'CALLS',
          weight: 1,
          metadata: { confidence: 0.95, detectorProvenance: 'structured', evidenceClass: 'EXTRACTED' },
        }],
        detectorProvenance: 'structured',
        parseHealth: 'clean',
        parseDurationMs: 10,
        parseErrors: [],
      }]))
      .mockResolvedValueOnce(withPreParseSkippedCount([{
        filePath: '/workspace/current.ts',
        language: 'typescript',
        contentHash: 'hash-2',
        nodes: [{ symbolId: 'current::symbol' }],
        edges: [{
          sourceId: 'current::symbol',
          targetId: 'dep::symbol',
          edgeType: 'CALLS',
          weight: 1,
          metadata: {},
        }],
        detectorProvenance: 'structured',
        parseHealth: 'clean',
        parseDurationMs: 10,
        parseErrors: [],
      }]));

    await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: true,
    });
    await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: true,
    });

    expect(mocks.setLastGraphEdgeEnrichmentSummaryMock).toHaveBeenCalledWith({
      edgeEvidenceClass: 'direct_call',
      numericConfidence: 0.95,
    });
    expect(mocks.clearLastGraphEdgeEnrichmentSummaryMock).toHaveBeenCalledTimes(1);
  });

  it('preserves persisted summaries for no-op incremental scans that skip fresh files before parse', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.indexFilesMock.mockImplementationOnce(async (_config, options) => {
      expect(options).toEqual({ skipFreshFiles: true });
      return withPreParseSkippedCount([], 3);
    });

    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: true,
    });

    const payload = JSON.parse(response.content[0].text) as {
      status: string;
      data: {
        filesScanned: number;
        filesIndexed: number;
        filesSkipped: number;
        graphEdgeEnrichmentSummary: null;
      };
    };

    expect(payload.status).toBe('ok');
    expect(payload.data.filesScanned).toBe(0);
    expect(payload.data.filesIndexed).toBe(0);
    expect(payload.data.filesSkipped).toBe(3);
    expect(payload.data.graphEdgeEnrichmentSummary).toBeNull();
    expect(mocks.indexFilesMock).toHaveBeenCalledWith(expect.any(Object), { skipFreshFiles: true });
    expect(mocks.isFileStaleMock).not.toHaveBeenCalled();
    expect(mocks.setLastGraphEdgeEnrichmentSummaryMock).not.toHaveBeenCalled();
    expect(mocks.clearLastGraphEdgeEnrichmentSummaryMock).not.toHaveBeenCalled();
  });

  it('removes deleted tracked files during incremental scans', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.getTrackedFilesMock.mockReturnValue(['/workspace/current.ts', '/workspace/deleted.ts']);
    mocks.existsSyncMock.mockImplementation((filePath: string) => filePath !== '/workspace/deleted.ts');

    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: true,
    });

    const payload = JSON.parse(response.content[0].text) as {
      status: string;
      data: {
        filesIndexed: number;
        filesSkipped: number;
        fullReindexTriggered: boolean;
      };
    };

    expect(payload.status).toBe('ok');
    expect(payload.data.filesIndexed).toBe(0);
    expect(payload.data.filesSkipped).toBe(1);
    expect(payload.data.fullReindexTriggered).toBe(false);
    expect(mocks.removeFileMock).toHaveBeenCalledWith('/workspace/deleted.ts');
    expect(mocks.upsertFileMock).not.toHaveBeenCalled();
  });
});
