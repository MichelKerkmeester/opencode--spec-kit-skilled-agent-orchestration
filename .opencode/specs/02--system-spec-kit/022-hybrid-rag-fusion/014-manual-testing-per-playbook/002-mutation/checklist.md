---
title: "Checklist: manual-testing-per-playbook mutation phase [template:level_2/checklist.md]"
description: "Phase 002 QA verification checklist for the mutation manual test packet. Covers pre-execution sandbox setup, scenario execution, destructive test safety gates, evidence completeness, and documentation closure."
trigger_phrases:
  - "mutation checklist"
  - "phase 002 checklist"
  - "mutation test verification"
  - "hybrid rag mutation qa"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook mutation phase

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

### Source Documents
- [ ] CHK-001 [P0] Playbook at `../../manual_testing_playbook/manual_testing_playbook.md` is open and version-checked.
- [ ] CHK-002 [P0] Review protocol at `../../manual_testing_playbook/review_protocol.md` is loaded and verdict rules understood.
- [ ] CHK-003 [P0] All seven mutation feature catalog files in `../../feature_catalog/02--mutation/` are accessible.

### Runtime Environment
- [ ] CHK-004 [P0] MCP runtime is running and `memory_save`, `memory_update`, `memory_delete`, `memory_bulk_delete`, `memory_validate`, and checkpoint tools respond.
- [ ] CHK-005 [P0] Working directory is project root.
- [ ] CHK-006 [P0] Terminal transcript capture (manual execution logging) is enabled.

### Sandbox and Checkpoint Setup
- [ ] CHK-007 [P0] Disposable sandbox spec folder (e.g., `specs/test-sandbox`) has been created and confirmed to contain only test fixtures.
- [ ] CHK-008 [P0] No active checkpoints named `pre-ex008-delete` or `pre-ex009-bulk-delete` exist from a previous run that would conflict with the new checkpoint creation steps.
- [ ] CHK-009 [P0] Sandbox fixture memories for EX-008 (known ID to delete) and EX-009 (known deprecated-tier memories in scoped folder) are in place.
- [ ] CHK-010 [P1] Sandbox fixture memories for NEW-110 similarity-band saves are in place and the `memory_conflicts` table state has been recorded.
- [ ] CHK-011 [P1] Fault injection mechanism for NEW-085 is confirmed (mock adapter, isolated DB path, or equivalent) and will not touch the main project database.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

### Scenario Fidelity
- [ ] CHK-012 [P0] Each scenario is executed with the exact prompt from the playbook — no paraphrasing or shorthand substitutions.
- [ ] CHK-013 [P0] Each command sequence is executed exactly as documented — parameters, argument names, and ordering match the playbook.
- [ ] CHK-014 [P0] For EX-008 and EX-009: the `checkpoint_create` step is confirmed complete (checkpoint visible in `checkpoint_list()`) before the destructive step runs.
- [ ] CHK-015 [P0] For NEW-085: the fault injection is triggered before claiming rollback evidence — do not capture "no-fault" output as rollback proof.

### Evidence Capture
- [ ] CHK-016 [P0] Raw tool output is captured for every command in every scenario (not just the final command).
- [ ] CHK-017 [P0] For EX-006: save action type (CREATE, REINFORCE, UPDATE, SUPERSEDE, or CREATE_LINKED) is visible in the output.
- [ ] CHK-018 [P0] For EX-007: the updated title is searchable after `memory_update` and the search output is captured.
- [ ] CHK-019 [P0] For EX-008: `memory_search(old title)` after delete returns zero results confirming removal.
- [ ] CHK-020 [P0] For EX-009: `checkpoint_list(specFolder:"<sandbox-spec>")` after bulk delete shows the `pre-ex009-bulk-delete` checkpoint and the bulk delete response includes deletion count.
- [ ] CHK-021 [P0] For EX-010: `memory_validate` response includes confidence update and `autoPromotion` metadata.
- [ ] CHK-022 [P0] For NEW-085: rollback trace and post-rollback `memory_health()` output both captured.
- [ ] CHK-023 [P0] For NEW-110: evidence for all five PE actions (CREATE, REINFORCE, UPDATE, SUPERSEDE, CREATE_LINKED) captured, plus `memory_conflicts` table query output and `force:true` bypass output.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

### Scenario Verdicts
- [ ] CHK-024 [P0] EX-006 verdict assigned (PASS / PARTIAL / FAIL) with rationale.
- [ ] CHK-025 [P0] EX-007 verdict assigned (PASS / PARTIAL / FAIL) with rationale.
- [ ] CHK-026 [P0] EX-008 verdict assigned (PASS / PARTIAL / FAIL) with rationale.
- [ ] CHK-027 [P0] EX-009 verdict assigned (PASS / PARTIAL / FAIL) with rationale.
- [ ] CHK-028 [P0] EX-010 verdict assigned (PASS / PARTIAL / FAIL) with rationale.
- [ ] CHK-029 [P0] NEW-085 verdict assigned (PASS / PARTIAL / FAIL) with rationale.
- [ ] CHK-030 [P0] NEW-110 verdict assigned (PASS / PARTIAL / FAIL) with rationale.

### Coverage
- [ ] CHK-031 [P0] Phase 002 coverage confirmed as 7/7 with no skipped test IDs.
- [ ] CHK-032 [P0] Review protocol acceptance checks applied to all seven scenarios: preconditions satisfied, prompt/commands executed as written, expected signals present, evidence readable, outcome rationale explicit.
- [ ] CHK-033 [P1] Any PARTIAL or FAIL verdict has a triage note identifying the root cause and a proposed remediation step.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

### EX-008 Single Delete
- [ ] CHK-034 [P0] Confirmed execution target is in `specs/test-sandbox` or equivalent disposable folder — NOT in an active project spec folder.
- [ ] CHK-035 [P0] Checkpoint `pre-ex008-delete` is listed and restorable before delete runs.
- [ ] CHK-036 [P1] Post-execution: sandbox folder left in a clean known state (either restored or explicitly marked as consumed).

### EX-009 Bulk Deletion
- [ ] CHK-037 [P0] Confirmed execution target is in `specs/test-sandbox` or equivalent disposable folder — NOT in an active project spec folder.
- [ ] CHK-038 [P0] Checkpoint `pre-ex009-bulk-delete` is listed and restorable before bulk delete runs.
- [ ] CHK-039 [P0] `specFolder` parameter is explicitly set to the sandbox path — an unscoped bulk delete is not permitted.
- [ ] CHK-040 [P1] Post-execution: sandbox folder left in a clean known state (either restored or explicitly marked as consumed).

### NEW-085 Fault Injection
- [ ] CHK-041 [P0] Fault injection targets an isolated database or sandbox — confirmed it will not write to the main project database.
- [ ] CHK-042 [P1] Post-execution: `memory_health()` confirms database is healthy and fault artifacts are cleared before running subsequent tests.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-043 [P0] `spec.md` contains YAML frontmatter, all seven scope table rows with exact prompts and feature catalog links, all seven REQ items, and success criteria SC-001 through SC-005.
- [ ] CHK-044 [P0] `plan.md` contains YAML frontmatter, five execution phases, a testing strategy table with all seven test IDs, rollback procedures for EX-008, EX-009, and NEW-085, and dependency table.
- [ ] CHK-045 [P0] `tasks.md` contains YAML frontmatter, all task phases with T001–T015, completion criteria, and cross-references.
- [ ] CHK-046 [P0] `checklist.md` (this file) contains YAML frontmatter and all anchor blocks.
- [ ] CHK-047 [P1] Open questions from `spec.md` section 7 are resolved or explicitly deferred with owner and target date before execution begins.
- [ ] CHK-048 [P2] `implementation-summary.md` is drafted after all seven scenarios are executed and verdicted.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-049 [P0] Phase folder `002-mutation/` contains only: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and optionally `implementation-summary.md`.
- [ ] CHK-050 [P0] No template placeholder text (`<TODO>`, `[PLACEHOLDER]`, `TBD`) remains in any of the four primary files.
- [ ] CHK-051 [P1] All feature catalog links in `spec.md` scope table resolve to existing files under `../../feature_catalog/02--mutation/`.
- [ ] CHK-052 [P2] Evidence artifacts (transcripts, output snapshots) are stored in a `scratch/` subfolder if captured as files, not mixed into the primary spec folder root.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 42 | 0/42 |
| P1 Items | 8 | 0/8 |
| P2 Items | 2 | 0/2 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
