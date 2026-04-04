import type { DatabaseExtended as Database } from '@spec-kit/shared/types';
export type { Database };
/** Result of an auto-promotion check. */
export interface AutoPromotionResult {
    /** Whether promotion occurred */
    promoted: boolean;
    /** Previous importance tier */
    previousTier: string;
    /** New importance tier (same as previous if no promotion) */
    newTier: string;
    /** Current positive validation count */
    validationCount: number;
    /** Reason for the result */
    reason: string;
}
/** Positive validations required to promote normal -> important */
export declare const PROMOTE_TO_IMPORTANT_THRESHOLD = 5;
/** Positive validations required to promote important -> critical */
export declare const PROMOTE_TO_CRITICAL_THRESHOLD = 10;
/** Tier promotion paths (source -> target). Only upward promotions. */
export declare const PROMOTION_PATHS: Readonly<Record<string, {
    target: string;
    threshold: number;
}>>;
/** Rolling window length for promotion throttle safeguard (hours). */
export declare const PROMOTION_WINDOW_HOURS = 8;
/** Maximum allowed promotions inside one rolling window. */
export declare const MAX_PROMOTIONS_PER_WINDOW = 3;
/** Rolling window length in milliseconds. */
export declare const PROMOTION_WINDOW_MS: number;
/** Tiers that cannot be promoted (already at top or special-purpose). */
export declare const NON_PROMOTABLE_TIERS: ReadonlySet<string>;
/**
 * Check if a memory qualifies for auto-promotion based on its positive validation count.
 * Does NOT modify the database -- read-only check.
 *
 * @param db - SQLite database connection
 * @param memoryId - ID of the memory to check
 * @returns Promotion check result with eligibility details
 */
export declare function checkAutoPromotion(db: Database, memoryId: number): AutoPromotionResult;
/**
 * Execute auto-promotion for a memory if it qualifies.
 * Promotes the memory's importance tier in the database.
 *
 * Promotion rules (upward only, never demotes):
 * - >=5 positive validations: normal -> important
 * - >=10 positive validations: important -> critical
 *
 * @param db - SQLite database connection
 * @param memoryId - ID of the memory to potentially promote
 * @returns Promotion result with details of what happened
 */
export declare function executeAutoPromotion(db: Database, memoryId: number): AutoPromotionResult;
/**
 * Batch check all memories for auto-promotion eligibility.
 * Returns a list of memories that qualify for promotion.
 * Does NOT modify the database -- read-only scan.
 *
 * @param db - SQLite database connection
 * @returns Array of promotion results for eligible memories
 */
export declare function scanForPromotions(db: Database): AutoPromotionResult[];
//# sourceMappingURL=auto-promotion.d.ts.map