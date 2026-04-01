---
title: "Tasks: FTS5 Fix, Search Dashboard, and DB Path Drift Fix"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fts5 fix tasks"
  - "db path drift tasks"
  - "vector-index-store tasks"
  - "hybrid search tasks"
  - "search dashboard tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: FTS5 Fix, Search Dashboard, and DB Path Drift Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: level_2/tasks.md | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[ ]` | Pending |
| `[P]` | Parallelizable with sibling tasks in the same phase |
| `[B]` | Blocked — see blocker note |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Items 1 and 2 are complete. Phase 1 records their completion and sets up the context for the DB path drift fix (Item 3).

- [x] T001 Fix FTS5 double-quoting guard (`mcp_server/lib/search/sqlite-fts.ts` line 58)
- [x] T002 Compile dist after FTS5 fix (`bun run build`)
- [x] T003 Generate 30 dashboard design alternatives (`scratch/01-*.md` through `scratch/30-*.md`)
- [x] T004 Apply Design 10 (folder-as-tree-group) to search command (`.opencode/command/memory/search.md`)
- [x] T005 Apply Design 10 to agent command definition (`.agents/commands/memory/search.toml`)
- [ ] T006 Audit all server entrypoints for `MEMORY_DB_PATH` usage — list entrypoints that do not pass `MEMORY_DB_PATH` to the DB init path
- [ ] T007 Confirm `context-index.sqlite` exists and is populated (prerequisite for DB path fix)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P0 Group A — DB Path Enforcement and Injection

- [ ] T008 Add mandatory `MEMORY_DB_PATH` validation at entrypoints — fail-closed (process.exit / throw) if absent or file missing (`mcp_server/context-server.ts` and all entry files)
- [ ] T009 Inject explicit DB path into `vector-index-store.ts` constructor; remove `resolve_database_path()` per-operation call (lines 277–290)
- [ ] T010 Harden `shared/embeddings/profile.ts::getDatabasePath()` (lines 63–71) to not silently override injected path with provider-derived name
- [ ] T011 Add WARN-level log in `shared/embeddings.ts` (lines 364–417) when provider init would derive a different path than the one already injected
- [ ] T012 Build: `bun run build` exits 0 after Group A changes

### P0 Group B — Startup Health Check and db-state Fix

- [ ] T013 Add startup health check: query `memory_index` row count and `active_memory_projection` row count at server init; log counts
- [ ] T014 Trigger `runLineageBackfill()` when `memory_index` has rows but `active_memory_projection` is empty (`mcp_server/core/db-state.ts` or init sequence)
- [ ] T015 Fix `reinitializeDatabase()` in `db-state.ts` (lines 245–293): guard against rebinding active connection to an empty provider-specific DB when a populated DB is already open
- [ ] T016 Build: `bun run build` exits 0 after Group B changes

### P1 Group C — Silent Failure Remediation

- [ ] T017 [P] Add `assertInitialized()` guard in `hybrid-search.ts`: replace silent `return []` with `SearchNotInitializedError` or equivalent typed error
- [ ] T018 [P] Fix FTS scope filter in `sqlite-fts.ts` to match exact-or-descendant folders (align with BM25 behavior)
- [ ] T019 [P] Fix silent failure points in `hybrid-search.ts` — surface errors or log at WARN (target: 0 silent returns on unexpected conditions)
- [ ] T020 [P] Fix silent failure points in `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` — replace silent returns with typed errors or WARN logs
- [ ] T021 [P] Fix silent failure points in `mcp_server/lib/search/vector-index-queries.ts` — replace silent returns with typed errors or WARN logs
- [ ] T022 Build: `bun run build` exits 0 after Group C changes
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T023 [P] Run multi-word MCP search; confirm FTS5 and vector results both present in response
- [ ] T024 [P] Test server startup with `MEMORY_DB_PATH` unset; confirm explicit error / non-zero exit
- [ ] T025 Test server startup after Voyage-4 provider lazy-init; confirm active DB path is still `context-index.sqlite` (check startup logs)
- [ ] T026 Test startup health check: confirm `runLineageBackfill()` is triggered when `active_memory_projection` is empty and `memory_index` has rows
- [ ] T027 Update spec.md, plan.md, tasks.md, checklist.md to mark all completed items
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1 setup tasks marked `[x]`
- [ ] All Phase 2 P0 tasks (T008–T016) marked `[x]`
- [ ] All Phase 2 P1 tasks (T017–T022) marked `[x]` or user-approved deferral documented in checklist.md
- [ ] All Phase 3 verification tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining without resolution
- [ ] `bun run build` exits 0
- [ ] checklist.md P0 items verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research iterations**: `scratch/deep-research/` — 10 root cause analysis files
- **Review iterations**: `scratch/` — review-01.md through review-10.md
- **Root cause file 1**: `mcp_server/lib/search/vector-index-store.ts` lines 277–290
- **Root cause file 2**: `mcp_server/core/db-state.ts` lines 245–293
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
