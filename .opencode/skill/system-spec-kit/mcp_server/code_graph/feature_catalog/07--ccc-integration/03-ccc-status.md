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

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`ccc_status` reports CocoIndex bridge availability and recommends the next operator action.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Direct MCP call only. Session/bootstrap surfaces probe availability directly, not through this MCP tool.

### Class

manual, copied from the current reality map.

### Caveats / Fallback

Availability does not prove search quality. Pair with an actual CocoIndex search or reindex run.
<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-status.ts:22-58` | Handler | reports binary path, index presence, readiness-not-applicable fields, and recommendation |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:86-88` | Tool surface | dispatches the requested tool |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:723-727` | Schema | defines the public schema |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: CCC integration
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--ccc-integration/03-ccc-status.md`

Related references:

- [01-ccc-reindex.md](./01-ccc-reindex.md)
- [../../manual_testing_playbook/07--ccc-integration/014-ccc-status-availability-probe.md](../../manual_testing_playbook/07--ccc-integration/014-ccc-status-availability-probe.md)
<!-- /ANCHOR:source-metadata -->
