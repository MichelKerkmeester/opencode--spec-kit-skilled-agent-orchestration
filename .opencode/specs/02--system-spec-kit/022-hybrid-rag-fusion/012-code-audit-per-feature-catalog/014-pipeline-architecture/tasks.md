---
title: "Tasks: pipeline-architecture [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path) | Date: 2026-03-10"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
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

- [x] T001 Fix chunk ordering feature source/test inventory (`../../feature_catalog/14--pipeline-architecture/03-chunk-ordering-preservation.md`)
- [x] T002 Fix performance improvements feature source/test inventory (`../../feature_catalog/14--pipeline-architecture/08-performance-improvements.md`)
- [x] T003 Fix activation window persistence source/test mapping (`../../feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md`)
- [x] T004 Expand or split pipeline/mutation hardening inventory (`../../feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md`)
- [x] T005 Add DB_PATH script-consumer references and resolver tests (`../../feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md`)
- [x] T006 Reconcile 7-layer classifier-routing claim with runtime (`../../feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md`)
- [x] T007 Trim deferred warm-server feature tables and remove nonexistent test references (`../../feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T008 Fix `lastDbCheck` advancement ordering on failed rebinding (`mcp_server/core/db-state.ts`)
- [x] T009 Resolve `memory_save` transactional mismatch in atomic save flow (`mcp_server/handlers/memory-save.ts`)
- [x] T010 [P] Add handler-level atomic-save failure-injection tests (`mcp_server/tests/*memory-save*.vitest.ts`)
- [x] T011 Fix pending-file recovery by checking DB existence before rename (`mcp_server/lib/storage/transaction-manager.ts`)
- [x] T012 [P] Add startup recovery tests for committed vs uncommitted pending files (`mcp_server/tests/transaction-manager.vitest.ts`)
- [x] T013 Remove nonexistent `retry.vitest.ts` entry from 4-stage pipeline feature catalog (`../../feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md`)
- [x] T014 Update stale MPAB default-state comment (`mcp_server/lib/scoring/mpab-aggregation.ts`)
- [x] T015 Update stale learned-feedback feature-flag comment (`mcp_server/lib/search/learned-feedback.ts`)
- [x] T016 Fix stale quality-floor threshold comment and retry-test reference (`mcp_server/tests/channel-representation.vitest.ts`)
- [x] T017 Remove nonexistent retry test entry and trim legacy V1 inventory (`../../feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Add strict-vs-passthrough schema tests and stderr logging assertion (`mcp_server/tests/tool-input-schema.vitest.ts`)
- [x] T019 Add dynamic server-instructions regression coverage and clean stale test references (`mcp_server/context-server.ts` and related tests)
- [x] T020 Add end-to-end embedding retry save/index failure-path test (`mcp_server/tests/retry-manager.vitest.ts` and `mcp_server/tests/index-refresh.vitest.ts`)
- [x] T021 Wire direct traceability for F04/F05 to their owning implementation/tests (`../../feature_catalog/14--pipeline-architecture/04-template-anchor-optimization.md`, `../../feature_catalog/14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md`) — Evidence: feature docs now cite direct implementation/test ownership including `pipeline-architecture-remediation.vitest.ts`.
- [x] T022 Convert F11 from shared traceability to direct traceability (`../../feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md`) — Evidence: matrix now points directly at T004/T009/T011 and the feature doc keeps the concrete pipeline/mutation test inventory.
- [x] T023 Close F16 as implemented vector-store abstraction seam with direct evidence (`../../feature_catalog/14--pipeline-architecture/16-backend-storage-adapter-abstraction.md`) — Evidence: feature doc now reflects `IVectorStore` + `SQLiteVectorStore` plus `interfaces.vitest.ts`, `pipeline-architecture-remediation.vitest.ts`, and `vector-index-impl.vitest.ts`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:traceability -->
## L2: FEATURE TRACEABILITY MATRIX

### Coverage Rubric

| Status | Meaning |
|--------|---------|
| `Directly task-backed` | A backlog task or task pair directly addresses the feature's documented remediation need. |
| `Directly task-backed` | The feature has an explicit task/evidence link in this packet. |

### Matrix

| Feature | Catalog Source | Coverage | Backlog Link | Notes |
|---------|----------------|----------|--------------|-------|
| F01 | `../../feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md` | Directly task-backed | `T013` | Remove nonexistent retry-test inventory entry. |
| F02 | `../../feature_catalog/14--pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md` | Directly task-backed | `T014` | Correct stale MPAB comment state. |
| F03 | `../../feature_catalog/14--pipeline-architecture/03-chunk-ordering-preservation.md` | Directly task-backed | `T001` | Reconcile source/test inventory. |
| F04 | `../../feature_catalog/14--pipeline-architecture/04-template-anchor-optimization.md` | Directly task-backed | `T021` | Direct implementation/test ownership captured, including `anchor-metadata.vitest.ts` and `pipeline-architecture-remediation.vitest.ts`. |
| F05 | `../../feature_catalog/14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md` | Directly task-backed | `T021` | Direct implementation/test ownership captured, including `validation-metadata.vitest.ts` and `pipeline-architecture-remediation.vitest.ts`. |
| F06 | `../../feature_catalog/14--pipeline-architecture/06-learned-relevance-feedback.md` | Directly task-backed | `T015` | Update stale learned-feedback comment. |
| F07 | `../../feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md` | Directly task-backed | `T016` | Fix stale quality-floor and retry-reference comments. |
| F08 | `../../feature_catalog/14--pipeline-architecture/08-performance-improvements.md` | Directly task-backed | `T002` | Reconcile performance feature inventory. |
| F09 | `../../feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md` | Directly task-backed | `T003` | Correct source/test mapping. |
| F10 | `../../feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md` | Directly task-backed | `T017` | Remove nonexistent retry-test entry and trim legacy inventory. |
| F11 | `../../feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md` | Directly task-backed | `T022` with `T004`, `T009`, `T011` | Direct traceability now points at the inventory split plus the paired runtime hardening tasks. |
| F12 | `../../feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md` | Directly task-backed | `T005` | Add DB path references and resolver tests. |
| F13 | `../../feature_catalog/14--pipeline-architecture/13-strict-zod-schema-validation.md` | Directly task-backed | `T018` | Add strict-vs-passthrough validation coverage. |
| F14 | `../../feature_catalog/14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md` | Directly task-backed | `T019` | Add regression coverage and clean stale references. |
| F15 | `../../feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md` | Directly task-backed | `T007` | Trim deferred feature tables and remove nonexistent tests. |
| F16 | `../../feature_catalog/14--pipeline-architecture/16-backend-storage-adapter-abstraction.md` | Directly task-backed | `T023` | Current runtime seam is documented as implemented vector-store abstraction rather than a deferred gap. |
| F17 | `../../feature_catalog/14--pipeline-architecture/17-cross-process-db-hot-rebinding.md` | Directly task-backed | `T008` | Fix `lastDbCheck` advancement ordering. |
| F18 | `../../feature_catalog/14--pipeline-architecture/18-atomic-write-then-index-api.md` | Directly task-backed | `T009`, `T010` | Implementation and failure-injection coverage are paired. |
| F19 | `../../feature_catalog/14--pipeline-architecture/19-embedding-retry-orchestrator.md` | Directly task-backed | `T020` | Add end-to-end retry failure-path coverage. |
| F20 | `../../feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md` | Directly task-backed | `T006` | Reconcile architecture metadata claim with runtime. |
| F21 | `../../feature_catalog/14--pipeline-architecture/21-atomic-pending-file-recovery.md` | Directly task-backed | `T011`, `T012` | Runtime fix and startup recovery tests are paired. |

### Coverage Summary

- 21 total features mapped in the core docs.
- 21 features are `Directly task-backed`.
<!-- /ANCHOR:traceability -->

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
