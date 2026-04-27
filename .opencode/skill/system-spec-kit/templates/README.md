---
title: "Templates [template:README.md]"
description: "System Spec Kit template architecture and level routing."
trigger_phrases:
  - "templates"
  - "level architecture"
  - "core addendum"
importance_tier: "normal"
contextType: "general"
---
# Templates

Source of truth for Spec Kit documentation templates.

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1-overview)
- [2. STRUCTURE](#2-structure)
- [3. LEVEL SELECTION](#3-level-selection)
- [4. WORKFLOW NOTES](#4-workflow-notes)
- [5. PHASE SYSTEM](#5-phase-system)
- [6. RELATED](#6-related)

<!-- /ANCHOR:table-of-contents -->

## 1. OVERVIEW
<!-- ANCHOR:overview -->

Templates follow CORE + ADDENDUM v2.2:
- Core files define shared structure.
- Addendums append level-specific sections.
- `level_1` through `level_3+` contain ready-to-copy templates.

Use level templates for real work. Do not copy from `core/` or `addendum/` directly.

<!-- /ANCHOR:overview -->

## 2. STRUCTURE
<!-- ANCHOR:structure -->

| Path | Role |
|---|---|
| `core/` | Base template components |
| `addendum/` | Level-specific extension blocks |
| `level_1/` | Core-only templates for small tasks |
| `level_2/` | Level 1 + verification (`checklist.md`) |
| `level_3/` | Level 2 + architecture (`decision-record.md`) |
| `level_3+/` | Level 3 + governance extensions |
| `research/research.md` | Research artifact template |
| `handover.md` | Session handover template |
| `debug-delegation.md` | Debug delegation template |
| `resource-map.md` | Optional cross-cutting path catalog (any level) |
| `phase_parent/` | Lean phase-parent `spec.md` template — used by `create.sh --phase` to scaffold parents that hold only the lean trio |
| `context-index.md` | Optional migration-bridge template for phase parents that have undergone reorganization (renames, gap renumbers, consolidation); never auto-scaffolded |
| `examples/` | Filled references only |
| `changelog/` | Packet-local nested changelog templates for root specs and phase children |
| `scratch/` | Temporary workspace for non-committed artifacts |
| `sharded/` | Sharded template set |
| `.hashes` | Pipeline artifact from template composition (`compose.sh`). Auto-generated, do not edit manually. |

<!-- /ANCHOR:structure -->

## 3. LEVEL SELECTION
<!-- ANCHOR:level-selection -->

| Level | Typical Size | Required Spec Files |
|---|---|---|
| 1 | <100 LOC | `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` |
| 2 | 100-499 LOC | Level 1 + `checklist.md` |
| 3 | >=500 LOC or architecture risk | Level 2 + `decision-record.md` |
| 3+ | High governance complexity | Level 3 with governance-expanded sections |

LOC is guidance, not a hard limit. Risk and complexity can move work up a level.

<!-- /ANCHOR:level-selection -->

## 4. WORKFLOW NOTES
<!-- ANCHOR:workflow-notes -->

- Gate 3 spec-folder choice applies before implementation work.
- `/spec_kit:plan --intake-only` is the standalone intake entry before `/spec_kit:plan`, `/spec_kit:complete`, or `/spec_kit:deep-research` continue on the packet.
- `implementation-summary.md` is required for all levels and finalized after implementation.
- `/spec_kit:resume` is the canonical recovery surface; active continuity rebuild order is `handover.md -> _memory.continuity -> spec docs`.
- `/memory:save` routes continuity into canonical packet docs via the content-router, targeting `decision-record.md`, `implementation-summary.md`, and `handover.md` as needed.
- Nested packet changelogs can be generated at completion time with `../scripts/dist/spec-folder/nested-changelog.js`.
- Level 2+ completion uses checklist verification (P0, then P1, then P2).
- Memory context is saved via `../scripts/dist/memory/generate-context.js`, never manual file creation.
- `resource-map.md` is an optional, any-level lean path catalog - use it alongside `implementation-summary.md` when reviewers need a scannable file ledger.

<!-- /ANCHOR:workflow-notes -->

## 5. PHASE SYSTEM
<!-- ANCHOR:phase-system -->

Large specs can be decomposed into ordered phases using the Phase System (Spec 139). Each phase becomes a child spec folder under the parent (e.g., `<###-parent-spec>/<001-phase-one>/`, `specs/<###-parent-spec>/<002-phase-two>/`).

- **Gate 3 Option E** targets a specific phase child folder for implementation work.
- **`/spec_kit:plan :with-phases`** (or `/spec_kit:complete :with-phases`) decomposes a spec into phases, creating parent and child folders with proper linking.
- If the target packet is still `no-spec`, `partial-folder`, `repair-mode`, or `placeholder-upgrade`, `/spec_kit:plan` and `/spec_kit:complete` delegate to the shared intake contract in [`../references/intake-contract.md`](../references/intake-contract.md) before phase work continues.
- Phase addendum templates live in `addendum/phase/`:
  - `phase-child-header.md` — prepended to child spec files to link back to the parent.
  - `phase-parent-section.md` — appended to the parent spec to list and track child phases.
- Phase completion can also publish packet-local changelog files into the parent `changelog/` folder.

**Phase Parent Folder.** When `create.sh --phase` (or `/spec_kit:plan :with-phases`) creates a phase decomposition, the parent scaffolds from `phase_parent/spec.md` (lean — only the spec.md plus auto-generated `description.json` and `graph-metadata.json`). Heavy docs (`plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) live exclusively in the children. Detection is single-source-of-truth: `is_phase_parent()` (shell, `scripts/lib/shell-common.sh`) and `isPhaseParent()` (ESM JS, `scripts/dist/spec/is-phase-parent.js`) MUST agree. Phase children follow the same level system (1-3+) as standalone specs.

<!-- /ANCHOR:phase-system -->

## 6. RELATED
<!-- ANCHOR:related -->

- `../references/templates/level_specifications.md`
- `../references/templates/template_guide.md`
- `../references/validation/validation_rules.md`
- `./resource-map.md`
- `./examples/README.md`

<!-- /ANCHOR:related -->
