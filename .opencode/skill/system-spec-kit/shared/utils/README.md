---
title: "Shared Utilities"
description: "Shared utility modules for path validation, retry behavior, JSONC parsing and token estimation."
trigger_phrases:
  - "shared utilities"
  - "path validation helpers"
  - "retry utilities"
---

# Shared Utilities

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. PACKAGE TOPOLOGY](#2--package-topology)
- [3. KEY FILES](#3--key-files)
- [4. STABLE API](#4--stable-api)
- [5. BOUNDARIES](#5--boundaries)
- [6. ENTRYPOINTS](#6--entrypoints)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`utils/` owns small shared helpers used by scripts, MCP server code and shared package modules. Keep this folder focused on dependency-light functions that can run without database, network or MCP request context.

Current state:

- Path checks return a canonical path or `null`.
- Retry helpers classify errors before deciding whether to wait and retry.
- JSONC stripping preserves string content while removing comments.
- Token estimation uses one chars-per-token approximation.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:package-topology -->
## 2. PACKAGE TOPOLOGY

```text
utils/
+-- path-security.ts      # Filesystem path containment checks
+-- retry.ts              # Retry policy, backoff and error classification
+-- jsonc-strip.ts        # JSONC comment stripping
+-- token-estimate.ts     # Shared token count approximation
`-- README.md
```

Allowed dependency direction:

```text
callers -> utils/*
utils/retry.ts -> shared/types.ts
utils/path-security.ts -> node:path and node:fs
utils/jsonc-strip.ts -> no package imports
utils/token-estimate.ts -> no package imports
```

Disallowed dependency direction:

```text
utils/* -> mcp_server/*
utils/* -> scripts/*
utils/* -> database modules
utils/* -> network clients
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `path-security.ts` | Validates that a requested path stays inside one of the allowed base directories. |
| `retry.ts` | Runs async work with exponential backoff after classifying transient and permanent errors. |
| `jsonc-strip.ts` | Removes block and line comments from JSONC text while keeping comment-like text inside strings. |
| `token-estimate.ts` | Estimates token count with `Math.ceil(text.length / 4)` and returns `0` for empty input. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:stable-api -->
## 4. STABLE API

| Export | File | Contract |
|---|---|---|
| `validateFilePath(filePath, allowedBasePaths)` | `path-security.ts` | Returns a real resolved path when contained by an allowed base, else `null`. |
| `escapeRegex(value)` | `path-security.ts` | Escapes regex metacharacters in a string. |
| `retryWithBackoff(operation, options)` | `retry.ts` | Runs `operation` with configured retry attempts and throws enriched errors on failure. |
| `withRetry(fn, options)` | `retry.ts` | Returns a retrying wrapper for an async function. |
| `classifyError(error)` | `retry.ts` | Returns `transient`, `permanent` or `unknown` with `shouldRetry`. |
| `calculateBackoff(attempt, config)` | `retry.ts` | Calculates bounded exponential delay in milliseconds. |
| `stripJsoncComments(content)` | `jsonc-strip.ts` | Returns JSON text with comments removed. |
| `estimateTokenCount(text)` | `token-estimate.ts` | Returns an integer token estimate. |

Keep these exports pure where possible. Add new shared helpers only when two or more package areas need the same behavior.

<!-- /ANCHOR:stable-api -->

---

<!-- ANCHOR:boundaries -->
## 5. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | Use Node built-ins and shared type definitions only when needed. |
| Exports | Export functions, constants and types directly from the owning module. |
| State | Do not add long-lived process state to utility modules. |
| IO | Keep IO limited to path canonicalization in `path-security.ts`. |
| Ownership | Put domain-specific behavior in the caller package, not in `utils/`. |

Main flow:

```text
caller
  -> utility function
  -> local validation or calculation
  -> typed return value or thrown error
```

<!-- /ANCHOR:boundaries -->

---

<!-- ANCHOR:entrypoints -->
## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `path-security.ts` | Module | Path containment and regex escaping. |
| `retry.ts` | Module | Retry wrappers and error classification. |
| `jsonc-strip.ts` | Module | Config parsing support for JSONC input. |
| `token-estimate.ts` | Module | Shared token budget estimates. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/shared/utils/README.md
```

Expected result: the validator exits with code `0`.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

- [`../README.md`](../README.md)
- [`../types.ts`](../types.ts)
- [`../algorithms/README.md`](../algorithms/README.md)

<!-- /ANCHOR:related -->
