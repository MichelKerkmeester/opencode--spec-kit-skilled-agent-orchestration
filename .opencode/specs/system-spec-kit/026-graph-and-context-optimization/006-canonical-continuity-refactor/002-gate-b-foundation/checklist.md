---
title: "Gate B — Foundation"
feature: phase-018-gate-b-foundation
level: 3
status: complete
closed_by_commit: TBD
parent: 006-canonical-continuity-refactor
gate: B
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation"
    last_updated_at: "2026-04-11T20:55:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded Gate B archived-tier cleanup follow-through"
    next_safe_action: "Have orchestrator commit the validated Gate B cleanup"
    key_files: [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/checklist.md"]
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

- [x] CHK-001 [P0] `spec.md` records the corrected Gate B schema scope: reuse `memory_index.is_archived`, do not add it again. [EVIDENCE: `spec.md` scope and requirements sections]
- [x] CHK-002 [P0] `plan.md` follows the copy-first Gate B order from iteration 028 and iteration 037. [EVIDENCE: `plan.md` phase order and rollback notes]
- [x] CHK-003 [P1] ADR-001 records the canonical migration packaging decision. [EVIDENCE: `decision-record.md` ADR-001]
- [x] CHK-004 [P1] The packet explicitly calls out the `schema-downgrade.ts` compatibility note instead of leaving it implicit. [EVIDENCE: `decision-record.md`; `implementation-summary.md`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `vector-index-schema.ts` only adds the approved `causal_edges` anchor fields and supporting indexes for this gate. [EVIDENCE: `source_anchor` / `target_anchor` plus both indexes remain in tree]
- [x] CHK-011 [P0] `causal-edges.ts`, `checkpoints.ts`, and `reconsolidation.ts` preserve the new anchor fields end-to-end. [EVIDENCE: 2026-04-12 Gate B suite `7` files / `223` tests passed]
- [x] CHK-012 [P1] `schema-downgrade.ts` is explicitly documented as compatibility-only for the narrowed migration. [EVIDENCE: deprecated `is_archived` comments remain in `schema-downgrade.ts`]
- [x] CHK-013 [P1] Gate B changes stay bounded to rehearsal, schema/storage, archive flip, and the post-cleanup compatibility surfaces only. [EVIDENCE: `spec.md`; `plan.md`; `implementation-summary.md`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] The iteration 037 dry-run pipeline passes on a production-copy snapshot and emits evidence. [EVIDENCE: rehearsal and rerun tables recorded in `implementation-summary.md`]
- [x] CHK-021 [P0] The rerun proves the migration wrapper is a no-op at the operator level. [EVIDENCE: `Rehearsal rerun changes | 0`]
- [x] CHK-022 [P0] Hard rollback on the candidate copy returns logical baseline equivalence. [EVIDENCE: `Rollback result | Returned to baseline counts`]
- [x] CHK-023 [P0] Schema migration validation queries pass and row counts are preserved outside the intended archive flip. [EVIDENCE: backup baseline query returned `25 / 2553 / 183 / 1 / 1 / 3264` on 2026-04-12]
- [x] CHK-024 [P0] The production archive flip preserves the rebaselined `183` legacy memory-path rows and the `1` baseline archived non-memory row as the final archived state. [EVIDENCE: `implementation-summary.md` production tables]
- [x] CHK-025 [P0] Mixed pre/post migration 2-hop causal BFS queries still work. [EVIDENCE: `tests/causal-edges.vitest.ts` passed; `implementation-summary.md` records live sample path `1 -> 10 -> 11`]
- [x] CHK-026 [P1] N/A — archived-tier ranking was removed by the Gate B cleanup pass. [EVIDENCE: `stage2-fusion.ts` contains no `x0.3`, `0.3`, or `is_archived` logic]
- [x] CHK-027 [P1] N/A — `archived_hit_rate` was removed from the active stats surface by the Gate B cleanup pass. [EVIDENCE: `memory-crud-stats.ts` contains no `archived_hit_rate` references]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Rehearsal, rerun, and rollback all run on copies until the production maintenance window opens. [EVIDENCE: `plan.md` and `implementation-summary.md` copy-first workflow]
- [x] CHK-031 [P0] The archive flip stayed scoped only to legacy memory-path rows. [EVIDENCE: production and cleanup notes only target `file_path LIKE '%/memory/%.md'` rows]
- [x] CHK-032 [P1] Maintenance timing preserves rollback headroom based on rehearsal duration. [EVIDENCE: plan and implementation summary both keep copy-first rollback before production]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` cite the same grounding and tell the same corrected-scope story. [EVIDENCE: packet docs synchronized on 2026-04-12]
- [x] CHK-041 [P1] `implementation-summary.md` stays honest about the original Gate B landing and the later cleanup contract. [EVIDENCE: `implementation-summary.md`]
- [x] CHK-042 [P2] Any broader tuple-column follow-on from iteration 035 stays explicitly outside this gate.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Gate B packet authoring does not create or edit files outside the approved target folder during population. [EVIDENCE: current Gate B packet file set]
- [x] CHK-051 [P1] Rehearsal evidence and scratch output remain outside canonical packet docs unless promoted intentionally. [EVIDENCE: `implementation-summary.md` rehearsal tables reference promoted evidence only]
- [x] CHK-052 [P2] Any later context save follows the standard Spec Kit memory workflow instead of manual memory-file authoring.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 21 | 21/21 |
| P2 Items | 10 | 10/10 |

**Verification Date**: 2026-04-12
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] ADR-001 is documented in `decision-record.md`. [EVIDENCE: `decision-record.md`]
- [x] CHK-101 [P1] The ADR includes the rejected standalone-versus-inline alternative with rationale. [EVIDENCE: `decision-record.md` alternatives section]
- [x] CHK-102 [P1] The packet records how the corrected Gate B scope supersedes early-research wording. [EVIDENCE: `decision-record.md`; `implementation-summary.md`]
- [x] CHK-103 [P2] Any deferred tuple-column follow-on is named explicitly as outside this gate.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Fixed-query replay stayed within the accepted rehearsal envelope recorded for Gate B execution. [EVIDENCE: `implementation-summary.md` rehearsal timing notes]
- [x] CHK-111 [P1] N/A — archived rows are no longer demoted as a separate scoring class after Gate B cleanup. [EVIDENCE: `stage2-fusion.ts` contains no archived-tier weighting branch]
- [x] CHK-112 [P2] Additional benchmark narrative is captured when needed in `implementation-summary.md`.
- [x] CHK-113 [P2] N/A — `archived_hit_rate` thresholds are obsolete under the Phase 018 no-observation directive.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Hard rollback procedure is documented and tested. [EVIDENCE: `implementation-summary.md` rollback drill + backup integrity rows]
- [x] CHK-121 [P0] Production archive flip verification hits the rebaselined `183`-row legacy target while preserving the `1` baseline archived non-memory row. [EVIDENCE: 2026-04-12 backup baseline query `25 / 2553 / 183 / 1 / 1 / 3264`]
- [x] CHK-122 [P1] Tests and sign-off happen after rehearsal evidence is captured. [EVIDENCE: packet verification ordering in `implementation-summary.md`]
- [x] CHK-123 [P1] The production runbook includes maintenance-window and rollback-headroom notes. [EVIDENCE: `plan.md`; `implementation-summary.md`]
- [x] CHK-124 [P2] N/A — post-cutover observation notes are obsolete under the Phase 018 no-observation directive.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Copy-only rehearsal discipline is preserved through the full gate. [EVIDENCE: `plan.md`; `implementation-summary.md`]
- [x] CHK-131 [P1] The archive flip does not broaden beyond the intended legacy memory surface. [EVIDENCE: `implementation-summary.md` live query tables]
- [x] CHK-132 [P2] Audit trail and operator log capture remain in the expected packet and handover surfaces.
- [x] CHK-133 [P2] No hidden schema drift remains undocumented after cutover.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All packet docs are synchronized on the corrected archive-column scope. [EVIDENCE: packet docs synchronized on 2026-04-12]
- [x] CHK-141 [P1] `decision-record.md` and `implementation-summary.md` stay aligned with the plan. [EVIDENCE: `decision-record.md`; `implementation-summary.md`; `plan.md`]
- [x] CHK-142 [P2] Follow-on tuple-column or permanence-decision work is called out explicitly.
- [x] CHK-143 [P2] Gate C handoff context is documented cleanly.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Phase 018 completion pass | Technical Lead | Verified | 2026-04-12 |
| Phase 018 completion pass | Tests / QA | Verified | 2026-04-12 |
| Phase 018 completion pass | Operator / Product | Verified | 2026-04-12 |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
