# P1 Fix Summary

**Executed via:** Copilot CLI with GPT 5.4 model (`--model gpt-5.4 --allow-all-tools --no-ask-user`)
**Build status:** PASS (all three workspace packages: shared, mcp-server, scripts)

---

## Fix 5: FTS scope filter -- exact-or-descendant matching

**File:** `mcp_server/lib/search/sqlite-fts.ts`

**Problem:** The FTS `specFolder` filter used exact match (`m.spec_folder = ?`) while BM25 already used prefix/descendant matching. This meant FTS results missed memories stored in child spec folders.

**Change:**
- Filter clause: `AND m.spec_folder = ?` changed to `AND (m.spec_folder = ? OR m.spec_folder LIKE ? || "/%")`
- Params array: Added second `specFolder` parameter for the LIKE clause (`[sanitized, specFolder, specFolder, limit]`)

**Lines changed:** +4 -2

---

## Fix 6: Silent return warnings in hybrid-search.ts

**File:** `mcp_server/lib/search/hybrid-search.ts`

**Problem:** Three guard clauses returned empty arrays without any logging, making search failures invisible in debug output.

**Warnings added:**
1. `bm25Search()` -- `[hybrid-search] bm25Search skipped: BM25 not enabled`
2. `ftsSearch()` -- `[hybrid-search] ftsSearch skipped: db unavailable or FTS not available`
3. `structuralSearch()` -- `[hybrid-search] structuralSearch skipped: db unavailable`

**Lines changed:** +9 -2

---

## Fix 7: Silent failure warnings in stage1-candidate-gen.ts

**File:** `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`

**Problem:** Six locations silently swallowed null embeddings or catch errors, returning empty arrays without any diagnostic output.

**Warnings added:**
1. D2 facet embedding null -- `[stage1-candidate-gen] D2 facet embedding generation returned null`
2. Deep variant embedding null -- `[stage1-candidate-gen] Deep variant embedding generation returned null`
3. Baseline `.catch()` handler -- `[stage1-candidate-gen] Baseline candidate collection failed: <message>`
4. Expanded query embedding null -- `[stage1-candidate-gen] Expanded query embedding generation returned null`
5. Expansion `.catch()` handler -- `[stage1-candidate-gen] Expansion candidate collection failed: <message>`
6. LLM reform embedding null -- `[stage1-candidate-gen] LLM reform embedding generation returned null`

**Lines changed:** +30 -6 (P1 warnings only; diff also includes Phase 024 concept-expansion additions from prior branch work)

---

## Fix 8: Silent failure warnings in vector-index-queries.ts

**File:** `mcp_server/lib/search/vector-index-queries.ts`

**Problem:** Six guard clauses returned empty arrays without logging, making it impossible to distinguish "no results" from "function short-circuited on bad input."

**Warnings added:**
1. `extract_tags()` -- `[vector-index] extract_tags: invalid content type, expected string`
2. `keyword_search()` invalid query -- `[vector-index] keyword_search: invalid query, expected non-empty string`
3. `keyword_search()` empty terms -- `[vector-index] keyword_search: no valid search terms after tokenization`
4. `multi_concept_keyword_search()` -- `[vector-index] multi_concept_keyword_search: empty concepts array`
5. `parse_quoted_terms()` -- `[vector-index] parse_quoted_terms: invalid query, expected non-empty string`
6. `find_orphaned_vector_ids()` -- `[vector-index] find_orphaned_vector_ids: sqlite-vec not available`

**Lines changed:** +12 -2

---

## Fix 9: Log DB path on startup

**File:** `mcp_server/context-server.ts`

**Problem:** No startup log showed which database file the server resolved, making it hard to verify the correct database was in use (especially with `SPEC_KIT_DB_DIR` / `SPECKIT_DB_DIR` overrides).

**Change:**
- Added `DATABASE_PATH` to the import from `./core/index.js`
- Added `console.error('[context-server] Database path: ' + DATABASE_PATH)` immediately after "Database initialized" log

**Lines changed:** +2 -0 (P1 fix only)

---

## Totals

| Fix | File | Insertions | Deletions |
|-----|------|-----------|-----------|
| 5   | sqlite-fts.ts | +4 | -2 |
| 6   | hybrid-search.ts | +9 | -2 |
| 7   | stage1-candidate-gen.ts | +30 | -6 |
| 8   | vector-index-queries.ts | +12 | -2 |
| 9   | context-server.ts | +2 | -0 |
| **Total** | **5 files** | **+57** | **-12** |
