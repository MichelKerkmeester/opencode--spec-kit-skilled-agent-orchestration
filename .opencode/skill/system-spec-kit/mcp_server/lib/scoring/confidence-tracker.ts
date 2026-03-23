// ───────────────────────────────────────────────────────────────
// MODULE: Confidence Tracker
// ───────────────────────────────────────────────────────────────
// Feature catalog: Score normalization
import type { DatabaseExtended as Database } from '@spec-kit/shared/types';

// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
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

interface MemoryConfidenceRow {
  confidence?: number;
  validation_count?: number;
  validationCount?: number;
  importance_tier?: string;
}

function getNegativeValidationCount(db: Database, memoryId: number): number {
  try {
    const row = db.prepare(`
      SELECT COUNT(*) AS count
      FROM negative_feedback_events
      WHERE memory_id = ?
    `).get(memoryId) as { count?: number } | undefined;

    return typeof row?.count === 'number' && Number.isFinite(row.count)
      ? Math.max(0, Math.floor(row.count))
      : 0;
  } catch {
    // Table may not exist on older DB snapshots; treat as no negatives.
    return 0;
  }
}

function resolvePositiveValidationCount(totalValidationCount: number, negativeValidationCount: number): number {
  return Math.max(0, totalValidationCount - Math.max(0, negativeValidationCount));
}

function isPromotionEligible(
  importanceTier: string | undefined,
  confidence: number,
  positiveValidationCount: number
): boolean {
  if (importanceTier === 'critical' || importanceTier === 'constitutional') {
    return false;
  }

  return confidence >= PROMOTION_CONFIDENCE_THRESHOLD &&
    positiveValidationCount >= PROMOTION_VALIDATION_THRESHOLD;
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS

// ───────────────────────────────────────────────────────────────
export const CONFIDENCE_BASE: number = 0.5;
export const CONFIDENCE_POSITIVE_INCREMENT: number = 0.1;
export const CONFIDENCE_NEGATIVE_DECREMENT: number = 0.05;
export const CONFIDENCE_MAX: number = 1.0;
export const CONFIDENCE_MIN: number = 0.0;

export const PROMOTION_CONFIDENCE_THRESHOLD: number = 0.9;
export const PROMOTION_VALIDATION_THRESHOLD: number = 5;

// ───────────────────────────────────────────────────────────────
// 3. CORE FUNCTIONS

// ───────────────────────────────────────────────────────────────
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
export function recordValidation(db: Database, memoryId: number, wasUseful: boolean): ValidationResult {
  try {
    // Keep read/compute/write in one transaction so concurrent updates cannot drop validations.
    return db.transaction(() => {
      // Read first so this update derives from the latest persisted values.
      const memory = db.prepare(`
        SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
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

      const priorNegativeValidationCount = getNegativeValidationCount(db, memoryId);
      const effectiveNegativeValidationCount = wasUseful
        ? priorNegativeValidationCount
        : priorNegativeValidationCount + 1;
      const positiveValidationCount = resolvePositiveValidationCount(
        newValidationCount,
        effectiveNegativeValidationCount
      );

      // Report eligibility only; promotion is intentionally explicit and separate.
      const promotionEligible = isPromotionEligible(
        memory.importance_tier,
        newConfidence,
        positiveValidationCount
      );

      if (!wasUseful) {
        const chunkId = memoryId;
        console.warn('[confidence-tracker] negative feedback recorded', {
          chunkId,
          previousConfidence: currentConfidence,
          newConfidence,
          decrement: CONFIDENCE_NEGATIVE_DECREMENT,
        });
      }

      return {
        confidence: newConfidence,
        validationCount: newValidationCount,
        positiveValidationCount,
        promotionEligible,
        wasPromoted: false,
      };
    })();
  } catch (error: unknown) {
    // T-07: Replace success-shaped fallback with explicit failure signaling.
    // Previously returned default values that looked like success, hiding DB errors
    // From callers and allowing downstream side-effects to proceed on stale data.
    console.error(`[confidence-tracker] recordValidation failed for memory ${memoryId}:`, error);
    throw error;
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
    const negativeValidationCount = getNegativeValidationCount(db, memoryId);
    const positiveValidationCount = resolvePositiveValidationCount(validationCount, negativeValidationCount);

    return isPromotionEligible(memory.importance_tier, confidence, positiveValidationCount);
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

      const validationCount = memory.validationCount ?? memory.validation_count ?? 0;
      const negativeValidationCount = getNegativeValidationCount(db, memoryId);
      const positiveValidationCount = resolvePositiveValidationCount(validationCount, negativeValidationCount);
      throw new Error(
        `Memory ${memoryId} not eligible for promotion. ` +
        `Requires confidence >= ${PROMOTION_CONFIDENCE_THRESHOLD} (current: ${memory.confidence ?? CONFIDENCE_BASE}) ` +
        `and positive_validation_count >= ${PROMOTION_VALIDATION_THRESHOLD} (current: ${positiveValidationCount})`
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
 *
 * Stage 2 integration hook: handlers can surface this snapshot in telemetry
 * responses to explain why Stage 2 feedback-driven ranking changed over time.
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
    const negativeValidationCount = getNegativeValidationCount(db, memoryId);
    const positiveValidationCount = resolvePositiveValidationCount(validationCount, negativeValidationCount);

    return {
      memoryId,
      confidence,
      validationCount,
      positiveValidationCount,
      importanceTier: memory.importance_tier || 'normal',
      promotionEligible: isPromotionEligible(memory.importance_tier, confidence, positiveValidationCount),
      promotionProgress: {
        confidenceRequired: PROMOTION_CONFIDENCE_THRESHOLD,
        validationsRequired: PROMOTION_VALIDATION_THRESHOLD,
        confidenceMet: confidence >= PROMOTION_CONFIDENCE_THRESHOLD,
        validationsMet: positiveValidationCount >= PROMOTION_VALIDATION_THRESHOLD,
      },
    };
  } catch (error: unknown) {
    // T-07 alignment: Re-throw on DB error instead of returning success-shaped defaults.
    // Callers can distinguish "no data" from "query failed" and handle accordingly.
    console.error(`[confidence-tracker] getConfidenceInfo failed for memory ${memoryId}:`, error);
    throw error;
  }
}
