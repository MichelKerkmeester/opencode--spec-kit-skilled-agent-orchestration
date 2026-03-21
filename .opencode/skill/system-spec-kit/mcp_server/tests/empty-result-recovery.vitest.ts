import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  formatSearchResults,
  type RawSearchResult,
} from '../formatters/search-results';

const RECOVERY_FLAG = 'SPECKIT_EMPTY_RESULT_RECOVERY_V1';
const VALID_RECOVERY_STATUSES = ['no_results', 'low_confidence', 'partial'] as const;
const VALID_RECOVERY_REASONS = [
  'spec_filter_too_narrow',
  'low_signal_query',
  'knowledge_gap',
] as const;
const VALID_RECOVERY_ACTIONS = [
  'retry_broader',
  'switch_mode',
  'save_memory',
  'ask_user',
] as const;

interface RecoveryPayload {
  status: (typeof VALID_RECOVERY_STATUSES)[number];
  reason: (typeof VALID_RECOVERY_REASONS)[number];
  suggestedQueries: string[];
  recommendedAction: (typeof VALID_RECOVERY_ACTIONS)[number];
}

interface SearchEnvelope {
  data: {
    count: number;
    results: Array<Record<string, unknown>>;
    recovery?: RecoveryPayload;
    [key: string]: unknown;
  };
}

function parseEnvelope(response: Awaited<ReturnType<typeof formatSearchResults>>): SearchEnvelope {
  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || typeof textBlock.text !== 'string') {
    throw new Error('Expected text response block');
  }

  return JSON.parse(textBlock.text) as SearchEnvelope;
}

function makeResult(id: number, overrides: Partial<RawSearchResult> = {}): RawSearchResult {
  return {
    id,
    spec_folder: 'specs/02--system-spec-kit/022-hybrid-rag-fusion',
    file_path: `/tmp/recovery-${id}.md`,
    title: `Recovery Result ${id}`,
    similarity: 72,
    averageSimilarity: 72,
    triggerPhrases: ['retrieval', 'recovery'],
    created_at: '2026-03-21T18:01:48.473Z',
    ...overrides,
  };
}

async function formatEnvelope(
  results: RawSearchResult[] | null,
  extraData: Record<string, unknown> = {},
): Promise<SearchEnvelope> {
  const response = await formatSearchResults(
    results,
    'hybrid',
    false,
    null,
    null,
    Date.now(),
    extraData,
    true,
  );

  return parseEnvelope(response);
}

function expectReasonableSuggestions(
  suggestions: string[],
  originalQuery: string,
  expectedTerms: string[],
): void {
  expect(suggestions.length).toBeGreaterThan(0);
  expect(new Set(suggestions).size).toBe(suggestions.length);
  expect(suggestions.every((suggestion) => suggestion.trim().length > 0)).toBe(true);
  expect(suggestions.some((suggestion) => suggestion !== originalQuery)).toBe(true);
  expect(
    suggestions.some((suggestion) =>
      expectedTerms.some((term) => suggestion.toLowerCase().includes(term.toLowerCase())),
    ),
  ).toBe(true);
}

describe('D5 Phase A: empty result recovery', () => {
  let originalFlag: string | undefined;

  beforeEach(() => {
    originalFlag = process.env[RECOVERY_FLAG];
    process.env[RECOVERY_FLAG] = 'true';
  });

  afterEach(() => {
    if (originalFlag === undefined) {
      delete process.env[RECOVERY_FLAG];
    } else {
      process.env[RECOVERY_FLAG] = originalFlag;
    }
  });

  it('returns a structured recovery payload for empty result sets', async () => {
    const envelope = await formatEnvelope([], {
      query: 'graph weighting decision records',
      normalizedQuery: 'graph weighting decision records',
      specFolder: 'specs/02--system-spec-kit/022-hybrid-rag-fusion/filters/fusion-only',
    });

    expect(envelope.data.count).toBe(0);
    expect(envelope.data.results).toEqual([]);
    expect(envelope.data.recovery).toEqual(
      expect.objectContaining({
        status: expect.any(String),
        reason: expect.any(String),
        suggestedQueries: expect.any(Array),
        recommendedAction: expect.any(String),
      }),
    );

    expect(VALID_RECOVERY_STATUSES).toContain(envelope.data.recovery?.status);
    expect(VALID_RECOVERY_REASONS).toContain(envelope.data.recovery?.reason);
    expect(VALID_RECOVERY_ACTIONS).toContain(envelope.data.recovery?.recommendedAction);
  });

  it('classifies weak result sets as low_confidence', async () => {
    const envelope = await formatEnvelope(
      [
        makeResult(1, {
          similarity: 19,
          averageSimilarity: 19,
          intentAdjustedScore: 0.18,
          rrfScore: 0.16,
          fts_score: 0.03,
          rerankerScore: 0.05,
          anchorMetadata: [],
        }),
        makeResult(2, {
          similarity: 17,
          averageSimilarity: 17,
          intentAdjustedScore: 0.17,
          rrfScore: 0.15,
          fts_score: 0.02,
          rerankerScore: 0.04,
          anchorMetadata: [],
        }),
      ],
      {
        query: 'unknown latent retrieval edge',
        normalizedQuery: 'unknown latent retrieval edge',
      },
    );

    expect(envelope.data.count).toBe(2);
    expect(envelope.data.recovery?.status).toBe('low_confidence');
  });

  it('classifies incomplete coverage as partial results', async () => {
    const envelope = await formatEnvelope(
      [
        makeResult(1, {
          similarity: 82,
          averageSimilarity: 82,
          intentAdjustedScore: 0.74,
          rrfScore: 0.71,
          fts_score: 0.64,
          rerankerScore: 0.69,
          anchorMetadata: [{ id: 'decision-1', type: 'decision' }],
        }),
      ],
      {
        query: 'graph signal rollout state',
        normalizedQuery: 'graph signal rollout state',
        evidenceGap: true,
        evidenceGapWarning: 'Coverage incomplete: graph rollout notes are missing from the candidate set.',
      },
    );

    expect(envelope.data.count).toBe(1);
    expect(envelope.data.recovery?.status).toBe('partial');
  });

  it('suggests reasonable reformulations for empty results', async () => {
    const originalQuery = 'graph weighting decision records';
    const envelope = await formatEnvelope([], {
      query: originalQuery,
      normalizedQuery: originalQuery,
      specFolder: 'specs/02--system-spec-kit/022-hybrid-rag-fusion/filters/fusion-only',
    });

    const suggestedQueries = envelope.data.recovery?.suggestedQueries ?? [];
    expectReasonableSuggestions(suggestedQueries, originalQuery, [
      'graph',
      'weight',
      'decision',
      'record',
      'fusion',
    ]);
  });

  it('omits the recovery payload when SPECKIT_EMPTY_RESULT_RECOVERY_V1 is false', async () => {
    process.env[RECOVERY_FLAG] = 'false';

    const envelope = await formatEnvelope([], {
      query: 'graph weighting decision records',
      normalizedQuery: 'graph weighting decision records',
      specFolder: 'specs/02--system-spec-kit/022-hybrid-rag-fusion/filters/fusion-only',
    });

    expect(envelope.data.count).toBe(0);
    expect(envelope.data.results).toEqual([]);
    expect(envelope.data.recovery).toBeUndefined();
  });
});
