# Tasks: 001-Retrieval Phase

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0       | 3     | FAIL status findings (correctness bugs, behavior mismatches) |
| P1       | 4     | WARN with behavior mismatch or significant code issues |
| P2       | 1     | WARN with documentation/test gaps only |
| **Total** | **8** | |

---

## P0 — Critical / Correctness

### T-01: Fix fallback token-budget truncation in enforceTokenBudget
- **Priority:** P0
- **Feature:** F-01 Unified context retrieval (memory_context)
- **Status:** TODO
- **Source:** `mcp_server/handlers/memory-context.ts:226-235`
- **Issue:** `enforceTokenBudget()` does not truncate over-budget payloads when inner envelope parsing fails; it returns the original result with `truncated: false`, allowing budget overruns to pass through silently.
- **Fix:** Implement real fallback truncation (or hard error) in the parse-failure path so budget enforcement is guaranteed regardless of envelope structure.

### T-02: Add regression test for malformed-payload budget enforcement
- **Priority:** P0
- **Feature:** F-01 Unified context retrieval (memory_context)
- **Status:** TODO
- **Source:** `mcp_server/tests/token-budget-enforcement.vitest.ts:64-101`
- **Issue:** No test covers the parse-failure budget fallback path; existing tests only cover normal under/over-budget flows. The listed test file `retry.vitest.ts` does not exist.
- **Fix:** Add a regression test for malformed/non-envelope payload budget enforcement and remove the stale `retry.vitest.ts` reference from the feature catalog.

### T-03: Fix Tier-3 fallback score cap mismatch (90% vs documented 50%)
- **Priority:** P0
- **Feature:** F-08 Quality-aware 3-tier search fallback
- **Status:** TODO
- **Source:** `mcp_server/lib/search/hybrid-search.ts:1299-1321`
- **Issue:** Tier-3 score calibration caps structural results at 90% of top existing score (`topCap = topExisting * 0.9`), but documentation states a 50% cap. Test only checks "below top score," not the exact cap ratio.
- **Fix:** Align implementation to 50% cap (or update feature catalog if 90% is intentional) and tighten tests to assert the exact cap ratio and rank-decay behavior.

### T-04: Add BM25 re-index gate to feature source table and test handler trigger
- **Priority:** P0
- **Feature:** F-06 BM25 trigger phrase re-index gate
- **Status:** TODO
- **Source:** `feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-gate.md:13-15`
- **Issue:** Feature Source Files table omits `memory-crud-update.ts` where the re-index gate is actually implemented. No test covers the update-handler gate condition (only BM25 internals/normalization/FTS are tested).
- **Fix:** Add `mcp_server/handlers/memory-crud-update.ts` to the feature's implementation table. Add focused tests asserting BM25 re-index fires on `triggerPhrases` change and does not fire when neither `title` nor `triggerPhrases` changes.

---

## P1 — Behavior Mismatch / Significant Code Issues

### T-05: Surface trigger-content load failures instead of silent blanking
- **Priority:** P1
- **Feature:** F-03 Trigger phrase matching (memory_match_triggers)
- **Status:** TODO
- **Source:** `mcp_server/handlers/memory-triggers.ts:149-159`
- **Issue:** Tiered content retrieval suppresses all file-read/path-validation errors and returns empty content silently, which can hide HOT/WARM retrieval failures from callers.
- **Fix:** Emit structured warnings or response metadata when tiered content load fails instead of returning silent blank content. Add a latency-budget test for the trigger matching hot path and remove the stale `retry.vitest.ts` reference.

### T-06: Replace wildcard re-exports on retrieval-critical surfaces
- **Priority:** P1
- **Feature:** F-02 Semantic and lexical search (memory_search)
- **Status:** TODO
- **Source:** `mcp_server/lib/providers/embeddings.ts:9`, `mcp_server/lib/scoring/folder-scoring.ts:7`, `mcp_server/lib/utils/path-security.ts:7`, `mcp_server/lib/search/vector-index.ts:6-10`
- **Issue:** Wildcard barrel re-exports are used instead of explicit named exports across multiple retrieval implementation surfaces, reducing auditability and increasing risk of unintended API surface changes.
- **Fix:** Replace wildcard re-exports with explicit named exports on all retrieval-critical barrel files. Remove stale `retry.vitest.ts` references from the feature catalog.

### T-07: Remove empty catch blocks that swallow errors in search modules
- **Priority:** P1
- **Feature:** F-04 Hybrid search pipeline
- **Status:** TODO
- **Source:** `mcp_server/lib/search/vector-index-queries.ts:552-553`, `mcp_server/lib/search/vector-index-schema.ts:790-791`
- **Issue:** Empty catch blocks swallow errors silently in vector-index query and schema modules, shared across F-02, F-03, F-04, and F-05 retrieval surfaces.
- **Fix:** Replace empty catches with explicit recovery logic or structured diagnostic logging. Update the feature catalog test tables to remove stale `retry.vitest.ts` references.

### T-08: Harden 4-stage pipeline export and error handling
- **Priority:** P1
- **Feature:** F-05 4-stage pipeline architecture
- **Status:** TODO
- **Source:** `mcp_server/lib/providers/embeddings.ts:9`, `mcp_server/lib/search/vector-index-queries.ts:552-553`
- **Issue:** Same wildcard re-export and empty catch issues affect the 4-stage pipeline architecture surfaces. Stale `retry.vitest.ts` reference in feature catalog.
- **Fix:** Apply the same named-export and error-handling fixes as T-06/T-07 to the 4-stage pipeline surfaces. Remove stale test file references.

---

## P2 — Documentation / Test Gaps

### T-09: Cover working-memory tool-result extraction provenance fields
- **Priority:** P2
- **Feature:** F-09 Tool-result extraction to working memory
- **Status:** TODO
- **Source:** `mcp_server/lib/cognitive/working-memory.ts:347-403`
- **Issue:** No test covers extracted tool-result upserts, conflict-update semantics, or provenance fields (`source_tool`, `source_call_id`, `extraction_rule_id`, `redaction_applied`) in working memory rows.
- **Fix:** Add tests for `upsertExtractedEntry()` including conflict-update semantics and provenance fields. Add end-to-end test proving tool-result extraction survives checkpoint save/restore with provenance intact.
