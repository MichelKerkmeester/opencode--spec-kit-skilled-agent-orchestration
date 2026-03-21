// ───────────────────────────────────────────────────────────────
// MODULE: Negative Feedback
// ───────────────────────────────────────────────────────────────
// When wasUseful=false is recorded via memory_validate, reduce the
// Memory's composite score via a confidence multiplier.
//
// Multiplier: starts at 1.0, decreases with each negative validation
// Floor: 0.3 (never suppress below 30% of original score)
// Decay: gradual recovery over time (30-day half-life)
import type { DatabaseExtended as Database } from '@spec-kit/shared/types';

// Feature catalog: Negative feedback confidence signal


// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS

// ───────────────────────────────────────────────────────────────
/** Base multiplier before any negative feedback is applied. */
export const CONFIDENCE_MULTIPLIER_BASE = 1.0;

/** Minimum multiplier floor -- never suppress below 30% of original score. */
export const CONFIDENCE_MULTIPLIER_FLOOR = 0.3;

/** Per-negative-validation penalty applied to the multiplier. */
export const NEGATIVE_PENALTY_PER_VALIDATION = 0.1;

/**
 * Half-life for recovery in milliseconds (30 days).
 * After 30 days since the last negative validation, the penalty
 * is halved. This allows memories to recover relevance over time
 * if no further negative feedback is received.
 */
export const RECOVERY_HALF_LIFE_MS = 30 * 24 * 60 * 60 * 1000;

/** Persistence table for negative-validation history. */
const NEGATIVE_FEEDBACK_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS negative_feedback_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    memory_id INTEGER NOT NULL,
    created_at_ms INTEGER NOT NULL
  )
`;

/** Index to keep per-memory lookups fast in search scoring. */
const NEGATIVE_FEEDBACK_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_negative_feedback_events_memory
  ON negative_feedback_events(memory_id, created_at_ms DESC)
`;

// ───────────────────────────────────────────────────────────────
// 2. CORE FUNCTIONS

// ───────────────────────────────────────────────────────────────
/**
 * Compute the confidence multiplier based on negative validation count
 * and time since last negative validation.
 *
 * The multiplier starts at 1.0 and decreases by NEGATIVE_PENALTY_PER_VALIDATION
 * for each negative validation, but never drops below CONFIDENCE_MULTIPLIER_FLOOR (0.3).
 *
 * Time-based recovery: the penalty decays with a 30-day half-life since
 * the last negative validation. This means:
 * - At 0 days:  full penalty applied
 * - At 30 days: penalty halved
 * - At 60 days: penalty quartered
 * - At 90 days: penalty at ~12.5%
 *
 * @param negativeCount - Number of negative (wasUseful=false) validations
 * @param lastNegativeAt - Timestamp (ms epoch) of the most recent negative validation.
 *                         If null/undefined, no recovery decay is applied.
 * @returns Confidence multiplier in range [CONFIDENCE_MULTIPLIER_FLOOR, CONFIDENCE_MULTIPLIER_BASE]
 */
export function computeConfidenceMultiplier(
  negativeCount: number,
  lastNegativeAt?: number | null
): number {
  if (!Number.isFinite(negativeCount) || negativeCount <= 0) {
    return CONFIDENCE_MULTIPLIER_BASE;
  }

  // Base penalty from negative count
  const rawPenalty = negativeCount * NEGATIVE_PENALTY_PER_VALIDATION;

  // Apply time-based recovery (exponential decay of penalty)
  let effectivePenalty = rawPenalty;

  if (lastNegativeAt != null && Number.isFinite(lastNegativeAt)) {
    const elapsedMs = Date.now() - lastNegativeAt;
    if (elapsedMs > 0) {
      // Exponential decay: penalty * 2^(-elapsed / halfLife)
      const decayFactor = Math.pow(2, -(elapsedMs / RECOVERY_HALF_LIFE_MS));
      effectivePenalty = rawPenalty * decayFactor;
    }
  }

  // Compute multiplier with floor
  const multiplier = CONFIDENCE_MULTIPLIER_BASE - effectivePenalty;
  return Math.max(CONFIDENCE_MULTIPLIER_FLOOR, Math.min(CONFIDENCE_MULTIPLIER_BASE, multiplier));
}

/**
 * Apply negative feedback confidence signal to a composite score.
 *
 * This function wraps computeConfidenceMultiplier and applies the resulting
 * multiplier to the given score. Use this as the integration point in the
 * scoring pipeline.
 *
 * @param score - The composite score to adjust (0-1)
 * @param negativeCount - Number of negative validations on the memory
 * @param lastNegativeAt - Timestamp (ms epoch) of the most recent negative validation
 * @returns Adjusted score in range [score * 0.3, score]
 */
export function applyNegativeFeedback(
  score: number,
  negativeCount: number,
  lastNegativeAt?: number | null
): number {
  const multiplier = computeConfidenceMultiplier(negativeCount, lastNegativeAt);
  return score * multiplier;
}

/** Ensure negative-feedback persistence structures exist (idempotent). */
function ensureNegativeFeedbackTable(db: Database): void {
  db.exec(NEGATIVE_FEEDBACK_TABLE_SQL);
  db.exec(NEGATIVE_FEEDBACK_INDEX_SQL);
}

/** Record one negative validation event for a memory. */
export function recordNegativeFeedbackEvent(db: Database, memoryId: number, atMs: number = Date.now()): void {
  ensureNegativeFeedbackTable(db);
  db.prepare(
    'INSERT INTO negative_feedback_events (memory_id, created_at_ms) VALUES (?, ?)'
  ).run(memoryId, atMs);
}

export interface NegativeFeedbackStats {
  negativeCount: number;
  lastNegativeAt: number | null;
}

/**
 * Batch-load negative feedback stats for a set of memory IDs.
 * Returns an empty map when no IDs are provided.
 */
export function getNegativeFeedbackStats(
  db: Database,
  memoryIds: number[]
): Map<number, NegativeFeedbackStats> {
  const stats = new Map<number, NegativeFeedbackStats>();
  if (!Array.isArray(memoryIds) || memoryIds.length === 0) {
    return stats;
  }

  ensureNegativeFeedbackTable(db);
  const uniqueIds = Array.from(new Set(memoryIds.filter((id) => Number.isInteger(id) && id > 0)));
  if (uniqueIds.length === 0) {
    return stats;
  }

  const placeholders = uniqueIds.map(() => '?').join(', ');
  const rows = db.prepare(
    `SELECT memory_id, COUNT(*) AS negative_count, MAX(created_at_ms) AS last_negative_at
     FROM negative_feedback_events
     WHERE memory_id IN (${placeholders})
     GROUP BY memory_id`
  ).all(...uniqueIds) as Array<{ memory_id: number; negative_count: number; last_negative_at: number | null }>;

  for (const row of rows) {
    stats.set(row.memory_id, {
      negativeCount: row.negative_count ?? 0,
      lastNegativeAt: row.last_negative_at ?? null,
    });
  }

  return stats;
}
