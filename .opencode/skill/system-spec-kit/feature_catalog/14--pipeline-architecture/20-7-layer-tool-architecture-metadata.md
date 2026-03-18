---
title: "7-layer tool architecture metadata"
description: "The 7-layer tool architecture defines token budgets, priorities and use-case guidance for each MCP tool layer (L1-L7) as governance metadata."
---

# 7-layer tool architecture metadata

## 1. OVERVIEW

The 7-layer tool architecture defines token budgets, priorities and use-case guidance for each MCP tool layer (L1-L7) as governance metadata.

The system has many different tools, and each one needs to know how much response space it is allowed to use and what kind of task it is best suited for. This feature organizes all tools into seven layers with budgets and guidance, like assigning departments in a company. It does not control how tools are called at runtime but helps recommend the right tool for the job.

---

## 2. CURRENT REALITY

The layer definitions module (`lib/architecture/layer-definitions.ts`) defines a 7-layer MCP architecture (L1 through L7) where each layer has token budgets, priorities, use-case guidance and tool membership. Layer IDs still map to task types (`search`, `browse`, `modify`, `checkpoint`, `analyze`, `maintenance`, `default`) for recommendation/hinting.

Runtime dispatch in `context-server.ts` has a single name-based dispatch hop (`dispatchTool(name, args)`), and that hop fans into 5 dispatcher modules in `tools/index.ts` (`context`, `memory`, `causal`, `checkpoint`, `lifecycle`). The 7-layer model is therefore metadata/governance (token budgets and advisory recommendations), not a 7-layer runtime classifier/router.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/architecture/layer-definitions.ts` | Lib | 7-layer architecture metadata and budget/recommendation helpers |
| `mcp_server/context-server.ts` | Core | Runtime dispatch entrypoint and token-budget injection |
| `mcp_server/tools/index.ts` | API | Name-based dispatcher routing across tool modules |
| `mcp_server/handlers/memory-context.ts` | Handler | Surfaces recommended layers as advisory metadata |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/layer-definitions.vitest.ts` | Layer definition tests |
| `mcp_server/tests/token-budget-enforcement.vitest.ts` | Token budget enforcement |
| `mcp_server/tests/context-server.vitest.ts` | Context-server dispatch and budget-injection behavior |
| `mcp_server/tests/mcp-tool-dispatch.vitest.ts` | Tool-to-handler dispatch matrix validation |

---

## 4. SOURCE METADATA

- Group: Pipeline architecture
- Source feature title: 7-layer tool architecture metadata
- Current reality source: audit-D04 gap backfill
