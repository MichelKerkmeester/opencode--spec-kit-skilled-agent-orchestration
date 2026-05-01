// ───────────────────────────────────────────────────────────────
// MODULE: Derived Generated Lane
// ───────────────────────────────────────────────────────────────

// F-016-D1-07: Pull the age-haircut policy from the scorer-local seam
// instead of reaching into the lifecycle subsystem directly. The lifecycle
// implementation stays the source of truth; the seam keeps the scorer's
// dependency direction inward.
import { applyAgeHaircutToLane } from '../age-policy.js';
import type { NormalizedAffordance } from '../../affordance-normalizer.js';
import type { AdvisorProjection, LaneMatch } from '../types.js';
import { matchesPhraseBoundary, phraseSpecificity, scoreTokenOverlap, tokenize } from '../text.js';

function affordancesForSkill(
  affordances: readonly NormalizedAffordance[],
  skillId: string,
): NormalizedAffordance[] {
  return affordances.filter((affordance) => affordance.skillId === skillId);
}

export function scoreDerivedLane(
  prompt: string,
  projection: AdvisorProjection,
  now: Date = new Date(),
  affordances: readonly NormalizedAffordance[] = [],
): LaneMatch[] {
  const lower = prompt.toLowerCase();
  const tokens = tokenize(prompt);
  const matches: LaneMatch[] = [];

  for (const skill of projection.skills) {
    const phrases = [...skill.derivedTriggers, ...skill.derivedKeywords];
    const skillAffordances = affordancesForSkill(affordances, skill.id);
    const affordancePhrases = skillAffordances.flatMap((affordance) => [...affordance.derivedTriggers]);
    if (phrases.length === 0 && affordancePhrases.length === 0) continue;
    const evidence: string[] = [];
    let score = 0;
    for (const phrase of phrases) {
      if (!matchesPhraseBoundary(lower, phrase)) continue;
      score += phraseSpecificity(phrase) * 0.7;
      evidence.push(`derived:${phrase}`);
    }
    for (const affordance of skillAffordances) {
      let matched = false;
      for (const phrase of affordance.derivedTriggers) {
        if (!matchesPhraseBoundary(lower, phrase)) continue;
        matched = true;
        score += phraseSpecificity(phrase) * 0.45;
      }
      if (matched) evidence.push(affordance.evidenceLabel);
    }
    score += scoreTokenOverlap(tokens, phrases) * 0.45;
    score += scoreTokenOverlap(tokens, affordancePhrases) * 0.25;
    const adjusted = applyAgeHaircutToLane(
      { trustLane: 'derived_generated', score: Math.min(score, 1) },
      {
        generatedAt: projection.generatedAt,
        now,
        lifecycleStatus: skill.lifecycleStatus,
      },
    );
    if (adjusted.score <= 0.05) continue;
    matches.push({
      skillId: skill.id,
      lane: 'derived_generated',
      score: Number((adjusted.score * (skill.derivedDemotion ?? 1)).toFixed(6)),
      evidence: evidence.slice(0, 6),
    });
  }

  return matches;
}
