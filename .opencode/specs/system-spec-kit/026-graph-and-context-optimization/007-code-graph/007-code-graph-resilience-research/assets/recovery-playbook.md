# Code-Graph Recovery Playbook

## Scope

These procedures are idempotent and source-first. The code graph database is a rebuildable cache; recovery may salvage evidence, but trust is restored by a fresh source scan plus verification. [SOURCE: `research/iterations/iteration-003.md:3-10`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:50-115`]

## Procedure CG-RP-001: SQLite Corruption

**Trigger:** `code_graph_status` returns `status:"error"`, SQLite cannot open the DB, `PRAGMA integrity_check` reports corruption, or readiness maps to `trustState:"unavailable"`.

1. Stop processes that may hold the DB handle.
2. Create a timestamped recovery directory under the DB directory.
3. Copy `code-graph.sqlite`, `code-graph.sqlite-wal`, and `code-graph.sqlite-shm` into that directory before any checkpoint or mutation.
4. Run `sqlite3 -readonly "$COPY" "PRAGMA integrity_check;"` and save stdout/stderr.
5. If forensic salvage is needed, run `.recover --ignore-freelist --lost-and-found code_graph_lost_and_found --no-rowids` on the copy, import into `recovered.sqlite`, and run integrity and foreign-key checks there.
6. Quarantine the live DB triplet by moving it into a timestamped quarantine directory.
7. Recreate trust from source with `code_graph_scan` using `incremental:false`.

**Idempotence:** Every run writes to a new timestamped recovery/quarantine directory; repeated full scans rebuild the cache from source.

**Verification:** `PRAGMA integrity_check` returns `ok`, `PRAGMA foreign_key_check` returns no rows, orphan node/edge queries return zero, `code_graph_status` reports `status:"ok"` with `freshness:"fresh"` and `trustState:"live"`, and at least one gold query from `assets/code-graph-gold-queries.json` returns its expected top-K symbol. [SOURCE: `research/iterations/iteration-003.md:107-144`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-64`]

## Procedure CG-RP-002: Partial-Scan Failure

**Trigger:** A scan is interrupted, parse/persist errors are returned, `code_files.file_mtime_ms = 0` rows exist, stale files remain after auto-index, or readiness remains `stale`.

1. Confirm the DB is structurally healthy with `PRAGMA integrity_check`.
2. Query for staged files with `SELECT file_path FROM code_files WHERE file_mtime_ms = 0 LIMIT 50;`.
3. If stale existing files are <= 50, no Git HEAD drift exists, and no schema/error signal is present, re-run `code_graph_scan` with `incremental:true`.
4. If stale files exceed 50, Git HEAD changed, graph is empty/error, or selective retry repeats the same error, run `code_graph_scan` with `incremental:false`.
5. Record scan errors and do not promote readiness if the same file-level persist/parse error repeats.

**Idempotence:** The persistence path writes `file_mtime_ms = 0` before nodes/edges and only finalizes real mtime after structural rows land, so failed files remain stale and retryable. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:227-248`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:380-424`]

**Verification:** Staged `file_mtime_ms = 0` rows are absent or explained, `code_graph_status` reports `fresh`, the scan result has no repeated critical errors, and the gold battery passes the 90% overall / 80% edge-focus floors. [SOURCE: `research/iterations/iteration-006.md:40-43`; `assets/code-graph-gold-queries.json`]

## Procedure CG-RP-003: Bad-Apply Rollback

**Trigger:** A recovered DB, imported DB, or scan result was promoted but gold queries fail, row counts collapse unexpectedly, edge distributions drift beyond thresholds, or `dbFileSize` appears healthy while logical rows are missing.

1. Freeze the current bad state by moving the DB triplet into a timestamped `bad-apply-*` directory.
2. Restore the latest known-good triplet if one exists; otherwise leave the DB absent and allow initialization to recreate schema.
3. Run `PRAGMA wal_checkpoint(TRUNCATE);` after restore when SQLite opens successfully.
4. Run `code_graph_scan` with `incremental:false` to rebuild from current source.
5. Re-run the gold query battery and edge-distribution drift checks before marking the graph trusted.

**Idempotence:** Each rollback snapshot is timestamped; if no known-good copy exists, repeating the procedure simply rebuilds from source again.

**Verification:** `code_graph_status` has nonzero files/nodes/edges, `lastPersistedAt` is present, `canonicalReadiness:"ready"`, `trustState:"live"`, no orphan nodes/edges, and no critical gold-query canary missing. Do not use raw SQLite file size as proof of recovery because deleted rows may leave the DB file large. [SOURCE: `research/iterations/iteration-001.md:19-20`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:701-715`]
