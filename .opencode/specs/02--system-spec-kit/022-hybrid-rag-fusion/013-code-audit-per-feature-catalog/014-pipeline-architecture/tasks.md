---
title: "Tasks: pipeline-architecture [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path) | Date: 2026-03-10"
trigger_phrases:
  - "tasks"
  - "pipeline-architecture"
  - "pipeline architecture"
  - "code audit"
  - "feature backlog"
  - "hybrid rag fusion"
importance_tier: "normal"
contextType: "general"
---
# Tasks: pipeline-architecture

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

- [ ] T001 Fix chunk ordering feature source/test inventory (`feature_catalog/14--pipeline-architecture/03-chunk-ordering-preservation.md`)
- [ ] T002 Fix performance improvements feature source/test inventory (`feature_catalog/14--pipeline-architecture/08-performance-improvements.md`)
- [ ] T003 Fix activation window persistence source/test mapping (`feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md`)
- [ ] T004 Expand or split pipeline/mutation hardening inventory (`feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md`)
- [ ] T005 Add DB_PATH script-consumer references and resolver tests (`feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md`)
- [ ] T006 Reconcile 7-layer classifier-routing claim with runtime (`feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md`)
- [ ] T007 Trim deferred warm-server feature tables and remove nonexistent test references (`feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T008 Fix `lastDbCheck` advancement ordering on failed rebinding (`mcp_server/core/db-state.ts`)
- [ ] T009 Resolve `memory_save` transactional mismatch in atomic save flow (`mcp_server/handlers/memory-save.ts`)
- [ ] T010 [P] Add handler-level atomic-save failure-injection tests (`mcp_server/tests/*memory-save*.vitest.ts`)
- [ ] T011 Fix pending-file recovery by checking DB existence before rename (`mcp_server/lib/storage/transaction-manager.ts`)
- [ ] T012 [P] Add startup recovery tests for committed vs uncommitted pending files (`mcp_server/tests/transaction-manager.vitest.ts`)
- [ ] T013 Remove nonexistent `retry.vitest.ts` entry from 4-stage pipeline feature catalog (`feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md`)
- [ ] T014 Update stale MPAB default-state comment (`mcp_server/lib/scoring/mpab-aggregation.ts`)
- [ ] T015 Update stale learned-feedback feature-flag comment (`mcp_server/lib/search/learned-feedback.ts`)
- [ ] T016 Fix stale quality-floor threshold comment and retry-test reference (`mcp_server/tests/channel-representation.vitest.ts`)
- [ ] T017 Remove nonexistent retry test entry and trim legacy V1 inventory (`feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Add strict-vs-passthrough schema tests and stderr logging assertion (`mcp_server/tests/tool-input-schema.vitest.ts`)
- [ ] T019 Add dynamic server-instructions regression coverage and clean stale test references (`mcp_server/context-server.ts` and related tests)
- [ ] T020 Add end-to-end embedding retry save/index failure-path test (`mcp_server/tests/retry-manager.vitest.ts` and `mcp_server/tests/index-refresh.vitest.ts`)
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
