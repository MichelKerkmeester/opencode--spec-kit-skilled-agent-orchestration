---
title: "Single and folder delete (memory_delete)"
description: "Covers the delete tool that supports both single-memory and bulk folder deletion with atomic transactions."
---

# Single and folder delete (memory_delete)

## 1. OVERVIEW

Covers the delete tool that supports both single-memory and bulk folder deletion with atomic transactions.

You can remove one memory at a time or clear out an entire folder at once. Before a big deletion, the system takes a snapshot so you can undo it if you change your mind. Deletions are all-or-nothing: either everything you asked to remove is gone or nothing changes at all. This prevents situations where only half the data gets deleted and the rest is left in a messy state.

---

## 2. CURRENT REALITY

Two deletion modes in one tool. Pass a numeric `id` for single delete or a `specFolder` string (with `confirm: true`) for bulk folder delete.

Single deletes run inside a database transaction: remove the memory record via `vectorIndex.deleteMemory(id)`, clean up associated causal graph edges via `causalEdges.deleteEdgesForMemory(id)` and record a mutation ledger entry. If any step fails, the entire transaction rolls back. This atomicity guarantee was added in Phase 018 (CR-P1-1) to prevent partial deletes from leaving orphaned data.

Bulk deletes by spec folder are more involved. The system first creates an auto-checkpoint with a timestamped name (like `pre-cleanup-2026-02-28T12-00-00`) so you can roll back if the deletion was a mistake. Then it deletes all matching memories inside a database transaction with per-memory causal edge cleanup and per-memory mutation ledger entries. The entire operation is atomic: either all memories in the folder are deleted or none are. The response includes the checkpoint name and a restore command hint.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/core/db-state.ts` | Core | Database state management |
| `mcp_server/core/index.ts` | Core | Module barrel export |
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token metrics display |
| `mcp_server/handlers/causal-links-processor.ts` | Handler | Causal link mutation handler |
| `mcp_server/handlers/chunking-orchestrator.ts` | Handler | Chunking orchestration |
| `mcp_server/handlers/handler-utils.ts` | Handler | Handler utility helpers |
| `mcp_server/handlers/memory-crud-delete.ts` | Handler | Delete handler |
| `mcp_server/handlers/memory-crud-health.ts` | Handler | Health diagnostics handler |
| `mcp_server/handlers/memory-crud-list.ts` | Handler | List handler |
| `mcp_server/handlers/memory-crud-stats.ts` | Handler | Statistics handler |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp_server/handlers/memory-crud-update.ts` | Handler | Update handler |
| `mcp_server/handlers/memory-crud-utils.ts` | Handler | CRUD utility helpers |
| `mcp_server/handlers/memory-crud.ts` | Handler | CRUD dispatch handler |
| `mcp_server/handlers/memory-index-alias.ts` | Handler | Index alias handler |
| `mcp_server/handlers/memory-index-discovery.ts` | Handler | Spec doc discovery handler |
| `mcp_server/handlers/memory-index.ts` | Handler | Index scan handler |
| `mcp_server/handlers/memory-save.ts` | Handler | Save handler entry point |
| `mcp_server/handlers/mutation-hooks.ts` | Handler | Post-mutation hook dispatch |
| `mcp_server/handlers/pe-gating.ts` | Handler | Prediction error gating |
| `mcp_server/handlers/quality-loop.ts` | Handler | Quality loop handler |
| `mcp_server/handlers/save/create-record.ts` | Handler | Record creation logic |
| `mcp_server/handlers/save/db-helpers.ts` | Handler | Save DB helpers |
| `mcp_server/handlers/save/dedup.ts` | Handler | Deduplication logic |
| `mcp_server/handlers/save/embedding-pipeline.ts` | Handler | Embedding generation pipeline |
| `mcp_server/handlers/save/index.ts` | Handler | Module barrel export |
| `mcp_server/handlers/save/pe-orchestration.ts` | Handler | PE orchestration flow |
| `mcp_server/handlers/save/post-insert.ts` | Handler | Post-insert processing |
| `mcp_server/handlers/save/reconsolidation-bridge.ts` | Handler | Reconsolidation bridge |
| `mcp_server/handlers/save/response-builder.ts` | Handler | Response construction |
| `mcp_server/handlers/save/types.ts` | Handler | Type definitions |
| `mcp_server/handlers/types.ts` | Handler | Type definitions |
| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface UX hook |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/cache/tool-cache.ts` | Lib | Tool Cache |
| `mcp_server/lib/chunking/anchor-chunker.ts` | Lib | Anchor-aware chunking |
| `mcp_server/lib/chunking/chunk-thinning.ts` | Lib | Chunk thinning |
| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |
| `mcp_server/lib/cognitive/fsrs-scheduler.ts` | Lib | FSRS scheduling algorithm |
| `mcp_server/lib/cognitive/prediction-error-gate.ts` | Lib | Prediction error computation |
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/config/memory-types.ts` | Lib | Memory type definitions |
| `mcp_server/lib/config/type-inference.ts` | Lib | Memory type inference |
| `mcp_server/lib/errors.ts` | Lib | Errors |
| `mcp_server/lib/errors/core.ts` | Lib | Error type definitions |
| `mcp_server/lib/errors/index.ts` | Lib | Module barrel export |
| `mcp_server/lib/errors/recovery-hints.ts` | Lib | Error recovery hints |
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |
| `mcp_server/lib/extraction/entity-extractor.ts` | Lib | Entity extraction |
| `mcp_server/lib/graph/graph-signals.ts` | Lib | Graph momentum and depth signals |
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/parsing/memory-parser.ts` | Lib | Memory file parser |
| `mcp_server/lib/parsing/trigger-matcher.ts` | Lib | Trigger phrase matching |
| `mcp_server/lib/providers/embeddings.ts` | Lib | Embedding provider dispatch |
| `mcp_server/lib/providers/retry-manager.ts` | Lib | Provider retry management |
| `mcp_server/lib/response/envelope.ts` | Lib | Response envelope formatting |
| `mcp_server/lib/scoring/folder-scoring.ts` | Lib | Folder scoring implementation |
| `mcp_server/lib/scoring/importance-tiers.ts` | Lib | Importance tier definitions |
| `mcp_server/lib/scoring/interference-scoring.ts` | Lib | Interference penalty scoring |
| `mcp_server/lib/scoring/mpab-aggregation.ts` | Lib | MPAB chunk aggregation |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
| `mcp_server/lib/search/channel-enforcement.ts` | Lib | Channel enforcement |
| `mcp_server/lib/search/channel-representation.ts` | Lib | Channel min-representation |
| `mcp_server/lib/search/confidence-truncation.ts` | Lib | Confidence-based truncation |
| `mcp_server/lib/search/dynamic-token-budget.ts` | Lib | Token budget computation |
| `mcp_server/lib/search/encoding-intent.ts` | Lib | Encoding intent classification |
| `mcp_server/lib/search/entity-linker.ts` | Lib | Cross-document entity linking |
| `mcp_server/lib/search/folder-discovery.ts` | Lib | Spec folder auto-discovery |
| `mcp_server/lib/search/folder-relevance.ts` | Lib | Folder relevance scoring |
| `mcp_server/lib/search/graph-search-fn.ts` | Lib | Graph degree scoring |
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Multi-channel search orchestration |
| `mcp_server/lib/search/intent-classifier.ts` | Lib | Intent detection |
| `mcp_server/lib/search/local-reranker.ts` | Lib | Local GGUF reranker |
| `mcp_server/lib/search/memory-summaries.ts` | Lib | Memory summary generation |
| `mcp_server/lib/search/query-classifier.ts` | Lib | Query complexity classification |
| `mcp_server/lib/search/query-router.ts` | Lib | Channel routing |
| `mcp_server/lib/search/retrieval-directives.ts` | Lib | Constitutional retrieval injection |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |
| `mcp_server/lib/search/search-types.ts` | Lib | Search type definitions |
| `mcp_server/lib/search/spec-folder-hierarchy.ts` | Lib | Spec folder hierarchy traversal |
| `mcp_server/lib/search/sqlite-fts.ts` | Lib | SQLite FTS5 interface |
| `mcp_server/lib/search/tfidf-summarizer.ts` | Lib | TF-IDF extractive summarizer |
| `mcp_server/lib/search/vector-index-aliases.ts` | Lib | Vector index aliases |
| `mcp_server/lib/search/vector-index-mutations.ts` | Lib | Vector index mutations |
| `mcp_server/lib/search/vector-index-queries.ts` | Lib | Vector index query methods |
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Vector index schema |
| `mcp_server/lib/search/vector-index-store.ts` | Lib | Vector index storage |
| `mcp_server/lib/search/vector-index-types.ts` | Lib | Vector index type definitions |
| `mcp_server/lib/search/vector-index.ts` | Lib | Vector index facade |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | Causal edge storage |
| `mcp_server/lib/storage/checkpoints.ts` | Lib | Checkpoint storage |
| `mcp_server/lib/storage/history.ts` | Lib | Per-memory delete history writes |
| `mcp_server/lib/storage/consolidation.ts` | Lib | Lightweight consolidation |
| `mcp_server/lib/storage/incremental-index.ts` | Lib | Incremental indexing |
| `mcp_server/lib/storage/mutation-ledger.ts` | Lib | Mutation ledger |
| `mcp_server/lib/storage/reconsolidation.ts` | Lib | Memory reconsolidation |
| `mcp_server/lib/storage/transaction-manager.ts` | Lib | Transaction management |
| `mcp_server/lib/utils/canonical-path.ts` | Lib | Canonical path resolution |
| `mcp_server/lib/utils/format-helpers.ts` | Lib | Format utility helpers |
| `mcp_server/lib/utils/logger.ts` | Lib | Logger utility |
| `mcp_server/lib/utils/path-security.ts` | Lib | Path security validation |
| `mcp_server/lib/validation/preflight.ts` | Lib | Pre-flight validation |
| `mcp_server/lib/validation/save-quality-gate.ts` | Lib | Pre-storage quality gate |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod input schemas |
| `mcp_server/tool-schemas.ts` | Core | Tool schema definitions |
| `mcp_server/utils/batch-processor.ts` | Util | Batch processing utility |
| `mcp_server/utils/db-helpers.ts` | Util | Database helpers |
| `mcp_server/utils/index.ts` | Util | Module barrel export |
| `mcp_server/utils/json-helpers.ts` | Util | JSON utility helpers |
| `mcp_server/utils/tool-input-schema.ts` | Util | Tool Input Schema |
| `mcp_server/utils/validators.ts` | Util | Input validators |
| `shared/algorithms/adaptive-fusion.ts` | Shared | Adaptive fusion algorithm |
| `shared/algorithms/mmr-reranker.ts` | Shared | MMR reranking algorithm |
| `shared/algorithms/rrf-fusion.ts` | Shared | RRF fusion algorithm |
| `shared/chunking.ts` | Shared | Content chunking |
| `shared/config.ts` | Shared | Shared configuration |
| `shared/embeddings.ts` | Shared | Embedding utilities |
| `shared/embeddings/factory.ts` | Shared | Embedding provider factory |
| `shared/embeddings/profile.ts` | Shared | Embedding profile configuration |
| `shared/embeddings/providers/hf-local.ts` | Shared | HuggingFace local provider |
| `shared/embeddings/providers/openai.ts` | Shared | OpenAI embedding provider |
| `shared/embeddings/providers/voyage.ts` | Shared | Voyage embedding provider |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/parsing/quality-extractors.ts` | Shared | Quality signal extraction |
| `shared/scoring/folder-scoring.ts` | Shared | Shared folder scoring |
| `shared/types.ts` | Shared | Type definitions |
| `shared/utils/path-security.ts` | Shared | Shared path security |
| `shared/utils/retry.ts` | Shared | Shared retry utility |
| `shared/utils/token-estimate.ts` | Shared | Token estimation utility |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/adaptive-fusion.vitest.ts` | Adaptive fusion tests |
| `mcp_server/tests/batch-processor.vitest.ts` | Batch processor tests |
| `mcp_server/tests/bm25-index.vitest.ts` | BM25 index operations |
| `mcp_server/tests/causal-edges-unit.vitest.ts` | Causal edge unit tests |
| `mcp_server/tests/causal-edges.vitest.ts` | Causal edge storage tests |
| `mcp_server/tests/channel-enforcement.vitest.ts` | Channel enforcement tests |
| `mcp_server/tests/channel-representation.vitest.ts` | Channel representation tests |
| `mcp_server/tests/checkpoints-extended.vitest.ts` | Checkpoint extended tests |
| `mcp_server/tests/checkpoints-storage.vitest.ts` | Checkpoint storage tests |
| `mcp_server/tests/chunk-thinning.vitest.ts` | Chunk thinning tests |
| `mcp_server/tests/co-activation.vitest.ts` | Co-activation spreading tests |
| `mcp_server/tests/cognitive-gaps.vitest.ts` | Cognitive gap analysis |
| `mcp_server/tests/confidence-truncation.vitest.ts` | Truncation behavior |
| `mcp_server/tests/config-cognitive.vitest.ts` | Cognitive config tests |
| `mcp_server/tests/consumption-logger.vitest.ts` | Consumption logger tests |
| `mcp_server/tests/content-hash-dedup.vitest.ts` | Content hash dedup tests |
| `mcp_server/tests/content-normalizer.vitest.ts` | Content normalization tests |
| `mcp_server/tests/db-state-graph-reinit.vitest.ts` | DB state graph reinit |
| `mcp_server/tests/dynamic-token-budget.vitest.ts` | Token budget computation |
| `mcp_server/tests/embedding-cache.vitest.ts` | Embedding cache tests |
| `mcp_server/tests/embeddings.vitest.ts` | Embedding provider tests |
| `mcp_server/tests/encoding-intent.vitest.ts` | Encoding intent tests |
| `mcp_server/tests/entity-extractor.vitest.ts` | Entity extraction tests |
| `mcp_server/tests/entity-linker.vitest.ts` | Entity linking tests |
| `mcp_server/tests/envelope.vitest.ts` | Response envelope tests |
| `mcp_server/tests/errors-comprehensive.vitest.ts` | Error handling tests |
| `mcp_server/tests/eval-db.vitest.ts` | Eval database operations |
| `mcp_server/tests/eval-logger.vitest.ts` | Eval logger tests |
| `mcp_server/tests/feature-eval-graph-signals.vitest.ts` | Graph signal evaluation |
| `mcp_server/tests/folder-discovery-integration.vitest.ts` | Folder discovery integration |
| `mcp_server/tests/folder-discovery.vitest.ts` | Folder discovery tests |
| `mcp_server/tests/folder-relevance.vitest.ts` | Folder relevance scoring |
| `mcp_server/tests/folder-scoring.vitest.ts` | Folder scoring tests |
| `mcp_server/tests/fsrs-scheduler.vitest.ts` | FSRS scheduler tests |
| `mcp_server/tests/full-spec-doc-indexing.vitest.ts` | Full spec doc indexing |
| `mcp_server/tests/graph-search-fn.vitest.ts` | Graph search function tests |
| `mcp_server/tests/graph-signals.vitest.ts` | Graph signal computation |
| `mcp_server/tests/handler-checkpoints.vitest.ts` | Checkpoint handler validation |
| `mcp_server/tests/handler-memory-crud.vitest.ts` | CRUD handler validation |
| `mcp_server/tests/handler-memory-index-cooldown.vitest.ts` | Index cooldown validation |
| `mcp_server/tests/handler-memory-index.vitest.ts` | Index handler validation |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Save handler validation |
| `mcp_server/tests/hybrid-search-context-headers.vitest.ts` | Context header injection |
| `mcp_server/tests/hybrid-search-flags.vitest.ts` | Hybrid search flag behavior |
| `mcp_server/tests/hybrid-search.vitest.ts` | Hybrid search orchestration |
| `mcp_server/tests/importance-tiers.vitest.ts` | Importance tier tests |
| `mcp_server/tests/incremental-index-v2.vitest.ts` | Incremental index behavioral tests |
| `mcp_server/tests/incremental-index.vitest.ts` | Focused incremental-index coverage (supplemental to `incremental-index-v2.vitest.ts`; concrete fast-path assertions) |
| `mcp_server/tests/integration-session-dedup.vitest.ts` | Session dedup integration |
| `mcp_server/tests/intent-classifier.vitest.ts` | Intent classification accuracy |
| `mcp_server/tests/interference.vitest.ts` | Interference scoring tests |
| `mcp_server/tests/local-reranker.vitest.ts` | Local reranker tests |
| `mcp_server/tests/mcp-response-envelope.vitest.ts` | MCP envelope tests |
| `mcp_server/tests/memory-crud-extended.vitest.ts` | CRUD extended scenarios |
| `mcp_server/tests/memory-parser-extended.vitest.ts` | Parser extended tests |
| `mcp_server/tests/memory-parser.vitest.ts` | Memory parser tests |
| `mcp_server/tests/memory-save-extended.vitest.ts` | Save extended scenarios |
| `mcp_server/tests/memory-save-ux-regressions.vitest.ts` | Save UX regression tests |
| `mcp_server/tests/memory-summaries.vitest.ts` | Summary generation tests |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/mmr-reranker.vitest.ts` | MMR reranker tests |
| `mcp_server/tests/mpab-aggregation.vitest.ts` | MPAB aggregation tests |
| `mcp_server/tests/mutation-ledger.vitest.ts` | Mutation ledger tests |
| `mcp_server/tests/n3lite-consolidation.vitest.ts` | N3-lite consolidation tests |
| `mcp_server/tests/prediction-error-gate.vitest.ts` | PE gate tests |
| `mcp_server/tests/preflight.vitest.ts` | Pre-flight validation tests |
| `mcp_server/tests/quality-loop.vitest.ts` | Quality loop tests |
| `mcp_server/tests/query-classifier.vitest.ts` | Query classification accuracy |
| `mcp_server/tests/query-router-channel-interaction.vitest.ts` | Channel interaction tests |
| `mcp_server/tests/query-router.vitest.ts` | Query routing logic |
| `mcp_server/tests/reconsolidation.vitest.ts` | Reconsolidation tests |
| `mcp_server/tests/recovery-hints.vitest.ts` | Recovery hint tests |
| `mcp_server/tests/regression-010-index-large-files.vitest.ts` | Large file indexing regression |
| `mcp_server/tests/reranker.vitest.ts` | Reranker dispatch tests |
| `mcp_server/tests/retrieval-directives.vitest.ts` | Retrieval directive tests |
| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager and shared retry utility tests |
| `mcp_server/tests/rollout-policy.vitest.ts` | Rollout policy tests |
| `mcp_server/tests/rrf-fusion.vitest.ts` | RRF fusion validation |
| `mcp_server/tests/save-quality-gate.vitest.ts` | Quality gate tests |
| `mcp_server/tests/score-normalization.vitest.ts` | Score normalization tests |
| `mcp_server/tests/scoring.vitest.ts` | General scoring tests |
| `mcp_server/tests/search-flags.vitest.ts` | Feature flag behavior |
| `mcp_server/tests/spec-folder-hierarchy.vitest.ts` | Folder hierarchy tests |
| `mcp_server/tests/sqlite-fts.vitest.ts` | SQLite FTS5 operations |
| `mcp_server/tests/token-budget.vitest.ts` | Token budget tests |
| `mcp_server/tests/tool-cache.vitest.ts` | Tool cache tests |
| `mcp_server/tests/tool-input-schema.vitest.ts` | Tool input schema tests |
| `mcp_server/tests/transaction-manager-extended.vitest.ts` | Transaction extended tests |
| `mcp_server/tests/transaction-manager.vitest.ts` | Transaction manager tests |
| `mcp_server/tests/trigger-config-extended.vitest.ts` | Trigger config extended |
| `mcp_server/tests/trigger-matcher.vitest.ts` | Trigger matcher tests |
| `mcp_server/tests/trigger-setAttentionScore.vitest.ts` | Trigger attention scoring |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-normalization-roundtrip.vitest.ts` | Normalization roundtrip |
| `mcp_server/tests/unit-normalization.vitest.ts` | Normalization unit tests |
| `mcp_server/tests/unit-path-security.vitest.ts` | Path security unit tests |
| `mcp_server/tests/unit-rrf-fusion.vitest.ts` | RRF unit tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |
| `mcp_server/tests/vector-index-impl.vitest.ts` | Vector index implementation |
| `shared/parsing/quality-extractors.test.ts` | Quality Extractors.Ts |

---

## 4. SOURCE METADATA

- Group: Mutation
- Source feature title: Single and folder delete (memory_delete)
- Current reality source: feature_catalog.md
