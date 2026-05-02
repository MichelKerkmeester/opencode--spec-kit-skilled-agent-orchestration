---
title: "Skill Advisor Scorer Tests: Native Ranking Coverage"
description: "Vitest coverage for native scorer quality, projection fallback and advisor-ranking behavior."
trigger_phrases:
  - "skill advisor scorer tests"
  - "native scorer vitest"
  - "advisor ranking coverage"
---

# Skill Advisor Scorer Tests: Native Ranking Coverage

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

`tests/scorer/` contains focused Vitest coverage for the skill-advisor scoring path. These tests verify native scoring quality, fallback projection behavior and ranking expectations around the advisor quality card.

Current state:

- Checks the native scorer with representative advisor inputs.
- Covers projection fallback behavior for scorer metadata.
- Keeps scorer regressions near the scoring-specific fixtures and expectations.

---

## 2. DIRECTORY TREE

```text
scorer/
+-- advisor-quality-049-003.vitest.ts       # Advisor quality-card scorer coverage
+-- native-scorer.vitest.ts                 # Native scorer behavior tests
+-- projection-fallback-049-005.vitest.ts   # Projection fallback regression coverage
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `native-scorer.vitest.ts` | Exercises native scorer behavior and expected ranking signals. |
| `advisor-quality-049-003.vitest.ts` | Covers quality-card scoring behavior for advisor results. |
| `projection-fallback-049-005.vitest.ts` | Verifies fallback projection data remains usable when richer metadata is absent. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Use test helpers and scorer modules needed to build realistic advisor inputs. |
| Exports | This folder exports no runtime code. |
| Ownership | Keep scoring-specific regressions here. Put handler, hook or schema tests in their sibling test folders. |

Main flow:

```text
test fixture or inline advisor input
  -> native scorer or projection path
  -> ranked result or quality metadata
  -> assertion on stable scoring behavior
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `native-scorer.vitest.ts` | Test file | Primary native scorer regression suite. |
| `advisor-quality-049-003.vitest.ts` | Test file | Quality-card scorer coverage. |
| `projection-fallback-049-005.vitest.ts` | Test file | Fallback projection coverage. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../../lib/scorer/README.md`](../../lib/scorer/README.md)
