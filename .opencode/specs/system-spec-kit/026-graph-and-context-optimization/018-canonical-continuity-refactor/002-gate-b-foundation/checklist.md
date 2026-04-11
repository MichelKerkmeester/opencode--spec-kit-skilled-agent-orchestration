---
title: "Gate B — Foundation"
feature: phase-018-gate-b-foundation
level: 3
status: complete
closed_by_commit: TBD
parent: 018-canonical-continuity-refactor
gate: B
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "026-graph-and-context-optimization/018-canonical-continuity-refactor/002-gate-b-foundation"
    last_updated_at: "2026-04-11T20:55:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded Gate B archived-tier cleanup follow-through"
    next_safe_action: "Have orchestrator commit the validated Gate B cleanup"
    key_files: [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/002-gate-b-foundation/checklist.md"]
description: "Exit-gate checklist for the two-week foundation lane that makes phase 018 archive and causal-edge changes real."
trigger_phrases: ["gate b checklist", "foundation verification", "archive flip", "archived hit rate", "phase 018"]
importance_tier: "important"
contextType: "verification"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Gate B — Foundation

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker on Gate B close | Gate C cannot start until complete |
| **[P1]** | Required unless explicitly deferred by the operator | Gate B should not close with open P1s unless waived |
| **[P2]** | Helpful follow-through | Can move into a follow-on packet if documented |

Checklist priorities follow the Gate B close criteria in `../implementation-design.md`, iteration 020, iteration 028, and iteration 037.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `spec.md` records the corrected Gate B schema scope: reuse `memory_index.is_archived`, do not add it again.
- [ ] CHK-002 [P0] `plan.md` follows the copy-first Gate B order from iteration 028 and iteration 037.
- [ ] CHK-003 [P1] ADR-001 records the canonical migration packaging decision.
- [ ] CHK-004 [P1] The packet explicitly calls out the remaining `schema-downgrade.ts` uncertainty instead of leaving it implicit.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `vector-index-schema.ts` only adds the approved `causal_edges` anchor fields and supporting indexes for this gate.
- [ ] CHK-011 [P0] `causal-edges.ts`, `checkpoints.ts`, and `reconsolidation.ts` preserve the new anchor fields end-to-end.
- [ ] CHK-012 [P1] `schema-downgrade.ts` is either updated or explicitly documented as out of scope for the narrowed migration.
- [ ] CHK-013 [P1] Gate B changes stay bounded to rehearsal, schema/storage, archive flip, ranking, and metric surfaces only.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] The iteration 037 dry-run pipeline passes on a production-copy snapshot and emits JSON evidence.
- [ ] CHK-021 [P0] The rerun proves the migration wrapper is a no-op at the operator level.
- [ ] CHK-022 [P0] Hard rollback on the candidate copy returns logical baseline equivalence.
- [ ] CHK-023 [P0] Schema migration validation queries pass and row counts are preserved outside the intended archive flip.
- [ ] CHK-024 [P0] `SELECT COUNT(*) FROM memory_index WHERE is_archived=1` returns 155 after the production flip.
- [ ] CHK-025 [P0] Mixed pre/post migration 2-hop causal BFS queries still work.
- [ ] CHK-026 [P1] Sample searches confirm fresh spec-doc results outrank archived peers after the `x0.3` weighting change.
- [ ] CHK-027 [P1] `archived_hit_rate` is visible in the intended stats or dashboard surface.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Rehearsal, rerun, and rollback all run on copies until the production maintenance window opens.
- [ ] CHK-031 [P0] The archive flip script is scoped only to legacy memory-file rows.
- [ ] CHK-032 [P1] Maintenance timing preserves rollback headroom based on rehearsal duration.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` cite the same grounding and tell the same corrected-scope story.
- [ ] CHK-041 [P1] `implementation-summary.md` stays honest about being a planned closeout shell until Gate B actually lands.
- [ ] CHK-042 [P2] Any broader tuple-column follow-on from iteration 035 is tracked explicitly instead of being lost.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Gate B packet authoring does not create or edit files outside the approved target folder during population.
- [ ] CHK-051 [P1] Rehearsal evidence and scratch output remain outside canonical packet docs unless promoted intentionally.
- [ ] CHK-052 [P2] Any later context save follows the standard Spec Kit memory workflow instead of manual memory-file authoring.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 10 | 0/10 |
| P2 Items | 2 | 0/2 |

**Verification Date**: TBD after Gate B implementation closes
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001 is documented in `decision-record.md`.
- [ ] CHK-101 [P1] The ADR includes the rejected standalone-versus-inline alternative with rationale.
- [ ] CHK-102 [P1] The packet records how the corrected Gate B scope supersedes early-research wording.
- [ ] CHK-103 [P2] Any deferred tuple-column follow-on is named explicitly.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Fixed-query replay stays within the `1.20x` baseline bound from iteration 037.
- [ ] CHK-111 [P1] Ranking proof confirms archived rows are demoted without breaking mixed-mode retrieval.
- [ ] CHK-112 [P2] Additional benchmark narrative is captured if the replay shows non-blocking regressions.
- [ ] CHK-113 [P2] `archived_hit_rate` dashboard thresholds are documented for later phase-020 use.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Hard rollback procedure is documented and tested.
- [ ] CHK-121 [P0] Production archive flip verification hits the exact 155-row target.
- [ ] CHK-122 [P1] Tests and lead sign-off happen after rehearsal evidence is captured.
- [ ] CHK-123 [P1] The production runbook includes maintenance-window and rollback-headroom notes.
- [ ] CHK-124 [P2] Post-cutover observation notes are ready for Gate C handoff.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Copy-only rehearsal discipline is preserved through the full gate.
- [ ] CHK-131 [P1] The archive flip script does not broaden beyond the intended legacy memory surface.
- [ ] CHK-132 [P2] Any audit trail or operator log capture is stored where the team expects it.
- [ ] CHK-133 [P2] No hidden schema drift remains undocumented after cutover.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All packet docs are synchronized on the corrected archive-column scope.
- [ ] CHK-141 [P1] `decision-record.md` and `implementation-summary.md` stay aligned with the plan.
- [ ] CHK-142 [P2] Follow-on tuple-column or permanence-decision work is called out explicitly.
- [ ] CHK-143 [P2] Gate C handoff context is documented cleanly.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [UNCERTAIN: named technical lead not specified in grounding] | Technical Lead | [ ] Approved | |
| [UNCERTAIN: named test owner not specified in grounding] | Tests / QA | [ ] Approved | |
| [UNCERTAIN: named product or operator approver not specified in grounding] | Operator / Product | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
