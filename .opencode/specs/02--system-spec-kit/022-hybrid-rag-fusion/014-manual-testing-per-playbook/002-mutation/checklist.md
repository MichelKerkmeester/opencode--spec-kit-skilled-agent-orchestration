---
title: "Verification Checklist: manual-testing-per-playbook mutation phase [template:level_2/checklist.md]"
description: "Verification checklist for phase 002 mutation: 9 scenarios (EX-006, EX-007, M-008, EX-008, EX-009, EX-010, 085, 101, 110) — all items unchecked, awaiting execution."
trigger_phrases:
  - "mutation checklist"
  - "phase 002 checklist"
  - "mutation test verification"
  - "hybrid rag mutation qa"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: manual-testing-per-playbook mutation phase

<!-- SPECKIT_LEVEL: 2 -->
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

### Source Documents

- [ ] CHK-001 [P0] Playbook files for 02--mutation confirmed accessible
- [ ] CHK-002 [P0] Feature catalog files for 02--mutation confirmed accessible
- [ ] CHK-003 [P0] Review protocol loaded and verdict rules understood

### Runtime Environment

- [ ] CHK-004 [P0] MCP runtime healthy — all mutation tools and checkpoint tools respond
- [ ] CHK-005 [P0] Working directory confirmed at project root

### Sandbox and Checkpoint Setup

- [ ] CHK-006 [P0] Disposable sandbox spec folder created and contains only test fixtures
- [ ] CHK-007 [P0] No active checkpoints named `pre-ex008-delete` or `pre-ex009-bulk-delete` exist from a previous run
- [ ] CHK-008 [P0] Sandbox fixture memories for EX-008 are in place
- [ ] CHK-009 [P0] Sandbox fixture memories for EX-009 (deprecated tier) are in place
- [ ] CHK-010 [P1] Sandbox fixture memories for 110 similarity-band saves are in place
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-040 [P1] Evidence captured for each executed scenario (output excerpt or observation)
- [ ] CHK-041 [P1] Feature catalog cross-reference verified for each scenario
- [ ] CHK-042 [P1] PARTIAL verdicts include a root-cause note and remediation suggestion
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

Each item below must be marked `[x]` with a verdict (PASS / PARTIAL / FAIL) and an evidence reference before this phase is complete.

- [ ] CHK-020 [P0] EX-006 executed and verdicted — Memory indexing (memory_save)
- [ ] CHK-021 [P0] EX-007 executed and verdicted — Memory metadata update (memory_update)
- [ ] CHK-022 [P0] M-008 executed and verdicted — Feature 09 Direct Manual Scenario (Per-memory History Log)
- [ ] CHK-023 [P0] EX-008 executed and verdicted — Single and folder delete (memory_delete)
- [ ] CHK-024 [P0] EX-009 executed and verdicted — Tier-based bulk deletion (memory_bulk_delete)
- [ ] CHK-025 [P0] EX-010 executed and verdicted — Validation feedback (memory_validate)
- [ ] CHK-026 [P0] 085 executed and verdicted — Transaction wrappers on mutation handlers
- [ ] CHK-027 [P0] 101 executed and verdicted — memory_delete confirm schema tightening
- [ ] CHK-028 [P0] 110 executed and verdicted — Prediction-error save arbitration
- [ ] CHK-029 [P0] All 9 scenarios assigned a verdict — 0 skipped test IDs
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

### EX-008 Single Delete

- [ ] CHK-050 [P0] Confirmed execution target is in sandbox folder — NOT in an active project spec folder
- [ ] CHK-051 [P0] Checkpoint for EX-008 listed and restorable before delete runs
- [ ] CHK-052 [P0] Post-execution: deleted item confirmed absent from retrieval

### EX-009 Bulk Deletion

- [ ] CHK-053 [P0] Confirmed execution target is in sandbox folder — NOT in an active project spec folder
- [ ] CHK-054 [P0] Checkpoint for EX-009 listed and restorable before bulk delete runs
- [ ] CHK-055 [P0] `specFolder` parameter explicitly set to sandbox folder — unscoped bulk delete not permitted
- [ ] CHK-056 [P1] Post-execution: sandbox folder explicitly marked as consumed

### 085 Transaction / Fault Injection

- [ ] CHK-057 [P0] Test runs against isolated database — no writes to main project database
- [ ] CHK-058 [P1] Post-execution: `memory_health()` confirms database healthy
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P0] tasks.md updated with final status for each scenario task
- [ ] CHK-061 [P0] implementation-summary.md completed with aggregate results
- [ ] CHK-062 [P0] No placeholder or template text remains in any phase document
- [ ] CHK-063 [P1] Open questions in spec.md resolved (if any discovered during execution)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-070 [P1] Evidence artifacts stored in `scratch/` only
- [ ] CHK-071 [P2] Memory save triggered after execution to preserve session context
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 22 | 0/22 |
| P1 Items | 8 | 0/8 |
| P2 Items | 1 | 0/1 |

**Verification Date**: —
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
