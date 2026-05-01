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
  // F-011-C1-01: rank-sensitive metrics — NDCG@K and MRR distinguish a top-1
  // hit from a top-3 hit (precision@K cannot). Additive only; existing
  // precision/recall/latency/refusal/citation outputs are unchanged.
  ndcgAt3: number;
  ndcgAt10: number;
  mrr: number;
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

// F-011-C1-01: NDCG@K — rank-sensitive metric. Distinguishes a top-1 hit from
// a top-3 hit (precision@K cannot). Uses binary relevance (1 if id in
// relevantIds, else 0) and standard log2 rank discount. Returns 0 when no
// relevant ids exist (matches precisionAtK / recallAtK convention).
function ndcgAtK(
  candidates: SearchQualityCandidate[],
  relevantIds: readonly string[],
  k: number,
): number {
  if (relevantIds.length === 0 || k <= 0) return 0;
  const top = candidates.slice(0, k);
  if (top.length === 0) return 0;
  const relevant = new Set(relevantIds);

  let dcg = 0;
  for (let index = 0; index < top.length; index++) {
    const candidate = top[index];
    if (relevant.has(candidate.id)) {
      // Standard NDCG formula: gain / log2(rank + 1) with rank starting at 1.
      dcg += 1 / Math.log2(index + 2);
    }
  }

  // Ideal DCG: relevant results packed at the top, capped at k or |relevant|.
  const idealHits = Math.min(relevant.size, k);
  let idcg = 0;
  for (let index = 0; index < idealHits; index++) {
    idcg += 1 / Math.log2(index + 2);
  }

  if (idcg === 0) return 0;
  return roundMetric(dcg / idcg);
}

// F-011-C1-01: MRR — mean reciprocal rank of the FIRST relevant hit.
// Returns 1 if the top result is relevant, 0.5 if rank 2, 0.333 if rank 3,
// etc. Returns 0 when no relevant hit appears in the candidate list at all
// or when relevantIds is empty.
function mrr(
  candidates: SearchQualityCandidate[],
  relevantIds: readonly string[],
): number {
  if (relevantIds.length === 0) return 0;
  const relevant = new Set(relevantIds);
  for (let index = 0; index < candidates.length; index++) {
    if (relevant.has(candidates[index].id)) {
      return roundMetric(1 / (index + 1));
    }
  }
  return 0;
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
    // F-011-C1-01: surface rank-sensitive metrics. NDCG@3 / NDCG@10 / MRR
    // averages mirror the precisionAt3 / recallAt3 averaging convention.
    ndcgAt3: average(run.cases.map((testCase) => testCase.finalRelevance.ndcgAt3), totalCases),
    ndcgAt10: average(run.cases.map((testCase) => testCase.finalRelevance.ndcgAt10), totalCases),
    mrr: average(run.cases.map((testCase) => testCase.finalRelevance.mrr), totalCases),
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
  // F-011-C1-01: rank-sensitive metric exports
  ndcgAtK,
  mrr,
};
