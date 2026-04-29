---
title: "deep_loop_graph_query"
description: "Manual coverage-graph read tool for uncovered questions, unverified claims, contradictions, provenance chains, coverage gaps, and hot nodes."
trigger_phrases:
  - "deep_loop_graph_query"
  - "code_graph runtime catalog"
  - "deep_loop_graph_query"
importance_tier: "important"
---
# deep_loop_graph_query

## 1. OVERVIEW

`deep_loop_graph_query` is the read side of the deep-loop coverage graph. It inspects research/review graph state but does not run from command YAML automatically.

## 2. SURFACE

- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:42-120` validates namespace fields and routes query types.
- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:33-49` registers and dispatches the tool.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:851-866` defines the public schema.

## 3. TRIGGER / AUTO-FIRE PATH

Direct MCP call only. There is no YAML, bootstrap, watcher, or after-tool auto-fire path.

## 4. CLASS

manual, copied from the current reality map.

## 5. CAVEATS / FALLBACK

Requires `specFolder`, `loopType`, and `sessionId`; reads are session-scoped.

## 6. CROSS-REFS

- [02-deep-loop-graph-status.md](./02-deep-loop-graph-status.md)
- [03-deep-loop-graph-upsert.md](./03-deep-loop-graph-upsert.md)

