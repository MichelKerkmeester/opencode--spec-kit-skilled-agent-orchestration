---
title: "Validation Scripts: Spec Packet Checks"
description: "CLI validation helpers for continuity freshness and evidence marker checks."
trigger_phrases:
  - "continuity freshness"
  - "evidence marker lint"
  - "validation scripts"
---

# Validation Scripts: Spec Packet Checks

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. USAGE NOTES](#4--usage-notes)
- [5. VALIDATION](#5--validation)
- [6. RELATED](#6--related)

## 1. OVERVIEW

`scripts/validation/` contains focused validators used by the Spec Kit validation flow. The scripts produce structured pass, warn or fail output that can be consumed by shell wrappers and strict validation gates.

Current responsibilities:

- Check whether continuity timestamps lag graph metadata timestamps.
- Audit `[EVIDENCE: ...]` markers across spec packet markdown.
- Provide a strict-mode evidence marker lint bridge for validation scripts.

## 2. DIRECTORY TREE

```text
validation/
+-- continuity-freshness.ts   # Continuity timestamp freshness validator
+-- evidence-marker-audit.ts  # Evidence marker parser, report and optional rewrap tool
+-- evidence-marker-lint.ts   # Strict-mode bridge around the evidence marker audit
`-- README.md
```

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `continuity-freshness.ts` | Compares `_memory.continuity.last_updated_at` with `graph-metadata.json` save time. |
| `evidence-marker-audit.ts` | Parses evidence markers while ignoring fenced code and inline code examples. |
| `evidence-marker-lint.ts` | Converts audit results into validation-friendly output and exits non-zero under `--strict` when invalid markers exist. |

## 4. USAGE NOTES

- Run these scripts against spec folders, not arbitrary source folders.
- `evidence-marker-audit.ts` is read-only unless `--rewrap` is supplied.
- `evidence-marker-lint.ts` requires `--folder` and supports `--json` and `--strict`.
- `continuity-freshness.ts` treats missing optional files as skipped checks rather than hard failures.

## 5. VALIDATION

Run from the repository root:

```bash
python .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/scripts/validation/README.md
```

Expected result: the README validation exits `0`.

## 6. RELATED

- [`scripts/`](../README.md)
- [`continuity-freshness.ts`](./continuity-freshness.ts)
- [`evidence-marker-audit.ts`](./evidence-marker-audit.ts)
- [`evidence-marker-lint.ts`](./evidence-marker-lint.ts)
