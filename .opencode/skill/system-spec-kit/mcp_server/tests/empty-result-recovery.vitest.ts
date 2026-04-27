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
  'ask_disambiguation',
  'refuse_without_evidence',
  'broaden_or_ask',
] as const;

const VALID_RESPONSE_POLICY_ACTIONS = [
  'ask_disambiguation',
  'broaden_or_ask',
  'refuse_without_evidence',
] as const;

interface RecoveryPayload {
  status: (typeof VALID_RECOVERY_STATUSES)[number];
  reason: (typeof VALID_RECOVERY_REASONS)[number];
  suggestedQueries: string[];
  recommendedAction: (typeof VALID_RECOVERY_ACTIONS)[number];
}

interface ResponsePolicy {
  requiredAction: (typeof VALID_RESPONSE_POLICY_ACTIONS)[number];
  noCanonicalPathClaims: boolean;
  citationRequiredForPaths: boolean;
  safeResponse: string;
}

interface SearchEnvelope {
  data: {
    count: number;
    results: Array<Record<string, unknown>>;
    recovery?: RecoveryPayload;
    citationPolicy?: 'cite_results' | 'do_not_cite_results';
    responsePolicy?: ResponsePolicy;
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
    spec_folder: 'specs/system-spec-kit/022-hybrid-rag-fusion',
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
      specFolder: 'specs/system-spec-kit/022-hybrid-rag-fusion/filters/fusion-only',
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
    expect(envelope.data.citationPolicy).toBe('do_not_cite_results');
    expect(envelope.data.responsePolicy).toEqual(
      expect.objectContaining({
        requiredAction: 'broaden_or_ask',
        noCanonicalPathClaims: true,
        citationRequiredForPaths: true,
        safeResponse: expect.any(String),
      }),
    );
  });

  it('emits citationPolicy without responsePolicy for good-quality results', async () => {
    const envelope = await formatEnvelope(
      [
        makeResult(1, {
          intentAdjustedScore: 0.95,
          rrfScore: 0.93,
          rerankerScore: 0.91,
          rerankerApplied: true,
          scoringMethod: 'reranker',
          sources: ['semantic', 'fts'],
          anchorMetadata: [
            { id: 'decision-1', type: 'decision' },
            { id: 'plan-1', type: 'plan' },
            { id: 'task-1', type: 'task' },
          ],
        }),
        makeResult(2, {
          intentAdjustedScore: 0.91,
          rrfScore: 0.89,
          rerankerScore: 0.87,
          rerankerApplied: true,
          scoringMethod: 'reranker',
          sources: ['semantic', 'fts'],
          anchorMetadata: [
            { id: 'decision-2', type: 'decision' },
            { id: 'plan-2', type: 'plan' },
            { id: 'task-2', type: 'task' },
          ],
        }),
        makeResult(3, {
          intentAdjustedScore: 0.88,
          rrfScore: 0.86,
          rerankerScore: 0.84,
          rerankerApplied: true,
          scoringMethod: 'reranker',
          sources: ['semantic', 'fts'],
          anchorMetadata: [
            { id: 'decision-3', type: 'decision' },
            { id: 'plan-3', type: 'plan' },
            { id: 'task-3', type: 'task' },
          ],
        }),
      ],
      {
        query: 'memory search response policy',
        normalizedQuery: 'memory search response policy',
      },
    );

    expect(envelope.data.requestQuality).toEqual({ label: 'good' });
    expect(envelope.data.citationPolicy).toBe('cite_results');
    expect(envelope.data.responsePolicy).toBeUndefined();
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
      specFolder: 'specs/system-spec-kit/022-hybrid-rag-fusion/filters/fusion-only',
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

  it('does not leave ask_user with empty suggestions and no disambiguation policy', async () => {
    const envelope = await formatEnvelope(
      [
        makeResult(1, {
          similarity: 18,
          averageSimilarity: 18,
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
        makeResult(3, {
          similarity: 16,
          averageSimilarity: 16,
          intentAdjustedScore: 0.16,
          rrfScore: 0.14,
          fts_score: 0.01,
          rerankerScore: 0.03,
          anchorMetadata: [],
        }),
        makeResult(4, {
          similarity: 15,
          averageSimilarity: 15,
          intentAdjustedScore: 0.15,
          rrfScore: 0.13,
          fts_score: 0.01,
          rerankerScore: 0.02,
          anchorMetadata: [],
        }),
        makeResult(5, {
          similarity: 14,
          averageSimilarity: 14,
          intentAdjustedScore: 0.14,
          rrfScore: 0.12,
          fts_score: 0.01,
          rerankerScore: 0.01,
          anchorMetadata: [],
        }),
      ],
      {
        query: 'advanced scoring module',
        normalizedQuery: 'advanced scoring module',
      },
    );

    expect(envelope.data.recovery?.recommendedAction).toBe('ask_user');

    const suggestions = envelope.data.recovery?.suggestedQueries ?? [];
    const hasDisambiguationPolicy =
      envelope.data.responsePolicy?.requiredAction === 'ask_disambiguation';

    expect(suggestions.length >= 2 || hasDisambiguationPolicy).toBe(true);
  });

  it('omits the recovery payload when SPECKIT_EMPTY_RESULT_RECOVERY_V1 is false', async () => {
    process.env[RECOVERY_FLAG] = 'false';

    const envelope = await formatEnvelope([], {
      query: 'graph weighting decision records',
      normalizedQuery: 'graph weighting decision records',
      specFolder: 'specs/system-spec-kit/022-hybrid-rag-fusion/filters/fusion-only',
    });

    expect(envelope.data.count).toBe(0);
    expect(envelope.data.results).toEqual([]);
    expect(envelope.data.recovery).toBeUndefined();
  });
});
