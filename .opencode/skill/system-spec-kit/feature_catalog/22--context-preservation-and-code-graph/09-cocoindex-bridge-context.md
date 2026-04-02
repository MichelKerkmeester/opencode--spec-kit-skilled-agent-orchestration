---
title: "CocoIndex bridge and code_graph_context"
description: "CocoIndex bridge resolves semantic search results to code graph nodes and expands into LLM-oriented neighborhoods."
---

# CocoIndex bridge and code_graph_context

## 1. OVERVIEW

CocoIndex bridge resolves semantic search results to code graph nodes and expands into LLM-oriented neighborhoods.

Seed resolver normalizes CocoIndex file:line results to ArtifactRef via resolution chain: exact symbol, near-exact symbol, enclosing symbol, file anchor. `code_graph_context` expands resolved anchors in 3 modes: neighborhood (1-hop), outline (file symbols), and impact (reverse callers plus reverse imports). Budget-aware truncation.

---

## 2. CURRENT REALITY

mcp_server/lib/code-graph/seed-resolver.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/code-graph/seed-resolver.ts` | Lib | Resolves CocoIndex file-range hits to graph anchors or file-level fallbacks |
| `mcp_server/lib/code-graph/code-graph-context.ts` | Lib | Expands resolved seeds into budget-aware structural neighborhoods |
| `mcp_server/handlers/code-graph/context.ts` | Handler | Exposes `code_graph_context` over MCP |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/code-graph-seed-resolver.vitest.ts` | Seed resolution across exact-symbol, enclosing-symbol, and file-anchor fallbacks |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: CocoIndex bridge and code_graph_context
- Current reality source: spec 024-compact-code-graph phases 010 and 020
