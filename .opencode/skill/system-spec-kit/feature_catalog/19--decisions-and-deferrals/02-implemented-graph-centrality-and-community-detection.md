# Implemented: graph centrality and community detection

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Implemented: graph centrality and community detection.

## 2. CURRENT REALITY

Originally deferred at Sprint 6b pending a feasibility spike. Three graph capabilities were planned: graph momentum (N2a), causal depth signal (N2b) and community detection (N2c).

**Now implemented.** N2a and N2b share a single flag (`SPECKIT_GRAPH_SIGNALS`, default ON) providing additive score adjustments up to +0.05 each in Stage 2. N2c runs behind `SPECKIT_COMMUNITY_DETECTION` (default ON) with BFS connected components escalating to a pure-TypeScript Louvain implementation when the largest component exceeds 50% of nodes. Schema migrations v19 added `degree_snapshots` and `community_assignments` tables. See [Graph momentum scoring](#graph-momentum-scoring), [Causal depth signal](#causal-depth-signal) and [Community detection](#community-detection) for full descriptions.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/graph/community-detection.ts` | Lib | Community detection algorithm |
| `mcp_server/lib/manage/pagerank.ts` | Lib | PageRank computation |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/community-detection.vitest.ts` | Community detection tests |
| `mcp_server/tests/pagerank.vitest.ts` | PageRank computation tests |

## 4. SOURCE METADATA

- Group: Decisions and deferrals
- Source feature title: Implemented: graph centrality and community detection
- Current reality source: feature_catalog.md
