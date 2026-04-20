// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Lane Attribution
// ───────────────────────────────────────────────────────────────

import type { LaneContribution, ScorerLane } from './types.js';

export function dominantLane(contributions: readonly LaneContribution[]): ScorerLane | null {
  const live = contributions.filter((contribution) => !contribution.shadowOnly);
  const top = live.sort((left, right) => right.weightedScore - left.weightedScore)[0];
  return top?.lane ?? null;
}

export function attributionReason(contributions: readonly LaneContribution[]): string {
  const parts = contributions
    .filter((contribution) => contribution.rawScore > 0)
    .sort((left, right) => right.weightedScore - left.weightedScore)
    .slice(0, 4)
    .map((contribution) => {
      const evidence = contribution.evidence.slice(0, 2).join('; ');
      const suffix = contribution.shadowOnly ? ' shadow' : '';
      return `${contribution.lane}${suffix}=${contribution.rawScore.toFixed(2)}${evidence ? ` (${evidence})` : ''}`;
    });
  return parts.length > 0 ? `Matched lanes: ${parts.join(', ')}` : 'Matched lanes: none';
}

export function isDerivedDominant(contributions: readonly LaneContribution[]): boolean {
  const dominant = dominantLane(contributions);
  if (dominant !== 'derived_generated') return false;
  const derived = contributions.find((contribution) => contribution.lane === 'derived_generated')?.weightedScore ?? 0;
  const direct = contributions
    .filter((contribution) => contribution.lane === 'explicit_author' || contribution.lane === 'lexical')
    .reduce((total, contribution) => total + contribution.weightedScore, 0);
  return derived > 0 && derived >= direct;
}
