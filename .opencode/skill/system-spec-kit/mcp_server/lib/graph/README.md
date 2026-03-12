---
title: "Graph Analysis"
description: "Community detection and graph signal scoring for causal memory networks. Provides BFS connected-component labelling, single-level Louvain modularity and momentum/depth scoring."
trigger_phrases:
  - "community detection"
  - "graph signals"
  - "causal depth"
  - "momentum scoring"
  - "louvain"
---

# Graph Analysis

> Community detection and graph signal scoring for causal memory networks. Provides BFS connected-component labelling, single-level Louvain modularity and momentum/depth scoring.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. KEY CONCEPTS](#3--key-concepts)
- [4. RELATED DOCUMENTS](#4--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The graph module operates on the `causal_edges` table to detect communities of related memories and compute graph-derived scoring signals. Both files are gated behind feature flags (`SPECKIT_COMMUNITY_DETECTION` and `SPECKIT_GRAPH_SIGNALS`).

### What It Does

- **Community detection** groups memory nodes into clusters using BFS connected-component labelling as a fast first pass, then escalates to single-level Louvain modularity when the largest component holds more than 50% of all nodes.
- **Graph signals** compute two additive score bonuses for search results: momentum (degree change over 7 days) and causal depth (normalized BFS distance from root nodes).

### Design Decisions

| Decision | Rationale |
|----------|-----------|
| BFS-first, Louvain-second | BFS runs in O(V+E) and handles well-partitioned graphs. Louvain is only invoked when BFS produces a single dominant component. |
| Index-based queue traversal | Avoids O(n) cost of `Array.shift()` during BFS. |
| Session-scoped caching | Momentum and depth caches prevent redundant DB queries within a single session. Caches clear at 10,000 entries. |
| Debounce via edge fingerprint | Community detection skips re-computation when edge count, max ID and checksum are unchanged. |
| Co-retrieval boost capped at 3 | Prevents community members from overwhelming primary search results. Boost factor of 0.3x was chosen empirically. |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
graph/
  community-detection.ts   # BFS + Louvain community detection, persistence, co-retrieval boost
  graph-signals.ts         # Momentum and causal depth scoring, degree snapshots
  README.md                # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `community-detection.ts` | Builds undirected adjacency lists from `causal_edges`, runs BFS connected-component labelling, escalates to single-level Louvain when needed, persists assignments to `community_assignments` table, and injects community co-members into search results with a 0.3x score boost |
| `graph-signals.ts` | Snapshots node degrees to `degree_snapshots` table, computes momentum (current degree minus degree 7 days ago), computes normalized causal depth via multi-root BFS, and applies both as additive bonuses to scored search results |

### Exported Functions

| Function | File | Description |
|----------|------|-------------|
| `detectCommunities` | community-detection.ts | Top-level orchestrator: BFS then conditional Louvain, with debounce |
| `detectCommunitiesBFS` | community-detection.ts | BFS connected-component labelling from database |
| `detectCommunitiesLouvain` | community-detection.ts | Single-level Louvain modularity on a pre-built adjacency list |
| `shouldEscalateToLouvain` | community-detection.ts | Returns true if the largest component holds >50% of nodes |
| `storeCommunityAssignments` | community-detection.ts | Persists node-to-community mappings with INSERT OR REPLACE |
| `getCommunityMembers` | community-detection.ts | Returns memory IDs sharing the same community as a given node |
| `applyCommunityBoost` | community-detection.ts | Injects up to 3 community co-members into result rows |
| `resetCommunityDetectionState` | community-detection.ts | Resets module-level debounce state (test-only) |
| `snapshotDegrees` | graph-signals.ts | Records current degree counts into `degree_snapshots` |
| `computeMomentum` | graph-signals.ts | Computes single-node momentum (degree delta over 7 days) |
| `computeMomentumScores` | graph-signals.ts | Batch momentum computation with session caching |
| `computeCausalDepthScores` | graph-signals.ts | Batch normalized causal depth via multi-root BFS |
| `applyGraphSignals` | graph-signals.ts | Applies momentum (+0.05 max) and depth (+0.05 max) bonuses to result rows |
| `clearGraphSignalsCache` | graph-signals.ts | Clears momentum and depth session caches |

<!-- /ANCHOR:structure -->

---

## 3. KEY CONCEPTS
<!-- ANCHOR:key-concepts -->

### Score Adjustments

| Signal | Formula | Range | Purpose |
|--------|---------|-------|---------|
| Momentum bonus | `clamp(momentum * 0.01, 0, 0.05)` | 0 to +0.05 | Rewards nodes gaining connections |
| Depth bonus | `normalizedDepth * 0.05` | 0 to +0.05 | Rewards structurally deep nodes |
| Community boost | `0.3 * originalRow.score` | Varies | Surfaces community co-members in results |

### Database Tables Used

| Table | Module | Usage |
|-------|--------|-------|
| `causal_edges` | Both | Source of graph structure (source_id, target_id) |
| `community_assignments` | community-detection.ts | Persisted node-to-community mappings |
| `degree_snapshots` | graph-signals.ts | Historical degree counts per snapshot date |
| `memory_index` | community-detection.ts | Referenced for stale assignment cleanup |

<!-- /ANCHOR:key-concepts -->

---

## 4. RELATED DOCUMENTS
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../scoring/README.md](../scoring/README.md) | Composite scoring that consumes graph signal outputs |
| [../cognitive/README.md](../cognitive/README.md) | FSRS scheduler and attention decay |
| [../storage/README.md](../storage/README.md) | Schema definitions for causal_edges and related tables |

### Parent Module

| Resource | Description |
|----------|-------------|
| [../README.md](../README.md) | Library module overview |
| [../../../SKILL.md](../../../SKILL.md) | System Spec Kit skill documentation |

<!-- /ANCHOR:related -->

---

**Version**: 1.0.0
**Last Updated**: 2026-03-08
