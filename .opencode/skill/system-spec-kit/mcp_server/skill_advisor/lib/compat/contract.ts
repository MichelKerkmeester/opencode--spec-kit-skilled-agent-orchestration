// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Compat Contract
// ───────────────────────────────────────────────────────────────

export const SKILL_ADVISOR_COMPAT_CONTRACT = {
  statusValues: ['ok', 'skipped', 'degraded', 'fail_open'] as const,
  disabledEnv: 'SPECKIT_SKILL_ADVISOR_HOOK_DISABLED',
  forceLocalEnv: 'SPECKIT_SKILL_ADVISOR_FORCE_LOCAL',
  defaults: {
    confidenceThreshold: 0.8,
    uncertaintyThreshold: 0.35,
  },
} as const;

export type SkillAdvisorCompatStatus = (typeof SKILL_ADVISOR_COMPAT_CONTRACT.statusValues)[number];
