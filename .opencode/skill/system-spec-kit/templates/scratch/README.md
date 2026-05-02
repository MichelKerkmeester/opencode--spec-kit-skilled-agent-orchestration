---
title: "Scratch Template Directory"
description: "Template folder for disposable spec work files."
trigger_phrases:
  - "scratch directory"
  - "temporary spec files"
  - "disposable workspace"
---

# Scratch Template Directory

## 1. OVERVIEW

`templates/scratch/` defines the template for disposable working files inside a spec folder.

Current state:

- The template keeps the folder present through `.gitkeep`.
- Scratch contents are temporary and should not become continuity or source of truth.
- Permanent context belongs in canonical spec documents.

## 2. OWNERSHIP

This directory belongs to the System Spec Kit template set. Update it only when the scratch folder contract changes for all future spec folders.

## 3. TREE AND KEY FILES

```text
templates/scratch/
+-- README.md
`-- .gitkeep
```

| File | Role |
|---|---|
| `.gitkeep` | Preserves the empty scratch folder in generated templates |
| `README.md` | Explains the scratch folder contract |

## 4. BOUNDARIES

- Do not place durable decisions, handover notes or checklist evidence in scratch files.
- Do not commit generated scratch outputs from active spec folders.
- Keep this template generic and free of packet-specific notes.

## 5. VALIDATION

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/templates/scratch/README.md
```

## 6. RELATED

- [`../`](../) - Spec folder templates.
- [`../../references/structure/folder_structure.md`](../../references/structure/folder_structure.md) - Folder structure reference.
- [`../../references/memory/memory_system.md`](../../references/memory/memory_system.md) - Continuity and recovery reference.
