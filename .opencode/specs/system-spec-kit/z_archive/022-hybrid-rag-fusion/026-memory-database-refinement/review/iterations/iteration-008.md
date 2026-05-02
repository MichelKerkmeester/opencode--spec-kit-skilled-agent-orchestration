# Iteration 008: Schema Migrations

## Findings

### [P1] Migration warnings still mark the database as fully upgraded
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`

**Issue**: The migration runner is only atomic for exceptions that escape the individual migration bodies. Many migrations catch broad `database.exec(...)` failures, log a warning, and continue. After that, `ensure_schema_version()` still writes `schema_version = 23`, and the compatibility validator only checks a minimal footprint. A failed `ALTER TABLE` or `CREATE INDEX` can therefore leave the schema partially upgraded while the database is permanently marked current, preventing the missing DDL from being retried on the next startup.

**Evidence**:
- `vector-index-schema.ts:225-233`, `vector-index-schema.ts:433-438`, `vector-index-schema.ts:461-467`, `vector-index-schema.ts:596-600` all swallow DDL/index failures with warnings instead of rethrowing.
- `vector-index-schema.ts:874-889` wraps migrations in a transaction, but only uncaught errors trigger rollback.
- `vector-index-schema.ts:910-919` advances `schema_version` immediately after `run_migrations(...)` returns.
- `vector-index-schema.ts:1175-1205` validates only `memory_index` plus a few core columns/tables, not the later-version columns, indexes, lineage tables, or governance tables.
- `tests/vector-index-schema-compatibility.vitest.ts:17-58` explicitly treats a v21-style minimal schema as "compatible", confirming the validator is not strict enough to catch late-migration omissions.

**Fix**: Treat versioned migrations as fail-closed. Re-throw DDL/index failures for required schema changes, only swallow true idempotency cases after verifying the target object already exists in the expected shape, and do not update `schema_version` until a stronger compatibility check confirms the full target schema.

### [P1] Existing-database bootstrap backfills history with stale `spec_folder` values before v23 canonicalization runs
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`

**Issue**: On the normal existing-database bootstrap path, `create_schema()` calls `initHistory()` before `ensure_schema_version()`. `initHistory()` fills `memory_history.spec_folder` from the current `memory_index.spec_folder`, but migration v23 canonicalizes `memory_index.spec_folder` later and only updates `session_state`. That ordering permanently freezes pre-canonicalized folder names into history rows, which breaks consistency between `memory_index`, `memory_history`, and session-state lineage after the upgrade.

**Evidence**:
- `vector-index-store.ts:662-663` runs `create_schema(...)` before `ensure_schema_version(...)` on every open.
- `vector-index-schema.ts:1818-1827` shows the existing-db bootstrap path invoking `initHistory(database)` inside `create_schema()`.
- `storage/history.ts:140-148` backfills `memory_history.spec_folder` from `memory_index.spec_folder`.
- `vector-index-schema.ts:836-871` canonicalizes `memory_index.spec_folder` and `session_state.spec_folder` in v23, but does not repair `memory_history.spec_folder`.

**Fix**: Run schema-version migrations before history backfill for existing databases, or add a follow-up v23 repair step that rewrites `memory_history.spec_folder` from the newly canonicalized `memory_index` values inside the same transaction.

### [P1] Constitutional-tier migration is a no-op, so legacy databases can remain unable to store valid modern rows
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`

**Issue**: `migrate_constitutional_tier()` does not migrate anything. If an older `memory_index` table still has a pre-constitutional `importance_tier` check constraint, the normal upgrade path only logs a warning and continues. Modern save/search code expects `'constitutional'` to be a valid persisted tier, so legacy databases can be marked upgraded while still rejecting those writes or updates at runtime.

**Evidence**:
- `vector-index-schema.ts:1576-1598` detects the legacy constraint but only logs "manual schema update" warnings; it never rebuilds the table.
- `vector-index-schema.ts:1819-1820` calls that helper on the normal existing-db bootstrap path.
- `vector-index-schema.ts:1865` shows the current canonical schema includes `'constitutional'` in the `importance_tier` check.
- `handlers/save/create-record.ts:157-171` writes `importance_tier` from parsed metadata during normal saves, so a legacy constraint mismatch can surface as a live write failure rather than a purely informational warning.

**Fix**: Replace the warning-only helper with a real table-rebuild migration that preserves data while upgrading the `importance_tier` constraint to the current enum. If a rebuild is intentionally deferred, fail startup for legacy schemas instead of silently advertising support that is not actually present.

### [P1] v12 destroys existing `memory_conflicts` audit history instead of migrating it
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`

**Issue**: The v12 "schema unification" step drops `memory_conflicts` outright and recreates it with the new column names. Any conflict audit rows recorded by v4-v11 are deleted during upgrade, even though the old schema is close enough to be migrated (`similarity_score` -> `similarity`, `notes` -> `reason`). For an audit table, that is a backward-compatibility break and an avoidable data-loss migration.

**Evidence**:
- `vector-index-schema.ts:205-216` defines the pre-v12 `memory_conflicts` shape with `similarity_score` and `notes`.
- `vector-index-schema.ts:408-427` implements v12 as `DROP TABLE IF EXISTS memory_conflicts; CREATE TABLE ...`, with no rename/copy step.
- `vector-index-schema.ts:433-438` then recreates indexes against the empty replacement table, confirming the old contents are not preserved.

**Fix**: Rework v12 into a rename-copy-drop migration: rename the old table, create the new schema, copy and map old columns into the new names, then drop the old table only after a successful transfer. If some legacy columns cannot be mapped exactly, preserve them in metadata rather than discarding the rows.

## Summary
P0: 0, P1: 4, P2: 0
