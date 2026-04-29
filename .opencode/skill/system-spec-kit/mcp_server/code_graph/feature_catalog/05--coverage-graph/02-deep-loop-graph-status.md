---
title: "deep_loop_graph_status"
description: "Manual coverage-graph status tool for session-scoped node/edge counts, relation breakdowns, signals, and momentum."
trigger_phrases:
  - "deep_loop_graph_status"
  - "code_graph runtime catalog"
  - "deep_loop_graph_status"
importance_tier: "important"
---
# deep_loop_graph_status

## 1. OVERVIEW

`deep_loop_graph_status` reports deep-loop graph health for a session namespace. It is useful for dashboards and synthesis checks.

## 2. SURFACE

- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:33-89` validates input and returns scoped stats, signals, and momentum.
- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:33-49` registers and dispatches the tool.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:869-880` defines the public schema.

## 3. TRIGGER / AUTO-FIRE PATH

Direct MCP call only; there is no command YAML auto-fire for status.

## 4. CLASS

manual, copied from the current reality map.

## 5. CAVEATS / FALLBACK

Empty graphs return zero counts and null signals. Use upsert-enabled deep loops to populate graphEvents first.

## 6. CROSS-REFS

- [01-deep-loop-graph-query.md](./01-deep-loop-graph-query.md)
- [04-deep-loop-graph-convergence.md](./04-deep-loop-graph-convergence.md)

