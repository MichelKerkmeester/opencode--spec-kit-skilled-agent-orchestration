---
title: "Query self-heal"
description: "code_graph_query invokes ensureCodeGraphReady with selective inline indexing allowed and full inline scans suppressed."
trigger_phrases:
  - "query self heal"
  - "code_graph runtime catalog"
  - "query self-heal"
importance_tier: "important"
---

# Query self-heal

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`code_graph_query` is a structural read surface for outline, call, import, and blast-radius queries. Before answering, it asks the readiness helper for a bounded repair opportunity.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Manual tool call only. The self-heal happens inside that requested read path.

### Class

half. Code graph freshness checks are half-auto; `code_graph_query` has conditional local/native pass evidence only.

### Caveats / Fallback

When stale files exceed the selective threshold or Git HEAD changed, query blocks and tells the operator to run `code_graph_scan`. Use `rg` when readiness crashes or the graph is unavailable.
<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1078-1092` | Handler | calls `ensureCodeGraphReady(... allowInlineIndex:true, allowInlineFullScan:false)` |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1093-1120` | Handler | returns a structured unavailable envelope on readiness crashes |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:579-596` | Schema | defines the public `code_graph_query` schema |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:65-70` | Tool surface | validates required `operation` and `subject` before dispatch |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Read path freshness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--read-path-freshness/02-query-self-heal.md`

Related references:

- [01-ensure-code-graph-ready.md](./01-ensure-code-graph-ready.md)
- [../06--mcp-tool-surface/01-tool-registrations.md](../06--mcp-tool-surface/01-tool-registrations.md)
- [../../manual_testing_playbook/01--read-path-freshness/002-query-self-heal-stale-file.md](../../manual_testing_playbook/01--read-path-freshness/002-query-self-heal-stale-file.md)
<!-- /ANCHOR:source-metadata -->
