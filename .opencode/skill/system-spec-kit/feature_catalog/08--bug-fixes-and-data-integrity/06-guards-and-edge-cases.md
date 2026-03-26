---
title: "Guards and edge cases"
description: "Tracks six guard/edge-case fixes for temporal contiguity scoring, entity resolution fallback, retrieval expiry filtering, limit enforcement, embedding validation and partial-status accounting."
---

# Guards and edge cases

## 1. OVERVIEW

Tracks six guard/edge-case fixes for temporal contiguity scoring, entity resolution fallback, retrieval expiry filtering, limit enforcement, embedding validation and partial-status accounting.

Six subtle bugs were fixed. Some inflated scores, some linked data to the wrong place and several only appeared on uncommon retrieval paths. Together these fixes make sure the system produces accurate results, respects caller limits and never quietly reports the wrong state.

---

## 2. CURRENT REALITY

Six guard/edge-case issues were fixed:

**E1: Temporal contiguity double-counting:** `temporal-contiguity.ts` had an O(N^2) nested loop that processed both (A,B) and (B,A) pairs, double-counting boosts. Fixed inner loop to `j = i + 1`.

**E2: Wrong-memory fallback:** `extraction-adapter.ts` fell back to resolving the most-recent memory ID on entity resolution failure, silently linking to the wrong memory. The fallback was removed. The function returns `null` on resolution failure.

**E3: Expired multi-concept results:** `multi_concept_search()` now applies `AND (m.expires_at IS NULL OR m.expires_at > datetime('now'))`, bringing the AND-match path back in line with single-query retrieval and preventing expired memories from leaking into result sets.

**E4: Vector-search limit overflow:** `vector_search()` now returns `constitutional_results.slice(0, limit)` when constitutional injection already fills the request, so callers never receive more rows than `limit` even when the constitutional tier saturates the result set.

**E5: Embedding dimension validation:** `vector_search()` now validates embedding length before buffer conversion and throws a `VectorIndexError` with `EMBEDDING_VALIDATION` semantics instead of surfacing raw sqlite-vec errors for malformed embeddings.

**E6: Partial-status accounting:** `get_status_counts()` and `get_stats()` now include the `partial` embedding state so partially indexed rows stop disappearing from dashboard totals and status breakdowns.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/temporal-contiguity.ts` | Lib | **E1**: pairwise loop uses `for (let j = i + 1; ...)` to avoid double-counting `(A,B)` and `(B,A)`. |
| `mcp_server/lib/extraction/extraction-adapter.ts` | Lib | **E2**: unresolved memory references return `null` (no most-recent-memory fallback). |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/temporal-contiguity.vitest.ts` | **E1**: T502 coverage validates temporal-contiguity boost behavior on adjacent/time-windowed results. |
| `mcp_server/tests/extraction-adapter.vitest.ts` | **E2**: T035a/T035b/T035c verifies unresolved memory IDs skip insert rather than linking the wrong memory. |

---

## 4. SOURCE METADATA

- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Guards and edge cases
- Current reality source: FEATURE_CATALOG.md
