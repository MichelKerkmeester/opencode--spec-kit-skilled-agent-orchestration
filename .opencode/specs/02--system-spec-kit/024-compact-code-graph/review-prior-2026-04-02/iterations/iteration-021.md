# Iteration 021: D1 Correctness Re-verification

## Focus

Fresh correctness deep dive on `code-graph-db.ts`, specifically its SQLite schema setup, schema/version handling, WAL configuration, transaction safety, prepared-statement usage, and shutdown lifecycle.

## Prior Finding Status

### [P1] F007 - stale inbound edges still survive normal incremental rescans until orphan cleanup runs - CONFIRMED

- `code_edges` still stores plain `source_id` / `target_id` text columns with no foreign-key constraint back to `code_nodes(symbol_id)`, so SQLite itself still does not delete dependent edges when symbol IDs churn.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:50-57]
- `replaceEdges(...)` still deletes only edges whose `source_id` belongs to the current file, which leaves inbound edges from other files untouched until an explicit orphan sweep happens.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:150-169]
- The normal scan path still calls `upsertFile(...)`, `replaceNodes(...)`, and `replaceEdges(...)` per file without invoking `cleanupOrphans()` afterward, so the database layer still depends on a cleanup pass that the steady-state incremental path never runs.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:47-64][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:283-297]

## New Findings

### [P1] F023 - `initDb()` has no real schema-version or migration guard, and a setup failure leaves a poisoned singleton cached for the rest of the process

- `SCHEMA_VERSION` is only a module constant, and `initDb()` never reads or writes `PRAGMA user_version`, never stores a schema version in a metadata table, and never branches on an on-disk version before running setup.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:12-16][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:71-79]
- The setup path caches the connection in the module-global `db` before WAL mode, foreign-key enforcement, or schema creation succeed. If `pragma(...)` or `exec(SCHEMA_SQL)` throws, there is no rollback path that clears `db` back to `null`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:71-79]
- `getStats()` reports `schemaVersion: SCHEMA_VERSION` unconditionally, so callers can only see the hard-coded constant rather than the real on-disk schema state.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:241-279]
- The existing “schema versioning detection” coverage never validates persisted version state or migration branching; it only checks that `getStats().schemaVersion === SCHEMA_VERSION` on a newly created database.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:893-899]
- Repro on the built DB module showed the live failure mode: seeding `code-graph.sqlite` with corrupt bytes made the first `initDb(tempDir)` throw `file is not a database`, but a second `initDb(tempDir)` returned the already cached handle and `getStats()` still failed with the same SQLite error. That means one failed open/setup can wedge the process into a permanently poisoned DB state until `closeDb()` or process restart.
- Impact: migrations are not handled safely today. There is no version check for old/new schemas, no migration transaction, and no rollback for partial setup failures, so a corrupt or incompatible DB can survive as a broken singleton instead of cleanly re-initializing or surfacing a controlled migration error.

### [P1] F024 - per-file graph refresh is not atomic, so a constraint error can erase a file's existing nodes or edges

- `replaceNodes(...)` deletes all nodes for a file before it opens the insert transaction. If any later `insert.run(...)` fails, the old node set has already been committed outside the transaction boundary.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:127-147]
- `replaceEdges(...)` has the same split write pattern: it deletes the current file's outgoing edges before opening the insert transaction, so an insertion failure can permanently strip the file's outgoing graph edges.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:150-169]
- The schema makes `code_nodes.symbol_id` globally unique, so duplicate-symbol collisions are real runtime constraint failures rather than hypothetical parser errors.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:32-48]
- Repro on the built DB module confirmed the data-loss shape: after indexing `/tmp/b.ts` with symbol `b::old`, calling `replaceNodes(fileB, [{ symbolId: 'shared::sym', ... }])` where `shared::sym` already belonged to another file threw `UNIQUE constraint failed: code_nodes.symbol_id`, and `queryOutline('/tmp/b.ts')` changed from `["b::old"]` to `[]`.
- Impact: the database layer does not provide transaction-safe “replace file graph” semantics. Any parser bug, symbol collision, or insert-time constraint violation can leave the indexed file with its prior graph data deleted but no replacement rows committed.

## Verified Healthy / Narrowed Non-Findings

- WAL mode is still explicitly enabled during initialization, and foreign-key enforcement is still enabled for the `code_nodes.file_id -> code_files.id` relationship.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:71-79]
- Variable user-controlled values still flow through prepared statements rather than string interpolation. The only dynamic SQL string construction in this module is placeholder-list generation for `IN (?, ?, ...)`, while the values themselves are still bound via `.run(...ids)` / `.all(...params)`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:109-123][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:153-165][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:205-237]
- `closeDb()` exists and tests use it, but the production server shutdown path still closes only `vectorIndex` and never calls the code-graph `closeDb()`. I did not escalate that to a separate finding in this pass because process exit will still release the handle, but there is currently no explicit graceful shutdown path for the code-graph SQLite connection.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:88-94][SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:689-707]

## Summary

- `F007`: **CONFIRMED**
- New correctness findings: **`F023` [P1]**, **`F024` [P1]**
- New findings delta: `+0 P0`, `+2 P1`, `+0 P2`
- Recommended next focus: add real schema-version tracking plus setup rollback to `initDb()`, and wrap each file's `upsertFile(...)` / `replaceNodes(...)` / `replaceEdges(...)` refresh inside a single transaction so failed inserts cannot erase the previous graph.
