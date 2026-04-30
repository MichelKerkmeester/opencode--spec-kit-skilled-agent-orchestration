// ───────────────────────────────────────────────────────────────
// MODULE: Query Surrogates Stress Test
// ───────────────────────────────────────────────────────────────
// Exercises query-intelligence surrogate generation and matching from feature
// catalog 12--query-intelligence/09-index-time-query-surrogates.

import { afterEach, describe, expect, it } from 'vitest';

import {
  generateSurrogates,
  matchSurrogates,
} from '../../lib/search/query-surrogates.js';

const FLAG_NAME = 'SPECKIT_QUERY_SURROGATES';
const ORIGINAL_FLAG_VALUE = process.env[FLAG_NAME];

describe('query surrogate stress behavior', () => {
  afterEach(() => {
    if (ORIGINAL_FLAG_VALUE === undefined) {
      delete process.env[FLAG_NAME];
    } else {
      process.env[FLAG_NAME] = ORIGINAL_FLAG_VALUE;
    }
  });

  it('generates aliases, headings, summary, and recall-oriented questions for rich content', () => {
    process.env[FLAG_NAME] = 'true';
    const surrogates = generateSurrogates([
      '# Retrieval Notes',
      '',
      'Reciprocal Rank Fusion (RRF) combines sparse and dense retrieval.',
      '',
      '## How to tune retrieval',
      '',
      'Use a query surrogate when the user asks an indirect question.',
    ].join('\n'), 'Retrieval Notes');

    expect(surrogates).not.toBeNull();
    expect(surrogates?.aliases).toContain('RRF');
    expect(surrogates?.headings).toContain('How to tune retrieval');
    expect(surrogates?.summary).toContain('Reciprocal Rank Fusion');
    expect(surrogates?.surrogateQuestions.length).toBeGreaterThanOrEqual(2);
  });

  it('matches indirect recall queries and returns null when the feature flag is disabled', () => {
    process.env[FLAG_NAME] = 'true';
    const surrogates = generateSurrogates(
      'RRF (Reciprocal Rank Fusion) improves rank stability for search results.',
      'Rank Fusion',
    );

    expect(surrogates).not.toBeNull();
    if (surrogates === null) {
      throw new Error('Expected query surrogates to be enabled');
    }

    const match = matchSurrogates('how does reciprocal rank fusion improve search', surrogates);
    expect(match.score).toBeGreaterThan(0.15);
    expect(match.matchedSurrogates.length).toBeGreaterThan(0);

    process.env[FLAG_NAME] = 'false';
    expect(generateSurrogates('RRF content', 'Rank Fusion')).toBeNull();
  });
});
