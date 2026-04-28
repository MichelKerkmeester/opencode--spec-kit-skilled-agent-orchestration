// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Scorer Weights Config
// ───────────────────────────────────────────────────────────────

import { z } from 'zod';
import {
  DEFAULT_SCORER_LANE_WEIGHTS,
  SCORER_LANE_IDS,
  SCORER_LANE_REGISTRY,
  isLiveScorerLane,
} from './lane-registry.js';
import type { ScorerLane } from './types.js';

export const EXPLICIT_AUTHOR_WEIGHT = DEFAULT_SCORER_LANE_WEIGHTS.explicit_author;
export const LEXICAL_WEIGHT = DEFAULT_SCORER_LANE_WEIGHTS.lexical;
export const GRAPH_CAUSAL_WEIGHT = DEFAULT_SCORER_LANE_WEIGHTS.graph_causal;
export const DERIVED_GENERATED_WEIGHT = DEFAULT_SCORER_LANE_WEIGHTS.derived_generated;
export const SEMANTIC_SHADOW_WEIGHT = DEFAULT_SCORER_LANE_WEIGHTS.semantic_shadow;

export const DEFAULT_SCORER_WEIGHTS = DEFAULT_SCORER_LANE_WEIGHTS as Readonly<Record<ScorerLane, number>>;

export const SCORER_LANES = SCORER_LANE_IDS;

export const ScorerWeightsSchema = z.object(Object.fromEntries(
  SCORER_LANE_REGISTRY.map((lane) => [lane.id, z.literal(lane.weight)]),
) as Record<ScorerLane, z.ZodLiteral<number>>).strict();

export type ScorerWeights = z.infer<typeof ScorerWeightsSchema>;

export function parseScorerWeights(input: unknown = DEFAULT_SCORER_WEIGHTS): ScorerWeights {
  return ScorerWeightsSchema.parse(input);
}

export function liveWeightTotal(weights: ScorerWeights = DEFAULT_SCORER_WEIGHTS): number {
  return SCORER_LANES.reduce((total, lane) => {
    if (!isLiveScorerLane(lane)) return total;
    return total + weights[lane];
  }, 0);
}
