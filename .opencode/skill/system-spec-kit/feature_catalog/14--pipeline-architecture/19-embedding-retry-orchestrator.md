---
title: "Embedding retry orchestrator"
description: "The embedding retry orchestrator runs background batch retries for memories with failed embedding generation, using cache dedup and progressive backoff."
---

# Embedding retry orchestrator

## 1. OVERVIEW

The embedding retry orchestrator runs background batch retries for memories with failed embedding generation, using cache dedup and progressive backoff.

Creating a numerical fingerprint for each memory requires calling an external service that can sometimes be unavailable. When that service fails, the memory is saved without a fingerprint and queued for a retry. A background worker periodically picks up these queued items and tries again. This way, a temporary service outage does not permanently prevent your memories from being fully searchable.

---

## 2. CURRENT REALITY

The retry manager (`lib/providers/retry-manager.ts`) orchestrates background retry of failed embedding operations. When the primary embedding provider is unavailable or returns errors during `memory_save` or `memory_index_scan`, the affected memories are marked with `embedding_status = 'pending'` and stored without vectors (lexical-only fallback). The retry manager runs as a background job with configurable interval and batch size, picking up pending memories and re-attempting embedding generation.

Each retry attempt uses the embedding cache to avoid redundant API calls for content that was previously embedded successfully. The retry stats (`pending`, `retry`, `failed` counts) are exposed for monitoring. Failed memories increment a `retry_count` for progressive backoff. On success, the retry manager itself updates `memory_index`, clears any prior `vec_memories` row for the memory, and inserts the refreshed embedding buffer as part of its transaction.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/providers/retry-manager.ts` | Lib | Background retry job with batch processing |
| `mcp_server/lib/providers/embeddings.ts` | Lib | Embedding provider dispatch |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding cache for retry dedup |
| `mcp_server/lib/search/vector-index.ts` | Lib | Memory row lookup and DB access used by retry orchestration |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager tests |

---

## 4. SOURCE METADATA

- Group: Pipeline architecture
- Source feature title: Embedding retry orchestrator
- Current reality source: audit-D04 gap backfill
