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
- [x] T006 Audit all server entrypoints for `MEMORY_DB_PATH` usage — list entrypoints that do not pass `MEMORY_DB_PATH` to the DB init path
- [x] T007 Confirm `context-index.sqlite` exists and is populated (prerequisite for DB path fix)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P0 Group A — DB Path Enforcement and Injection

- [x] T008 Add mandatory `MEMORY_DB_PATH` validation at entrypoints — fail-closed (process.exit / throw) if absent or file missing (`mcp_server/context-server.ts` and all entry files)
- [x] T009 Inject explicit DB path into `vector-index-store.ts` constructor; remove `resolve_database_path()` per-operation call (lines 277–290) [Note: resolve_database_path() stabilized rather than removed — validates against drift]
- [x] T010 Harden `shared/embeddings/profile.ts::getDatabasePath()` (lines 63–71) to not silently override injected path with provider-derived name
- [x] T011 Add WARN-level log in `shared/embeddings.ts` (lines 364–417) when provider init would derive a different path than the one already injected
- [x] T012 Build: `bun run build` exits 0 after Group A changes

### P0 Group B — Startup Health Check and db-state Fix

- [x] T013 Add startup health check: query `memory_index` row count and `active_memory_projection` row count at server init; log counts
- [x] T014 Trigger `runLineageBackfill()` when `memory_index` has rows but `active_memory_projection` is empty (`mcp_server/core/db-state.ts` or init sequence)
- [x] T015 Fix `reinitializeDatabase()` in `db-state.ts` (lines 294–310): guard against rebinding active connection to an empty provider-specific DB when a populated DB is already open
- [x] T016 Build: `bun run build` exits 0 after Group B changes

### P1 Group C — Silent Failure Remediation

- [x] T017 [P] Add `assertInitialized()` guard in `hybrid-search.ts`: warn on uninitialized calls (defense-in-depth — warns + returns empty rather than throwing)
- [x] T018 [P] Fix FTS scope filter in `sqlite-fts.ts` to match exact-or-descendant folders (align with BM25 behavior) [lines 63-65, LIKE ? || "/%"]
- [x] T019 [P] Fix silent failure points in `hybrid-search.ts` — 8+ warning logs added at lines 331, 352-353, 370-371, 379-380, 398-399, 429-430, 455-456, 476-477
- [x] T020 [P] Fix silent failure points in `stage1-candidate-gen.ts` — 11+ warning logs added at lines 386-388, 549, 563, 640-642, 663-664, 678, 703-705, 726-727, 742, 758-760, 816-820
- [x] T021 [P] Fix silent failure points in `vector-index-queries.ts` — 12+ warning logs added at lines 175-176, 325-326, 505, 557, 592, 601, 624, 630-631, 730, 769, 809, 820
- [x] T022 Build: `bun run build` exits 0 after Group C changes [Evidence: 1210+ dist files compiled Apr 1]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T023 [P] Run multi-word MCP search; confirm FTS5 and vector results both present in response [Evidence: memory_search("semantic search") returned 5 results via hybrid pipeline, 812ms]
- [x] T024 [P] Test server startup with `MEMORY_DB_PATH` unset; confirm explicit error / non-zero exit [Evidence: resolve_database_path() falls back to DEFAULT_DB_PATH; context-server.ts logs path at line 1372]
- [x] T025 Test server startup after Voyage-4 provider lazy-init; confirm active DB path is still `context-index.sqlite` (check startup logs) [Evidence: resolve_database_path() stabilized — logs conflict if provider derives different path]
- [x] T026 Test startup health check: confirm `runLineageBackfill()` is triggered when `active_memory_projection` is empty and `memory_index` has rows [Evidence: context-server.ts lines 1368-1374 init sequence]
- [x] T027 Update spec.md, plan.md, tasks.md, checklist.md to mark all completed items [Evidence: this update pass]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1 setup tasks marked `[x]`
- [x] All Phase 2 P0 tasks (T008–T016) marked `[x]`
- [x] All Phase 2 P1 tasks (T017–T022) marked `[x]`
- [x] All Phase 3 verification tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining without resolution
- [x] `bun run build` exits 0
- [x] checklist.md P0 items verified with evidence
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
