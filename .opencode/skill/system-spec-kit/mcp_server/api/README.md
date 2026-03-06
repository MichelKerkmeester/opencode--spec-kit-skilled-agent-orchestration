# MCP Server Public API

> Stable public surface for external consumers (scripts, evals, automation).

## Purpose

The `api/` directory provides a curated, stable interface to `mcp_server/` internals. External consumers (especially `scripts/` and `scripts/evals/`) should import from `api/` rather than directly from `lib/`, `core/`, or `handlers/`.

## Available Modules

| Module | Export | Purpose |
|--------|--------|---------|
| `index.ts` | Barrel export | Re-exports all public API modules |
| `eval.ts` | Evaluation API | Evaluation metrics and reporting |
| `indexing.ts` | Indexing bootstrap API | Runtime bootstrap + index-scan hooks for reindex orchestration |
| `search.ts` | Search API | Search operations for external callers |
| `providers.ts` | Provider + retry API | Embedding providers and retry-queue access |
| `storage.ts` | Storage init API | Checkpoint/access-tracker initialization |

## Consumer Policy

- **Preferred**: `import { ... } from '@spec-kit/mcp-server/api'`
- **Preferred for targeted surfaces**: `import { ... } from '@spec-kit/mcp-server/api/<module>'`
- **Prohibited**: `import { ... } from '@spec-kit/mcp-server/{lib,core,handlers}*'` (internal)
- **Exception process**: Add to `scripts/evals/import-policy-allowlist.json` with owner and removal condition

## Migration Guide

To migrate from internal runtime imports to `api/*`:

1. Identify the `lib/`, `core/`, or `handlers/` import in your file
2. Check if the needed export exists in `api/` modules
3. Replace the import path with the narrowest public surface, for example `@spec-kit/mcp-server/api/indexing`
4. If the export is not available in `api/`, file a request to add it or register an exception

## Reference

- [Architecture Boundaries](../../ARCHITECTURE_BOUNDARIES.md)
- [Import Policy Allowlist](../../scripts/evals/import-policy-allowlist.json)
