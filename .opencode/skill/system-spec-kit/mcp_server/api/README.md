---
title: "MCP Server Public API"
description: "Stable public surface for external consumers including scripts, evals, and automation."
trigger_phrases:
  - "public api"
  - "api surface"
  - "eval api"
  - "search api"
---


# MCP Server Public API

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. AVAILABLE MODULES](#2--available-modules)
- [3. CONSUMER POLICY](#3--consumer-policy)
- [4. MIGRATION GUIDE](#4--migration-guide)
- [5. RELATED](#5--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `api/` directory provides a stable, well-bounded interface to `mcp_server/` internals. External consumers (especially `scripts/` and `scripts/evals/`) should import from `api/` rather than directly from `lib/`, `core/`, or `handlers/`.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:available-modules -->
## 2. AVAILABLE MODULES

| Module | Export | Purpose |
|--------|--------|---------|
| `index.ts` | Barrel export | Re-exports all public API modules |
| `eval.ts` | Evaluation API | Ablation framework, BM25 baseline, ground-truth loader, eval DB init |
| `indexing.ts` | Indexing bootstrap API | Runtime bootstrap + index-scan hooks for reindex orchestration |
| `search.ts` | Search API | Hybrid search, FTS5/BM25, and vector index access |
| `providers.ts` | Provider + retry API | Embedding generation, query embedding, profile access, and retry-queue |
| `storage.ts` | Storage init API | Checkpoint and access-tracker initialization |

<!-- /ANCHOR:available-modules -->
<!-- ANCHOR:consumer-policy -->
## 3. CONSUMER POLICY

- **Preferred**: `import { ... } from '@spec-kit/mcp-server/api'`
- **Preferred for targeted surfaces**: `import { ... } from '@spec-kit/mcp-server/api/<module>'`
- **Prohibited**: `import { ... } from '@spec-kit/mcp-server/{lib,core,handlers}*'` (internal)
- **Exception process**: Add to `scripts/evals/import-policy-allowlist.json` with owner and removal condition

<!-- /ANCHOR:consumer-policy -->
<!-- ANCHOR:migration-guide -->
## 4. MIGRATION GUIDE

To migrate from internal runtime imports to `api/*`:

1. Identify the `lib/`, `core/`, or `handlers/` import in your file
2. Check if the needed export exists in `api/` modules
3. Replace the import path with the narrowest public surface, for example `@spec-kit/mcp-server/api/indexing`
4. If the export is not available in `api/`, file a request to add it or register an exception

<!-- /ANCHOR:migration-guide -->
<!-- ANCHOR:related -->
## 5. RELATED

- [Architecture Boundaries](../../ARCHITECTURE.md)
- [Import Policy Allowlist](../../scripts/evals/import-policy-allowlist.json)
- `../core/README.md`
- `../handlers/README.md`
<!-- /ANCHOR:related -->
