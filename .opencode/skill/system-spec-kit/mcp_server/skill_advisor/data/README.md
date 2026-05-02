---
title: "Skill Advisor Data: Shadow Delta Records"
description: "Data folder for skill-advisor shadow delta records used by comparison and diagnostics paths."
trigger_phrases:
  - "advisor data"
  - "shadow deltas"
---

# Skill Advisor Data: Shadow Delta Records

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

`skill_advisor/data/` stores data files used by advisor diagnostics and shadow comparison paths. It currently contains JSONL shadow delta records.

Current state:

- Stores `shadow-deltas.jsonl` for shadow delta observations.
- Keeps generated or observed data separate from library modules.
- Supports comparison and diagnostics paths without exporting runtime code.

---

## 2. DIRECTORY TREE

```text
data/
+-- shadow-deltas.jsonl   # Shadow comparison delta records
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `shadow-deltas.jsonl` | Stores shadow-mode delta records for advisor comparison or diagnostics. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Data files are read by advisor diagnostics or shadow paths, not imported as modules. |
| Exports | This folder exports no runtime code. |
| Ownership | Put advisor shadow data here. Put shadow sink code in `../lib/shadow/`. |

Main flow:

```text
shadow comparison path
  -> append or read JSONL delta record
  -> diagnostic comparison
  -> report or test assertion
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `shadow-deltas.jsonl` | Data file | Shadow delta record store. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/skill_advisor/data/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../lib/shadow/README.md`](../lib/shadow/README.md)
