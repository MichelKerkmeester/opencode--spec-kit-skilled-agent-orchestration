---
title: "Scripts"
description: "Operational scripts for forced embedding reindex and maintenance workflows."
trigger_phrases:
  - "scripts"
  - "reindex embeddings"
  - "database maintenance"
---

# Compatibility Wrappers (mcp_server/scripts)

This directory contains **only** compatibility wrappers that delegate to canonical implementations in `scripts/`. These are not canonical scripts and should not accumulate independent logic.

> Operational entry points for maintenance tasks that run outside the normal MCP request lifecycle, such as forced full-reindex of embeddings.

## Canonical Locations

- **Reindex operations:** [`scripts/memory/README.md`](../../scripts/memory/README.md)
- **Other operational scripts:** [`scripts/README.md`](../../scripts/README.md)

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. IMPLEMENTED STATE](#3--implemented-state)
- [4. USAGE](#4--usage)
- [5. RELATED](#5--related)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

`mcp_server/scripts/` contains wrapper source files for legacy entry points. The source-of-truth implementations live under the workspace-level `scripts/` package.

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
scripts/
+-- reindex-embeddings.ts    # Wrapper source -> ../../scripts/dist/memory/reindex-embeddings.js at runtime
+-- README.md                # This file
```

Build outputs are split across packages:

- Canonical implementation source: `../../scripts/memory/reindex-embeddings.ts`
- Canonical built runtime target: `../../scripts/dist/memory/reindex-embeddings.js`
- Legacy wrapper source: `reindex-embeddings.ts`
- Legacy wrapper build output: `../dist/scripts/reindex-embeddings.js`

### File Inventory

| File                      | Purpose                                                                     | Key Behavior                                                       | Spec     |
| ------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------- |
| `reindex-embeddings.ts`   | Backward-compatible entry point for legacy `mcp_server/scripts` path         | Delegates to `scripts/dist/memory/reindex-embeddings.js` | Spec 138 |

<!-- /ANCHOR:structure -->

---

## 3. IMPLEMENTED STATE
<!-- ANCHOR:implemented-state -->

- Reindex implementation lives in `scripts/memory/reindex-embeddings.ts` and runs through current handlers.
- Indexed scope follows current scan behavior, including memory, constitutional and spec-doc discovery defaults.
- Script prints a concise progress summary on stdout and exits non-zero on fatal startup failures.
- Module initialization order: `vectorIndex` -> `embeddings` -> `checkpointsLib` -> `accessTracker` -> `hybridSearch` -> `initDbState` -> `setEmbeddingModelReady`.
- Wrapper TypeScript in this directory compiles into `mcp_server/dist/scripts/`, then delegates to the canonical built JavaScript in `scripts/dist/`.

<!-- /ANCHOR:implemented-state -->

---

## 4. USAGE
<!-- ANCHOR:usage -->

```bash
# From .opencode/skill/system-spec-kit/
npm run build

# Preferred canonical entry point
node scripts/dist/memory/reindex-embeddings.js

# Legacy compatibility path for older callers
node mcp_server/dist/scripts/reindex-embeddings.js
```

Prefer the canonical `scripts/dist/` entry point in new automation. The legacy `mcp_server/dist/scripts/` path exists only for backward compatibility.

The script exits 0 on success. Any fatal startup error (missing DB, failed embedding warm-up) exits non-zero with an error message on stderr.

<!-- /ANCHOR:usage -->

---

## 5. RELATED
<!-- ANCHOR:related -->

- `../../scripts/memory/reindex-embeddings.ts`
- `../handlers/memory-index.ts`
- `../handlers/memory-save.ts`
- `../core/README.md`

<!-- /ANCHOR:related -->
