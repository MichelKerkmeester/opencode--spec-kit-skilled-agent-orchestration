---
title: "Skill Advisor Test Fixtures"
description: "Shared fixture data for skill advisor lifecycle tests."
trigger_phrases:
  - "skill advisor fixtures"
  - "advisor lifecycle fixtures"
---

# Skill Advisor Test Fixtures

> Shared fixture data for skill advisor lifecycle tests.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. RELATED](#5--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`tests/fixtures/` stores small reusable data objects for skill advisor test suites.

Current state:

- Exposes lifecycle metadata fixtures from `lifecycle/index.ts`.
- Covers active, deprecated, archived, future and legacy metadata shapes.
- Keeps shared test data separate from handler and compatibility assertions.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:directory-tree -->
## 2. DIRECTORY TREE

```text
fixtures/
+-- lifecycle/
|   `-- index.ts       # Lifecycle metadata fixture exports
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `lifecycle/index.ts` | Exports `lifecycleFixtures` for redirect, archive, future and version-mix scenarios. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries -->
## 4. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | Test suites may import fixture exports directly. |
| Exports | Fixture modules export static data only. |
| Ownership | Add shared advisor test data here when more than one suite needs it. |

<!-- /ANCHOR:boundaries -->

---

<!-- ANCHOR:related -->
## 5. RELATED

- [`../README.md`](../README.md)
- [`../handlers/README.md`](../handlers/README.md)
- [`../compat/README.md`](../compat/README.md)

<!-- /ANCHOR:related -->
