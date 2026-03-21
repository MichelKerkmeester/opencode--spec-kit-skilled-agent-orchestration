---
title: "Feature Specification: 005 lifecycle manual testing"
description: "Phase 005 breaks lifecycle manual test coverage into a focused Level 1 packet. It maps nine lifecycle scenarios from the manual testing playbook to concrete prompts, command sequences, evidence expectations, and pass criteria."
trigger_phrases:
  - "lifecycle manual testing"
  - "checkpoint lifecycle"
  - "async ingest lifecycle"
  - "phase 005"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: 005 lifecycle manual testing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent** | [`../spec.md`](../spec.md) |
| **Predecessor Phase** | `004-maintenance` |
| **Successor Phase** | `006-analysis` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Lifecycle manual test scenarios are defined in the shared playbook, but phase-level execution needs a focused packet that isolates the lifecycle category from the broader umbrella set. Without structured per-phase documentation, checkpoint, ingestion, archival, and startup-recovery tests are harder to run consistently, review, and hand off.

### Purpose
Provide a canonical phase 005 lifecycle spec that documents exactly nine lifecycle scenarios with their prompts, command sequences, evidence expectations, and PASS criteria.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **EX-015 — Checkpoint creation**: [01-checkpoint-creation-checkpointcreate.md](../../feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md)
- **EX-016 — Checkpoint listing**: [02-checkpoint-listing-checkpointlist.md](../../feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md)
- **EX-017 — Checkpoint restore**: [03-checkpoint-restore-checkpointrestore.md](../../feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md)
- **EX-018 — Checkpoint deletion**: [04-checkpoint-deletion-checkpointdelete.md](../../feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md)
- **097 — Async ingestion job lifecycle**: [05-async-ingestion-job-lifecycle.md](../../feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md)
- **114 — Path traversal validation**: [05-async-ingestion-job-lifecycle.md](../../feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md)
- **124 — Automatic archival lifecycle coverage**: [07-automatic-archival-subsystem.md](../../feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md)
- **134 — Startup pending-file recovery lifecycle coverage**: [06-startup-pending-file-recovery.md](../../feature_catalog/05--lifecycle/06-startup-pending-file-recovery.md)
- **144 — Advisory ingest lifecycle forecast**: [05-async-ingestion-job-lifecycle.md](../../feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md)

### Acceptance Scenarios

| Test ID | Scenario Objective |
|---------|--------------------|
| EX-015 | Verify checkpoint creation produces a discoverable backup before destructive work. |
| EX-016 | Verify checkpoint listing surfaces usable recovery assets in newest-first order. |
| EX-017 | Verify checkpoint restore returns a known record and healthy runtime state. |
| EX-018 | Verify stale checkpoint deletion removes the named sandbox snapshot safely. |
| 097 | Verify ingest job lifecycle state transitions, cancellation, and restart requeue behavior. |
| 114 | Verify ingest path validation rejects traversal and out-of-base inputs while allowing valid sandbox paths. |
| 124 | Verify archive and unarchive keep metadata, BM25, and vector behavior in sync while protecting high-tier memories. |
| 134 | Verify startup recovery handles committed and stale pending files differently across allowed scan roots. |
| 144 | Verify ingest forecast fields stay present, advisory, and safe during early and progressing states. |

- **Given** a disposable sandbox with seed lifecycle data, **when** EX-015 through EX-018 are documented and executed in order, **then** checkpoint creation, listing, restore, and deletion can be reviewed against clear evidence and PASS rules.
- **Given** valid and invalid ingest inputs, **when** 097, 114, and 144 are run through the MCP runtime, **then** lifecycle state transitions, validation failures, and advisory forecast fields can be verified without ambiguity.
- **Given** dormant, archived, committed, and stale sandbox artifacts, **when** 124 and 134 are exercised, **then** archival parity and startup recovery behavior can be judged against explicit filesystem, DB, and log evidence.

### Out of Scope
- Executing the lifecycle tests and recording final pass/fail outcomes.
- Editing the playbook, review protocol, or feature catalog source documents.
- Documenting tests outside phase 005 lifecycle coverage.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 005 lifecycle requirements and scope packet |
| `plan.md` | Create | Phase 005 lifecycle execution plan |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document EX-015 checkpoint creation coverage. | Includes prompt `Create checkpoint pre-bulk-delete`, command flow `checkpoint_create(name,specFolder) -> checkpoint_list()`, required create/list evidence, and PASS condition `checkpoint discoverable`. |
| REQ-002 | Document EX-016 checkpoint listing coverage. | Includes prompt `List checkpoints newest first`, command `checkpoint_list(specFolder,limit)`, required list output evidence, and PASS condition `checkpoints returned`. |
| REQ-003 | Document EX-017 checkpoint restore coverage. | Includes prompt `Restore checkpoint with merge mode`, command flow `checkpoint_restore(name,clearExisting:false) -> memory_health()`, required restore and health evidence, and PASS condition `known record restored`. |
| REQ-004 | Document EX-018 checkpoint deletion coverage. | Includes prompt `Delete stale checkpoint by name`, sandbox-only list/delete/list command chain, before/after list evidence, and PASS condition `checkpoint removed from sandbox list`. |
| REQ-005 | Document 097 async ingestion lifecycle coverage. | Captures start/status/cancel plus restart verification, state sequence `queued -> parsing -> embedding -> indexing -> complete`, cancellation evidence, and PASS condition that all five states transition correctly and cancel works. |
| REQ-006 | Document 114 path traversal validation coverage. | Captures traversal and out-of-base rejection attempts plus one valid ingest attempt, includes E_VALIDATION evidence, and PASS condition that invalid paths are rejected while valid paths create jobs successfully. |
| REQ-007 | Document 124 automatic archival lifecycle coverage. | Captures archive/unarchive checks for metadata, BM25, and vector parity, protected-tier safeguards, required DB/log evidence, and PASS condition that archive/unarchive parity holds with deferred vector rebuild behavior explicit on unarchive. |
| REQ-008 | Document 134 startup pending-file recovery coverage. | Captures committed-versus-stale pending file setup, startup recovery scan behavior, filesystem/log evidence, and PASS condition that committed/stale paths diverge correctly and the startup scan root set matches expected allowed locations. |
| REQ-009 | Document 144 advisory ingest lifecycle forecast coverage. | Captures forecast field checks across sparse and progressing states, status polling evidence, and PASS condition that forecast fields remain present, degrade safely, and update advisory values without handler failure. |

### P1 - Required (complete OR user-approved deferral)
No additional P1 requirements for this phase packet.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All nine lifecycle tests are documented with exact prompts, command sequences, expected evidence, and PASS verdict rules.
- **SC-002**: Every scoped test ID links to its lifecycle feature catalog source and remains within phase 005 coverage only.
- **SC-003**: The paired plan defines a runnable manual/MCP execution pipeline, including sandbox controls for destructive lifecycle scenarios.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `../../manual_testing_playbook/manual_testing_playbook.md` | Missing prompt or PASS-rule source blocks accurate scenario documentation | Treat the playbook as the single source of truth for prompts, commands, evidence, and verdict criteria |
| Dependency | `../../manual_testing_playbook/manual_testing_playbook.md` §5 Review Protocol | Verdict language may drift from review expectations | Align evidence and verdict wording to the review protocol acceptance rules |
| Dependency | `../../feature_catalog/05--lifecycle/` | Lifecycle scenarios would lose feature-level traceability | Link every scoped test ID back to its catalog entry |
| Dependency | MCP runtime with checkpoint and ingest tools | Execution planning is incomplete without tool availability assumptions | Document tool-specific preconditions and sandbox requirements in `plan.md` |
| Risk | Destructive lifecycle steps damage non-sandbox data | High | Restrict deletion, restore, and archival mutations to disposable sandbox data and checkpoints only |
| Risk | Restart-sensitive lifecycle scenarios are hard to reproduce consistently | Medium | Require explicit evidence capture for restart, recovery, and forecast polling steps |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- ~~Which sandbox spec folder path should be treated as the default target for checkpoint and ingest drills in this phase?~~ **Resolved:** `test-sandbox-lifecycle` — disposable folder with seed files under `.opencode/specs/`.
- ~~What local restart procedure should operators use to verify 097 incomplete-job requeue behavior consistently?~~ **Resolved:** Server restart triggers `resetIncompleteJobsToQueued()` via `startupScan()`. Cannot be tested in a live MCP session; code analysis + unit tests (T005b-Q8) serve as evidence.
- ~~What evidence format is preferred for 124 DB parity checks when direct SQL output and MCP logs disagree in granularity?~~ **Resolved:** Code analysis with exact file:line references and unit test citations. Direct SQL is not exposed via MCP tools.
<!-- /ANCHOR:questions -->

---
