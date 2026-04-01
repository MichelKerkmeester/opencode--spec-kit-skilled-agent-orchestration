---
title: "Temporal edge validity"
description: "valid_at/invalid_at columns on causal_edges enable time-bounded graph traversal, with invalidateEdge() marking outdated edges and getValidEdges() filtering to currently valid ones, gated by the SPECKIT_TEMPORAL_EDGES flag."
---

# Temporal edge validity

## 1. OVERVIEW

`valid_at`/`invalid_at` columns on `causal_edges` enable time-bounded graph traversal, with `invalidateEdge()` marking outdated edges and `getValidEdges()` filtering to currently valid ones. This ensures that graph walks and causal boosts only consider edges that are temporally current, preventing stale or superseded relationships from influencing search ranking.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_TEMPORAL_EDGES=false` to disable.

The `causal_edges` table includes `valid_at` (timestamp when the edge became valid) and `invalid_at` (timestamp when the edge was invalidated, null if still valid). The `invalidateEdge()` function sets the `invalid_at` timestamp on a specified edge, marking it as no longer current. The `getValidEdges()` function filters edges to return only those where `invalid_at` is null, ensuring graph traversal operates on the current state of knowledge.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/graph/temporal-edges.ts` | Lib | `invalidateEdge()`, `getValidEdges()`, temporal column management |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/temporal-edges.vitest.ts` | Temporal edge validity, invalidation, and filtering |

---

## 4. SOURCE METADATA

- Group: Graph signal activation
- Source feature title: Temporal edge validity
- Graduated via: 009-graph-retrieval-improvements
- Kill switch: SPECKIT_TEMPORAL_EDGES=false
