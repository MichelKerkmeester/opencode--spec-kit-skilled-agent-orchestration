# Review Iteration 03 — Data Flow (Part 1): Handler to Pipeline

**Reviewer:** Copilot CLI / GPT 5.4 High  
**Dimension:** Trace query from memory_search handler through orchestrator to stage1  
**Files reviewed:** `handlers/memory-search.ts`, `lib/search/pipeline/orchestrator.ts`, `lib/search/pipeline/stage1-candidate-gen.ts`, `utils/validators.ts`

---

## Findings

### F03-1: P1 — Hybrid branch silently propagates 0 candidates when JOIN drops all rows

- **File:** `lib/search/pipeline/stage1-candidate-gen.ts:852-885`
- **Severity:** P1 (likely bug)
- **Description:** In the hybrid branch, `hybridSearch.collectRawCandidates(...)` returning `[]` is treated as success. Vector fallback only runs inside `catch` (on thrown error). If the hybrid SQL path succeeds but an INNER JOIN drops all rows (e.g., empty `active_memory_projection`), the pipeline silently propagates 0 candidates through all remaining stages.
- **Fix:** If hybrid returns 0 rows for a valid query+embedding, either run vector-only fallback or raise/log an anomaly.

### F03-2: P1 — Handler hard-wires searchType to 'hybrid' with no escape

- **File:** `handlers/memory-search.ts:683-689`
- **Severity:** P1 (likely bug)
- **Description:** The handler hard-wires ALL normal query searches to `searchType: 'hybrid'` unless there are 2+ concepts. There is no handler-level vector-only escape hatch. If the hybrid backend is semantically broken but not throwing, every normal query returns 0.
- **Fix:** Allow explicit `vector` searchType from the handler, or auto-fallback when hybrid returns suspiciously empty results.

### F03-3: P2 — Cache hits can mask backend fixes

- **File:** `handlers/memory-search.ts:663-673`
- **Severity:** P2 (potential issue)
- **Description:** Cache hits bypass candidate generation entirely and return cached payloads directly. Stale cached empty results can mask backend fixes during debugging.
- **Fix:** Bypass cache during investigation, or version/invalidate cache on search-path/schema changes.

---

## Trace Summary

| Step | Location | What happens |
|------|----------|-------------|
| 1 | `memory-search.ts:498-521` | Handler validates query via `validateQuery()` (trim-only) |
| 2 | `memory-search.ts:683-689` | Sets `searchType: 'hybrid'` |
| 3 | `memory-search.ts:721` | Calls `executePipeline(config)` |
| 4 | `orchestrator.ts:66-68` | Calls `executeStage1({ config })` with timeout |
| 5 | `stage1-candidate-gen.ts:604+` | Hybrid branch: generates embedding, calls `hybridSearch.collectRawCandidates()` |
| 6 | `stage1-candidate-gen.ts:612-613` | Embedding generation (throws on failure, does NOT silently return 0) |
| 7 | `stage1-candidate-gen.ts:852-885` | `collectRawCandidates([])` treated as success (silent 0 propagation) |

**Key insight:** The handler does NOT precompute queryEmbedding. Stage 1 generates it. Null embedding throws (not silent). The 0-result path is via successful-but-empty hybrid results, not via missing embeddings.
