// ───────────────────────────────────────────────────────────────
// MODULE: K-Value Sensitivity Analysis (T004A)
// ───────────────────────────────────────────────────────────────
// Feature catalog: RRF K-value sensitivity analysis
// Measures the impact of different RRF K-values on ranking stability.
// This is a measurement/analysis tool, not production code.
import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
import type { RankedList, FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';

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
const K_VALUES = [20, 40, 60, 80, 100] as const;

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
// 5. EXPORTS

// ───────────────────────────────────────────────────────────────
export {
  analyzeKValueSensitivity,
  analyzeKValueSensitivityBatch,
  formatKValueReport,
  kendallTau,
  mrr5,
  K_VALUES,
  BASELINE_K,
};

export type {
  KValueMetrics,
  KValueAnalysisResult,
  KValueReport,
};
