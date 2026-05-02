---
title: "Code Graph Tools: MCP Dispatch"
description: "Dispatch table and exports for code graph MCP tool handlers."
trigger_phrases:
  - "code graph tools"
  - "code graph MCP dispatch"
---

# Code Graph Tools: MCP Dispatch

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. KEY FILES](#2--key-files)
- [3. USAGE NOTES](#3--usage-notes)
- [4. RELATED RESOURCES](#4--related-resources)

## 1. OVERVIEW

`code_graph/tools/` owns the MCP tool dispatch surface for code graph operations. It maps incoming tool names to handler functions and keeps the public export small.

Current state:

- Dispatches `code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`, `code_graph_verify`, `detect_changes`, and `ccc_*` tools.
- Validates required string arguments before calling handlers that need them.
- Converts handler text payloads into the shared `MCPResponse` shape.

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `code-graph-tools.ts` | Defines handled tool names, argument checks, handler dispatch, and MCP response conversion. |
| `index.ts` | Re-exports the tool dispatch module for parent imports. |

## 3. USAGE NOTES

- Add a new tool name to `TOOL_NAMES` and the `handleTool()` switch in the same change.
- Keep validation local when a missing argument can be detected before handler execution.
- Handler implementations belong in `../handlers/`, not in this dispatch folder.

## 4. RELATED RESOURCES

- [`../handlers/`](../handlers/)
- [`../../tools/types.ts`](../../tools/types.ts)
