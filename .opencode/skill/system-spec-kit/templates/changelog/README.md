---
title: "Packet Changelog Templates"
description: "Packet-local changelog templates for root specs and phase child folders."
trigger_phrases:
  - "packet changelog templates"
  - "nested changelog templates"
  - "root phase changelog"
---

# Packet Changelog Templates

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

`templates/changelog/` contains packet-local changelog templates generated inside spec folders. These templates summarize canonical packet docs and are separate from global release-note templates under `.opencode/changelog/`.

Current state:

- `root.md` renders changelogs for root spec folders.
- `phase.md` renders changelogs for phase child folders.
- Recovery still flows through `/spec_kit:resume` and canonical continuity docs.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:directory-tree -->
## 2. DIRECTORY TREE

```text
changelog/
├── README.md
├── root.md    # Root packet changelog template
└── phase.md   # Phase child changelog template
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Role |
|---|---|
| `root.md` | Template for `changelog/changelog-<packet>-root.md`. |
| `phase.md` | Template for phase child changelogs in the parent packet `changelog/` folder. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-and-flow -->
## 4. BOUNDARIES AND FLOW

Boundaries:

- This directory owns packet-local changelog templates only.
- It must not replace global release-note templates.
- Generated changelogs summarize packet docs, not live worktree diffs.

Generation flow:

```text
╭────────────────────╮
│ canonical spec docs│
╰─────────┬──────────╯
          ▼
┌────────────────────┐
│ root.md or phase.md│
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ changelog generator│
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ packet changelog   │
└────────────────────┘
```

<!-- /ANCHOR:boundaries-and-flow -->

---

<!-- ANCHOR:entrypoints -->
## 5. ENTRYPOINTS

| Entrypoint | Use |
|---|---|
| `root.md` | Root spec folder changelog generation. |
| `phase.md` | Phase child changelog generation. |
| Changelog generator script | Reads canonical packet docs and applies one template. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 6. VALIDATION

Run from the repository root after template edits:

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict
```

Generated changelogs should reference available packet docs and avoid claiming task completion beyond those docs.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 7. RELATED

| Document | Role |
|---|---|
| [sk-doc changelog template](../../../sk-doc/assets/documentation/changelog_template.md) | Global changelog and release-note template. |

<!-- /ANCHOR:related -->
