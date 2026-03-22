---
title: "MCP Server Schemas"
description: "Centralized Zod validation schemas for all MCP tool inputs, with strict mode control, path traversal guards and typed error formatting."
trigger_phrases:
  - "tool input schemas"
  - "zod validation"
  - "schema validation"
  - "tool args"
  - "strict schemas"
---


# MCP Server Schemas

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. KEY CONCEPTS](#3--key-concepts)
- [4. RELATED DOCUMENTS](#4--related-documents)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`schemas/` holds a single file that defines every Zod validation schema used by MCP tool handlers. All 29+ tool schemas are declared here, exported through a `TOOL_SCHEMAS` registry and consumed by tool modules via the `validateToolArgs()` function.

Strict mode is on by default (`SPECKIT_STRICT_SCHEMAS !== 'false'`). When enabled, unknown parameters cause validation to fail instead of passing through silently.

Compatibility and aliased tools may reuse the same validator path instead of getting a duplicated schema entry, so this README uses `29+` rather than treating the file as a fixed one-schema-per-runtime-name list.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:structure -->
## 2. STRUCTURE

| File | Purpose |
|---|---|
| `tool-input-schemas.ts` | Defines Zod schemas for all 29+ MCP tools, exports `TOOL_SCHEMAS` registry, `validateToolArgs()`, `getToolSchema()`, `formatZodError()`, `getSchema()` and the `ToolSchemaValidationError` class |

No subfolders exist in this directory.

<!-- /ANCHOR:structure -->
<!-- ANCHOR:key-concepts -->
## 3. KEY CONCEPTS

**Schema factory (`getSchema`)** -- Wraps `z.object()` with strict/passthrough toggling based on the `SPECKIT_STRICT_SCHEMAS` env var. All tool schemas use this factory.

**Safe numeric preprocessing** -- A custom preprocessor that coerces numeric strings to numbers but rejects empty strings, `null` and `false` (which `z.coerce.number()` would silently convert to `0`).

**Path traversal guard** -- `pathString()` and `optionalPathString()` add a refinement that rejects paths containing `..` or null bytes.

**Shared validators** -- Reusable building blocks (`positiveInt`, `positiveIntMax`, `boundedNumber`, `intentEnum`, `importanceTierEnum`, `relationEnum`) keep per-tool schema definitions concise.

**Discriminated delete** -- `memory_delete` uses a `z.union` of two branches: single-record delete (requires `id`) and bulk folder delete (requires `specFolder` + `confirm: true`).

**Allowed-parameters map** -- `ALLOWED_PARAMETERS` mirrors the schema registry and feeds error messages so callers see the exact list of valid parameter names on validation failure.

**Error formatting** -- `formatZodError()` translates Zod issues into a structured `ToolSchemaValidationError` with tool name, human-readable message, issue summaries and unknown-parameter lists.

**Consumers** -- The schemas are imported directly by tool modules (`memory-tools.ts`, `checkpoint-tools.ts`, `causal-tools.ts`, `lifecycle-tools.ts`, `context-tools.ts`, `types.ts`) and re-exported through the parent-level `tool-schemas.ts` barrel.

<!-- /ANCHOR:key-concepts -->
<!-- ANCHOR:related-documents -->
## 4. RELATED DOCUMENTS

- `../tool-schemas.ts` -- barrel re-export and `ToolDefinition` interface
- `../tools/README.md` -- tool handler modules that consume these schemas
- `../core/README.md` -- shared runtime config and state
- `../tests/review-fixes.vitest.ts` -- test coverage for schema validation

<!-- /ANCHOR:related-documents -->
