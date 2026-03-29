---
title: Phase System
description: Knowledge node for the SpecKit phase decomposition system, covering detection, scoring, folder structure, lifecycle, and validation for complex multi-session specifications.
---

# Phase System

The phase system decomposes complex specifications into independently trackable child spec folders. Phases are a **behavioral overlay** on existing documentation levels (Levels 1-3+), not a new level tier. Levels describe documentation depth; phases describe work decomposition.

---

## When Phases Apply

Phase decomposition is suggested when **both** conditions are met:

1. **Phase complexity score >= 25** (out of 50, scored across five dimensions)
2. **Documentation level >= 3** (from `recommend-level.sh` 100-point level scoring)

If only one condition is met, the specification proceeds as a standard (non-phased) spec folder.

---

## Complexity Scoring (5 Dimensions)

| Dimension                | Points | Condition                                             |
|--------------------------|--------|-------------------------------------------------------|
| Architectural complexity | 10     | Multiple systems, cross-cutting concerns              |
| File count               | 10     | Estimated files to modify > 15                        |
| Lines of code            | 10     | Estimated LOC > 800                                   |
| Risk level               | 10     | Risk score >= 2 (moderate or higher)                  |
| Extreme scale            | 10     | Exceeds any single dimension by 2x or more            |

**Maximum score:** 50

---

## Phase Count Mapping

| Score Range | Suggested Phases | Rationale                                   |
|-------------|------------------|---------------------------------------------|
| 25-34       | 2 phases         | Moderate complexity, two work streams       |
| 35-44       | 3 phases         | High complexity, three parallel streams     |
| 45+         | 4 phases         | Extreme complexity, maximum recommended     |

Phase counts are suggestions. The user decides the final count and organization.

---

## Lifecycle

```
CREATE  --> Parent folder + Phase Documentation Map + child folders with back-references
PLAN    --> Each phase gets independent plan.md and tasks.md
IMPLEMENT --> Each phase implemented independently; status updated in parent map
VALIDATE  --> Recursive validation of all children + parent as integrated unit
```

### Phase Status Values

`draft` | `active` | `paused` | `complete`

---

## Key Commands and Scripts

| Command / Script                        | Purpose                                            |
|-----------------------------------------|----------------------------------------------------|
| `/spec_kit:plan :with-phases`           | Phase decomposition (integrated into plan/complete)|
| `create.sh --phase --level 3 --phases N`| Create parent + child phase folder structure       |
| `validate.sh --recursive`              | Validate parent + all child phases as a unit       |
| `recommend-level.sh --recommend-phases` | Phase recommendation scoring alongside level       |
| `check-phase-links.sh`                 | Validate parent-child link integrity (rule plugin) |

---

## Folder Structure

```
specs/###-parent-feature/
  spec.md              # Contains Phase Documentation Map
  plan.md              # High-level coordination plan
  tasks.md             # Cross-phase task tracking
  memory/              # Parent-level context
  001-phase-name/      # Phase 1 (child spec folder)
    spec.md            # Back-references parent
    plan.md
    tasks.md
    memory/
  002-phase-name/      # Phase 2
    ...
```

Child phase `spec.md` files include parent back-reference metadata:

```yaml
parent: specs/###-parent-feature/
phase: 1 of N
```

---

## Cross-References

- [phase_definitions.md](../references/structure/phase_definitions.md) -- Full phase taxonomy, detection scoring, and lifecycle rules
- [phase_checklists.md](../references/validation/phase_checklists.md) -- Phase-specific validation checklists
- [sub_folder_versioning.md](../references/structure/sub_folder_versioning.md) -- Sub-folder versioning (distinct from phase decomposition)
- [quick_reference.md](../references/workflows/quick_reference.md) -- Phase workflow shortcuts and decision tables
