---
title: "Reconsolidation-on-save"
description: "Reconsolidation-on-save merges, supersedes or complements new memories with existing similar memories based on cosine similarity thresholds."
---

# Reconsolidation-on-save

## 1. OVERVIEW

Reconsolidation-on-save merges, supersedes or complements new memories with existing similar memories based on cosine similarity thresholds.

When you save a new memory that is very similar to one already stored, the system decides what to do with the overlap. If the two are nearly identical, it merges them into one stronger memory. If the new one contradicts the old one, the old one is retired and the new one takes over. If they are different enough, both are kept side by side. This keeps your memory collection clean and up to date instead of cluttered with redundant notes.

---

## 2. CURRENT REALITY

After embedding generation, the save pipeline checks the top-3 most similar memories in the same spec folder. Similarity at or above 0.88 triggers a merge where content is combined and the `importance_weight` is incremented via `Math.min(1.0, currentWeight + 0.1)`. Similarity between 0.75 and 0.88 triggers conflict resolution: the old memory is deprecated and a `supersedes` causal edge is created. Below 0.75, the memory stores as a new complement.

**Sprint 8 update:** The original merge logic referenced a non-existent `frequency_counter` column, which would have caused runtime crashes on reconsolidation. This was replaced with `importance_weight` merge logic that properly uses an existing column.

**T302 stale-merge guard:** `executeMerge()` now snapshots the predecessor row before awaiting merged-embedding generation, then reloads that predecessor inside the transaction and compares both `content_hash` and `updated_at`. If the predecessor was edited by another writer during the async embedding wait, the merge aborts with complement-style status `predecessor_changed`. If the predecessor was deleted or archived before commit, the merge aborts with `predecessor_gone`. This prevents stale append-only merges against an out-of-date predecessor.

**T333 BM25 repair debt persistence:** If the append-only merge commits but post-commit BM25 repair still fails, reconsolidation now persists `bm25_repair_needed=1` on the newly merged row and returns a warning. Successful repair leaves the flag at `0`. This preserves the merged lineage while giving a future reconciler an explicit retry marker for search-index repair.

A checkpoint must exist for the spec folder before reconsolidation can run. When no checkpoint is found, the system logs a warning and skips reconsolidation rather than risking destructive merges without a safety net. Runs behind the `SPECKIT_RECONSOLIDATION` flag (default OFF, opt-in). Set `SPECKIT_RECONSOLIDATION=true` to enable.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-save.ts` | Handler | Runs reconsolidation inside the save transaction before the normal create-record path |
| `mcp_server/handlers/save/db-helpers.ts` | Handler | Save DB helpers |
| `mcp_server/handlers/save/reconsolidation-bridge.ts` | Handler | Reconsolidation bridge |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | Causal edge storage |
| `mcp_server/lib/storage/reconsolidation.ts` | Lib | Memory reconsolidation |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/reconsolidation.vitest.ts` | Reconsolidation tests |
| `mcp_server/tests/search-flags.vitest.ts` | Feature flag behavior |

---

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Reconsolidation-on-save
- Current reality source: FEATURE_CATALOG.md
