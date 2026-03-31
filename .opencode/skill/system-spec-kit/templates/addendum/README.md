---
title: "Addendum Templates [template:addendum/README.md]"
description: "Level extension blocks used to compose final level templates."
trigger_phrases:
  - "addendum"
  - "composition"
  - "level extension"
importance_tier: "normal"
contextType: "general"
---
# Addendum Templates

> Source-only extension blocks that compose into final level templates during spec folder setup.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🔀 COMPOSITION MODEL](#2--composition-model)
- [3. 📁 CONTENTS](#3--contents)
- [4. 💡 WORKFLOW NOTES](#4--workflow-notes)
- [5. 🔗 RELATED RESOURCES](#5--related-resources)
<!-- /ANCHOR:table-of-contents -->

---

## 1. 📖 OVERVIEW
<!-- ANCHOR:overview -->

Addendums are **not** copied into spec folders directly. They are merged into `level_2`, `level_3`, and `level_3+` templates by the composition pipeline.

Each addendum adds a distinct concern layer on top of the core spec template, keeping level-specific content isolated and composable.

<!-- /ANCHOR:overview -->

---

## 2. 🔀 COMPOSITION MODEL
<!-- ANCHOR:composition-model -->

| Level | Composition                           |
| ----- | ------------------------------------- |
| 1     | Core only                             |
| 2     | Core + `level2-verify`                |
| 3     | Level 2 + `level3-arch`               |
| 3+    | Level 3 + `level3plus-govern`         |

The `phase/` addendum is orthogonal to level composition -- it can be applied to any level when a spec is decomposed into ordered phase children via `/spec_kit:plan :with-phases` or `/spec_kit:complete :with-phases`.

<!-- /ANCHOR:composition-model -->

---

## 3. 📁 CONTENTS
<!-- ANCHOR:contents -->

| Folder                | Adds                                           |
| --------------------- | ---------------------------------------------- |
| `level2-verify/`      | NFRs, edge cases, verification scaffolding     |
| `level3-arch/`        | Architecture, risk, and dependency content     |
| `level3plus-govern/`  | Governance, compliance, and approval sections  |
| `phase/`              | Phase decomposition headers and parent sections (`phase-child-header.md`, `phase-parent-section.md`) |

<!-- /ANCHOR:contents -->

---

## 4. 💡 WORKFLOW NOTES
<!-- ANCHOR:workflow-notes -->

- Copy from `../level_1/, ../level_2/, ../level_3/, or ../level_3+/` for real specs — never use addendum source files directly.
- Keep addendums aligned with the current level architecture.
- When sections move between levels, update both the addendum source and all affected level READMEs.

<!-- /ANCHOR:workflow-notes -->

---

## 5. 🔗 RELATED RESOURCES
<!-- ANCHOR:related -->

- `../README.md` — Templates root overview
- `../core/README.md` — Core template reference
- `../../references/templates/template_guide.md` — Full template authoring guide

<!-- /ANCHOR:related -->
