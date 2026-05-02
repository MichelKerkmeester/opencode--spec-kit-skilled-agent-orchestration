---
title: "Ranking Helpers: Learned Stage 2 Scoring"
description: "Pure TypeScript ranking utilities for learned Stage 2 score combination and local matrix math."
trigger_phrases:
  - "learned combiner"
  - "stage 2 ranking"
  - "ranking matrix math"
---

# Ranking Helpers: Learned Stage 2 Scoring

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. USAGE NOTES](#4--usage-notes)
- [5. VALIDATION](#5--validation)
- [6. RELATED](#6--related)

## 1. OVERVIEW

`shared/ranking/` owns local ranking math for Stage 2 scoring experiments. It keeps the learned score combiner and its numeric helpers outside runtime tool code so ranking behavior can be tested as pure TypeScript.

Current responsibilities:

- Convert Stage 2 scoring context into the canonical 8-feature vector.
- Train and score a small ridge-regression model without external ML packages.
- Provide matrix operations used by the learned combiner.

## 2. DIRECTORY TREE

```text
ranking/
+-- learned-combiner.ts   # Feature extraction, ridge regression, shadow scoring
+-- matrix-math.ts        # Transpose, multiplication and linear-system helpers
`-- README.md
```

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `learned-combiner.ts` | Defines feature names, model types, training, prediction, LOOCV and feature-importance logic. |
| `matrix-math.ts` | Supplies dependency-free matrix helpers used by the combiner. |

## 4. USAGE NOTES

- `learned-combiner.ts` re-exports matrix helpers from `matrix-math.ts` for existing callers.
- `FEATURE_NAMES` defines the required feature order for all feature vectors.
- Missing or non-finite scoring values are clamped to `0` during feature extraction.
- The learned combiner is intended for shadow scoring behind the `SPECKIT_LEARNED_STAGE2_COMBINER` flag.

## 5. VALIDATION

Run from the repository root:

```bash
python .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/shared/ranking/README.md
```

Expected result: the README validation exits `0`.

## 6. RELATED

- [`shared/`](../README.md)
- [`learned-combiner.ts`](./learned-combiner.ts)
- [`matrix-math.ts`](./matrix-math.ts)
