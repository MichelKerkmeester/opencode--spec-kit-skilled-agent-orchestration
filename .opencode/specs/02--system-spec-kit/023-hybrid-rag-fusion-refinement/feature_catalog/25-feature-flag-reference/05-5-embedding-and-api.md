# 5. Embedding and API

## Current Reality

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `COHERE_API_KEY` | _(none)_ | string | `tests/search-limits-scoring.vitest.ts` | API key for the Cohere reranker provider. When present, the cross-encoder reranker uses Cohere's rerank API. Falls back to local or Voyage reranker when absent. |
| `EMBEDDING_DIM` | _(provider default)_ | number | `lib/search/vector-index-impl.ts` | Override for the embedding vector dimension. When set, bypasses the provider's reported dimension. Use when loading a custom model with a non-standard dimension. |
| `EMBEDDINGS_PROVIDER` | `'auto'` | string | `lib/providers/embeddings.ts` | Selects the embedding provider. Valid values include `'auto'`, `'openai'`, `'hf-local'`, and `'voyage'`. In `'auto'` mode, the system selects based on available API keys (Voyage preferred over OpenAI, local fallback). |
| `OPENAI_API_KEY` | _(none)_ | string | `tests/embeddings.vitest.ts` | API key for the OpenAI embeddings provider. Required when `EMBEDDINGS_PROVIDER` is `'openai'` or when `'auto'` mode selects OpenAI as the available provider. |
| `RERANKER_LOCAL` | `false` | boolean | `lib/search/local-reranker.ts` | **IMPLEMENTATION CANDIDATE (Sprint 019; verification pending).** When set to `'true'` (strict string equality, not truthy), enables the local GGUF reranker via `node-llama-cpp`. Requires model file on disk and sufficient free memory (4GB default, 512MB with custom `SPECKIT_RERANKER_MODEL`). Falls back silently to algorithmic RRF scoring on any precondition failure. |
| `VOYAGE_API_KEY` | _(none)_ | string | `tests/embeddings.vitest.ts` | API key for the Voyage AI embeddings and reranker provider. In `'auto'` mode, Voyage is preferred over OpenAI when this key is present. |

## Source Metadata

- Group: Feature Flag Reference
- Source feature title: 5. Embedding and API
- Summary match found: No
- Current reality source: feature_catalog.md
