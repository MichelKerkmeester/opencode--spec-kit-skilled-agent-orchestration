---
title: "MCP Server Public API"
description: "Stable import surface for eval, indexing, search, providers, storage, and selected architecture helpers."
trigger_phrases:
  - "public api"
  - "api surface"
  - "stable imports"
---

# MCP Server Public API

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. AVAILABLE MODULES](#2--available-modules)
- [3. CONSUMER POLICY](#3--consumer-policy)
- [4. RELATED](#4--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`api/` is the supported import surface for external consumers such as scripts and eval tooling. The goal is to keep callers out of `lib/`, `handlers/`, and `core/` internals unless a deliberate exception is documented.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:available-modules -->
## 2. AVAILABLE MODULES

| Module | Surface |
|---|---|
| `eval.ts` | Ablation helpers, BM25 baseline helpers, ground-truth loading, and eval DB init |
| `indexing.ts` | Runtime bootstrap, embedding warmup, memory index scan, and shutdown helpers |
| `search.ts` | Hybrid search init/search, FTS5 BM25 helpers, and `vectorIndex` namespace |
| `providers.ts` | `generateEmbedding`, `generateQueryEmbedding`, `getEmbeddingProfile`, and `retryManager` |
| `storage.ts` | `initCheckpoints` and `initAccessTracker` |
| `index.ts` | Re-exports the modules above plus folder-discovery helpers, entity extraction, layer definitions, shared rollout metrics, and memory-roadmap capability flags |

Important `index.ts` extras:

- Folder-discovery helpers from `lib/search/folder-discovery`.
- Entity extraction helpers from `lib/extraction/entity-extractor`.
- Layer metadata from `lib/architecture/layer-definitions`.
- Shared rollout metrics/types from `lib/collab/shared-spaces`.
- Roadmap capability flags from `lib/config/capability-flags`.

<!-- /ANCHOR:available-modules -->
<!-- ANCHOR:consumer-policy -->
## 3. CONSUMER POLICY

- Prefer `@spec-kit/mcp-server/api` or the narrow `@spec-kit/mcp-server/api/<module>` path.
- Avoid direct imports from `lib/`, `handlers/`, or `core/` for script/runtime consumers.
- If a needed export is missing, add it here or document a temporary exception in the import-policy allowlist.

<!-- /ANCHOR:consumer-policy -->
<!-- ANCHOR:related -->
## 4. RELATED

- `../README.md`
- `../tests/README.md`
- `../../scripts/evals/import-policy-allowlist.json`

<!-- /ANCHOR:related -->
