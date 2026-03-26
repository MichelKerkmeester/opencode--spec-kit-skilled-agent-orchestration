---
title: "Edge density measurement"
description: "Describes the global edge density metric (`total_edges / total_memories`) used by runtime guards to gate graph-derived features and entity-linking creation."
---

# Edge density measurement

## 1. OVERVIEW

Describes the global edge density metric (`total_edges / total_memories`) used by runtime guards to gate graph-derived features and entity-linking creation.

This measures how richly connected the knowledge graph is by counting the average number of links per memory. If there are too few connections, graph-based features would not add much value. If there are too many, the system holds off on creating new links to avoid a tangled mess. It is like a city planner checking road density before building more highways.

---

## 2. CURRENT REALITY

The current density metric used by runtime guards is global edge density: `total_edges / total_memories` from the graph tables. If density is too low, graph-derived gains are naturally limited. If density is too high, entity-linking creation is gated by the configured density threshold. Earlier "edges-per-node" phrasing is still useful intuition, but runtime checks now use the global-density denominator for consistency.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/edge-density.ts` | Lib | Edge density measurement |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/edge-density.vitest.ts` | Edge density measurement |

---

## 4. SOURCE METADATA

- Group: Graph signal activation
- Source feature title: Edge density measurement
- Current reality source: FEATURE_CATALOG.md
