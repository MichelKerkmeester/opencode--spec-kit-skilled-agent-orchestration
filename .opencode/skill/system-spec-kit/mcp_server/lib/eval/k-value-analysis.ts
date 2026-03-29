// ───────────────────────────────────────────────────────────────
// MODULE: K-Value Sensitivity Analysis (T004A)
// ───────────────────────────────────────────────────────────────
// Feature catalog: RRF K-value sensitivity analysis
// Measures the impact of different RRF K-values on ranking stability.
// This is a measurement/analysis tool, not production code.
import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
import type { RankedList, FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
import { isRrfKExperimentalEnabled as _isRrfKExperimentalEnabled } from '../search/search-flags.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
/** Result metrics for a single K-value configuration. */
interface KValueMetrics {
  /** Mean Reciprocal Rank at cutoff 5, estimated against baseline ranking. */
  mrr5: number;
  /** Kendall tau rank correlation with the baseline (K=60) ranking. */
  kendallTau: number;
  /** Average RRF score across all fused results for this K-value. */
  avgScore: number;
}

/** Full analysis result mapping each tested K-value to its metrics. */
interface KValueAnalysisResult {
  baselineK: number;
  results: Record<number, KValueMetrics>;
  /** Number of unique items in the fused results (union across all K values). */
  totalItems: number;
}

// ───────────────────────────────────────────────────────────────
// 2. STATISTICAL HELPERS

// ───────────────────────────────────────────────────────────────
/**
 * Compute Kendall tau rank correlation coefficient between two rankings.
 *
 * Both arrays must contain the same set of IDs (possibly in different order).
 * Returns a value in [-1, 1] where:
 *   1.0  = identical ranking
 *   0.0  = no correlation
 *  -1.0  = perfectly reversed ranking
 */
function kendallTau(rankingA: (number | string)[], rankingB: (number | string)[]): number {
  if (rankingA.length <= 1) return 1.0;

  // Build position maps
  const posA = new Map<number | string, number>();
  const posB = new Map<number | string, number>();
  for (let i = 0; i < rankingA.length; i++) posA.set(rankingA[i], i);
  for (let i = 0; i < rankingB.length; i++) posB.set(rankingB[i], i);

  // Use the intersection of IDs present in both rankings
  const commonIds = rankingA.filter(id => posB.has(id));
  const n = commonIds.length;
  if (n <= 1) return 1.0;

  let concordant = 0;
  let discordant = 0;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const idI = commonIds[i];
      const idJ = commonIds[j];
      const aI = posA.get(idI);
      const aJ = posA.get(idJ);
      const bI = posB.get(idI);
      const bJ = posB.get(idJ);
      if (aI === undefined || aJ === undefined || bI === undefined || bJ === undefined) {
        continue;
      }

      const diffA = aI - aJ;
      const diffB = bI - bJ;

      if (diffA * diffB > 0) {
        concordant++;
      } else if (diffA * diffB < 0) {
        discordant++;
      }
      // Ties (diffA * diffB === 0) are neither concordant nor discordant
    }
  }

  const totalPairs = (n * (n - 1)) / 2;
  if (totalPairs === 0) return 1.0;

  return (concordant - discordant) / totalPairs;
}

/**
 * Compute Mean Reciprocal Rank at cutoff K for a candidate ranking
 * given a baseline (ground-truth) ranking.
 *
 * For each item in the baseline top-5, find its position in the candidate
 * ranking and compute 1/rank. MRR@5 is the mean of those reciprocal ranks.
 */
function mrr5(baselineRanking: (number | string)[], candidateRanking: (number | string)[]): number {
  const cutoff = 5;
  const baselineTop = baselineRanking.slice(0, cutoff);

  if (baselineTop.length === 0) return 0;

  const candidatePos = new Map<number | string, number>();
  for (let i = 0; i < candidateRanking.length; i++) {
    candidatePos.set(candidateRanking[i], i + 1); // 1-indexed rank
  }

  let sumRR = 0;
  for (const id of baselineTop) {
    const rank = candidatePos.get(id);
    if (rank !== undefined) {
      sumRR += 1 / rank;
    }
    // If not found in candidate, contributes 0
  }

  return sumRR / baselineTop.length;
}

// ───────────────────────────────────────────────────────────────
// 3. MAIN ANALYSIS FUNCTION

// ───────────────────────────────────────────────────────────────
/** K-values to test in the grid search. */
const K_VALUES = [10, 20, 40, 60, 80, 100, 120] as const;

/** The baseline K-value (current production default). */
const BASELINE_K = 60;

/**
 * Run K-value sensitivity analysis on a set of ranked lists.
 *
 * For each K in {20, 40, 60, 80, 100}:
 * 1. Fuses the input lists using `fuseResultsMulti` with that K
 * 2. Extracts the ranked order of result IDs
 * 3. Computes Kendall tau correlation with the K=60 baseline
 * 4. Computes MRR@5 against the K=60 baseline
 * 5. Computes average RRF score
 *
 * @param lists Pre-computed ranked lists (no DB access needed)
 * @param _queryCount Number of queries represented (for documentation; not used in computation)
 * @returns Analysis result with per-K metrics
 */
function analyzeKValueSensitivity(
  lists: RankedList[],
  _queryCount: number = 1
): KValueAnalysisResult {
  // Step 1: Fuse with each K value
  const fusedByK = new Map<number, FusionResult[]>();
  for (const k of K_VALUES) {
    fusedByK.set(k, fuseResultsMulti(lists, { k }));
  }

  // Step 2: Extract ID rankings for each K
  const rankingsByK = new Map<number, (number | string)[]>();
  for (const [k, fused] of fusedByK) {
    rankingsByK.set(k, fused.map(r => r.id));
  }

  // Step 3: Baseline ranking (K=60)
  const baselineRanking = rankingsByK.get(BASELINE_K) || [];

  // Step 4: Compute metrics for each K
  const results: Record<number, KValueMetrics> = {};
  const allIds = new Set<number | string>();

  for (const k of K_VALUES) {
    const fused = fusedByK.get(k) ?? [];
    const ranking = rankingsByK.get(k) ?? [];

    for (const id of ranking) allIds.add(id);

    const avgScore = fused.length > 0
      ? fused.reduce((sum, r) => sum + r.rrfScore, 0) / fused.length
      : 0;

    results[k] = {
      mrr5: mrr5(baselineRanking, ranking),
      kendallTau: kendallTau(baselineRanking, ranking),
      avgScore,
    };
  }

  return {
    baselineK: BASELINE_K,
    results,
    totalItems: allIds.size,
  };
}

/**
 * Run K-value sensitivity analysis across multiple independent query runs.
 *
 * Each query's ranked lists are analyzed independently, then averaged so the
 * final metrics reflect per-query sensitivity rather than a synthetic fusion
 * across unrelated queries.
 */
function analyzeKValueSensitivityBatch(
  queryLists: RankedList[][]
): KValueAnalysisResult {
  if (queryLists.length === 0) {
    return analyzeKValueSensitivity([], 0);
  }

  const perQueryAnalyses = queryLists.map((lists) => analyzeKValueSensitivity(lists, 1));
  const allIds = new Set<number | string>();

  for (const lists of queryLists) {
    for (const list of lists) {
      for (const item of list.results) {
        allIds.add(item.id);
      }
    }
  }

  const results = Object.fromEntries(
    K_VALUES.map((k) => {
      const totals = perQueryAnalyses.reduce(
        (accumulator, analysis) => {
          const metrics = analysis.results[k];
          accumulator.mrr5 += metrics.mrr5;
          accumulator.kendallTau += metrics.kendallTau;
          accumulator.avgScore += metrics.avgScore;
          return accumulator;
        },
        { mrr5: 0, kendallTau: 0, avgScore: 0 }
      );

      const divisor = perQueryAnalyses.length;
      return [k, {
        mrr5: totals.mrr5 / divisor,
        kendallTau: totals.kendallTau / divisor,
        avgScore: totals.avgScore / divisor,
      }];
    })
  ) as Record<number, KValueMetrics>;

  return {
    baselineK: BASELINE_K,
    results,
    totalItems: allIds.size,
  };
}

// ───────────────────────────────────────────────────────────────
// 4. REPORT FORMATTER

// ───────────────────────────────────────────────────────────────
/** Formatted report returned by formatKValueReport(). */
interface KValueReport {
  baselineK: number;
  grid: Array<{ k: number; mrr5: number; kendallTau: number; avgScore: number }>;
  recommendation: string;
  sensitivityCurve: string;
}

/**
 * Format a KValueAnalysisResult into a human-readable structured report.
 *
 * - grid: sorted array of per-K metrics (ascending K order)
 * - recommendation: which K to use based on MRR@5 vs the baseline
 * - sensitivityCurve: prose description of score variation across the grid
 */
function formatKValueReport(analysis: KValueAnalysisResult): KValueReport {
  // Build grid sorted by ascending K
  const grid = (Object.keys(analysis.results) as unknown as number[])
    .map(Number)
    .sort((a, b) => a - b)
    .map(k => ({
      k,
      mrr5: analysis.results[k].mrr5,
      kendallTau: analysis.results[k].kendallTau,
      avgScore: analysis.results[k].avgScore,
    }));

  // Recommendation: find K with highest MRR@5; if it equals baseline, recommend staying
  let bestK = analysis.baselineK;
  let bestMrr = analysis.results[analysis.baselineK]?.mrr5 ?? 0;

  for (const row of grid) {
    if (row.mrr5 > bestMrr + 0.001) {
      bestMrr = row.mrr5;
      bestK = row.k;
    }
  }

  const recommendation =
    bestK === analysis.baselineK
      ? `K=${analysis.baselineK} (current default) is optimal — no change recommended.`
      : `K=${bestK} yields the highest MRR@5 (${bestMrr.toFixed(4)}); consider switching from K=${analysis.baselineK}.`;

  // Sensitivity curve: compare score spread across the grid
  const avgScores = grid.map(r => r.avgScore);
  const minAvg = Math.min(...avgScores);
  const maxAvg = Math.max(...avgScores);
  const spread = maxAvg - minAvg;

  let sensitivityCurve: string;
  if (spread < 0.001) {
    sensitivityCurve = 'Flat — average RRF score is stable across all tested K values. Ranking is insensitive to K.';
  } else {
    const lowK = grid[0];
    const highK = grid[grid.length - 1];
    const direction = highK.avgScore > lowK.avgScore ? 'increases' : 'decreases';
    sensitivityCurve =
      `Score ${direction} with K (range ${minAvg.toFixed(4)}–${maxAvg.toFixed(4)}). ` +
      `Diminishing returns observed at extremes (K=${lowK.k} and K=${highK.k}).`;
  }

  return { baselineK: analysis.baselineK, grid, recommendation, sensitivityCurve };
}

// ───────────────────────────────────────────────────────────────
// 5. JUDGED RELEVANCE EVALUATION (REQ-D1-003)

// ───────────────────────────────────────────────────────────────

/**
 * Intent classes aligned with adaptive-fusion.ts weight profiles.
 * Used for per-intent K-sweep segmentation.
 */
type IntentClass =
  | 'understand'
  | 'find_spec'
  | 'fix_bug'
  | 'add_feature'
  | 'refactor'
  | 'security_audit'
  | 'find_decision'
  | 'unknown';

/**
 * A judged query with explicit relevance labels for NDCG/MRR evaluation.
 * REQ-D1-003: Judged query set for per-intent K sweep.
 */
interface JudgedQuery {
  /** The query string */
  query: string;
  /** Intent class for segmentation */
  intent: IntentClass;
  /** IDs considered relevant (binary relevance for MRR computation) */
  relevantIds: string[];
  /**
   * Graded relevance labels: id -> score (0=not relevant, 1=relevant, 2=highly relevant, 3=perfect).
   * Used for NDCG computation.
   */
  labels: Map<string, number>;
  /** Pre-computed ranked lists for fusion (one per retrieval channel) */
  channels: RankedList[];
}

/**
 * Per-K metrics computed against judged relevance labels.
 */
interface JudgedKMetrics {
  /** Normalized Discounted Cumulative Gain at cutoff 10 */
  ndcg10: number;
  /** Mean Reciprocal Rank at cutoff 5 (binary relevance) */
  mrr5Judged: number;
  /** Number of queries evaluated */
  queryCount: number;
}

/** Per-intent best-K selection result. */
interface BestKPerIntent {
  /** The selected K value (argmax of ndcg10, tie-broken by lower K) */
  bestK: number;
  /** NDCG@10 at the selected K */
  bestNdcg10: number;
  /** Full metrics for each K in the sweep */
  metricsPerK: Record<number, JudgedKMetrics>;
  /** Number of queries for this intent */
  queryCount: number;
}

/** Result of a full judged K sweep across all intents. */
interface JudgedKSweepResult {
  /** Per-intent best-K selections */
  byIntent: Partial<Record<IntentClass, BestKPerIntent>>;
  /** Global best-K (across all intents combined) */
  globalBestK: number;
  /** Whether SPECKIT_RRF_K_EXPERIMENTAL was enabled */
  experimentalMode: boolean;
}

// ───────────────────────────────────────────────────────────────
// 5.1 NDCG@10 IMPLEMENTATION

// ───────────────────────────────────────────────────────────────

/** K-values for the judged relevance sweep (REQ-D1-003). */
const JUDGED_K_SWEEP_VALUES = K_VALUES;

interface OptimizationJudgment {
  id: number | string;
  relevance: number;
}

interface IntentKOptimizationQuery {
  intent: string;
  judgments: OptimizationJudgment[];
  rankingsByK: Partial<Record<number, Array<number | string>>>;
}

interface IntentKMetrics {
  ndcg10: number;
  mrr5: number;
}

interface IntentKOptimizationResult {
  bestKByIntent: Record<string, number>;
  metricsByIntent: Record<string, Record<number, IntentKMetrics>>;
}

function buildJudgmentLabelMap(judgments: OptimizationJudgment[]): Map<string, number> {
  return new Map(judgments.map((judgment) => [String(judgment.id), judgment.relevance]));
}

function buildRelevantIds(judgments: OptimizationJudgment[]): string[] {
  return judgments
    .filter((judgment) => judgment.relevance > 0)
    .map((judgment) => String(judgment.id));
}

function computeNdcgAtK(
  rankedIds: Array<string | number>,
  judgments: OptimizationJudgment[],
  cutoff: number,
): number {
  if (cutoff <= 0) return 0;

  const labels = buildJudgmentLabelMap(judgments);
  const topN = rankedIds.slice(0, cutoff);

  let dcg = 0;
  for (let i = 0; i < topN.length; i++) {
    const rel = labels.get(String(topN[i])) ?? 0;
    if (rel > 0) {
      dcg += rel / Math.log2(i + 2);
    }
  }

  const idealLabels = Array.from(labels.values())
    .filter((value) => value > 0)
    .sort((a, b) => b - a)
    .slice(0, cutoff);

  let idcg = 0;
  for (let i = 0; i < idealLabels.length; i++) {
    idcg += idealLabels[i] / Math.log2(i + 2);
  }

  return idcg === 0 ? 0 : dcg / idcg;
}

function computeMrrAtK(
  rankedIds: Array<string | number>,
  judgments: OptimizationJudgment[],
  cutoff: number,
): number {
  if (cutoff <= 0) return 0;

  const relevantIds = new Set(buildRelevantIds(judgments));
  const topN = rankedIds.slice(0, cutoff);
  for (let i = 0; i < topN.length; i++) {
    if (relevantIds.has(String(topN[i]))) {
      return 1 / (i + 1);
    }
  }
  return 0;
}

function argmaxK(metricsByK: Record<number, { ndcg10: number }>): number {
  const ks = Object.keys(metricsByK).map(Number);
  if (ks.length === 0) return BASELINE_K;

  let bestK = ks[0];
  let bestNdcg = metricsByK[bestK]?.ndcg10 ?? -Infinity;

  for (const k of ks.slice(1)) {
    const ndcg = metricsByK[k]?.ndcg10 ?? -Infinity;
    if (ndcg > bestNdcg || (ndcg === bestNdcg && k < bestK)) {
      bestK = k;
      bestNdcg = ndcg;
    }
  }

  return bestK;
}

function optimizeKValuesByIntent(queries: IntentKOptimizationQuery[]): IntentKOptimizationResult {
  if (queries.length === 0) {
    return {
      bestKByIntent: {},
      metricsByIntent: {},
    };
  }

  const grouped = new Map<string, IntentKOptimizationQuery[]>();
  for (const query of queries) {
    const bucket = grouped.get(query.intent) ?? [];
    bucket.push(query);
    grouped.set(query.intent, bucket);
  }

  const bestKByIntent: Record<string, number> = {};
  const metricsByIntent: Record<string, Record<number, IntentKMetrics>> = {};

  for (const [intent, intentQueries] of grouped.entries()) {
    const metricsForIntent: Record<number, IntentKMetrics> = {};

    for (const k of K_VALUES) {
      let ndcgTotal = 0;
      let mrrTotal = 0;

      for (const query of intentQueries) {
        const ranking = query.rankingsByK[k] ?? [];
        ndcgTotal += computeNdcgAtK(ranking, query.judgments, 10);
        mrrTotal += computeMrrAtK(ranking, query.judgments, 5);
      }

      metricsForIntent[k] = {
        ndcg10: ndcgTotal / intentQueries.length,
        mrr5: mrrTotal / intentQueries.length,
      };
    }

    metricsByIntent[intent] = metricsForIntent;
    bestKByIntent[intent] = argmaxK(metricsForIntent);
  }

  return {
    bestKByIntent,
    metricsByIntent,
  };
}

function resolveOptimalRrfK(
  intent: string,
  bestKByIntent: Record<string, number>,
): number {
  if (!isKExperimentalEnabled()) {
    return BASELINE_K;
  }
  return bestKByIntent[intent] ?? BASELINE_K;
}

/**
 * Compute NDCG@10 for a single result ranking against judged labels.
 *
 * NDCG = DCG / IDCG where:
 *   DCG@n  = Σ (rel_i / log2(i+2)) for i in 0..n-1
 *   IDCG@n = DCG of ideal (sorted by relevance) ranking
 *
 * @param rankedIds - Ordered list of candidate IDs (descending by score)
 * @param labels - Map of id -> relevance grade (0-3)
 * @returns NDCG@10 in [0, 1]; returns 0 for empty/unlabeled rankings
 */
function computeNdcg10(
  rankedIds: (string | number)[],
  labels: Map<string, number>
): number {
  return computeNdcgAtK(
    rankedIds,
    Array.from(labels.entries()).map(([id, relevance]) => ({ id, relevance })),
    10,
  );
}

/**
 * Compute MRR@5 against judged relevant IDs (binary relevance).
 *
 * @param rankedIds - Ordered list of candidate IDs (descending by score)
 * @param relevantIds - Set of IDs considered relevant
 * @returns MRR@5 in [0, 1]
 */
function computeMrr5Judged(
  rankedIds: (string | number)[],
  relevantIds: string[]
): number {
  return computeMrrAtK(
    rankedIds,
    relevantIds.map((id) => ({ id, relevance: 1 })),
    5,
  );
}

// ───────────────────────────────────────────────────────────────
// 5.2 PER-INTENT K SWEEP

// ───────────────────────────────────────────────────────────────

/**
 * Check if experimental K selection is enabled (REQ-D1-003).
 * Default: ON (graduated). Set SPECKIT_RRF_K_EXPERIMENTAL=false to disable.
 * When OFF, per-intent K selection is skipped and K=60 is used.
 * When ON, NDCG@10-maximizing K is selected per intent.
 */
function isKExperimentalEnabled(): boolean {
  return _isRrfKExperimentalEnabled();
}

/**
 * Evaluate a set of judged queries at a given K, returning aggregate metrics.
 *
 * @param queries - Judged queries with channels, labels, and relevantIds
 * @param k - RRF smoothing constant to use for fusion
 * @returns Aggregate NDCG@10 and MRR@5 metrics across the query set
 */
function evalQueriesAtK(queries: JudgedQuery[], k: number): JudgedKMetrics {
  if (queries.length === 0) {
    return { ndcg10: 0, mrr5Judged: 0, queryCount: 0 };
  }

  let sumNdcg = 0;
  let sumMrr = 0;

  for (const q of queries) {
    const fused = fuseResultsMulti(q.channels, { k });
    const rankedIds = fused.map((r: FusionResult) => r.id);
    sumNdcg += computeNdcg10(rankedIds, q.labels);
    sumMrr += computeMrr5Judged(rankedIds, q.relevantIds);
  }

  return {
    ndcg10: sumNdcg / queries.length,
    mrr5Judged: sumMrr / queries.length,
    queryCount: queries.length,
  };
}

/**
 * Select best K for an intent via argmax(NDCG@10), tie-broken by lower K.
 *
 * @param metricsPerK - Metrics keyed by K value
 * @returns The K value that maximizes NDCG@10 (lower K wins ties)
 */
function argmaxNdcg10(metricsPerK: Record<number, JudgedKMetrics>): number {
  let bestK = JUDGED_K_SWEEP_VALUES[0] as number;
  let bestNdcg = -Infinity;

  for (const kStr of Object.keys(metricsPerK)) {
    const k = Number(kStr);
    const metrics = metricsPerK[k];
    if (
      metrics.ndcg10 > bestNdcg ||
      (metrics.ndcg10 === bestNdcg && k < bestK)
    ) {
      bestNdcg = metrics.ndcg10;
      bestK = k;
    }
  }

  return bestK;
}

/**
 * Run a per-intent K sweep over JUDGED_K_SWEEP_VALUES and select the best K
 * per intent via argmax(NDCG@10).
 *
 * Feature flag: SPECKIT_RRF_K_EXPERIMENTAL (default ON, graduated).
 * When OFF, returns K=60 for all intents without running the sweep.
 *
 * @param queries - Judged queries to evaluate
 * @returns Per-intent best-K selections and global best-K
 */
function runJudgedKSweep(queries: JudgedQuery[]): JudgedKSweepResult {
  const experimentalMode = isKExperimentalEnabled();

  // Feature flag OFF: return K=60 defaults without evaluation
  if (!experimentalMode) {
    const fallbackResult: JudgedKSweepResult = {
      byIntent: {},
      globalBestK: BASELINE_K,
      experimentalMode: false,
    };
    return fallbackResult;
  }

  // Group queries by intent
  const byIntent = new Map<IntentClass, JudgedQuery[]>();
  for (const q of queries) {
    const bucket = byIntent.get(q.intent) ?? [];
    bucket.push(q);
    byIntent.set(q.intent, bucket);
  }

  const resultByIntent: Partial<Record<IntentClass, BestKPerIntent>> = {};
  const globalSumNdcg: Record<number, number> = {};
  let globalQueryCount = 0;

  for (const [intent, intentQueries] of byIntent) {
    const metricsPerK: Record<number, JudgedKMetrics> = {};

    for (const k of JUDGED_K_SWEEP_VALUES) {
      metricsPerK[k] = evalQueriesAtK(intentQueries, k);
      globalSumNdcg[k] = (globalSumNdcg[k] ?? 0) + metricsPerK[k].ndcg10 * intentQueries.length;
    }
    globalQueryCount += intentQueries.length;

    const bestK = argmaxNdcg10(metricsPerK);
    resultByIntent[intent] = {
      bestK,
      bestNdcg10: metricsPerK[bestK].ndcg10,
      metricsPerK,
      queryCount: intentQueries.length,
    };
  }

  // Global best-K: argmax of weighted-average NDCG@10 across all intents
  let globalBestK = BASELINE_K;
  if (globalQueryCount > 0) {
    const globalAvgNdcg: Record<number, number> = {};
    for (const k of JUDGED_K_SWEEP_VALUES) {
      globalAvgNdcg[k] = (globalSumNdcg[k] ?? 0) / globalQueryCount;
    }
    const globalMetrics: Record<number, JudgedKMetrics> = {};
    for (const k of JUDGED_K_SWEEP_VALUES) {
      globalMetrics[k] = { ndcg10: globalAvgNdcg[k], mrr5Judged: 0, queryCount: globalQueryCount };
    }
    globalBestK = argmaxNdcg10(globalMetrics);
  }

  return {
    byIntent: resultByIntent,
    globalBestK,
    experimentalMode: true,
  };
}

// ───────────────────────────────────────────────────────────────
// 6. EXPORTS

// ───────────────────────────────────────────────────────────────
export {
  analyzeKValueSensitivity,
  analyzeKValueSensitivityBatch,
  formatKValueReport,
  kendallTau,
  mrr5,
  K_VALUES,
  BASELINE_K,
  computeNdcgAtK,
  computeMrrAtK,
  argmaxK,
  optimizeKValuesByIntent,
  resolveOptimalRrfK,
  // REQ-D1-003: Judged relevance K-optimization
  JUDGED_K_SWEEP_VALUES,
  computeNdcg10,
  computeMrr5Judged,
  evalQueriesAtK,
  argmaxNdcg10,
  runJudgedKSweep,
  isKExperimentalEnabled,
};

export type {
  KValueMetrics,
  KValueAnalysisResult,
  KValueReport,
  IntentKOptimizationQuery,
  // REQ-D1-003: Judged relevance types
  IntentClass,
  JudgedQuery,
  JudgedKMetrics,
  BestKPerIntent,
  JudgedKSweepResult,
};
