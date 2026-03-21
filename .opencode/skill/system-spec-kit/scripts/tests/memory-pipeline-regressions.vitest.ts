import { afterEach, describe, expect, it, vi } from 'vitest';

import { truncateMemoryTitle } from '../core/title-builder';
import { generateImplementationSummary } from '../lib/semantic-summarizer';
import { extractTriggerPhrases as extractSharedTriggerPhrases } from '@spec-kit/shared/trigger-extractor';

const ORIGINAL_ENV: Record<string, string | undefined> = {
  EMBEDDINGS_PROVIDER: process.env.EMBEDDINGS_PROVIDER,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_EMBEDDINGS_MODEL: process.env.OPENAI_EMBEDDINGS_MODEL,
  VOYAGE_API_KEY: process.env.VOYAGE_API_KEY,
  VOYAGE_EMBEDDINGS_MODEL: process.env.VOYAGE_EMBEDDINGS_MODEL,
  HF_EMBEDDINGS_MODEL: process.env.HF_EMBEDDINGS_MODEL,
};

function restoreEnv(): void {
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

afterEach(() => {
  vi.resetModules();
  vi.doUnmock('../../shared/embeddings/factory');
  restoreEnv();
});

describe('memory pipeline regressions', () => {
  it('truncates memory titles at the last whole word', () => {
    expect(truncateMemoryTitle('Alpha beta gamma delta epsilon', 21)).toBe('Alpha beta gamma...');
  });

  it('trims extracted outcomes back to a whole word boundary', () => {
    const summary = generateImplementationSummary([
      { prompt: 'Fix the memory pipeline regressions.' },
      {
        content: 'Completed: Implemented deterministic outcome trimming for memory titles and key outcomes across summarizer boundary handling safely.',
      },
    ]);

    expect(summary.outcomes[0]).toBe(
      'Implemented deterministic outcome trimming for memory titles and key outcomes',
    );
  });

  it('filters generic single-word trigger phrases while preserving meaningful phrases', () => {
    const phrases = extractSharedTriggerPhrases(
      'Manual testing per spec phase validated deterministic trigger extraction for embeddings provider selection and memory title truncation.',
    );

    expect(phrases).not.toContain('manual');
    expect(phrases).not.toContain('testing');
    expect(phrases).not.toContain('spec');
    expect(phrases.join(' ')).toContain('embeddings provider');
  });

  it('derives MODEL_NAME from environment before provider initialization', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'openai';
    process.env.OPENAI_API_KEY = 'test-openai-key';
    delete process.env.VOYAGE_API_KEY;
    delete process.env.OPENAI_EMBEDDINGS_MODEL;

    const embeddings = await import('../../shared/embeddings');

    expect(embeddings.MODEL_NAME).toBe('text-embedding-3-small');
  });

  it('updates MODEL_NAME after provider initialization completes', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'hf-local';
    delete process.env.OPENAI_API_KEY;
    delete process.env.VOYAGE_API_KEY;

    const mockProvider = {
      generateEmbedding: vi.fn(async () => new Float32Array([1, 2, 3])),
      embedDocument: vi.fn(async () => new Float32Array([1, 2, 3])),
      embedQuery: vi.fn(async () => new Float32Array([1, 2, 3])),
      warmup: vi.fn(async () => true),
      getMetadata: vi.fn(() => ({
        provider: 'voyage',
        model: 'voyage-4-large',
        dim: 1024,
        healthy: true,
      })),
      getProfile: vi.fn(() => ({
        provider: 'voyage',
        model: 'voyage-4-large',
        dim: 1024,
        slug: 'voyage-4-large',
      })),
      healthCheck: vi.fn(async () => true),
      getProviderName: vi.fn(() => 'Mock Provider'),
    };

    vi.doMock('../../shared/embeddings/factory', () => ({
      createEmbeddingsProvider: vi.fn(async () => mockProvider),
      getProviderInfo: vi.fn(() => ({
        provider: 'hf-local',
        reason: 'mocked',
        config: {},
      })),
      validateApiKey: vi.fn(async () => ({ valid: true, provider: 'mocked' })),
      VALIDATION_TIMEOUT_MS: 1000,
    }));

    const embeddings = await import('../../shared/embeddings');

    expect(embeddings.MODEL_NAME).toBe('nomic-ai/nomic-embed-text-v1.5');

    await embeddings.getEmbeddingProfileAsync();

    expect(embeddings.MODEL_NAME).toBe('voyage-4-large');
  });
});
