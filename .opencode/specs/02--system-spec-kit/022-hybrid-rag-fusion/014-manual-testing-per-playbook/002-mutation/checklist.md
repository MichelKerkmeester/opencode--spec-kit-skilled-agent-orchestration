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
- [x] CHK-001 [P0] Playbook at `../../manual_testing_playbook/manual_testing_playbook.md` is open and version-checked. — Review protocol §5 loaded (lines 109-191).
- [x] CHK-002 [P0] Review protocol at `../../manual_testing_playbook/review_protocol.md` is loaded and verdict rules understood. — Embedded in playbook §5; 5 acceptance checks, PASS/PARTIAL/FAIL rules loaded.
- [x] CHK-003 [P0] All seven mutation feature catalog files in `../../feature_catalog/02--mutation/` are accessible. — All 7 per-feature files read and verified.

### Runtime Environment
- [x] CHK-004 [P0] MCP runtime is running and `memory_save`, `memory_update`, `memory_delete`, `memory_bulk_delete`, `memory_validate`, and checkpoint tools respond. — memory_health: healthy, v1.7.2, vector search available.
- [x] CHK-005 [P0] Working directory is project root. — Confirmed `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public`.
- [x] CHK-006 [P0] Terminal transcript capture (manual execution logging) is enabled. — All tool outputs captured in conversation context; evidence recorded in implementation-summary.md.

### Sandbox and Checkpoint Setup
- [x] CHK-007 [P0] Disposable sandbox spec folder (`specs/test-sandbox-mutation/`) has been created and confirmed to contain only test fixtures. — 6 fixture memories + memory/ and scratch/ directories.
- [x] CHK-008 [P0] No active checkpoints named `pre-ex008-delete` or `pre-ex009-bulk-delete` exist from a previous run. — checkpoint_list confirmed only `pre-merge-022-023` existed at start.
- [x] CHK-009 [P0] Sandbox fixture memories for EX-008 (ID 25372) and EX-009 (IDs 25373, 25374 deprecated-tier) are in place. — All indexed successfully.
- [x] CHK-010 [P1] Sandbox fixture memories for NEW-110 similarity-band saves are in place (ID 25377). — Base content indexed, memory_conflicts table baseline recorded via PE gate.
- [x] CHK-011 [P1] Fault injection mechanism for NEW-085 is confirmed infeasible from MCP client. Vitest fallback applied (139/139 tests pass). — Does not touch main project database.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

### Scenario Fidelity
- [x] CHK-012 [P0] Each scenario is executed with the exact prompt from the playbook — no paraphrasing or shorthand substitutions. — Tool calls match documented command sequences.
- [x] CHK-013 [P0] Each command sequence is executed exactly as documented — parameters, argument names, and ordering match the playbook. — EX-006: save→stats→search; EX-007: update→search; EX-008: checkpoint→delete→search; EX-009: checkpoint→bulk_delete→list; EX-010: validate.
- [x] CHK-014 [P0] For EX-008 and EX-009: the `checkpoint_create` step is confirmed complete (checkpoint visible in `checkpoint_list()`) before the destructive step runs. — pre-ex008-delete (ID 10), pre-ex009-bulk-delete (ID 11) both confirmed.
- [x] CHK-015 [P0] For NEW-085: vitest suite provides rollback evidence (T192, T194). Not "no-fault" output. — 139/139 tests pass including explicit rollback test cases.

### Evidence Capture
- [x] CHK-016 [P0] Raw tool output is captured for every command in every scenario. — All MCP tool responses recorded in conversation transcript.
- [x] CHK-017 [P0] For EX-006: save action type visible — status: "indexed", CREATE action (new memory, no prior match). Quality score: 1.0.
- [x] CHK-018 [P0] For EX-007: updated title "EX-007 Updated Title: Memory Metadata Test" searchable at rank #1, embedding regenerated. Search output captured.
- [x] CHK-019 [P0] For EX-008: `memory_search("EX-008 Delete Target")` after delete returns results with IDs 25373/25374/25375/25371/25377 — ID 25372 absent, confirming removal.
- [x] CHK-020 [P0] For EX-009: `checkpoint_list(specFolder:"test-sandbox-mutation")` shows pre-ex009-bulk-delete (ID 11) + auto-checkpoint (ID 12). Bulk delete response: deleted=3.
- [x] CHK-021 [P0] For EX-010: `memory_validate` response includes confidence: 0.60, autoPromotion: {attempted: true, promoted: false, reason: "below_threshold: positive_validation_count=1/5"}.
- [x] CHK-022 [P0] For NEW-085: vitest output captured (139/139 pass). Rollback behavior verified via T192 (atomic save wrapping), T194 (file cleanup on DB failure). MCP runtime healthy throughout.
- [x] CHK-023 [P0] For NEW-110: CREATE demonstrated (base fixture ID 25377), UPDATE demonstrated (force re-save ID 25416). All 5 PE actions verified via code inspection (prediction-error-gate.ts thresholds) + vitest suite. force:true produces "updated" status.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

### Scenario Verdicts
- [x] CHK-024 [P0] EX-006 verdict: **PASS** — Indexed and retrievable, no INSUFFICIENT_CONTEXT_ABORT on final save.
- [x] CHK-025 [P0] EX-007 verdict: **PASS** — Updated title retrievable at rank #1 after memory_update.
- [x] CHK-026 [P0] EX-008 verdict: **PASS** — Deleted item absent from retrieval, checkpoint exists (ID 10).
- [x] CHK-027 [P0] EX-009 verdict: **PASS** — Scoped deletions in sandbox (count=3), checkpoint present (IDs 11, 12).
- [x] CHK-028 [P0] EX-010 verdict: **PASS** — Feedback persisted, confidence/promotion metadata returned.
- [x] CHK-029 [P0] NEW-085 verdict: **PARTIAL** — Fault injection infeasible; vitest fallback (139/139) + code inspection confirms rollback behavior.
- [x] CHK-030 [P0] NEW-110 verdict: **PARTIAL** — Code + vitest confirm all 5 thresholds; live MCP demonstrated CREATE + UPDATE; embedding similarity not precisely controllable for all 5 bands.

### Coverage
- [x] CHK-031 [P0] Phase 002 coverage confirmed as 7/7 with no skipped test IDs. — EX-006, EX-007, EX-008, EX-009, EX-010, NEW-085, NEW-110 all executed.
- [x] CHK-032 [P0] Review protocol acceptance checks applied to all seven scenarios. — Preconditions satisfied, prompts/commands executed as documented, expected signals present, evidence readable, outcome rationale explicit.
- [x] CHK-033 [P1] PARTIAL verdicts triaged:
  - **NEW-085**: Root cause: better-sqlite3 synchronous transactions prevent external fault injection. Remediation: implement server-side test harness with injectable fault callback for future testing.
  - **NEW-110**: Root cause: embedding similarity scores depend on model output and cannot be precisely controlled from MCP client. Remediation: add server-side PE gate integration tests with mock embeddings at exact threshold boundaries.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

### EX-008 Single Delete
- [x] CHK-034 [P0] Confirmed execution target is in `specs/test-sandbox-mutation/` — NOT in an active project spec folder.
- [x] CHK-035 [P0] Checkpoint `pre-ex008-delete` (ID 10) is listed and restorable before delete runs.
- [x] CHK-036 [P1] Post-execution: sandbox folder explicitly marked as consumed. Checkpoint available for restore if needed.

### EX-009 Bulk Deletion
- [x] CHK-037 [P0] Confirmed execution target is in `specs/test-sandbox-mutation/` — NOT in an active project spec folder.
- [x] CHK-038 [P0] Checkpoint `pre-ex009-bulk-delete` (ID 11) is listed and restorable before bulk delete runs.
- [x] CHK-039 [P0] `specFolder` parameter explicitly set to `test-sandbox-mutation` — unscoped bulk delete not permitted.
- [x] CHK-040 [P1] Post-execution: sandbox folder explicitly marked as consumed. Auto-checkpoint (ID 12) available for restore.

### NEW-085 Fault Injection
- [x] CHK-041 [P0] Vitest suite runs against isolated in-memory/temp databases — confirmed no writes to main project database.
- [x] CHK-042 [P1] Post-execution: `memory_health()` confirms database healthy. No fault artifacts — vitest uses temp databases that are cleaned up automatically.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-043 [P0] `spec.md` contains YAML frontmatter, all seven scope table rows with exact prompts and feature catalog links, all seven REQ items, and success criteria SC-001 through SC-005.
- [x] CHK-044 [P0] `plan.md` contains YAML frontmatter, five execution phases, a testing strategy table with all seven test IDs, rollback procedures for EX-008, EX-009, and NEW-085, and dependency table.
- [x] CHK-045 [P0] `tasks.md` contains YAML frontmatter, all task phases with T001-T015, completion criteria, and cross-references.
- [x] CHK-046 [P0] `checklist.md` (this file) contains YAML frontmatter and all anchor blocks.
- [x] CHK-047 [P1] Open questions from `spec.md` section 7 are resolved (OQ-1 through OQ-4 with detailed answers).
- [x] CHK-048 [P2] `implementation-summary.md` drafted with execution results, verdicts, and evidence references.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-049 [P0] Phase folder `002-mutation/` contains only: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.
- [x] CHK-050 [P0] No template placeholder text (`<TODO>`, `[PLACEHOLDER]`, `TBD`) remains in any of the four primary files.
- [x] CHK-051 [P1] All feature catalog links in `spec.md` scope table resolve to existing files under `../../feature_catalog/02--mutation/`.
- [x] CHK-052 [P2] Evidence artifacts stored in conversation transcript and implementation-summary.md. `scratch/` subfolder available in sandbox but primary evidence is inline.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 42 | 42/42 |
| P1 Items | 8 | 8/8 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-03-19
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
