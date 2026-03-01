---
title: "Tasks: SpecKit Phase System [138-spec-kit-phase-system/tasks]"
description: "Task Format: T### [priority] [P?] Description (file path) — Priority (e.g., [P0]) and parallelism ([P]) are independent markers."
trigger_phrases:
  - "tasks"
  - "speckit"
  - "phase"
  - "system"
  - "138"
  - "spec"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Tasks: SpecKit Phase System

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Overview

| Phase | Tasks | Est. LOC | Priority |
|-------|-------|----------|----------|
| Phase 1: Detection & Scoring | T001-T005 | ~150 | P0 |
| Phase 2: Templates & Creation | T006-T012, T033 | ~250 | P0 |
| Phase 3: Commands & Router | T013-T023 | ~400 | P0/P1 |
| Phase 4: Validation, Docs & Nodes | T024-T032, T034 | ~500 | P0/P1 |
| **Total** | **34 tasks** | **~1300** | |

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable (can run in parallel with other `[P]` tasks at same level) |
| `[B]` | Blocked |
| `[P0]`/`[P1]`/`[P2]` | Priority level (distinct from `[P]` parallelism marker) |

**Task Format**: `T### [priority] [P?] Description (file path)` — Priority (e.g., `[P0]`) and parallelism (`[P]`) are independent markers.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Detection & Scoring

- [x] T001 [P0] Add `determine_phasing()` function to `recommend-level.sh` with 5 phase signal scoring dimensions (`scripts/spec/recommend-level.sh`)
- [x] T002 [P0] Add `--recommend-phases` CLI flag to include phase scoring in output [B: T001] (`scripts/spec/recommend-level.sh`)
- [x] T003 [P1] Add `--phase-threshold <N>` CLI flag for threshold override (default 25) [B: T001] (`scripts/spec/recommend-level.sh`)
- [x] T004 [P0] Extend JSON output with `recommended_phases`, `phase_score`, `phase_reason`, `suggested_phase_count` [B: T001, T002] (`scripts/spec/recommend-level.sh`)
- [ ] T005 [P1] Create 5 test fixtures: below threshold, at boundary, above threshold, extreme scale, no risk factors [B: T001-T004]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Templates & Creation

- [x] T006 [P0] [P] Create `templates/addendum/phase/phase-parent-section.md` (Phase Documentation Map template) (`templates/addendum/phase/phase-parent-section.md`)
- [x] T007 [P0] [P] Create `templates/addendum/phase/phase-child-header.md` (parent back-reference metadata block) (`templates/addendum/phase/phase-child-header.md`)
- [x] T008 [P0] Add `--phase` flag to `create.sh` (mutually exclusive with `--subfolder`) [B: T006, T007] (`scripts/spec/create.sh`)
- [x] T009 [P1] Add `--phases <N>` flag for multi-child creation with auto-numbering [B: T008] (`scripts/spec/create.sh`)
- [x] T010 [P1] Add `--phase-names <list>` flag for descriptive child folder naming [B: T008] (`scripts/spec/create.sh`)
- [x] T011 [P0] Implement Phase Documentation Map injection into parent spec.md [B: T006, T008] (`scripts/spec/create.sh`)
- [x] T012 [P0] Implement parent back-reference injection into child spec.md [B: T007, T008] (`scripts/spec/create.sh`)
- [ ] T033 [P1] Create 4 test fixtures for Phase 2: single phase, multi-phase, with names, error cases [B: T008-T012] (`tests/fixtures/phase-2/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Commands & Router

- [x] T013 [P0] [P] Add PHASE intent to SKILL.md `INTENT_SIGNALS` dict (`SKILL.md`)
- [x] T014 [P0] Add PHASE → `phase_definitions.md` to SKILL.md `RESOURCE_MAP` [B: T013] (`SKILL.md`)
- [x] T015 [P0] Add `/spec_kit:phase` → PHASE to SKILL.md `COMMAND_BOOSTS` [B: T013] (`SKILL.md`)
- [x] T016 [P1] Remove `"phase"` from IMPLEMENT keywords in SKILL.md [B: T013] (`SKILL.md`)
- [x] T017 [P0] [P] Create `command/spec_kit/phase.md` command entry point (`command/spec_kit/phase.md`)
- [x] T018 [P0] Create `assets/spec_kit_phase_auto.yaml` (7-step autonomous workflow) [B: T017] (`assets/spec_kit_phase_auto.yaml`)
- [x] T019 [P1] Create `assets/spec_kit_phase_confirm.yaml` (7-step interactive workflow) [B: T017] (`assets/spec_kit_phase_confirm.yaml`)
- [x] T020 [P1] Update `/spec_kit:plan` with Gate 3 Option E and `--phase-folder` argument [B: Phase 2] (`command/spec_kit/plan.md`)
- [x] T021 [P1] Update `/spec_kit:implement` for nested phase path resolution [B: Phase 2] (`command/spec_kit/implement.md`)
- [x] T022 [P1] Update `/spec_kit:complete` with phase lifecycle validation step [B: Phase 2] (`command/spec_kit/complete.md`)
- [x] T023 [P1] Update `/spec_kit:resume` with phase folder detection and selection [B: Phase 2] (`command/spec_kit/resume.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Validation, Docs & Nodes

- [x] T024 [P0] [P] Add `--recursive` flag to `validate.sh` with child folder discovery (`scripts/spec/validate.sh`)
- [x] T025 [P0] Implement per-phase validation aggregation and combined exit codes [B: T024] (`scripts/spec/validate.sh`)
- [x] T026 [P1] Extend JSON output with `"phases": [...]` array [B: T024] (`scripts/spec/validate.sh`)
- [x] T027 [P1] Create `check-phase-links.sh` validation rule script [B: T024] (`scripts/rules/check-phase-links.sh`)
- [ ] T028 [P1] Create 6 test fixtures: flat, 1-phase, 3-phase, mixed levels, empty child, broken links [B: T024-T027]
- [x] T029 [P1] [P] Create `references/structure/phase_definitions.md` (`references/structure/phase_definitions.md`)
- [x] T030 [P1] Update `sub_folder_versioning.md`, `level_specifications.md`, `template_guide.md`, `quick_reference.md`, `validation_rules.md` [B: T029]
- [x] T031 [P1] [P] Create `nodes/phase-system.md` graph mode node (`nodes/phase-system.md`)
- [x] T032 [P1] Update `index.md` MOC with phase-system node link [B: T031] (`index.md`)
- [x] T034 [P1] Update `CLAUDE.md` Gate 3 with Option E (phase folder) [B: T017, T020] (`CLAUDE.md`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (31/34 complete; remaining: T005, T028, T033)
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (pending fixture backlog closure)
- [ ] `validate.sh --recursive` passes on spec folder with full fixture coverage evidence
- [ ] All 4 phases delivered and integrated with verification artifacts
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Dependency Graph**:
  ```
  T001 ──→ T002 ──→ T004 ──→ T005
    │       │
    └──→ T003

  T006 ──→ T008 ──→ T009
  T007 ──→ T008 ──→ T010
  T006 + T008 ──→ T011
  T007 + T008 ──→ T012
  T008-T012 ──→ T033

  T013 ──→ T014, T015, T016
  T017 ──→ T018, T019
  Phase 2 ──→ T020, T021, T022, T023

  T024 ──→ T025 ──→ T026
  T024 ──→ T027 ──→ T028
  T029 ──→ T030
  T031 ──→ T032
  T017 + T020 ──→ T034
  ```
<!-- /ANCHOR:cross-refs -->

---

<!--
L3+ TEMPLATE (~100 lines)
- 4 phases: Detection & Scoring, Templates & Creation, Commands & Router, Validation, Docs & Nodes
- 34 tasks with priority (P0/P1), dependency notation ([B: Txx]), and parallelism ([P]) markers
- T033: Phase 2 test fixtures (single phase, multi-phase, with names, error cases)
- T034: CLAUDE.md Gate 3 Option E update
- Dependency graph preserved in cross-refs
-->
