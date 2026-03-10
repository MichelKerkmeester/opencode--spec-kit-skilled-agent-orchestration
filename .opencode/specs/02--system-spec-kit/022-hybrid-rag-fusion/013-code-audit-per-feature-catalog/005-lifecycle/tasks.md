---
title: "Tasks: lifecycle [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "lifecycle"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
# Tasks: lifecycle

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Consolidate lifecycle feature inventory and source citations (`feature_catalog/05--lifecycle/`)
- [ ] T002 Confirm PASS/WARN/FAIL finding taxonomy and acceptance targets (`005-lifecycle/spec.md`)
- [ ] T003 [P] Validate playbook mapping baseline EX-023..EX-027 (`manual_test_playbook`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P0] Unify ingest path limit to a shared constant (`mcp_server/handlers/memory-ingest.ts`, `mcp_server/schemas/tool-input-schemas.ts`)
- [ ] T005 [P0] Add ingest boundary and queue concurrency/state-transition tests (`mcp_server/tests/handler-memory-ingest.vitest.ts`, `mcp_server/tests/job-queue.vitest.ts`)
- [ ] T006 [P0] Implement stale pending-file detection before rename recovery (`mcp_server/lib/storage/transaction-manager.ts`, `mcp_server/context-server.ts`)
- [ ] T007 [P0] Add committed-vs-uncommitted crash recovery tests (`mcp_server/tests/transaction-manager.vitest.ts`, `mcp_server/tests/context-server.vitest.ts`)
- [ ] T008 [P0] Implement vector archival cleanup mode with BM25 parity (`mcp_server/lib/cognitive/archival-manager.ts`)
- [ ] T009 [P2] Replace stale retry.vitest.ts references for F-01 and add checkpoint_create integration coverage (`feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md`, `mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts`)
- [ ] T010 [P2] Add deterministic checkpoint_list assertions and remove stale references (`feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md`, `mcp_server/tests/handler-checkpoints.vitest.ts`)
- [ ] T011 [P2] Add checkpoint_restore side-effect integration assertions and remove stale references (`feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md`, `mcp_server/tests/handler-checkpoints.vitest.ts`)
- [ ] T012 [P2] Add checkpoint_delete confirmName end-to-end coverage and remove stale references (`feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md`, `mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts`)
- [ ] T013 [P2] Remove stale retry.vitest.ts reference for async ingestion feature (`feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md`)
- [ ] T014 [P2] Remove stale retry.vitest.ts reference for startup recovery feature (`feature_catalog/05--lifecycle/06-startup-pending-file-recovery.md`)
- [ ] T015 [P2] Remove stale retry.vitest.ts reference for archival feature (`feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Re-run lifecycle feature audit against updated implementation and tests (`feature_catalog/05--lifecycle/`)
- [ ] T017 Verify EX-023..EX-027 mapping completeness per feature (`manual_test_playbook`)
- [ ] T018 Synchronize findings across spec, plan, tasks, and checklist (`005-lifecycle/*.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
