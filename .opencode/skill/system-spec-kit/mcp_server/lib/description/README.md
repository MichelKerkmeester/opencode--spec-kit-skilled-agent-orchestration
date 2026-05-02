---
title: "Description Library: Metadata Shape And Repair"
description: "Schema, merge and repair helpers for spec-folder description metadata."
trigger_phrases:
  - "description metadata"
  - "description.json repair"
---

# Description Library: Metadata Shape And Repair

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. DIRECTORY TREE](#3--directory-tree)
- [4. KEY FILES](#4--key-files)
- [5. BOUNDARIES AND FLOW](#5--boundaries-and-flow)
- [6. ENTRYPOINTS](#6--entrypoints)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

---

## 1. OVERVIEW

`lib/description/` owns the typed helpers for reading, merging and repairing spec-folder description metadata. It separates canonical generated fields from authored optional fields so updates can refresh derived data without dropping user-authored metadata.

Current state:

- Defines the accepted `description.json` shape with `zod` schemas.
- Preserves known authored keys and unknown pass-through keys during merges.
- Provides a small repair helper that applies canonical overrides to partial metadata.

---

## 2. ARCHITECTURE

```text
Callers
  |
  v
description-schema.ts
  | defines reserved keys, schemas and canonical field pickers
  v
description-merge.ts
  | merges existing, canonical and incoming records
  v
repair.ts
  | exposes merge-preserving repair for partial records
  v
description metadata result
```

Dependency direction: `repair.ts` -> `description-merge.ts` -> `description-schema.ts`.

---

## 3. DIRECTORY TREE

```text
description/
+-- description-merge.ts   # Merge order and preservation rules
+-- description-schema.ts  # Schemas, reserved keys and issue formatting
+-- repair.ts              # Merge-preserving repair wrapper
`-- README.md
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `description-schema.ts` | Declares canonical derived keys, authored keys, tracking keys and `zod` schemas. |
| `description-merge.ts` | Combines existing metadata, canonical fields and incoming values with explicit preservation reports. |
| `repair.ts` | Reuses the merge path for partial records that need canonical overrides. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | May import `zod` and sibling description modules. |
| Exports | Exposes schema types, merge helpers and repair helpers. |
| Ownership | Owns metadata shape and merge behavior. It does not scan folders or write files by itself. |

Main merge flow:

```text
existing record
  |
  v
preserve authored and unknown keys
  |
  v
apply canonical generated fields
  |
  v
apply incoming tracking and authored fields
  |
  v
return merged record plus key reports
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `perFolderDescriptionSchema` | Schema | Validate full per-folder description metadata. |
| `formatDescriptionSchemaIssues` | Function | Convert schema issues to stable field messages. |
| `pickCanonicalDescriptionFields` | Function | Extract canonical derived and authored fields. |
| `mergeDescription` | Function | Merge existing, canonical and incoming metadata. |
| `mergePreserveRepair` | Function | Repair a partial record while preserving authored fields. |

---

## 7. VALIDATION

Run from the repository root.

```bash
npm test -- --runInBand
```

Expected result: Description metadata tests and TypeScript checks pass.

---

## 8. RELATED

- [`../README.md`](../README.md)
- [`../../handlers/README.md`](../../handlers/README.md)
