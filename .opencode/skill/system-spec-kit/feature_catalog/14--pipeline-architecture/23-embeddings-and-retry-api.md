---
title: "Embeddings and Retry API"
description: "The embeddings and retry API exposes a stable provider-facing surface for embedding generation while pairing it with shared embedding lifecycle utilities and a background retry manager for failed vector creation."
---

# Embeddings and Retry API

## TABLE OF CONTENTS
- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW
The Embeddings and Retry API defines the provider-facing boundary for embedding work in this codebase. At the API layer, `mcp_server/api/providers.ts` deliberately exposes only a small stable surface: direct embedding generation, query embedding generation, embedding profile inspection, and a namespaced retry manager for recovery operations. That keeps scripts and callers insulated from internal provider module churn.

Behind that narrow facade, the requested source files show two complementary responsibilities. `shared/embeddings.ts` contains the lower-level embedding lifecycle mechanics such as weighted text preparation, caching, lazy provider initialization, batching, timeouts, and provider metadata access. `mcp_server/lib/providers/retry-manager.ts` handles the failure path, using queue state, retry backoff, sanitized provider errors, circuit breaking, and background processing so temporary embedding outages do not permanently strand records without vectors.

---
## 2. CURRENT REALITY
`mcp_server/api/providers.ts` is an `ARCH-1` stable re-export surface. It publishes `generateEmbedding`, `generateQueryEmbedding`, and `getEmbeddingProfile` from the internal providers layer, then re-exports the full retry manager namespace as `retryManager`. The file adds no behavior of its own; its job is to centralize the public contract so scripts import from `api/providers` instead of coupling themselves to `lib/` paths.

`shared/embeddings.ts` shows the concrete embedding mechanics used by the system's shared embedding layer. It defines `WeightedDocumentSections` and builds weighted document text by prioritizing title, decisions, outcomes, and general content, with decisions repeated 3x and outcomes 2x before truncation to budget. The module maintains an in-memory cache capped at 1000 entries, scopes cache keys by provider using a SHA-256 hash prefix, lazily creates a singleton provider on first use, and records initialization timing for diagnostics. Core generation functions include plain text embedding, document embedding, query embedding, clustering embedding, timeout-protected embedding, and batch embedding. Batch generation defaults to concurrency `5`, falls back to `5` if given an invalid concurrency value, waits `EMBEDDING_BATCH_DELAY_MS` or `100ms` between batches, and applies exponential backoff for `429`-style rate-limit failures up to three retries. The module also exports profile and device helpers, pre-warm support, cache statistics, provider metadata, a detected `MODEL_NAME`, `DEFAULT_MODEL_NAME`, and task prefixes for document, query, clustering, and classification workloads.

`mcp_server/lib/providers/retry-manager.ts` implements the recovery side of the API. It tracks `pending`, `retry`, `failed`, and `success` states, atomically claims retry candidates in `memory_index`, and uses retry backoff delays of 1 minute, 5 minutes, and 15 minutes with `MAX_RETRIES = 3`. The background job is configured by default for a 5-minute interval and a batch size of 5. It also maintains an in-memory health snapshot and a provider circuit breaker that opens after 5 consecutive failures and cools down for 120000ms. When retrying a memory, the manager normalizes content before embedding, checks the embedding cache using a content hash and model id, avoids provider calls while the circuit is open, sanitizes provider-facing failure messages into structured public codes such as `EMBEDDING_TIMEOUT`, `EMBEDDING_RATE_LIMIT`, and `EMBEDDING_PROVIDER_ERROR`, and on success updates `memory_index` plus replaces the row in `vec_memories` inside a transaction. If content cannot be loaded, the provider returns null, or repeated failures exceed the retry budget, the record is advanced through retry bookkeeping and can ultimately be marked `failed`.

---
## 3. SOURCE FILES
### Implementation
| File | Layer | Role |
|------|-------|------|
| `mcp_server/api/providers.ts` | API | Stable public facade for embedding calls and retry-manager namespace export |
| `shared/embeddings.ts` | Shared | Embedding substrate for weighted text construction, caching, lazy provider lifecycle, batching, and profile helpers |
| `mcp_server/lib/providers/retry-manager.ts` | Lib | Retry orchestration for failed embeddings, including queue claims, backoff, circuit breaker logic, sanitization, and background processing |

---
## 4. SOURCE METADATA
- Group: Pipeline architecture
- Source feature title: Embeddings and Retry API
- Source spec: Deep research remediation 2026-03-26
