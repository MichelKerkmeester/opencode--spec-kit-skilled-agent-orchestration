// ───────────────────────────────────────────────────────────────
// MODULE: Scorer Age Policy Seam
// ───────────────────────────────────────────────────────────────
// F-016-D1-07: Neutral scorer-policy seam for `applyAgeHaircutToLane`. The
// haircut implementation lives in `skill_advisor/lib/lifecycle/age-haircut`
// where it shares context with the rest of the lifecycle subsystem; the
// scorer lanes only need the policy result so they go through this seam
// instead of reaching across architectural lines into `lifecycle/`.

export { applyAgeHaircutToLane } from '../lifecycle/age-haircut.js';
