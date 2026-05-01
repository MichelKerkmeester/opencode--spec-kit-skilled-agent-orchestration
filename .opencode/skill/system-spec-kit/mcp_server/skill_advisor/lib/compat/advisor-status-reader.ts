// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Status Reader Lib Seam
// ───────────────────────────────────────────────────────────────
// F-016-D1-04: Lib-level wrapper around `readAdvisorStatus` so advisor lib
// modules (notably `compat/daemon-probe.ts`) do not have to reach into the
// `skill_advisor/handlers/` directory to read the daemon's status. The
// existing handler implementation stays the source of truth; this module
// re-exports it from a path inside `skill_advisor/lib/` so the daemon-probe
// default reader depends inward on lib code.

export { readAdvisorStatus } from '../../handlers/advisor-status.js';
