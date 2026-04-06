---
title: "Verification Checklist: Cache-Warning Hook System [template:level_3/checklist.md]"
description: "Verification Date: [YYYY-MM-DD]"
trigger_phrases:
  - "verification"
  - "checklist"
  - "cache warning"
  - "replay harness"
  - "decision record"
importance_tier: "normal"
contextType: "planning"
---
# Verification Checklist: Cache-Warning Hook System

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `spec.md` complete with all 6 phases and citations
- [ ] CHK-002 [P0] `plan.md` has Phase A-F with concrete file paths and acceptance
- [ ] CHK-003 [P0] `research.md` pointer present with F4-F8, F19-F20, F22, F24 mapping
- [ ] CHK-004 [P0] Replay harness design documented in `plan.md` §4 Phase B
- [ ] CHK-005 [P1] Build pipeline (TS -> dist) understood and documented in `plan.md` §3
- [ ] CHK-006 [P0] `compact-inject.ts` boundary documented as "unchanged" hard rule
- [ ] CHK-007 [P1] Sequential build order A -> F is documented as mandatory, not parallelizable
- [ ] CHK-008 [P1] `decision-record.md` scope is reserved for four ADRs before implementation begins
- [ ] CHK-009 [P2] `implementation-summary.md` is explicitly deferred until after delivery
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `tsc --noEmit` passes for all extended hook files
- [ ] CHK-011 [P0] All new TS code uses strict mode types (no `any`)
- [ ] CHK-012 [P0] No `console.log`; use existing `hookLog()` utility
- [ ] CHK-013 [P1] Error paths return `null` or exit `0` gracefully; hooks must not crash
- [ ] CHK-014 [P0] No new dependencies added to `package.json`
- [ ] CHK-015 [P0] `HookState` schema extension remains additive-only, with no schema-version or migration layer introduced
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Replay harness runs against ALL 4 hook entry points
- [ ] CHK-021 [P0] Side-effect detection asserts zero writes outside `TMPDIR`
- [ ] CHK-022 [P0] `source=compact` suppression test passes
- [ ] CHK-023 [P0] `source=clear` suppression test passes
- [ ] CHK-024 [P0] Soft-block fires exactly once per idle window
- [ ] CHK-025 [P0] Acknowledgement persists across resend
- [ ] CHK-026 [P1] Missing `lastClaudeTurnAt` -> graceful no-op (not a crash)
- [ ] CHK-027 [P1] Malformed timestamp -> graceful no-op
- [ ] CHK-028 [P0] `source=resume` stale-threshold replay test emits the warning only when the idle gap exceeds the configured threshold
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] No prompt content logged to disk
- [ ] CHK-032 [P1] State files mode `0o600` (existing pattern, verify preserved)
- [ ] CHK-033 [P1] State directory mode `0o700` (existing pattern, verify preserved)
- [ ] CHK-034 [P0] Replay validation does not mutate live `.claude/settings.local.json` or any state path outside the replay sandbox
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` synchronized
- [ ] CHK-041 [P1] Inline code comments cite finding IDs (`F4`, `F19`, etc.) where relevant
- [ ] CHK-042 [P2] `CLAUDE.md` updated if operator-facing rule emerges
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Findings saved to memory/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 25 | [ ]/25 |
| P1 Items | 17 | [ ]/17 |
| P2 Items | 8 | [ ]/8 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] `decision-record.md` has ADRs for prototype-only gating, sequential build order, `compact-inject` boundary, and replay isolation
- [ ] CHK-101 [P0] All ADRs Status=`Accepted` (or `Proposed` if pending)
- [ ] CHK-102 [P1] Five Checks evaluation present in each ADR
- [ ] CHK-103 [P0] ADR-001 explicitly records the sequential A -> F build order and why parallel execution was rejected
- [ ] CHK-104 [P0] ADR-002 explicitly rejects `compact-inject.ts` as the warning owner
- [ ] CHK-105 [P0] ADR-003 makes replay isolation a hard prerequisite for Phase C-F validation
- [ ] CHK-106 [P0] ADR-004 records env kill-switch gating and observe-only defaults where possible
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P2] Hook execution stays under existing `3s` and `10s` timeouts in `.claude/settings.local.json`
- [ ] CHK-111 [P2] Replay harness completes a 4-hook suite in `<5s`
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback plan present in `plan.md` §7 covering all 6 phases
- [ ] CHK-121 [P0] Env kill-switches documented for Phase E and Phase F
- [ ] CHK-122 [P1] Default values ship in observe-only mode where possible
- [ ] CHK-123 [P1] `UserPromptSubmit` hook entry documented for `settings.local.json` (not auto-applied)
- [ ] CHK-124 [P0] Compiled `dist` hook outputs are rebuilt before any runtime enablement or replay result is treated as final
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] No undocumented Claude JSONL parsing introduced (`F16` boundary)
- [ ] CHK-131 [P1] No new dependency licenses to review
- [ ] CHK-132 [P2] Source discrepancies (`F13` and `F21`) preserved in any future docs
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec docs synchronized
- [ ] CHK-141 [P1] `implementation-summary.md` completed AFTER delivery (per `CLAUDE.md` rule)
- [ ] CHK-142 [P2] Memory context saved post-implementation
- [ ] CHK-143 [P2] No template placeholders remain in the final spec-doc set
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [Name] | Technical Lead | [ ] Approved | |
| [Name] | Product Owner | [ ] Approved | |
| [Name] | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
