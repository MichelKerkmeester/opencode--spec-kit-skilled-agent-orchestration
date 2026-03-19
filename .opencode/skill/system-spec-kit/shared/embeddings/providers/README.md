---
title: "Embedding Providers"
description: "Concrete embedding provider implementations for HuggingFace Local, OpenAI and Voyage AI backends."
trigger_phrases:
  - "embedding providers"
  - "hf local provider"
  - "openai embeddings"
  - "voyage embeddings"
---

# Embedding Providers

> Concrete embedding provider implementations for HuggingFace Local, OpenAI and Voyage AI backends.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. PROVIDER COMPARISON](#3--provider-comparison)
- [4. RELATED DOCUMENTS](#4--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Each file in this folder implements the `IEmbeddingProvider` interface from `shared/types.ts`. The parent `factory.ts` selects the active provider based on environment variables and available API keys.

All three providers share a common surface:

- `generateEmbedding(text)` -- produce a `Float32Array` vector from raw text
- `embedDocument(text)` / `embedQuery(text)` -- task-specific wrappers (some providers apply task prefixes)
- `warmup()` / `healthCheck()` -- connectivity and readiness checks
- `getMetadata()` / `getProfile()` -- introspection for logging and per-profile database path resolution

Error handling follows REQ-032: cloud providers retry transient failures three times with exponential backoff (1s, 2s, 4s) and fail fast on 401/403.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:structure -->
## 2. STRUCTURE

| File | Provider | Default Model | Dimensions | Notes |
| ---- | -------- | ------------- | ---------- | ----- |
| `hf-local.ts` | HuggingFace Local | `nomic-ai/nomic-embed-text-v1.5` | 768 | Offline fallback. Uses `@huggingface/transformers`. Applies nomic task prefixes (`search_document:`, `search_query:`). Auto-detects MPS (Apple Silicon) with CPU fallback. |
| `openai.ts` | OpenAI | `text-embedding-3-small` | 1536 | Cloud provider. Supports `text-embedding-3-large` (3072d) and `text-embedding-ada-002` (1536d). No task prefixes. |
| `voyage.ts` | Voyage AI | `voyage-4` | 1024 | Recommended provider (+8% retrieval quality). Uses Voyage `input_type` (`document`/`query`) for optimized retrieval. Supports Voyage 3 and 4 model families. |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:provider-comparison -->
## 3. PROVIDER COMPARISON

| Aspect | HF Local | OpenAI | Voyage |
| ------ | -------- | ------ | ------ |
| Cost | Free | ~$0.02/1M tokens | ~$0.06/1M tokens |
| Requires API key | No | Yes (`OPENAI_API_KEY`) | Yes (`VOYAGE_API_KEY`) |
| Offline capable | Yes | No | No |
| Retry logic | None (local) | `retryWithBackoff` | `retryWithBackoff` |
| Task differentiation | Nomic prefixes | Same method for both | `input_type` parameter |
| First-load overhead | ~274MB model download | None | None |
| Usage tracking | No | Yes (`getUsageStats()`) | Yes (`getUsageStats()`) |

<!-- /ANCHOR:provider-comparison -->

---

<!-- ANCHOR:related -->
## 4. RELATED DOCUMENTS

| Document | Purpose |
| -------- | ------- |
| [embeddings/README.md](../README.md) | Parent embeddings factory documentation |
| [embeddings/factory.ts](../factory.ts) | Provider selection and auto-detection logic |
| [embeddings/profile.ts](../profile.ts) | Per-profile database path generation |
| [shared/types.ts](../../types.ts) | `IEmbeddingProvider` interface and related types |
| [shared/utils/retry.ts](../../utils/retry.ts) | Retry-with-backoff used by OpenAI and Voyage |
| [shared/chunking.ts](../../chunking.ts) | Semantic chunking used by HF Local for long texts |

<!-- /ANCHOR:related -->

---
