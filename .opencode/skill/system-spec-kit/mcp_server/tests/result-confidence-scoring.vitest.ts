import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  formatSearchResults,
  type RawSearchResult,
} from '../formatters/search-results';

const CONFIDENCE_FLAG = 'SPECKIT_RESULT_CONFIDENCE_V1';
const DRIVER_NAMES = [
  'large_margin',
  'multi_channel_agreement',
  'reranker_boost',
  'anchor_density',
] as const;

interface ConfidencePayload {
  label: 'high' | 'medium' | 'low';
  value: number;
  drivers: string[];
}

interface RequestQualityPayload {
  label: 'good' | 'weak' | 'gap';
}

interface ConfidenceResultEnvelope {
  id: number;
  confidence?: ConfidencePayload;
}

interface SearchEnvelope {
  data: {
    results: ConfidenceResultEnvelope[];
    requestQuality?: RequestQualityPayload;
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
    file_path: `/tmp/confidence-${id}.md`,
    title: `Confidence Result ${id}`,
    similarity: 70,
    averageSimilarity: 70,
    triggerPhrases: ['retrieval', 'confidence'],
    created_at: '2026-03-21T18:01:48.473Z',
    scoringMethod: 'cross-encoder',
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

function getResultConfidence(envelope: SearchEnvelope, resultId: number): ConfidencePayload {
  const result = envelope.data.results.find((candidate) => candidate.id === resultId);
  if (!result?.confidence) {
    throw new Error(`Expected confidence payload for result ${resultId}`);
  }

  return result.confidence;
}

describe('D5 Phase A: result confidence scoring', () => {
  let originalFlag: string | undefined;

  beforeEach(() => {
    originalFlag = process.env[CONFIDENCE_FLAG];
    process.env[CONFIDENCE_FLAG] = 'true';
  });

  afterEach(() => {
    if (originalFlag === undefined) {
      delete process.env[CONFIDENCE_FLAG];
    } else {
      process.env[CONFIDENCE_FLAG] = originalFlag;
    }
  });

  it('assigns high confidence to a result with a large score margin', async () => {
    const envelope = await formatEnvelope([
      makeResult(1, {
        similarity: 96,
        averageSimilarity: 96,
        intentAdjustedScore: 0.94,
        rrfScore: 0.92,
        fts_score: 0.89,
        rerankerScore: 0.91,
        anchorMetadata: [
          { id: 'decision-1', type: 'decision' },
          { id: 'state-1', type: 'state' },
        ],
        graphContribution: {
          sources: ['graph'],
          totalDelta: 0.19,
          injected: true,
        },
        traceMetadata: {
          attribution: {
            vector: [1],
            fts: [1],
            graph: [1],
          },
        },
      }),
      makeResult(2, {
        similarity: 48,
        averageSimilarity: 48,
        intentAdjustedScore: 0.42,
        rrfScore: 0.4,
        fts_score: 0.35,
        rerankerScore: 0.34,
        anchorMetadata: [{ id: 'note-1', type: 'note' }],
      }),
    ]);

    const confidence = getResultConfidence(envelope, 1);
    expect(confidence.label).toBe('high');
    expect(confidence.value).toBeGreaterThan(0.7);
    expect(confidence.drivers).toContain('large_margin');
  });

  it('boosts confidence when multiple channels agree on the top result', async () => {
    const agreementEnvelope = await formatEnvelope([
      makeResult(1, {
        similarity: 88,
        averageSimilarity: 88,
        intentAdjustedScore: 0.82,
        rrfScore: 0.8,
        fts_score: 0.79,
        rerankerScore: 0.78,
        anchorMetadata: [
          { id: 'decision-1', type: 'decision' },
          { id: 'rationale-1', type: 'rationale' },
        ],
        graphContribution: {
          sources: ['graph'],
          totalDelta: 0.14,
          injected: true,
        },
        traceMetadata: {
          attribution: {
            vector: [1],
            fts: [1],
            graph: [1],
          },
        },
      }),
      makeResult(2, {
        similarity: 72,
        averageSimilarity: 72,
        intentAdjustedScore: 0.63,
        rrfScore: 0.61,
        fts_score: 0.58,
        rerankerScore: 0.55,
      }),
    ]);
    const disagreementEnvelope = await formatEnvelope([
      makeResult(1, {
        similarity: 88,
        averageSimilarity: 88,
        intentAdjustedScore: 0.68,
        rrfScore: 0.67,
        fts_score: 0.21,
        rerankerScore: 0.44,
        anchorMetadata: [],
        traceMetadata: {
          attribution: {
            vector: [1],
            fts: [2],
          },
        },
      }),
      makeResult(2, {
        similarity: 83,
        averageSimilarity: 83,
        intentAdjustedScore: 0.64,
        rrfScore: 0.63,
        fts_score: 0.72,
        rerankerScore: 0.42,
      }),
    ]);

    const agreementConfidence = getResultConfidence(agreementEnvelope, 1);
    const disagreementConfidence = getResultConfidence(disagreementEnvelope, 1);

    expect(agreementConfidence.value).toBeGreaterThan(disagreementConfidence.value);
    expect(agreementConfidence.drivers).toContain('multi_channel_agreement');
  });

  it('assigns low confidence when the top result barely beats the runner-up', async () => {
    const envelope = await formatEnvelope([
      makeResult(1, {
        similarity: 53,
        averageSimilarity: 53,
        intentAdjustedScore: 0.36,
        rrfScore: 0.35,
        fts_score: 0.31,
        rerankerScore: 0.18,
        anchorMetadata: [],
      }),
      makeResult(2, {
        similarity: 52,
        averageSimilarity: 52,
        intentAdjustedScore: 0.35,
        rrfScore: 0.34,
        fts_score: 0.3,
        rerankerScore: 0.17,
        anchorMetadata: [],
      }),
    ]);

    const confidence = getResultConfidence(envelope, 1);
    expect(confidence.label).toBe('low');
    expect(confidence.value).toBeLessThan(0.4);
  });

  it('keeps label thresholds aligned with the numeric confidence value', async () => {
    const highEnvelope = await formatEnvelope([
      makeResult(1, {
        similarity: 95,
        averageSimilarity: 95,
        intentAdjustedScore: 0.93,
        rrfScore: 0.92,
        fts_score: 0.88,
        rerankerScore: 0.9,
        anchorMetadata: [{ id: 'decision-1', type: 'decision' }],
      }),
      makeResult(2, {
        similarity: 50,
        averageSimilarity: 50,
        intentAdjustedScore: 0.4,
        rrfScore: 0.39,
      }),
    ]);
    const mediumEnvelope = await formatEnvelope([
      makeResult(1, {
        similarity: 74,
        averageSimilarity: 74,
        intentAdjustedScore: 0.62,
        rrfScore: 0.6,
        fts_score: 0.49,
        rerankerScore: 0.45,
        anchorMetadata: [{ id: 'state-1', type: 'state' }],
      }),
      makeResult(2, {
        similarity: 65,
        averageSimilarity: 65,
        intentAdjustedScore: 0.48,
        rrfScore: 0.47,
      }),
    ]);
    const lowEnvelope = await formatEnvelope([
      makeResult(1, {
        similarity: 54,
        averageSimilarity: 54,
        intentAdjustedScore: 0.34,
        rrfScore: 0.33,
        fts_score: 0.28,
        rerankerScore: 0.18,
      }),
      makeResult(2, {
        similarity: 53,
        averageSimilarity: 53,
        intentAdjustedScore: 0.33,
        rrfScore: 0.32,
      }),
    ]);

    const high = getResultConfidence(highEnvelope, 1);
    const medium = getResultConfidence(mediumEnvelope, 1);
    const low = getResultConfidence(lowEnvelope, 1);

    expect(high.label).toBe('high');
    expect(high.value).toBeGreaterThan(0.7);

    expect(medium.label).toBe('medium');
    expect(medium.value).toBeGreaterThanOrEqual(0.4);
    expect(medium.value).toBeLessThanOrEqual(0.7);

    expect(low.label).toBe('low');
    expect(low.value).toBeLessThan(0.4);
  });

  it('populates confidence drivers with contributing factors', async () => {
    const envelope = await formatEnvelope([
      makeResult(1, {
        similarity: 97,
        averageSimilarity: 97,
        intentAdjustedScore: 0.95,
        rrfScore: 0.94,
        fts_score: 0.9,
        rerankerScore: 0.92,
        anchorMetadata: [
          { id: 'decision-1', type: 'decision' },
          { id: 'state-1', type: 'state' },
          { id: 'next-steps-1', type: 'next-steps' },
        ],
        graphContribution: {
          sources: ['graph'],
          totalDelta: 0.16,
          injected: true,
        },
        traceMetadata: {
          attribution: {
            vector: [1],
            fts: [1],
            graph: [1],
          },
        },
      }),
      makeResult(2, {
        similarity: 44,
        averageSimilarity: 44,
        intentAdjustedScore: 0.36,
        rrfScore: 0.35,
      }),
    ]);

    const confidence = getResultConfidence(envelope, 1);
    expect(confidence.drivers.length).toBeGreaterThan(0);
    expect(new Set(confidence.drivers).size).toBe(confidence.drivers.length);
    expect(confidence.drivers.every((driver) => DRIVER_NAMES.includes(driver as (typeof DRIVER_NAMES)[number]))).toBe(true);
  });

  it('assesses request quality as good, weak, or gap at the query level', async () => {
    const goodEnvelope = await formatEnvelope([
      makeResult(1, {
        similarity: 94,
        averageSimilarity: 94,
        intentAdjustedScore: 0.9,
        rrfScore: 0.89,
        fts_score: 0.84,
        rerankerScore: 0.88,
      }),
      makeResult(2, {
        similarity: 72,
        averageSimilarity: 72,
        intentAdjustedScore: 0.68,
        rrfScore: 0.66,
        fts_score: 0.63,
        rerankerScore: 0.61,
        traceMetadata: {
          attribution: {
            vector: [2],
            fts: [2],
          },
        },
      }),
    ]);
    const weakEnvelope = await formatEnvelope([
      makeResult(1, {
        similarity: 57,
        averageSimilarity: 57,
        intentAdjustedScore: 0.43,
        rrfScore: 0.41,
        fts_score: 0.25,
        rerankerScore: 0.22,
      }),
      makeResult(2, {
        similarity: 55,
        averageSimilarity: 55,
        intentAdjustedScore: 0.4,
        rrfScore: 0.39,
      }),
    ]);
    const gapEnvelope = await formatEnvelope([], {
      query: 'missing graph rationale',
      normalizedQuery: 'missing graph rationale',
      evidenceGap: true,
      evidenceGapWarning: 'No matching memories covered the requested rationale anchors.',
    });

    expect(goodEnvelope.data.requestQuality?.label).toBe('good');
    expect(weakEnvelope.data.requestQuality?.label).toBe('weak');
    expect(gapEnvelope.data.requestQuality?.label).toBe('gap');
  });

  it('omits confidence when SPECKIT_RESULT_CONFIDENCE_V1 is false', async () => {
    process.env[CONFIDENCE_FLAG] = 'false';

    const envelope = await formatEnvelope([
      makeResult(1, {
        similarity: 96,
        averageSimilarity: 96,
        intentAdjustedScore: 0.94,
        rrfScore: 0.92,
        fts_score: 0.89,
        rerankerScore: 0.91,
      }),
      makeResult(2, {
        similarity: 48,
        averageSimilarity: 48,
        intentAdjustedScore: 0.42,
        rrfScore: 0.4,
      }),
    ]);

    expect(envelope.data.results.every((result) => result.confidence === undefined)).toBe(true);
    expect(envelope.data.requestQuality).toBeUndefined();
  });
});
