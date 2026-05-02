---
title: "Eval Data: Ground-Truth Fixtures"
description: "Ground-truth fixture data consumed by eval and ablation tooling."
trigger_phrases:
  - "eval data"
  - "ground truth"
---

# Eval Data: Ground-Truth Fixtures

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. DIRECTORY TREE](#3--directory-tree)
- [4. KEY FILES](#4--key-files)
- [5. BOUNDARIES AND FLOW](#5--boundaries-and-flow)
- [6. ENTRYPOINTS](#6--entrypoints)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

## 1. OVERVIEW

`lib/eval/data/` stores static fixtures for evaluation tooling. The directory is data-only and provides labeled query cases for ablation, reporting and retrieval-quality checks.

Current state:

- `ground-truth.json` contains query records with intent, complexity, category, source, expected result description and notes.
- Eval code reads this file as fixture input.
- No runtime logic, database writes or generated reports live here.

## 2. ARCHITECTURE

```text
ground-truth.json
    │
    ▼
eval loaders and ablation runners
    │
    ▼
recall, ranking and reporting outputs
```

## 3. DIRECTORY TREE

```text
data/
+-- ground-truth.json  # Labeled retrieval-evaluation query set
`-- README.md          # Folder orientation
```

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `ground-truth.json` | Stores labeled query fixtures used to compare expected retrieval behavior against eval outputs. |

## 5. BOUNDARIES AND FLOW

This folder owns fixture data only. It should not contain eval runners, metrics code, generated snapshots or runtime database state.

Main flow:

```text
fixture query
    -> eval or ablation loader
    -> retrieval run
    -> metric calculation
    -> report outside this folder
```

## 6. ENTRYPOINTS

There are no code exports. The entrypoint is the `ground-truth.json` file path consumed by eval tooling.

## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/lib/eval/data/README.md
```

Check JSON syntax when editing fixtures:

```bash
node -e "JSON.parse(require('node:fs').readFileSync('.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json', 'utf8'))"
```

## 8. RELATED

- `../README.md`
- `../../../../scripts/evals/README.md`
