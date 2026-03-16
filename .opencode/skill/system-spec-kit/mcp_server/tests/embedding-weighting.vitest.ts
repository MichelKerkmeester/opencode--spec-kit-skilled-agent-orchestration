import { describe, expect, it } from 'vitest';

import { buildWeightedDocumentText, type WeightedDocumentSections } from '@spec-kit/shared/index';

function countOccurrences(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter(Boolean);
}

function createDeterministicMockProvider(vocabulary: string[]) {
  const indexByToken = new Map(vocabulary.map((token, index) => [token, index]));

  function embed(text: string): Float32Array {
    const vector = new Float32Array(vocabulary.length);
    for (const token of tokenize(text)) {
      const index = indexByToken.get(token);
      if (index !== undefined) {
        vector[index] += 1;
      }
    }
    return vector;
  }

  return {
    async embedDocument(text: string): Promise<Float32Array> {
      return embed(text);
    },
    async embedQuery(text: string): Promise<Float32Array> {
      return embed(text);
    },
  };
}

function cosineSimilarity(left: Float32Array, right: Float32Array): number {
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < left.length; index++) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] * left[index];
    rightMagnitude += right[index] * right[index];
  }

  if (leftMagnitude === 0 || rightMagnitude === 0) {
    return 0;
  }

  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}

describe('Embedding weighting helper', () => {
  it('repeats title/decision/outcome/general sections with the expected multipliers and order', () => {
    const sections: WeightedDocumentSections = {
      title: 'Rollback guardrail',
      decisions: ['Choose rollback-only recovery path'],
      outcomes: ['Rollback validated in staging'],
      general: 'General implementation notes',
    };

    const weighted = buildWeightedDocumentText(sections);

    expect(weighted.indexOf('Rollback guardrail')).toBeLessThan(weighted.indexOf('Choose rollback-only recovery path'));
    expect(weighted.indexOf('Choose rollback-only recovery path')).toBeLessThan(weighted.indexOf('Rollback validated in staging'));
    expect(weighted.indexOf('Rollback validated in staging')).toBeLessThan(weighted.indexOf('General implementation notes'));
    expect(countOccurrences(weighted, 'Rollback guardrail')).toBe(1);
    expect(countOccurrences(weighted, 'Choose rollback-only recovery path')).toBe(3);
    expect(countOccurrences(weighted, 'Rollback validated in staging')).toBe(2);
    expect(countOccurrences(weighted, 'General implementation notes')).toBe(1);
  });

  it('handles empty or whitespace-only sections without leaking blank blocks', () => {
    const weighted = buildWeightedDocumentText({
      title: '  Decision summary  ',
      decisions: ['   ', 'Adopt deterministic weighting'],
      outcomes: [],
      general: '   ',
    });

    expect(weighted).toContain('Decision summary');
    expect(weighted).toContain('Adopt deterministic weighting');
    expect(weighted).not.toContain('\n\n\n');
    expect(weighted).not.toContain('   ');
  });

  it('truncates general content before outcomes and decisions, preserving word boundaries', () => {
    const general = Array.from({ length: 40 }, () => 'generalcontext').join(' ');
    const weighted = buildWeightedDocumentText({
      title: 'Rollback memory',
      decisions: ['Critical rollback decision'],
      outcomes: ['Rollback outcome preserved'],
      general,
    }, 150);

    expect(weighted).toContain('Critical rollback decision');
    expect(weighted).toContain('Rollback outcome preserved');
    expect(weighted.length).toBeLessThanOrEqual(150);
    expect(weighted).not.toContain('generalcontext generalcontext generalcontext generalcontext generalcontext generalcontext generalcontext');
    expect(weighted.endsWith('generalcon')).toBe(false);
  });

  it('ranks the decision-rich memory above a general memory for a decision-focused query with a deterministic provider', async () => {
    const provider = createDeterministicMockProvider([
      'rollback',
      'guardrail',
      'decision',
      'validated',
      'general',
      'implementation',
      'notes',
    ]);

    const decisionHeavy = buildWeightedDocumentText({
      title: 'Rollback plan',
      decisions: ['Rollback decision uses a guardrail'],
      outcomes: ['Rollback validated'],
      general: 'General implementation notes',
    });
    const generalHeavy = buildWeightedDocumentText({
      title: 'Rollback plan',
      decisions: [],
      outcomes: [],
      general: 'General implementation notes for the rollout and documentation',
    });
    const query = 'rollback guardrail decision';

    const [queryEmbedding, decisionEmbedding, generalEmbedding] = await Promise.all([
      provider.embedQuery(query),
      provider.embedDocument(decisionHeavy),
      provider.embedDocument(generalHeavy),
    ]);

    const decisionScore = cosineSimilarity(queryEmbedding, decisionEmbedding);
    const generalScore = cosineSimilarity(queryEmbedding, generalEmbedding);

    expect(decisionScore).toBeGreaterThan(generalScore);
  });
});
