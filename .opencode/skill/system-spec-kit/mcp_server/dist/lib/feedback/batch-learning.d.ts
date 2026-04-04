/** Shadow-only batch learning pipeline. Callable on-demand via runBatchLearning(db, opts). No live ranking mutations — writes to batch_learning_log for observability. Feature-flag gated by SPECKIT_BATCH_LEARNED_FEEDBACK (default ON). */
import type Database from 'better-sqlite3';
import type { FeedbackConfidence } from './feedback-ledger.js';
/** Minimum number of distinct sessions before a signal is eligible. */
export declare const MIN_SUPPORT_SESSIONS = 3;
/**
 * Maximum boost delta applied to any memory per batch cycle.
 * Prevents runaway amplification when one memory accumulates
 * large numbers of strong signals in a single week.
 */
export declare const MAX_BOOST_DELTA = 0.1;
/** Standard batch window: 7 days in milliseconds. */
export declare const BATCH_WINDOW_MS: number;
/** Per-confidence-tier weights used in the weighted score formula. */
export declare const CONFIDENCE_WEIGHTS: Record<FeedbackConfidence, number>;
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
import { isBatchLearnedFeedbackEnabled } from '../search/search-flags.js';
/**
 * Check whether the batch learned feedback feature is enabled.
 * Default: ON (graduated). Set SPECKIT_BATCH_LEARNED_FEEDBACK=false to disable.
 */
export { isBatchLearnedFeedbackEnabled };
declare const BATCH_LEARNING_LOG_SCHEMA_SQL = "\n  CREATE TABLE IF NOT EXISTS batch_learning_log (\n    id              INTEGER PRIMARY KEY AUTOINCREMENT,\n    memory_id       TEXT NOT NULL,\n    batch_run_at    INTEGER NOT NULL,\n    session_count   INTEGER NOT NULL DEFAULT 0,\n    weighted_score  REAL NOT NULL DEFAULT 0.0,\n    computed_boost  REAL NOT NULL DEFAULT 0.0,\n    shadow_rank_delta REAL,\n    promoted        INTEGER NOT NULL DEFAULT 0 CHECK(promoted IN (0,1))\n  )\n";
declare const BATCH_LEARNING_LOG_INDICES_SQL = "\n  CREATE INDEX IF NOT EXISTS idx_batch_log_memory_id  ON batch_learning_log(memory_id);\n  CREATE INDEX IF NOT EXISTS idx_batch_log_run_at     ON batch_learning_log(batch_run_at);\n  CREATE INDEX IF NOT EXISTS idx_batch_log_promoted   ON batch_learning_log(promoted)\n";
/**
 * Ensure the batch_learning_log table and indices exist.
 * Also calls initFeedbackLedger to guarantee feedback_events exists.
 * Idempotent — safe to call multiple times.
 */
export declare function initBatchLearning(db: Database.Database): void;
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
export declare function aggregateEvents(db: Database.Database, since: number, until: number): AggregatedSignal[];
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
export declare function applyMinSupportFilter(signals: AggregatedSignal[], minSupport?: number): {
    eligible: AggregatedSignal[];
    skipped: AggregatedSignal[];
};
/**
 * Enforce the MAX_BOOST_DELTA cap on a proposed boost value.
 *
 * @param proposedBoost - Raw computed boost from aggregation
 * @param maxBoostDelta - Cap (defaults to MAX_BOOST_DELTA)
 * @returns Clamped boost value in [0, maxBoostDelta]
 */
export declare function enforceBoostCap(proposedBoost: number, maxBoostDelta?: number): number;
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
export declare function computeShadowRankDelta(db: Database.Database, memoryId: string, boost: number): number | null;
/**
 * Shadow-apply a single signal: record the would-have-been boost into
 * batch_learning_log without modifying any live ranking column.
 *
 * @param db - Database instance
 * @param signal - Aggregated signal (already cap-enforced)
 * @param runAt - Epoch-ms timestamp of the batch run
 * @returns The inserted log row ID, or null on error
 */
export declare function shadowApply(db: Database.Database, signal: AggregatedSignal, runAt: number): number | null;
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
export declare function runBatchLearning(db: Database.Database, opts?: BatchLearningOptions): BatchLearningResult;
/**
 * Retrieve batch learning log rows for a specific memory.
 * Ordered by batch_run_at DESC (most recent first).
 */
export declare function getBatchLearningHistory(db: Database.Database, memoryId: string): BatchLearningLogRow[];
/**
 * Count total batch learning log entries for a memory.
 */
export declare function getBatchLearningCount(db: Database.Database, memoryId?: string): number;
export { BATCH_LEARNING_LOG_SCHEMA_SQL, BATCH_LEARNING_LOG_INDICES_SQL, };
//# sourceMappingURL=batch-learning.d.ts.map