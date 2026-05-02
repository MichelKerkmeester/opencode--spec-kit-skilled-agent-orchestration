# Review Iteration 01 — Initialization & State (Part 1)

**Reviewer:** Copilot CLI / GPT 5.4 High  
**Dimension:** Initialization ordering, module state, type compatibility  
**Files reviewed:** `context-server.ts`, `hybrid-search.ts`, `vector-index-queries.ts`, `vector-index-store.ts`, `bm25-index.ts`

---

## Findings

### F01-1: P1 — Vector channel uses different DB than FTS/BM25

- **File:** `mcp_server/context-server.ts:1446-1448`, `mcp_server/lib/search/hybrid-search.ts:308-316,865-873,1055-1064`, `mcp_server/lib/search/vector-index-queries.ts:168-172`, `mcp_server/lib/search/vector-index-store.ts:379-403,749-760`
- **Severity:** P1 (likely bug)
- **Description:** `hybridSearch.init()` stores the startup DB in module state, but the injected `vectorIndex.vectorSearch` does NOT use that DB. It has a hidden third parameter `database = initialize_db()`, so when hybrid search calls it with 2 args, the vector lane resolves its own singleton DB at call time. FTS/BM25/structural channels use hybrid-search's `db`, while vector can drift to a different connection/path if vector-index state changes later.
- **Fix:** Bind the DB at init time: `hybridSearch.init(database, (embedding, options) => vectorIndex.vectorSearch(embedding, options, database), graphSearchFn)`. Better: change `VectorSearchFn` to accept an explicit DB and thread one DB through all channels.

### F01-2: P2 — Silent empty-result returns mask init bugs

- **File:** `mcp_server/lib/search/hybrid-search.ts:426-437,446-470,1792-1793`
- **Severity:** P2 (potential issue)
- **Description:** If hybrid-search is ever used before `init()`, it fails closed to `[]` instead of surfacing an initialization error. `isFtsAvailable()`, `ftsSearch()`, and `structuralSearch()` all silently return empty results when `db` is unset, which makes init/state bugs look exactly like "search returns 0 results."
- **Fix:** Add an `assertInitialized()` guard for search entrypoints and log/throw once when `db === null` instead of silently returning `[]`.

### F01-3: P2 — BM25 warmup race window at startup

- **File:** `mcp_server/context-server.ts:1456-1460,1646-1647`, `mcp_server/lib/search/bm25-index.ts:440-462`
- **Severity:** P2 (potential issue)
- **Description:** `hybridSearch.init()` runs before BM25 warmup is scheduled, but BM25 hydration is asynchronous (`setTimeout(..., 0)`). The server starts accepting requests immediately after `server.connect()`, so there is a startup window where the BM25 in-memory index is empty.
- **Fix:** Track BM25 readiness and either skip that channel until hydrated or fall back explicitly to FTS/structural during warmup.

---

## Direct Answers

1. **Is `db` set before search?** Yes for normal server startup. `hybridSearch.init()` happens before `server.connect()`.
2. **Does `vectorSearchFn` match the type?** Structurally yes, semantically imperfect. Hidden third `database` arg means it resolves its own DB.
3. **Is `init()` called before BM25 warmup?** Yes. `init()` at line 1448; BM25 rebuild starts at 1456.
4. **Timing issues?** No production startup path calls hybrid search before init. BM25 hydration window is the only timing gap.
5. **Does `vectorIndex.vectorSearch` match?** Shape-compatible but not dependency-compatible.
