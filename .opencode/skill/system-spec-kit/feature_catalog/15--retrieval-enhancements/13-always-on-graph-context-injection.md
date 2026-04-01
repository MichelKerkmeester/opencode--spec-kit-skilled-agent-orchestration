---
title: "Always-on graph context injection"
description: "injectGraphContext() runs concept routing and a 1-hop causal walk even without seed results, ensuring graph-derived context is always available to enrich search output, gated by the SPECKIT_GRAPH_CONTEXT_INJECTION flag."
---

# Always-on graph context injection

## 1. OVERVIEW

`injectGraphContext()` runs concept routing and a 1-hop causal walk even without seed results, ensuring graph-derived context is always available to enrich search output. This decouples graph context from the success of initial retrieval channels, so that causal neighbors and concept-linked memories surface regardless of whether vector or BM25 channels returned strong hits.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_GRAPH_CONTEXT_INJECTION=false` to disable.

The `injectGraphContext()` function in `causal-boost.ts` performs concept routing on the query and walks 1-hop causal edges from resolved concept nodes. Unlike the standard causal boost (which amplifies existing results), this injection runs unconditionally — it does not require seed results from prior pipeline stages. The injected graph context is merged into the result set with provenance markers indicating its graph origin.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/causal-boost.ts` | Lib | `injectGraphContext()` — unconditional concept routing and 1-hop causal walk |

### Tests

| File | Focus |
|------|-------|
| — | — |

---

## 4. SOURCE METADATA

- Group: Retrieval enhancements
- Source feature title: Always-on graph context injection
- Graduated via: 009-graph-retrieval-improvements
- Kill switch: SPECKIT_GRAPH_CONTEXT_INJECTION=false
