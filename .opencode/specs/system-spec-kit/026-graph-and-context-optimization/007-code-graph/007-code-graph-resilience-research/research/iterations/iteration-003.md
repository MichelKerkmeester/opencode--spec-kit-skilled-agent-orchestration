# Iteration 3 - SQLite Corruption Recovery Procedures

## Summary

The code-graph database is a rebuildable structural cache at `.opencode/skill/system-spec-kit/mcp_server/database/code-graph.sqlite`, with WAL sidecars when active. The schema is version 3 and contains only `code_files`, `code_nodes`, `code_edges`, `schema_version`, and `code_graph_metadata` plus ordinary B-tree indexes; there are no code-graph FTS5 or sqlite-vec virtual tables to salvage. The cleanest corruption posture is therefore quarantine-first, recover only for forensic salvage, then run a full code-graph scan from source as the authoritative rebuild path. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:37-47`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:50-115`; `.opencode/skill/system-spec-kit/mcp_server/README.md:540-546`]

On a deliberately damaged temporary copy of the local `code-graph.sqlite`, `PRAGMA integrity_check;` reported a b-tree page error, while `sqlite3 corrupt.sqlite ".recover"` emitted a SQL script starting with `.dbconfig defensive off`, `BEGIN`, `PRAGMA writable_schema = on`, database pragmas, `CREATE TABLE` statements, surviving `INSERT OR IGNORE` rows, index creation, `PRAGMA writable_schema = off`, and `COMMIT`. Importing that stream into a new database yielded `PRAGMA integrity_check; => ok`, but the source DB was empty before damage, so the recovered data rows were limited to schema metadata. [SOURCE: local temp-copy experiment using SQLite 3.51.0; `.opencode/skill/system-spec-kit/mcp_server/database/code-graph.sqlite` schema dump and integrity check]

SQLite documents `.recover` as a salvage stream (`sqlite3 corrupt.db .recover > data.sql`, then `sqlite3 recovered.db < data.sql`) and explicitly warns that recovered content can be missing, resurrect previously deleted rows, be altered, violate constraints, or be moved into a lost-and-found table. This makes `.recover` useful as an emergency extraction tool, not as a trust-restoring substitute for a full code-graph rescan. [SOURCE: https://www.sqlite.org/recovery.html; https://www.sqlite.org/cli.html]

## Recovery Procedures

1. **Corruption / unreadable `code-graph.sqlite`**

   1. Stop MCP/server processes that may hold a `better-sqlite3` handle, then resolve the DB directory without changing data:

      ```sh
      DB_DIR="${SPEC_KIT_DB_DIR:-${SPECKIT_DB_DIR:-.opencode/skill/system-spec-kit/mcp_server/database}}"
      DB="$DB_DIR/code-graph.sqlite"
      STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
      SAFE_DIR="$DB_DIR/recovery-$STAMP"
      mkdir -p "$SAFE_DIR"
      ```

   2. Copy the main DB and any WAL sidecars before attempting checkpoint or recovery. This preserves uncheckpointed frames and is idempotent because each run writes to a timestamped directory:

      ```sh
      cp -p "$DB" "$SAFE_DIR/code-graph.sqlite" 2>/dev/null || true
      cp -p "$DB-wal" "$SAFE_DIR/code-graph.sqlite-wal" 2>/dev/null || true
      cp -p "$DB-shm" "$SAFE_DIR/code-graph.sqlite-shm" 2>/dev/null || true
      sqlite3 -readonly "$SAFE_DIR/code-graph.sqlite" ".schema" > "$SAFE_DIR/schema.sql" 2>"$SAFE_DIR/schema.err" || true
      sqlite3 -readonly "$SAFE_DIR/code-graph.sqlite" "PRAGMA integrity_check;" > "$SAFE_DIR/integrity.txt" 2>"$SAFE_DIR/integrity.err" || true
      ```

   3. Run `.recover` on the copied DB, not the live file. Quote the dot-command and use documented flags: `--ignore-freelist` reduces deleted-row resurrection risk, `--lost-and-found` gives orphaned content a known table name, and `--no-rowids` avoids trusting non-primary-key rowids that the code graph does not need as durable identity.

      ```sh
      sqlite3 -readonly "$SAFE_DIR/code-graph.sqlite" \
        ".recover --ignore-freelist --lost-and-found code_graph_lost_and_found --no-rowids" \
        > "$SAFE_DIR/recovered.sql" 2>"$SAFE_DIR/recover.err"
      sqlite3 "$SAFE_DIR/recovered.sqlite" < "$SAFE_DIR/recovered.sql" 2>"$SAFE_DIR/import.err"
      sqlite3 "$SAFE_DIR/recovered.sqlite" "PRAGMA integrity_check; PRAGMA foreign_key_check;" \
        > "$SAFE_DIR/recovered-checks.txt"
      ```

   4. Prefer a source rebuild over serving the recovered DB. Quarantine the damaged triplet, let `initDb()` recreate `code-graph.sqlite`, then run a full scan (`incremental:false`) so `code_files.file_mtime_ms`, nodes, edges, metadata, and ordinary indexes are rebuilt from current source. If a recovered DB must be inspected, compare row counts and orphan queries first; do not promote it directly to trusted service state.

      ```sh
      mkdir -p "$DB_DIR/quarantine-$STAMP"
      mv "$DB" "$DB_DIR/quarantine-$STAMP/" 2>/dev/null || true
      mv "$DB-wal" "$DB_DIR/quarantine-$STAMP/" 2>/dev/null || true
      mv "$DB-shm" "$DB_DIR/quarantine-$STAMP/" 2>/dev/null || true
      # Then run MCP code_graph_scan with {"incremental": false}.
      ```

2. **Partial-scan-failure / interrupted persistence**

   1. Check whether the DB itself is healthy before reusing it:

      ```sh
      sqlite3 -readonly "$DB" "PRAGMA integrity_check;"
      sqlite3 -readonly "$DB" "SELECT file_path FROM code_files WHERE file_mtime_ms = 0 LIMIT 50;"
      ```

   2. If integrity is `ok`, re-run the smallest safe scan. The code intentionally stages `file_mtime_ms = 0` before writing nodes and edges, then finalizes the real mtime only after structural rows land, so interrupted writes remain stale and retryable. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:227-248`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:281-321`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:380-424`]

      ```sh
      # If stale count is <= 50, allow the normal selective path.
      # Run MCP code_graph_scan with {"incremental": true}.
      ```

   3. Escalate to full scan when `code_graph_status` reports `empty`/`error`, when Git HEAD changed, or when stale files exceed the existing selective threshold of 50. The scan handler already forces full reindex on Git HEAD drift and prunes missing tracked files differently for incremental vs full scans. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:47-52`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:102-187`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:174-206`]

      ```sh
      # Run MCP code_graph_scan with {"incremental": false}.
      ```

   4. Repeat the same scan command until `code_graph_status` is fresh or the same error repeats. This is idempotent because unchanged files are skipped in incremental mode and full scans replace/prune rows from the current parse result set.

3. **Bad-apply rollback / recovered DB or scan result was promoted incorrectly**

   1. Freeze the current bad state for diagnosis, including sidecars:

      ```sh
      ROLLBACK_DIR="$DB_DIR/bad-apply-$STAMP"
      mkdir -p "$ROLLBACK_DIR"
      mv "$DB" "$ROLLBACK_DIR/" 2>/dev/null || true
      mv "$DB-wal" "$ROLLBACK_DIR/" 2>/dev/null || true
      mv "$DB-shm" "$ROLLBACK_DIR/" 2>/dev/null || true
      ```

   2. Restore the latest known-good triplet if one exists, otherwise leave the DB absent and let `initDb()` create a clean schema. Avoid raw DB dump import/export as a portability mechanism; the hardening contract already marks raw DB dump export as disallowed and post-import repair as required. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ops-hardening.ts:21-43`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ops-hardening.ts:102-109`]

      ```sh
      cp -p "$SAFE_DIR/code-graph.sqlite" "$DB" 2>/dev/null || true
      cp -p "$SAFE_DIR/code-graph.sqlite-wal" "$DB-wal" 2>/dev/null || true
      cp -p "$SAFE_DIR/code-graph.sqlite-shm" "$DB-shm" 2>/dev/null || true
      ```

   3. Run a full scan after any restore or clean recreation. For this subsystem, source files are authoritative and the DB is a cache; the full scan is the rollback completion step that re-establishes row-level freshness, ordinary indexes, and metadata from source rather than from recovered SQL.

      ```sh
      sqlite3 "$DB" "PRAGMA wal_checkpoint(TRUNCATE);" 2>/dev/null || true
      # Run MCP code_graph_scan with {"incremental": false}.
      ```

## Verification Steps

1. Confirm the DB opens and the schema is recognizable:

   ```sh
   sqlite3 -readonly "$DB" ".schema" | sed -n '1,120p'
   sqlite3 -readonly "$DB" "SELECT version FROM schema_version LIMIT 1;"
   ```

2. Confirm structural integrity and constraints:

   ```sh
   sqlite3 -readonly "$DB" "PRAGMA integrity_check;"
   sqlite3 -readonly "$DB" "PRAGMA foreign_key_check;"
   sqlite3 -readonly "$DB" "
     SELECT COUNT(*) FROM code_nodes
     WHERE file_id NOT IN (SELECT id FROM code_files);
     SELECT COUNT(*) FROM code_edges
     WHERE source_id NOT IN (SELECT symbol_id FROM code_nodes)
        OR target_id NOT IN (SELECT symbol_id FROM code_nodes);
   "
   ```

   `PRAGMA integrity_check` should return a single `ok` row when no errors are found; SQLite documents that it checks table/index ordering, malformed records, missing pages, missing/surplus index entries, UNIQUE/CHECK/NOT NULL errors, freelist integrity, and duplicate or unused file sections, while foreign key errors require `PRAGMA foreign_key_check`. [SOURCE: https://www.sqlite.org/pragma.html#pragma_integrity_check]

3. Confirm WAL state before taking final backups or replacing files:

   ```sh
   sqlite3 "$DB" "PRAGMA wal_checkpoint(TRUNCATE);"
   ```

   SQLite documents `wal_checkpoint(TRUNCATE)` as a checkpoint mode that behaves like `RESTART` and truncates the WAL file to zero bytes on successful completion; the result row's first column is `0` on success and `1` when blocked/busy. [SOURCE: https://www.sqlite.org/pragma.html#pragma_wal_checkpoint]

4. Confirm tool-level readiness:

   - `code_graph_status` should report `status:"ok"`, a non-error `freshness`, `schemaVersion:3`, row counts, `parseHealth`, and `graphQualitySummary`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:10-76`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:675-716`]
   - `detect_changes` must continue blocking on any non-fresh graph before returning affected symbols; this guards against false-safe output during recovery. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:552-554`]
   - Run at least one known `code_graph_query` outline/relationship query after full scan to ensure query surfaces see the rebuilt rows.

## Limitations

- `.recover` is salvage, not proof of correctness. SQLite warns that recovered content can be permanently missing, previously deleted rows can reappear, values can be altered, constraints can be violated, and content can be moved between tables or into a lost-and-found table. [SOURCE: https://www.sqlite.org/recovery.html]
- If the WAL sidecar is not copied before recovery, recent committed frames that were not checkpointed into `code-graph.sqlite` may be absent from the recovery input.
- The code graph DB does not store source-file bodies; it stores paths, hashes, line ranges, signatures/docstrings, nodes, and edges. Lost graph rows are best regenerated by parsing source, not reconstructed manually. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:53-115`]
- Recovered `code_edges` can reference missing `code_nodes` even when the database file is structurally valid, because `.recover` may not preserve application-level consistency. Run orphan checks and prefer full scan.
- Current code-graph storage has no FTS5 or sqlite-vec virtual tables, so there is no local FTS/vector index to reindex in this DB. If this playbook is adapted to `context-index.sqlite` or another DB with FTS/vector tables, the recovered table content should be followed by explicit FTS rebuild / vector re-embedding or a full application-level reindex rather than trusting recovered auxiliary indexes.
- Because `dbFileSize` reports raw SQLite file size, it can remain large after deletes and should not be used as evidence that logical graph rows survived. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/iterations/iteration-001.md:19-20`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:707-710`]

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/deep-research-strategy.md:40-58`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/iterations/iteration-001.md:11-24`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/iterations/iteration-002.md:11-25`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/deep-research-state.jsonl:1-4`
- `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:63-109`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:33-63`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/README.md:30-32`
- `.opencode/skill/system-spec-kit/mcp_server/README.md:540-554`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:50-180`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:281-424`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:675-735`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:47-52`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:102-187`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:227-387`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:130-225`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:10-76`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ops-hardening.ts:21-43`
- `https://www.sqlite.org/recovery.html`
- `https://www.sqlite.org/cli.html`
- `https://www.sqlite.org/pragma.html#pragma_integrity_check`
- `https://www.sqlite.org/pragma.html#pragma_wal_checkpoint`
- Local temp-copy `.recover` experiment against `.opencode/skill/system-spec-kit/mcp_server/database/code-graph.sqlite` using SQLite 3.51.0

## Convergence Signals

- newFindingsRatio: 0.78
- research_questions_answered: ["Q4"]
- dimensionsCovered: ["sqlite-corruption-recovery", "partial-scan-retry", "bad-apply-rollback", "verification"]
- novelty justification: This iteration adds the concrete quarantine/recover/rebuild sequence, confirms actual `.recover` SQL shape on a damaged code-graph DB copy, and distinguishes code-graph ordinary-index recovery from FTS/vector rebuild requirements in adjacent databases.
- remaining gaps: Later synthesis should fold these steps into `assets/recovery-playbook.md` and decide whether the doctor packet should automate only quarantine + full rescan, leaving `.recover` as a manual/forensic branch.
