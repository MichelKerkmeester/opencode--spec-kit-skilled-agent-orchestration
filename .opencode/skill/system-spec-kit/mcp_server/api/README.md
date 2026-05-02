---
title: "MCP Server Public API"
description: "Stable import surface for eval, indexing, search, provider, storage and selected support modules."
trigger_phrases:
  - "public api"
  - "api surface"
  - "stable imports"
---

# MCP Server Public API

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. SURFACE](#2--surface)
- [3. EXPORTS](#3--exports)
- [4. ALLOWED IMPORTS](#4--allowed-imports)
- [5. KEY FILES](#5--key-files)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`mcp_server/api/` is the supported import surface for scripts, eval tooling and package consumers that need MCP server capabilities without reaching into internal folders. Add exports here only when an external caller needs a stable contract.

Internal MCP server code should import from its owning `lib/`, `handlers/`, `core/`, or local module instead of routing through this API barrel.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:surface -->
## 2. SURFACE

| Surface | Purpose |
|---|---|
| Eval | Ablation, BM25 baseline, ground-truth and eval DB helpers. |
| Indexing | Runtime startup, embedding warmup, spec-doc reindexing and shutdown helpers. |
| Search | Hybrid search, FTS5 BM25, vector index and search result types. |
| Providers | Embedding generation, embedding profile lookup and retry manager access. |
| Storage | Checkpoint and access tracker initialization. |
| Governance | Scope-governance audit and tier-downgrade helpers for scripts. |
| Discovery and metadata | Folder descriptions, entities, graph metadata and capability flags. |

<!-- /ANCHOR:surface -->
<!-- ANCHOR:exports -->
## 3. EXPORTS

`index.ts` re-exports focused modules from this folder plus selected support contracts:

- `eval.ts`: `runAblation`, BM25 helpers, ground-truth helpers, eval DB setup and related types.
- `indexing.ts`: indexing runtime lifecycle, graph metadata refresh, spec-doc reindexing and enrichment backfill.
- `search.ts`: hybrid search functions, FTS5 helpers and `vectorIndex`.
- `providers.ts`: embedding functions, embedding profile lookup and `retryManager`.
- `storage.ts`: checkpoint and access tracker initialization.
- Selected `lib/` exports for governance, folder discovery, entity extraction, graph metadata, validation, performance benchmarking, layer metadata and roadmap flags.

<!-- /ANCHOR:exports -->
<!-- ANCHOR:allowed-imports -->
## 4. ALLOWED IMPORTS

| Caller | Rule |
|---|---|
| External scripts | Prefer `@spec-kit/mcp-server/api` or `@spec-kit/mcp-server/api/<module>`. |
| Eval tooling | Import from this folder unless a local test fixture needs a private module. |
| Internal MCP server code | Import from the owning internal module, not from `api/index.ts`. |
| New public needs | Add a narrow export here or document the exception in the import-policy allowlist. |

<!-- /ANCHOR:allowed-imports -->
<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `index.ts` | Public barrel for package and script consumers. |
| `eval.ts` | Eval, ablation and baseline helpers. |
| `indexing.ts` | Indexing runtime and reindex helper surface. |
| `search.ts` | Hybrid, BM25 and vector search surface. |
| `providers.ts` | Embedding provider surface. |
| `storage.ts` | Storage initialization surface. |

<!-- /ANCHOR:key-files -->
<!-- ANCHOR:validation -->
## 6. VALIDATION

Run from the repository root:

```bash
npm test -- --run .opencode/skill/system-spec-kit/mcp_server/tests/import-policy.vitest.ts
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/api/README.md
```

Expected result: import policy tests pass and README validation exits `0` with no HVR issues.

<!-- /ANCHOR:validation -->
<!-- ANCHOR:related -->
## 7. RELATED

- [MCP server](../README.md)
- [MCP server tests](../tests/README.md)
- [Import policy allowlist](../../scripts/evals/import-policy-allowlist.json)

<!-- /ANCHOR:related -->
