import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  executePipeline: vi.fn(),
  logSearchQuery: vi.fn(() => ({ queryId: 113, evalRunId: 213 })),
  logChannelResult: vi.fn(() => undefined),
  logFinalResult: vi.fn(() => undefined),
}));

vi.mock('../core/index.js', () => ({
  checkDatabaseUpdated: vi.fn(async () => false),
}));

vi.mock('../lib/cache/tool-cache.js', () => ({
  generateCacheKey: vi.fn(() => 'gate-d-regression-4-stage-search-pipeline'),
  isEnabled: vi.fn(() => false),
  get: vi.fn(() => null),
  set: vi.fn(() => undefined),
}));

vi.mock('../lib/search/pipeline/index.js', () => ({
  executePipeline: mocks.executePipeline,
}));

vi.mock('../formatters/index.js', () => ({
  formatSearchResults: vi.fn(async (
    results: Array<Record<string, unknown>>,
    _searchType: string,
    _includeContent?: boolean,
    _anchors?: string[] | null,
    _parserOverride?: unknown,
    _startTime?: number | null,
    extraData: Record<string, unknown> = {},
  ) => ({
    content: [{
      type: 'text',
      text: JSON.stringify({
        summary: `Found ${results.length} canonical reader rows`,
        data: {
          count: results.length,
          results: results.map((row) => ({ ...row })),
          ...extraData,
        },
      }),
    }],
    isError: false,
  })),
}));

vi.mock('../utils/index.js', () => ({
  validateQuery: vi.fn((query: unknown) => String(query ?? '').trim()),
  requireDb: vi.fn(() => {
    throw new Error('db unavailable in unit test');
  }),
  toErrorMessage: vi.fn((error: unknown) => (error instanceof Error ? error.message : String(error))),
}));

vi.mock('../lib/search/artifact-routing.js', () => ({
  getStrategyForQuery: vi.fn(() => null),
}));

vi.mock('../lib/search/intent-classifier.js', () => ({
  isValidIntent: vi.fn(() => true),
  getIntentWeights: vi.fn(() => ({ similarity: 0.6, importance: 0.25, recency: 0.15 })),
  classifyIntent: vi.fn(() => ({ intent: 'understand', confidence: 0.91, fallback: false })),
  getIntentDescription: vi.fn(() => 'intent description'),
}));

vi.mock('../lib/eval/eval-logger.js', () => ({
  logSearchQuery: mocks.logSearchQuery,
  logChannelResult: mocks.logChannelResult,
  logFinalResult: mocks.logFinalResult,
}));

import { handleMemorySearch } from '../handlers/memory-search';

function parseEnvelope(response: Awaited<ReturnType<typeof handleMemorySearch>>): Record<string, unknown> {
  return JSON.parse(response.content[0].text) as Record<string, unknown>;
}

describe('Gate D regression 13 — 4-stage search pipeline / RRF fusion', () => {
  beforeEach(() => {
    mocks.executePipeline.mockReset();
    mocks.logSearchQuery.mockClear();
    mocks.logChannelResult.mockClear();
    mocks.logFinalResult.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps only canonical reader sources in the final RRF-ranked response and never revives legacy memory fallback rows', async () => {
    mocks.executePipeline.mockResolvedValue({
      results: [
        {
          id: 1301,
          score: 0.96,
          rrfScore: 0.96,
          title: 'Gate D spec contract',
          file_path: '/tmp/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready/spec.md',
          document_type: 'spec_doc',
          sources: ['vector', 'fts'],
        },
        {
          id: 1302,
          score: 0.91,
          rrfScore: 0.91,
          title: 'Gate D continuity',
          file_path: '/tmp/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready/implementation-summary.md',
          document_type: 'continuity',
          anchor_id: '_memory.continuity',
          sources: ['vector', 'graph'],
        },
        {
          id: 1303,
          score: 0.89,
          rrfScore: 0.89,
          title: 'Legacy memory fallback row',
          file_path: '/tmp/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready/memory/legacy.md',
          document_type: 'memory',
          sources: ['fts'],
        },
        {
          id: 1304,
          score: 0.87,
          rrfScore: 0.87,
          title: 'Constitutional reader rule',
          file_path: '/tmp/.opencode/skill/system-spec-kit/constitutional/reader-ready-rules.md',
          document_type: 'constitutional',
          importance_tier: 'constitutional',
          sources: ['vector'],
        },
        {
          id: 1305,
          score: 0.84,
          rrfScore: 0.84,
          title: 'Archived fallback artifact',
          file_path: '/tmp/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready/memory/archived.md',
          document_type: 'memory',
          sources: ['fts'],
        },
      ],
      metadata: {
        stage1: {
          searchType: 'hybrid',
          channelCount: 3,
          candidateCount: 5,
          constitutionalInjected: 0,
          durationMs: 2,
        },
        stage2: {
          sessionBoostApplied: 'off',
          causalBoostApplied: 'off',
          intentWeightsApplied: 'applied',
          artifactRoutingApplied: 'off',
          feedbackSignalsApplied: 'off',
          qualityFiltered: 0,
          durationMs: 2,
        },
        stage3: {
          rerankApplied: false,
          chunkReassemblyStats: { collapsedChunkHits: 0, chunkParents: 0, reassembled: 0, fallback: 0 },
          durationMs: 1,
        },
        stage4: {
          stateFiltered: 0,
          constitutionalInjected: 0,
          evidenceGapDetected: false,
          durationMs: 1,
        },
      },
      annotations: {
        stateStats: {},
        featureFlags: {},
      },
      trace: undefined,
    });

    const response = await handleMemorySearch({
      query: 'show the Gate D reader-ready 4-stage search pipeline fusion contract',
      includeArchived: true,
    });

    expect(mocks.executePipeline).toHaveBeenCalledTimes(1);
    expect(mocks.logSearchQuery).toHaveBeenCalledTimes(1);
    expect(mocks.logFinalResult).toHaveBeenCalledTimes(1);

    const envelope = parseEnvelope(response);
    const data = envelope.data as Record<string, unknown>;
    const results = data.results as Array<Record<string, unknown>>;
    const sourceContract = data.sourceContract as Record<string, unknown>;
    const pipelineMetadata = data.pipelineMetadata as Record<string, unknown>;
    const stage1 = pipelineMetadata.stage1 as Record<string, unknown>;
    const stage2 = pipelineMetadata.stage2 as Record<string, unknown>;
    const stage3 = pipelineMetadata.stage3 as Record<string, unknown>;
    const stage4 = pipelineMetadata.stage4 as Record<string, unknown>;

    expect(results.map((row) => row.id)).toEqual([1301, 1302, 1304]);
    expect(results.every((row) => row.document_type !== 'memory')).toBe(true);
    expect(results.every((row) => !String(row.file_path ?? '').includes('/memory/'))).toBe(true);

    expect(stage1.searchType).toBe('hybrid');
    expect(stage1.channelCount).toBe(3);
    expect(stage2.intentWeightsApplied).toBe('applied');
    expect(stage3.rerankApplied).toBe(false);
    expect(stage4.evidenceGapDetected).toBe(false);

    expect(sourceContract).toMatchObject({
      archivedTierEnabled: false,
      legacyFallbackEnabled: false,
      includeArchivedCompatibility: 'ignored',
      preferredDocumentTypes: ['spec_doc', 'continuity'],
      retainedResults: 3,
      droppedNonCanonicalResults: 2,
    });
    expect(sourceContract.countsBySourceKind).toEqual({
      spec_doc: 1,
      continuity: 1,
      constitutional: 1,
    });

    expect(mocks.logFinalResult).toHaveBeenCalledWith(expect.objectContaining({
      fusionMethod: 'rrf',
      resultMemoryIds: [1301, 1302, 1304],
      scores: [0.96, 0.91, 0.87],
    }));
  });
});
