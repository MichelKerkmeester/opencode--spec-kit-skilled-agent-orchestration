import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const PIPELINE_RESULTS = Array.from({ length: 7 }, (_, index) => ({
  id: index + 1,
  score: 1 - index * 0.05,
  title: `Result ${index + 1}`,
  content: `Detailed result content ${index + 1} for fusion scoring decisions and retrieval context.`,
  file_path: `/tmp/result-${index + 1}.md`,
}));

vi.mock('../core', () => ({
  checkDatabaseUpdated: vi.fn(async () => false),
  isEmbeddingModelReady: vi.fn(() => true),
  waitForEmbeddingModel: vi.fn(async () => true),
}));

vi.mock('../lib/cache/tool-cache', () => ({
  generateCacheKey: vi.fn(() => 'memory-search-ux-hooks'),
  isEnabled: vi.fn(() => false),
  get: vi.fn(() => null),
  set: vi.fn(() => undefined),
  withCache: vi.fn(async (_tool: string, _args: unknown, fn: () => Promise<unknown>) => fn()),
}));

vi.mock('../lib/search/pipeline', () => ({
  executePipeline: vi.fn(async () => ({
    results: PIPELINE_RESULTS,
    metadata: {
      stage1: { searchType: 'hybrid', channelCount: 2, candidateCount: 7, constitutionalInjected: 0, durationMs: 1 },
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
  formatSearchResults: vi.fn(async (results: Array<Record<string, unknown>>) => ({
    content: [{
      type: 'text',
      text: JSON.stringify({
        summary: `Found ${results.length} memories`,
        data: {
          count: results.length,
          results: results.map((row) => ({ ...row })),
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
  classifyIntent: vi.fn(() => ({ intent: 'understand', confidence: 0.9, fallback: false })),
  getIntentDescription: vi.fn(() => 'intent description'),
}));

vi.mock('../lib/search/session-boost', () => ({
  isEnabled: vi.fn(() => false),
}));

vi.mock('../lib/search/causal-boost', () => ({
  isEnabled: vi.fn(() => false),
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
  logSearchQuery: vi.fn(() => ({ queryId: 11, evalRunId: 22 })),
  logChannelResult: vi.fn(() => undefined),
  logFinalResult: vi.fn(() => undefined),
}));

vi.mock('../lib/feedback/feedback-ledger', () => ({
  logFeedbackEvents: vi.fn(() => undefined),
  isImplicitFeedbackLogEnabled: vi.fn(() => false),
}));

import { handleMemorySearch } from '../handlers/memory-search';
import { clearCursorStore } from '../lib/search/progressive-disclosure';
import { manager as retrievalSessionStateManager } from '../lib/search/session-state';

function parseEnvelope(response: Awaited<ReturnType<typeof handleMemorySearch>>): Record<string, unknown> {
  return JSON.parse(response.content[0].text) as Record<string, unknown>;
}

describe('memory_search UX hook integration', () => {
  beforeEach(() => {
    retrievalSessionStateManager.clearAll();
    clearCursorStore();
    delete process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1;
    delete process.env.SPECKIT_SESSION_RETRIEVAL_STATE_V1;
  });

  afterEach(() => {
    clearCursorStore();
    retrievalSessionStateManager.clearAll();
  });

  it('adds progressive disclosure payloads and session state to search responses', async () => {
    const response = await handleMemorySearch({
      query: 'Find fusion scoring decisions',
      sessionId: 'sess-ux-1',
      anchors: ['state', 'next-steps'],
    });

    const envelope = parseEnvelope(response);
    const data = envelope.data as Record<string, unknown>;
    const results = data.results as Array<Record<string, unknown>>;
    const progressive = data.progressiveDisclosure as Record<string, unknown>;
    const progressiveResults = progressive.results as Array<Record<string, unknown>>;
    const summaryLayer = progressive.summaryLayer as Record<string, unknown>;
    const continuation = progressive.continuation as Record<string, unknown>;
    const sessionState = data.sessionState as Record<string, unknown>;
    const goalRefinement = data.goalRefinement as Record<string, unknown>;

    expect(results).toHaveLength(7);
    expect(summaryLayer.count).toBe(7);
    expect(progressiveResults).toHaveLength(5);
    expect(progressiveResults[0]?.resultId).toBe('1');
    expect(continuation.remainingCount).toBe(2);
    expect(typeof continuation.cursor).toBe('string');
    expect(sessionState.activeGoal).toBe('Find fusion scoring decisions');
    expect(sessionState.preferredAnchors).toEqual(['state', 'next-steps']);
    expect(goalRefinement.activeGoal).toBe('Find fusion scoring decisions');
  });

  it('resolves continuation cursors without requiring a new query', async () => {
    const initial = await handleMemorySearch({ query: 'Find fusion scoring decisions' });
    const initialEnvelope = parseEnvelope(initial);
    const progressive = (initialEnvelope.data as Record<string, unknown>).progressiveDisclosure as Record<string, unknown>;
    const continuation = progressive.continuation as Record<string, unknown>;

    const nextPage = await handleMemorySearch({ cursor: String(continuation.cursor) });
    const nextEnvelope = parseEnvelope(nextPage);
    const nextData = nextEnvelope.data as Record<string, unknown>;
    const results = nextData.results as Array<Record<string, unknown>>;

    expect(results).toHaveLength(2);
    expect(results[0]?.resultId).toBe('6');
    expect(nextData.continuation).toBeNull();
  });

  it('rejects continuation cursors when the resuming scope does not match the original query scope', async () => {
    const initial = await handleMemorySearch({
      query: 'Find fusion scoring decisions',
      tenantId: 'tenant-a',
      userId: 'user-a',
    });
    const initialEnvelope = parseEnvelope(initial);
    const progressive = (initialEnvelope.data as Record<string, unknown>).progressiveDisclosure as Record<string, unknown>;
    const continuation = progressive.continuation as Record<string, unknown>;

    const resumed = await handleMemorySearch({
      cursor: String(continuation.cursor),
      tenantId: 'tenant-a',
      userId: 'user-b',
    });
    const resumedEnvelope = parseEnvelope(resumed);
    const resumedData = resumedEnvelope.data as Record<string, unknown>;

    expect(resumedEnvelope.summary).toBe('Error: Cursor is invalid, expired, or out of scope');
    expect(resumedData.error).toBe('Cursor is invalid, expired, or out of scope');
  });
});
