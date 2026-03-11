# Guards and edge cases

## Current Reality

Two guard/edge-case issues were fixed:

**E1 — Temporal contiguity double-counting:** `temporal-contiguity.ts` had an O(N^2) nested loop that processed both (A,B) and (B,A) pairs, double-counting boosts. Fixed inner loop to `j = i + 1`.

**E2 — Wrong-memory fallback:** `extraction-adapter.ts` fell back to resolving the most-recent memory ID on entity resolution failure, silently linking to the wrong memory. The fallback was removed; the function returns `null` on resolution failure.

## Source Files

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

## Source Metadata

- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Guards and edge cases
- Current reality source: feature_catalog.md
