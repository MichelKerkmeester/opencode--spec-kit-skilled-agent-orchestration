// TEST: Embeddings Architecture (T513)
// Verifies current shared-provider architecture and MCP facade.
import fs from 'fs';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createEmbeddingsProvider,
  getProviderInfo,
  resolveProvider,
  resolveStartupEmbeddingConfig,
  validateApiKey,
} from '@spec-kit/shared/embeddings/factory';
import { VoyageProvider } from '@spec-kit/shared/embeddings/providers/voyage';
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
const originalFetch = globalThis.fetch;
const HF_LOCAL_PROVIDER_FILE = path.resolve(__dirname, '..', '..', 'shared', 'embeddings', 'providers', 'hf-local.ts');
const OPENAI_PROVIDER_FILE = path.resolve(__dirname, '..', '..', 'shared', 'embeddings', 'providers', 'openai.ts');
const VOYAGE_PROVIDER_FILE = path.resolve(__dirname, '..', '..', 'shared', 'embeddings', 'providers', 'voyage.ts');

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

function restoreFetch(): void {
  globalThis.fetch = originalFetch;
}

function mockFetch(status: number, body: Record<string, unknown>): void {
  globalThis.fetch = vi.fn(async () => ({
    ok: status >= 200 && status < 300,
    status,
    statusText: `HTTP ${status}`,
    json: async () => body,
  } as Response)) as typeof fetch;
}

describe('Embeddings Architecture (T513)', () => {
  beforeEach(() => {
    resetEnv();
    restoreFetch();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    resetEnv();
    restoreFetch();
    vi.useRealTimers();
    vi.restoreAllMocks();
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

    it('T513-02d: auto fallback records effective provider metadata after warmup failure', async () => {
      delete process.env.EMBEDDINGS_PROVIDER;
      process.env.VOYAGE_API_KEY = 'voyage_test_key_1234567890';
      delete process.env.OPENAI_API_KEY;
      mockFetch(200, { data: [{ embedding: [0.1, 0.2, 0.3] }] });
      vi.spyOn(VoyageProvider.prototype, 'warmup').mockResolvedValue(false);

      const provider = await createEmbeddingsProvider({ warmup: true });
      const factoryMetadata = (provider as { factoryMetadata?: {
        requestedProvider: string;
        effectiveProvider: string;
        fallbackReason?: string;
        dimensionChanged: boolean;
      } }).factoryMetadata;

      expect(provider.getMetadata().provider).toBe('hf-local');
      expect(factoryMetadata).toMatchObject({
        requestedProvider: 'voyage',
        effectiveProvider: 'hf-local',
        dimensionChanged: true,
      });
      expect(factoryMetadata?.fallbackReason).toContain('warmup failed');

      const info = getProviderInfo();
      expect(info.provider).toBe('hf-local');
      expect(info.requestedProvider).toBe('voyage');
      expect(info.effectiveProvider).toBe('hf-local');
      expect(info.dimensionChanged).toBe(true);
    });

    it('T513-02e: validation runs before explicit cloud provider creation', async () => {
      process.env.EMBEDDINGS_PROVIDER = 'openai';
      process.env.OPENAI_API_KEY = 'invalid-openai-key';
      mockFetch(401, { error: { message: 'Invalid API key' } });

      await expect(createEmbeddingsProvider({ provider: 'openai' })).rejects.toThrow('invalid or unauthorized');
    });
  });

  describe('Provider info and validation', () => {
    it('T513-03a: getProviderInfo masks API keys', () => {
      process.env.EMBEDDINGS_PROVIDER = 'auto';
      process.env.VOYAGE_API_KEY = 'voyage_test_key_1234567890';
      delete process.env.OPENAI_API_KEY;

      const info = getProviderInfo();
      expect(info.provider).toBe('voyage');
      expect(info.requestedProvider).toBe('voyage');
      expect(info.effectiveProvider).toBe('voyage');
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

    it('T513-03d: resolveStartupEmbeddingConfig validates before exposing dimension data', async () => {
      process.env.EMBEDDINGS_PROVIDER = 'openai';
      process.env.OPENAI_API_KEY = 'openai_test_key_1234567890';
      mockFetch(200, { data: [{ embedding: [0.1, 0.2, 0.3] }] });

      const startup = await resolveStartupEmbeddingConfig({ timeout: 100 });
      expect(startup.validation.valid).toBe(true);
      expect(startup.info.provider).toBe('openai');
      expect(startup.dimension).toBeGreaterThan(0);
    });

    it('T513-03e: hf-local inference respects provider timeout', async () => {
      const source = fs.readFileSync(HF_LOCAL_PROVIDER_FILE, 'utf8');
      expect(source).toContain('async function withTimeout<T>(');
      expect(source).toContain('HF local inference timed out after ${this.timeout}ms');
      expect(source).toContain('const output = await withTimeout(');
    });

    it('T513-03f: openai warmup uses a bounded Promise.race deadline', () => {
      const source = fs.readFileSync(OPENAI_PROVIDER_FILE, 'utf8');
      expect(source).toContain('const result = await Promise.race([');
      expect(source).toContain('OpenAI warmup timed out after ${this.timeout}ms');
      expect(source).toContain('proceeding with cold provider state');
    });

    it('T513-03g: voyage warmup uses a bounded Promise.race deadline', () => {
      const source = fs.readFileSync(VOYAGE_PROVIDER_FILE, 'utf8');
      expect(source).toContain('const result = await Promise.race([');
      expect(source).toContain('Voyage warmup timed out after ${this.timeout}ms');
      expect(source).toContain('proceeding with cold provider state');
    });
  });

  describe('MCP embeddings facade', () => {
    it('T513-04a: exports expected embedding API surface', () => {
      expect(typeof embeddingsFacade.generateDocumentEmbedding).toBe('function');
      expect(typeof embeddingsFacade.buildWeightedDocumentText).toBe('function');
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

    it('T513-04d: getModelName reflects configured provider before lazy initialization', () => {
      process.env.EMBEDDINGS_PROVIDER = 'auto';
      process.env.VOYAGE_API_KEY = 'voyage_test_key_1234567890';
      process.env.VOYAGE_EMBEDDINGS_MODEL = 'voyage-4-lite';
      delete process.env.OPENAI_API_KEY;

      expect(embeddingsFacade.getModelName()).toBe('voyage-4-lite');
    });
  });
});
