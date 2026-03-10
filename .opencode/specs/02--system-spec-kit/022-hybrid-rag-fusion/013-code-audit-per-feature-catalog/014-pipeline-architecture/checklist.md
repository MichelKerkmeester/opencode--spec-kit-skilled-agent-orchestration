## F-01: 4-stage pipeline refactor
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. The feature catalog lists a nonexistent test, `mcp_server/tests/retry.vitest.ts` [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md:183`]. 2. The listed test inventory is broad, but no single listed regression proves the full 4-stage trace plus the Stage 4 score-immutability contract described in [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md:5-19`].
- **Playbook Coverage:** EX-005, NEW-049
- **Recommended Fixes:** 1. Remove the nonexistent test entry. 2. Add one explicit end-to-end regression that asserts stage ordering, Stage 3 aggregation, and Stage 4 score immutability in one trace.

## F-02: MPAB chunk-to-memory aggregation
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** 1. The module header still says `SPECKIT_DOCSCORE_AGGREGATION` defaults OFF, but `isMpabEnabled()` defaults ON unless the env var is explicitly `false` [`mcp_server/lib/scoring/mpab-aggregation.ts:4-7`, `mcp_server/lib/scoring/mpab-aggregation.ts:62-69`].
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** NEW-050
- **Recommended Fixes:** 1. Update the stale default-state comment in `mpab-aggregation.ts`.

## F-03: Chunk ordering preservation
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. The feature doc points to `rollout-policy.ts`, `evidence-gap-detector.ts`, `stage4-filter.ts`, `types.ts`, `search-flags.ts`, and `retrieval-trace.ts` as the implementation surface [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/03-chunk-ordering-preservation.md:11-18`], but the real ordering/reassembly logic is in `mcp_server/lib/search/pipeline/stage3-rerank.ts`, where chunk groups are sorted by `chunk_index` and parent rows are reassembled or fallback-marked [`mcp_server/lib/search/pipeline/stage3-rerank.ts:449-457`, `mcp_server/lib/search/pipeline/stage3-rerank.ts:529-611`].
- **Test Gaps:** 1. The listed tests [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/03-chunk-ordering-preservation.md:20-33`] do not exercise ordered chunk reassembly. 2. The real regression coverage lives in `mcp_server/tests/regression-010-index-large-files.vitest.ts:372-404` and `mcp_server/tests/search-results-format.vitest.ts:307-329`, but those tests are not referenced by the feature catalog.
- **Playbook Coverage:** NEW-051
- **Recommended Fixes:** 1. Replace the feature’s source/test tables with the actual Stage 3 implementation and its reassembly regressions.

## F-04: Template anchor optimization
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** NEW-052
- **Recommended Fixes:** NONE

## F-05: Validation signals as retrieval metadata
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** NEW-053
- **Recommended Fixes:** NONE

## F-06: Learned relevance feedback
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** 1. The feature-flag comment says default OFF, but `isLearnedFeedbackEnabled()` defaults ON unless `SPECKIT_LEARN_FROM_SELECTION=false` [`mcp_server/lib/search/learned-feedback.ts:69-70`, `mcp_server/lib/search/learned-feedback.ts:159-167`].
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** NEW-054
- **Recommended Fixes:** 1. Align the inline flag comment with actual runtime behavior.

## F-07: Search pipeline safety
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** 1. `channel-representation.vitest.ts` still describes the quality floor as “0.2 passes, 0.19 fails,” while the runtime constant is now `0.005` [`mcp_server/tests/channel-representation.vitest.ts:247-257`, `mcp_server/lib/search/channel-representation.ts:6-12`].
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. The feature catalog lists a nonexistent test, `mcp_server/tests/retry.vitest.ts` [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:171`].
- **Playbook Coverage:** NEW-067
- **Recommended Fixes:** 1. Fix the stale threshold comments in `channel-representation.vitest.ts`. 2. Remove the nonexistent `retry.vitest.ts` entry from the feature catalog.

## F-08: Performance improvements
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. The feature description names thirteen optimizations across `tfidf-summarizer.ts`, `memory-summaries.ts`, `mutation-ledger.ts`, entity-linking, graph, and hierarchy caching [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/08-performance-improvements.md:5-11`], but the source table only lists `embedding-cache.ts` and `tool-cache.ts` [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/08-performance-improvements.md:17-27`]. The described quick wins are implemented elsewhere, including `mcp_server/lib/search/tfidf-summarizer.ts:149-151` and `mcp_server/lib/storage/mutation-ledger.ts:289-317`.
- **Test Gaps:** 1. The listed tests only cover cache modules, not the thirteen remediations described in the feature text. 2. There is no listed regression for the large-array `Math.max` replacement, SQL `COUNT(*)` path, entity-linker batching, or hierarchy-cache behavior.
- **Playbook Coverage:** NEW-071, NEW-083
- **Recommended Fixes:** 1. Replace the implementation/test tables with the actual optimized files and targeted regressions for each optimization cluster.

## F-09: Activation window persistence
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. The feature text says the fix was added to `save-quality-gate.ts` and validated by regression `WO7` [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md:5`], but the source table only lists `rollout-policy.ts` and `search-flags.ts` plus unrelated tests [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md:9-22`]. The actual implementation is `mcp_server/lib/validation/save-quality-gate.ts:280-289`, with regression coverage in `mcp_server/tests/save-quality-gate.vitest.ts:237-257`.
- **Test Gaps:** 1. None of the tests listed in the feature catalog assert restart persistence of the activation window.
- **Playbook Coverage:** NEW-076
- **Recommended Fixes:** 1. Point the feature to `save-quality-gate.ts` and `save-quality-gate.vitest.ts` instead of unrelated flag files.

## F-10: Legacy V1 pipeline removal
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. The feature catalog lists a nonexistent test, `mcp_server/tests/retry.vitest.ts` [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md:125`]. 2. The core V2-only assertions are concentrated in `mcp_server/lib/search/search-flags.ts:95-103`, `mcp_server/lib/search/vector-index-queries.ts:1336-1371`, and `mcp_server/tests/flag-ceiling.vitest.ts:164-188`, but the feature’s tables include many unrelated files.
- **Playbook Coverage:** NEW-078
- **Recommended Fixes:** 1. Remove the nonexistent test entry. 2. Trim the feature tables to the V1-removal and orphan-cleanup code paths actually described by the feature.

## F-11: Pipeline and mutation hardening
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. The feature bundles ten fixes spanning schema exposure, Stage metadata, embedding reuse, stemming, update/delete cleanup, BM25 cleanup, atomic-save error reporting, and preflight errors [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:5-16`], but its source table only lists `mutation-ledger.ts` and `transaction-manager.ts` [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:18-33`]. Most of the code the feature claims changed is therefore omitted from its own inventory.
- **Test Gaps:** 1. The listed tests only cover transaction-manager and mutation-ledger behavior. 2. They do not cover the schema, stemmer, delete-cleanup, BM25 cleanup, or preflight-error bullets named in the feature description.
- **Playbook Coverage:** NEW-080
- **Recommended Fixes:** 1. Split this bundle into smaller feature entries or expand the source/test tables so every named fix has an implementation and test reference.

## F-12: DB_PATH extraction and import standardization
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. The feature text says script consumers such as `cleanup-orphaned-vectors.ts` were standardized to shared DB-path resolution [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md:5`], but the source table only lists core/shared modules and omits the actual script consumers [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md:11-19`].
- **Test Gaps:** 1. `getDbDir()`/`DB_PATH` resolution is implemented in `shared/config.ts:9-10,41-46` and `shared/paths.ts:7-15`, but the listed tests [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md:21-36`] do not directly assert env-var precedence or cross-entry-point consistency.
- **Playbook Coverage:** EX-031, NEW-087
- **Recommended Fixes:** 1. Add a direct DB-path resolver test that toggles both env vars and checks standardized consumers. 2. Add the actual script consumers to the feature’s implementation table.

## F-13: Strict Zod schema validation
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. The feature promises both strict rejection and permissive `.passthrough()` mode [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/13-strict-zod-schema-validation.md:5`], but the tests only assert strict-mode rejection of unknown params [`mcp_server/tests/tool-input-schema.vitest.ts:162-178`]; they do not toggle `SPECKIT_STRICT_SCHEMAS=false` to verify the permissive branch in `mcp_server/schemas/tool-input-schemas.ts:13-17`. 2. The feature also promises stderr audit logging, but there is no test for `console.error` in `mcp_server/schemas/tool-input-schemas.ts:446-464`.
- **Playbook Coverage:** NEW-095
- **Recommended Fixes:** 1. Add strict-vs-passthrough mode tests. 2. Add an assertion that rejected inputs are logged to stderr.

## F-14: Dynamic server instructions at MCP initialization
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. The implementation exists in `mcp_server/context-server.ts:217-238` and startup wiring at `mcp_server/context-server.ts:985-990`, but I found no test assertions for `buildServerInstructions()` or `server.setInstructions()`. 2. The feature catalog also lists a nonexistent test, `mcp_server/tests/retry.vitest.ts` [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md:346`].
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Add a focused regression for dynamic initialization content and stale-memory warnings. 2. Remove the nonexistent `retry.vitest.ts` entry from the feature catalog.

## F-15: Warm server / daemon mode
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. The deferred status is accurate (`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md:5`), and runtime still uses stdio in `mcp_server/context-server.ts:997-999`, but the feature catalog’s implementation/test tables are massively over-inclusive for a non-implemented feature and include a nonexistent `mcp_server/tests/retry.vitest.ts` [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md:348`].
- **Test Gaps:** 1. Existing coverage only proves stdio remains active (`mcp_server/tests/context-server.vitest.ts:1335-1337`); there is no daemon/HTTP transport coverage, which is expected for a deferred feature.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Move this deferred item to a decision/deferred catalog or shrink the file tables to the few files that prove stdio remains the active transport.

## F-16: Backend storage adapter abstraction
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** NONE

## F-17: Cross-process DB hot rebinding
- **Status:** FAIL
- **Code Issues:** 1. `checkDatabaseUpdated()` advances `lastDbCheck` before `reinitializeDatabase()` succeeds, so a failed rebind suppresses retries for the same marker timestamp and can leave the process on stale DB handles [`mcp_server/core/db-state.ts:103-115`].
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. The feature promises robust, concurrency-safe hot rebinding [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/17-cross-process-db-hot-rebinding.md:5`], but the failed-reinit path above breaks that guarantee.
- **Test Gaps:** 1. The only listed test covers successful graph-search rebinding [`mcp_server/tests/db-state-graph-reinit.vitest.ts:9-42`]. 2. There is no coverage for marker-file retries after failure, mutex contention, embedding-readiness polling, or constitutional-cache lifecycle.
- **Playbook Coverage:** NEW-112
- **Recommended Fixes:** 1. Only advance `lastDbCheck` after `reinitializeDatabase()` completes successfully, or roll it back on failure. 2. Add failure-path tests for repeated marker-file retries and concurrent callers.

## F-18: Atomic write-then-index API
- **Status:** FAIL
- **Code Issues:** 1. `atomicSaveMemory()` is explicitly “NOT truly atomic”; it passes a no-op `dbOperation` to `executeAtomicSave()` and performs async indexing only after the file write succeeds [`mcp_server/handlers/memory-save.ts:392-445`]. 2. `executeAtomicSave()` itself documents file-system atomicity plus optional synchronous DB work, not a guaranteed file+index transaction [`mcp_server/lib/storage/transaction-manager.ts:189-246`].
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. The feature doc says `memory_save` couples file writing and database indexing in one transactional unit [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/18-atomic-write-then-index-api.md:5-7`], but the handler intentionally allows “file saved, indexing failed” partial success [`mcp_server/handlers/memory-save.ts:435-445`].
- **Test Gaps:** 1. The listed tests [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/18-atomic-write-then-index-api.md:19-24`] only cover transaction-manager primitives; they do not assert handler-level atomicity or rollback behavior for `memory_save`.
- **Playbook Coverage:** NEW-115
- **Recommended Fixes:** 1. Either redesign `memory_save` around a truly transactional staging/indexing flow, or rewrite the feature description to match best-effort indexing. 2. Add handler-level failure-injection tests that distinguish file-write success, DB commit success, and embedding/index failure.

## F-19: Embedding retry orchestrator
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. The retry manager itself is well covered (`mcp_server/tests/retry-manager.vitest.ts:303-358`, `mcp_server/tests/retry-manager.vitest.ts:400-456`) and index-refresh covers pending/retry states (`mcp_server/tests/index-refresh.vitest.ts:40-145`), but the feature’s claimed `memory_save`/`memory_index_scan` integration path [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/19-embedding-retry-orchestrator.md:5-7`] is not tested end to end. 2. No listed test proves that provider failure during save or index-scan leaves the memory retrievable lexically before retry recovery.
- **Playbook Coverage:** NEW-111
- **Recommended Fixes:** 1. Add an end-to-end save/index-scan failure test that verifies `embedding_status='pending'`, lexical fallback retrieval, and later retry recovery into `vec_memories`.

## F-20: 7-layer tool architecture metadata
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. The feature doc says the query classifier uses the layer metadata to route requests [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md:5-7`], but the runtime usages I found are in `mcp_server/handlers/memory-context.ts:460-461,598` and `mcp_server/context-server.ts:349`; I did not find classifier-side references during the audit sweep.
- **Test Gaps:** 1. `token-budget-enforcement.vitest.ts` conditionally returns early if `memoryContext.enforceTokenBudget` or `memoryContext.CONTEXT_MODES` are not exported [`mcp_server/tests/token-budget-enforcement.vitest.ts:65-79`, `mcp_server/tests/token-budget-enforcement.vitest.ts:105-122`, `mcp_server/tests/token-budget-enforcement.vitest.ts:177-196`], and `mcp_server/handlers/memory-context.ts` does not export either symbol [`mcp_server/handlers/memory-context.ts:154`, `mcp_server/handlers/memory-context.ts:244`]. 2. Much of the remaining coverage is source-text inspection rather than runtime behavior (`mcp_server/tests/token-budget-enforcement.vitest.ts:133-167`).
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Either wire layer metadata into the classifier as the feature text claims, or narrow the feature description to the current usage sites. 2. Test token-budget enforcement through public `memory_context` behavior instead of guarded early returns.

## F-21: Atomic pending-file recovery
- **Status:** FAIL
- **Code Issues:** 1. `recoverPendingFile()` renames a `_pending` file purely from filesystem state; it never checks whether the corresponding DB row exists before recovery [`mcp_server/lib/storage/transaction-manager.ts:317-342`]. 2. Startup recovery in `mcp_server/context-server.ts:417-445` just calls `recoverAllPendingFiles()` across scan locations, so the same DB-unaware recovery path runs on boot.
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. The feature doc says each pending file is checked against the database before rename [`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/14--pipeline-architecture/21-atomic-pending-file-recovery.md:5-7`], but the implementation performs no DB existence check at all.
- **Test Gaps:** 1. The listed tests only assert filesystem rename behavior [`mcp_server/tests/transaction-manager.vitest.ts:153-168`, `mcp_server/tests/transaction-manager.vitest.ts:373-390`]; they do not validate DB-backed recovery decisions or false-positive pending files.
- **Playbook Coverage:** NEW-115
- **Recommended Fixes:** 1. Add a DB existence check before renaming pending files. 2. Extend startup recovery tests to cover committed vs uncommitted pending files and false-positive `_pending` artifacts.
