---
title: "Hooks"
description: "Memory-surface helper functions for context hint extraction and optional auto-surfacing."
trigger_phrases:
  - "hooks"
  - "memory surfacing"
  - "context injection"
---


# Hooks

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. IMPLEMENTED STATE](#2--implemented-state)
- [3. HARDENING NOTES](#3--hardening-notes)
- [4. RELATED](#4--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

This section provides an overview of the Hooks directory.

`hooks/` currently provides one helper module, `memory-surface.ts`, exported via `index.ts`.

- It is a utility layer for memory-aware context surfacing.
- It is not a standalone MCP hook registration system.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. IMPLEMENTED STATE


Main exports (camelCase):
- `extractContextHint(args)`
- `getConstitutionalMemories()`
- `clearConstitutionalCache()`
- `autoSurfaceMemories(contextHint)`
- `isMemoryAwareTool(toolName)`

Data shape:
- auto-surface output includes `constitutional`, `triggered`, `surfaced_at`, and `latencyMs`.
- `MEMORY_AWARE_TOOLS` currently includes `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.


<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:hardening-notes -->
## 3. HARDENING NOTES


- Constitutional cache uses a short TTL (60s) to reduce DB churn.
- Trigger matching uses fast phrase matching and returns empty/null safely on failures.
- Hook output remains compatible with current formatter and tool response contracts.


<!-- /ANCHOR:hardening-notes -->
<!-- ANCHOR:related -->
## 4. RELATED


- `../handlers/memory-triggers.ts`
- `../lib/parsing/trigger-matcher.ts`
- `../core/README.md`
<!-- /ANCHOR:related -->
