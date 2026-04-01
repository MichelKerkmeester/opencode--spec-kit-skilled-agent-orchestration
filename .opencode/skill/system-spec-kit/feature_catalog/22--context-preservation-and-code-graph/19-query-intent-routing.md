---
title: "Query-intent routing"
description: "Automatic backend selection in memory_context that routes queries to code graph, CocoIndex, or both based on the query-intent classifier output."
---

# Query-intent routing

## 1. OVERVIEW

Automatic backend selection in memory_context that routes queries to code graph, CocoIndex, or both based on the query-intent classifier output.

When memory_context receives a query, the query-intent classifier scores it against structural and semantic keyword dictionaries. Structural queries (e.g., "what calls functionX", "show imports") are routed to the code graph for symbol-level results. Semantic queries (e.g., "find examples of error handling") are routed to CocoIndex for vector-similarity results. Hybrid queries trigger both backends and merge the results. The routing is transparent to the caller; memory_context auto-selects the backend without requiring explicit mode parameters.

---

## 2. CURRENT REALITY

mcp_server/handlers/memory-context.ts (integration point)

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-context.ts` | Handler | Integration: classifies intent and routes to backend |
| `mcp_server/lib/code-graph/query-intent-classifier.ts` | Lib | Classification engine (structural/semantic/hybrid) |
| `mcp_server/handlers/code-graph/` | Handler | Structural backend (code graph query) |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Query-intent routing
- Current reality source: spec 024-compact-code-graph phase 020
