---
title: Phase Definitions
description: Phase decomposition system for complex multi-session specifications, providing parallel work stream organization as a behavioral overlay on existing documentation levels.
---

# Phase Definitions

This document defines the phase decomposition taxonomy, detection scoring, folder structure conventions, lifecycle transitions, and validation rules. Phases are a behavioral overlay on existing documentation levels (not a new level tier), enabling complex multi-session specifications to be split into independently trackable and validatable child spec folders.

---

## 1. OVERVIEW

### What Are Phases?

Phases are a **behavioral overlay** on the existing documentation level system (Levels 1-3+). They are NOT a new level tier. Instead, phases decompose a single complex specification into multiple independent child spec folders, each representing a distinct work stream.

**Key distinction:** Levels describe documentation depth (how thoroughly to document). Phases describe work decomposition (how to split large work into manageable parts).

### When Phases Apply

Phases are suggested when a specification exceeds complexity thresholds that make single-folder management impractical. The phase system is most commonly used with Level 3 and Level 3+ specifications, though any level can technically use phases.

### Important Note

Phase decomposition is **workflow-assisted**: the AI can suggest phasing during spec creation, and scripts support phase-aware validation. The parent spec folder acts as the coordination point, while child phase folders operate as independent spec folders with their own documentation lifecycle.

---

## 2. PHASE DETECTION

### Complexity Scoring

Phase decomposition is triggered when a specification's complexity score meets the detection threshold. The scoring uses five dimensions:

| Dimension | Points | Condition |
|-----------|--------|-----------|
| Architectural complexity | 10 | Multiple systems, cross-cutting concerns, or architectural decisions |
| File count | 10 | Estimated files to modify > 15 |
| Lines of code | 10 | Estimated LOC > 800 |
| Risk level | 10 | Risk score >= 2 (moderate or higher) |
| Extreme scale | 10 | Exceeds any single dimension by 2x or more |

**Maximum score:** 50

### Detection Thresholds

Phase decomposition is suggested when BOTH conditions are met:

- **Phase score threshold:** phase complexity score >= 25 (out of 50-point maximum, scored above)
- **Level threshold:** documentation level >= 3 (from `recommend-level.sh` 100-point level scoring)

> **Scoring systems clarification:** The 50-point phase complexity score (this section) is separate from the 100-point level recommendation score used by `recommend-level.sh`. The level score determines documentation depth (L1/L2/L3/L3+); the phase score determines whether to decompose into child folders. Both thresholds must be met independently.

If only one condition is met, the specification proceeds as a standard (non-phased) spec folder.

### Suggested Phase Counts

| Score Range | Suggested Phases | Rationale |
|-------------|------------------|-----------|
| 25-34 | 2 phases | Moderate complexity, split into two work streams |
| 35-44 | 3 phases | High complexity, three parallel streams |
| 45+ | 4 phases | Extreme complexity, maximum recommended decomposition |

**Note:** These are suggestions, not requirements. The user decides the final phase count and organization.

---

## 3. FOLDER STRUCTURE

### Phase Folder Naming Convention

Phase child folders use the standard 3-digit numbered naming convention:

**Format:** `[0-9][0-9][0-9]-[name]/` (e.g., `001-foundation/`, `002-api-layer/`)

### Parent Folder Structure (lean trio policy)

A phase parent only requires **the lean trio** at the parent level: `spec.md`, `description.json`, `graph-metadata.json`. Heavy docs (`plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) live exclusively in the phase children where they stay accurate to that phase's actual work. The parent's `spec.md` carries the Phase Documentation Map; the parent's `graph-metadata.json` carries the structured rollup including `derived.last_active_child_id` and `derived.last_active_at` pointer fields:

```
specs/###-parent-feature/
├── spec.md                    # Vision, scope, Phase Documentation Map
├── description.json           # Discovery metadata
├── graph-metadata.json        # Children list + derived rollup + last_active_child_id pointer
├── 001-foundation/            # Phase 1 (full Level-N child)
│   ├── spec.md
│   ├── description.json
│   ├── graph-metadata.json
│   ├── plan.md
│   ├── tasks.md
│   ├── checklist.md           # Level 2+
│   ├── decision-record.md     # Level 3+
│   └── implementation-summary.md  # Created post-implementation
├── 002-api-layer/             # Phase 2 (same shape as 001)
└── 003-frontend/              # Phase 3 (same shape as 001)
```

**Detection rule (single source of truth):** A spec folder is a phase parent iff (a) it has at least one direct child matching `^[0-9]{3}-[a-z0-9-]+$` AND (b) at least one such child has `spec.md` OR `description.json`. The shell helper `is_phase_parent()` (in `.opencode/skill/system-spec-kit/scripts/lib/shell-common.sh`) and the ESM JS helper `isPhaseParent()` (in `.opencode/skill/system-spec-kit/scripts/dist/spec/is-phase-parent.js`) both implement this contract; they MUST agree on every input. The validator's phase-parent branches in `check-files.sh`, `check-level-match.sh`, `check-anchors.sh`, `check-section-counts.sh`, and `check-template-headers.sh` skip Level-N expectations when this returns true.

**Parent template:** New phase decompositions via `create.sh --phase` scaffold the parent from `phase-parent Level template contract` (lean) and each child from the appropriate `Level template contract` set. The lean template carries an inline content-discipline comment listing FORBIDDEN narrative tokens (consolidation, merge, migration history) and REQUIRED content (root purpose, sub-phase control file, what needs done) — the new `PHASE_PARENT_CONTENT` validator enforces this advisory.

**Tolerant migration policy:** Legacy phase parents that retain heavy docs (e.g. `026-graph-and-context-optimization/`) continue to validate without churn. Soft deprecation of legacy heavy docs is a separate follow-on packet.

### Parent spec.md: Phase Documentation Map

The parent `spec.md` includes a Phase Documentation Map section that lists all child phases with their status:

```markdown
## Phase Documentation Map

| Phase | Folder | Status | Description |
|-------|--------|--------|-------------|
| 1 | `001-foundation/` | active | Core data models and database schema |
| 2 | `002-api-layer/` | draft | REST API endpoints and middleware |
| 3 | `003-frontend/` | draft | UI components and state management |
```

### Child spec.md: Parent Back-Reference

Each child phase `spec.md` includes a metadata table linking it to the parent and adjacent phases:

```markdown
| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../NNN-previous-phase/spec.md` |
| **Successor** | `../NNN-next-phase/spec.md` |
```

This back-reference enables:
- Navigation from child to parent
- Validation of parent-child link integrity
- Phase-aware context loading
- A stable parent-relative location for packet-local phase changelog files

---

## 4. PHASE LIFECYCLE

### Lifecycle Stages

Phase-decomposed specifications follow a structured lifecycle:

```
1. CREATE
   └── Parent spec folder created
       └── Phase Documentation Map defined in parent spec.md
       └── Child phase folders created with back-references

2. PLAN (per child)
   └── Each phase gets independent plan.md and tasks.md
       └── Dependencies between phases documented in parent plan.md

3. IMPLEMENT (per child)
   └── Each phase implemented independently
       └── Phase status updated in parent Phase Documentation Map
       └── Memory saved per-phase for session continuity

4. VALIDATE (recursive)
   └── Each child phase validated independently
       └── Parent validates all children complete
       └── Cross-phase integration verified
       └── Parent changelog/ captures root and phase closeout entries as needed
```

### Phase Status Values

Phase folders use the same status values as regular spec folders:

| Status | Meaning |
|--------|---------|
| `draft` | Phase planned but not started |
| `active` | Phase currently being implemented |
| `paused` | Phase temporarily on hold |
| `complete` | Phase implementation finished |

### Cross-Phase Dependencies

Document dependencies between phases in the parent `plan.md`:

```markdown
## Phase Dependencies

Phase 2 (API Layer) depends on:
- Phase 1 (Foundation): Data models must be complete

Phase 3 (Frontend) depends on:
- Phase 2 (API Layer): API endpoints must be defined
- Phase 1 (Foundation): Shared types must be exported
```

---

## 5. VALIDATION

### PHASE_LINKS Rule

The `PHASE_LINKS` validation rule checks the integrity of parent-child phase relationships:

| Check | Severity | Description |
|-------|----------|-------------|
| Parent has Phase Documentation Map | WARNING | Parent spec.md should list all child phases |
| Child has parent back-reference | WARNING | Child spec.md metadata should reference parent |
| Child has predecessor reference | WARNING | Direct-child spec.md should reference predecessor phase |
| Child has successor reference | WARNING | Direct-child spec.md should reference successor phase (except last) |
| Phase folder naming | ERROR | Child folders must follow `###-name/` convention |
| Phase status consistency | WARNING | Parent map status should match child spec.md status |

### Recursive Validation

When validating a phased spec folder, use recursive mode:

```bash
./scripts/spec/validate.sh specs/###-parent-feature/ --recursive
```

This validates:
1. The parent spec folder against its declared level
2. Each child phase folder against its declared level
3. Cross-references between parent and children (PHASE_LINKS)

---

## 6. RELATED RESOURCES

### Reference Files
- [sub_folder_versioning.md](./sub_folder_versioning.md) - Sequential versioning within spec folders (distinct from parallel phase decomposition)
- level specifications reference - Complete Level 1-3+ requirements and progressive enhancement model
- [validation_rules.md](../validation/validation_rules.md) - Validation rules including PHASE_LINKS

### Related Skills
- `system-spec-kit` - Spec folder workflow orchestrator (includes phase commands, validation, and semantic memory context preservation)
