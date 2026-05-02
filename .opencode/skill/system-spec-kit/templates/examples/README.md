---
title: "Template Examples"
description: "Reference examples showing expected spec documentation depth by level."
trigger_phrases:
  - "template examples"
  - "level examples"
  - "documentation depth"
importance_tier: "normal"
contextType: "general"
---

# Template Examples

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. DIRECTORY TREE](#4--directory-tree)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES AND FLOW](#6--boundaries-and-flow)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`templates/examples/` contains filled reference examples for system-spec-kit documentation levels. Use these examples to compare depth, section coverage and evidence style after choosing a level from the real task scope.

Current responsibilities:

- Show how Level 1 through Level 3+ documentation scales.
- Provide comparison material for authors and reviewers.
- Keep examples separate from templates that users copy for new work.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
level templates
        │
        ▼
filled examples by level
        │
        ▼
authors compare scope, depth and evidence before editing their own spec docs
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
examples/
+-- README.md
+-- level_1/      # Minimal scope and lightweight planning example
+-- level_2/      # Verification-focused example
+-- level_3/      # Architecture and decision-record example
`-- level_3+/     # Governance and coordination example
```

Example folders mirror level contracts, but they are not source templates. Copy from sibling `level_*` template folders instead.

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
examples/
+-- README.md
+-- level_1/
|   +-- spec.md
|   +-- plan.md
|   +-- tasks.md
|   `-- implementation-summary.md
+-- level_2/
|   `-- level docs with checklist.md
+-- level_3/
|   `-- level docs with decision-record.md
`-- level_3+/
    `-- level docs with governance depth
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| Path | Responsibility |
|---|---|
| `level_1/` | Shows the smallest complete spec packet shape. |
| `level_2/` | Shows checklist-backed validation depth. |
| `level_3/` | Shows decision records and architecture-level planning. |
| `level_3+/` | Shows expanded coordination and governance depth. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-and-flow -->
## 6. BOUNDARIES AND FLOW

Use this directory for reference only. Do not start new specs by copying from `examples/`, because examples may include filled content that does not match the new task.

Recommended flow:

```text
choose level from task risk -> copy sibling level template -> author spec docs -> compare against examples -> validate
```

<!-- /ANCHOR:boundaries-and-flow -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/templates/examples/README.md
```

For spec packet validation, run the system-spec-kit validator against the target spec folder rather than this examples directory.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

- `../README.md`
- `../level_1/README.md`
- `../level_2/README.md`
- `../level_3/README.md`
- `../level_3+/README.md`

<!-- /ANCHOR:related -->
