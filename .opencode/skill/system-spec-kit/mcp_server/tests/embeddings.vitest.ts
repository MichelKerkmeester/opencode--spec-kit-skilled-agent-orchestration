// ---------------------------------------------------------------
// TEST: Embeddings Architecture (T513)
// Verifies current shared-provider architecture and MCP facade.
// ---------------------------------------------------------------

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  createEmbeddingsProvider,
  getProviderInfo,
  resolveProvider,
  validateApiKey,
} from '@spec-kit/shared/embeddings/factory';
import * as embeddingsFacade from '../lib/providers/embeddings';

const ENV_KEYS = [
  'EMBEDDINGS_PROVIDER',
  'VOYAGE_API_KEY',
  'OPENAI_API_KEY',
  'VOYAGE_EMBEDDINGS_MODEL',
  'OPENAI_EMBEDDINGS_MODEL',
  'HF_EMBEDDINGS_MODEL',
] as const;

const ORIGINAL_ENV = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]])
) as Record<string, string | undefined>;

function resetEnv(): void {
  for (const key of ENV_KEYS) {
    const value = ORIGINAL_ENV[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

describe('Embeddings Architecture (T513)', () => {
  beforeEach(() => {
    resetEnv();
  });

  afterEach(() => {
    resetEnv();
  });

  describe('Provider resolution', () => {
    it('T513-01a: explicit EMBEDDINGS_PROVIDER takes precedence', () => {
      process.env.EMBEDDINGS_PROVIDER = 'hf-local';
      process.env.VOYAGE_API_KEY = 'voyage_test_key_1234567890';
      process.env.OPENAI_API_KEY = 'openai_test_key_1234567890';

      const resolution = resolveProvider();
      expect(resolution.name).toBe('hf-local');
      expect(resolution.reason).toContain('Explicit EMBEDDINGS_PROVIDER');
    });

    it('T513-01b: auto mode prefers voyage when key is valid', () => {
      delete process.env.EMBEDDINGS_PROVIDER;
      process.env.VOYAGE_API_KEY = 'voyage_test_key_1234567890';
      delete process.env.OPENAI_API_KEY;

      const resolution = resolveProvider();
      expect(resolution.name).toBe('voyage');
      expect(resolution.reason).toContain('VOYAGE_API_KEY');
    });

    it('T513-01c: auto mode falls back to openai when voyage key is placeholder', () => {
      delete process.env.EMBEDDINGS_PROVIDER;
      process.env.VOYAGE_API_KEY = 'YOUR_VOYAGE_API_KEY_HERE';
      process.env.OPENAI_API_KEY = 'openai_test_key_1234567890';

      const resolution = resolveProvider();
      expect(resolution.name).toBe('openai');
      expect(resolution.reason).toContain('OPENAI_API_KEY');
    });

    it('T513-01d: auto mode defaults to hf-local with no keys', () => {
      delete process.env.EMBEDDINGS_PROVIDER;
      delete process.env.VOYAGE_API_KEY;
      delete process.env.OPENAI_API_KEY;

      const resolution = resolveProvider();
      expect(resolution.name).toBe('hf-local');
      expect(resolution.reason).toContain('Default fallback');
    });
  });

  describe('Provider factory', () => {
    it('T513-02a: creates hf-local provider with expected interface methods', async () => {
      const provider = await createEmbeddingsProvider({
        provider: 'hf-local',
        warmup: false,
        dim: 768,
      });

      const methods = [
        'generateEmbedding',
        'embedDocument',
        'embedQuery',
        'warmup',
        'getMetadata',
        'getProfile',
        'healthCheck',
        'getProviderName',
      ] as const;

      for (const method of methods) {
        expect(typeof provider[method]).toBe('function');
      }

      const metadata = provider.getMetadata();
      expect(metadata.provider).toBe('hf-local');
      expect(metadata.dim).toBe(768);
    });

    it('T513-02b: openai provider without key fails fast', async () => {
      delete process.env.OPENAI_API_KEY;
      await expect(createEmbeddingsProvider({ provider: 'openai' })).rejects.toThrow('OPENAI_API_KEY');
    });

    it('T513-02c: voyage provider without key fails fast', async () => {
      delete process.env.VOYAGE_API_KEY;
      await expect(createEmbeddingsProvider({ provider: 'voyage' })).rejects.toThrow('VOYAGE_API_KEY');
    });
  });

  describe('Provider info and validation', () => {
    it('T513-03a: getProviderInfo masks API keys', () => {
      process.env.EMBEDDINGS_PROVIDER = 'auto';
      process.env.VOYAGE_API_KEY = 'voyage_test_key_1234567890';
      delete process.env.OPENAI_API_KEY;

      const info = getProviderInfo();
      expect(info.provider).toBe('voyage');
      expect(info.config.VOYAGE_API_KEY).toBe('***set***');
      expect(info.config.OPENAI_API_KEY).toBe('not set');
    });

    it('T513-03b: validateApiKey succeeds for local provider', async () => {
      process.env.EMBEDDINGS_PROVIDER = 'hf-local';
      delete process.env.VOYAGE_API_KEY;
      delete process.env.OPENAI_API_KEY;

      const result = await validateApiKey({ timeout: 100 });
      expect(result.valid).toBe(true);
      expect(result.provider).toBe('hf-local');
    });

    it('T513-03c: validateApiKey returns E050 when openai key is missing', async () => {
      process.env.EMBEDDINGS_PROVIDER = 'openai';
      delete process.env.OPENAI_API_KEY;

      const result = await validateApiKey({ timeout: 100 });
      expect(result.valid).toBe(false);
      expect(result.provider).toBe('openai');
      expect(result.errorCode).toBe('E050');
    });
  });

  describe('MCP embeddings facade', () => {
    it('T513-04a: exports expected embedding API surface', () => {
      expect(typeof embeddingsFacade.generateDocumentEmbedding).toBe('function');
      expect(typeof embeddingsFacade.generateQueryEmbedding).toBe('function');
      expect(typeof embeddingsFacade.getEmbeddingDimension).toBe('function');
      expect(typeof embeddingsFacade.getProviderMetadata).toBe('function');
      expect(typeof embeddingsFacade.getEmbeddingProfile).toBe('function');
      expect(typeof embeddingsFacade.validateApiKey).toBe('function');
    });

    it('T513-04b: empty document and query inputs return null without provider warmup', async () => {
      const docResult = await embeddingsFacade.generateDocumentEmbedding('');
      const queryResult = await embeddingsFacade.generateQueryEmbedding('   ');

      expect(docResult).toBeNull();
      expect(queryResult).toBeNull();
    });

    it('T513-04c: provider metadata is available even before initialization', () => {
      const metadata = embeddingsFacade.getProviderMetadata();
      expect(metadata).toBeDefined();
      expect(typeof metadata).toBe('object');
    });
  });
});
