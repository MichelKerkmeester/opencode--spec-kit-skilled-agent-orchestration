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
