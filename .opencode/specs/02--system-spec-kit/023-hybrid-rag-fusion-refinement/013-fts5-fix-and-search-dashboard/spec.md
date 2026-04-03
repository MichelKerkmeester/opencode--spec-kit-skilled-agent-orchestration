---
title: "Feature Specification: FTS5 Fix, Search Dashboard, and DB Path Drift Fix"
description: "FTS5 double-quoting bug silently drops results, search dashboard has poor readability, and DB path drift causes vector search to resolve the wrong SQLite DB after lazy Voyage-4 provider init."
trigger_phrases:
  - "fts5 double quoting bug"
  - "database path drift"
  - "resolve_database_path bug"
  - "vector index empty results"
  - "reinitializeDatabase wrong db"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: FTS5 Fix, Search Dashboard, and DB Path Drift Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: level_2/spec.md | v2.2 -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-memory-save-quality-pipeline |
| **Successor** | None |
| **Handoff Criteria** | P0 fixes complete with reproducible verification and report/dashboard parity |

This is **Phase 13** of the ESM Module Compliance specification and captures the FTS5/search dashboard closure workstream.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 (Items 1, 3), P1 (Items 2, 4–8) |
| **Status** | Completed |
| **Created** | 2026-04-01 |
| **Branch** | `system-speckit/024-compact-code-graph` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

**Item 1 — FTS5 Double-Quoting Bug (COMPLETED):** `normalizeLexicalQueryTokens()` in `bm25-index.ts` produces pre-quoted phrase tokens such as `"semantic search"`. When `fts5Bm25Search()` in `sqlite-fts.ts` wraps every token in quotes unconditionally, the result is invalid FTS5 syntax `""semantic search""`. SQLite silently rejects the malformed query, so every multi-word search through the MCP hybrid pipeline drops all FTS5 results without surfacing an error. Fix applied at line 58; compiled to dist.

**Item 2 — Search Dashboard Visualization (COMPLETED):** The `/memory:search` result dashboard rendered spec folder paths at full length and used a dense layout, making results hard to scan. Design 10 (folder-as-tree-group with leaf folder names) was selected and applied to `.opencode/command/memory/search.md` and `.agents/commands/memory/search.toml`.

**Item 3 — Database Path Drift (NEW — P0):** `resolve_database_path()` in `vector-index-store.ts` (lines 277–290) selects the active SQLite DB based on the embedding provider singleton's current state. After the Voyage-4 provider is lazily initialized, the function resolves to the empty provider-specific DB (`context-index__voyage__voyage-4__1024.sqlite`) rather than the populated `context-index.sqlite`. This causes vector search to return zero results from a structurally valid but empty index, with no error raised.

The root cause chain: `shared/embeddings.ts` initializes the Voyage-4 provider lazily (lines 364–417); `shared/embeddings/profile.ts::getDatabasePath()` (lines 63–71) returns a provider-derived name; `vector-index-store.ts::resolve_database_path()` reads that derived name each call; `db-state.ts::reinitializeDatabase()` (lines 245–293) rebinds to the newly resolved path, abandoning the populated DB.

Additionally, `hybrid-search.ts` silently returns `[]` when not fully initialized, and 52 other failure points across three core files suppress errors instead of surfacing them.

### Purpose

Resolve the P0 database path drift so that vector search consistently reads from the populated index regardless of provider init order. Fix all identified silent failure points to make search errors observable. Items 1 and 2 are already complete.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Item 1 (COMPLETED)**
- Guard in `sqlite-fts.ts` line 58 preventing re-quoting of already-quoted tokens
- Compiled dist output reflecting the fix

**Item 2 (COMPLETED)**
- 30 dashboard design alternatives generated in `scratch/`
- Design 10 (folder-as-tree-group) applied to `.opencode/command/memory/search.md`
- Applied to `.agents/commands/memory/search.toml`

**Item 3 — DB Path Drift (P0 fixes)**
- Make `MEMORY_DB_PATH` mandatory for all server entrypoints; fail-closed when absent
- Make DB path explicit/injected in `vector-index-store.ts`; remove reliance on `resolve_database_path()` hidden singleton state
- Add startup health check: if `memory_index` has rows but `active_memory_projection` is empty, auto-backfill via `runLineageBackfill()`
- Fix `reinitializeDatabase()` in `db-state.ts` to not rebind to an empty provider-specific DB

**Item 4 — Silent Failure Remediation (P1 fixes)**
- Add `assertInitialized()` guards in `hybrid-search.ts` instead of silent `return []`
- Fix FTS scope filter to match exact-or-descendant folders (consistent with BM25 behavior)
- Add startup log warning when DB path changes during provider init
- Fix 52 silent failure points across `hybrid-search.ts`, `stage1-candidate-gen.ts`, and `vector-index-queries.ts`

### Out of Scope

- Changes to `normalizeLexicalQueryTokens()` in `bm25-index.ts` — quoting behavior there is intentional
- BM25 ranking weights or fusion logic — separate concern
- Embedding provider selection strategy — fix focuses on DB binding, not which provider is used
- Schema migration or data rehydration — the populated `context-index.sqlite` already exists

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/sqlite-fts.ts` | Modify (DONE) | Guard at line 58 preventing double-quoting |
| `.opencode/command/memory/search.md` | Modify (DONE) | Design 10 dashboard applied |
| `.agents/commands/memory/search.toml` | Modify (DONE) | Design 10 dashboard applied |
| `mcp_server/lib/search/vector-index-store.ts` | Modify | Inject explicit DB path; remove hidden singleton dependency in `resolve_database_path()` (lines 277–290) |
| `shared/embeddings/profile.ts` | Modify | Harden `getDatabasePath()` (lines 63–71) to not silently fall back to empty provider DB |
| `shared/embeddings.ts` | Modify | Add path-change warning during lazy provider init (lines 364–417) |
| `mcp_server/core/db-state.ts` | Modify | Fix `reinitializeDatabase()` (lines 245–293) to not rebind to empty provider-specific DB |
| `mcp_server/lib/search/hybrid-search.ts` | Modify | Replace silent `return []` with `assertInitialized()` guards |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modify | Fix silent failure points |
| `mcp_server/lib/search/vector-index-queries.ts` | Modify | Fix silent failure points |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | FTS5 double-quoting guard in place | `sqlite-fts.ts` line 58 guard present in dist; multi-word searches return FTS5 results — COMPLETED |
| REQ-002 | Compiled dist reflects FTS5 fix | `bun run build` exits 0; dist output contains the guard — COMPLETED |
| REQ-003 | `MEMORY_DB_PATH` mandatory at all entrypoints | Server refuses to start when `MEMORY_DB_PATH` is absent or points to a nonexistent file; error is explicit |
| REQ-004 | DB path injected explicitly in `vector-index-store.ts` | `resolve_database_path()` is not called after initial bind; path is injected at construction or startup |
| REQ-005 | Startup health check for empty projection | If `memory_index` has rows and `active_memory_projection` is empty, `runLineageBackfill()` is triggered automatically |
| REQ-006 | `reinitializeDatabase()` does not rebind to empty provider DB | After Voyage-4 lazy init, active DB connection remains on the populated index |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Search dashboard redesign applied | Design 10 rendered in live search output; paths show leaf folder names — COMPLETED |
| REQ-008 | `assertInitialized()` guards in `hybrid-search.ts` | Search calls before initialization throw a clear error instead of returning `[]` |
| REQ-009 | FTS scope filter matches exact-or-descendant folders | FTS scope filter behaviour matches BM25 scope filter — no over-filtering of descendant paths |
| REQ-010 | DB path change warning logged at startup | Warning appears in server log when provider init would change the resolved DB path |
| REQ-011 | 52 silent failure points resolved | All identified silent failures in `hybrid-search.ts`, `stage1-candidate-gen.ts`, `vector-index-queries.ts` surface errors or log warnings |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Multi-word MCP searches return FTS5-backed results (no silent `""phrase""` double-quoting) — verifiable by query log or result count increase. (COMPLETED)
- **SC-002**: Design 10 (folder-as-tree-group) renders in live `/memory:search` output with leaf folder names. (COMPLETED)
- **SC-003**: Server startup with a missing `MEMORY_DB_PATH` exits with an explicit error rather than proceeding with the wrong DB.
- **SC-004**: Vector search after Voyage-4 provider init returns results from the populated `context-index.sqlite`, not from the empty provider-specific DB.
- **SC-005**: `reinitializeDatabase()` does not silently switch the active connection to an empty DB during or after provider lazy-init.
- **SC-006**: `hybrid-search.ts` emits an `assertInitialized()` error on un-initialized calls instead of silently returning `[]`.

### Acceptance Scenarios

**Given** a multi-word MCP search query (e.g., "semantic search"),
**When** the FTS5 guard is in place at `sqlite-fts.ts` line 58,
**Then** the result set includes FTS5-backed matches and no silent double-quoting error occurs.

**Given** the server starts without `MEMORY_DB_PATH` set in the environment,
**When** the mandatory validation check runs at entrypoint startup,
**Then** the server exits with an explicit error message and a non-zero exit code.

**Given** the Voyage-4 embedding provider is lazily initialized after server startup,
**When** `resolve_database_path()` has been replaced with an injected path in `vector-index-store.ts`,
**Then** the active DB connection remains on `context-index.sqlite` and vector search returns results.

**Given** `memory_index` has rows but `active_memory_projection` is empty at startup,
**When** the startup health check runs,
**Then** `runLineageBackfill()` is triggered and the projection is populated before the server accepts search requests.

**Given** `hybrid-search.ts` is called before initialization is complete,
**When** the `assertInitialized()` guard is active,
**Then** a typed `SearchNotInitializedError` is thrown instead of silently returning an empty result array.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Injecting explicit DB path breaks environments that legitimately derive path from provider | Med | Audit all entrypoints; confirm `MEMORY_DB_PATH` is set correctly before removing fallback |
| Risk | Startup health check triggers `runLineageBackfill()` incorrectly when projection is intentionally empty | Low | Guard with row count check on `memory_index` before triggering backfill |
| Risk | Fixing 52 silent failures introduces noise in logs during normal empty-result searches | Med | Use DEBUG-level logging for expected-empty paths; ERROR only for unexpected failures |
| Risk | `assertInitialized()` guard breaks callers that expect graceful `[]` on cold start | Low | Wrap in try/catch at call sites that must tolerate not-ready state |
| Dependency | `context-index.sqlite` must exist and be populated for DB path fix to be verifiable | Server has existing DB | Verify file exists before implementing fix |
| Dependency | `bun run build` must compile without errors after each file edit | Build breaks block dist/ deployment | Compile after each modified file, not batch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: DB path resolution must add no measurable latency to search queries (path resolved once at startup, not per query)
- **NFR-P02**: Startup health check and backfill must complete before the server accepts search requests

### Reliability
- **NFR-R01**: Vector search must not silently return zero results due to wrong DB binding
- **NFR-R02**: All 52 identified silent failure points must either log at minimum WARN or throw a typed error

### Observability
- **NFR-O01**: DB path used at startup must be logged at INFO level
- **NFR-O02**: Any DB path change during runtime must be logged at WARN level with old and new paths
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### DB Path Resolution
- `MEMORY_DB_PATH` absent: server refuses to start with explicit error message
- `MEMORY_DB_PATH` points to nonexistent file: server refuses to start (fail-closed)
- Provider init changes derived path mid-session: path change warning logged; active connection unchanged

### Startup Health Check
- `memory_index` empty and `active_memory_projection` empty: no backfill triggered (expected cold start)
- `memory_index` has rows but `active_memory_projection` empty: backfill triggered once, result logged
- Backfill fails: error logged; server continues with empty projection rather than failing to start

### Search Initialization
- `hybrid-search.ts` called before init: `assertInitialized()` throws `SearchNotInitializedError` with clear message
- `stage1-candidate-gen.ts` encounters empty FTS index: returns empty array with WARN log, does not throw
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 10 files, ~60–100 net LOC change across P0+P1 fixes |
| Risk | 20/25 | P0 path drift touches DB init path; wrong fix breaks all vector search |
| Research | 16/20 | 20 deep research + 20 deep review iterations completed; root cause confirmed |
| **Total** | **54/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should `MEMORY_DB_PATH` enforcement be a hard startup failure or a logged warning with fallback to discovery? (Current recommendation: hard failure — fail closed.)
- Should `runLineageBackfill()` be synchronous during startup or async with a readiness gate?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
