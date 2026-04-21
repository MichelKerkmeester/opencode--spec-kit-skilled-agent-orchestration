---
title: "Auto-indexing"
description: "Describes the startup scan, watcher, and hash-aware reindexing that keep the live SQLite skill graph current."
---

# Auto-indexing

## 1. OVERVIEW

Describes the startup scan, watcher, and hash-aware reindexing that keep the live SQLite skill graph current.

Operators no longer need to rerun the graph compiler after every metadata change just to refresh the live graph store. The MCP server keeps the SQLite graph fresh in the background.

---

## 2. CURRENT REALITY

On MCP server startup, `startupSkillGraphScan()` runs from a non-blocking `setImmediate(...)` callback and indexes the current 21 `graph-metadata.json` files into `skill-graph.sqlite`. After that, a Chokidar watcher tracks `.opencode/skill/*/graph-metadata.json`, waits for writes to settle, and applies a 2-second debounce before reindexing. The indexer computes SHA-256 content hashes and skips unchanged files, so most follow-up scans only touch files whose metadata actually changed.

This keeps the live store current without manual recompilation while still letting the JSON export snapshot be rebuilt separately when needed.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `context-server.ts` | MCP runtime | Starts the non-blocking startup scan, configures the Chokidar watcher, and schedules debounced reindex runs. |
| `skill-graph-db.ts` | Indexer | Discovers `graph-metadata.json` files, computes SHA-256 hashes, skips unchanged entries, and writes changed rows into SQLite. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scan.ts` | MCP handler | Forces a full skill-graph scan on demand and returns scanned, indexed, and skipped counts. |
| `status.ts` | Diagnostics | Verifies tracked-skill counts and detects changed or missing source files after watcher activity. |
| `graph-metadata.json` | Source metadata | Acts as the watched input surface that triggers startup scans and incremental reindexing. |

---

## 4. SOURCE METADATA

- Group: Graph system
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--graph-system/10-auto-indexing.md`
