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

> Concrete implementations of the shared embedding provider contract. The parent embeddings package selects one provider, then callers use the same stable API regardless of backend.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. STABLE API](#3--stable-api)
- [4. BOUNDARIES](#4--boundaries)
- [5. VALIDATION](#5--validation)
- [6. RELATED DOCUMENTS](#6--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This folder contains provider adapters for the `IEmbeddingProvider` interface from `../../types.ts`. Providers hide backend-specific calls, model dimensions and task hints behind one embedding surface.

The parent package owns provider selection in `../factory.ts`. Files in this folder should stay focused on backend behavior: request shaping, retries, task prefixes, metadata and health checks.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:structure -->
## 2. STRUCTURE

```text
providers/
├── README.md      # This file
├── hf-local.ts    # HuggingFace local transformer provider
├── openai.ts      # OpenAI embeddings provider
└── voyage.ts      # Voyage AI embeddings provider
```

| File | Provider | Default model | Dimensions | Role |
| ---- | -------- | ------------- | ---------- | ---- |
| `hf-local.ts` | HuggingFace Local | `nomic-ai/nomic-embed-text-v1.5` | 768 | Offline provider with `search_document:` and `search_query:` prefixes |
| `openai.ts` | OpenAI | `text-embedding-3-small` | 1536 | Cloud provider with OpenAI usage tracking and retry handling |
| `voyage.ts` | Voyage AI | `voyage-4` | 1024 | Cloud provider using Voyage `input_type` for document and query embeddings |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:stable-api -->
## 3. STABLE API

Each provider implements the same public contract:

| Method | Purpose |
| ------ | ------- |
| `generateEmbedding(text)` | Return a `Float32Array` embedding for raw text |
| `embedDocument(text)` | Produce a document embedding with provider-specific document hints |
| `embedQuery(text)` | Produce a query embedding with provider-specific query hints |
| `warmup()` | Prepare local model state or verify remote readiness |
| `healthCheck()` | Return backend availability without changing caller control flow |
| `getMetadata()` | Report provider name, model and dimensions |
| `getProfile()` | Report profile data used by the embeddings package |

Cloud providers also expose usage data for logging and diagnostics. Do not call provider internals from outside `shared/embeddings`. Use the interface or factory entry points.

<!-- /ANCHOR:stable-api -->

---

<!-- ANCHOR:boundaries -->
## 4. BOUNDARIES

Import direction is inward from provider implementations to shared contracts and helpers:

- Providers may import shared types from `../../types.ts`.
- Providers may import retry and chunking helpers from shared packages.
- Parent embeddings files may import providers to construct the selected backend.
- Code outside `shared/embeddings` should not import `providers/*` directly.
- Provider files should not depend on MCP server endpoints, spec-folder workflows or database code.

Keep backend-specific behavior in the provider file that owns it. Put provider-neutral selection logic in `../factory.ts` and profile path logic in `../profile.ts`.

<!-- /ANCHOR:boundaries -->

---

<!-- ANCHOR:validation -->
## 5. VALIDATION

Run targeted provider tests or TypeScript checks after changing provider logic:

```bash
npm test -- --runInBand embeddings
npx tsc --noEmit
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/shared/embeddings/providers/README.md
```

For README-only edits, `validate_document.py` is the required file-level check.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 6. RELATED DOCUMENTS

| Document | Purpose |
| -------- | ------- |
| [embeddings/README.md](../README.md) | Parent embeddings package overview |
| [embeddings/factory.ts](../factory.ts) | Provider selection and auto-detection logic |
| [embeddings/profile.ts](../profile.ts) | Per-profile database path generation |
| [shared/types.ts](../../types.ts) | `IEmbeddingProvider` and shared retrieval types |
| [shared/utils/retry.ts](../../utils/retry.ts) | Retry helper used by cloud providers |

<!-- /ANCHOR:related -->

---
