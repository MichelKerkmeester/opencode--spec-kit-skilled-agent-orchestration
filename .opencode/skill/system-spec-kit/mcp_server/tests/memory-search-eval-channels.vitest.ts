// @ts-nocheck
// ---------------------------------------------------------------
// TEST: memory_search per-channel eval logging (T056)
// ---------------------------------------------------------------

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockLogSearchQuery = vi.fn(() => ({ queryId: 11, evalRunId: 22 }));
const mockLogChannelResult = vi.fn(() => undefined);
const mockLogFinalResult = vi.fn(() => undefined);

vi.mock('../core', () => ({
  checkDatabaseUpdated: vi.fn(async () => false),
  isEmbeddingModelReady: vi.fn(() => true),
  waitForEmbeddingModel: vi.fn(async () => true),
}));

vi.mock('../lib/cache/tool-cache', () => ({
  withCache: vi.fn(async (_tool: string, _args: unknown, fn: () => Promise<unknown>) => fn()),
}));

vi.mock('../lib/search/pipeline', () => ({
  executePipeline: vi.fn(async () => ({
    results: [
      { id: 101, score: 0.91, source: 'vector', sources: ['vector', 'bm25'] },
      { id: 202, score: 0.88, source: 'bm25', sources: ['bm25'] },
    ],
    metadata: {
      stage1: { searchType: 'hybrid', channelCount: 2, candidateCount: 2, constitutionalInjected: 0, durationMs: 1 },
      stage2: {
        sessionBoostApplied: false,
        causalBoostApplied: false,
        intentWeightsApplied: false,
        artifactRoutingApplied: false,
        feedbackSignalsApplied: false,
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
        data: {
          results: results.map((row) => ({ id: row.id, score: row.score })),
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

vi.mock('../lib/eval/eval-logger', () => ({
  logSearchQuery: (...args: unknown[]) => mockLogSearchQuery(...args),
  logChannelResult: (...args: unknown[]) => mockLogChannelResult(...args),
  logFinalResult: (...args: unknown[]) => mockLogFinalResult(...args),
}));

import { handleMemorySearch, __testables } from '../handlers/memory-search';

describe('T056: memory_search emits per-channel eval rows', () => {
  beforeEach(() => {
    mockLogSearchQuery.mockClear();
    mockLogChannelResult.mockClear();
    mockLogFinalResult.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs one eval_channel_results row per contributing channel', async () => {
    const response = await handleMemorySearch({ query: 'investigate auth pipeline' });
    expect(response).toBeDefined();

    expect(mockLogSearchQuery).toHaveBeenCalledTimes(1);
    expect(mockLogFinalResult).toHaveBeenCalledTimes(1);
    expect(mockLogChannelResult).toHaveBeenCalledTimes(2);

    const channelCalls = mockLogChannelResult.mock.calls.map((entry) => entry[0]);
    const byChannel = new Map(channelCalls.map((call) => [call.channel, call]));

    expect(byChannel.has('vector')).toBe(true);
    expect(byChannel.has('bm25')).toBe(true);

    expect(byChannel.get('vector').resultMemoryIds).toEqual([101]);
    expect(byChannel.get('bm25').resultMemoryIds).toEqual([101, 202]);
    expect(byChannel.get('bm25').hitCount).toBe(2);
  });

  it('buildEvalChannelPayloads falls back to hybrid channel when attribution is missing', () => {
    const payloads = __testables.buildEvalChannelPayloads([
      { id: 1, score: 0.5 },
      { id: 2, similarity: 0.4 },
    ]);

    expect(payloads).toHaveLength(1);
    expect(payloads[0].channel).toBe('hybrid');
    expect(payloads[0].resultMemoryIds).toEqual([1, 2]);
  });
});

