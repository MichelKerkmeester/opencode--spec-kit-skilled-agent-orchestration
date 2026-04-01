# Review Iteration 06 — Silent Failures (Part 2): Pipeline & Handler Error Handling

**Reviewer:** Copilot CLI / GPT 5.4 High  
**Dimension:** Error handling in orchestrator, handler, vector search, BM25  
**Files reviewed:** `pipeline/orchestrator.ts`, `handlers/memory-search.ts`, `vector-index-queries.ts`, `bm25-index.ts`, `pipeline/stage2-fusion.ts`, `pipeline/stage3-rerank.ts`, `pipeline/stage4-filter.ts`, `formatters/search-results.ts`

---

## Findings

### F06-1: P1 — Empty Stage 1 treated as successful pipeline outcome

- **File:** `lib/search/pipeline/orchestrator.ts:62-79,80-194`
- **Severity:** P1 (likely bug)
- **Description:** Stage 1 is only considered failed if it throws. If it returns `candidates: []`, orchestrator still runs Stages 2-4 and returns a normal `results: []`. Later stages cannot synthesize results from empty input. This makes "candidate generation produced nothing" indistinguishable from "no documents matched."
- **Fix:** Short-circuit when `stage1Result.candidates.length === 0` and attach diagnostics: `emptyReason: 'stage1_zero_candidates'`, vector availability, applied filters, candidate counts. Surface warning instead of plain empty success.

### F06-2: P1 — Handler surfaces systemic empty results as normal "No matching memories found"

- **File:** `handlers/memory-search.ts:721-723,816-909`, `formatters/search-results.ts:400-433`
- **Severity:** P1 (likely bug)
- **Description:** When pipeline returns `results: []`, the formatter emits standard empty envelope with summary "No matching memories found". `pipelineMetadata` is in `extraData`, but the top-level response does not distinguish "real no match" from "pipeline degraded and returned nothing."
- **Fix:** When results empty, check `pipelineResult.metadata.degraded`, Stage 1 candidate count, and vector availability. Surface a prominent warning when emptiness is suspicious.

### F06-3: P1 — Missing sqlite-vec silently fail-closes vector search to []

- **File:** `lib/search/vector-index-queries.ts:168-176,319-326`, `lib/search/vector-index-store.ts:394-404,795-803`
- **Severity:** P1 (likely bug — strong candidate for "0 results for any query")
- **Description:** `vector_search()` and `multi_concept_search()` do: `if (!sqlite_vec) { console.warn(...); return []; }`. The `sqlite_vec_available_flag` is set during DB initialization and stays on the active connection. After that, EVERY vector/multi-concept call silently returns no rows instead of propagating a structured failure.
- **Fix:** Throw a structured `VectorIndexError` instead of raw `[]`. Include vector availability in response metadata.

### F06-4: P2 — No explicit zero-result log in main handler

- **File:** `handlers/memory-search.ts:721-909,1083-1145`
- **Severity:** P2
- **Description:** Handler does not log a final "0 results" event to stdout/stderr. Records telemetry/consumption data, but that is not what operators grep for.
- **Fix:** Add structured log when results empty, including query, search type, stage counts, degraded flag, specFolder, vector availability.

### F06-5: P2 — BM25 silently returns [] when normalization removes all tokens

- **File:** `lib/search/bm25-index.ts:322-324,537-577`
- **Severity:** P2
- **Description:** `BM25Index.search()` silently returns `[]` when `normalizeLexicalQueryTokens(query).bm25` becomes empty. Normalization strips operators, stop words, and tokens shorter than 2 chars.
- **Fix:** Add debug/warn metadata when raw query non-empty but normalized BM25 tokens empty.

---

## Key Answers

1. **If Stage 1 returns 0 candidates, Stages 2-4 still run.** They cannot synthesize results from nothing; empty in = empty out.
2. **Empty results surfaced as normal "No matching memories found"** — no error, no warning.
3. **Missing sqlite-vec returns [] for EVERY vector call** — could explain "0 results for any query."
4. **Log grep targets:** `sqlite-vec extension not available`, `Vector search unavailable`, `[pipeline] Stage [234] failed`, `Falling back to anchor-only mode`
5. **No stage errors corrupt valid results** — stages fall back to prior-stage output. The risk is the opposite: valid results discarded upstream and silently normalized into empty "success".
