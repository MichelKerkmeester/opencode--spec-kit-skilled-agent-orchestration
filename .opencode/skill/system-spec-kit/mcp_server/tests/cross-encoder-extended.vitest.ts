// TEST: CROSS ENCODER EXTENDED
import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import * as crossEncoder from '../lib/search/cross-encoder';
import type { RerankDocument, RerankResult } from '../lib/search/cross-encoder';

/* ─────────────────────────────────────────────────────────────
   TEST UTILITIES
──────────────────────────────────────────────────────────────── */

const originalEnv = { ...process.env };
const originalFetch = globalThis.fetch;

function resetEnv() {
  delete process.env.VOYAGE_API_KEY;
  delete process.env.COHERE_API_KEY;
  delete process.env.RERANKER_LOCAL;
  crossEncoder.resetProvider();
  crossEncoder.resetSession();
}

function restoreAll() {
  process.env.VOYAGE_API_KEY = originalEnv.VOYAGE_API_KEY;
  process.env.COHERE_API_KEY = originalEnv.COHERE_API_KEY;
  process.env.RERANKER_LOCAL = originalEnv.RERANKER_LOCAL;
  if (!originalEnv.VOYAGE_API_KEY) delete process.env.VOYAGE_API_KEY;
  if (!originalEnv.COHERE_API_KEY) delete process.env.COHERE_API_KEY;
  if (!originalEnv.RERANKER_LOCAL) delete process.env.RERANKER_LOCAL;
  globalThis.fetch = originalFetch;
  crossEncoder.resetProvider();
  crossEncoder.resetSession();
}

/** Helper: create a mock RerankResult-like object */
function mockResult(id: number, content: string, rerankerScore: number): RerankResult & { content: string } {
  return {
    id,
    content,
    rerankerScore,
    score: rerankerScore,
    originalRank: id,
    provider: 'test',
    scoringMethod: 'cross-encoder' as const,
  };
}

/** Helper: create a mock fetch that returns a controlled response */
function mockFetch(status: number, body: unknown, shouldThrow = false): void {
  globalThis.fetch = vi.fn(async (..._args: Parameters<typeof fetch>): Promise<Response> => {
    if (shouldThrow) throw new Error('Network error');
    return new Response(JSON.stringify(body), {
      status,
      statusText: status === 200 ? 'OK' : 'Internal Server Error',
      headers: { 'Content-Type': 'application/json' },
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   TESTS
──────────────────────────────────────────────────────────────── */

describe('Cross Encoder Extended Tests', () => {
  beforeEach(() => {
    resetEnv();
  });

  afterAll(() => {
    restoreAll();
  });

  // ───────────────────────────────────────────────────────────────
  // 1. APPLYLENGTHPENALTY
  // ───────────────────────────────────────────────────────────────
  describe('1. applyLengthPenalty', () => {
    it('short content (<50 chars) applies 0.9 penalty', () => {
      const shortContent = mockResult(1, 'hi', 0.8);          // 2 chars < 50 → penalty 0.9
      const results = crossEncoder.applyLengthPenalty([shortContent]);
      const expected = 0.8 * 0.9; // 0.72
      expect(results.length).toBe(1);
      expect(results[0].rerankerScore).toBeCloseTo(expected, 9);
    });

    it('medium content (50-2000 chars) no penalty', () => {
      const medContent = mockResult(2, 'a'.repeat(500), 0.8);  // 500 chars: 50..2000 → penalty 1.0
      const results = crossEncoder.applyLengthPenalty([medContent]);
      expect(results[0].rerankerScore).toBeCloseTo(0.8, 9);
    });

    it('long content (>2000 chars) applies 0.95 penalty', () => {
      const longContent = mockResult(3, 'b'.repeat(3000), 0.8);  // 3000 chars > 2000 → penalty 0.95
      const results = crossEncoder.applyLengthPenalty([longContent]);
      const expected = 0.8 * 0.95; // 0.76
      expect(results[0].rerankerScore).toBeCloseTo(expected, 9);
    });

    it('missing content treated as empty (penalty 0.9)', () => {
      const noContent: RerankResult = {
        id: 4,
        rerankerScore: 1.0,
        score: 1.0,
        originalRank: 0,
        provider: 'test',
        scoringMethod: 'cross-encoder',
      };
      // No 'content' property → falls back to '' → length 0 → penalty 0.9
      const results = crossEncoder.applyLengthPenalty([noContent]);
      const expected = 1.0 * 0.9;
      expect(results[0].rerankerScore).toBeCloseTo(expected, 9);
    });

    it('empty array returns empty array', () => {
      const results = crossEncoder.applyLengthPenalty([]);
      expect(results.length).toBe(0);
    });

    it('mixed lengths apply correct penalties', () => {
      const mixed = [
        mockResult(1, 'x', 1.0),             // short → *0.9 = 0.9
        mockResult(2, 'y'.repeat(100), 1.0),  // medium → *1.0 = 1.0
        mockResult(3, 'z'.repeat(5000), 1.0), // long → *0.95 = 0.95
      ];
      const results = crossEncoder.applyLengthPenalty(mixed);
      expect(results[0].rerankerScore).toBeCloseTo(1.0, 9);
      expect(results[0].score).toBeCloseTo(1.0, 9);
      expect(results[1].rerankerScore).toBeCloseTo(0.95, 9);
      expect(results[1].score).toBeCloseTo(0.95, 9);
      expect(results[2].rerankerScore).toBeCloseTo(0.9, 9);
      expect(results[2].score).toBeCloseTo(0.9, 9);
    });

    it('boundary at exactly 50 chars (no penalty)', () => {
      // Boundary: exactly 50 chars → NOT < 50, so penalty = 1.0
      const boundary50 = mockResult(10, 'c'.repeat(50), 0.6);
      const results = crossEncoder.applyLengthPenalty([boundary50]);
      expect(results[0].rerankerScore).toBeCloseTo(0.6, 9);
    });

    it('boundary at exactly 2000 chars (no penalty)', () => {
      // Boundary: exactly 2000 chars → NOT < 50, NOT > 2000, so penalty = 1.0
      const boundary2000 = mockResult(11, 'd'.repeat(2000), 0.6);
      const results = crossEncoder.applyLengthPenalty([boundary2000]);
      expect(results[0].rerankerScore).toBeCloseTo(0.6, 9);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 2. RERANKVOYAGE
  // ───────────────────────────────────────────────────────────────
  describe('2. rerankVoyage', () => {
    it('throws when VOYAGE_API_KEY missing', async () => {
      await expect(
        crossEncoder.rerankVoyage('query', [{ id: 1, content: 'doc' }])
      ).rejects.toThrow('VOYAGE_API_KEY not set');
    });

    it('successful API call returns sorted results', async () => {
      process.env.VOYAGE_API_KEY = 'test-key-123';
      mockFetch(200, {
        data: [
          { index: 1, relevance_score: 0.95 },
          { index: 0, relevance_score: 0.72 },
        ],
      });

      const docs: RerankDocument[] = [
        { id: 'a', content: 'first document' },
        { id: 'b', content: 'second document' },
      ];
      const results = await crossEncoder.rerankVoyage('test query', docs);

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(2);
      // Sorted by score descending → first result should have higher score
      expect(results[0].rerankerScore).toBeGreaterThanOrEqual(results[1].rerankerScore);
      expect(results[0].provider).toBe('voyage');
      expect(results[0].scoringMethod).toBe('cross-encoder');
    });

    it('originalRank maps to input position', async () => {
      process.env.VOYAGE_API_KEY = 'test-key-123';
      mockFetch(200, {
        data: [
          { index: 1, relevance_score: 0.9 },
          { index: 0, relevance_score: 0.5 },
          { index: 2, relevance_score: 0.7 },
        ],
      });

      const docs: RerankDocument[] = [
        { id: 'x', content: 'doc x' },
        { id: 'y', content: 'doc y' },
        { id: 'z', content: 'doc z' },
      ];
      const results = await crossEncoder.rerankVoyage('query', docs);

      // OriginalRank should map from the inputRankMap (position in input array)
      // Doc at index 1 (id 'y') has originalRank 1
      const topResult = results[0]; // highest score: index 1 → id 'y', score 0.9
      expect(topResult.id).toBe('y');
      expect(topResult.originalRank).toBe(1);
    });

    it('throws on non-OK HTTP response', async () => {
      process.env.VOYAGE_API_KEY = 'test-key-123';
      mockFetch(500, { error: 'Server error' });

      await expect(
        crossEncoder.rerankVoyage('query', [{ id: 1, content: 'doc' }])
      ).rejects.toThrow(/Voyage rerank failed: 500/);
    });

    it('throws on network error', async () => {
      process.env.VOYAGE_API_KEY = 'test-key-123';
      mockFetch(0, null, true); // shouldThrow = true → network error

      await expect(
        crossEncoder.rerankVoyage('query', [{ id: 1, content: 'doc' }])
      ).rejects.toThrow('Network error');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 3. RERANKCOHERE
  // ───────────────────────────────────────────────────────────────
  describe('3. rerankCohere', () => {
    it('throws when COHERE_API_KEY missing', async () => {
      await expect(
        crossEncoder.rerankCohere('query', [{ id: 1, content: 'doc' }])
      ).rejects.toThrow('COHERE_API_KEY not set');
    });

    it('successful API call returns sorted results', async () => {
      process.env.COHERE_API_KEY = 'cohere-test-key';
      mockFetch(200, {
        results: [
          { index: 0, relevance_score: 0.88 },
          { index: 1, relevance_score: 0.65 },
        ],
      });

      const docs: RerankDocument[] = [
        { id: 10, content: 'alpha document' },
        { id: 20, content: 'beta document' },
      ];
      const results = await crossEncoder.rerankCohere('search query', docs);

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(2);
      expect(results[0].rerankerScore).toBeGreaterThanOrEqual(results[1].rerankerScore);
      expect(results[0].provider).toBe('cohere');
      expect(results[0].scoringMethod).toBe('cross-encoder');
    });

    it('throws on non-OK HTTP response', async () => {
      process.env.COHERE_API_KEY = 'cohere-test-key';
      mockFetch(403, { message: 'Forbidden' });

      await expect(
        crossEncoder.rerankCohere('query', [{ id: 1, content: 'doc' }])
      ).rejects.toThrow(/Cohere rerank failed: 403/);
    });

    it('throws on network error', async () => {
      process.env.COHERE_API_KEY = 'cohere-test-key';
      mockFetch(0, null, true);

      await expect(
        crossEncoder.rerankCohere('query', [{ id: 1, content: 'doc' }])
      ).rejects.toThrow('Network error');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4. RERANKLOCAL
  // ───────────────────────────────────────────────────────────────
  describe('4. rerankLocal', () => {
    it('successful response returns sorted results', async () => {
      mockFetch(200, {
        results: [
          { index: 1, relevance_score: 0.91 },
          { index: 0, relevance_score: 0.44 },
        ],
      });

      const docs: RerankDocument[] = [
        { id: 'loc-a', content: 'local doc one' },
        { id: 'loc-b', content: 'local doc two' },
      ];
      const results = await crossEncoder.rerankLocal('local query', docs);

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(2);
      expect(results[0].rerankerScore).toBeGreaterThanOrEqual(results[1].rerankerScore);
      expect(results[0].provider).toBe('local');
      expect(results[0].scoringMethod).toBe('cross-encoder');
    });

    it('originalRank tracks input position', async () => {
      mockFetch(200, {
        results: [
          { index: 2, relevance_score: 0.8 },
          { index: 0, relevance_score: 0.6 },
          { index: 1, relevance_score: 0.3 },
        ],
      });

      const docs: RerankDocument[] = [
        { id: 'a', content: 'one' },
        { id: 'b', content: 'two' },
        { id: 'c', content: 'three' },
      ];
      const results = await crossEncoder.rerankLocal('query', docs);

      const topResult = results[0]; // index 2 → id 'c', score 0.8
      expect(topResult.id).toBe('c');
      expect(topResult.originalRank).toBe(2);
    });

    it('throws on non-OK HTTP response', async () => {
      mockFetch(502, { error: 'Bad Gateway' });

      await expect(
        crossEncoder.rerankLocal('query', [{ id: 1, content: 'doc' }])
      ).rejects.toThrow(/Local rerank failed: 502/);
    });

    it('throws on network error', async () => {
      mockFetch(0, null, true);

      await expect(
        crossEncoder.rerankLocal('query', [{ id: 1, content: 'doc' }])
      ).rejects.toThrow('Network error');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 5. RERANKRESULTS WITH PROVIDER-SPECIFIC PATHS
  // ───────────────────────────────────────────────────────────────
  describe('5. rerankResults (provider paths)', () => {
    it('routes to Voyage when VOYAGE_API_KEY set', async () => {
      process.env.VOYAGE_API_KEY = 'voyage-key';
      mockFetch(200, {
        data: [
          { index: 0, relevance_score: 0.77 },
        ],
      });

      const docs = [{ id: 1, content: 'a'.repeat(100) }];
      const results = await crossEncoder.rerankResults('query', docs, { useCache: false });

      expect(results.length).toBe(1);
      expect(results[0].provider).toBe('voyage');
      expect(results[0].scoringMethod).toBe('cross-encoder');
      // Length penalty applied: 100 chars is medium → *1.0
      expect(results[0].rerankerScore).toBeCloseTo(0.77, 9);
    });

    it('routes to Cohere when COHERE_API_KEY set', async () => {
      process.env.COHERE_API_KEY = 'cohere-key';
      mockFetch(200, {
        results: [
          { index: 0, relevance_score: 0.66 },
        ],
      });

      const docs = [{ id: 2, content: 'b'.repeat(100) }];
      const results = await crossEncoder.rerankResults('query', docs, { useCache: false });

      expect(results.length).toBe(1);
      expect(results[0].provider).toBe('cohere');
      expect(results[0].scoringMethod).toBe('cross-encoder');
    });

    it('routes to local when RERANKER_LOCAL=true', async () => {
      process.env.RERANKER_LOCAL = 'true';
      mockFetch(200, {
        results: [
          { index: 0, relevance_score: 0.55 },
        ],
      });

      const docs = [{ id: 3, content: 'c'.repeat(100) }];
      const results = await crossEncoder.rerankResults('query', docs, { useCache: false });

      expect(results.length).toBe(1);
      expect(results[0].provider).toBe('local');
      expect(results[0].scoringMethod).toBe('cross-encoder');
    });

    it('applies length penalty to provider results', async () => {
      process.env.VOYAGE_API_KEY = 'voyage-key';
      mockFetch(200, {
        data: [
          { index: 0, relevance_score: 1.0 },
        ],
      });

      // Short content (<50 chars) → length penalty 0.9
      const docs = [{ id: 4, content: 'tiny' }];
      const results = await crossEncoder.rerankResults('q', docs, { useCache: false });

      // RerankerScore should be 1.0 * 0.9 = 0.9 after length penalty
      expect(results[0].rerankerScore).toBeCloseTo(0.9, 9);
    });

    it('provider error falls back gracefully', async () => {
      process.env.VOYAGE_API_KEY = 'voyage-key';
      mockFetch(500, { error: 'Internal error' });

      const docs = [{ id: 5, content: 'doc content' }];
      const results = await crossEncoder.rerankResults('query', docs, { useCache: false });

      // Provider failed → should fall back gracefully (not throw)
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(1);
      expect(results[0].provider).toBe('fallback');
      expect(results[0].scoringMethod).toBe('fallback');
    });

    it('no provider returns fallback with correct scoringMethod', async () => {
      // No provider → fallback scoring with scoringMethod = 'fallback'
      const docs = [
        { id: 'f1', content: 'alpha' },
        { id: 'f2', content: 'beta' },
      ];
      const results = await crossEncoder.rerankResults('query', docs, { useCache: false });

      expect(results.length).toBe(2);
      expect(results[0].provider).toBe('none');
      expect(results[0].scoringMethod).toBe('fallback');
      // P3-16: fallback scores in 0-0.5 range, first > second
      expect(results[0].score).toBeLessThanOrEqual(0.5);
      expect(results[0].score).toBeGreaterThan(results[1].score);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 6. RERANKRESULTS CACHING BEHAVIOR
  // ───────────────────────────────────────────────────────────────
  describe('6. rerankResults (caching)', () => {
    it('second call with same input uses cache', async () => {
      process.env.VOYAGE_API_KEY = 'voyage-key';

      let fetchCallCount = 0;
      globalThis.fetch = vi.fn(async (..._args: Parameters<typeof fetch>): Promise<Response> => {
        fetchCallCount++;
        return new Response(JSON.stringify({ data: [{ index: 0, relevance_score: 0.8 }] }), {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const docs = [{ id: 'cache-1', content: 'a'.repeat(100) }];

      // First call — should hit the API
      await crossEncoder.rerankResults('cache query', docs, { useCache: true });
      expect(fetchCallCount).toBe(1);

      // Second call with same query+docs — should use cache
      await crossEncoder.rerankResults('cache query', docs, { useCache: true });
      expect(fetchCallCount).toBe(1);
    });

    it('useCache=false bypasses cache', async () => {
      process.env.VOYAGE_API_KEY = 'voyage-key';

      let fetchCallCount = 0;
      globalThis.fetch = vi.fn(async (..._args: Parameters<typeof fetch>): Promise<Response> => {
        fetchCallCount++;
        return new Response(JSON.stringify({ data: [{ index: 0, relevance_score: 0.8 }] }), {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const docs = [{ id: 'nc-1', content: 'a'.repeat(100) }];

      // Call with useCache: false — should always hit API
      await crossEncoder.rerankResults('no-cache query', docs, { useCache: false });
      expect(fetchCallCount).toBe(1);

      await crossEncoder.rerankResults('no-cache query', docs, { useCache: false });
      expect(fetchCallCount).toBe(2);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 7. RERANKRESULTS LATENCY TRACKING
  // ───────────────────────────────────────────────────────────────
  describe('7. rerankResults (latency tracking)', () => {
    it('tracks latency after successful provider call', async () => {
      process.env.VOYAGE_API_KEY = 'voyage-key';
      mockFetch(200, { data: [{ index: 0, relevance_score: 0.5 }] });

      const docs = [{ id: 'lat-1', content: 'a'.repeat(100) }];
      await crossEncoder.rerankResults('latency-test', docs, { useCache: false });

      const status = crossEncoder.getRerankerStatus();
      expect(status.latency.count).toBeGreaterThanOrEqual(1);
      expect(status.latency.avg).toBeGreaterThanOrEqual(0);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 8. VOYAGE PROVIDER PRIORITY OVER COHERE
  // ───────────────────────────────────────────────────────────────
  describe('8. Provider priority', () => {
    it('Voyage takes priority over Cohere when both keys set', async () => {
      process.env.VOYAGE_API_KEY = 'voyage-key';
      process.env.COHERE_API_KEY = 'cohere-key';

      mockFetch(200, { data: [{ index: 0, relevance_score: 0.7 }] });

      const docs = [{ id: 'pri-1', content: 'a'.repeat(100) }];
      const results = await crossEncoder.rerankResults('priority-test', docs, { useCache: false });

      // Voyage has higher priority than Cohere
      expect(results[0].provider).toBe('voyage');
    });
  });
});
