---
title: "ccc_feedback"
description: "Manual CocoIndex bridge tool that appends search feedback JSONL for future analysis."
trigger_phrases:
  - "ccc_feedback"
  - "code_graph runtime catalog"
  - "ccc_feedback"
importance_tier: "important"
---
# ccc_feedback

## 1. OVERVIEW

`ccc_feedback` records operator feedback for CocoIndex search results.

## 2. SURFACE

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-feedback.ts:29-60` validates query/rating, creates the feedback directory, and appends JSONL.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:91-96` validates required fields before dispatch.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741-753` defines the public schema.

## 3. TRIGGER / AUTO-FIRE PATH

Direct MCP call only. No hook, CI, session bootstrap, or memory command path invokes feedback automatically.

## 4. CLASS

manual, copied from the current reality map.

## 5. CAVEATS / FALLBACK

Feedback writes under `.opencode/skill/mcp-coco-index/feedback/search-feedback.jsonl`. It does not alter ranking immediately.

## 6. CROSS-REFS

- [01-ccc-reindex.md](./01-ccc-reindex.md)
- [03-ccc-status.md](./03-ccc-status.md)

