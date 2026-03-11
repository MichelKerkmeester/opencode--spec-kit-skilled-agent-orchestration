// ---------------------------------------------------------------
// MODULE: Ablation Framework (R13-S3)
// ---------------------------------------------------------------
//
// Controlled ablation studies for search channel contribution analysis.
// Selectively disables one search channel at a time, measures Recall@20
// delta against a full-pipeline baseline, and attributes per-channel
// contribution to retrieval quality.
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
// and is a no-op when the flag is not set.
// ---------------------------------------------------------------

import { initEvalDb, getEvalDb } from './eval-db';
import {
  computeRecall,
  computeMRR,
  computeNDCG,
  computePrecision,
  computeMAP,
  computeHitRate,
} from './eval-metrics';
import type { EvalResult, GroundTruthEntry } from './eval-metrics';
import {
  GROUND_TRUTH_QUERIES,
  GROUND_TRUTH_RELEVANCES,
} from './ground-truth-data';
import type { GroundTruthQuery } from './ground-truth-data';

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
  /** Compare against an existing baseline run ID instead of computing one. */
  baselineRunId?: string;
  /** Recall cutoff K. Defaults to 20. */
  recallK?: number;
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
function getQueriesToEvaluate(config: AblationConfig): GroundTruthQuery[] {
  if (config.groundTruthQueryIds && config.groundTruthQueryIds.length > 0) {
    const idSet = new Set(config.groundTruthQueryIds);
    return GROUND_TRUTH_QUERIES.filter(q => idSet.has(q.id));
  }
  return GROUND_TRUTH_QUERIES;
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

  // AI-WHY: Log-space binomial coefficient to avoid overflow for large n
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
  baselinePerQuery: Map<number, { metrics: ReturnType<typeof computeQueryMetrics>; latencyMs: number }>,
  ablatedPerQuery: Map<number, { metrics: ReturnType<typeof computeQueryMetrics>; latencyMs: number }>,
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
    'token_usage': { baseline: 0, ablated: 0, delta: 0 },
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
  const queries = getQueriesToEvaluate(config);

  if (queries.length === 0) {
    console.warn('[ablation] No queries to evaluate.');
    return null;
  }

  try {
    // -- Step 1: Compute baseline (all channels enabled) --
    const baselineRecalls: Map<number, number> = new Map();
    const baselineMetricsPerQuery: Map<number, { metrics: ReturnType<typeof computeQueryMetrics>; latencyMs: number }> = new Map();
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
      const ablatedMetricsPerQuery: Map<number, { metrics: ReturnType<typeof computeQueryMetrics>; latencyMs: number }> = new Map();
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

        // queriesChannelHelped = channel was helping (removing it hurt quality)
        // queriesChannelHurt = channel was harmful (removing it helped quality)
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

    // AI-WHY: Use a synthetic eval_run_id: negative timestamp to avoid collision
    // with production run IDs (same pattern as bm25-baseline.ts).
    const evalRunId = -(Date.parse(report.timestamp));

    const insertSnapshot = db.prepare(`
      INSERT INTO eval_metric_snapshots
        (eval_run_id, metric_name, metric_value, channel, query_count, metadata, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const recallK = report.config.recallK ?? 20;

    const writeAll = db.transaction(() => {
      // Store baseline recall
      insertSnapshot.run(
        evalRunId,
        `ablation_baseline_recall@${recallK}`,
        report.overallBaselineRecall,
        'all',
        report.queryCount ?? report.results[0]?.queryCount ?? 0,
        JSON.stringify({
          runId: report.runId,
          config: report.config,
          durationMs: report.durationMs,
          queryCount: report.queryCount ?? report.results[0]?.queryCount ?? 0,
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
            insertSnapshot.run(
              evalRunId,
              `ablation_${metricName}_delta`,
              (entry as AblationMetricEntry).delta,
              result.channel,
              result.queryCount,
              JSON.stringify({
                runId: report.runId,
                baseline: (entry as AblationMetricEntry).baseline,
                ablated: (entry as AblationMetricEntry).ablated,
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
    lines.push(`| Channel | MRR@5 | P@5 | R@5 | NDCG@5 | MAP | Hit Rate | Lat p50 | Lat p95 | Tokens |`);
    lines.push(`|---------|-------|-----|-----|--------|-----|----------|---------|---------|--------|`);

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
        `| ${m['latency_p95'].delta >= 0 ? '+' : ''}${m['latency_p95'].delta.toFixed(1)}ms ` +
        `| ${m['token_usage'].delta >= 0 ? '+' : ''}${m['token_usage'].delta.toFixed(0)} |`,
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
