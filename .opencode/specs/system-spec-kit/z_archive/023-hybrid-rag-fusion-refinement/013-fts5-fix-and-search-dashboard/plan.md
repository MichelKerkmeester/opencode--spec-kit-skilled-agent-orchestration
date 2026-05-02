---
title: "Implementation Plan: FTS5 [system-spec-kit/023-hybrid-rag-fusion-refinement/013-fts5-fix-and-search-dashboard/plan]"
description: "Three-item implementation covering a completed FTS5 double-quoting fix, a completed search dashboard redesign, and a new P0 database path drift fix that prevents vector search from silently resolving to an empty provider-specific SQLite DB."
trigger_phrases: ["db path drift fix plan", "vector-index-store resolve_database_path fix", "reinitializedatabase wrong db fix", "hybrid search assertinitialized", "fts5 fix plan", "search dashboard plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/013-fts5-fix-and-search-dashboard"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: FTS5 Fix, Search Dashboard, and DB Path Drift Fix

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Bun runtime) |
| **Framework** | MCP server, SQLite (better-sqlite3), Voyage-4 embeddings |
| **Storage** | SQLite — `context-index.sqlite` (populated), `context-index__voyage__voyage-4__1024.sqlite` (empty) |
| **Testing** | Manual search verification; Vitest unit tests for modified modules |

### Overview

Items 1 and 2 are complete. Item 3 targets the root cause of vector search returning zero results: `resolve_database_path()` in `vector-index-store.ts` reads the embedding provider singleton state at call time, causing it to resolve to an empty provider-specific DB after Voyage-4 is lazily initialized. The fix path has three layers: (1) make `MEMORY_DB_PATH` mandatory and fail-closed, (2) inject the resolved path explicitly at construction so singleton state is never re-read, and (3) add a startup health check to auto-backfill `active_memory_projection` when `memory_index` has rows but projection is empty. Item 4 remedies 52 silent failure points across the search pipeline that obscure errors from operators.

Evidence base: 10 deep research iterations in scratch/deep-research/ (research-01.md through research-10.md) and 10 deep review iterations in scratch/ (review-01.md through review-10.md) confirming the root cause chain and fix ordering.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Items 1 and 2 complete with evidence
- [x] Root cause of DB path drift confirmed via 20 research/review iterations
- [x] All affected files identified with line number references
- [x] Fix order determined (P0 path enforcement → P0 path injection → P0 health check → P0 db-state fix → P1 silent failures)

### Definition of Done

- [ ] `MEMORY_DB_PATH` enforcement tested with missing and invalid values
- [ ] Vector search returns results from `context-index.sqlite` after Voyage-4 init
- [ ] `reinitializeDatabase()` does not change active DB connection post provider-init
- [ ] `assertInitialized()` guards active in `hybrid-search.ts`
- [ ] `bun run build` exits 0 after all changes
- [ ] Spec, plan, tasks, and checklist updated and validated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fail-closed startup configuration with explicit dependency injection for DB path; no ambient singleton reads after initial resolution.

### Key Components

- **`vector-index-store.ts`**: Central store for vector index operations. Currently calls `resolve_database_path()` on each operation, reading provider singleton state. Fix: accept explicit path at construction; remove internal resolution.
- **`shared/embeddings/profile.ts::getDatabasePath()`**: Maps provider name to SQLite filename. Fix: ensure it never silently falls back to a provider-specific path when `MEMORY_DB_PATH` is set.
- **`shared/embeddings.ts`**: Contains lazy provider singleton init logic (lines 364–417). Fix: add logging when provider init would change the DB path.
- **`mcp_server/core/db-state.ts::reinitializeDatabase()`**: Called during lifecycle events. Fix: guard against rebinding to empty provider-specific DB when a populated DB is already open.
- **`mcp_server/lib/search/hybrid-search.ts`**: Entry point for hybrid search pipeline. Fix: `assertInitialized()` replaces silent `return []`.
- **`stage1-candidate-gen.ts` / `vector-index-queries.ts`**: Pipeline stages with 52 silent failures. Fix: replace silent returns with typed errors or WARN-level logs.

### Data Flow

```
Server start
  → MEMORY_DB_PATH validated (fail-closed if missing/invalid)
  → vector-index-store constructed with explicit path
  → Startup health check: memory_index rows vs active_memory_projection
    → if mismatch → runLineageBackfill()
  → Voyage-4 provider lazy-init
    → DB path does NOT change (path already injected)
    → Warning logged if derived path differs from injected path
  → Search query received
    → hybrid-search.ts assertInitialized() checked
    → Pipeline proceeds with correct DB
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Items 1 & 2 (COMPLETED)

- [x] T001 FTS5 guard applied in `sqlite-fts.ts` line 58
- [x] T002 `bun run build` compiled successfully
- [x] T003 30 dashboard designs generated in `scratch/`
- [x] T004 Design 10 applied to `.opencode/command/memory/search.md`
- [x] T005 Design 10 applied to `.agents/commands/memory/search.toml`

### Phase 2: P0 — DB Path Enforcement and Injection

- [ ] T006 Make `MEMORY_DB_PATH` mandatory: add validation at server entrypoints; fail-closed when absent or file missing
- [ ] T007 Inject explicit DB path into `vector-index-store.ts` constructor; remove `resolve_database_path()` call from per-operation code paths (lines 277–290)
- [ ] T008 Harden `shared/embeddings/profile.ts::getDatabasePath()` to respect injected path; not silently override with provider-derived name
- [ ] T009 Add path-change warning in `shared/embeddings.ts` (lines 364–417) when provider init derives a different path than the injected one
- [ ] T010 Build and smoke-test: `bun run build`; verify server starts and resolves correct DB path

### Phase 3: P0 — Startup Health Check and db-state Fix

- [ ] T011 Add startup health check in `db-state.ts` or init sequence: query `memory_index` row count and `active_memory_projection` row count; trigger `runLineageBackfill()` if mismatch
- [ ] T012 Fix `reinitializeDatabase()` in `db-state.ts` (lines 245–293): guard against rebinding to an empty provider-specific DB when a populated DB is already open
- [ ] T013 Build and verify: `bun run build`; run a live vector search to confirm results from `context-index.sqlite`

### Phase 4: P1 — Silent Failure Remediation

- [ ] T014 Add `assertInitialized()` guard in `hybrid-search.ts`; replace silent `return []` with `SearchNotInitializedError`
- [ ] T015 Fix FTS scope filter to match exact-or-descendant folders (consistent with BM25 scope filter)
- [ ] T016 Fix 52 silent failure points in `hybrid-search.ts`, `stage1-candidate-gen.ts`, `vector-index-queries.ts`: replace silent returns with typed errors or WARN-level logs
- [ ] T017 Build: `bun run build`; verify no new compilation errors

### Phase 5: Verification

- [ ] T018 Run full hybrid search with multi-word query; confirm FTS5 + vector results both present
- [ ] T019 Test server startup with `MEMORY_DB_PATH` unset; confirm explicit error
- [ ] T020 Test server startup after Voyage-4 provider init; confirm active DB is still `context-index.sqlite`
- [ ] T021 Update spec.md, plan.md, tasks.md, checklist.md to reflect completion
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build verification | All modified TypeScript files compile cleanly | `bun run build` |
| Manual — FTS5 | Multi-word MCP search returns FTS5 results | Live MCP call |
| Manual — DB path | Server startup with missing `MEMORY_DB_PATH` exits with explicit error | Shell invocation |
| Manual — vector search | Vector search post-Voyage-4 init returns results from populated DB | Live MCP call |
| Manual — health check | Startup with empty `active_memory_projection` triggers backfill | Log inspection |
| Unit (if time permits) | `resolve_database_path` removal in `vector-index-store.ts` | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `context-index.sqlite` populated DB exists | Internal file | Green — verified present | Cannot test fix without it |
| `bun run build` compiles after each phase | Build toolchain | Green | Block dist deployment |
| `MEMORY_DB_PATH` env var set in all launch configs | Configuration | Must verify | Server would fail-closed (by design) |
| `runLineageBackfill()` function available and tested | Internal API | Green — exists in codebase | Startup health check cannot proceed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Vector search returns zero results after path injection change, or server fails to start after `MEMORY_DB_PATH` enforcement
- **Procedure**: `git revert` the commits for Phase 2; restore `resolve_database_path()` call; redeploy
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Items 1 & 2 — DONE) ───────────────────────────────────────────┐
                                                                          │
Phase 2 (P0 path enforcement + injection) ───────────────────────────────┤
  ↑ Must complete before Phase 3                                          │
                                                                          ├──► Phase 5 (Verify)
Phase 3 (P0 health check + db-state fix) ────────────────────────────────┤
  ↑ Depends on Phase 2 path injection                                     │
                                                                          │
Phase 4 (P1 silent failures) ────────────────────────────────────────────┘
  ↑ Can run in parallel with Phase 3 but must complete before Phase 5
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | — | None (complete) |
| Phase 2 | Phase 1 complete | Phase 3 |
| Phase 3 | Phase 2 | Phase 5 |
| Phase 4 | Phase 2 | Phase 5 |
| Phase 5 | Phase 3, Phase 4 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (Items 1 & 2) | Low | DONE |
| Phase 2 (P0 path enforcement + injection) | High | 3–5 hours |
| Phase 3 (P0 health check + db-state fix) | High | 2–4 hours |
| Phase 4 (P1 silent failures) | Med | 2–3 hours |
| Phase 5 (Verification) | Low | 1–2 hours |
| **Total** | | **8–14 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Current `context-index.sqlite` path noted and backed up reference
- [ ] `MEMORY_DB_PATH` value confirmed in all launch configs before enforcement change
- [ ] `bun run build` passing on the feature branch before merging

### Rollback Procedure

1. Disable `MEMORY_DB_PATH` mandatory enforcement: revert entrypoint guard to optional
2. Restore `resolve_database_path()` call in `vector-index-store.ts`
3. Revert `reinitializeDatabase()` guard in `db-state.ts`
4. `bun run build` — verify clean compile
5. Restart server; verify search returns results

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A — changes are code-only; no schema or data changes
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
