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

- [ ] CHK-001 [P0] All 7 analysis test IDs (EX-019 through EX-025) are documented in `spec.md` with exact prompts, command sequences, and feature catalog links
- [ ] CHK-002 [P0] Execution plan phases and quality gates are defined in `plan.md` covering non-destructive tests before EX-021
- [ ] CHK-003 [P0] EX-021 is explicitly flagged as destructive in `spec.md`, `plan.md`, and `checklist.md` with sandbox isolation requirement stated
- [ ] CHK-004 [P1] Causal graph sandbox data and rollback checkpoint are identified and documented before EX-021 execution
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `spec.md` scope table contains all 7 test IDs with non-empty Exact Prompt and Exact Command Sequence columns derived from the playbook
- [ ] CHK-011 [P0] `plan.md` testing strategy table lists all 7 test IDs with correct execution type (manual for EX-021, MCP for all others)
- [ ] CHK-012 [P0] No template placeholder text remains in any of the four phase documents
- [ ] CHK-013 [P1] Open questions in `spec.md` identify the sandbox target for EX-021 and the shared `(specFolder, taskId)` pair for EX-023/EX-024
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All 7 analysis scenarios have execution evidence tied to exact prompts and command sequences from the playbook
- [ ] CHK-021 [P0] EX-021 evidence includes before-trace output, `memory_causal_unlink` confirmation, and after-trace output showing the deleted edge is absent
- [ ] CHK-022 [P0] EX-023 and EX-024 share the same `specFolder` and `taskId` values and their evidence shows the Learning Index delta was computed and persisted
- [ ] CHK-023 [P1] EX-019 evidence confirms the created edge is visible in the `memory_drift_why` bidirectional trace immediately after creation
- [ ] CHK-024 [P1] EX-025 evidence includes at least the EX-023/EX-024 learning cycle listed with `onlyComplete:true` filtering active
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] EX-021 was executed only against a disposable sandbox spec folder and not against any active project spec folder
- [ ] CHK-031 [P0] A named rollback checkpoint was created and recorded before EX-021 ran; checkpoint name is present in the evidence bundle
- [ ] CHK-032 [P1] No hardcoded memory IDs from active project folders appear in test prompts or command sequences
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized and reflect the same 7-scenario scope
- [ ] CHK-041 [P1] Review protocol verdicts (PASS/PARTIAL/FAIL) are recorded for all 7 scenarios with explicit rationale
- [ ] CHK-042 [P2] Phase 006 coverage is reported in the parent `../spec.md` or parent tracking document as 7/7 analysis scenarios complete
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] All four phase documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) exist in `006-analysis/` and contain no broken relative links
- [ ] CHK-051 [P1] Feature catalog links in `spec.md` scope table resolve to the correct `../../feature_catalog/06--analysis/*.md` files
- [ ] CHK-052 [P2] Evidence artifacts and verdict notes are organized so future memory save can ingest the phase without restructuring
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 8 | 0/8 |
| P2 Items | 3 | 0/3 |

**Verification Date**: (pending execution)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
