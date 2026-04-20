# Code Graph Handlers

MCP tool handlers for the structural code graph system.

Code graph handlers can enrich recovery, but they do not own packet continuity. For Spec Kit packet work, `/spec_kit:resume` remains canonical and recovery still flows through `handover.md`, then `_memory.continuity`, then the remaining spec docs.

## Handlers

| File | MCP Tool | Purpose |
|------|----------|---------|
| `scan.ts` | `code_graph_scan` | Index workspace files, build structural graph |
| `query.ts` | `code_graph_query` | Query structural relationships (outline, calls, imports) |
| `status.ts` | `code_graph_status` | Report graph health and statistics |
| `context.ts` | `code_graph_context` | LLM-oriented compact graph neighborhoods |
| `index.ts` | (barrel) | Re-exports all handlers |

## Dispatch

Registered via `tools/code-graph-tools.ts`, included in `ALL_DISPATCHERS` array in `tools/index.ts`.

## Related

- Library: `lib/code-graph/` (core implementation)
- Schemas: `tool-schemas.ts` (L8: Code Graph definitions)
