// TEST: memory_context per-channel eval logging (T056)
import { describe, it, expect, vi, beforeEach } from 'vitest';

type EvalSearchQueryResult = {
  queryId: number;
  evalRunId: number;
};

type EvalChannelPayload = {
  channel: string;
  resultMemoryIds?: number[];
  hitCount?: number;
};

type EvalFinalPayload = {
  resultMemoryIds?: number[];
  scores?: number[];
  fusionMethod?: string;
  latencyMs?: number;
};

const mockLogSearchQuery = vi.fn<() => EvalSearchQueryResult>(() => ({ queryId: 77, evalRunId: 88 }));
const mockLogChannelResult = vi.fn<(payload: EvalChannelPayload) => void>(() => undefined);
const mockLogFinalResult = vi.fn<(payload: EvalFinalPayload) => void>(() => undefined);

vi.mock('../core/db-state', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, unknown>),
    checkDatabaseUpdated: vi.fn(async () => false),
    waitForEmbeddingModel: vi.fn(async () => true),
    isEmbeddingModelReady: vi.fn(() => true),
  };
});

vi.mock('../core', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, unknown>),
    checkDatabaseUpdated: vi.fn(async () => false),
    waitForEmbeddingModel: vi.fn(async () => true),
    isEmbeddingModelReady: vi.fn(() => true),
  };
});

vi.mock('../handlers/memory-search', () => ({
  handleMemorySearch: vi.fn(async () => ({
    content: [{
      type: 'text',
      text: JSON.stringify({
        data: {
          results: [{ id: 301, score: 0.77 }],
          count: 1,
        },
      }),
    }],
    isError: false,
  })),
}));

vi.mock('../handlers/memory-triggers', () => ({
  handleMemoryMatchTriggers: vi.fn(async () => ({
    content: [{
      type: 'text',
      text: JSON.stringify({
        data: {
          results: [{ id: 401, score: 1 }],
          count: 1,
        },
      }),
    }],
    isError: false,
  })),
}));

vi.mock('../lib/search/vector-index', () => ({
  getDb: vi.fn(() => null),
}));

vi.mock('../lib/eval/eval-logger', () => ({
  logSearchQuery: (_params: unknown) => mockLogSearchQuery(),
  logChannelResult: (payload: EvalChannelPayload) => mockLogChannelResult(payload),
  logFinalResult: (payload: EvalFinalPayload) => mockLogFinalResult(payload),
}));

import { handleMemoryContext } from '../handlers/memory-context';

describe('T056: memory_context emits per-strategy channel eval rows', () => {
  beforeEach(() => {
    mockLogSearchQuery.mockClear();
    mockLogChannelResult.mockClear();
    mockLogFinalResult.mockClear();
  });

  it('logs context_focused channel for focused retrieval flow', async () => {
    const response = await handleMemoryContext({ input: 'what is the auth flow?' });
    expect(response).toBeDefined();

    expect(mockLogSearchQuery).toHaveBeenCalledTimes(1);
    expect(mockLogFinalResult).toHaveBeenCalledTimes(1);
    expect(mockLogChannelResult).toHaveBeenCalledTimes(1);

    const [payload] = mockLogChannelResult.mock.calls[0]!;
    expect(payload.channel).toBe('context_focused');
    expect(payload.resultMemoryIds).toEqual([301]);
    expect(payload.hitCount).toBe(1);
  });

  it('logs context_quick channel for quick trigger-based flow', async () => {
    const response = await handleMemoryContext({
      input: 'resume quickly',
      mode: 'quick',
    });
    expect(response).toBeDefined();

    expect(mockLogChannelResult).toHaveBeenCalledTimes(1);
    const [payload] = mockLogChannelResult.mock.calls[0]!;
    expect(payload.channel).toBe('context_quick');
    expect(payload.resultMemoryIds).toEqual([401]);
  });
});
