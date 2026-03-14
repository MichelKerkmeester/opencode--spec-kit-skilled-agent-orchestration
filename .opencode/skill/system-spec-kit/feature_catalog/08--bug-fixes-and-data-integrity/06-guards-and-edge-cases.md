# Guards and edge cases

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. IN SIMPLE TERMS](#5--in-simple-terms)

## 1. OVERVIEW

Tracks two guard/edge-case fixes for temporal contiguity double-counting and wrong-memory entity resolution fallback.

## 2. CURRENT REALITY

Two guard/edge-case issues were fixed:

**E1: Temporal contiguity double-counting:** `temporal-contiguity.ts` had an O(N^2) nested loop that processed both (A,B) and (B,A) pairs, double-counting boosts. Fixed inner loop to `j = i + 1`.

**E2: Wrong-memory fallback:** `extraction-adapter.ts` fell back to resolving the most-recent memory ID on entity resolution failure, silently linking to the wrong memory. The fallback was removed. The function returns `null` on resolution failure.

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

## 4. SOURCE METADATA

- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Guards and edge cases
- Current reality source: feature_catalog.md

## 5. IN SIMPLE TERMS

Two subtle bugs were fixed. One was double-counting certain score boosts, which inflated results unfairly. The other was silently linking new data to the wrong memory when it could not find the right one. Both fixes make sure the system produces accurate results and never quietly does the wrong thing.
