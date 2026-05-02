---
title: "Optimizer Scripts: Deep Loop Replay Tuning"
description: "Offline optimizer scripts for replaying deep-loop corpora and producing advisory tuning reports."
trigger_phrases:
  - "offline optimizer"
  - "deep loop replay"
  - "optimizer manifest"
---

# Optimizer Scripts: Deep Loop Replay Tuning

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. USAGE NOTES](#4--usage-notes)
- [5. VALIDATION](#5--validation)
- [6. RELATED](#6--related)

## 1. OVERVIEW

`scripts/optimizer/` contains the offline loop optimizer for deep research and deep review replay data. It builds replay corpora, scores deterministic runs, searches bounded config space and produces advisory promotion reports.

Current responsibilities:

- Define which config fields may be tuned and which fields are locked contracts.
- Convert JSONL loop traces into replay corpus entries.
- Replay corpus entries with deterministic config inputs.
- Score replay results and record accepted or rejected candidates.
- Keep promotion advisory-only unless external prerequisites are met.

## 2. DIRECTORY TREE

```text
optimizer/
+-- optimizer-manifest.json  # Tunable fields, locked fields and governance policy
+-- promote.cjs              # Advisory promotion gate and report writer
+-- replay-corpus.cjs        # Corpus extraction and schema checks
+-- replay-runner.cjs        # Deterministic replay execution
+-- rubric.cjs               # Scoring dimensions and composite rubric
+-- search.cjs               # Random search over manifest-declared config space
`-- README.md
```

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `optimizer-manifest.json` | Declares tunable thresholds, locked runtime fields and promotion policy. |
| `replay-corpus.cjs` | Reads approved corpus roots and validates replay entries. |
| `replay-runner.cjs` | Replays iteration data with deterministic convergence checks. |
| `rubric.cjs` | Scores convergence, recovery, finding accuracy and synthesis quality. |
| `search.cjs` | Samples manifest-bounded candidates and records an audit trail. |
| `promote.cjs` | Compares candidates against baselines and writes advisory reports. |

## 4. USAGE NOTES

- The manifest is the source of truth for tunable fields and locked contracts.
- Search candidates must stay inside manifest bounds.
- Replay behavior is deterministic for the same corpus entry and config.
- Promotion output is advisory-only and must not change production config automatically.
- Corpus paths must resolve under approved spec or fixture roots.

## 5. VALIDATION

Run from the repository root:

```bash
python .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/scripts/optimizer/README.md
```

Expected result: the README validation exits `0`.

## 6. RELATED

- [`scripts/`](../README.md)
- [`optimizer-manifest.json`](./optimizer-manifest.json)
- [`replay-corpus.cjs`](./replay-corpus.cjs)
- [`replay-runner.cjs`](./replay-runner.cjs)
- [`rubric.cjs`](./rubric.cjs)
- [`search.cjs`](./search.cjs)
- [`promote.cjs`](./promote.cjs)
