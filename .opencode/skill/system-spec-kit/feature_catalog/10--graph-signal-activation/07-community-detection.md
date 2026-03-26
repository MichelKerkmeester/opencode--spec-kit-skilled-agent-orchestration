---
title: "Community detection"
description: "Describes BFS connected components and Louvain modularity-based community detection that clusters related memories, enabling co-member injection at 0.3x source score during Stage 2."
---

# Community detection

## 1. OVERVIEW

Describes BFS connected components and Louvain modularity-based community detection that clusters related memories, enabling co-member injection at 0.3x source score during Stage 2.

Memories naturally form clusters around related topics, like how books on a shelf group by subject. This feature identifies those clusters automatically. When you find one useful memory, the system can pull in its neighbors from the same cluster because they are likely related to what you are looking for. It is like finding one helpful book and having the librarian hand you the two sitting next to it.

---

## 2. CURRENT REALITY

Individual memories are retrieved based on query similarity, but they exist within communities of related knowledge. Community detection identifies these clusters so that when one member surfaces, its neighbors get a retrieval boost.

The primary algorithm is BFS connected components over the causal edge adjacency list. This is fast and sufficient when the graph has natural cluster boundaries. When the largest connected component exceeds 50% of all nodes (meaning the graph is too densely connected for BFS to produce meaningful clusters), the system escalates to a simplified pure-TypeScript Louvain modularity optimization. The Louvain implementation performs iterative node moves between communities to maximize modularity score Q, converging when no single move improves Q.

Community assignments are stored in the `community_assignments` table with a UNIQUE constraint on `memory_id`. Detection and persistence helpers (`detectCommunities*`, `storeCommunityAssignments`) include debounce logic, but they are not auto-invoked in the Stage 2 hot path.

The `applyCommunityBoost()` function in the pipeline injects up to 3 community co-members into the result set at 0.3x the source memory's score, using whatever assignments already exist in `community_assignments`. Community injection runs in Stage 2 at position 2b (between causal boost and graph signals) so that injected rows also receive N2a+N2b momentum and depth adjustments. Runs behind the `SPECKIT_COMMUNITY_DETECTION` flag (default ON).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/graph/community-detection.ts` | Lib | Community detection algorithm |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/community-detection.vitest.ts` | Community detection tests |

---

## 4. SOURCE METADATA

- Group: Graph signal activation
- Source feature title: Community detection
- Current reality source: FEATURE_CATALOG.md
