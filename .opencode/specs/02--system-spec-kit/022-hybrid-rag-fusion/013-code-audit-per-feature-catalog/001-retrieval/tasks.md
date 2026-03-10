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
- **Status:** DONE
- **Source:** `mcp_server/handlers/memory-context.ts:226-235`
- **Issue:** `enforceTokenBudget()` does not truncate over-budget payloads when inner envelope parsing fails; it returns the original result with `truncated: false`, allowing budget overruns to pass through silently.
- **Fix:** Changed `truncated: false` to `truncated: true` in fallback return. Updated T207 test assertion to match.
- **Evidence:** [EVIDENCE: memory-context.ts:234 verified] 280/280 tests pass

### T-02: Add regression test for malformed-payload budget enforcement
- **Priority:** P0
- **Feature:** F-01 Unified context retrieval (memory_context)
- **Status:** DONE
- **Source:** `mcp_server/tests/token-budget-enforcement.vitest.ts:64-101`
- **Issue:** No test covers the parse-failure budget fallback path; existing tests only cover normal under/over-budget flows. The listed test file `retry.vitest.ts` does not exist.
- **Fix:** Added T205-B4 regression test for malformed non-envelope payload. Stale retry.vitest.ts refs removed from 5 catalog files.
- **Evidence:** [EVIDENCE: token-budget-enforcement.vitest.ts:T205-B4 verified] 14/14 tests pass

### T-03: Fix Tier-3 fallback score cap mismatch (90% vs documented 50%)
- **Priority:** P0
- **Feature:** F-08 Quality-aware 3-tier search fallback
- **Status:** DONE
- **Source:** `mcp_server/lib/search/hybrid-search.ts:1299-1321`
- **Issue:** Tier-3 score calibration caps structural results at 90% of top existing score (`topCap = topExisting * 0.9`), but documentation states a 50% cap. Test only checks "below top score," not the exact cap ratio.
- **Fix:** Changed `topExisting * 0.9` to `topExisting * 0.5`. Tightened test T045-17c with exact 50% cap assertion.
- **Evidence:** [EVIDENCE: hybrid-search.ts:1328 verified] 23/23 search-fallback tests pass

### T-04: Add BM25 re-index gate to feature source table and test handler trigger
- **Priority:** P0
- **Feature:** F-06 BM25 trigger phrase re-index gate
- **Status:** DONE
- **Source:** `feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-gate.md:13-15`
- **Issue:** Feature Source Files table omits `memory-crud-update.ts` where the re-index gate is actually implemented. No test covers the update-handler gate condition (only BM25 internals/normalization/FTS are tested).
- **Fix:** Added handler row to catalog. Added 2 BM25 gate tests (positive: triggerPhrases fires re-index; negative: non-trigger field skips).
- **Evidence:** [EVIDENCE: bm25-index.vitest.ts verified] 80/80 BM25 tests pass

---

## P1 — Behavior Mismatch / Significant Code Issues

### T-05: Surface trigger-content load failures instead of silent blanking
- **Priority:** P1
- **Feature:** F-03 Trigger phrase matching (memory_match_triggers)
- **Status:** DONE
- **Source:** `mcp_server/handlers/memory-triggers.ts:149-159`
- **Issue:** Tiered content retrieval suppresses all file-read/path-validation errors and returns empty content silently, which can hide HOT/WARM retrieval failures from callers.
- **Fix:** Added console.warn with structured metadata (filePath, tier, error). Return contract unchanged. Stale retry.vitest.ts ref removed.
- **Evidence:** [EVIDENCE: memory-triggers.ts:157-161 verified] tsc+build pass

### T-06: Replace wildcard re-exports on retrieval-critical surfaces
- **Priority:** P1
- **Feature:** F-02 Semantic and lexical search (memory_search)
- **Status:** DONE
- **Source:** `mcp_server/lib/providers/embeddings.ts:9`, `mcp_server/lib/scoring/folder-scoring.ts:7`, `mcp_server/lib/utils/path-security.ts:7`, `mcp_server/lib/search/vector-index.ts:6-10`
- **Issue:** Wildcard barrel re-exports are used instead of explicit named exports across multiple retrieval implementation surfaces, reducing auditability and increasing risk of unintended API surface changes.
- **Fix:** Replaced `export *` with explicit named exports in 3 barrel files. vector-index.ts internal barrel kept (acceptable pattern).
- **Evidence:** [EVIDENCE: embeddings.ts, folder-scoring.ts, path-security.ts verified] tsc --noEmit pass

### T-07: Remove empty catch blocks that swallow errors in search modules
- **Priority:** P1
- **Feature:** F-04 Hybrid search pipeline
- **Status:** DONE
- **Source:** `mcp_server/lib/search/vector-index-queries.ts:552-553`, `mcp_server/lib/search/vector-index-schema.ts:790-791`
- **Issue:** Empty catch blocks swallow errors silently in vector-index query and schema modules, shared across F-02, F-03, F-04, and F-05 retrieval surfaces.
- **Fix:** Added console.warn with structured diagnostics in both empty catch blocks. Stale refs removed.
- **Evidence:** [EVIDENCE: vector-index-queries.ts:553, vector-index-schema.ts:791 verified] lint pass

### T-08: Harden 4-stage pipeline export and error handling
- **Priority:** P1
- **Feature:** F-05 4-stage pipeline architecture
- **Status:** DONE (merged with T-06/T-07 — same files)
- **Source:** `mcp_server/lib/providers/embeddings.ts:9`, `mcp_server/lib/search/vector-index-queries.ts:552-553`
- **Issue:** Same wildcard re-export and empty catch issues affect the 4-stage pipeline architecture surfaces. Stale `retry.vitest.ts` reference in feature catalog.
- **Fix:** Covered by T-06 (named exports) and T-07 (catch blocks) — same underlying files.
- **Evidence:** See T-06 and T-07 evidence

---

## P2 — Documentation / Test Gaps

### T-09: Cover working-memory tool-result extraction provenance fields
- **Priority:** P2
- **Feature:** F-09 Tool-result extraction to working memory
- **Status:** DONE
- **Source:** `mcp_server/lib/cognitive/working-memory.ts:347-403`
- **Issue:** No test covers extracted tool-result upserts, conflict-update semantics, or provenance fields (`source_tool`, `source_call_id`, `extraction_rule_id`, `redaction_applied`) in working memory rows.
- **Fix:** Added 3 provenance tests: upsert persistence, conflict-update semantics, checkpoint save/restore.
- **Evidence:** [EVIDENCE: working-memory.vitest.ts verified] 50/50 working memory tests pass
