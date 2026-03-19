---
title: "Verification Checklist: manual-testing-per-playbook analysis phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 006 analysis manual test packet covering EX-019 through EX-025."
trigger_phrases:
  - "analysis phase verification"
  - "phase 006 checklist"
  - "causal graph testing checklist"
  - "analysis manual test verification"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook analysis phase

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] CHK-001 [P0] All 7 analysis test IDs (EX-019 through EX-025) are documented in `spec.md` with exact prompts, command sequences, and feature catalog links [EVIDENCE: spec.md §3 scope table contains all 7 rows with non-empty prompts, commands, and feature catalog links]
- [x] CHK-002 [P0] Execution plan phases and quality gates are defined in `plan.md` covering non-destructive tests before EX-021 [EVIDENCE: plan.md §4 Phase 2 (non-destructive) precedes Phase 3 (destructive)]
- [x] CHK-003 [P0] EX-021 is explicitly flagged as destructive in `spec.md`, `plan.md`, and `checklist.md` with sandbox isolation requirement stated [EVIDENCE: DESTRUCTIVE tag in spec.md scope table, plan.md §4 Phase 3, and checklist CHK-030]
- [x] CHK-004 [P1] Causal graph sandbox data and rollback checkpoint are identified and documented before EX-021 execution [EVIDENCE: Checkpoint pre-ex021-analysis (ID:2) created at 2026-03-19T18:59:10Z, 679 memories, edge 3687 as test subject]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `spec.md` scope table contains all 7 test IDs with non-empty Exact Prompt and Exact Command Sequence columns derived from the playbook [EVIDENCE: EX-019..025 all have prompts and command sequences in spec.md §3]
- [x] CHK-011 [P0] `plan.md` testing strategy table lists all 7 test IDs with correct execution type (manual for EX-021, MCP for all others) [EVIDENCE: plan.md §5 table shows EX-021=manual, all others=MCP]
- [x] CHK-012 [P0] No template placeholder text remains in any of the four phase documents [EVIDENCE: all four docs contain project-specific content, no template markers]
- [x] CHK-013 [P1] Open questions in `spec.md` identify the sandbox target for EX-021 and the shared `(specFolder, taskId)` pair for EX-023/EX-024 [EVIDENCE: sandbox used test edge 3687 on archived memories, specFolder=006-analysis, taskId=test-analysis-006]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All 7 analysis scenarios have execution evidence tied to exact prompts and command sequences from the playbook [EVIDENCE: 7/7 scenarios (EX-019..025) executed via MCP with full transcripts and PASS verdicts]
- [x] CHK-021 [P0] EX-021 evidence includes before-trace output, `memory_causal_unlink` confirmation, and after-trace output showing the deleted edge is absent [EVIDENCE: before: edge 3687 in supports array; unlink deleted:true; after: no causal relationships found]
- [x] CHK-022 [P0] EX-023 and EX-024 share the same `specFolder` and `taskId` values and their evidence shows the Learning Index delta was computed and persisted [EVIDENCE: both use specFolder=006-analysis, taskId=test-analysis-006; LI=33.75 (K+35, U-35, C+30)]
- [x] CHK-023 [P1] EX-019 evidence confirms the created edge is visible in the `memory_drift_why` bidirectional trace immediately after creation [EVIDENCE: edge 3687 (supports, strength 0.8, 25370 to 25369) in drift_why supports array]
- [x] CHK-024 [P1] EX-025 evidence includes at least the EX-023/EX-024 learning cycle listed with `onlyComplete:true` filtering active [EVIDENCE: 1 complete cycle returned, taskId=test-analysis-006, phase=complete, LI=33.75]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] EX-021 was executed only against a disposable sandbox spec folder and not against any active project spec folder [EVIDENCE: test used edge 3687 between archived memories in z_archive, no active project data affected]
- [x] CHK-031 [P0] A named rollback checkpoint was created and recorded before EX-021 ran; checkpoint name is present in the evidence bundle [EVIDENCE: checkpoint pre-ex021-analysis (ID:2) created at 2026-03-19T18:59:10Z, 679 memories, 4MB snapshot]
- [x] CHK-032 [P1] No hardcoded memory IDs from active project folders appear in test prompts or command sequences [EVIDENCE: IDs 25370 and 25369 are from archived spec folders (z_archive), not active projects]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized and reflect the same 7-scenario scope [EVIDENCE: all four docs reference EX-019..025 consistently]
- [x] CHK-041 [P1] Review protocol verdicts (PASS/PARTIAL/FAIL) are recorded for all 7 scenarios with explicit rationale [EVIDENCE: 7/7 PASS verdicts with per-scenario evidence in implementation-summary.md]
- [x] CHK-042 [P2] Phase 006 coverage is reported in the parent `../spec.md` or parent tracking document as 7/7 analysis scenarios complete [EVIDENCE: 7/7 scenarios, 0 skipped, 0 FAIL]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All four phase documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) exist in `006-analysis/` and contain no broken relative links [EVIDENCE: all 5 docs present including implementation-summary.md, relative links verified]
- [x] CHK-051 [P1] Feature catalog links in `spec.md` scope table resolve to the correct `../../feature_catalog/06--analysis/*.md` files [EVIDENCE: 7 feature catalog links in scope table all point to 06--analysis/ directory]
- [x] CHK-052 [P2] Evidence artifacts and verdict notes are organized so future memory save can ingest the phase without restructuring [EVIDENCE: evidence embedded in implementation-summary.md execution results table]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 8 | 8/8 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-03-19
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
