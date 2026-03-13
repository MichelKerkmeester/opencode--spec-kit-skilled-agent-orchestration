import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  VALIDATION_TIMEOUT_MS,
  validateApiKey,
} from '@spec-kit/shared/embeddings/factory';

// TEST: API Key Validation (T087-T090)
// REQ-029: Pre-Flight API Key Validation
// Architecture-aligned replacement for legacy deferred placeholder.

const ENV_KEYS = [
  'EMBEDDINGS_PROVIDER',
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

describe('API Key Validation (T087-T090)', () => {
  beforeEach(() => {
    resetEnv();
  });

  afterEach(() => {
    resetEnv();
  });

  it('T087: exposes VALIDATION_TIMEOUT_MS as 5000ms (CHK-170)', () => {
    expect(VALIDATION_TIMEOUT_MS).toBe(5000);
  });

  it('T088: skips API key validation for local provider', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'hf-local';
    delete process.env.VOYAGE_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const result = await validateApiKey();
    expect(result.valid).toBe(true);
    expect(result.provider).toBe('hf-local');
    expect(result.reason).toContain('Local provider');
  });

  it('T089: returns E050 when remote provider key is missing', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'voyage';
    delete process.env.VOYAGE_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const result = await validateApiKey();
    expect(result.valid).toBe(false);
    expect(result.provider).toBe('voyage');
    expect(result.errorCode).toBe('E050');
    expect(result.actions?.join(' ')).toContain('EMBEDDINGS_PROVIDER=hf-local');
  });

  it('T090: returns actionable guidance for missing OpenAI key', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'openai';
    delete process.env.OPENAI_API_KEY;
    delete process.env.VOYAGE_API_KEY;

    const result = await validateApiKey();
    expect(result.valid).toBe(false);
    expect(result.provider).toBe('openai');
    expect(result.errorCode).toBe('E050');
    expect(result.actions?.join(' ')).toContain('OPENAI_API_KEY');
    expect(result.actions?.join(' ')).toContain('platform.openai.com/api-keys');
  });
});
