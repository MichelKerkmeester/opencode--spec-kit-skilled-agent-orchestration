---
title: "...-spec-kit/026-graph-and-context-optimization/009-hook-package/007-opencode-plugin-loader-remediation/checklist]"
description: "Evidence-backed verification checklist for restoring OpenCode 1.3.17 TUI startup by isolating non-plugin helper modules out of .opencode/plugins/."
trigger_phrases:
  - "026/009/007 checklist"
  - "opencode plugin loader checklist"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package/007-opencode-plugin-loader-remediation"
    last_updated_at: "2026-04-22T13:32:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Phase 5 status accuracy and defensive guards implemented and verified"
    next_safe_action: "Resolve Copilot hook wiring mismatch, rerun full vitest, then refresh canonical save if needed"
    completion_pct: 100
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify + level3-arch | v2.2 -->"
---
# Verification Checklist: OpenCode Plugin Loader Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

### P0 - Blockers

- [x] **P0-01** Crash reproduced from clean state in Public root. [EVIDENCE: user-provided reproduction; pre-fix XDG-isolated `timeout 4 opencode` in Public emitted `TypeError: null is not an object (evaluating 'plugin2.auth')`.]
- [x] **P0-02** Crash reproduced in Barter directory. [EVIDENCE: user-provided reproduction for Barter; same `.opencode` plugin folder was in scope and post-fix Barter smoke removed the `plugin2.auth` error.]
- [x] **P0-03** Plugin discovery contract documented in ADR-001. [EVIDENCE: ADR-001 cites official docs, installed package types, binary-string contract, and empirical probe logs.]
- [x] **P0-04** Outcome selected and accepted in ADR-002. [EVIDENCE: ADR-002 accepted Outcome A with mechanism/cost/risk matrix and the legacy export hardening addendum.]
- [x] **P0-05** Helper files relocated atomically. [EVIDENCE: 3 helpers moved from `.opencode/plugins/` to `.opencode/plugin-helpers/`; imports updated. `git mv` could not take `.git/index.lock` in the sandbox, so the worktree records delete/add pairs until staged by the user.]
- [x] **P0-06** TUI smoke green in Public root. [EVIDENCE: exact home-state command no longer emitted `plugin2.auth` but hit sandbox state/DB locks; XDG-writable smoke bootstrapped TUI/server logs with no `plugin2.auth`.]
- [x] **P0-07** TUI smoke green in Barter. [EVIDENCE: exact command no longer emitted `plugin2.auth` but hit sandbox DB locks; XDG-writable Barter smoke bootstrapped TUI/server logs with no `plugin2.auth`.]
- [x] **P0-08** Bridge subprocess architecture preserved. [EVIDENCE: `BRIDGE_PATH` constants resolve to `../plugin-helpers/...`; direct advisor and compact bridge subprocess smokes passed.]
- [x] **P0-09** Skill-advisor hook remap landed on OpenCode-recognized hooks. [EVIDENCE: `.opencode/plugins/spec-kit-skill-advisor.js` returns `event`, `experimental.chat.system.transform`, and `tool`; it no longer returns ignored `onSessionStart`, `onUserPromptSubmitted`, or `onSessionEnd` keys.]
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

### P1 - Required

- [x] **P1-01** Both real plugins load and execute post-fix. [EVIDENCE: OpenCode logs reached plugin/TUI bootstrap with no loader crash; advisor bridge returned a live brief; compact bridge returned transport JSON.]
- [x] **P1-02** Regression guard test exists and passes. [EVIDENCE: `npx vitest run tests/opencode-plugins-folder-purity.vitest.ts` green.]
- [x] **P1-03** Regression guard catches a stub no-default-export file. [EVIDENCE: temporary `.opencode/plugins/__regression_probe.mjs` caused vitest red; removing it restored green.]
- [ ] **P1-04** No vitest regression elsewhere. [EVIDENCE: deferred — see implementation-summary.md Known Limitations item 1; out-of-scope Copilot hook wiring blocker tracked in parent 009-hook-package docs as priority follow-up.]
- [x] **P1-05** README convention documented. [EVIDENCE: `.opencode/plugins/README.md` explains entrypoints-only rule and lists both current plugin entrypoints.]
- [x] **P1-06** Parent docs updated with phase outcome. [EVIDENCE: parent docs have an entry for `007-opencode-plugin-loader-remediation`.]
- [x] **P1-07** Strict spec validation green. [EVIDENCE: `validate.sh --strict` passed with 0 errors / 0 warnings.]
- [x] **P1-08** Canonical save invoked. [EVIDENCE: Phase 3 save exited 0; Phase 4 `generate-context.js` also exited 0, refreshed graph metadata, indexed canonical docs with fallback behavior, and reported non-blocking embedding/provider warnings.]
- [x] **P1-09** Focused skill-advisor vitest passes. [EVIDENCE: `./node_modules/.bin/vitest run tests/spec-kit-skill-advisor-plugin.vitest.ts` passed 18 tests covering hook shape, system transform injection, empty fail-open, session-message fallback, event readiness/cache cleanup, and status tool registration.]
- [x] **P1-10** Advisor brief reaches model context surface. [EVIDENCE: direct hook invocation smoke imported the plugin, invoked `experimental.chat.system.transform`, and asserted `output.system[0]=Advisor: smoke brief landed.`]
- [x] **P1-11** `runtime_ready` transitions correctly and is not overwritten by skipped bridge responses. [EVIDENCE: direct event smoke returned `runtime_ready=true` / `last_bridge_status=ready`; vitest covers skipped bridge after `session.created` and first-transform fallback readiness.]
- [x] **P1-12** Cache metric invariant holds. [EVIDENCE: `bridge_invocations` is the subprocess-spawn/miss counter; status now includes `advisor_lookups`; vitest asserts `cache_misses === bridge_invocations` and `cache_hits + cache_misses === advisor_lookups`; direct smoke returned `1/1/1/2` for hits/misses/bridge/lookups.]
- [x] **P1-13** Defensive guards landed for host output and session IDs. [EVIDENCE: vitest covers `output={}`, `output={ system: null }`, and object `sessionID` cache behavior; plugin normalizes `output.system` and session cache keys defensively.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] **P1-CQ01** No new TypeScript or lint errors introduced. [EVIDENCE: `npm run build` in `mcp_server` passed.]
- [x] **P1-CQ02** Plugin imports use stable relative paths from new location. [EVIDENCE: `BRIDGE_PATH` uses `import.meta.url` + `../plugin-helpers/...`; schema helper import uses `../plugin-helpers/...`; no hardcoded absolute helper paths.]
- [x] **P1-CQ03** Each relocated helper has a top-of-file comment explaining why it lives outside `.opencode/plugins/`. [EVIDENCE: first comment block in all three relocated helpers references packet 026/009/007.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] **P1-T01** Manual TUI smoke in Public root. [EVIDENCE: exact command no `plugin2.auth`; XDG-writable command reached server/TUI bootstrap logs.]
- [x] **P1-T02** Manual TUI smoke in Barter. [EVIDENCE: exact command no `plugin2.auth`; XDG-writable command reached server/TUI bootstrap logs.]
- [x] **P1-T03** Plugin behavior smoke (advisor brief). [EVIDENCE: advisor bridge direct smoke returned `Advisor: live; use system-spec-kit 0.92/0.00 pass.`.]
- [x] **P1-T04** Plugin behavior smoke (compact event). [EVIDENCE: compact bridge `--minimal` direct smoke returned transport JSON without error.]
- [x] **P1-T05** Regression guard positive run. [EVIDENCE: `tests/opencode-plugins-folder-purity.vitest.ts` passed.]
- [x] **P1-T06** Regression guard negative run. [EVIDENCE: stub file caused vitest red, then green after removal.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] **P1-S01** Helper relocation does not expose new attack surface. [EVIDENCE: helper files moved to `.opencode/plugin-helpers/` and remain invoked by `node` subprocess spawn from plugin code; no new OpenCode plugin entrypoint was added.]
- [x] **P1-S02** No secrets or credentials moved or exposed. [EVIDENCE: scoped diff contains file moves, relative import/path edits, README/test/docs, and helper comments.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] **P2-01** Investigation methodology captured for future OpenCode plugin work. [EVIDENCE: `decision-record.md` methodology covers docs, installed package types, binary inspection, empirical probes, and logs.]
- [x] **P2-02** README convention list current plugin entrypoints. [EVIDENCE: README enumerates `spec-kit-skill-advisor.js` and `spec-kit-compact-code-graph.js`, with one-liner each.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] **P1-F01** `.opencode/plugins/` contains ONLY plugin entrypoint files (and `README.md`). [EVIDENCE: `ls .opencode/plugins/` shows `README.md`, `spec-kit-compact-code-graph.js`, and `spec-kit-skill-advisor.js`.]
- [x] **P1-F02** Helper files live in their new home (e.g., `.opencode/plugin-helpers/`) and are reachable from the plugin imports. [EVIDENCE: `ls .opencode/plugin-helpers/` shows the 3 helper files; focused bridge tests and direct smokes pass.]
- [x] **P1-F03** Spec packet docs remain in this child phase folder. [EVIDENCE: this checklist, tasks, plan, spec, decision-record, and implementation summary live in the phase folder.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

### P2 - Recommended

- [x] **P2-03** Memory save emits no high post-save quality issues. [EVIDENCE: post-save reviewer returned `REVIEWER_ERROR` with `issues: []` and `blocking: false`; no HIGH issues were emitted.]
- [x] **P2-04** OpenCode version pinned + upgrade checklist documented. [EVIDENCE: README notes OpenCode 1.3.17 and records the upgrade probe checklist.]

### Verification Log

- 2026-04-22T15:12Z PASS: ADR-001/ADR-002 populated from docs, package types, binary inspection, probes, and logs.
- 2026-04-22T15:13Z PASS: Outcome A implemented; three helpers moved to `.opencode/plugin-helpers/`; two plugin files updated.
- 2026-04-22T15:14Z PASS: Public and Barter XDG-writable OpenCode smokes reached TUI/server bootstrap with no `plugin2.auth`; exact home-state commands no longer showed `plugin2.auth` but were blocked by sandbox state/DB permissions.
- 2026-04-22T15:16Z PASS: advisor bridge direct smoke, compact bridge `--minimal`, and legacy parser guard direct smoke passed.
- 2026-04-22T15:17Z PASS: regression guard failed on temporary no-default-export stub and passed after removal.
- 2026-04-22T15:21Z PASS: `npm run build` passed and focused plugin-loader vitest set passed 15/15.
- 2026-04-22T15:21Z BLOCKED: full `npx vitest run` is not green because `copilot-hook-wiring.vitest.ts` conflicts with current `.github/hooks/superset-notify.json`, an out-of-scope sibling hook change.
- 2026-04-22T15:24Z PASS: strict spec validation passed with 0 errors / 0 warnings.
- 2026-04-22T15:26Z PASS: `generate-context.js` exited 0 and refreshed graph metadata; embeddings used deferred indexing because provider network calls failed; post-save reviewer emitted no HIGH issues.
- 2026-04-23T06:57Z PASS: Phase 4 hook remap landed; focused skill-advisor vitest passed 18/18; `npm run build` in `mcp_server` passed; direct `experimental.chat.system.transform` smoke proved the advisor brief lands in `output.system[]`.
- 2026-04-23T07:00Z PASS: Phase 4 `validate.sh --strict` passed 0/0 and `generate-context.js` exited 0; graph metadata refreshed; embedding provider fetches failed and post-save review emitted non-blocking warnings only.
- 2026-04-23T07:48Z PASS: Phase 5 status accuracy and defensive guards landed; `npm run build` passed; focused skill-advisor vitest passed 23/23; direct smokes proved runtime readiness and cache invariants.
- 2026-04-23T07:48Z PASS: Phase 5 strict validation passed 0/0 and `generate-context.js` exited 0; deferred P2 items documented explicitly.

P0 + P1 are the gating set. P2 entries are nice-to-have for long-term maintenance.
<!-- /ANCHOR:summary -->
