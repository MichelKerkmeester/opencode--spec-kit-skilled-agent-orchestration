---
title: "Corpus Library: Advisor Text Weighting"
description: "DF-IDF helper for corpus-style prompt and skill text scoring in the skill-advisor library."
trigger_phrases:
  - "advisor corpus"
  - "df idf advisor"
  - "skill advisor text scoring"
---

# Corpus Library: Advisor Text Weighting

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

`lib/corpus/` contains text weighting logic used by advisor scoring paths. The folder currently owns a DF-IDF helper for corpus-style matching between prompts, skill metadata and routing evidence.

Current state:

- Provides a focused DF-IDF implementation.
- Keeps corpus weighting separate from lane scoring and rendering.
- Supports scorer modules that need lexical weighting signals.

---

## 2. DIRECTORY TREE

```text
corpus/
+-- df-idf.ts   # DF-IDF text weighting helper
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `df-idf.ts` | Computes corpus-style term weights for advisor scoring inputs. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Keep dependencies limited to scoring input processing. |
| Exports | Export text weighting helpers only. |
| Ownership | Put corpus weighting here. Put final advisor scoring in `../scorer/`. |

Main flow:

```text
prompt and corpus text
  -> DF-IDF weighting
  -> weighted lexical evidence
  -> scorer combines with other advisor signals
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `df-idf.ts` | TypeScript module | Corpus text weighting helper. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/corpus/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../scorer/README.md`](../scorer/README.md)
