// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Scorer Weights Config
// ───────────────────────────────────────────────────────────────

import { z } from 'zod';
import type { ScorerLane } from './types.js';

export const EXPLICIT_AUTHOR_WEIGHT = 0.45;
export const LEXICAL_WEIGHT = 0.30;
export const GRAPH_CAUSAL_WEIGHT = 0.15;
export const DERIVED_GENERATED_WEIGHT = 0.15;
export const SEMANTIC_SHADOW_WEIGHT = 0.00;

export const DEFAULT_SCORER_WEIGHTS = {
  explicit_author: EXPLICIT_AUTHOR_WEIGHT,
  lexical: LEXICAL_WEIGHT,
  graph_causal: GRAPH_CAUSAL_WEIGHT,
  derived_generated: DERIVED_GENERATED_WEIGHT,
  semantic_shadow: SEMANTIC_SHADOW_WEIGHT,
} as const satisfies Record<ScorerLane, number>;

export const SCORER_LANES = [
  'explicit_author',
  'lexical',
  'graph_causal',
  'derived_generated',
  'semantic_shadow',
] as const satisfies readonly ScorerLane[];

export const ScorerWeightsSchema = z.object({
  explicit_author: z.literal(EXPLICIT_AUTHOR_WEIGHT),
  lexical: z.literal(LEXICAL_WEIGHT),
  graph_causal: z.literal(GRAPH_CAUSAL_WEIGHT),
  derived_generated: z.literal(DERIVED_GENERATED_WEIGHT),
  semantic_shadow: z.literal(SEMANTIC_SHADOW_WEIGHT),
}).strict();

export type ScorerWeights = z.infer<typeof ScorerWeightsSchema>;

export function parseScorerWeights(input: unknown = DEFAULT_SCORER_WEIGHTS): ScorerWeights {
  return ScorerWeightsSchema.parse(input);
}

export function liveWeightTotal(weights: ScorerWeights = DEFAULT_SCORER_WEIGHTS): number {
  return SCORER_LANES.reduce((total, lane) => {
    if (lane === 'semantic_shadow') return total;
    return total + weights[lane];
  }, 0);
}
