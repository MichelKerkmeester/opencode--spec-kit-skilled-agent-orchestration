---
title: "Skill Advisor Cache Tests: Listener Coverage"
description: "Vitest coverage for skill advisor prompt-cache invalidation listener uniqueness."
trigger_phrases:
  - "advisor cache tests"
  - "cache invalidation listener"
  - "prompt cache uniqueness"
---

# Skill Advisor Cache Tests: Listener Coverage

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES AND FLOW](#4--boundaries-and-flow)
- [5. VALIDATION](#5--validation)
- [6. RELATED](#6--related)

---

## 1. OVERVIEW

`skill_advisor/tests/cache/` contains focused Vitest coverage for prompt-cache invalidation listener registration. The test verifies that importing the advisor brief module registers one listener per process and does not double-register through repeated imports.

Current state:

- Test setup resets modules before each case and restores mocks after each case.
- The cache invalidation listener list is cleared before assertions.
- `advisorPromptCache.clear()` is spied to prove one clear call per invalidation fan-out.

---

## 2. DIRECTORY TREE

```text
cache/
+-- listener-uniqueness.vitest.ts  # Prompt-cache invalidation listener uniqueness tests
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `listener-uniqueness.vitest.ts` | Verifies listener registration and repeated-import behavior for advisor prompt-cache invalidation. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Tests import advisor freshness and prompt-cache modules through relative test paths. |
| Ownership | Keep cache-listener behavior coverage here. Broader advisor scoring and routing tests belong in neighboring test folders. |

Main flow:

```text
Vitest case
    │
    ▼
clear listener registry and spy on prompt cache
    │
    ▼
import skill-advisor-brief.js
    │
    ▼
invalidate skill graph caches
    │
    ▼
assert advisorPromptCache.clear() was called once
```

---

## 5. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/cache/README.md
```

Expected result: exit code `0`.

---

## 6. RELATED

- [`../README.md`](../README.md)
- [`listener-uniqueness.vitest.ts`](listener-uniqueness.vitest.ts)
