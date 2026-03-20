● skill(system-spec-kit)

I’m mapping the storage and vector layers first, then I’ll trace migrations, transactions, and cleanup paths so the findings are evidence-based.

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/lib/storage/*.ts"
  └ 13 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index*.ts"
  └ 8 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/lib/eval/**/*.ts"
  └ 16 files found

● Create session plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/4f076ffc-003a-4295-a613-772406e655dd/plan.md'
  │ <<'EOF'
  │ # Plan
  │ 1. Inventory storage, vector-index, and eval-related files plus migration entry points.…
  └ 6 lines...

● Explore Map storage audit surfaces
  │ Read reconsolidation.ts
  │   │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts
  │   └ L150:300 (151 lines read)
  └ Get function signatures from lineage-state (shell)
      │ grep -n "export\|function" "/Users/michelkerkmeester/MEGA/Development/Opencode
      │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts" | head
      -40
      └ 36 lines...

● Explore Map vector and eval audit surfaces
  │ Get file sizes (shell)
  │   │ cd "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public" && wc -l
  │   │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index*.ts
  │   │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts
  │   │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts
  │   └ 12 lines...
  └ Find interference score refresh function (shell)
      │ cd "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public" && grep -n "const
      │ refresh_interference_scores_for_folder\|export function refresh_interference"
      │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts | head -5
      └ 2 lines...

I’ve got the subsystem map. Now I’m drilling into the concrete evidence: transaction boundaries, migration logic, cleanup code, and integrity checks.

● Search (grep)
  │ "transaction|BEGIN|COMMIT|ROLLBACK|savepoint|withTransaction|inTransaction" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage)
  └ 64 lines found

● Search (grep)
  │ "schema_version|user_version|migrat|downgrad|upgrade" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 83 lines found

● Search (grep)
  │ "foreign_keys|PRAGMA foreign_keys|REFERENCES |ON DELETE|ON UPDATE" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 18 lines found

● Search (grep)
  │ "DELETE FROM|cleanup|purge|prune|retention|max 10|maxCheckpoints|vacuum|gc" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 5 lines found

● Search (grep)
  │ "CREATE INDEX|CREATE UNIQUE INDEX|INDEX IF NOT EXISTS" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 5 lines found

I’ve narrowed it to a few likely risk areas: checkpoint retention, migration/bootstrap paths, vector cleanup, and the DB↔file consistency bridges. I’m reading those sections directly now.

● Search (grep)
  │ "DELETE FROM|cleanup|purge|prune|retention|stale|orphan"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts)
  └ No matches found

● Search (grep)
  │ "transaction|INSERT|UPDATE|DELETE|UPSERT|runInTransaction|atomic"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts)
  └ 43 lines found

● Search (grep)
  │ "CREATE TABLE|FOREIGN KEY|INDEX|DELETE FROM|INSERT INTO|UPDATE .* SET|BEGIN|COMMIT"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts)
  └ 5 lines found

● Search (grep)
  │ "DELETE FROM|cleanup|purge|prune|retention|maxCheckpoints|LIMIT"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts)
  └ 13 lines found

● Search (grep)
  │ "CREATE TABLE|FOREIGN KEY|UNIQUE|INDEX|TRIGGER|PRAGMA|WAL|journal_mode|synchronous"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts)
  └ 4 lines found

● Search (grep)
  │ "DELETE FROM|cleanup|purge|prune|retention|stale|orphan"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts)
  └ 3 lines found

● Search (grep)
  │ "cleanup|purge|stale|orphan|DELETE FROM|NOT EXISTS|LEFT JOIN"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
  └ 41 lines found

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
  └ L360:560 (201 lines read)

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
  └ L620:1015 (396 lines read)

● Read transaction-manager.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts
  └ L1:260 (260 lines read)

● Read vector-index-schema.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
  └ L140:230 (91 lines read)

● Read vector-index-store.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
  └ L600:690 (91 lines read)

● Read vector-index-schema.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
  └ L870:940 (71 lines read)

● Read schema-downgrade.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts
  └ L1:340 (326 lines read)

● Read access-tracker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts
  └ L1:360 (340 lines read)

● Read eval-db.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts
  └ L1:260 (195 lines read)

● Read history.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts
  └ L1:260 (260 lines read)

● Read vector-index-queries.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts
  └ L1118:1415 (298 lines read)

● Read vector-index-mutations.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts
  └ L1:720 (591 lines read)

I found a couple of places where the safety story differs by code path instead of by invariant. I’m checking those inconsistencies before I finalize the findings.

● Read vector-index-mutations.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts
  └ L592:720 (117 lines read)

● Read consolidation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts
  └ L300:580 (258 lines read)

● Read reconsolidation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts
  └ L200:390 (191 lines read)

● Read causal-edges.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts
  └ L1:340 (340 lines read)

● Read causal-edges.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts
  └ L480:820 (341 lines read)

● Read incremental-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts
  └ L320:460 (104 lines read)

● Read mutation-ledger.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts
  └ L1:260 (260 lines read)

● Read lineage-state.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts
  └ L1:240 (240 lines read)

● Read lineage-state.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts
  └ L460:1040 (581 lines read)

● Read index-refresh.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts
  └ L1:260 (208 lines read)

● Read vector-index-schema.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
  └ L1880:1975 (96 lines read)

● Read vector-index-schema.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
  └ L640:700 (61 lines read)

I’ve confirmed the core schemas. One likely audit theme is “integrity is often verified in code instead of enforced in schema,” especially in graph and eval storage. I’m validating that with query paths now.

● Search (grep)
  │ "ensureCompanionTables|ensureGovernanceTables|ensureSharedSpaceTables|CREATE TABLE IF NOT EXISTS
  │ causal_edges|CREATE INDEX IF NOT EXISTS idx_causal|active_memory_projection|memory_lineage"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts)
  └ 47 lines found

● Search (grep)
  │ "eval_channel_results|eval_final_results|eval_ground_truth|eval_metric_snapshots|eval_queries"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval)
  └ 47 lines found

● Search (grep)
  │ "recordLineageTransition|createAppendOnlyMemoryRecord|backfillLineageState|validateLineageIntegr
  │ ity" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 17 lines found

● Search (grep)
  │ "recordHistory\(|appendEntry\(|recordDivergenceReconcile|mutation_ledger" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read eval-logger.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts
  └ L1:260 (252 lines read)

● Read reporting-dashboard.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts
  └ L170:280 (111 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L560:700 (141 lines read)

● Read vector-index-schema.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
  └ L320:370 (51 lines read)

● Read vector-index-schema.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
  └ L930:1050 (121 lines read)

● Search (grep)
  │ "DELETE FROM memory_history|memory_history WHERE|idx_history_|specFolderCache|resolveSpecFolder"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts)
  └ 18 lines found

● Search (grep)
  │ "FOREIGN KEY|REFERENCES memory_index|ON DELETE|CREATE INDEX IF NOT EXISTS idx_eval|INDEX.*eval_"
  │ in *.ts (.opencode/skill/system-spec-kit/mcp_server/lib/eval)
  └ No matches found

● Search (grep)
  │ "find_cleanup_candidates\(|verify_integrity\(|memory_health|integrity" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "initLedger\(|appendEntry\(|getEntries\(|getLinkedEntries\(|verifyAppendOnly\(" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 44 lines found

● Read cli.ts
  │ .opencode/skill/system-spec-kit/mcp_server/cli.ts
  └ L300:350 (50 lines read)

● Read memory-crud-utils.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts
  └ L1:120 (74 lines read)

● Read bm25-baseline.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts
  └ L400:455 (56 lines read)

● Read ground-truth-generator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts
  └ L120:190 (71 lines read)

● Read ground-truth-feedback.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts
  └ L500:560 (53 lines read)

● Read create-record.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts
  └ L150:260 (99 lines read)

● Search (grep)
  │ "runInTransaction\(|database.transaction\(|BEGIN IMMEDIATE|COMMIT|ROLLBACK"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 1 line found

● Search (grep)
  │ "ensureFeedbackSchema|CREATE TABLE IF NOT EXISTS eval_user_selections|CREATE TABLE IF NOT EXISTS
  │ eval_llm_judge_labels|CREATE INDEX IF NOT EXISTS idx_eval"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts)
  └ 7 lines found

● Search (grep)
  │ "appendMutationLedgerSafe\(|recordHistory\(" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 27 lines found

● Read ground-truth-feedback.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts
  └ L100:230 (131 lines read)

● Read memory-crud-delete.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts
  └ L80:230 (151 lines read)

● Read response-builder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts
  └ L70:120 (51 lines read)

● Read memory-crud-update.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts
  └ L160:240 (81 lines read)

● Read memory-bulk-delete.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
  └ L160:230 (71 lines read)

● Read history.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts
  └ L260:380 (121 lines read)

● Read vector-index-store.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
  └ L1:220 (220 lines read)

● Read vector-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts
  └ L1:220 (166 lines read)

● Read vector-index-impl.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts
  └ L1:260 (14 lines read)

● Read ablation-framework.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts
  └ L500:560 (61 lines read)

● Read transaction-manager.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts
  └ L260:390 (131 lines read)

● Read reporting-dashboard.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts
  └ L1:120 (120 lines read)

● Read vector-index-schema.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
  └ L1678:1768 (91 lines read)

I found a concrete sync gap candidate in reconsolidation/deferred indexing. I’m checking whether search actually depends on that stale or missing vector state, not just the metadata.

● Read vector-index-queries.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts
  └ L1:220 (220 lines read)

● Read vector-index-queries.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts
  └ L220:420 (201 lines read)

● Search (grep)
  │ "FROM vec_memories|JOIN vec_memories|embedding_status = 'success'|embedding_status"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
  └ 13 lines found

● Search (grep)
  │ "indexMemoryDeferred|embedding_status = 'pending'|failure_reason|retry_count" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "idx_confidence|CREATE INDEX IF NOT EXISTS .*confidence|access_count|idx_access"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts)
  └ 2 lines found

● Search (grep)
  │ "file_path\) FROM memory_index|SELECT id, file_path FROM
  │ memory_index|fs.existsSync\(memory.file_path\)|COUNT\(\*\) as count FROM vec_memories|GROUP BY
  │ eval_run_id, channel" in *.ts (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 7 lines found

● Read vector-index-schema.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
  └ L1968:2008 (41 lines read)

I’ve got the main code-level evidence. I’m doing one verification pass with the existing targeted tests around lineage, ledger, and causal edges so the audit isn’t purely static.

● Run targeted MCP storage tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx vitest run
  │ tests/memory-lineage-state.vitest.ts tests/mutation-ledger.vitest.ts
  │ tests/causal-edges-unit.vitest.ts --reporter=verbose
  └ 7 lines...

● Read copilot-tool-output-1774014527636-jzcue4.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774014527636-jzcue4.txt
  └ L1:220 (219 lines read)

✗ Memory stored testing practices
  └ Run targeted MCP storage regressions with `npx vitest run tests/memory-lineage-s…

● Read copilot-tool-output-1774014527636-jzcue4.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774014527636-jzcue4.txt
  └ L220:320 (101 lines read)

● Read copilot-tool-output-1774014527636-jzcue4.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774014527636-jzcue4.txt
  └ L320:420 (101 lines read)

# MCP Server Storage / Vector / Eval Audit

## Summary

Targeted storage tests passed (`memory-lineage-state`, `mutation-ledger`, `causal-edges-unit`), but the code still has several architectural consistency gaps. The biggest risks are checkpoint restore not being a full-state restore, vector metadata/data drift during reconsolidation, and missing schema-level integrity in graph/lineage/eval tables.

## Findings

### 1. High — checkpoint restore is not a full-consistency restore

`createCheckpoint()` snapshots only `memory_index`, `vec_memories`, `working_memory`, and `causal_edges` (`checkpoints.ts:389-457`). `restoreCheckpoint()` clears/restores only those same tables (`checkpoints.ts:696-723`, `826-945`).

It does **not** snapshot or rebuild `memory_lineage`, `active_memory_projection`, `memory_entities`, `memory_summaries`, `degree_snapshots`, `community_assignments`, or `mutation_ledger`. Since active reads depend on `active_memory_projection` (`vector-index-queries.ts:124-133`, `281-289`), a restore can leave stale projection/lineage rows that no longer match restored memories.

### 2. High — reconsolidation can leave vector search out of sync with stored content

`reconsolidation.executeMerge()` regenerates an embedding, but only does `UPDATE vec_memories SET embedding = ? WHERE rowid = ?` and does **not** update `embedding_status`, `embedding_model`, or `embedding_generated_at` (`reconsolidation.ts:216-250`). The conflict fallback path has the same pattern (`reconsolidation.ts:360-378`).

Vector search only returns rows with `m.embedding_status = 'success'` and an actual `JOIN vec_memories v ON m.id = v.rowid` (`vector-index-queries.ts:241-289`, `387-404`). So a row can have refreshed content but still be invisible to vector search, or silently fail to repair a missing vector row.

### 3. High — graph/lineage integrity is enforced in code, not in schema

`causal_edges` is created without foreign keys to `memory_index` (`vector-index-schema.ts:331-345`). `memory_lineage` and `active_memory_projection` explicitly strip/remove foreign keys during rebuilds (`vector-index-schema.ts:955-1023`). The history table also removes foreign keys intentionally (`history.ts:95-134`, `vector-index-schema.ts:1692-1711`).

That design keeps deletes/restores flexible, but it means orphan prevention depends on every mutation path calling the right cleanup helper. There are integrity checkers (`causal-edges.ts:600-633`, `lineage-state.ts:818-881`, `vector-index-queries.ts:1284-1412`), but they are mostly diagnostic, not guaranteed enforcement.

### 4. Medium — transaction safety is inconsistent across mutation paths

Many core DB mutations are wrapped well (`vector-index-mutations.ts:205-243`, `360-450`, `472-506`; `lineage-state.ts:493-570`; `checkpoints.ts:389-506`, `696-969`). But not all **compound** mutations are atomic end-to-end:

- save results append mutation-ledger entries **after** the main save path (`handlers/save/response-builder.ts:92-116`)
- bulk delete writes its ledger entry **after** the delete transaction commits (`handlers/memory-bulk-delete.ts:208-225`)
- `executeAtomicSave()` explicitly allows “DB committed, file rename failed” partial state (`transaction-manager.ts:197-203`, `239-255`)

So the answer to “are all mutations wrapped?” is **no** for cross-subsystem mutations (DB + ledger, DB + filesystem).

### 5. Medium — upgrade/downgrade handling is only partial

Main schema migration is forward-only: `ensure_schema_version()` migrates when `current_version < SCHEMA_VERSION`, but has no guard for `current_version > SCHEMA_VERSION` (`vector-index-schema.ts:898-930`). Downgrade support exists only for one targeted path, `v16 -> v15` (`schema-downgrade.ts:1-10`, `241-304`).

The eval DB has no version table or migration framework at all; it only runs `CREATE TABLE IF NOT EXISTS` (`eval-db.ts:38-143`). That means schema evolution in eval storage is not auditable or reversible.

### 6. Medium — retention/cleanup is uneven

Checkpoints are capped correctly inside the checkpoint transaction (`checkpoints.ts:484-495`). But I found **no purge policy** for:

- `memory_history` (`history.ts:81-172`, `303-380`)
- `mutation_ledger` (`mutation-ledger.ts:89-130`, `145-250`)
- eval tables (`eval-db.ts:38-143`, `ground-truth-feedback.ts:120-198`)

So “old checkpoints/history properly purged?” is: **checkpoints yes; history/eval/ledger no**.

### 7. Medium — eval subsystem lacks integrity constraints and indexing for hot queries

`eval-db.ts` creates tables without foreign keys from `eval_channel_results`, `eval_final_results`, or `eval_ground_truth` back to `eval_queries` (`eval-db.ts:40-99`). I also found no supporting indices on hot access patterns like `eval_run_id`, `query_id`, `created_at`, or `(eval_run_id, channel)`.

That matters because reporting queries filter/sort/group on exactly those columns (`reporting-dashboard.ts:186-208`, `224-242`), and logging writes them frequently (`eval-logger.ts:151-228`). This will degrade as eval history grows.

### 8. Low/Medium — some integrity/perf checks are full scans with filesystem probes

`verify_integrity()` scans all memories and calls `fs.existsSync()` per row to detect orphaned files (`vector-index-queries.ts:1335-1352`). `find_cleanup_candidates()` uses broad `OR` predicates over `created_at`, `access_count`, and `confidence` (`vector-index-queries.ts:1140-1172`), but schema only has a composite access index and no dedicated `confidence` index (`vector-index-schema.ts:1978-1995`).

This is acceptable at small scale, but it will turn integrity checks into maintenance-time full scans.

## Bottom line

The storage layer is solid on basic single-DB transactions, but it is **not yet fully consistency-safe across restore, vector-sync, filesystem-sync, and eval growth**.

If you want, I can turn this into a prioritized remediation plan next.

