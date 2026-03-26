---
title: "5. Embedding and API"
description: "This document captures the implemented behavior, source references, and validation scope for 5. Embedding and API."
---

# 5. Embedding and API

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for 5. Embedding and API.

These settings pick which embedding and reranking providers the system uses and which credentials unlock them. They let you switch between cloud and local options without changing application logic.

---

## 2. CURRENT REALITY

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `COHERE_API_KEY` | _(none)_ | string | `lib/search/cross-encoder.ts` | API key for the Cohere reranker provider. When present, the cross-encoder reranker uses Cohere's rerank API. Falls back to local or Voyage reranker when absent. |
| `EMBEDDING_DIM` | _(provider default)_ | number | `lib/search/vector-index-store.ts`, `shared/embeddings/factory.ts` | Compatibility check and startup override for the stored vector dimension. Any positive explicit `EMBEDDING_DIM` value is honored first; otherwise runtime dimension selection comes from the active provider profile (Voyage 1024, OpenAI 1536, local 768 fallback). |
| `EMBEDDINGS_PROVIDER` | `'auto'` | string | `shared/embeddings/factory.ts` | Selects the embedding provider. Valid values include `'auto'`, `'openai'`, `'hf-local'`, and `'voyage'`. In `'auto'` mode, resolution precedence is explicit `EMBEDDINGS_PROVIDER` -> `VOYAGE_API_KEY` -> `OPENAI_API_KEY` -> local fallback. |
| `OPENAI_API_KEY` | _(none)_ | string | `shared/embeddings/factory.ts` | API key for the OpenAI embeddings provider. Required when `EMBEDDINGS_PROVIDER` is `'openai'` or when `'auto'` mode selects OpenAI as the available provider. |
| `RERANKER_LOCAL` | `false` | boolean | `lib/search/local-reranker.ts` | **IMPLEMENTED (Sprint 019).** When set to `'true'` (strict string equality, not truthy), enables the local GGUF reranker via `node-llama-cpp`. Requires model file on disk and sufficient total system memory (8GB default, 2GB with custom `SPECKIT_RERANKER_MODEL`). Sequential per-candidate inference; expect 200-400ms for top-20 on Apple Silicon (CHK-113). Falls back to the original candidate ordering on precondition failure or runtime inference error. |
| `VOYAGE_API_KEY` | _(none)_ | string | `shared/embeddings/factory.ts` | API key for the Voyage AI embeddings and reranker provider. In `'auto'` mode, Voyage is preferred over OpenAI when this key is present. |

---

## 3. SOURCE FILES

Source file references are included in the flag table above.

---

## 4. SOURCE METADATA

- Group: Feature Flag Reference
- Source feature title: 5. Embedding and API
- Current reality source: FEATURE_CATALOG.md
