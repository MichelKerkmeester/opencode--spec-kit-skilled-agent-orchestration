# Iteration 002 — A2: Code-graph SQLite contention

## Focus
Audited the code-graph SQLite read/write paths in `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/` and `lib/`, with emphasis on concurrent scans, inline read-path reindexing, transaction boundaries, and snapshot consistency.

## Actions Taken
- Enumerated code-graph handler/lib files with `rg --files`.
- Searched handlers and lib for SQLite primitives: `BEGIN`, `COMMIT`, `ROLLBACK`, `SAVEPOINT`, `IMMEDIATE`, `transaction`, `pragma`, `busy`, `prepare`, `INSERT`, `DELETE`, `UPDATE`, `SELECT`, `getDb`.
- Read DB initialization and storage helpers in `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts`.
- Read scan and inline readiness paths in `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts`.
- Read query/context read paths in `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts`.
- Checked the indexer phase boundary in `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts` to separate parse/finalize from persistence.

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-002-A2-01 | P1 | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:271` | `persistIndexedFileResult()` persists one parsed file through four independent write phases: staging `upsertFile(... fileMtimeMs: 0)`, `replaceNodes()`, `replaceEdges()`, then final `upsertFile()`. The lower helpers use their own transaction boundaries for nodes and edges (`code-graph-db.ts:366`, `code-graph-db.ts:400`), while both file upserts are standalone writes (`code-graph-db.ts:338`, `code-graph-db.ts:348`). A concurrent reader or second scanner can observe a half-refreshed file: metadata marked stale with new nodes but old/no edges, or nodes replaced before edges are consistent. | Make per-file persistence one atomic write unit. Use a single explicit write transaction around stage-file, replace nodes, replace edges, and finalize-file, ideally `BEGIN IMMEDIATE` for writer reservation. If nested helper transactions must remain, convert inner operations to transaction-aware helpers or SAVEPOINTs under an outer scan transaction. |
| F-002-A2-02 | P1 | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:159` | The SQLite connection enables WAL and foreign keys, but there is no visible contention policy: no `busy_timeout`, no retry/backoff around `SQLITE_BUSY`, and no explicit `BEGIN IMMEDIATE`/writer lock before multi-statement writes. The write helpers use `d.transaction()` for only node and edge replacement (`code-graph-db.ts:366`, `code-graph-db.ts:400`); metadata updates, file upserts, cleanup, and scan-level writes are independent statements. Under two MCP/CLI processes sharing `code-graph.sqlite`, write-write conflicts can fail instead of queueing predictably. | Add a DB-level busy timeout and a small `SQLITE_BUSY` retry wrapper for scan/write entry points. Reserve the writer early for scan persistence with `BEGIN IMMEDIATE`, or serialize code-graph scan/reindex calls with a process/file lock before touching SQLite. |
| F-002-A2-03 | P2 | `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1089` | Read paths run readiness first, then execute several independent SELECT statements without a read transaction. For example, `handleCodeGraphQuery()` calls `ensureCodeGraphReady()` before querying (`query.ts:1089`), then relationship queries fetch edges and target/source nodes as separate statements (`code-graph-db.ts:593`, `code-graph-db.ts:596`, `code-graph-db.ts:616`, `code-graph-db.ts:619`). In WAL mode that avoids a long-running stale read transaction, but it also means one logical query is not pinned to a consistent snapshot if another process persists scan results between statements. | Wrap each logical graph query in a short read transaction after readiness succeeds, or introduce a completed-scan generation marker and only read rows from the latest complete generation. Keep the read transaction short; the goal is a consistent snapshot, not long-lived locking. |

## Questions Answered
- Transactions are too small for persistence correctness: `replaceNodes()` and `replaceEdges()` are transactional individually, but `persistIndexedFileResult()` is not atomic as a whole.
- Write-write conflicts are not explicitly handled. The code uses WAL, but I found no explicit `BEGIN IMMEDIATE`, SAVEPOINT-based outer write, busy timeout, retry, or scan serialization in the audited code path.
- I did not find evidence of a long-running read transaction serving a stale WAL snapshot. The opposite risk is present: multi-statement reads can observe mixed snapshots because they do not hold one transaction.

## Questions Remaining
- Whether the deployed MCP topology guarantees a single Node process for all code-graph access. If yes, contention impact drops, though cross-process CLI tooling can still matter.
- Whether better-sqlite3's default transaction mode is acceptable here or should be made explicit for auditability.
- Whether scan persistence should be atomic per file, per scan generation, or via staging tables plus generation swap.

## Next Focus
Follow-on work should inspect the runtime surfaces that can touch `code-graph.sqlite` from separate processes, especially MCP server lifecycle, CLI wrappers, and any generated `dist/` entrypoints used in production.
