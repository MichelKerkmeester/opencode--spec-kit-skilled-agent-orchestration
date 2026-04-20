// ───────────────────────────────────────────────────────────────
// MODULE: Promotion Weight Delta Cap
// ───────────────────────────────────────────────────────────────

import type { PromotionLane, PromotionWeights } from '../../schemas/promotion-cycle.js';

export const MAX_PROMOTION_WEIGHT_DELTA = 0.05;

export interface WeightDeltaViolation {
  readonly lane: PromotionLane;
  readonly current: number;
  readonly candidate: number;
  readonly delta: number;
  readonly maxDelta: number;
}

export interface WeightDeltaCapResult {
  readonly accepted: boolean;
  readonly maxDelta: number;
  readonly violations: readonly WeightDeltaViolation[];
}

const PROMOTION_WEIGHT_KEYS = [
  'explicit_author',
  'lexical',
  'graph_causal',
  'derived_generated',
  'semantic_shadow',
  'learned_adaptive',
] as const satisfies readonly PromotionLane[];

function valueFor(weights: Partial<PromotionWeights>, lane: PromotionLane): number {
  return weights[lane] ?? 0;
}

export function enforceWeightDeltaCap(args: {
  readonly currentWeights: Partial<PromotionWeights>;
  readonly candidateWeights: Partial<PromotionWeights>;
  readonly maxDelta?: number;
}): WeightDeltaCapResult {
  const maxDelta = args.maxDelta ?? MAX_PROMOTION_WEIGHT_DELTA;
  const violations = PROMOTION_WEIGHT_KEYS
    .map((lane) => {
      const current = valueFor(args.currentWeights, lane);
      const candidate = valueFor(args.candidateWeights, lane);
      const delta = Number(Math.abs(candidate - current).toFixed(6));
      return { lane, current, candidate, delta, maxDelta };
    })
    .filter((item) => item.delta > maxDelta);

  return {
    accepted: violations.length === 0,
    maxDelta,
    violations,
  };
}

export function assertWeightDeltaCap(args: {
  readonly currentWeights: Partial<PromotionWeights>;
  readonly candidateWeights: Partial<PromotionWeights>;
  readonly maxDelta?: number;
}): void {
  const result = enforceWeightDeltaCap(args);
  if (!result.accepted) {
    const summary = result.violations
      .map((item) => `${item.lane}: ${item.current} -> ${item.candidate} (delta ${item.delta})`)
      .join(', ');
    throw new Error(`Promotion weight delta cap exceeded: ${summary}`);
  }
}

export { PROMOTION_WEIGHT_KEYS };
