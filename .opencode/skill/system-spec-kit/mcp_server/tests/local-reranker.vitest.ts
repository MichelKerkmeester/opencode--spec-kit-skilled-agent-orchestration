// ---------------------------------------------------------------
// TEST: Local Reranker Guardrails
// ---------------------------------------------------------------

import { describe, expect, it } from 'vitest';

import { __testables } from '../lib/search/local-reranker';

describe('local-reranker score extraction', () => {
  it('accepts explicit score-bearing objects', () => {
    expect(__testables.extractNumericScore({ score: 0.75 })).toBe(0.75);
    expect(__testables.extractNumericScore({ relevance: '0.5' })).toBe(0.5);
  });

  it('rejects embedding-like arrays and payloads', () => {
    expect(__testables.extractNumericScore([0.1, 0.2, 0.3])).toBeNull();
    expect(__testables.extractNumericScore({ embedding: [0.1, 0.2, 0.3] })).toBeNull();
  });
});

describe('local-reranker scoring method resolution', () => {
  it('uses explicit score methods', async () => {
    const score = await __testables.scorePrompt({
      score: async () => ({ score: 1 }),
    }, 'query: a\ndocument: b');

    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  it('fails closed when only embed-style methods are present', async () => {
    await expect(__testables.scorePrompt({
      embed: async () => [0.1, 0.2, 0.3],
      encode: async () => ({ embedding: [0.1, 0.2, 0.3] }),
    }, 'query: a\ndocument: b')).rejects.toThrow(/Unable to resolve/);
  });
});

// CHK-064: Reranker latency benchmark — scorePrompt for 20 candidates < 500ms
describe('local-reranker latency benchmark (CHK-064)', () => {
  it('scorePrompt for 20 candidates completes in <500ms', async () => {
    // Mock context with ~5ms delay per score call (matching production hot path)
    const mockContext = {
      score: async () => {
        await new Promise(r => setTimeout(r, 5));
        return { score: Math.random() };
      },
    };

    const start = performance.now();

    // Score 20 candidates sequentially (matching production hot path at lines 240-255)
    for (let i = 0; i < 20; i++) {
      await __testables.scorePrompt(mockContext, `query: test query\ndocument: candidate document ${i}`);
    }

    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(500);
  });
});
