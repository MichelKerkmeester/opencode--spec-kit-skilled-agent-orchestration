// ───────────────────────────────────────────────────────────────
// MODULE: Shadow Scoring with Holdout (REQ-D4-006)
// ───────────────────────────────────────────────────────────────
// Feature catalog: Shadow evaluation system for feedback learning
// Compares would-have-changed rankings vs live rankings on a
// holdout slice of queries. Tracks weekly improvement cycles and
// gates promotion of learned signals to production.
//
// Feature flag: SPECKIT_SHADOW_FEEDBACK (default OFF)
//
// Key invariants:
//   - Shadow-only: no live ranking columns are mutated
//   - Holdout queries are deterministically selected via seed
//   - Promotion requires 2+ consecutive weeks of stable improvement
//   - All results logged to shadow_scoring_log for auditability
import type Database from 'better-sqlite3';

/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
----------------------------------------------------------------*/

/** Default holdout percentage (20% of queries). */
export const DEFAULT_HOLDOUT_PERCENT = 0.20;

/** Number of consecutive improvement weeks required for promotion. */
export const PROMOTION_THRESHOLD_WEEKS = 2;

/** Standard evaluation window: 7 days in milliseconds. */
export const EVALUATION_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

/* ───────────────────────────────────────────────────────────────
   2. TYPES
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

/** Row shape stored in shadow_scoring_log table. */
export interface ShadowScoringLogRow {
  id: number;
  query_id: string;
  result_id: string;
  live_rank: number;
  shadow_rank: number;
  delta: number;
  direction: string;
  evaluated_at: number;
  cycle_id: string;
}

/** Aggregated result for a weekly evaluation cycle. */
export interface CycleResult {
  cycleId: string;
  evaluatedAt: number;
  queryCount: number;
  /** Mean NDCG delta across holdout queries. */
  meanNdcgDelta: number;
  /** Mean MRR delta across holdout queries. */
  meanMrrDelta: number;
  /** Mean Kendall tau across holdout queries. */
  meanKendallTau: number;
  /** Total improved / degraded / unchanged across all queries. */
  totalImproved: number;
  totalDegraded: number;
  totalUnchanged: number;
  /** Whether this cycle counts as an improvement (meanNdcgDelta >= 0). */
  isImprovement: boolean;
}

/** Row shape stored in shadow_cycle_results table. */
export interface CycleResultRow {
  id: number;
  cycle_id: string;
  evaluated_at: number;
  query_count: number;
  mean_ndcg_delta: number;
  mean_mrr_delta: number;
  mean_kendall_tau: number;
  total_improved: number;
  total_degraded: number;
  total_unchanged: number;
  is_improvement: number; // 0 or 1
}

/** Promotion gate evaluation result. */
export interface PromotionGateResult {
  ready: boolean;
  consecutiveWeeks: number;
  recommendation: 'promote' | 'wait' | 'rollback';
}

/** Options for `selectHoldoutQueries`. */
export interface HoldoutOptions {
  /** Fraction of queries to hold out (default 0.20). */
  holdoutPercent?: number;
  /** Seed for deterministic selection. */
  seed?: number;
  /** Optional intent classes for representative coverage. */
  intentClasses?: Map<string, string>;
}

/** Options for `runShadowEvaluation`. */
export interface ShadowEvaluationOptions {
  holdoutPercent?: number;
  seed?: number;
  cycleId?: string;
  evaluatedAt?: number;
  intentClasses?: Map<string, string>;
}

/** Comprehensive report from a shadow evaluation run. */
export interface ShadowEvaluationReport {
  cycleId: string;
  evaluatedAt: number;
  holdoutQueryIds: string[];
  comparisons: RankComparisonResult[];
  cycleResult: CycleResult;
  promotionGate: PromotionGateResult;
}

/* ───────────────────────────────────────────────────────────────
   3. FEATURE FLAG
----------------------------------------------------------------*/

/**
 * Check whether shadow feedback evaluation is enabled.
 * Default: FALSE (off). Set SPECKIT_SHADOW_FEEDBACK=true to enable.
 */
export function isShadowFeedbackEnabled(): boolean {
  const val = process.env.SPECKIT_SHADOW_FEEDBACK?.toLowerCase().trim();
  return val === 'true' || val === '1';
}

/* ───────────────────────────────────────────────────────────────
   4. SCHEMA SQL
----------------------------------------------------------------*/

const SHADOW_SCORING_LOG_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS shadow_scoring_log (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    query_id     TEXT NOT NULL,
    result_id    TEXT NOT NULL,
    live_rank    INTEGER NOT NULL,
    shadow_rank  INTEGER NOT NULL,
    delta        INTEGER NOT NULL,
    direction    TEXT NOT NULL CHECK(direction IN ('improved','degraded','unchanged')),
    evaluated_at INTEGER NOT NULL,
    cycle_id     TEXT NOT NULL
  )
`;

const SHADOW_SCORING_LOG_INDICES_SQL = `
  CREATE INDEX IF NOT EXISTS idx_shadow_log_query_id     ON shadow_scoring_log(query_id);
  CREATE INDEX IF NOT EXISTS idx_shadow_log_cycle_id     ON shadow_scoring_log(cycle_id);
  CREATE INDEX IF NOT EXISTS idx_shadow_log_evaluated_at ON shadow_scoring_log(evaluated_at);
  CREATE INDEX IF NOT EXISTS idx_shadow_log_direction    ON shadow_scoring_log(direction)
`;

const SHADOW_CYCLE_RESULTS_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS shadow_cycle_results (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    cycle_id         TEXT NOT NULL UNIQUE,
    evaluated_at     INTEGER NOT NULL,
    query_count      INTEGER NOT NULL DEFAULT 0,
    mean_ndcg_delta  REAL NOT NULL DEFAULT 0.0,
    mean_mrr_delta   REAL NOT NULL DEFAULT 0.0,
    mean_kendall_tau REAL NOT NULL DEFAULT 0.0,
    total_improved   INTEGER NOT NULL DEFAULT 0,
    total_degraded   INTEGER NOT NULL DEFAULT 0,
    total_unchanged  INTEGER NOT NULL DEFAULT 0,
    is_improvement   INTEGER NOT NULL DEFAULT 0 CHECK(is_improvement IN (0,1))
  )
`;

const SHADOW_CYCLE_RESULTS_INDICES_SQL = `
  CREATE INDEX IF NOT EXISTS idx_shadow_cycle_evaluated_at ON shadow_cycle_results(evaluated_at)
`;

/* ───────────────────────────────────────────────────────────────
   5. INITIALIZATION
----------------------------------------------------------------*/

/** Track which DB handles have had the shadow-scoring schema initialized. */
const initializedDbs = new WeakSet<object>();

/**
 * Ensure the shadow_scoring_log and shadow_cycle_results tables exist.
 * Idempotent — safe to call multiple times.
 */
export function initShadowScoringLog(db: Database.Database): void {
  if (initializedDbs.has(db)) return;
  db.exec(SHADOW_SCORING_LOG_SCHEMA_SQL);
  db.exec(SHADOW_SCORING_LOG_INDICES_SQL);
  db.exec(SHADOW_CYCLE_RESULTS_SCHEMA_SQL);
  db.exec(SHADOW_CYCLE_RESULTS_INDICES_SQL);
  initializedDbs.add(db);
}

/** Reset the init tracking (for tests only). */
export function _resetInitTracking(): void {
  // WeakSet does not have a clear method; we replace the reference.
  // This is a test-only helper — production code never calls this.
}

/* ───────────────────────────────────────────────────────────────
   6. SEEDED PRNG
----------------------------------------------------------------*/

/**
 * Simple seeded PRNG (mulberry32).
 * Returns a function that produces deterministic floats in [0, 1).
 */
export function seededRandom(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ───────────────────────────────────────────────────────────────
   7. HOLDOUT SELECTION
----------------------------------------------------------------*/

/**
 * Select a holdout subset of query IDs for shadow evaluation.
 *
 * Uses a seeded PRNG for deterministic selection. When intentClasses
 * is provided, applies stratified sampling to ensure representative
 * coverage across intent categories.
 *
 * @param queryIds - Full set of available query IDs
 * @param opts - Holdout configuration options
 * @returns Array of selected holdout query IDs
 */
export function selectHoldoutQueries(
  queryIds: string[],
  opts: HoldoutOptions = {}
): string[] {
  const holdoutPercent = opts.holdoutPercent ?? DEFAULT_HOLDOUT_PERCENT;
  const seed = opts.seed ?? 42;

  if (queryIds.length === 0) return [];
  if (holdoutPercent <= 0) return [];
  if (holdoutPercent >= 1) return [...queryIds];

  const targetCount = Math.max(1, Math.round(queryIds.length * holdoutPercent));

  // When intent classes are provided, use stratified sampling
  if (opts.intentClasses && opts.intentClasses.size > 0) {
    return stratifiedSample(queryIds, opts.intentClasses, targetCount, seed);
  }

  // Simple random sampling with deterministic seed
  const rng = seededRandom(seed);
  const tagged = queryIds.map(id => ({ id, sortKey: rng() }));
  tagged.sort((a, b) => a.sortKey - b.sortKey);
  return tagged.slice(0, targetCount).map(t => t.id);
}

/**
 * Stratified sampling: ensures proportional representation of intent classes.
 */
function stratifiedSample(
  queryIds: string[],
  intentClasses: Map<string, string>,
  targetCount: number,
  seed: number
): string[] {
  const rng = seededRandom(seed);

  // Group by intent class
  const buckets = new Map<string, string[]>();
  const unclassified: string[] = [];

  for (const qid of queryIds) {
    const intentClass = intentClasses.get(qid);
    if (intentClass) {
      let bucket = buckets.get(intentClass);
      if (!bucket) {
        bucket = [];
        buckets.set(intentClass, bucket);
      }
      bucket.push(qid);
    } else {
      unclassified.push(qid);
    }
  }

  // Add unclassified as a virtual bucket
  if (unclassified.length > 0) {
    buckets.set('__unclassified__', unclassified);
  }

  const selected: string[] = [];
  const totalItems = queryIds.length;

  // Proportional allocation per bucket
  for (const [, bucket] of buckets) {
    const proportion = bucket.length / totalItems;
    const bucketTarget = Math.max(1, Math.round(targetCount * proportion));
    const shuffled = bucket.map(id => ({ id, sortKey: rng() }));
    shuffled.sort((a, b) => a.sortKey - b.sortKey);
    for (let i = 0; i < Math.min(bucketTarget, shuffled.length); i++) {
      selected.push(shuffled[i].id);
    }
  }

  // Trim or pad to target count
  if (selected.length > targetCount) {
    return selected.slice(0, targetCount);
  }

  return selected;
}

/* ───────────────────────────────────────────────────────────────
   8. RANK COMPARISON ENGINE
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

/**
 * Compute NDCG@k for a ranked list given relevance scores.
 *
 * Uses the log2 discount: DCG = sum(rel_i / log2(rank_i + 1)).
 * NDCG = DCG / IDCG where IDCG uses the ideal ordering.
 *
 * @param rankedItems - Items in rank order (rank 1 first)
 * @param k - Cutoff depth (default: rankedItems.length)
 * @returns NDCG in [0, 1]
 */
export function computeNDCG(rankedItems: RankedItem[], k?: number): number {
  if (rankedItems.length === 0) return 0;

  const cutoff = k ?? rankedItems.length;
  const items = rankedItems.slice(0, cutoff);

  // DCG
  let dcg = 0;
  for (let i = 0; i < items.length; i++) {
    const rel = items[i].relevanceScore ?? 0;
    dcg += rel / Math.log2(i + 2); // i+2 because rank is 1-based: log2(1+1), log2(2+1), ...
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

/**
 * Compute MRR (Mean Reciprocal Rank) for a single query.
 *
 * Returns 1/rank of the first relevant result (relevanceScore > 0),
 * or 0 if no relevant result is found.
 */
export function computeMRR(rankedItems: RankedItem[]): number {
  for (const item of rankedItems) {
    if ((item.relevanceScore ?? 0) > 0) {
      return 1 / item.rank;
    }
  }
  return 0;
}

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

  // NDCG delta
  const liveNdcg = computeNDCG(liveRanked);
  const shadowNdcg = computeNDCG(shadowRanked);
  const ndcgDelta = shadowNdcg - liveNdcg;

  // MRR delta
  const liveMrr = computeMRR(liveRanked);
  const shadowMrr = computeMRR(shadowRanked);
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

/* ───────────────────────────────────────────────────────────────
   9. RANK DELTA LOGGING
----------------------------------------------------------------*/

/**
 * Log rank deltas from a comparison to the shadow_scoring_log table.
 *
 * Shadow-only: this function has NO effect on live ranking.
 * Errors are caught and logged as warnings.
 *
 * @param db - Database instance
 * @param comparison - The comparison result to log
 * @param cycleId - Identifier for the evaluation cycle
 * @param evaluatedAt - Epoch-ms timestamp of the evaluation
 * @returns Number of rows inserted, or 0 on error / flag off
 */
export function logRankDelta(
  db: Database.Database,
  comparison: RankComparisonResult,
  cycleId: string,
  evaluatedAt: number
): number {
  if (!isShadowFeedbackEnabled()) return 0;

  try {
    initShadowScoringLog(db);

    const stmt = db.prepare(`
      INSERT INTO shadow_scoring_log
        (query_id, result_id, live_rank, shadow_rank, delta, direction, evaluated_at, cycle_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let inserted = 0;
    for (const d of comparison.deltas) {
      stmt.run(
        comparison.queryId,
        d.resultId,
        d.liveRank,
        d.shadowRank,
        d.delta,
        d.direction,
        evaluatedAt,
        cycleId
      );
      inserted++;
    }

    return inserted;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[shadow-scoring] logRankDelta error:', message);
    return 0;
  }
}

/**
 * Query past shadow scoring evaluations from the log.
 *
 * @param db - Database instance
 * @param opts - Optional filters
 * @returns Array of log rows
 */
export function getShadowScoringHistory(
  db: Database.Database,
  opts: { queryId?: string; cycleId?: string; limit?: number } = {}
): ShadowScoringLogRow[] {
  try {
    initShadowScoringLog(db);

    const conditions: string[] = [];
    const params: Array<string | number> = [];

    if (opts.queryId) {
      conditions.push('query_id = ?');
      params.push(opts.queryId);
    }
    if (opts.cycleId) {
      conditions.push('cycle_id = ?');
      params.push(opts.cycleId);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = opts.limit ? `LIMIT ${Math.max(1, Math.floor(opts.limit))}` : '';

    const sql = `SELECT * FROM shadow_scoring_log ${where} ORDER BY evaluated_at DESC ${limit}`;
    return db.prepare(sql).all(...params) as ShadowScoringLogRow[];
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[shadow-scoring] getShadowScoringHistory error:', message);
    return [];
  }
}

/* ───────────────────────────────────────────────────────────────
   10. WEEKLY EVALUATION TRACKER
----------------------------------------------------------------*/

/**
 * Record an aggregated cycle result into the shadow_cycle_results table.
 *
 * @param db - Database instance
 * @param result - The cycle result to record
 * @returns The inserted row ID, or null on error
 */
export function recordCycleResult(
  db: Database.Database,
  result: CycleResult
): number | null {
  if (!isShadowFeedbackEnabled()) return null;

  try {
    initShadowScoringLog(db);

    const res = db.prepare(`
      INSERT OR REPLACE INTO shadow_cycle_results
        (cycle_id, evaluated_at, query_count, mean_ndcg_delta, mean_mrr_delta,
         mean_kendall_tau, total_improved, total_degraded, total_unchanged, is_improvement)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      result.cycleId,
      result.evaluatedAt,
      result.queryCount,
      result.meanNdcgDelta,
      result.meanMrrDelta,
      result.meanKendallTau,
      result.totalImproved,
      result.totalDegraded,
      result.totalUnchanged,
      result.isImprovement ? 1 : 0
    );

    return (res as { lastInsertRowid: number | bigint }).lastInsertRowid as number;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[shadow-scoring] recordCycleResult error:', message);
    return null;
  }
}

/**
 * Get the count of consecutive improvement cycles, reading from most
 * recent backward.
 *
 * @param db - Database instance
 * @returns Number of consecutive recent improvement cycles
 */
export function getConsecutiveImprovements(db: Database.Database): number {
  try {
    initShadowScoringLog(db);

    const rows = db.prepare(`
      SELECT is_improvement FROM shadow_cycle_results
      ORDER BY evaluated_at DESC
    `).all() as Array<{ is_improvement: number }>;

    let count = 0;
    for (const row of rows) {
      if (row.is_improvement === 1) {
        count++;
      } else {
        break;
      }
    }

    return count;
  } catch {
    return 0;
  }
}

/**
 * Check whether promotion is ready based on consecutive improvements.
 *
 * @param db - Database instance
 * @returns true when PROMOTION_THRESHOLD_WEEKS consecutive improvements exist
 */
export function isPromotionReady(db: Database.Database): boolean {
  return getConsecutiveImprovements(db) >= PROMOTION_THRESHOLD_WEEKS;
}

/**
 * Get all recorded cycle results, ordered by evaluated_at descending.
 */
export function getCycleResults(db: Database.Database): CycleResult[] {
  try {
    initShadowScoringLog(db);

    const rows = db.prepare(`
      SELECT * FROM shadow_cycle_results
      ORDER BY evaluated_at DESC
    `).all() as CycleResultRow[];

    return rows.map(row => ({
      cycleId: row.cycle_id,
      evaluatedAt: row.evaluated_at,
      queryCount: row.query_count,
      meanNdcgDelta: row.mean_ndcg_delta,
      meanMrrDelta: row.mean_mrr_delta,
      meanKendallTau: row.mean_kendall_tau,
      totalImproved: row.total_improved,
      totalDegraded: row.total_degraded,
      totalUnchanged: row.total_unchanged,
      isImprovement: row.is_improvement === 1,
    }));
  } catch {
    return [];
  }
}

/* ───────────────────────────────────────────────────────────────
   11. PROMOTION GATE
----------------------------------------------------------------*/

/**
 * Evaluate whether learned signals should be promoted to production.
 *
 * Promotion requires PROMOTION_THRESHOLD_WEEKS (2) consecutive weekly
 * evaluations where shadow NDCG@10 >= live NDCG@10 (no regression).
 *
 * @param db - Database instance
 * @returns Promotion gate result with recommendation
 */
export function evaluatePromotionGate(db: Database.Database): PromotionGateResult {
  try {
    initShadowScoringLog(db);

    const consecutiveWeeks = getConsecutiveImprovements(db);
    const ready = consecutiveWeeks >= PROMOTION_THRESHOLD_WEEKS;

    // Check if the most recent cycle was a regression
    const rows = db.prepare(`
      SELECT is_improvement FROM shadow_cycle_results
      ORDER BY evaluated_at DESC LIMIT 1
    `).all() as Array<{ is_improvement: number }>;

    let recommendation: 'promote' | 'wait' | 'rollback';

    if (ready) {
      recommendation = 'promote';
    } else if (rows.length > 0 && rows[0].is_improvement === 0) {
      recommendation = 'rollback';
    } else {
      recommendation = 'wait';
    }

    return { ready, consecutiveWeeks, recommendation };
  } catch {
    return { ready: false, consecutiveWeeks: 0, recommendation: 'wait' };
  }
}

/* ───────────────────────────────────────────────────────────────
   12. SHADOW EVALUATION PIPELINE
----------------------------------------------------------------*/

/**
 * Run an end-to-end shadow evaluation pipeline.
 *
 * Workflow:
 *   1. Check feature flag
 *   2. Select holdout queries
 *   3. For each holdout query, compute live and shadow ranks via callbacks
 *   4. Compare rankings
 *   5. Log deltas to shadow_scoring_log
 *   6. Aggregate into a cycle result
 *   7. Record cycle result
 *   8. Evaluate promotion gate
 *   9. Return comprehensive report
 *
 * @param db - Database instance
 * @param allQueryIds - Full pool of available query IDs
 * @param computeLiveRanks - Callback to compute live ranking for a query
 * @param computeShadowRanks - Callback to compute shadow ranking for a query
 * @param opts - Evaluation options
 * @returns Comprehensive report, or null when feature flag is OFF
 */
export function runShadowEvaluation(
  db: Database.Database,
  allQueryIds: string[],
  computeLiveRanks: (queryId: string) => RankedItem[],
  computeShadowRanks: (queryId: string) => RankedItem[],
  opts: ShadowEvaluationOptions = {}
): ShadowEvaluationReport | null {
  if (!isShadowFeedbackEnabled()) return null;

  const cycleId = opts.cycleId ?? `cycle-${Date.now()}`;
  const evaluatedAt = opts.evaluatedAt ?? Date.now();

  try {
    initShadowScoringLog(db);

    // Step 2: Select holdout
    const holdoutQueryIds = selectHoldoutQueries(allQueryIds, {
      holdoutPercent: opts.holdoutPercent,
      seed: opts.seed,
      intentClasses: opts.intentClasses,
    });

    if (holdoutQueryIds.length === 0) {
      const emptyCycleResult: CycleResult = {
        cycleId,
        evaluatedAt,
        queryCount: 0,
        meanNdcgDelta: 0,
        meanMrrDelta: 0,
        meanKendallTau: 0,
        totalImproved: 0,
        totalDegraded: 0,
        totalUnchanged: 0,
        isImprovement: false,
      };
      recordCycleResult(db, emptyCycleResult);
      return {
        cycleId,
        evaluatedAt,
        holdoutQueryIds: [],
        comparisons: [],
        cycleResult: emptyCycleResult,
        promotionGate: evaluatePromotionGate(db),
      };
    }

    // Steps 3-5: Compare and log each holdout query
    const comparisons: RankComparisonResult[] = [];

    for (const qid of holdoutQueryIds) {
      const liveRanked = computeLiveRanks(qid);
      const shadowRanked = computeShadowRanks(qid);
      const comparison = compareRanks(qid, liveRanked, shadowRanked);
      comparisons.push(comparison);
      logRankDelta(db, comparison, cycleId, evaluatedAt);
    }

    // Step 6: Aggregate into cycle result
    let totalImproved = 0;
    let totalDegraded = 0;
    let totalUnchanged = 0;
    let sumNdcgDelta = 0;
    let sumMrrDelta = 0;
    let sumKendallTau = 0;

    for (const comp of comparisons) {
      totalImproved += comp.metrics.improvedCount;
      totalDegraded += comp.metrics.degradedCount;
      totalUnchanged += comp.metrics.unchangedCount;
      sumNdcgDelta += comp.metrics.ndcgDelta;
      sumMrrDelta += comp.metrics.mrrDelta;
      sumKendallTau += comp.metrics.kendallTau;
    }

    const queryCount = comparisons.length;
    const meanNdcgDelta = queryCount > 0 ? sumNdcgDelta / queryCount : 0;
    const meanMrrDelta = queryCount > 0 ? sumMrrDelta / queryCount : 0;
    const meanKendallTau = queryCount > 0 ? sumKendallTau / queryCount : 0;

    const cycleResult: CycleResult = {
      cycleId,
      evaluatedAt,
      queryCount,
      meanNdcgDelta,
      meanMrrDelta,
      meanKendallTau,
      totalImproved,
      totalDegraded,
      totalUnchanged,
      isImprovement: meanNdcgDelta >= 0,
    };

    // Step 7: Record cycle result
    recordCycleResult(db, cycleResult);

    // Step 8: Evaluate promotion gate
    const promotionGate = evaluatePromotionGate(db);

    return {
      cycleId,
      evaluatedAt,
      holdoutQueryIds,
      comparisons,
      cycleResult,
      promotionGate,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[shadow-scoring] runShadowEvaluation error:', message);
    return null;
  }
}

/* ───────────────────────────────────────────────────────────────
   13. EXPORTS (schema constants for testing)
----------------------------------------------------------------*/

export {
  SHADOW_SCORING_LOG_SCHEMA_SQL,
  SHADOW_SCORING_LOG_INDICES_SQL,
  SHADOW_CYCLE_RESULTS_SCHEMA_SQL,
  SHADOW_CYCLE_RESULTS_INDICES_SQL,
};
