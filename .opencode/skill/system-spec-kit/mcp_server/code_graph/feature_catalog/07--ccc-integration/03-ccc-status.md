---
title: "ccc_status"
description: "Manual CocoIndex bridge status probe reporting binary availability, index presence, and recommendation text."
trigger_phrases:
  - "ccc_status"
  - "code_graph runtime catalog"
  - "ccc_status"
importance_tier: "important"
---
# ccc_status

## 1. OVERVIEW

`ccc_status` reports CocoIndex bridge availability and recommends the next operator action.

## 2. SURFACE

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-status.ts:22-58` reports binary path, index presence, readiness-not-applicable fields, and recommendation.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:86-88` dispatches the requested tool.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:723-727` defines the public schema.

## 3. TRIGGER / AUTO-FIRE PATH

Direct MCP call only. Session/bootstrap surfaces probe availability directly, not through this MCP tool.

## 4. CLASS

manual, copied from the current reality map.

## 5. CAVEATS / FALLBACK

Availability does not prove search quality. Pair with an actual CocoIndex search or reindex run.

## 6. CROSS-REFS

- [01-ccc-reindex.md](./01-ccc-reindex.md)
- [../../manual_testing_playbook/07--ccc-integration/014-ccc-status-availability-probe.md](../../manual_testing_playbook/07--ccc-integration/014-ccc-status-availability-probe.md)

