---
title: "MCP Server Utilities"
description: "Shared validators, JSON helpers, batch processors, DB guards and tool input schema checks."
trigger_phrases:
  - "MCP utilities"
  - "input validation"
  - "batch processing"
  - "tool schema validation"
---

# MCP Server Utilities

> Shared validation, JSON, batch, database guard and tool schema helpers for MCP server code.

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

`mcp_server/utils/` contains small shared helpers used by handlers, tools and support modules. Keep this folder focused on pure validation, JSON handling, retry loops and error conversion.

Runtime features should live in their owning handler, tool, search, storage, or library folder. Add utilities here only when at least two MCP server surfaces share the same behavior.

Use this folder for stable helper contracts that reduce repeated guard code. Prefer local helpers inside a feature folder when the behavior has one owner or depends on feature-specific state.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:surface -->
## 2. SURFACE

| Surface | Purpose |
|---|---|
| Validators | Query length checks, input length checks and allowed-path validator creation. |
| JSON helpers | Safe parse, typed parse and stringify wrappers. |
| Batch processing | Retry-aware item processing, batch loops and sequential processing. |
| DB helpers | Database presence checks and error-message normalization. |
| Tool input schema | Runtime checks for required tool arguments, types, enums and constraints. |

<!-- /ANCHOR:surface -->
<!-- ANCHOR:exports -->
## 3. EXPORTS

`index.ts` exports:

- Types: `InputLimits`, `ValidatableArgs`, `SharedValidateFilePath`, `ExpectedJsonType`, `RetryOptions`, `RetryDefaults`, `RetryErrorResult`, `ItemProcessor`
- Constants: `INPUT_LIMITS`, `MAX_QUERY_LENGTH`, `BATCH_SIZE`, `BATCH_DELAY_MS`, `DEFAULT_RETRY_OPTIONS`
- Functions: `validateQuery`, `validateInputLengths`, `createFilePathValidator`, `getDefaultAllowedPaths`, `safeJsonParse`, `safeJsonStringify`, `safeJsonParseTyped`, `processWithRetry`, `processBatches`, `processSequentially`, `requireDb`, `toErrorMessage`, `validateToolInputSchema`

<!-- /ANCHOR:exports -->
<!-- ANCHOR:allowed-imports -->
## 4. ALLOWED IMPORTS

| Import | Rule |
|---|---|
| Shared MCP constants | Allowed for input limits and path policy. |
| Local utility modules | Allowed through direct imports or `index.ts`. |
| Database types | Allowed only for guard helpers that do not own queries. |
| Feature handlers | Do not import handlers from this folder. |
| Search and storage flows | Do not place feature orchestration in utilities. |

<!-- /ANCHOR:allowed-imports -->
<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `validators.ts` | Query, input-length and file-path validation helpers. |
| `json-helpers.ts` | Safe JSON parse and stringify helpers. |
| `batch-processor.ts` | Retry and batch execution helpers. |
| `db-helpers.ts` | DB guard and error-message helpers. |
| `tool-input-schema.ts` | Runtime schema checks for MCP tool input. |
| `index.ts` | Public barrel for utility imports. |

<!-- /ANCHOR:key-files -->
<!-- ANCHOR:boundaries -->
## 6. BOUNDARIES

| Boundary | Rule |
|---|---|
| Shared helpers | Keep utilities small, deterministic and reused by more than one caller. |
| Feature logic | Keep tool orchestration, storage queries and search ranking outside this folder. |
| Input handling | Validate limits, schemas and paths before handlers perform work. |
| Error handling | Convert unknown errors to safe messages without hiding caller context. |

<!-- /ANCHOR:boundaries -->
<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

- Import from `index.ts` for shared utility access from MCP server code.
- Use `validateToolInputSchema()` before invoking tool handlers with dynamic arguments.
- Use `createFilePathValidator()` when a handler needs workspace-safe path checks.
- Use `processBatches()` or `processSequentially()` for bounded item processing with retry behavior.

<!-- /ANCHOR:entrypoints -->
<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from the repository root:

```bash
npm test -- --run .opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/utils/README.md
```

Expected result: utility-related tests pass and README validation exits `0` with no HVR issues.

<!-- /ANCHOR:validation -->
<!-- ANCHOR:related -->
## 9. RELATED

- [MCP server core](../core/README.md)
- [MCP server handlers](../handlers/README.md)
- [MCP server schemas](../schemas/README.md)
- [MCP server tests](../tests/README.md)

<!-- /ANCHOR:related -->
