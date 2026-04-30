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

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`deep_loop_graph_status` reports deep-loop graph health for a session namespace. It is useful for dashboards and synthesis checks.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Direct MCP call only; there is no command YAML auto-fire for status.

### Class

manual, copied from the current reality map.

### Caveats / Fallback

Empty graphs return zero counts and null signals. Use upsert-enabled deep loops to populate graphEvents first.
<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:33-89` | Handler | validates input and returns scoped stats, signals, and momentum |
| `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:33-49` | Tool surface | registers and dispatches the tool |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:869-880` | Schema | defines the public schema |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/05--coverage-graph/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Coverage graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--coverage-graph/02-deep-loop-graph-status.md`

Related references:

- [01-deep-loop-graph-query.md](./01-deep-loop-graph-query.md)
- [04-deep-loop-graph-convergence.md](./04-deep-loop-graph-convergence.md)
<!-- /ANCHOR:source-metadata -->
