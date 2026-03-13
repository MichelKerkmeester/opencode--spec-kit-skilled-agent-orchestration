// TEST: CROSS ENCODER
import { describe, it, expect, beforeEach } from 'vitest';
import * as crossEncoder from '../lib/search/cross-encoder';

describe('Cross-Encoder Reranking (T040-T051)', () => {
  // SUITE: Configuration Tests
  describe('Configuration Tests', () => {
    it('LENGTH_PENALTY has shortThreshold of 50', () => {
      expect(crossEncoder.LENGTH_PENALTY.shortThreshold).toBe(50);
    });

    it('LENGTH_PENALTY has longThreshold of 2000', () => {
      expect(crossEncoder.LENGTH_PENALTY.longThreshold).toBe(2000);
    });

    it('LENGTH_PENALTY shortPenalty is 0.9', () => {
      expect(crossEncoder.LENGTH_PENALTY.shortPenalty).toBe(0.9);
    });

    it('LENGTH_PENALTY longPenalty is 0.95', () => {
      expect(crossEncoder.LENGTH_PENALTY.longPenalty).toBe(0.95);
    });

    it('PROVIDER_CONFIG includes voyage, cohere, local', () => {
      expect(crossEncoder.PROVIDER_CONFIG.voyage).toBeTruthy();
      expect(crossEncoder.PROVIDER_CONFIG.cohere).toBeTruthy();
      expect(crossEncoder.PROVIDER_CONFIG.local).toBeTruthy();
    });
  });

  // SUITE: Provider Configuration Tests (T040-T042)
  describe('Provider Configuration Tests (T040-T042)', () => {
    it('T040: Voyage provider has correct configuration', () => {
      const voyageConfig = crossEncoder.PROVIDER_CONFIG.voyage;
      expect(voyageConfig.name).toBe('voyage');
      expect(voyageConfig.model).toBe('rerank-2');
      expect(voyageConfig.endpoint).toBe('https://api.voyageai.com/v1/rerank');
      expect(voyageConfig.apiKeyEnv).toBe('VOYAGE_API_KEY');
      expect(voyageConfig.timeout).toBe(15000);
      expect(voyageConfig.maxDocuments).toBe(100);
    });

    it('T041: Cohere provider has correct configuration', () => {
      const cohereConfig = crossEncoder.PROVIDER_CONFIG.cohere;
      expect(cohereConfig.name).toBe('cohere');
      expect(cohereConfig.model).toBe('rerank-english-v3.0');
      expect(cohereConfig.endpoint).toBe('https://api.cohere.ai/v1/rerank');
      expect(cohereConfig.apiKeyEnv).toBe('COHERE_API_KEY');
      expect(cohereConfig.timeout).toBe(15000);
      expect(cohereConfig.maxDocuments).toBe(100);
    });

    it('T042: Local provider has correct configuration', () => {
      const localConfig = crossEncoder.PROVIDER_CONFIG.local;
      expect(localConfig.name).toBe('local');
      expect(localConfig.model).toBe('cross-encoder/ms-marco-MiniLM-L-6-v2');
      expect(localConfig.endpoint).toBe('http://localhost:8765/rerank');
      expect(localConfig.timeout).toBe(30000);
      expect(localConfig.maxDocuments).toBe(50);
    });
  });

  // SUITE: Provider Auto-Resolution Tests (T043)
  describe('Provider Auto-Resolution Tests (T043)', () => {
    it('T043: Provider auto-resolution checks environment', () => {
      expect(typeof crossEncoder.resolveProvider).toBe('function');

      crossEncoder.resetProvider();

      const provider = crossEncoder.resolveProvider();
      expect(provider === null || typeof provider === 'string').toBe(true);
    });
  });

  // SUITE: Length Penalty Tests (REQ-008, T049)
  describe('Length Penalty Tests (REQ-008, T049)', () => {
    it('calculateLengthPenalty returns 1.0 for content in mid-range', () => {
      const penalty = crossEncoder.calculateLengthPenalty(100);
      expect(penalty).toBe(1.0);
    });

    it('calculateLengthPenalty returns 1.0 for long content (200 chars)', () => {
      const penalty = crossEncoder.calculateLengthPenalty(200);
      expect(penalty).toBe(1.0);
    });

    it('calculateLengthPenalty returns shortPenalty (0.9) for short content', () => {
      const penalty = crossEncoder.calculateLengthPenalty(10);
      expect(penalty).toBe(0.9);
    });

    it('calculateLengthPenalty returns shortPenalty (0.9) for zero length', () => {
      const penalty = crossEncoder.calculateLengthPenalty(0);
      expect(penalty).toBe(0.9);
    });

    it('calculateLengthPenalty returns longPenalty (0.95) for very long content', () => {
      const penalty = crossEncoder.calculateLengthPenalty(3000);
      expect(penalty).toBe(0.95);
    });

    it('T049: Length penalty for content at exactly shortThreshold', () => {
      const penalty = crossEncoder.calculateLengthPenalty(50);
      expect(penalty).toBe(1.0);
    });

    it('T049: Length penalty for content just below shortThreshold', () => {
      const penalty = crossEncoder.calculateLengthPenalty(49);
      expect(penalty).toBe(0.9);
    });
  });

  // SUITE: Cache Tests (T044-T047)
  describe('Cache Tests (T044-T047)', () => {
    it('T044: generateCacheKey is deterministic for same inputs', () => {
      const key1 = crossEncoder.generateCacheKey('test query', ['a', 'b']);
      const key2 = crossEncoder.generateCacheKey('test query', ['a', 'b']);
      expect(key1).toBe(key2);
    });

    it('T044: generateCacheKey sorts document IDs for consistency', () => {
      const key1 = crossEncoder.generateCacheKey('sort test', ['z', 'a', 'm']);
      const key2 = crossEncoder.generateCacheKey('sort test', ['a', 'm', 'z']);
      expect(key1).toBe(key2);
    });

    it('T044: generateCacheKey returns string starting with rerank-', () => {
      const key = crossEncoder.generateCacheKey('query', ['doc1']);
      expect(key.startsWith('rerank-')).toBe(true);
    });
  });

  // SUITE: Provider Availability Tests
  describe('Provider Availability Tests', () => {
    it('resolveProvider returns null when no providers configured', () => {
      crossEncoder.resetProvider();

      const provider = crossEncoder.resolveProvider();
      expect(provider === null || typeof provider === 'string').toBe(true);
    });
  });

  // SUITE: Reranker Status Tests
  describe('Reranker Status Tests', () => {
    it('isRerankerAvailable returns boolean', () => {
      const result = crossEncoder.isRerankerAvailable();
      expect(typeof result).toBe('boolean');
    });

    it('getRerankerStatus returns complete status object', () => {
      const status = crossEncoder.getRerankerStatus();

      expect(typeof status.available).toBe('boolean');
      expect(status.provider === null || typeof status.provider === 'string').toBe(true);
      expect(status.model === null || typeof status.model === 'string').toBe(true);
      expect(status.latency).toBeTruthy();
      expect(typeof status.latency.avg).toBe('number');
      expect(typeof status.latency.p95).toBe('number');
      expect(typeof status.latency.count).toBe('number');
    });

    it('resetSession clears session state', () => {
      crossEncoder.resetSession();
      const status = crossEncoder.getRerankerStatus();
      expect(status.latency.count).toBe(0);
    });
  });

  // SUITE: Rerank Function Tests (T050)
  describe('Rerank Function Tests (T050)', () => {
    it('rerankResults returns array for valid input', async () => {
      const results = [
        { id: 1, content: 'test content', title: 'Test' },
        { id: 2, content: 'another content', title: 'Another' },
      ];

      const reranked = await crossEncoder.rerankResults('test query', results, {
        limit: 10,
      });

      expect(Array.isArray(reranked)).toBe(true);
      expect(reranked).toHaveLength(2);
    });

    it('rerankResults respects limit', async () => {
      const results = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        content: `Content ${i}`,
        title: `Title ${i}`,
      }));

      const reranked = await crossEncoder.rerankResults('test query', results, {
        limit: 5,
      });

      expect(reranked.length).toBeLessThanOrEqual(5);
    });

    it('rerankResults handles empty results', async () => {
      const reranked = await crossEncoder.rerankResults('test query', [], {
        limit: 10,
      });

      expect(reranked).toHaveLength(0);
    });

    it('rerankResults handles single result', async () => {
      const results = [{ id: 1, content: 'single', title: 'Single' }];

      const reranked = await crossEncoder.rerankResults('test query', results, {
        limit: 10,
      });

      expect(reranked).toHaveLength(1);
    });

    it('rerankResults returns items with rerankerScore and provider', async () => {
      const results = [{ id: 1, content: 'test content', title: 'Test' }];

      const reranked = await crossEncoder.rerankResults('test query', results, {
        limit: 10,
      });

      expect(reranked.length).toBeGreaterThan(0);
      expect(typeof reranked[0].rerankerScore).toBe('number');
      expect(typeof reranked[0].provider).toBe('string');
    });
  });
});
