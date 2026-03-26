---
title: "Causal chain tracing (memory_drift_why)"
description: "Covers the graph traversal tool that traces causal relationship chains to explain why decisions were made."
---

# Causal chain tracing (memory_drift_why)

## 1. OVERVIEW

Covers the graph traversal tool that traces causal relationship chains to explain why decisions were made.

This answers the question "why was this decision made?" by following the chain of connections backward through related memories. It is like tracing a family tree to understand how you got from a problem to a solution. If two memories in the chain contradict each other, the system flags the conflict so you can resolve it.

---

## 2. CURRENT REALITY

"Why was this decision made?" This tool answers that question by tracing the causal relationship chain for a given memory through depth-limited graph traversal.

You choose the traversal direction: outgoing (what did this memory cause or enable?), incoming (what caused or enabled this memory?) or both. Maximum depth is configurable from 1 to 10, defaulting to 3. Cycle detection via a visited set prevents infinite traversal through circular relationships.

Results are grouped by relationship type: causedBy, enabledBy, supersedes, contradicts, derivedFrom and supports. Each edge carries a relation-weighted strength value. Supersedes edges receive a 1.5x weight boost (because replacement is a strong signal). Caused edges receive 1.3x. Enabled edges receive 1.1x. Supports and derived_from edges pass through at 1.0x. Contradicts edges receive 0.8x dampening because contradictions weaken rather than strengthen the chain.

You can filter to specific relationship types after traversal. Pass `relations: ["caused", "supersedes"]` to see only the replacement and causation chains. The response includes a `maxDepthReached` flag that warns when the depth limit may have truncated results. If you see that flag, consider increasing `maxDepth` for a more complete picture.

When contradictions are found, the response includes warning hints. Two memories that contradict each other in the same causal chain is a signal that something needs resolution.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/handlers/causal-graph.ts` | MCP handler for `memory_drift_why`: depth-limited traversal, direction, cycle detection, relation weighting |
| `mcp_server/lib/storage/causal-edges.ts` | Causal edge storage: traversal queries for incoming/outgoing edges |
| `mcp_server/lib/graph/graph-signals.ts` | Graph momentum and depth signals |
| `mcp_server/lib/search/causal-boost.ts` | Causal boost scoring for edge-connected results |
| `mcp_server/lib/response/envelope.ts` | MCP success/error envelope helpers |
| `mcp_server/schemas/tool-input-schemas.ts` | Zod input schemas for drift_why arguments |
| `mcp_server/tool-schemas.ts` | MCP-visible JSON schema for `memory_drift_why` |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/causal-edges-unit.vitest.ts` | Causal edge unit tests |
| `mcp_server/tests/causal-edges.vitest.ts` | Causal edge storage tests |
| `mcp_server/tests/handler-causal-graph.vitest.ts` | Causal graph handler validation |
| `mcp_server/tests/integration-causal-graph.vitest.ts` | Causal graph integration |
| `mcp_server/tests/graph-signals.vitest.ts` | Graph signal computation tests |

---

## 4. MANUAL PLAYBOOK COVERAGE

| Scenario | Role |
|----------|------|
| `EX-022` | Direct manual validation for bidirectional causal-chain tracing |

---

## 5. SOURCE METADATA

- Group: Analysis
- Source feature title: Causal chain tracing (memory_drift_why)
- Current reality source: FEATURE_CATALOG.md
