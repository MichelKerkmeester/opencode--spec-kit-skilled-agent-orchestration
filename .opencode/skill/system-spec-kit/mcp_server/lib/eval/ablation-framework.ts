// ───────────────────────────────────────────────────────────────
// MODULE: Ablation Framework (R13-S3)
// ───────────────────────────────────────────────────────────────
// Feature catalog: Ablation studies (eval_run_ablation)
//
// Controlled ablation studies for search channel contribution analysis.
// Selectively disables one search channel at a time, measures Recall@20
// Delta against a full-pipeline baseline, and attributes per-channel
// Contribution to retrieval quality.
//
// Features:
// - Channel toggle mechanism (vector, bm25, fts5, graph, trigger)
// - Ablation runner with ground truth evaluation
// - Delta calculation (baseline vs ablated Recall@20)
// - Paired sign-test for statistical significance
// - Results storage in eval_metric_snapshots table
// - Human-readable ablation report formatting
//
// CRITICAL: Ablation studies are experimental and gated behind
// SPECKIT_ABLATION=true. Every public function is wrapped in try-catch
// And is a no-op when the flag is not set.
import { initEvalDb, getEvalDb } from './eval-db.js';
import {
  computeRecall,
  computeMRR,
  computeNDCG,
  computePrecision,
  computeMAP,
  computeHitRate,
} from './eval-metrics.js';
import type { EvalResult, GroundTruthEntry } from './eval-metrics.js';
import {
  GROUND_TRUTH_QUERIES,
  GROUND_TRUTH_RELEVANCES,
} from './ground-truth-data.js';
import type { GroundTruthQuery } from './ground-truth-data.js';
import type Database from 'better-sqlite3';

/* --- 1. FEATURE FLAG --- */

/**
 * Returns true only when SPECKIT_ABLATION=true (case-insensitive).
 * Anything else (undefined, "false", "1", ...) disables ablation studies.
 */
export function isAblationEnabled(): boolean {
  return process.env.SPECKIT_ABLATION?.toLowerCase() === 'true';
}

/* --- 2. TYPES --- */

/** Known search channels that can be ablated. */
export type AblationChannel = 'vector' | 'bm25' | 'fts5' | 'graph' | 'trigger';

/** All channels available for ablation. */
export const ALL_CHANNELS: AblationChannel[] = [
  'vector',
  'bm25',
  'fts5',
  'graph',
  'trigger',
];

/** Configuration for an ablation study. */
export interface AblationConfig {
  /** Channels to ablate (one at a time). Defaults to ALL_CHANNELS. */
  channels: AblationChannel[];
  /** Subset of ground truth query IDs to use. Omit for all queries. */
  groundTruthQueryIds?: number[];
  /** Recall cutoff K. Defaults to 20. */
  recallK?: number;
  /** Optional active memory DB used to enforce ground-truth parent-memory alignment. */
  alignmentDb?: Database.Database;
  /** Optional DB path used in alignment error messaging. */
  alignmentDbPath?: string;
  /** Optional context label used in alignment error messaging. */
  alignmentContext?: string;
}

interface QuerySelection {
  queries: GroundTruthQuery[];
  requestedQueryIds?: number[];
  resolvedQueryIds?: number[];
  missingQueryIds?: number[];
}

/** Summary of whether the static ground truth matches the active DB universe. */
export interface GroundTruthAlignmentSummary {
  totalQueries: number;
  totalRelevances: number;
  uniqueMemoryIds: number;
  parentRelevanceCount: number;
  chunkRelevanceCount: number;
  missingRelevanceCount: number;
  parentMemoryCount: number;
  chunkMemoryCount: number;
  missingMemoryCount: number;
  chunkExamples: Array<{ memoryId: number; parentMemoryId: number }>;
  missingExamples: number[];
}

/**
 * A search function that the ablation runner calls for each query.
 * The runner passes channel disable flags; the function must respect them.
 *
 * @param query - The search query text.
 * @param disabledChannels - Set of channel names to disable for this run.
 * @returns Array of EvalResult (memoryId, score, rank).
 */
export type AblationSearchFn = (
  query: string,
  disabledChannels: Set<AblationChannel>,
) => EvalResult[] | Promise<EvalResult[]>;

/** Result of ablating a single channel. */
export interface AblationResult {
  /** The channel that was disabled. */
  channel: AblationChannel;
  /** Recall@K with all channels enabled. */
  baselineRecall20: number;
  /** Recall@K with this channel disabled. */
  ablatedRecall20: number;
  /** ablatedRecall20 - baselineRecall20. Negative means channel contributes positively. */
  delta: number;
  /** Two-sided sign-test p-value for statistical significance (null if insufficient data). */
  pValue: number | null;
  /** Number of queries where removing this channel decreased recall (channel was helpful). */
  queriesChannelHelped: number;
  /** Number of queries where removing this channel increased recall (channel was harmful). */
  queriesChannelHurt: number;
  /** Number of queries unaffected by removing this channel. */
  queriesUnchanged: number;
  /** Total queries evaluated. */
  queryCount: number;
  /** Full multi-metric breakdown (9 metrics). */
  metrics?: AblationMetrics;
}

/** A single metric entry comparing baseline vs ablated. */
export interface AblationMetricEntry {
  baseline: number;
  ablated: number;
  delta: number;
}

/** All 9 metrics tracked per ablation channel. */
export interface AblationMetrics {
  'MRR@5': AblationMetricEntry;
  'precision@5': AblationMetricEntry;
  'recall@5': AblationMetricEntry;
  'NDCG@5': AblationMetricEntry;
  'MAP': AblationMetricEntry;
  'hit_rate': AblationMetricEntry;
  'latency_p50': AblationMetricEntry;
  'latency_p95': AblationMetricEntry;
  'token_usage': AblationMetricEntry;
}

/** Failure captured for a single channel ablation run. */
export interface AblationChannelFailure {
  /** Channel that failed during ablation. */
  channel: AblationChannel;
  /** Error message returned by the failing search call. */
  error: string;
  /** Query ID being processed when failure occurred (if known). */
  queryId?: number;
  /** Query text being processed when failure occurred (if known). */
  query?: string;
}

/** Full ablation study report. */
export interface AblationReport {
  /** ISO timestamp of the study. */
  timestamp: string;
  /** Unique run identifier. */
  runId: string;
  /** Configuration used. */
  config: AblationConfig;
  /** Per-channel ablation results. */
  results: AblationResult[];
  /** Channel ablations that failed while the overall run continued. */
  channelFailures?: AblationChannelFailure[];
  /** Baseline Recall@K across all queries (all channels enabled). */
  overallBaselineRecall: number;
  /** Total queries selected for the baseline computation. */
  queryCount?: number;
  /** Total queries actually evaluated (queries with ground truth). */
  evaluatedQueryCount?: number;
  /** Query IDs explicitly requested for this run (if any). */
  requestedQueryIds?: number[];
  /** Query IDs resolved from the static dataset. */
  resolvedQueryIds?: number[];
  /** Requested query IDs that were missing from the static dataset. */
  missingQueryIds?: number[];
  /** Total wall-clock duration in milliseconds. */
  durationMs: number;
}

/* --- 3. INTERNAL HELPERS --- */

/**
 * Get the eval DB instance. Prefers the already-initialized singleton
 * (via getEvalDb) to avoid overwriting test DB paths. Falls back to
 * initEvalDb() if no singleton exists yet.
 */
function getDb() {
  try {
    return getEvalDb();
  } catch {
    return initEvalDb();
  }
}

interface MemoryIndexLookupRow {
  id: number;
  parent_id: number | null;
}

/**
 * Inspect whether every ground-truth relevance ID resolves to a parent memory
 * in the active DB. Chunk-backed or missing IDs make Recall@K comparisons
 * against parent-memory outputs untrustworthy.
 */
export function inspectGroundTruthAlignment(
  database: Database.Database,
): GroundTruthAlignmentSummary {
  const uniqueMemoryIds = Array.from(
    new Set(GROUND_TRUTH_RELEVANCES.map((row) => row.memoryId)),
  ).sort((left, right) => left - right);

  if (uniqueMemoryIds.length === 0) {
    return {
      totalQueries: GROUND_TRUTH_QUERIES.length,
      totalRelevances: 0,
      uniqueMemoryIds: 0,
      parentRelevanceCount: 0,
      chunkRelevanceCount: 0,
      missingRelevanceCount: 0,
      parentMemoryCount: 0,
      chunkMemoryCount: 0,
      missingMemoryCount: 0,
      chunkExamples: [],
      missingExamples: [],
    };
  }

  const placeholders = uniqueMemoryIds.map(() => '?').join(', ');
  const rows = database.prepare(
    `SELECT id, parent_id FROM memory_index WHERE id IN (${placeholders})`,
  ).all(...uniqueMemoryIds) as MemoryIndexLookupRow[];

  const rowById = new Map<number, MemoryIndexLookupRow>();
  for (const row of rows) {
    rowById.set(row.id, row);
  }

  let parentRelevanceCount = 0;
  let chunkRelevanceCount = 0;
  let missingRelevanceCount = 0;
  const parentMemoryIds = new Set<number>();
  const chunkMemoryIds = new Set<number>();
  const missingMemoryIds = new Set<number>();
  const chunkExamples: Array<{ memoryId: number; parentMemoryId: number }> = [];
  const missingExamples: number[] = [];

  for (const relevance of GROUND_TRUTH_RELEVANCES) {
    const row = rowById.get(relevance.memoryId);
    if (!row) {
      missingRelevanceCount++;
      if (!missingMemoryIds.has(relevance.memoryId) && missingExamples.length < 5) {
        missingExamples.push(relevance.memoryId);
      }
      missingMemoryIds.add(relevance.memoryId);
      continue;
    }

    if (row.parent_id == null) {
      parentRelevanceCount++;
      parentMemoryIds.add(relevance.memoryId);
      continue;
    }

    chunkRelevanceCount++;
    chunkMemoryIds.add(relevance.memoryId);
    if (
      chunkExamples.length < 5
      && !chunkExamples.some((example) => example.memoryId === relevance.memoryId)
    ) {
      chunkExamples.push({
        memoryId: relevance.memoryId,
        parentMemoryId: row.parent_id,
      });
    }
  }

  return {
    totalQueries: GROUND_TRUTH_QUERIES.length,
    totalRelevances: GROUND_TRUTH_RELEVANCES.length,
    uniqueMemoryIds: uniqueMemoryIds.length,
    parentRelevanceCount,
    chunkRelevanceCount,
    missingRelevanceCount,
    parentMemoryCount: parentMemoryIds.size,
    chunkMemoryCount: chunkMemoryIds.size,
    missingMemoryCount: missingMemoryIds.size,
    chunkExamples,
    missingExamples,
  };
}

/**
 * Reject the benchmark when the active DB and static ground truth do not share
 * the same parent-memory ID universe.
 */
export function assertGroundTruthAlignment(
  database: Database.Database,
  options: { dbPath?: string; context?: string } = {},
): GroundTruthAlignmentSummary {
  const summary = inspectGroundTruthAlignment(database);
  if (summary.chunkRelevanceCount === 0 && summary.missingRelevanceCount === 0) {
    return summary;
  }

  const contextParts = [
    options.context,
    options.dbPath,
  ].filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
  const contextSuffix = contextParts.length > 0 ? ` for ${contextParts.join(' @ ')}` : '';

  const details: string[] = [];
  if (summary.chunkRelevanceCount > 0) {
    const sampleText = summary.chunkExamples
      .map((example) => `${example.memoryId}->${example.parentMemoryId}`)
      .join(', ');
    details.push(
      `chunk-backed relevances=${summary.chunkRelevanceCount} across ${summary.chunkMemoryCount} IDs`
      + (sampleText ? ` (examples: ${sampleText})` : ''),
    );
  }
  if (summary.missingRelevanceCount > 0) {
    const sampleText = summary.missingExamples.join(', ');
    details.push(
      `missing relevances=${summary.missingRelevanceCount} across ${summary.missingMemoryCount} IDs`
      + (sampleText ? ` (examples: ${sampleText})` : ''),
    );
  }

  throw new Error(
    `Ground truth is not aligned to parent memories${contextSuffix}: ${details.join('; ')}. `
    + 'Refresh lib/eval/data/ground-truth.json with scripts/evals/map-ground-truth-ids.ts --write '
    + 'against the active DB before rerunning ablation.',
  );
}

/**
 * Generate a unique run ID for this ablation study.
 * Format: ablation-{timestamp}-{random4hex}
 */
function generateRunId(): string {
  const ts = Date.now();
  const rand = Math.random().toString(16).slice(2, 6);
  return `ablation-${ts}-${rand}`;
}

/**
 * Build ground truth entries for a specific query from the static dataset.
 * Converts GroundTruthRelevance to GroundTruthEntry format expected by computeRecall.
 */
function getGroundTruthForQuery(queryId: number): GroundTruthEntry[] {
  return GROUND_TRUTH_RELEVANCES
    .filter(r => r.queryId === queryId)
    .map(r => ({
      queryId: r.queryId,
      memoryId: r.memoryId,
      relevance: r.relevance,
    }));
}

/**
 * Get the set of queries to evaluate, filtered by config.
 */
function getQueriesToEvaluate(config: AblationConfig): QuerySelection {
  if (config.groundTruthQueryIds && config.groundTruthQueryIds.length > 0) {
    const requestedQueryIds = [...new Set(config.groundTruthQueryIds)];
    const idSet = new Set(requestedQueryIds);
    const queries = GROUND_TRUTH_QUERIES.filter(q => idSet.has(q.id));
    const resolvedQueryIds = queries.map((query) => query.id);
    const resolvedSet = new Set(resolvedQueryIds);
    const missingQueryIds = requestedQueryIds.filter((id) => !resolvedSet.has(id));

    return {
      queries,
      requestedQueryIds,
      resolvedQueryIds,
      missingQueryIds,
    };
  }
  return { queries: GROUND_TRUTH_QUERIES };
}

/**
 * Compute two-sided sign-test p-value for paired observations.
 *
 * Tests H0: P(ablated < baseline) = P(ablated > baseline) = 0.5
 * Uses the exact binomial distribution.
 *
 * @param nPositive - Number of queries where ablated < baseline (channel helped).
 * @param nNegative - Number of queries where ablated > baseline (channel hurt).
 * @returns p-value, or null if fewer than 5 non-tied observations.
 *
 * Precision note: Uses log-space computation to avoid integer overflow
 * for large n (the naive iterative binomial coefficient exceeds
 * Number.MAX_SAFE_INTEGER for n > ~50).
 */
function signTestPValue(nPositive: number, nNegative: number): number | null {
  const n = nPositive + nNegative;
  if (n < 5) return null; // Insufficient data for meaningful test

  // Two-sided sign test: P(X <= min(n+, n-)) under Binomial(n, 0.5)
  const k = Math.min(nPositive, nNegative);

  // Log-space binomial coefficient to avoid overflow for large n
  function logBinomial(nVal: number, kVal: number): number {
    if (kVal < 0 || kVal > nVal) return -Infinity;
    if (kVal === 0 || kVal === nVal) return 0;
    let result = 0;
    for (let i = 0; i < kVal; i++) {
      result += Math.log(nVal - i) - Math.log(i + 1);
    }
    return result;
  }

  // Compute cumulative binomial probability P(X <= k) for Binomial(n, 0.5)
  // Sum in log-space: each term is exp(logBinom(n, i) + n * log(0.5))
  const logP = n * Math.log(0.5);
  let cumProb = 0;
  for (let i = 0; i <= k; i++) {
    cumProb += Math.exp(logBinomial(n, i) + logP);
  }

  // Two-sided: multiply by 2, cap at 1
  return Math.min(1.0, 2 * cumProb);
}

/**
 * Compute mean Recall@K across a set of per-query recall values.
 */
function meanRecall(recalls: number[]): number {
  if (recalls.length === 0) return 0;
  const sum = recalls.reduce((a, b) => a + b, 0);
  return sum / recalls.length;
}

/**
 * Compute all 6 retrieval metrics for a single query at K=5.
 */
function computeQueryMetrics(
  results: EvalResult[],
  gt: GroundTruthEntry[],
): { mrr: number; precision: number; recall: number; ndcg: number; map: number; hitRate: number } {
  return {
    mrr: computeMRR(results, gt, 5),
    precision: computePrecision(results, gt, 5),
    recall: computeRecall(results, gt, 5),
    ndcg: computeNDCG(results, gt, 5),
    map: computeMAP(results, gt, 5),
    hitRate: computeHitRate(results, gt, 5),
  };
}

/**
 * Compute percentile from a sorted array using linear interpolation.
 */
function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

/**
 * Build aggregated AblationMetrics from per-query metric maps.
 */
function buildAggregatedMetrics(
  baselinePerQuery: Map<number, { metrics: ReturnType<typeof computeQueryMetrics>; latencyMs: number; tokenUsage?: number }>,
  ablatedPerQuery: Map<number, { metrics: ReturnType<typeof computeQueryMetrics>; latencyMs: number; tokenUsage?: number }>,
): AblationMetrics {
  const bMetrics = [...baselinePerQuery.values()];
  const aMetrics = [...ablatedPerQuery.values()];

  function avg(vals: number[]): number {
    return vals.length === 0 ? 0 : vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  function entry(bVals: number[], aVals: number[]): AblationMetricEntry {
    const b = avg(bVals);
    const a = avg(aVals);
    return { baseline: b, ablated: a, delta: a - b };
  }

  const bLatencies = bMetrics.map(m => m.latencyMs).sort((a, b) => a - b);
  const aLatencies = aMetrics.map(m => m.latencyMs).sort((a, b) => a - b);
  // L2 FIX: Filter out zero/undefined token usage since runAblation does not
  // currently populate tokenUsage — avoids reporting synthetic zeroes.
  const bTokenUsage = bMetrics
    .map(m => m.tokenUsage)
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0);
  const aTokenUsage = aMetrics
    .map(m => m.tokenUsage)
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0);

  return {
    'MRR@5': entry(bMetrics.map(m => m.metrics.mrr), aMetrics.map(m => m.metrics.mrr)),
    'precision@5': entry(bMetrics.map(m => m.metrics.precision), aMetrics.map(m => m.metrics.precision)),
    'recall@5': entry(bMetrics.map(m => m.metrics.recall), aMetrics.map(m => m.metrics.recall)),
    'NDCG@5': entry(bMetrics.map(m => m.metrics.ndcg), aMetrics.map(m => m.metrics.ndcg)),
    'MAP': entry(bMetrics.map(m => m.metrics.map), aMetrics.map(m => m.metrics.map)),
    'hit_rate': entry(bMetrics.map(m => m.metrics.hitRate), aMetrics.map(m => m.metrics.hitRate)),
    'latency_p50': {
      baseline: percentile(bLatencies, 50),
      ablated: percentile(aLatencies, 50),
      delta: percentile(aLatencies, 50) - percentile(bLatencies, 50),
    },
    'latency_p95': {
      baseline: percentile(bLatencies, 95),
      ablated: percentile(aLatencies, 95),
      delta: percentile(aLatencies, 95) - percentile(bLatencies, 95),
    },
    'token_usage': entry(bTokenUsage, aTokenUsage),
  };
}

/* --- 4. PUBLIC API --- */

/**
 * Run a controlled ablation study over the ground truth query set.
 *
 * For each channel in config.channels:
 * 1. Run all queries with all channels enabled (baseline) — cached across channels
 * 2. Run all queries with that one channel disabled (ablated)
 * 3. Compute per-query Recall@K delta
 * 4. Aggregate mean delta and sign-test p-value
 *
 * The searchFn is called once per query per condition. It receives
 * the query text and a set of disabled channel names. When the set
 * is empty, all channels should be active (baseline condition).
 *
 * @param searchFn - Search function that respects channel disable flags.
 * @param config - Ablation configuration.
 * @returns AblationReport with per-channel results, or null if ablation is disabled.
 */
export async function runAblation(
  searchFn: AblationSearchFn,
  config: AblationConfig = { channels: ALL_CHANNELS },
): Promise<AblationReport | null> {
  if (!isAblationEnabled()) return null;

  const startTime = Date.now();
  const runId = generateRunId();
  const recallK = config.recallK ?? 20;
  const querySelection = getQueriesToEvaluate(config);
  const queries = querySelection.queries;

  if (queries.length === 0) {
    const suffix = querySelection.missingQueryIds && querySelection.missingQueryIds.length > 0
      ? ` Requested IDs not found: ${querySelection.missingQueryIds.join(', ')}.`
      : '';
    console.warn(`[ablation] No queries to evaluate.${suffix}`);
    return null;
  }

  if (querySelection.missingQueryIds && querySelection.missingQueryIds.length > 0) {
    console.warn(
      `[ablation] Requested groundTruthQueryIds not found in the static dataset: ${querySelection.missingQueryIds.join(', ')}`,
    );
  }

  try {
    if (config.alignmentDb) {
      assertGroundTruthAlignment(config.alignmentDb, {
        dbPath: config.alignmentDbPath,
        context: config.alignmentContext ?? 'runAblation',
      });
    }

    // -- Step 1: Compute baseline (all channels enabled) --
    const baselineRecalls: Map<number, number> = new Map();
    const baselineMetricsPerQuery: Map<number, { metrics: ReturnType<typeof computeQueryMetrics>; latencyMs: number; tokenUsage?: number }> = new Map();
    let evaluatedCount = 0;
    const noDisabled = new Set<AblationChannel>();

    for (const q of queries) {
      const gt = getGroundTruthForQuery(q.id);
      if (gt.length === 0) continue; // Skip queries with no ground truth

      evaluatedCount++;
      const t0 = performance.now();
      const results = await Promise.resolve(searchFn(q.query, noDisabled));
      const latencyMs = performance.now() - t0;

      const recall = computeRecall(results, gt, recallK);
      baselineRecalls.set(q.id, recall);
      baselineMetricsPerQuery.set(q.id, { metrics: computeQueryMetrics(results, gt), latencyMs });
    }

    const overallBaselineRecall = meanRecall([...baselineRecalls.values()]);

    // -- Step 2: Ablate each channel --
    const ablationResults: AblationResult[] = [];
    const channelFailures: AblationChannelFailure[] = [];

    for (const channel of config.channels) {
      const disabledSet = new Set<AblationChannel>([channel]);
      const ablatedRecalls: Map<number, number> = new Map();
      const ablatedMetricsPerQuery: Map<number, { metrics: ReturnType<typeof computeQueryMetrics>; latencyMs: number; tokenUsage?: number }> = new Map();
      let failedQuery: GroundTruthQuery | null = null;

      try {
        for (const q of queries) {
          const gt = getGroundTruthForQuery(q.id);
          if (gt.length === 0) continue;

          failedQuery = q;
          const t0 = performance.now();
          const results = await Promise.resolve(searchFn(q.query, disabledSet));
          const latencyMs = performance.now() - t0;

          const recall = computeRecall(results, gt, recallK);
          ablatedRecalls.set(q.id, recall);
          ablatedMetricsPerQuery.set(q.id, { metrics: computeQueryMetrics(results, gt), latencyMs });
        }

        // -- Step 3: Compute deltas --
        let queriesChannelHelped = 0;   // ablated < baseline (removing channel decreased quality — channel was helpful)
        let queriesChannelHurt = 0;    // ablated > baseline (removing channel increased quality — channel was harmful)
        let queriesUnchanged = 0;
        const queryDeltas: number[] = [];

        for (const [queryId, baselineR] of baselineRecalls) {
          const ablatedR = ablatedRecalls.get(queryId);
          if (ablatedR === undefined) continue;

          const delta = ablatedR - baselineR;
          queryDeltas.push(delta);

          // Use small epsilon for floating-point comparison
          if (delta < -1e-9) queriesChannelHelped++;
          else if (delta > 1e-9) queriesChannelHurt++;
          else queriesUnchanged++;
        }

        const meanAblatedRecall = meanRecall([...ablatedRecalls.values()]);
        const meanDelta = meanAblatedRecall - overallBaselineRecall;

        // QueriesChannelHelped = channel was helping (removing it hurt quality)
        // QueriesChannelHurt = channel was harmful (removing it helped quality)
        const pValue = signTestPValue(queriesChannelHelped, queriesChannelHurt);

        // Build aggregated multi-metric breakdown
        const metrics = buildAggregatedMetrics(baselineMetricsPerQuery, ablatedMetricsPerQuery);

        ablationResults.push({
          channel,
          baselineRecall20: overallBaselineRecall,
          ablatedRecall20: meanAblatedRecall,
          delta: meanDelta,
          pValue,
          queriesChannelHelped,
          queriesChannelHurt,
          queriesUnchanged,
          queryCount: queryDeltas.length,
          metrics,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        const failure: AblationChannelFailure = {
          channel,
          error: msg,
          ...(failedQuery
            ? {
              queryId: failedQuery.id,
              query: failedQuery.query,
            }
            : {}),
        };
        channelFailures.push(failure);

        const querySuffix = failedQuery ? ` (queryId=${failedQuery.id})` : '';
        console.warn(
          `[ablation] Channel "${channel}" failed${querySuffix}; continuing with remaining channels:`,
          msg,
        );
      }
    }

    const report: AblationReport = {
      timestamp: new Date().toISOString(),
      runId,
      config,
      results: ablationResults,
      ...(channelFailures.length > 0 ? { channelFailures } : {}),
      overallBaselineRecall,
      queryCount: queries.length,
      evaluatedQueryCount: evaluatedCount,
      ...(querySelection.requestedQueryIds ? { requestedQueryIds: querySelection.requestedQueryIds } : {}),
      ...(querySelection.resolvedQueryIds ? { resolvedQueryIds: querySelection.resolvedQueryIds } : {}),
      ...(querySelection.missingQueryIds && querySelection.missingQueryIds.length > 0
        ? { missingQueryIds: querySelection.missingQueryIds }
        : {}),
      durationMs: Date.now() - startTime,
    };

    return report;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[ablation] runAblation failed (non-fatal):', msg);
    return null;
  }
}

/**
 * Store ablation results in the eval_metric_snapshots table.
 *
 * Inserts one row per channel with:
 * - metric_name: 'ablation_recall@20_delta'
 * - metric_value: the delta (negative = channel contributes positively)
 * - channel: the ablated channel name
 * - metadata: JSON with full AblationResult
 *
 * Also stores the baseline recall as a separate row.
 *
 * Fail-safe: never throws. Returns true if successfully stored.
 *
 * @param report - The AblationReport to persist.
 * @returns true if successfully stored.
 */
export function storeAblationResults(report: AblationReport): boolean {
  if (!isAblationEnabled()) return false;

  try {
    const db = getDb();

    // Use a synthetic eval_run_id: negative timestamp to avoid collision
    // With production run IDs (same pattern as bm25-baseline.ts).
    const evalRunId = -(Date.parse(report.timestamp));

    const insertSnapshot = db.prepare(`
      INSERT INTO eval_metric_snapshots
        (eval_run_id, metric_name, metric_value, channel, query_count, metadata, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const recallK = report.config.recallK ?? 20;
    const baselineQueryCount =
      report.evaluatedQueryCount
      ?? report.queryCount
      ?? report.results[0]?.queryCount
      ?? 0;

    const writeAll = db.transaction(() => {
      // Store baseline recall
      insertSnapshot.run(
        evalRunId,
        `ablation_baseline_recall@${recallK}`,
        report.overallBaselineRecall,
        'all',
        baselineQueryCount,
          JSON.stringify({
            runId: report.runId,
            config: report.config,
            durationMs: report.durationMs,
            queryCount: baselineQueryCount,
            requestedQueryIds: report.requestedQueryIds ?? [],
            resolvedQueryIds: report.resolvedQueryIds ?? [],
            missingQueryIds: report.missingQueryIds ?? [],
            channelFailures: report.channelFailures ?? [],
          }),
          report.timestamp,
      );

      // Store per-channel deltas
      for (const result of report.results) {
        insertSnapshot.run(
          evalRunId,
          `ablation_recall@${recallK}_delta`,
          result.delta,
          result.channel,
          result.queryCount,
          JSON.stringify({
            runId: report.runId,
            baselineRecall20: result.baselineRecall20,
            ablatedRecall20: result.ablatedRecall20,
            pValue: result.pValue,
            queriesChannelHelped: result.queriesChannelHelped,
            queriesChannelHurt: result.queriesChannelHurt,
            queriesUnchanged: result.queriesUnchanged,
          }),
          report.timestamp,
        );

        // Store all 9 multi-metric entries per channel
        if (result.metrics) {
          for (const [metricName, entry] of Object.entries(result.metrics)) {
            const typedEntry = entry as AblationMetricEntry;
            const isSyntheticTokenUsage =
              metricName === 'token_usage'
              && typedEntry.baseline === 0
              && typedEntry.ablated === 0
              && typedEntry.delta === 0;

            if (isSyntheticTokenUsage) {
              continue;
            }

            insertSnapshot.run(
              evalRunId,
              `ablation_${metricName}_delta`,
              typedEntry.delta,
              result.channel,
              result.queryCount,
              JSON.stringify({
                runId: report.runId,
                baseline: typedEntry.baseline,
                ablated: typedEntry.ablated,
                requestedQueryIds: report.requestedQueryIds ?? [],
                resolvedQueryIds: report.resolvedQueryIds ?? [],
                missingQueryIds: report.missingQueryIds ?? [],
              }),
              report.timestamp,
            );
          }
        }
      }
    });

    writeAll();
    return true;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[ablation] storeAblationResults failed (non-fatal):', msg);
    return false;
  }
}

/**
 * Format an ablation report as a human-readable markdown table.
 *
 * Sorts channels by absolute delta (largest contribution first).
 * Marks statistically significant results (p < 0.05) with an asterisk.
 *
 * @param report - The AblationReport to format.
 * @returns Formatted markdown string.
 */
export function formatAblationReport(report: AblationReport): string {
  const lines: string[] = [];

  lines.push(`## Ablation Study Report`);
  lines.push(``);
  lines.push(`- **Run ID:** ${report.runId}`);
  lines.push(`- **Timestamp:** ${report.timestamp}`);
  const recallK = report.config.recallK ?? 20;
  lines.push(`- **Baseline Recall@${recallK}:** ${report.overallBaselineRecall.toFixed(4)}`);
  lines.push(`- **Duration:** ${report.durationMs}ms`);
  const queriesEvaluated = report.evaluatedQueryCount
    ?? report.results[0]?.queryCount
    ?? report.queryCount
    ?? 0;
  lines.push(`- **Queries evaluated:** ${queriesEvaluated}`);
  if (report.requestedQueryIds && report.requestedQueryIds.length > 0) {
    lines.push(`- **Requested query IDs:** ${report.requestedQueryIds.join(', ')}`);
    lines.push(`- **Resolved query IDs:** ${(report.resolvedQueryIds ?? []).join(', ') || 'none'}`);
  }
  if (report.missingQueryIds && report.missingQueryIds.length > 0) {
    lines.push(`- **Missing query IDs:** ${report.missingQueryIds.join(', ')}`);
  }
  lines.push(``);

  // Sort by absolute delta descending (most impactful first)
  const sorted = [...report.results].sort(
    (a, b) => Math.abs(b.delta) - Math.abs(a.delta),
  );

  lines.push(`| Channel | Baseline | Ablated | Delta | p-value | Ch. Helped | Ch. Hurt | Unchanged | Verdict |`);
  lines.push(`|---------|----------|---------|-------|---------|------------|----------|-----------|---------|`);

  for (const r of sorted) {
    const sig = r.pValue !== null && r.pValue < 0.05 ? '*' : '';
    const pStr = r.pValue !== null ? r.pValue.toFixed(4) : 'n/a';
    const verdict = getVerdict(r);

    lines.push(
      `| ${r.channel} ` +
      `| ${r.baselineRecall20.toFixed(4)} ` +
      `| ${r.ablatedRecall20.toFixed(4)} ` +
      `| ${r.delta >= 0 ? '+' : ''}${r.delta.toFixed(4)}${sig} ` +
      `| ${pStr} ` +
      `| ${r.queriesChannelHelped} ` +
      `| ${r.queriesChannelHurt} ` +
      `| ${r.queriesUnchanged} ` +
      `| ${verdict} |`,
    );
  }

  lines.push(``);
  lines.push(`**Legend:** Delta = ablated - baseline. Negative delta = channel contributes positively.`);
  lines.push(`Ch. Helped = queries where channel was helpful (removing it decreased recall). * = significant at p<0.05.`);
  lines.push(``);

  if (report.channelFailures && report.channelFailures.length > 0) {
    lines.push(`### Channel Failures`);
    lines.push(``);
    for (const failure of report.channelFailures) {
      const queryInfo = failure.queryId !== undefined ? ` (queryId=${failure.queryId})` : '';
      lines.push(`- \`${failure.channel}\`${queryInfo}: ${failure.error}`);
    }
    lines.push(``);
  }

  // Full Metric Breakdown (multi-metric table)
  const hasMetrics = sorted.some(r => r.metrics);
  if (hasMetrics) {
    lines.push(`### Full Metric Breakdown`);
    lines.push(``);
    lines.push(`| Channel | MRR@5 | P@5 | R@5 | NDCG@5 | MAP | Hit Rate | Lat p50 | Lat p95 |`);
    lines.push(`|---------|-------|-----|-----|--------|-----|----------|---------|---------|`);

    for (const r of sorted) {
      if (!r.metrics) continue;
      const m = r.metrics;
      lines.push(
        `| ${r.channel} ` +
        `| ${m['MRR@5'].delta >= 0 ? '+' : ''}${m['MRR@5'].delta.toFixed(4)} ` +
        `| ${m['precision@5'].delta >= 0 ? '+' : ''}${m['precision@5'].delta.toFixed(4)} ` +
        `| ${m['recall@5'].delta >= 0 ? '+' : ''}${m['recall@5'].delta.toFixed(4)} ` +
        `| ${m['NDCG@5'].delta >= 0 ? '+' : ''}${m['NDCG@5'].delta.toFixed(4)} ` +
        `| ${m['MAP'].delta >= 0 ? '+' : ''}${m['MAP'].delta.toFixed(4)} ` +
        `| ${m['hit_rate'].delta >= 0 ? '+' : ''}${m['hit_rate'].delta.toFixed(4)} ` +
        `| ${m['latency_p50'].delta >= 0 ? '+' : ''}${m['latency_p50'].delta.toFixed(1)}ms ` +
        `| ${m['latency_p95'].delta >= 0 ? '+' : ''}${m['latency_p95'].delta.toFixed(1)}ms |`,
      );
    }
    lines.push(``);
    lines.push(`**Note:** Delta values shown (ablated - baseline). Negative = channel contributes positively to that metric.`);
    lines.push(``);
  }

  // Channel contribution ranking
  lines.push(`### Channel Contribution Ranking`);
  lines.push(``);

  const ranked = [...sorted].sort((a, b) => a.delta - b.delta); // Most negative delta = most valuable
  for (let i = 0; i < ranked.length; i++) {
    const r = ranked[i];
    const contribution = -r.delta; // Invert: negative delta means positive contribution
    lines.push(`${i + 1}. **${r.channel}** — contribution: ${contribution >= 0 ? '+' : ''}${contribution.toFixed(4)} Recall@${recallK}`);
  }

  return lines.join('\n');
}

/* --- 5. INTERNAL HELPERS (VERDICT) --- */

/**
 * Generate a human-readable verdict for a channel ablation result.
 */
function getVerdict(result: AblationResult): string {
  const isSignificant = result.pValue !== null && result.pValue < 0.05;
  const absDelta = Math.abs(result.delta);

  if (absDelta < 0.001) {
    return 'negligible';
  }

  if (result.delta < 0) {
    // Removing the channel hurt quality — channel is valuable
    if (isSignificant && absDelta >= 0.05) return 'CRITICAL';
    if (isSignificant) return 'important';
    return 'likely useful';
  } else {
    // Removing the channel helped quality — channel may be harmful
    if (isSignificant && absDelta >= 0.05) return 'HARMFUL';
    if (isSignificant) return 'possibly harmful';
    return 'likely redundant';
  }
}

/* --- 6. CONVENIENCE: CHANNEL DISABLE MAP --- */

/**
 * Convert an AblationChannel set to HybridSearchOptions flags.
 *
 * Maps ablation channel names to the corresponding useXxx: false flags
 * expected by the hybridSearch / hybridSearchEnhanced functions.
 *
 * @param disabledChannels - Set of channels to disable.
 * @returns Object with useVector, useBm25, useFts, useGraph, useTrigger flags.
 */
export function toHybridSearchFlags(
  disabledChannels: Set<AblationChannel>,
): { useVector: boolean; useBm25: boolean; useFts: boolean; useGraph: boolean; useTrigger: boolean } {
  return {
    useVector: !disabledChannels.has('vector'),
    useBm25: !disabledChannels.has('bm25'),
    useFts: !disabledChannels.has('fts5'),
    useGraph: !disabledChannels.has('graph'),
    useTrigger: !disabledChannels.has('trigger'),
  };
}
