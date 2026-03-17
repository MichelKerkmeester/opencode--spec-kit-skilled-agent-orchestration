// TEST: Content Filter Multi-CLI Parity
import { describe, expect, it } from 'vitest';

import { NOISE_PATTERNS, isNoiseContent } from '../lib/content-filter';

describe('content filter multi-cli parity', () => {
  it('treats Copilot lifecycle events as built-in noise', () => {
    expect(isNoiseContent('tool.execution_start')).toBe(true);
    expect(isNoiseContent('tool.execution_complete')).toBe(true);
  });

  it('treats Codex reasoning markers as built-in noise', () => {
    expect(isNoiseContent('reasoning')).toBe(true);
    expect(isNoiseContent('<reasoning>Working through the request</reasoning>')).toBe(true);
  });

  it('treats single-line empty XML wrapper tags as built-in noise', () => {
    expect(isNoiseContent('<command-message></command-message>')).toBe(true);
    expect(isNoiseContent('<custom_wrapper> </custom_wrapper>')).toBe(true);
  });

  it('exports parity patterns through the shared NOISE_PATTERNS list', () => {
    const patternLabels = NOISE_PATTERNS.map((pattern) => pattern.toString());

    expect(patternLabels).toEqual(expect.arrayContaining([
      '/^tool\\.execution_start/i',
      '/^tool\\.execution_complete/i',
      '/^reasoning$/i',
      '/^<reasoning>.*<\\/reasoning>$/s',
      '/^<[a-z_-]+>\\s*<\\/[a-z_-]+>$/',
    ]));
  });
});
