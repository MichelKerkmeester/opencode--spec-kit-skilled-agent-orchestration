// ───────────────────────────────────────────────────────────────
// MODULE: Skill Lifecycle Status Canonical Values
// ───────────────────────────────────────────────────────────────
// F-018-D3-02: Single source of truth for the 4-value lifecycle status union
// used by the scorer, age-haircut, supersession, and skill-derived schemas.
// Previously each consumer hand-wrote `'active' | 'deprecated' | 'archived' |
// 'future'` so adding a new value required touching every site. Deriving
// types from this tuple via `typeof SKILL_LIFECYCLE_STATUS_VALUES[number]`
// surfaces drift as a compile error at the consumer site.

export const SKILL_LIFECYCLE_STATUS_VALUES = [
  'active',
  'deprecated',
  'archived',
  'future',
] as const;

export type SkillLifecycleStatus = (typeof SKILL_LIFECYCLE_STATUS_VALUES)[number];

export function isSkillLifecycleStatus(value: unknown): value is SkillLifecycleStatus {
  return typeof value === 'string'
    && (SKILL_LIFECYCLE_STATUS_VALUES as readonly string[]).includes(value);
}
