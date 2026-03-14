// TEST: Adaptive Fallback (C138-P0)
// Two-pass fallback when primary scatter returns 0 results.
// Retries at lower similarity threshold with metadata flag.
import { describe, it, expect, vi, beforeEach } from 'vitest';

/* ───────────────────────────────────────────────────────────────
   MOCK: Simulates executeScatter behavior
   ──────────────────────────────────────────────────────────────── */

interface ScatterOptions {
  min_similarity: number;
}

interface ScatterResult {
  id: number | string;
  title: string;
  score: number;
}

interface FallbackMetadata {
  fallbackRetry: boolean;
}

type ScatterFn = (query: string, opts: ScatterOptions) => Promise<ScatterResult[]>;

/**
 * Adaptive fallback logic extracted for testability.
 * In production this wraps the Promise.all scatter block in hybrid-search.ts.
 */
async function executeWithFallback(
  scatterFn: ScatterFn,
  query: string,
  metadata: FallbackMetadata,
  primaryThreshold = 0.3,
  fallbackThreshold = 0.17,
): Promise<ScatterResult[]> {
  let results = await scatterFn(query, { min_similarity: primaryThreshold });
  if (results.length === 0) {
    results = await scatterFn(query, { min_similarity: fallbackThreshold });
    metadata.fallbackRetry = true;
  }
  return results;
}

/* ───────────────────────────────────────────────────────────────
   TESTS
   ──────────────────────────────────────────────────────────────── */

describe('C138-P0 Adaptive Fallback', () => {
  let mockScatter: ReturnType<typeof vi.fn<ScatterFn>>;
  let metadata: FallbackMetadata;

  beforeEach(() => {
    mockScatter = vi.fn<ScatterFn>();
    metadata = { fallbackRetry: false };
  });

  // ---- T1: Primary returns results → no retry ----
  it('T1: skips fallback when primary scatter returns results', async () => {
    const primaryResults: ScatterResult[] = [
      { id: 1, title: 'Match A', score: 0.85 },
      { id: 2, title: 'Match B', score: 0.72 },
    ];
    mockScatter.mockResolvedValueOnce(primaryResults);

    const results = await executeWithFallback(mockScatter, 'auth token', metadata);

    expect(results).toHaveLength(2);
    expect(metadata.fallbackRetry).toBe(false);
    expect(mockScatter).toHaveBeenCalledTimes(1);
    expect(mockScatter).toHaveBeenCalledWith('auth token', { min_similarity: 0.3 });
  });

  // ---- T2: Primary returns empty → retries at 0.17 ----
  it('T2: retries at lower threshold when primary returns 0 results', async () => {
    const fallbackResults: ScatterResult[] = [
      { id: 3, title: 'Weak Match', score: 0.22 },
    ];
    mockScatter
      .mockResolvedValueOnce([])           // primary: empty
      .mockResolvedValueOnce(fallbackResults); // fallback: has results

    const results = await executeWithFallback(mockScatter, 'obscure gibberish query', metadata);

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(3);
    expect(metadata.fallbackRetry).toBe(true);
    expect(mockScatter).toHaveBeenCalledTimes(2);
    expect(mockScatter).toHaveBeenNthCalledWith(1, 'obscure gibberish query', { min_similarity: 0.3 });
    expect(mockScatter).toHaveBeenNthCalledWith(2, 'obscure gibberish query', { min_similarity: 0.17 });
  });

  // ---- T3: Both passes return empty → still returns empty ----
  it('T3: returns empty when both passes find nothing', async () => {
    mockScatter
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const results = await executeWithFallback(mockScatter, 'completely impossible query', metadata);

    expect(results).toHaveLength(0);
    expect(metadata.fallbackRetry).toBe(true);
    expect(mockScatter).toHaveBeenCalledTimes(2);
  });

  // ---- T4: fallbackRetry starts false ----
  it('T4: metadata.fallbackRetry is false initially', () => {
    expect(metadata.fallbackRetry).toBe(false);
  });

  // ---- T5: Custom thresholds ----
  it('T5: accepts custom primary and fallback thresholds', async () => {
    mockScatter
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ id: 'x', title: 'Custom', score: 0.1 }]);

    const results = await executeWithFallback(
      mockScatter, 'custom query', metadata, 0.5, 0.1,
    );

    expect(results).toHaveLength(1);
    expect(mockScatter).toHaveBeenNthCalledWith(1, 'custom query', { min_similarity: 0.5 });
    expect(mockScatter).toHaveBeenNthCalledWith(2, 'custom query', { min_similarity: 0.1 });
  });

  // ---- T6: Primary has exactly 1 result → no retry ----
  it('T6: single primary result prevents fallback', async () => {
    mockScatter.mockResolvedValueOnce([{ id: 'solo', title: 'Solo', score: 0.31 }]);

    const results = await executeWithFallback(mockScatter, 'borderline query', metadata);

    expect(results).toHaveLength(1);
    expect(metadata.fallbackRetry).toBe(false);
    expect(mockScatter).toHaveBeenCalledTimes(1);
  });

  // ---- T7: Scatter error propagates ----
  it('T7: scatter errors propagate without swallowing', async () => {
    mockScatter.mockRejectedValueOnce(new Error('DB connection failed'));

    await expect(
      executeWithFallback(mockScatter, 'error query', metadata),
    ).rejects.toThrow('DB connection failed');
  });
});
