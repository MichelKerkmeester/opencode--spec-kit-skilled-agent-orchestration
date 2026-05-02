---
title: "MCP Server Configuration"
description: "Configuration files for memory ranking weights and cognitive co-activation regex settings."
trigger_phrases:
  - "search weights"
  - "mcp config"
  - "ranking configuration"
  - "cognitive config"
  - "co-activation pattern"
---

# MCP Server Configuration

> Configuration inputs for memory search ranking and cognitive co-activation parsing.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. SURFACE](#2--surface)
- [3. EXPORTS](#3--exports)
- [4. ALLOWED IMPORTS](#4--allowed-imports)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES](#6--boundaries)
- [7. ENTRYPOINTS](#7--entrypoints)
- [8. VALIDATION](#8--validation)
- [9. RELATED](#9--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`mcp_server/configs/` stores configuration used by memory search and cognitive matching. JSON files hold data-only settings. TypeScript files validate environment-backed runtime settings before handlers and search modules consume them.

Runtime scoring rules still live in the modules that execute scoring. This folder documents config inputs and export contracts only.

Use this folder when changing static ranking defaults, trigger weight inputs, or cognitive regex environment parsing. Do not add runtime branching here unless the config file is the stable boundary and the caller owns behavior.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:surface -->
## 2. SURFACE

| Surface | Purpose |
|---|---|
| `search-weights.json` | Ranking weights, document-type multipliers and trigger caps used by memory search paths. |
| `cognitive.ts` | Environment-backed regex config for cognitive co-activation matching. |
| Environment variables | `SPECKIT_COGNITIVE_COACTIVATION_PATTERN` and `SPECKIT_COGNITIVE_COACTIVATION_FLAGS`. |

<!-- /ANCHOR:surface -->
<!-- ANCHOR:exports -->
## 3. EXPORTS

`cognitive.ts` exports:

- `CognitiveConfig`
- `COGNITIVE_CONFIG`
- `loadCognitiveConfigFromEnv()`
- `safeParseCognitiveConfigFromEnv()`

`search-weights.json` exports data through normal JSON imports or file reads. Keep the file valid JSON.

<!-- /ANCHOR:exports -->
<!-- ANCHOR:allowed-imports -->
## 4. ALLOWED IMPORTS

| Import | Rule |
|---|---|
| Zod | Allowed in `cognitive.ts` for environment validation. |
| Config consumers | Search and cognitive modules may import `cognitive.ts` or read `search-weights.json`. |
| Runtime constants | Keep runtime scoring constants in their owning search or scoring modules. |
| Side effects | Do not add DB, file write, network, or handler execution side effects to this folder. |

<!-- /ANCHOR:allowed-imports -->
<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `search-weights.json` | Data-only ranking and trigger configuration for memory search paths. |
| `cognitive.ts` | Regex config parsing, default values, validation errors and safety checks. |
| `README.md` | Folder contract for config shape and import rules. |

<!-- /ANCHOR:key-files -->
<!-- ANCHOR:boundaries -->
## 6. BOUNDARIES

| Boundary | Rule |
|---|---|
| Data ownership | Store portable search and cognitive config inputs here. |
| Behavior ownership | Keep ranking, search execution and memory mutations in their owning modules. |
| Runtime safety | Validate environment regex values before exposing them to callers. |
| Side effects | Keep config loading free of writes, network calls and handler dispatch. |

<!-- /ANCHOR:boundaries -->
<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

- Import `COGNITIVE_CONFIG` when a caller needs validated default cognitive matching settings.
- Call `loadCognitiveConfigFromEnv()` when tests or startup code need explicit environment parsing.
- Use `safeParseCognitiveConfigFromEnv()` when invalid regex input should return an error object instead of throwing.
- Read `search-weights.json` from search-ranking code that needs stable scoring inputs.

<!-- /ANCHOR:entrypoints -->
<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from the repository root:

```bash
node -e "JSON.parse(require('fs').readFileSync('.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json', 'utf8'))"
npm test -- --run .opencode/skill/system-spec-kit/mcp_server/tests/cognitive-config.vitest.ts
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/configs/README.md
```

Expected result: JSON parsing succeeds, cognitive config tests pass and README validation exits `0` with no HVR issues.

<!-- /ANCHOR:validation -->
<!-- ANCHOR:related -->
## 9. RELATED

- [Scoring modules](../lib/scoring/README.md)
- [Cognitive modules](../lib/cognitive/README.md)
- [Search handlers](../handlers/README.md)
- [Memory search reference](../../references/memory/memory_system.md)

<!-- /ANCHOR:related -->
