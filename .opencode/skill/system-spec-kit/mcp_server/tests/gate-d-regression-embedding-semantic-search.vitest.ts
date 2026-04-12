import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const QUERY = 'how do I regain context after reopening the packet in a fresh session?';

vi.mock('../core', () => ({
  checkDatabaseUpdated: vi.fn(async () => false),
  isEmbeddingModelReady: vi.fn(() => true),
  waitForEmbeddingModel: vi.fn(async () => true),
}));

vi.mock('../lib/cache/tool-cache', () => ({
  generateCacheKey: vi.fn(() => 'gate-d-regression-embedding-semantic-search'),
  isEnabled: vi.fn(() => false),
  get: vi.fn(() => null),
  set: vi.fn(() => undefined),
  withCache: vi.fn(async (_tool: string, _args: unknown, fn: () => Promise<unknown>) => fn()),
}));

vi.mock('../lib/search/pipeline', () => ({
  executePipeline: vi.fn(async () => ({
    results: [
      {
        id: 1201,
        score: 0.96,
        title: 'Gate D resume ladder overview',
        content: 'Reader-ready canonical notes explain how handover and continuity restore state after a restart.',
        file_path: '/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready/handover.md',
        document_type: 'spec_doc',
      },
      {
        id: 1202,
        score: 0.91,
        title: 'Gate D continuity state',
        content: 'Canonical continuity tracks the recent action and next safe action for resume recovery.',
        file_path: '/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready/implementation-summary.md',
        document_type: 'continuity',
        anchor_id: '_memory.continuity',
      },
      {
        id: 1203,
        score: 0.99,
        title: 'Legacy memory exact-token bait',
        content: 'fresh session regain context resume packet exact keywords',
        file_path: '/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready/memory/legacy-resume.md',
        document_type: 'memory',
      },
      {
        id: 1204,
        score: 0.94,
        title: 'Archived recovery note',
        content: 'resume ladder archive note',
        file_path: '/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready/memory/archive/old-resume.md',
        document_type: 'memory',
        importance_tier: 'archived',
      },
    ],
    metadata: {
      stage1: { searchType: 'hybrid', channelCount: 3, candidateCount: 4, constitutionalInjected: 0, durationMs: 1 },
      stage2: {
        sessionBoostApplied: 'off',
        causalBoostApplied: 'off',
        intentWeightsApplied: 'off',
        artifactRoutingApplied: 'off',
        feedbackSignalsApplied: 'off',
        qualityFiltered: 0,
        durationMs: 1,
      },
      stage3: {
        rerankApplied: false,
        chunkReassemblyStats: { collapsedChunkHits: 0, chunkParents: 0, reassembled: 0, fallback: 0 },
        durationMs: 1,
      },
      stage4: { stateFiltered: 0, constitutionalInjected: 0, evidenceGapDetected: false, durationMs: 1 },
    },
    annotations: { stateStats: {}, featureFlags: {} },
    trace: undefined,
  })),
}));

vi.mock('../formatters', () => ({
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
        summary: `Found ${results.length} memories`,
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

vi.mock('../utils', () => ({
  validateQuery: vi.fn((query: unknown) => String(query ?? '').trim()),
  requireDb: vi.fn(() => {
    throw new Error('db unavailable in unit test');
  }),
  toErrorMessage: vi.fn((err: unknown) => (err instanceof Error ? err.message : String(err))),
}));

vi.mock('../lib/search/artifact-routing', () => ({
  getStrategyForQuery: vi.fn(() => null),
  applyRoutingWeights: vi.fn((results: unknown[]) => results),
}));

vi.mock('../lib/search/intent-classifier', () => ({
  isValidIntent: vi.fn(() => true),
  getIntentWeights: vi.fn(() => ({ similarity: 0.6, importance: 0.25, recency: 0.15 })),
  classifyIntent: vi.fn(() => ({ intent: 'understand', confidence: 0.91, fallback: false })),
  getIntentDescription: vi.fn(() => 'intent description'),
  getProfileForIntent: vi.fn(() => null),
}));

vi.mock('../lib/session/session-manager', () => ({
  isEnabled: vi.fn(() => false),
  filterSearchResults: vi.fn((_sessionId: string, results: unknown[]) => ({
    filtered: results,
    dedupStats: { enabled: false, filtered: 0, total: Array.isArray(results) ? results.length : 0 },
  })),
  markResultsSent: vi.fn(() => undefined),
}));

vi.mock('../lib/eval/eval-logger', () => ({
  logSearchQuery: vi.fn(() => ({ queryId: 12, evalRunId: 34 })),
  logChannelResult: vi.fn(() => undefined),
  logFinalResult: vi.fn(() => undefined),
}));

vi.mock('../lib/feedback/feedback-ledger', () => ({
  logFeedbackEvents: vi.fn(() => undefined),
  isImplicitFeedbackLogEnabled: vi.fn(() => false),
}));

import { handleMemorySearch } from '../handlers/memory-search';
import * as pipeline from '../lib/search/pipeline';

function parseEnvelope(response: Awaited<ReturnType<typeof handleMemorySearch>>): Record<string, unknown> {
  return JSON.parse(response.content[0].text) as Record<string, unknown>;
}

describe('Gate D regression embedding semantic search', () => {
  beforeEach(() => {
    delete process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1;
    delete process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('feature 12 keeps semantic top-k on canonical reader sources only, with no archived tier or legacy fallback', async () => {
    const response = await handleMemorySearch({
      query: QUERY,
      includeArchived: true,
      includeContent: true,
      limit: 5,
    });

    expect(vi.mocked(pipeline.executePipeline)).toHaveBeenCalledTimes(1);

    const envelope = parseEnvelope(response);
    const data = envelope.data as Record<string, unknown>;
    const results = data.results as Array<Record<string, unknown>>;
    const sourceContract = data.sourceContract as Record<string, unknown>;

    expect(results.map((row) => row.id)).toEqual([1201, 1202]);
    expect(results.every((row) => row.document_type === 'spec_doc' || row.document_type === 'continuity')).toBe(true);
    expect(results.some((row) => row.id === 1203 || row.id === 1204)).toBe(false);
    expect(results[0]?.title).toBe('Gate D resume ladder overview');
    expect(results[1]?.anchor_id).toBe('_memory.continuity');

    expect(sourceContract).toMatchObject({
      archivedTierEnabled: false,
      legacyFallbackEnabled: false,
      includeArchivedCompatibility: 'ignored',
      preferredDocumentTypes: ['spec_doc', 'continuity'],
      retainedResults: 2,
      droppedNonCanonicalResults: 2,
    });
    expect(sourceContract.countsBySourceKind).toEqual({
      spec_doc: 1,
      continuity: 1,
      constitutional: 0,
    });
  });
});
