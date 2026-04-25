---
title: "CocoIndex bridge and code_graph_context"
description: "CocoIndex bridge resolves semantic search results to code graph nodes, preserves seed fidelity, and exposes blocked or partial context outcomes."
audited_post_018: true
---

# CocoIndex bridge and code_graph_context

## 1. OVERVIEW

CocoIndex bridge resolves semantic search results to code graph nodes and expands into LLM-oriented neighborhoods.

Seed resolver normalizes CocoIndex file:line results to `ArtifactRef` via resolution chain: exact symbol, near-exact symbol, enclosing symbol, file anchor. `code_graph_context` preserves CocoIndex seed fidelity across both `file` and `filePath` inputs so provider metadata such as `source`, `score`, `snippet`, and `range` survive into resolved anchors. When readiness requires a suppressed full scan, the handler returns an explicit blocked payload instead of degraded graph answers. Successful responses still expand resolved anchors in 3 modes: neighborhood (1-hop), outline (file symbols), and impact (reverse callers plus reverse imports), and now expose structured `metadata.partialOutput` fields for deadline or budget omissions.

---

## 2. CURRENT REALITY

mcp_server/code_graph/lib/seed-resolver.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/code_graph/lib/seed-resolver.ts` | Lib | Resolves CocoIndex file-range hits to graph anchors or file-level fallbacks |
| `mcp_server/code_graph/lib/code-graph-context.ts` | Lib | Expands resolved seeds into structural neighborhoods and reports structured partial-output metadata |
| `mcp_server/code_graph/handlers/context.ts` | Handler | Exposes `code_graph_context`, preserves CocoIndex seed fidelity, and returns blocked-read payloads when full scans are required |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/code_graph/tests/code-graph-seed-resolver.vitest.ts` | Seed resolution across exact-symbol, enclosing-symbol, and file-anchor fallbacks |
| `mcp_server/code_graph/tests/code-graph-context-handler.vitest.ts` | CocoIndex seed fidelity, blocked full-scan responses, and structured `partialOutput` metadata |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: CocoIndex bridge and code_graph_context
- Current reality source: spec 024-compact-code-graph phases 010 and 020
