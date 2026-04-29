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

## 1. OVERVIEW

`code_graph_query` is a structural read surface for outline, call, import, and blast-radius queries. Before answering, it asks the readiness helper for a bounded repair opportunity.

## 2. SURFACE

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1078-1092` calls `ensureCodeGraphReady(... allowInlineIndex:true, allowInlineFullScan:false)`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1093-1120` returns a structured unavailable envelope on readiness crashes.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:579-596` defines the public `code_graph_query` schema.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:65-70` validates required `operation` and `subject` before dispatch.

## 3. TRIGGER / AUTO-FIRE PATH

Manual tool call only. The self-heal happens inside that requested read path.

## 4. CLASS

half. Packet 013's row NEW-013-002 says code graph freshness checks are half-auto; packet 035 marks F5 `code_graph_query` as conditional with local/native pass evidence only.

## 5. CAVEATS / FALLBACK

When stale files exceed the selective threshold or Git HEAD changed, query blocks and tells the operator to run `code_graph_scan`. Use `rg` when readiness crashes or the graph is unavailable.

## 6. CROSS-REFS

- [01-ensure-code-graph-ready.md](./01-ensure-code-graph-ready.md)
- [../06--mcp-tool-surface/01-tool-registrations.md](../06--mcp-tool-surface/01-tool-registrations.md)
- [../../manual_testing_playbook/01--read-path-freshness/002-query-self-heal-stale-file.md](../../manual_testing_playbook/01--read-path-freshness/002-query-self-heal-stale-file.md)


