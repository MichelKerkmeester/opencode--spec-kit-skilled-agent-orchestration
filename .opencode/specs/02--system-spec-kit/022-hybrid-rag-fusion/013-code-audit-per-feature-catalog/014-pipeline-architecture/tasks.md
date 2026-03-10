# Tasks: 014 — Pipeline Architecture

**Source:** checklist.md (code audit findings)
**Created:** 2026-03-10
**Features audited:** 21 (F-01 through F-21)

---

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0       | 5     | FAIL status — correctness bugs, behavior mismatches |
| P1       | 7     | WARN with behavior mismatch or significant code issue |
| P2       | 8     | WARN with documentation/test gaps only |
| —        | 3     | PASS (F-04, F-05, F-16) — no tasks needed |

**Total tasks:** 20

---

## P0 — Immediate Fixes (FAIL)

### T-01: Fix DB hot rebinding — lastDbCheck advances before reinitializeDatabase succeeds
- **Priority:** P0
- **Feature:** F-17 Cross-process DB hot rebinding
- **Status:** TODO
- **Source:** mcp_server/core/db-state.ts:103-115
- **Issue:** `checkDatabaseUpdated()` advances `lastDbCheck` before `reinitializeDatabase()` succeeds, so a failed rebind suppresses retries for the same marker timestamp and can leave the process on stale DB handles.
- **Fix:** Only advance `lastDbCheck` after `reinitializeDatabase()` completes successfully, or roll it back on failure. Add failure-path tests for repeated marker-file retries and concurrent callers.

### T-02: Fix atomicSaveMemory — not truly atomic despite feature claim
- **Priority:** P0
- **Feature:** F-18 Atomic write-then-index API
- **Status:** TODO
- **Source:** mcp_server/handlers/memory-save.ts:392-445
- **Issue:** `atomicSaveMemory()` passes a no-op `dbOperation` to `executeAtomicSave()` and performs async indexing only after file write succeeds. The feature doc says `memory_save` couples file writing and database indexing in one transactional unit, but the handler intentionally allows "file saved, indexing failed" partial success.
- **Fix:** Either redesign `memory_save` around a truly transactional staging/indexing flow, or rewrite the feature description to match the actual best-effort indexing behavior.

### T-03: Add handler-level atomicity failure-injection tests
- **Priority:** P0
- **Feature:** F-18 Atomic write-then-index API
- **Status:** TODO
- **Source:** feature_catalog/14--pipeline-architecture/18-atomic-write-then-index-api.md:19-24
- **Issue:** Listed tests only cover transaction-manager primitives; they do not assert handler-level atomicity or rollback behavior for `memory_save`. No tests distinguish file-write success from DB commit success from embedding/index failure.
- **Fix:** Add handler-level failure-injection tests that distinguish file-write success, DB commit success, and embedding/index failure scenarios.

### T-04: Fix pending-file recovery — no DB existence check before rename
- **Priority:** P0
- **Feature:** F-21 Atomic pending-file recovery
- **Status:** TODO
- **Source:** mcp_server/lib/storage/transaction-manager.ts:317-342
- **Issue:** `recoverPendingFile()` renames a `_pending` file purely from filesystem state; it never checks whether the corresponding DB row exists before recovery. The feature doc says each pending file is checked against the database before rename, but no DB check exists.
- **Fix:** Add a DB existence check before renaming pending files to prevent recovery of uncommitted or false-positive `_pending` artifacts.

### T-05: Add startup recovery tests for committed vs uncommitted pending files
- **Priority:** P0
- **Feature:** F-21 Atomic pending-file recovery
- **Status:** TODO
- **Source:** mcp_server/tests/transaction-manager.vitest.ts:153-168, :373-390
- **Issue:** Listed tests only assert filesystem rename behavior; they do not validate DB-backed recovery decisions or false-positive pending files. Startup recovery in `context-server.ts:417-445` also lacks test coverage.
- **Fix:** Extend startup recovery tests to cover committed vs uncommitted pending files and false-positive `_pending` artifacts.

---

## P1 — Significant Issues (WARN with behavior mismatch)

### T-06: Fix chunk ordering feature — wrong source/test tables
- **Priority:** P1
- **Feature:** F-03 Chunk ordering preservation
- **Status:** TODO
- **Source:** feature_catalog/14--pipeline-architecture/03-chunk-ordering-preservation.md:11-18
- **Issue:** Feature doc points to `rollout-policy.ts`, `evidence-gap-detector.ts`, `stage4-filter.ts`, etc. as the implementation surface, but the real ordering/reassembly logic is in `stage3-rerank.ts:449-457, :529-611`. Listed tests do not exercise ordered chunk reassembly; the real regressions are in unlisted files.
- **Fix:** Replace the feature's source/test tables with the actual Stage 3 implementation (`stage3-rerank.ts`) and its reassembly regressions (`regression-010-index-large-files.vitest.ts`, `search-results-format.vitest.ts`).

### T-07: Fix performance improvements feature — source table only lists cache modules
- **Priority:** P1
- **Feature:** F-08 Performance improvements
- **Status:** TODO
- **Source:** feature_catalog/14--pipeline-architecture/08-performance-improvements.md:17-27
- **Issue:** Feature description names thirteen optimizations across `tfidf-summarizer.ts`, `memory-summaries.ts`, `mutation-ledger.ts`, entity-linking, graph, and hierarchy caching, but the source table only lists `embedding-cache.ts` and `tool-cache.ts`. No listed regression covers the actual remediations.
- **Fix:** Replace the implementation/test tables with the actual optimized files and targeted regressions for each optimization cluster.

### T-08: Fix activation window persistence feature — wrong source files listed
- **Priority:** P1
- **Feature:** F-09 Activation window persistence
- **Status:** TODO
- **Source:** feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md:9-22
- **Issue:** Feature text says the fix was added to `save-quality-gate.ts` validated by regression WO7, but the source table only lists `rollout-policy.ts` and `search-flags.ts` plus unrelated tests. The actual implementation is in `save-quality-gate.ts:280-289`.
- **Fix:** Point the feature source/test tables to `save-quality-gate.ts` and `save-quality-gate.vitest.ts:237-257` instead of unrelated flag files.

### T-09: Fix pipeline hardening feature — most claimed fixes missing from source table
- **Priority:** P1
- **Feature:** F-11 Pipeline and mutation hardening
- **Status:** TODO
- **Source:** feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:18-33
- **Issue:** Feature bundles ten fixes spanning schema exposure, Stage metadata, embedding reuse, stemming, update/delete cleanup, BM25 cleanup, atomic-save error reporting, and preflight errors, but the source table only lists `mutation-ledger.ts` and `transaction-manager.ts`. Most claimed code is omitted from the feature's own inventory.
- **Fix:** Split this bundle into smaller feature entries or expand the source/test tables so every named fix has an implementation and test reference.

### T-10: Fix DB_PATH feature — script consumers missing from source table
- **Priority:** P1
- **Feature:** F-12 DB_PATH extraction and import standardization
- **Status:** TODO
- **Source:** feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md:11-19
- **Issue:** Feature text says script consumers like `cleanup-orphaned-vectors.ts` were standardized to shared DB-path resolution, but the source table only lists core/shared modules and omits actual script consumers. Listed tests do not assert env-var precedence or cross-entry-point consistency.
- **Fix:** Add the actual script consumers to the feature's implementation table. Add a direct DB-path resolver test that toggles env vars and checks standardized consumers.

### T-11: Fix 7-layer tool architecture — classifier routing claim not found in code
- **Priority:** P1
- **Feature:** F-20 7-layer tool architecture metadata
- **Status:** TODO
- **Source:** feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md:5-7
- **Issue:** Feature doc says the query classifier uses layer metadata to route requests, but runtime usages found are only in `memory-context.ts:460-461,598` and `context-server.ts:349` — no classifier-side references found. Token-budget enforcement tests conditionally return early due to unexported symbols.
- **Fix:** Either wire layer metadata into the classifier as claimed, or narrow the feature description to current usage sites. Fix token-budget tests to use public `memory_context` behavior.

### T-12: Shrink warm server feature tables — deferred feature has over-inclusive inventory
- **Priority:** P1
- **Feature:** F-15 Warm server / daemon mode
- **Status:** TODO
- **Source:** feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md
- **Issue:** Feature is deferred (not implemented), but the catalog's implementation/test tables are massively over-inclusive and include the nonexistent `retry.vitest.ts`. Existing coverage only proves stdio remains active.
- **Fix:** Move this deferred item to a decision/deferred catalog, or shrink file tables to the few files that prove stdio remains the active transport. Remove the nonexistent test entry.

---

## P2 — Documentation/Test Gaps

### T-13: Remove nonexistent retry.vitest.ts from 4-stage pipeline feature
- **Priority:** P2
- **Feature:** F-01 4-stage pipeline refactor
- **Status:** TODO
- **Source:** feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md:183
- **Issue:** Feature catalog lists a nonexistent test `mcp_server/tests/retry.vitest.ts`. No single listed regression proves the full 4-stage trace plus Stage 4 score-immutability contract.
- **Fix:** Remove the nonexistent test entry. Add one explicit end-to-end regression that asserts stage ordering, Stage 3 aggregation, and Stage 4 score immutability in one trace.

### T-14: Fix stale default-state comment in MPAB aggregation module
- **Priority:** P2
- **Feature:** F-02 MPAB chunk-to-memory aggregation
- **Status:** TODO
- **Source:** mcp_server/lib/scoring/mpab-aggregation.ts:4-7
- **Issue:** Module header says `SPECKIT_DOCSCORE_AGGREGATION` defaults OFF, but `isMpabEnabled()` at lines 62-69 defaults ON unless the env var is explicitly `false`.
- **Fix:** Update the stale default-state comment in `mpab-aggregation.ts` to say "default ON".

### T-15: Fix stale flag comment in learned relevance feedback module
- **Priority:** P2
- **Feature:** F-06 Learned relevance feedback
- **Status:** TODO
- **Source:** mcp_server/lib/search/learned-feedback.ts:69-70
- **Issue:** Feature-flag comment says default OFF, but `isLearnedFeedbackEnabled()` at lines 159-167 defaults ON unless `SPECKIT_LEARN_FROM_SELECTION=false`.
- **Fix:** Align the inline flag comment with actual runtime default-ON behavior.

### T-16: Fix stale quality floor threshold in channel-representation test
- **Priority:** P2
- **Feature:** F-07 Search pipeline safety
- **Status:** TODO
- **Source:** mcp_server/tests/channel-representation.vitest.ts:247-257
- **Issue:** Test still describes the quality floor as "0.2 passes, 0.19 fails" while the runtime constant is now `0.005` in `channel-representation.ts:6-12`. Feature catalog also lists the nonexistent `retry.vitest.ts`.
- **Fix:** Fix the stale threshold comments in the test file. Remove the nonexistent `retry.vitest.ts` entry from the feature catalog.

### T-17: Remove nonexistent retry.vitest.ts from legacy V1 pipeline removal feature
- **Priority:** P2
- **Feature:** F-10 Legacy V1 pipeline removal
- **Status:** TODO
- **Source:** feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md:125
- **Issue:** Feature catalog lists a nonexistent test `mcp_server/tests/retry.vitest.ts`. Feature tables include many unrelated files; the core V2-only assertions are concentrated in specific files not highlighted.
- **Fix:** Remove the nonexistent test entry. Trim the feature tables to the V1-removal and orphan-cleanup code paths actually described by the feature.

### T-18: Add strict-vs-passthrough mode tests and stderr logging assertion
- **Priority:** P2
- **Feature:** F-13 Strict Zod schema validation
- **Status:** TODO
- **Source:** mcp_server/tests/tool-input-schema.vitest.ts:162-178
- **Issue:** Tests only assert strict-mode rejection of unknown params; they do not toggle `SPECKIT_STRICT_SCHEMAS=false` to verify the permissive `.passthrough()` branch. No test for `console.error` stderr audit logging of rejected inputs.
- **Fix:** Add strict-vs-passthrough mode tests. Add an assertion that rejected inputs are logged to stderr.

### T-19: Add dynamic server instructions test and remove nonexistent retry.vitest.ts
- **Priority:** P2
- **Feature:** F-14 Dynamic server instructions at MCP initialization
- **Status:** TODO
- **Source:** mcp_server/context-server.ts:217-238, :985-990
- **Issue:** No test assertions found for `buildServerInstructions()` or `server.setInstructions()`. Feature catalog also lists the nonexistent `retry.vitest.ts`.
- **Fix:** Add a focused regression for dynamic initialization content and stale-memory warnings. Remove the nonexistent `retry.vitest.ts` entry from the feature catalog.

### T-20: Add end-to-end embedding retry test for save/index-scan failure path
- **Priority:** P2
- **Feature:** F-19 Embedding retry orchestrator
- **Status:** TODO
- **Source:** feature_catalog/14--pipeline-architecture/19-embedding-retry-orchestrator.md:5-7
- **Issue:** Retry manager is well covered, but the `memory_save`/`memory_index_scan` integration path is not tested end-to-end. No listed test proves that provider failure during save leaves the memory retrievable lexically before retry recovery.
- **Fix:** Add an end-to-end save/index-scan failure test that verifies `embedding_status='pending'`, lexical fallback retrieval, and later retry recovery into `vec_memories`.
