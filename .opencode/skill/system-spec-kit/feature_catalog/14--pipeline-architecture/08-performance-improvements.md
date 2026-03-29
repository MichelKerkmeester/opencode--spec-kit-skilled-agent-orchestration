---
title: "Performance improvements"
description: "Sixteen performance improvements reduce runtime cost across TF-IDF scoring, fallback fusion, token budgeting, mutation ledger scanning, entity linking and hierarchy caching."
---

# Performance improvements

## 1. OVERVIEW

Sixteen performance improvements reduce runtime cost across TF-IDF scoring, fallback fusion, token budgeting, mutation ledger scanning, entity linking and hierarchy caching.

Sixteen small speed improvements were made across the system. Some replaced slow scanning operations with faster lookups. Others fixed places where the same question was asked many times when once would do. The result is a system that responds more quickly, especially as the amount of stored data grows. Think of it as replacing a hand-cranked search with a power tool.

---

## 2. CURRENT REALITY

Sixteen performance improvements were applied:

**Quick wins:** `Math.max(...spread)` replaced with `reduce`-based max in `tfidf-summarizer.ts` (prevents RangeError on large arrays). Unbounded query in `memory-summaries.ts` gained a `LIMIT` clause. O(n) full scan in `mutation-ledger.ts` replaced with SQL `COUNT(*)` query using `json_extract`.

**Entity linker:** `mergedEntities` array lookups converted to `Set` for O(1) `.has()` checks. N+1 `getEdgeCount` queries replaced with a single batch query that combines `source_id IN (...)` and `target_id IN (...)` branches via `UNION ALL` before aggregation.

**SQL-level:** Causal edge upsert keeps explicit row lookup before and after UPSERT so weight-history logging and canonical row-id resolution stay deterministic. Round-trip reduction via `last_insert_rowid()` has not been applied in the current implementation. Spec folder hierarchy tree is cached with a 60-second WeakMap TTL keyed by database instance.

**Fallback pipeline split (T310):** Tiered fallback now separates fused candidate collection from post-fusion enrichment. `executeFallbackPlan()` gathers per-tier fused result sets first, then `searchWithFallbackTiered()` merges the selected tier outputs before `enrichFusedResults()` runs once. This removes repeated reranking, co-activation, folder scoring, and token-budget work from intermediate fallback tiers.

**Token estimation cache (T311):** `truncateToBudget()` caches per-result token estimates in a `Map` keyed by canonical `result.id`, so repeated passes over the same merged set do not re-estimate identical rows. `estimateResultTokens()` also replaced `JSON.stringify`-style whole-object sizing with direct field-aware character counting, reducing allocation overhead while staying aligned to the returned payload shape.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Tiered fallback split, single-pass enrichment, and cached token-budget estimation |
| `mcp_server/lib/search/tfidf-summarizer.ts` | Lib | Reduce-based max scoring for large-summary safety |
| `mcp_server/lib/search/memory-summaries.ts` | Lib | Summary query LIMIT and summary-channel operations |
| `mcp_server/lib/storage/mutation-ledger.ts` | Lib | COUNT/json_extract SQL path replacing O(n) scans |
| `mcp_server/lib/search/entity-linker.ts` | Lib | Set-based entity checks and batched edge counting |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | Transactional upsert with deterministic pre/post lookup for weight-history logging |
| `mcp_server/lib/search/spec-folder-hierarchy.ts` | Lib | WeakMap + TTL caching for folder hierarchy tree |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hybrid-search.vitest.ts` | Tiered fallback and token-budget pipeline behavior |
| `mcp_server/tests/memory-summaries.vitest.ts` | TF-IDF summary generation and summary query behavior |
| `mcp_server/tests/mutation-ledger.vitest.ts` | Mutation ledger counting/query performance guards |
| `mcp_server/tests/entity-linker.vitest.ts` | Entity linker batch edge-count logic coverage |
| `mcp_server/tests/causal-edges-unit.vitest.ts` | Causal edge upsert/update unit behavior |
| `mcp_server/tests/causal-edges.vitest.ts` | Causal edge storage integration paths |
| `mcp_server/tests/spec-folder-hierarchy.vitest.ts` | Hierarchy cache/TTL behavior and traversal checks |

---

## 4. SOURCE METADATA

- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Performance improvements
- Current reality source: FEATURE_CATALOG.md
