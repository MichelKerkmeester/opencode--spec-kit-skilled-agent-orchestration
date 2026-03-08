# Embedding retry orchestrator

## Current Reality

The retry manager (`lib/providers/retry-manager.ts`) orchestrates background retry of failed embedding operations. When the primary embedding provider is unavailable or returns errors during `memory_save` or `memory_index_scan`, the affected memories are marked with `embedding_status = 'pending'` and stored without vectors (lexical-only fallback). The retry manager runs as a background job with configurable interval and batch size, picking up pending memories and re-attempting embedding generation.

Each retry attempt uses the embedding cache to avoid redundant API calls for content that was previously embedded successfully. The retry stats (`pending`, `retry`, `failed` counts) are exposed for monitoring. Failed memories increment a `retry_count` for progressive backoff. The orchestrator coordinates with the index-refresh module to ensure retried embeddings are properly inserted into `vec_memories`.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/providers/retry-manager.ts` | Lib | Background retry job with batch processing |
| `mcp_server/lib/providers/embeddings.ts` | Lib | Embedding provider dispatch |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding cache for retry dedup |
| `mcp_server/lib/storage/index-refresh.ts` | Lib | Index refresh for retried embeddings |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager tests |
| `mcp_server/tests/index-refresh.vitest.ts` | Index refresh tests |

## Source Metadata

- Group: Pipeline architecture
- Source feature title: Embedding retry orchestrator
- Current reality source: audit-D04 gap backfill
