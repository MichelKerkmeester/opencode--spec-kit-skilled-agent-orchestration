---
title: "Causal edge deletion (memory_causal_unlink)"
description: "Covers the causal edge deletion tool that removes relationship edges by ID with automatic cleanup on memory deletion."
---

# Causal edge deletion (memory_causal_unlink)

## 1. OVERVIEW

Covers the causal edge deletion tool that removes relationship edges by ID with automatic cleanup on memory deletion.

This removes a connection between two memories. If you delete a memory entirely, all its connections are cleaned up automatically. You only need this tool when you want to remove a specific connection while keeping both memories intact, like cutting one thread on a corkboard without taking down the pins.

---

## 2. CURRENT REALITY

Removes a single causal relationship edge by its numeric edge ID. You get edge IDs from `memory_drift_why` traversal results (a T202 enhancement that added edge IDs to the response specifically to enable this workflow).

A library-level variant, `deleteEdgesForMemory()`, removes all edges referencing a given memory ID. This variant is called automatically during memory deletion (`memory_delete`) to maintain graph integrity. You do not need to manually clean up edges when deleting a memory. The system handles it.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/handlers/causal-graph.ts` | MCP handler for `memory_causal_unlink` |
| `mcp_server/lib/storage/causal-edges.ts` | Causal edge storage: delete by edge ID, `deleteEdgesForMemory()` for cascade cleanup |
| `mcp_server/lib/graph/graph-signals.ts` | Graph momentum and depth signals |
| `mcp_server/lib/search/causal-boost.ts` | Causal boost scoring for edge-connected results |
| `mcp_server/tools/causal-tools.ts` | Dispatches `memory_causal_unlink` to the causal graph handler |
| `mcp_server/schemas/tool-input-schemas.ts` | Zod input schemas for causal unlink arguments |
| `mcp_server/tool-schemas.ts` | MCP-visible JSON schema for `memory_causal_unlink` |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/causal-edges-unit.vitest.ts` | Causal edge unit tests |
| `mcp_server/tests/causal-edges.vitest.ts` | Causal edge storage tests |
| `mcp_server/tests/graph-signals.vitest.ts` | Graph signal computation tests |
| `mcp_server/tests/causal-boost.vitest.ts` | Causal boost scoring tests |

---

## 4. MANUAL PLAYBOOK COVERAGE

| Scenario | Role |
|----------|------|
| `EX-021` | Direct manual validation for causal edge deletion and trace cleanup |

---

## 5. SOURCE METADATA

- Group: Analysis
- Source feature title: Causal edge deletion (memory_causal_unlink)
- Current reality source: FEATURE_CATALOG.md
