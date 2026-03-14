// ───────────────────────────────────────────────────────────────
// MODULE: Auto Promotion
// ───────────────────────────────────────────────────────────────
//
// Promotes memory importance tier based on positive validation count:
// - >=5 positive validations: normal -> important
// - >=10 positive validations: important -> critical
// - Below threshold: no change (no-op)
//
// Does NOT demote -- only promotes upward.
import type { DatabaseExtended as Database } from '@spec-kit/shared/types';

// Feature catalog: Auto-promotion on validation


// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
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

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS

// ───────────────────────────────────────────────────────────────
/** Positive validations required to promote normal -> important */
export const PROMOTE_TO_IMPORTANT_THRESHOLD = 5;

/** Positive validations required to promote important -> critical */
export const PROMOTE_TO_CRITICAL_THRESHOLD = 10;

/** Tier promotion paths (source -> target). Only upward promotions. */
export const PROMOTION_PATHS: Readonly<Record<string, { target: string; threshold: number }>> = {
  normal: { target: 'important', threshold: PROMOTE_TO_IMPORTANT_THRESHOLD },
  important: { target: 'critical', threshold: PROMOTE_TO_CRITICAL_THRESHOLD },
};

/** Rolling window length for promotion throttle safeguard (hours). */
export const PROMOTION_WINDOW_HOURS = 8;

/** Maximum allowed promotions inside one rolling window. */
export const MAX_PROMOTIONS_PER_WINDOW = 3;

/** Rolling window length in milliseconds. */
export const PROMOTION_WINDOW_MS = PROMOTION_WINDOW_HOURS * 60 * 60 * 1000;

/** Tiers that cannot be promoted (already at top or special-purpose). */
export const NON_PROMOTABLE_TIERS: ReadonlySet<string> = new Set([
  'critical',
  'constitutional',
  'temporary',
  'deprecated',
]);

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
  } catch (_error: unknown) {
    return 0;
  }
}

function resolvePositiveValidationCount(totalValidationCount: number, negativeValidationCount: number): number {
  return Math.max(0, totalValidationCount - Math.max(0, negativeValidationCount));
}

// ───────────────────────────────────────────────────────────────
// 3. PROMOTION THROTTLE SAFEGUARD

// ───────────────────────────────────────────────────────────────
const PROMOTION_AUDIT_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS memory_promotion_audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    memory_id INTEGER NOT NULL,
    previous_tier TEXT NOT NULL,
    new_tier TEXT NOT NULL,
    validation_count INTEGER NOT NULL,
    promoted_at INTEGER NOT NULL
  )
`;

function ensurePromotionAuditTable(db: Database): void {
  db.exec(PROMOTION_AUDIT_TABLE_SQL);
}

function countRecentPromotions(db: Database, nowMs: number): number {
  const cutoffMs = nowMs - PROMOTION_WINDOW_MS;
  const row = db.prepare(
    'SELECT COUNT(*) AS count FROM memory_promotion_audit WHERE promoted_at >= ?'
  ).get(cutoffMs) as { count?: number } | undefined;
  return row?.count ?? 0;
}

// ───────────────────────────────────────────────────────────────
// 4. CORE FUNCTIONS

// ───────────────────────────────────────────────────────────────
/**
 * Check if a memory qualifies for auto-promotion based on its positive validation count.
 * Does NOT modify the database -- read-only check.
 *
 * @param db - SQLite database connection
 * @param memoryId - ID of the memory to check
 * @returns Promotion check result with eligibility details
 */
export function checkAutoPromotion(db: Database, memoryId: number): AutoPromotionResult {
  try {
    const memory = db.prepare(
      'SELECT importance_tier, validation_count, confidence FROM memory_index WHERE id = ?'
    ).get(memoryId) as {
      importance_tier?: string;
      validation_count?: number;
      confidence?: number;
    } | undefined;

    if (!memory) {
      return {
        promoted: false,
        previousTier: 'unknown',
        newTier: 'unknown',
        validationCount: 0,
        reason: 'memory_not_found',
      };
    }

    const tier = (memory.importance_tier || 'normal').toLowerCase();
    const totalValidationCount = memory.validation_count ?? 0;
    const negativeValidationCount = getNegativeValidationCount(db, memoryId);
    const validationCount = resolvePositiveValidationCount(totalValidationCount, negativeValidationCount);

    // Non-promotable tiers
    if (NON_PROMOTABLE_TIERS.has(tier)) {
      return {
        promoted: false,
        previousTier: tier,
        newTier: tier,
        validationCount,
        reason: `tier_not_promotable: ${tier}`,
      };
    }

    // Check if tier has a promotion path
    const path = PROMOTION_PATHS[tier];
    if (!path) {
      return {
        promoted: false,
        previousTier: tier,
        newTier: tier,
        validationCount,
        reason: `no_promotion_path_for_tier: ${tier}`,
      };
    }

    // Check if validation count meets threshold
    if (validationCount < path.threshold) {
      return {
        promoted: false,
        previousTier: tier,
        newTier: tier,
        validationCount,
        reason: `below_threshold: positive_validation_count=${validationCount}/${path.threshold}`,
      };
    }

    return {
      promoted: true,
      previousTier: tier,
      newTier: path.target,
      validationCount,
      reason: `threshold_met: positive_validation_count=${validationCount}>=${path.threshold}`,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[auto-promotion] checkAutoPromotion failed for memory ${memoryId}: ${msg}`);
    return {
      promoted: false,
      previousTier: 'unknown',
      newTier: 'unknown',
      validationCount: 0,
      reason: 'error',
    };
  }
}

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
export function executeAutoPromotion(db: Database, memoryId: number): AutoPromotionResult {
  try {
    const check = checkAutoPromotion(db, memoryId);

    if (!check.promoted) {
      return check;
    }

    // Safeguard: cap promotion throughput to avoid runaway tier inflation.
    // F-02 — Wrap throttle check + tier update + audit insert in a
    // BEGIN IMMEDIATE transaction so concurrent calls cannot exceed the rate limit.
    ensurePromotionAuditTable(db);

    const executePromotion = db.transaction(() => {
      const nowMs = Date.now();
      const recentPromotions = countRecentPromotions(db, nowMs);
      if (recentPromotions >= MAX_PROMOTIONS_PER_WINDOW) {
        return {
          promoted: false,
          previousTier: check.previousTier,
          newTier: check.previousTier,
          validationCount: check.validationCount,
          reason: `promotion_window_rate_limited: ${recentPromotions}/${MAX_PROMOTIONS_PER_WINDOW} in ${PROMOTION_WINDOW_HOURS}h`,
        };
      }

      db.prepare(
        'UPDATE memory_index SET importance_tier = ?, updated_at = ? WHERE id = ?'
      ).run(check.newTier, new Date().toISOString(), memoryId);

      db.prepare(`
        INSERT INTO memory_promotion_audit
          (memory_id, previous_tier, new_tier, validation_count, promoted_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        memoryId,
        check.previousTier,
        check.newTier,
        check.validationCount,
        nowMs
      );

      return check;
    });

    const result = executePromotion();

    if (result.promoted) {
      console.warn(
        `[auto-promotion] Memory ${memoryId} promoted: ${check.previousTier} -> ${check.newTier} ` +
        `(${check.validationCount} validations)`
      );
    }

    return result;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[auto-promotion] executeAutoPromotion failed for memory ${memoryId}: ${msg}`);
    return {
      promoted: false,
      previousTier: 'unknown',
      newTier: 'unknown',
      validationCount: 0,
      reason: 'error',
    };
  }
}

/**
 * Batch check all memories for auto-promotion eligibility.
 * Returns a list of memories that qualify for promotion.
 * Does NOT modify the database -- read-only scan.
 *
 * @param db - SQLite database connection
 * @returns Array of promotion results for eligible memories
 */
export function scanForPromotions(db: Database): AutoPromotionResult[] {
  try {
    const rows = db.prepare(`
      SELECT id, importance_tier, validation_count
      FROM memory_index
      WHERE importance_tier IN ('normal', 'important')
        AND validation_count >= ?
    `).all(PROMOTE_TO_IMPORTANT_THRESHOLD) as Array<{
      id: number;
      importance_tier: string;
      validation_count: number;
    }>;

    const eligible: AutoPromotionResult[] = [];

    for (const row of rows) {
      const tier = row.importance_tier?.toLowerCase() || 'normal';
      const path = PROMOTION_PATHS[tier];
      if (!path) continue;

      const negativeValidationCount = getNegativeValidationCount(db, row.id);
      const positiveValidationCount = resolvePositiveValidationCount(
        row.validation_count ?? 0,
        negativeValidationCount
      );

      if (positiveValidationCount < path.threshold) continue;

      eligible.push({
        promoted: true,
        previousTier: tier,
        newTier: path.target,
        validationCount: positiveValidationCount,
        reason: `threshold_met: positive_validation_count=${positiveValidationCount}>=${path.threshold}`,
      });
    }

    return eligible;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[auto-promotion] scanForPromotions failed: ${msg}`);
    return [];
  }
}
