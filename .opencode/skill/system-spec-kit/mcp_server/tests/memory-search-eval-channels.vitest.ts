// TEST: memory_search per-channel eval logging (T056)
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

interface EvalChannelCall {
  channel: string;
  resultMemoryIds: number[];
  hitCount?: number;
}

const mockLogSearchQuery = vi.fn((_payload: unknown) => ({ queryId: 11, evalRunId: 22 }));
const mockLogChannelResult = vi.fn((_payload: EvalChannelCall) => undefined);
const mockLogFinalResult = vi.fn((_payload: unknown) => undefined);

vi.mock('../core', () => ({
  checkDatabaseUpdated: vi.fn(async () => false),
  isEmbeddingModelReady: vi.fn(() => true),
  waitForEmbeddingModel: vi.fn(async () => true),
}));

vi.mock('../lib/cache/tool-cache', () => ({
  generateCacheKey: vi.fn(() => 'memory-search-test-cache-key'),
  isEnabled: vi.fn(() => false),
  get: vi.fn(() => null),
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
  logSearchQuery: (payload: unknown) => mockLogSearchQuery(payload),
  logChannelResult: (payload: EvalChannelCall) => mockLogChannelResult(payload),
  logFinalResult: (payload: unknown) => mockLogFinalResult(payload),
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

    const channelCalls = mockLogChannelResult.mock.calls.map(([payload]) => payload);
    const byChannel = new Map(channelCalls.map((call) => [call.channel, call]));
    const vectorPayload = byChannel.get('vector');
    const bm25Payload = byChannel.get('bm25');

    expect(vectorPayload).toBeDefined();
    expect(bm25Payload).toBeDefined();

    expect(vectorPayload!.resultMemoryIds).toEqual([101]);
    expect(bm25Payload!.resultMemoryIds).toEqual([101, 202]);
    expect(bm25Payload!.hitCount).toBe(2);
  });

  it('buildEvalChannelPayloads falls back to hybrid channel when attribution is missing', () => {
    const payloads = __testables.buildEvalChannelPayloads([
      { id: 1, score: 0.5 },
      { id: 2, similarity: 0.4 },
    ]);

    expect(payloads).toHaveLength(1);
    const [payload] = payloads;
    expect(payload).toBeDefined();
    expect(payload!.channel).toBe('hybrid');
    expect(payload!.resultMemoryIds).toEqual([1, 2]);
  });
});
