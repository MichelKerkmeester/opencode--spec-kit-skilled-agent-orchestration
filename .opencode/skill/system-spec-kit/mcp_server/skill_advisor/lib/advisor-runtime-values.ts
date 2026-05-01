// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Runtime Canonical Values
// ───────────────────────────────────────────────────────────────
// F-018-D3-03: Single source of truth for the advisor runtime label set.
// Skill-advisor-brief, hook prompts, metrics, and tests all derive their
// runtime union from this tuple via `typeof ADVISOR_RUNTIME_VALUES[number]`.
// Adding a new runtime (e.g. a future provider) requires changing only this
// tuple; downstream type unions and runtime guards inherit the change.

export const ADVISOR_RUNTIME_VALUES = [
  'claude',
  'gemini',
  'copilot',
  'codex',
] as const;

export type AdvisorRuntime = (typeof ADVISOR_RUNTIME_VALUES)[number];

export function isAdvisorRuntime(value: unknown): value is AdvisorRuntime {
  return typeof value === 'string'
    && (ADVISOR_RUNTIME_VALUES as readonly string[]).includes(value);
}
