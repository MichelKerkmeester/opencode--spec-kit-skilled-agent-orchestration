---
title: "Skill Advisor Compat: Package Compatibility Export"
description: "Compatibility package export for skill-advisor consumers that need the public compat surface."
trigger_phrases:
  - "skill advisor compat"
  - "advisor compatibility export"
---

# Skill Advisor Compat: Package Compatibility Export

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES AND FLOW](#4--boundaries-and-flow)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

---

## 1. OVERVIEW

`skill_advisor/compat/` provides the package-level compatibility export surface. It is separate from `lib/compat/`, which contains the lower-level status, contract and daemon probe helpers.

Current state:

- Contains a single `index.ts` compatibility entrypoint.
- Keeps public compatibility exports separate from internal compatibility helpers.
- Gives consumers a stable import path for advisor compatibility behavior.

---

## 2. DIRECTORY TREE

```text
compat/
+-- index.ts   # Package compatibility export surface
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `index.ts` | Exports the public compatibility surface for skill-advisor consumers. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Re-export or wrap compatibility helpers without owning probe internals. |
| Exports | Export public compatibility API only. |
| Ownership | Put internal compatibility logic in `../lib/compat/`. |

Main flow:

```text
consumer import
  -> compat/index.ts
  -> compatibility helper surface
  -> caller handles result
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `index.ts` | TypeScript module | Public compatibility export surface. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/skill_advisor/compat/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../lib/compat/README.md`](../lib/compat/README.md)
