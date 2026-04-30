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

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The context handler is the boundary between external seeds and internal graph context assembly. It normalizes CocoIndex/manual/graph seeds, picks a query mode, and refuses unsafe readiness before `buildContext()`.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Only through `code_graph_context` dispatch.

### Class

half. The handler performs readiness checks after a manual/requested tool call, matching the `code_graph_context` classification.

### Caveats / Fallback

The handler can return partial output under deadline or budget pressure. Check `metadata.partialOutput` before treating a context response as complete.
<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:112-151` | Handler | matches normalized seed source metadata back onto resolved anchors |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:232-280` | Handler | normalizes query mode and seed payloads |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts` | Library | owns compact graph context assembly and token-budget behavior |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/budget-allocator.ts` | Library | owns context budget allocation |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Context retrieval
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--context-retrieval/02-context-handler.md`

Related references:

- [01-code-graph-context.md](./01-code-graph-context.md)
- [../06--mcp-tool-surface/01-tool-registrations.md](../06--mcp-tool-surface/01-tool-registrations.md)
<!-- /ANCHOR:source-metadata -->
