---
title: "Tools: Dispatch Layer"
description: "Typed MCP tool dispatch modules, schema validation, and quick-search delegation."
trigger_phrases:
  - "tool dispatch"
  - "memory quick search"
  - "typed tool args"
---

# Tools: Dispatch Layer

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. IMPLEMENTED STATE](#2--implemented-state)
- [3. RELATED](#3--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`tools/` is the MCP dispatch layer. It maps runtime tool names to validated handler calls and keeps the handler modules grouped by domain.

Files in this directory:

- `context-tools.ts` - dispatch for `memory_context`.
- `memory-tools.ts` - dispatch for search, quick search, triggers, save, CRUD, stats, health, validate, and bulk delete.
- `causal-tools.ts` - dispatch for causal graph operations.
- `checkpoint-tools.ts` - dispatch for checkpoints and learning-history style lifecycle helpers.
- `lifecycle-tools.ts` - dispatch for ingestion jobs and shared-memory lifecycle tools.
- `types.ts` - shared MCP response type aliases and typed arg shapes.
- `index.ts` - exports `ALL_DISPATCHERS` and `dispatchTool()`.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. IMPLEMENTED STATE

- Tool calls are schema-validated before handler dispatch via `validateToolArgs()` from `schemas/tool-input-schemas.ts`.
- `memory-tools.ts` implements the `memory_quick_search` delegation path by building a richer `memory_search` request and relabeling the returned envelope metadata back to `memory_quick_search`.
- `types.ts` remains the typed boundary for parsed handler arguments and MCP response aliases.
- `dispatchTool()` in `index.ts` routes in fixed dispatcher order and returns `null` only when no tool module claims the name.

<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:related -->
## 3. RELATED

- `../handlers/README.md`
- `../schemas/README.md`
- `../core/README.md`

<!-- /ANCHOR:related -->
