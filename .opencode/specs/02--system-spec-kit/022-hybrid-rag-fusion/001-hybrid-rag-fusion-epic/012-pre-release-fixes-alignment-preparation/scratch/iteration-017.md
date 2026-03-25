# Iteration 017: Regression + Build Health

## Findings

- `npm run test` exit code: **0**
- `npm run check` exit code: **1**
- `npm run lint` exit code: **1**
- Test failure keyword matches in test output: **337** (informational)
- TypeScript error-pattern matches in check output: **0**
- Lint warning/error-pattern matches in lint output: **11** (includes npm script-missing errors)

### Command: npm run test

```text

> @spec-kit/shared@1.7.2 test
> echo 'No tests in shared workspace'

No tests in shared workspace

> @spec-kit/mcp-server@1.7.2 test
> npm run test:core && npm run test:file-watcher


> @spec-kit/mcp-server@1.7.2 test:core
> vitest run --exclude tests/file-watcher.vitest.ts


[1m[46m RUN [49m[22m [36mv4.0.18 [39m[90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server[39m

[90mstderr[2m | tests/job-queue.vitest.ts[2m > [22m[2mingest job queue processing[2m > [22m[2mmarks partial-success jobs complete while preserving per-file errors
[22m[39m[job-queue] File error (continuing): spec-kit-missing-1774430412841.md — File not accessible

[90mstderr[2m | tests/job-queue.vitest.ts[2m > [22m[2mingest job queue processing[2m > [22m[2mmarks all-fail jobs failed when every file errors
[22m[39m[job-queue] File error (continuing): spec-kit-job-queue-1774430412866-pgnpo3lbnc8.md — index failure

[90mstderr[2m | tests/regression-010-index-large-files.vitest.ts[2m > [22m[2mRegression 010: index large files guardrails[2m > [22m[2minitializes schema with v16 chunk columns and parent indexes
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23
INFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index

[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mDatabase Initialization[2m > [22m[2mcreates database at custom path
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mDeferred Indexing (no embedding required)[2m > [22m[2mcreates first deferred memory
[22m[39mINFO  [VectorIndex] Deferred indexing: Memory 1 saved without embedding (BM25/FTS5 searchable)

[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mDeferred Indexing (no embedding required)[2m > [22m[2mcreates second deferred memory with different ID
[22m[39mINFO  [VectorIndex] Deferred indexing: Memory 2 saved without embedding (BM25/FTS5 searchable)

[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mDeferred Indexing (no embedding required)[2m > [22m[2mstores failure reason correctly
[22m[39mINFO  [VectorIndex] Deferred indexing: Memory 3 saved without embedding (BM25/FTS5 searchable)

[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mDeferred Indexing (no embedding required)[2m > [22m[2mupserts existing memory across symlink alias paths
[22m[39mINFO  [VectorIndex] Deferred indexing: Memory 4 saved without embedding (BM25/FTS5 searchable)

[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mupdateEmbeddingStatus[2m > [22m[2mrejects invalid status
[22m[39m[vector-index] Invalid embedding status: invalid_status

[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mupdateConfidence[2m > [22m[2mrejects value > 1
[22m[39m[vector-index] Invalid confidence value: 1.5

[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mupdateConfidence[2m > [22m[2mrejects value < 0
[22m[39m[vector-index] Invalid confidence value: -0.1

[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mupdateConfidence[2m > [22m[2mrejects non-numeric input
[22m[39m[vector-index] Invalid confidence value: not a number

[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mDelete Operations[2m > [22m[2mdeleteMemory successfully deletes a memory
[22m[39mINFO  [VectorIndex] Deferred indexing: Memory 5 saved without embedding (BM25/FTS5 searchable)

[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mDelete Operations[2m > [22m[2mdeleteMemoryByPath deletes memory by folder+path
[22m[39mINFO  [VectorIndex] Deferred indexing: Memory 5 saved without embedding (BM25/FTS5 searchable)

[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mBatch Delete[2m > [22m[2mrecords DELETE history only for confirmed batch deletions
[22m[39mINFO  [VectorIndex] Deferred indexing: Memory 5 saved without embedding (BM25/FTS5 searchable)
INFO  [VectorIndex] Deferred indexing: Memory 6 saved without embedding (BM25/FTS5 searchable)

[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mBatch Delete[2m > [22m[2mrolls back earlier deletions when any requested id fails
[22m[39mINFO  [VectorIndex] Deferred indexing: Memory 5 saved without embedding (BM25/FTS5 searchable)
INFO  [VectorIndex] Deferred indexing: Memory 6 saved without embedding (BM25/FTS5 searchable)
[vector-index] delete_memories transaction error: Failed to delete memories: 999999. Transaction rolled back.

[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mEnriched/Enhanced Search (edge cases without API key)[2m > [22m[2mvectorSearchEnriched — exported and falls back to keyword search without embedding
[22m[39m[factory] Using provider: voyage (VOYAGE_API_KEY detected (auto mode))

[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mEnriched/Enhanced Search (edge cases without API key)[2m > [22m[2mvectorSearchEnriched — exported and falls back to keyword search without embedding
[22m[39m[embeddings] Provider created lazily (0ms)

[90mstderr[2m | tests/regression-010-index-large-files.vitest.ts[2m > [22m[2mRegression 010: index large files guardrails[2m > [22m[2mreturns restoreCommand on successful bulk delete with checkpoint init
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/regression-010-index-large-files.vitest.ts[2m > [22m[2mRegression 010: index large files guardrails[2m > [22m[2mreturns restoreCommand on successful bulk delete with checkpoint init
[22m[39m[checkpoints] Created checkpoint "pre-bulk-delete-deprecated-2026-03-25T09-20-13" (1606 bytes compressed)
[memory-bulk-delete] Created checkpoint: pre-bulk-delete-deprecated-2026-03-25T09-20-13

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mStorage: restoreCheckpoint clearExisting=true[2m > [22m[2mEXT-S5: restore with clearExisting clears and restores
[22m[39m[checkpoints] Created checkpoint "clear-existing-test" (753 bytes compressed)
[checkpoints] Skipping post-restore rebuild "auto-entities" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "degree-snapshots" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "community-assignments" because dependencies did not complete: degree-snapshots
[checkpoints] Skipping post-restore rebuild "fts-rebuild" because dependencies did not complete: lineage-backfill, auto-entities
[checkpoints] Post-restore rebuild summary: completed=none; skipped=auto-entities, degree-snapshots, community-assignments, fts-rebuild
[checkpoints] Restored 3 memories, 0 working memory entries from "clear-existing-test"

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mStorage: restoreCheckpoint clearExisting=true[2m > [22m[2mEXT-S6: clearExisting removes non-checkpoint memories
[22m[39m[checkpoints] Created checkpoint "clear-extra-test" (797 bytes compressed)
[checkpoints] Skipping post-restore rebuild "auto-entities" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "degree-snapshots" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "community-assignments" because dependencies did not complete: degree-snapshots
[checkpoints] Skipping post-restore rebuild "fts-rebuild" because dependencies did not complete: lineage-backfill, auto-entities
[checkpoints] Post-restore rebuild summary: completed=none; skipped=auto-entities, degree-snapshots, community-assignments, fts-rebuild
[checkpoints] Restored 3 memories, 0 working memory entries from "clear-extra-test"

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mStorage: restoreCheckpoint Duplicate file_path Skip[2m > [22m[2mEXT-S7: restore without clear handles existing data
[22m[39m[checkpoints] Created checkpoint "dup-skip-test" (797 bytes compressed)
[checkpoints] Skipping post-restore rebuild "auto-entities" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "degree-snapshots" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "community-assignments" because dependencies did not complete: degree-snapshots
[checkpoints] Skipping post-restore rebuild "fts-rebuild" because dependencies did not complete: lineage-backfill, auto-entities
[checkpoints] Post-restore rebuild summary: completed=none; skipped=auto-entities, degree-snapshots, community-assignments, fts-rebuild
[checkpoints] Restored 3 memories, 0 working memory entries from "dup-skip-test"

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mStorage: Edge Cases[2m > [22m[2mEXT-S9: duplicate checkpoint name handled
[22m[39m[checkpoints] Created checkpoint "dup-name-test" (798 bytes compressed)
[checkpoints] createCheckpoint error: UNIQUE constraint failed: checkpoints.name

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mStorage: Edge Cases[2m > [22m[2mEXT-S10: getCheckpoint by numeric ID
[22m[39m[checkpoints] Created checkpoint "id-lookup-test" (797 bytes compressed)

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mStorage: T101 Transaction Rollback on Corrupt Restore[2m > [22m[2mEXT-S11: transaction rollback preserves data on corrupt restore
[22m[39m[checkpoints] Created checkpoint "rollback-test" (798 bytes compressed)

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mStorage: T101 Transaction Rollback on Corrupt Restore[2m > [22m[2mEXT-S12: rollback result reports errors
[22m[39m[checkpoints] Created checkpoint "rollback-errors-test" (797 bytes compressed)

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mStorage: T101 Transaction Rollback on Corrupt Restore[2m > [22m[2mEXT-S13: rollback resets restored counter to 0
[22m[39m[checkpoints] Created checkpoint "rollback-counter-test" (797 bytes compressed)

[90mstderr[2m | tests/regression-010-index-large-files.vitest.ts[2m > [22m[2mRegression 010: index large files guardrails[2m > [22m[2mallows skipCheckpoint for non-critical tiers
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/regression-010-index-large-files.vitest.ts[2m > [22m[2mRegression 010: index large files guardrails[2m > [22m[2mallows skipCheckpoint for non-critical tiers
[22m[39m[memory-bulk-delete] Checkpoint creation skipped by caller (skipCheckpoint=true)

 [32m✓[39m tests/job-queue.vitest.ts [2m([22m[2m6 tests[22m[2m)[22m[33m 591[2mms[22m[39m
[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mStorage: Restore Fidelity[2m > [22m[2mEXT-S14: restore preserves extended memory_index columns when schema supports them
[22m[39m[checkpoints] Created checkpoint "extended-cols-test" (965 bytes compressed)
[checkpoints] Post-restore rebuild "auto-entities" failed (non-fatal): no such table: memory_entities
[graph-signals] snapshotDegrees failed: no such table: causal_edges
[community-detection] detectCommunities failed: no such table: causal_edges
[community-detection] Failed to store assignments: no such table: community_assignments
[checkpoints] Skipping post-restore rebuild "fts-rebuild" because dependencies did not complete: auto-entities
[checkpoints] Post-restore rebuild summary: completed=lineage-backfill, degree-snapshots, community-assignments; skipped=fts-rebuild
[checkpoints] Restored 3 memories, 0 working memory entries from "extended-cols-test"

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mStorage: Restore Fidelity[2m > [22m[2mEXT-S15: restore non-clear keeps same file_path entries when anchor_id differs
[22m[39m[checkpoints] Created checkpoint "anchor-aware-duplicate-test" (1083 bytes compressed)
[checkpoints] Post-restore rebuild "auto-entities" failed (non-fatal): no such table: memory_entities
[graph-signals] snapshotDegrees failed: no such table: causal_edges
[community-detection] detectCommunities failed: no such table: causal_edges
[community-detection] Failed to store assignments: no such table: community_assignments
[checkpoints] Skipping post-restore rebuild "fts-rebuild" because dependencies did not complete: auto-entities
[checkpoints] Post-restore rebuild summary: completed=lineage-backfill, degree-snapshots, community-assignments; skipped=fts-rebuild
[checkpoints] Restored 5 memories, 0 working memory entries from "anchor-aware-duplicate-test"

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mStorage: Restore Fidelity[2m > [22m[2mEXT-S16: clearExisting restore reinstates checkpoint vector snapshot
[22m[39m[checkpoints] Created checkpoint "vector-restore-test" (1051 bytes compressed)
[checkpoints] Post-restore rebuild "auto-entities" failed (non-fatal): no such table: memory_entities
[graph-signals] snapshotDegrees failed: no such table: causal_edges
[community-detection] detectCommunities failed: no such table: causal_edges
[community-detection] Failed to store assignments: no such table: community_assignments
[checkpoints] Skipping post-restore rebuild "fts-rebuild" because dependencies did not complete: auto-entities
[checkpoints] Post-restore rebuild summary: completed=lineage-backfill, degree-snapshots, community-assignments; skipped=fts-rebuild
[checkpoints] Restored 3 memories, 0 working memory entries from "vector-restore-test"

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mStorage: T107 Schema Validation Before Restore[2m > [22m[2mT107-05: old-format checkpoint (no optional fields) restores OK
[22m[39m[checkpoints] Post-restore rebuild "auto-entities" failed (non-fatal): no such table: memory_entities
[graph-signals] snapshotDegrees failed: no such table: causal_edges
[community-detection] detectCommunities failed: no such table: causal_edges
[community-detection] Failed to store assignments: no such table: community_assignments
[checkpoints] Skipping post-restore rebuild "fts-rebuild" because dependencies did not complete: auto-entities
[checkpoints] Post-restore rebuild summary: completed=lineage-backfill, degree-snapshots, community-assignments; skipped=fts-rebuild
[checkpoints] Restored 1 memories, 0 working memory entries from "t107-old-format"

[90mstderr[2m | tests/integration-causal-graph.vitest.ts[2m > [22m[2mIntegration Causal Graph (T528)[2m > [22m[2mHandler Parameter Validation[2m > [22m[2mT528-4: CausalStats accepts empty params (no validation error)
[22m[39mINFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index

[90mstderr[2m | tests/regression-010-index-large-files.vitest.ts[2m > [22m[2mRegression 010: index large files guardrails[2m > [22m[2mproceeds without rollback metadata when checkpoint creation returns null on non-critical tier
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mStorage: T107 Schema Validation Before Restore[2m > [22m[2mT107-06: empty memories array restores OK
[22m[39m[checkpoints] Post-restore rebuild "auto-entities" failed (non-fatal): no such table: memory_entities
[graph-signals] snapshotDegrees failed: no such table: causal_edges
[community-detection] detectCommunities failed: no such table: causal_edges
[community-detection] Failed to store assignments: no such table: community_assignments
[checkpoints] Skipping post-restore rebuild "fts-rebuild" because dependencies did not complete: auto-entities
[checkpoints] Post-restore rebuild summary: completed=lineage-backfill, degree-snapshots, community-assignments; skipped=fts-rebuild
[checkpoints] Restored 0 memories, 0 working memory entries from "t107-empty"

[90mstderr[2m | tests/regression-010-index-large-files.vitest.ts[2m > [22m[2mRegression 010: index large files guardrails[2m > [22m[2mproceeds without rollback metadata when checkpoint creation returns null on non-critical tier
[22m[39m[memory-bulk-delete] Checkpoint creation failed before deleting deprecated memories. Proceeding without rollback.

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mHandler: handleCheckpointCreate Happy Path[2m > [22m[2mEXT-H1: handleCheckpointCreate returns success
[22m[39m[checkpoints] Created checkpoint "handler-create-test" (1051 bytes compressed)

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mHandler: handleCheckpointCreate Happy Path[2m > [22m[2mEXT-H2: handleCheckpointCreate with specFolder
[22m[39m[checkpoints] Created checkpoint "handler-create-spec" (1010 bytes compressed)

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mHandler: handleCheckpointList Happy Path[2m > [22m[2mEXT-H3: handleCheckpointList returns checkpoints
[22m[39m[checkpoints] Created checkpoint "list-test-cp" (1052 bytes compressed)

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mHandler: handleCheckpointList Happy Path[2m > [22m[2mEXT-H4: handleCheckpointList with specFolder filter
[22m[39m[checkpoints] Created checkpoint "list-filter-test" (697 bytes compressed)

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mHandler: handleCheckpointRestore Happy Path[2m > [22m[2mEXT-H6: handleCheckpointRestore returns success
[22m[39m[checkpoints] Created checkpoint "restore-handler-test" (1051 bytes compressed)

[90mstderr[2m | tests/regression-010-index-large-files.vitest.ts[2m > [22m[2mRegression 010: index large files guardrails[2m > [22m[2maborts critical tier bulk delete when checkpoint creation returns null
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/regression-010-index-large-files.vitest.ts[2m > [22m[2mRegression 010: index large files guardrails[2m > [22m[2maborts critical tier bulk delete when checkpoint creation returns null
[22m[39m[memory-bulk-delete] Failed to create checkpoint: Checkpoint creation failed before deleting critical memories. Aborting high-safety bulk delete.

[90mstderr[2m | tests/regression-010-index-large-files.vitest.ts[2m > [22m[2mRegression 010: index large files guardrails[2m > [22m[2mdowngrades schema from v16 to v15 and removes chunk columns
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23
[checkpoints] Created checkpoint "pre-schema-downgrade-v16-to-v15-2026-03-25T09-20-13" (1249 bytes compressed)

[90mstderr[2m | tests/memory-crud-extended.vitest.ts[2m > [22m[2mhandleMemoryDelete - Bulk Delete Transaction[2m > [22m[2mEXT-BD1: Bulk delete 3 memories succeeds
[22m[39m[memory-delete] Created checkpoint: pre-cleanup-2026-03-25T09-20-13

[90mstderr[2m | tests/memory-crud-extended.vitest.ts[2m > [22m[2mhandleMemoryDelete - Bulk Delete Transaction[2m > [22m[2mEXT-BD2: Bulk delete creates checkpoint
[22m[39m[memory-delete] Created checkpoint: pre-cleanup-2026-03-25T09-20-13

[90mstderr[2m | tests/memory-crud-extended.vitest.ts[2m > [22m[2mhandleMemoryDelete - Bulk Delete Transaction[2m > [22m[2mEXT-BD3: Response includes checkpoint name
[22m[39m[memory-delete] Created checkpoint: pre-cleanup-2026-03-25T09-20-13

[90mstderr[2m | tests/memory-crud-extended.vitest.ts[2m > [22m[2mhandleMemoryDelete - Bulk Delete Transaction[2m > [22m[2mEXT-BD4: Checkpoint failure + confirm proceeds
[22m[39m[memory-delete] Failed to create checkpoint: Mock checkpoint error
[memory-delete] Proceeding without backup (user confirmed)

[90mstderr[2m | tests/memory-crud-extended.vitest.ts[2m > [22m[2mhandleMemoryDelete - Bulk Delete Transaction[2m > [22m[2mEXT-BD5: Bulk delete cleans causal edges for each memory
[22m[39m[memory-delete] Created checkpoint: pre-cleanup-2026-03-25T09-20-13

[90mstderr[2m | tests/memory-crud-extended.vitest.ts[2m > [22m[2mhandleMemoryDelete - Bulk Delete Transaction[2m > [22m[2mEXT-BD7: Null checkpoint response omits restore metadata
[22m[39m[memory-delete] Checkpoint creation returned no checkpoint; proceeding without rollback.

[90mstderr[2m | tests/memory-crud-extended.vitest.ts[2m > [22m[2mhandleMemoryUpdate - Happy Path[2m > [22m[2mEXT-U2: Changed title triggers embedding regen
[22m[39m[memory-update] Title changed, regenerating embedding for memory 1 [requestId=367b92a7-3b76-4861-ba26-3bf1f22545a8]

[90mstderr[2m | tests/memory-crud-extended.vitest.ts[2m > [22m[2mhandleMemoryUpdate - Embedding Regeneration[2m > [22m[2mEXT-ER1: Embedding failure without partial rolls back
[22m[39m[memory-update] Title changed, regenerating embedding for memory 1 [requestId=c213392f-36ba-4d77-96cb-14f633363d10]

[90mstderr[2m | tests/memory-crud-extended.vitest.ts[2m > [22m[2mhandleMemoryUpdate - Embedding Regeneration[2m > [22m[2mEXT-ER1: Embedding failure without partial rolls back
[22m[39m[memory-update] Embedding regeneration failed, rolling back update [requestId=c213392f-36ba-4d77-96cb-14f633363d10]: Mock embedding failure

[90mstderr[2m | tests/memory-crud-extended.vitest.ts[2m > [22m[2mhandleMemoryUpdate - Embedding Regeneration[2m > [22m[2mEXT-ER2: Partial update marks embedding pending
[22m[39m[memory-update] Title changed, regenerating embedding for memory 2 [requestId=6bc0bb6d-9dbe-4d9c-aa06-87f2daaeaabc]

[90mstderr[2m | tests/memory-crud-extended.vitest.ts[2m > [22m[2mhandleMemoryUpdate - Embedding Regeneration[2m > [22m[2mEXT-ER2: Partial update marks embedding pending
[22m[39m[memory-update] Embedding regeneration failed, marking for re-index [requestId=6bc0bb6d-9dbe-4d9c-aa06-87f2daaeaabc]: Mock embedding failure

[90mstderr[2m | tests/memory-crud-extended.vitest.ts[2m > [22m[2mhandleMemoryUpdate - Embedding Regeneration[2m > [22m[2mEXT-ER3: Null embedding without partial throws
[22m[39m[memory-update] Title changed, regenerating embedding for memory 3 [requestId=74689037-1f60-414c-9a76-b8352b82bc26]

[90mstderr[2m | tests/memory-crud-extended.vitest.ts[2m > [22m[2mhandleMemoryUpdate - Embedding Regeneration[2m > [22m[2mEXT-ER4: Null embedding + partial marks pending
[22m[39m[memory-update] Title changed, regenerating embedding for memory 4 [requestId=63fdcf25-3f44-43c0-9366-ff4d53e887c9]

[90mstderr[2m | tests/memory-crud-extended.vitest.ts[2m > [22m[2mhandleMemoryUpdate - Embedding Regeneration[2m > [22m[2mEXT-ER4: Null embedding + partial marks pending
[22m[39m[memory-update] Embedding returned null, marking for re-index

[90mstderr[2m | tests/memory-crud-extended.vitest.ts[2m > [22m[2mhandleMemoryUpdate - Embedding Regeneration[2m > [22m[2mEXT-ER5: Embedding regen completes successfully
[22m[39m[memory-update] Title changed, regenerating embedding for memory 5 [requestId=07b074e0-e92e-45b4-b9b3-e1be181a4793]

[90mstderr[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2mInput Validation[2m > [22m[2mT518-10: Path traversal blocked
[22m[39m[utils] Path traversal blocked: /specs/../../../etc/passwd -> /private/etc/passwd

[90mstderr[2m | tests/memory-crud-extended.vitest.ts[2m > [22m[2mhandleMemoryStats - Folder Scoring[2m > [22m[2mEXT-FS2: Scoring failure falls back gracefully
[22m[39m[memory-stats] Scoring failed, falling back to count-based: Mock scoring failure

[90mstderr[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2mInput Validation[2m > [22m[2mT518-11: Non-memory file rejected
[22m[39m[utils] Path traversal blocked: /tmp/not-a-memory-file.txt -> /private/tmp/not-a-memory-file.txt

[90mstderr[2m | tests/handler-memory-stats-edge.vitest.ts
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/handler-memory-stats-edge.vitest.ts[2m > [22m[2mhandleMemoryStats Edge Cases (T007a)[2m > [22m[2mT007a-S1: Zero limit falls back to 10
[22m[39mINFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index

[90mstderr[2m | tests/memory-save-pipeline-enforcement.vitest.ts
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/memory-crud-extended.vitest.ts[2m > [22m[2mhandleMemoryHealth - Happy Path[2m > [22m[2mEXT-H14: autoRepair marks partial success when FTS consistency check throws but orphan cleanup succeeds
[22m[39m[memory-health] Failed to get memory count [requestId=e532f11d-4920-4e19-b347-9d62f3b12183]: FTS5 table corrupted

[90mstderr[2m | tests/memory-crud-extended.vitest.ts[2m > [22m[2mMutation ledger wiring[2m > [22m[2mEXT-ML2: bulk delete logs one ledger entry per deleted memory
[22m[39m[memory-delete] Created checkpoint: pre-cleanup-2026-03-25T09-20-13

[90mstderr[2m | tests/chunk-thinning.vitest.ts[2m > [22m[2mR7 integration wiring[2m > [22m[2muses thinChunks retained set in indexChunkedMemoryFile active path
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23
[memory-save] Chunking /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s6-r7-integration-UFexjd/chunked-memory.md: structure strategy, 2 chunks
[memory-save] Chunk thinning retained 1/2 chunks
INFO  [VectorIndex] Deferred indexing: Memory 1 saved without embedding (BM25/FTS5 searchable)

 [32m✓[39m tests/memory-crud-extended.vitest.ts [2m([22m[2m77 tests[22m[2m)[22m[33m 670[2mms[22m[39m
[90mstdout[2m | tests/memory-save-pipeline-enforcement.vitest.ts[2m > [22m[2mCat 0: Golden Path[2m > [22m[2maccepts a fully valid memory through the entire pipeline
[22m[39m{"timestamp":"2026-03-25T09:20:13.489Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:4","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/memory-save-pipeline-enforcement.vitest.ts[2m > [22m[2mCat 0: Golden Path[2m > [22m[2maccepts a fully valid memory through the entire pipeline
[22m[39m[memory-save] T306: Async embedding mode - deferring embedding for golden-path.md

 [32m✓[39m tests/chunk-thinning.vitest.ts [2m([22m[2m25 tests[22m[2m)[22m[33m 677[2mms[22m[39m
     [33m[2m✓[22m[39m uses thinChunks retained set in indexChunkedMemoryFile active path [33m 672[2mms[22m[39m
[90mstderr[2m | tests/memory-save-pipeline-enforcement.vitest.ts[2m > [22m[2mCat 0: Golden Path[2m > [22m[2maccepts a fully valid memory through the entire pipeline
[22m[39m[memory-save] Using deferred indexing for golden-path.md
INFO  [VectorIndex] Deferred indexing: Memory 1 saved without embedding (BM25/FTS5 searchable)
[entity-extraction] Extracted 26 entities for memory #1
[factory] Using provider: voyage (VOYAGE_API_KEY detected (auto mode))

[90mstderr[2m | tests/memory-save-pipeline-enforcement.vitest.ts[2m > [22m[2mCat 0: Golden Path[2m > [22m[2maccepts a fully valid memory through the entire pipeline
[22m[39m[embeddings] Provider created lazily (0ms)

[90mstdout[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mT518-6b: indexMemoryFile calls runQualityLoop during behavioral save flow
[22m[39m{"timestamp":"2026-03-25T09:20:13.503Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:1","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstdout[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mT518-6c: same-path supersedes route through append-only lineage helpers
[22m[39m{"timestamp":"2026-03-25T09:20:13.527Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:1","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mT518-6c: same-path supersedes route through append-only lineage helpers
[22m[39m[entity-extractor] refreshAutoEntitiesForMemory failed: no such table: memory_entities
[memory-save] Cleaned stale auto-entities for superseded memory #42

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000d: callback runs after dispatchTool resolves
[22m[39m[context-server] Initializing database...
[context-server] Database initialized
[context-server] Validating embedding API key...

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000d: callback runs after dispatchTool resolves
[22m[39m[context-server] API key validated (provider: test)
[context-server] Lazy loading enabled - embedding model will initialize on first use
[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags
[context-server] Integrity check: 0/0 valid entries
[context-server] Embedding dimension validated: 1536
[context-server] Scoring observability initialized
[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized
[context-server] Cognitive memory modules initialized
[context-server] Working memory: false, Co-activation: false
[context-server] Extraction adapter initialized
[context-server] Archival manager initialized (background job: not started)
[context-server] Background retry job already running or disabled
[context-server] Shadow feedback evaluation scheduler started
[batch-learning] runBatchLearning error: db.exec is not a function
[context-server] Batch learning: no eligible candidates in window (or flag disabled)
[context-server] Session manager initialized (enabled: false)
[shadow-evaluation-runtime] scheduled cycle failed: db.exec is not a function

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000d: callback runs after dispatchTool resolves
[22m[39m[context-server] Context MCP server running on stdio

[90mstdout[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mretries when indexMemoryFile throws once then succeeds
[22m[39m{"timestamp":"2026-03-25T09:20:13.549Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:1","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mretries when indexMemoryFile throws once then succeeds
[22m[39m[memory-save] index attempt 1 failed for /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/atomic-save-fi-yoyIbG/retry-once.md, retrying once: simulated transient indexing failure

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000d: rejected callback does not block other callbacks
[22m[39m[context-server] Initializing database...
[context-server] Database initialized
[context-server] Validating embedding API key...

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000d: rejected callback does not block other callbacks
[22m[39m[context-server] API key validated (provider: test)
[context-server] Lazy loading enabled - embedding model will initialize on first use
[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags
[context-server] Integrity check: 0/0 valid entries
[context-server] Embedding dimension validated: 1536
[context-server] Scoring observability initialized
[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized
[context-server] Cognitive memory modules initialized
[context-server] Working memory: false, Co-activation: false
[context-server] Extraction adapter initialized
[context-server] Archival manager initialized (background job: not started)
[context-server] Background retry job already running or disabled
[context-server] Shadow feedback evaluation scheduler started
[batch-learning] runBatchLearning error: db.exec is not a function
[context-server] Batch learning: no eligible candidates in window (or flag disabled)
[context-server] Session manager initialized (enabled: false)
[shadow-evaluation-runtime] scheduled cycle failed: db.exec is not a function

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000d: rejected callback does not block other callbacks
[22m[39m[context-server] Context MCP server running on stdio

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000d: response stays non-blocking while callback is pending
[22m[39m[context-server] Initializing database...
[context-server] Database initialized
[context-server] Validating embedding API key...

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000d: response stays non-blocking while callback is pending
[22m[39m[context-server] API key validated (provider: test)
[context-server] Lazy loading enabled - embedding model will initialize on first use
[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags
[context-server] Integrity check: 0/0 valid entries
[context-server] Embedding dimension validated: 1536
[context-server] Scoring observability initialized
[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized
[context-server] Cognitive memory modules initialized
[context-server] Working memory: false, Co-activation: false
[context-server] Extraction adapter initialized
[context-server] Archival manager initialized (background job: not started)
[context-server] Background retry job already running or disabled
[context-server] Shadow feedback evaluation scheduler started
[batch-learning] runBatchLearning error: db.exec is not a function
[context-server] Batch learning: no eligible candidates in window (or flag disabled)
[context-server] Session manager initialized (enabled: false)
[shadow-evaluation-runtime] scheduled cycle failed: db.exec is not a function

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000d: response stays non-blocking while callback is pending
[22m[39m[context-server] Context MCP server running on stdio

[90mstderr[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mrolls back written file when indexMemoryFile throws on both attempts
[22m[39m[memory-save] index attempt 1 failed for /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/atomic-save-fi-flnSWk/throw-both.md, retrying once: simulated persistent indexing failure

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000e: non-memory-aware tools invoke TM-05 tool-dispatch hook at runtime
[22m[39m[context-server] Initializing database...
[context-server] Database initialized
[context-server] Validating embedding API key...

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000e: non-memory-aware tools invoke TM-05 tool-dispatch hook at runtime
[22m[39m[context-server] API key validated (provider: test)
[context-server] Lazy loading enabled - embedding model will initialize on first use
[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags
[context-server] Integrity check: 0/0 valid entries
[context-server] Embedding dimension validated: 1536
[context-server] Scoring observability initialized
[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized
[context-server] Cognitive memory modules initialized
[context-server] Working memory: false, Co-activation: false
[context-server] Extraction adapter initialized
[context-server] Archival manager initialized (background job: not started)
[context-server] Background retry job already running or disabled
[context-server] Shadow feedback evaluation scheduler started
[batch-learning] runBatchLearning error: db.exec is not a function
[context-server] Batch learning: no eligible candidates in window (or flag disabled)
[context-server] Session manager initialized (enabled: false)
[shadow-evaluation-runtime] scheduled cycle failed: db.exec is not a function

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000e: non-memory-aware tools invoke TM-05 tool-dispatch hook at runtime
[22m[39m[context-server] Context MCP server running on stdio

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000f: memory-aware tools keep SK-004 path and skip TM-05 dispatch hook
[22m[39m[context-server] Initializing database...
[context-server] Database initialized
[context-server] Validating embedding API key...

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000f: memory-aware tools keep SK-004 path and skip TM-05 dispatch hook
[22m[39m[context-server] API key validated (provider: test)
[context-server] Lazy loading enabled - embedding model will initialize on first use
[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags
[context-server] Integrity check: 0/0 valid entries
[context-server] Embedding dimension validated: 1536
[context-server] Scoring observability initialized
[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized
[context-server] Cognitive memory modules initialized
[context-server] Working memory: false, Co-activation: false
[context-server] Extraction adapter initialized
[context-server] Archival manager initialized (background job: not started)
[context-server] Background retry job already running or disabled
[context-server] Shadow feedback evaluation scheduler started
[batch-learning] runBatchLearning error: db.exec is not a function
[context-server] Batch learning: no eligible candidates in window (or flag disabled)
[context-server] Session manager initialized (enabled: false)
[shadow-evaluation-runtime] scheduled cycle failed: db.exec is not a function

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000f: memory-aware tools keep SK-004 path and skip TM-05 dispatch hook
[22m[39m[context-server] Context MCP server running on stdio

 [32m✓[39m tests/cross-encoder.vitest.ts [2m([22m[2m28 tests[22m[2m)[22m[33m 763[2mms[22m[39m
[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mHandler: handleCheckpointRestore Happy Path[2m > [22m[2mEXT-H6: handleCheckpointRestore returns success
[22m[39m[checkpoints] Post-restore rebuild "auto-entities" failed (non-fatal): no such table: memory_entities
[graph-signals] snapshotDegrees failed: no such table: causal_edges
[community-detection] detectCommunities failed: no such table: causal_edges
[community-detection] Failed to store assignments: no such table: community_assignments
[checkpoints] Skipping post-restore rebuild "fts-rebuild" because dependencies did not complete: auto-entities
[checkpoints] Post-restore rebuild summary: completed=lineage-backfill, degree-snapshots, community-assignments; skipped=fts-rebuild
[checkpoints] Restored 3 memories, 0 working memory entries from "restore-handler-test"
INFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mHandler: handleCheckpointRestore Happy Path[2m > [22m[2mEXT-H7: handleCheckpointRestore with clearExisting
[22m[39m[checkpoints] Created checkpoint "restore-clear-test" (1051 bytes compressed)

[90mstdout[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mtreats indexMemoryFile status=error as failure and retries once
[22m[39m{"timestamp":"2026-03-25T09:20:13.624Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:1","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mtreats indexMemoryFile status=error as failure and retries once
[22m[39m[memory-save] index attempt 1 failed for /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/atomic-save-fi-5NVDhF/status-error-then-success.md, retrying once: forced error status

[90mstdout[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mtreats indexMemoryFile status=error as failure and retries once
[22m[39m{"timestamp":"2026-03-25T09:20:13.628Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:1","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000g: memory_context resume mode invokes TM-05 compaction hook at runtime
[22m[39m[context-server] Initializing database...
[context-server] Database initialized
[context-server] Validating embedding API key...

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000g: memory_context resume mode invokes TM-05 compaction hook at runtime
[22m[39m[context-server] API key validated (provider: test)
[context-server] Lazy loading enabled - embedding model will initialize on first use
[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags
[context-server] Integrity check: 0/0 valid entries
[context-server] Embedding dimension validated: 1536
[context-server] Scoring observability initialized
[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized
[context-server] Cognitive memory modules initialized
[context-server] Working memory: false, Co-activation: false
[context-server] Extraction adapter initialized
[context-server] Archival manager initialized (background job: not started)
[context-server] Background retry job already running or disabled
[context-server] Shadow feedback evaluation scheduler started
[batch-learning] runBatchLearning error: db.exec is not a function
[context-server] Batch learning: no eligible candidates in window (or flag disabled)
[context-server] Session manager initialized (enabled: false)
[shadow-evaluation-runtime] scheduled cycle failed: db.exec is not a function

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000g: memory_context resume mode invokes TM-05 compaction hook at runtime
[22m[39m[context-server] Context MCP server running on stdio

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000h: memory_context non-resume mode keeps SK-004 memory-aware path
[22m[39m[context-server] Initializing database...
[context-server] Database initialized
[context-server] Validating embedding API key...

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000h: memory_context non-resume mode keeps SK-004 memory-aware path
[22m[39m[context-server] API key validated (provider: test)
[context-server] Lazy loading enabled - embedding model will initialize on first use
[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags
[context-server] Integrity check: 0/0 valid entries
[context-server] Embedding dimension validated: 1536
[context-server] Scoring observability initialized
[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized
[context-server] Cognitive memory modules initialized
[context-server] Working memory: false, Co-activation: false
[context-server] Extraction adapter initialized
[context-server] Archival manager initialized (background job: not started)
[context-server] Background retry job already running or disabled
[context-server] Shadow feedback evaluation scheduler started
[batch-learning] runBatchLearning error: db.exec is not a function
[context-server] Batch learning: no eligible candidates in window (or flag disabled)
[context-server] Session manager initialized (enabled: false)
[shadow-evaluation-runtime] scheduled cycle failed: db.exec is not a function

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000h: memory_context non-resume mode keeps SK-004 memory-aware path
[22m[39m[context-server] Context MCP server running on stdio

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000i: successful responses append auto-surface hints and preserve autoSurfacedContext
[22m[39m[context-server] Initializing database...
[context-server] Database initialized
[context-server] Validating embedding API key...

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000i: successful responses append auto-surface hints and preserve autoSurfacedContext
[22m[39m[context-server] API key validated (provider: test)
[context-server] Lazy loading enabled - embedding model will initialize on first use
[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags
[context-server] Integrity check: 0/0 valid entries
[context-server] Embedding dimension validated: 1536
[context-server] Scoring observability initialized
[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized
[context-server] Cognitive memory modules initialized
[context-server] Working memory: false, Co-activation: false
[context-server] Extraction adapter initialized
[context-server] Archival manager initialized (background job: not started)
[context-server] Background retry job already running or disabled
[context-server] Shadow feedback evaluation scheduler started
[batch-learning] runBatchLearning error: db.exec is not a function
[context-server] Batch learning: no eligible candidates in window (or flag disabled)
[context-server] Session manager initialized (enabled: false)
[shadow-evaluation-runtime] scheduled cycle failed: db.exec is not a function

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000i: successful responses append auto-surface hints and preserve autoSurfacedContext
[22m[39m[context-server] Context MCP server running on stdio

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000j: final tokenCount matches the serialized envelope after hints and tokenBudget injection
[22m[39m[context-server] Initializing database...
[context-server] Database initialized
[context-server] Validating embedding API key...

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000j: final tokenCount matches the serialized envelope after hints and tokenBudget injection
[22m[39m[context-server] API key validated (provider: test)
[context-server] Lazy loading enabled - embedding model will initialize on first use
[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags
[context-server] Integrity check: 0/0 valid entries
[context-server] Embedding dimension validated: 1536
[context-server] Scoring observability initialized
[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized
[context-server] Cognitive memory modules initialized
[context-server] Working memory: false, Co-activation: false
[context-server] Extraction adapter initialized
[context-server] Archival manager initialized (background job: not started)
[context-server] Background retry job already running or disabled
[context-server] Shadow feedback evaluation scheduler started
[batch-learning] runBatchLearning error: db.exec is not a function
[context-server] Batch learning: no eligible candidates in window (or flag disabled)
[context-server] Session manager initialized (enabled: false)
[shadow-evaluation-runtime] scheduled cycle failed: db.exec is not a function

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000j: final tokenCount matches the serialized envelope after hints and tokenBudget injection
[22m[39m[context-server] Context MCP server running on stdio

[90mstdout[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mtreats indexMemoryFile status=rejected as non-retry rollback outcome
[22m[39m{"timestamp":"2026-03-25T09:20:13.685Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:1","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000l: startup sets dynamic instructions using live memory stats and channel flags
[22m[39m[context-server] Initializing database...
[context-server] Database initialized
[context-server] Validating embedding API key...

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000l: startup sets dynamic instructions using live memory stats and channel flags
[22m[39m[context-server] API key validated (provider: test)
[context-server] Lazy loading enabled - embedding model will initialize on first use
[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags
[context-server] Integrity check: 0/0 valid entries
[context-server] Embedding dimension validated: 1536
[context-server] Scoring observability initialized
[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized
[context-server] BM25 index rebuilt from database: 0 documents
[context-server] Cognitive memory modules initialized
[context-server] Working memory: false, Co-activation: false
[context-server] Extraction adapter initialized
[context-server] Archival manager initialized (background job: not started)
[context-server] Background retry job already running or disabled
[context-server] Shadow feedback evaluation scheduler started
[batch-learning] runBatchLearning error: db.exec is not a function
[context-server] Batch learning: no eligible candidates in window (or flag disabled)
[context-server] Session manager initialized (enabled: false)
[shadow-evaluation-runtime] scheduled cycle failed: db.exec is not a function

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000l: startup sets dynamic instructions using live memory stats and channel flags
[22m[39m[context-server] Context MCP server running on stdio

[90mstdout[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mdoes not persist embedding cache writes before hard quality-gate rejection
[22m[39m{"timestamp":"2026-03-25T09:20:13.719Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:1","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mdoes not persist embedding cache writes before hard quality-gate rejection
[22m[39m[memory-save] TM-04: Quality gate REJECTED save for quality-gate-rejected.md: signal density too low

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000m: dynamic instructions are regenerated per MCP initialization (not hardcoded)
[22m[39m[context-server] Initializing database...
[context-server] Database initialized
[context-server] Validating embedding API key...

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000m: dynamic instructions are regenerated per MCP initialization (not hardcoded)
[22m[39m[context-server] API key validated (provider: test)
[context-server] Lazy loading enabled - embedding model will initialize on first use
[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags
[context-server] Integrity check: 0/0 valid entries
[context-server] Embedding dimension validated: 1536
[context-server] Scoring observability initialized
[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized
[context-server] Cognitive memory modules initialized
[context-server] Working memory: false, Co-activation: false
[context-server] Extraction adapter initialized
[context-server] Archival manager initialized (background job: not started)
[context-server] Background retry job already running or disabled
[context-server] Shadow feedback evaluation scheduler started
[batch-learning] runBatchLearning error: db.exec is not a function
[context-server] Batch learning: no eligible candidates in window (or flag disabled)
[context-server] Session manager initialized (enabled: false)
[shadow-evaluation-runtime] scheduled cycle failed: db.exec is not a function

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000m: dynamic instructions are regenerated per MCP initialization (not hardcoded)
[22m[39m[context-server] Context MCP server running on stdio

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000m: dynamic instructions are regenerated per MCP initialization (not hardcoded)
[22m[39m[context-server] Initializing database...
[context-server] Database initialized
[context-server] Validating embedding API key...

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000m: dynamic instructions are regenerated per MCP initialization (not hardcoded)
[22m[39m[context-server] API key validated (provider: test)
[context-server] Lazy loading enabled - embedding model will initialize on first use
[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags
[context-server] Integrity check: 0/0 valid entries
[context-server] Embedding dimension validated: 1536
[context-server] Scoring observability initialized
[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized
[context-server] Cognitive memory modules initialized
[context-server] Working memory: false, Co-activation: false
[context-server] Extraction adapter initialized
[context-server] Archival manager initialized (background job: not started)
[context-server] Background retry job already running or disabled
[context-server] Shadow feedback evaluation scheduler started
[batch-learning] runBatchLearning error: db.exec is not a function
[context-server] Batch learning: no eligible candidates in window (or flag disabled)
[context-server] Session manager initialized (enabled: false)
[shadow-evaluation-runtime] scheduled cycle failed: db.exec is not a function

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000m: dynamic instructions are regenerated per MCP initialization (not hardcoded)
[22m[39m[context-server] Context MCP server running on stdio

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000n: dynamic instructions are skipped when SPECKIT_DYNAMIC_INIT=false
[22m[39m[context-server] Initializing database...
[context-server] Database initialized
[context-server] Validating embedding API key...

[90mstderr[2m | tests/context-server.vitest.ts[2m > [22m[2mContext Server[2m > [22m[2mGroup 3b: After-Tool Callback Pipeline[2m > [22m[2mT000n: dynamic instructions are skipped when SPECKIT_DYNAMIC_INIT=false
[22m[39m[context-server] API key validated (provider: test)
[context-server] Lazy loading enabled - embedding model will initialize on first use
[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags
[context-server] Integrity check: 0/0 valid entries
[context-server] Embedding dimension validated: 1536
[context-server] Scoring observability initialized
[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized
[context-server] Cognitive memory modules initialized
[context-server] Working memory: false, Co-activation: false
[context-server] Extraction adapter initialized
[context-server] Archival manager initialized (background job: not started)
[context-server] Background retry job already running or disabled
[context-server] Shadow feedback evaluation scheduler started
[batch-learning] runBatchLearning error: db.exec is not a function
[context-server] Batch learning: no eligible candidates in window (or flag disabled)
[context-server] Session manager initialized (enabled: false)
[shadow-evaluation-runtime] scheduled cycle failed: db.exec is not a function
[context-server] Context MCP server running on stdio

[90mstderr[2m | tests/integration-search-pipeline.vitest.ts[2m > [22m[2mIntegration Search Pipeline (T525) [deferred - requires DB test fixtures][2m > [22m[2mPipeline Input Validation[2m > [22m[2mT525-2: Valid args accepted by pipeline
[22m[39m[memory-search] Intent auto-detected as 'fix_bug' (confidence: 0.16)

[90mstdout[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mpersists deferred embedding cache write after quality gate passes
[22m[39m{"timestamp":"2026-03-25T09:20:13.770Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:1","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/regression-010-index-large-files.vitest.ts[2m > [22m[2mRegression 010: index large files guardrails[2m > [22m[2mcollapses sibling chunk hits and reassembles content
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstdout[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mpersists quality-loop trigger phrase fixes into downstream save inputs
[22m[39m{"timestamp":"2026-03-25T09:20:13.800Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:1","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mpersists quality-loop trigger phrase fixes into downstream save inputs
[22m[39m[memory-save] Quality loop applied 1 auto-fix(es) for quality-loop-trigger-fix.md

[90mstderr[2m | tests/memory-save-pipeline-enforcement.vitest.ts[2m > [22m[2mCat 0: Golden Path[2m > [22m[2maccepts a fully valid memory through the entire pipeline
[22m[39m[memory-summaries] Generated summary for memory #1

[90mstdout[2m | tests/memory-save-pipeline-enforcement.vitest.ts[2m > [22m[2mCat 1: Parser Validation[2m > [22m[2mrejects content shorter than 5 chars
[22m[39m{"timestamp":"2026-03-25T09:20:13.814Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:0","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/memory-save-pipeline-enforcement.vitest.ts[2m > [22m[2mCat 1: Parser Validation[2m > [22m[2mrejects content shorter than 5 chars
[22m[39m[memory-save] V-rule hard block for too-short.md: V13

[90mstderr[2m | tests/integration-session-dedup.vitest.ts[2m > [22m[2mIntegration Session Dedup (T531) [deferred - requires DB test fixtures][2m > [22m[2mSearch Handler Session Dedup Parameters[2m > [22m[2mT531-1: sessionId parameter accepted by search
[22m[39m[memory-search] Intent auto-detected as 'find_decision' (confidence: 0.16)

 [32m✓[39m tests/context-server.vitest.ts [2m([22m[2m346 tests[22m[2m)[22m[33m 969[2mms[22m[39m
       [33m[2m✓[22m[39m T000d: callback runs after dispatchTool resolves [33m 662[2mms[22m[39m
[90mstdout[2m | tests/memory-save-pipeline-enforcement.vitest.ts[2m > [22m[2mCat 1: Parser Validation[2m > [22m[2mrejects content exceeding MAX_CONTENT_LENGTH
[22m[39m{"timestamp":"2026-03-25T09:20:13.823Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:0","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstdout[2m | tests/memory-save-pipeline-enforcement.vitest.ts[2m > [22m[2mCat 1: Parser Validation[2m > [22m[2mrejects empty content
[22m[39m{"timestamp":"2026-03-25T09:20:13.825Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:0","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/memory-save-pipeline-enforcement.vitest.ts[2m > [22m[2mCat 1: Parser Validation[2m > [22m[2mrejects empty content
[22m[39m[memory-save] V-rule hard block for empty.md: V13

[90mstdout[2m | tests/memory-save-pipeline-enforcement.vitest.ts[2m > [22m[2mCat 1: Parser Validation[2m > [22m[2mrejects whitespace-only content
[22m[39m{"timestamp":"2026-03-25T09:20:13.826Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:0","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/memory-save-pipeline-enforcement.vitest.ts[2m > [22m[2mCat 1: Parser Validation[2m > [22m[2mrejects whitespace-only content
[22m[39m[memory-save] V-rule hard block for whitespace.md: V13

[90mstdout[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mpasses same-path exclusion into content-hash dedup after unchanged miss
[22m[39m{"timestamp":"2026-03-25T09:20:13.834Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:1","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/handler-helpers.vitest.ts[2m > [22m[2mprocessCausalLinks[2m > [22m[2mskips unknown link types
[22m[39m[causal-links] Unknown link type: unknown_type

[90mstderr[2m | tests/handler-helpers.vitest.ts[2m > [22m[2mprocessCausalLinks[2m > [22m[2mresolves & inserts valid link
[22m[39m[causal-links] Inserted edge: 1 -[caused]-> 10

[90mstderr[2m | tests/handler-helpers.vitest.ts[2m > [22m[2mprocessCausalLinks[2m > [22m[2mhandles mixed resolved/unresolved
[22m[39m[causal-links] Inserted edge: 1 -[caused]-> 10
[causal-links] Inserted edge: 2 -[caused]-> 10

[90mstderr[2m | tests/handler-helpers.vitest.ts[2m > [22m[2mprocessCausalLinks[2m > [22m[2mcaused_by edge direction correct (reverse=true)
[22m[39m[causal-links] Inserted edge: 1 -[caused]-> 10

[90mstderr[2m | tests/handler-helpers.vitest.ts[2m > [22m[2mprocessCausalLinks[2m > [22m[2msupersedes edge direction correct (reverse=false)
[22m[39m[causal-links] Inserted edge: 10 -[supersedes]-> 3

[90mstderr[2m | tests/handler-helpers.vitest.ts[2m > [22m[2mDB-dependent helpers[2m > [22m[2mreinforceExistingMemory: error status for missing ID
[22m[39m[memory-save] PE reinforcement failed: Memory 99999 not found for reinforcement

[90mstderr[2m | tests/handler-helpers.vitest.ts[2m > [22m[2mDB-dependent helpers[2m > [22m[2mmarkMemorySuperseded: returns boolean
[22m[39m[PE-Gate] Memory 99999 not found, cannot mark as superseded

 [32m✓[39m tests/handler-helpers.vitest.ts [2m([22m[2m63 tests[22m[2m)[22m[33m 735[2mms[22m[39m
[90mstdout[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mdoes not rewrite file before later hard rejection under atomic save
[22m[39m{"timestamp":"2026-03-25T09:20:13.853Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:1","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mdoes not rewrite file before later hard rejection under atomic save
[22m[39m[memory-save] Quality loop applied 1 auto-fix(es) for reject-no-prewrite.md before pending-file promotion

[90mstderr[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mdoes not rewrite file before later hard rejection under atomic save
[22m[39m[memory-save] TM-04: Quality gate REJECTED save for reject-no-prewrite.md: signal density too low

[90mstderr[2m | tests/memory-save-pipeline-enforcement.vitest.ts[2m > [22m[2mCat 5: Save Quality Gate[2m > [22m[2mrejects when signal density is below 0.4
[22m[39m[QUALITY-GATE] warn-only | score: 0.06 | would-reject: true | reasons: [Title is missing or empty, Content too short: 5 chars (min: 50), Signal density 0.06 below threshold 0.4, Low title quality: use a specific, descriptive title, No trigger phrases: add at least 1-2 trigger phrases, No YAML frontmatter: add metadata block]

[90mstderr[2m | tests/handler-memory-stats-edge.vitest.ts[2m > [22m[2mhandleMemoryStats Edge Cases (T007a)[2m > [22m[2mT007a-S14: checkDatabaseUpdated failures return MCP error response with requestId
[22m[39m[memory-stats] Database refresh failed [requestId=2ec86930-48af-4fba-9be4-9c95cdd44459]: marker read failed

[90mstderr[2m | tests/memory-save-pipeline-enforcement.vitest.ts[2m > [22m[2mCat 5: Save Quality Gate[2m > [22m[2mdetects near-duplicate via semantic similarity >= 0.92
[22m[39m[QUALITY-GATE] warn-only | score: 0.73 | would-reject: true | reasons: [Near-duplicate detected: memory #42 (similarity: 95.0% >= 92%)]

[90mstderr[2m | tests/memory-save-pipeline-enforcement.vitest.ts[2m > [22m[2mCat 5: Save Quality Gate[2m > [22m[2mwarn-only mode allows wouldReject without blocking
[22m[39m[QUALITY-GATE] warn-only | score: 0.06 | would-reject: true | reasons: [Title is missing or empty, Content too short: 5 chars (min: 50), Signal density 0.06 below threshold 0.4, Low title quality: use a specific, descriptive title, No trigger phrases: add at least 1-2 trigger phrases, No YAML frontmatter: add metadata block]

 [32m✓[39m tests/handler-memory-stats-edge.vitest.ts [2m([22m[2m14 tests[22m[2m)[22m[33m 407[2mms[22m[39m
[90mstderr[2m | tests/memory-save-pipeline-enforcement.vitest.ts[2m > [22m[2mCat 6: Cross-Gate Interactions[2m > [22m[2mcontent that passes template contract can still fail save quality gate
[22m[39m[QUALITY-GATE] warn-only | score: 0.40 | would-reject: true | reasons: [Title is missing or empty]

[90mstdout[2m | tests/memory-save-pipeline-enforcement.vitest.ts[2m > [22m[2mCat 6: Cross-Gate Interactions[2m > [22m[2mquality loop rejection blocks sufficiency evaluation (gate ordering proof)
[22m[39m{"timestamp":"2026-03-25T09:20:13.870Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:0","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstdout[2m | tests/memory-save-pipeline-enforcement.vitest.ts[2m > [22m[2mCat 6: Cross-Gate Interactions[2m > [22m[2msufficiency rejection blocks template contract (gate ordering proof)
[22m[39m{"timestamp":"2026-03-25T09:20:13.873Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:4","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstdout[2m | tests/memory-save-pipeline-enforcement.vitest.ts[2m > [22m[2mCat 6: Cross-Gate Interactions[2m > [22m[2mtemplate contract rejection blocks save quality gate (gate ordering proof)
[22m[39m{"timestamp":"2026-03-25T09:20:13.874Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:0","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstdout[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mdoes not rewrite file when PE gating short-circuits before create path
[22m[39m{"timestamp":"2026-03-25T09:20:13.877Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:1","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mdoes not rewrite file when PE gating short-circuits before create path
[22m[39m[memory-save] Quality loop applied 1 auto-fix(es) for pe-early-return-no-prewrite.md

[90mstderr[2m | tests/handler-checkpoints.vitest.ts[2m > [22m[2mHandler Checkpoints (T521, T102) [deferred - requires DB test fixtures]
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mHandler: handleCheckpointRestore Happy Path[2m > [22m[2mEXT-H7: handleCheckpointRestore with clearExisting
[22m[39m[checkpoints] Post-restore rebuild "auto-entities" failed (non-fatal): no such table: memory_entities
[graph-signals] snapshotDegrees failed: no such table: causal_edges
[community-detection] detectCommunities failed: no such table: causal_edges
[community-detection] Failed to store assignments: no such table: community_assignments
[checkpoints] Skipping post-restore rebuild "fts-rebuild" because dependencies did not complete: auto-entities
[checkpoints] Post-restore rebuild summary: completed=lineage-backfill, degree-snapshots, community-assignments; skipped=fts-rebuild
[checkpoints] Restored 3 memories, 0 working memory entries from "restore-clear-test"

[90mstdout[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mrejects insufficient context before embedding even when force=true
[22m[39m{"timestamp":"2026-03-25T09:20:13.894Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:1","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mHandler: handleCheckpointDelete Happy Path[2m > [22m[2mEXT-H8: handleCheckpointDelete returns success
[22m[39m[checkpoints] Created checkpoint "delete-handler-test" (1052 bytes compressed)

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mHandler: handleMemoryValidate Happy Path[2m > [22m[2mEXT-H11: handleMemoryValidate negative validation
[22m[39m[confidence-tracker] negative feedback recorded {
  chunkId: [33m1[39m,
  previousConfidence: [33m0.6[39m,
  newConfidence: [33m0.5499999999999999[39m,
  decrement: [33m0.05[39m
}

[90mstderr[2m | tests/checkpoints-extended.vitest.ts[2m > [22m[2mCHECKPOINTS EXTENDED TESTS [deferred - requires DB test fixtures][2m > [22m[2mHandler: Response Envelope Format[2m > [22m[2mEXT-H12: response follows MCP envelope format
[22m[39m[checkpoints] Created checkpoint "format-test-cp" (1102 bytes compressed)

 [32m✓[39m tests/checkpoints-extended.vitest.ts [2m([22m[2m38 tests[22m[2m | [22m[33m4 skipped[39m[2m)[22m[33m 611[2mms[22m[39m
[90mstdout[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mrejects template-contract violations before embedding
[22m[39m{"timestamp":"2026-03-25T09:20:13.912Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:1","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/memory-save-pipeline-enforcement.vitest.ts
[22m[39mINFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index

 [32m✓[39m tests/memory-save-pipeline-enforcement.vitest.ts [2m([22m[2m57 tests[22m[2m)[22m[33m 461[2mms[22m[39m
     [33m[2m✓[22m[39m accepts a fully valid memory through the entire pipeline [33m 337[2mms[22m[39m
[90mstdout[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mreports insufficiency explicitly during dry-run without indexing
[22m[39m{"timestamp":"2026-03-25T09:20:13.933Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:1","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

 [32m✓[39m tests/integration-causal-graph.vitest.ts [2m([22m[2m17 tests[22m[2m)[22m[33m 709[2mms[22m[39m
[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mEnriched/Enhanced Search (edge cases without API key)[2m > [22m[2mgenerateQueryEmbedding — returns null for empty query
[22m[39m[vector-index] Empty query provided for embedding

[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mgetMemoryPreview[2m > [22m[2mreturns preview with empty content for missing file
[22m[39mINFO  [VectorIndex] Deferred indexing: Memory 7 saved without embedding (BM25/FTS5 searchable)

[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mvalidateFilePath[2m > [22m[2mrejects path outside allowed bases
[22m[39m[utils] Path traversal blocked: /etc/passwd -> /private/etc/passwd

[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mvalidateFilePath[2m > [22m[2mrejects path traversal (../..)
[22m[39m[utils] Path traversal blocked: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/etc/passwd -> /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/etc/passwd

[90mstderr[2m | tests/vector-index-impl.vitest.ts[2m > [22m[2mVector Index Implementation [deferred - requires DB test fixtures][2m > [22m[2mcloseDb[2m > [22m[2mcloses and getDb re-initializes
[22m[39mINFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index

 [32m✓[39m tests/vector-index-impl.vitest.ts [2m([22m[2m146 tests[22m[2m | [22m[33m10 skipped[39m[2m)[22m[33m 1139[2mms[22m[39m
       [33m[2m✓[22m[39m vectorSearchEnriched — exported and falls back to keyword search without embedding [33m 306[2mms[22m[39m
       [33m[2m✓[22m[39m multiConceptSearchEnriched — exported and returns array for string concepts [33m 498[2mms[22m[39m
[90mstdout[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mreturns dry-run response without indexing when dryRun and skipPreflight are both true
[22m[39m{"timestamp":"2026-03-25T09:20:13.977Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:1","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstdout[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mpersists quality-loop fixed content after successful chunked indexing
[22m[39m{"timestamp":"2026-03-25T09:20:14.021Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:1","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mpersists quality-loop fixed content after successful chunked indexing
[22m[39m[memory-save] Quality loop applied 1 auto-fix(es) for chunked-quality-fix.md

[90mstderr[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mpersists quality-loop fixed content after successful chunked indexing
[22m[39m[memory-save] File exceeds chunking threshold (1078 chars), using chunked indexing

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Triggers Schema[2m > [22m[2mR11-SCH01: migrateLearnedTriggers adds column
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Triggers Schema[2m > [22m[2mR11-SCH02: migrateLearnedTriggers is idempotent
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Triggers Schema[2m > [22m[2mR11-SCH03: CRITICAL - FTS5 isolation verified
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstdout[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mdoes not persist quality-loop fixed content when chunked indexing fails
[22m[39m{"timestamp":"2026-03-25T09:20:14.033Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:1","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mdoes not persist quality-loop fixed content when chunked indexing fails
[22m[39m[memory-save] Quality loop applied 1 auto-fix(es) for chunked-quality-fix-error.md

[90mstderr[2m | tests/handler-memory-save.vitest.ts[2m > [22m[2mHandler Memory Save (T518) [deferred - requires DB test fixtures][2m > [22m[2matomic-save failure injection[2m > [22m[2mdoes not persist quality-loop fixed content when chunked indexing fails
[22m[39m[memory-save] File exceeds chunking threshold (1078 chars), using chunked indexing

 [32m✓[39m tests/handler-memory-save.vitest.ts [2m([22m[2m32 tests[22m[2m)[22m[33m 577[2mms[22m[39m
[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Triggers Schema[2m > [22m[2mR11-SCH05: rollbackLearnedTriggers removes column
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added
[learned-triggers-schema] Rollback complete: learned_triggers column removed

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Feedback Core Operations[2m > [22m[2mR11-CO01: recordSelection returns feature_disabled when off
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Feedback Core Operations[2m > [22m[2mR11-CO02: recordSelection enforces top-3 exclusion (Safeguard #5)
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Feedback Core Operations[2m > [22m[2mR11-CO03: recordSelection rejects <72h memories (Safeguard #7)
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Feedback Core Operations[2m > [22m[2mR11-CO04: recordSelection is log-only during shadow period (no learned trigger persistence)
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

 [32m✓[39m tests/regression-010-index-large-files.vitest.ts [2m([22m[2m12 tests[22m[2m)[22m[33m 1249[2mms[22m[39m
     [33m[2m✓[22m[39m collapses sibling chunk hits and reassembles content [33m 356[2mms[22m[39m
[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Feedback Core Operations[2m > [22m[2mR11-CO05: recordSelection applies terms when all safeguards pass
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Feedback Core Operations[2m > [22m[2mR11-CO06: rate cap - max 8 terms per memory (Safeguard #4)
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Feedback Core Operations[2m > [22m[2mR11-CO06b: applyLearnedTriggers deduplicates repeated terms within one call
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Feedback Core Operations[2m > [22m[2mR11-CO07: queryLearnedTriggers returns matches at 0.7x weight
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Feedback Core Operations[2m > [22m[2mR11-CO08: queryLearnedTriggers returns empty when disabled
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Feedback Core Operations[2m > [22m[2mR11-CO09: shadow period enforced — queryLearnedTriggers returns empty during first 7 days
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Feedback Expiry & Rollback[2m > [22m[2mR11-EX01: expireLearnedTerms removes expired terms (Safeguard #2)
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Feedback Expiry & Rollback[2m > [22m[2mR11-EX02: clearAllLearnedTriggers resets all memories (Safeguard #9)
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

 [32m✓[39m tests/dead-code-regression.vitest.ts [2m([22m[2m12 tests[22m[2m)[22m[32m 292[2mms[22m[39m
[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Feedback Expiry & Rollback[2m > [22m[2mR11-EX02: clearAllLearnedTriggers resets all memories (Safeguard #9)
[22m[39m[learned-feedback] Rollback complete: cleared learned triggers from 1 memories

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Feedback Expiry & Rollback[2m > [22m[2mR11-EX03: clearAllLearnedTriggers logs to audit
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Feedback Expiry & Rollback[2m > [22m[2mR11-EX03: clearAllLearnedTriggers logs to audit
[22m[39m[learned-feedback] Rollback complete: cleared learned triggers from 1 memories

 [32m✓[39m tests/folder-scoring-overflow.vitest.ts [2m([22m[2m2 tests[22m[2m)[22m[33m 484[2mms[22m[39m
[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Feedback Audit Log (Safeguard #10)[2m > [22m[2mR11-AL01: getAuditLog returns entries after selection
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

 [32m✓[39m tests/folder-discovery-integration.vitest.ts [2m([22m[2m44 tests[22m[2m)[22m[33m 652[2mms[22m[39m
[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Feedback Audit Log (Safeguard #10)[2m > [22m[2mR11-AL02: getAuditLog supports limit
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Feedback Audit Log (Safeguard #10)[2m > [22m[2mR11-AL03: getAuditLog supports global query (no memoryId)
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mLearned Feedback Audit Log (Safeguard #10)[2m > [22m[2mR11-AL04: audit entries set shadow mode true during shadow period
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mAuto-Promotion Engine (T002a)[2m > [22m[2mR11-AP07: executeAutoPromotion updates database
[22m[39m[auto-promotion] Memory 1 promoted: normal -> important (5 validations)

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mAuto-Promotion Engine (T002a)[2m > [22m[2mR11-AP12: safeguards cap promotions to 3 per 8-hour rolling window
[22m[39m[auto-promotion] Memory 1 promoted: normal -> important (5 validations)
[auto-promotion] Memory 2 promoted: normal -> important (5 validations)
[auto-promotion] Memory 3 promoted: normal -> important (5 validations)

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mAuto-Promotion Engine (T002a)[2m > [22m[2mR11-AP13: old promotions outside the 8-hour window do not block promotion
[22m[39m[auto-promotion] Memory 5 promoted: normal -> important (5 validations)

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mFTS5 Isolation Integration (CRITICAL)[2m > [22m[2mR11-FTS01: learned_triggers NOT in FTS5 after migration
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mFTS5 Isolation Integration (CRITICAL)[2m > [22m[2mR11-FTS02: learned_triggers NOT in FTS5 after applying triggers
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mFTS5 Isolation Integration (CRITICAL)[2m > [22m[2mR11-FTS03: learned_triggers NOT in FTS5 after recordSelection
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mFTS5 Isolation Integration (CRITICAL)[2m > [22m[2mR11-FTS04: learned_triggers NOT in FTS5 after expiry
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

 [32m✓[39m tests/cli.vitest.ts [2m([22m[2m6 tests[22m[2m)[22m[33m 1425[2mms[22m[39m
     [33m[2m✓[22m[39m returns errors for invalid command and missing required args [33m 415[2mms[22m[39m
[90mstderr[2m | tests/handler-checkpoints.vitest.ts[2m > [22m[2mHandler Checkpoints (T521, T102) [deferred - requires DB test fixtures][2m > [22m[2mhandleCheckpointRestore Validation[2m > [22m[2mT521-R5: Returns MCP success-with-warning when restore is partial
[22m[39mINFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mFTS5 Isolation Integration (CRITICAL)[2m > [22m[2mR11-FTS05: learned_triggers NOT in FTS5 after rollback
[22m[39m[learned-triggers-schema] Migration complete: learned_triggers column added

[90mstderr[2m | tests/learned-feedback.vitest.ts[2m > [22m[2mFTS5 Isolation Integration (CRITICAL)[2m > [22m[2mR11-FTS05: learned_triggers NOT in FTS5 after rollback
[22m[39m[learned-feedback] Rollback complete: cleared learned triggers from 1 memories

 [32m✓[39m tests/learned-feedback.vitest.ts [2m([22m[2m74 tests[22m[2m)[22m[32m 207[2mms[22m[39m
[90mstderr[2m | tests/checkpoint-completeness.vitest.ts[2m > [22m[2mCheckpoint completeness[2m > [22m[2mround-trips authoritative tables and rebuilds derived tables after restore
[22m[39m[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

 [32m✓[39m tests/handler-checkpoints.vitest.ts [2m([22m[2m37 tests[22m[2m)[22m[33m 352[2mms[22m[39m
       [33m[2m✓[22m[39m T521-R5: Returns MCP success-with-warning when restore is partial [33m 327[2mms[22m[39m
[90mstderr[2m | tests/handler-causal-graph.vitest.ts[2m > [22m[2mHandler Causal Graph (T523) [deferred - requires DB test fixtures][2m > [22m[2mhandleMemoryDriftWhy Validation[2m > [22m[2mT523-DW2: Valid memoryId returns response
[22m[39mINFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index

 [32m✓[39m tests/pipeline-v2.vitest.ts [2m([22m[2m27 tests[22m[2m)[22m[32m 164[2mms[22m[39m
[90mstderr[2m | tests/checkpoint-completeness.vitest.ts[2m > [22m[2mCheckpoint completeness[2m > [22m[2mround-trips authoritative tables and rebuilds derived tables after restore
[22m[39m[checkpoints] Created checkpoint "checkpoint-complete" (2826 bytes compressed)
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23
[checkpoints] Post-restore rebuild summary: completed=lineage-backfill, auto-entities, degree-snapshots, community-assignments, fts-rebuild; skipped=none
[checkpoints] Restored 2 memories, 1 working memory entries from "checkpoint-complete"

[90mstderr[2m | tests/tool-cache.vitest.ts[2m > [22m[2mTool Cache (T012-T015)[2m > [22m[2mT015: Cache invalidation on write operations[2m > [22m[2mshould invalidate on write operations
[22m[39m[tool-cache] Invalidated 2 entries after save

[90mstderr[2m | tests/tool-cache.vitest.ts[2m > [22m[2mTool Cache (T012-T015)[2m > [22m[2mT015: Cache invalidation on write operations[2m > [22m[2mshould invalidate memory_list_folders on write
[22m[39m[tool-cache] Invalidated 1 entries after save

[90mstderr[2m | tests/tool-cache.vitest.ts[2m > [22m[2mTool Cache (T012-T015)[2m > [22m[2mT015: Cache invalidation on write operations[2m > [22m[2mshould invalidate memory_read on write
[22m[39m[tool-cache] Invalidated 1 entries after update

 [32m✓[39m tests/shadow-scoring-holdout.vitest.ts [2m([22m[2m87 tests[22m[2m)[22m[32m 169[2mms[22m[39m
 [32m✓[39m tests/graph-lifecycle.vitest.ts [2m([22m[2m69 tests[22m[2m)[22m[33m 323[2mms[22m[39m
[90mstderr[2m | tests/checkpoint-completeness.vitest.ts[2m > [22m[2mCheckpoint completeness[2m > [22m[2mstores the manifest and omits skip tables from snapshot payloads
[22m[39m[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/checkpoint-completeness.vitest.ts[2m > [22m[2mCheckpoint completeness[2m > [22m[2mstores the manifest and omits skip tables from snapshot payloads
[22m[39m[checkpoints] Created checkpoint "checkpoint-manifest" (2825 bytes compressed)

 [32m✓[39m tests/checkpoint-completeness.vitest.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 227[2mms[22m[39m
 [32m✓[39m tests/handler-causal-graph.vitest.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 154[2mms[22m[39m
[90mstderr[2m | tests/tool-cache.vitest.ts[2m > [22m[2mTool Cache (T012-T015)[2m > [22m[2mLifecycle management[2m > [22m[2mshould clear cache on shutdown
[22m[39m[tool-cache] Shutdown complete

 [32m✓[39m tests/tool-cache.vitest.ts [2m([22m[2m65 tests[22m[2m)[22m[32m 299[2mms[22m[39m
 [32m✓[39m tests/ground-truth.vitest.ts [2m([22m[2m75 tests[22m[2m)[22m[32m 193[2mms[22m[39m
[90mstderr[2m | tests/encoding-intent.vitest.ts[2m > [22m[2mencoding_intent persistence integration[2m > [22m[2mR16-INT-01: indexMemory persists explicit encoding_intent for embedded rows
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/encoding-intent.vitest.ts[2m > [22m[2mencoding_intent persistence integration[2m > [22m[2mR16-INT-02: indexMemoryDeferred persists explicit encoding_intent for deferred rows
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23
INFO  [VectorIndex] Deferred indexing: Memory 1 saved without embedding (BM25/FTS5 searchable)

 [32m✓[39m tests/encoding-intent.vitest.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 155[2mms[22m[39m
 [32m✓[39m tests/bm25-baseline.vitest.ts [2m([22m[2m36 tests[22m[2m)[22m[32m 123[2mms[22m[39m
[90mstderr[2m | tests/lazy-loading.vitest.ts[2m > [22m[2mLazy Loading Startup Behavior (T016-T019)[2m > [22m[2mT018: empty inputs return null without triggering provider init
[22m[39m[embeddings] Empty document text

[90mstderr[2m | tests/lazy-loading.vitest.ts[2m > [22m[2mLazy Loading Startup Behavior (T016-T019)[2m > [22m[2mT018: empty inputs return null without triggering provider init
[22m[39m[embeddings] Empty query

[90mstderr[2m | tests/lazy-loading.vitest.ts[2m > [22m[2mLazy Loading Startup Behavior (T016-T019)[2m > [22m[2mT019: provider initializes lazily on first provider-dependent call
[22m[39m[factory] Using provider: hf-local (Explicit EMBEDDINGS_PROVIDER variable)

[90mstderr[2m | tests/lazy-loading.vitest.ts[2m > [22m[2mLazy Loading Startup Behavior (T016-T019)[2m > [22m[2mT019: provider initializes lazily on first provider-dependent call
[22m[39m[embeddings] Provider created lazily (0ms)

 [32m✓[39m tests/lazy-loading.vitest.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 96[2mms[22m[39m
[90mstderr[2m | tests/memory-delete-cascade.vitest.ts[2m > [22m[2mPhase 5 cascade delete cleanup[2m > [22m[2mdeletes derived summaries, entities, communities, and graph edges with the base memory
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23
INFO  [VectorIndex] Deferred indexing: Memory 1 saved without embedding (BM25/FTS5 searchable)
INFO  [VectorIndex] Deferred indexing: Memory 2 saved without embedding (BM25/FTS5 searchable)

[90mstderr[2m | tests/memory-delete-cascade.vitest.ts[2m > [22m[2mPhase 5 cascade delete cleanup[2m > [22m[2mbulk delete cleans the same ancillary rows as single delete
[22m[39mINFO  [VectorIndex] Deferred indexing: Memory 3 saved without embedding (BM25/FTS5 searchable)
INFO  [VectorIndex] Deferred indexing: Memory 4 saved without embedding (BM25/FTS5 searchable)

 [32m✓[39m tests/memory-delete-cascade.vitest.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 133[2mms[22m[39m
[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstdout[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2mdoes not emit postMutationHooks for duplicate-content no-op saves
[22m[39m{"timestamp":"2026-03-25T09:20:14.614Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:2","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2mdoes not emit postMutationHooks for duplicate-content no-op saves
[22m[39m[memory-save] T306: Async embedding mode - deferring embedding for original.md

 [32m✓[39m tests/eval-logger.vitest.ts [2m([22m[2m27 tests[22m[2m)[22m[32m 124[2mms[22m[39m
 [32m✓[39m tests/decay-delete-race.vitest.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 84[2mms[22m[39m
[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2mdoes not emit postMutationHooks for duplicate-content no-op saves
[22m[39m[memory-save] Using deferred indexing for original.md
INFO  [VectorIndex] Deferred indexing: Memory 1 saved without embedding (BM25/FTS5 searchable)

[90mstdout[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2mdoes not emit postMutationHooks for duplicate-content no-op saves
[22m[39m{"timestamp":"2026-03-25T09:20:14.631Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:2","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2mdoes not emit postMutationHooks for duplicate-content no-op saves
[22m[39m[memory-save] T306: Async embedding mode - deferring embedding for duplicate.md

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2mdoes not emit postMutationHooks for duplicate-content no-op saves
[22m[39m[memory-save] T054: Duplicate content detected (hash match id=1), skipping embedding

[90mstderr[2m | tests/local-reranker.vitest.ts[2m > [22m[2mlocal-reranker fallback on error[2m > [22m[2mreturns original candidates when model load fails
[22m[39m[local-reranker] fallback to original ordering: A dynamic import callback was not specified.

[90mstdout[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2mmemory_save success response exposes postMutationHooks contract fields and types
[22m[39m{"timestamp":"2026-03-25T09:20:14.636Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:2","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2mmemory_save success response exposes postMutationHooks contract fields and types
[22m[39m[memory-save] T306: Async embedding mode - deferring embedding for save-response-contract.md

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2mmemory_save success response exposes postMutationHooks contract fields and types
[22m[39m[memory-save] Using deferred indexing for save-response-contract.md
INFO  [VectorIndex] Deferred indexing: Memory 1 saved without embedding (BM25/FTS5 searchable)

[90mstderr[2m | tests/local-reranker.vitest.ts[2m > [22m[2mlocal-reranker concurrent model load (H4 fix)[2m > [22m[2mconcurrent rerankLocal calls do not create multiple load attempts
[22m[39m[local-reranker] fallback to original ordering: A dynamic import callback was not specified.
[local-reranker] fallback to original ordering: A dynamic import callback was not specified.

[90mstderr[2m | tests/local-reranker.vitest.ts[2m > [22m[2mlocal-reranker MAX_RERANK_CANDIDATES enforcement[2m > [22m[2monly processes first 50 candidates when 60 are provided
[22m[39m[local-reranker] fallback to original ordering: A dynamic import callback was not specified.

 [32m✓[39m tests/pipeline-integration.vitest.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 215[2mms[22m[39m
 [32m✓[39m tests/local-reranker.vitest.ts [2m([22m[2m16 tests[22m[2m)[22m[32m 154[2mms[22m[39m
[90mstdout[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2matomicSaveMemory returns post-mutation feedback payload with typed fields for successful saves
[22m[39m{"timestamp":"2026-03-25T09:20:14.650Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:2","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2matomicSaveMemory returns post-mutation feedback payload with typed fields for successful saves
[22m[39m[memory-save] T306: Async embedding mode - deferring embedding for atomic-save.md

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2matomicSaveMemory returns post-mutation feedback payload with typed fields for successful saves
[22m[39m[memory-save] Using deferred indexing for atomic-save.md
INFO  [VectorIndex] Deferred indexing: Memory 1 saved without embedding (BM25/FTS5 searchable)

[90mstdout[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2matomicSaveMemory duplicate no-op omits postMutationHooks and reports no-op status
[22m[39m{"timestamp":"2026-03-25T09:20:14.657Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:2","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2matomicSaveMemory duplicate no-op omits postMutationHooks and reports no-op status
[22m[39m[memory-save] T306: Async embedding mode - deferring embedding for atomic-duplicate-seed.md

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2matomicSaveMemory duplicate no-op omits postMutationHooks and reports no-op status
[22m[39m[memory-save] Using deferred indexing for atomic-duplicate-seed.md
INFO  [VectorIndex] Deferred indexing: Memory 1 saved without embedding (BM25/FTS5 searchable)

[90mstdout[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2matomicSaveMemory duplicate no-op omits postMutationHooks and reports no-op status
[22m[39m{"timestamp":"2026-03-25T09:20:14.661Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:2","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2matomicSaveMemory duplicate no-op omits postMutationHooks and reports no-op status
[22m[39m[memory-save] T306: Async embedding mode - deferring embedding for atomic-duplicate-copy.md

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2matomicSaveMemory duplicate no-op omits postMutationHooks and reports no-op status
[22m[39m[memory-save] T054: Duplicate content detected (hash match id=1), skipping embedding

[90mstdout[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2matomicSaveMemory succeeds with pending async embedding and returns partial-indexing hints
[22m[39m{"timestamp":"2026-03-25T09:20:14.664Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:2","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2matomicSaveMemory succeeds with pending async embedding and returns partial-indexing hints
[22m[39m[memory-save] T306: Async embedding mode - deferring embedding for atomic-save-async-pending.md

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2matomicSaveMemory succeeds with pending async embedding and returns partial-indexing hints
[22m[39m[memory-save] Using deferred indexing for atomic-save-async-pending.md
INFO  [VectorIndex] Deferred indexing: Memory 1 saved without embedding (BM25/FTS5 searchable)

[90mstderr[2m | tests/integration-trigger-pipeline.vitest.ts[2m > [22m[2mIntegration Trigger Pipeline (T527) [deferred - requires DB test fixtures][2m > [22m[2mPipeline Input Validation[2m > [22m[2mT527-4: Session cognitive params accepted
[22m[39m[memory_match_triggers] SECURITY: Rejected untrusted sessionId "sess-test-001" — sessionId "sess-test-001" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.

[90mstderr[2m | tests/job-queue-state-edge.vitest.ts[2m > [22m[2mingest job queue state + edge tests (T005b)[2m > [22m[2mT005b-Q10: job is failed when every file errors during processing
[22m[39m[job-queue] File error (continuing): spec-kit-missing-a-1774430414690-p4igaas7gjg.md — File not accessible

[90mstderr[2m | tests/job-queue-state-edge.vitest.ts[2m > [22m[2mingest job queue state + edge tests (T005b)[2m > [22m[2mT005b-Q10: job is failed when every file errors during processing
[22m[39m[job-queue] File error (continuing): spec-kit-missing-b-1774430414690-emygrasjc5d.md — File not accessible

[90mstdout[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2matomicSaveMemory rolls back file when indexing fails after retry
[22m[39m{"timestamp":"2026-03-25T09:20:14.705Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:0","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2matomicSaveMemory rolls back file when indexing fails after retry
[22m[39m[memory-save] V-rule hard block for atomic-save-invalid.md: V13

[90mstdout[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2matomicSaveMemory restores previous content when indexing fails after overwrite
[22m[39m{"timestamp":"2026-03-25T09:20:14.707Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:0","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts[2m > [22m[2mMemory save UX regressions[2m > [22m[2matomicSaveMemory restores previous content when indexing fails after overwrite
[22m[39m[memory-save] V-rule hard block for atomic-save-restore.md: V13

[90mstderr[2m | tests/job-queue-state-edge.vitest.ts[2m > [22m[2mingest job queue state + edge tests (T005b)[2m > [22m[2mT005b-Q11: partial file failures still complete job with preserved errors
[22m[39m[job-queue] File error (continuing): spec-kit-missing-c-1774430414714-icsganrht7.md — File not accessible

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts
[22m[39mINFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts
[22m[39m[memory-save] T306: Immediate async embedding attempt failed for #1: Memory not found

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts
[22m[39m[memory-save] T306: Immediate async embedding attempt failed for #1: Memory not found

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts
[22m[39m[memory-save] T306: Immediate async embedding attempt failed for #1: Memory not found

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts
[22m[39m[memory-save] T306: Immediate async embedding attempt failed for #1: Memory not found

[90mstderr[2m | tests/memory-save-ux-regressions.vitest.ts
[22m[39m[memory-save] T306: Immediate async embedding attempt failed for #1: Memory not found

 [32m✓[39m tests/memory-save-ux-regressions.vitest.ts [2m([22m[2m8 tests[22m[2m)[22m[32m 151[2mms[22m[39m
 [32m✓[39m tests/job-queue-state-edge.vitest.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 108[2mms[22m[39m
[90mstderr[2m | tests/bm25-index.vitest.ts[2m > [22m[2mC138: Weighted BM25 FTS5 Enhancements[2m > [22m[2mBM25 re-index fires when title changes
[22m[39m[memory-update] Title changed, regenerating embedding for memory 42 [requestId=2c29750a-b704-4601-82fd-64efe0daf924]

[90mstderr[2m | tests/memory-lineage-backfill.vitest.ts[2m > [22m[2mMemory lineage backfill[2m > [22m[2msupports dry-run planning, idempotent backfill, and checkpoint rollback drills
[22m[39m[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/bm25-index.vitest.ts[2m > [22m[2mC138: Weighted BM25 FTS5 Enhancements[2m > [22m[2mmemory_update wraps the update path in runInTransaction
[22m[39m[memory-update] Title changed, regenerating embedding for memory 42 [requestId=75257088-5c93-41a6-8025-167c6a550aed]

[90mstderr[2m | tests/bm25-index.vitest.ts[2m > [22m[2mC138: Weighted BM25 FTS5 Enhancements[2m > [22m[2mBM25 data failures are surfaced from inside the transaction callback
[22m[39m[memory-update] Title changed, regenerating embedding for memory 42 [requestId=5751284e-8ba2-4a27-a9a6-605d1bf8da46]

[90mstderr[2m | tests/bm25-index.vitest.ts[2m > [22m[2mC138: Weighted BM25 FTS5 Enhancements[2m > [22m[2mBM25 data failures are surfaced from inside the transaction callback
[22m[39m[memory-crud-update] BM25 re-index failed, rolling back update [requestId=5751284e-8ba2-4a27-a9a6-605d1bf8da46]: bad bm25 payload

 [32m✓[39m tests/bm25-index.vitest.ts [2m([22m[2m83 tests[22m[2m)[22m[32m 40[2mms[22m[39m
 [32m✓[39m tests/memory-lineage-backfill.vitest.ts [2m([22m[2m1 test[22m[2m)[22m[32m 69[2mms[22m[39m
[90mstderr[2m | tests/mcp-input-validation.vitest.ts[2m > [22m[2mMCP Protocol Input Validation (T534) [deferred - requires DB test fixtures][2m > [22m[2mInput Validation (23 tools)[2m > [22m[2mT534-6: memory_stats rejects invalid input (wrong type for specFolder)
[22m[39mINFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index

[90mstderr[2m | tests/mcp-tool-dispatch.vitest.ts[2m > [22m[2mMCP Protocol Tool Dispatch (T533) [deferred - requires DB test fixtures][2m > [22m[2mTool Dispatch Verification (24 tools)[2m > [22m[2mT533-5: memory_list dispatches to handleMemoryList
[22m[39mINFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index

[90mstderr[2m | tests/integration-trigger-pipeline.vitest.ts[2m > [22m[2mIntegration Trigger Pipeline (T527) [deferred - requires DB test fixtures][2m > [22m[2mPipeline Input Validation[2m > [22m[2mT527-5: include_cognitive parameter accepted
[22m[39mINFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index
[trigger-matcher] match_trigger_phrases: 80ms (target <50ms) { promptLength: [33m21[39m, cacheSize: [33m3037[39m, matchCount: [33m2[39m, totalPhrases: [33m2[39m }
[memory_match_triggers] Latency 117ms exceeds 100ms target

 [32m✓[39m tests/integration-trigger-pipeline.vitest.ts [2m([22m[2m8 tests[22m[2m)[22m[32m 123[2mms[22m[39m
[90mstderr[2m | tests/mcp-tool-dispatch.vitest.ts[2m > [22m[2mMCP Protocol Tool Dispatch (T533) [deferred - requires DB test fixtures][2m > [22m[2mTool Dispatch Verification (24 tools)[2m > [22m[2mT533-7: memory_health dispatches to handleMemoryHealth
[22m[39m[factory] Using provider: voyage (VOYAGE_API_KEY detected (auto mode))

[90mstderr[2m | tests/mcp-tool-dispatch.vitest.ts[2m > [22m[2mMCP Protocol Tool Dispatch (T533) [deferred - requires DB test fixtures][2m > [22m[2mTool Dispatch Verification (24 tools)[2m > [22m[2mT533-7: memory_health dispatches to handleMemoryHealth
[22m[39m[embeddings] Provider created lazily (0ms)

[90mstderr[2m | tests/checkpoints-storage.vitest.ts[2m > [22m[2mCheckpoints Storage (T503)[2m > [22m[2mCreate Checkpoint[2m > [22m[2mT503-01: Create checkpoint stores data
[22m[39m[checkpoints] Created checkpoint "test-checkpoint-1" (871 bytes compressed)

[90mstderr[2m | tests/checkpoints-storage.vitest.ts[2m > [22m[2mCheckpoints Storage (T503)[2m > [22m[2mRestore Checkpoint[2m > [22m[2mT503-03: Restore checkpoint retrieves data
[22m[39m[checkpoints] Created checkpoint "restore-target-checkpoint" (873 bytes compressed)
[checkpoints] Skipping post-restore rebuild "auto-entities" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "degree-snapshots" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "community-assignments" because dependencies did not complete: degree-snapshots
[checkpoints] Skipping post-restore rebuild "fts-rebuild" because dependencies did not complete: lineage-backfill, auto-entities
[checkpoints] Post-restore rebuild summary: completed=none; skipped=auto-entities, degree-snapshots, community-assignments, fts-rebuild
[checkpoints] Restored 3 memories, 0 working memory entries from "restore-target-checkpoint"

[90mstderr[2m | tests/checkpoints-storage.vitest.ts[2m > [22m[2mCheckpoints Storage (T503)[2m > [22m[2mDelete Checkpoint[2m > [22m[2mT503-04: Delete checkpoint removes data
[22m[39m[checkpoints] Created checkpoint "to-delete" (914 bytes compressed)

[90mstderr[2m | tests/causal-edges-unit.vitest.ts[2m > [22m[2mCausal Edges Unit Tests[2m > [22m[2mUninitialised DB Guards[2m > [22m[2mUN1: insertEdge returns null when uninitialised
[22m[39m[causal-edges] Database not initialized. Server may still be starting up.

[90mstderr[2m | tests/checkpoints-storage.vitest.ts[2m > [22m[2mCheckpoints Storage (T503)[2m > [22m[2mMax Checkpoints Limit[2m > [22m[2mT503-07: Max checkpoints limit enforced
[22m[39m[checkpoints] Created checkpoint "overflow-cp-0" (915 bytes compressed)
[checkpoints] Created checkpoint "overflow-cp-1" (915 bytes compressed)
[checkpoints] Created checkpoint "overflow-cp-2" (915 bytes compressed)
[checkpoints] Created checkpoint "overflow-cp-3" (915 bytes compressed)
[checkpoints] Created checkpoint "overflow-cp-4" (915 bytes compressed)
[checkpoints] Created checkpoint "overflow-cp-5" (915 bytes compressed)
[checkpoints] Created checkpoint "overflow-cp-6" (914 bytes compressed)
[checkpoints] Created checkpoint "overflow-cp-7" (915 bytes compressed)
[checkpoints] Created checkpoint "overflow-cp-8" (915 bytes compressed)
[checkpoints] Created checkpoint "overflow-cp-9" (915 bytes compressed)
[checkpoints] Created checkpoint "overflow-cp-10" (915 bytes compressed)
[checkpoints] Created checkpoint "overflow-cp-11" (915 bytes compressed)
[checkpoints] Created checkpoint "overflow-cp-12" (915 bytes compressed)

[90mstderr[2m | tests/checkpoints-storage.vitest.ts[2m > [22m[2mCheckpoints Storage (T503)[2m > [22m[2mCheckpoint Metadata[2m > [22m[2mT503-08: Checkpoint metadata preserved
[22m[39m[checkpoints] Created checkpoint "metadata-test" (875 bytes compressed)

[90mstderr[2m | tests/checkpoints-storage.vitest.ts[2m > [22m[2mCheckpoints Storage (T503)[2m > [22m[2mSpec Folder Filtering[2m > [22m[2mT503-10: Spec folder filtering
[22m[39m[checkpoints] Created checkpoint "folder-filter-test" (875 bytes compressed)

[90mstderr[2m | tests/checkpoints-storage.vitest.ts[2m > [22m[2mCheckpoints Storage (T503)[2m > [22m[2mScoped causal edge snapshots[2m > [22m[2mT503-11: spec-folder checkpoint snapshots only in-folder causal edges
[22m[39m[checkpoints] Created checkpoint "scoped-edge-snapshot" (875 bytes compressed)

[90mstderr[2m | tests/checkpoints-storage.vitest.ts[2m > [22m[2mCheckpoints Storage (T503)[2m > [22m[2mScoped causal edge snapshots[2m > [22m[2mT503-12: scoped clearExisting restore preserves other spec data and unrelated edges
[22m[39m[checkpoints] Created checkpoint "scoped-edge-restore" (875 bytes compressed)
[checkpoints] Skipping post-restore rebuild "auto-entities" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "degree-snapshots" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "community-assignments" because dependencies did not complete: degree-snapshots
[checkpoints] Skipping post-restore rebuild "fts-rebuild" because dependencies did not complete: lineage-backfill, auto-entities
[checkpoints] Post-restore rebuild summary: completed=none; skipped=auto-entities, degree-snapshots, community-assignments, fts-rebuild
[checkpoints] Restored 2 memories, 0 working memory entries from "scoped-edge-restore"

[90mstderr[2m | tests/checkpoints-storage.vitest.ts[2m > [22m[2mCheckpoints Storage (T503)[2m > [22m[2mScoped causal edge snapshots[2m > [22m[2mT503-13: scoped merge restore replaces stale in-folder edges without touching unrelated ones
[22m[39m[checkpoints] Created checkpoint "scoped-edge-merge-restore" (875 bytes compressed)
[checkpoints] Skipping post-restore rebuild "auto-entities" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "degree-snapshots" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "community-assignments" because dependencies did not complete: degree-snapshots
[checkpoints] Skipping post-restore rebuild "fts-rebuild" because dependencies did not complete: lineage-backfill, auto-entities
[checkpoints] Post-restore rebuild summary: completed=none; skipped=auto-entities, degree-snapshots, community-assignments, fts-rebuild
[checkpoints] Restored 2 memories, 0 working memory entries from "scoped-edge-merge-restore"

 [32m✓[39m tests/checkpoints-storage.vitest.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 60[2mms[22m[39m
 [32m✓[39m tests/causal-edges-unit.vitest.ts [2m([22m[2m81 tests[22m[2m)[22m[32m 20[2mms[22m[39m
 [32m✓[39m tests/envelope.vitest.ts [2m([22m[2m37 tests[22m[2m)[22m[32m 125[2mms[22m[39m
 [32m✓[39m tests/integration-138-pipeline.vitest.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 76[2mms[22m[39m
[90mstderr[2m | tests/access-tracker-extended.vitest.ts[2m > [22m[2mAccess Tracker Extended[2m > [22m[2mflushAccessCounts — direct calls[2m > [22m[2mflushAccessCounts with closed DB returns false
[22m[39m[access-tracker] flushAccessCounts error: The database connection is not open

 [32m✓[39m tests/folder-discovery.vitest.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 91[2mms[22m[39m
 [32m✓[39m tests/ground-truth-feedback.vitest.ts [2m([22m[2m27 tests[22m[2m)[22m[32m 129[2mms[22m[39m
[90mstderr[2m | tests/session-manager-extended.vitest.ts[2m > [22m[2mSession Manager Extended Tests[2m > [22m[2m17. db unavailable dedup mode[2m > [22m[2mblocks sending when DB unavailable and mode is block
[22m[39m[session-manager] shouldSendMemory check failed: The database connection is not open
[session-manager] shouldSendMemoriesBatch failed: The database connection is not open

[90mstderr[2m | tests/session-manager-extended.vitest.ts[2m > [22m[2mSession Manager Extended Tests[2m > [22m[2m17. db unavailable dedup mode[2m > [22m[2mallows sending when DB unavailable and mode is allow
[22m[39m[session-manager] shouldSendMemory check failed: The database connection is not open
[session-manager] shouldSendMemoriesBatch failed: The database connection is not open

 [32m✓[39m tests/session-manager-extended.vitest.ts [2m([22m[2m45 tests[22m[2m)[22m[32m 42[2mms[22m[39m
[90mstderr[2m | tests/access-tracker-extended.vitest.ts[2m > [22m[2mAccess Tracker Extended[2m > [22m[2mMAX_ACCUMULATOR_SIZE — overflow behavior[2m > [22m[2mMAX_ACCUMULATOR_SIZE overflow triggers flush-all and clear
[22m[39m[access-tracker] Accumulator map exceeded 10000 entries, flushing all

[90mstderr[2m | tests/retry-manager.vitest.ts[2m > [22m[2mretry-manager [deferred - requires DB test fixtures][2m > [22m[2m3. Background Job Lifecycle[2m > [22m[2mT17: startBackgroundJob() returns true
[22m[39m[retry-manager] Starting background retry job (interval: 999999999ms, batch: 5)
INFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index

[90mstderr[2m | tests/retry-manager.vitest.ts[2m > [22m[2mretry-manager [deferred - requires DB test fixtures][2m > [22m[2m3. Background Job Lifecycle[2m > [22m[2mT18: isBackgroundJobRunning() true after start
[22m[39m[retry-manager] Background retry job stopped

[90mstderr[2m | tests/retry-manager.vitest.ts[2m > [22m[2mretry-manager [deferred - requires DB test fixtures][2m > [22m[2m3. Background Job Lifecycle[2m > [22m[2mT18: isBackgroundJobRunning() true after start
[22m[39m[retry-manager] Starting background retry job (interval: 999999999ms, batch: 5)

[90mstderr[2m | tests/retry-manager.vitest.ts[2m > [22m[2mretry-manager [deferred - requires DB test fixtures][2m > [22m[2m3. Background Job Lifecycle[2m > [22m[2mT19: startBackgroundJob() returns false when already running
[22m[39m[retry-manager] Background retry job stopped

[90mstderr[2m | tests/retry-manager.vitest.ts[2m > [22m[2mretry-manager [deferred - requires DB test fixtures][2m > [22m[2m3. Background Job Lifecycle[2m > [22m[2mT19: startBackgroundJob() returns false when already running
[22m[39m[retry-manager] Starting background retry job (interval: 999999999ms, batch: 5)
[retry-manager] Background job already running

[90mstderr[2m | tests/retry-manager.vitest.ts[2m > [22m[2mretry-manager [deferred - requires DB test fixtures][2m > [22m[2m3. Background Job Lifecycle[2m > [22m[2mT20: stopBackgroundJob() returns true when running
[22m[39m[retry-manager] Background retry job stopped

[90mstderr[2m | tests/retry-manager.vitest.ts[2m > [22m[2mretry-manager [deferred - requires DB test fixtures][2m > [22m[2m3. Background Job Lifecycle[2m > [22m[2mT20: stopBackgroundJob() returns true when running
[22m[39m[retry-manager] Starting background retry job (interval: 999999999ms, batch: 5)
[retry-manager] Background retry job stopped

[90mstderr[2m | tests/retry-manager.vitest.ts[2m > [22m[2mretry-manager [deferred - requires DB test fixtures][2m > [22m[2m3. Background Job Lifecycle[2m > [22m[2mT21: isBackgroundJobRunning() false after stop
[22m[39m[retry-manager] Starting background retry job (interval: 999999999ms, batch: 5)
[retry-manager] Background retry job stopped

[90mstderr[2m | tests/retry-manager.vitest.ts[2m > [22m[2mretry-manager [deferred - requires DB test fixtures][2m > [22m[2m3. Background Job Lifecycle[2m > [22m[2mT22: startBackgroundJob({ enabled: false }) returns false
[22m[39m[retry-manager] Background job is disabled

[90mstderr[2m | tests/retry-manager.vitest.ts[2m > [22m[2mretry-manager [deferred - requires DB test fixtures][2m > [22m[2m3. Background Job Lifecycle[2m > [22m[2mT23: start/stop/start cycle works correctly
[22m[39m[retry-manager] Starting background retry job (interval: 999999999ms, batch: 5)
[retry-manager] Background retry job stopped
[retry-manager] Starting background retry job (interval: 999999999ms, batch: 5)
[retry-manager] Background retry job stopped

[90mstderr[2m | tests/retry-manager.vitest.ts[2m > [22m[2mretry-manager [deferred - requires DB test fixtures][2m > [22m[2m4. DB-Dependent Tests[2m > [22m[2m4a. getRetryStats[2m > [22m[2mT24: getRetryStats() returns correct shape
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/access-tracker-extended.vitest.ts[2m > [22m[2mAccess Tracker Extended[2m > [22m[2mMAX_ACCUMULATOR_SIZE — overflow behavior[2m > [22m[2mAfter overflow, old accumulator entries are cleared
[22m[39m[access-tracker] Accumulator map exceeded 10000 entries, flushing all

[90mstderr[2m | tests/access-tracker-extended.vitest.ts[2m > [22m[2mAccess Tracker Extended[2m > [22m[2mtrackMultipleAccesses — threshold flush regressions[2m > [22m[2mpreserves accumulator state when threshold flush fails
[22m[39m[access-tracker] Database not initialized. Server may still be starting up.
[access-tracker] Database not initialized. Server may still be starting up.

[90mstderr[2m | tests/access-tracker-extended.vitest.ts[2m > [22m[2mAccess Tracker Extended[2m > [22m[2mflushAccessCounts — error handling[2m > [22m[2mflushAccessCounts returns false when DB is closed
[22m[39m[access-tracker] flushAccessCounts error: The database connection is not open

[90mstderr[2m | tests/mcp-tool-dispatch.vitest.ts[2m > [22m[2mMCP Protocol Tool Dispatch (T533) [deferred - requires DB test fixtures][2m > [22m[2mTool Dispatch Verification (24 tools)[2m > [22m[2mT533-23: memory_index_scan dispatches to handleMemoryIndexScan
[22m[39m[memory_index_scan] Using embedding provider: voyage, model: voyage-4, dimension: 1024

 [32m✓[39m tests/access-tracker-extended.vitest.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 85[2mms[22m[39m
 [32m✓[39m tests/mcp-tool-dispatch.vitest.ts [2m([22m[2m48 tests[22m[2m)[22m[32m 245[2mms[22m[39m
 [32m✓[39m tests/mcp-input-validation.vitest.ts [2m([22m[2m33 tests[22m[2m)[22m[32m 252[2mms[22m[39m
[90mstderr[2m | tests/errors-comprehensive.vitest.ts[2m > [22m[2mD. userFriendlyError[2m > [22m[2mD8: Unknown error -> generic message (no internal details leaked)
[22m[39m[errors] Unmatched error (debug): something totally unknown

[90mstderr[2m | tests/retry-manager.vitest.ts[2m > [22m[2mretry-manager [deferred - requires DB test fixtures][2m > [22m[2m4. DB-Dependent Tests[2m > [22m[2m4h. runBackgroundJob[2m > [22m[2mT49: runBackgroundJob() with empty queue reports empty
[22m[39m[retry-manager] Database not initialized. Server may still be starting up. Returning default stats.

 [32m✓[39m tests/errors-comprehensive.vitest.ts [2m([22m[2m78 tests[22m[2m)[22m[32m 92[2mms[22m[39m
 [32m✓[39m tests/retry-manager.vitest.ts [2m([22m[2m57 tests[22m[2m)[22m[32m 70[2mms[22m[39m
 [32m✓[39m tests/session-cleanup.vitest.ts [2m([22m[2m9 tests[22m[2m)[22m[32m 28[2mms[22m[39m
[90mstderr[2m | tests/learning-stats-filters.vitest.ts[2m > [22m[2mT503: Learning Stats SQL Filter Tests
[22m[39mINFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index
[session-learning] Schema initialized

 [32m✓[39m tests/history.vitest.ts [2m([22m[2m41 tests[22m[2m)[22m[32m 54[2mms[22m[39m
[90mstderr[2m | tests/learning-stats-filters.vitest.ts[2m > [22m[2mT503: Learning Stats SQL Filter Tests[2m > [22m[2mT503: Summary stats respect sessionId filter[2m > [22m[2mT503-01: sessionId stats filter — totalTasks=1
[22m[39m[session-learning] Preflight recorded: spec=test/t503-stats-filters, task=T-SESSA-1774430415074, id=4584

[90mstderr[2m | tests/learning-stats-filters.vitest.ts[2m > [22m[2mT503: Learning Stats SQL Filter Tests[2m > [22m[2mT503: Summary stats respect sessionId filter[2m > [22m[2mT503-01: sessionId stats filter — totalTasks=1
[22m[39m[session-learning] Postflight recorded: spec=test/t503-stats-filters, task=T-SESSA-1774430415074, LI=60

[90mstderr[2m | tests/learning-stats-filters.vitest.ts[2m > [22m[2mT503: Learning Stats SQL Filter Tests[2m > [22m[2mT503: Summary stats respect sessionId filter[2m > [22m[2mT503-01: sessionId stats filter — totalTasks=1
[22m[39m[session-learning] Preflight recorded: spec=test/t503-stats-filters, task=T-SESSB-1774430415074, id=4585

[90mstderr[2m | tests/learning-stats-filters.vitest.ts[2m > [22m[2mT503: Learning Stats SQL Filter Tests[2m > [22m[2mT503: Summary stats respect sessionId filter[2m > [22m[2mT503-01: sessionId stats filter — totalTasks=1
[22m[39m[session-learning] Postflight recorded: spec=test/t503-stats-filters, task=T-SESSB-1774430415074, LI=5

[90mstderr[2m | tests/learning-stats-filters.vitest.ts[2m > [22m[2mT503: Learning Stats SQL Filter Tests[2m > [22m[2mT503: Summary stats respect sessionId filter[2m > [22m[2mT503-01b: sessionId records filter consistent
[22m[39m[session-learning] Preflight recorded: spec=test/t503-stats-filters, task=T-SESSA-1774430415074-3, id=4586

[90mstderr[2m | tests/learning-stats-filters.vitest.ts[2m > [22m[2mT503: Learning Stats SQL Filter Tests[2m > [22m[2mT503: Summary stats respect sessionId filter[2m > [22m[2mT503-01b: sessionId records filter consistent
[22m[39m[session-learning] Postflight recorded: spec=test/t503-stats-filters, task=T-SESSA-1774430415074-3, LI=60

[90mstderr[2m | tests/learning-stats-filters.vitest.ts[2m > [22m[2mT503: Learning Stats SQL Filter Tests[2m > [22m[2mT503: Summary stats respect sessionId filter[2m > [22m[2mT503-01b: sessionId records filter consistent
[22m[39m[session-learning] Preflight recorded: spec=test/t503-stats-filters, task=T-SESSB-1774430415074-4, id=4587

[90mstderr[2m | tests/learning-stats-filters.vitest.ts[2m > [22m[2mT503: Learning Stats SQL Filter Tests[2m > [22m[2mT503: Summary stats respect sessionId filter[2m > [22m[2mT503-01b: sessionId records filter consistent
[22m[39m[session-learning] Postflight recorded: spec=test/t503-stats-filters, task=T-SESSB-1774430415074-4, LI=5

[90mstderr[2m | tests/learning-stats-filters.vitest.ts[2m > [22m[2mT503: Learning Stats SQL Filter Tests[2m > [22m[2mT503: Summary stats respect onlyComplete filter[2m > [22m[2mT503-02: onlyComplete records filter
[22m[39m[session-learning] Preflight recorded: spec=test/t503-stats-filters, task=T-COMPLETE-1774430415074, id=4588

[90mstderr[2m | tests/learning-stats-filters.vitest.ts[2m > [22m[2mT503: Learning Stats SQL Filter Tests[2m > [22m[2mT503: Summary stats respect onlyComplete filter[2m > [22m[2mT503-02: onlyComplete records filter
[22m[39m[session-learning] Postflight recorded: spec=test/t503-stats-filters, task=T-COMPLETE-1774430415074, LI=50

[90mstderr[2m | tests/learning-stats-filters.vitest.ts[2m > [22m[2mT503: Learning Stats SQL Filter Tests[2m > [22m[2mT503: Summary stats respect onlyComplete filter[2m > [22m[2mT503-02: onlyComplete records filter
[22m[39m[session-learning] Preflight recorded: spec=test/t503-stats-filters, task=T-INCOMPLETE-1774430415074, id=4589

[90mstderr[2m | tests/learning-stats-filters.vitest.ts[2m > [22m[2mT503: Learning Stats SQL Filter Tests[2m > [22m[2mT503: Combined sessionId + onlyComplete filters[2m > [22m[2mT503-03: combined filters — 1 complete record
[22m[39m[session-learning] Preflight recorded: spec=test/t503-stats-filters, task=T-COMBO-COMPLETE-1774430415074, id=4590

[90mstderr[2m | tests/learning-stats-filters.vitest.ts[2m > [22m[2mT503: Learning Stats SQL Filter Tests[2m > [22m[2mT503: Combined sessionId + onlyComplete filters[2m > [22m[2mT503-03: combined filters — 1 complete record
[22m[39m[session-learning] Postflight recorded: spec=test/t503-stats-filters, task=T-COMBO-COMPLETE-1774430415074, LI=60

[90mstderr[2m | tests/learning-stats-filters.vitest.ts[2m > [22m[2mT503: Learning Stats SQL Filter Tests[2m > [22m[2mT503: Combined sessionId + onlyComplete filters[2m > [22m[2mT503-03: combined filters — 1 complete record
[22m[39m[session-learning] Preflight recorded: spec=test/t503-stats-filters, task=T-COMBO-PREFLIGHT-1774430415074, id=4591

[90mstderr[2m | tests/learning-stats-filters.vitest.ts[2m > [22m[2mT503: Learning Stats SQL Filter Tests[2m > [22m[2mT503: Combined sessionId + onlyComplete filters[2m > [22m[2mT503-03b: combined stats correct
[22m[39m[session-learning] Preflight recorded: spec=test/t503-stats-filters, task=T-COMBO-COMPLETE-1774430415074-6, id=4592

[90mstderr[2m | tests/learning-stats-filters.vitest.ts[2m > [22m[2mT503: Learning Stats SQL Filter Tests[2m > [22m[2mT503: Combined sessionId + onlyComplete filters[2m > [22m[2mT503-03b: combined stats correct
[22m[39m[session-learning] Postflight recorded: spec=test/t503-stats-filters, task=T-COMBO-COMPLETE-1774430415074-6, LI=60

[90mstderr[2m | tests/learning-stats-filters.vitest.ts[2m > [22m[2mT503: Learning Stats SQL Filter Tests[2m > [22m[2mT503: Combined sessionId + onlyComplete filters[2m > [22m[2mT503-03b: combined stats correct
[22m[39m[session-learning] Preflight recorded: spec=test/t503-stats-filters, task=T-COMBO-PREFLIGHT-1774430415074-7, id=4593

[90mstderr[2m | tests/co-activation.vitest.ts[2m > [22m[2mCo-Activation Module[2m > [22m[2mgetRelatedMemories() without DB[2m > [22m[2mReturns empty array without DB
[22m[39m[co-activation] Database not initialized. Server may still be starting up.

[90mstderr[2m | tests/co-activation.vitest.ts[2m > [22m[2mCo-Activation Module[2m > [22m[2mgetRelatedMemories() without DB[2m > [22m[2mInvalid memoryId returns empty array
[22m[39m[co-activation] Database not initialized. Server may still be starting up.

 [32m✓[39m tests/co-activation.vitest.ts [2m([22m[2m34 tests[22m[2m)[22m[32m 11[2mms[22m[39m
 [32m✓[39m tests/learning-stats-filters.vitest.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 70[2mms[22m[39m
 [32m✓[39m tests/workflow-memory-tracking.vitest.ts [2m([22m[2m5 tests[22m[2m)[22m[32m 61[2mms[22m[39m
 [32m✓[39m tests/mutation-ledger.vitest.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 50[2mms[22m[39m
[90mstderr[2m | tests/handler-checkpoints-edge.vitest.ts[2m > [22m[2mHandler Checkpoints Edge Cases (T009-T012)
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23
[vector-index] Could not set permissions on :memory:: ENOENT: no such file or directory, chmod ':memory:'

[90mstderr[2m | tests/stage2-fusion.vitest.ts[2m > [22m[2mStage 2 fusion regression coverage[2m > [22m[2mT-degradation: fusion continues when DB unavailable
[22m[39m[stage2-fusion] community boost failed: db unavailable
[stage2-fusion] graph signals failed: db unavailable

[90mstderr[2m | tests/handler-checkpoints-edge.vitest.ts[2m > [22m[2mHandler Checkpoints Edge Cases (T009-T012)[2m > [22m[2mT009-C1: Create checkpoint with valid name returns success with checkpoint name
[22m[39m[checkpoints] Created checkpoint "edge-t009-c1-1774430415224-1cbvoh-1" (1249 bytes compressed)

[90mstderr[2m | tests/handler-checkpoints-edge.vitest.ts[2m > [22m[2mHandler Checkpoints Edge Cases (T009-T012)[2m > [22m[2mT010-C4: List with limit=1 returns at most 1 result
[22m[39m[checkpoints] Created checkpoint "edge-t010-c4-a-1774430415224-1cbvoh-3" (1249 bytes compressed)

 [32m✓[39m tests/layer-definitions.vitest.ts [2m([22m[2m41 tests[22m[2m)[22m[32m 7[2mms[22m[39m
[90mstderr[2m | tests/handler-checkpoints-edge.vitest.ts[2m > [22m[2mHandler Checkpoints Edge Cases (T009-T012)[2m > [22m[2mT010-C4: List with limit=1 returns at most 1 result
[22m[39m[checkpoints] Created checkpoint "edge-t010-c4-b-1774430415224-1cbvoh-4" (1249 bytes compressed)

 [32m✓[39m tests/stage2-fusion.vitest.ts [2m([22m[2m5 tests[22m[2m)[22m[32m 38[2mms[22m[39m
[90mstderr[2m | tests/handler-checkpoints-edge.vitest.ts[2m > [22m[2mHandler Checkpoints Edge Cases (T009-T012)[2m > [22m[2mT010-C5: List with specFolder filter returns filtered results
[22m[39m[checkpoints] Created checkpoint "edge-t010-c5-kept-1774430415224-1cbvoh-7" (1249 bytes compressed)

[90mstderr[2m | tests/handler-checkpoints-edge.vitest.ts[2m > [22m[2mHandler Checkpoints Edge Cases (T009-T012)[2m > [22m[2mT010-C5: List with specFolder filter returns filtered results
[22m[39m[checkpoints] Created checkpoint "edge-t010-c5-other-1774430415224-1cbvoh-8" (1249 bytes compressed)

[90mstderr[2m | tests/handler-checkpoints-edge.vitest.ts[2m > [22m[2mHandler Checkpoints Edge Cases (T009-T012)[2m > [22m[2mT011-C7b: Restore existing checkpoint returns success with restore hints
[22m[39m[checkpoints] Created checkpoint "edge-t011-c7b-existing-1774430415224-1cbvoh-11" (1249 bytes compressed)

[90mstderr[2m | tests/handler-checkpoints-edge.vitest.ts[2m > [22m[2mHandler Checkpoints Edge Cases (T009-T012)[2m > [22m[2mT011-C7b: Restore existing checkpoint returns success with restore hints
[22m[39m[checkpoints] Post-restore rebuild summary: completed=lineage-backfill, auto-entities, degree-snapshots, community-assignments, fts-rebuild; skipped=none
[checkpoints] Restored 0 memories, 0 working memory entries from "edge-t011-c7b-existing-1774430415224-1cbvoh-11"

[90mstderr[2m | tests/handler-checkpoints-edge.vitest.ts[2m > [22m[2mHandler Checkpoints Edge Cases (T009-T012)[2m > [22m[2mT011-C7c: Restore merge skips row when checkpoint id collides with different live identity
[22m[39m[checkpoints] Created checkpoint "edge-t011-c7c-id-collision-1774430415224-1cbvoh-15" (1696 bytes compressed)

[90mstderr[2m | tests/handler-checkpoints-edge.vitest.ts[2m > [22m[2mHandler Checkpoints Edge Cases (T009-T012)[2m > [22m[2mT011-C7c: Restore merge skips row when checkpoint id collides with different live identity
[22m[39m[checkpoints] Skipping restore of memory 99001: id collision with existing identity "specs/edge-t011-c7c-collision-folder-1774430415224-1cbvoh-14:specs/edge-t011-c7c-collision-folder-1774430415224-1cbvoh-14/memory/collision.md:"
[checkpoints] Post-restore rebuild summary: completed=lineage-backfill, auto-entities, degree-snapshots, community-assignments, fts-rebuild; skipped=none
[checkpoints] Restored 0 memories, 0 working memory entries from "edge-t011-c7c-id-collision-1774430415224-1cbvoh-15"

[90mstderr[2m | tests/checkpoint-limit.vitest.ts[2m > [22m[2mT212: Checkpoint Limit Parameter[2m > [22m[2mLimit parameter applied to listCheckpoints[2m > [22m[2mT212-01: Create 10 checkpoints
[22m[39m[checkpoints] Created checkpoint "limit-test-cp-0" (674 bytes compressed)
[checkpoints] Created checkpoint "limit-test-cp-1" (674 bytes compressed)
[checkpoints] Created checkpoint "limit-test-cp-2" (674 bytes compressed)
[checkpoints] Created checkpoint "limit-test-cp-3" (675 bytes compressed)
[checkpoints] Created checkpoint "limit-test-cp-4" (675 bytes compressed)
[checkpoints] Created checkpoint "limit-test-cp-5" (674 bytes compressed)
[checkpoints] Created checkpoint "limit-test-cp-6" (675 bytes compressed)
[checkpoints] Created checkpoint "limit-test-cp-7" (675 bytes compressed)
[checkpoints] Created checkpoint "limit-test-cp-8" (675 bytes compressed)
[checkpoints] Created checkpoint "limit-test-cp-9" (675 bytes compressed)

[90mstderr[2m | tests/handler-memory-context.vitest.ts[2m > [22m[2mHandler Memory Context (T524) [deferred - requires DB test fixtures][2m > [22m[2mAuto Mode Routing (T524-1 to T524-3)[2m > [22m[2mT524-1: Auto mode routes "resume" to resume strategy
[22m[39mINFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index

[90mstderr[2m | tests/checkpoint-limit.vitest.ts[2m > [22m[2mT212: Checkpoint Limit Parameter[2m > [22m[2mLimit with specFolder filter
[22m[39m[checkpoints] Created checkpoint "folder-limit-0" (550 bytes compressed)
[checkpoints] Created checkpoint "folder-limit-1" (551 bytes compressed)
[checkpoints] Created checkpoint "folder-limit-2" (550 bytes compressed)
[checkpoints] Created checkpoint "folder-limit-3" (550 bytes compressed)
[checkpoints] Created checkpoint "folder-limit-4" (550 bytes compressed)
[checkpoints] Created checkpoint "folder-limit-b-0" (550 bytes compressed)
[checkpoints] Created checkpoint "folder-limit-b-1" (551 bytes compressed)
[checkpoints] Created checkpoint "folder-limit-b-2" (550 bytes compressed)

 [32m✓[39m tests/checkpoint-limit.vitest.ts [2m([22m[2m8 tests[22m[2m)[22m[32m 30[2mms[22m[39m
[90mstderr[2m | tests/handler-checkpoints-edge.vitest.ts[2m > [22m[2mHandler Checkpoints Edge Cases (T009-T012)[2m > [22m[2mT012-C10: Delete with matching confirmName on existing checkpoint returns success
[22m[39m[checkpoints] Created checkpoint "edge-t012-c10-existing-delete-1774430415224-1cbvoh-18" (1316 bytes compressed)

 [32m✓[39m tests/handler-checkpoints-edge.vitest.ts [2m([22m[2m12 tests[22m[2m)[22m[32m 68[2mms[22m[39m
 [32m✓[39m tests/handler-memory-context.vitest.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 54[2mms[22m[39m
[90mstderr[2m | tests/mpab-quality-gate-integration.vitest.ts[2m > [22m[2mSprint 4 Integration: Quality Gate + Save[2m > [22m[2mS4-INT-05: Quality gate rejects low-quality saves when flag is ON
[22m[39mINFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index
[QUALITY-GATE] warn-only | score: 0.06 | would-reject: true | reasons: [Title is missing or empty, Content too short: 1 chars (min: 50), Signal density 0.06 below threshold 0.4, Low title quality: use a specific, descriptive title, No trigger phrases: add at least 1-2 trigger phrases, No YAML frontmatter: add metadata block]

[90mstderr[2m | tests/cross-encoder-extended.vitest.ts[2m > [22m[2mCross Encoder Extended Tests[2m > [22m[2m5. rerankResults (provider paths)[2m > [22m[2mprovider error falls back gracefully
[22m[39m[cross-encoder] Reranking failed (voyage): Voyage rerank failed: 500 Internal Server Error — falling back to positional scoring

 [32m✓[39m tests/mpab-quality-gate-integration.vitest.ts [2m([22m[2m24 tests[22m[2m)[22m[32m 15[2mms[22m[39m
 [32m✓[39m tests/cross-encoder-extended.vitest.ts [2m([22m[2m31 tests[22m[2m)[22m[32m 47[2mms[22m[39m
[90mstderr[2m | tests/causal-edges.vitest.ts[2m > [22m[2mCausal Edges (T043-T047, T128-T141)[2m > [22m[2mT045 - Edge Insertion[2m > [22m[2mshould validate required source_id
[22m[39m[causal-edges] insertEdge error: NOT NULL constraint failed: causal_edges.source_id

[90mstderr[2m | tests/causal-edges.vitest.ts[2m > [22m[2mCausal Edges (T043-T047, T128-T141)[2m > [22m[2mT045 - Edge Insertion[2m > [22m[2mshould validate relation type
[22m[39m[causal-edges] insertEdge error: CHECK constraint failed: relation IN (
          'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
        )

[90mstderr[2m | tests/causal-edges.vitest.ts[2m > [22m[2mCausal Edges (T043-T047, T128-T141)[2m > [22m[2mT136 - Insert Validates Required Fields[2m > [22m[2mshould throw for missing source_id
[22m[39m[causal-edges] insertEdge error: NOT NULL constraint failed: causal_edges.source_id

[90mstderr[2m | tests/causal-edges.vitest.ts[2m > [22m[2mCausal Edges (T043-T047, T128-T141)[2m > [22m[2mT136 - Insert Validates Required Fields[2m > [22m[2mshould throw for missing target_id
[22m[39m[causal-edges] insertEdge error: NOT NULL constraint failed: causal_edges.target_id

[90mstderr[2m | tests/causal-edges.vitest.ts[2m > [22m[2mCausal Edges (T043-T047, T128-T141)[2m > [22m[2mT136 - Insert Validates Required Fields[2m > [22m[2mshould throw for missing relation
[22m[39m[causal-edges] insertEdge error: NOT NULL constraint failed: causal_edges.relation

[90mstderr[2m | tests/causal-edges.vitest.ts[2m > [22m[2mCausal Edges (T043-T047, T128-T141)[2m > [22m[2mT136 - Insert Validates Required Fields[2m > [22m[2mshould throw for invalid relation type
[22m[39m[causal-edges] insertEdge error: CHECK constraint failed: relation IN (
          'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
        )

[90mstderr[2m | tests/causal-edges.vitest.ts[2m > [22m[2mCausal Edges (T043-T047, T128-T141)[2m > [22m[2mT136 - Insert Validates Required Fields[2m > [22m[2mshould throw for null source_id
[22m[39m[causal-edges] insertEdge error: NOT NULL constraint failed: causal_edges.source_id

[90mstderr[2m | tests/causal-edges.vitest.ts[2m > [22m[2mCausal Edges (T043-T047, T128-T141)[2m > [22m[2mT137 - Strength Bounds Validation[2m > [22m[2mshould reject non-numeric strength input
[22m[39m[causal-edges] insertEdge rejected non-finite strength

[90mstderr[2m | tests/causal-edges.vitest.ts[2m > [22m[2mCausal Edges (T043-T047, T128-T141)[2m > [22m[2mT001/T004 — Audit tracking and cache invalidation[2m > [22m[2mT002: updateEdge rolls back when weight_history insert fails
[22m[39m[causal-edges] updateEdge error: no such table: weight_history

[90mstderr[2m | tests/causal-edges.vitest.ts[2m > [22m[2mCausal Edges (T043-T047, T128-T141)[2m > [22m[2mT001/T004 — Audit tracking and cache invalidation[2m > [22m[2mT002: insertEdge upsert rolls back when weight_history insert fails
[22m[39m[causal-edges] insertEdge error: no such table: weight_history

 [32m✓[39m tests/causal-edges.vitest.ts [2m([22m[2m85 tests[22m[2m)[22m[32m 30[2mms[22m[39m
[90mstderr[2m | tests/hybrid-search.vitest.ts[2m > [22m[2mC138-P0: Adaptive Fallback in searchWithFallback[2m > [22m[2mC138-P0-FB-T2: tier-2 fallback forces all channels for simple-routed queries
[22m[39m[hybrid-search] Tier 1→2 degradation: insufficient_results (topScore=10.000, count=1)

[90mstderr[2m | tests/hybrid-search.vitest.ts[2m > [22m[2mC138-P0: Adaptive Fallback in searchWithFallback[2m > [22m[2mC138-P0-FB-T2: tier-2 fallback forces all channels for simple-routed queries
[22m[39m[hybrid-search] Tier 2→3 degradation: insufficient_results (topScore=10.000, count=2)

 [32m✓[39m tests/memory-roadmap-flags.vitest.ts [2m([22m[2m8 tests[22m[2m)[22m[32m 31[2mms[22m[39m
 [32m✓[39m tests/hybrid-search.vitest.ts [2m([22m[2m75 tests[22m[2m)[22m[32m 26[2mms[22m[39m
[90mstderr[2m | tests/memory-lineage-state.vitest.ts[2m > [22m[2mMemory lineage state[2m > [22m[2mrecords append-first versions and resolves active plus asOf reads deterministically
[22m[39m[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/memory-lineage-state.vitest.ts[2m > [22m[2mMemory lineage state[2m > [22m[2mvalidates lineage schema support for phase 2 tables
[22m[39m[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/memory-lineage-state.vitest.ts[2m > [22m[2mMemory lineage state[2m > [22m[2mbuilds an operator-facing lineage summary for append-first chains
[22m[39m[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/memory-lineage-state.vitest.ts[2m > [22m[2mMemory lineage state[2m > [22m[2mbenchmarks ordered lineage writes with final projection details
[22m[39m[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/token-budget.vitest.ts[2m > [22m[2mCHK-023: adjustedBudget formula (header overhead deduction)[2m > [22m[2mT5: truncateToBudget respects the adjusted budget when passed
[22m[39m[hybrid-search] Token budget overflow: 1022 tokens > 980 budget, truncated 2 → 1 results

 [32m✓[39m tests/token-budget.vitest.ts [2m([22m[2m21 tests[22m[2m)[22m[32m 6[2mms[22m[39m
[90mstderr[2m | tests/memory-lineage-state.vitest.ts[2m > [22m[2mMemory lineage state[2m > [22m[2mdetects malformed predecessor chains and projection drift
[22m[39m[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

 [32m✓[39m tests/transaction-manager.vitest.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 40[2mms[22m[39m
[90mstderr[2m | tests/safety.vitest.ts[2m > [22m[2mT105 + T106 Safety Tests[2m > [22m[2mT105: batchSize Validation[2m > [22m[2mT105-Valid1: batchSize=1 works (smallest valid)
[22m[39m[batch-processor] Processing batch 1/1

[90mstderr[2m | tests/safety.vitest.ts[2m > [22m[2mT105 + T106 Safety Tests[2m > [22m[2mT105: batchSize Validation[2m > [22m[2mT105-Valid10: batchSize=10 works (normal)
[22m[39m[batch-processor] Processing batch 1/1

[90mstderr[2m | tests/safety.vitest.ts[2m > [22m[2mT105 + T106 Safety Tests[2m > [22m[2mT105: batchSize Validation[2m > [22m[2mT105-Valid100: batchSize=100 works (large)
[22m[39m[batch-processor] Processing batch 1/1

 [32m✓[39m tests/safety.vitest.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 13[2mms[22m[39m
[90mstderr[2m | tests/handler-memory-crud.vitest.ts[2m > [22m[2mHandler Memory CRUD (T519) [deferred - requires DB test fixtures]
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/handler-memory-crud.vitest.ts[2m > [22m[2mHandler Memory CRUD (T519) [deferred - requires DB test fixtures][2m > [22m[2mhandleMemoryList Input Validation[2m > [22m[2mT519-L3: Empty args accepted (defaults applied)
[22m[39mINFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index

[90mstderr[2m | tests/memory-lineage-state.vitest.ts[2m > [22m[2mMemory lineage state[2m > [22m[2mrejects invalid transition event and predecessor combinations before persistence
[22m[39m[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/memory-lineage-state.vitest.ts[2m > [22m[2mMemory lineage state[2m > [22m[2mrejects backwards valid_from timestamps and warns when a predecessor is already superseded
[22m[39m[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/handler-memory-crud.vitest.ts[2m > [22m[2mHandler Memory CRUD (T519) [deferred - requires DB test fixtures][2m > [22m[2mhandleMemoryHealth[2m > [22m[2mT519-H1: Health handler returns status
[22m[39m[factory] Using provider: voyage (VOYAGE_API_KEY detected (auto mode))

 [32m✓[39m tests/memory-summaries.vitest.ts [2m([22m[2m40 tests[22m[2m)[22m[32m 21[2mms[22m[39m
[90mstderr[2m | tests/handler-memory-crud.vitest.ts[2m > [22m[2mHandler Memory CRUD (T519) [deferred - requires DB test fixtures][2m > [22m[2mhandleMemoryHealth[2m > [22m[2mT519-H1: Health handler returns status
[22m[39m[embeddings] Provider created lazily (0ms)

[90mstderr[2m | tests/tool-input-schema.vitest.ts[2m > [22m[2mTool Input Schema Validation[2m > [22m[2mrejects unknown eval_run_ablation modes
[22m[39m[schema-validation] eval_run_ablation: Invalid arguments for "eval_run_ablation". Parameter "mode" is invalid: Invalid option: expected one of "ablation"|"k_sensitivity" Expected parameter names: mode, channels, queries, groundTruthQueryIds, recallK, storeResults, includeFormattedReport. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.

 [32m✓[39m tests/handler-memory-index.vitest.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 22[2mms[22m[39m
[90mstderr[2m | tests/tool-input-schema.vitest.ts[2m > [22m[2mmemory_bulk_delete schema[2m > [22m[2mrejects non-integer olderThanDays values
[22m[39m[schema-validation] memory_bulk_delete: Invalid arguments for "memory_bulk_delete". Parameter "olderThanDays" has invalid type. Expected int, received undefined. Expected parameter names: tier, specFolder, confirm, olderThanDays, skipCheckpoint. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.

[90mstderr[2m | tests/tool-input-schema.vitest.ts[2m > [22m[2mmemory_bulk_delete schema[2m > [22m[2mrejects NaN olderThanDays values
[22m[39m[schema-validation] memory_bulk_delete: Invalid arguments for "memory_bulk_delete". Parameter "olderThanDays" has invalid type. Expected number, received undefined. Expected parameter names: tier, specFolder, confirm, olderThanDays, skipCheckpoint. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.

[90mstderr[2m | tests/tool-input-schema.vitest.ts[2m > [22m[2mmemory_search limit contract[2m > [22m[2mrejects limit above 100
[22m[39m[schema-validation] memory_search: Invalid arguments for "memory_search". Parameter "limit" is invalid: Too big: expected number to be <=100 Expected parameter names: cursor, query, concepts, specFolder, tenantId, userId, agentId, sharedSpaceId, limit, sessionId, enableDedup, tier, contextType, useDecay, includeContiguity, includeConstitutional, enableSessionBoost, enableCausalBoost, includeContent, anchors, min_quality_score, minQualityScore, bypassCache, rerank, applyLengthPenalty, applyStateLimits, minState, intent, autoDetectIntent, trackAccess, includeArchived, mode, includeTrace, profile. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.

 [32m✓[39m tests/memory-lineage-state.vitest.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 86[2mms[22m[39m
[90mstderr[2m | tests/tool-input-schema.vitest.ts[2m > [22m[2mmemory_search limit contract[2m > [22m[2mruntime rejects concepts arrays shorter than 2 items
[22m[39m[schema-validation] memory_search: Invalid arguments for "memory_search". Parameter "concepts" is invalid: Too small: expected array to have >=2 items Parameter "query" is invalid: Either "query" (string), "concepts" (array with 2-5 items), or "cursor" (string) is required. Expected parameter names: cursor, query, concepts, specFolder, tenantId, userId, agentId, sharedSpaceId, limit, sessionId, enableDedup, tier, contextType, useDecay, includeContiguity, includeConstitutional, enableSessionBoost, enableCausalBoost, includeContent, anchors, min_quality_score, minQualityScore, bypassCache, rerank, applyLengthPenalty, applyStateLimits, minState, intent, autoDetectIntent, trackAccess, includeArchived, mode, includeTrace, profile. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.

[90mstderr[2m | tests/tool-input-schema.vitest.ts[2m > [22m[2mmemory_search limit contract[2m > [22m[2mruntime rejects unknown memory_search parameters
[22m[39m[schema-validation] memory_search: Invalid arguments for "memory_search". Unknown parameter(s): unexpected. Expected parameter names: cursor, query, concepts, specFolder, tenantId, userId, agentId, sharedSpaceId, limit, sessionId, enableDedup, tier, contextType, useDecay, includeContiguity, includeConstitutional, enableSessionBoost, enableCausalBoost, includeContent, anchors, min_quality_score, minQualityScore, bypassCache, rerank, applyLengthPenalty, applyStateLimits, minState, intent, autoDetectIntent, trackAccess, includeArchived, mode, includeTrace, profile. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.

[90mstderr[2m | tests/tool-input-schema.vitest.ts[2m > [22m[2mshared-memory admin actor schema[2m > [22m[2mruntime rejects shared_space_upsert when actor identity is missing
[22m[39m[schema-validation] shared_space_upsert: Invalid arguments for "shared_space_upsert". Parameter "actorUserId" is invalid: Exactly one of "actorUserId" or "actorAgentId" is required. Expected parameter names: spaceId, tenantId, name, actorUserId, actorAgentId, rolloutEnabled, rolloutCohort, killSwitch. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.

[90mstderr[2m | tests/tool-input-schema.vitest.ts[2m > [22m[2mshared-memory admin actor schema[2m > [22m[2mruntime rejects shared_space_membership_set when both actor identities are provided
[22m[39m[schema-validation] shared_space_membership_set: Invalid arguments for "shared_space_membership_set". Parameter "actorAgentId" is invalid: Provide only one actor identity: "actorUserId" or "actorAgentId". Expected parameter names: spaceId, tenantId, actorUserId, actorAgentId, subjectType, subjectId, role. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.

 [32m✓[39m tests/tool-input-schema.vitest.ts [2m([22m[2m48 tests[22m[2m)[22m[32m 28[2mms[22m[39m
 [32m✓[39m tests/handler-memory-crud.vitest.ts [2m([22m[2m27 tests[22m[2m)[22m[32m 30[2mms[22m[39m
[90mstderr[2m | tests/batch-learning.vitest.ts[2m > [22m[2mBatch Learning — runBatchLearning (integration)[2m > [22m[2mprocesses events and shadow-applies when flag is ON and min-support met
[22m[39m[batch-learning] computeShadowRankDelta error: no such table: memory_index

[90mstderr[2m | tests/batch-learning.vitest.ts[2m > [22m[2mBatch Learning — runBatchLearning (integration)[2m > [22m[2mcorrectly partitions eligible and skipped memories
[22m[39m[batch-learning] computeShadowRankDelta error: no such table: memory_index

[90mstderr[2m | tests/batch-learning.vitest.ts[2m > [22m[2mBatch Learning — runBatchLearning (integration)[2m > [22m[2mincludes candidates array in result
[22m[39m[batch-learning] computeShadowRankDelta error: no such table: memory_index

[90mstderr[2m | tests/batch-learning.vitest.ts[2m > [22m[2mBatch Learning — runBatchLearning (integration)[2m > [22m[2mmultiple batch runs produce separate log entries per run
[22m[39m[batch-learning] computeShadowRankDelta error: no such table: memory_index
[batch-learning] computeShadowRankDelta error: no such table: memory_index

 [32m✓[39m tests/batch-learning.vitest.ts [2m([22m[2m53 tests[22m[2m)[22m[32m 19[2mms[22m[39m
[90mstderr[2m | tests/memory-save-extended.vitest.ts
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/memory-save-extended.vitest.ts[2m > [22m[2mMEMORY SAVE EXTENDED[2m > [22m[2mprocessCausalLinks[2m > [22m[2mskips unknown link types
[22m[39m[causal-links] Unknown link type: unknown_type

[90mstderr[2m | tests/memory-save-extended.vitest.ts[2m > [22m[2mMEMORY SAVE EXTENDED[2m > [22m[2mprocessCausalLinks[2m > [22m[2mresolves and inserts valid links
[22m[39m[causal-links] Inserted edge: 1 -[caused]-> 10

[90mstderr[2m | tests/memory-save-extended.vitest.ts[2m > [22m[2mMEMORY SAVE EXTENDED[2m > [22m[2mprocessCausalLinks[2m > [22m[2mhandles multiple references
[22m[39m[causal-links] Inserted edge: 1 -[caused]-> 10
[causal-links] Inserted edge: 2 -[caused]-> 10

[90mstderr[2m | tests/memory-save-extended.vitest.ts[2m > [22m[2mMEMORY SAVE EXTENDED[2m > [22m[2mprocessCausalLinks[2m > [22m[2msupersedes link type
[22m[39m[causal-links] Inserted edge: 10 -[supersedes]-> 3

[90mstderr[2m | tests/memory-save-extended.vitest.ts[2m > [22m[2mMEMORY SAVE EXTENDED[2m > [22m[2mlogPeDecision[2m > [22m[2mlogs basic decision without error
[22m[39m[memory-save] Failed to log conflict: FOREIGN KEY constraint failed

[90mstderr[2m | tests/memory-save-extended.vitest.ts[2m > [22m[2mMEMORY SAVE EXTENDED[2m > [22m[2mlogPeDecision[2m > [22m[2mlogs contradiction decision
[22m[39m[memory-save] Failed to log conflict: FOREIGN KEY constraint failed

[90mstderr[2m | tests/memory-save-extended.vitest.ts[2m > [22m[2mMEMORY SAVE EXTENDED[2m > [22m[2mreinforceExistingMemory[2m > [22m[2merror for non-existent ID
[22m[39m[memory-save] PE reinforcement failed: Memory 99999 not found for reinforcement

[90mstderr[2m | tests/memory-save-extended.vitest.ts[2m > [22m[2mMEMORY SAVE EXTENDED[2m > [22m[2mreinforceExistingMemory[2m > [22m[2merror result has expected fields
[22m[39m[memory-save] PE reinforcement failed: Memory 88888 not found for reinforcement

[90mstderr[2m | tests/memory-save-extended.vitest.ts[2m > [22m[2mMEMORY SAVE EXTENDED[2m > [22m[2mmarkMemorySuperseded[2m > [22m[2mhandles non-existent ID
[22m[39m[PE-Gate] Memory 99999 not found, cannot mark as superseded

[90mstderr[2m | tests/memory-save-extended.vitest.ts[2m > [22m[2mMEMORY SAVE EXTENDED[2m > [22m[2mmarkMemorySuperseded[2m > [22m[2midempotent - no error on repeated calls
[22m[39m[PE-Gate] Memory 77777 not found, cannot mark as superseded
[PE-Gate] Memory 77777 not found, cannot mark as superseded

 [32m✓[39m tests/stdio-logging-safety.vitest.ts [2m([22m[2m1 test[22m[2m)[22m[32m 31[2mms[22m[39m
 [32m✓[39m tests/spec-folder-hierarchy.vitest.ts [2m([22m[2m48 tests[22m[2m)[22m[32m 16[2mms[22m[39m
[90mstdout[2m | tests/memory-save-extended.vitest.ts[2m > [22m[2mMEMORY SAVE EXTENDED[2m > [22m[2matomicSaveMemory[2m > [22m[2mreturns result with success and filePath fields
[22m[39m{"timestamp":"2026-03-25T09:20:15.615Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:1","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/memory-save-extended.vitest.ts[2m > [22m[2mMEMORY SAVE EXTENDED[2m > [22m[2matomicSaveMemory[2m > [22m[2mreturns result with success and filePath fields
[22m[39m[memory-save] V-rule hard block for test-memory.md: V13

[90mstdout[2m | tests/memory-save-extended.vitest.ts[2m > [22m[2mMEMORY SAVE EXTENDED[2m > [22m[2matomicSaveMemory[2m > [22m[2mrejects for empty params
[22m[39m{"timestamp":"2026-03-25T09:20:15.617Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:0","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/memory-save-extended.vitest.ts[2m > [22m[2mMEMORY SAVE EXTENDED[2m > [22m[2matomicSaveMemory[2m > [22m[2mrejects for empty params
[22m[39m[memory-save] V-rule hard block for : V13

[90mstdout[2m | tests/memory-save-extended.vitest.ts[2m > [22m[2mMEMORY SAVE EXTENDED[2m > [22m[2mindexMemoryFile[2m > [22m[2maccepts parsedOverride option
[22m[39m{"timestamp":"2026-03-25T09:20:15.619Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:unknown","trigger_phrases:0","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

[90mstderr[2m | tests/memory-save-extended.vitest.ts[2m > [22m[2mMEMORY SAVE EXTENDED[2m > [22m[2mindexMemoryFile[2m > [22m[2maccepts parsedOverride option
[22m[39m[memory-save] V-rule hard block for path.md: V13

 [32m✓[39m tests/memory-save-extended.vitest.ts [2m([22m[2m43 tests[22m[2m)[22m[32m 37[2mms[22m[39m
 [32m✓[39m tests/corrections.vitest.ts [2m([22m[2m37 tests[22m[2m)[22m[32m 39[2mms[22m[39m
[90mstderr[2m | tests/transaction-manager-recovery.vitest.ts[2m > [22m[2mtransaction-manager recovery committed vs uncommitted (T007)[2m > [22m[2mT007-R3: marks pending file as stale when isCommittedInDb returns false
[22m[39m[transaction-manager] Stale pending file detected (no committed DB row): /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/txn-mgr-recovery-r3-iVFiE4/specs/001/memory/r3_pending.md

[90mstderr[2m | tests/transaction-manager-recovery.vitest.ts[2m > [22m[2mtransaction-manager recovery committed vs uncommitted (T007)[2m > [22m[2mT007-R4: does not delete stale pending file
[22m[39m[transaction-manager] Stale pending file detected (no committed DB row): /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/txn-mgr-recovery-r4-EmlFgo/specs/001/memory/r4_pending.md

[90mstderr[2m | tests/transaction-manager-recovery.vitest.ts[2m > [22m[2mtransaction-manager recovery committed vs uncommitted (T007)[2m > [22m[2mT011-R1: skips rename when original target is missing and DB probe says uncommitted
[22m[39m[transaction-manager] Stale pending file detected (no committed DB row): /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/txn-mgr-recovery-t011-r1-L8mW2q/specs/011/memory/uncommitted_pending.md

[90mstderr[2m | tests/transaction-manager-recovery.vitest.ts[2m > [22m[2mtransaction-manager recovery committed vs uncommitted (T007)[2m > [22m[2mT007-R6: recoverAllPendingFiles returns mixed committed and stale results correctly
[22m[39m[transaction-manager] Stale pending file detected (no committed DB row): /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/txn-mgr-recovery-r6-KE3WZf/specs/memory/stale_pending.md

[90mstderr[2m | tests/transaction-manager-recovery.vitest.ts[2m > [22m[2mtransaction-manager recovery committed vs uncommitted (T007)[2m > [22m[2mT007-R9: skips recovery when DB file is missing even if callback reports committed
[22m[39m[transaction-manager] Skipping pending recovery because DB file is missing: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/txn-mgr-recovery-r9-Go7dFh/missing-db/context-index.sqlite

[90mstderr[2m | tests/checkpoint-working-memory.vitest.ts[2m > [22m[2mT213: Checkpoint Working Memory Restore[2m > [22m[2mWorking memory included in checkpoint snapshot[2m > [22m[2mT213-01: Checkpoint created with working memory
[22m[39m[checkpoints] Created checkpoint "t213-snapshot-test" (783 bytes compressed)

 [32m✓[39m tests/transaction-manager-recovery.vitest.ts [2m([22m[2m13 tests[22m[2m)[22m[32m 30[2mms[22m[39m
[90mstderr[2m | tests/checkpoint-working-memory.vitest.ts[2m > [22m[2mT213: Checkpoint Working Memory Restore[2m > [22m[2mWorking memory survives save/restore cycle[2m > [22m[2mT213-03: Working memory restored count correct
[22m[39m[checkpoints] Skipping post-restore rebuild "auto-entities" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "degree-snapshots" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "community-assignments" because dependencies did not complete: degree-snapshots
[checkpoints] Skipping post-restore rebuild "fts-rebuild" because dependencies did not complete: lineage-backfill, auto-entities
[checkpoints] Post-restore rebuild summary: completed=none; skipped=auto-entities, degree-snapshots, community-assignments, fts-rebuild
[checkpoints] Restored 2 memories, 2 working memory entries from "t213-snapshot-test"

[90mstderr[2m | tests/checkpoint-working-memory.vitest.ts[2m > [22m[2mT213: Checkpoint Working Memory Restore[2m > [22m[2mclearExisting clears and restores working memory[2m > [22m[2mT213-06: clearExisting removed non-checkpoint working memory
[22m[39m[checkpoints] Skipping post-restore rebuild "auto-entities" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "degree-snapshots" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "community-assignments" because dependencies did not complete: degree-snapshots
[checkpoints] Skipping post-restore rebuild "fts-rebuild" because dependencies did not complete: lineage-backfill, auto-entities
[checkpoints] Post-restore rebuild summary: completed=none; skipped=auto-entities, degree-snapshots, community-assignments, fts-rebuild
[checkpoints] Restored 2 memories, 2 working memory entries from "t213-snapshot-test"

[90mstderr[2m | tests/promotion-positive-validation-semantics.vitest.ts[2m > [22m[2mT055: positive-validation semantics for promotion thresholds[2m > [22m[2mrecordValidation reports positiveValidationCount separately from total validationCount
[22m[39m[confidence-tracker] negative feedback recorded {
  chunkId: [33m2[39m,
  previousConfidence: [33m0.9[39m,
  newConfidence: [33m0.85[39m,
  decrement: [33m0.05[39m
}

[90mstderr[2m | tests/checkpoint-working-memory.vitest.ts[2m > [22m[2mT213: Checkpoint Working Memory Restore[2m > [22m[2mclearExisting clears and restores working memory[2m > [22m[2mT213-07: clearExisting restore reports correct WM count
[22m[39m[checkpoints] Skipping post-restore rebuild "auto-entities" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "degree-snapshots" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "community-assignments" because dependencies did not complete: degree-snapshots
[checkpoints] Skipping post-restore rebuild "fts-rebuild" because dependencies did not complete: lineage-backfill, auto-entities
[checkpoints] Post-restore rebuild summary: completed=none; skipped=auto-entities, degree-snapshots, community-assignments, fts-rebuild
[checkpoints] Restored 2 memories, 2 working memory entries from "t213-snapshot-test"

[90mstderr[2m | tests/promotion-positive-validation-semantics.vitest.ts[2m > [22m[2mT055: positive-validation semantics for promotion thresholds[2m > [22m[2mauto-promotion checks use positive-validation counts (total minus negatives)
[22m[39m[auto-promotion] Memory 4 promoted: normal -> important (5 validations)

 [32m✓[39m tests/flag-ceiling.vitest.ts [2m([22m[2m5 tests[22m[2m)[22m[32m 39[2mms[22m[39m
 [32m✓[39m tests/promotion-positive-validation-semantics.vitest.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 26[2mms[22m[39m
[90mstderr[2m | tests/checkpoint-working-memory.vitest.ts[2m > [22m[2mT213: Checkpoint Working Memory Restore[2m > [22m[2mRestoreResult interface[2m > [22m[2mT213-08: workingMemoryRestored field exists and is number
[22m[39m[checkpoints] Skipping post-restore rebuild "auto-entities" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "degree-snapshots" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "community-assignments" because dependencies did not complete: degree-snapshots
[checkpoints] Skipping post-restore rebuild "fts-rebuild" because dependencies did not complete: lineage-backfill, auto-entities
[checkpoints] Post-restore rebuild summary: completed=none; skipped=auto-entities, degree-snapshots, community-assignments, fts-rebuild
[checkpoints] Restored 2 memories, 2 working memory entries from "t213-snapshot-test"

 [32m✓[39m tests/ablation-framework.vitest.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 33[2mms[22m[39m
[90mstderr[2m | tests/checkpoint-working-memory.vitest.ts[2m > [22m[2mT213: Checkpoint Working Memory Restore[2m > [22m[2mCheckpoint with empty working memory[2m > [22m[2mT213-09: Empty WM checkpoint restores without errors
[22m[39m[checkpoints] Created checkpoint "t213-empty-wm" (776 bytes compressed)
[checkpoints] Skipping post-restore rebuild "auto-entities" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "degree-snapshots" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "community-assignments" because dependencies did not complete: degree-snapshots
[checkpoints] Skipping post-restore rebuild "fts-rebuild" because dependencies did not complete: lineage-backfill, auto-entities
[checkpoints] Post-restore rebuild summary: completed=none; skipped=auto-entities, degree-snapshots, community-assignments, fts-rebuild
[checkpoints] Restored 2 memories, 0 working memory entries from "t213-empty-wm"

[90mstderr[2m | tests/checkpoint-working-memory.vitest.ts[2m > [22m[2mT213: Checkpoint Working Memory Restore
[22m[39m[checkpoints] deleteCheckpoint error: The database connection is not open

 [32m✓[39m tests/checkpoint-working-memory.vitest.ts [2m([22m[2m9 tests[22m[2m)[22m[32m 43[2mms[22m[39m
 [32m✓[39m tests/composite-scoring.vitest.ts [2m([22m[2m105 tests[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m tests/adaptive-ranking.vitest.ts [2m([22m[2m12 tests[22m[2m)[22m[32m 12[2mms[22m[39m
[90mstderr[2m | tests/confidence-tracker.vitest.ts[2m > [22m[2mConfidence Tracker Tests (T510)[2m > [22m[2mNegative Feedback Adjusts Down (T510-03)[2m > [22m[2mT510-03a: Negative validation decreases confidence
[22m[39m[confidence-tracker] negative feedback recorded {
  chunkId: [33m4[39m,
  previousConfidence: [33m0.1[39m,
  newConfidence: [33m0.05[39m,
  decrement: [33m0.05[39m
}

[90mstderr[2m | tests/confidence-tracker.vitest.ts[2m > [22m[2mConfidence Tracker Tests (T510)[2m > [22m[2mNegative Feedback Adjusts Down (T510-03)[2m > [22m[2mT510-03b: Confidence decreased by NEGATIVE_DECREMENT
[22m[39m[confidence-tracker] negative feedback recorded {
  chunkId: [33m4[39m,
  previousConfidence: [33m0.1[39m,
  newConfidence: [33m0.05[39m,
  decrement: [33m0.05[39m
}

[90mstderr[2m | tests/confidence-tracker.vitest.ts[2m > [22m[2mConfidence Tracker Tests (T510)[2m > [22m[2mConfidence Bounds (T510-04)[2m > [22m[2mT510-04a: Confidence never goes below CONFIDENCE_MIN (0.0)
[22m[39m[confidence-tracker] negative feedback recorded {
  chunkId: [33m4[39m,
  previousConfidence: [33m0.1[39m,
  newConfidence: [33m0.05[39m,
  decrement: [33m0.05[39m
}
[confidence-tracker] negative feedback recorded {
  chunkId: [33m4[39m,
  previousConfidence: [33m0.05[39m,
  newConfidence: [33m0[39m,
  decrement: [33m0.05[39m
}
[confidence-tracker] negative feedback recorded {
  chunkId: [33m4[39m,
  previousConfidence: [33m0[39m,
  newConfidence: [33m0[39m,
  decrement: [33m0.05[39m
}
[confidence-tracker] negative feedback recorded {
  chunkId: [33m4[39m,
  previousConfidence: [33m0[39m,
  newConfidence: [33m0[39m,
  decrement: [33m0.05[39m
}
[confidence-tracker] negative feedback recorded {
  chunkId: [33m4[39m,
  previousConfidence: [33m0[39m,
  newConfidence: [33m0[39m,
  decrement: [33m0.05[39m
}
[confidence-tracker] negative feedback recorded {
  chunkId: [33m4[39m,
  previousConfidence: [33m0[39m,
  newConfidence: [33m0[39m,
  decrement: [33m0.05[39m
}
[confidence-tracker] negative feedback recorded {
  chunkId: [33m4[39m,
  previousConfidence: [33m0[39m,
  newConfidence: [33m0[39m,
  decrement: [33m0.05[39m
}
[confidence-tracker] negative feedback recorded {
  chunkId: [33m4[39m,
  previousConfidence: [33m0[39m,
  newConfidence: [33m0[39m,
  decrement: [33m0.05[39m
}
[confidence-tracker] negative feedback recorded {
  chunkId: [33m4[39m,
  previousConfidence: [33m0[39m,
  newConfidence: [33m0[39m,
  decrement: [33m0.05[39m
}
[confidence-tracker] negative feedback recorded {
  chunkId: [33m4[39m,
  previousConfidence: [33m0[39m,
  newConfidence: [33m0[39m,
  decrement: [33m0.05[39m
}

[90mstderr[2m | tests/confidence-tracker.vitest.ts[2m > [22m[2mConfidence Tracker Tests (T510)[2m > [22m[2mPromotion Tracking and History (T510-05)[2m > [22m[2mT510-05b: Auto-promotion occurred
[22m[39m[confidence-tracker] Memory 5 promoted to critical tier

 [32m✓[39m tests/shadow-scoring.vitest.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 15[2mms[22m[39m
[90mstderr[2m | tests/confidence-tracker.vitest.ts[2m > [22m[2mDB Error Safe Defaults (T103)[2m > [22m[2mClosed DB Handle (T103-01)[2m > [22m[2mT103-01b: recordValidation throws on closed DB (T-07: explicit failure signaling)
[22m[39m[confidence-tracker] recordValidation failed for memory 1: TypeError: The database connection is not open
    at getController [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mbetter-sqlite3[24m/lib/methods/transaction.js:35:15[90m)[39m
    at Database.transaction [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mbetter-sqlite3[24m/lib/methods/transaction.js:9:21[90m)[39m
    at Module.recordValidation [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mlib/scoring/confidence-tracker.ts:111:15[90m)[39m
    at [90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/confidence-tracker.vitest.ts:256:24
    at Proxy.assertThrows [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/expect[24m/node_modules/[4mchai[24m/index.js:2798:5[90m)[39m
    at Proxy.methodWrapper [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/expect[24m/node_modules/[4mchai[24m/index.js:1700:25[90m)[39m
    at Proxy.<anonymous> [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/expect[24m/dist/index.js:1149:12[90m)[39m
    at Proxy.overwritingMethodWrapper [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/expect[24m/node_modules/[4mchai[24m/index.js:1750:33[90m)[39m
    at Proxy.<anonymous> [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/expect[24m/dist/index.js:1485:16[90m)[39m
    at Proxy.<anonymous> [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/expect[24m/dist/index.js:1090:14[90m)[39m

[90mstderr[2m | tests/confidence-tracker.vitest.ts[2m > [22m[2mDB Error Safe Defaults (T103)[2m > [22m[2mClosed DB Handle (T103-01)[2m > [22m[2mT103-01c: getConfidenceScore returns CONFIDENCE_BASE on closed DB
[22m[39m[confidence-tracker] getConfidenceScore failed for memory 1: TypeError: The database connection is not open
    at Database.prepare [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mbetter-sqlite3[24m/lib/methods/wrappers.js:5:21[90m)[39m
    at Module.getConfidenceScore [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mlib/scoring/confidence-tracker.ts:188:23[90m)[39m
    at [90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/confidence-tracker.vitest.ts:260:25
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:145:11
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:915:26
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1209:10[90m)[39m
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1653:37
    at Traces.$ [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/traces.CCmnQaNT.js:142:27[90m)[39m

[90mstderr[2m | tests/confidence-tracker.vitest.ts[2m > [22m[2mDB Error Safe Defaults (T103)[2m > [22m[2mClosed DB Handle (T103-01)[2m > [22m[2mT103-01d: checkPromotionEligible returns false on closed DB
[22m[39m[confidence-tracker] checkPromotionEligible failed for memory 1: TypeError: The database connection is not open
    at Database.prepare [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mbetter-sqlite3[24m/lib/methods/wrappers.js:5:21[90m)[39m
    at Module.checkPromotionEligible [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mlib/scoring/confidence-tracker.ts:208:23[90m)[39m
    at [90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/confidence-tracker.vitest.ts:265:28
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:145:11
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:915:26
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1209:10[90m)[39m
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1653:37
    at Traces.$ [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/traces.CCmnQaNT.js:142:27[90m)[39m

[90mstderr[2m | tests/confidence-tracker.vitest.ts[2m > [22m[2mDB Error Safe Defaults (T103)[2m > [22m[2mClosed DB Handle (T103-01)[2m > [22m[2mT103-01e: promoteToCritical returns false on closed DB
[22m[39m[confidence-tracker] checkPromotionEligible failed for memory 1: TypeError: The database connection is not open
    at Database.prepare [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mbetter-sqlite3[24m/lib/methods/wrappers.js:5:21[90m)[39m
    at checkPromotionEligible [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mlib/scoring/confidence-tracker.ts:208:23[90m)[39m
    at Module.promoteToCritical [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mlib/scoring/confidence-tracker.ts:238:10[90m)[39m
    at [90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/confidence-tracker.vitest.ts:270:28
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:145:11
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:915:26
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1209:10[90m)[39m
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1653:37
[confidence-tracker] promoteToCritical failed for memory 1: TypeError: The database connection is not open
    at Database.prepare [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mbetter-sqlite3[24m/lib/methods/wrappers.js:5:21[90m)[39m
    at Module.promoteToCritical [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mlib/scoring/confidence-tracker.ts:239:25[90m)[39m
    at [90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/confidence-tracker.vitest.ts:270:28
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:145:11
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:915:26
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1209:10[90m)[39m
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1653:37
    at Traces.$ [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/traces.CCmnQaNT.js:142:27[90m)[39m

[90mstderr[2m | tests/confidence-tracker.vitest.ts[2m > [22m[2mDB Error Safe Defaults (T103)[2m > [22m[2mClosed DB Handle (T103-01)[2m > [22m[2mT103-01f: getConfidenceInfo throws on closed DB (T-07: explicit failure signaling)
[22m[39m[confidence-tracker] getConfidenceInfo failed for memory 42: TypeError: The database connection is not open
    at Database.prepare [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mbetter-sqlite3[24m/lib/methods/wrappers.js:5:21[90m)[39m
    at Module.getConfidenceInfo [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mlib/scoring/confidence-tracker.ts:285:23[90m)[39m
    at [90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/confidence-tracker.vitest.ts:275:24
    at Proxy.assertThrows [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/expect[24m/node_modules/[4mchai[24m/index.js:2798:5[90m)[39m
    at Proxy.methodWrapper [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/expect[24m/node_modules/[4mchai[24m/index.js:1700:25[90m)[39m
    at Proxy.<anonymous> [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/expect[24m/dist/index.js:1149:12[90m)[39m
    at Proxy.overwritingMethodWrapper [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/expect[24m/node_modules/[4mchai[24m/index.js:1750:33[90m)[39m
    at Proxy.<anonymous> [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/expect[24m/dist/index.js:1485:16[90m)[39m
    at Proxy.<anonymous> [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/expect[24m/dist/index.js:1090:14[90m)[39m
    at Proxy.methodWrapper [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/expect[24m/node_modules/[4mchai[24m/index.js:1700:25[90m)[39m

[90mstderr[2m | tests/confidence-tracker.vitest.ts[2m > [22m[2mDB Error Safe Defaults (T103)[2m > [22m[2mMock SQLITE_BUSY (T103-02)[2m > [22m[2mT103-02a: recordValidation throws on SQLITE_BUSY (T-07: explicit failure signaling)
[22m[39m[confidence-tracker] recordValidation failed for memory 100: Error: SQLITE_BUSY: database is locked
    at createBrokenDb [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/confidence-tracker.vitest.ts:69:21[90m)[39m
    at [90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/confidence-tracker.vitest.ts:286:18
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1209:10[90m)[39m
    at runHook [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1514:51[90m)[39m
    at callSuiteHook [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1520:25[90m)[39m
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1796:58
    at Traces.$ [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/traces.CCmnQaNT.js:142:27[90m)[39m
    at trace [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/test.B8ej_ZHS.js:239:21[90m)[39m

[90mstderr[2m | tests/confidence-tracker.vitest.ts[2m > [22m[2mDB Error Safe Defaults (T103)[2m > [22m[2mMock SQLITE_BUSY (T103-02)[2m > [22m[2mT103-02b: getConfidenceScore survives SQLITE_BUSY
[22m[39m[confidence-tracker] getConfidenceScore failed for memory 100: Error: SQLITE_BUSY: database is locked
    at createBrokenDb [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/confidence-tracker.vitest.ts:69:21[90m)[39m
    at [90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/confidence-tracker.vitest.ts:286:18
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1209:10[90m)[39m
    at runHook [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1514:51[90m)[39m
    at callSuiteHook [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1520:25[90m)[39m
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1796:58
    at Traces.$ [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/traces.CCmnQaNT.js:142:27[90m)[39m
    at trace [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/test.B8ej_ZHS.js:239:21[90m)[39m

[90mstderr[2m | tests/confidence-tracker.vitest.ts[2m > [22m[2mDB Error Safe Defaults (T103)[2m > [22m[2mMock SQLITE_BUSY (T103-02)[2m > [22m[2mT103-02c: checkPromotionEligible survives SQLITE_BUSY
[22m[39m[confidence-tracker] checkPromotionEligible failed for memory 100: Error: SQLITE_BUSY: database is locked
    at createBrokenDb [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/confidence-tracker.vitest.ts:69:21[90m)[39m
    at [90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/confidence-tracker.vitest.ts:286:18
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1209:10[90m)[39m
    at runHook [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1514:51[90m)[39m
    at callSuiteHook [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1520:25[90m)[39m
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1796:58
    at Traces.$ [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/traces.CCmnQaNT.js:142:27[90m)[39m
    at trace [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/test.B8ej_ZHS.js:239:21[90m)[39m

[90mstderr[2m | tests/confidence-tracker.vitest.ts[2m > [22m[2mDB Error Safe Defaults (T103)[2m > [22m[2mMock SQLITE_BUSY (T103-02)[2m > [22m[2mT103-02d: promoteToCritical survives SQLITE_BUSY
[22m[39m[confidence-tracker] checkPromotionEligible failed for memory 100: Error: SQLITE_BUSY: database is locked
    at createBrokenDb [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/confidence-tracker.vitest.ts:69:21[90m)[39m
    at [90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/confidence-tracker.vitest.ts:286:18
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1209:10[90m)[39m
    at runHook [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1514:51[90m)[39m
    at callSuiteHook [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1520:25[90m)[39m
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1796:58
    at Traces.$ [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/traces.CCmnQaNT.js:142:27[90m)[39m
    at trace [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/test.B8ej_ZHS.js:239:21[90m)[39m
[confidence-tracker] promoteToCritical failed for memory 100: Error: SQLITE_BUSY: database is locked
    at createBrokenDb [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/confidence-tracker.vitest.ts:69:21[90m)[39m
    at [90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/confidence-tracker.vitest.ts:286:18
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1209:10[90m)[39m
    at runHook [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1514:51[90m)[39m
    at callSuiteHook [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1520:25[90m)[39m
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1796:58
    at Traces.$ [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/traces.CCmnQaNT.js:142:27[90m)[39m
    at trace [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/test.B8ej_ZHS.js:239:21[90m)[39m

[90mstderr[2m | tests/confidence-tracker.vitest.ts[2m > [22m[2mDB Error Safe Defaults (T103)[2m > [22m[2mMock SQLITE_BUSY (T103-02)[2m > [22m[2mT103-02e: getConfidenceInfo throws on SQLITE_BUSY (T-07: explicit failure signaling)
[22m[39m[confidence-tracker] getConfidenceInfo failed for memory 100: Error: SQLITE_BUSY: database is locked
    at createBrokenDb [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/confidence-tracker.vitest.ts:69:21[90m)[39m
    at [90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/confidence-tracker.vitest.ts:286:18
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1209:10[90m)[39m
    at runHook [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1514:51[90m)[39m
    at callSuiteHook [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1520:25[90m)[39m
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1796:58
    at Traces.$ [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/traces.CCmnQaNT.js:142:27[90m)[39m
    at trace [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/test.B8ej_ZHS.js:239:21[90m)[39m

 [32m✓[39m tests/confidence-tracker.vitest.ts [2m([22m[2m32 tests[22m[2m)[22m[32m 22[2mms[22m[39m
[90mstderr[2m | tests/content-hash-dedup.vitest.ts[2m > [22m[2mT054: SHA256 Content-Hash Dedup (TM-02)[2m > [22m[2mDedup Query Logic[2m > [22m[2mT054-3: Detects duplicate when same content saved under different file path
[22m[39m[memory-save] T054: Duplicate content detected (hash match id=2), skipping embedding

[90mstderr[2m | tests/content-hash-dedup.vitest.ts[2m > [22m[2mT054: SHA256 Content-Hash Dedup (TM-02)[2m > [22m[2mDedup Query Logic[2m > [22m[2mT054-6: Returns most recent record (highest id) for multiple matches
[22m[39m[memory-save] T054: Duplicate content detected (hash match id=6), skipping embedding

[90mstderr[2m | tests/content-hash-dedup.vitest.ts[2m > [22m[2mT054: SHA256 Content-Hash Dedup (TM-02)[2m > [22m[2mDedup Query Logic[2m > [22m[2mT054-6ab: Matching governance scope still dedups identical content
[22m[39m[memory-save] T054: Duplicate content detected (hash match id=8), skipping embedding

[90mstderr[2m | tests/content-hash-dedup.vitest.ts[2m > [22m[2mT054: SHA256 Content-Hash Dedup (TM-02)[2m > [22m[2mDedup Query Logic[2m > [22m[2mT054-6b: Partial parent rows remain dedup-eligible
[22m[39m[memory-save] T054: Duplicate content detected (hash match id=9), skipping embedding

[90mstderr[2m | tests/content-hash-dedup.vitest.ts[2m > [22m[2mT054: SHA256 Content-Hash Dedup (TM-02)[2m > [22m[2mSame-path unchanged gate[2m > [22m[2mT054-6h: Cross-path duplicates remain detectable when legacy rows have NULL canonical_file_path
[22m[39m[memory-save] T054: Duplicate content detected (hash match id=15), skipping embedding

[90mstderr[2m | tests/content-hash-dedup.vitest.ts[2m > [22m[2mT054: SHA256 Content-Hash Dedup (TM-02)[2m > [22m[2mDuplicate Return Value[2m > [22m[2mT054-11: Duplicate result contains id, file_path, and title fields
[22m[39m[memory-save] T054: Duplicate content detected (hash match id=19), skipping embedding

[90mstderr[2m | tests/content-hash-dedup.vitest.ts[2m > [22m[2mT054: SHA256 Content-Hash Dedup (TM-02)[2m > [22m[2mDuplicate Return Value[2m > [22m[2mT054-12: title is null when not set
[22m[39m[memory-save] T054: Duplicate content detected (hash match id=20), skipping embedding

 [32m✓[39m tests/content-hash-dedup.vitest.ts [2m([22m[2m27 tests[22m[2m)[22m[32m 21[2mms[22m[39m
 [32m✓[39m tests/full-spec-doc-indexing.vitest.ts [2m([22m[2m144 tests[22m[2m)[22m[32m 13[2mms[22m[39m
 [32m✓[39m tests/query-decomposer.vitest.ts [2m([22m[2m32 tests[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m tests/retry-manager-health.vitest.ts [2m([22m[2m1 test[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m tests/memory-parser-extended.vitest.ts [2m([22m[2m46 tests[22m[2m)[22m[32m 23[2mms[22m[39m
 [32m✓[39m tests/stage1-expansion.vitest.ts [2m([22m[2m12 tests[22m[2m)[22m[32m 7[2mms[22m[39m
[90mstderr[2m | tests/shared-spaces.vitest.ts[2m > [22m[2mPhase 6 shared spaces[2m > [22m[2mreturns false by default when no env var and no DB config
[22m[39m[shared-spaces] Failed to resolve shared_memory_enabled config: no such table: config

[90mstderr[2m | tests/shared-spaces.vitest.ts[2m > [22m[2mPhase 6 shared spaces[2m > [22m[2mreturns true after enableSharedMemory is called
[22m[39m[shared-spaces] Failed to resolve shared_memory_enabled config: no such table: config

[90mstderr[2m | tests/handler-memory-list-edge.vitest.ts
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

 [32m✓[39m tests/shared-spaces.vitest.ts [2m([22m[2m22 tests[22m[2m)[22m[32m 22[2mms[22m[39m
[90mstderr[2m | tests/handler-memory-list-edge.vitest.ts[2m > [22m[2mhandleMemoryList Edge Cases (T006)[2m > [22m[2mT006-L1: Invalid sortBy falls back to created_at in the response payload
[22m[39mINFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index

[90mstderr[2m | tests/handler-memory-list-edge.vitest.ts[2m > [22m[2mhandleMemoryList Edge Cases (T006)[2m > [22m[2mT006-L9: checkDatabaseUpdated failures return MCP error response with requestId
[22m[39m[memory-list] Database refresh failed [requestId=46129ef8-fc9e-4a34-a2c8-52d6187e0f17]: marker read failed

 [32m✓[39m tests/handler-memory-list-edge.vitest.ts [2m([22m[2m9 tests[22m[2m)[22m[32m 24[2mms[22m[39m
 [32m✓[39m tests/trigger-extractor.vitest.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 23[2mms[22m[39m
[90mstderr[2m | tests/handler-memory-search.vitest.ts[2m > [22m[2mHandler Memory Search (T516) [deferred - requires DB test fixtures]
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/handler-memory-search.vitest.ts[2m > [22m[2mT002: Chunk Collapse Dedup (G3)[2m > [22m[2mT002-3: duplicate sibling chunks (same parent_id) are collapsed to one row
[22m[39mINFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index

 [32m✓[39m tests/handler-memory-search.vitest.ts [2m([22m[2m18 tests[22m[2m)[22m[32m 20[2mms[22m[39m
[90mstderr[2m | tests/n3lite-consolidation.vitest.ts[2m > [22m[2mT002d: Edge bounds enforcement[2m > [22m[2mT-BOUNDS-02: auto edge rejected when at MAX_EDGES_PER_NODE
[22m[39m[causal-edges] Edge bounds: node 1 has 20 edges (max 20), rejecting auto edge

 [32m✓[39m tests/entity-extractor.vitest.ts [2m([22m[2m49 tests[22m[2m)[22m[32m 13[2mms[22m[39m
 [32m✓[39m tests/n3lite-consolidation.vitest.ts [2m([22m[2m32 tests[22m[2m)[22m[32m 20[2mms[22m[39m
[90mstderr[2m | tests/scoring-observability.vitest.ts[2m > [22m[2mT010-7: No Scoring Behavior Change When Observability Active[2m > [22m[2mT010-7g: observability failure (broken db) does not throw from calculateFiveFactorScore
[22m[39m[scoring-observability] logScoringObservation failed: The database connection is not open

 [32m✓[39m tests/scoring-observability.vitest.ts [2m([22m[2m39 tests[22m[2m)[22m[32m 14[2mms[22m[39m
[90mstderr[2m | tests/handler-memory-health-edge.vitest.ts
[22m[39mINFO  [VectorIndex] Created vec_memories table with dimension 1024
[vector-index] Schema created successfully
INFO  [VectorIndex] Migrating schema from v0 to v23
INFO  [VectorIndex] Running migration v1
INFO  [VectorIndex] Running migration v2
INFO  [VectorIndex] Migration v2: Created idx_history_timestamp index
INFO  [VectorIndex] Running migration v3
INFO  [VectorIndex] Migration v3: Added related_memories column
INFO  [VectorIndex] Running migration v4
INFO  [VectorIndex] Migration v4: Created memory_conflicts table
INFO  [VectorIndex] Migration v4: Created FSRS indexes
INFO  [VectorIndex] Running migration v5
INFO  [VectorIndex] Migration v5: Added memory_type column
INFO  [VectorIndex] Migration v5: Added half_life_days column
INFO  [VectorIndex] Migration v5: Added type_inference_source column
INFO  [VectorIndex] Migration v5: Created memory_type indexes
INFO  [VectorIndex] Migration v5: Type inference backfill will run on next index scan
INFO  [VectorIndex] Running migration v6
INFO  [VectorIndex] Migration v6: Created file_mtime index
INFO  [VectorIndex] Running migration v7
INFO  [VectorIndex] Migration v7: Created idx_embedding_pending partial index
INFO  [VectorIndex] Migration v7: Created idx_fts_fallback index for deferred indexing
INFO  [VectorIndex] Running migration v8
INFO  [VectorIndex] Migration v8: Created causal_edges table
INFO  [VectorIndex] Migration v8: Created causal_edges indexes
INFO  [VectorIndex] Running migration v9
INFO  [VectorIndex] Migration v9: Created memory_corrections table
INFO  [VectorIndex] Migration v9: Created memory_corrections indexes
INFO  [VectorIndex] Running migration v12
INFO  [VectorIndex] Migration v12: Unified memory_conflicts table (KL-1)
INFO  [VectorIndex] Migration v12: Created memory_conflicts indexes
INFO  [VectorIndex] Running migration v13
INFO  [VectorIndex] Migration v13: Created document_type indexes
INFO  [VectorIndex] Migration v13: Backfilled document_type for constitutional files
INFO  [VectorIndex] Running migration v14
INFO  [VectorIndex] Migration v14: Rebuilt FTS5 table with content_text
INFO  [VectorIndex] Migration v14: Backfilled content_text for 0/0 rows
INFO  [VectorIndex] Running migration v15
INFO  [VectorIndex] Migration v15: Created quality score index
INFO  [VectorIndex] Running migration v16
INFO  [VectorIndex] Migration v16: Created parent_id indexes
INFO  [VectorIndex] Running migration v17
INFO  [VectorIndex] Migration v17: Created interference_score index
INFO  [VectorIndex] Running migration v18
INFO  [VectorIndex] Migration v18: Created weight_history table (T001d)
INFO  [VectorIndex] Running migration v19
INFO  [VectorIndex] Migration v19: Created degree_snapshots table (N2a)
INFO  [VectorIndex] Migration v19: Created community_assignments table (N2c)
INFO  [VectorIndex] Running migration v20
INFO  [VectorIndex] Migration v20: Created memory_summaries table (R8)
INFO  [VectorIndex] Migration v20: Created memory_entities table (R10)
INFO  [VectorIndex] Migration v20: Created entity_catalog table (S5)
INFO  [VectorIndex] Running migration v21
INFO  [VectorIndex] Running migration v22
INFO  [VectorIndex] Migration v22: Created memory lineage tables and indexes
INFO  [VectorIndex] Running migration v23
INFO  [VectorIndex] Schema migration complete: v23

[90mstderr[2m | tests/embedding-pipeline-weighting.vitest.ts[2m > [22m[2mEmbedding pipeline weighting[2m > [22m[2mbuilds weighted sections before calling generateDocumentEmbedding on the save path
[22m[39m[memory-save] Embedding cache MISS+GENERATE for memory.md

 [32m✓[39m tests/embedding-pipeline-weighting.vitest.ts [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
[90mstderr[2m | tests/handler-memory-health-edge.vitest.ts[2m > [22m[2mhandleMemoryHealth Edge Cases (T007b)[2m > [22m[2mT007b-H7: divergent_aliases reportMode returns compact success payload
[22m[39mINFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index

[90mstderr[2m | tests/handler-memory-health-edge.vitest.ts[2m > [22m[2mhandleMemoryHealth Edge Cases (T007b)[2m > [22m[2mT007b-H8: Empty args return the default full health payload
[22m[39m[factory] Using provider: voyage (VOYAGE_API_KEY detected (auto mode))

[90mstderr[2m | tests/handler-memory-health-edge.vitest.ts[2m > [22m[2mhandleMemoryHealth Edge Cases (T007b)[2m > [22m[2mT007b-H8: Empty args return the default full health payload
[22m[39m[embeddings] Provider created lazily (0ms)

[90mstderr[2m | tests/handler-memory-health-edge.vitest.ts[2m > [22m[2mhandleMemoryHealth Edge Cases (T007b)[2m > [22m[2mT007b-H9: checkDatabaseUpdated failures return MCP error response with requestId
[22m[39m[memory-health] Database refresh failed [requestId=4839b859-9b24-4e6c-8969-ea039247447e]: marker read failed

 [32m✓[39m tests/handler-memory-health-edge.vitest.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 31[2mms[22m[39m
[90mstderr[2m | tests/consumption-logger.vitest.ts[2m > [22m[2mT005: fail-safe behavior — logging errors never propagate[2m > [22m[2mT005-A: logConsumptionEvent does not throw on closed DB
[22m[39m[consumption-logger] logConsumptionEvent warning: The database connection is not open

 [32m✓[39m tests/consumption-logger.vitest.ts [2m([22m[2m36 tests[22m[2m)[22m[32m 20[2mms[22m[39m
 [32m✓[39m tests/memory-state-baseline.vitest.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 16[2mms[22m[39m
 [32m✓[39m tests/migration-checkpoint-scripts.vitest.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 19[2mms[22m[39m
 [32m✓[39m tests/incremental-index-v2.vitest.ts [2m([22m[2m43 tests[22m[2m)[22m[32m 33[2mms[22m[39m
 [32m✓[39m tests/session-boost.vitest.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m tests/intent-classifier.vitest.ts [2m([22m[2m54 tests[22m[2m)[22m[32m 14[2mms[22m[39m
 [32m✓[39m tests/regression-suite.vitest.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m tests/spec-folder-canonicalization.vitest.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m tests/deferred-features-integration.vitest.ts [2m([22m[2m23 tests[22m[2m)[22m[32m 22[2mms[22m[39m
 [32m✓[39m tests/graph-signals.vitest.ts [2m([22m[2m48 tests[22m[2m)[22m[32m 15[2mms[22m[39m
[90mstderr[2m | tests/archival-manager.vitest.ts[2m > [22m[2mArchival Manager (T059)[2m > [22m[2m3. Archival Actions[2m > [22m[2mT059-012: unarchiveMemory succeeds
[22m[39m[archival-manager] Deferred vector re-embedding for memory 1 until next index scan

[90mstderr[2m | tests/archival-manager.vitest.ts[2m > [22m[2mArchival Manager (T059)[2m > [22m[2m4. Archival Scan[2m > [22m[2mT059-015: Archival scan archives candidates
[22m[39m[archival-manager] Scan complete: 2 candidates, 2 archived

[90mstderr[2m | tests/archival-manager.vitest.ts[2m > [22m[2mArchival Manager (T059)[2m > [22m[2m4. Archival Scan[2m > [22m[2mT059-016: Scan reports scanned count
[22m[39m[archival-manager] Scan complete: 1 candidates, 1 archived

[90mstderr[2m | tests/archival-manager.vitest.ts[2m > [22m[2mArchival Manager (T059)[2m > [22m[2m4. Archival Scan[2m > [22m[2mT059-017: Second scan finds fewer candidates
[22m[39m[archival-manager] Scan complete: 1 candidates, 1 archived
[archival-manager] Scan complete: 0 candidates, 0 archived

[90mstderr[2m | tests/archival-manager.vitest.ts[2m > [22m[2mArchival Manager (T059)[2m > [22m[2m5. Background Job[2m > [22m[2mT059-018: Background job starts without error
[22m[39m[archival-manager] Background job started (interval: 60s)

[90mstderr[2m | tests/archival-manager.vitest.ts[2m > [22m[2mArchival Manager (T059)[2m > [22m[2m5. Background Job[2m > [22m[2mT059-018: Background job starts without error
[22m[39m[archival-manager] Background job stopped

[90mstderr[2m | tests/archival-manager.vitest.ts[2m > [22m[2mArchival Manager (T059)[2m > [22m[2m5. Background Job[2m > [22m[2mT059-019: isBackgroundJobRunning returns true
[22m[39m[archival-manager] Background job started (interval: 60s)

[90mstderr[2m | tests/archival-manager.vitest.ts[2m > [22m[2mArchival Manager (T059)[2m > [22m[2m5. Background Job[2m > [22m[2mT059-019: isBackgroundJobRunning returns true
[22m[39m[archival-manager] Background job stopped

[90mstderr[2m | tests/archival-manager.vitest.ts[2m > [22m[2mArchival Manager (T059)[2m > [22m[2m5. Background Job[2m > [22m[2mT059-020: Background job stops without error
[22m[39m[archival-manager] Background job started (interval: 60s)
[archival-manager] Background job stopped

[90mstderr[2m | tests/archival-manager.vitest.ts[2m > [22m[2mArchival Manager (T059)[2m > [22m[2m5. Background Job[2m > [22m[2mT059-021: Job not running after stop
[22m[39m[archival-manager] Background job started (interval: 60s)
[archival-manager] Background job stopped

[90mstderr[2m | tests/archival-manager.vitest.ts[2m > [22m[2mArchival Manager (T059)[2m > [22m[2m6. Statistics[2m > [22m[2mT059-022: Stats include totalScanned
[22m[39m[archival-manager] Scan complete: 5 candidates, 5 archived

[90mstderr[2m | tests/archival-manager.vitest.ts[2m > [22m[2mArchival Manager (T059)[2m > [22m[2m6. Statistics[2m > [22m[2mT059-023: Stats include totalArchived
[22m[39m[archival-manager] Scan complete: 5 candidates, 5 archived

[90mstderr[2m | tests/archival-manager.vitest.ts[2m > [22m[2mArchival Manager (T059)[2m > [22m[2m6. Statistics[2m > [22m[2mT059-024: Stats include lastScanTime
[22m[39m[archival-manager] Scan complete: 1 candidates, 1 archived

[90mstderr[2m | tests/archival-manager.vitest.ts[2m > [22m[2mArchival Manager (T059)[2m > [22m[2m6. Statistics[2m > [22m[2mT059-025: Stats include errors array
[22m[39m[archival-manager] Scan complete: 0 candidates, 0 archived

[90mstderr[2m | tests/archival-manager.vitest.ts[2m > [22m[2mArchival Manager (T059)[2m > [22m[2m8. Cleanup and Module State[2m > [22m[2mT059-029: cleanup stops background job
[22m[39m[archival-manager] Background job started (interval: 60s)
[archival-manager] Background job stopped

 [32m✓[39m tests/archival-manager.vitest.ts [2m([22m[2m34 tests[22m[2m)[22m[32m 20[2mms[22m[39m
[90mstderr[2m | tests/entity-linker.vitest.ts[2m > [22m[2mS8 Entity Linker[2m > [22m[2mhasEntityInfrastructure[2m > [22m[2mhandles missing table gracefully (returns false)
[22m[39m[entity-linker] Failed to check entity infrastructure: no such table: entity_catalog

 [32m✓[39m tests/entity-linker.vitest.ts [2m([22m[2m48 tests[22m[2m)[22m[32m 20[2mms[22m[39m
 [32m✓[39m tests/eval-db.vitest.ts [2m([22m[2m29 tests[22m[2m)[22m[32m 16[2mms[22m[39m
[90mstderr[2m | tests/save-quality-gate.vitest.ts[2m > [22m[2mSave Quality Gate (TM-04)[2m > [22m[2mWarn-Only Mode (MR12)[2m > [22m[2mWO1: No warn-only when timestamp is not set
[22m[39mINFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index

 [32m✓[39m tests/cold-start.vitest.ts [2m([22m[2m16 tests[22m[2m)[22m[32m 10[2mms[22m[39m
[90mstderr[2m | tests/save-quality-gate.vitest.ts[2m > [22m[2mSave Quality Gate (TM-04)[2m > [22m[2mLayer 3: Semantic Dedup[2m > [22m[2mSD-5: findSimilar error is non-fatal (passes through)
[22m[39m[quality-gate] Semantic dedup check failed: Search failed

 [32m✓[39m tests/save-quality-gate.vitest.ts [2m([22m[2m78 tests[22m[2m)[22m[32m 31[2mms[22m[39m
[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m2. batchSize Validation (P0-08)[2m > [22m[2mT11: batchSize=1 is valid (smallest positive integer)
[22m[39m[batch-processor] Processing batch 1/1

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m3. Normal Operation (processBatches)[2m > [22m[2mT12: batchSize=1 processes items one at a time
[22m[39m[batch-processor] Processing batch 1/3

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m3. Normal Operation (processBatches)[2m > [22m[2mT12: batchSize=1 processes items one at a time
[22m[39m[batch-processor] Processing batch 2/3

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m3. Normal Operation (processBatches)[2m > [22m[2mT12: batchSize=1 processes items one at a time
[22m[39m[batch-processor] Processing batch 3/3

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m3. Normal Operation (processBatches)[2m > [22m[2mT15: Results preserve input order
[22m[39m[batch-processor] Processing batch 1/3

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m3. Normal Operation (processBatches)[2m > [22m[2mT15: Results preserve input order
[22m[39m[batch-processor] Processing batch 2/3

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m3. Normal Operation (processBatches)[2m > [22m[2mT15: Results preserve input order
[22m[39m[batch-processor] Processing batch 3/3

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m4. Callback / Processor Behavior[2m > [22m[2mT16: processFn called for each item exactly once
[22m[39m[batch-processor] Processing batch 1/2

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m4. Callback / Processor Behavior[2m > [22m[2mT16: processFn called for each item exactly once
[22m[39m[batch-processor] Processing batch 2/2

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m4. Callback / Processor Behavior[2m > [22m[2mT17: Error in processFn returns RetryErrorResult
[22m[39m[batch-processor] Processing batch 1/1

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m4. Callback / Processor Behavior[2m > [22m[2mT17: Error in processFn returns RetryErrorResult
[22m[39m[errors] Unmatched error (debug): deliberate non-transient failure

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m4. Callback / Processor Behavior[2m > [22m[2mT18: Async processor results are properly awaited
[22m[39m[batch-processor] Processing batch 1/1

 [32m✓[39m tests/working-memory-event-decay.vitest.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 8[2mms[22m[39m
[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m5. Edge Cases (processBatches)[2m > [22m[2mT19: Single item processed correctly
[22m[39m[batch-processor] Processing batch 1/1

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m5. Edge Cases (processBatches)[2m > [22m[2mT21: Very large batchSize (10000) with small array works
[22m[39m[batch-processor] Processing batch 1/1

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m6. processWithRetry[2m > [22m[2mT24: Non-transient error returns RetryErrorResult without retry
[22m[39m[errors] Unmatched error (debug): permanent failure

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m6. processWithRetry[2m > [22m[2mT26a: invalid maxRetries falls back to default without crashing
[22m[39m[batch-retry] Attempt 1/3 failed, retrying in 0ms: SQLITE_BUSY transient

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m6. processWithRetry[2m > [22m[2mT26a: invalid maxRetries falls back to default without crashing
[22m[39m[batch-retry] Attempt 2/3 failed, retrying in 0ms: SQLITE_BUSY transient

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m6. processWithRetry[2m > [22m[2mT26b: invalid retryDelay falls back to default and still completes
[22m[39m[errors] Unmatched error (debug): permanent failure

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m7. processSequentially[2m > [22m[2mT27: processSequentially processes items in strict order
[22m[39m[batch-processor] Processing item 1/5

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m7. processSequentially[2m > [22m[2mT27: processSequentially processes items in strict order
[22m[39m[batch-processor] Processing item 2/5

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m7. processSequentially[2m > [22m[2mT27: processSequentially processes items in strict order
[22m[39m[batch-processor] Processing item 3/5

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m7. processSequentially[2m > [22m[2mT27: processSequentially processes items in strict order
[22m[39m[batch-processor] Processing item 4/5

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m7. processSequentially[2m > [22m[2mT27: processSequentially processes items in strict order
[22m[39m[batch-processor] Processing item 5/5

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m7. processSequentially[2m > [22m[2mT29: processSequentially error in one item does not stop others
[22m[39m[batch-processor] Processing item 1/3

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m7. processSequentially[2m > [22m[2mT29: processSequentially error in one item does not stop others
[22m[39m[batch-processor] Processing item 2/3

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m7. processSequentially[2m > [22m[2mT29: processSequentially error in one item does not stop others
[22m[39m[errors] Unmatched error (debug): fail item 2

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m7. processSequentially[2m > [22m[2mT29: processSequentially error in one item does not stop others
[22m[39m[batch-processor] Processing item 3/3

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m7. processSequentially[2m > [22m[2mT30: processSequentially with single item
[22m[39m[batch-processor] Processing item 1/1

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m8. Delay Behavior[2m > [22m[2mT31: delayMs=0 does not add delay between batches
[22m[39m[batch-processor] Processing batch 1/2

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m8. Delay Behavior[2m > [22m[2mT31: delayMs=0 does not add delay between batches
[22m[39m[batch-processor] Processing batch 2/2

[90mstderr[2m | tests/batch-processor.vitest.ts[2m > [22m[2mBatch Processor[2m > [22m[2m8. Delay Behavior[2m > [22m[2mT32: No delay after last batch (single batch case)
[22m[39m[batch-processor] Processing batch 1/1

 [32m✓[39m tests/batch-processor.vitest.ts [2m([22m[2m34 tests[22m[2m)[22m[32m 21[2mms[22m[39m
 [32m✓[39m tests/reporting-dashboard.vitest.ts [2m([22m[2m36 tests[22m[2m)[22m[32m 34[2mms[22m[39m
[90mstderr[2m | tests/trigger-config-extended.vitest.ts[2m > [22m[2mEXTENDED TESTS: trigger-matcher + memory-types + type-inference[2m > [22m[2mlogExecutionTime[2m > [22m[2m3.1.2 slow call returns SLOW entry
[22m[39m[trigger-matcher] slow_op: 200ms (target <50ms) {}

 [32m✓[39m tests/trigger-config-extended.vitest.ts [2m([22m[2m69 tests[22m[2m)[22m[32m 13[2mms[22m[39m
 [32m✓[39m tests/interfaces.vitest.ts [2m([22m[2m25 tests[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m tests/temporal-contiguity.vitest.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 11[2mms[22m[39m
 [32m✓[39m tests/shared-memory-handlers.vitest.ts [2m([22m[2m16 tests[22m[2m)[22m[32m 33[2mms[22m[39m
 [32m✓[39m tests/recovery-hints.vitest.ts [2m([22m[2m96 tests[22m[2m)[22m[32m 16[2mms[22m[39m
[90mstderr[2m | tests/db-state-graph-reinit.vitest.ts[2m > [22m[2mdb-state graph search wiring[2m > [22m[2mreuses configured graphSearchFn during database reinitialization
[22m[39m[db-state] Database connection reinitialized

[90mstderr[2m | tests/db-state-graph-reinit.vitest.ts[2m > [22m[2mdb-state graph search wiring[2m > [22m[2mpreserves lastDbCheck when rebinding does not complete
[22m[39m[db-state] Database updated externally, reinitializing connection...
[db-state] Database handle unavailable after reinitialize; rebinding skipped

[90mstderr[2m | tests/db-state-graph-reinit.vitest.ts[2m > [22m[2mdb-state graph search wiring[2m > [22m[2mpreserves lastDbCheck when rebinding does not complete
[22m[39m[db-state] Reinitialization did not complete; preserving lastDbCheck for retry

[90mstderr[2m | tests/db-state-graph-reinit.vitest.ts[2m > [22m[2mdb-state graph search wiring[2m > [22m[2mpreserves lastDbCheck when rebinding does not complete
[22m[39m[db-state] Database updated externally, reinitializing connection...
[db-state] Database connection reinitialized

[90mstderr[2m | tests/db-state-graph-reinit.vitest.ts[2m > [22m[2mdb-state graph search wiring[2m > [22m[2mreturns false when session manager rebind fails
[22m[39m[db-state] Session manager rebind failed: session-db-init-failed

 [32m✓[39m tests/db-state-graph-reinit.vitest.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m tests/cross-feature-integration-eval.vitest.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 10[2mms[22m[39m
 [32m✓[39m tests/startup-checks.vitest.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m tests/learned-combiner.vitest.ts [2m([22m[2m51 tests[22m[2m)[22m[32m 16[2mms[22m[39m
 [32m✓[39m tests/mcp-response-envelope.vitest.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m tests/five-factor-scoring.vitest.ts [2m([22m[2m107 tests[22m[2m)[22m[32m 11[2mms[22m[39m
 [32m✓[39m tests/crash-recovery.vitest.ts [2m([22m[2m29 tests[22m[2m | [22m[33m26 skipped[39m[2m)[22m[32m 14[2mms[22m[39m
 [32m✓[39m tests/query-surrogates.vitest.ts [2m([22m[2m80 tests[22m[2m)[22m[32m 22[2mms[22m[39m
 [32m✓[39m tests/memory-context.vitest.ts [2m([22m[2m119 tests[22m[2m)[22m[32m 12[2mms[22m[39m
[90mstderr[2m | tests/handler-memory-triggers.vitest.ts[2m > [22m[2mSprint-0 reliability fixes[2m > [22m[2menforces caller limit on cognitive path responses
[22m[39m[utils] Path traversal blocked: /tmp/test-1.md -> /private/tmp/test-1.md
[memory-triggers] getTieredContent failed {
  filePath: [32m'/tmp/test-1.md'[39m,
  tier: [32m'HOT'[39m,
  error: [32m'Access denied: Path outside allowed directories'[39m
}
[utils] Path traversal blocked: /tmp/test-2.md -> /private/tmp/test-2.md
[memory-triggers] getTieredContent failed {
  filePath: [32m'/tmp/test-2.md'[39m,
  tier: [32m'HOT'[39m,
  error: [32m'Access denied: Path outside allowed directories'[39m
}

 [32m✓[39m tests/session-manager-stress.vitest.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 51[2mms[22m[39m
 [32m✓[39m tests/handler-memory-triggers.vitest.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 11[2mms[22m[39m
 [32m✓[39m tests/hydra-spec-pack-consistency.vitest.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m tests/embedding-cache.vitest.ts [2m([22m[2m12 tests[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m tests/prediction-error-gate.vitest.ts [2m([22m[2m77 tests[22m[2m)[22m[32m 7[2mms[22m[39m
[90mstderr[2m | tests/working-memory.vitest.ts[2m > [22m[2mTool-result extraction provenance[2m > [22m[2mextracted entries survive checkpoint save/restore with provenance
[22m[39m[checkpoints] Created checkpoint "wm-provenance-1774430416669" (712 bytes compressed)
[checkpoints] Skipping post-restore rebuild "auto-entities" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "degree-snapshots" because dependencies did not complete: lineage-backfill
[checkpoints] Skipping post-restore rebuild "community-assignments" because dependencies did not complete: degree-snapshots
[checkpoints] Skipping post-restore rebuild "fts-rebuild" because dependencies did not complete: lineage-backfill, auto-entities
[checkpoints] Post-restore rebuild summary: completed=none; skipped=auto-entities, degree-snapshots, community-assignments, fts-rebuild
[checkpoints] Restored 1 memories, 1 working memory entries from "wm-provenance-1774430416669"

 [32m✓[39m tests/working-memory.vitest.ts [2m([22m[2m52 tests[22m[2m)[22m[32m 15[2mms[22m[39m
 [32m✓[39m tests/memory-governance.vitest.ts [2m([22m[2m9 tests[22m[2m)[22m[32m 12[2mms[22m[39m
 [32m✓[39m tests/content-normalizer.vitest.ts [2m([22m[2m76 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m tests/score-normalization.vitest.ts [2m([22m[2m37 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m tests/feature-eval-scoring-calibration.vitest.ts [2m([22m[2m24 tests[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m tests/anchor-prefix-matching.vitest.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 25[2mms[22m[39m
[90mstderr[2m | tests/search-fallback-tiered.vitest.ts[2m > [22m[2mPI-A2: Tier progression[2m > [22m[2mT045-04: stays at Tier 1 when results meet quality thresholds
[22m[39m[hybrid-search] All search methods returned empty results

[90mstderr[2m | tests/search-fallback-tiered.vitest.ts[2m > [22m[2mPI-A2: Tier progression[2m > [22m[2mT045-05: searchWithFallback delegates to tiered when flag enabled
[22m[39m[hybrid-search] Tier 1→2 degradation: both (topScore=0.000, count=0)

[90mstderr[2m | tests/search-fallback-tiered.vitest.ts[2m > [22m[2mPI-A2: Tier progression[2m > [22m[2mT045-05: searchWithFallback delegates to tiered when flag enabled
[22m[39m[hybrid-search] Tier 2→3 degradation: both (topScore=0.000, count=0)

[90mstderr[2m | tests/search-fallback-tiered.vitest.ts[2m > [22m[2mPI-A2: Degradation metadata[2m > [22m[2mT045-13: tiered fallback attaches _degradation as non-enumerable
[22m[39m[hybrid-search] Tier 1→2 degradation: both (topScore=0.000, count=0)

[90mstderr[2m | tests/search-fallback-tiered.vitest.ts[2m > [22m[2mPI-A2: Degradation metadata[2m > [22m[2mT045-13: tiered fallback attaches _degradation as non-enumerable
[22m[39m[hybrid-search] Tier 2→3 degradation: both (topScore=0.000, count=0)

[90mstderr[2m | tests/search-fallback-tiered.vitest.ts[2m > [22m[2mPI-A2: Degradation metadata[2m > [22m[2mT045-14: degradation events have correct tier and trigger structure
[22m[39m[hybrid-search] Tier 1→2 degradation: both (topScore=0.000, count=0)

[90mstderr[2m | tests/search-fallback-tiered.vitest.ts[2m > [22m[2mPI-A2: Degradation metadata[2m > [22m[2mT045-14: degradation events have correct tier and trigger structure
[22m[39m[hybrid-search] Tier 2→3 degradation: both (topScore=0.000, count=0)

[90mstderr[2m | tests/search-fallback-tiered.vitest.ts[2m > [22m[2mPI-A2: Degradation metadata[2m > [22m[2mT045-15: JSON.stringify does not include _degradation (non-enumerable)
[22m[39m[hybrid-search] Tier 1→2 degradation: both (topScore=0.000, count=0)

[90mstderr[2m | tests/search-fallback-tiered.vitest.ts[2m > [22m[2mPI-A2: Degradation metadata[2m > [22m[2mT045-15: JSON.stringify does not include _degradation (non-enumerable)
[22m[39m[hybrid-search] Tier 2→3 degradation: both (topScore=0.000, count=0)

 [32m✓[39m tests/search-fallback-tiered.vitest.ts [2m([22m[2m23 tests[22m[2m)[22m[32m 12[2mms[22m[39m
[90mstderr[2m | tests/reconsolidation.vitest.ts[2m > [22m[2mReconsolidation-on-Save (TM-06)[2m > [22m[2mFind Similar Memories[2m > [22m[2mFS2: Returns empty array on error
[22m[39m[reconsolidation] findSimilarMemories error: Search failed

[90mstderr[2m | tests/reconsolidation.vitest.ts[2m > [22m[2mReconsolidation-on-Save (TM-06)[2m > [22m[2mEdge Cases[2m > [22m[2mEC2: findSimilar throws -> complement (non-fatal)
[22m[39m[reconsolidation] findSimilarMemories error: vector search down

[90mstderr[2m | tests/reconsolidation.vitest.ts[2m > [22m[2mReconsolidation-on-Save (TM-06)[2m > [22m[2mEdge Cases[2m > [22m[2mEC2b: orphan cleanup via transaction rollback when executeConflict fails
[22m[39m[reconsolidation] cleaned up orphan memory [33m621[39m after executeConflict failure

 [32m✓[39m tests/reconsolidation.vitest.ts [2m([22m[2m46 tests[22m[2m)[22m[32m 14[2mms[22m[39m
[90mstderr[2m | tests/search-results-format.vitest.ts[2m > [22m[2mvalidateFilePathLocal[2m > [22m[2mB1: Rejects path traversal (..)
[22m[39m[utils] Path traversal blocked: /etc/../passwd -> /passwd

[90mstderr[2m | tests/search-results-format.vitest.ts[2m > [22m[2mvalidateFilePathLocal[2m > [22m[2mB2: Rejects deep path traversal
[22m[39m[utils] Path traversal blocked: /home/user/../../../etc/shadow -> /private/etc/shadow

[90mstderr[2m | tests/search-results-format.vitest.ts[2m > [22m[2mvalidateFilePathLocal[2m > [22m[2mB3: Rejects path outside allowed dirs
[22m[39m[utils] Path traversal blocked: /tmp/some-random-file.txt -> /private/tmp/some-random-file.txt

[90mstderr[2m | tests/search-results-format.vitest.ts[2m > [22m[2mvalidateFilePathLocal[2m > [22m[2mB5: Rejects null byte injection
[22m[39m[utils] Null byte in path blocked: /valid/path /evil

[90mstderr[2m | tests/search-results-format.vitest.ts[2m > [22m[2mvalidateFilePathLocal[2m > [22m[2mB6: Rejects traversal from allowed base
[22m[39m[utils] Path traversal blocked: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/etc/passwd -> /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/etc/passwd

 [32m✓[39m tests/api-validation.vitest.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 14[2mms[22m[39m
[90mstderr[2m | tests/search-results-format.vitest.ts[2m > [22m[2mformatSearchResults[2m > [22m[2mC14: Invalid file path records contentError
[22m[39m[utils] Path traversal blocked: /nonexistent/path/that/does/not/exist.md -> /nonexistent/path/that/does/not/exist.md

 [32m✓[39m tests/session-manager.vitest.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 13[2mms[22m[39m
 [32m✓[39m tests/search-results-format.vitest.ts [2m([22m[2m49 tests[22m[2m)[22m[32m 15[2mms[22m[39m
 [32m✓[39m tests/unit-transaction-metrics-types.vitest.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m tests/access-tracker.vitest.ts [2m([22m[2m13 tests[22m[2m)[22m[32m 10[2mms[22m[39m
 [32m✓[39m tests/d5-confidence-scoring.vitest.ts [2m([22m[2m39 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m tests/community-detection.vitest.ts [2m([22m[2m42 tests[22m[2m)[22m[32m 14[2mms[22m[39m
 [32m✓[39m tests/edge-density.vitest.ts [2m([22m[2m37 tests[22m[2m)[22m[32m 10[2mms[22m[39m
 [32m✓[39m tests/modularization.vitest.ts [2m([22m[2m91 tests[22m[2m | [22m[33m54 skipped[39m[2m)[22m[32m 5[2mms[22m[39m
[90mstderr[2m | tests/scoring-gaps.vitest.ts[2m > [22m[2mScoring Gaps[2m > [22m[2mpromoteToCritical[2m > [22m[2mT-CT07 returns true for eligible memory
[22m[39m[confidence-tracker] Memory 1 promoted to critical tier

[90mstderr[2m | tests/scoring-gaps.vitest.ts[2m > [22m[2mScoring Gaps[2m > [22m[2mpromoteToCritical[2m > [22m[2mT-CT08 DB tier updated to critical after promotion
[22m[39m[confidence-tracker] Memory 1 promoted to critical tier

[90mstderr[2m | tests/scoring-gaps.vitest.ts[2m > [22m[2mScoring Gaps[2m > [22m[2mpromoteToCritical[2m > [22m[2mT-CT09 updated_at refreshed after promotion
[22m[39m[confidence-tracker] Memory 1 promoted to critical tier

 [32m✓[39m tests/adaptive-fusion.vitest.ts [2m([22m[2m26 tests[22m[2m)[22m[32m 6[2mms[22m[39m
[90mstderr[2m | tests/scoring-gaps.vitest.ts[2m > [22m[2mScoring Gaps[2m > [22m[2mpromoteToCritical[2m > [22m[2mT-CT12 returns false for ineligible memory
[22m[39m[confidence-tracker] promoteToCritical failed for memory 1: Error: Memory 1 not eligible for promotion. Requires confidence >= 0.9 (current: 0.3) and positive_validation_count >= 5 (current: 1)
    at Module.promoteToCritical [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mlib/scoring/confidence-tracker.ts:254:13[90m)[39m
    at [90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/scoring-gaps.vitest.ts:141:30
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:145:11
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:915:26
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1209:10[90m)[39m
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1653:37
    at Traces.$ [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/traces.CCmnQaNT.js:142:27[90m)[39m
    at trace [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/test.B8ej_ZHS.js:239:21[90m)[39m

[90mstderr[2m | tests/scoring-gaps.vitest.ts[2m > [22m[2mScoring Gaps[2m > [22m[2mpromoteToCritical[2m > [22m[2mT-CT13 returns false for non-existent memory
[22m[39m[confidence-tracker] promoteToCritical failed for memory 999: Error: Memory not found: 999
    at Module.promoteToCritical [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mlib/scoring/confidence-tracker.ts:244:15[90m)[39m
    at [90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/scoring-gaps.vitest.ts:148:30
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:145:11
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:915:26
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1209:10[90m)[39m
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1653:37
    at Traces.$ [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/traces.CCmnQaNT.js:142:27[90m)[39m
    at trace [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/test.B8ej_ZHS.js:239:21[90m)[39m

[90mstderr[2m | tests/scoring-gaps.vitest.ts[2m > [22m[2mScoring Gaps[2m > [22m[2mpromoteToCritical[2m > [22m[2mT-CT14 ineligible memory tier unchanged after failed promotion
[22m[39m[confidence-tracker] promoteToCritical failed for memory 1: Error: Memory 1 not eligible for promotion. Requires confidence >= 0.9 (current: 0.4) and positive_validation_count >= 5 (current: 2)
    at Module.promoteToCritical [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mlib/scoring/confidence-tracker.ts:254:13[90m)[39m
    at [90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/scoring-gaps.vitest.ts:157:21
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:145:11
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:915:26
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1209:10[90m)[39m
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1653:37
    at Traces.$ [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/traces.CCmnQaNT.js:142:27[90m)[39m
    at trace [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/test.B8ej_ZHS.js:239:21[90m)[39m

[90mstderr[2m | tests/scoring-gaps.vitest.ts[2m > [22m[2mScoring Gaps[2m > [22m[2mpromoteToCritical[2m > [22m[2mT-CT15 succeeds at exact threshold boundary
[22m[39m[confidence-tracker] Memory 1 promoted to critical tier

[90mstderr[2m | tests/scoring-gaps.vitest.ts[2m > [22m[2mScoring Gaps[2m > [22m[2mpromoteToCritical[2m > [22m[2mT-CT16 fails just below confidence threshold
[22m[39m[confidence-tracker] promoteToCritical failed for memory 1: Error: Memory 1 not eligible for promotion. Requires confidence >= 0.9 (current: 0.89) and positive_validation_count >= 5 (current: 5)
    at Module.promoteToCritical [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mlib/scoring/confidence-tracker.ts:254:13[90m)[39m
    at [90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/scoring-gaps.vitest.ts:180:30
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:145:11
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:915:26
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1209:10[90m)[39m
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1653:37
    at Traces.$ [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/traces.CCmnQaNT.js:142:27[90m)[39m
    at trace [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/test.B8ej_ZHS.js:239:21[90m)[39m

[90mstderr[2m | tests/scoring-gaps.vitest.ts[2m > [22m[2mScoring Gaps[2m > [22m[2mpromoteToCritical[2m > [22m[2mT-CT17 fails just below validation threshold
[22m[39m[confidence-tracker] promoteToCritical failed for memory 1: Error: Memory 1 not eligible for promotion. Requires confidence >= 0.9 (current: 0.9) and positive_validation_count >= 5 (current: 4)
    at Module.promoteToCritical [90m(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mlib/scoring/confidence-tracker.ts:254:13[90m)[39m
    at [90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mtests/scoring-gaps.vitest.ts:191:30
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:145:11
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:915:26
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1209:10[90m)[39m
    at [90mfile:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/node_modules/[4m@vitest/runner[24m/dist/index.js:1653:37
    at Traces.$ [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/traces.CCmnQaNT.js:142:27[90m)[39m
    at trace [90m(file:///Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/[39mnode_modules/[4mvitest[24m/dist/chunks/test.B8ej_ZHS.js:239:21[90m)[39m

 [32m✓[39m tests/feedback-ledger.vitest.ts [2m([22m[2m39 tests[22m[2m)[22m[32m 16[2mms[22m[39m
 [32m✓[39m tests/scoring-gaps.vitest.ts [2m([22m[2m40 tests[22m[2m)[22m[32m 17[2mms[22m[39m
[90mstderr[2m | tests/embedding-expansion.vitest.ts[2m > [22m[2mR12: Embedding-Based Query Expansion[2m > [22m[2mT8: returns identity result for empty embedding (zero-length Float32Array)
[22m[39m[embedding-expansion] Received empty embedding — skipping expansion

[90mstderr[2m | tests/embedding-expansion.vitest.ts[2m > [22m[2mR12: Embedding-Based Query Expansion[2m > [22m[2mT13: returns identity result when vectorSearch throws
[22m[39m[embedding-expansion] Expansion failed, using original query: DB connection failed

 [32m✓[39m tests/embedding-expansion.vitest.ts [2m([22m[2m21 tests[22m[2m)[22m[32m 14[2mms[22m[39m
[90mstderr[2m | tests/cognitive-gaps.vitest.ts[2m > [22m[2mE. ensureArchivedColumn[2m > [22m[2mE-02: adds is_archived column when missing
[22m[39m[archival-manager] Added is_archived column

 [32m✓[39m tests/typed-traversal.vitest.ts [2m([22m[2m32 tests[22m[2m)[22m[32m 12[2mms[22m[39m
 [32m✓[39m tests/cognitive-gaps.vitest.ts [2m([22m[2m43 tests[22m[2m)[22m[32m 11[2mms[22m[39m
 [32m✓[39m tests/session-state.vitest.ts [2m([22m[2m45 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m tests/quality-loop.vitest.ts [2m([22m[2m47 tests[22m[2m)[22m[32m 12[2mms[22m[39m
 [32m✓[39m tests/memory-types.vitest.ts [2m([22m[2m18 tests[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m tests/query-classifier.vitest.ts [2m([22m[2m72 tests[22m[2m)[22m[32m 13[2mms[22m[39m
 [32m✓[39m tests/rrf-degree-channel.vitest.ts [2m([22m[2m26 tests[22m[2m)[22m[32m 23[2mms[22m[39m
[90mstderr[2m | tests/handler-memory-index-cooldown.vitest.ts[2m > [22m[2mhandler-memory-index cooldown behavior[2m > [22m[2mconsumes incremental toDelete and removes stale indexed records
[22m[39m[memory-index-scan] Incremental mode: 0/1 files need indexing (categorized in 0ms)
[memory-index-scan] Fast-path skips: 1, Mtime changed: 0

[90mstderr[2m | tests/handler-memory-index-cooldown.vitest.ts[2m > [22m[2mhandler-memory-index cooldown behavior[2m > [22m[2mtracks stale delete failures without aborting scan
[22m[39m[memory-index-scan] Incremental mode: 0/1 files need indexing (categorized in 0ms)
[memory-index-scan] Fast-path skips: 1, Mtime changed: 0

[90mstderr[2m | tests/handler-memory-index-cooldown.vitest.ts[2m > [22m[2mhandler-memory-index cooldown behavior[2m > [22m[2mtreats RetryErrorResult entries as failed files and captures retry details
[22m[39m[memory-index-scan] Incremental mode: 1/1 files need indexing (categorized in 0ms)
[memory-index-scan] Fast-path skips: 0, Mtime changed: 0

 [32m✓[39m tests/handler-memory-index-cooldown.vitest.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m tests/interference.vitest.ts [2m([22m[2m31 tests[22m[2m)[22m[32m 22[2mms[22m[39m
[90mstderr[2m | tests/extraction-adapter.vitest.ts[2m > [22m[2mT029-T037 extraction adapter[2m > [22m[2mT035/T038: extraction callback inserts working_memory with provenance
[22m[39m[extraction-adapter] Inserted working_memory item for memory 101 (read-spec)

[90mstderr[2m | tests/extraction-adapter.vitest.ts[2m > [22m[2mT029-T037 extraction adapter[2m > [22m[2mT035a/T035b/T035c: redaction applies and skips insert when no memory_id resolved
[22m[39m[extraction-adapter] Skipped insert for bash-git-commit: no memory_id resolved

[90mstderr[2m | tests/extraction-adapter.vitest.ts[2m > [22m[2mT029-T037 extraction adapter[2m > [22m[2mT035e: passthrough content is not redacted
[22m[39m[extraction-adapter] Skipped insert for grep-error: no memory_id resolved

 [32m✓[39m tests/extraction-adapter.vitest.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 8[2mms[22m[39m
[90mstderr[2m | tests/dual-scope-hooks.vitest.ts[2m > [22m[2mTM-05: Token budget enforcement (4000 max per point)[2m > [22m[2mtool-dispatch output boundary enforces estimated token budget
[22m[39m[SK-004] Auto-surface output truncated to fit tool-dispatch token budget (3043/4000)

[90mstderr[2m | tests/dual-scope-hooks.vitest.ts[2m > [22m[2mTM-05: Token budget enforcement (4000 max per point)[2m > [22m[2mcompaction output boundary enforces estimated token budget
[22m[39m[SK-004] Auto-surface output truncated to fit compaction token budget (3043/4000)

[90mstderr[2m | tests/dual-scope-hooks.vitest.ts[2m > [22m[2mTM-05: No regression in existing autoSurfaceMemories[2m > [22m[2mautoSurfaceMemories does not throw on triggerMatcher error
[22m[39m[SK-004] Auto-surface failed: Simulated matcher failure

 [32m✓[39m tests/dual-scope-hooks.vitest.ts [2m([22m[2m66 tests[22m[2m)[22m[32m 16[2mms[22m[39m
[90mstderr[2m | tests/retrieval-directives.vitest.ts[2m > [22m[2mT-A4-05: enrichWithRetrievalDirectives[2m > [22m[2mT34: handles result with non-existent filePath gracefully
[22m[39m[utils] Path traversal blocked: /nonexistent/path/to/rule.md -> /nonexistent/path/to/rule.md
[utils] Path traversal blocked: /nonexistent/path/to/rule.md -> /nonexistent/path/to/rule.md

 [32m✓[39m tests/memory-parser.vitest.ts [2m([22m[2m25 tests[22m[2m)[22m[32m 12[2mms[22m[39m
[90mstderr[2m | tests/shadow-evaluation-runtime.vitest.ts[2m > [22m[2mshadow-evaluation-runtime[2m > [22m[2mruns a due holdout cycle from recent consumption_log queries
[22m[39m[shadow-evaluation-runtime] cycle shadow-eval-1774430417328: 2 holdout queries, meanNdcgDelta=0.1093, recommendation=wait

[90mstderr[2m | tests/shadow-evaluation-runtime.vitest.ts[2m > [22m[2mshadow-evaluation-runtime[2m > [22m[2mstarts and stops the interval scheduler cleanly
[22m[39m[shadow-evaluation-runtime] cycle shadow-eval-1774430417331: 1 holdout queries, meanNdcgDelta=0.0866, recommendation=wait

 [32m✓[39m tests/degree-computation.vitest.ts [2m([22m[2m25 tests[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m tests/shadow-evaluation-runtime.vitest.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 11[2mms[22m[39m
 [32m✓[39m tests/retrieval-directives.vitest.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 11[2mms[22m[39m
 [32m✓[39m tests/intent-weighting.vitest.ts [2m([22m[2m23 tests[22m[2m)[22m[32m 14[2mms[22m[39m
[90mstderr[2m | tests/integration-save-pipeline.vitest.ts[2m > [22m[2mIntegration Save Pipeline (T526) [deferred - requires DB test fixtures][2m > [22m[2mPipeline Input Validation[2m > [22m[2mT526-3: Path traversal blocked
[22m[39m[utils] Path traversal blocked: /specs/../../../etc/passwd -> /private/etc/passwd

[90mstderr[2m | tests/integration-save-pipeline.vitest.ts[2m > [22m[2mIntegration Save Pipeline (T526) [deferred - requires DB test fixtures][2m > [22m[2mPipeline Input Validation[2m > [22m[2mT526-4: Non-existent file produces error
[22m[39m[utils] Path traversal blocked: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/mcp-test-nonexistent-1774430417354/memory/fake.md -> /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/mcp-test-nonexistent-1774430417354/memory/fake.md

[90mstderr[2m | tests/integration-save-pipeline.vitest.ts[2m > [22m[2mIntegration Save Pipeline (T526) [deferred - requires DB test fixtures][2m > [22m[2mPipeline Input Validation[2m > [22m[2mT526-5: Force flag accepted as parameter
[22m[39m[utils] Path traversal blocked: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/mcp-test-nonexistent-1774430417355/memory/fake.md -> /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/mcp-test-nonexistent-1774430417355/memory/fake.md

[90mstderr[2m | tests/integration-save-pipeline.vitest.ts[2m > [22m[2mIntegration Save Pipeline (T526) [deferred - requires DB test fixtures][2m > [22m[2mPipeline Input Validation[2m > [22m[2mT526-6: dryRun flag accepted as parameter
[22m[39m[utils] Path traversal blocked: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/mcp-test-nonexistent-1774430417356/memory/fake.md -> /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/mcp-test-nonexistent-1774430417356/memory/fake.md

[90mstderr[2m | tests/integration-save-pipeline.vitest.ts[2m > [22m[2mIntegration Save Pipeline (T526) [deferred - requires DB test fixtures][2m > [22m[2mPipeline Error Response Format[2m > [22m[2mT526-8: Non-memory path rejected
[22m[39m[utils] Path traversal blocked: /tmp/random-file.txt -> /private/tmp/random-file.txt

 [32m✓[39m tests/integration-save-pipeline.vitest.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m tests/preflight.vitest.ts [2m([22m[2m39 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m tests/causal-fixes.vitest.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 10[2mms[22m[39m
 [32m✓[39m tests/trace-propagation.vitest.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 11[2mms[22m[39m
[90mstderr[2m | tests/review-fixes.vitest.ts[2m > [22m[2mC1: ingest paths reject traversal sequences[2m > [22m[2mrejects paths containing ".."
[22m[39m[schema-validation] memory_ingest_start: Invalid arguments for "memory_ingest_start". Parameter "paths.1" is invalid: Path must not contain traversal sequences Expected parameter names: paths, specFolder. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.

[90mstderr[2m | tests/review-fixes.vitest.ts[2m > [22m[2mC1: ingest paths reject traversal sequences[2m > [22m[2mrejects paths containing null bytes
[22m[39m[schema-validation] memory_ingest_start: Invalid arguments for "memory_ingest_start". Parameter "paths.0" is invalid: Path must not contain traversal sequences Expected parameter names: paths, specFolder. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.

 [32m✓[39m tests/governance-e2e.vitest.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 6[2mms[22m[39m
[90mstderr[2m | tests/review-fixes.vitest.ts[2m > [22m[2mH2: ingest paths array bounded at 50[2m > [22m[2mrejects more than 50 paths
[22m[39m[schema-validation] memory_ingest_start: Invalid arguments for "memory_ingest_start". Parameter "paths" is invalid: Too big: expected array to have <=50 items Expected parameter names: paths, specFolder. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.

[90mstderr[2m | tests/review-fixes.vitest.ts[2m > [22m[2mH2: ingest paths array bounded at 50[2m > [22m[2mrejects empty paths array
[22m[39m[schema-validation] memory_ingest_start: Invalid arguments for "memory_ingest_start". Parameter "paths" is invalid: Too small: expected array to have >=1 items Expected parameter names: paths, specFolder. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.

 [32m✓[39m tests/review-fixes.vitest.ts [2m([22m[2m12 tests[22m[2m)[22m[32m 10[2mms[22m[39m
[90mstderr[2m | tests/chunking-orchestrator-swap.vitest.ts[2m > [22m[2mT013: staged swap regressions[2m > [22m[2msuccessful swap deletes old children and links new children atomically
[22m[39m[memory-save] Chunking /tmp/specs/test-safe-swap/memory.md: anchor strategy, 2 chunks

 [32m✓[39m tests/hybrid-search-flags.vitest.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 8[2mms[22m[39m
[90mstderr[2m | tests/chunking-orchestrator-swap.vitest.ts[2m > [22m[2mT013: staged swap regressions[2m > [22m[2mswap failure rolls back: old children remain and staged children are cleaned
[22m[39m[memory-save] Chunking /tmp/specs/test-safe-swap/memory-fail.md: anchor strategy, 2 chunks

[90mstderr[2m | tests/chunking-orchestrator-swap.vitest.ts[2m > [22m[2mT013: staged swap regressions[2m > [22m[2mswap failure rolls back: old children remain and staged children are cleaned
[22m[39m[memory-save] Re-chunk swap failed for parent 1: forced finalize swap failure

[90mstderr[2m | tests/chunking-orchestrator-swap.vitest.ts[2m > [22m[2mT013: staged swap regressions[2m > [22m[2mpartial embedding failures still swap successfully with mixed child statuses
[22m[39m[memory-save] Chunking /tmp/specs/test-safe-swap/memory-partial.md: anchor strategy, 3 chunks

[90mstderr[2m | tests/chunking-orchestrator-swap.vitest.ts[2m > [22m[2mT013: staged swap regressions[2m > [22m[2mpartial embedding failures still swap successfully with mixed child statuses
[22m[39m[memory-save] Chunk 2 embedding failed: simulated embedding outage

[90mstderr[2m | tests/chunking-orchestrator-swap.vitest.ts[2m > [22m[2mT013: staged swap regressions[2m > [22m[2muses normalized content hash for chunk embedding cache keys
[22m[39m[memory-save] Chunking /tmp/specs/test-safe-swap/memory-cache-key.md: anchor strategy, 1 chunks

 [32m✓[39m tests/chunking-orchestrator-swap.vitest.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 46[2mms[22m[39m
[90mstderr[2m | tests/graph-search-fn.vitest.ts[2m > [22m[2mcreateUnifiedGraphSearchFn[2m > [22m[2mreturns empty array when causal query throws
[22m[39m[graph-search-fn] Causal edge query failed: DB connection lost

 [32m✓[39m tests/graph-search-fn.vitest.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m tests/causal-boost.vitest.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 7[2mms[22m[39m
[90mstderr[2m | tests/attention-decay.vitest.ts[2m > [22m[2mAttention Decay Module[2m > [22m[2mactivateMemory() without DB[2m > [22m[2mactivateMemory returns false without DB
[22m[39m[attention-decay] Database not initialized. Server may still be starting up.

[90mstderr[2m | tests/attention-decay.vitest.ts[2m > [22m[2mAttention Decay Module[2m > [22m[2mgetActiveMemories() without DB[2m > [22m[2mgetActiveMemories returns [] without DB
[22m[39m[attention-decay] Database not initialized. Server may still be starting up.

[90mstderr[2m | tests/attention-decay.vitest.ts[2m > [22m[2mAttention Decay Module[2m > [22m[2mgetActiveMemories() without DB[2m > [22m[2mgetActiveMemories(5) returns [] without DB
[22m[39m[attention-decay] Database not initialized. Server may still be starting up.

[90mstderr[2m | tests/handler-session-learning.vitest.ts[2m > [22m[2mHandler Session Learning (T522)[2m > [22m[2mhandleTaskPreflight Validation[2m > [22m[2mT011-OG1: Re-preflight on complete record throws overwrite error
[22m[39m[session-learning] Schema initialized

 [32m✓[39m tests/attention-decay.vitest.ts [2m([22m[2m76 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m tests/handler-session-learning.vitest.ts [2m([22m[2m26 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m tests/slug-utils-boundary.vitest.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 10[2mms[22m[39m
 [32m✓[39m tests/eval-metrics.vitest.ts [2m([22m[2m70 tests[22m[2m)[22m[32m 23[2mms[22m[39m
 [32m✓[39m tests/k-value-judged-sweep.vitest.ts [2m([22m[2m37 tests[22m[2m)[22m[32m 11[2mms[22m[39m
 [32m✓[39m tests/folder-scoring.vitest.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m tests/anchor-id-simplification.vitest.ts [2m([22m[2m21 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m tests/sqlite-fts.vitest.ts [2m([22m[2m12 tests[22m[2m)[22m[32m 7[2mms[22m[39m
[90mstderr[2m | tests/transaction-manager-extended.vitest.ts[2m > [22m[2mdeleteFileIfExists (transaction-manager extended)[2m > [22m[2mhandles directory path (not a file) gracefully
[22m[39m[transaction-manager] deleteFileIfExists error: EPERM: operation not permitted, unlink '/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/txn-mgr-ext-1774430417699-dir-not-file/a-directory'

 [32m✓[39m tests/transaction-manager-extended.vitest.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m tests/handler-eval-reporting.vitest.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 13[2mms[22m[39m
[90mstderr[2m | tests/phase2-integration.vitest.ts[2m > [22m[2mT048-T049 integration path[2m > [22m[2mT048: Read tool result passes extraction/redaction into working_memory
[22m[39m[extraction-adapter] Inserted working_memory item for memory 11 (read-spec)

 [32m✓[39m tests/phase2-integration.vitest.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m tests/spec-folder-prefilter.vitest.ts [2m([22m[2m22 tests[22m[2m)[22m[32m 10[2mms[22m[39m
 [32m✓[39m tests/graph-regression-flag-off.vitest.ts [2m([22m[2m22 tests[22m[2m)[22m[32m 10[2mms[22m[39m
 [32m✓[39m tests/handler-memory-ingest.vitest.ts [2m([22m[2m9 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m tests/graph-roadmap-finalization.vitest.ts [2m([22m[2m5 tests[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m tests/anchor-metadata.vitest.ts [2m([22m[2m49 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m tests/shared-memory-e2e.vitest.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m tests/incremental-index.vitest.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m tests/artifact-routing.vitest.ts [2m([22m[2m35 tests[22m[2m)[22m[32m 6[2mms[22m[39m
[90mstderr[2m | tests/handler-memory-ingest-edge.vitest.ts[2m > [22m[2mHandler Memory Ingest edge cases (T005a)[2m > [22m[2mT005a-I8: all paths over 500 chars are dropped and then throw
[22m[39m[memory-ingest] Dropped 2 path(s) longer than 500 characters

 [32m✓[39m tests/handler-memory-ingest-edge.vitest.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m tests/search-limits-scoring.vitest.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m tests/feature-eval-graph-signals.vitest.ts [2m([22m[2m34 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m tests/result-confidence-scoring.vitest.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m tests/protect-learning.vitest.ts [2m([22m[2m9 tests[22m[2m)[22m[32m 10[2mms[22m[39m
 [32m✓[39m tests/integration-learning-history.vitest.ts [2m([22m[2m8 tests[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m tests/retrieval-telemetry.vitest.ts [2m([22m[2m29 tests[22m[2m)[22m[32m 5[2mms[22m[39m
[90mstderr[2m | tests/bm25-security.vitest.ts[2m > [22m[2mBM25 Security & Coverage Gap Tests[2m > [22m[2mrebuildFromDatabase[2m > [22m[2mRD01: Database error returns 0
[22m[39m[bm25-index] Failed to rebuild from database: Database is locked

 [32m✓[39m tests/bm25-security.vitest.ts [2m([22m[2m64 tests[22m[2m)[22m[32m 21[2mms[22m[39m
 [32m✓[39m tests/vector-index-schema-compatibility.vitest.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m tests/integration-checkpoint-lifecycle.vitest.ts [2m([22m[2m8 tests[22m[2m)[22m[32m 14[2mms[22m[39m
 [32m✓[39m tests/graph-calibration.vitest.ts [2m([22m[2m80 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m tests/memory-context-eval-channels.vitest.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m tests/shadow-comparison.vitest.ts [2m([22m[2m21 tests[22m[2m)[22m[32m 12[2mms[22m[39m
[90mstderr[2m | tests/signal-vocab.vitest.ts[2m > [22m[2mSignal Vocabulary (T012)[2m > [22m[2mT012-07: SPECKIT_SIGNAL_VOCAB flag controls activation[2m > [22m[2mdoes NOT apply signal boosts when SPECKIT_SIGNAL_VOCAB is explicitly false
[22m[39m[trigger-matcher] Database not initialized. Server may still be starting up.
[trigger-matcher] Database not initialized. Server may still be starting up.

[90mstderr[2m | tests/signal-vocab.vitest.ts[2m > [22m[2mSignal Vocabulary (T012)[2m > [22m[2mT012-07: SPECKIT_SIGNAL_VOCAB flag controls activation[2m > [22m[2mapplies signal boosts when SPECKIT_SIGNAL_VOCAB is set
[22m[39m[trigger-matcher] Database not initialized. Server may still be starting up.
[trigger-matcher] Database not initialized. Server may still be starting up.

[90mstderr[2m | tests/signal-vocab.vitest.ts[2m > [22m[2mSignal Vocabulary (T012)[2m > [22m[2mT012-07: SPECKIT_SIGNAL_VOCAB flag controls activation[2m > [22m[2mreturns same match count with or without flag
[22m[39m[trigger-matcher] Database not initialized. Server may still be starting up.
[trigger-matcher] Database not initialized. Server may still be starting up.
[trigger-matcher] Database not initialized. Server may still be starting up.
[trigger-matcher] Database not initialized. Server may still be starting up.

 [32m✓[39m tests/signal-vocab.vitest.ts [2m([22m[2m27 tests[22m[2m)[22m[32m 14[2mms[22m[39m
 [32m✓[39m tests/scoring.vitest.ts [2m([22m[2m21 tests[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m tests/progressive-disclosure.vitest.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m tests/adaptive-fallback.vitest.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m tests/confidence-truncation.vitest.ts [2m([22m[2m39 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m tests/fsrs-scheduler.vitest.ts [2m([22m[2m55 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m tests/feature-eval-query-intelligence.vitest.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 5[2mms[22m[39m
[90mstderr[2m | tests/graph-scoring-integration.vitest.ts[2m > [22m[2mD. Token Budget with Results[2m > [22m[2mD1: truncateToBudget respects budget limit — returns fewer results when over budget
[22m[39m[hybrid-search] Token budget overflow: 7659 tokens > 500 budget, truncated 100 → 6 results

 [32m✓[39m tests/graph-scoring-integration.vitest.ts [2m([22m[2m24 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m tests/retrieval-trace.vitest.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m tests/feature-flag-reference-docs.vitest.ts [2m([22m[2m12 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m tests/query-router.vitest.ts [2m([22m[2m33 tests[22m[2m)[22m[32m 5[2mms[22m[39m
[90mstderr[2m | tests/embeddings.vitest.ts[2m > [22m[2mEmbeddings Architecture (T513)[2m > [22m[2mProvider resolution[2m > [22m[2mT513-01c: auto mode falls back to openai when voyage key is placeholder
[22m[39m[embeddings] VOYAGE_API_KEY appears to be a placeholder — skipping

[90mstderr[2m | tests/embeddings.vitest.ts[2m > [22m[2mEmbeddings Architecture (T513)[2m > [22m[2mProvider factory[2m > [22m[2mT513-02a: creates hf-local provider with expected interface methods
[22m[39m[factory] Using provider: hf-local (VOYAGE_API_KEY detected (auto mode))

[90mstderr[2m | tests/embeddings.vitest.ts[2m > [22m[2mEmbeddings Architecture (T513)[2m > [22m[2mProvider factory[2m > [22m[2mT513-02b: openai provider without key fails fast
[22m[39m[factory] Using provider: openai (VOYAGE_API_KEY detected (auto mode))
[factory] Error creating provider openai: OpenAI provider requires OPENAI_API_KEY. Set the variable or use EMBEDDINGS_PROVIDER=hf-local to force local.

[90mstderr[2m | tests/embeddings.vitest.ts[2m > [22m[2mEmbeddings Architecture (T513)[2m > [22m[2mProvider factory[2m > [22m[2mT513-02c: voyage provider without key fails fast
[22m[39m[factory] Using provider: voyage (Default fallback (no API keys detected))
[factory] Error creating provider voyage: Voyage provider requires VOYAGE_API_KEY. Set the variable or use EMBEDDINGS_PROVIDER=hf-local to force local.

[90mstderr[2m | tests/embeddings.vitest.ts[2m > [22m[2mEmbeddings Architecture (T513)[2m > [22m[2mMCP embeddings facade[2m > [22m[2mT513-04b: empty document and query inputs return null without provider warmup
[22m[39m[embeddings] Empty document text

[90mstderr[2m | tests/embeddings.vitest.ts[2m > [22m[2mEmbeddings Architecture (T513)[2m > [22m[2mMCP embeddings facade[2m > [22m[2mT513-04b: empty document and query inputs return null without provider warmup
[22m[39m[embeddings] Empty query

 [32m✓[39m tests/embeddings.vitest.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 16[2mms[22m[39m
 [32m✓[39m tests/search-extended.vitest.ts [2m([22m[2m48 tests[22m[2m)[22m[32m 5[2mms[22m[39m
[90mstderr[2m | tests/memory-search-ux-hooks.vitest.ts[2m > [22m[2mmemory_search UX hook integration[2m > [22m[2madds progressive disclosure payloads and session state to search responses
[22m[39m[memory-search] Intent auto-detected as 'understand' (confidence: 0.90)

[90mstderr[2m | tests/memory-search-ux-hooks.vitest.ts[2m > [22m[2mmemory_search UX hook integration[2m > [22m[2mresolves continuation cursors without requiring a new query
[22m[39m[memory-search] Intent auto-detected as 'understand' (confidence: 0.90)

 [32m✓[39m tests/mpab-aggregation.vitest.ts [2m([22m[2m34 tests[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m tests/memory-search-ux-hooks.vitest.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 22[2mms[22m[39m
 [32m✓[39m tests/mcp-error-format.vitest.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m tests/folder-relevance.vitest.ts [2m([22m[2m22 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m tests/query-router-channel-interaction.vitest.ts [2m([22m[2m16 tests[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m tests/reranker-eval-comparison.vitest.ts [2m([22m[2m5 tests[22m[2m | [22m[33m1 skipped[39m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m tests/tier-classifier.vitest.ts [2m([22m[2m78 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m tests/api-key-validation.vitest.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 2[2mms[22m[39m
[90mstderr[2m | tests/short-critical-quality-gate.vitest.ts[2m > [22m[2mShort-Critical Gate Exception — validateStructural integration[2m > [22m[2mpasses short content for decision type with 2 structural signals
[22m[39m[QUALITY-GATE] short-critical-exception | context_type=decision | content_length=25 | bypassing min-length check

[90mstderr[2m | tests/short-critical-quality-gate.vitest.ts[2m > [22m[2mShort-Critical Gate Exception — validateStructural integration[2m > [22m[2mpasses short content for decision type with 3 structural signals
[22m[39m[QUALITY-GATE] short-critical-exception | context_type=decision | content_length=25 | bypassing min-length check

[90mstderr[2m | tests/short-critical-quality-gate.vitest.ts[2m > [22m[2mShort-Critical Gate Exception — validateStructural integration[2m > [22m[2mstill rejects missing title even when short-critical exception applies
[22m[39m[QUALITY-GATE] short-critical-exception | context_type=decision | content_length=25 | bypassing min-length check

[90mstderr[2m | tests/short-critical-quality-gate.vitest.ts[2m > [22m[2mShort-Critical Gate Exception — validateStructural integration[2m > [22m[2mstill rejects invalid specFolder even when exception applies to content length
[22m[39m[QUALITY-GATE] short-critical-exception | context_type=decision | content_length=25 | bypassing min-length check

[90mstderr[2m | tests/short-critical-quality-gate.vitest.ts[2m > [22m[2mShort-Critical Gate Exception — contextType passthrough in runQualityGate[2m > [22m[2mQualityGateParams accepts contextType field (compile-time check)
[22m[39m[QUALITY-GATE] short-critical-exception | context_type=decision | content_length=10 | bypassing min-length check

 [32m✓[39m tests/short-critical-quality-gate.vitest.ts [2m([22m[2m36 tests[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m tests/channel-enforcement.vitest.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m tests/unit-rrf-fusion.vitest.ts [2m([22m[2m24 tests[22m[2m)[22m[32m 23[2mms[22m[39m
 [32m✓[39m tests/structure-aware-chunker.vitest.ts [2m([22m[2m9 tests[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m tests/unit-tier-classifier-types.vitest.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 6[2mms[22m[39m
[90mstderr[2m | tests/integration-search-pipeline.vitest.ts[2m > [22m[2mIntegration Search Pipeline (T525) [deferred - requires DB test fixtures][2m > [22m[2mPipeline Input Validation[2m > [22m[2mT525-4: specFolder filter accepted
[22m[39m[memory-search] Intent auto-detected as 'understand' (confidence: 0.00)

 [32m✓[39m tests/unit-composite-scoring-types.vitest.ts [2m([22m[2m13 tests[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m tests/fsrs-hybrid-decay.vitest.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 2[2mms[22m[39m
[90mstderr[2m | tests/integration-session-dedup.vitest.ts[2m > [22m[2mIntegration Session Dedup (T531) [deferred - requires DB test fixtures][2m > [22m[2mSearch Handler Session Dedup Parameters[2m > [22m[2mT531-2: enableDedup=true accepted by search
[22m[39m[memory-search] Intent auto-detected as 'find_decision' (confidence: 0.16)

 [32m✓[39m tests/channel-representation.vitest.ts [2m([22m[2m18 tests[22m[2m)[22m[32m 7[2mms[22m[39m
[90mstderr[2m | tests/orchestrator-error-cascade.vitest.ts[2m > [22m[2mexecutePipeline error cascading (B1)[2m > [22m[2mdegrades gracefully on Stage 2 failure (returns unsorted candidates)
[22m[39m[pipeline] Stage 2 failed, returning unscored candidates: RRF fusion NaN overflow

[90mstderr[2m | tests/orchestrator-error-cascade.vitest.ts[2m > [22m[2mexecutePipeline error cascading (B1)[2m > [22m[2mdegrades gracefully on Stage 3 failure (returns unranked results)
[22m[39m[pipeline] Stage 3 failed, returning unranked results: cross-encoder timeout

[90mstderr[2m | tests/orchestrator-error-cascade.vitest.ts[2m > [22m[2mexecutePipeline error cascading (B1)[2m > [22m[2mdegrades gracefully on Stage 4 failure (returns unfiltered results)
[22m[39m[pipeline] Stage 4 failed, returning unfiltered results: score invariant violation

[90mstderr[2m | tests/orchestrator-error-cascade.vitest.ts[2m > [22m[2mexecutePipeline error cascading (B1)[2m > [22m[2mhandles multiple stage failures (Stage 2 + Stage 4)
[22m[39m[pipeline] Stage 2 failed, returning unscored candidates: scoring crash

[90mstderr[2m | tests/orchestrator-error-cascade.vitest.ts[2m > [22m[2mexecutePipeline error cascading (B1)[2m > [22m[2mhandles multiple stage failures (Stage 2 + Stage 4)
[22m[39m[pipeline] Stage 4 failed, returning unfiltered results: filter crash

 [32m✓[39m tests/orchestrator-error-cascade.vitest.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m tests/memory-search-integration.vitest.ts [2m([22m[2m51 tests[22m[2m)[22m[32m 26[2mms[22m[39m
 [32m✓[39m tests/unit-folder-scoring-types.vitest.ts [2m([22m[2m12 tests[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m tests/concept-routing.vitest.ts [2m([22m[2m33 tests[22m[2m)[22m[32m 15[2mms[22m[39m
 [32m✓[39m tests/tiered-injection-turnNumber.vitest.ts [2m([22m[2m18 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m tests/session-lifecycle.vitest.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m tests/schema-migration.vitest.ts [2m([22m[2m55 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m tests/mmr-reranker.vitest.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 6[2mms[22m[39m
[90mstderr[2m | tests/trigger-matcher.vitest.ts[2m > [22m[2mTrigger Matcher (T501)[2m > [22m[2mVery Long Prompt (T501-10)[2m > [22m[2mT501-10: very long prompt processes within 5s
[22m[39m[trigger-matcher] Database not initialized. Server may still be starting up.

 [32m✓[39m tests/trigger-matcher.vitest.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 4[2mms[22m[39m
[90mstderr[2m | tests/hooks-ux-feedback.vitest.ts[2m > [22m[2mHooks UX feedback[2m > [22m[2mappendAutoSurfaceHints no-ops on malformed or non-json response
[22m[39m[response-hints] appendAutoSurfaceHints failed: Expected property name or '}' in JSON at position 1 (line 1 column 2)

 [32m✓[39m tests/hooks-ux-feedback.vitest.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m tests/continue-session.vitest.ts [2m([22m[2m34 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m tests/d5-recovery-payload.vitest.ts [2m([22m[2m36 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m tests/query-decomposition.vitest.ts [2m([22m[2m8 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m tests/hooks-mutation-wiring.vitest.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m tests/validation-metadata.vitest.ts [2m([22m[2m32 tests[22m[2m)[22m[32m 5[2mms[22m[39m
[90mstderr[2m | tests/unit-path-security.vitest.ts[2m > [22m[2mPath Security (T001-T007)[2m > [22m[2mT002: path traversal attempt (../../etc/passwd) is rejected
[22m[39m[utils] Path traversal blocked: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/etc/passwd -> /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/etc/passwd

[90mstderr[2m | tests/unit-path-security.vitest.ts[2m > [22m[2mPath Security (T001-T007)[2m > [22m[2mT003: null bytes in path rejected
[22m[39m[utils] Null byte in path blocked: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/file .txt

[90mstderr[2m | tests/unit-path-security.vitest.ts[2m > [22m[2mPath Security (T001-T007)[2m > [22m[2mT004: path outside allowed bases rejected
[22m[39m[utils] Path traversal blocked: /usr/bin/node -> /usr/bin/node

[90mstderr[2m | tests/unit-path-security.vitest.ts[2m > [22m[2mPath Security (T001-T007)[2m > [22m[2mT005: symlink resolution blocks escape from allowed base
[22m[39m[utils] Path traversal blocked: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/speckit-test-pathsec-1774430419170/allowed/sneaky-link -> /private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/speckit-test-pathsec-1774430419170/outside/secret.txt

[90mstderr[2m | tests/unit-path-security.vitest.ts[2m > [22m[2mPath Security (T001-T007)[2m > [22m[2mT007: empty/null/undefined allowed_base_paths rejected
[22m[39m[utils] validateFilePath called with empty allowedBasePaths
[utils] validateFilePath called with empty allowedBasePaths
[utils] validateFilePath called with empty allowedBasePaths

 [32m✓[39m tests/unit-path-security.vitest.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 4[2mms[22m[39m
[90mstderr[2m | tests/cross-encoder-circuit-breaker.vitest.ts[2m > [22m[2mcross-encoder circuit breaker[2m > [22m[2mopens circuit at CIRCUIT_FAILURE_THRESHOLD (3) failures
[22m[39m[cross-encoder] Circuit breaker OPEN for voyage after 3 consecutive failures. Cooldown: 60000ms

[90mstderr[2m | tests/cross-encoder-circuit-breaker.vitest.ts[2m > [22m[2mcross-encoder circuit breaker[2m > [22m[2misCircuitOpen returns true when opened
[22m[39m[cross-encoder] Circuit breaker OPEN for cohere after 3 consecutive failures. Cooldown: 60000ms

[90mstderr[2m | tests/cross-encoder-circuit-breaker.vitest.ts[2m > [22m[2mcross-encoder circuit breaker[2m > [22m[2misCircuitOpen returns false after CIRCUIT_COOLDOWN_MS elapses
[22m[39m[cross-encoder] Circuit breaker OPEN for voyage after 3 consecutive failures. Cooldown: 60000ms

[90mstderr[2m | tests/cross-encoder-circuit-breaker.vitest.ts[2m > [22m[2mcross-encoder circuit breaker[2m > [22m[2mdifferent providers have independent circuit states
[22m[39m[cross-encoder] Circuit breaker OPEN for voyage after 3 consecutive failures. Cooldown: 60000ms

[90mstderr[2m | tests/cross-encoder-circuit-breaker.vitest.ts[2m > [22m[2mcross-encoder circuit breaker[2m > [22m[2mhalf-open: first check after cooldown resets openedAt and failures
[22m[39m[cross-encoder] Circuit breaker OPEN for local after 3 consecutive failures. Cooldown: 60000ms

[90mstderr[2m | tests/cross-encoder-circuit-breaker.vitest.ts[2m > [22m[2mcross-encoder circuit breaker[2m > [22m[2mcircuit stays open within cooldown window
[22m[39m[cross-encoder] Circuit breaker OPEN for voyage after 3 consecutive failures. Cooldown: 60000ms

 [32m✓[39m tests/cross-encoder-circuit-breaker.vitest.ts [2m([22m[2m9 tests[22m[2m)[22m[32m 7[2mms[22m[39m
[90mstderr[2m | tests/hybrid-search-context-headers.vitest.ts[2m > [22m[2mContextual tree injection[2m > [22m[2mT065: preserves post-truncation ordering after contextual headers are injected
[22m[39m[hybrid-search] Token budget overflow: 381 tokens > 256 budget, truncated 3 → 2 results

[90mstderr[2m | tests/hybrid-search-context-headers.vitest.ts[2m > [22m[2mContextual tree injection[2m > [22m[2mT066: adjusted token budget reserves header overhead and avoids overflow after injection
[22m[39m[hybrid-search] Token budget overflow: 655 tokens > 603 budget, truncated 2 → 1 results

 [32m✓[39m tests/hybrid-search-context-headers.vitest.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 14[2mms[22m[39m
 [32m✓[39m tests/dynamic-token-budget.vitest.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 3[2mms[22m[39m
[90mstderr[2m | tests/quality-gate-exception.vitest.ts[2m > [22m[2mSave quality gate short-decision exception[2m > [22m[2mbypasses the length gate for short decisions with title + specFolder
[22m[39m[QUALITY-GATE] short-critical-exception | context_type=decision | content_length=45 | bypassing min-length check

[90mstderr[2m | tests/quality-gate-exception.vitest.ts[2m > [22m[2mSave quality gate short-decision exception[2m > [22m[2mgates the exception behind SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS
[22m[39m[QUALITY-GATE] short-critical-exception | context_type=decision | content_length=45 | bypassing min-length check
[QUALITY-GATE] warn-only | score: 0.21 | would-reject: true | reasons: [Signal density 0.21 below threshold 0.4, No trigger phrases: add at least 1-2 trigger phrases, No YAML frontmatter: add metadata block]

 [32m✓[39m tests/quality-gate-exception.vitest.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m tests/calibrated-overlap-bonus.vitest.ts [2m([22m[2m21 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m tests/decay.vitest.ts [2m([22m[2m27 tests[22m[2m)[22m[32m 3[2mms[22m[39m
[90mstderr[2m | tests/memory-search-eval-channels.vitest.ts[2m > [22m[2mT056: memory_search emits per-channel eval rows[2m > [22m[2mlogs one eval_channel_results row per contributing channel
[22m[39m[memory-search] Intent auto-detected as 'understand' (confidence: 0.90)

 [32m✓[39m tests/memory-search-eval-channels.vitest.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m tests/rrf-fusion.vitest.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m tests/feedback-denylist.vitest.ts [2m([22m[2m37 tests[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m tests/unit-normalization.vitest.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m tests/search-flags.vitest.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m tests/integration-error-recovery.vitest.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m tests/unit-normalization-roundtrip.vitest.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m tests/config-cognitive.vitest.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m tests/empty-result-recovery.vitest.ts [2m([22m[2m5 tests[22m[2m)[22m[32m 17[2mms[22m[39m
 [32m✓[39m tests/importance-tiers.vitest.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m tests/hybrid-decay-policy.vitest.ts [2m([22m[2m26 tests[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m tests/mutation-hooks.vitest.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m tests/k-value-optimization.vitest.ts [2m([22m[2m9 tests[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m tests/assistive-reconsolidation.vitest.ts [2m([22m[2m26 tests[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m tests/search-archival.vitest.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m tests/graph-flags.vitest.ts [2m([22m[2m5 tests[22m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m tests/query-expander.vitest.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 2[2mms[22m[39m
[90mstderr[2m | tests/reconsolidation-cleanup-ordering.vitest.ts[2m > [22m[2mReconsolidation cleanup ordering[2m > [22m[2mskips DELETE history when orphan cleanup does not delete a row
[22m[39m[reconsolidation] cleaned up orphan memory [33m99[39m after executeConflict failure

 [32m✓[39m tests/memory-save-integration.vitest.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m tests/reconsolidation-cleanup-ordering.vitest.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m tests/evidence-gap-detector.vitest.ts [2m([22m[2m12 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m tests/memory-tools.vitest.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
[90mstdout[2m | tests/eval-the-eval.vitest.ts[2m > [22m[2mT013: Discrepancy Log Summary[2m > [22m[2mT013-SUMMARY: prints discrepancy table and asserts zero failures
[22m[39m
╔══════════════════════════════════════════════════════════════════════════════════╗
║  T013 EVAL-THE-EVAL — DISCREPANCY LOG                                          ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║  Scenario        │ Metric   │  Expected  │  Computed  │   Delta   │  Status     ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║  T013-MRR-1        │ MRR@5    │   1.000000 │   1.000000 │  0.000000 │  PASS         ║
║  T013-MRR-2        │ MRR@5    │   0.333333 │   0.333333 │  0.000000 │  PASS         ║
║  T013-MRR-3        │ MRR@5    │   0.500000 │   0.500000 │  0.000000 │  PASS         ║
║  T013-MRR-4        │ MRR@5    │   0.000000 │   0.000000 │  0.000000 │  PASS         ║
║  T013-MRR-5        │ MRR@5    │   0.200000 │   0.200000 │  0.000000 │  PASS         ║
║  T013-NDCG-A       │ NDCG@10  │   1.000000 │   1.000000 │  0.000000 │  PASS         ║
║  T013-NDCG-B       │ NDCG@10  │   0.789998 │   0.789998 │  0.000000 │  PASS         ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║  RESULT: 7/7 within tolerance ±0.01   |   Failures: 0                                     ║
╚══════════════════════════════════════════════════════════════════════════════════╝


 [32m✓[39m tests/eval-the-eval.vitest.ts [2m([22m[2m8 tests[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m tests/stage3-rerank-regression.vitest.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m tests/score-resolution-consistency.vitest.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m tests/rollout-policy.vitest.ts [2m([22m[2m8 tests[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m tests/pipeline-architecture-remediation.vitest.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m tests/token-budget-enforcement.vitest.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m tests/unit-fsrs-formula.vitest.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m tests/redaction-gate.vitest.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m tests/memory-search-quality-filter.vitest.ts [2m([22m[2m13 tests[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m tests/reranker.vitest.ts [2m([22m[2m5 tests[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m tests/trigger-setAttentionScore.vitest.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m tests/embedding-retry-stats.vitest.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m tests/embedding-weighting.vitest.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m tests/intent-aware-traversal.vitest.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 2[2mms[22m[39m
 [2m[90m↓[39m[22m tests/sparse-first-graph.vitest.ts [2m([22m[2m5 tests[22m[2m | [22m[33m5 skipped[39m[2m)[22m
 [32m✓[39m tests/pressure-monitor.vitest.ts [2m([22m[2m5 tests[22m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m tests/intent-routing.vitest.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m tests/save-index-exports.vitest.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 3[2mms[22m[39m
[90mstderr[2m | tests/integration-session-dedup.vitest.ts[2m > [22m[2mIntegration Session Dedup (T531) [deferred - requires DB test fixtures][2m > [22m[2mTrigger Handler Session Parameters[2m > [22m[2mT531-3: session_id parameter accepted by triggers
[22m[39m[memory_match_triggers] SECURITY: Rejected untrusted sessionId "dedup-session-003" — sessionId "dedup-session-003" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.

[90mstderr[2m | tests/integration-session-dedup.vitest.ts[2m > [22m[2mIntegration Session Dedup (T531) [deferred - requires DB test fixtures][2m > [22m[2mTrigger Handler Session Parameters[2m > [22m[2mT531-4: Search without sessionId accepted (no dedup)
[22m[39m[memory-search] Intent auto-detected as 'find_decision' (confidence: 0.14)

[90mstderr[2m | tests/integration-search-pipeline.vitest.ts[2m > [22m[2mIntegration Search Pipeline (T525) [deferred - requires DB test fixtures][2m > [22m[2mMulti-Concept & Advanced Parameters[2m > [22m[2mT525-9: Session dedup parameters accepted
[22m[39m[memory-search] Intent auto-detected as 'understand' (confidence: 0.00)

[90mstderr[2m | tests/integration-session-dedup.vitest.ts[2m > [22m[2mIntegration Session Dedup (T531) [deferred - requires DB test fixtures][2m > [22m[2mDedup Disable Flag[2m > [22m[2mT531-5: Default dedup behavior with sessionId
[22m[39m[memory-search] Intent auto-detected as 'understand' (confidence: 0.04)

[90mstderr[2m | tests/integration-search-pipeline.vitest.ts[2m > [22m[2mIntegration Search Pipeline (T525) [deferred - requires DB test fixtures][2m > [22m[2mMulti-Concept & Advanced Parameters[2m > [22m[2mT525-10: includeConstitutional parameter accepted
[22m[39m[memory-search] Intent auto-detected as 'understand' (confidence: 0.00)

[90mstderr[2m | tests/integration-session-dedup.vitest.ts[2m > [22m[2mIntegration Session Dedup (T531) [deferred - requires DB test fixtures][2m > [22m[2mDedup Disable Flag[2m > [22m[2mT531-6: enableDedup=false accepted
[22m[39m[memory-search] Intent auto-detected as 'understand' (confidence: 0.00)

 [32m✓[39m tests/integration-search-pipeline.vitest.ts [2m([22m[2m15 tests[22m[2m)[22m[33m 25015[2mms[22m[39m
       [33m[2m✓[22m[39m T525-2: Valid args accepted by pipeline [33m 5007[2mms[22m[39m
       [33m[2m✓[22m[39m T525-4: specFolder filter accepted [33m 5001[2mms[22m[39m
       [33m[2m✓[22m[39m T525-8: Intent parameter accepted [33m 5000[2mms[22m[39m
       [33m[2m✓[22m[39m T525-9: Session dedup parameters accepted [33m 5001[2mms[22m[39m
       [33m[2m✓[22m[39m T525-10: includeConstitutional parameter accepted [33m 5001[2mms[22m[39m
 [32m✓[39m tests/integration-session-dedup.vitest.ts [2m([22m[2m6 tests[22m[2m)[22m[33m 25010[2mms[22m[39m
       [33m[2m✓[22m[39m T531-1: sessionId parameter accepted by search [33m 5002[2mms[22m[39m
       [33m[2m✓[22m[39m T531-2: enableDedup=true accepted by search [33m 5002[2mms[22m[39m
       [33m[2m✓[22m[39m T531-4: Search without sessionId accepted (no dedup) [33m 5001[2mms[22m[39m
       [33m[2m✓[22m[39m T531-5: Default dedup behavior with sessionId [33m 5001[2mms[22m[39m
       [33m[2m✓[22m[39m T531-6: enableDedup=false accepted [33m 5002[2mms[22m[39m
 [32m✓[39m tests/progressive-validation.vitest.ts [2m([22m[2m50 tests[22m[2m)[22m[33m 78618[2mms[22m[39m
       [33m[2m✓[22m[39m Level 1 detect runs and produces output [33m 1883[2mms[22m[39m
       [33m[2m✓[22m[39m Level 1 detect identifies missing files [33m 1508[2mms[22m[39m
       [33m[2m✓[22m[39m Level 1 detect with --json produces JSON output [33m 2038[2mms[22m[39m
       [33m[2m✓[22m[39m Level 1 does not modify files [33m 1930[2mms[22m[39m
       [33m[2m✓[22m[39m YYYY-MM-DD placeholder replaced with today date [33m 1969[2mms[22m[39m
       [33m[2m✓[22m[39m [DATE] placeholder replaced with today date [33m 1369[2mms[22m[39m
       [33m[2m✓[22m[39m date: TBD replaced with today date [33m 1297[2mms[22m[39m
       [33m[2m✓[22m[39m headings starting at H2 are shifted to start at H1 [33m 1210[2mms[22m[39m
       [33m[2m✓[22m[39m sub-heading levels are preserved relatively after normalization [33m 1360[2mms[22m[39m
       [33m[2m✓[22m[39m files already starting at H1 are not modified by heading fix [33m 1298[2mms[22m[39m
       [33m[2m✓[22m[39m trailing whitespace is trimmed from lines [33m 1398[2mms[22m[39m
       [33m[2m✓[22m[39m CRLF line endings are normalized to LF [33m 1317[2mms[22m[39m
       [33m[2m✓[22m[39m file ends with a newline after normalization [33m 1319[2mms[22m[39m
       [33m[2m✓[22m[39m JSON output includes autoFixes section with diffs [33m 3401[2mms[22m[39m
       [33m[2m✓[22m[39m each auto-fix item has type and description [33m 3298[2mms[22m[39m
       [33m[2m✓[22m[39m human-readable output mentions auto-fix activity [33m 1319[2mms[22m[39m
       [33m[2m✓[22m[39m Level 3 runs suggest phase for issues [33m 3298[2mms[22m[39m
       [33m[2m✓[22m[39m Level 4 with --json includes suggestions array [33m 3245[2mms[22m[39m
       [33m[2m✓[22m[39m suggestions include remediation guidance [33m 3360[2mms[22m[39m
       [33m[2m✓[22m[39m Level 4 JSON report has expected top-level keys [33m 3324[2mms[22m[39m
       [33m[2m✓[22m[39m Level 4 human report includes summary section [33m 3192[2mms[22m[39m
       [33m[2m✓[22m[39m Level 4 quiet mode produces single-line result [33m 3267[2mms[22m[39m
       [33m[2m✓[22m[39m report correctly reflects dry-run state [33m 3277[2mms[22m[39m
       [33m[2m✓[22m[39m exit code 2 for missing required files (errors) [33m 659[2mms[22m[39m
       [33m[2m✓[22m[39m exit code in {0, 1, 2} for valid folder [33m 1008[2mms[22m[39m
       [33m[2m✓[22m[39m exit codes are consistent between levels [33m 2514[2mms[22m[39m
       [33m[2m✓[22m[39m exit code 2 with --strict mode when warnings exist [33m 928[2mms[22m[39m
       [33m[2m✓[22m[39m --dry-run does not modify files [33m 1188[2mms[22m[39m
       [33m[2m✓[22m[39m --dry-run still shows what would be changed [33m 1264[2mms[22m[39m
       [33m[2m✓[22m[39m --dry-run JSON report shows count of proposed fixes [33m 3231[2mms[22m[39m
       [33m[2m✓[22m[39m files are unmodified after dry-run with whitespace issues [33m 1227[2mms[22m[39m
       [33m[2m✓[22m[39m validate.sh still works independently [33m 915[2mms[22m[39m
       [33m[2m✓[22m[39m validate.sh --json produces valid JSON [33m 940[2mms[22m[39m
       [33m[2m✓[22m[39m validate.sh error exit codes are unchanged [33m 618[2mms[22m[39m
       [33m[2m✓[22m[39m level 1 only runs detect (no auto-fix) [33m 915[2mms[22m[39m
       [33m[2m✓[22m[39m multiple auto-fix types can apply to the same file [33m 3118[2mms[22m[39m
       [33m[2m✓[22m[39m empty spec folder (no .md files) handled gracefully [33m 393[2mms[22m[39m
       [33m[2m✓[22m[39m level 2 runs both detect and auto-fix [33m 1486[2mms[22m[39m
       [33m[2m✓[22m[39m level 2 propagates detect errors when required files are missing [33m 864[2mms[22m[39m
       [33m[2m✓[22m[39m level 3 runs detect, auto-fix, and suggest [33m 3047[2mms[22m[39m
       [33m[2m✓[22m[39m level 4 is the default when no --level specified [33m 3331[2mms[22m[39m

[2m Test Files [22m [1m[32m312 passed[39m[22m[2m | [22m[33m1 skipped[39m[90m (313)[39m
[2m      Tests [22m [1m[32m8552 passed[39m[22m[2m | [22m[33m74 skipped[39m[2m | [22m[90m26 todo[39m[90m (8652)[39m
[2m   Start at [22m 10:20:12
[2m   Duration [22m 79.01s[2m (transform 14.82s, setup 0ms, import 42.67s, tests 149.43s, environment 38ms)[22m


> @spec-kit/mcp-server@1.7.2 test:file-watcher
> vitest run tests/file-watcher.vitest.ts


[1m[46m RUN [49m[22m [36mv4.0.18 [39m[90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server[39m

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mforces reindex for repeated add events even when content is unchanged
[22m[39m[file-watcher] Reindexed sample.md in 0ms (total: 1 files, avg: 0ms)

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mforces reindex for repeated add events even when content is unchanged
[22m[39m[file-watcher] Reindexed sample.md in 0ms (total: 2 files, avg: 0ms)

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mwaits for in-flight reindex to finish during close
[22m[39m[file-watcher] Reindexed sample.md in 125ms (total: 3 files, avg: 42ms)

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mcalls removeFn when a markdown file is deleted
[22m[39m[file-watcher] Removed indexed entries for sample.md

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mretries SQLITE_BUSY with exponential backoff before succeeding
[22m[39m[file-watcher] Reindexed sample.md in 3000ms (total: 4 files, avg: 781ms)

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mCHK-077: changed .md file re-indexed within 5 seconds of save
[22m[39m[file-watcher] Reindexed timing-test.md in 0ms (total: 5 files, avg: 625ms)

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mCHK-078: rapid consecutive saves debounced to exactly 1 re-index
[22m[39m[file-watcher] Reindexed debounce-test.md in 0ms (total: 6 files, avg: 521ms)

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mremoves old entry and indexes new entry on file rename
[22m[39m[file-watcher] Removed indexed entries for rename-old.md

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mremoves old entry and indexes new entry on file rename
[22m[39m[file-watcher] Reindexed rename-new.md in 0ms (total: 7 files, avg: 446ms)

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mdebounces rapid changes within the 2-second default window to one reindex
[22m[39m[file-watcher] Reindexed debounce-default-window.md in 0ms (total: 8 files, avg: 391ms)

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mhandles burst renames and keeps only final path indexed
[22m[39m[file-watcher] Removed indexed entries for burst-0.md

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mhandles burst renames and keeps only final path indexed
[22m[39m[file-watcher] Removed indexed entries for burst-1.md

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mhandles burst renames and keeps only final path indexed
[22m[39m[file-watcher] Removed indexed entries for burst-2.md

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mhandles burst renames and keeps only final path indexed
[22m[39m[file-watcher] Reindexed burst-3.md in 0ms (total: 9 files, avg: 347ms)

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mhandles concurrent renames across multiple files
[22m[39m[file-watcher] Removed indexed entries for alpha.md

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mhandles concurrent renames across multiple files
[22m[39m[file-watcher] Removed indexed entries for beta.md

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mhandles concurrent renames across multiple files
[22m[39m[file-watcher] Removed indexed entries for gamma.md

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mhandles concurrent renames across multiple files
[22m[39m[file-watcher] Reindexed alpha-renamed.md in 0ms (total: 10 files, avg: 313ms)

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mhandles concurrent renames across multiple files
[22m[39m[file-watcher] Reindexed beta-renamed.md in 0ms (total: 11 files, avg: 284ms)

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher runtime behavior[2m > [22m[2mhandles concurrent renames across multiple files
[22m[39m[file-watcher] Reindexed gamma-renamed.md in 0ms (total: 12 files, avg: 260ms)

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher metrics[2m > [22m[2mtracks filesReindexed after reindex operations
[22m[39m[file-watcher] Reindexed sample.md in 0ms (total: 1 files, avg: 0ms)

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher metrics[2m > [22m[2mcomputes avgReindexTimeMs as the running average of reindex timings
[22m[39m[file-watcher] Reindexed sample.md in 55ms (total: 1 files, avg: 55ms)

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher metrics[2m > [22m[2mcomputes avgReindexTimeMs as the running average of reindex timings
[22m[39m[file-watcher] Reindexed sample.md in 115ms (total: 2 files, avg: 85ms)

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher metrics[2m > [22m[2maccumulates metrics across multiple reindex operations
[22m[39m[file-watcher] Reindexed sample.md in 35ms (total: 1 files, avg: 35ms)

[90mstderr[2m | tests/file-watcher.vitest.ts[2m > [22m[2mfile-watcher metrics[2m > [22m[2maccumulates metrics across multiple reindex operations
[22m[39m[file-watcher] Reindexed sample.md in 35ms (total: 2 files, avg: 35ms)

 [32m✓[39m tests/file-watcher.vitest.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 35[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m20 passed[39m[22m[90m (20)[39m
[2m   Start at [22m 10:21:31
[2m   Duration [22m 189ms[2m (transform 31ms, setup 0ms, import 44ms, tests 35ms, environment 0ms)[22m


> @spec-kit/scripts@1.7.2 test
> vitest run --config ../mcp_server/vitest.config.ts --root . && npm run test:legacy


[1m[46m RUN [49m[22m [36mv4.1.0 [39m[90m/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts[39m


[2m Test Files [22m [1m[32m44 passed[39m[22m[90m (44)[39m
[2m      Tests [22m [1m[32m480 passed[39m[22m[90m (480)[39m
[2m   Start at [22m 10:21:32
[2m   Duration [22m 121.63s[2m (transform 6.15s, setup 0ms, import 7.14s, tests 176.22s, environment 3ms)[22m


> @spec-kit/scripts@1.7.2 test:legacy
> npm run build && node tests/test-scripts-modules.js && node tests/test-extractors-loaders.js


> @spec-kit/scripts@1.7.2 build
> tsc --build

🧪 Scripts Modules Comprehensive Test Suite
=============================================
Date: 2026-03-25T09:23:34.441Z
Scripts Dir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/dist


🔬 CORE: config.js
   ✅ T-001a: CONFIG object exists
      Evidence: Object loaded
   ✅ T-001b: SKILL_VERSION defined
      Evidence: 1.7.2
   ✅ T-001c: PROJECT_ROOT defined
      Evidence: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode
   ✅ T-001d: TEMPLATE_DIR defined
      Evidence: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/templates
   ✅ T-001e: CONFIG has MAX_RESULT_PREVIEW
      Evidence: 500
   ✅ T-001f: CONFIG has MAX_CONVERSATION_MESSAGES
      Evidence: 100
   ✅ T-001g: getSpecsDirectories() returns non-empty array
      Evidence: Length: 2
   ✅ T-001h: findActiveSpecsDir() returns string or null
      Evidence: Result: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs
   ✅ T-001i: getAllExistingSpecsDirs() returns array
      Evidence: Length: 1

🔬 CORE: workflow.js
   ✅ T-002a: runWorkflow exported
      Evidence: Type is function
   ✅ T-002d: validateNoLeakedPlaceholders exported
      Evidence: Type is function
   ✅ T-002e: validateAnchors exported
      Evidence: Type is function
   ✅ T-002f: extractKeyTopics exported
      Evidence: Type is function
⚠️  Leaked placeholders detected in test.md: {{TITLE}}
   Context around leak: {{TITLE}}
   ✅ T-002g: validateNoLeakedPlaceholders throws on leaked placeholder
      Evidence: Threw: ❌ Leaked placeholders in test.md: {{TITLE}}
   ✅ T-002h: validateNoLeakedPlaceholders allows clean content
      Evidence: Function executed without throwing
   ✅ T-002i: validateAnchors returns empty array for valid anchors
      Evidence: No warnings
   ✅ T-002j: validateAnchors detects unclosed anchor
      Evidence: Unclosed anchor: test (missing <!-- /ANCHOR:test -->)
   ✅ T-002k: extractKeyTopics extracts topics
      Evidence: Found: oauth authentication, authentication jwt, implemented oauth

🔬 UTILS: path-utils.js
{"timestamp":"2026-03-25T09:23:34.514Z","level":"warn","message":"Path contains null bytes","inputPath":"/valid/path\u0000/injection"}
   ✅ T-003a: sanitizePath rejects null bytes (CWE-22)
      Evidence: Threw: Invalid path: contains null bytes: /valid/path /in
   ✅ T-003b: sanitizePath rejects empty path
      Evidence: Threw: Invalid path: path must be a non-empty string
   ✅ T-003c: sanitizePath rejects null
      Evidence: Threw: Invalid path: path must be a non-empty string
   ✅ T-003d: sanitizePath accepts valid cwd path
      Evidence: Function executed without throwing
{"timestamp":"2026-03-25T09:23:34.515Z","level":"warn","message":"Path outside allowed directories","inputPath":"/etc/passwd","resolved":"/private/etc/passwd","allowedBases":["/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts"]}
   ✅ T-003e: sanitizePath rejects path outside allowed directories
      Evidence: Threw: Path outside allowed directories: /etc/passwd
   ✅ T-003f: getPathBasename extracts filename
      Evidence: file.js === file.js
   ✅ T-003g: getPathBasename handles Windows paths
      Evidence: file.js === file.js
   ✅ T-003h: getPathBasename handles empty input
      Evidence:  === 

🔬 UTILS: input-normalizer.js
   ✅ T-004a: normalizeInputData passes MCP data through
      Evidence: user_prompts preserved
   ✓ Transformed manual format to MCP-compatible structure
   ✅ T-004b: normalizeInputData transforms manual format
      Evidence: SPEC_FOLDER and observations created
   ✅ T-004c: validateInputData throws on null
      Evidence: Threw: Input validation failed: data must be a non-null o
   ✅ T-004d: validateInputData accepts valid MCP data
      Evidence: Function executed without throwing
   ✅ T-004e: validateInputData throws on invalid triggerPhrases
      Evidence: Threw: Input validation failed: Missing required field: s
   ✅ T-004f: transformKeyDecision handles string
      Evidence: Type: decision
   ✅ T-004g: transformKeyDecision handles object
      Evidence: Rationale included
   ✅ T-004h: buildSessionSummaryObservation creates observation
      Evidence: Facts include triggers
   ✅ T-004i: transformOpenCodeCapture transforms capture data
      Evidence: Source marked correctly

🔬 UTILS: data-validator.js
   ✅ T-005a: validateDataStructure adds HAS_ flags
      Evidence: HAS_CODE_BLOCKS = true
   ✅ T-005b: validateDataStructure sets false for empty arrays
      Evidence: HAS_CODE_BLOCKS = false
   ✅ T-005c: ensureArrayOfObjects converts strings
      Evidence: String wrapped in object
   ✅ T-005d: ensureArrayOfObjects handles null
      Evidence: Returns empty array
   ✅ T-005e: hasArrayContent for non-empty array
      Evidence: true === true
   ✅ T-005f: hasArrayContent for empty array
      Evidence: false === false
   ✅ T-005g: ARRAY_FLAG_MAPPINGS exists
      Evidence: 9 mappings

🔬 UTILS: logger.js
   ✅ T-006a: structuredLog is a function
      Evidence: Type is function
{"timestamp":"2026-03-25T09:23:34.516Z","level":"info","message":"Test message","key":"value"}
   ✅ T-006b: structuredLog handles info level
      Evidence: Function executed without throwing
{"timestamp":"2026-03-25T09:23:34.516Z","level":"warn","message":"Test warning"}
   ✅ T-006c: structuredLog handles warn level
      Evidence: Function executed without throwing
{"timestamp":"2026-03-25T09:23:34.516Z","level":"error","message":"Test error"}
   ✅ T-006d: structuredLog handles error level
      Evidence: Function executed without throwing
{"timestamp":"2026-03-25T09:23:34.516Z","level":"info","message":"No data"}
   ✅ T-006e: structuredLog handles missing data parameter
      Evidence: Function executed without throwing

🔬 UTILS: message-utils.js
   ✅ T-007e: truncateToolOutput truncates long output
      Evidence: Truncation marker found
   ✅ T-007f: truncateToolOutput preserves short output
      Evidence: short output === short output
   ✅ T-007g: summarizeExchange creates complete summary
      Evidence: All fields present
   ✅ T-007h: extractKeyArtifacts export removed
      Evidence: Public surface matches TypeScript source

🔬 UTILS: tool-detection.js
   ✅ T-008a: detectToolCall finds explicit tool mention
      Evidence: Tool: Read with high confidence
   ✅ T-008b: detectToolCall finds function call syntax
      Evidence: Read() detected
   ✅ T-008c: detectToolCall returns null for no match
      Evidence: null returned
   ✅ T-008d: isProseContext detects prose usage
      Evidence: Prose detected
   ✅ T-008e: classifyConversationPhase detects Research
      Evidence: Research phase
   ✅ T-008f: classifyConversationPhase detects Implementation
      Evidence: Implementation phase
   ✅ T-008g: classifyConversationPhase detects Debugging
      Evidence: Debugging phase

🔬 LIB: anchor-generator.js
   ✅ T-009a: generate_anchor_id format
      Evidence: implementation-oauth-callback-handler-e11459f7
   ✅ T-009d: categorize_section detects decision
      Evidence: decision
   ✅ T-009e: validate_anchor_uniqueness handles collisions
      Evidence: test-anchor-abc12345-2
   ✅ T-009g: slugify creates valid slug
      Evidence: oauth-authentication

🔬 LIB: content-filter.js
   ✅ T-010a: is_noise_content detects "User message"
      Evidence: true === true
   ✅ T-010b: is_noise_content detects "Assistant response"
      Evidence: true === true
   ✅ T-010c: is_noise_content allows real content
      Evidence: false === false
   ✅ T-010d: create_filter_pipeline returns pipeline
      Evidence: All methods present
{"timestamp":"2026-03-25T09:23:34.519Z","level":"info","message":"contamination_audit","stage":"content-filter","patternsChecked":["/^User message$/i","/^User prompt$/i","/^Assistant message$/i","/^Assistant response$/i","/^<command-name>.*<\\/command-name>$/s","/^<local-command-stdout>.*<\\/local-command-stdout>$/s","/^<command-message>.*<\\/command-message>$/s","/^<command-args>.*<\\/command-args>$/s","/Command:\\s*\\/\\w+\\s*\\n\\s*<command-message>.*<\\/command-message>/is","/Command:\\s*\\/\\w+\\s*\\n\\s*<command-args>.*<\\/command-args>/is","/^<command-name>\\/?\\w*<\\/command-name>$/","/^<local-command-stdout>\\s*<\\/local-command-stdout>$/","/^<command-args>\\s*<\\/command-args>$/","/^<command-message>\\s*<\\/command-message>$/","/^Caveat:\\s*The messages below/i","/^Caveat:\\s*DO NOT respond/i","/^\\[Image #\\d+\\]$/","/^\\.{1,3}$/","/^[\\s\\u00A0]*$/","/^<system-reminder>/","/^UserPromptSubmit hook/i","/^Hook \\w+ (success|failed|running)/i","/^<[a-z_-]+>\\s*<\\/[a-z_-]+>$/","/^tool\\.execution_start/i","/^tool\\.execution_complete/i","/^reasoning$/i","/^<reasoning>.*<\\/reasoning>$/s"],"matchesFound":["/^User message$/i x1","/^Assistant response$/i x1"],"actionsTaken":["filtered_noise:2","filtered_empty:0","stripped_wrappers:0"],"passedThrough":["input_items:3","kept_items:1"]}
   ✅ T-010e: Pipeline filters noise prompts
      Evidence: Filtered to 1
   ✅ T-010j: NOISE_PATTERNS constant exists
      Evidence: 27 patterns

🔬 LIB: flowchart-generator.js
   ✅ T-011a: detect_workflow_pattern returns linear
      Evidence: linear === linear
   ✅ T-011b: detect_workflow_pattern returns parallel
      Evidence: parallel === parallel
   ✅ T-011c: generate_workflow_flowchart creates ASCII art
      Evidence: Contains phase name
   ✅ T-011d: generate_workflow_flowchart returns null for empty
      Evidence: null returned
   ✅ T-011e: build_phase_details creates detailed info
      Evidence: INDEX and PHASE_NAME present
   ✅ T-011f: extract_flowchart_features returns features
      Evidence: 3 features
   ✅ T-011g: get_pattern_use_cases returns array
      Evidence: 6 use cases
   ✅ T-011h: classify_diagram_pattern detects patterns
      Evidence: Linear Sequential, Low
   ✅ T-011i: PATTERNS constant exists
      Evidence: {"LINEAR":"linear","PARALLEL":"parallel"}
   ✅ T-011j: DIAGRAM_PATTERNS constant exists
      Evidence: 8 patterns
   ✅ T-011k: COMPLEXITY constant exists
      Evidence: {"LOW":"Low","MEDIUM":"Medium","HIGH":"High"}

🔬 LIB: semantic-summarizer.js
   ✅ T-012a: classify_message detects intent
      Evidence: intent === intent
   ✅ T-012b: classify_message detects implementation
      Evidence: implementation === implementation
   ✅ T-012c: classify_message detects decision
      Evidence: decision === decision
   ✅ T-012d: classify_message detects result
      Evidence: result === result
   ✅ T-012e: classify_messages organizes by type
      Evidence: 7 types
   ✅ T-012f: extract_file_changes extracts file paths
      Evidence: 1 files
   ✅ T-012g: generate_implementation_summary creates summary
      Evidence: Task: Implement OAuth
   ✅ T-012h: format_summary_as_markdown creates markdown
      Evidence: Headers present
   ✅ T-012i: MESSAGE_TYPES constant exists
      Evidence: INTENT, PLAN, IMPLEMENTATION, RESULT, DECISION, QUESTION, CONTEXT

🔬 LIB: simulation-factory.js
   ✅ T-013a: create_session_data creates valid structure
      Evidence: Key fields present
   ✅ T-013b: create_conversation_data creates messages
      Evidence: 2 messages
   ✅ T-013c: create_decision_data creates decisions
      Evidence: 1 decisions
   ✅ T-013d: create_diagram_data creates diagrams
      Evidence: 1 diagrams
   ✅ T-013f: requires_simulation detects null
      Evidence: true === true
   ✅ T-013g: requires_simulation detects simulation flag
      Evidence: true === true
   ✅ T-013h: requires_simulation allows real data
      Evidence: false === false

🔬 SPEC-FOLDER: alignment-validator.js
   ✅ T-014a: ALIGNMENT_CONFIG exists with threshold
      Evidence: Threshold: 70
   ✅ T-014b: extractConversationTopics extracts topics
      Evidence: implementing, oauth, authentication
   ✅ T-014c: extractObservationKeywords extracts keywords
      Evidence: oauth, implementation, added
   ✅ T-014d: parseSpecFolderTopic parses folder name
      Evidence: oauth, authentication
   ✅ T-014e: calculateAlignmentScore computes score
      Evidence: Score: 100
   ✅ T-014f: calculateAlignmentScore returns 0 for no match
      Evidence: Score: 0

🔬 SPEC-FOLDER: directory-setup.js
   ✅ T-015a: setupContextDirectory is a function
      Evidence: Type is function
{"timestamp":"2026-03-25T09:23:34.525Z","level":"warn","message":"Path outside allowed directories","inputPath":"/nonexistent/path/to/spec/folder","resolved":"/nonexistent/path/to/spec/folder","allowedBases":["/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs","/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/.opencode/specs"]}
{"timestamp":"2026-03-25T09:23:34.525Z","level":"error","message":"Invalid spec folder path","specFolder":"/nonexistent/path/to/spec/folder","error":"Path outside allowed directories: /nonexistent/path/to/spec/folder"}
   ✅ T-015b: setupContextDirectory rejects nonexistent paths
      Evidence: Threw appropriate error

🔬 SPEC-FOLDER: folder-detector.js
   ✅ T-016a: detectSpecFolder is a function
      Evidence: Type is function
   ✅ T-016b: filterArchiveFolders removes archive folders
      Evidence: 2 remaining
   ✅ T-016c: ALIGNMENT_CONFIG has archive patterns
      Evidence: z_, archive, old, .archived

🔬 LOADERS: data-loader.js
   ✅ T-017a: loadCollectedData is a function
      Evidence: Type is function
   ⏭️  T-017b: loadCollectedData loads JSON file (skipped: Requires mock data file)
   ⏭️  T-017c: loadCollectedData handles missing file (skipped: Requires mock environment)

🔬 RENDERERS: template-renderer.js
   ✅ T-018a: isFalsy(null)
      Evidence: true === true
   ✅ T-018b: isFalsy(undefined)
      Evidence: true === true
   ✅ T-018c: isFalsy(false)
      Evidence: true === true
   ✅ T-018d: isFalsy("false")
      Evidence: true === true
   ✅ T-018e: isFalsy([])
      Evidence: true === true
   ✅ T-018f: isFalsy("")
      Evidence: true === true
   ✅ T-018g: isFalsy("value")
      Evidence: false === false
   ✅ T-018h: isFalsy([1])
      Evidence: false === false
   ✅ T-018i: renderTemplate replaces variables
      Evidence: Hello Test, your score is 100
   ✅ T-018j: renderTemplate handles array loops
      Evidence: A,B,
   ✅ T-018k: renderTemplate handles inverted sections
      Evidence: Has content
   ✅ T-018l: cleanupExcessiveNewlines collapses newlines
      Evidence: Reduced to 2
   ✅ T-018m: stripTemplateConfigComments removes config comments
      Evidence: Comments stripped

🔬 EXTRACTORS: file-extractor.js
   ✅ T-019a: detectObservationType detects bugfix
      Evidence: bugfix
   ✅ T-019b: detectObservationType detects feature
      Evidence: feature
   ✅ T-019c: detectObservationType preserves explicit type
      Evidence: decision === decision
   ✅ T-019d: extractFilesFromData extracts from FILES
      Evidence: src/test/file.js
   ✅ T-019e: enhanceFilesWithSemanticDescriptions enhances files
      Evidence: Added OAuth handler
   ✅ T-019f: buildObservationsWithAnchors adds anchors
      Evidence: implementation-test-observation-c4061841

🔬 EXTRACTORS: conversation-extractor.js
   ✅ T-020a: extractConversations is a function
      Evidence: Type is function
   ✅ T-020b: extractConversations returns simulation for null
      Evidence: 0 messages
   ✅ T-020c: extractConversations processes real data
      Evidence: Duration: 0m

🔬 EXTRACTORS: decision-extractor.js
   ✅ T-021a: extractDecisions is a function
      Evidence: Type is function
   ✅ T-021b: extractDecisions returns simulation for null
      Evidence: 0 decisions
   Processing 1 manual decision(s)
   ✅ T-021c: extractDecisions processes manual decisions
      Evidence: Chose Option A for simplicity
   ✅ T-021d: extractDecisions calculates confidence counts
      Evidence: High: 0

🔬 EXTRACTORS: session-extractor.js
   ✅ T-022b: getChannel returns string
      Evidence: main
   ✅ T-022c: detectContextType classifies implementation
      Evidence: implementation
   ✅ T-022d: detectContextType classifies research
      Evidence: research
   ✅ T-022e: detectImportanceTier detects critical
      Evidence: critical
   ✅ T-022f: detectProjectPhase classifies phase
      Evidence: RESEARCH
   ✅ T-022g: countToolsByType counts tools
      Evidence: Read: 1, Edit: 1
   ✅ T-022h: calculateSessionDuration computes duration
      Evidence: 30m
   ✅ T-022i: extractKeyTopics extracts topics
      Evidence: oauth authentication, authentication jwt, implemented oauth

🔬 EXTRACTORS: collect-session-data.js
   ✅ T-023a: shouldAutoSave triggers at threshold
      Evidence: Threshold: 20
   ✅ T-023b: shouldAutoSave returns false below threshold
      Evidence: false returned
   ✅ T-023c: collectSessionData is a function
      Evidence: Type is function
   ⏭️  T-023d: collectSessionData returns full session data (skipped: Requires mock spec folder)

🔬 CORE: workflow.js (Additional Functions)
   ✅ T-024a: workflow keeps internal helpers private
      Evidence: runWorkflow only public entry point
   ✅ T-024b: writeFilesAtomically exported via file-writer
      Evidence: Type is function
   ✅ T-024c: indexMemory exported via memory-indexer
      Evidence: Type is function
   ✅ T-024e: notifyDatabaseUpdated remains private
      Evidence: Not exported from memory-indexer
   ✅ T-024f: memory-indexer public exports exclude notifyDatabaseUpdated
      Evidence: Private helper not exposed
⚠️  Leaked placeholders detected in test.md: {{LEAKED_PLACEHOLDER}}
   Context around leak: Content with {{LEAKED_PLACEHOLDER}}
   ✅ T-024g: writeFilesAtomically rejects leaked placeholders
      Evidence: Threw expected error
   ✅ T-024h: indexMemory is async function
      Evidence: AsyncFunction confirmed

🔬 EXTRACTORS: opencode-capture.js (REMOVED — recovery mode deprecated)
   ⏭️  T-025: OpenCode capture module (skipped: Module removed — recovery mode fully deprecated)

🔬 EXTRACTORS: implementation-guide-extractor.js
   ✅ T-026a: hasImplementationWork returns false for empty data
      Evidence: false === false
   ✅ T-026b: hasImplementationWork returns true for implementation observations
      Evidence: true === true
   ✅ T-026c: extractMainTopic extracts from spec folder
      Evidence: oauth-authentication
   ✅ T-026d: extractMainTopic extracts from observations
      Evidence: user-profile-system
   ✅ T-026e: extractMainTopic returns fallback
      Evidence: implementation === implementation
   ✅ T-026f: extractWhatBuilt extracts implementations
      Evidence: 2 items
   ✅ T-026g: extractWhatBuilt returns empty for non-impl obs
      Evidence: 0 === 0
   ✅ T-026h: extractKeyFilesWithRoles assigns roles
      Evidence: All 4 have roles
   ✅ T-026i: extractKeyFilesWithRoles detects test file
      Evidence: Test file
   ✅ T-026j: generateExtensionGuide returns guide items
      Evidence: 2 guides
   ✅ T-026k: generateExtensionGuide detects API pattern
      Evidence: API guide present
   ✅ T-026l: extractCodePatterns returns array
      Evidence: 0 patterns
   ⏭️  T-026m: extractCodePatterns detects validation pattern (skipped: Pattern detection varies)
   ✅ T-026n: buildImplementationGuideData returns complete structure
      Evidence: All fields present
   ✅ T-026o: buildImplementationGuideData returns false for no impl
      Evidence: false === false

🔬 EXTRACTORS: session-extractor.js (Additional Functions)
   ✅ T-027a: extractActiveFile exported
      Evidence: Type is function
   ✅ T-027b: extractNextAction exported
      Evidence: Type is function
   ✅ T-027c: extractBlockers exported
      Evidence: Type is function
   ✅ T-027d: buildFileProgress exported
      Evidence: Type is function
   ✅ T-027e: calculateExpiryEpoch exported
      Evidence: Type is function
   ✅ T-027f: detectRelatedDocs exported
      Evidence: Type is function
   ✅ T-027g: detectSessionCharacteristics exported
      Evidence: Type is function
   ✅ T-027h: buildProjectStateSnapshot exported
      Evidence: Type is function
   ✅ T-027i: extractActiveFile finds file from observations
      Evidence: /src/user.js === /src/user.js
   ✅ T-027j: extractActiveFile falls back to files array
      Evidence: /backup.js === /backup.js
   ✅ T-027k: extractActiveFile returns N/A when no files
      Evidence: N/A === N/A
   ✅ T-027l: extractNextAction extracts from facts
      Evidence: implement validation
   ✅ T-027m: extractNextAction returns default
      Evidence: Continue implementation === Continue implementation
   ✅ T-027n: extractBlockers finds blockers
      Evidence: Blocked by missing API credentials.
   ✅ T-027o: extractBlockers returns None when no blockers
      Evidence: None === None
   ✅ T-027p: buildFileProgress returns array
      Evidence: 2 files
   ✅ T-027q: buildFileProgress returns empty for null
      Evidence: Empty array
   ✅ T-027r: calculateExpiryEpoch returns 0 for critical
      Evidence: 0 === 0
   ✅ T-027s: calculateExpiryEpoch returns 0 for constitutional
      Evidence: 0 === 0
   ✅ T-027t: calculateExpiryEpoch returns 7 days for temporary
      Evidence: 7 days added
   ✅ T-027u: calculateExpiryEpoch returns 90 days default
      Evidence: 90 days added
   ✅ T-027v: detectRelatedDocs returns array
      Evidence: 0 docs found
   ✅ T-027w: detectSessionCharacteristics returns complete object
      Evidence: implementation
   ✅ T-027x: buildProjectStateSnapshot returns complete object
      Evidence: IMPLEMENTATION

🔬 LIB: simulation-factory.js (additional functions)
   ✅ T-029a: create_simulation_phases returns array
      Evidence: 4 phases
   ✅ T-029b: create_simulation_phases has required structure
      Evidence: Phase: Research
   ✅ T-029c: create_simulation_phases includes standard phases
      Evidence: Research, Planning, Implementation, Verification
   ✅ T-029d: create_simulation_flowchart returns string
      Evidence: 133 chars
   ✅ T-029e: create_simulation_flowchart contains ASCII art
      Evidence: Box chars found
   ✅ T-029f: create_simulation_flowchart accepts custom request
      Evidence: Custom text found

🔬 LIB: anchor-generator.js (additional functions)
   ✅ T-030a: extract_spec_number extracts 042
      Evidence: 042 === 042
   ✅ T-030b: extract_spec_number extracts 123
      Evidence: 123 === 123
   ✅ T-030c: extract_spec_number returns 000 for no match
      Evidence: 000 === 000
   ✅ T-030d: extract_spec_number returns 000 for short prefix
      Evidence: 000 === 000
   ✅ T-030e: extract_spec_number preserves leading zeros
      Evidence: 001 === 001

🔬 LIB: semantic-summarizer.js (additional function)
   ✅ T-031a: extract_decisions is a function
      Evidence: Type is function
   ✅ T-031b: extract_decisions finds explicit choice
      Evidence: Found 1 decision(s)
   ✅ T-031c: extract_decisions captures question context
      Evidence: Which option do you prefer?
   ✅ T-031d: extract_decisions handles option letter format
      Evidence: Choice: A
   ✅ T-031e: extract_decisions returns empty for no decisions
      Evidence: Empty array
   ✅ T-031f: extract_decisions handles empty input
      Evidence: Empty array
   ✅ T-031g: extract_decisions handles "chose" pattern
      Evidence: Found decision
   ✅ T-031h: extract_decisions handles "user chose" pattern
      Evidence: Found decision

🔬 LIB: retry-manager.js (boundary verification)
   ✅ T-032a: scripts retry-manager module removed
      Evidence: No stale scripts/lib retry-manager output
   ✅ T-032b: retry-manager lives under MCP provider layer
      Evidence: Canonical module present
   ✅ T-032c: canonical retry-manager exports getRetryStats
      Evidence: Function available
   ✅ T-032d: canonical retry-manager exports processRetryQueue
      Evidence: Function available
INFO  [VectorIndex] Created idx_file_path index
INFO  [VectorIndex] Created idx_content_hash index
INFO  [VectorIndex] Created idx_last_accessed index
INFO  [VectorIndex] Created idx_importance_tier index
INFO  [VectorIndex] Created idx_history_timestamp index
   ✅ T-032e: getRetryStats returns stats object
      Evidence: Keys: pending, retry, failed, success, total, queue_size
   ✅ T-032f: MAX_RETRIES constant exported
      Evidence: Value: 3
   ✅ T-032g: BACKOFF_DELAYS constant exported
      Evidence: 3 delays
   ⏭️  T-032h: Core retry functions not re-exported from mcp_server (skipped: Deferred: mcp_server module not compiled)

🔬 UTILS: prompt-utils.js
   ✅ T-033b: promptUser is a function
      Evidence: Type is function
   ✅ T-033c: promptUserChoice is a function
      Evidence: Type is function
[generate-context] Non-interactive mode: using default value
   ✅ T-033d: promptUser returns a Promise
      Evidence: Promise returned
[generate-context] Non-interactive mode: using default value
   ✅ T-033e: promptUser returns default in non-interactive mode
      Evidence: Got: defaultValue
[generate-context] Non-interactive mode: using default choice 1
   ✅ T-033f: promptUserChoice returns 1 in non-interactive mode
      Evidence: Got: 1

🔬 UTILS: file-helpers.js
   ✅ T-034a: toRelativePath converts absolute to relative
      Evidence: src/file.js
   ✅ T-034b: toRelativePath handles empty input
      Evidence:  === 
   ✅ T-034c: toRelativePath handles null
      Evidence:  === 
   ✅ T-034d: toRelativePath handles long paths
      Evidence: /root/very/long/path/with/many/segments/to/file.js
   ✅ T-034e: isDescriptionValid rejects short descriptions
      Evidence: false === false
   ✅ T-034f: isDescriptionValid rejects garbage patterns
      Evidence: false === false
   ✅ T-034g: isDescriptionValid rejects heading patterns
      Evidence: false === false
   ✅ T-034h: isDescriptionValid rejects placeholder
      Evidence: false === false
   ✅ T-034i: isDescriptionValid accepts valid descriptions
      Evidence: true === true
   ✅ T-034i2: validateDescription rejects generic recent-commit stub
      Evidence: placeholder === placeholder
   ✅ T-034i3: validateDescription classifies low-context activity descriptions
      Evidence: activity-only === activity-only
   ✅ T-034i4: validateDescription accepts semantic descriptions
      Evidence: semantic === semantic
   ✅ T-034j: cleanDescription removes markdown
      Evidence: Heading with bold and code
   ✅ T-034k: cleanDescription truncates long descriptions
      Evidence: Length: 56
   ✅ T-034l: cleanDescription capitalizes first letter
      Evidence: L

🔬 UTILS: validation-utils.js
⚠️  Leaked placeholders detected in test.md: {{TITLE}}
   Context around leak: Content with {{TITLE}} placeholder
   ✅ T-035a: validateNoLeakedPlaceholders throws on leaked placeholder
      Evidence: Threw: ❌ Leaked placeholders in test.md: {{TITLE}}
   ✅ T-035b: validateNoLeakedPlaceholders allows clean content
      Evidence: Function executed without throwing
⚠️  Leaked placeholders detected in test.md: {{FOO}}, {{BAR}}
   Context around leak: Has {{FOO}} and {{BAR}}
   ✅ T-035c: validateNoLeakedPlaceholders detects multiple placeholders
      Evidence: Threw: ❌ Leaked placeholders in test.md: {{FOO}}, {{BAR}}
   ✅ T-035d: validateAnchors returns empty array for valid anchors
      Evidence: No warnings
   ✅ T-035e: validateAnchors detects unclosed anchors
      Evidence: Unclosed anchor: unclosed (missing <!-- /ANCHOR:unclosed -->)
   ✅ T-035f: validateAnchors detects orphaned closing anchors
      Evidence: Orphaned closing anchor: orphan (no matching opening tag)
   ✅ T-035g: validateAnchors handles multiple valid anchors
      Evidence: No warnings

🔬 UTILS: phase-classifier.ts
   ✅ T-008h: phase-classifier compatibility wrapper prefers Debugging for grep+error
      Evidence: Debugging
   ✅ T-008i: phase-classifier preserves non-contiguous phase returns
      Evidence: Research -> Implementation -> Research
   ✅ T-008j: phase-classifier derives Iterative Loop flow pattern
      Evidence: Iterative Loop

🔬 LIB: ascii-boxes.js
   ✅ T-036a: BOX constant exists with box characters
      Evidence: 19 characters
   ✅ T-036b: pad_text pads text to width
      Evidence: "test      "
   ✅ T-036c: pad_text truncates long text
      Evidence: "very "
   ✅ T-036d: pad_text centers text
      Evidence: "    Hi    "
   ✅ T-036e: format_decision_header creates header
      Evidence: Has box characters and DECISION
   ✅ T-036f: format_option_box creates option box
      Evidence: Has box and label
   ✅ T-036g: format_chosen_box creates chosen box
      Evidence: Has CHOSEN and selection
   ✅ T-036h: format_caveats_box creates caveats box
      Evidence: Has Caveats content
   ✅ T-036i: format_caveats_box returns empty for null
      Evidence: Empty string returned
   ✅ T-036j: format_follow_up_box creates follow-up box
      Evidence: Has Follow-up content
   ✅ T-036k: format_follow_up_box returns empty for empty array
      Evidence: Empty string returned

🔬 LIB: trigger-extractor.js (re-export verification)
   ✅ T-037a: extractTriggerPhrases is exported
      Evidence: Type is function
   ✅ T-037b: extract_trigger_phrases is exported
      Evidence: Type is function
   ✅ T-037c: extractTriggerPhrases extracts phrases
      Evidence: Found: authentication bug, implemented oauth, oauth authentication
   ✅ T-037d: extractTriggerPhrases returns empty for null
      Evidence: Empty array returned
   ✅ T-037e: extractTriggerPhrases returns empty for short text
      Evidence: Empty array returned
   ✅ T-037f: CONFIG is exported
      Evidence: {"MIN_PHRASE_COUNT":8,"MAX_PHRASE_COUNT":25,"MIN_W
   ✅ T-037g: STOP_WORDS_ENGLISH is exported
      Evidence: 119 words

🔬 LIB: embeddings.js (re-export verification)
   ✅ T-038a: generateEmbedding is exported
      Evidence: Type is function
   ✅ T-038b: generate_embedding is exported
      Evidence: Type is function
   ✅ T-038c: EMBEDDING_DIM constant is exported
      Evidence: Dimension: 768
   ✅ T-038d: MODEL_NAME constant is exported
      Evidence: voyage-4
   ✅ T-038e: get_embedding_dimension is exported
      Evidence: Type is function
   ✅ T-038f: get_model_name is exported
      Evidence: Type is function
   ✅ T-038g: TASK_PREFIX constant is exported
      Evidence: DOCUMENT, QUERY, CLUSTERING, CLASSIFICATION
[embeddings] Empty or invalid text provided
   ✅ T-038h: generateEmbedding returns null for empty input
      Evidence: null returned
   ⏭️  T-038i: generateEmbedding produces valid embeddings (skipped: Requires model loading)

🔬 SPEC-FOLDER: alignment-validator.js (extended)
   ✅ T-039a: validateContentAlignment is a function
      Evidence: Type is function
   ✅ T-039b: validateFolderAlignment is a function
      Evidence: Type is function
   ✅ T-039c: extractConversationTopics extracts OAuth topics
      Evidence: implementing, oauth, authentication, handler, created
   ✅ T-039d: extractObservationKeywords extracts keywords
      Evidence: authentication, implementation, added, jwt, token
   ✅ T-039e: calculateAlignmentScore returns high score for match
      Evidence: Score: 100
   ✅ T-039f: calculateAlignmentScore returns low score for non-match
      Evidence: Score: 0
   ✅ T-039g: parseSpecFolderTopic parses nested names
      Evidence: memory, and, spec, kit
   ✅ T-039h: ALIGNMENT_CONFIG has STOPWORDS
      Evidence: 11 words

🔬 EXTRACTORS: diagram-extractor.js
   ✅ T-040a: extractPhasesFromData is a function
      Evidence: Type is function
   ✅ T-040b: extractPhasesFromData returns array for null
      Evidence: Length: 4
   Session too short for meaningful phase detection
   ✅ T-040c: extractPhasesFromData returns empty for short sessions
      Evidence: Empty array
   ✅ T-040d: extractPhasesFromData extracts phases
      Evidence: Found 2 phases
   ✅ T-040e: extractDiagrams is a function
      Evidence: Type is function
   ✅ T-040f: extractDiagrams returns simulation for null
      Evidence: Count: 0
   Session too short for meaningful phase detection
   ✅ T-040g: extractDiagrams processes real data
      Evidence: Diagrams: 0
   ✅ T-040h: extractDiagrams includes AUTO_CONVERSATION_FLOWCHART
      Evidence: Field present

🔬 LIB: decision-tree-generator.js
   ✅ T-041a: generateDecisionTree is a function
      Evidence: Type is function
   ✅ T-041b: generateDecisionTree handles legacy format
      Evidence: Has title and box chars
   ✅ T-041c: generateDecisionTree handles object format
      Evidence: Has title and DECISION
   ✅ T-041d: generateDecisionTree handles empty options
      Evidence: Shows no options message
   ✅ T-041e: generateDecisionTree includes caveats
      Evidence: Caveats present
   ✅ T-041f: generateDecisionTree includes follow-up
      Evidence: Follow-up present

🔬 MEMORY: generate-context.js
   ✅ T-042a: parseArguments is a function
      Evidence: Type is function
   ✅ T-042b: validateArguments is a function
      Evidence: Type is function
   ✅ T-042c: isValidSpecFolder is a function
      Evidence: Type is function
   ✅ T-042d: SPEC_FOLDER_PATTERN is a RegExp
      Evidence: /^\d{3}-[a-z][a-z0-9-]*$/
   ✅ T-042e: SPEC_FOLDER_PATTERN matches valid folder names
      Evidence: 001-feature, 042-oauth-auth, 999-test
   ✅ T-042f: SPEC_FOLDER_PATTERN rejects invalid folder names
      Evidence: 1-short, 0001-too-long, 001_underscore, 001-UPPERCASE
   ✅ T-042g: isValidSpecFolder accepts valid folder
      Evidence: valid: true
   ✅ T-042h: isValidSpecFolder rejects invalid folder
      Evidence: Invalid spec folder format. Expected: NNN-feature-name
[utils] Path traversal blocked: /tmp/042-feature -> /private/tmp/042-feature
   ✅ T-042i: isValidSpecFolder rejects non-specs path
      Evidence: Spec folder must be under specs/ or .opencode/specs/: /tmp/042-feature
   ✅ T-042j: SPEC_FOLDER_BASIC_PATTERN exists
      Evidence: /^\d{3}-[a-zA-Z]/

🔬 MEMORY: rank-memories.js
   ✅ T-043a: format_relative_time is a function
      Evidence: Type is function
   ✅ T-043b: format_relative_time handles recent time
      Evidence: just now
   ✅ T-043c: format_relative_time handles old time
      Evidence: 1mo ago
   ✅ T-043d: format_relative_time handles invalid input
      Evidence: unknown
   ✅ T-043e: compute_folder_score is a function
      Evidence: Type is function
   ✅ T-043f: compute_folder_score returns valid score
      Evidence: Score: 0.64
   ✅ T-043g: process_memories is a function
      Evidence: Type is function
   ✅ T-043h: process_memories handles empty input
      Evidence: Returns valid structure
   ✅ T-043i: process_memories returns all sections
      Evidence: All sections present
   ✅ T-043j: is_archived detects z_archive/ pattern
      Evidence: Detected
   ✅ T-043k: is_archived allows active folders
      Evidence: Not archived
   ✅ T-043l: simplify_folder_path simplifies paths
      Evidence: subfolder
   ✅ T-043m: TIER_WEIGHTS is defined
      Evidence: constitutional, critical, important, normal, temporary, deprecated
   ✅ T-043n: DECAY_RATE is defined
      Evidence: Rate: 0.1

=============================================
📊 TEST SUMMARY
=============================================
✅ Passed:  317
❌ Failed:  0
⏭️  Skipped: 7
📝 Total:   324

🎉 ALL TESTS PASSED!

============================================================
  EXTRACTORS AND LOADERS TEST SUITE
============================================================


=== COLLECT-SESSION-DATA.JS (P0) ===
   [PASS] EXT-CSData-001: collectSessionData exported
      Evidence: Type is function
   [PASS] EXT-CSData-002: shouldAutoSave exported
      Evidence: Type is function
   [PASS] EXT-CSData-003: extractPreflightPostflightData exported
      Evidence: Type is function
   [PASS] EXT-CSData-004: calculateLearningIndex exported
      Evidence: Type is function
   [PASS] EXT-CSData-005: getScoreAssessment exported
      Evidence: Type is function
   [PASS] EXT-CSData-006: getTrendIndicator exported
      Evidence: Type is function
   [PASS] EXT-CSData-007: generateLearningSummary exported
      Evidence: Type is function
   [PASS] EXT-CSData-008: null score returns empty assessment
      Evidence:  === 
   [PASS] EXT-CSData-009: undefined score returns empty assessment
      Evidence:  === 
   [PASS] EXT-CSData-010: High score (90) is Strong
      Evidence: Strong === Strong
   [PASS] EXT-CSData-011: Score 70 is Good
      Evidence: Good === Good
   [PASS] EXT-CSData-012: Score 50 is Moderate
      Evidence: Moderate === Moderate
   [PASS] EXT-CSData-013: Score 25 is Limited
      Evidence: Limited === Limited
   [PASS] EXT-CSData-014: Score 10 is Minimal
      Evidence: Minimal === Minimal
   [PASS] EXT-CSData-015: Low uncertainty score
      Evidence: Very low uncertainty === Very low uncertainty
   [PASS] EXT-CSData-016: Medium-low uncertainty
      Evidence: Low uncertainty === Low uncertainty
   [PASS] EXT-CSData-017: Moderate uncertainty
      Evidence: Moderate uncertainty === Moderate uncertainty
   [PASS] EXT-CSData-018: High uncertainty
      Evidence: High uncertainty === High uncertainty
   [PASS] EXT-CSData-019: Very high uncertainty
      Evidence: Very high uncertainty === Very high uncertainty
   [PASS] EXT-CSData-020: Positive delta shows up arrow
      Evidence: ↑ === ↑
   [PASS] EXT-CSData-021: Negative delta shows down arrow
      Evidence: ↓ === ↓
   [PASS] EXT-CSData-022: Zero delta shows right arrow
      Evidence: → === →
   [PASS] EXT-CSData-023: Null delta shows right arrow
      Evidence: → === →
   [PASS] EXT-CSData-024: Positive reduction shows down (good)
      Evidence: ↓ === ↓
   [PASS] EXT-CSData-025: Negative reduction shows up (bad)
      Evidence: ↑ === ↑
   [PASS] EXT-CSData-026: Learning index calculation
      Evidence: 42 in range [40, 42]
   [PASS] EXT-CSData-027: Zero deltas = zero index
      Evidence: 0 === 0
   [PASS] EXT-CSData-028: Null deltas handled as zero
      Evidence: 0 === 0
   [PASS] EXT-CSData-029: Index capped at 100
      Evidence: 100 === 100
   [PASS] EXT-CSData-030: Preflight knowledge score extracted
   [PASS] EXT-CSData-031: Preflight knowledge score correct
      Evidence: 40 === 40
   [PASS] EXT-CSData-032: Postflight knowledge score correct
      Evidence: 75 === 75
   [PASS] EXT-CSData-033: Delta has correct format
      Evidence: Matches pattern
   [PASS] EXT-CSData-034: Learning index calculated
   [PASS] EXT-CSData-035: Gaps closed is array
      Evidence: Array with 2 items
   [PASS] EXT-CSData-036: New gaps is array
      Evidence: Array with 1 items
   [PASS] EXT-CSData-037: Missing data returns null
      Evidence: null === null
   [PASS] EXT-CSData-038: Learning summary provided even with no data
      Evidence: true === true
   [PASS] EXT-CSData-039: Learning summary contains relevant keywords
      Evidence: Significant knowledge gain (+25 points). Major unc
   [PASS] EXT-CSData-040: Low learning index generates message
      Evidence: Slight knowledge increase (+2 points).
   [PASS] EXT-CSData-041: Zero messages no auto-save
      Evidence: false === false
   [PASS] EXT-CSData-042: Object facts contribute to pending task extraction
      Evidence: Pending task preserved from object fact
   [PASS] EXT-CSData-043: Observation truncation logs counts without content
      Evidence: 200 -> 15

=== SESSION-EXTRACTOR.JS (P1) ===
   [PASS] EXT-Session-001: generateSessionId exported
      Evidence: Type is function
   [PASS] EXT-Session-002: getChannel exported
      Evidence: Type is function
   [PASS] EXT-Session-003: detectContextType exported
      Evidence: Type is function
   [PASS] EXT-Session-004: detectImportanceTier exported
      Evidence: Type is function
   [PASS] EXT-Session-005: detectProjectPhase exported
      Evidence: Type is function
   [PASS] EXT-Session-006: extractActiveFile exported
      Evidence: Type is function
   [PASS] EXT-Session-007: extractNextAction exported
      Evidence: Type is function
   [PASS] EXT-Session-008: extractBlockers exported
      Evidence: Type is function
   [PASS] EXT-Session-009: buildFileProgress exported
      Evidence: Type is function
   [PASS] EXT-Session-010: countToolsByType exported
      Evidence: Type is function
   [PASS] EXT-Session-011: calculateSessionDuration exported
      Evidence: Type is function
   [PASS] EXT-Session-012: calculateExpiryEpoch exported
      Evidence: Type is function
   [PASS] EXT-Session-013: extractKeyTopics exported
      Evidence: Type is function
   [PASS] EXT-Session-014: detectSessionCharacteristics exported
      Evidence: Type is function
   [PASS] EXT-Session-015: buildProjectStateSnapshot exported
      Evidence: Type is function
   [PASS] EXT-Session-016: Session ID format correct
      Evidence: Matches pattern
   [PASS] EXT-Session-017: Session IDs are unique
      Evidence: session-1774430614689-a47572ed9cd8 !== session-1774430614689-c76cf4459100
   [PASS] EXT-Session-018: getChannel returns string
      Evidence: Type is string
   [PASS] EXT-Session-019: Channel is non-empty
      Evidence: main
   [PASS] EXT-Session-020: Empty tools = general
      Evidence: general === general
   [PASS] EXT-Session-021: Read-heavy = research
      Evidence: research === research
   [PASS] EXT-Session-022: Write-heavy = implementation
      Evidence: implementation === implementation
   [PASS] EXT-Session-023: With decisions = decision
      Evidence: decision === decision
   [PASS] EXT-Session-024: Web-heavy = discovery
      Evidence: discovery === discovery
   [PASS] EXT-Session-025: Core path = critical
      Evidence: critical === critical
   [PASS] EXT-Session-026: Security path = critical
      Evidence: critical === critical
   [PASS] EXT-Session-027: Decision context = important
      Evidence: important === important
   [PASS] EXT-Session-028: Normal path/context = normal
      Evidence: normal === normal
   [PASS] EXT-Session-029: Empty + few messages = RESEARCH
      Evidence: RESEARCH === RESEARCH
   [PASS] EXT-Session-030: Write-heavy = IMPLEMENTATION
      Evidence: IMPLEMENTATION === IMPLEMENTATION
   [PASS] EXT-Session-031: Decisions + read-heavy = PLANNING
      Evidence: PLANNING === PLANNING
   [PASS] EXT-Session-032: extractActiveFile returns string
      Evidence: src/components/EventList.jsx
   [PASS] EXT-Session-033: extractNextAction returns string
      Evidence: Type is string
   [PASS] EXT-Session-034: extractBlockers detects blocker keywords
      Evidence: We are blocked by the API rate limit issue.
   [PASS] EXT-Session-035: No blockers returns None
      Evidence: None === None
   [PASS] EXT-Session-036: buildFileProgress returns array
      Evidence: Array with 2 items
   [PASS] EXT-Session-037: File status is EXISTS
      Evidence: EXISTS === EXISTS
   [PASS] EXT-Session-038: countToolsByType returns object
      Evidence: Type is object
   [PASS] EXT-Session-039: Read count exists
   [PASS] EXT-Session-040: Edit count exists
   [PASS] EXT-Session-041: Duration format correct
      Evidence: 1m
   [PASS] EXT-Session-042: Empty prompts = N/A
      Evidence: N/A === N/A
   [PASS] EXT-Session-043: Constitutional never expires
      Evidence: 0 === 0
   [PASS] EXT-Session-044: Critical never expires
      Evidence: 0 === 0
   [PASS] EXT-Session-045: Temporary expires in 7 days
      Evidence: 1775035414 === 1775035414
   [PASS] EXT-Session-046: Normal expires in 90 days
      Evidence: 1782206614 === 1782206614
   [PASS] EXT-Session-047: extractKeyTopics returns array
      Evidence: Array with 4 items
   [PASS] EXT-Session-048: Relevant topics extracted
      Evidence: oauth authentication, authentication jwt, implemented oauth
   [PASS] EXT-Session-049: Stopwords filtered
      Evidence: 'the' filtered, remaining: jumps lazy, quick fox, fox jumps
   [PASS] EXT-Session-050: contextType exists
   [PASS] EXT-Session-051: importanceTier exists
   [PASS] EXT-Session-052: decisionCount is number
      Evidence: Type is number
   [PASS] EXT-Session-053: toolCounts is object
      Evidence: Type is object
   [PASS] EXT-Session-054: Snapshot has projectPhase
   [PASS] EXT-Session-055: Snapshot has activeFile
   [PASS] EXT-Session-056: Snapshot has lastAction
   [PASS] EXT-Session-057: Snapshot has nextAction
   [PASS] EXT-Session-058: Snapshot has blockers
   [PASS] EXT-Session-059: Snapshot has fileProgress array
      Evidence: Array with 0 items

=== DECISION-EXTRACTOR.JS (P1) ===
   [PASS] EXT-Decision-001: extractDecisions exported
      Evidence: Type is function
   [PASS] EXT-Decision-002: Simulation returns DECISIONS
   [PASS] EXT-Decision-003: DECISION_COUNT is number
      Evidence: Type is number
   [PASS] EXT-Decision-004: DECISIONS is array
      Evidence: Array with 1 items
   [PASS] EXT-Decision-005: Correct decision count
      Evidence: 1 === 1
   [PASS] EXT-Decision-006: Decision has TITLE
   [PASS] EXT-Decision-007: Decision has CONTEXT
   [PASS] EXT-Decision-008: Decision has OPTIONS array
      Evidence: Array with 2 items
   [PASS] EXT-Decision-009: Decision has CHOSEN
   [PASS] EXT-Decision-010: Decision has RATIONALE
   [PASS] EXT-Decision-010a: CHOICE_CONFIDENCE is number
      Evidence: Type is number
   [PASS] EXT-Decision-010b: RATIONALE_CONFIDENCE is number
      Evidence: Type is number
   [PASS] EXT-Decision-011: CONFIDENCE is number
      Evidence: Type is number
   [PASS] EXT-Decision-012: Decision has ANCHOR_ID
   [PASS] EXT-Decision-013: Decision has IMPORTANCE
   [PASS] EXT-Decision-013a: CHOICE_CONFIDENCE normalized
      Evidence: 0.85 in range [0, 1]
   [PASS] EXT-Decision-013b: RATIONALE_CONFIDENCE normalized
      Evidence: 0.85 in range [0, 1]
   [PASS] EXT-Decision-014: HAS_PROS is boolean
      Evidence: Type is boolean
   [PASS] EXT-Decision-015: HAS_CONS is boolean
      Evidence: Type is boolean
   [PASS] EXT-Decision-016: PROS is array
      Evidence: Array with 1 items
   [PASS] EXT-Decision-017: CONS is array
      Evidence: Array with 1 items
   [PASS] EXT-Decision-018: HIGH_CONFIDENCE_COUNT is number
      Evidence: Type is number
   [PASS] EXT-Decision-019: MEDIUM_CONFIDENCE_COUNT is number
      Evidence: Type is number
   [PASS] EXT-Decision-020: LOW_CONFIDENCE_COUNT is number
      Evidence: Type is number
   [PASS] EXT-Decision-021: FOLLOWUP_COUNT is number
      Evidence: Type is number
   Processing 3 manual decision(s)
   [PASS] EXT-Decision-022: Manual decisions count correct
      Evidence: 3 === 3
   [PASS] EXT-Decision-023: Manual decision has TITLE
   [PASS] EXT-Decision-024: Manual decision has ANCHOR_ID
   [PASS] EXT-Decision-025: Importance is valid tier
      Evidence: medium
   [PASS] EXT-Decision-026: Empty observations = 0 decisions
      Evidence: 0 === 0
   [PASS] EXT-Decision-027: _manualDecision enriches chosen approach and confidence
      Evidence: Batched repair path @ 0.82
   [PASS] EXT-Decision-028: split confidence derives legacy confidence conservatively
      Evidence: 0.95/0.7
   Processing 1 manual decision(s)
   [PASS] EXT-Decision-029: _manualDecision observation is suppressed when authoritative manual decision exists
      Evidence: 1 === 1

=== FILE-EXTRACTOR.JS (P1) ===
   [PASS] EXT-File-001: detectObservationType exported
      Evidence: Type is function
   [PASS] EXT-File-002: extractFilesFromData exported
      Evidence: Type is function
   [PASS] EXT-File-003: enhanceFilesWithSemanticDescriptions exported
      Evidence: Type is function
   [PASS] EXT-File-004: buildObservationsWithAnchors exported
      Evidence: Type is function
   [PASS] EXT-File-005: Explicit type preserved
      Evidence: feature === feature
   [PASS] EXT-File-006: Bug keywords = bugfix
      Evidence: bugfix === bugfix
   [PASS] EXT-File-007: Implement keywords = feature
      Evidence: feature === feature
   [PASS] EXT-File-008: Refactor keywords = refactor
      Evidence: refactor === refactor
   [PASS] EXT-File-009: Decision keywords = decision
      Evidence: decision === decision
   [PASS] EXT-File-010: Research keywords = research
      Evidence: research === research
   [PASS] EXT-File-011: Discovery keywords = discovery
      Evidence: discovery === discovery
   [PASS] EXT-File-012: Test keywords = test
      Evidence: test === test
   [PASS] EXT-File-012b: Documentation keywords = documentation
      Evidence: documentation === documentation
   [PASS] EXT-File-012c: Performance keywords = performance
      Evidence: performance === performance
   [PASS] EXT-File-012d: No keywords = observation
      Evidence: observation === observation
   [PASS] EXT-File-013: extractFilesFromData returns array
      Evidence: Array with 5 items
   [PASS] EXT-File-014: File has FILE_PATH
   [PASS] EXT-File-015: File has DESCRIPTION
   [PASS] EXT-File-016: Duplicate files deduplicated
      Evidence: 1 === 1
   [PASS] EXT-File-016b: Normalized path-equivalent files deduplicated
      Evidence: 1 === 1
   [PASS] EXT-File-016c: Normalized path-equivalent files preserve canonical FILE_PATH
      Evidence: scripts/utils/input-normalizer.ts === scripts/utils/input-normalizer.ts
   [PASS] EXT-File-017: Legacy format supported
      Evidence: src/legacy.js
   [PASS] EXT-File-018: buildObservationsWithAnchors returns array
      Evidence: Array with 4 items
   [PASS] EXT-File-019: Observation has TYPE
   [PASS] EXT-File-020: Observation has TITLE
   [PASS] EXT-File-021: Observation has NARRATIVE
   [PASS] EXT-File-022: Observation has ANCHOR_ID
   [PASS] EXT-File-023: HAS_FILES is boolean
      Evidence: Type is boolean
   [PASS] EXT-File-024: HAS_FACTS is boolean
      Evidence: Type is boolean
   [PASS] EXT-File-025: All anchor IDs unique
      Evidence: 1 === 1
   [PASS] EXT-File-026: Caller-side null filtering preserves valid observations
      Evidence: 2 === 2
   [PASS] EXT-File-027: Semantic description applied
      Evidence: Authentication module
   [PASS] EXT-File-028: Object facts are rendered instead of dropped
      Evidence: Tool: Read File: src/object-facts.ts Result: Preserved object facts | [object] {"files":["src/object-facts.ts"],"detail":"Object-shaped fact without a text field"}

=== CONVERSATION-EXTRACTOR.JS (P1) ===
   [PASS] EXT-Conv-001: extractConversations exported
      Evidence: Type is function
   [PASS] EXT-Conv-002: Simulation returns MESSAGES
   [PASS] EXT-Conv-003: MESSAGE_COUNT is number
      Evidence: Type is number
   [PASS] EXT-Conv-004: MESSAGES is array
      Evidence: Array with 5 items
   [PASS] EXT-Conv-005: MESSAGE_COUNT is number
      Evidence: Type is number
   [PASS] EXT-Conv-006: DURATION exists
   [PASS] EXT-Conv-007: FLOW_PATTERN exists
   [PASS] EXT-Conv-008: PHASE_COUNT is number
      Evidence: Type is number
   [PASS] EXT-Conv-009: PHASES is array
      Evidence: Array with 4 items
   [PASS] EXT-Conv-010: TOOL_COUNT is number
      Evidence: Type is number
   [PASS] EXT-Conv-011: Message has TIMESTAMP
   [PASS] EXT-Conv-012: Message has ROLE
   [PASS] EXT-Conv-013: Message has CONTENT
   [PASS] EXT-Conv-014: Message has TOOL_CALLS array
      Evidence: Array with 0 items
   [PASS] EXT-Conv-015: Valid FLOW_PATTERN
      Evidence: Branching Investigation
   [PASS] EXT-Conv-016: AUTO_GENERATED_FLOW exists
   Warning: No conversation data found
   Warning: Generated output may be minimal or empty
   Warning: No user prompts found (empty conversation)
   Warning: No observations found (no events documented)
   [PASS] EXT-Conv-017: Empty data returns MESSAGES array
      Evidence: Array with 0 items
   [PASS] EXT-Conv-018: Empty data MESSAGE_COUNT is 0
      Evidence: 0 === 0
   [PASS] EXT-Conv-019: DATE in ISO format
      Evidence: Matches pattern
   [PASS] EXT-Conv-020: Object facts still drive conversation tool-call detection
      Evidence: Read
   [PASS] EXT-Conv-021: UNIQUE_PHASE_COUNT is number
      Evidence: Type is number
   [PASS] EXT-Conv-022: TOPIC_CLUSTERS is array
      Evidence: Array with 4 items
   [PASS] EXT-Conv-023: Non-contiguous phases remain separate segments
      Evidence: Research -> Implementation -> Research

=== IMPLEMENTATION-GUIDE-EXTRACTOR.JS (P1) ===
   [PASS] EXT-Impl-001: hasImplementationWork exported
      Evidence: Type is function
   [PASS] EXT-Impl-002: extractMainTopic exported
      Evidence: Type is function
   [PASS] EXT-Impl-003: extractWhatBuilt exported
      Evidence: Type is function
   [PASS] EXT-Impl-004: extractKeyFilesWithRoles exported
      Evidence: Type is function
   [PASS] EXT-Impl-005: generateExtensionGuide exported
      Evidence: Type is function
   [PASS] EXT-Impl-006: extractCodePatterns exported
      Evidence: Type is function
   [PASS] EXT-Impl-007: buildImplementationGuideData exported
      Evidence: Type is function
   [PASS] EXT-Impl-008: Detects implementation work
      Evidence: true === true
   [PASS] EXT-Impl-009: No work with empty data
      Evidence: false === false
   [PASS] EXT-Impl-010: Research-only not implementation
      Evidence: false === false
   [PASS] EXT-Impl-011: Topic from folder name
      Evidence: oauth-auth
   [PASS] EXT-Impl-012: Topic from observations is string
      Evidence: Type is string
   [PASS] EXT-Impl-013: extractWhatBuilt returns array
      Evidence: Array with 2 items
   [PASS] EXT-Impl-014: Feature has FEATURE_NAME
   [PASS] EXT-Impl-015: Feature has DESCRIPTION
   [PASS] EXT-Impl-016: Duplicate features deduplicated
      Evidence: 1 === 1
   [PASS] EXT-Impl-017: extractKeyFilesWithRoles returns array
      Evidence: Array with 3 items
   [PASS] EXT-Impl-018: Key file has FILE_PATH
   [PASS] EXT-Impl-019: Key file has ROLE
   [PASS] EXT-Impl-020: Test file role detected
      Evidence: Test file
   [PASS] EXT-Impl-021: Config file role detected
      Evidence: Configuration
   [PASS] EXT-Impl-022: generateExtensionGuide returns array
      Evidence: Array with 1 items
   [PASS] EXT-Impl-023: Guide has GUIDE_TEXT
   [PASS] EXT-Impl-024: extractCodePatterns returns array
      Evidence: Array with 0 items
   [PASS] EXT-Impl-027: Guide detected
      Evidence: true === true
   [PASS] EXT-Impl-028: Guide has TOPIC
   [PASS] EXT-Impl-029: Guide has IMPLEMENTATIONS
      Evidence: Array with 2 items
   [PASS] EXT-Impl-030: Guide has IMPL_KEY_FILES
      Evidence: Array with 3 items
   [PASS] EXT-Impl-031: Guide has EXTENSION_GUIDES
      Evidence: Array with 1 items
   [PASS] EXT-Impl-032: Guide has PATTERNS
      Evidence: Array with 0 items
   [PASS] EXT-Impl-033: No guide when no impl work
      Evidence: false === false

=== DIAGRAM-EXTRACTOR.JS (P1) ===
   [PASS] EXT-Diag-001: extractPhasesFromData exported
      Evidence: Type is function
   [PASS] EXT-Diag-002: extractDiagrams exported
      Evidence: Type is function
   [PASS] EXT-Diag-003: extractPhasesFromData returns array
      Evidence: Array with 2 items
   [PASS] EXT-Diag-004: Phase has PHASE_NAME
   [PASS] EXT-Diag-005: Phase has DURATION
   [PASS] EXT-Diag-006: Phase has ACTIVITIES array
      Evidence: Array with 2 items
   [PASS] EXT-Diag-007: Null data returns simulation phases
      Evidence: Array with 4 items
   Session too short for meaningful phase detection
   [PASS] EXT-Diag-008: Short session returns array
      Evidence: Array with 0 items
   [PASS] EXT-Diag-009: extractDiagrams returns DIAGRAMS array
      Evidence: Array with 0 items
   [PASS] EXT-Diag-010: DIAGRAM_COUNT is number
      Evidence: Type is number
   [PASS] EXT-Diag-011: HAS_AUTO_GENERATED is true
      Evidence: true === true
   [PASS] EXT-Diag-012: FLOW_TYPE exists
   [PASS] EXT-Diag-013: AUTO_CONVERSATION_FLOWCHART exists
   [PASS] EXT-Diag-014: AUTO_DECISION_TREES is array
      Evidence: Array with 0 items
   [PASS] EXT-Diag-015: DIAGRAM_TYPES is array
      Evidence: Array with 0 items
   [PASS] EXT-Diag-016: PATTERN_SUMMARY is array
      Evidence: Array with 0 items
   Session too short for meaningful phase detection
   [PASS] EXT-Diag-017: ASCII art processing works
      Evidence: Type is number
   [PASS] EXT-Diag-018: Simulation returns DIAGRAMS

=== OPENCODE-CAPTURE.JS (REMOVED — recovery mode deprecated) ===
   [SKIP] EXT-OC: Module removed (skipped: Recovery mode fully deprecated)

=== ADDITIONAL CLI CAPTURES (REMOVED — recovery mode deprecated) ===
   [SKIP] EXT-CLI: Modules removed (skipped: Recovery mode fully deprecated — codex/copilot/gemini captures deleted)

=== DATA-LOADER.JS (P0) ===
   [PASS] LOAD-001: loadCollectedData exported
      Evidence: Type is function
   [SKIP] LOAD-002: Data loading (skipped: Expected in test env: NO_DATA_FILE: Structured JSON input is required vi)

=== EXTRACTORS/INDEX.JS ===
   [PASS] EXT-IDX-001: extractFilesFromData re-exported
      Evidence: Type is function
   [PASS] EXT-IDX-002: extractDiagrams re-exported
      Evidence: Type is function
   [PASS] EXT-IDX-003: extractConversations re-exported
      Evidence: Type is function
   [PASS] EXT-IDX-004: extractDecisions re-exported
      Evidence: Type is function
   [PASS] EXT-IDX-005: collectSessionData re-exported
      Evidence: Type is function
   [PASS] EXT-IDX-006: detectObservationType re-exported
      Evidence: Type is function
   [PASS] EXT-IDX-007: buildObservationsWithAnchors re-exported
      Evidence: Type is function
   [PASS] EXT-IDX-008: generateSessionId re-exported
      Evidence: Type is function
   [PASS] EXT-IDX-009: getChannel re-exported
      Evidence: Type is function
   [PASS] EXT-IDX-010: buildImplementationGuideData re-exported
      Evidence: Type is function
   [SKIP] EXT-IDX-011: captureCodexConversation (skipped: Recovery mode deprecated)
   [SKIP] EXT-IDX-012: captureCopilotConversation (skipped: Recovery mode deprecated)
   [SKIP] EXT-IDX-013: captureGeminiConversation (skipped: Recovery mode deprecated)

=== ERROR HANDLING ===
   [PASS] ERR-001: Empty object returns observation
      Evidence: observation === observation
   [PASS] ERR-002: Null/undefined properties handled
      Evidence: observation === observation
   [PASS] ERR-003: Null FILES handled
      Evidence: Array with 0 items
   [PASS] ERR-004: Invalid file objects handled
      Evidence: Array with 0 items
   [PASS] ERR-005: Empty arrays return object
      Evidence: Type is object
   [PASS] ERR-006: Null properties handled
      Evidence: Type is object
   [PASS] ERR-007: Null facts handled
   [PASS] ERR-008: Empty narrative handled
   [PASS] ERR-009: Empty string returns array
      Evidence: Array with 0 items
   [PASS] ERR-010: Null summary returns array
      Evidence: Array with 0 items
   [PASS] ERR-011: Invalid date handled
      Evidence: 0m

=== INTEGRATION TESTS ===
   [PASS] INT-001: Files and observations extracted together
      Evidence: 5 files, 4 observations
   [PASS] INT-002: Decisions and diagrams extracted together
      Evidence: 1 decisions
   [PASS] INT-003: Conversations with phases extracted
      Evidence: 5 messages
   [PASS] INT-004: Session characteristics detected
      Evidence: Type: decision, Tier: important
   [PASS] INT-005: Implementation guide built
      Evidence: 2 implementations

============================================================
  TEST SUMMARY
============================================================

  Total:   273
  Passed:  267
  Failed:  0
  Skipped: 6
  Duration: 149ms

  Exit code: 0
============================================================
```

### Command: npm run check

```text
npm error Lifecycle script `check` failed with error:
npm error workspace @spec-kit/shared@1.7.2
npm error location /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared
npm error Missing script: "check"
npm error
npm error To see a list of scripts, run:
npm error   npm run --workspace=@spec-kit/shared@1.7.2


> @spec-kit/mcp-server@1.7.2 check
> npm run lint && npx tsc --noEmit


> @spec-kit/mcp-server@1.7.2 lint
> eslint . --ext .ts


> @spec-kit/scripts@1.7.2 check
> npm run lint && npx tsx evals/check-no-mcp-lib-imports.ts && bash check-api-boundary.sh && npx tsx evals/check-architecture-boundaries.ts && npx tsx evals/check-allowlist-expiry.ts && npx tsx evals/check-source-dist-alignment.ts && npx tsx evals/check-no-mcp-lib-imports-ast.ts && npx tsx evals/check-handler-cycles-ast.ts


> @spec-kit/scripts@1.7.2 lint
> tsc --noEmit

Import policy check passed: no prohibited @spec-kit/mcp-server/{lib,core,handlers} internal imports found.
PASS: No lib/ -> api/ import violations found
Architecture boundary check passed: shared/ neutrality OK, mcp_server/scripts/ wrappers OK.
Allowlist expiry check passed: no entries expiring within 30 days and no expired entries found.
Source/dist alignment summary:
  dist JS files scanned: 268
  aligned files: 268
  allowlisted orphans: 0
  violations: 0

Source/dist alignment check passed: every scanned dist *.js file maps to a source .ts file.
AST import policy check passed: no prohibited @spec-kit/mcp-server/{lib,core,handlers} internal imports found.
AST handler cycle check passed: no circular dependencies across 44 handler files.
```

### Command: npm run lint

```text
npm error Lifecycle script `lint` failed with error:
npm error workspace @spec-kit/shared@1.7.2
npm error location /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared
npm error Missing script: "lint"
npm error
npm error Did you mean this?
npm error   npm link # Symlink a package folder
npm error
npm error To see a list of scripts, run:
npm error   npm run --workspace=@spec-kit/shared@1.7.2


> @spec-kit/mcp-server@1.7.2 lint
> eslint . --ext .ts


> @spec-kit/scripts@1.7.2 lint
> tsc --noEmit
```

## Summary

- Tests command completed successfully (no command-level failure).
- No explicit `TSxxxx` compiler errors detected in captured check output.
- `npm run check` failed at workspace level because `@spec-kit/shared` has no `check` script, although mcp_server and scripts checks executed and reported passing internal checks.
- `npm run lint` failed at workspace level because `@spec-kit/shared` has no `lint` script, while `@spec-kit/mcp-server` lint and `@spec-kit/scripts` type-check lint ran.
- Build health: **degraded at root workspace orchestration level** (script configuration mismatch in shared workspace), while sub-workspace quality checks that ran appear healthy.

## JSONL (type:iteration, run:17, dimensions:[correctness])

{"type": "iteration", "run": 17, "dimensions": ["correctness"], "commands": {"npm run test": {"exitCode": 0}, "npm run check": {"exitCode": 1}, "npm run lint": {"exitCode": 1}}, "signals": {"testFailureKeywordMatches": 337, "tsErrorMatchesInCheck": 0, "lintWarningErrorPatternMatches": 11}, "buildHealth": "degraded-root-workspace-script-mismatch"}
