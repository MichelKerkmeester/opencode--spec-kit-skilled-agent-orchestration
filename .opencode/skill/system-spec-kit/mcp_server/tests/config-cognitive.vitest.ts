// TEST: COGNITIVE CONFIG VALIDATION (T004)
import { describe, it, expect, vi } from 'vitest';
import {
  loadCognitiveConfigFromEnv,
  safeParseCognitiveConfigFromEnv,
} from '../configs/cognitive';

describe('T004: cognitive startup config validation', () => {
  it('T004-1: safe parse returns success for valid env', () => {
    const result = safeParseCognitiveConfigFromEnv({
      SPECKIT_COGNITIVE_COACTIVATION_PATTERN: '\\b(memory|context)\\b',
      SPECKIT_COGNITIVE_COACTIVATION_FLAGS: 'i',
    } as NodeJS.ProcessEnv);

    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.data?.coActivationPattern).toBeInstanceOf(RegExp);
  });

  it('T004-2: malformed env fails fast during load', () => {
    expect(() => loadCognitiveConfigFromEnv({
      SPECKIT_COGNITIVE_COACTIVATION_PATTERN: '\\b(memory|context)\\b',
      SPECKIT_COGNITIVE_COACTIVATION_FLAGS: 'not-a-real-flag',
    } as NodeJS.ProcessEnv)).toThrow(/Validation failed/);
  });

  it('T004-3: unsafe regex pattern is rejected', () => {
    const result = safeParseCognitiveConfigFromEnv({
      SPECKIT_COGNITIVE_COACTIVATION_PATTERN: '(a+)+$',
      SPECKIT_COGNITIVE_COACTIVATION_FLAGS: 'i',
    } as NodeJS.ProcessEnv);

    expect(result.success).toBe(false);
    expect(result.errors.some((error) => error.message.includes('Unsafe regex rejected'))).toBe(true);
  });

  it('T004-4: startup import fails fast on malformed env', async () => {
    vi.resetModules();
    const oldPattern = process.env.SPECKIT_COGNITIVE_COACTIVATION_PATTERN;
    const oldFlags = process.env.SPECKIT_COGNITIVE_COACTIVATION_FLAGS;

    process.env.SPECKIT_COGNITIVE_COACTIVATION_PATTERN = '\\b(memory|context)\\b';
    process.env.SPECKIT_COGNITIVE_COACTIVATION_FLAGS = 'invalid!';

    try {
      await expect(import('../configs/cognitive')).rejects.toThrow(/Validation failed/);
    } finally {
      if (oldPattern === undefined) {
        delete process.env.SPECKIT_COGNITIVE_COACTIVATION_PATTERN;
      } else {
        process.env.SPECKIT_COGNITIVE_COACTIVATION_PATTERN = oldPattern;
      }

      if (oldFlags === undefined) {
        delete process.env.SPECKIT_COGNITIVE_COACTIVATION_FLAGS;
      } else {
        process.env.SPECKIT_COGNITIVE_COACTIVATION_FLAGS = oldFlags;
      }
    }
  });
});
