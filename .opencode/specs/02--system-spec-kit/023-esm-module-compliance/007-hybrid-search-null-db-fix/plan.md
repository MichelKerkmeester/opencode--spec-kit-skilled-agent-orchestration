---
title: "Implementation Plan: Hybrid Search Pipeline Null DB Fix"
description: "Diagnose and fix the null db/vectorSearchFn references in hybrid-search.js that cause the search pipeline to return 0 results for all queries."
trigger_phrases:
  - "hybrid search fix plan"
  - "null db search fix"
  - "search pipeline repair"
  - "ftsSearch null db fix"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Hybrid Search Pipeline Null DB Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

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

### Phase 1: Diagnose (confirm root cause)
- [ ] Add diagnostic `console.error` to `ftsSearch()` logging `db` truthiness
- [ ] Add diagnostic `console.error` to `collectAndFuseHybridResults()` logging `vectorSearchFn` truthiness
- [ ] Add module identity marker (random ID) to `init()` and `ftsSearch()` to detect ESM duplication
- [ ] Restart MCP server, trigger search, check stderr output
- [ ] Record whether: (a) db is null, (b) vectorSearchFn is null, (c) module IDs differ

### Phase 2: Fix (based on Phase 1 findings)

**If ESM module duplication confirmed (different MODULE_IDs):**
- [ ] Check `package.json` exports/imports maps for path aliasing
- [ ] Check `tsconfig.json` for path mappings that could cause double resolution
- [ ] Ensure single canonical import path for hybrid-search module
- [ ] Alternatively: move `db`/`vectorSearchFn` to a shared state module (db-state.js)

**If stale reference (same MODULE_ID, db was set then became null):**
- [ ] Check if `reinitializeDatabase()` is called and fails to rebind
- [ ] Add guard in `ftsSearch()`: recover db from `requireDb()` if null
- [ ] Add guard in `collectAndFuseHybridResults()`: recover vectorSearchFn

**If init() never called (db was never set):**
- [ ] Check initialization order in context-server.js
- [ ] Ensure `hybridSearch.init()` runs before first search request
- [ ] Add initialization check with explicit error if search called before init

### Phase 3: Verify & Cleanup
- [ ] Run `memory_search("semantic search")` — expect CocoIndex results
- [ ] Run `memory_search("SpecKit Phase System")` — expect phase system results
- [ ] Verify Stage 1 trace: candidateCount > 0, channelCount >= 2
- [ ] Run `memory_health` — expect healthy
- [ ] Remove all diagnostic `console.error` statements
- [ ] If dist was edited directly, apply changes to TS source and rebuild
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

<!-- ANCHOR:critical-files -->
## 7. CRITICAL FILES

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
<!-- /ANCHOR:critical-files -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

- **Trigger**: Fix causes other MCP tool failures or data corruption
- **Procedure**: Revert changes to dist/ files via `git checkout -- .opencode/skill/system-spec-kit/mcp_server/dist/`
- **Recovery**: Restart MCP server; search will be broken again but other tools functional
<!-- /ANCHOR:rollback -->
