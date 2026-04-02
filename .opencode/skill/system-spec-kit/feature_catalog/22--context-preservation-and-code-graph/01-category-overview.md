---
title: "Context preservation and code graph"
description: "Category covering Claude Code hooks (PreCompact, SessionStart, Stop), structural code graph (indexer, SQLite, MCP tools), CocoIndex bridge, and compaction working-set integration."
---

# Context preservation and code graph

## 1. OVERVIEW

Category covering runtime hook automation, structural code graph (indexer, SQLite, MCP tools), CocoIndex bridge, and compaction working-set integration.

This category documents the hybrid context injection system that preserves critical knowledge across context compaction events. It combines three complementary systems: hook-based lifecycle automation, structural code analysis (code graph), and semantic search (CocoIndex) — all merging under a 4000-token budget for compaction injection.

---

## 2. CURRENT REALITY

Implemented across spec 024-compact-code-graph phases 001-028. The shipped surface now includes hook scripts, code graph modules, MCP tools, budget allocator, tree-sitter parser with regex fallback, query-intent routing, auto-trigger, session health/resume/bootstrap tools, the structural ready/stale/missing contract, Gemini hooks, and startup-brief follow-ons.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/hooks/claude/` | Hook | 6 Claude Code lifecycle hook scripts |
| `mcp_server/lib/code-graph/` | Lib | 12 code graph library modules |
| `mcp_server/handlers/code-graph/` | Handler | 4 MCP tool handlers |
| `mcp_server/tools/code-graph-tools.ts` | Dispatch | Tool dispatch for code graph tools |
| `mcp_server/lib/code-graph/tree-sitter-parser.ts` | Lib | WASM-based AST parser (replaces regex) |
| `mcp_server/lib/code-graph/query-intent-classifier.ts` | Lib | Structural/semantic/hybrid query routing |
| `mcp_server/lib/code-graph/ensure-ready.ts` | Lib | Auto-trigger with git HEAD staleness detection |
| `mcp_server/handlers/session-health.ts` | Handler | Session readiness and quality score |
| `mcp_server/handlers/session-resume.ts` | Handler | Composite resume (memory + graph + CocoIndex) |
| `mcp_server/handlers/session-bootstrap.ts` | Handler | Canonical first-call bootstrap (resume + health + structural contract) |
| `mcp_server/lib/session/session-snapshot.ts` | Lib | Shared ready/stale/missing structural context contract |
| `mcp_server/hooks/gemini/` | Hook | 5 Gemini CLI lifecycle hook scripts |
| `mcp_server/lib/session/context-metrics.ts` | Lib | Session quality scoring and event tracking |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Context preservation and code graph
- Current reality source: spec 024-compact-code-graph
