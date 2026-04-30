// ───────────────────────────────────────────────────────────────
// MODULE: Search Quality Baseline Stress Test
// ───────────────────────────────────────────────────────────────
// Exercises deterministic corpus quality dimensions through the harness.

import { describe, expect, it } from 'vitest';

import {
  SEARCH_QUALITY_CORPUS,
  type SearchQualityCase,
  type SearchQualityChannel,
} from './corpus.js';
import {
  runSearchQualityHarness,
  type SearchQualityCandidate,
  type SearchQualityChannelOutput,
  type SearchQualityRunners,
} from './harness.js';
import {
  citationQuality,
  refusalSurvival,
  summarizeSearchQualityRun,
} from './metrics.js';

const STATIC_CANDIDATES: Record<string, Partial<Record<SearchQualityChannel, SearchQualityCandidate[]>>> = {
  'v101-weak-retrieval-refusal': {
    memory_search: [
      candidate('weak-refusal-policy', 'Weak retrieval refusal policy', 'memory_search', 1),
      candidate('unsupported-path-risk', 'Unsupported path risk', 'memory_search', 2),
    ],
  },
  'v102-code-graph-fallback': {
    code_graph_query: [
      candidate('code-graph-full-scan-fallback', 'Code graph full scan fallback', 'code_graph_query', 1),
    ],
  },
  'ambiguous-advisor-routing': {
    skill_graph_query: [
      candidate('advisor-ambiguity-lane-breakdown', 'Advisor ambiguity lane breakdown', 'skill_graph_query', 1),
    ],
  },
  'paraphrase-query-plan': {
    memory_search: [
      candidate('query-plan-telemetry-contract', 'Query plan telemetry contract', 'memory_search', 1),
    ],
    skill_graph_query: [
      candidate('query-plan-telemetry-contract', 'Query plan skill surface', 'skill_graph_query', 1),
    ],
  },
};

describe('search-quality harness baseline', () => {
  it('runs deterministic corpus and captures required quality dimensions', async () => {
    const run = await runSearchQualityHarness(SEARCH_QUALITY_CORPUS, createStaticRunners(), {
      runId: 'baseline-test',
    });

    expect(run.runId).toBe('baseline-test');
    expect(run.corpusVersion).toBe(SEARCH_QUALITY_CORPUS.version);
    expect(run.cases).toHaveLength(SEARCH_QUALITY_CORPUS.cases.length);

    for (const result of run.cases) {
      expect(result.channelCaptures.length).toBeGreaterThan(0);
      expect(Object.keys(result.perChannelCandidates)).toEqual([
        'memory_search',
        'code_graph_query',
        'skill_graph_query',
      ]);
      expect(result.finalRelevance.recallAt3).toBeGreaterThan(0);
      expect(typeof result.citationPolicy.passed).toBe('boolean');
      expect(typeof result.refusalPolicy.passed).toBe('boolean');
      expect(result.latency.totalMs).toBeGreaterThanOrEqual(0);
    }

    const summary = summarizeSearchQualityRun(run);
    expect(summary.precisionAt3).toBeGreaterThanOrEqual(0.75);
    expect(summary.recallAt3).toBe(1);
    expect(summary.latency.p50).toBeGreaterThanOrEqual(0);
    expect(summary.latency.p95).toBeGreaterThanOrEqual(summary.latency.p50);
    expect(summary.latency.p99).toBeGreaterThanOrEqual(summary.latency.p95);
    expect(refusalSurvival(run)).toBe(1);
    expect(citationQuality(run)).toBe(1);
  });
});

function createStaticRunners(): SearchQualityRunners {
  return {
    memory_search: (testCase) => staticOutput(testCase, 'memory_search'),
    code_graph_query: (testCase) => staticOutput(testCase, 'code_graph_query'),
    skill_graph_query: (testCase) => staticOutput(testCase, 'skill_graph_query'),
  };
}

function staticOutput(
  testCase: SearchQualityCase,
  channel: SearchQualityChannel,
): SearchQualityChannelOutput {
  const candidates = STATIC_CANDIDATES[testCase.id]?.[channel] ?? [];
  return {
    candidates,
    refused: testCase.refusalExpected === true && channel === 'memory_search',
    citationIds: candidates.flatMap((item) => item.citationIds ?? []),
    latencyMs: 1,
  };
}

function candidate(
  id: string,
  title: string,
  channel: SearchQualityChannel,
  rank: number,
): SearchQualityCandidate {
  return {
    id,
    title,
    channel,
    rank,
    score: 1 / rank,
    citationIds: [id],
  };
}
