# Pre-storage quality gate

## 1. OVERVIEW

The pre-storage quality gate validates structural integrity, content quality and semantic deduplication before a memory enters the index.

This is the bouncer at the door before a memory enters the system. It checks three things: is the memory properly structured, is the content actually useful and is it different enough from what is already stored? If a memory fails any of these checks, it gets turned away. Without this gate, the system would fill up with junk and near-duplicates that pollute future search results.

---

## 2. CURRENT REALITY

The pre-storage quality gate still validates structure, content quality, and semantic deduplication before a memory enters the index, but it is no longer the first semantic stop in the save pipeline.

Current save ordering is:

1. parse and validate
2. quality-loop auto-fixes for recoverable formatting issues
3. shared semantic sufficiency gate
4. pre-storage quality gate
5. embedding, deduplication, and persistence

The shared sufficiency gate is now the earlier hard-block for memories that do not contain enough durable evidence to stand alone later. Those saves fail with `INSUFFICIENT_CONTEXT_ABORT` and do not depend on the older warn-only behavior of this gate.

The three-layer pre-storage quality gate then handles the memories that are already semantically sufficient:

- Layer 1: structural validity
- Layer 2: content quality scoring across five dimensions
- Layer 3: semantic deduplication against existing memories in the same spec folder

The gate still supports its existing warn-only rollout behavior for threshold tuning, but that warn-only mode does not override insufficiency rejection.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/providers/embeddings.ts` | Lib | Embedding provider dispatch |
| `mcp_server/lib/scoring/interference-scoring.ts` | Lib | Interference penalty scoring |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
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
| `mcp_server/lib/validation/save-quality-gate.ts` | Lib | Pre-storage quality gate |
| `mcp_server/handlers/memory-save.ts` | Handler | Orders quality-loop, insufficiency, and quality-gate evaluation before persistence |
| `shared/parsing/memory-sufficiency.ts` | Shared | Shared semantic sufficiency gate that now runs before this quality gate |
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
| `mcp_server/tests/cognitive-gaps.vitest.ts` | Cognitive gap analysis |
| `mcp_server/tests/config-cognitive.vitest.ts` | Cognitive config tests |
| `mcp_server/tests/consumption-logger.vitest.ts` | Consumption logger tests |
| `mcp_server/tests/content-normalizer.vitest.ts` | Content normalization tests |
| `mcp_server/tests/embedding-cache.vitest.ts` | Embedding cache tests |
| `mcp_server/tests/embeddings.vitest.ts` | Embedding provider tests |
| `mcp_server/tests/eval-logger.vitest.ts` | Eval logger tests |
| `mcp_server/tests/interference.vitest.ts` | Interference scoring tests |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager tests |
| `mcp_server/tests/retry-manager.vitest.ts` | Retry utility tests |
| `mcp_server/tests/save-quality-gate.vitest.ts` | Quality gate tests |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Save handler ordering and insufficiency hard-block coverage |
| `mcp_server/tests/score-normalization.vitest.ts` | Score normalization tests |
| `mcp_server/tests/scoring.vitest.ts` | General scoring tests |
| `mcp_server/tests/trigger-config-extended.vitest.ts` | Trigger config extended |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-normalization-roundtrip.vitest.ts` | Normalization roundtrip |
| `mcp_server/tests/unit-normalization.vitest.ts` | Normalization unit tests |
| `mcp_server/tests/unit-path-security.vitest.ts` | Path security unit tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |
| `mcp_server/tests/vector-index-impl.vitest.ts` | Vector index implementation |

---

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Pre-storage quality gate
- Current reality source: feature_catalog.md
