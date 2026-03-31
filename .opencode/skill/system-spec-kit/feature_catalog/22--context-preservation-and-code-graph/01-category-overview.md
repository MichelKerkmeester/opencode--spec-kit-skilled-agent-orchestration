---
title: "Context preservation and code graph"
description: "Category covering Claude Code hooks (PreCompact, SessionStart, Stop), structural code graph (indexer, SQLite, MCP tools), CocoIndex bridge, and compaction working-set integration."
---

# Context preservation and code graph

## 1. OVERVIEW

Category covering Claude Code hooks (PreCompact, SessionStart, Stop), structural code graph (indexer, SQLite, MCP tools), CocoIndex bridge, and compaction working-set integration.

This category documents the hybrid context injection system that preserves critical knowledge across context compaction events. It combines three complementary systems: hook-based lifecycle automation (Claude Code), structural code analysis (code graph), and semantic search (CocoIndex) — all merging under a 4000-token budget for compaction injection.

---

## 2. CURRENT REALITY

Implemented in spec 024-compact-code-graph phases 001-011. All hook scripts, code graph modules, MCP tools, and budget allocator are deployed.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/hooks/claude/` | Hook | 6 Claude Code lifecycle hook scripts |
| `mcp_server/lib/code-graph/` | Lib | 10 code graph library modules |
| `mcp_server/handlers/code-graph/` | Handler | 4 MCP tool handlers |
| `mcp_server/tools/code-graph-tools.ts` | Dispatch | Tool dispatch for code graph tools |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Context preservation and code graph
- Current reality source: spec 024-compact-code-graph
