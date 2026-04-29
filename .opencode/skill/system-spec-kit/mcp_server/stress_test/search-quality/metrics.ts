// ───────────────────────────────────────────────────────────────
// MODULE: Search Quality Metrics
// ───────────────────────────────────────────────────────────────

import type {
  SearchQualityCandidate,
  SearchQualityRun,
} from './harness.js';

interface SearchQualityMetricSummary {
  precisionAt3: number;
  recallAt3: number;
  latency: {
    p50: number;
    p95: number;
    p99: number;
  };
  refusalSurvival: number;
  citationQuality: number;
}

function precisionAtK(
  candidates: SearchQualityCandidate[],
  relevantIds: readonly string[],
  k: number,
): number {
  if (k <= 0) return 0;
  const top = candidates.slice(0, k);
  if (top.length === 0) return 0;
  const relevant = new Set(relevantIds);
  const hits = top.filter((candidate) => relevant.has(candidate.id)).length;
  return hits / top.length;
}

function recallAtK(
  candidates: SearchQualityCandidate[],
  relevantIds: readonly string[],
  k: number,
): number {
  if (relevantIds.length === 0 || k <= 0) return 0;
  const relevant = new Set(relevantIds);
  const hits = new Set(
    candidates.slice(0, k)
      .filter((candidate) => relevant.has(candidate.id))
      .map((candidate) => candidate.id),
  );
  return hits.size / relevant.size;
}

function latencyPercentiles(latencies: readonly number[]): { p50: number; p95: number; p99: number } {
  return {
    p50: percentile(latencies, 0.50),
    p95: percentile(latencies, 0.95),
    p99: percentile(latencies, 0.99),
  };
}

function refusalSurvival(run: SearchQualityRun): number {
  const expected = run.cases.filter((testCase) => testCase.refusalPolicy.expectedRefusal);
  if (expected.length === 0) return 1;
  return expected.filter((testCase) => testCase.refusalPolicy.passed).length / expected.length;
}

function citationQuality(run: SearchQualityRun): number {
  const expected = run.cases.filter((testCase) => testCase.citationPolicy.expectedIds.length > 0);
  if (expected.length === 0) return 1;
  return expected.filter((testCase) => testCase.citationPolicy.passed).length / expected.length;
}

function summarizeSearchQualityRun(run: SearchQualityRun): SearchQualityMetricSummary {
  const totalCases = run.cases.length || 1;
  return {
    precisionAt3: average(run.cases.map((testCase) => testCase.finalRelevance.precisionAt3), totalCases),
    recallAt3: average(run.cases.map((testCase) => testCase.finalRelevance.recallAt3), totalCases),
    latency: latencyPercentiles(run.cases.map((testCase) => testCase.latency.totalMs)),
    refusalSurvival: refusalSurvival(run),
    citationQuality: citationQuality(run),
  };
}

function percentile(values: readonly number[], quantile: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const clamped = Math.min(1, Math.max(0, quantile));
  const index = Math.ceil(clamped * sorted.length) - 1;
  return roundMetric(sorted[Math.max(0, index)] ?? 0);
}

function average(values: readonly number[], denominator: number): number {
  const sum = values.reduce((acc, value) => acc + value, 0);
  return roundMetric(sum / denominator);
}

function roundMetric(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export {
  type SearchQualityMetricSummary,
  citationQuality,
  latencyPercentiles,
  precisionAtK,
  recallAtK,
  refusalSurvival,
  summarizeSearchQualityRun,
};
