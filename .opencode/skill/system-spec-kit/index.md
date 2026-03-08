---
title: "system-spec-kit Index (Map of Content)"
description: Map of Content linking all phase-related resources within the system-spec-kit skill.
---

# system-spec-kit -- Phase System Resources (MOC)

This index provides a Map of Content (MOC) for the phase system resources within the system-spec-kit skill. It covers references, templates, scripts, commands, and knowledge nodes related to phase decomposition.

---

## References

| File | Category | Description |
|------|----------|-------------|
| [phase_definitions.md](references/structure/phase_definitions.md) | Structure | Phase taxonomy, detection scoring, folder structure, lifecycle, and validation rules |
| [phase_checklists.md](references/validation/phase_checklists.md) | Validation | Phase-specific validation checklists |
| [sub_folder_versioning.md](references/structure/sub_folder_versioning.md) | Structure | Sub-folder versioning conventions (distinct from phase decomposition) |
| [quick_reference.md](references/workflows/quick_reference.md) | Workflows | Phase workflow shortcuts and decision tables |

---

## Templates

| File | Description |
|------|-------------|
| [phase-parent-section.md](templates/addendum/phase/phase-parent-section.md) | Phase Documentation Map addendum for parent spec.md |
| [phase-child-header.md](templates/addendum/phase/phase-child-header.md) | Parent back-reference header for child phase spec.md |

---

## Scripts

| File | Description |
|------|-------------|
| [recommend-level.sh](scripts/spec/recommend-level.sh) | Level and phase recommendation scoring (`--recommend-phases`) |
| [create.sh](scripts/spec/create.sh) | Spec folder creation with `--phase` mode for parent+child structure |
| [validate.sh](scripts/spec/validate.sh) | Spec folder validation with `--recursive` flag for phase-aware validation |
| [check-phase-links.sh](scripts/rules/check-phase-links.sh) | Validation rule plugin for parent-child phase link integrity |

---

## Commands

| File | Description |
|------|-------------|
| [phase.md](../command/spec_kit/phase.md) | `/spec_kit:phase` command entry point (auto/confirm modes) |
| [spec_kit_phase_auto.yaml](../command/spec_kit/assets/spec_kit_phase_auto.yaml) | Phase command autonomous workflow asset |
| [spec_kit_phase_confirm.yaml](../command/spec_kit/assets/spec_kit_phase_confirm.yaml) | Phase command interactive workflow asset |

---

## Nodes (Workflow & Routing)

| File | Description |
|------|-------------|
| [phase-system.md](nodes/phase-system.md) | Knowledge node covering phase lifecycle, scoring, transitions, and boundary rules |
