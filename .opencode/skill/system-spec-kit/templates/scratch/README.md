---
title: "Scratch Directory Template [template:scratch/README.md]"
description: "Template and guidelines for the scratch/ subdirectory used for temporary and disposable files during spec folder work."
trigger_phrases:
  - "scratch folder"
  - "scratch directory"
  - "temporary files"
  - "disposable workspace"
importance_tier: "normal"
contextType: "general"
---
# Scratch

> Temporary workspace for disposable files during spec folder implementation.

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The `scratch/` folder provides a dedicated location for temporary, disposable files created during implementation. This keeps experimental code, debug output, quick notes and other temporary artifacts separate from permanent documentation.

<!-- /ANCHOR:overview -->

---

## 2. WHAT GOES HERE
<!-- ANCHOR:what-goes-here -->

Use `scratch/` for temporary files that help during implementation but have no long-term value:

- Debug logs and error traces
- Test results and validation output
- Prototype code and experiments
- Command history and shell scripts
- Quick notes and calculations
- Temporary data files and exports
- Performance profiling output
- API response samples for testing

<!-- /ANCHOR:what-goes-here -->

---

## 3. WHAT DOES NOT GO HERE
<!-- ANCHOR:what-not-here -->

Do NOT use `scratch/` for:

- **Permanent documentation** - Use spec folder root (`spec.md`, `plan.md`, `checklist.md`, etc.)
- **Context for future sessions** - Use `memory/` folder for decisions, blockers and session summaries
- **Final implementation files** - Production code belongs in project source directories
- **Important decisions** - Document in `decision-record.md` or `memory/`
- **Test results requiring retention** - Move to `checklist.md` verification section

<!-- /ANCHOR:what-not-here -->

---

## 4. CLEANUP
<!-- ANCHOR:cleanup -->

The `scratch/` folder should be emptied when spec work completes:

1. Review files for any insights worth preserving
2. Move important findings to appropriate permanent locations (`memory/`, `checklist.md`, etc.)
3. Delete all scratch files
4. Leave only `.gitkeep` in the folder

This folder is gitignored - contents never commit to version control.

<!-- /ANCHOR:cleanup -->

---

## 5. RELATED DOCUMENTS
<!-- ANCHOR:related -->

- [Folder Structure](../../references/structure/folder_structure.md) - Complete spec folder organization
- [Memory System](../../references/memory/memory_system.md) - When to use `memory/` vs `scratch/`
- [Template Guide](../../references/templates/template_guide.md) - Template selection and usage

<!-- /ANCHOR:related -->

---

<!--
SCRATCH FOLDER - Temporary Workspace
- Disposable files only
- Gitignored by default
- Empty on completion
- Separate from permanent docs
-->
