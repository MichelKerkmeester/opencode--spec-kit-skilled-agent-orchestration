# Changelog: 024/008-structural-indexer

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 008-structural-indexer — 2026-03-31

This phase added the structural code indexer that gives the packet its second retrieval channel. The system can now parse JS, TS, Python, and Shell source into a code graph, emit symbols and edges, and track freshness so the graph can support real structural questions instead of only semantic similarity.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/008-structural-indexer/`

---

## New Features (3)

### Core structural indexer

**Problem:** Memory and semantic search could not answer structural questions like what imports a file, what calls a function, or how a class hierarchy is wired.

**Fix:** Added `structural-indexer.ts` to extract symbols and relationships from supported source files and emit graph-ready nodes and edges.

### Tree-sitter backend with regex fallback

**Problem:** A regex-only parser would be brittle for real code shapes, but a tree-sitter path also needed a safe fallback.

**Fix:** Added a tree-sitter parser backend with regex fallback support so the indexer can prefer AST-driven parsing while keeping a portable backup path.

### Freshness-aware reindexing support

**Problem:** Even a good indexer is not useful if the graph drifts behind the workspace.

**Fix:** Added file-freshness tracking and reindex hooks so later query phases can reason about whether the graph is current.

---

## Deferred (1)

### CONFIGURES edge type

**Problem:** The phase considered adding a `CONFIGURES` edge, but automated detection was not confident enough.

**Status:** Deferred rather than shipping a noisy relationship type.

---

## Files Changed (4)

| File | What changed |
|------|-------------|
| `mcp_server/lib/code-graph/structural-indexer.ts` | Added the main symbol and edge extraction pipeline. |
| `mcp_server/lib/code-graph/tree-sitter-parser.ts` | Added AST-backed parsing for supported languages. |
| `mcp_server/lib/code-graph/indexer-types.ts` | Added symbol and edge contracts for graph extraction. |
| `mcp_server/lib/code-graph/freshness.ts` | Added file freshness and reindex support utilities. |

---

## Upgrade

No migration required. Regex fallback remains less precise than tree-sitter and is intentionally retained as a backup path.
