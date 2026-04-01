---
title: "Graph Analysis"
description: "Community detection, graph signal scoring, temporal edges, contradiction detection, usage tracking, and community summaries for causal memory networks."
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

The graph module operates on the `causal_edges` and `memory_index` tables to detect communities, compute scoring signals, manage temporal edge validity, detect contradictions, track usage, and generate community summaries. All features are independently gated behind `SPECKIT_*` feature flags.

### What It Does

- **Community detection** groups memory nodes into clusters using BFS connected-component labelling as a fast first pass, then escalates to single-level Louvain modularity when the largest component holds more than 50% of all nodes.
- **Community summaries** generate readable text summaries per community by aggregating member titles and extracting top topics. Stored in `community_summaries` table.
- **Community storage** provides persistence and retrieval for community data.
- **Graph signals** compute two additive score bonuses for search results: momentum (degree change over 7 days) and causal depth (normalized longest-path depth on the SCC-condensed causal DAG).
- **Temporal edges** add `valid_at`/`invalid_at` columns to `causal_edges` for bi-temporal validity management.
- **Contradiction detection** auto-invalidates old edges when superseding or conflicting edges are created.
- **Usage tracking** counts memory access and computes a log-scale ranking boost (0-0.10).
- **Usage ranking signal** provides the boost computation formula for the ranking pipeline.

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
  community-detection.ts      # BFS + Louvain community detection, persistence, co-retrieval boost
  community-summaries.ts      # Template-based community summary generation
  community-storage.ts        # Community persistence and retrieval
  contradiction-detection.ts  # Superseding/conflicting edge detection + auto-invalidation
  graph-signals.ts            # Momentum and causal depth scoring, degree snapshots
  temporal-edges.ts           # valid_at/invalid_at edge validity management
  usage-ranking-signal.ts     # Log-scale usage boost computation
  usage-tracking.ts           # Memory access count tracking
  README.md                   # This file
```

### Key Files

| File | Purpose | Flag |
|------|---------|------|
| `community-detection.ts` | BFS connected-component labelling, Louvain escalation, community co-member injection | `SPECKIT_COMMUNITY_DETECTION` |
| `community-summaries.ts` | Generates text summaries per community from member titles/topics, stores in `community_summaries` table | `SPECKIT_COMMUNITY_SUMMARIES` |
| `community-storage.ts` | Stores and retrieves community data (assignments, membership) | `SPECKIT_COMMUNITY_SUMMARIES` |
| `contradiction-detection.ts` | Detects superseding and conflicting edge relations, auto-invalidates old edges via `temporal-edges.ts` | `SPECKIT_TEMPORAL_EDGES` |
| `graph-signals.ts` | Degree snapshots, momentum scoring (7-day delta), causal depth via SCC condensation | `SPECKIT_GRAPH_SIGNALS` |
| `temporal-edges.ts` | Adds `valid_at`/`invalid_at` columns to `causal_edges`, provides `invalidateEdge()` and `getValidEdges()` | `SPECKIT_TEMPORAL_EDGES` |
| `usage-ranking-signal.ts` | `computeUsageBoost()` — log-scale normalization producing 0.0-0.10 boost | `SPECKIT_USAGE_RANKING` |
| `usage-tracking.ts` | Adds `access_count` column to `memory_index`, provides `incrementAccessCount()` and `getAccessCount()` | `SPECKIT_USAGE_RANKING` |

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
| `computeCausalDepthScores` | graph-signals.ts | Batch normalized causal depth via SCC condensation and longest-path DAG traversal |
| `applyGraphSignals` | graph-signals.ts | Applies momentum (+0.05 max) and depth (+0.05 max) bonuses to result rows |
| `clearGraphSignalsCache` | graph-signals.ts | Clears momentum and depth session caches |
| `ensureSummaryTable` | community-summaries.ts | Creates `community_summaries` table if not exists |
| `generateSummaries` | community-summaries.ts | Generates text summaries per community from member titles |
| `getStoredSummaries` | community-summaries.ts | Returns all stored community summaries |
| `ensureTemporalColumns` | temporal-edges.ts | Adds valid_at/invalid_at columns to causal_edges |
| `invalidateEdge` | temporal-edges.ts | Marks an edge as invalidated with ISO timestamp |
| `getValidEdges` | temporal-edges.ts | Returns edges where invalid_at IS NULL |
| `detectContradictions` | contradiction-detection.ts | Checks if new edge contradicts existing edges, auto-invalidates |
| `ensureUsageColumn` | usage-tracking.ts | Adds access_count column to memory_index |
| `incrementAccessCount` | usage-tracking.ts | Increments access count for a memory |
| `getAccessCount` | usage-tracking.ts | Returns access count for a memory |
| `computeUsageBoost` | usage-ranking-signal.ts | Log-scale boost (0.0-0.10) from access count |

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
| `causal_edges` | Multiple | Source of graph structure; temporal-edges adds valid_at/invalid_at |
| `community_assignments` | community-detection.ts | Persisted node-to-community mappings |
| `community_summaries` | community-summaries.ts | Generated community text summaries with topics |
| `degree_snapshots` | graph-signals.ts | Historical degree counts per snapshot date |
| `memory_index` | usage-tracking.ts, community-detection.ts | access_count column, stale assignment cleanup |

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

**Version**: 2.0.0
**Last Updated**: 2026-04-01
