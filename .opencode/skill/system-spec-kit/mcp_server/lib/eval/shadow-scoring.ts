// ───────────────────────────────────────────────────────────────
// MODULE: Shadow Scoring
// ───────────────────────────────────────────────────────────────
// Runs a parallel scoring path alongside production results WITHOUT affecting
// Production output. Logs both production and shadow scores for A/B comparison.
//
// Features:
// - Run alternative scoring algorithms in shadow mode
// - Compare shadow vs production results
// - Log comparison data to eval database
// - Comparison summaries for production vs shadow output
//
// CRITICAL: Shadow scoring must NEVER affect production search results.
// Every public function is wrapped in try-catch. The legacy compatibility flag
// SPECKIT_SHADOW_SCORING is retained for tests/docs, but the write path remains disabled.
import { initEvalDb, getEvalDb } from './eval-db.js';

// Feature catalog: Shadow scoring

/* --- 1. ENV VAR GATE --- */

/* --- 2. TYPES --- */

/** A single scored result from either production or shadow path. */
export interface ScoredResult {
  /** Memory ID. */
  memoryId: number;
  /** Score assigned by the scoring algorithm. */
  score: number;
  /** 1-based rank position. */
  rank: number;
}

/**
 * Configuration for shadow scoring.
 * The shadowScoringFn receives the query and production results and
 * must return an alternate scored/ranked result list.
 */
export interface ShadowConfig {
  /** Human-readable name for this shadow algorithm (e.g. "rrf-v2", "weighted-bm25"). */
  algorithmName: string;
  /**
   * The alternative scoring function to run in shadow mode.
   * Receives the raw query and a copy of production results (read-only).
   * Must return a new array of ScoredResult — must NOT mutate the input.
   */
  shadowScoringFn: (query: string, productionResults: ScoredResult[]) => ScoredResult[] | Promise<ScoredResult[]>;
  /** Optional metadata to attach to comparison logs. */
  metadata?: Record<string, unknown>;
}

/** Per-result comparison between production and shadow scores. */
export interface ResultDelta {
  memoryId: number;
  productionScore: number;
  productionRank: number;
  shadowScore: number;
  shadowRank: number;
  /** shadow score - production score */
  scoreDelta: number;
  /** shadow rank - production rank (negative = promoted in shadow) */
  rankDelta: number;
}

/** Comparison metrics between production and shadow scoring. */
export interface ShadowComparison {
  /** ISO timestamp of the comparison. */
  timestamp: string;
  /** The query that was scored. */
  query: string;
  /** Name of the shadow algorithm. */
  algorithmName: string;
  /** Per-result deltas. */
  deltas: ResultDelta[];
  /** Summary statistics. */
  summary: ShadowComparisonSummary;
  /** Optional metadata. */
  metadata?: Record<string, unknown>;
}

/** Summary statistics for a shadow comparison. */
export interface ShadowComparisonSummary {
  /** Number of results in production. */
  productionCount: number;
  /** Number of results in shadow. */
  shadowCount: number;
  /** Number of results that appear in both. */
  overlapCount: number;
  /** Mean absolute score delta across overlapping results. */
  meanAbsScoreDelta: number;
  /** Mean absolute rank delta across overlapping results. */
  meanAbsRankDelta: number;
  /** Kendall tau-like rank correlation (1 = same order, -1 = reversed). */
  rankCorrelation: number;
  /** IDs only in production (not in shadow). */
  productionOnlyIds: number[];
  /** IDs only in shadow (not in production). */
  shadowOnlyIds: number[];
}

/** Aggregated shadow scoring statistics over a time range. */
export interface ShadowStats {
  /** Total number of shadow comparisons logged. */
  totalComparisons: number;
  /** Distinct algorithm names used. */
  algorithms: string[];
  /** Average rank correlation across all comparisons. */
  avgRankCorrelation: number;
  /** Average mean absolute score delta. */
  avgMeanAbsScoreDelta: number;
  /** Average overlap count. */
  avgOverlapCount: number;
  /** Time range of the data. */
  timeRange: { earliest: string; latest: string };
}

/* --- 3. SCHEMA DDL --- */

const SHADOW_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS eval_shadow_comparisons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    query TEXT NOT NULL,
    algorithm_name TEXT NOT NULL,
    production_count INTEGER NOT NULL DEFAULT 0,
    shadow_count INTEGER NOT NULL DEFAULT 0,
    overlap_count INTEGER NOT NULL DEFAULT 0,
    mean_abs_score_delta REAL NOT NULL DEFAULT 0,
    mean_abs_rank_delta REAL NOT NULL DEFAULT 0,
    rank_correlation REAL NOT NULL DEFAULT 0,
    deltas_json TEXT,
    metadata_json TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`;

/* --- 4. INTERNAL HELPERS --- */

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
 * Ensure the shadow comparisons table exists.
 * Idempotent — safe to call multiple times.
 */
function ensureShadowSchema(): void {
  try {
    const db = getDb();
    db.exec(SHADOW_SCHEMA_SQL);
  } catch {
    // Non-fatal — logging should never break production
  }
}

/**
 * Reset hook retained for test compatibility.
 */
export function _resetSchemaFlag(): void {
  // No-op: schema creation is now idempotently attempted on every access.
}

/**
 * Build a map from memoryId to ScoredResult for fast lookup.
 */
function buildResultMap(results: ScoredResult[]): Map<number, ScoredResult> {
  const map = new Map<number, ScoredResult>();
  for (const r of results) {
    map.set(r.memoryId, r);
  }
  return map;
}

/**
 * Compute Kendall tau-like rank correlation between two ranked lists.
 * Returns a value in [-1, 1]:
 *   1  = identical ordering
 *   0  = no correlation
 *  -1  = fully inverted
 *
 * Only considers overlapping results.
 */
function computeRankCorrelation(
  production: ScoredResult[],
  shadow: ScoredResult[],
): number {
  const shadowMap = buildResultMap(shadow);

  // Find overlapping IDs and their rank pairs
  const pairs: Array<{ prodRank: number; shadRank: number }> = [];
  for (const p of production) {
    const s = shadowMap.get(p.memoryId);
    if (s) {
      pairs.push({ prodRank: p.rank, shadRank: s.rank });
    }
  }

  const n = pairs.length;
  if (n < 2) return n === 1 ? 1 : 0;

  // Count concordant and discordant pairs
  let concordant = 0;
  let discordant = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const prodDiff = pairs[i].prodRank - pairs[j].prodRank;
      const shadDiff = pairs[i].shadRank - pairs[j].shadRank;
      const product = prodDiff * shadDiff;

      if (product > 0) concordant++;
      else if (product < 0) discordant++;
      // Ties are ignored (neither concordant nor discordant)
    }
  }

  const totalPairs = (n * (n - 1)) / 2;
  if (totalPairs === 0) return 0;

  return (concordant - discordant) / totalPairs;
}

/* --- 5. PUBLIC API --- */

/**
 * Run an alternative scoring algorithm in shadow mode alongside production results.
 *
 * Shadow scoring runtime is retired. The SPECKIT_SHADOW_SCORING flag is retained
 * for compatibility only, so this returns null without running the shadow function.
 *
 * CRITICAL: Shadow scoring must NEVER affect production search results.
 *
 * @param query - The search query.
 * @param productionResults - The production scoring results (will NOT be modified).
 * @param shadowConfig - Configuration including the shadow scoring function.
 * @returns ShadowComparison when enabled and successful, null when disabled or on error.
 * @deprecated Shadow scoring runtime is retired; this always returns null.
 */
export async function runShadowScoring(
  query: string,
  productionResults: ScoredResult[],
  shadowConfig: ShadowConfig,
): Promise<ShadowComparison | null> {
  void query;
  void productionResults;
  void shadowConfig;
  return null;
}

/**
 * Compute comparison metrics between production and shadow results.
 *
 * This comparison function is always available (not gated by SPECKIT_SHADOW_SCORING)
 * since it is a pure computation with no side effects.
 *
 * @param query - The original search query.
 * @param production - Production scored results.
 * @param shadow - Shadow scored results.
 * @param algorithmName - Name of the shadow algorithm.
 * @param metadata - Optional metadata.
 * @returns ShadowComparison with deltas and summary statistics.
 */
export function compareShadowResults(
  query: string,
  production: ScoredResult[],
  shadow: ScoredResult[],
  algorithmName: string,
  metadata?: Record<string, unknown>,
): ShadowComparison {
  try {
    return _compareShadowResultsImpl(query, production, shadow, algorithmName, metadata);
  } catch (err: unknown) {
    console.warn('[shadow-scoring] compareShadowResults failed (non-fatal):', err instanceof Error ? err.message : String(err));
    return {
      timestamp: new Date().toISOString(),
      query,
      algorithmName,
      deltas: [],
      summary: { productionCount: production.length, shadowCount: shadow.length, overlapCount: 0, meanAbsScoreDelta: 0, meanAbsRankDelta: 0, rankCorrelation: 0, productionOnlyIds: [], shadowOnlyIds: [] },
      metadata,
    };
  }
}

function _compareShadowResultsImpl(
  query: string,
  production: ScoredResult[],
  shadow: ScoredResult[],
  algorithmName: string,
  metadata?: Record<string, unknown>,
): ShadowComparison {
  const prodMap = buildResultMap(production);
  const shadowMap = buildResultMap(shadow);

  // Compute per-result deltas for overlapping results
  const deltas: ResultDelta[] = [];
  const prodIds = new Set(production.map(r => r.memoryId));
  const shadowIds = new Set(shadow.map(r => r.memoryId));

  for (const memoryId of prodIds) {
    const p = prodMap.get(memoryId);
    if (!p) continue;
    const s = shadowMap.get(memoryId);
    if (s) {
      const pScore = Number.isFinite(p.score) ? p.score : 0;
      const sScore = Number.isFinite(s.score) ? s.score : 0;
      const pRank = Number.isFinite(p.rank) ? p.rank : 0;
      const sRank = Number.isFinite(s.rank) ? s.rank : 0;
      deltas.push({
        memoryId,
        productionScore: pScore,
        productionRank: pRank,
        shadowScore: sScore,
        shadowRank: sRank,
        scoreDelta: sScore - pScore,
        rankDelta: sRank - pRank,
      });
    }
  }

  // IDs only in one path
  const productionOnlyIds = [...prodIds].filter(id => !shadowIds.has(id));
  const shadowOnlyIds = [...shadowIds].filter(id => !prodIds.has(id));

  // Summary statistics
  const overlapCount = deltas.length;
  const meanAbsScoreDelta = overlapCount > 0
    ? deltas.reduce((sum, d) => sum + Math.abs(d.scoreDelta), 0) / overlapCount
    : 0;
  const meanAbsRankDelta = overlapCount > 0
    ? deltas.reduce((sum, d) => sum + Math.abs(d.rankDelta), 0) / overlapCount
    : 0;

  const rankCorrelation = computeRankCorrelation(production, shadow);

  const summary: ShadowComparisonSummary = {
    productionCount: production.length,
    shadowCount: shadow.length,
    overlapCount,
    meanAbsScoreDelta,
    meanAbsRankDelta,
    rankCorrelation,
    productionOnlyIds,
    shadowOnlyIds,
  };

  return {
    timestamp: new Date().toISOString(),
    query,
    algorithmName,
    deltas,
    summary,
    metadata,
  };
}

/**
 * Persist a shadow comparison to the eval database.
 *
 * Shadow scoring runtime is retired. The SPECKIT_SHADOW_SCORING flag is retained
 * for compatibility only, so this returns false immediately without writing.
 *
 * @param comparison - The ShadowComparison to persist.
 * @returns true if persisted, false if disabled or on error.
 * @deprecated Shadow scoring persistence is retired; this always returns false.
 */
export function logShadowComparison(comparison: ShadowComparison): boolean {
  void comparison;
  return false;
}

/**
 * Retrieve aggregated shadow scoring statistics over an optional time range.
 *
 * The retired SPECKIT_SHADOW_SCORING flag no longer enables write paths, so the
 * zero-case object is returned unless historical rows already exist in the table.
 *
 * @param timeRange - Optional ISO timestamp bounds. Omit for all data.
 * @returns ShadowStats with aggregated metrics, or null on error.
 */
export function getShadowStats(
  timeRange?: { start?: string; end?: string },
): ShadowStats | null {
  try {
    ensureShadowSchema();
    const db = getDb();

    // Build WHERE clause based on time range
    const conditions: string[] = [];
    const params: string[] = [];

    if (timeRange?.start) {
      conditions.push('timestamp >= ?');
      params.push(timeRange.start);
    }
    if (timeRange?.end) {
      conditions.push('timestamp <= ?');
      params.push(timeRange.end);
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    // Aggregate query
    const stats = db.prepare(`
      SELECT
        COUNT(*) as total,
        AVG(rank_correlation) as avg_rank_corr,
        AVG(mean_abs_score_delta) as avg_score_delta,
        AVG(overlap_count) as avg_overlap,
        MIN(timestamp) as earliest,
        MAX(timestamp) as latest
      FROM eval_shadow_comparisons
      ${whereClause}
    `).get(...params) as {
      total: number;
      avg_rank_corr: number | null;
      avg_score_delta: number | null;
      avg_overlap: number | null;
      earliest: string | null;
      latest: string | null;
    } | undefined;

    if (!stats || stats.total === 0) {
      return {
        totalComparisons: 0,
        algorithms: [],
        avgRankCorrelation: 0,
        avgMeanAbsScoreDelta: 0,
        avgOverlapCount: 0,
        timeRange: { earliest: '', latest: '' },
      };
    }

    // Get distinct algorithm names
    const algRows = db.prepare(`
      SELECT DISTINCT algorithm_name
      FROM eval_shadow_comparisons
      ${whereClause}
      ORDER BY algorithm_name
    `).all(...params) as Array<{ algorithm_name: string }>;

    return {
      totalComparisons: stats.total,
      algorithms: algRows.map(r => r.algorithm_name),
      avgRankCorrelation: stats.avg_rank_corr ?? 0,
      avgMeanAbsScoreDelta: stats.avg_score_delta ?? 0,
      avgOverlapCount: stats.avg_overlap ?? 0,
      timeRange: {
        earliest: stats.earliest ?? '',
        latest: stats.latest ?? '',
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[shadow-scoring] getShadowStats failed (non-fatal):', msg);
    return null;
  }
}
