---
title: "Pipeline and mutation hardening"
description: "Pipeline and mutation hardening applies baseline fixes for schema completeness, pipeline metadata, embedding efficiency, stemmer quality, data cleanup and checkpoint restore mutation safety."
---

# Pipeline and mutation hardening

## 1. OVERVIEW

Pipeline and mutation hardening applies baseline fixes for schema completeness, pipeline metadata, embedding efficiency, stemmer quality, data cleanup and checkpoint restore mutation safety.

Ten small but important baseline fixes were applied to make the system more robust. Some exposed missing options that were supposed to be available. Others fixed cleanup problems where deleting a memory left orphaned records behind. A few improved how the system handles word variations in searches. Later hardening passes added more guardrails on top of that baseline, including a checkpoint restore maintenance barrier that blocks mutation traffic while restore and rebuild work is in flight.

---

## 2. CURRENT REALITY

Ten fixes addressed schema completeness, pipeline metadata, embedding efficiency, stemmer quality and data cleanup:

- **Schema params exposed (#13):** `memorySearch` tool schema now includes `trackAccess`, `includeArchived` and `mode` parameters.
- **Dead dedup config removed (#14):** `sessionDeduped` removed from Stage 4 metadata (dedup is post-cache in the main handler).
- **Constitutional count passthrough (#15):** Stage 1's constitutional injection count flows through the orchestrator to Stage 4 output metadata.
- **Embedding caching (#16):** Stage 1 caches the query embedding at function scope for reuse in the constitutional injection path, saving one API call per search.
- **Stemmer double-consonant (#18):** `simpleStem()` now handles doubled consonants after suffix removal: "running"->"runn"->"run", "stopped"->"stopp"->"stop".
- **Full-content embedding on update (#19):** `memory_update` now embeds `title + "\n\n" + content_text` instead of title alone.
- **Ancillary record cleanup on delete (#20):** Memory deletion now cleans `degree_snapshots`, `community_assignments`, `memory_summaries`, `memory_entities` and `causal_edges`.
- **BM25 index cleanup on delete (#21):** `bm25Index.getIndex().removeDocument(String(id))` called after successful delete when BM25 is enabled.
- **Atomic save error tracking (#22):** `atomicSaveMemory` now tracks rename-failure state with a `dbCommitted` flag for better error reporting.
- **Dynamic preflight error code (#23):** Preflight validation uses the actual error code from `preflightResult.errors[0].code` instead of hardcoding `ANCHOR_FORMAT_INVALID`.

A later audit added three more pipeline-side corrections to the same runtime path:

- **Deep-mode filter parity (H11):** Reformulation and HyDE candidates now re-enter scope, tier, `contextType` and `qualityThreshold` filtering before merge.
- **Constitutional scope parity (H12):** Constitutional injection now uses `shouldApplyScopeFiltering`, so global scope enforcement applies even when callers omit explicit governance scope fields.
- **CamelCase chunk metadata support (H14):** Chunk reassembly now accepts `parentId`, `chunkIndex` and `chunkLabel` aliases in addition to snake_case fields, preventing silent bypass of parent collapse.

A later mutation-safety pass added a checkpoint restore barrier to the same runtime surface:

- **Checkpoint restore maintenance barrier (T300):** `restoreCheckpoint()` now flips a module-level restore-in-progress flag before restore mutations begin and holds it through post-restore rebuilds. Concurrent `checkpoint_restore` calls plus mutation traffic from `memory_save`, `memory_index_scan` and `memory_bulk_delete` fail fast with `E_RESTORE_IN_PROGRESS` instead of racing restore-side rebuilds. The barrier is cleared in a `finally` path, so both successful and failed restores reopen mutation traffic.

Phase 13 added three chunking and mutation hardening follow-ups to the same save pipeline:

- **Chunked PE finalize transaction (T330):** chunked saves now track the created parent/child IDs and finalize `markMemorySuperseded()` plus cross-path `supersedes` edge creation inside one transaction. If that finalize step fails, compensating cleanup deletes the newly created chunk tree before the error is returned.
- **Rollback-safe safe-swap deletion (T331):** safe-swap finalization now moves old-child unlink and delete into the same transaction, first nulling `parent_id` on the old children and only then bulk-deleting them. A failed finalize leaves the old child set linked and queryable.
- **Parent BM25 rollback guard (T332):** parent BM25 mutation now waits until at least one chunk has indexed successfully and, for safe-swap updates, until finalization completes. All-chunks-failed rollback therefore preserves the old parent BM25 document instead of replacing it with an empty or stale summary.

---

## 3. SOURCE FILES

### Implementation — Pipeline hardening

| File | Layer | Role |
|------|-------|------|
| `mcp_server/tool-schemas.ts` | Core | memory_search schema exposes trackAccess/includeArchived/mode |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Runtime schema parity for newly exposed parameters |
| `mcp_server/lib/search/pipeline/stage4-filter.ts` | Lib | Removes dead sessionDeduped metadata, forwards constitutional count |
| `mcp_server/lib/search/pipeline/orchestrator.ts` | Lib | Passes Stage 1 constitutionalInjected metadata into Stage 4 |
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Stage metadata typing for constitutional passthrough |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Query embedding caching plus deep-mode filter parity and constitutional scope enforcement |
| `mcp_server/lib/search/chunk-reassembly.ts` | Lib | CamelCase chunk metadata support during parent collapse |
| `mcp_server/lib/search/bm25-index.ts` | Lib | Doubled-consonant stemming fix after suffix stripping |

### Implementation — Mutation hardening

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-crud-update.ts` | Handler | Re-embeds title + content_text on memory updates |
| `mcp_server/lib/storage/checkpoints.ts` | Lib | Restore maintenance barrier state, `E_RESTORE_IN_PROGRESS` status and post-restore rebuild lifecycle |
| `mcp_server/handlers/checkpoints.ts` | Handler | Rejects concurrent `checkpoint_restore` calls during active restore maintenance |
| `mcp_server/lib/search/vector-index-mutations.ts` | Lib | Ancillary table cleanup and BM25 removeDocument on delete |
| `mcp_server/lib/storage/transaction-manager.ts` | Lib | dbCommitted tracking for rename-failure partial commits |
| `mcp_server/handlers/memory-save.ts` | Handler | Uses first preflight error code dynamically in failure response and blocks save traffic during restore maintenance |
| `mcp_server/handlers/chunking-orchestrator.ts` | Handler | Safe-swap finalization transaction, rollback-safe old-child deletion, and delayed parent BM25 mutation |
| `mcp_server/handlers/memory-index.ts` | Handler | Blocks `memory_index_scan` during active checkpoint restore maintenance |
| `mcp_server/handlers/memory-bulk-delete.ts` | Handler | Blocks `memory_bulk_delete` during active checkpoint restore maintenance |

### Tests — Pipeline hardening

| File | Focus |
|------|-------|
| `mcp_server/tests/tool-input-schema.vitest.ts` | Public/runtime schema validation for memory_search args |
| `mcp_server/tests/pipeline-v2.vitest.ts` | Stage metadata contract including constitutional passthrough |
| `mcp_server/tests/stage1-expansion.vitest.ts` | Stage 1 embedding, scope filtering and deep-mode merge guardrails |
| `mcp_server/tests/handler-memory-search.vitest.ts` | Chunk collapse path behavior |
| `mcp_server/tests/bm25-index.vitest.ts` | Stemmer regression coverage |
| `mcp_server/tests/search-extended.vitest.ts` | Additional simpleStem doubled-consonant checks |

### Tests — Mutation hardening

| File | Focus |
|------|-------|
| `mcp_server/tests/memory-crud-extended.vitest.ts` | Update/delete handler integration behavior |
| `mcp_server/tests/deferred-features-integration.vitest.ts` | Cross-table cleanup checks for mutation-side delete paths |
| `mcp_server/tests/transaction-manager.vitest.ts` | Atomic-save and pending-file transaction behavior |
| `mcp_server/tests/preflight.vitest.ts` | Preflight error-code contract used by save handler responses |
| `mcp_server/tests/chunking-orchestrator-swap.vitest.ts` | Safe-swap finalization success/failure, staged-chunk cleanup, and old-child rollback coverage |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Chunked PE finalize rollback and compensating chunk-tree cleanup coverage |

---

## 4. SOURCE METADATA

- Group: Opus review remediation (Phase 017)
- Source feature title: Pipeline and mutation hardening
- Current reality source: FEATURE_CATALOG.md
