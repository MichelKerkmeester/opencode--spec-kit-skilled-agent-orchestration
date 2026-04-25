// ───────────────────────────────────────────────────────────────
// MODULE: Derived Generated Lane
// ───────────────────────────────────────────────────────────────

import { applyAgeHaircutToLane } from '../../lifecycle/age-haircut.js';
import type { AdvisorProjection, LaneMatch } from '../types.js';
import { matchesPhraseBoundary, phraseSpecificity, scoreTokenOverlap, tokenize } from '../text.js';

export function scoreDerivedLane(prompt: string, projection: AdvisorProjection, now: Date = new Date()): LaneMatch[] {
  const lower = prompt.toLowerCase();
  const tokens = tokenize(prompt);
  const matches: LaneMatch[] = [];

  for (const skill of projection.skills) {
    const phrases = [...skill.derivedTriggers, ...skill.derivedKeywords];
    if (phrases.length === 0) continue;
    const evidence: string[] = [];
    let score = 0;
    for (const phrase of phrases) {
      if (!matchesPhraseBoundary(lower, phrase)) continue;
      score += phraseSpecificity(phrase) * 0.7;
      evidence.push(`derived:${phrase}`);
    }
    score += scoreTokenOverlap(tokens, phrases) * 0.45;
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
