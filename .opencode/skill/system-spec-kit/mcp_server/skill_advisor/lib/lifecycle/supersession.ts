// ───────────────────────────────────────────────────────────────
// MODULE: Supersession Routing
// ───────────────────────────────────────────────────────────────

import { sanitizeEnvelopeSkillLabel } from '../derived/sanitizer.js';
// F-018-D3-02: derive lifecycle status from the canonical tuple in
// status-values.ts so this module's hand-written union cannot drift.
import type { SkillLifecycleStatus } from './status-values.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface SupersessionEntry {
  readonly skillId: string;
  readonly lifecycleStatus?: SkillLifecycleStatus;
  readonly redirectTo?: string | null;
  readonly redirectFrom?: readonly string[];
  readonly score: number;
}

export interface RoutedSupersessionEntry extends SupersessionEntry {
  readonly routable: boolean;
  readonly redirect_to?: string;
  readonly redirect_from?: readonly string[];
  readonly reason: 'successor-default' | 'explicit-deprecated-redirect' | 'active' | 'non-routable';
}

// ───────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────

function promptMentions(prompt: string, skillId: string): boolean {
  const normalizedPrompt = prompt.toLowerCase();
  const normalizedSkill = skillId.toLowerCase();
  return normalizedPrompt.includes(normalizedSkill);
}

export function routeSupersession(
  prompt: string,
  entries: readonly SupersessionEntry[],
): RoutedSupersessionEntry[] {
  const successors = new Set(entries.map((entry) => entry.redirectTo).filter((value): value is string => Boolean(value)));

  return entries.map((entry) => {
    const redirectTo = entry.redirectTo ? sanitizeEnvelopeSkillLabel(entry.redirectTo) : null;
    const redirectFrom = entry.redirectFrom
      ?.map((value) => sanitizeEnvelopeSkillLabel(value))
      .filter((value): value is string => Boolean(value));
    const isDeprecated = entry.lifecycleStatus === 'deprecated' || Boolean(redirectTo);
    if (isDeprecated && promptMentions(prompt, entry.skillId)) {
      return {
        ...entry,
        routable: true,
        redirect_to: redirectTo ?? undefined,
        redirect_from: redirectFrom,
        reason: 'explicit-deprecated-redirect' as const,
      };
    }
    if (isDeprecated) {
      return {
        ...entry,
        routable: false,
        redirect_to: redirectTo ?? undefined,
        redirect_from: redirectFrom,
        reason: 'non-routable' as const,
      };
    }
    return {
      ...entry,
      routable: true,
      redirect_from: redirectFrom,
      reason: successors.has(entry.skillId) ? 'successor-default' as const : 'active' as const,
    };
  }).sort((left, right) => Number(right.routable) - Number(left.routable) || right.score - left.score);
}
