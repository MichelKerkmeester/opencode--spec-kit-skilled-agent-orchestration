// ───────────────────────────────────────────────────────────────
// MODULE: Promotion Rollback
// ───────────────────────────────────────────────────────────────

import type { PromotionWeights } from '../../schemas/promotion-cycle.js';

export interface RollbackTelemetryEvent {
  readonly event: 'promotion_rollback';
  readonly reason: string;
  readonly restoredWeights: PromotionWeights;
  readonly failedWeights: PromotionWeights;
  readonly cacheInvalidated: boolean;
  readonly rolledBackAt: string;
}

export interface RollbackTrace {
  readonly rolledBack: boolean;
  readonly reason: string;
  readonly restoredWeights: PromotionWeights;
  readonly failedWeights: PromotionWeights;
  readonly cacheInvalidated: boolean;
  readonly telemetry: RollbackTelemetryEvent;
}

export async function rollbackPromotion(args: {
  readonly reason: string;
  readonly previousWeights: PromotionWeights;
  readonly failedWeights: PromotionWeights;
  readonly applyWeights: (weights: PromotionWeights) => void | Promise<void>;
  readonly invalidateCache: () => void | Promise<void>;
  readonly emitTelemetry: (event: RollbackTelemetryEvent) => void | Promise<void>;
  readonly now?: () => string;
}): Promise<RollbackTrace> {
  await args.applyWeights(args.previousWeights);
  await args.invalidateCache();
  const telemetry: RollbackTelemetryEvent = {
    event: 'promotion_rollback',
    reason: args.reason,
    restoredWeights: args.previousWeights,
    failedWeights: args.failedWeights,
    cacheInvalidated: true,
    rolledBackAt: args.now?.() ?? new Date().toISOString(),
  };
  await args.emitTelemetry(telemetry);
  return {
    rolledBack: true,
    reason: args.reason,
    restoredWeights: args.previousWeights,
    failedWeights: args.failedWeights,
    cacheInvalidated: true,
    telemetry,
  };
}

export async function rollbackOnRegression(args: {
  readonly regressionDetected: boolean;
  readonly reason: string;
  readonly previousWeights: PromotionWeights;
  readonly failedWeights: PromotionWeights;
  readonly applyWeights: (weights: PromotionWeights) => void | Promise<void>;
  readonly invalidateCache: () => void | Promise<void>;
  readonly emitTelemetry: (event: RollbackTelemetryEvent) => void | Promise<void>;
  readonly now?: () => string;
}): Promise<RollbackTrace | null> {
  if (!args.regressionDetected) return null;
  return rollbackPromotion(args);
}
