---
title: "Verification Checklist: Start-into-Plan Merger"
description: "Verification rows across pre-impl, shared-module, command refactors, atomic sweep, closeout. P0 blockers, P1 required, P2 optional."
trigger_phrases:
  - "start into plan checklist"
  - "merger verification"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-start-into-plan-merger"
    last_updated_at: "2026-04-15T00:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Authored Level 3 checklist with CHK rows across required template sections"
    next_safe_action: "Verify items as implementation progresses through milestones"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:pending-first-implementation-run"
      session_id: "plan-authoring-2026-04-15"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Start-into-Plan Merger

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

- [ ] CHK-001 [P0] Requirements documented in spec (REQ-001 through REQ-017)
- [ ] CHK-002 [P0] Technical approach defined in plan (architecture + phases + critical path)
- [ ] CHK-003 [P0] ADRs authored in decision-record (ADR-001 through ADR-009)
- [ ] CHK-004 [P1] M0 audit output reconciled against spec §3 Files-to-Change
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

Shared intake module quality verification (M1).

- [ ] CHK-010 [P0] Shared intake-contract authored with all five folder states (empty-folder, partial-folder, repair-mode, placeholder-upgrade, populated-folder)
- [ ] CHK-011 [P0] All four repair modes covered (create, repair-metadata, resolve-placeholders, abort)
- [ ] CHK-012 [P0] Staged canonical-trio publication specified (temp + rename, fail-closed)
- [ ] CHK-013 [P0] Intake lock contract documented (scope: Step 1 only; fail-closed on contention)
- [ ] CHK-014 [P1] Manual relationships capture with packet_id dedup specified
- [ ] CHK-015 [P1] Resume semantics (resume_question_id, reentry_reason) specified
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

Command refactor and integration verification (M2, M3, M4).

- [ ] CHK-020 [P0] plan.md Step 1 references shared module with zero inline duplication (verified via grep for intake-contract reference + grep absence of five-state class list inside plan.md)
- [ ] CHK-021 [P0] complete.md Section 0 references shared module with zero inline duplication (same verification pattern)
- [ ] CHK-022 [P0] `--intake-only` flag halts `/spec_kit:plan` after Step 1 (manual test T039 PASS)
- [ ] CHK-023 [P0] resume.md routes intake re-entry reasons to `/spec_kit:plan --intake-only` (manual test T042 PASS)
- [ ] CHK-024 [P1] `:with-phases` pre-workflow unaffected by plan.md Step 1 changes (regression test T040)
- [ ] CHK-025 [P1] `/spec_kit:plan --intake-only` is idempotent (test T043 PASS)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

Atomic sweep and deletion verification (M5).

- [ ] CHK-030 [P0] start command file deleted; not in repo
- [ ] CHK-031 [P0] Both YAML assets deleted (spec_kit_start_auto + spec_kit_start_confirm)
- [ ] CHK-032 [P0] Gemini CLI routing file (start.toml) deleted
- [ ] CHK-033 [P0] Harness skill registry entry for `spec_kit:start` removed (harness skill list no longer surfaces it)
- [ ] CHK-034 [P0] Grep sweep: zero `/spec_kit:start` refs in forward-looking docs (historical changelog + closed 012 internals excluded)
- [ ] CHK-035 [P0] Closed packet 012 diff is empty (`git diff` against 012 folder returns nothing)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] All 015 canonical docs pass `validate.sh --strict`
- [ ] CHK-041 [P0] All 015 canonical docs pass sk-doc DQI validator
- [ ] CHK-042 [P1] Changelog entry authored at system-spec-kit changelog folder with migration note
- [ ] CHK-043 [P1] Root README command-graph reflects new architecture (lines 876, 882, 927, 931)
- [ ] CHK-044 [P1] All 5 template READMEs updated (levels 2, 3, 3+, addendum, main)
- [ ] CHK-045 [P2] Install guides updated (both files)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch folder only during implementation
- [ ] CHK-051 [P1] Scratch folder cleaned before closeout
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | [ ]/14 |
| P1 Items | 10 | [ ]/10 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: [YYYY-MM-DD — populated at closeout]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record (nine ADRs authored)
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted/Superseded)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (permanent alias + phased stub rejected in ADR-004)
- [ ] CHK-103 [P2] Migration path documented (changelog migration note REQ-016)
- [ ] CHK-104 [P0] Five Checks evaluation PASS 5/5 (see plan document Five-Checks section)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Intake classification time ≤ baseline (NFR-P01)
- [ ] CHK-111 [P1] Intake lock acquisition non-blocking in steady state
- [ ] CHK-112 [P2] Staged-write semantics preserved (NFR-R01 atomic publication)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested (plan §7 + L2 Enhanced Rollback)
- [ ] CHK-121 [P1] Harness restart/reload required post-skill-registry-mutation — documented in implementation-summary
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P2] Closed-packet immutability preserved (CHK-035 proves 012 untouched)
- [ ] CHK-131 [P2] Supersession relationship declared only at successor (015 graph-metadata, not 012 mutation)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All 015 canonical docs synchronized (spec ↔ plan ↔ tasks ↔ checklist ↔ decision-record cross-refs valid)
- [ ] CHK-141 [P1] description.json + graph-metadata.json generated via generate-description script
- [ ] CHK-142 [P1] graph-metadata records `manual.supersedes = [012-spec-kit-commands]`
- [ ] CHK-143 [P2] implementation-summary populated post-implementation with verification evidence
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| claude-opus-4-6 | Plan Author | [x] Documented | 2026-04-15 |
| [user] | Product Owner | [ ] Approved | |
| [implementation session] | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist — Full verification + architecture
Template section headers match template required names:
Pre-Implementation / Code Quality / Testing / Security / Documentation / File Organization / L3+ additions
Totals: 14 P0 + 10 P1 + 1 P2 = 25 rows
-->
