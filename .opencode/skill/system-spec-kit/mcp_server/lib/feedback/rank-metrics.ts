// ───────────────────────────────────────────────────────────────
// MODULE: Rank Metrics
// ───────────────────────────────────────────────────────────────
// IR metric computation functions extracted from shadow-scoring.ts
// for modularization (REQ-D4-006).
//
// Provides: Kendall tau, NDCG, MRR, rank comparison, and
// direction classification utilities.

/* ───────────────────────────────────────────────────────────────
   1. TYPES
----------------------------------------------------------------*/

/** Direction of rank change for a single result. */
export type RankDirection = 'improved' | 'degraded' | 'unchanged';

/** Per-result rank delta between live and shadow ranking. */
export interface RankDelta {
  /** Opaque result identifier. */
  resultId: string;
  /** Position in the live ranking (1-based). */
  liveRank: number;
  /** Position in the shadow (learned-signals) ranking (1-based). */
  shadowRank: number;
  /** Signed delta: liveRank - shadowRank (positive = shadow improved). */
  delta: number;
  /** Classification of direction. */
  direction: RankDirection;
}

/** Metrics computed from a rank comparison. */
export interface RankComparisonMetrics {
  /** Kendall tau correlation coefficient in [-1, 1]. */
  kendallTau: number;
  /** NDCG delta: shadow NDCG@k minus live NDCG@k. */
  ndcgDelta: number;
  /** MRR delta: shadow MRR minus live MRR. */
  mrrDelta: number;
  /** Count of results that improved. */
  improvedCount: number;
  /** Count of results that degraded. */
  degradedCount: number;
  /** Count of results unchanged. */
  unchangedCount: number;
}

/** Full result of a rank comparison for one query. */
export interface RankComparisonResult {
  queryId: string;
  deltas: RankDelta[];
  metrics: RankComparisonMetrics;
}

/** A ranked item: result ID and its rank position. */
export interface RankedItem {
  resultId: string;
  rank: number;
  /** Optional relevance score (used for NDCG). */
  relevanceScore?: number;
}

function isJudgedItem(item: RankedItem): item is RankedItem & { relevanceScore: number } {
  return typeof item.relevanceScore === 'number' && Number.isFinite(item.relevanceScore);
}

function condenseJudgedRanking(rankedItems: RankedItem[]): RankedItem[] {
  return rankedItems
    .filter(isJudgedItem)
    .sort((left, right) => left.rank - right.rank);
}

/* ───────────────────────────────────────────────────────────────
   2. DIRECTION CLASSIFICATION
----------------------------------------------------------------*/

/**
 * Classify the direction of a rank delta.
 *
 * "improved" means the result ranked higher in shadow (lower rank number).
 * delta = liveRank - shadowRank: positive means improvement.
 */
export function classifyDirection(delta: number): RankDirection {
  if (delta > 0) return 'improved';
  if (delta < 0) return 'degraded';
  return 'unchanged';
}

/* ───────────────────────────────────────────────────────────────
   3. KENDALL TAU
----------------------------------------------------------------*/

/**
 * Compute Kendall tau rank correlation between two ordered lists.
 *
 * Only considers items present in both lists.
 * Returns 0 for lists with fewer than 2 overlapping items.
 *
 * @param liveRanks - Map from resultId to live rank
 * @param shadowRanks - Map from resultId to shadow rank
 * @returns Kendall tau in [-1, 1]
 */
export function computeKendallTau(
  liveRanks: Map<string, number>,
  shadowRanks: Map<string, number>
): number {
  // Find overlapping items
  const overlap: string[] = [];
  for (const id of liveRanks.keys()) {
    if (shadowRanks.has(id)) {
      overlap.push(id);
    }
  }

  if (overlap.length < 2) return 0;

  let concordant = 0;
  let discordant = 0;

  for (let i = 0; i < overlap.length; i++) {
    for (let j = i + 1; j < overlap.length; j++) {
      const a = overlap[i];
      const b = overlap[j];

      const liveDiff = liveRanks.get(a)! - liveRanks.get(b)!;
      const shadowDiff = shadowRanks.get(a)! - shadowRanks.get(b)!;

      if (liveDiff * shadowDiff > 0) {
        concordant++;
      } else if (liveDiff * shadowDiff < 0) {
        discordant++;
      }
      // ties (product === 0) are neither concordant nor discordant
    }
  }

  const totalPairs = concordant + discordant;
  if (totalPairs === 0) return 0;

  return (concordant - discordant) / totalPairs;
}

/* ───────────────────────────────────────────────────────────────
   4. NDCG
----------------------------------------------------------------*/

/**
 * Compute NDCG@k for a ranked list given relevance scores.
 *
 * Uses the log2 discount: DCG = sum(rel_i / log2(rank_i + 1)).
 * NDCG = DCG / IDCG where IDCG uses the ideal ordering.
 *
 * Accepts sparse rankings with gaps. Missing positions are treated as
 * zero-relevance items in the production ranking.
 *
 * @param rankedItems - Items in rank order (rank 1 first)
 * @param k - Cutoff depth (default: rankedItems.length)
 * @returns NDCG in [0, 1]
 */
export function computeNDCG(rankedItems: RankedItem[], k?: number): number {
  if (rankedItems.length === 0) return 0;

  const cutoff = k ?? Math.max(...rankedItems.map((item) => item.rank));
  const items = [...rankedItems]
    .sort((left, right) => left.rank - right.rank)
    .filter((item) => item.rank <= cutoff);

  // DCG
  let dcg = 0;
  for (const item of items) {
    const rel = item.relevanceScore ?? 0;
    dcg += rel / Math.log2(item.rank + 1);
  }

  // IDCG — sort by relevance descending
  const ideal = [...rankedItems]
    .sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0))
    .slice(0, cutoff);

  let idcg = 0;
  for (let i = 0; i < ideal.length; i++) {
    const rel = ideal[i].relevanceScore ?? 0;
    idcg += rel / Math.log2(i + 2);
  }

  if (idcg === 0) return 0;
  return dcg / idcg;
}

/* ───────────────────────────────────────────────────────────────
   5. MRR
----------------------------------------------------------------*/

/**
 * Compute MRR (Mean Reciprocal Rank) for a single query.
 *
 * Returns 1/rank of the first relevant result (relevanceScore > 0),
 * or 0 if no relevant result is found.
 */
export function computeMRR(rankedItems: RankedItem[]): number {
  for (const item of [...rankedItems].sort((left, right) => left.rank - right.rank)) {
    if ((item.relevanceScore ?? 0) > 0) {
      return 1 / item.rank;
    }
  }
  return 0;
}

/* ───────────────────────────────────────────────────────────────
   6. RANK COMPARISON
----------------------------------------------------------------*/

/**
 * Compare live and shadow ranked lists for a single query.
 *
 * Computes per-result rank deltas and aggregate metrics including
 * Kendall tau correlation, NDCG delta, and MRR delta.
 *
 * @param queryId - Identifier for the query being evaluated
 * @param liveRanked - Results as ranked by the live system
 * @param shadowRanked - Results as ranked by shadow (learned-signals) system
 * @returns Full comparison result with deltas and metrics
 */
export function compareRanks(
  queryId: string,
  liveRanked: RankedItem[],
  shadowRanked: RankedItem[]
): RankComparisonResult {
  // Build rank maps
  const liveRankMap = new Map<string, number>();
  for (const item of liveRanked) {
    liveRankMap.set(item.resultId, item.rank);
  }

  const shadowRankMap = new Map<string, number>();
  for (const item of shadowRanked) {
    shadowRankMap.set(item.resultId, item.rank);
  }

  // Compute per-result deltas for items in both lists
  const deltas: RankDelta[] = [];
  let improvedCount = 0;
  let degradedCount = 0;
  let unchangedCount = 0;

  for (const item of liveRanked) {
    const shadowRank = shadowRankMap.get(item.resultId);
    if (shadowRank !== undefined) {
      const delta = item.rank - shadowRank; // positive = improved in shadow
      const direction = classifyDirection(delta);
      deltas.push({
        resultId: item.resultId,
        liveRank: item.rank,
        shadowRank,
        delta,
        direction,
      });
      if (direction === 'improved') improvedCount++;
      else if (direction === 'degraded') degradedCount++;
      else unchangedCount++;
    }
  }

  // Kendall tau
  const kendallTau = computeKendallTau(liveRankMap, shadowRankMap);

  // Preserve original rank positions so unlabeled items still occupy zero-relevance
  // slots in the evaluated ranking instead of compressing judged survivors upward.
  const liveJudged = condenseJudgedRanking(liveRanked);
  const shadowJudged = condenseJudgedRanking(shadowRanked);

  // NDCG delta
  const liveNdcg = computeNDCG(liveJudged);
  const shadowNdcg = computeNDCG(shadowJudged);
  const ndcgDelta = shadowNdcg - liveNdcg;

  // MRR delta
  const liveMrr = computeMRR(liveJudged);
  const shadowMrr = computeMRR(shadowJudged);
  const mrrDelta = shadowMrr - liveMrr;

  return {
    queryId,
    deltas,
    metrics: {
      kendallTau,
      ndcgDelta,
      mrrDelta,
      improvedCount,
      degradedCount,
      unchangedCount,
    },
  };
}
