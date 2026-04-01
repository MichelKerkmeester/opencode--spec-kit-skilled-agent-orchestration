# Changelog: 024/009-code-graph-storage-query

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 009-code-graph-storage-query — 2026-03-31

The Phase 008 indexer could extract structural information from source code (functions, classes, imports, call relationships), but that information vanished after each run -- there was no way to persist it or ask questions about it later. This phase adds a dedicated SQLite database (`code-graph.sqlite`) that stores all extracted symbols and relationships, and exposes three MCP tools (`code_graph_scan`, `code_graph_query`, `code_graph_status`) that let any downstream consumer build the index, run deterministic structural queries (who calls this function? what does this file import?), and monitor index health. The result is a persistent, queryable code graph that survives across sessions and supports incremental updates.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/009-code-graph-storage-query/`

---

## Architecture (3 changes)

### Separate code-graph database

**Problem:** The structural code graph -- the map of every function, class, import, and call relationship in the codebase -- had no persistent home. The Phase 008 indexer could extract all of this information, but once the process ended, everything it discovered was lost. There was no file on disk where that knowledge lived between sessions.

**Fix:** Created a dedicated `code-graph.sqlite` database file that sits alongside the existing `speckit-memory.sqlite`. The new database contains three tables: `code_files` (which files have been indexed, along with their content fingerprints and parser health), `code_nodes` (every structural symbol -- functions, classes, methods, modules -- with their fully-qualified names, types, and line ranges), and `code_edges` (directional relationships between symbols, such as "function A calls function B" or "file X imports module Y"). Seven indexes are tuned for the most common query patterns: finding all callers of a function, all functions a given function calls, and all imports a file uses. Keeping the graph in its own database means it can be completely rebuilt from source code at any time without touching or risking the separate memory storage.

---

### WAL journal mode for concurrent reads

**Problem:** SQLite's default locking behavior means that when one process is writing to the database (for example, during a long scan that indexes hundreds of files), all other processes trying to read from it are blocked. A query asking "who calls this function?" would time out or fail if a scan happened to be running at the same time.

**Fix:** Enabled WAL (Write-Ahead Logging) mode at database initialization. WAL is a SQLite journaling strategy where writes go to a separate log file, allowing readers to continue seeing a consistent snapshot of the database even while writes are in progress. This means users can query the code graph at any time, regardless of whether a scan is actively updating it.

---

### Schema versioning

**Problem:** Database schemas evolve over time -- new columns get added, table structures change, indexes are refined. Without a way to detect which version of the schema a database was created with, the system would have no way to know whether it needed to run migrations. It might silently read data from an outdated structure and produce incorrect results, or crash when expected columns were missing.

**Fix:** Added a `SCHEMA_VERSION=1` marker stored in the database. On startup, the system checks this version number and can compare it against the version the code expects. When a future release changes the schema, the system will detect the mismatch and run the appropriate migration steps automatically, rather than corrupting data or failing silently.

---

## New Features (4 changes)

### `code_graph_scan` tool -- build and refresh the index

**Problem:** Even though the Phase 008 indexer could extract structural information from source files, there was no tool to orchestrate the full indexing pipeline: discovering which files to process, running each one through the indexer, and storing the results in the database. Users had no way to build or update the code graph.

**Fix:** Created a scan handler that accepts a workspace root directory, optional file-pattern filters (such as "only TypeScript files" or "only files under src/"), and language filters. It discovers all matching source files, runs each through the Phase 008 indexer to extract symbols and relationships, and writes the results into the database using transaction-wrapped batch inserts (meaning each file is either fully indexed or not at all -- no partial states). Incremental mode is on by default: it computes a content fingerprint (hash) for each file and compares it against the stored hash, skipping any file that has not changed since the last scan. A force flag overrides this to re-index everything. After completion, it returns a structured summary reporting how many files were processed, how many symbols and relationships were found, how many files had parse errors, and how long the scan took.

---

### `code_graph_query` tool -- ask structural questions

**Problem:** Once the code graph was indexed and stored in the database, there was no interface for querying it. The data was there, but inaccessible -- users and automated tools had no way to ask questions like "what functions does this function call?" or "which files import this module?"

**Fix:** Created a query handler supporting five deterministic operations. `outline` lists all symbols in a given file, sorted by their position in the source code. `calls_from` answers "what functions does this function call?" -- it follows outgoing call edges from a given symbol. `calls_to` answers the reverse: "what functions call this function?" -- it follows incoming call edges. `imports_from` answers "what does this file import?" and `imports_to` answers "what files import this module?" For identifying the target of a query, the handler uses a fallback chain: it first tries `symbolId` (the most precise identifier), then `fqName` (the fully-qualified name, which is portable across re-scans), then `filePath` (the broadest match). This means queries work regardless of how the user identifies what they are looking for. An `includeTransitive` flag enables multi-hop traversal using breadth-first search (BFS) -- for example, finding not just the direct callers of a function but also the callers of those callers, up to a configurable depth. BFS was chosen over depth-first search because it guarantees bounded exploration and predictable result ordering, and avoids stack overflow on cyclic call graphs.

---

### `code_graph_status` tool -- monitor index health

**Problem:** There was no way to check whether the code graph index was current, complete, or healthy. Users could not tell if files had been added or changed since the last scan, how many symbols were indexed, or whether any files had failed to parse.

**Fix:** Created a status handler that aggregates health metrics from the database and returns them in a single report. It includes: total files in the workspace versus how many have been indexed, how many are stale (changed since last scan), counts of nodes and edges broken down by type (functions, classes, call relationships, import relationships), the timestamp of the last scan, a parser health summary (how many files parsed successfully versus with errors), and the database file size on disk. This lets users and automated workflows quickly determine whether the index needs refreshing and identify any problem areas.

---

### Orphaned node cleanup

**Problem:** When a file changes and is re-scanned, the previous version's symbols and relationships might no longer exist in the updated source. For example, if a function is renamed or deleted, the old symbol would remain in the database as a "ghost" entry, producing phantom results in queries -- you would see a function listed as a caller even though that function no longer exists in the code.

**Fix:** Added a `cleanupOrphans()` function that runs automatically during re-scans. Before inserting the fresh symbols and relationships for a changed file, it removes all existing nodes and edges associated with that file's previous scan. This ensures the graph always reflects the current state of the source code, with no stale entries lingering from earlier versions.

---

## Bug Fixes (2 changes)

### Atomic per-file updates

**Problem:** Without transaction wrapping, a crash or error partway through indexing a file could leave the database in a half-updated state. Some of the file's symbols might be written while others were not, and relationship edges might reference symbols that were never stored. This would produce incomplete or inconsistent query results.

**Fix:** Wrapped all per-file insert and update operations in SQLite transactions. A transaction is an all-or-nothing guarantee: either every piece of data for a file (its file record, all its symbols, and all its relationships) is written successfully, or none of it is. If anything fails mid-write, the entire batch for that file is rolled back and the database remains in its previous consistent state.

---

### Delete cascade for removed files

**Problem:** When a file was removed from the index (for example, because it was deleted from the codebase or excluded by a filter change), only the file's record in the `code_files` table was deleted. Its associated symbols in `code_nodes` and relationships in `code_edges` remained behind as orphans, producing phantom results -- queries would return symbols from files that no longer existed.

**Fix:** Added `ON DELETE CASCADE` constraints from the `code_files` table to `code_nodes`. This is a database-level rule that says: whenever a file record is deleted, automatically delete all symbols that belong to that file. Since edges reference symbols, this cascading deletion ensures the entire chain -- file, symbols, and relationships -- is cleaned up atomically when a file is removed.

---

<details>
<summary>Files Changed (7 files)</summary>

| File | What changed |
|------|-------------|
| `lib/code-graph/code-graph-db.ts` | New SQLite database module: schema initialization, table creation, directional indexes, batch insert, transaction wrapping, WAL mode, orphan cleanup, schema versioning |
| `handlers/code-graph/scan.ts` | New scan handler: file discovery, Phase 008 indexer invocation, incremental mode via content-hash comparison, scan summary reporting |
| `handlers/code-graph/query.ts` | New query handler: five structural operations (outline, calls_from, calls_to, imports_from, imports_to), subject resolution fallback chain, BFS transitive traversal |
| `handlers/code-graph/status.ts` | New status handler: file/node/edge count aggregation, parser health summary, last scan timestamp, database file size |
| `handlers/code-graph/index.ts` | New barrel export for all code-graph handlers |
| `tool-schemas.ts` | Added strict JSON schemas for code_graph_scan, code_graph_query, and code_graph_status tools |
| `context-server.ts` | Registered three new tool handlers and initialized code-graph database on server startup |

</details>

## Upgrade

No migration required.
