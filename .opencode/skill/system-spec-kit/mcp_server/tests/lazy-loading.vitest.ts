import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// TEST: Lazy Loading Startup Behavior (T016-T019)
// Architecture-aligned replacement for legacy deferred placeholder.

const ENV_KEYS = [
  'EMBEDDINGS_PROVIDER',
  'SPECKIT_EAGER_WARMUP',
  'SPECKIT_LAZY_LOADING',
  'VOYAGE_API_KEY',
  'OPENAI_API_KEY',
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

async function loadEmbeddingsModule() {
  vi.resetModules();
  return import('../../shared/embeddings');
}

describe('Lazy Loading Startup Behavior (T016-T019)', () => {
  beforeEach(() => {
    resetEnv();
    process.env.EMBEDDINGS_PROVIDER = 'hf-local';
  });

  afterEach(() => {
    resetEnv();
  });

  it('T016: shouldEagerWarmup() is false by default', async () => {
    delete process.env.SPECKIT_EAGER_WARMUP;
    delete process.env.SPECKIT_LAZY_LOADING;

    const embeddings = await loadEmbeddingsModule();
    expect(embeddings.shouldEagerWarmup()).toBe(false);
  });

  it('T018: empty inputs return null without triggering provider init', async () => {
    const embeddings = await loadEmbeddingsModule();

    expect(embeddings.isProviderInitialized()).toBe(false);
    expect(await embeddings.generateDocumentEmbedding('')).toBeNull();
    expect(await embeddings.generateQueryEmbedding('   ')).toBeNull();
    expect(embeddings.isProviderInitialized()).toBe(false);
  });

  it('T019: provider initializes lazily on first provider-dependent call', async () => {
    const embeddings = await loadEmbeddingsModule();

    expect(embeddings.isProviderInitialized()).toBe(false);
    await embeddings.getEmbeddingProfileAsync();

    const stats = embeddings.getLazyLoadingStats();
    expect(embeddings.isProviderInitialized()).toBe(true);
    expect(stats.isInitialized).toBe(true);
    expect(stats.initStartTime).not.toBeNull();
    expect(stats.initCompleteTime).not.toBeNull();
  });
});
