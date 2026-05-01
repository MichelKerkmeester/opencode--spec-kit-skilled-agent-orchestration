// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Ambiguity
// ───────────────────────────────────────────────────────────────

import type { AdvisorScoredRecommendation } from './types.js';

export const AMBIGUITY_MARGIN = 0.05;

// F-012-C2-04: Compute ambiguity from ranking `score` rather than `confidence`.
// The ranking sort in fusion.ts uses `score`, so computing ambiguity on a
// different field created a contradiction (top-two by confidence may not be
// top-two by score). Computing on `score` keeps the comparison surface
// aligned with the ranking surface. Additionally, the cluster now includes
// every passing candidate within AMBIGUITY_MARGIN of the top score — three-
// way and deeper ties become visible to the caller via `ambiguousWith`.

function ambiguousCluster(
  recommendations: readonly AdvisorScoredRecommendation[],
): AdvisorScoredRecommendation[] {
  const passing = recommendations.filter((recommendation) => recommendation.passes_threshold);
  const [top] = passing;
  if (!top) return [];
  return passing.filter((recommendation) => (
    Math.abs(top.score - recommendation.score) <= AMBIGUITY_MARGIN + Number.EPSILON
  ));
}

export function isAmbiguousTopTwo(recommendations: readonly AdvisorScoredRecommendation[]): boolean {
  // Name preserved for back-compat with existing call sites; semantics are
  // now "is the passing top a member of an ambiguity cluster of size >= 2".
  return ambiguousCluster(recommendations).length >= 2;
}

export function applyAmbiguity(
  recommendations: readonly AdvisorScoredRecommendation[],
): AdvisorScoredRecommendation[] {
  const cluster = ambiguousCluster(recommendations);
  if (cluster.length < 2) return [...recommendations];
  const ambiguousSet = new Set(cluster.map((recommendation) => recommendation.skill));
  return recommendations.map((recommendation) => (
    ambiguousSet.has(recommendation.skill)
      ? {
        ...recommendation,
        ambiguousWith: [...ambiguousSet].filter((skill) => skill !== recommendation.skill),
      }
      : recommendation
  ));
}
