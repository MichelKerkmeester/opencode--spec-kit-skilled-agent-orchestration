# Contextual tree injection

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Contextual tree injection.

## 2. CURRENT REALITY

**IMPLEMENTED (Sprint 019).** Returned chunks are prefixed with hierarchical context headers in the format `[parent > child — description]` (max 100 chars), using existing PI-B3 cached spec folder descriptions. Gated by `SPECKIT_CONTEXT_HEADERS` (default `true`) and injected after Stage 4 token-budget truncation.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/errors/core.ts` | Lib | Error type definitions |
| `mcp_server/lib/errors/recovery-hints.ts` | Lib | Error recovery hints |
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/providers/embeddings.ts` | Lib | Embedding provider dispatch |
| `mcp_server/lib/scoring/interference-scoring.ts` | Lib | Interference penalty scoring |
| `mcp_server/lib/scoring/mpab-aggregation.ts` | Lib | MPAB chunk aggregation |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
| `mcp_server/lib/search/channel-enforcement.ts` | Lib | Channel enforcement |
| `mcp_server/lib/search/channel-representation.ts` | Lib | Channel min-representation |
| `mcp_server/lib/search/confidence-truncation.ts` | Lib | Confidence-based truncation |
| `mcp_server/lib/search/dynamic-token-budget.ts` | Lib | Token budget computation |
| `mcp_server/lib/search/folder-discovery.ts` | Lib | Spec folder auto-discovery |
| `mcp_server/lib/search/folder-relevance.ts` | Lib | Folder relevance scoring |
| `mcp_server/lib/search/graph-search-fn.ts` | Lib | Graph degree scoring |
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Multi-channel search orchestration |
| `mcp_server/lib/search/intent-classifier.ts` | Lib | Intent detection |
| `mcp_server/lib/search/local-reranker.ts` | Lib | Local GGUF reranker |
| `mcp_server/lib/search/query-classifier.ts` | Lib | Query complexity classification |
| `mcp_server/lib/search/query-router.ts` | Lib | Channel routing |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |
| `mcp_server/lib/search/search-types.ts` | Lib | Search type definitions |
| `mcp_server/lib/search/spec-folder-hierarchy.ts` | Lib | Spec folder hierarchy traversal |
| `mcp_server/lib/search/sqlite-fts.ts` | Lib | SQLite FTS5 interface |
| `mcp_server/lib/search/vector-index-aliases.ts` | Lib | Vector index aliases |
| `mcp_server/lib/search/vector-index-mutations.ts` | Lib | Vector index mutations |
| `mcp_server/lib/search/vector-index-queries.ts` | Lib | Vector index query methods |
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Vector index schema |
| `mcp_server/lib/search/vector-index-store.ts` | Lib | Vector index storage |
| `mcp_server/lib/search/vector-index-types.ts` | Lib | Vector index type definitions |
| `mcp_server/lib/search/vector-index.ts` | Lib | Vector index facade |
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
| `shared/types.ts` | Shared | Type definitions |
| `shared/utils/path-security.ts` | Shared | Shared path security |
| `shared/utils/retry.ts` | Shared | Shared retry utility |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/adaptive-fusion.vitest.ts` | Adaptive fusion tests |
| `mcp_server/tests/batch-processor.vitest.ts` | Batch processor tests |
| `mcp_server/tests/bm25-index.vitest.ts` | BM25 index operations |
| `mcp_server/tests/channel-enforcement.vitest.ts` | Channel enforcement tests |
| `mcp_server/tests/channel-representation.vitest.ts` | Channel representation tests |
| `mcp_server/tests/channel.vitest.ts` | Channel general tests |
| `mcp_server/tests/co-activation.vitest.ts` | Co-activation spreading tests |
| `mcp_server/tests/cognitive-gaps.vitest.ts` | Cognitive gap analysis |
| `mcp_server/tests/confidence-truncation.vitest.ts` | Truncation behavior |
| `mcp_server/tests/config-cognitive.vitest.ts` | Cognitive config tests |
| `mcp_server/tests/consumption-logger.vitest.ts` | Consumption logger tests |
| `mcp_server/tests/content-normalizer.vitest.ts` | Content normalization tests |
| `mcp_server/tests/dynamic-token-budget.vitest.ts` | Token budget computation |
| `mcp_server/tests/embedding-cache.vitest.ts` | Embedding cache tests |
| `mcp_server/tests/embeddings.vitest.ts` | Embedding provider tests |
| `mcp_server/tests/eval-logger.vitest.ts` | Eval logger tests |
| `mcp_server/tests/folder-discovery-integration.vitest.ts` | Folder discovery integration |
| `mcp_server/tests/folder-discovery.vitest.ts` | Folder discovery tests |
| `mcp_server/tests/folder-relevance.vitest.ts` | Folder relevance scoring |
| `mcp_server/tests/full-spec-doc-indexing.vitest.ts` | Full spec doc indexing |
| `mcp_server/tests/graph-search-fn.vitest.ts` | Graph search function tests |
| `mcp_server/tests/handler-memory-index-cooldown.vitest.ts` | Index cooldown validation |
| `mcp_server/tests/handler-memory-index.vitest.ts` | Index handler validation |
| `mcp_server/tests/hybrid-search-context-headers.vitest.ts` | Context header injection |
| `mcp_server/tests/hybrid-search-flags.vitest.ts` | Hybrid search flag behavior |
| `mcp_server/tests/hybrid-search.vitest.ts` | Hybrid search orchestration |
| `mcp_server/tests/incremental-index-v2.vitest.ts` | Incremental index behavioral tests |
| `mcp_server/tests/incremental-index.vitest.ts` | Legacy deferred placeholder suite (skipped; not behavioral evidence) |
| `mcp_server/tests/index-refresh.vitest.ts` | Index refresh tests |
| `mcp_server/tests/intent-classifier.vitest.ts` | Intent classification accuracy |
| `mcp_server/tests/interference.vitest.ts` | Interference scoring tests |
| `mcp_server/tests/local-reranker.vitest.ts` | Local reranker tests |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/mmr-reranker.vitest.ts` | MMR reranker tests |
| `mcp_server/tests/mpab-aggregation.vitest.ts` | MPAB aggregation tests |
| `mcp_server/tests/query-classifier.vitest.ts` | Query classification accuracy |
| `mcp_server/tests/query-router-channel-interaction.vitest.ts` | Channel interaction tests |
| `mcp_server/tests/query-router.vitest.ts` | Query routing logic |
| `mcp_server/tests/recovery-hints.vitest.ts` | Recovery hint tests |
| `mcp_server/tests/regression-010-index-large-files.vitest.ts` | Large file indexing regression |
| `mcp_server/tests/reranker.vitest.ts` | Reranker dispatch tests |
| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager tests |
| `mcp_server/tests/retry-manager.vitest.ts` | Retry utility tests |
| `mcp_server/tests/rollout-policy.vitest.ts` | Rollout policy tests |
| `mcp_server/tests/rrf-fusion.vitest.ts` | RRF fusion validation |
| `mcp_server/tests/score-normalization.vitest.ts` | Score normalization tests |
| `mcp_server/tests/scoring.vitest.ts` | General scoring tests |
| `mcp_server/tests/search-flags.vitest.ts` | Feature flag behavior |
| `mcp_server/tests/spec-folder-hierarchy.vitest.ts` | Folder hierarchy tests |
| `mcp_server/tests/sqlite-fts.vitest.ts` | SQLite FTS5 operations |
| `mcp_server/tests/token-budget.vitest.ts` | Token budget tests |
| `mcp_server/tests/tool-input-schema.vitest.ts` | Tool input schema tests |
| `mcp_server/tests/trigger-config-extended.vitest.ts` | Trigger config extended |
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

## 4. SOURCE METADATA

- Group: Extra features (Sprint 019)
- Source feature title: Contextual tree injection
- Current reality source: feature_catalog.md
