---
title: "MCP Server Configuration Files"
description: "Search-weight reference config, cognitive co-activation pattern config, and documented active/legacy sections for memory scoring behavior."
trigger_phrases:
  - "search weights"
  - "mcp config"
  - "ranking configuration"
  - "cognitive config"
  - "co-activation pattern"
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

- `search-weights.json` — scoring weights and document-type multipliers for memory search ranking. Partly active, partly reference. Inline notes are the source of truth for what is currently loaded at runtime.
- `cognitive.ts` — cognitive co-activation pattern configuration. Loads regex pattern from environment variables (`SPECKIT_COGNITIVE_COACTIVATION_PATTERN`, `SPECKIT_COGNITIVE_COACTIVATION_FLAGS`) with Zod validation and regex safety checks. Exports `COGNITIVE_CONFIG` plus `loadCognitiveConfigFromEnv`/`safeParseCognitiveConfigFromEnv`; callers that need fresh environment values should prefer the loader functions over the import-time snapshot.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. IMPLEMENTED STATE


Current sections in `search-weights.json`:

- `documentTypeMultipliers`: active scoring reference for 10 document types (spec, decision_record, plan, tasks, implementation_summary, checklist, handover, memory, constitutional, scratch).
- `maxTriggersPerMemory`: active cap used by trigger-related flows.
- `smartRanking`: live config read by `vector-index-impl.ts` (weights: relevance 0.5, recency 0.3, access 0.2).
- `rrfFusion` and `crossEncoder`: removed (P2-05 audit, 2026-02-08) as dead config with no .ts references.

Exports from `cognitive.ts`:

- `CognitiveConfig` interface and `COGNITIVE_CONFIG` singleton.
- `loadCognitiveConfigFromEnv()` — throws on invalid env config.
- `safeParseCognitiveConfigFromEnv()` — returns result object with success/errors.

Important: canonical scoring behavior lives in TypeScript modules (not this README), primarily `lib/scoring/composite-scoring.ts` and related handlers.
Important: feature-flag and shared-memory enablement checks are resolved at runtime in helper functions such as `isSharedMemoryEnabled()` and the various `is*Enabled()` lookups under `lib/` and `handlers/`; do not treat this folder as a frozen startup snapshot of MCP behavior.


<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:hardening-notes -->
## 3. HARDENING NOTES


- Document-type multiplier coverage is aligned to schema/document-type indexing.
- Dead/legacy config sections are documented to reduce ambiguity.
- Treat this folder as config reference plus transition notes until legacy paths are fully removed.
- Runtime behavior is source-of-truth in the resolver helpers, not in import-time constants. `search-weights.json` is read live where referenced, and environment-gated behavior should be documented against the resolver function that reads it.


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
