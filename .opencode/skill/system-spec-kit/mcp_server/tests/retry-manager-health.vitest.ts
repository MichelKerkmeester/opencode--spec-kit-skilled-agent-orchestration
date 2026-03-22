import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('getEmbeddingRetryStats', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns a zero-state snapshot without touching the DB accessor', async () => {
    const getDb = vi.fn(() => {
      throw new Error('getDb should not be called');
    });

    vi.doMock('../lib/search/vector-index', () => ({
      getDb,
      initializeDb: vi.fn(),
      getMemory: vi.fn(),
    }));

    const { getEmbeddingRetryStats } = await import('../lib/providers/retry-manager');
    const stats = getEmbeddingRetryStats();

    expect(getDb).not.toHaveBeenCalled();
    expect(stats).toEqual({
      pending: 0,
      failed: 0,
      retryAttempts: 0,
      circuitBreakerOpen: false,
      lastRun: null,
      queueDepth: 0,
    });
  });
});
