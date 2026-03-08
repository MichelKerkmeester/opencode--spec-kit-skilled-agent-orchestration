# Atomic-save parity and partial-indexing hints

## Current Reality

`atomicSaveMemory()` now returns the same `postMutationHooks` envelope shape and UX hint payloads as the primary save path. The finalized follow-up pass also preserved structured partial-indexing guidance so callers can handle atomic-save outcomes with the same parsing and recovery flow used for standard saves.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token metrics display |
| `mcp_server/handlers/causal-links-processor.ts` | Handler | Causal link mutation handler |
| `mcp_server/handlers/handler-utils.ts` | Handler | Handler utility helpers |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp_server/handlers/memory-crud-utils.ts` | Handler | CRUD utility helpers |
| `mcp_server/handlers/mutation-hooks.ts` | Handler | Post-mutation hook dispatch |
| `mcp_server/handlers/pe-gating.ts` | Handler | Prediction error gating |
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
| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |
| `mcp_server/lib/cognitive/fsrs-scheduler.ts` | Lib | FSRS scheduling algorithm |
| `mcp_server/lib/cognitive/prediction-error-gate.ts` | Lib | Prediction error computation |
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/config/memory-types.ts` | Lib | Memory type definitions |
| `mcp_server/lib/config/type-inference.ts` | Lib | Memory type inference |
| `mcp_server/lib/errors/core.ts` | Lib | Error type definitions |
| `mcp_server/lib/errors/recovery-hints.ts` | Lib | Error recovery hints |
| `mcp_server/lib/extraction/entity-extractor.ts` | Lib | Entity extraction |
| `mcp_server/lib/graph/graph-signals.ts` | Lib | Graph momentum and depth signals |
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/parsing/memory-parser.ts` | Lib | Memory file parser |
| `mcp_server/lib/parsing/trigger-matcher.ts` | Lib | Trigger phrase matching |
| `mcp_server/lib/providers/embeddings.ts` | Lib | Embedding provider dispatch |
| `mcp_server/lib/providers/retry-manager.ts` | Lib | Provider retry management |
| `mcp_server/lib/response/envelope.ts` | Lib | Response envelope formatting |
| `mcp_server/lib/scoring/importance-tiers.ts` | Lib | Importance tier definitions |
| `mcp_server/lib/scoring/interference-scoring.ts` | Lib | Interference penalty scoring |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
| `mcp_server/lib/search/encoding-intent.ts` | Lib | Encoding intent classification |
| `mcp_server/lib/search/entity-linker.ts` | Lib | Cross-document entity linking |
| `mcp_server/lib/search/graph-search-fn.ts` | Lib | Graph degree scoring |
| `mcp_server/lib/search/memory-summaries.ts` | Lib | Memory summary generation |
| `mcp_server/lib/search/retrieval-directives.ts` | Lib | Constitutional retrieval injection |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |
| `mcp_server/lib/search/search-types.ts` | Lib | Search type definitions |
| `mcp_server/lib/search/spec-folder-hierarchy.ts` | Lib | Spec folder hierarchy traversal |
| `mcp_server/lib/search/tfidf-summarizer.ts` | Lib | TF-IDF extractive summarizer |
| `mcp_server/lib/search/vector-index-aliases.ts` | Lib | Vector index aliases |
| `mcp_server/lib/search/vector-index-mutations.ts` | Lib | Vector index mutations |
| `mcp_server/lib/search/vector-index-queries.ts` | Lib | Vector index query methods |
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Vector index schema |
| `mcp_server/lib/search/vector-index-store.ts` | Lib | Vector index storage |
| `mcp_server/lib/search/vector-index-types.ts` | Lib | Vector index type definitions |
| `mcp_server/lib/search/vector-index.ts` | Lib | Vector index facade |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | Causal edge storage |
| `mcp_server/lib/storage/consolidation.ts` | Lib | Lightweight consolidation |
| `mcp_server/lib/storage/incremental-index.ts` | Lib | Incremental indexing |
| `mcp_server/lib/storage/mutation-ledger.ts` | Lib | Mutation ledger |
| `mcp_server/lib/storage/reconsolidation.ts` | Lib | Memory reconsolidation |
| `mcp_server/lib/utils/canonical-path.ts` | Lib | Canonical path resolution |
| `mcp_server/lib/utils/format-helpers.ts` | Lib | Format utility helpers |
| `mcp_server/lib/utils/logger.ts` | Lib | Logger utility |
| `mcp_server/lib/utils/path-security.ts` | Lib | Path security validation |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod input schemas |
| `mcp_server/tool-schemas.ts` | Core | Tool schema definitions |
| `mcp_server/utils/batch-processor.ts` | Util | Batch processing utility |
| `mcp_server/utils/db-helpers.ts` | Util | Database helpers |
| `mcp_server/utils/index.ts` | Util | Module barrel export |
| `mcp_server/utils/json-helpers.ts` | Util | JSON utility helpers |
| `mcp_server/utils/tool-input-schema.ts` | Util | Tool Input Schema |
| `mcp_server/utils/validators.ts` | Util | Input validators |
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
| `shared/types.ts` | Shared | Type definitions |
| `shared/utils/path-security.ts` | Shared | Shared path security |
| `shared/utils/retry.ts` | Shared | Shared retry utility |
| `shared/utils/token-estimate.ts` | Shared | Token estimation utility |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/batch-processor.vitest.ts` | Batch processor tests |
| `mcp_server/tests/bm25-index.vitest.ts` | BM25 index operations |
| `mcp_server/tests/causal-edges-unit.vitest.ts` | Causal edge unit tests |
| `mcp_server/tests/causal-edges.vitest.ts` | Causal edge storage tests |
| `mcp_server/tests/co-activation.vitest.ts` | Co-activation spreading tests |
| `mcp_server/tests/cognitive-gaps.vitest.ts` | Cognitive gap analysis |
| `mcp_server/tests/config-cognitive.vitest.ts` | Cognitive config tests |
| `mcp_server/tests/consumption-logger.vitest.ts` | Consumption logger tests |
| `mcp_server/tests/content-hash-dedup.vitest.ts` | Content hash dedup tests |
| `mcp_server/tests/content-normalizer.vitest.ts` | Content normalization tests |
| `mcp_server/tests/embedding-cache.vitest.ts` | Embedding cache tests |
| `mcp_server/tests/embeddings.vitest.ts` | Embedding provider tests |
| `mcp_server/tests/encoding-intent.vitest.ts` | Encoding intent tests |
| `mcp_server/tests/entity-extractor.vitest.ts` | Entity extraction tests |
| `mcp_server/tests/entity-linker.vitest.ts` | Entity linking tests |
| `mcp_server/tests/envelope.vitest.ts` | Response envelope tests |
| `mcp_server/tests/eval-logger.vitest.ts` | Eval logger tests |
| `mcp_server/tests/feature-eval-graph-signals.vitest.ts` | Graph signal evaluation |
| `mcp_server/tests/fsrs-scheduler.vitest.ts` | FSRS scheduler tests |
| `mcp_server/tests/full-spec-doc-indexing.vitest.ts` | Full spec doc indexing |
| `mcp_server/tests/graph-search-fn.vitest.ts` | Graph search function tests |
| `mcp_server/tests/graph-signals.vitest.ts` | Graph signal computation |
| `mcp_server/tests/handler-memory-index-cooldown.vitest.ts` | Index cooldown validation |
| `mcp_server/tests/handler-memory-index.vitest.ts` | Index handler validation |
| `mcp_server/tests/hybrid-search-flags.vitest.ts` | Hybrid search flag behavior |
| `mcp_server/tests/importance-tiers.vitest.ts` | Importance tier tests |
| `mcp_server/tests/incremental-index-v2.vitest.ts` | Incremental index v2 tests |
| `mcp_server/tests/incremental-index.vitest.ts` | Incremental index tests |
| `mcp_server/tests/index-refresh.vitest.ts` | Index refresh tests |
| `mcp_server/tests/integration-session-dedup.vitest.ts` | Session dedup integration |
| `mcp_server/tests/interference.vitest.ts` | Interference scoring tests |
| `mcp_server/tests/mcp-response-envelope.vitest.ts` | MCP envelope tests |
| `mcp_server/tests/memory-parser-extended.vitest.ts` | Parser extended tests |
| `mcp_server/tests/memory-parser.vitest.ts` | Memory parser tests |
| `mcp_server/tests/memory-summaries.vitest.ts` | Summary generation tests |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/mutation-ledger.vitest.ts` | Mutation ledger tests |
| `mcp_server/tests/n3lite-consolidation.vitest.ts` | N3-lite consolidation tests |
| `mcp_server/tests/prediction-error-gate.vitest.ts` | PE gate tests |
| `mcp_server/tests/reconsolidation.vitest.ts` | Reconsolidation tests |
| `mcp_server/tests/recovery-hints.vitest.ts` | Recovery hint tests |
| `mcp_server/tests/regression-010-index-large-files.vitest.ts` | Large file indexing regression |
| `mcp_server/tests/retrieval-directives.vitest.ts` | Retrieval directive tests |
| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager tests |
| `mcp_server/tests/retry.vitest.ts` | Retry utility tests |
| `mcp_server/tests/rollout-policy.vitest.ts` | Rollout policy tests |
| `mcp_server/tests/score-normalization.vitest.ts` | Score normalization tests |
| `mcp_server/tests/scoring.vitest.ts` | General scoring tests |
| `mcp_server/tests/search-flags.vitest.ts` | Feature flag behavior |
| `mcp_server/tests/spec-folder-hierarchy.vitest.ts` | Folder hierarchy tests |
| `mcp_server/tests/tool-cache.vitest.ts` | Tool cache tests |
| `mcp_server/tests/tool-input-schema.vitest.ts` | Tool input schema tests |
| `mcp_server/tests/trigger-config-extended.vitest.ts` | Trigger config extended |
| `mcp_server/tests/trigger-matcher.vitest.ts` | Trigger matcher tests |
| `mcp_server/tests/trigger-setAttentionScore.vitest.ts` | Trigger attention scoring |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-normalization-roundtrip.vitest.ts` | Normalization roundtrip |
| `mcp_server/tests/unit-normalization.vitest.ts` | Normalization unit tests |
| `mcp_server/tests/unit-path-security.vitest.ts` | Path security unit tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |
| `mcp_server/tests/vector-index-impl.vitest.ts` | Vector index implementation |
| `shared/parsing/quality-extractors.test.ts` | Quality Extractors.Ts |

## Source Metadata

- Group: UX hooks automation (Phase 014)
- Source feature title: Atomic-save parity and partial-indexing hints
- Current reality source: feature_catalog.md
