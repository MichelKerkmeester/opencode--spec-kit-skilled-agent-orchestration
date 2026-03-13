import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { validateApiKey } from '@spec-kit/shared/embeddings/factory';

// TEST: API Validation (T177-T184)
// REQ-029: Pre-Flight API Key Validation with HTTP mocking

const ENV_KEYS = [
  'EMBEDDINGS_PROVIDER',
  'VOYAGE_API_KEY',
  'OPENAI_API_KEY',
  'OPENAI_BASE_URL',
  'VOYAGE_EMBEDDINGS_MODEL',
  'OPENAI_EMBEDDINGS_MODEL',
] as const;

const ORIGINAL_ENV = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]])
) as Record<string, string | undefined>;

const originalFetch = globalThis.fetch;

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

function mockFetch(status: number, body: Record<string, unknown>, options: { delay?: number } = {}): void {
  globalThis.fetch = (async (_url: RequestInfo | URL, fetchOptions?: RequestInit) => {
    if (fetchOptions?.signal?.aborted) {
      const error = new Error('The operation was aborted');
      error.name = 'AbortError';
      throw error;
    }

    if (options.delay) {
      await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(resolve, options.delay);
        if (fetchOptions?.signal) {
          fetchOptions.signal.addEventListener('abort', () => {
            clearTimeout(timeoutId);
            const error = new Error('The operation was aborted');
            error.name = 'AbortError';
            reject(error);
          });
        }
      });
    }

    return {
      ok: status >= 200 && status < 300,
      status,
      statusText: `HTTP ${status}`,
      json: async () => body,
    } as Response;
  }) as typeof fetch;
}

describe('API Validation (T177-T184)', () => {
  beforeEach(() => {
    resetEnv();
    restoreFetch();
  });

  afterEach(() => {
    resetEnv();
    restoreFetch();
  });

  it('T177: validates Voyage API key on 200 response', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'voyage';
    process.env.VOYAGE_API_KEY = 'test-voyage-key';
    mockFetch(200, { data: [{ embedding: [0.1, 0.2, 0.3] }] });

    const result = await validateApiKey({ timeout: 100 });
    expect(result.valid).toBe(true);
    expect(result.provider).toBe('voyage');
    expect(result.reason).toContain('validated successfully');
  });

  it('T178: validates OpenAI API key on 200 response', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'openai';
    process.env.OPENAI_API_KEY = 'test-openai-key';
    mockFetch(200, { data: [{ embedding: [0.1, 0.2, 0.3] }] });

    const result = await validateApiKey({ timeout: 100 });
    expect(result.valid).toBe(true);
    expect(result.provider).toBe('openai');
    expect(result.reason).toContain('validated successfully');
  });

  it('T180: returns E053 on timeout', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'voyage';
    process.env.VOYAGE_API_KEY = 'test-voyage-key';
    mockFetch(200, {}, { delay: 60 });

    const result = await validateApiKey({ timeout: 10 });
    expect(result.valid).toBe(false);
    expect(result.provider).toBe('voyage');
    expect(result.errorCode).toBe('E053');
    expect(result.error).toContain('timed out');
  });

  it('T181: maps 401 to E050 auth error', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'voyage';
    process.env.VOYAGE_API_KEY = 'invalid-key';
    mockFetch(401, { error: { message: 'Invalid API key' } });

    const result = await validateApiKey({ timeout: 100 });
    expect(result.valid).toBe(false);
    expect(result.provider).toBe('voyage');
    expect(result.errorCode).toBe('E050');
    expect(result.httpStatus).toBe(401);
  });

  it('T181b: maps 403 to E050 auth error', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'voyage';
    process.env.VOYAGE_API_KEY = 'invalid-key';
    mockFetch(403, { error: { message: 'Access forbidden' } });

    const result = await validateApiKey({ timeout: 100 });
    expect(result.valid).toBe(false);
    expect(result.provider).toBe('voyage');
    expect(result.errorCode).toBe('E050');
    expect(result.httpStatus).toBe(403);
  });

  it('T182: treats 429 as valid with warning', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'voyage';
    process.env.VOYAGE_API_KEY = 'test-voyage-key';
    mockFetch(429, { error: { message: 'Rate limit exceeded' } });

    const result = await validateApiKey({ timeout: 100 });
    expect(result.valid).toBe(true);
    expect(result.provider).toBe('voyage');
    expect(result.warning).toContain('rate limited');
    expect(result.httpStatus).toBe(429);
  });

  it('T183: treats 5xx as valid with warning', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'openai';
    process.env.OPENAI_API_KEY = 'test-openai-key';
    mockFetch(503, { error: { message: 'Service unavailable' } });

    const result = await validateApiKey({ timeout: 100 });
    expect(result.valid).toBe(true);
    expect(result.provider).toBe('openai');
    expect(result.warning).toContain('Service returned error');
    expect(result.httpStatus).toBe(503);
  });
});
