// ---------------------------------------------------------------
// MODULE: Confidence Tracker
// ---------------------------------------------------------------

import type { DatabaseExtended as Database } from '@spec-kit/shared/types';

// ---------------------------------------------------------------
// 1. TYPES
// ---------------------------------------------------------------

export type { Database };

export interface ValidationResult {
  confidence: number;
  validationCount: number;
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
  importanceTier: string;
  promotionEligible: boolean;
  promotionProgress: PromotionProgress;
}

interface MemoryConfidenceRow {
  confidence?: number;
  validation_count?: number;
  validationCount?: number;
  importance_tier?: string;
}

// ---------------------------------------------------------------
// 2. CONSTANTS
// ---------------------------------------------------------------

export const CONFIDENCE_BASE: number = 0.5;
export const CONFIDENCE_POSITIVE_INCREMENT: number = 0.1;
export const CONFIDENCE_NEGATIVE_DECREMENT: number = 0.05;
export const CONFIDENCE_MAX: number = 1.0;
export const CONFIDENCE_MIN: number = 0.0;

export const PROMOTION_CONFIDENCE_THRESHOLD: number = 0.9;
export const PROMOTION_VALIDATION_THRESHOLD: number = 5;

// ---------------------------------------------------------------
// 3. CORE FUNCTIONS
// ---------------------------------------------------------------

/**
 * Record a validation event for a memory.
 * Updates confidence score and validation count.
 */
export function recordValidation(db: Database, memoryId: number, wasUseful: boolean): ValidationResult {
  try {
    // Keep read/compute/write in one transaction so concurrent updates cannot drop validations.
    return db.transaction(() => {
      // Read first so this update derives from the latest persisted values.
      const memory = db.prepare(`
        SELECT confidence, validation_count FROM memory_index WHERE id = ?
      `).get(memoryId) as MemoryConfidenceRow | undefined;

      if (!memory) {
        throw new Error(`Memory not found: ${memoryId}`);
      }

      const currentConfidence = memory.confidence ?? CONFIDENCE_BASE;
      let newConfidence: number;

      if (wasUseful) {
        newConfidence = Math.min(currentConfidence + CONFIDENCE_POSITIVE_INCREMENT, CONFIDENCE_MAX);
      } else {
        newConfidence = Math.max(currentConfidence - CONFIDENCE_NEGATIVE_DECREMENT, CONFIDENCE_MIN);
      }

      const currentValidationCount = memory.validationCount ?? memory.validation_count ?? 0;
      const newValidationCount = currentValidationCount + 1;

      db.prepare(`
        UPDATE memory_index
        SET confidence = ?, validation_count = ?, updated_at = ?
        WHERE id = ?
      `).run(newConfidence, newValidationCount, new Date().toISOString(), memoryId);

      // Report eligibility only; promotion is intentionally explicit and separate.
      const promotionEligible = checkPromotionEligible(db, memoryId);

      return {
        confidence: newConfidence,
        validationCount: newValidationCount,
        promotionEligible,
        wasPromoted: false,
      };
    })();
  } catch (error: unknown) {
    console.error(`[confidence-tracker] recordValidation failed for memory ${memoryId}:`, error);
    return {
      confidence: CONFIDENCE_BASE,
      validationCount: 0,
      promotionEligible: false,
      wasPromoted: false,
    };
  }
}

/**
 * Get current confidence score for a memory.
 */
export function getConfidenceScore(db: Database, memoryId: number): number {
  try {
    // DB op 3: SELECT
    const memory = db.prepare(`
      SELECT confidence FROM memory_index WHERE id = ?
    `).get(memoryId) as { confidence?: number } | undefined;

    if (!memory) {
      throw new Error(`Memory not found: ${memoryId}`);
    }

    return memory.confidence ?? CONFIDENCE_BASE;
  } catch (error: unknown) {
    console.error(`[confidence-tracker] getConfidenceScore failed for memory ${memoryId}:`, error);
    return CONFIDENCE_BASE;
  }
}

/**
 * Check if a memory is eligible for promotion to critical tier.
 */
export function checkPromotionEligible(db: Database, memoryId: number): boolean {
  try {
    const memory = db.prepare(`
      SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
    `).get(memoryId) as MemoryConfidenceRow | undefined;

    if (!memory) {
      return false;
    }

    // Top-tier memories should not be re-promoted.
    if (memory.importance_tier === 'critical' || memory.importance_tier === 'constitutional') {
      return false;
    }

    const confidence = memory.confidence ?? CONFIDENCE_BASE;
    const validationCount = memory.validationCount ?? memory.validation_count ?? 0;

    return confidence >= PROMOTION_CONFIDENCE_THRESHOLD &&
           validationCount >= PROMOTION_VALIDATION_THRESHOLD;
  } catch (error: unknown) {
    console.error(`[confidence-tracker] checkPromotionEligible failed for memory ${memoryId}:`, error);
    return false;
  }
}

/**
 * Promote a memory to critical tier.
 */
export function promoteToCritical(db: Database, memoryId: number): boolean {
  try {
    if (!checkPromotionEligible(db, memoryId)) {
      const memory = db.prepare(`
        SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
      `).get(memoryId) as MemoryConfidenceRow | undefined;

      if (!memory) {
        throw new Error(`Memory not found: ${memoryId}`);
      }

      if (memory.importance_tier === 'critical' || memory.importance_tier === 'constitutional') {
        return false;
      }

      throw new Error(
        `Memory ${memoryId} not eligible for promotion. ` +
        `Requires confidence >= ${PROMOTION_CONFIDENCE_THRESHOLD} (current: ${memory.confidence ?? CONFIDENCE_BASE}) ` +
        `and validation_count >= ${PROMOTION_VALIDATION_THRESHOLD} (current: ${(memory.validationCount ?? memory.validation_count ?? 0)})`
      );
    }

    // Keep promotion explicit so tier changes always leave an auditable event.
    db.prepare(`
      UPDATE memory_index
      SET importance_tier = 'critical', updated_at = ?
      WHERE id = ?
    `).run(new Date().toISOString(), memoryId);

    console.warn(`[confidence-tracker] Memory ${memoryId} promoted to critical tier`);

    return true;
  } catch (error: unknown) {
    console.error(`[confidence-tracker] promoteToCritical failed for memory ${memoryId}:`, error);
    return false;
  }
}

/**
 * Get full confidence info for a memory.
 */
export function getConfidenceInfo(db: Database, memoryId: number): ConfidenceInfo {
  try {
    const memory = db.prepare(`
      SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
    `).get(memoryId) as MemoryConfidenceRow | undefined;

    if (!memory) {
      throw new Error(`Memory not found: ${memoryId}`);
    }

    const confidence = memory.confidence ?? CONFIDENCE_BASE;
    const validationCount = memory.validationCount ?? memory.validation_count ?? 0;

    return {
      memoryId,
      confidence,
      validationCount,
      importanceTier: memory.importance_tier || 'normal',
      promotionEligible: checkPromotionEligible(db, memoryId),
      promotionProgress: {
        confidenceRequired: PROMOTION_CONFIDENCE_THRESHOLD,
        validationsRequired: PROMOTION_VALIDATION_THRESHOLD,
        confidenceMet: confidence >= PROMOTION_CONFIDENCE_THRESHOLD,
        validationsMet: validationCount >= PROMOTION_VALIDATION_THRESHOLD,
      },
    };
  } catch (error: unknown) {
    console.error(`[confidence-tracker] getConfidenceInfo failed for memory ${memoryId}:`, error);
    return {
      memoryId,
      confidence: CONFIDENCE_BASE,
      validationCount: 0,
      importanceTier: 'normal',
      promotionEligible: false,
      promotionProgress: {
        confidenceRequired: PROMOTION_CONFIDENCE_THRESHOLD,
        validationsRequired: PROMOTION_VALIDATION_THRESHOLD,
        confidenceMet: false,
        validationsMet: false,
      },
    };
  }
}
