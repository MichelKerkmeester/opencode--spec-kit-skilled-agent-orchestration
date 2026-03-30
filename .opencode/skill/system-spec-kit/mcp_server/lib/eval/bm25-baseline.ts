// ───────────────────────────────────────────────────────────────
// MODULE: Bm25-Only Baseline Runner (T008)
// ───────────────────────────────────────────────────────────────
// Feature catalog: BM25-only baseline
//
// Runs the ground truth query set through the BM25/FTS5-only
// Search path (disabling vector, graph, and trigger channels)
// And computes baseline metrics. Records results in eval DB.
//
// The baseline measurement establishes the "floor" — what simple
// Keyword search achieves without any semantic, graph, or trigger
// Augmentation.
//
// Design notes:
//   - The search function is injected as a dependency so tests
// Can use mocks without a live DB.
//   - The contingency decision matrix turns the measured MRR@5
// Into an actionable gate: PAUSE / RATIONALIZE / PROCEED.
//   - recordBaselineMetrics() is a pure DB write — no network I/O.
import type Database from 'better-sqlite3';

import {
  computeMRR,
  computeNDCG,
  computeRecall,
  computeHitRate,
  type EvalResult,
  type GroundTruthEntry,
} from './eval-metrics.js';
import {
  GROUND_TRUTH_QUERIES,
  GROUND_TRUTH_RELEVANCES,
  type GroundTruthQuery,
} from './ground-truth-data.js';

/* ───────────────────────────────────────────────────────────────
   1. PUBLIC TYPES
──────────────────────────────────────────────────────────────── */

/** Configuration options for the BM25 baseline runner. */
export interface BM25BaselineConfig {
  /** Maximum number of queries to run. Defaults to all 110. */
  queryLimit?: number;
  /** Top-K cutoff for NDCG and Recall metrics. MRR always uses k=5 for contingency compatibility. */
  k?: number;
  /** Exclude hard-negative queries from the run. Default: false. */
  skipHardNegatives?: boolean;
}

/** Metrics produced by a single BM25 baseline run. */
export interface BM25BaselineMetrics {
  mrr5: number;
  /** NDCG at configured K (default 10). Named ndcg10 for backwards compatibility. */
  ndcg10: number;
  /** Recall at configured K (default 20). Named recall20 for backwards compatibility. */
  recall20: number;
  hitRate1: number;
}

/** Full result returned by runBM25Baseline(). */
export interface BM25BaselineResult {
  metrics: BM25BaselineMetrics;
  queryCount: number;
  timestamp: string;
  contingencyDecision: ContingencyDecision;
  /** Per-query MRR@5 values for bootstrap CI computation. */
  perQueryMRR?: number[];
  /** Bootstrap 95% CI for MRR@5 (computed if perQueryMRR available). */
  bootstrapCI?: BootstrapCIResult;
}

/** Decision produced by evaluateContingency() or evaluateContingencyRelative(). */
export interface ContingencyDecision {
  /** The MRR@5 value used to derive the decision. */
  bm25MRR: number;
  /** Human-readable threshold band: '>=0.8' | '0.5-0.8' | '<0.5'. */
  threshold: string;
  /** Gate action: 'PAUSE' | 'RATIONALIZE' | 'PROCEED'. */
  action: 'PAUSE' | 'RATIONALIZE' | 'PROCEED';
  /** Plain-language interpretation for humans reading the exit gate report. */
  interpretation: string;
  /** Comparison mode: 'absolute' (the rollout) or 'relative' (the original rollout+). */
  mode?: 'absolute' | 'relative';
  /** Hybrid MRR@5 used as reference (relative mode only). */
  hybridMRR?: number;
  /** BM25/hybrid ratio (relative mode only). */
  ratio?: number;
}

/**
 * A single search result as returned by the injected BM25 search function.
 * Mirrors the shape used in hybrid-search.ts so callers can reuse the same
 * function reference.
 */
export interface BM25SearchResult {
  /** Memory ID (numeric). */
  id: number;
  /** Retrieval score (raw BM25 / FTS5 rank). */
  score: number;
  /** Source channel identifier. Expected: 'bm25' or 'fts'. */
  source: string;
}

/**
 * A relevance judgment loaded from eval_ground_truth for a single query.
 * Used to evaluate results returned by the injected search function.
 */
export interface QueryGroundTruth {
  queryId: number;
  memoryId: number;
  relevance: number;
}

/**
 * Injected BM25-only search function signature.
 *
 * The function receives the query text and a limit and must return results
 * using ONLY the BM25/FTS5 channel (vector, graph, trigger disabled).
 * For production use, wire up the FTS5 path from hybrid-search with all
 * other channels explicitly disabled.
 */
export type BM25SearchFn = (
  query: string,
  limit: number,
) => BM25SearchResult[] | Promise<BM25SearchResult[]>;

/* ───────────────────────────────────────────────────────────────
   2. CONTINGENCY DECISION MATRIX
──────────────────────────────────────────────────────────────── */

/**
 * Evaluate the BM25 MRR@5 value against the contingency decision matrix.
 *
 * Matrix:
 *   MRR@5 >= 0.80 → PAUSE
 *     BM25 alone is very strong — semantic/graph additions may not
 *     justify the added complexity. Evaluate whether the multi-channel
 *     architecture is warranted before proceeding.
 *
 *   MRR@5 0.50–0.79 → RATIONALIZE
 *     BM25 is moderate — semantic/graph channels must demonstrably
 *     improve over this baseline. Each additional channel needs
 *     positive delta evidence.
 *
 *   MRR@5 < 0.50 → PROCEED
 *     BM25 alone is weak — strong justification for multi-channel
 *     retrieval. Proceed with hybrid search implementation.
 *
 * @param bm25MRR - The measured MRR@5 value (must be in [0, 1]).
 * @returns ContingencyDecision with threshold label, action, and interpretation.
 */
export function evaluateContingency(bm25MRR: number): ContingencyDecision {
  if (bm25MRR >= 0.80) {
    return {
      bm25MRR,
      mode: 'absolute',
      threshold: '>=0.8',
      action: 'PAUSE',
      interpretation:
        'BM25 alone is very strong — semantic/graph additions may not justify complexity. ' +
        'Re-evaluate whether a multi-channel architecture is warranted before proceeding with ' +
        'additional retrieval channels. Consider whether the marginal gain from vector/graph ' +
        'search is worth the operational overhead.',
    };
  }

  if (bm25MRR >= 0.50) {
    return {
      bm25MRR,
      mode: 'absolute',
      threshold: '0.5-0.8',
      action: 'RATIONALIZE',
      interpretation:
        'BM25 is moderate — semantic/graph channels should demonstrably improve over this baseline. ' +
        'Each additional channel (vector, graph, trigger) must show a statistically meaningful ' +
        'positive delta in MRR@5 before adoption. Track per-channel contribution carefully.',
    };
  }

  return {
    bm25MRR,
    mode: 'absolute',
    threshold: '<0.5',
    action: 'PROCEED',
    interpretation:
      'BM25 alone is weak — strong justification for multi-channel retrieval. ' +
      'The low keyword-only baseline confirms that semantic and graph augmentation ' +
      'adds meaningful value. Proceed with hybrid search implementation.',
  };
}

/* ───────────────────────────────────────────────────────────────
   2a. RELATIVE CONTINGENCY (Spec-Compliant)
   Compares BM25 MRR@5 as a percentage of hybrid MRR@5.
   Spec: "BM25 >= 80% of hybrid MRR@5" → PAUSE.
──────────────────────────────────────────────────────────────── */

/**
 * Evaluate BM25 performance relative to hybrid MRR@5 (spec-compliant).
 *
 * The spec defines contingency thresholds as ratios:
 *   ratio = bm25MRR / hybridMRR
 *
 *   ratio >= 0.80 → PAUSE
 *     BM25 achieves ≥80% of hybrid — multi-channel adds little value.
 *
 *   ratio 0.50–0.79 → RATIONALIZE
 *     BM25 achieves 50-79% of hybrid — channels need per-channel evidence.
 *
 *   ratio < 0.50 → PROCEED
 *     BM25 achieves <50% of hybrid — multi-channel clearly justified.
 *
 * @param bm25MRR   - BM25-only MRR@5 (must be in [0, 1]).
 * @param hybridMRR - Hybrid/multi-channel MRR@5 (must be in (0, 1]).
 * @returns ContingencyDecision with ratio, mode='relative', and interpretation.
 */
export function evaluateContingencyRelative(
  bm25MRR: number,
  hybridMRR: number,
): ContingencyDecision {
  if (!Number.isFinite(bm25MRR) || !Number.isFinite(hybridMRR) || hybridMRR <= 0) {
    return {
      bm25MRR,
      hybridMRR,
      ratio: 0,
      mode: 'relative',
      threshold: '<0.5',
      action: 'PROCEED',
      interpretation:
        'Hybrid/BM25 MRR@5 is non-finite, zero, or negative — cannot compute meaningful ratio. ' +
        'Defaulting to PROCEED until hybrid baseline is established.',
    };
  }

  const ratio = bm25MRR / hybridMRR;

  if (ratio >= 0.80) {
    return {
      bm25MRR,
      hybridMRR,
      ratio,
      mode: 'relative',
      threshold: '>=0.8',
      action: 'PAUSE',
      interpretation:
        `BM25 achieves ${(ratio * 100).toFixed(1)}% of hybrid MRR@5 ` +
        `(${bm25MRR.toFixed(4)} / ${hybridMRR.toFixed(4)}). ` +
        'The multi-channel architecture adds marginal value over keyword search alone. ' +
        'PAUSE Sprints 3-7 and evaluate whether the complexity is warranted.',
    };
  }

  if (ratio >= 0.50) {
    return {
      bm25MRR,
      hybridMRR,
      ratio,
      mode: 'relative',
      threshold: '0.5-0.8',
      action: 'RATIONALIZE',
      interpretation:
        `BM25 achieves ${(ratio * 100).toFixed(1)}% of hybrid MRR@5 ` +
        `(${bm25MRR.toFixed(4)} / ${hybridMRR.toFixed(4)}). ` +
        'Each additional channel must show a statistically meaningful positive delta ' +
        'in MRR@5. Track per-channel contribution and justify retained complexity.',
    };
  }

  return {
    bm25MRR,
    hybridMRR,
    ratio,
    mode: 'relative',
    threshold: '<0.5',
    action: 'PROCEED',
    interpretation:
      `BM25 achieves only ${(ratio * 100).toFixed(1)}% of hybrid MRR@5 ` +
      `(${bm25MRR.toFixed(4)} / ${hybridMRR.toFixed(4)}). ` +
      'Multi-channel retrieval provides substantial improvement over keyword search. ' +
      'Proceed with hybrid search optimization.',
  };
}

/* ───────────────────────────────────────────────────────────────
   2b. BOOTSTRAP CONFIDENCE INTERVAL (REQ-S0-004)
   Statistical significance testing for the contingency decision.
   Uses bootstrap resampling to compute 95% CI for MRR@5.
──────────────────────────────────────────────────────────────── */

/** Result of bootstrap confidence interval computation. */
export interface BootstrapCIResult {
  /** Point estimate (mean MRR@5 across all queries). */
  pointEstimate: number;
  /** Lower bound of 95% CI. */
  ciLower: number;
  /** Upper bound of 95% CI. */
  ciUpper: number;
  /** CI width (ciUpper - ciLower). Narrower is more confident. */
  ciWidth: number;
  /** Number of bootstrap iterations. */
  iterations: number;
  /** Number of queries in the sample. */
  sampleSize: number;
  /** Whether the CI excludes the contingency threshold boundaries.
   *  true = the decision is statistically significant at p<0.05. */
  isSignificant: boolean;
  /** Which threshold boundary was tested. */
  testedBoundary: number;
}

/**
 * Compute bootstrap 95% confidence interval for MRR@5.
 *
 * Uses percentile bootstrap with 10,000 iterations (default).
 * Statistical significance is determined by whether the CI
 * excludes the nearest contingency threshold boundary.
 *
 * @param perQueryMRR - Array of per-query MRR@5 values (one per query).
 * @param iterations - Number of bootstrap iterations (default: 10000).
 * @returns BootstrapCIResult with CI bounds and significance.
 */
export function computeBootstrapCI(
  perQueryMRR: number[],
  iterations: number = 10000,
): BootstrapCIResult {
  const safeIterations = Number.isFinite(iterations) ? Math.floor(iterations) : 0;
  const boundedIterations = Math.min(safeIterations, 100_000);
  // Filter out NaN/Infinity values to prevent poisoning bootstrap means
  const cleanMRR = perQueryMRR.filter(v => Number.isFinite(v));
  const n = cleanMRR.length;
  if (n === 0) {
    return {
      pointEstimate: 0,
      ciLower: 0,
      ciUpper: 0,
      ciWidth: 0,
      iterations: Math.max(0, boundedIterations),
      sampleSize: 0,
      isSignificant: false,
      testedBoundary: 0,
    };
  }

  // Point estimate
  const pointEstimate = cleanMRR.reduce((s, v) => s + v, 0) / n;

  if (boundedIterations <= 0) {
    return {
      pointEstimate,
      ciLower: pointEstimate,
      ciUpper: pointEstimate,
      ciWidth: 0,
      iterations: 0,
      sampleSize: n,
      isSignificant: false,
      testedBoundary: 0,
    };
  }

  // Bootstrap resampling
  const bootstrapMeans: number[] = [];
  for (let i = 0; i < boundedIterations; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += cleanMRR[Math.floor(Math.random() * n)];
    }
    bootstrapMeans.push(sum / n);
  }

  // Sort for percentile computation
  bootstrapMeans.sort((a, b) => a - b);

  // 95% CI = 2.5th and 97.5th percentiles
  const lowerIdx = Math.ceil(boundedIterations * 0.025) - 1;
  const upperIdx = Math.ceil(boundedIterations * 0.975) - 1;
  const ciLower = bootstrapMeans[lowerIdx];
  const ciUpper = bootstrapMeans[upperIdx];

  // Determine nearest threshold boundary and test significance
  let testedBoundary = 0;
  let isSignificant = false;

  if (pointEstimate >= 0.80) {
    // Testing whether we're significantly above 0.80 (PAUSE)
    testedBoundary = 0.80;
    isSignificant = ciLower >= 0.80;
  } else if (pointEstimate >= 0.50) {
    // Testing RATIONALIZE band: CI should not cross either boundary
    testedBoundary = pointEstimate >= 0.65 ? 0.80 : 0.50;
    isSignificant = ciLower >= 0.50 && ciUpper < 0.80;
  } else {
    // Testing whether we're significantly below 0.50 (PROCEED)
    testedBoundary = 0.50;
    isSignificant = ciUpper < 0.50;
  }

  return {
    pointEstimate,
    ciLower,
    ciUpper,
    ciWidth: ciUpper - ciLower,
    iterations: boundedIterations,
    sampleSize: n,
    isSignificant,
    testedBoundary,
  };
}

/* ───────────────────────────────────────────────────────────────
   3. METRIC RECORDING
──────────────────────────────────────────────────────────────── */

/**
 * Record BM25 baseline metrics to the eval DB (eval_metric_snapshots table).
 *
 * Inserts one row per metric (mrr@5, ndcg@10, recall@20, hit_rate@1) plus
 * one metadata row containing the full contingency decision.
 *
 * Channel is recorded as 'bm25' to distinguish from multi-channel runs.
 *
 * @param evalDb - An initialized better-sqlite3 Database instance.
 * @param result - The BM25BaselineResult to persist.
 */
export function recordBaselineMetrics(
  evalDb: Database.Database,
  result: BM25BaselineResult,
): void {
  // Use a synthetic eval_run_id for baseline runs: negative integer based on
  // Timestamp to avoid collision with production run IDs (which start at 1).
  const evalRunId = -(Date.parse(result.timestamp));

  const insertSnapshot = evalDb.prepare(`
    INSERT INTO eval_metric_snapshots
      (eval_run_id, metric_name, metric_value, channel, query_count, metadata, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const channel = 'bm25';
  const createdAt = result.timestamp;
  const queryCount = result.queryCount;

  const writeAll = evalDb.transaction(() => {
    // Core metrics
    insertSnapshot.run(evalRunId, 'mrr@5',       result.metrics.mrr5,      channel, queryCount, null, createdAt);
    insertSnapshot.run(evalRunId, 'ndcg@10',      result.metrics.ndcg10,    channel, queryCount, null, createdAt);
    insertSnapshot.run(evalRunId, 'recall@20',    result.metrics.recall20,  channel, queryCount, null, createdAt);
    insertSnapshot.run(evalRunId, 'hit_rate@1',   result.metrics.hitRate1,  channel, queryCount, null, createdAt);

    // Contingency decision (stored as JSON metadata on a sentinel row)
    const contingencyMeta = JSON.stringify(result.contingencyDecision);
    insertSnapshot.run(
      evalRunId,
      'bm25_contingency_decision',
      result.contingencyDecision.bm25MRR,
      channel,
      queryCount,
      contingencyMeta,
      createdAt,
    );
  });

  writeAll();
}

/* ───────────────────────────────────────────────────────────────
   4. BM25 BASELINE RUNNER
──────────────────────────────────────────────────────────────── */

/**
 * Run the BM25-only baseline measurement over the ground truth query set.
 *
 * IMPORTANT: This function requires a live, populated database to produce
 * meaningful metrics. The injected `searchFn` must return results from
 * the BM25/FTS5 path ONLY — vector, graph, and trigger channels must be
 * explicitly disabled before calling.
 *
 * For testing without a live DB, inject a mock `searchFn` that returns
 * deterministic results (see tests/bm25-baseline.vitest.ts).
 *
 * The ground truth relevance judgments use the dataset from T007
 * (ground-truth-data.ts) with real production memory IDs mapped via
 * multi-strategy FTS5 matching (scripts/map-ground-truth-ids.ts).
 * Each non-hard-negative query has 1-3 graded relevance entries
 * (grades 3=highly relevant, 2=relevant, 1=partial).
 *
 * @param searchFn - Injected BM25-only search function (dependency injection).
 * @param config   - Optional configuration overrides.
 * @returns        - BM25BaselineResult with metrics, timestamp, and contingency.
 */
export async function runBM25Baseline(
  searchFn: BM25SearchFn,
  config: BM25BaselineConfig = {},
): Promise<BM25BaselineResult> {
  const {
    queryLimit,
    k,
    skipHardNegatives = false,
  } = config;

  // MRR always uses k=5 (contingency matrix is calibrated for MRR@5)
  const mrrK = 5;
  // Other metrics use k override if provided
  const ndcgK  = k ?? 10;
  const recallK = k ?? 20;
  // Retrieval limit: fetch enough results for all metric cutoffs
  const fetchLimit = Math.max(mrrK, ndcgK, recallK, 20);

  // Select query set
  let queries: GroundTruthQuery[] = GROUND_TRUTH_QUERIES;
  if (skipHardNegatives) {
    queries = queries.filter(q => q.category !== 'hard_negative');
  }
  if (queryLimit !== undefined && queryLimit > 0) {
    queries = queries.slice(0, queryLimit);
  }

  const queryCount = queries.length;

  // Accumulators for averaging across queries
  let totalMRR    = 0;
  let totalNDCG   = 0;
  let totalRecall = 0;
  let totalHitRate = 0;

  // Collect per-query MRR for bootstrap CI (REQ-S0-004)
  const perQueryMRR: number[] = [];

  for (const q of queries) {
    // Run BM25-only search (channels: bm25/fts only, no vector/graph/trigger)
    const rawResults = await Promise.resolve(searchFn(q.query, fetchLimit));

    // Convert to EvalResult[] (1-based ranks by insertion order)
    const evalResults: EvalResult[] = rawResults.map((r, idx) => ({
      memoryId: r.id,
      score: r.score,
      rank: idx + 1,
    }));

    // Build ground truth for this query (real production memory IDs).
    const groundTruth: GroundTruthEntry[] = buildQueryGroundTruth(q.id);

    // Compute per-query metrics (hard negatives contribute 0 to all metrics
    // Since their ground truth is empty — which is the correct behavior)
    const qMRR = computeMRR(evalResults, groundTruth, mrrK);
    perQueryMRR.push(qMRR);

    totalMRR     += qMRR;
    totalNDCG    += computeNDCG(evalResults, groundTruth, ndcgK);
    totalRecall  += computeRecall(evalResults, groundTruth, recallK);
    totalHitRate += computeHitRate(evalResults, groundTruth, 1);
  }

  // Average across all queries (safely handle 0 queries)
  const safeCount = queryCount > 0 ? queryCount : 1;

  const metrics: BM25BaselineMetrics = {
    mrr5:     totalMRR    / safeCount,
    ndcg10:   totalNDCG   / safeCount,
    recall20: totalRecall / safeCount,
    hitRate1: totalHitRate / safeCount,
  };

  const timestamp = new Date().toISOString();
  const contingencyDecision = evaluateContingency(metrics.mrr5);

  // Compute bootstrap 95% CI for statistical significance (REQ-S0-004: p<0.05)
  const bootstrapCI = computeBootstrapCI(perQueryMRR);

  return {
    metrics,
    queryCount,
    timestamp,
    contingencyDecision,
    perQueryMRR,
    bootstrapCI,
  };
}

/* ───────────────────────────────────────────────────────────────
   5. INTERNAL HELPERS
──────────────────────────────────────────────────────────────── */

/**
 * Build GroundTruthEntry[] for a single query from the relevance dataset.
 *
 * Hard-negative queries have no relevant results (empty array).
 * Non-hard-negative queries have 1-3 graded relevance entries mapped
 * to real production memory IDs via FTS5 matching.
 */
function buildQueryGroundTruth(queryId: number): GroundTruthEntry[] {
  const q = GROUND_TRUTH_QUERIES.find(g => g.id === queryId);
  if (!q || q.category === 'hard_negative') {
    return [];
  }

  // Return all relevance entries for this query (graded: 3=high, 2=relevant, 1=partial)
  return GROUND_TRUTH_RELEVANCES
    .filter(r => r.queryId === queryId)
    .map(r => ({
      queryId: r.queryId,
      memoryId: r.memoryId,
      relevance: r.relevance,
    }));
}
