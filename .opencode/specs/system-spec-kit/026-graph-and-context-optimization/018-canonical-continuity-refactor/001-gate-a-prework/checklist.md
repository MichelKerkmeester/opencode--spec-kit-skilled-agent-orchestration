---
title: "Gate A — Pre-work"
feature: phase-018-gate-a-prework
level: 2
status: planned
parent: 018-canonical-continuity-refactor
gate: A
description: "Exit-gate checklist for the week-0 blocker-removal lane that must complete before phase 018 schema and runtime work can begin."
trigger_phrases:
  - "gate a checklist"
  - "pre-work verification"
  - "canonical continuity"
  - "phase 018"
  - "exit gate"
importance_tier: "important"
contextType: "verification"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Gate A — Pre-work

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker on Gate A close | Gate B cannot start until complete |
| **[P1]** | Required unless the operator approves a documented deferral | Gate A should not close with open P1s unless explicitly waived |
| **[P2]** | Helpful but optional | Can roll into a follow-on packet or gate |

Checklist priorities follow iteration 020 Gate A close criteria, iteration 022's fail-closed validator model, and iteration 028's "cannot slip" list for Gate A.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `spec.md` states Gate A as blocker-removal only and keeps Gate B/C/D/E work out of scope.
- [ ] CHK-002 [P0] `plan.md` follows the same Gate A order described in `../resource-map.md` §4 and iteration 028.
- [ ] CHK-003 [P1] The packet records the M4 prerequisite from iteration 016: root-packet backfill must close before archive-state migration.
- [ ] CHK-004 [P1] The packet records the default exemption boundary for `changelog/*` and `sharded/*`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Template repairs eliminate the known orphan `metadata` anchor defects in Level 3 and Level 3+ spec templates.
- [ ] CHK-011 [P0] `.opencode/skill/system-spec-kit/templates/handover.md`, `.opencode/skill/system-spec-kit/templates/research.md`, and `.opencode/skill/system-spec-kit/templates/debug-delegation.md` have baseline anchors before merge-time writes are allowed.
- [ ] CHK-012 [P1] Validator behavior or validator policy documentation clearly keeps anchorless changelog/sharded templates outside merge-target legality by default.
- [ ] CHK-013 [P1] Gate A changes stay bounded to template, validator, root-packet backfill, and recovery-proof surfaces only.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `validate.sh --strict` passes on every repaired level-template example relevant to the Gate A anchor fixes.
- [ ] CHK-021 [P0] The audited root packets all have canonical `implementation-summary.md` committed.
- [ ] CHK-022 [P0] The SQLite backup file exists and can be restored onto a copy.
- [ ] CHK-023 [P0] Rollback on a copy was rehearsed successfully and the steps are operator-readable.
- [ ] CHK-024 [P0] Resume warmup completes in under 5 seconds.
- [ ] CHK-025 [P1] Any unresolved migration-file ownership choice is explicitly documented rather than left implicit.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Restore and rollback rehearsals target copies only, never the live DB.
- [ ] CHK-031 [P0] The Gate A backup artifact is named clearly enough to prevent restoring the wrong snapshot.
- [ ] CHK-032 [P1] No schema migration or archive flip begins before the Gate A backup and restore drill has passed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` cite the same grounding sources and tell the same Gate A story.
- [ ] CHK-041 [P1] `implementation-summary.md` stays honest about being a planned closeout shape, with post-implementation facts left as `TBD after Gate A implementation closes`.
- [ ] CHK-042 [P2] Follow-on work such as the 19 memory-relevant sub-README rewrites from `../resource-map.md` §8.5 is tracked as deferred rather than silently omitted.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Gate A packet authoring does not create or edit files outside the approved target folder during pre-work population.
- [ ] CHK-051 [P1] Temporary notes and audit scratch stay outside canonical packet docs unless promoted intentionally.
- [ ] CHK-052 [P2] Any follow-up context save uses the standard Spec Kit memory workflow after implementation, not manual memory-file authoring.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 10 | 0/10 |
| P2 Items | 2 | 0/2 |

**Verification Date**: TBD after Gate A implementation closes
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
