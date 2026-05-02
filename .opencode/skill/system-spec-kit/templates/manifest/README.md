---
title: "Template Manifest"
description: "Private Level contract manifest and gated markdown templates used by Spec Kit scaffolding and validation."
trigger_phrases:
  - "template manifest"
  - "level contract manifest"
  - "spec-kit-docs json"
---

# Template Manifest

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES AND FLOW](#4--boundaries-and-flow)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`templates/manifest/` is private implementation infrastructure for Spec Kit template contracts. It maps public Level values to the document set, lazy document lifecycle and section gates consumed by scaffolding and validation code.

Public and AI-facing surfaces must keep using Level 1, Level 2, Level 3, Level 3+ and phase-parent wording. Private JSON taxonomy stays inside this directory and implementation code.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:directory-tree -->
## 2. DIRECTORY TREE

```text
manifest/
├── README.md
├── spec-kit-docs.json        # Private source of truth for Level contracts
├── *.md.tmpl                 # Whole-document markdown templates with gates
└── phase-parent.spec.md.tmpl # Lean phase-parent spec template
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Role |
|---|---|
| `spec-kit-docs.json` | Maps public levels to internal contract definitions. |
| `*.md.tmpl` | Provides gated markdown source for rendered packet docs. |
| `phase-parent.spec.md.tmpl` | Provides the lean parent spec for phase workflows. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-and-flow -->
## 4. BOUNDARIES AND FLOW

Boundaries:

- This directory owns template contract data only.
- It must not expose private taxonomy in command help, generated packet files, agent prompts or policy docs.
- Generated docs should use public Level labels only.

Render flow:

```text
╭────────────────────╮
│ spec-kit-docs.json │
╰─────────┬──────────╯
          ▼
┌────────────────────┐
│ gated template     │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ renderer script    │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ public spec doc    │
└────────────────────┘
```

<!-- /ANCHOR:boundaries-and-flow -->

---

<!-- ANCHOR:entrypoints -->
## 5. ENTRYPOINTS

| Entrypoint | Use |
|---|---|
| `scripts/templates/inline-gate-renderer.ts` | Render one gated template for one Level. |
| `scripts/templates/inline-gate-renderer.sh` | Shell wrapper for renderer use from scripts. |
| `spec-kit-docs.json` | Contract source read by scaffold and validation code. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 6. VALIDATION

Run template and spec validation from the repository root after contract edits:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run typecheck
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict
```

Rendered output should match the intended public Level contract and must not leak private manifest terms.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 7. RELATED

| Document | Role |
|---|---|
| [Templates README](../README.md) | Parent template package overview. |
| [Changelog templates](../changelog/README.md) | Packet-local changelog template notes. |

<!-- /ANCHOR:related -->
