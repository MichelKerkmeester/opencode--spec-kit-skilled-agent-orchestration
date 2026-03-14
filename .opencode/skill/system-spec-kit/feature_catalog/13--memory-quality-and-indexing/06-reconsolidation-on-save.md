# Reconsolidation-on-save

## 1. OVERVIEW

Reconsolidation-on-save merges, supersedes or complements new memories with existing similar memories based on cosine similarity thresholds.

When you save a new memory that is very similar to one already stored, the system decides what to do with the overlap. If the two are nearly identical, it merges them into one stronger memory. If the new one contradicts the old one, the old one is retired and the new one takes over. If they are different enough, both are kept side by side. This keeps your memory collection clean and up to date instead of cluttered with redundant notes.

---

## 2. CURRENT REALITY

After embedding generation, the save pipeline checks the top-3 most similar memories in the same spec folder. Similarity at or above 0.88 triggers a merge where content is combined and the `importance_weight` is incremented via `Math.min(1.0, currentWeight + 0.1)`. Similarity between 0.75 and 0.88 triggers conflict resolution: the old memory is deprecated and a `supersedes` causal edge is created. Below 0.75, the memory stores as a new complement.

**Sprint 8 update:** The original merge logic referenced a non-existent `frequency_counter` column, which would have caused runtime crashes on reconsolidation. This was replaced with `importance_weight` merge logic that properly uses an existing column.

A checkpoint must exist for the spec folder before reconsolidation can run. When no checkpoint is found, the system logs a warning and skips reconsolidation rather than risking destructive merges without a safety net. Runs behind the `SPECKIT_RECONSOLIDATION` flag (default OFF, opt-in). Set `SPECKIT_RECONSOLIDATION=true` to enable.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/handlers/handler-utils.ts` | Handler | Handler utility helpers |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp_server/handlers/memory-crud-utils.ts` | Handler | CRUD utility helpers |
| `mcp_server/handlers/pe-gating.ts` | Handler | Prediction error gating |
| `mcp_server/handlers/save/db-helpers.ts` | Handler | Save DB helpers |
| `mcp_server/handlers/save/reconsolidation-bridge.ts` | Handler | Reconsolidation bridge |
| `mcp_server/handlers/save/types.ts` | Handler | Type definitions |
| `mcp_server/handlers/types.ts` | Handler | Type definitions |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/cognitive/fsrs-scheduler.ts` | Lib | FSRS scheduling algorithm |
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/config/memory-types.ts` | Lib | Memory type definitions |
| `mcp_server/lib/config/type-inference.ts` | Lib | Memory type inference |
| `mcp_server/lib/errors/core.ts` | Lib | Error type definitions |
| `mcp_server/lib/errors/recovery-hints.ts` | Lib | Error recovery hints |
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/parsing/memory-parser.ts` | Lib | Memory file parser |
| `mcp_server/lib/providers/embeddings.ts` | Lib | Embedding provider dispatch |
| `mcp_server/lib/scoring/importance-tiers.ts` | Lib | Importance tier definitions |
| `mcp_server/lib/scoring/interference-scoring.ts` | Lib | Interference penalty scoring |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
| `mcp_server/lib/search/encoding-intent.ts` | Lib | Encoding intent classification |
| `mcp_server/lib/search/graph-search-fn.ts` | Lib | Graph degree scoring |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |
| `mcp_server/lib/search/search-types.ts` | Lib | Search type definitions |
| `mcp_server/lib/search/spec-folder-hierarchy.ts` | Lib | Spec folder hierarchy traversal |
| `mcp_server/lib/search/vector-index-aliases.ts` | Lib | Vector index aliases |
| `mcp_server/lib/search/vector-index-mutations.ts` | Lib | Vector index mutations |
| `mcp_server/lib/search/vector-index-queries.ts` | Lib | Vector index query methods |
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Vector index schema |
| `mcp_server/lib/search/vector-index-store.ts` | Lib | Vector index storage |
| `mcp_server/lib/search/vector-index-types.ts` | Lib | Vector index type definitions |
| `mcp_server/lib/search/vector-index.ts` | Lib | Vector index facade |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | Causal edge storage |
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

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/batch-processor.vitest.ts` | Batch processor tests |
| `mcp_server/tests/bm25-index.vitest.ts` | BM25 index operations |
| `mcp_server/tests/causal-edges-unit.vitest.ts` | Causal edge unit tests |
| `mcp_server/tests/causal-edges.vitest.ts` | Causal edge storage tests |
| `mcp_server/tests/cognitive-gaps.vitest.ts` | Cognitive gap analysis |
| `mcp_server/tests/config-cognitive.vitest.ts` | Cognitive config tests |
| `mcp_server/tests/consumption-logger.vitest.ts` | Consumption logger tests |
| `mcp_server/tests/content-normalizer.vitest.ts` | Content normalization tests |
| `mcp_server/tests/embedding-cache.vitest.ts` | Embedding cache tests |
| `mcp_server/tests/embeddings.vitest.ts` | Embedding provider tests |
| `mcp_server/tests/encoding-intent.vitest.ts` | Encoding intent tests |
| `mcp_server/tests/eval-logger.vitest.ts` | Eval logger tests |
| `mcp_server/tests/fsrs-scheduler.vitest.ts` | FSRS scheduler tests |
| `mcp_server/tests/full-spec-doc-indexing.vitest.ts` | Full spec doc indexing |
| `mcp_server/tests/graph-search-fn.vitest.ts` | Graph search function tests |
| `mcp_server/tests/handler-memory-index-cooldown.vitest.ts` | Index cooldown validation |
| `mcp_server/tests/handler-memory-index.vitest.ts` | Index handler validation |
| `mcp_server/tests/hybrid-search-flags.vitest.ts` | Hybrid search flag behavior |
| `mcp_server/tests/importance-tiers.vitest.ts` | Importance tier tests |
| `mcp_server/tests/incremental-index-v2.vitest.ts` | Incremental index behavioral tests |
| `mcp_server/tests/incremental-index.vitest.ts` | Legacy deferred placeholder suite (skipped; not behavioral evidence) |
| `mcp_server/tests/index-refresh.vitest.ts` | Index refresh tests |
| `mcp_server/tests/interference.vitest.ts` | Interference scoring tests |
| `mcp_server/tests/memory-parser-extended.vitest.ts` | Parser extended tests |
| `mcp_server/tests/memory-parser.vitest.ts` | Memory parser tests |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/mutation-ledger.vitest.ts` | Mutation ledger tests |
| `mcp_server/tests/reconsolidation.vitest.ts` | Reconsolidation tests |
| `mcp_server/tests/recovery-hints.vitest.ts` | Recovery hint tests |
| `mcp_server/tests/regression-010-index-large-files.vitest.ts` | Large file indexing regression |
| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager tests |
| `mcp_server/tests/retry-manager.vitest.ts` | Retry utility tests |
| `mcp_server/tests/rollout-policy.vitest.ts` | Rollout policy tests |
| `mcp_server/tests/score-normalization.vitest.ts` | Score normalization tests |
| `mcp_server/tests/scoring.vitest.ts` | General scoring tests |
| `mcp_server/tests/search-flags.vitest.ts` | Feature flag behavior |
| `mcp_server/tests/spec-folder-hierarchy.vitest.ts` | Folder hierarchy tests |
| `mcp_server/tests/tool-input-schema.vitest.ts` | Tool input schema tests |
| `mcp_server/tests/trigger-config-extended.vitest.ts` | Trigger config extended |
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

---

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Reconsolidation-on-save
- Current reality source: feature_catalog.md
