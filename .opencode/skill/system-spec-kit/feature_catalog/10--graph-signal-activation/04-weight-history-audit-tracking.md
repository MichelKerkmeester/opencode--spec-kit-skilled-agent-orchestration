---
title: "Weight history audit tracking"
description: "Describes the `created_by`/`last_accessed` metadata on causal edges, the `weight_history` audit table and the edge bounds enforcement that caps auto-generated edges at 20 per node and 0.5 max strength."
---

# Weight history audit tracking

## 1. OVERVIEW

Describes the `created_by`/`last_accessed` metadata on causal edges, the `weight_history` audit table and the edge bounds enforcement that caps auto-generated edges at 20 per node and 0.5 max strength.

Every connection between memories now keeps a paper trail: who created it, when it was last used and every time its strength changed. This works like a change log for relationships. If a connection goes wrong, you can trace exactly what happened and roll it back. There are also limits on automatically created connections so the system cannot overwhelm itself with too many links.

---

## 2. CURRENT REALITY

Every causal edge now carries `created_by` and `last_accessed` metadata fields tracking who created the edge and when it was last used. All strength modifications are logged to a `weight_history` table recording old strength, new strength, the actor (`changed_by`), timestamp and reason.

Edge bounds are enforced at insert time. Auto-generated edges (those with `created_by='auto'`) are rejected when a node already has 20 edges (`MAX_EDGES_PER_NODE`) and clamped to a maximum strength of 0.5 (`MAX_AUTO_STRENGTH`). A `rollbackWeights()` function restores edges from weight history with a fallback to the oldest entry if timestamp matching fails due to same-millisecond updates.

This audit infrastructure supports the N3-lite consolidation engine: Hebbian strengthening, staleness detection and edge bounds enforcement all rely on accurate weight history and provenance tracking.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
| `mcp_server/lib/search/graph-search-fn.ts` | Lib | Graph degree scoring |
| `mcp_server/lib/search/search-types.ts` | Lib | Search type definitions |
| `mcp_server/lib/search/spec-folder-hierarchy.ts` | Lib | Spec folder hierarchy traversal |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | Causal edge storage |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/bm25-index.vitest.ts` | BM25 index operations |
| `mcp_server/tests/causal-edges-unit.vitest.ts` | Causal edge unit tests |
| `mcp_server/tests/causal-edges.vitest.ts` | Causal edge storage tests |
| `mcp_server/tests/content-normalizer.vitest.ts` | Content normalization tests |
| `mcp_server/tests/graph-search-fn.vitest.ts` | Graph search function tests |
| `mcp_server/tests/spec-folder-hierarchy.vitest.ts` | Folder hierarchy tests |

---

## 4. SOURCE METADATA

- Group: Graph signal activation
- Source feature title: Weight history audit tracking
- Current reality source: FEATURE_CATALOG.md
