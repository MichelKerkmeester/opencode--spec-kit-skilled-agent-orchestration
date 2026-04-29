---
title: "code_graph_context"
description: "LLM-oriented context retrieval surface that expands seeds into compact graph neighborhoods while preserving readiness and partial-output metadata."
trigger_phrases:
  - "code_graph_context"
  - "code_graph runtime catalog"
  - "code_graph_context"
importance_tier: "important"
---
# code_graph_context

## 1. OVERVIEW

`code_graph_context` returns compact structural neighborhoods for LLM use. It accepts manual, graph, and CocoIndex seeds and embeds readiness metadata in both success and blocked responses.

## 2. SURFACE

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:154-169` runs read-path readiness with selective indexing allowed and full scans suppressed.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:184-229` returns blocked payloads with required action and fallback decision.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:605-643` defines the public schema, seed formats, and blocked-read contract.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:75-76` dispatches the handler.

## 3. TRIGGER / AUTO-FIRE PATH

Manual tool call only. Packet 013 classifies `code_graph_context` auto-fire as half because readiness work happens only after requested dispatch.

## 4. CLASS

half. The tool self-checks readiness on invocation; no ambient hook calls it automatically.

## 5. CAVEATS / FALLBACK

Blocked responses omit graph answers. Follow `requiredAction:"code_graph_scan"` or use semantic search plus `rg`.

## 6. CROSS-REFS

- [02-context-handler.md](./02-context-handler.md)
- [../01--read-path-freshness/01-ensure-code-graph-ready.md](../01--read-path-freshness/01-ensure-code-graph-ready.md)
- [../../manual_testing_playbook/04--context-retrieval/008-code-graph-context-readiness-block.md](../../manual_testing_playbook/04--context-retrieval/008-code-graph-context-readiness-block.md)


