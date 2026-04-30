---
title: "ccc_reindex"
description: "Manual CocoIndex bridge tool that shells out to the ccc CLI for incremental or full reindexing."
trigger_phrases:
  - "ccc_reindex"
  - "code_graph runtime catalog"
  - "ccc_reindex"
importance_tier: "important"
---

# ccc_reindex

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`ccc_reindex` is a direct bridge to the CocoIndex CLI. It does not refresh the structural code graph.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Direct MCP call only. Session/bootstrap surfaces probe CocoIndex availability through helpers instead of invoking this tool.

### Class

manual, copied from the current reality map.

### Caveats / Fallback

Requires the local `ccc` binary. Use `mcp__cocoindex_code__search` for actual semantic code search after indexing.
<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-reindex.ts:27-54` | Handler | locates the `ccc` binary and runs `index` or `index --full` |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:86-90` | Tool surface | dispatches the requested tool |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:729-739` | Schema | defines the public schema |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/07--ccc-integration/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: CCC integration
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--ccc-integration/01-ccc-reindex.md`

Related references:

- [02-ccc-feedback.md](./02-ccc-feedback.md)
- [03-ccc-status.md](./03-ccc-status.md)
<!-- /ANCHOR:source-metadata -->
