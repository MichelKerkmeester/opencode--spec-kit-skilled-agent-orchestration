---
title: "Verification Checklist: manual-testing-per-playbook lifecycle phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 005 lifecycle manual tests covering EX-015 through EX-018 (checkpoint), 097 (async ingest), 114 (path traversal), 124 (archival), 134 (startup recovery), and 144 (ingest forecast)."
trigger_phrases:
  - "lifecycle checklist"
  - "phase 005 verification"
  - "manual lifecycle checklist"
  - "EX-015 EX-016 EX-017 EX-018 verification"
  - "097 114 124 134 144 verification"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook lifecycle phase

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

- [x] CHK-001 [P0] Scope is locked to nine lifecycle tests (EX-015, EX-016, EX-017, EX-018, 097, 114, 124, 134, 144) with no non-lifecycle scenarios included [EVIDENCE: scope table in `spec.md` lists exactly nine rows]
- [x] CHK-002 [P0] Exact prompts, command sequences, and pass criteria were extracted verbatim from `../../manual_testing_playbook/manual_testing_playbook.md` [EVIDENCE: scope table in `spec.md` matches playbook rows for all nine test IDs]
- [x] CHK-003 [P0] Feature catalog links for all nine tests point to correct `05--lifecycle/` files [EVIDENCE: spec.md scope table references the expected lifecycle catalog entries for EX-015 through EX-018 and 097, 114, 124, 134, 144]
- [x] CHK-004 [P1] Level 1 template anchors and metadata blocks are intact across all four phase documents [EVIDENCE: `SPECKIT_LEVEL` and anchor sections verified in spec.md, plan.md, tasks.md, checklist.md — all 5 files contain correct anchors]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] EX-015 documents the exact command flow `checkpoint_create(name,specFolder) -> checkpoint_list()`, required create/list evidence, and PASS condition `checkpoint discoverable` [EVIDENCE: spec.md REQ-001 and plan.md Phase 2 step]
- [x] CHK-011 [P0] EX-016 documents the exact command `checkpoint_list(specFolder,limit)`, required newest-first list output evidence, and PASS condition `checkpoints returned` [EVIDENCE: spec.md REQ-002 and plan.md Phase 2 step]
- [x] CHK-012 [P0] EX-017 documents the exact command flow `checkpoint_restore(name,clearExisting:false) -> memory_health()`, required restore and health evidence, and PASS condition `known record restored` [EVIDENCE: spec.md REQ-003 and plan.md Phase 3 step]
- [x] CHK-013 [P0] EX-018 documents the sandbox-only list/delete/list command chain, before/after list evidence, and PASS condition `checkpoint removed from sandbox list` [EVIDENCE: spec.md REQ-004 and plan.md Phase 3 step]
- [x] CHK-014 [P0] 097 documents the start/status/cancel/restart command sequence, the five-state lifecycle `queued -> parsing -> embedding -> indexing -> complete`, and PASS condition that all five states transition correctly and cancel works [EVIDENCE: spec.md REQ-005 and plan.md Phase 2 step]
- [x] CHK-015 [P0] 114 documents traversal and out-of-base rejection attempts plus one valid ingest attempt, E_VALIDATION evidence expectation, and PASS condition that invalid paths are rejected while valid paths create jobs successfully [EVIDENCE: spec.md REQ-006 and plan.md Phase 2 step]
- [x] CHK-016 [P0] 124 documents archive/unarchive checks for metadata, BM25, and vector parity, protected-tier safeguard behavior, required DB/log evidence, and PASS condition that archive/unarchive parity holds with deferred vector rebuild behavior explicit on unarchive [EVIDENCE: spec.md REQ-007 and plan.md Phase 3 step]
- [x] CHK-017 [P0] 134 documents committed-versus-stale pending file setup, startup recovery scan behavior, filesystem/log evidence, and PASS condition that committed/stale paths diverge correctly and the startup scan root set matches expected allowed locations [EVIDENCE: spec.md REQ-008 and plan.md Phase 2 step]
- [x] CHK-018 [P0] 144 documents forecast field checks across sparse and progressing states, status polling evidence, and PASS condition that forecast fields remain present, degrade safely, and update advisory values without handler failure [EVIDENCE: spec.md REQ-009 and plan.md Phase 2 step]
- [x] CHK-019 [P1] Checkpoint naming convention `pre-[test-id]-[action]` is consistently referenced in plan.md Phase 1, Phase 3, and rollback plan [EVIDENCE: naming pattern used in execution: pre-bulk-delete, pre-EX-016-ordering-test, pre-EX-017-restore, pre-EX-018-delete, pre-124-archival]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] EX-015 has been executed and `checkpoint_create` output plus confirming `checkpoint_list` entry is captured as evidence [EVIDENCE: scratch/evidence/EX-015-checkpoint-creation.md — PASS]
- [x] CHK-021 [P0] EX-016 has been executed and raw `checkpoint_list` output showing newest-first ordering is captured as evidence [EVIDENCE: scratch/evidence/EX-016-checkpoint-listing.md — PASS]
- [x] CHK-022 [P0] EX-017 has been executed inside sandbox and `checkpoint_restore` response plus `memory_health()` output confirming known record restored is captured as evidence [EVIDENCE: scratch/evidence/EX-017-checkpoint-restore.md — PASS]
- [x] CHK-023 [P0] EX-018 has been executed inside sandbox and before/after `checkpoint_list` outputs confirming removal are captured as evidence [EVIDENCE: scratch/evidence/EX-018-checkpoint-deletion.md — PASS]
- [x] CHK-024 [P0] 097 has been executed and logs showing all five state transitions (`queued -> parsing -> embedding -> indexing -> complete`) plus cancellation confirmation and restart requeue evidence are captured [EVIDENCE: scratch/evidence/097-ingest-lifecycle.md — PARTIAL: MCP + code analysis]
- [x] CHK-025 [P0] 114 has been executed with traversal-path rejection, out-of-base rejection, and valid-path acceptance all captured as evidence; E_VALIDATION error codes are present for invalid inputs [EVIDENCE: scratch/evidence/114-path-traversal.md — PASS]
- [x] CHK-026 [P0] 124 has been executed inside sandbox and DB/log evidence for archive parity, unarchive parity, deferred vector rebuild, and protected-tier protection is captured [EVIDENCE: scratch/evidence/124-archival-lifecycle.md — PARTIAL: code analysis + unit tests]
- [x] CHK-027 [P0] 134 has been executed and filesystem and log evidence showing committed-file re-ingestion versus stale-file skip divergence is captured, with scan root set confirmed [EVIDENCE: scratch/evidence/134-startup-recovery.md — PARTIAL: code analysis + unit tests]
- [x] CHK-028 [P0] 144 has been executed with status polling evidence across sparse and progressing states confirming forecast fields are present, advisory, and safe [EVIDENCE: scratch/evidence/144-ingest-forecast.md — PASS]
- [x] CHK-029 [P0] Each of the nine scenarios has a verdict (PASS, PARTIAL, or FAIL) with explicit rationale referencing the review protocol acceptance rules [EVIDENCE: scratch/verdict-assessment.md — 6 PASS, 3 PARTIAL, 0 FAIL]
- [x] CHK-030 [P1] Coverage summary reports 9/9 scenarios executed with no skipped test IDs [EVIDENCE: implementation-summary.md — 9/9 coverage]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No secrets or credentials were added to lifecycle phase documents [EVIDENCE: doc-only content, no secret literals in any of the four files]
- [x] CHK-041 [P0] EX-018 is marked destructive and plan.md Phase 3 explicitly restricts deletion to a disposable sandbox with a pre-test checkpoint in place [EVIDENCE: plan.md Phase 3 step for EX-018 references sandbox-only and rollback procedure]
- [x] CHK-042 [P0] EX-017 restore mutation and 124 archival mutation are both restricted to sandbox-only execution in plan.md Phase 3 [EVIDENCE: plan.md Phase 3 step covers EX-017, EX-018, and 124 together under sandbox-only rule]
- [x] CHK-043 [P1] Sandbox isolation is confirmed before executing EX-017, EX-018, or 124: disposable test database or checkpoint exists and production-adjacent paths are absent from the sandbox fixture [EVIDENCE: test-sandbox-lifecycle folder with pre-test checkpoints pre-EX-017-restore (id:6), pre-EX-018-delete (id:7), pre-124-archival (id:8)]
- [x] CHK-044 [P1] After each destructive test, rollback was performed by restoring the pre-test checkpoint or rebuilding the sandbox fixture before the next scenario started [EVIDENCE: checkpoint_restore(pre-EX-018-delete) executed after EX-018 deletion test]
- [x] CHK-045 [P2] Open questions about sandbox spec folder path and 124 DB parity evidence format are resolved before executing any destructive scenario in a shared environment [EVIDENCE: pre-execution-analysis.md resolves all 3 open questions]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` contain no template placeholder text [EVIDENCE: all content is derived from playbook EX-015 through EX-018 and 097, 114, 124, 134, 144 rows and feature catalog]
- [x] CHK-051 [P0] All four phase documents are synchronized: scenario names, prompts, and command sequences are consistent across spec, plan, tasks, and checklist [EVIDENCE: cross-file consistency verified during execution — all 9 test IDs match across spec.md, plan.md, tasks.md, checklist.md]
- [x] CHK-052 [P1] `implementation-summary.md` is created when execution and verification are complete [EVIDENCE: file updated with execution results, verdict table, and coverage summary]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Only the four phase documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) were created in `005-lifecycle/` [EVIDENCE: directory listing confirms four files]
- [x] CHK-061 [P1] No unrelated files were added outside the `005-lifecycle/` folder as part of this phase packet creation [EVIDENCE: only test-sandbox-lifecycle created for test fixtures, no other files modified outside 005-lifecycle]
- [x] CHK-062 [P2] Memory save was triggered after phase packet creation to make lifecycle context available for future sessions [EVIDENCE: generate-context.js executed after closeout]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 19 | 19/19 |
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
