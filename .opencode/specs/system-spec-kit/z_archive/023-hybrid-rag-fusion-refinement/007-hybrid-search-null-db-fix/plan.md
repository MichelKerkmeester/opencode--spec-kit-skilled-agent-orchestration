---
title: "Implementation Plan: Hybrid Search [system-spec-kit/023-hybrid-rag-fusion-refinement/007-hybrid-search-null-db-fix/plan]"
description: "Diagnose and fix the null db/vectorSearchFn references in hybrid-search.js that cause the search pipeline to return 0 results for all queries."
trigger_phrases:
  - "hybrid search fix plan"
  - "null db search fix"
  - "search pipeline repair"
  - "ftssearch null db fix"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/007-hybrid-search-null-db-fix"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Hybrid Search Pipeline Null DB Fix

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (compiled to ESM JS) |
| **Framework** | MCP Server (better-sqlite3, sqlite-vec) |
| **Storage** | SQLite (context-index.sqlite, WAL mode) |
| **Testing** | Manual search verification via MCP tools |

### Overview
Fix the hybrid search pipeline in the Spec Kit Memory MCP server which returns 0 results for all queries. The module-level `db` and `vectorSearchFn` variables in `hybrid-search.js` are likely null at search time due to ESM module duplication or stale references after database reinitialization. The fix involves diagnosing the exact null state, then applying either a defensive re-initialization pattern or resolving the ESM module resolution issue.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] Root cause investigation complete (12-step Sequential Thinking analysis)

### Definition of Done
- [x] `memory_search("semantic search")` returns >0 results (4 results)
- [x] `memory_search("SpecKit Phase System")` returns >0 results (5 results)
- [x] Stage 1 trace shows candidateCount > 0 (5 candidates)
- [x] memory_health reports healthy
- [x] Diagnostic logging removed
- [x] RRF k-value updated to 40 in rrf-fusion.ts (REQ-006)
- [x] Token budget raised to 3000-3500 across all modes (REQ-007)
- [x] Deprecated tier filter added to sqlite-fts.ts (REQ-008)
- [x] R12 expansion gate relaxed to ≤2 tokens (REQ-009)
- [x] Cross-encoder rerankProvider metadata in stage3-rerank.ts (REQ-010)
- [x] Compound-term FTS5 phrase expansion in bm25-index.ts (REQ-011)
- [x] Co-activation format fixed + similarity scale corrected (REQ-012)
- [x] Quality score backfill wired into Stage 1 read path (REQ-013)
- [x] Chunk children parent_id written by chunking-orchestrator.ts (REQ-014)
- [x] Embedding cache hit/miss counters active (REQ-015)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Module-Level State Pattern (Current — Broken)
```
context-server.js
  ├─ import * as hybridSearch from './lib/search/hybrid-search.js' [Instance A?]
  ├─ hybridSearch.init(database, vectorIndex.vectorSearch, graphSearchFn)
  │   └─ Sets db=database, vectorSearchFn=vectorSearch on Instance A
  │
  └─ Tool handler dispatches search request
      └─ stage1-candidate-gen.js
          └─ import * as hybridSearch from '../hybrid-search.js' [Instance B?]
              └─ Calls hybridSearch.collectRawCandidates()
                  └─ db=null, vectorSearchFn=null → 0 results
```

### Key Components
- **hybrid-search.js**: Module-level `let db = null; let vectorSearchFn = null;` — set via `init()`, used by search functions
- **vector-index-store.js**: DB singleton with `initialize_db()` pattern — uses default param, NOT module-level state
- **db-state.js**: Database lifecycle manager — calls `hybridSearch.init()` on rebind
- **sqlite-fts.js**: FTS5 search — receives `db` as parameter (not affected by module state)
- **stage1-candidate-gen.js**: Pipeline orchestrator — imports and calls hybrid search

### Data Flow
```
Search Query → Stage 1 (embedding + channels) → Fusion → Rerank → Filter → Results
                  ↓
    ┌── Vector channel (vectorSearchFn) → vec_memories JOIN ──┐
    ├── FTS5 channel (ftsSearch → db) → memory_fts JOIN ──────┤→ RRF Fusion
    ├── BM25 channel (in-memory index) ───────────────────────┤
    └── Graph channel (graphSearchFn) ────────────────────────┘
```

All channels except BM25 depend on `db` or `vectorSearchFn` being non-null.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Diagnose (confirm root cause) — COMPLETE
- [x] Add diagnostic `console.error` to `ftsSearch()` logging `db` truthiness
- [x] Add diagnostic `console.error` to `collectAndFuseHybridResults()` logging `vectorSearchFn` truthiness
- [x] Add module identity marker (random ID) to `init()` and `ftsSearch()` to detect ESM duplication
- [x] Restart MCP server, trigger search, check stderr output
- [x] Record whether: (a) db is null, (b) vectorSearchFn is null, (c) module IDs differ
- **Finding:** ESM duplication ruled out; Bug 1 = scope enforcement opt-out (shouldApplyScope=true, 5→0 candidates); Bug 2 = TRM state filter minState='WARM' excluded all UNKNOWN-state memories

### Phase 2: Fix (based on Phase 1 findings) — COMPLETE

**Scope enforcement fix (Bug 1):**
- [x] `scope-governance.ts` — changed `isScopeEnforcementEnabled()` to opt-in
- [x] `scope-governance.js` (dist) — same change

**TRM state filter fix (Bug 2):**
- [x] `memory-search.ts` — removed `minState='WARM'` default
- [x] `memory-search.js` (dist) — same change
- [x] `memory-context.ts` — removed `minState='WARM'` hardcode (2 occurrences)
- [x] `memory-context.js` (dist) — same change

### Phase 3: Verify & Cleanup — COMPLETE
- [x] Run `memory_search("semantic search")` — 4 results returned (CocoIndex #893 included)
- [x] Run `memory_search("SpecKit Phase System")` — 5 results returned (#325 included)
- [x] Run `memory_search("compact code graph")` — 5 results returned (#45 included)
- [x] Verify Stage 1 trace: candidateCount > 0, channelCount >= 2
- [x] Run `memory_health` — reports healthy
- [x] Remove all diagnostic `console.error` statements from hybrid-search.js
- [x] Remove all diagnostic `console.error` statements from stage1-candidate-gen.js
- [x] Kill MCP server processes to apply fixes

### Phase 4: Search Engine Optimization — COMPLETE
- [x] T024-T033: All 10 optimizations implemented (see tasks.md)

### Phase 5: Ultra-Think Review P1 Fixes — COMPLETE
- [x] T034 shadow-evaluation-runtime minState removed
- [x] T035 tool-input-schema tests updated
- [x] T036 co-activation similarity scale fixed (0.5→50)
- [x] T037 computeBackfillQualityScore wired into Stage 1
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Search for "semantic search" via memory_search MCP tool | Claude Code MCP |
| Manual | Search for "SpecKit Phase System" via memory_search MCP tool | Claude Code MCP |
| Manual | Verify retrieval trace shows non-zero candidates | memory_search includeTrace=true |
| Manual | Health check passes | memory_health |
| Regression | Triggers still work | memory_match_triggers |
| Regression | memory_list still works | memory_list |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| TS source availability | Internal | Unknown | Edit dist directly (less ideal) |
| MCP server restart | Internal | Green | Required after fix |
| Voyage AI API | External | Green | Embedding generation working |
<!-- /ANCHOR:dependencies -->

---

### Critical Files

| File | Role | Edit Type |
|------|------|-----------|
| `mcp_server/dist/lib/search/hybrid-search.js` | Module-level db/vectorSearchFn state | Diagnose + Fix |
| `mcp_server/dist/lib/search/sqlite-fts.js` | FTS5 BM25 search (receives db param) | Read-only reference |
| `mcp_server/dist/lib/search/pipeline/stage1-candidate-gen.js` | Pipeline orchestration | Read-only reference |
| `mcp_server/dist/lib/search/vector-index-queries.js` | vector_search function | Read-only reference |
| `mcp_server/dist/lib/search/vector-index-store.js` | DB singleton, initialize_db() | Possible fix target |
| `mcp_server/dist/core/db-state.js` | reinitializeDatabase, rebindDatabaseConsumers | Possible fix target |
| `mcp_server/dist/context-server.js` | Server startup init sequence | Read-only reference |

All paths relative to `.opencode/skill/system-spec-kit/`.

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

- **Trigger**: Fix causes other MCP tool failures or data corruption
- **Procedure**: Revert changes to dist/ files via `git checkout -- .opencode/skill/system-spec-kit/mcp_server/dist/`
- **Recovery**: Restart MCP server; search will be broken again but other tools functional
<!-- /ANCHOR:rollback -->
