---
title: "Tools: Dispatch Layer"
description: "Dispatcher modules that route MCP tool names to typed handler calls."
trigger_phrases:
  - "tool dispatch"
  - "MCP tools"
  - "dispatch layer"
---


# Tools: Dispatch Layer

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. IMPLEMENTED STATE](#2--implemented-state)
- [3. HARDENING NOTES](#3--hardening-notes)
- [4. RELATED](#4--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

This section provides an overview of the Tools: Dispatch Layer directory.

`tools/` maps MCP tool names to handler functions.

- Central router: `dispatchTool()` in `index.ts`.
- Domain dispatchers: `context-tools.ts`, `memory-tools.ts`, `causal-tools.ts`, `checkpoint-tools.ts`, `lifecycle-tools.ts`.
- Shared typing and argument parsing: `types.ts`.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. IMPLEMENTED STATE


- Current footprint: 28 tools across 5 dispatch modules.
- Routing model: first dispatcher with `TOOL_NAMES.has(name)` handles the call.
- `parseArgs<T>()` is the single protocol-boundary cast point.
- Tool args include recent fields such as:
  - `includeSpecDocs` for `memory_index_scan`
  - `asyncEmbedding` for `memory_save`
  - cognitive/intent-related flags on search/context flows
  - `onlyComplete` and `includeSummary` for `memory_get_learning_history`


<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:hardening-notes -->
## 3. HARDENING NOTES


- Dispatch remains modular so new tools can be added without monolithic switch growth.
- Typed arg interfaces in `types.ts` reduce drift between schemas and handlers.
- L6/L7 lifecycle and causal tooling is now part of the default dispatcher chain.


<!-- /ANCHOR:hardening-notes -->
<!-- ANCHOR:related -->
## 4. RELATED


- `../handlers/README.md`
- `../tool-schemas.ts`
- `../../shared/types.ts`
<!-- /ANCHOR:related -->
