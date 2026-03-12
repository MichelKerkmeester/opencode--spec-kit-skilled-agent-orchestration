# Performance improvements

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Performance improvements.

## 2. CURRENT REALITY

Thirteen performance improvements were applied:

**Quick wins:** `Math.max(...spread)` replaced with `reduce`-based max in `tfidf-summarizer.ts` (prevents RangeError on large arrays). Unbounded query in `memory-summaries.ts` gained a `LIMIT` clause. O(n) full scan in `mutation-ledger.ts` replaced with SQL `COUNT(*)` query using `json_extract`.

**Entity linker:** `mergedEntities` array lookups converted to `Set` for O(1) `.has()` checks. N+1 `getEdgeCount` queries replaced with a single batch query that combines `source_id IN (...)` and `target_id IN (...)` branches via `UNION ALL` before aggregation.

**SQL-level:** Causal edge upsert keeps explicit row lookup before and after UPSERT so weight-history logging and canonical row-id resolution stay deterministic; round-trip reduction via `last_insert_rowid()` has not been applied in the current implementation. Spec folder hierarchy tree is cached with a 60-second WeakMap TTL keyed by database instance.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/tfidf-summarizer.ts` | Lib | Reduce-based max scoring for large-summary safety |
| `mcp_server/lib/search/memory-summaries.ts` | Lib | Summary query LIMIT and summary-channel operations |
| `mcp_server/lib/storage/mutation-ledger.ts` | Lib | COUNT/json_extract SQL path replacing O(n) scans |
| `mcp_server/lib/search/entity-linker.ts` | Lib | Set-based entity checks and batched edge counting |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | Transactional upsert with deterministic pre/post lookup for weight-history logging |
| `mcp_server/lib/search/spec-folder-hierarchy.ts` | Lib | WeakMap + TTL caching for folder hierarchy tree |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/memory-summaries.vitest.ts` | TF-IDF summary generation and summary query behavior |
| `mcp_server/tests/mutation-ledger.vitest.ts` | Mutation ledger counting/query performance guards |
| `mcp_server/tests/entity-linker.vitest.ts` | Entity linker batch edge-count logic coverage |
| `mcp_server/tests/causal-edges-unit.vitest.ts` | Causal edge upsert/update unit behavior |
| `mcp_server/tests/causal-edges.vitest.ts` | Causal edge storage integration paths |
| `mcp_server/tests/spec-folder-hierarchy.vitest.ts` | Hierarchy cache/TTL behavior and traversal checks |

## 4. SOURCE METADATA

- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Performance improvements
- Current reality source: feature_catalog.md
