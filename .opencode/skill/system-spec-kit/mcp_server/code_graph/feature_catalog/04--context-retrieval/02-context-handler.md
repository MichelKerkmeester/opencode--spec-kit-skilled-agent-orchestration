---
title: "Context handler"
description: "Handler-level context assembly that normalizes seeds, enforces deadlines, and routes blocked readiness before building graph context."
trigger_phrases:
  - "context handler"
  - "code_graph runtime catalog"
  - "context handler"
importance_tier: "important"
---
# Context handler

## 1. OVERVIEW

The context handler is the boundary between external seeds and internal graph context assembly. It normalizes CocoIndex/manual/graph seeds, picks a query mode, and refuses unsafe readiness before `buildContext()`.

## 2. SURFACE

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:112-151` matches normalized seed source metadata back onto resolved anchors.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:232-280` normalizes query mode and seed payloads.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts` owns compact graph context assembly and token-budget behavior.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/budget-allocator.ts` owns context budget allocation.

## 3. TRIGGER / AUTO-FIRE PATH

Only through `code_graph_context` dispatch.

## 4. CLASS

half. The handler performs readiness checks after a manual/requested tool call, matching the `code_graph_context` classification.

## 5. CAVEATS / FALLBACK

The handler can return partial output under deadline or budget pressure. Check `metadata.partialOutput` before treating a context response as complete.

## 6. CROSS-REFS

- [01-code-graph-context.md](./01-code-graph-context.md)
- [../06--mcp-tool-surface/01-tool-registrations.md](../06--mcp-tool-surface/01-tool-registrations.md)

