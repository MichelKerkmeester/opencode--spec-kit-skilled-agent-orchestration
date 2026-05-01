// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Trust State Canonical Values
// ───────────────────────────────────────────────────────────────
// F-018-D3-01: Single source of truth for the 4-value caller-trust axis used
// by every freshness producer (advisor, hook brief, code-graph handlers).
// Schemas, runtime guards, type unions, and metric labels all derive from
// this tuple via `typeof SKILL_GRAPH_TRUST_STATE_VALUES[number]` so adding or
// removing a value triggers a TypeScript compile error wherever the
// vocabulary is consumed.

export const SKILL_GRAPH_TRUST_STATE_VALUES = [
  'live',
  'stale',
  'absent',
  'unavailable',
] as const;

export type SkillGraphTrustState = (typeof SKILL_GRAPH_TRUST_STATE_VALUES)[number];

export function isSkillGraphTrustState(value: unknown): value is SkillGraphTrustState {
  return typeof value === 'string'
    && (SKILL_GRAPH_TRUST_STATE_VALUES as readonly string[]).includes(value);
}
