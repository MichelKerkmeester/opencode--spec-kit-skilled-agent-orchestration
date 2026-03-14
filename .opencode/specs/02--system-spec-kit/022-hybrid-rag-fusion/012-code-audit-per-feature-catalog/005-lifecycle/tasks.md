---
title: "Tasks: lifecycle [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
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

- [x] T001 Consolidate lifecycle feature inventory and source citations (`.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/`)
- [x] T002 Confirm PASS/WARN/FAIL finding taxonomy and acceptance targets (`spec.md`)
- [x] T003 [P] Validate playbook mapping baseline EX-015..EX-018 plus NEW-097/NEW-114/NEW-123/NEW-124 (`manual_testing_playbook`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Unify ingest path limit to a shared constant (`mcp_server/handlers/memory-ingest.ts`, `mcp_server/schemas/tool-input-schemas.ts`) — Extracted `MAX_INGEST_PATHS = 50` to schemas, imported in handler
- [x] T005 [P0] Add ingest boundary and queue concurrency/state-transition tests (`mcp_server/tests/handler-memory-ingest-edge.vitest.ts`, `mcp_server/tests/job-queue-state-edge.vitest.ts`) — 13+13=26 edge tests, all passing
- [x] T006 [P0] Implement stale pending-file detection before rename recovery (`mcp_server/lib/storage/transaction-manager.ts`) — Added `IsCommittedCheck` callback, stale files logged and left for manual review
- [x] T007 [P0] Add committed-vs-uncommitted crash recovery tests (`mcp_server/tests/transaction-manager-recovery.vitest.ts`) — 13 tests covering committed, stale, mixed, and backwards-compatible scenarios
- [x] T008 [P0] Implement vector archival cleanup mode with BM25 parity (`mcp_server/lib/cognitive/archival-manager.ts`) — Added `syncVectorOnArchive`/`syncVectorOnUnarchive`, wired into archive/unarchive/batch paths
- [x] T009 [P2] Replace stale retry.vitest.ts references for F-01 and add checkpoint_create integration coverage (`.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md`, `mcp_server/tests/handler-checkpoints-edge.vitest.ts`) — Stale ref removed, 12 checkpoint edge tests added
- [x] T010 [P2] Add deterministic checkpoint_list assertions and remove stale references (`.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md`, `mcp_server/tests/handler-checkpoints-edge.vitest.ts`) — Stale ref removed, list edge cases in checkpoint tests
- [x] T011 [P2] Add checkpoint_restore side-effect integration assertions and remove stale references (`.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md`, `mcp_server/tests/handler-checkpoints-edge.vitest.ts`) — Stale ref removed, restore edge cases in checkpoint tests
- [x] T012 [P2] Add checkpoint_delete confirmName end-to-end coverage and remove stale references (`.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md`, `mcp_server/tests/handler-checkpoints-edge.vitest.ts`) — Stale ref removed, delete edge cases in checkpoint tests
- [x] T013 [P2] Remove stale retry.vitest.ts reference for async ingestion feature (`.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md`) — Removed
- [x] T014 [P2] Remove stale retry.vitest.ts reference for startup recovery feature (`.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/06-startup-pending-file-recovery.md`) — No stale ref found (already clean)
- [x] T015 [P2] Remove stale retry.vitest.ts reference for archival feature (`.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md`) — No stale ref found (already clean)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Re-run lifecycle feature audit against updated implementation and tests (`.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/`) — Targeted lifecycle suites pass (51/51). Full suite now passes at 264/265 files (`1 skipped`, `0 failed`)
- [x] T017 Verify EX-015..EX-018 plus NEW-097/NEW-114/NEW-123/NEW-124 mapping completeness per feature (`manual_testing_playbook`) — Playbook mapping updated to include lifecycle 06/07 entries
- [x] T018 Synchronize findings across spec, plan, tasks, and checklist (`005-lifecycle/*.md`) — All 4 artifacts updated post-implementation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
