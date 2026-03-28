// ───────────────────────────────────────────────────────────────
// 1. HANDLER EVAL REPORTING TESTS
// ───────────────────────────────────────────────────────────────
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  AblationReport,
} from '../lib/eval/ablation-framework';
import type { DashboardReport } from '../lib/eval/reporting-dashboard';

const mocks = vi.hoisted(() => ({
  mockCheckDatabaseUpdated: vi.fn(),
  mockGetDb: vi.fn(),
  mockGetDbPath: vi.fn(),
  mockInitializeDb: vi.fn(),
  mockCloseDb: vi.fn(),
  mockInitHybridSearch: vi.fn(),
  mockHybridSearchEnhanced: vi.fn(),
  mockBm25Search: vi.fn(),
  mockFtsSearch: vi.fn(),
  mockGenerateQueryEmbedding: vi.fn(),
  mockVectorSearch: vi.fn(),
  mockCreateUnifiedGraphSearchFn: vi.fn(),
  mockIsAblationEnabled: vi.fn(),
  mockRunAblation: vi.fn(),
  mockStoreAblationResults: vi.fn(),
  mockFormatAblationReport: vi.fn(),
  mockToHybridSearchFlags: vi.fn(),
  mockAssertGroundTruthAlignment: vi.fn(),
  mockGenerateDashboardReport: vi.fn(),
  mockFormatReportJSON: vi.fn(),
  mockFormatReportText: vi.fn(),
}));

vi.mock('../core', () => ({
  checkDatabaseUpdated: mocks.mockCheckDatabaseUpdated,
}));

vi.mock('../lib/search/vector-index', () => ({
  getDb: mocks.mockGetDb,
  getDbPath: mocks.mockGetDbPath,
  initializeDb: mocks.mockInitializeDb,
  closeDb: mocks.mockCloseDb,
  vectorSearch: mocks.mockVectorSearch,
}));

vi.mock('../lib/search/hybrid-search', () => ({
  init: mocks.mockInitHybridSearch,
  hybridSearchEnhanced: mocks.mockHybridSearchEnhanced,
  bm25Search: mocks.mockBm25Search,
  ftsSearch: mocks.mockFtsSearch,
}));

vi.mock('../lib/providers/embeddings', () => ({
  generateQueryEmbedding: mocks.mockGenerateQueryEmbedding,
}));

vi.mock('../lib/search/graph-search-fn', () => ({
  createUnifiedGraphSearchFn: mocks.mockCreateUnifiedGraphSearchFn,
  computeDegreeScores: vi.fn(() => new Map()),
}));

vi.mock('../lib/eval/ablation-framework', async () => {
  const actual =
    await vi.importActual<typeof import('../lib/eval/ablation-framework')>(
      '../lib/eval/ablation-framework'
    );
  return {
    ...actual,
    isAblationEnabled: mocks.mockIsAblationEnabled,
    runAblation: mocks.mockRunAblation,
    storeAblationResults: mocks.mockStoreAblationResults,
    formatAblationReport: mocks.mockFormatAblationReport,
    toHybridSearchFlags: mocks.mockToHybridSearchFlags,
    assertGroundTruthAlignment: mocks.mockAssertGroundTruthAlignment,
  };
});

vi.mock('../lib/eval/reporting-dashboard', async () => {
  const actual =
    await vi.importActual<typeof import('../lib/eval/reporting-dashboard')>(
      '../lib/eval/reporting-dashboard'
    );
  return {
    ...actual,
    generateDashboardReport: mocks.mockGenerateDashboardReport,
    formatReportJSON: mocks.mockFormatReportJSON,
    formatReportText: mocks.mockFormatReportText,
  };
});

import { ALL_CHANNELS } from '../lib/eval/ablation-framework';
import * as evalReporting from '../handlers/eval-reporting';

type EvalHandlerResponse =
  Awaited<ReturnType<typeof evalReporting.handleEvalReportingDashboard>>;
type RunAblationArgs = Parameters<typeof evalReporting.handleEvalRunAblation>[0];

function makeAblationReport(
  overrides: Partial<AblationReport> = {},
): AblationReport {
  return {
    timestamp: '2026-01-01T00:00:00.000Z',
    runId: 'ablation-test-run',
    config: {
      channels: ['vector'],
    },
    results: [
      {
        channel: 'vector',
        baselineRecall20: 0.82,
        ablatedRecall20: 0.74,
        delta: -0.08,
        pValue: 0.03,
        queriesChannelHelped: 4,
        queriesChannelHurt: 1,
        queriesUnchanged: 1,
        queryCount: 6,
      },
    ],
    overallBaselineRecall: 0.82,
    durationMs: 25,
    ...overrides,
  };
}

function makeDashboardReport(
  overrides: Partial<DashboardReport> = {},
): DashboardReport {
  return {
    generatedAt: '2026-01-01T00:00:00.000Z',
    totalEvalRuns: 3,
    totalSnapshots: 9,
    sprints: [],
    trends: [],
    summary: 'Dashboard summary',
    ...overrides,
  };
}

function parseEnvelope(response: EvalHandlerResponse): Record<string, unknown> {
  return JSON.parse(response.content[0].text) as Record<string, unknown>;
}

function getData(envelope: Record<string, unknown>): Record<string, unknown> {
  const data = envelope.data;
  expect(data).toBeDefined();
  expect(typeof data).toBe('object');
  return data as Record<string, unknown>;
}

describe('Handler Eval Reporting (007-evaluation)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.SPECKIT_EVAL_DB_PATH;
    delete process.env.MEMORY_DB_PATH;

    mocks.mockCheckDatabaseUpdated.mockResolvedValue(false);
    mocks.mockGetDb.mockReturnValue({ prepare: vi.fn() });
    mocks.mockGetDbPath.mockReturnValue('/tmp/test-context-index.sqlite');
    mocks.mockInitializeDb.mockReturnValue({ prepare: vi.fn() });
    mocks.mockCloseDb.mockImplementation(() => undefined);
    mocks.mockInitHybridSearch.mockImplementation(() => undefined);
    mocks.mockHybridSearchEnhanced.mockResolvedValue([]);
    mocks.mockBm25Search.mockReturnValue([]);
    mocks.mockFtsSearch.mockReturnValue([]);
    mocks.mockGenerateQueryEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);
    mocks.mockVectorSearch.mockReturnValue([]);
    mocks.mockCreateUnifiedGraphSearchFn.mockReturnValue(vi.fn(() => []));
    mocks.mockIsAblationEnabled.mockReturnValue(true);
    mocks.mockRunAblation.mockResolvedValue(makeAblationReport());
    mocks.mockStoreAblationResults.mockReturnValue(true);
    mocks.mockFormatAblationReport.mockReturnValue('formatted ablation report');
    mocks.mockToHybridSearchFlags.mockReturnValue({
      useVector: true,
      useBm25: true,
      useFts: true,
      useGraph: true,
      useTrigger: true,
    });
    mocks.mockAssertGroundTruthAlignment.mockReturnValue({
      totalQueries: 1,
      totalRelevances: 1,
      uniqueMemoryIds: 1,
      parentRelevanceCount: 1,
      chunkRelevanceCount: 0,
      missingRelevanceCount: 0,
      parentMemoryCount: 1,
      chunkMemoryCount: 0,
      missingMemoryCount: 0,
      chunkExamples: [],
      missingExamples: [],
    });
    mocks.mockGenerateDashboardReport.mockResolvedValue(makeDashboardReport());
    mocks.mockFormatReportJSON.mockReturnValue('{"format":"json"}');
    mocks.mockFormatReportText.mockReturnValue('dashboard text report');
  });

  describe('Exports', () => {
    it('T005-E1: handleEvalReportingDashboard is exported', () => {
      expect(typeof evalReporting.handleEvalReportingDashboard).toBe('function');
    });

    it('T005-E2: handleEvalRunAblation is exported', () => {
      expect(typeof evalReporting.handleEvalRunAblation).toBe('function');
    });

    it('T005-E3: handle_eval_reporting_dashboard alias exported', () => {
      expect(typeof evalReporting.handle_eval_reporting_dashboard).toBe('function');
    });

    it('T005-E4: handle_eval_run_ablation alias exported', () => {
      expect(typeof evalReporting.handle_eval_run_ablation).toBe('function');
    });
  });

  describe('T006: Ablation Handler', () => {
    it('T006-A1: throws when ablation disabled', async () => {
      const original = process.env.SPECKIT_ABLATION;
      delete process.env.SPECKIT_ABLATION;
      mocks.mockIsAblationEnabled.mockReturnValue(false);

      try {
        await expect(
          evalReporting.handleEvalRunAblation({})
        ).rejects.toThrow(/disabled|SPECKIT_ABLATION/i);
        expect(mocks.mockRunAblation).not.toHaveBeenCalled();
      } finally {
        if (original === undefined) {
          delete process.env.SPECKIT_ABLATION;
        } else {
          process.env.SPECKIT_ABLATION = original;
        }
      }
    });

    it('T006-A2: normalizeChannels returns ALL_CHANNELS for empty/invalid input', async () => {
      await evalReporting.handleEvalRunAblation({ channels: [] });
      const firstCall = mocks.mockRunAblation.mock.calls[0];
      expect(firstCall[1].channels).toEqual(ALL_CHANNELS);

      const invalidChannels = ['invalid-channel'] as unknown as RunAblationArgs['channels'];
      await evalReporting.handleEvalRunAblation({ channels: invalidChannels });
      const secondCall = mocks.mockRunAblation.mock.calls[1];
      expect(secondCall[1].channels).toEqual(ALL_CHANNELS);
    });

    it('T006-A3: normalizeChannels filters valid channels only', async () => {
      const mixedChannels =
        ['vector', 'not-real', 'fts5'] as unknown as RunAblationArgs['channels'];
      await evalReporting.handleEvalRunAblation({ channels: mixedChannels });

      const call = mocks.mockRunAblation.mock.calls[0];
      expect(call[1].channels).toEqual(['vector', 'fts5']);
    });

    it('T006-A4: recallK defaults to 20 when not provided', async () => {
      await evalReporting.handleEvalRunAblation({ channels: ['vector'] });

      const call = mocks.mockRunAblation.mock.calls[0];
      expect(call[1].recallK).toBe(20);
    });

    it('T006-A5: recallK is clamped to >= 1', async () => {
      await evalReporting.handleEvalRunAblation({ channels: ['vector'], recallK: 0 });

      const call = mocks.mockRunAblation.mock.calls[0];
      expect(call[1].recallK).toBe(1);
    });

    it('T006-A6: throws when DB is not initialized', async () => {
      mocks.mockGetDb.mockReturnValue(null);

      await expect(
        evalReporting.handleEvalRunAblation({ channels: ['vector'] })
      ).rejects.toThrow(/database not initialized/i);
      expect(mocks.mockRunAblation).not.toHaveBeenCalled();
    });

    it('T006-A7: throws when runAblation returns null report', async () => {
      mocks.mockRunAblation.mockResolvedValueOnce(null);

      await expect(
        evalReporting.handleEvalRunAblation({ channels: ['vector'] })
      ).rejects.toThrow(/no report/i);
    });

    it('T006-A8: storeResults=false skips persistence', async () => {
      const result = await evalReporting.handleEvalRunAblation({
        channels: ['vector'],
        storeResults: false,
      });

      expect(mocks.mockStoreAblationResults).not.toHaveBeenCalled();
      const envelope = parseEnvelope(result);
      const data = getData(envelope);
      expect(data.stored).toBe(false);
      const hints = envelope.hints as string[];
      expect(hints.some((h: string) => /not persisted/i.test(h))).toBe(true);
    });

    it('T006-A9: includeFormattedReport=false omits formatted report', async () => {
      const result = await evalReporting.handleEvalRunAblation({
        channels: ['vector'],
        includeFormattedReport: false,
      });

      expect(mocks.mockFormatAblationReport).not.toHaveBeenCalled();
      const envelope = parseEnvelope(result);
      const data = getData(envelope);
      expect(data.formattedReport).toBeUndefined();
    });

    it('T006-A10: ablation search forces all channels and wires graph search', async () => {
      mocks.mockHybridSearchEnhanced.mockResolvedValueOnce([
        { id: 11, parentMemoryId: 99, score: 0.91 },
      ]);

      await evalReporting.handleEvalRunAblation({ channels: ['graph'] });

      expect(mocks.mockAssertGroundTruthAlignment).toHaveBeenCalledWith(
        mocks.mockGetDb.mock.results[0].value,
        {
          dbPath: '/tmp/test-context-index.sqlite',
          context: 'eval_run_ablation',
        },
      );
      expect(mocks.mockCreateUnifiedGraphSearchFn).toHaveBeenCalledTimes(1);
      expect(mocks.mockInitHybridSearch).toHaveBeenCalledWith(
        mocks.mockGetDb.mock.results[0].value,
        mocks.mockVectorSearch,
        expect.any(Function),
      );

      const searchFn = mocks.mockRunAblation.mock.calls[0]?.[0];
      expect(typeof searchFn).toBe('function');

      const results = await searchFn('graph-heavy query', new Set());

      expect(mocks.mockHybridSearchEnhanced).toHaveBeenCalledWith(
        'graph-heavy query',
        [0.1, 0.2, 0.3],
        expect.objectContaining({
          forceAllChannels: true,
          evaluationMode: true,
        }),
      );
      expect(results).toEqual([
        {
          memoryId: 99,
          score: 0.91,
          rank: 1,
        },
      ]);
    });

    it('T006-A10b: SPECKIT_EVAL_DB_PATH temporarily swaps the ablation DB and restores MEMORY_DB_PATH', async () => {
      const originalMemoryDbPath = '/tmp/original-context-index.sqlite';
      const overrideDbPath = '/tmp/eval-context-index.sqlite';
      const originalDb = { prepare: vi.fn(), name: 'original-db' };
      const overrideDb = { prepare: vi.fn(), name: 'override-db' };

      process.env.MEMORY_DB_PATH = originalMemoryDbPath;
      process.env.SPECKIT_EVAL_DB_PATH = overrideDbPath;

      mocks.mockGetDb.mockReturnValue(originalDb);
      mocks.mockGetDbPath
        .mockReturnValueOnce(originalMemoryDbPath)
        .mockReturnValueOnce(overrideDbPath);
      mocks.mockInitializeDb
        .mockReturnValueOnce(overrideDb)
        .mockReturnValueOnce(originalDb);

      await evalReporting.handleEvalRunAblation({ channels: ['vector'] });

      expect(mocks.mockCloseDb).toHaveBeenCalledTimes(2);
      expect(mocks.mockInitializeDb).toHaveBeenNthCalledWith(1);
      expect(mocks.mockAssertGroundTruthAlignment).toHaveBeenCalledWith(
        overrideDb,
        {
          dbPath: overrideDbPath,
          context: 'eval_run_ablation',
        },
      );
      expect(mocks.mockInitHybridSearch).toHaveBeenCalledWith(
        overrideDb,
        mocks.mockVectorSearch,
        expect.any(Function),
      );
      expect(mocks.mockInitializeDb).toHaveBeenNthCalledWith(2);
      expect(process.env.MEMORY_DB_PATH).toBe(originalMemoryDbPath);
    });

    it('T006-A11: mode=k_sensitivity forwards custom queries and uses raw channel lists', async () => {
      mocks.mockVectorSearch.mockReturnValue([{ id: 11, similarity: 0.92 }]);
      mocks.mockFtsSearch.mockReturnValue([{ id: 22, score: 0.88, source: 'fts' }]);
      mocks.mockBm25Search.mockReturnValue([{ id: 33, score: 0.76, source: 'bm25' }]);
      const graphSearch = vi.fn(() => [{ id: 44, score: 0.64 }]);
      mocks.mockCreateUnifiedGraphSearchFn.mockReturnValue(graphSearch);

      const result = await evalReporting.handleEvalRunAblation({
        mode: 'k_sensitivity',
        queries: ['hybrid retrieval graph diagnosis'],
        recallK: 7,
      });

      expect(mocks.mockRunAblation).not.toHaveBeenCalled();
      expect(graphSearch).toHaveBeenCalledWith('hybrid retrieval graph diagnosis', { limit: 7 });

      const envelope = parseEnvelope(result);
      const data = getData(envelope);
      expect(data.queriesUsed).toEqual(['hybrid retrieval graph diagnosis']);
      expect(data.report).toBeDefined();
    });

    it('T006-A12: mode=k_sensitivity aggregates multi-query metrics per query', async () => {
      mocks.mockGenerateQueryEmbedding.mockImplementation(async (query: string) =>
        query === 'query-one' ? [1] : [2]
      );
      mocks.mockVectorSearch.mockImplementation((embedding: number[]) =>
        embedding[0] === 1
          ? [{ id: 1, similarity: 0.92 }, { id: 2, similarity: 0.81 }]
          : [{ id: 3, similarity: 0.88 }, { id: 4, similarity: 0.77 }]
      );
      mocks.mockBm25Search.mockImplementation((query: string) =>
        query === 'query-one'
          ? [{ id: 1, score: 0.88, source: 'bm25' }, { id: 2, score: 0.72, source: 'bm25' }]
          : [{ id: 4, score: 0.86, source: 'bm25' }, { id: 3, score: 0.74, source: 'bm25' }]
      );

      const result = await evalReporting.handleEvalRunAblation({
        mode: 'k_sensitivity',
        queries: ['query-one', 'query-two'],
        recallK: 5,
      });

      const envelope = parseEnvelope(result);
      const data = getData(envelope);
      expect(data.queriesUsed).toEqual(['query-one', 'query-two']);
      expect(data.totalItems).toBe(4);

      const report = data.report as {
        grid: Array<{ k: number; mrr5: number; avgScore: number }>;
      };
      const k20 = report.grid.find((row) => row.k === 20);
      expect(k20?.mrr5).toBeCloseTo(0.75, 10);
      expect(k20?.avgScore).toBeCloseTo(0.75, 10);
    });
  });

  describe('T005: Dashboard Handler', () => {
    it('T005-D1: dashboard format defaults to text when not specified', async () => {
      const report = makeDashboardReport({ totalEvalRuns: 12 });
      mocks.mockGenerateDashboardReport.mockResolvedValueOnce(report);
      mocks.mockFormatReportText.mockReturnValueOnce('formatted text dashboard');

      const result = await evalReporting.handleEvalReportingDashboard({
        sprintFilter: ['Sprint-7'],
        channelFilter: ['vector'],
        metricFilter: ['recall@20'],
        limit: 5,
      });

      expect(mocks.mockCheckDatabaseUpdated).toHaveBeenCalledTimes(1);
      expect(mocks.mockGenerateDashboardReport).toHaveBeenCalledWith({
        sprintFilter: ['Sprint-7'],
        channelFilter: ['vector'],
        metricFilter: ['recall@20'],
        limit: 5,
      });
      expect(mocks.mockFormatReportText).toHaveBeenCalledWith(report);
      expect(mocks.mockFormatReportJSON).not.toHaveBeenCalled();

      const envelope = parseEnvelope(result);
      const data = getData(envelope);
      expect(data.format).toBe('text');
      expect(data.formatted).toBe('formatted text dashboard');
    });

    it('T005-D2: dashboard accepts json format parameter', async () => {
      const report = makeDashboardReport({ totalEvalRuns: 8 });
      mocks.mockGenerateDashboardReport.mockResolvedValueOnce(report);
      mocks.mockFormatReportJSON.mockReturnValueOnce('{"report":"json"}');

      const result = await evalReporting.handleEvalReportingDashboard({
        format: 'json',
      });

      expect(mocks.mockGenerateDashboardReport).toHaveBeenCalledWith({
        sprintFilter: undefined,
        channelFilter: undefined,
        metricFilter: undefined,
        limit: undefined,
      });
      expect(mocks.mockFormatReportJSON).toHaveBeenCalledWith(report);
      expect(mocks.mockFormatReportText).not.toHaveBeenCalled();

      const envelope = parseEnvelope(result);
      const data = getData(envelope);
      expect(data.format).toBe('json');
      expect(data.formatted).toBe('{"report":"json"}');
    });

    it('T005-D3: dashboard throws when DB is unavailable', async () => {
      mocks.mockGenerateDashboardReport.mockRejectedValueOnce(
        new Error('Database unavailable')
      );

      await expect(
        evalReporting.handleEvalReportingDashboard({})
      ).rejects.toThrow(/database|unavailable/i);
    });
  });
});
