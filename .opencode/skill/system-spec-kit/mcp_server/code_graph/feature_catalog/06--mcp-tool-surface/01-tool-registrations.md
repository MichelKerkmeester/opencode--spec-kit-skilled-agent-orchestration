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

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The runtime exposes code graph tools through the code_graph dispatcher and deep-loop coverage graph tools through the top-level tool dispatcher.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Manual MCP dispatch. Some coverage graph tools are called by command YAML, but the dispatcher itself only routes requested tool names.

### Class

manual. Tool registration is availability, not automation.

### Caveats / Fallback

Schema validation rejects malformed tool calls before handler execution for registered names.
<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:20-31` | Tool surface | registers `code_graph_*`, `detect_changes`, and `ccc_*` names |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:60-100` | Tool surface | dispatches those names to handlers |
| `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:79-101` | Tool surface | includes code graph, skill graph, advisor, and coverage graph names in schema-validated dispatch |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:561-678` | Schema | defines code graph and detect_changes schemas |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: MCP tool surface
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--mcp-tool-surface/01-tool-registrations.md`

Related references:

- [../01--read-path-freshness/02-query-self-heal.md](../01--read-path-freshness/02-query-self-heal.md)
- [../../manual_testing_playbook/06--mcp-tool-surface/011-tool-call-shape-validation.md](../../manual_testing_playbook/06--mcp-tool-surface/011-tool-call-shape-validation.md)
<!-- /ANCHOR:source-metadata -->
