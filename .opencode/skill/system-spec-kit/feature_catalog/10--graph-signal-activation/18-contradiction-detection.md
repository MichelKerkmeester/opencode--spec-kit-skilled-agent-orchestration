---
title: "Contradiction detection"
description: "detectContradictions() auto-invalidates old edges when superseding or conflicting edges are created, maintaining graph consistency by ensuring only the most current causal relationships remain active, gated by the SPECKIT_TEMPORAL_EDGES flag."
---

# Contradiction detection

## 1. OVERVIEW

`detectContradictions()` auto-invalidates old edges when superseding or conflicting edges are created, maintaining graph consistency by ensuring only the most current causal relationships remain active. This prevents contradictory information from coexisting in the active graph, which would otherwise cause conflicting signals during causal boost and graph traversal.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_TEMPORAL_EDGES=false` to disable (shares flag with temporal edge validity).

When a new causal edge is created, `detectContradictions()` checks for existing edges between the same source and target nodes that carry a conflicting or superseding relation type. If a contradiction is found, the older edge is automatically invalidated via `invalidateEdge()`, setting its `invalid_at` timestamp. This runs as part of the edge creation flow, so the graph is always consistent after mutation.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/graph/contradiction-detection.ts` | Lib | `detectContradictions()` — conflict detection and automatic edge invalidation |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/contradiction-detection.vitest.ts` | Contradiction detection, auto-invalidation, and edge conflict scenarios |

---

## 4. SOURCE METADATA

- Group: Graph signal activation
- Source feature title: Contradiction detection
- Graduated via: 009-graph-retrieval-improvements
- Kill switch: SPECKIT_TEMPORAL_EDGES=false
