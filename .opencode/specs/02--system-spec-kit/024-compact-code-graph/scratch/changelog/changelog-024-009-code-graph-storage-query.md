# Changelog: 024/009-code-graph-storage-query

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 009-code-graph-storage-query — 2026-03-31

This phase turned the structural index into a usable service. Graph data now has a SQLite storage layer, MCP tools for scan/query/status, and enough server wiring to answer outline, call, and import questions without forcing users back to manual grep chains.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/009-code-graph-storage-query/`

---

## New Features (4)

### SQLite storage layer

**Problem:** The structural indexer could parse files, but there was nowhere durable to store symbols and relationships across sessions.

**Fix:** Added `code-graph-db.ts` with the graph schema, writes, reads, and graph statistics needed for downstream tools.

### Scan tool

**Problem:** The graph needed a supported way to build or refresh itself from the workspace.

**Fix:** Added `code_graph_scan` so users and higher-level flows can create or refresh the structural index.

### Query tool

**Problem:** There was still no structured API for asking graph questions.

**Fix:** Added `code_graph_query` for outline, call-graph, and import/dependency questions.

### Status tool

**Problem:** Operators needed to know whether the graph was empty, fresh, or stale before trusting results.

**Fix:** Added `code_graph_status` to report graph counts and freshness metadata.

---

## Files Changed (5)

| File | What changed |
|------|-------------|
| `mcp_server/lib/code-graph/code-graph-db.ts` | Added SQLite storage, schema, and graph statistics. |
| `mcp_server/handlers/code-graph/scan.ts` | Added scan handler for refresh/build operations. |
| `mcp_server/handlers/code-graph/query.ts` | Added structural query handling. |
| `mcp_server/handlers/code-graph/status.ts` | Added graph freshness and coverage reporting. |
| `mcp_server/tools/code-graph-tools.ts` | Registered the graph MCP tools. |

---

## Upgrade

No migration required. The storage layer is still single-writer by design and replaces file-level graph data atomically.
