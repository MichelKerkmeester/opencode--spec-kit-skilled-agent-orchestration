// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Ambiguity
// ───────────────────────────────────────────────────────────────

import type { AdvisorScoredRecommendation } from './types.js';

export const AMBIGUITY_MARGIN = 0.05;

export function isAmbiguousTopTwo(recommendations: readonly AdvisorScoredRecommendation[]): boolean {
  const passing = recommendations.filter((recommendation) => recommendation.passes_threshold);
  const [first, second] = passing;
  return !!first && !!second && Math.abs(first.confidence - second.confidence) <= AMBIGUITY_MARGIN + Number.EPSILON;
}

export function applyAmbiguity(
  recommendations: readonly AdvisorScoredRecommendation[],
): AdvisorScoredRecommendation[] {
  if (!isAmbiguousTopTwo(recommendations)) return [...recommendations];
  const passing = recommendations.filter((recommendation) => recommendation.passes_threshold);
  const [first, second] = passing;
  const ambiguousSet = new Set([first?.skill, second?.skill].filter((value): value is string => Boolean(value)));
  return recommendations.map((recommendation) => (
    ambiguousSet.has(recommendation.skill)
      ? {
        ...recommendation,
        ambiguousWith: [...ambiguousSet].filter((skill) => skill !== recommendation.skill),
      }
      : recommendation
  ));
}
