---
title: "CocoIndex bridge and code_graph_context"
description: "CocoIndex bridge resolves semantic search results to code graph nodes and expands into LLM-oriented neighborhoods."
---

# CocoIndex bridge and code_graph_context

## 1. OVERVIEW

CocoIndex bridge resolves semantic search results to code graph nodes and expands into LLM-oriented neighborhoods.

Seed resolver normalizes CocoIndex file:line results to ArtifactRef via resolution chain: exact symbol, enclosing symbol, file anchor. code_graph_context expands resolved anchors in 3 modes: neighborhood (1-hop), outline (file symbols), impact (reverse callers). Budget-aware truncation.

---

## 2. CURRENT REALITY

mcp_server/lib/code-graph/seed-resolver.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `Lib` | CocoIndex to graph node resolution | mcp_server/lib/code-graph/code-graph-context.ts |
| `Lib` | Graph neighborhood expansion | mcp_server/tests/code-graph-indexer.vitest.ts |

### Tests

| File | Focus |
|------|-------|
| `Indexer type tests` | phase 010 |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: CocoIndex bridge and code_graph_context
- Current reality source: spec 024-compact-code-graph 
