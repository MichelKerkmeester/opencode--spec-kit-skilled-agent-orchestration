---
title: "Graph-expanded fallback"
description: "buildGraphExpandedFallback() walks 1-hop causal edges from concept seeds when search returns no_results or low_confidence, providing graph-derived recovery candidates, gated by the SPECKIT_GRAPH_FALLBACK flag."
---

# Graph-expanded fallback

## 1. OVERVIEW

`buildGraphExpandedFallback()` walks 1-hop causal edges from concept seeds when search returns `no_results` or `low_confidence`, providing graph-derived recovery candidates. Instead of returning empty results, the system uses the causal graph to find memories that are structurally related to the query concepts, even when no direct text or embedding match was found.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_GRAPH_FALLBACK=false` to disable.

When the search pipeline produces a `no_results` or `low_confidence` outcome, the recovery payload builder invokes `buildGraphExpandedFallback()`. This function takes concept seeds extracted from the query, walks 1-hop causal edges from those seeds, and returns the resulting memories as fallback candidates. The fallback results are clearly marked as graph-expanded so downstream consumers can distinguish them from direct search hits.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/recovery-payload.ts` | Lib | `buildGraphExpandedFallback()` — 1-hop causal walk from concept seeds for recovery |

### Tests

| File | Focus |
|------|-------|
| — | — |

---

## 4. SOURCE METADATA

- Group: Retrieval enhancements
- Source feature title: Graph-expanded fallback
- Graduated via: 009-graph-retrieval-improvements
- Kill switch: SPECKIT_GRAPH_FALLBACK=false
