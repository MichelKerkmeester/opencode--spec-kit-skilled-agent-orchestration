# 7-layer tool architecture metadata

## Current Reality

The layer definitions module (`lib/architecture/layer-definitions.ts`) defines a 7-layer MCP architecture (L1 through L7) where each layer has a designated token budget, priority level, use case description, and list of assigned tools. Layer IDs map to task types (`search`, `browse`, `modify`, `checkpoint`, `analyze`, `maintenance`, `default`) so the system can recommend the appropriate layer for a given operation.

Each `LayerDefinition` includes: `id`, `name`, `description`, `tokenBudget`, `priority`, `useCase`, and `tools[]`. The architecture metadata is used by the context handler to enforce per-layer token budgets and by the query classifier to route requests to the correct tool subset. This provides structural governance over which tools are available at each abstraction level and how many tokens each layer can consume.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/architecture/layer-definitions.ts` | Lib | 7-layer architecture definitions and routing |
| `mcp_server/handlers/memory-context.ts` | Handler | Context handler using layer metadata |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/layer-definitions.vitest.ts` | Layer definition tests |
| `mcp_server/tests/token-budget-enforcement.vitest.ts` | Token budget enforcement |

## Source Metadata

- Group: Pipeline architecture
- Source feature title: 7-layer tool architecture metadata
- Current reality source: audit-D04 gap backfill
