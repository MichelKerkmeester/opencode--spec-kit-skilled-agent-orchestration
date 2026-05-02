---
title: "Config Scripts: Barrel Exports"
description: "Stable script-side import boundary for system-spec-kit config utilities."
trigger_phrases:
  - "scripts config barrel"
  - "system spec kit config imports"
  - "spec directory config"
---

# Config Scripts: Barrel Exports

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. VALIDATION](#5--validation)
- [6. RELATED](#6--related)

## 1. OVERVIEW

`scripts/config/` exposes config and specs-directory utilities to script modules without requiring those modules to import from `scripts/core` directly.

Current state:

- Re-exports the canonical `CONFIG` object.
- Re-exports specs directory discovery helpers.
- Preserves the dependency boundary between non-core scripts and core config implementation.

## 2. DIRECTORY TREE

```text
config/
`-- index.ts
```

## 3. KEY FILES

| File | Role |
|---|---|
| `index.ts` | Barrel export for `CONFIG`, specs directory helpers, and config types from `../core/config.js`. |

## 4. BOUNDARIES

Non-core scripts should import config through this folder. The canonical config implementation remains in `scripts/core/config.ts`.

Allowed direction:

```text
extractors/renderers/loaders -> scripts/config -> scripts/core/config
```

## 5. VALIDATION

Run the relevant TypeScript or package test command from the repository root after changing exports.

## 6. RELATED

- `../core/config.ts`
- `../graph/README.md`
- `../observability/README.md`
