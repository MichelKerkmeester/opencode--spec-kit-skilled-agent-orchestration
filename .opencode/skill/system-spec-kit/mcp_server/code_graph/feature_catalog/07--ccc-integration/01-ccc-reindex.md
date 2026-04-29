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

## 1. OVERVIEW

`ccc_reindex` is a direct bridge to the CocoIndex CLI. It does not refresh the structural code graph.

## 2. SURFACE

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-reindex.ts:27-54` locates the `ccc` binary and runs `index` or `index --full`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:86-90` dispatches the requested tool.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:729-739` defines the public schema.

## 3. TRIGGER / AUTO-FIRE PATH

Direct MCP call only. Packet 013 found session/bootstrap surfaces probe CocoIndex availability through helpers instead of invoking this tool.

## 4. CLASS

manual, copied from packet 013's reality map.

## 5. CAVEATS / FALLBACK

Requires the local `ccc` binary. Use `mcp__cocoindex_code__search` for actual semantic code search after indexing.

## 6. CROSS-REFS

- [02-ccc-feedback.md](./02-ccc-feedback.md)
- [03-ccc-status.md](./03-ccc-status.md)


