import type { DatabaseExtended as Database } from '@spec-kit/shared/types';
export type { Database };
export interface ValidationResult {
    confidence: number;
    validationCount: number;
    positiveValidationCount: number;
    promotionEligible: boolean;
    wasPromoted: boolean;
}
export interface PromotionProgress {
    confidenceRequired: number;
    validationsRequired: number;
    confidenceMet: boolean;
    validationsMet: boolean;
}
export interface ConfidenceInfo {
    memoryId: number;
    confidence: number;
    validationCount: number;
    positiveValidationCount: number;
    importanceTier: string;
    promotionEligible: boolean;
    promotionProgress: PromotionProgress;
}
export declare const CONFIDENCE_BASE: number;
export declare const CONFIDENCE_POSITIVE_INCREMENT: number;
export declare const CONFIDENCE_NEGATIVE_DECREMENT: number;
export declare const CONFIDENCE_MAX: number;
export declare const CONFIDENCE_MIN: number;
export declare const PROMOTION_CONFIDENCE_THRESHOLD: number;
export declare const PROMOTION_VALIDATION_THRESHOLD: number;
/**
 * Record a validation event for a memory and persist confidence counters.
 *
 * Stage 2 integration hooks:
 * - This function updates `memory_index.confidence` and `validation_count`,
 *   establishing durable feedback state for search-stage signal consumers.
 * - For `wasUseful=false`, `handlers/checkpoints.ts` pairs this update with
 *   `recordNegativeFeedbackEvent`, and Stage 2 (`search/pipeline/stage2-fusion.ts`)
 *   reads those events via `getNegativeFeedbackStats` to apply demotion.
 * - Positive validations can trigger auto-promotion (`importance_tier` changes),
 *   which Stage 2 validation metadata scoring treats as a quality signal.
 */
export declare function recordValidation(db: Database, memoryId: number, wasUseful: boolean): ValidationResult;
/**
 * Get current confidence score for a memory.
 */
export declare function getConfidenceScore(db: Database, memoryId: number): number;
/**
 * Check if a memory is eligible for promotion to critical tier.
 */
export declare function checkPromotionEligible(db: Database, memoryId: number): boolean;
/**
 * Promote a memory to critical tier.
 */
export declare function promoteToCritical(db: Database, memoryId: number): boolean;
/**
 * Get full confidence info for a memory.
 *
 * Stage 2 integration hook: handlers can surface this snapshot in telemetry
 * responses to explain why Stage 2 feedback-driven ranking changed over time.
 */
export declare function getConfidenceInfo(db: Database, memoryId: number): ConfidenceInfo;
//# sourceMappingURL=confidence-tracker.d.ts.map