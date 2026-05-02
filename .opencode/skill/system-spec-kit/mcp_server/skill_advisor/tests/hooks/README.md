---
title: "Skill Advisor Hook Tests"
description: "Regression coverage for settings-driven skill advisor hook invocation shape."
trigger_phrases:
  - "skill advisor hook tests"
  - "settings driven invocation parity"
---

# Skill Advisor Hook Tests

> Regression coverage for settings-driven skill advisor hook invocation shape.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. VALIDATION](#4--validation)
- [5. RELATED](#5--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`tests/hooks/` guards the checked-in Claude settings shape used by skill advisor hook invocation.

Current state:

- Confirms each hook event uses the nested matcher-group shape.
- Ensures hook commands point at `dist/hooks/claude/*` handlers.
- Blocks accidental `hooks/copilot/` adapter references in Claude settings.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:directory-tree -->
## 2. DIRECTORY TREE

```text
hooks/
+-- settings-driven-invocation-parity.vitest.ts  # Claude settings hook shape guard
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `settings-driven-invocation-parity.vitest.ts` | Verifies `UserPromptSubmit`, `PreCompact`, `SessionStart` and `Stop` hook definitions. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:validation -->
## 4. VALIDATION

Run from the repository root.

```bash
npx vitest run .opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/hooks
```

Expected result: the settings shape and adapter checks pass.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 5. RELATED

- [`../README.md`](../README.md)
- [`../compat/README.md`](../compat/README.md)
- [`../../README.md`](../../README.md)

<!-- /ANCHOR:related -->
