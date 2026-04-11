import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => ({
  canonicalRows: new Map<string, Record<string, unknown>>(),
  hybridRows: [] as Array<Record<string, unknown>>,
}));

const mocks = vi.hoisted(() => ({
  assertGroundTruthAlignment: vi.fn(),
  bm25Search: vi.fn(),
  checkDatabaseUpdated: vi.fn(),
  closeDb: vi.fn(),
  computeDegreeScores: vi.fn(),
  createUnifiedGraphSearchFn: vi.fn(),
  ftsSearch: vi.fn(),
  formatAblationReport: vi.fn(),
  formatReportJSON: vi.fn(),
  formatReportText: vi.fn(),
  generateDashboardReport: vi.fn(),
  generateQueryEmbedding: vi.fn(),
  getCausalChain: vi.fn(),
  getDb: vi.fn(),
  getDbPath: vi.fn(),
  hybridSearchEnhanced: vi.fn(),
  initHybridSearch: vi.fn(),
  initializeDb: vi.fn(),
  isAblationEnabled: vi.fn(),
  runAblation: vi.fn(),
  storeAblationResults: vi.fn(),
  toHybridSearchFlags: vi.fn(),
  vectorSearch: vi.fn(),
}));

const fakeDb = vi.hoisted(() => ({
  prepare: (sql: string) => ({
    get: (firstArg: unknown) => {
      if (!sql.includes('FROM memory_index')) {
        return undefined;
      }

      return mockState.canonicalRows.get(String(firstArg));
    },
  }),
}));

vi.mock('../core', () => ({
  checkDatabaseUpdated: mocks.checkDatabaseUpdated,
}));

vi.mock('../lib/search/vector-index', () => ({
  closeDb: mocks.closeDb,
  getDb: mocks.getDb,
  getDbPath: mocks.getDbPath,
  initializeDb: mocks.initializeDb,
  vectorSearch: mocks.vectorSearch,
}));

vi.mock('../lib/search/hybrid-search', () => ({
  bm25Search: mocks.bm25Search,
  ftsSearch: mocks.ftsSearch,
  hybridSearchEnhanced: mocks.hybridSearchEnhanced,
  init: mocks.initHybridSearch,
}));

vi.mock('../lib/providers/embeddings', () => ({
  generateQueryEmbedding: mocks.generateQueryEmbedding,
}));

vi.mock('../lib/search/graph-search-fn', () => ({
  computeDegreeScores: mocks.computeDegreeScores,
  createUnifiedGraphSearchFn: mocks.createUnifiedGraphSearchFn,
}));

vi.mock('../lib/eval/ablation-framework', async () => {
  const actual =
    await vi.importActual<typeof import('../lib/eval/ablation-framework')>(
      '../lib/eval/ablation-framework'
    );
  return {
    ...actual,
    assertGroundTruthAlignment: mocks.assertGroundTruthAlignment,
    formatAblationReport: mocks.formatAblationReport,
    isAblationEnabled: mocks.isAblationEnabled,
    runAblation: mocks.runAblation,
    storeAblationResults: mocks.storeAblationResults,
    toHybridSearchFlags: mocks.toHybridSearchFlags,
  };
});

vi.mock('../lib/eval/reporting-dashboard', async () => {
  const actual =
    await vi.importActual<typeof import('../lib/eval/reporting-dashboard')>(
      '../lib/eval/reporting-dashboard'
    );
  return {
    ...actual,
    formatReportJSON: mocks.formatReportJSON,
    formatReportText: mocks.formatReportText,
    generateDashboardReport: mocks.generateDashboardReport,
  };
});

vi.mock('../lib/storage/causal-edges', async () => {
  const actual =
    await vi.importActual<typeof import('../lib/storage/causal-edges')>(
      '../lib/storage/causal-edges'
    );
  return {
    ...actual,
    getCausalChain: mocks.getCausalChain,
    init: vi.fn(),
  };
});

import * as causalGraph from '../handlers/causal-graph';
import * as evalReporting from '../handlers/eval-reporting';

function parseEnvelope(response: { content: Array<{ text: string }> }): Record<string, any> {
  return JSON.parse(response.content[0].text) as Record<string, any>;
}

function seedCanonicalRows(): void {
  mockState.canonicalRows = new Map([
    [
      '7001',
      {
        id: 7001,
        title: 'Gate D reader-ready spec doc',
        spec_folder:
          'system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/004-gate-d-reader-ready',
        importance_tier: 'important',
        importance_weight: 0.92,
        context_type: 'implementation',
        created_at: '2026-04-11T12:00:00Z',
        updated_at: '2026-04-11T12:05:00Z',
        file_path:
          '/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/004-gate-d-reader-ready/spec.md',
      },
    ],
    [
      '7002',
      {
        id: 7002,
        title: 'Gate D continuity summary',
        spec_folder:
          'system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/004-gate-d-reader-ready',
        importance_tier: 'important',
        created_at: '2026-04-11T12:06:00Z',
        file_path:
          '/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/004-gate-d-reader-ready/implementation-summary.md',
      },
    ],
    [
      '7003',
      {
        id: 7003,
        title: 'Gate D decision record',
        spec_folder:
          'system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/004-gate-d-reader-ready',
        importance_tier: 'important',
        created_at: '2026-04-11T12:07:00Z',
        file_path:
          '/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/004-gate-d-reader-ready/decision-record.md',
      },
    ],
  ]);
}

describe('Gate D regression ablation and drift', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SPECKIT_ABLATION = 'true';

    seedCanonicalRows();

    mockState.hybridRows = [
      {
        id: 81001,
        parentMemoryId: 7001,
        score: 0.97,
        documentType: 'spec_doc',
        source: 'spec-doc',
      },
      {
        id: 81002,
        parentMemoryId: 7002,
        score: 0.88,
        documentType: 'continuity',
        source: 'continuity',
      },
    ];

    mocks.assertGroundTruthAlignment.mockReturnValue({
      totalQueries: 1,
      totalRelevances: 2,
      uniqueMemoryIds: 2,
      parentRelevanceCount: 2,
      chunkRelevanceCount: 0,
      missingRelevanceCount: 0,
      parentMemoryCount: 2,
      chunkMemoryCount: 0,
      missingMemoryCount: 0,
      chunkExamples: [],
      missingExamples: [],
    });
    mocks.bm25Search.mockReturnValue([]);
    mocks.checkDatabaseUpdated.mockResolvedValue(false);
    mocks.closeDb.mockImplementation(() => undefined);
    mocks.computeDegreeScores.mockReturnValue(new Map());
    mocks.createUnifiedGraphSearchFn.mockReturnValue(vi.fn(() => []));
    mocks.ftsSearch.mockReturnValue([]);
    mocks.formatAblationReport.mockReturnValue('canonical ablation report');
    mocks.formatReportJSON.mockReturnValue('{"format":"json"}');
    mocks.formatReportText.mockReturnValue('dashboard text report');
    mocks.generateDashboardReport.mockResolvedValue({
      generatedAt: '2026-04-11T12:00:00Z',
      totalEvalRuns: 0,
      totalSnapshots: 0,
      sprints: [],
      trends: [],
      summary: 'unused in Gate D ablation regression',
    });
    mocks.generateQueryEmbedding.mockResolvedValue([0.11, 0.22, 0.33]);
    mocks.getDb.mockReturnValue(fakeDb as never);
    mocks.getDbPath.mockReturnValue('/tmp/gate-d-reader-ready.sqlite');
    mocks.hybridSearchEnhanced.mockImplementation(async () => mockState.hybridRows);
    mocks.initHybridSearch.mockImplementation(() => undefined);
    mocks.initializeDb.mockReturnValue(fakeDb as never);
    mocks.isAblationEnabled.mockReturnValue(true);
    mocks.storeAblationResults.mockReturnValue(true);
    mocks.toHybridSearchFlags.mockImplementation((disabledChannels: Set<string>) => ({
      useVector: !disabledChannels.has('vector'),
      useBm25: !disabledChannels.has('bm25'),
      useFts: !disabledChannels.has('fts5'),
      useGraph: !disabledChannels.has('graph'),
      useTrigger: !disabledChannels.has('trigger'),
    }));
    mocks.runAblation.mockImplementation(async (searchFn, config) => {
      const results = await searchFn(
        'reader-ready canonical continuity query',
        new Set(['vector'])
      );

      expect(results).toEqual([
        { memoryId: 7001, score: 0.97, rank: 1 },
        { memoryId: 7002, score: 0.88, rank: 2 },
      ]);
      expect(config.channels).toEqual(['vector']);
      expect(config.alignmentContext).toBe('eval_run_ablation');

      return {
        timestamp: '2026-04-11T12:00:00.000Z',
        runId: 'gate-d-ablation',
        config,
        results: [
          {
            channel: 'vector',
            baselineRecall20: 1,
            ablatedRecall20: 0.5,
            delta: -0.5,
            pValue: 0.03,
            queriesChannelHelped: 1,
            queriesChannelHurt: 0,
            queriesUnchanged: 0,
            queryCount: 1,
          },
        ],
        overallBaselineRecall: 1,
        queryCount: 1,
        evaluatedQueryCount: 1,
        durationMs: 12,
      };
    });
    mocks.vectorSearch.mockReturnValue([]);
    mocks.getCausalChain.mockImplementation(
      (memoryId: string, _maxDepth?: number, direction?: 'forward' | 'backward') => {
        if (direction === 'forward') {
          return {
            id: memoryId,
            depth: 0,
            relation: 'caused',
            strength: 1,
            children: [
              {
                id: '7002',
                edgeId: 9301,
                depth: 1,
                relation: 'supports',
                strength: 0.91,
                children: [],
              },
            ],
          };
        }

        return {
          id: memoryId,
          depth: 0,
          relation: 'caused',
          strength: 1,
          children: [
            {
              id: '7003',
              edgeId: 9302,
              depth: 1,
              relation: 'derived_from',
              strength: 0.84,
              children: [],
            },
          ],
        };
      }
    );
  });

  afterEach(() => {
    delete process.env.SPECKIT_ABLATION;
  });

  it('feature 10 keeps ablation and drift analysis on canonical reader sources only', async () => {
    const ablationResponse = await evalReporting.handleEvalRunAblation({
      channels: ['vector'],
      includeFormattedReport: true,
    });
    const ablationEnvelope = parseEnvelope(ablationResponse);
    const ablationData = ablationEnvelope.data;
    const hybridSearchOptions = mocks.hybridSearchEnhanced.mock.calls[0]?.[2];

    expect(ablationEnvelope.summary).toContain('Ablation run complete');
    expect(ablationData.report.results[0]).toMatchObject({
      channel: 'vector',
      delta: -0.5,
    });
    expect(ablationData.formattedReport).toBe('canonical ablation report');
    expect(JSON.stringify(ablationData.report)).not.toContain('archived_hit_rate');
    expect(JSON.stringify(ablationEnvelope)).not.toContain('legacy');
    expect(hybridSearchOptions).toMatchObject({
      limit: 20,
      useVector: false,
      useBm25: true,
      useFts: true,
      useGraph: true,
      forceAllChannels: true,
      evaluationMode: true,
    });
    expect('includeArchived' in hybridSearchOptions).toBe(false);
    expect(hybridSearchOptions.triggerPhrases).toBeUndefined();

    const driftResponse = await causalGraph.handleMemoryDriftWhy({
      memoryId: '7001',
      direction: 'both',
      includeMemoryDetails: true,
    });
    const driftEnvelope = parseEnvelope(driftResponse);
    const driftData = driftEnvelope.data;
    const relatedPaths = Object.values(driftData.relatedMemories).map((memory: any) => memory.file_path);

    expect(driftEnvelope.summary).toContain('Found 2 causal relationships');
    expect(driftData.memory.file_path).toContain('/.opencode/specs/system-spec-kit/');
    expect(driftData.totalIncomingEdges).toBe(1);
    expect(driftData.totalOutgoingEdges).toBe(1);
    expect(driftData.incoming.derivedFrom).toHaveLength(1);
    expect(driftData.outgoing.supports).toHaveLength(1);
    expect(relatedPaths).toHaveLength(3);
    expect(relatedPaths.every((filePath) => typeof filePath === 'string' && filePath.includes('/.opencode/specs/system-spec-kit/'))).toBe(true);
    expect(relatedPaths.some((filePath) => String(filePath).includes('/memory/') || String(filePath).includes('/archive/'))).toBe(false);
  });
});
