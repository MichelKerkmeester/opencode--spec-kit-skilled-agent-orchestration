// ───────────────────────────────────────────────────────────────
// MODULE: Batch Feedback Learning (REQ-D4-004)
// ───────────────────────────────────────────────────────────────
// Feature catalog: Weekly batch feedback learning pipeline
// Aggregates implicit feedback events from the ledger (see
// feedback-ledger.ts), computes confidence-weighted signal scores
// per memory, enforces min-support and boost-cap guards, and
// records the would-have-been shadow rank alongside the live rank.
//
// Feature flag: SPECKIT_BATCH_LEARNED_FEEDBACK (default ON, graduated)
//
// Key invariants:
//   - Shadow-only: no live ranking columns are mutated
//   - Min-support ≥ MIN_SUPPORT_SESSIONS (3) distinct sessions
//     required before a signal can be promoted to a candidate
//   - MAX_BOOST_DELTA per cycle prevents runaway amplification
//   - All reads and writes use the existing feedback_events table
//     plus a lightweight batch_learning_log table for auditability

/** Shadow-only batch learning pipeline. Callable on-demand via runBatchLearning(db, opts). No live ranking mutations — writes to batch_learning_log for observability. Feature-flag gated by SPECKIT_BATCH_LEARNED_FEEDBACK (default ON). */

import type Database from 'better-sqlite3';
import {
  initFeedbackLedger,
  getFeedbackEvents,
} from './feedback-ledger.js';
import type { FeedbackConfidence } from './feedback-ledger.js';

/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
----------------------------------------------------------------*/

/** Minimum number of distinct sessions before a signal is eligible. */
export const MIN_SUPPORT_SESSIONS = 3;

/**
 * Maximum boost delta applied to any memory per batch cycle.
 * Prevents runaway amplification when one memory accumulates
 * large numbers of strong signals in a single week.
 */
export const MAX_BOOST_DELTA = 0.10;

/** Standard batch window: 7 days in milliseconds. */
export const BATCH_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

/** Per-confidence-tier weights used in the weighted score formula. */
export const CONFIDENCE_WEIGHTS: Record<FeedbackConfidence, number> = {
  strong: 1.0,
  medium: 0.5,
  weak:   0.1,
};

/* ───────────────────────────────────────────────────────────────
   2. TYPES
----------------------------------------------------------------*/

/** Aggregated signal for a single memory over the batch window. */
export interface AggregatedSignal {
  memoryId: string;
  /** Number of distinct sessions that contributed events. */
  sessionCount: number;
  /** Raw count of strong-tier events. */
  strongCount: number;
  /** Raw count of medium-tier events. */
  mediumCount: number;
  /** Raw count of weak-tier events. */
  weakCount: number;
  /** Confidence-weighted composite score. */
  weightedScore: number;
  /**
   * Proposed boost delta, capped at MAX_BOOST_DELTA.
   * Computed as: min(normalizedWeightedScore, MAX_BOOST_DELTA)
   */
  computedBoost: number;
}

/** Record written to batch_learning_log after a shadow-apply cycle. */
export interface BatchLearningLogRow {
  id: number;
  memory_id: string;
  batch_run_at: number;
  session_count: number;
  weighted_score: number;
  computed_boost: number;
  shadow_rank_delta: number | null;
  promoted: 0 | 1;
}

/** Options for `runBatchLearning`. */
export interface BatchLearningOptions {
  /** Epoch-ms timestamp of the batch run. Defaults to Date.now(). */
  runAt?: number;
  /** Look-back window in ms. Defaults to BATCH_WINDOW_MS (7 days). */
  windowMs?: number;
  /**
   * Minimum distinct-session count required for promotion.
   * Defaults to MIN_SUPPORT_SESSIONS (3).
   */
  minSupport?: number;
  /**
   * Maximum boost delta per cycle.
   * Defaults to MAX_BOOST_DELTA (0.10).
   */
  maxBoostDelta?: number;
}

/** Summary result returned by `runBatchLearning`. */
export interface BatchLearningResult {
  runAt: number;
  windowStart: number;
  totalEventsProcessed: number;
  candidatesEvaluated: number;
  /** Memories promoted to shadow-apply (met min-support). */
  shadowApplied: number;
  /** Memories skipped due to insufficient session support. */
  skippedMinSupport: number;
  candidates: AggregatedSignal[];
}

/* ───────────────────────────────────────────────────────────────
   3. FEATURE FLAG
----------------------------------------------------------------*/

import { isBatchLearnedFeedbackEnabled } from '../search/search-flags.js';

/**
 * Check whether the batch learned feedback feature is enabled.
 * Default: ON (graduated). Set SPECKIT_BATCH_LEARNED_FEEDBACK=false to disable.
 */
export { isBatchLearnedFeedbackEnabled };

/* ───────────────────────────────────────────────────────────────
   4. SCHEMA
----------------------------------------------------------------*/

const BATCH_LEARNING_LOG_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS batch_learning_log (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    memory_id       TEXT NOT NULL,
    batch_run_at    INTEGER NOT NULL,
    session_count   INTEGER NOT NULL DEFAULT 0,
    weighted_score  REAL NOT NULL DEFAULT 0.0,
    computed_boost  REAL NOT NULL DEFAULT 0.0,
    shadow_rank_delta REAL,
    promoted        INTEGER NOT NULL DEFAULT 0 CHECK(promoted IN (0,1))
  )
`;

const BATCH_LEARNING_LOG_INDICES_SQL = `
  CREATE INDEX IF NOT EXISTS idx_batch_log_memory_id  ON batch_learning_log(memory_id);
  CREATE INDEX IF NOT EXISTS idx_batch_log_run_at     ON batch_learning_log(batch_run_at);
  CREATE INDEX IF NOT EXISTS idx_batch_log_promoted   ON batch_learning_log(promoted)
`;

/** Track which DB handles have had the batch-learning schema initialized. */
const initializedBatchDbs = new WeakSet<object>();

/**
 * Ensure the batch_learning_log table and indices exist.
 * Also calls initFeedbackLedger to guarantee feedback_events exists.
 * Idempotent — safe to call multiple times.
 */
export function initBatchLearning(db: Database.Database): void {
  if (initializedBatchDbs.has(db)) return;
  initFeedbackLedger(db);
  db.exec(BATCH_LEARNING_LOG_SCHEMA_SQL);
  db.exec(BATCH_LEARNING_LOG_INDICES_SQL);
  initializedBatchDbs.add(db);
}

/* ───────────────────────────────────────────────────────────────
   5. AGGREGATION
----------------------------------------------------------------*/

/**
 * Aggregate feedback events in the given time window into per-memory signals.
 *
 * Groups events by memoryId, counts confidence tiers, and computes
 * a confidence-weighted score.  Does NOT apply min-support filtering
 * (that is the caller's responsibility).
 *
 * @param db - Database instance
 * @param since - Start of window (Unix ms, inclusive)
 * @param until - End of window (Unix ms, inclusive)
 * @returns Array of aggregated signals, one per unique memoryId
 */
export function aggregateEvents(
  db: Database.Database,
  since: number,
  until: number
): AggregatedSignal[] {
  try {
    initBatchLearning(db);

    // Fetch all events in the window
    const events = getFeedbackEvents(db, { since, until });

    // Group by memoryId
    const byMemory = new Map<string, {
      sessions: Set<string>;
      strong: number;
      medium: number;
      weak: number;
    }>();

    for (const ev of events) {
      let entry = byMemory.get(ev.memory_id);
      if (!entry) {
        entry = { sessions: new Set<string>(), strong: 0, medium: 0, weak: 0 };
        byMemory.set(ev.memory_id, entry);
      }
      // Count distinct sessions (null session_id treated as each own distinct pseudo-session)
      const sessionKey = ev.session_id ?? `__null_${ev.id}`;
      entry.sessions.add(sessionKey);
      entry[ev.confidence]++;
    }

    // Build AggregatedSignal array
    const signals: AggregatedSignal[] = [];
    for (const [memoryId, data] of byMemory) {
      const weightedScore =
        data.strong * CONFIDENCE_WEIGHTS.strong +
        data.medium * CONFIDENCE_WEIGHTS.medium +
        data.weak   * CONFIDENCE_WEIGHTS.weak;

      // Normalize: divide by total event count to get per-event average,
      // then scale by MAX_BOOST_DELTA to keep boost in range [0, MAX_BOOST_DELTA].
      const totalEvents = data.strong + data.medium + data.weak;
      const normalizedScore = totalEvents > 0 ? weightedScore / totalEvents : 0;
      const computedBoost = Math.min(normalizedScore * MAX_BOOST_DELTA, MAX_BOOST_DELTA);

      signals.push({
        memoryId,
        sessionCount:  data.sessions.size,
        strongCount:   data.strong,
        mediumCount:   data.medium,
        weakCount:     data.weak,
        weightedScore,
        computedBoost,
      });
    }

    // Sort descending by weightedScore for deterministic output
    signals.sort((a, b) => b.weightedScore - a.weightedScore);

    return signals;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[batch-learning] aggregateEvents error:', message);
    return [];
  }
}

/* ───────────────────────────────────────────────────────────────
   6. MIN-SUPPORT FILTER
----------------------------------------------------------------*/

/**
 * Filter aggregated signals to only those meeting min-support threshold.
 *
 * A signal is eligible when it appears in ≥ minSupport distinct sessions.
 * This prevents single-session anomalies from influencing ranking.
 *
 * @param signals - Signals from aggregateEvents
 * @param minSupport - Minimum distinct-session count (default MIN_SUPPORT_SESSIONS)
 * @returns Tuple of [eligible, skipped] signals
 */
export function applyMinSupportFilter(
  signals: AggregatedSignal[],
  minSupport: number = MIN_SUPPORT_SESSIONS
): { eligible: AggregatedSignal[]; skipped: AggregatedSignal[] } {
  const eligible: AggregatedSignal[] = [];
  const skipped: AggregatedSignal[] = [];
  for (const signal of signals) {
    if (signal.sessionCount >= minSupport) {
      eligible.push(signal);
    } else {
      skipped.push(signal);
    }
  }
  return { eligible, skipped };
}

/* ───────────────────────────────────────────────────────────────
   7. BOOST CAP ENFORCEMENT
----------------------------------------------------------------*/

/**
 * Enforce the MAX_BOOST_DELTA cap on a proposed boost value.
 *
 * @param proposedBoost - Raw computed boost from aggregation
 * @param maxBoostDelta - Cap (defaults to MAX_BOOST_DELTA)
 * @returns Clamped boost value in [0, maxBoostDelta]
 */
export function enforceBoostCap(
  proposedBoost: number,
  maxBoostDelta: number = MAX_BOOST_DELTA
): number {
  return Math.min(Math.max(0, proposedBoost), maxBoostDelta);
}

/* ───────────────────────────────────────────────────────────────
   8. SHADOW COMPARISON
----------------------------------------------------------------*/

/**
 * Compute the shadow rank delta for a memory.
 *
 * The shadow delta represents what the importance_weight *would* change to
 * if the boost were applied live.  It is recorded for observability only —
 * no live ranking columns are modified.
 *
 * @param db - Database instance
 * @param memoryId - The memory to inspect
 * @param boost - The capped boost that would be applied
 * @returns The would-have-been delta, or null when memoryId is not found
 */
export function computeShadowRankDelta(
  db: Database.Database,
  memoryId: string,
  boost: number
): number | null {
  try {
    const row = db.prepare(
      'SELECT importance_weight FROM memory_index WHERE id = ? LIMIT 1'
    ).get(memoryId) as { importance_weight: number } | undefined;

    if (!row) return null;

    const currentWeight = row.importance_weight ?? 0.5;
    const wouldBeWeight = Math.min(1.0, currentWeight + boost);
    return wouldBeWeight - currentWeight;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[batch-learning] computeShadowRankDelta error:', message);
    return null;
  }
}

/* ───────────────────────────────────────────────────────────────
   9. SHADOW APPLY
----------------------------------------------------------------*/

/**
 * Shadow-apply a single signal: record the would-have-been boost into
 * batch_learning_log without modifying any live ranking column.
 *
 * @param db - Database instance
 * @param signal - Aggregated signal (already cap-enforced)
 * @param runAt - Epoch-ms timestamp of the batch run
 * @returns The inserted log row ID, or null on error
 */
export function shadowApply(
  db: Database.Database,
  signal: AggregatedSignal,
  runAt: number
): number | null {
  try {
    initBatchLearning(db);

    const boost = enforceBoostCap(signal.computedBoost);
    const shadowDelta = computeShadowRankDelta(db, signal.memoryId, boost);

    const result = db.prepare(`
      INSERT INTO batch_learning_log
        (memory_id, batch_run_at, session_count, weighted_score, computed_boost, shadow_rank_delta, promoted)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `).run(
      signal.memoryId,
      runAt,
      signal.sessionCount,
      signal.weightedScore,
      boost,
      shadowDelta
    );

    return (result as { lastInsertRowid: number | bigint }).lastInsertRowid as number;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[batch-learning] shadowApply error:', message);
    return null;
  }
}

/* ───────────────────────────────────────────────────────────────
   10. BATCH LEARNING ORCHESTRATOR
----------------------------------------------------------------*/

/**
 * Run one full batch learning cycle.
 *
 * Workflow:
 *   1. Resolve time window and options
 *   2. Aggregate events within the window
 *   3. Apply min-support filter
 *   4. Enforce boost cap on eligible candidates
 *   5. Shadow-apply (write to batch_learning_log, no live ranking changes)
 *   6. Return summary
 *
 * When the feature flag is OFF returns a no-op result with zero counts.
 *
 * @param db - Database instance
 * @param opts - Batch run options
 * @returns BatchLearningResult summary
 */
export function runBatchLearning(
  db: Database.Database,
  opts: BatchLearningOptions = {}
): BatchLearningResult {
  const runAt       = opts.runAt       ?? Date.now();
  const windowMs    = opts.windowMs    ?? BATCH_WINDOW_MS;
  const minSupport  = opts.minSupport  ?? MIN_SUPPORT_SESSIONS;
  const maxBoost    = opts.maxBoostDelta ?? MAX_BOOST_DELTA;

  const windowStart = runAt - windowMs;

  if (!isBatchLearnedFeedbackEnabled()) {
    return {
      runAt,
      windowStart,
      totalEventsProcessed: 0,
      candidatesEvaluated:  0,
      shadowApplied:        0,
      skippedMinSupport:    0,
      candidates:           [],
    };
  }

  try {
    initBatchLearning(db);

    // Step 2: Aggregate
    const allSignals = aggregateEvents(db, windowStart, runAt);
    const totalEventsProcessed = allSignals.reduce(
      (sum, s) => sum + s.strongCount + s.mediumCount + s.weakCount, 0
    );

    // Step 3: Min-support filter
    const { eligible, skipped } = applyMinSupportFilter(allSignals, minSupport);

    // Steps 4 + 5: Cap + shadow-apply each eligible signal
    let shadowApplied = 0;
    for (const signal of eligible) {
      // Re-cap with the caller-provided maxBoostDelta (may differ from default)
      const cappedBoost = enforceBoostCap(signal.computedBoost, maxBoost);
      const cappedSignal: AggregatedSignal = { ...signal, computedBoost: cappedBoost };
      const logId = shadowApply(db, cappedSignal, runAt);
      if (logId !== null) shadowApplied++;
    }

    return {
      runAt,
      windowStart,
      totalEventsProcessed,
      candidatesEvaluated:  eligible.length,
      shadowApplied,
      skippedMinSupport:    skipped.length,
      candidates:           eligible,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[batch-learning] runBatchLearning error:', message);
    return {
      runAt,
      windowStart,
      totalEventsProcessed: 0,
      candidatesEvaluated:  0,
      shadowApplied:        0,
      skippedMinSupport:    0,
      candidates:           [],
    };
  }
}

/* ───────────────────────────────────────────────────────────────
   11. QUERY HELPERS
----------------------------------------------------------------*/

/**
 * Retrieve batch learning log rows for a specific memory.
 * Ordered by batch_run_at DESC (most recent first).
 */
export function getBatchLearningHistory(
  db: Database.Database,
  memoryId: string
): BatchLearningLogRow[] {
  try {
    initBatchLearning(db);
    return db.prepare(`
      SELECT * FROM batch_learning_log
      WHERE memory_id = ?
      ORDER BY batch_run_at DESC
    `).all(memoryId) as BatchLearningLogRow[];
  } catch {
    return [];
  }
}

/**
 * Count total batch learning log entries for a memory.
 */
export function getBatchLearningCount(
  db: Database.Database,
  memoryId?: string
): number {
  try {
    initBatchLearning(db);
    if (memoryId) {
      const row = db.prepare(
        'SELECT COUNT(*) as count FROM batch_learning_log WHERE memory_id = ?'
      ).get(memoryId) as { count: number };
      return row.count;
    }
    const row = db.prepare(
      'SELECT COUNT(*) as count FROM batch_learning_log'
    ).get() as { count: number };
    return row.count;
  } catch {
    return 0;
  }
}

/* ───────────────────────────────────────────────────────────────
   12. EXPORTS (constants for testing)
----------------------------------------------------------------*/

export {
  BATCH_LEARNING_LOG_SCHEMA_SQL,
  BATCH_LEARNING_LOG_INDICES_SQL,
};
