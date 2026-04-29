---
title: "Tool registrations"
description: "MCP registration and dispatch surface for code_graph, CCC, and deep-loop coverage graph tools."
trigger_phrases:
  - "tool registrations"
  - "code_graph runtime catalog"
  - "tool registrations"
importance_tier: "important"
---
# Tool registrations

## 1. OVERVIEW

The runtime exposes code graph tools through the code_graph dispatcher and deep-loop coverage graph tools through the top-level tool dispatcher.

## 2. SURFACE

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:20-31` registers `code_graph_*`, `detect_changes`, and `ccc_*` names.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:60-100` dispatches those names to handlers.
- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:79-101` includes code graph, skill graph, advisor, and coverage graph names in schema-validated dispatch.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:561-678` defines code graph and detect_changes schemas.

## 3. TRIGGER / AUTO-FIRE PATH

Manual MCP dispatch. Some coverage graph tools are called by command YAML, but the dispatcher itself only routes requested tool names.

## 4. CLASS

manual. Tool registration is availability, not automation.

## 5. CAVEATS / FALLBACK

Schema validation rejects malformed tool calls before handler execution for registered names.

## 6. CROSS-REFS

- [../01--read-path-freshness/02-query-self-heal.md](../01--read-path-freshness/02-query-self-heal.md)
- [../../manual_testing_playbook/06--mcp-tool-surface/011-tool-call-shape-validation.md](../../manual_testing_playbook/06--mcp-tool-surface/011-tool-call-shape-validation.md)


