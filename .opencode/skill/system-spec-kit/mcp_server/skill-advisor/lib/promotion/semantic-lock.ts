// ───────────────────────────────────────────────────────────────
// MODULE: Promotion Semantic Lock
// ───────────────────────────────────────────────────────────────

import type { PromotionWeights } from '../../schemas/promotion-cycle.js';

export interface SemanticLockResult {
  readonly accepted: boolean;
  readonly semanticWeight: number;
  readonly reason: string;
}

export function assertSemanticLiveWeightLocked(
  weights: Partial<PromotionWeights>,
  options: { readonly firstPromotionWave?: boolean } = {},
): SemanticLockResult {
  const firstPromotionWave = options.firstPromotionWave ?? true;
  const semanticWeight = weights.semantic_shadow ?? 0;
  if (firstPromotionWave && semanticWeight !== 0) {
    return {
      accepted: false,
      semanticWeight,
      reason: 'semantic_shadow live weight must remain exactly 0.00 through the first promotion wave',
    };
  }
  return {
    accepted: true,
    semanticWeight,
    reason: 'semantic_shadow live weight remains locked at 0.00',
  };
}

export function requireSemanticLiveWeightLocked(
  weights: Partial<PromotionWeights>,
  options: { readonly firstPromotionWave?: boolean } = {},
): void {
  const result = assertSemanticLiveWeightLocked(weights, options);
  if (!result.accepted) throw new Error(result.reason);
}
