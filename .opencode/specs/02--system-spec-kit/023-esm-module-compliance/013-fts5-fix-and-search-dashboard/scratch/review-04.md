# Review Iteration 04 — Data Flow (Part 2): Channel Execution and Fusion

**Reviewer:** Copilot CLI / GPT 5.4 High  
**Dimension:** Trace channel execution, FTS query construction, BM25 population, fusion  
**Files reviewed:** `hybrid-search.ts`, `sqlite-fts.ts`, `bm25-index.ts`, `rrf-fusion.ts`, `vector-index-schema.ts`, `adaptive-fusion.ts`, `channel-enforcement.ts`

---

## Findings

### F04-1: P1 — FTS scope filter is exact-match only, unlike BM25's descendant-aware scope

- **File:** `lib/search/sqlite-fts.ts:63-72`
- **Severity:** P1 (likely bug)
- **Description:** `fts5Bm25Search()` applies `AND m.spec_folder = ?` which excludes child phase/spec folders. BM25 uses broader scope matching in `hybrid-search.ts:383-390` (`folder === specFolder || folder.startsWith(specFolder + '/')`). So a parent-folder scoped hybrid query can get `fts=[]` even though direct FTS works and BM25 semantics would include descendants. If BM25 is cold/disabled, total results can drop to 0.
- **Fix:** Make FTS scope match exact-or-descendant folders: `m.spec_folder = ? OR m.spec_folder LIKE ? || '/%'`

### F04-2: P2 — In-memory BM25 can be "empty but not failed" during async warmup

- **File:** `lib/search/bm25-index.ts:322-337,424-462`
- **Severity:** P2 (potential issue)
- **Description:** `rebuildFromDatabase()` only schedules batched warmup via `setTimeout()`. Until batches run, `search()` iterates an empty `documents` map and silently returns `[]`. This does not explain FTS returning 0, but it removes one whole hybrid channel and amplifies other filtering bugs.
- **Fix:** Track warmup readiness and warn/skip explicitly, or make the first batch synchronous.

---

## Key Answers

1. **lists.length === 0 returns null?** Yes. `collectAndFuseHybridResults()` returns `null` at line 1196-1198. Callers fall back to simpler `hybridSearch()`.
2. **FTS query properly sanitized?** `normalizeLexicalQueryTokens()` only goes empty when query collapses to nothing (empty/operator/punctuation-only), not a likely "any query" cause.
3. **FTS JOIN correct?** Yes. Schema uses `content_rowid='id'`, so `memory_fts.rowid` maps to `memory_index.id`.
4. **Cold BM25?** Yes, silently returns `[]` when index not populated.
5. **Fusion discards results?** No. `fuseResultsMulti()` does not erase non-empty positive-weight lists. Empty fusion only happens when every incoming list is empty or weight <= 0.
