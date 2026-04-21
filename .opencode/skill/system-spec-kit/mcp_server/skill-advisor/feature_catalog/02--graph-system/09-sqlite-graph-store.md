---
title: "SQLite graph store"
description: "Describes the live SQLite-backed skill graph store, advisor fallback path, and MCP query surface."
---

# SQLite graph store

## 1. OVERVIEW

Describes the live SQLite-backed skill graph store, advisor fallback path, and MCP query surface.

The graph no longer lives only in a compiled JSON snapshot. The runtime keeps a dedicated SQLite database that can answer structural graph questions directly while preserving the JSON export path for compatibility.

---

## 2. CURRENT REALITY

The live graph store is `skill-graph.sqlite` under `.opencode/skill/system-spec-kit/mcp_server/database/`. `skill_advisor.py` reads that database first, reconstructs the compiled-equivalent adjacency data it needs for routing, and only falls back to `scripts/skill-graph.json` when SQLite is unavailable. The shared MCP server exposes the same store through four tools: `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, and `skill_graph_validate`.

This split keeps current runtime queries on the SQLite path while leaving `skill-graph.json` available for export, CI, and compatibility fallback.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `skill_advisor.py` | Runtime | Loads `skill-graph.sqlite` first, rebuilds the in-memory graph view from SQLite rows, and falls back to JSON if needed. |
| `skill-graph-db.ts` | Storage | Defines the dedicated SQLite schema, database filename, node and edge tables, and metadata bookkeeping for the live skill graph. |
| `query.ts` | MCP handler | Exposes structural relationship traversals over the SQLite-backed graph. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tool-schemas.ts` | Tool contract | Registers `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, and `skill_graph_validate` for all runtimes. |
| `status.ts` | Diagnostics | Reports live node and edge counts, schema coverage, and source-file staleness from the SQLite store. |
| `validate.ts` | Validation | Checks the live graph for schema drift, broken edges, weight warnings, and dependency cycles. |
| `skill-graph.json` | Export and fallback artifact | Remains available for export, CI, and JSON fallback when SQLite is unavailable. |

---

## 4. SOURCE METADATA

- Group: Graph system
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--graph-system/09-sqlite-graph-store.md`
