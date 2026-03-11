# Shared post-mutation hook wiring

## Current Reality

Phase 014 introduced a shared post-mutation hook path across mutation handlers. The same hook automation now runs after save, update, delete, and bulk-delete flows, including atomic save paths, so cache invalidation and follow-up behavior no longer drift by handler.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp_server/handlers/mutation-hooks.ts` | Handler | Post-mutation hook dispatch |
| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface UX hook |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/cache/tool-cache.ts` | Lib | Tool Cache |
| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |
| `mcp_server/lib/graph/graph-signals.ts` | Lib | Graph momentum and depth signals |
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/parsing/trigger-matcher.ts` | Lib | Trigger phrase matching |
| `mcp_server/lib/providers/embeddings.ts` | Lib | Embedding provider dispatch |
| `mcp_server/lib/scoring/interference-scoring.ts` | Lib | Interference penalty scoring |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
| `mcp_server/lib/search/retrieval-directives.ts` | Lib | Constitutional retrieval injection |
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
| `mcp_server/tests/bm25-index.vitest.ts` | BM25 index operations |
| `mcp_server/tests/co-activation.vitest.ts` | Co-activation spreading tests |
| `mcp_server/tests/cognitive-gaps.vitest.ts` | Cognitive gap analysis |
| `mcp_server/tests/config-cognitive.vitest.ts` | Cognitive config tests |
| `mcp_server/tests/consumption-logger.vitest.ts` | Consumption logger tests |
| `mcp_server/tests/content-normalizer.vitest.ts` | Content normalization tests |
| `mcp_server/tests/embedding-cache.vitest.ts` | Embedding cache tests |
| `mcp_server/tests/embeddings.vitest.ts` | Embedding provider tests |
| `mcp_server/tests/eval-logger.vitest.ts` | Eval logger tests |
| `mcp_server/tests/feature-eval-graph-signals.vitest.ts` | Graph signal evaluation |
| `mcp_server/tests/graph-signals.vitest.ts` | Graph signal computation |
| `mcp_server/tests/interference.vitest.ts` | Interference scoring tests |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/retrieval-directives.vitest.ts` | Retrieval directive tests |
| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager tests |
| `mcp_server/tests/retry-manager.vitest.ts` | Retry utility tests |
| `mcp_server/tests/score-normalization.vitest.ts` | Score normalization tests |
| `mcp_server/tests/scoring.vitest.ts` | General scoring tests |
| `mcp_server/tests/tool-cache.vitest.ts` | Tool cache tests |
| `mcp_server/tests/trigger-config-extended.vitest.ts` | Trigger config extended |
| `mcp_server/tests/trigger-matcher.vitest.ts` | Trigger matcher tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-normalization-roundtrip.vitest.ts` | Normalization roundtrip |
| `mcp_server/tests/unit-normalization.vitest.ts` | Normalization unit tests |
| `mcp_server/tests/unit-path-security.vitest.ts` | Path security unit tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |
| `mcp_server/tests/vector-index-impl.vitest.ts` | Vector index implementation |

## Source Metadata

- Group: UX hooks automation (Phase 014)
- Source feature title: Shared post-mutation hook wiring
- Current reality source: feature_catalog.md
