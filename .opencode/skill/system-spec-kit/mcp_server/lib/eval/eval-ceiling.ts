// ---------------------------------------------------------------
// MODULE: Eval Ceiling (T006f)
// Full-Context Ceiling Evaluation — computes the theoretical
// maximum MRR@5 assuming access to ALL memory content and
// perfect ranking ability. Pure functions, no DB writes,
// no side effects (except optional async scorer).
// ---------------------------------------------------------------

import { GroundTruthEntry } from './eval-metrics';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

/** A memory record used for ceiling evaluation. */
export interface CeilingMemory {
  /** Unique memory identifier. */
  id: number;
  /** Display title used by the scorer. */
  title: string;
  /** Optional summary snippet. */
  summary?: string;
  /** Optional spec folder for grouping. */
  specFolder?: string;
}

/** A query record used for ceiling evaluation. */
export interface CeilingQuery {
  /** Unique query identifier. Must match ids in groundTruth. */
  id: number;
  /** Query text. */
  query: string;
  /** Optional intent type (e.g. 'add_feature', 'fix_bug'). */
  intentType?: string;
}

/** Scored result produced by a scorer function. */
export interface ScoredMemory {
  /** Memory identifier. */
  memoryId: number;
  /** Score assigned by the scorer (higher = more relevant). */
  score: number;
}

/**
 * Options for ceiling evaluation.
 * scorer is optional — when omitted, computeCeilingFromGroundTruth
 * uses ground truth relevance directly (no LLM required).
 */
export interface CeilingEvalOptions {
  /** Queries to evaluate. */
  queries: CeilingQuery[];
  /** All memories available to the ceiling scorer. */
  memories: CeilingMemory[];
  /**
   * Ground truth relevance labels.
   * relevance: 0=not relevant, 1=partial, 2=relevant, 3=highly relevant
   */
  groundTruth: GroundTruthEntry[];
  /**
   * Optional async scorer. When omitted, ground truth relevance is used
   * as the score directly (ideal for offline / unit-test scenarios).
   *
   * Receives the query text and the full memory list; returns scored
   * memories in any order (highest score = most relevant).
   */
  scorer?: (
    query: string,
    memories: CeilingMemory[],
  ) => Promise<ScoredMemory[]>;
  /** Top-K cutoff for MRR calculation (default 5). */
  k?: number;
  /**
   * Current system MRR@K. When provided, the gap (ceilingMRR −
   * systemMRR) is computed and included in the result.
   */
  systemMRR?: number;
}

/** Per-query ceiling result. */
export interface PerQueryCeiling {
  /** Identifier of the query. */
  queryId: number;
  /** 1-based rank of the first relevant result in the ceiling ordering. */
  ceilingRank: number;
  /** 1 / ceilingRank, or 0 when no relevant result found. */
  reciprocalRank: number;
}

/** Ceiling evaluation result. */
export interface CeilingResult {
  /** Best possible MRR@K using ground truth ordering. */
  ceilingMRR: number;
  /** Current system MRR@K — present only when provided by caller. */
  systemMRR?: number;
  /**
   * Improvement potential: ceilingMRR − systemMRR.
   * When systemMRR is undefined, gap equals ceilingMRR.
   */
  gap: number;
  /** Per-query breakdown. */
  perQueryCeiling: PerQueryCeiling[];
  /** Human-readable interpretation of the ceiling result. */
  interpretation: string;
}

/** Result of the 2x2 ceiling-vs-baseline analysis. */
export interface CeilingVsBaselineResult {
  /** One of 4 quadrant labels. */
  quadrant:
    | 'high-ceiling-low-baseline'
    | 'high-ceiling-high-baseline'
    | 'low-ceiling-low-baseline'
    | 'low-ceiling-high-baseline';
  /** Short label for the quadrant. */
  interpretation: string;
  /** Actionable recommendation. */
  recommendation: string;
}

/* ---------------------------------------------------------------
   2. CONSTANTS
--------------------------------------------------------------- */

/** MRR threshold separating "high" from "low" performance. */
const HIGH_MRR_THRESHOLD = 0.6;

/* ---------------------------------------------------------------
   3. INTERNAL HELPERS
--------------------------------------------------------------- */

/**
 * Group ground truth entries by queryId for O(1) access.
 */
function buildQueryGroundTruthMap(
  groundTruth: GroundTruthEntry[],
): Map<number, GroundTruthEntry[]> {
  const map = new Map<number, GroundTruthEntry[]>();
  for (const entry of groundTruth) {
    const list = map.get(entry.queryId) ?? [];
    list.push(entry);
    map.set(entry.queryId, list);
  }
  return map;
}

/**
 * Compute per-query ceiling using a pre-sorted array of (memoryId, score)
 * pairs. Returns the reciprocal rank of the first relevant result
 * within the top-K positions.
 */
function computePerQueryCeiling(
  queryId: number,
  rankedMemoryIds: number[],
  relevanceMap: Map<number, number>,
  k: number,
): PerQueryCeiling {
  const limit = Math.min(k, rankedMemoryIds.length);
  for (let i = 0; i < limit; i++) {
    const rel = relevanceMap.get(rankedMemoryIds[i]) ?? 0;
    if (rel > 0) {
      const rank = i + 1; // 1-based
      return { queryId, ceilingRank: rank, reciprocalRank: 1 / rank };
    }
  }
  // No relevant result in top-K
  return { queryId, ceilingRank: k + 1, reciprocalRank: 0 };
}

/* ---------------------------------------------------------------
   4. CORE: computeCeilingFromGroundTruth
--------------------------------------------------------------- */

/**
 * Compute ceiling MRR using ground truth relevance as the score
 * (no LLM required). The "scorer" is effectively the relevance label
 * itself — memories are ranked from most to least relevant.
 *
 * This gives the theoretical maximum MRR achievable if the system
 * could perfectly sort all memories by ground truth relevance.
 *
 * @returns CeilingResult with ceilingMRR, gap, per-query details,
 *          and a human-readable interpretation.
 */
export function computeCeilingFromGroundTruth(
  options: CeilingEvalOptions,
): CeilingResult {
  const { queries, groundTruth, k = 5 } = options;

  // AI-GUARD: Guard: empty inputs
  if (queries.length === 0 || groundTruth.length === 0) {
    return {
      ceilingMRR: 0,
      systemMRR: options.systemMRR,
      gap: options.systemMRR !== undefined ? 0 - options.systemMRR : 0,
      perQueryCeiling: [],
      interpretation: 'No data: queries or ground truth is empty.',
    };
  }

  const gtByQuery = buildQueryGroundTruthMap(groundTruth);
  const perQueryCeiling: PerQueryCeiling[] = [];
  let reciprocalRankSum = 0;

  for (const query of queries) {
    const queryGT = gtByQuery.get(query.id) ?? [];

    // Build relevance map for this query: memoryId → relevance
    const relevanceMap = new Map<number, number>();
    for (const entry of queryGT) {
      relevanceMap.set(entry.memoryId, entry.relevance);
    }

    // Ideal ranking: sort all known memories by relevance desc
    // (only those appearing in the query's ground truth)
    const rankedMemoryIds = [...relevanceMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);

    const perQuery = computePerQueryCeiling(
      query.id,
      rankedMemoryIds,
      relevanceMap,
      k,
    );
    perQueryCeiling.push(perQuery);
    reciprocalRankSum += perQuery.reciprocalRank;
  }

  const ceilingMRR =
    queries.length > 0 ? reciprocalRankSum / queries.length : 0;

  const systemMRR = options.systemMRR;
  const gap =
    systemMRR !== undefined ? ceilingMRR - systemMRR : ceilingMRR;

  const interpretation = buildCeilingInterpretation(ceilingMRR, systemMRR);

  return {
    ceilingMRR,
    ...(systemMRR !== undefined ? { systemMRR } : {}),
    gap,
    perQueryCeiling,
    interpretation,
  };
}

/* ---------------------------------------------------------------
   5. ASYNC: computeCeilingWithScorer
--------------------------------------------------------------- */

/**
 * Compute ceiling MRR using a pluggable async scorer (e.g. LLM-based).
 * The scorer receives all memories and must return a scored list;
 * this function sorts by score desc and computes MRR@K.
 *
 * Falls back to computeCeilingFromGroundTruth when options.scorer
 * is not provided.
 */
export async function computeCeilingWithScorer(
  options: CeilingEvalOptions,
): Promise<CeilingResult> {
  if (!options.scorer) {
    return computeCeilingFromGroundTruth(options);
  }

  const { queries, memories, groundTruth, scorer, k = 5 } = options;

  if (queries.length === 0 || groundTruth.length === 0) {
    return {
      ceilingMRR: 0,
      systemMRR: options.systemMRR,
      gap: options.systemMRR !== undefined ? 0 - options.systemMRR : 0,
      perQueryCeiling: [],
      interpretation: 'No data: queries or ground truth is empty.',
    };
  }

  const gtByQuery = buildQueryGroundTruthMap(groundTruth);
  const perQueryCeiling: PerQueryCeiling[] = [];
  let reciprocalRankSum = 0;

  for (const query of queries) {
    const queryGT = gtByQuery.get(query.id) ?? [];
    const relevanceMap = new Map<number, number>();
    for (const entry of queryGT) {
      relevanceMap.set(entry.memoryId, entry.relevance);
    }

    // Ask the scorer to rank all memories for this query
    const scoredList = await scorer(query.query, memories);

    // Sort by score desc → extract memoryIds
    const rankedMemoryIds = [...scoredList]
      .sort((a, b) => b.score - a.score)
      .map(s => s.memoryId);

    const perQuery = computePerQueryCeiling(
      query.id,
      rankedMemoryIds,
      relevanceMap,
      k,
    );
    perQueryCeiling.push(perQuery);
    reciprocalRankSum += perQuery.reciprocalRank;
  }

  const ceilingMRR =
    queries.length > 0 ? reciprocalRankSum / queries.length : 0;

  const systemMRR = options.systemMRR;
  const gap =
    systemMRR !== undefined ? ceilingMRR - systemMRR : ceilingMRR;

  return {
    ceilingMRR,
    ...(systemMRR !== undefined ? { systemMRR } : {}),
    gap,
    perQueryCeiling,
    interpretation: buildCeilingInterpretation(ceilingMRR, systemMRR),
  };
}

/* ---------------------------------------------------------------
   6. 2x2 MATRIX: interpretCeilingVsBaseline
--------------------------------------------------------------- */

/**
 * Classify ceiling and baseline MRR into one of four quadrants
 * and return an interpretation with an actionable recommendation.
 *
 * Thresholds: high = MRR ≥ 0.6, low = MRR < 0.6.
 *
 * Quadrant matrix:
 *
 *   | Ceiling \ Baseline | Low                 | High               |
 *   |--------------------|---------------------|--------------------|
 *   | High               | High improvement    | Performing well    |
 *   | Low                | Data quality issue  | Near optimal       |
 */
export function interpretCeilingVsBaseline(
  ceilingMRR: number,
  baselineMRR: number,
): CeilingVsBaselineResult {
  const highCeiling = ceilingMRR >= HIGH_MRR_THRESHOLD;
  const highBaseline = baselineMRR >= HIGH_MRR_THRESHOLD;

  if (highCeiling && !highBaseline) {
    return {
      quadrant: 'high-ceiling-low-baseline',
      interpretation: 'High improvement potential — system is under-performing relative to data quality',
      recommendation:
        'Focus on retrieval algorithm improvements: better fusion weights, reranking, or query expansion. The data is rich enough to support higher performance.',
    };
  }

  if (highCeiling && highBaseline) {
    return {
      quadrant: 'high-ceiling-high-baseline',
      interpretation: 'System is performing well — focus on diminishing returns',
      recommendation:
        'System is near its practical ceiling. Improvements will yield smaller gains. Consider expanding the ground truth corpus or focusing on latency/cost optimisation.',
    };
  }

  if (!highCeiling && !highBaseline) {
    return {
      quadrant: 'low-ceiling-low-baseline',
      interpretation: 'Data quality issue — improve memory content before algorithm changes',
      recommendation:
        'The theoretical ceiling is low, meaning even a perfect ranker cannot achieve good MRR. Prioritise improving memory titles, summaries, and ground truth coverage before tuning the retrieval algorithm.',
    };
  }

  // !highCeiling && highBaseline
  return {
    quadrant: 'low-ceiling-high-baseline',
    interpretation: 'Near optimal — system is close to data quality ceiling',
    recommendation:
      'The system is performing near the theoretical maximum given current memory quality. To improve further, enrich memory content (titles, summaries) and expand ground truth annotations.',
  };
}

/* ---------------------------------------------------------------
   7. INTERNAL: interpretation builder
--------------------------------------------------------------- */

/**
 * Build a human-readable interpretation string for a ceiling result.
 */
function buildCeilingInterpretation(
  ceilingMRR: number,
  systemMRR?: number,
): string {
  const ceilingLabel = ceilingMRR >= HIGH_MRR_THRESHOLD ? 'high' : 'low';

  if (systemMRR === undefined) {
    return `Ceiling MRR@5 = ${ceilingMRR.toFixed(3)} (${ceilingLabel}). Provide systemMRR to compute the improvement gap.`;
  }

  const gap = ceilingMRR - systemMRR;
  const systemLabel = systemMRR >= HIGH_MRR_THRESHOLD ? 'high' : 'low';
  const { interpretation } = interpretCeilingVsBaseline(ceilingMRR, systemMRR);

  return (
    `Ceiling MRR@5 = ${ceilingMRR.toFixed(3)} (${ceilingLabel}), ` +
    `System MRR@5 = ${systemMRR.toFixed(3)} (${systemLabel}), ` +
    `Gap = ${gap.toFixed(3)}. ${interpretation}.`
  );
}

