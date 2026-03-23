// ───────────────────────────────────────────────────────────────
// MODULE: Eval Metrics
// ───────────────────────────────────────────────────────────────
// Feature catalog: Core metric computation
// T006a-e: Pure computation functions for 12 evaluation metrics
// (7 core + 5 diagnostic). No DB access, no side effects.
/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

/** A single retrieved result from a search query. */
export interface EvalResult {
  /** Unique memory identifier. */
  memoryId: number;
  /** Retrieval score assigned by the search system. */
  score: number;
  /** 1-based rank position in the result list. */
  rank: number;
}

// H16 FIX: Use contiguous 1-based position within the topK slice, not external sparse rank.
// External ranks can be non-contiguous after filtering/reranking, which would systematically
// understate MRR/NDCG/MAP if used directly.
function getRankAtIndex(_result: EvalResult, index: number): number {
  return index + 1;
}

/** A single ground truth relevance judgment for a query-memory pair. */
export interface GroundTruthEntry {
  /** Identifier of the query this judgment belongs to. */
  queryId: number;
  /** Unique memory identifier. */
  memoryId: number;
  /**
   * Relevance grade:
   *   0 = not relevant
   *   1 = partially relevant
   *   2 = relevant
   *   3 = highly relevant
   */
  relevance: number;
  /** Optional importance tier (e.g. 'constitutional', 'critical', 'important', 'normal'). */
  tier?: string;
  /** Optional creation timestamp for cold-start detection. */
  createdAt?: Date;
}

/** All computed metrics returned by computeAllMetrics(). */
export interface AllMetrics {
  mrr: number;
  ndcg: number;
  recall: number;
  hitRate: number;
  inversionRate: number;
  constitutionalSurfacingRate: number;
  importanceWeightedRecall: number;
  coldStartDetectionRate: number;
  precision: number;
  f1: number;
  map: number;
  intentWeightedNdcg: number;
}

/* ───────────────────────────────────────────────────────────────
   2. INTERNAL HELPERS
──────────────────────────────────────────────────────────────── */

/**
 * Build a lookup map from memoryId → relevance for fast access.
 */
function buildRelevanceMap(groundTruth: GroundTruthEntry[]): Map<number, number> {
  const map = new Map<number, number>();
  for (const entry of groundTruth) {
    map.set(entry.memoryId, entry.relevance);
  }
  return map;
}

/**
 * Build a lookup map from memoryId → GroundTruthEntry for full detail access.
 */
function buildGroundTruthMap(groundTruth: GroundTruthEntry[]): Map<number, GroundTruthEntry> {
  const map = new Map<number, GroundTruthEntry>();
  for (const entry of groundTruth) {
    map.set(entry.memoryId, entry);
  }
  return map;
}

/**
 * Sort results by rank ascending, return first k items.
 */
function topK(results: EvalResult[], k: number): EvalResult[] {
  const safeK = Number.isFinite(k) ? Math.floor(k) : 0;
  if (safeK <= 0) return [];
  return [...results]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, safeK);
}

/* ───────────────────────────────────────────────────────────────
   3. CORE METRICS
──────────────────────────────────────────────────────────────── */

/**
 * Mean Reciprocal Rank at K (default K=5).
 *
 * For each query: find rank of first relevant result in top-K,
 * take 1/rank. If no relevant result in top-K, contribution = 0.
 * Average across all queries (treated as single query here since
 * results are pre-filtered per call).
 *
 * @returns Value in [0, 1]. Returns 0 for empty inputs.
 */
export function computeMRR(
  results: EvalResult[],
  groundTruth: GroundTruthEntry[],
  k: number = 5,
): number {
  if (results.length === 0 || groundTruth.length === 0) return 0;
  if (groundTruth.every(entry => entry.relevance <= 0)) return 0;

  const relevanceMap = buildRelevanceMap(groundTruth);
  const topResults = topK(results, k);

  for (let i = 0; i < topResults.length; i++) {
    const rel = relevanceMap.get(topResults[i].memoryId) ?? 0;
    if (rel > 0) {
      return 1 / getRankAtIndex(topResults[i], i);
    }
  }

  return 0;
}

/**
 * Normalized Discounted Cumulative Gain at K (default K=10).
 *
 * DCG  = sum(relevance_i / log2(i+2)) for i in 0..K-1 (0-indexed)
 * IDCG = DCG of ideal ranking (relevance sorted descending)
 * NDCG = DCG / IDCG
 *
 * @returns Value in [0, 1]. Returns 0 for empty inputs or zero IDCG.
 */
export function computeNDCG(
  results: EvalResult[],
  groundTruth: GroundTruthEntry[],
  k: number = 10,
): number {
  if (results.length === 0 || groundTruth.length === 0) return 0;
  if (groundTruth.every(entry => entry.relevance <= 0)) return 0;

  const relevanceMap = buildRelevanceMap(groundTruth);
  const topResults = topK(results, k);

  // Compute DCG
  let dcg = 0;
  for (let i = 0; i < topResults.length; i++) {
    const rel = relevanceMap.get(topResults[i].memoryId) ?? 0;
    dcg += rel / Math.log2(getRankAtIndex(topResults[i], i) + 1);
  }

  // Compute IDCG: ideal ordering of all ground truth relevances, top-K
  const idealRelevances = [...groundTruth]
    .map(e => e.relevance)
    .sort((a, b) => b - a)
    .slice(0, k);

  let idcg = 0;
  for (let i = 0; i < idealRelevances.length; i++) {
    idcg += idealRelevances[i] / Math.log2(i + 2);
  }

  if (idcg === 0) return 0;

  return Math.min(1, dcg / idcg);
}

/**
 * Recall at K (default K=20).
 *
 * What fraction of all relevant memories (relevance > 0) in ground
 * truth appear in the top-K results?
 *
 * @returns Value in [0, 1]. Returns 0 when no relevant items exist.
 */
export function computeRecall(
  results: EvalResult[],
  groundTruth: GroundTruthEntry[],
  k: number = 20,
): number {
  if (results.length === 0 || groundTruth.length === 0) return 0;

  const relevantIds = new Set(
    groundTruth.filter(e => e.relevance > 0).map(e => e.memoryId),
  );

  if (relevantIds.size === 0) return 0;

  const topResults = topK(results, k);
  // F-28 — Deduplicate hits by memoryId to prevent Recall > 1.0
  // When the same memory appears multiple times in results.
  const seenIds = new Set<number>();
  let hits = 0;
  for (const r of topResults) {
    if (relevantIds.has(r.memoryId) && !seenIds.has(r.memoryId)) {
      hits++;
      seenIds.add(r.memoryId);
    }
  }

  return hits / relevantIds.size;
}

/**
 * Compute Precision@K — fraction of retrieved results that are relevant.
 * Precision = |relevant ∩ retrieved@K| / K
 */
export function computePrecision(
  results: EvalResult[],
  groundTruth: GroundTruthEntry[],
  k: number = 20
): number {
  if (k <= 0 || results.length === 0 || groundTruth.length === 0) return 0;
  const relevantIds = new Set(
    groundTruth.filter(e => e.relevance > 0).map(e => e.memoryId),
  );
  const topResults = topK(results, k);
  if (topResults.length === 0) return 0;
  const seenIds = new Set<number>();
  let hits = 0;
  for (const r of topResults) {
    if (seenIds.has(r.memoryId)) continue;
    seenIds.add(r.memoryId);
    if (relevantIds.has(r.memoryId)) hits++;
  }
  return hits / k;
}

/**
 * Compute F1@K — harmonic mean of Precision@K and Recall@K.
 * F1 = 2 * (P * R) / (P + R), or 0 if both are 0.
 */
export function computeF1(
  results: EvalResult[],
  groundTruth: GroundTruthEntry[],
  k: number = 20
): number {
  if (k <= 0) return 0;
  const p = computePrecision(results, groundTruth, k);
  const r = computeRecall(results, groundTruth, k);
  if (p + r === 0) return 0;
  return 2 * (p * r) / (p + r);
}

/**
 * Mean Average Precision (MAP).
 *
 * AP = (1 / |relevant|) × Σ(Precision@k × rel(k)) for k = 1..K
 * where rel(k) is 1 if the k-th result is relevant, 0 otherwise.
 *
 * MAP is the mean of AP across queries (single query here since
 * results are pre-filtered per call).
 *
 * @param results - Retrieved results for the query.
 * @param groundTruth - Ground truth relevance judgments.
 * @param k - Cutoff. Defaults to 20.
 * @returns Value in [0, 1]. Returns 0 for empty inputs.
 */
export function computeMAP(
  results: EvalResult[],
  groundTruth: GroundTruthEntry[],
  k: number = 20,
): number {
  if (results.length === 0 || groundTruth.length === 0) return 0;

  const relevantIds = new Set(
    groundTruth.filter(e => e.relevance > 0).map(e => e.memoryId),
  );
  if (relevantIds.size === 0) return 0;

  const topResults = topK(results, k);
  // F-29 — Deduplicate relevant IDs in MAP calculation to prevent
  // MAP > 1.0 when duplicate memoryIds appear in results.
  const seenIds = new Set<number>();
  let hits = 0;
  let sumPrecision = 0;

  for (let i = 0; i < topResults.length; i++) {
    const memId = topResults[i].memoryId;
    if (relevantIds.has(memId) && !seenIds.has(memId)) {
      seenIds.add(memId);
      hits++;
      sumPrecision += hits / getRankAtIndex(topResults[i], i);
    }
  }

  return sumPrecision / relevantIds.size;
}

/**
 * Hit Rate at K (default K=1).
 *
 * Binary: is the top-K result relevant? Returns 1 if any of the top-K
 * results are relevant, 0 otherwise. Designed as Hit Rate@1 by default.
 *
 * @returns 0 or 1. Returns 0 for empty inputs.
 */
export function computeHitRate(
  results: EvalResult[],
  groundTruth: GroundTruthEntry[],
  k: number = 1,
): number {
  if (results.length === 0 || groundTruth.length === 0) return 0;

  const relevanceMap = buildRelevanceMap(groundTruth);
  const topResults = topK(results, k);

  for (const r of topResults) {
    if ((relevanceMap.get(r.memoryId) ?? 0) > 0) return 1;
  }

  return 0;
}

/* ───────────────────────────────────────────────────────────────
   4. DIAGNOSTIC METRICS
──────────────────────────────────────────────────────────────── */

/**
 * T006a: Inversion Rate.
 *
 * Counts pairwise ranking inversions versus ground truth relevance
 * ordering. A pair (i, j) is inverted when result at rank i has
 * lower relevance than result at rank j (i < j).
 *
 * Normalized by the total number of pairs so the result is in [0, 1].
 * Lower is better (0 = perfect ordering, 1 = fully inverted).
 *
 * @returns Value in [0, 1]. Returns 0 for fewer than 2 results.
 */
export function computeInversionRate(
  results: EvalResult[],
  groundTruth: GroundTruthEntry[],
): number {
  if (results.length < 2 || groundTruth.length === 0) return 0;

  const relevanceMap = buildRelevanceMap(groundTruth);
  const sorted = [...results].sort((a, b) => a.rank - b.rank);

  let inversions = 0;
  const n = sorted.length;
  const totalPairs = (n * (n - 1)) / 2;

  if (totalPairs === 0) return 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const relI = relevanceMap.get(sorted[i].memoryId) ?? 0;
      const relJ = relevanceMap.get(sorted[j].memoryId) ?? 0;
      // Rank[i] < rank[j], so if rel[i] < rel[j] it is an inversion
      if (relI < relJ) inversions++;
    }
  }

  return inversions / totalPairs;
}

/**
 * T006b: Constitutional Surfacing Rate.
 *
 * Percentage of queries where constitutional-tier memories appear
 * in the top-K results.
 *
 * Since this function operates on a single query's results, it returns
 * 1 if ANY constitutional memory appears in top-K, 0 otherwise.
 *
 * @param results          Retrieved results for the query.
 * @param constitutionalIds Memory IDs that are constitutional tier.
 * @param k                Top-K cutoff (default 5).
 * @returns 0 or 1. Returns 0 when constitutionalIds is empty.
 */
export function computeConstitutionalSurfacingRate(
  results: EvalResult[],
  constitutionalIds: number[],
  k: number = 5,
): number {
  if (results.length === 0 || constitutionalIds.length === 0) return 0;

  const constitutionalSet = new Set(constitutionalIds);
  const topResults = topK(results, k);

  for (const r of topResults) {
    if (constitutionalSet.has(r.memoryId)) return 1;
  }

  return 0;
}

/**
 * T006c: Importance-Weighted Recall.
 *
 * Recall@K but each relevant item is weighted by its tier:
 *   constitutional = 3x, critical = 2x, important = 1.5x, normal = 1x
 *
 * @param results      Retrieved results.
 * @param groundTruth  Ground truth with optional tier field.
 * @param tierWeights  Override default tier weights.
 * @param k            Top-K cutoff (default 20).
 * @returns Value in [0, 1]. Returns 0 when no relevant items exist.
 */
export function computeImportanceWeightedRecall(
  results: EvalResult[],
  groundTruth: GroundTruthEntry[],
  tierWeights: Record<string, number> = {},
  k: number = 20,
): number {
  if (results.length === 0 || groundTruth.length === 0) return 0;
  if (groundTruth.every(entry => entry.relevance <= 0)) return 0;

  const defaultWeights: Record<string, number> = {
    constitutional: 3,
    critical: 2,
    important: 1.5,
    normal: 1,
    temporary: 1,
    deprecated: 0,
  };
  const weights = { ...defaultWeights, ...tierWeights };

  const getWeight = (entry: GroundTruthEntry): number => {
    if (!entry.tier) return weights['normal'] ?? 1;
    return weights[entry.tier] ?? 1;
  };

  const relevantEntries = groundTruth.filter(e => e.relevance > 0);
  if (relevantEntries.length === 0) return 0;

  const totalWeight = relevantEntries.reduce((sum, e) => sum + getWeight(e), 0);
  if (totalWeight === 0) return 0;

  const gtMap = buildGroundTruthMap(groundTruth);
  const topResults = topK(results, k);

  let hitWeight = 0;
  const seenIds = new Set<number>();
  for (const r of topResults) {
    if (seenIds.has(r.memoryId)) continue;
    seenIds.add(r.memoryId);
    const entry = gtMap.get(r.memoryId);
    if (entry && entry.relevance > 0) {
      hitWeight += getWeight(entry);
    }
  }

  return Math.min(1, hitWeight / totalWeight);
}

/**
 * T006d: Cold-Start Detection Rate.
 *
 * Percentage of queries where recently created memories (< cutoffHours
 * old at query time) surface in top-K when they are relevant.
 *
 * Returns 1 if at least one recent relevant memory appears in top-K,
 * 0 otherwise. Returns 0 when no recent relevant memories exist in
 * ground truth (metric is not applicable).
 *
 * @param results            Retrieved results.
 * @param groundTruth        Ground truth entries.
 * @param memoryTimestamps   Map from memoryId → creation Date.
 * @param cutoffHours        Age threshold in hours (default 48).
 * @returns 0 or 1. Returns 0 when no cold-start candidates exist.
 */
export function computeColdStartDetectionRate(
  results: EvalResult[],
  groundTruth: GroundTruthEntry[],
  memoryTimestamps: Record<number, Date>,
  cutoffHours: number = 48,
  k: number = 10,
  evaluatedAt?: number,
): number {
  if (results.length === 0 || groundTruth.length === 0) return 0;

  const cutoffMs = cutoffHours * 60 * 60 * 1000;
  const now = typeof evaluatedAt === 'number' && Number.isFinite(evaluatedAt)
    ? evaluatedAt
    : Date.now();

  // Identify recent relevant memory IDs
  const recentRelevantIds = new Set<number>();
  for (const entry of groundTruth) {
    if (entry.relevance <= 0) continue;
    const ts = memoryTimestamps[entry.memoryId];
    if (!ts) continue;
    const ageMs = now - ts.getTime();
    if (ageMs <= cutoffMs) {
      recentRelevantIds.add(entry.memoryId);
    }
  }

  // No cold-start candidates → metric not applicable → return 0
  if (recentRelevantIds.size === 0) return 0;

  // Check if any recent relevant memory appears in top-K results
  const topResults = topK(results, k);
  for (const r of topResults) {
    if (recentRelevantIds.has(r.memoryId)) return 1;
  }

  return 0;
}

/**
 * T006e: Intent-Weighted NDCG.
 *
 * NDCG@K but relevance grades are scaled by intent-type-specific
 * multipliers. Different intent types weight relevance differently:
 *
 *   add_feature     — boosts highly relevant (3x) over partial (1x)
 *   fix_bug         — heavily boosts highly relevant (4x), penalizes partial
 *   refactor        — balanced, slight boost for high relevance
 *   security_audit  — maximum boost for highly relevant (5x), zero for partial
 *   understand      — progressive, rewards all grades
 *   find_spec       — rewards exact matches heavily (3x), moderate partial
 *   find_decision   — similar to find_spec with slight differentiation
 *
 * The intent multiplier is applied to relevance before NDCG calculation.
 * Final score is still normalized to [0, 1].
 *
 * @param results     Retrieved results.
 * @param groundTruth Ground truth entries.
 * @param intentType  One of the 7 known intent types.
 * @param k           Top-K cutoff (default 10).
 * @returns Value in [0, 1]. Returns 0 for empty inputs.
 */
export function computeIntentWeightedNDCG(
  results: EvalResult[],
  groundTruth: GroundTruthEntry[],
  intentType: string,
  k: number = 10,
): number {
  if (results.length === 0 || groundTruth.length === 0) return 0;

  // Intent-specific relevance grade multipliers: [grade0, grade1, grade2, grade3]
  // Index = relevance grade (0-3)
  const intentMultipliers: Record<string, number[]> = {
    add_feature:    [0, 1.0, 2.0, 3.0],
    fix_bug:        [0, 0.5, 2.0, 4.0],
    refactor:       [0, 1.0, 1.5, 2.5],
    security_audit: [0, 0.0, 2.0, 5.0],
    understand:     [0, 1.0, 2.0, 3.0],
    find_spec:      [0, 1.5, 2.0, 3.0],
    find_decision:  [0, 1.2, 2.0, 3.2],
  };

  const multipliers = intentMultipliers[intentType] ?? [0, 1.0, 2.0, 3.0];

  // P1-7 fix: Multiplier values ARE the weighted grades (not factors to multiply
  // Against the original grade). Using them directly prevents extreme scaling
  // (e.g., grade 3 * 5.0 = 15). Safety cap at MAX_WEIGHTED_GRADE = 5.
  const MAX_WEIGHTED_GRADE = 5;
  const weightedGT: GroundTruthEntry[] = groundTruth.map(e => ({
    ...e,
    relevance: Math.min(multipliers[e.relevance] ?? e.relevance, MAX_WEIGHTED_GRADE),
  }));

  return computeNDCG(results, weightedGT, k);
}

/* ───────────────────────────────────────────────────────────────
   5. CONVENIENCE: COMPUTE ALL METRICS
──────────────────────────────────────────────────────────────── */

/**
 * Compute all 12 metrics (7 core + 5 diagnostic) in one call.
 *
 * @param params.results             Retrieved results for the query.
 * @param params.groundTruth         Ground truth relevance judgments.
 * @param params.constitutionalIds   Memory IDs that are constitutional tier.
 * @param params.memoryTimestamps    Map from memoryId → creation Date.
 * @param params.intentType          Intent type for intent-weighted NDCG.
 * @param params.evaluatedAt         Optional query-time timestamp for cold-start checks.
 * @returns Record mapping metric name to computed value in [0, 1].
 */
export function computeAllMetrics(params: {
  results: EvalResult[];
  groundTruth: GroundTruthEntry[];
  constitutionalIds?: number[];
  memoryTimestamps?: Record<number, Date>;
  intentType?: string;
  evaluatedAt?: number;
}): AllMetrics {
  const {
    results,
    groundTruth,
    constitutionalIds = [],
    memoryTimestamps = {},
    intentType = 'understand',
    evaluatedAt,
  } = params;

  return {
    mrr: computeMRR(results, groundTruth),
    ndcg: computeNDCG(results, groundTruth),
    recall: computeRecall(results, groundTruth),
    precision: computePrecision(results, groundTruth),
    f1: computeF1(results, groundTruth),
    map: computeMAP(results, groundTruth),
    hitRate: computeHitRate(results, groundTruth),
    inversionRate: computeInversionRate(results, groundTruth),
    constitutionalSurfacingRate: computeConstitutionalSurfacingRate(results, constitutionalIds),
    importanceWeightedRecall: computeImportanceWeightedRecall(results, groundTruth),
    coldStartDetectionRate: computeColdStartDetectionRate(results, groundTruth, memoryTimestamps, 48, 10, evaluatedAt),
    intentWeightedNdcg: computeIntentWeightedNDCG(results, groundTruth, intentType),
  };
}
