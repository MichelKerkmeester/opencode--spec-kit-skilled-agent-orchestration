---
title: "Discovery Library: Spec Document Finder Seam"
description: "Library-level seam for spec document discovery imports."
trigger_phrases:
  - "spec document finder"
  - "discovery seam"
---

# Discovery Library: Spec Document Finder Seam

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. VALIDATION](#5--validation)
- [6. RELATED](#6--related)

---

## 1. OVERVIEW

`lib/discovery/` provides the library import seam for spec document discovery. It lets library modules import discovery behavior without reaching directly into handler internals.

Current state:

- Re-exports `findSpecDocuments` from the existing handler implementation.
- Re-exports the related discovery option and result types.
- Keeps the current behavior unchanged while correcting import direction for library callers.

---

## 2. DIRECTORY TREE

```text
discovery/
+-- spec-document-finder.ts  # Lib seam over handler-level discovery implementation
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `spec-document-finder.ts` | Re-exports `findSpecDocuments` and discovery types from `handlers/memory-index-discovery.js`. |

---

## 4. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | This seam is the only file in the folder and points to the existing handler implementation. |
| Exports | Exposes `findSpecDocuments`, `SpecDiscoveryOptions`, `DiscoveryFileList` and `DiscoveryCapExceeded`. |
| Ownership | Owns import direction only. Discovery behavior still lives in the handler module. |

---

## 5. VALIDATION

Run from the repository root.

```bash
npm test -- --runInBand
```

Expected result: Tests that import discovery through the library seam pass.

---

## 6. RELATED

- [`../README.md`](../README.md)
- [`../../handlers/README.md`](../../handlers/README.md)
