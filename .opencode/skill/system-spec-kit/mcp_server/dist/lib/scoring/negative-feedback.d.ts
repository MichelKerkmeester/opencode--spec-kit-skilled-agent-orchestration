import type { DatabaseExtended as Database } from '@spec-kit/shared/types';
/** Base multiplier before any negative feedback is applied. */
export declare const CONFIDENCE_MULTIPLIER_BASE = 1;
/** Minimum multiplier floor -- never suppress below 30% of original score. */
export declare const CONFIDENCE_MULTIPLIER_FLOOR = 0.3;
/** Per-negative-validation penalty applied to the multiplier. */
export declare const NEGATIVE_PENALTY_PER_VALIDATION = 0.1;
/**
 * Half-life for recovery in milliseconds (30 days).
 * After 30 days since the last negative validation, the penalty
 * is halved. This allows memories to recover relevance over time
 * if no further negative feedback is received.
 */
export declare const RECOVERY_HALF_LIFE_MS: number;
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
export declare function computeConfidenceMultiplier(negativeCount: number, lastNegativeAt?: number | null): number;
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
export declare function applyNegativeFeedback(score: number, negativeCount: number, lastNegativeAt?: number | null): number;
/** Record one negative validation event for a memory. */
export declare function recordNegativeFeedbackEvent(db: Database, memoryId: number, atMs?: number): void;
export interface NegativeFeedbackStats {
    negativeCount: number;
    lastNegativeAt: number | null;
}
/**
 * Batch-load negative feedback stats for a set of memory IDs.
 * Returns an empty map when no IDs are provided.
 */
export declare function getNegativeFeedbackStats(db: Database, memoryIds: number[]): Map<number, NegativeFeedbackStats>;
//# sourceMappingURL=negative-feedback.d.ts.map