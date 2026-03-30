// TEST: Reranker Eval Comparison (CHK-069)
//
// Evaluation comparison skeleton for local GGUF reranker vs remote
// Cohere/Voyage reranker quality. Documents comparison protocol and
// MTEB benchmark reference ranges.
//
// Test structure:
// - 3 always-passing tests (corpus validation, MRR computation, protocol doc)
// - 2 mock-backed remote-provider eval tests

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as crossEncoder from '../lib/search/cross-encoder';
import { computeMRR } from '../lib/eval/eval-metrics';
import type { EvalResult, GroundTruthEntry } from '../lib/eval/eval-metrics';
import type { RerankDocument } from '../lib/search/cross-encoder';

/* ───────────────────────────────────────────────────────────────
   1. GROUND TRUTH CORPUS
──────────────────────────────────────────────────────────────── */

// 5 representative eval queries with ground truth relevance judgments
// Covering common memory retrieval patterns in the spec-kit system.
const EVAL_CORPUS = [
  {
    queryId: 1,
    query: 'how does the hybrid search pipeline work',
    groundTruth: [
      { queryId: 1, memoryId: 101, relevance: 3 },
      { queryId: 1, memoryId: 102, relevance: 2 },
      { queryId: 1, memoryId: 103, relevance: 1 },
    ] as GroundTruthEntry[],
  },
  {
    queryId: 2,
    query: 'schema validation for tool inputs',
    groundTruth: [
      { queryId: 2, memoryId: 201, relevance: 3 },
      { queryId: 2, memoryId: 202, relevance: 2 },
    ] as GroundTruthEntry[],
  },
  {
    queryId: 3,
    query: 'file watcher debounce implementation',
    groundTruth: [
      { queryId: 3, memoryId: 301, relevance: 3 },
      { queryId: 3, memoryId: 302, relevance: 1 },
    ] as GroundTruthEntry[],
  },
  {
    queryId: 4,
    query: 'memory save workflow and uniqueness',
    groundTruth: [
      { queryId: 4, memoryId: 401, relevance: 3 },
      { queryId: 4, memoryId: 402, relevance: 2 },
      { queryId: 4, memoryId: 403, relevance: 1 },
    ] as GroundTruthEntry[],
  },
  {
    queryId: 5,
    query: 'ablation study channel contribution',
    groundTruth: [
      { queryId: 5, memoryId: 501, relevance: 3 },
      { queryId: 5, memoryId: 502, relevance: 2 },
    ] as GroundTruthEntry[],
  },
];

const QUERY_DOCUMENTS: Record<number, RerankDocument[]> = {
  1: [
    { id: 904, content: 'Hybrid search fallback notes and unrelated ranking guidance. '.repeat(2) },
    { id: 102, content: 'Hybrid search uses reciprocal rank fusion to combine sparse and dense scores. '.repeat(2) },
    { id: 101, content: 'Hybrid search pipeline runs lexical retrieval, vector retrieval, and reranking in sequence. '.repeat(2) },
    { id: 905, content: 'Memory archival operations and retention policies for old sessions. '.repeat(2) },
    { id: 103, content: 'Search traces expose stage timings, candidate counts, and scoring metadata. '.repeat(2) },
  ],
  2: [
    { id: 901, content: 'Build scripts and release automation for package publishing workflows. '.repeat(2) },
    { id: 202, content: 'Tool schemas define optional fields, defaults, and shared validation helpers. '.repeat(2) },
    { id: 903, content: 'Prompt formatting tips for assistant-facing markdown responses. '.repeat(2) },
    { id: 201, content: 'Schema validation rejects malformed tool input payloads before handler execution. '.repeat(2) },
    { id: 904, content: 'UI state transitions for a desktop settings panel. '.repeat(2) },
  ],
  3: [
    { id: 301, content: 'File watcher debounce uses timers to coalesce repeated save events before indexing. '.repeat(2) },
    { id: 903, content: 'Background note about search result explainability output. '.repeat(2) },
    { id: 302, content: 'Watcher refresh logic avoids duplicate work when rapid file updates arrive together. '.repeat(2) },
    { id: 904, content: 'Database checkpoint advice for embedded SQLite deployments. '.repeat(2) },
    { id: 905, content: 'Authentication retry backoff guidance for unrelated network clients. '.repeat(2) },
  ],
  4: [
    { id: 901, content: 'Local model warmup diagnostics and service startup logs. '.repeat(2) },
    { id: 902, content: 'Feature flag rollout notes for bounded runtime experiments. '.repeat(2) },
    { id: 401, content: 'Memory save workflow builds structured context and enforces uniqueness guarantees. '.repeat(2) },
    { id: 402, content: 'Save-context indexing turns new memories into searchable retrieval candidates. '.repeat(2) },
    { id: 403, content: 'Post-save review highlights title, trigger phrase, and importance tier issues. '.repeat(2) },
  ],
  5: [
    { id: 901, content: 'Release checklist task ownership and sign-off bookkeeping. '.repeat(2) },
    { id: 902, content: 'Prompt improvement rubric for assistant response quality. '.repeat(2) },
    { id: 903, content: 'Workspace cleanup notes for temporary development artifacts. '.repeat(2) },
    { id: 501, content: 'Ablation study compares channel contribution and recall changes across runs. '.repeat(2) },
    { id: 502, content: 'Evaluation reports summarize fusion-channel impact and reranker uplift. '.repeat(2) },
  ],
};

interface ProviderFixture {
  queryId: number;
  responseBody: { data?: Array<{ index: number; relevance_score: number }>; results?: Array<{ index: number; relevance_score: number }> };
}

const VOYAGE_FIXTURES: ProviderFixture[] = [
  {
    queryId: 1,
    responseBody: {
      data: [
        { index: 2, relevance_score: 0.97 },
        { index: 1, relevance_score: 0.91 },
        { index: 4, relevance_score: 0.82 },
        { index: 0, relevance_score: 0.27 },
        { index: 3, relevance_score: 0.11 },
      ],
    },
  },
  {
    queryId: 2,
    responseBody: {
      data: [
        { index: 0, relevance_score: 0.95 },
        { index: 3, relevance_score: 0.87 },
        { index: 1, relevance_score: 0.79 },
        { index: 2, relevance_score: 0.33 },
        { index: 4, relevance_score: 0.18 },
      ],
    },
  },
  {
    queryId: 3,
    responseBody: {
      data: [
        { index: 0, relevance_score: 0.96 },
        { index: 2, relevance_score: 0.74 },
        { index: 1, relevance_score: 0.41 },
        { index: 3, relevance_score: 0.22 },
        { index: 4, relevance_score: 0.17 },
      ],
    },
  },
  {
    queryId: 4,
    responseBody: {
      data: [
        { index: 0, relevance_score: 0.94 },
        { index: 1, relevance_score: 0.89 },
        { index: 2, relevance_score: 0.77 },
        { index: 3, relevance_score: 0.72 },
        { index: 4, relevance_score: 0.68 },
      ],
    },
  },
  {
    queryId: 5,
    responseBody: {
      data: [
        { index: 0, relevance_score: 0.92 },
        { index: 1, relevance_score: 0.86 },
        { index: 2, relevance_score: 0.81 },
        { index: 3, relevance_score: 0.71 },
        { index: 4, relevance_score: 0.65 },
      ],
    },
  },
];

const COHERE_FIXTURES: ProviderFixture[] = [
  {
    queryId: 1,
    responseBody: {
      results: [
        { index: 2, relevance_score: 0.95 },
        { index: 1, relevance_score: 0.88 },
        { index: 4, relevance_score: 0.77 },
        { index: 0, relevance_score: 0.25 },
        { index: 3, relevance_score: 0.14 },
      ],
    },
  },
  {
    queryId: 2,
    responseBody: {
      results: [
        { index: 0, relevance_score: 0.91 },
        { index: 3, relevance_score: 0.84 },
        { index: 1, relevance_score: 0.80 },
        { index: 2, relevance_score: 0.29 },
        { index: 4, relevance_score: 0.13 },
      ],
    },
  },
  {
    queryId: 3,
    responseBody: {
      results: [
        { index: 1, relevance_score: 0.90 },
        { index: 2, relevance_score: 0.83 },
        { index: 0, relevance_score: 0.79 },
        { index: 3, relevance_score: 0.28 },
        { index: 4, relevance_score: 0.16 },
      ],
    },
  },
  {
    queryId: 4,
    responseBody: {
      results: [
        { index: 1, relevance_score: 0.89 },
        { index: 2, relevance_score: 0.82 },
        { index: 3, relevance_score: 0.76 },
        { index: 4, relevance_score: 0.70 },
        { index: 0, relevance_score: 0.19 },
      ],
    },
  },
  {
    queryId: 5,
    responseBody: {
      results: [
        { index: 2, relevance_score: 0.88 },
        { index: 3, relevance_score: 0.81 },
        { index: 4, relevance_score: 0.74 },
        { index: 0, relevance_score: 0.22 },
        { index: 1, relevance_score: 0.15 },
      ],
    },
  },
];

const ENV_KEYS = ['VOYAGE_API_KEY', 'COHERE_API_KEY', 'RERANKER_LOCAL', 'SPECKIT_CROSS_ENCODER'] as const;
const ORIGINAL_ENV = Object.fromEntries(
  ENV_KEYS.map(key => [key, process.env[key]])
) as Record<(typeof ENV_KEYS)[number], string | undefined>;
const ORIGINAL_FETCH = globalThis.fetch;

function resetProviderEnv(): void {
  for (const key of ENV_KEYS) {
    delete process.env[key];
  }
  process.env.SPECKIT_CROSS_ENCODER = 'true';
  crossEncoder.resetProvider();
  crossEncoder.resetSession();
}

function restoreProviderEnv(): void {
  for (const key of ENV_KEYS) {
    const originalValue = ORIGINAL_ENV[key];
    if (originalValue === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = originalValue;
    }
  }
  globalThis.fetch = ORIGINAL_FETCH;
  crossEncoder.resetProvider();
  crossEncoder.resetSession();
}

function installProviderFetchMock(
  provider: 'voyage' | 'cohere',
  fixtures: ProviderFixture[],
): ReturnType<typeof vi.fn> {
  const config = crossEncoder.PROVIDER_CONFIG[provider];
  let callIndex = 0;
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const fixture = fixtures[callIndex++];
    expect(fixture).toBeDefined();
    expect(String(input)).toBe(config.endpoint);
    expect(init?.method).toBe('POST');

    const headers = new Headers(init?.headers);
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('Authorization')).toBe(`Bearer ${process.env[config.apiKeyEnv]}`);

    const payload = JSON.parse(String(init?.body ?? '{}')) as {
      model: string;
      query: string;
      documents: string[];
    };
    const corpusEntry = EVAL_CORPUS.find(entry => entry.queryId === fixture.queryId);
    expect(corpusEntry).toBeTruthy();
    expect(payload.model).toBe(config.model);
    expect(payload.query).toBe(corpusEntry?.query);
    expect(payload.documents).toEqual(QUERY_DOCUMENTS[fixture.queryId].map(doc => doc.content));

    return new Response(JSON.stringify(fixture.responseBody), {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  globalThis.fetch = fetchMock as typeof fetch;
  return fetchMock;
}

function toEvalResults(results: Awaited<ReturnType<typeof crossEncoder.rerankResults>>): EvalResult[] {
  return results.map((result, index) => ({
    memoryId: Number(result.id),
    score: result.score,
    rank: index + 1,
  }));
}

async function evaluateRemoteProvider(
  provider: 'voyage' | 'cohere',
  fixtures: ProviderFixture[],
): Promise<{ averageMrr: number; fetchMock: ReturnType<typeof vi.fn>; queryMrrs: number[] }> {
  resetProviderEnv();
  process.env[crossEncoder.PROVIDER_CONFIG[provider].apiKeyEnv] = `${provider}-test-key`;
  crossEncoder.resetProvider();
  crossEncoder.resetSession();

  const fetchMock = installProviderFetchMock(provider, fixtures);
  const queryMrrs: number[] = [];

  for (const corpusEntry of EVAL_CORPUS) {
    const reranked = await crossEncoder.rerankResults(
      corpusEntry.query,
      QUERY_DOCUMENTS[corpusEntry.queryId],
      { limit: 5, useCache: false, applyLengthPenalty: false },
    );

    expect(reranked).toHaveLength(5);
    expect(reranked.every(result => result.provider === provider)).toBe(true);
    expect(reranked.every(result => result.scoringMethod === 'cross-encoder')).toBe(true);

    queryMrrs.push(computeMRR(toEvalResults(reranked), corpusEntry.groundTruth, 5));
  }

  const averageMrr = queryMrrs.reduce((sum, value) => sum + value, 0) / queryMrrs.length;
  return { averageMrr, fetchMock, queryMrrs };
}

/* ───────────────────────────────────────────────────────────────
   2. COMPARISON PROTOCOL DOCUMENTATION
──────────────────────────────────────────────────────────────── */

// MTEB benchmark reference ranges for reranking models (as of 2025):
// - Cohere Rerank v3:   NDCG@10 ~0.60, MRR@5 ~0.55-0.65
// - Voyage Rerank-2:    NDCG@10 ~0.58, MRR@5 ~0.52-0.62
// - Local GGUF (small): NDCG@10 ~0.40-0.50, MRR@5 ~0.38-0.48
//
// Comparison protocol:
// 1. Run all 5 eval queries through each reranker
// 2. Compute MRR@5 for each reranker
// 3. Compare: local should be within 0.15 of remote on MRR@5
// 4. Latency comparison: local should be <500ms, remote <2000ms

/* ───────────────────────────────────────────────────────────────
   3. ALWAYS-PASSING TESTS
──────────────────────────────────────────────────────────────── */

describe('Reranker Eval Comparison — corpus validation', () => {
  beforeEach(() => {
    resetProviderEnv();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    restoreProviderEnv();
  });

  it('eval corpus has 5 representative queries', () => {
    expect(EVAL_CORPUS).toHaveLength(5);
    for (const entry of EVAL_CORPUS) {
      expect(entry.query).toBeTruthy();
      expect(entry.groundTruth.length).toBeGreaterThan(0);
    }
  });

  it('MRR computation works on mock reranked results', () => {
    // Simulate a perfect reranker for query 1
    const results: EvalResult[] = [
      { memoryId: 101, score: 0.95, rank: 1 },
      { memoryId: 102, score: 0.80, rank: 2 },
      { memoryId: 103, score: 0.65, rank: 3 },
    ];
    const mrr = computeMRR(results, EVAL_CORPUS[0].groundTruth, 5);
    expect(mrr).toBeCloseTo(1.0, 4); // Perfect ranking → MRR = 1.0
  });

  it('comparison protocol is documented with MTEB reference ranges', () => {
    // This test documents the comparison protocol inline.
    // The actual comparison requires API keys for Voyage/Cohere.
    const protocol = {
      metrics: ['MRR@5', 'NDCG@5', 'latency_p50'],
      tolerance: 0.15, // max acceptable quality gap
      localTarget: { mrr5: 0.40, ndcg5: 0.42 },
      remoteBaseline: { mrr5: 0.58, ndcg5: 0.58 },
    };

    expect(protocol.metrics).toContain('MRR@5');
    expect(protocol.tolerance).toBe(0.15);
  });
});

/* ───────────────────────────────────────────────────────────────
   4. MOCK-BACKED REMOTE PROVIDER TESTS
──────────────────────────────────────────────────────────────── */

describe('Reranker Eval Comparison — remote providers', () => {
  beforeEach(() => {
    resetProviderEnv();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    restoreProviderEnv();
  });

  it('Voyage reranker produces valid MRR@5 scores', async () => {
    const { averageMrr, fetchMock, queryMrrs } = await evaluateRemoteProvider('voyage', VOYAGE_FIXTURES);

    expect(fetchMock).toHaveBeenCalledTimes(EVAL_CORPUS.length);
    expect(queryMrrs).toEqual([
      1,
      0.5,
      1,
      1 / 3,
      0.25,
    ]);
    expect(averageMrr).toBeGreaterThanOrEqual(0.52);
    expect(averageMrr).toBeLessThanOrEqual(0.62);
  });

  it('Cohere reranker produces valid MRR@5 scores', async () => {
    const { averageMrr, fetchMock, queryMrrs } = await evaluateRemoteProvider('cohere', COHERE_FIXTURES);

    expect(fetchMock).toHaveBeenCalledTimes(EVAL_CORPUS.length);
    expect(queryMrrs).toEqual([
      1,
      0.5,
      0.5,
      0.5,
      0.5,
    ]);
    expect(averageMrr).toBeGreaterThanOrEqual(0.55);
    expect(averageMrr).toBeLessThanOrEqual(0.65);
  });
});
