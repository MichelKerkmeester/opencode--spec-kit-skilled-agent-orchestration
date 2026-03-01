---
title: "MCP Server Configuration Files"
description: "Search-weight reference config and documented active/legacy sections for memory scoring behavior."
trigger_phrases:
  - "search weights"
  - "mcp config"
  - "ranking configuration"
---


# MCP Server Configuration Files

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. IMPLEMENTED STATE](#2--implemented-state)
- [3. HARDENING NOTES](#3--hardening-notes)
- [4. VALIDATION](#4--validation)
- [5. RELATED](#5--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

This section provides an overview of the MCP Server Configuration Files directory.

`configs/` currently contains:

- `search-weights.json`

This file is partly active and partly legacy/reference. Its inline notes are the source of truth for what is currently loaded at runtime.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. IMPLEMENTED STATE


Current sections in `search-weights.json`:

- `documentTypeMultipliers` (Spec 126): active scoring reference for 11 document types.
- `maxTriggersPerMemory`: active cap used by trigger-related flows.
- `smartRanking`: marked as partially legacy in comments.
- `rrfFusion`: marked as dead config in comments.
- `crossEncoder`: marked as dead config in comments.

Important: canonical scoring behavior lives in TypeScript modules (not this README), primarily `lib/scoring/composite-scoring.ts` and related handlers.


<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:hardening-notes -->
## 3. HARDENING NOTES


- Spec 126 added document-type multiplier coverage aligned to schema/document-type indexing.
- Spec 125 audit documented dead/legacy config sections to reduce ambiguity.
- Treat this folder as config reference plus transition notes until legacy paths are fully removed.


<!-- /ANCHOR:hardening-notes -->
<!-- ANCHOR:validation -->
## 4. VALIDATION


```bash
node -e "JSON.parse(require('fs').readFileSync('.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json', 'utf8'))"
```


<!-- /ANCHOR:validation -->
<!-- ANCHOR:related -->
## 5. RELATED


- `../lib/scoring/composite-scoring.ts`
- `../handlers/memory-search.ts`
- `../../references/memory/memory_system.md`
<!-- /ANCHOR:related -->
