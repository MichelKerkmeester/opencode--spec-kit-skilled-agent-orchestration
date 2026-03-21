// ───────────────────────────────────────────────────────────────────
// MODULE: Content Filter Parity Tests
// ───────────────────────────────────────────────────────────────────
// TEST: Content Filter Multi-CLI Parity
import { describe, expect, it } from 'vitest';

import { NOISE_PATTERNS, createFilterPipeline, isNoiseContent } from '../lib/content-filter';

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

  it('keeps shared-prefix prompts when their bigram shingles diverge', () => {
    const sharedPrefix = Array.from({ length: 20 }, (_, index) => `shared-prefix-token-${index}`).join(' ');
    const firstTail = Array.from({ length: 20 }, (_, index) => `alpha-tail-${index}`).join(' ');
    const secondTail = Array.from({ length: 20 }, (_, index) => `beta-tail-${index}`).join(' ');
    const firstPrompt = `${sharedPrefix} ${firstTail}`;
    const secondPrompt = `${sharedPrefix} ${secondTail}`;
    const pipeline = createFilterPipeline({
      pipeline: {
        enabled: true,
        stages: ['dedupe'],
      },
      noise: {
        enabled: false,
        minContentLength: 0,
        minUniqueWords: 0,
        patterns: [],
      },
      dedupe: {
        enabled: true,
        hashLength: 300,
        similarityThreshold: 0.70,
      },
      quality: {
        enabled: false,
        warnThreshold: 0,
        factors: {
          uniqueness: 0.30,
          density: 0.30,
          fileRefs: 0.20,
          decisions: 0.20,
        },
      },
    });

    expect(pipeline.deduplicate([
      { content: firstPrompt },
      { content: secondPrompt },
    ])).toHaveLength(2);
  });
});
