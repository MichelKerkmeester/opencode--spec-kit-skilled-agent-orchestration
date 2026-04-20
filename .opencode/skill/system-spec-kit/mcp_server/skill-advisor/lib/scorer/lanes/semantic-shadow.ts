// ───────────────────────────────────────────────────────────────
// MODULE: Semantic Shadow Lane
// ───────────────────────────────────────────────────────────────

import type { AdvisorProjection, LaneMatch } from '../types.js';
import { scoreTokenOverlap, tokenize } from '../text.js';

export function scoreSemanticShadowLane(prompt: string, projection: AdvisorProjection): LaneMatch[] {
  const tokens = tokenize(prompt);
  return projection.skills
    .map((skill) => ({
      skillId: skill.id,
      lane: 'semantic_shadow' as const,
      score: Math.min(scoreTokenOverlap(tokens, [
        skill.name,
        skill.description,
        ...skill.domains,
        ...skill.intentSignals,
        ...skill.derivedTriggers,
      ]) * 0.8, 1),
      evidence: ['shadow:token-overlap'],
      shadowOnly: true,
    }))
    .filter((match) => match.score > 0.08);
}
