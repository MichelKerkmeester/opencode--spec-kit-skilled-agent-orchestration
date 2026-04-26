// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Scan Tests
// ───────────────────────────────────────────────────────────────

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  execSyncMock: vi.fn(),
  existsSyncMock: vi.fn(),
  realpathSyncMock: vi.fn(),
  indexFilesMock: vi.fn(),
  executeBatteryMock: vi.fn(),
  loadGoldBatteryMock: vi.fn(),
  getCodeGraphMetadataMock: vi.fn(),
  getGraphFreshnessMock: vi.fn(),
  getLastGitHeadMock: vi.fn(),
  getLastGoldVerificationMock: vi.fn(),
  persistIndexedFileResultMock: vi.fn(),
  setCodeGraphMetadataMock: vi.fn(),
  setLastDetectorProvenanceMock: vi.fn(),
  setLastDetectorProvenanceSummaryMock: vi.fn(),
  setLastGraphEdgeEnrichmentSummaryMock: vi.fn(),
  clearLastGraphEdgeEnrichmentSummaryMock: vi.fn(),
  setLastGitHeadMock: vi.fn(),
  setLastGoldVerificationMock: vi.fn(),
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

vi.mock('../lib/gold-query-verifier.js', () => ({
  executeBattery: mocks.executeBatteryMock,
  loadGoldBattery: mocks.loadGoldBatteryMock,
}));

vi.mock('../lib/ensure-ready.js', () => ({
  getGraphFreshness: mocks.getGraphFreshnessMock,
  persistIndexedFileResult: mocks.persistIndexedFileResultMock,
}));

vi.mock('../lib/code-graph-db.js', () => ({
  getLastGitHead: mocks.getLastGitHeadMock,
  getCodeGraphMetadata: mocks.getCodeGraphMetadataMock,
  getLastGoldVerification: mocks.getLastGoldVerificationMock,
  setCodeGraphMetadata: mocks.setCodeGraphMetadataMock,
  setLastDetectorProvenance: mocks.setLastDetectorProvenanceMock,
  setLastDetectorProvenanceSummary: mocks.setLastDetectorProvenanceSummaryMock,
  setLastGraphEdgeEnrichmentSummary: mocks.setLastGraphEdgeEnrichmentSummaryMock,
  clearLastGraphEdgeEnrichmentSummary: mocks.clearLastGraphEdgeEnrichmentSummaryMock,
  setLastGitHead: mocks.setLastGitHeadMock,
  setLastGoldVerification: mocks.setLastGoldVerificationMock,
  isFileStale: mocks.isFileStaleMock,
  upsertFile: mocks.upsertFileMock,
  replaceNodes: mocks.replaceNodesMock,
  replaceEdges: mocks.replaceEdgesMock,
  removeFile: mocks.removeFileMock,
  getTrackedFiles: mocks.getTrackedFilesMock,
  getStats: mocks.getStatsMock,
}));

import { handleCodeGraphScan } from '../handlers/scan.js';
import { handleCodeGraphStatus } from '../handlers/status.js';

describe('handleCodeGraphScan', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.execSyncMock.mockReturnValue('new-head\n');
    mocks.executeBatteryMock.mockResolvedValue({
      batteryPath: '<in-memory>',
      queryCount: 1,
      pass_policy: {
        overall_pass_rate: 0.9,
        edge_focus_pass_rate: 0.8,
      },
      overall_pass_rate: 1,
      edge_focus_pass_rate: 1,
      overallPassRate: 1,
      categoryPassRates: {
        'mcp-tool': 1,
      },
      missingSymbols: [],
      unexpectedErrors: [],
      passed: true,
      probes: [],
    });
    mocks.loadGoldBatteryMock.mockReturnValue({
      schema_version: 1,
      pass_policy: {
        overall_pass_rate: 0.9,
        edge_focus_pass_rate: 0.8,
      },
      queries: [],
    });
    mocks.getCodeGraphMetadataMock.mockReturnValue(null);
    mocks.getGraphFreshnessMock.mockReturnValue('fresh');
    mocks.getLastGitHeadMock.mockReturnValue('old-head');
    mocks.getLastGoldVerificationMock.mockReturnValue(null);
    mocks.isFileStaleMock.mockReturnValue(false);
    mocks.existsSyncMock.mockReturnValue(true);
    mocks.realpathSyncMock.mockImplementation((path: string) => path);
    mocks.upsertFileMock.mockReturnValue(1);
    mocks.persistIndexedFileResultMock.mockImplementation((result) => {
      const fileId = mocks.upsertFileMock(
        result.filePath,
        result.language,
        result.contentHash,
        result.nodes.length,
        result.edges.length,
        result.parseHealth,
        result.parseDurationMs,
        { fileMtimeMs: 0 },
      );
      mocks.replaceNodesMock(fileId, result.nodes);
      mocks.replaceEdgesMock(result.nodes.map((node: { symbolId: string }) => node.symbolId), result.edges);
      mocks.upsertFileMock(
        result.filePath,
        result.language,
        result.contentHash,
        result.nodes.length,
        result.edges.length,
        result.parseHealth,
        result.parseDurationMs,
      );
    });
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

  it('optionally runs verification for explicit full scans and attaches the result', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');

    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: false,
      verify: true,
    });

    const payload = JSON.parse(response.content[0].text) as {
      status: string;
      data: {
        verification: {
          batteryPath: string;
          passed: boolean;
        };
      };
    };

    expect(payload.status).toBe('ok');
    expect(payload.data.verification).toEqual(expect.objectContaining({
      passed: true,
      batteryPath: expect.stringContaining('code-graph-gold-queries.json'),
    }));
    expect(mocks.loadGoldBatteryMock).toHaveBeenCalledWith(expect.stringContaining('code-graph-gold-queries.json'));
    expect(mocks.executeBatteryMock).toHaveBeenCalledWith(
      mocks.loadGoldBatteryMock.mock.results[0]?.value,
      expect.any(Function),
    );
    expect(mocks.setLastGoldVerificationMock).toHaveBeenCalledWith(payload.data.verification);
  });

  it('does not run verification for incremental scans even when verify is requested', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');

    await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: true,
      verify: true,
    });

    expect(mocks.loadGoldBatteryMock).not.toHaveBeenCalled();
    expect(mocks.executeBatteryMock).not.toHaveBeenCalled();
    expect(mocks.setLastGoldVerificationMock).not.toHaveBeenCalled();
  });

  it('reseeds the edge distribution baseline on a full scan when the persisted baseline metadata is malformed', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.getCodeGraphMetadataMock.mockReturnValue('{malformed');
    mocks.indexFilesMock.mockResolvedValue(withPreParseSkippedCount([{
      filePath: '/workspace/current.ts',
      language: 'typescript',
      contentHash: 'hash-1',
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
      incremental: false,
    });

    expect(mocks.setCodeGraphMetadataMock).toHaveBeenCalledWith(
      'edge_distribution_baseline',
      expect.any(String),
    );

    const persistedBaseline = mocks.setCodeGraphMetadataMock.mock.calls.find(
      ([key]) => key === 'edge_distribution_baseline',
    )?.[1];
    expect(JSON.parse(persistedBaseline)).toMatchObject({
      CALLS: 1,
    });
  });

  it('persists a full-scan edge baseline and surfaces the next drift summary in status', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.indexFilesMock.mockResolvedValue(withPreParseSkippedCount([{
      filePath: '/workspace/current.ts',
      language: 'typescript',
      contentHash: 'hash-1',
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
      incremental: false,
    });

    const persistedBaseline = mocks.setCodeGraphMetadataMock.mock.calls.find(
      ([key]) => key === 'edge_distribution_baseline',
    )?.[1];
    expect(persistedBaseline).toBeDefined();

    mocks.getCodeGraphMetadataMock.mockImplementation((key: string) => (
      key === 'edge_distribution_baseline' ? persistedBaseline : null
    ));
    mocks.getStatsMock.mockReturnValue({
      totalFiles: 1,
      totalNodes: 1,
      totalEdges: 2,
      nodesByKind: { function: 1 },
      edgesByType: { CALLS: 1, IMPORTS: 1 },
      parseHealthSummary: { clean: 1 },
      lastScanTimestamp: '2026-04-17T00:00:00.000Z',
      lastGitHead: 'same-head',
      dbFileSize: 1024,
      schemaVersion: 1,
      graphQualitySummary: {
        detectorProvenanceSummary: null,
        graphEdgeEnrichmentSummary: null,
      },
    });

    const response = await handleCodeGraphStatus();
    const payload = JSON.parse(response.content[0].text) as {
      status: string;
      data: {
        edgeDriftSummary: {
          share_drift: Record<string, number>;
          psi: number;
          jsd: number;
          flagged: boolean;
        };
      };
    };

    expect(payload.status).toBe('ok');
    expect(payload.data.edgeDriftSummary).toMatchObject({
      flagged: true,
    });
    expect(payload.data.edgeDriftSummary.share_drift.CALLS).toBeCloseTo(-0.5);
    expect(payload.data.edgeDriftSummary.share_drift.IMPORTS).toBeCloseTo(0.5);
    expect(payload.data.edgeDriftSummary.psi).toBeGreaterThan(0);
    expect(payload.data.edgeDriftSummary.jsd).toBeGreaterThan(0);
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

  it('passes the parser content hash into stale checks during incremental scans', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.isFileStaleMock.mockReturnValue(true);

    await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: true,
    });

    expect(mocks.isFileStaleMock).toHaveBeenCalledWith('/workspace/current.ts', {
      currentContentHash: 'hash-1',
    });
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
