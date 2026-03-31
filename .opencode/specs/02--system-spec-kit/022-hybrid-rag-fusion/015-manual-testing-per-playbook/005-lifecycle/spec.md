---
title: "Feature Specification: [02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/005-lifecycle/spec]"
description: "Phase 005 documents the lifecycle manual test packet. Execute all 10 scenarios (EX-015, EX-016, EX-017, EX-018, 097, 100, 114, 124, 134, 144) to verify checkpoint management, async ingestion, path traversal guards, archival, startup recovery, and ingest forecast."
trigger_phrases:
  - "lifecycle manual testing"
  - "phase 005 lifecycle"
  - "ex-015 ex-016 ex-017 ex-018 lifecycle"
  - "checkpoint lifecycle test"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook lifecycle phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Not Started |
| **Created** | 2026-03-22 |
| **Branch** | `main` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [004-maintenance](../004-maintenance/spec.md) |
| **Successor** | [006-analysis](../006-analysis/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 005 lifecycle scenarios must be executed from scratch. All prior results are invalidated. Ten lifecycle scenarios require fresh manual execution to verify checkpoint create/list/restore/delete, async ingestion job lifecycle, async shutdown, path traversal validation, automatic archival, startup pending-file recovery, and advisory ingest forecast.

### Purpose
Execute all ten Phase 005 lifecycle scenarios, record verdicts and evidence, and mark this phase complete only when all P0 checklist items pass.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Playbook File |
|---------|---------------|---------------|
| EX-015 | Checkpoint creation (checkpoint_create) | `../../manual_testing_playbook/05--lifecycle/015-checkpoint-creation-checkpoint-create.md` |
| EX-016 | Checkpoint listing (checkpoint_list) | `../../manual_testing_playbook/05--lifecycle/016-checkpoint-listing-checkpoint-list.md` |
| EX-017 | Checkpoint restore (checkpoint_restore) | `../../manual_testing_playbook/05--lifecycle/017-checkpoint-restore-checkpoint-restore.md` |
| EX-018 | Checkpoint deletion (checkpoint_delete) | `../../manual_testing_playbook/05--lifecycle/018-checkpoint-deletion-checkpoint-delete.md` |
| 097 | Async ingestion job lifecycle (P0-3) | `../../manual_testing_playbook/05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md` |
| 100 | Async shutdown with deadline (server lifecycle) | `../../manual_testing_playbook/05--lifecycle/100-async-shutdown-with-deadline-server-lifecycle.md` |
| 114 | Path traversal validation (P0-4) | `../../manual_testing_playbook/05--lifecycle/114-path-traversal-validation-p0-4.md` |
| 124 | Automatic archival lifecycle coverage | `../../manual_testing_playbook/05--lifecycle/124-automatic-archival-lifecycle-coverage.md` |
| 134 | Startup pending-file recovery lifecycle coverage | `../../manual_testing_playbook/05--lifecycle/134-startup-pending-file-recovery-lifecycle-coverage.md` |
| 144 | Advisory ingest lifecycle forecast | `../../manual_testing_playbook/05--lifecycle/144-advisory-ingest-lifecycle-forecast.md` |

### Out of Scope
- Scenarios from other phases (retrieval, mutation, discovery, maintenance, etc.)
- Modifying the playbook or feature catalog source files
- Automated test harnesses — this phase is manual execution only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Rewrite | Phase 005 clean-slate specification |
| `plan.md` | Rewrite | Execution plan for Phase 005 |
| `tasks.md` | Rewrite | One task per scenario, all pending |
| `checklist.md` | Rewrite | P0/P1 items, all unchecked |
| `implementation-summary.md` | Rewrite | Blank — to be filled after execution |

### Scenario Registry

| # | Scenario ID | Scenario Name | Feature Catalog Ref |
|---|-------------|---------------|---------------------|
| 1 | 015 | Checkpoint creation (checkpoint_create) | 05--lifecycle/01-checkpoint-creation-checkpointcreate.md |
| 2 | 016 | Checkpoint listing (checkpoint_list) | 05--lifecycle/02-checkpoint-listing-checkpointlist.md |
| 3 | 017 | Checkpoint restore (checkpoint_restore) | 05--lifecycle/03-checkpoint-restore-checkpointrestore.md |
| 4 | 018 | Checkpoint deletion (checkpoint_delete) | 05--lifecycle/04-checkpoint-deletion-checkpointdelete.md |
| 5 | 097 | Async ingestion job lifecycle (P0-3) | 05--lifecycle/05-async-ingestion-job-lifecycle.md |
| 6 | 100 | Async shutdown with deadline (server lifecycle) | — |
| 7 | 114 | Path traversal validation (P0-4) | 05--lifecycle/05-async-ingestion-job-lifecycle.md |
| 8 | 124 | Automatic archival lifecycle coverage | 05--lifecycle/07-automatic-archival-subsystem.md |
| 9 | 134 | Startup pending-file recovery lifecycle coverage | 05--lifecycle/06-startup-pending-file-recovery.md |
| 10 | 144 | Advisory ingest lifecycle forecast | 05--lifecycle/05-async-ingestion-job-lifecycle.md |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Execute EX-015: create a named checkpoint | PASS if checkpoint is created and name is returned |
| REQ-002 | Execute EX-016: list all available checkpoints | PASS if checkpoint list is returned with the checkpoint from EX-015 present |
| REQ-003 | Execute EX-017: restore memory state from a checkpoint | PASS if restore completes without error and memory state reflects checkpoint |
| REQ-004 | Execute EX-018: delete a checkpoint by name with confirmName safety | PASS if checkpoint is deleted and is absent from subsequent list |
| REQ-005 | Execute 097: start an async ingestion job, poll status, and confirm completion | PASS if job reaches completed state within timeout |
| REQ-006 | Execute 100: trigger async shutdown with deadline and confirm graceful exit | PASS if server exits cleanly within deadline |
| REQ-007 | Execute 114: submit a path traversal payload and confirm it is rejected | PASS if traversal attempt returns validation error |
| REQ-008 | Execute 124: verify automatic archival triggers on eligible memories | PASS if archival fires and targeted memories are archived |
| REQ-009 | Execute 134: verify startup pending-file recovery processes pending files on server start | PASS if pending files are indexed on next startup |
| REQ-010 | Execute 144: invoke advisory ingest lifecycle forecast and capture output | PASS if forecast response is returned with ingest advisory data |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | Capture evidence for each scenario (tool output or screenshot) | Evidence recorded in implementation-summary.md |
| REQ-012 | Mark final verdict per scenario following the review protocol | Verdict recorded against all 10 scenarios in implementation-summary.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: EX-015 through EX-018 (checkpoint lifecycle) all produce valid tool responses
- **SC-002**: Scenario 097 async ingestion job reaches completed state
- **SC-003**: Scenario 100 server shutdown completes gracefully within deadline
- **SC-004**: Scenario 114 path traversal payload is rejected with a validation error
- **SC-005**: Scenarios 124 and 134 verify archival and startup recovery respectively
- **SC-006**: Scenario 144 returns an advisory ingest forecast
- **SC-007**: All 10 verdicts are recorded and all P0 checklist items are checked
### Acceptance Scenarios

**Given** the `005-lifecycle` phase packet, **when** a reviewer opens the scenario mapping, **then** every scenario listed for the phase has a bounded execution target and a documented acceptance rule.

**Given** the `005-lifecycle` phase packet, **when** execution evidence is reviewed, **then** verdict notes can be traced through `tasks.md`, `checklist.md`, and `implementation-summary.md`.

**Given** the `005-lifecycle` phase packet, **when** a reviewer checks neighboring navigation, **then** the packet points back to the parent and to the adjacent numbered phase where one exists.

**Given** strict validation runs on the `005-lifecycle` phase packet, **when** the validator checks structure, **then** the packet satisfies Level 2 requirement and acceptance-scenario minimums.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Canonical playbook: `../scratch/context-playbook.md` §05--lifecycle | Source of truth for exact prompts and pass criteria | Treat as read-only |
| Dependency | Feature catalog: `../scratch/context-feature-catalog.md` §05--lifecycle | Feature context for each scenario | Read before execution |
| Dependency | MCP runtime with indexed memory corpus | Required for checkpoint, ingest, archival, and recovery scenarios | Verify MCP server is running before starting |
| Risk | EX-017 restore mutates memory state irreversibly | High | Create a fresh checkpoint in EX-015 specifically for EX-017; do not restore production checkpoints |
| Risk | EX-018 delete with wrong confirmName causes error | Low | Use exact checkpoint name from EX-015 as confirmName |
| Risk | Scenario 097 async job may time out on slow systems | Medium | Follow playbook polling interval; if job does not complete in expected time, record PARTIAL |
| Risk | Scenario 100 shutdown may leave server unavailable | High | Restart MCP server after executing scenario 100; run 100 last within the server-dependent scenarios |
| Risk | Scenario 134 startup recovery requires a pending file in the queue | Medium | Follow playbook setup steps exactly to place a pending file before triggering server start |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None at start. Record any blockers discovered during execution here.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Checkpoint create/list/restore/delete (EX-015 to EX-018) must each complete within the MCP server's default timeout
- **NFR-P02**: Async ingestion job (097) must reach completion within a reasonable polling window per the playbook

### Security
- **NFR-S01**: EX-018 checkpoint delete must require exact confirmName match; do not bypass safety gate
- **NFR-S02**: Scenario 114 path traversal payload must never be sent to a production corpus

### Reliability
- **NFR-R01**: All 10 scenarios must complete to claim phase done
- **NFR-R02**: Partial execution counts as PARTIAL verdict for the phase, not completion
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## L2: EDGE CASES

### Data Boundaries
- EX-016 with no checkpoints: record as PARTIAL if EX-015 failed; EX-016 depends on EX-015
- Scenario 097 job stuck in processing state: poll up to playbook-specified limit; record FAIL if timeout exceeded
- Scenario 144 with no pending files in queue: record as PASS if forecast runs and returns advisory data

### Error Scenarios
- MCP server unavailable: stop, restart server, then retry the failed scenario
- EX-017 restore fails: record FAIL with exact error; do not retry restore against a different checkpoint
- Scenario 100 kills server: restart before running remaining scenarios that require MCP

### State Transitions
- Run EX-015 before EX-016, EX-017, and EX-018 (they depend on the created checkpoint)
- Run scenario 100 after all MCP-dependent scenarios to avoid premature server shutdown
- Run scenario 134 as the last scenario if it requires a server restart
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 10 scenarios, checkpoint state chain, async job, server shutdown |
| Risk | 12/25 | Restore mutation risk, shutdown risk, startup recovery dependency |
| Research | 5/20 | Playbook provides context; ordering requires careful reading |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
