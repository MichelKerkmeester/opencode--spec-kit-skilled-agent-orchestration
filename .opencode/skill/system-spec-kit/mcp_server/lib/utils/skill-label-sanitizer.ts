// ───────────────────────────────────────────────────────────────
// MODULE: Skill Label Sanitizer Neutral Utility
// ───────────────────────────────────────────────────────────────
// F-016-D1-02: Neutral seam for `sanitizeSkillLabel` so the shared payload
// contract (and other cross-cutting payload consumers) do not have to import
// advisor renderer internals just to sanitize a string. The advisor renderer
// implementation stays the source of truth; this module re-exports it from
// a neutral path so high-level payload code depends inward on `lib/utils/`
// instead of crossing into `skill_advisor/lib/render`.

export { sanitizeSkillLabel } from '../../skill_advisor/lib/render.js';
