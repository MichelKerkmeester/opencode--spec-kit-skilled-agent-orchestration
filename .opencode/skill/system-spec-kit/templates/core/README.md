---
title: "Core Templates [template:core/README.md]"
description: "Shared base templates used by all documentation levels."
trigger_phrases:
  - "core templates"
  - "base structure"
  - "composition source"
importance_tier: "normal"
contextType: "general"
---
# Core Templates

Shared base components for level template composition.

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. CONTENTS](#2--contents)
- [3. ARCHITECTURE](#3--architecture)
- [4. USAGE RULES](#4--usage-rules)
- [5. RELATED](#5--related)

<!-- /ANCHOR:table-of-contents -->

## 1. OVERVIEW
<!-- ANCHOR:overview -->

Core templates define the common structure reused across levels.
They are source artifacts, not direct user-facing copies.

<!-- /ANCHOR:overview -->

## 2. CONTENTS
<!-- ANCHOR:contents -->

| File | Purpose |
|---|---|
| `spec-core.md` | base specification layout |
| `plan-core.md` | base implementation plan layout |
| `tasks-core.md` | base task tracking layout |
| `impl-summary-core.md` | base implementation summary layout |

<!-- /ANCHOR:contents -->

## 3. ARCHITECTURE
<!-- ANCHOR:architecture -->

Core plus addendum composition:

```text
level_1 = core
level_2 = core + level2-verify
level_3 = level_2 + level3-arch
level_3+ = level_3 + level3plus-govern
```

<!-- /ANCHOR:architecture -->

## 4. USAGE RULES
<!-- ANCHOR:usage-rules -->

- Do not copy from `core/` into spec folders.
- Copy from `../level_N/` directories.
- Keep core files stable and move level-specific content into addendums.

<!-- /ANCHOR:usage-rules -->

## 5. RELATED
<!-- ANCHOR:related -->

- `../README.md`
- `../addendum/README.md`
- `../../references/templates/template_guide.md`

<!-- /ANCHOR:related -->
