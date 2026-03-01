---
title: "Scripts"
description: "Operational scripts for forced embedding reindex and maintenance workflows."
trigger_phrases:
  - "scripts"
  - "reindex embeddings"
  - "database maintenance"
---

# Scripts

> Operational entry points for maintenance tasks that run outside the normal MCP request lifecycle, such as forced full-reindex of embeddings.

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

`scripts/` contains compatibility wrappers for operational scripts that now live in the central `scripts/memory/` workspace.

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
scripts/
+-- reindex-embeddings.ts    # Compatibility wrapper -> ../../scripts/dist/memory/reindex-embeddings.js
+-- README.md                # This file
```

### File Inventory

| File                      | Purpose                                                                     | Key Behavior                                                       | Spec     |
| ------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------- |
| `reindex-embeddings.ts`   | Backward-compatible entry point for legacy `mcp_server/scripts` path         | Delegates to `scripts/dist/memory/reindex-embeddings.js` | Spec 138 |

<!-- /ANCHOR:structure -->

---

## 3. IMPLEMENTED STATE
<!-- ANCHOR:implemented-state -->

- Reindex implementation lives in `scripts/memory/reindex-embeddings.ts` and runs through current handlers (not a separate indexing implementation).
- Indexed scope follows current scan behavior, including memory, constitutional and spec-doc discovery defaults.
- Script prints a concise progress summary on stdout and exits non-zero on fatal startup failures.
- Module initialization order: `vectorIndex` -> `embeddings` -> `checkpointsLib` -> `accessTracker` -> `hybridSearch` -> `initDbState` -> `setEmbeddingModelReady`.

<!-- /ANCHOR:implemented-state -->

---

## 4. USAGE
<!-- ANCHOR:usage -->

```bash
npm run build
node scripts/dist/memory/reindex-embeddings.js
```

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
