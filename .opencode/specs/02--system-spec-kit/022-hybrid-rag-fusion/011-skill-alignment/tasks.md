---
title: "Tasks: Skill Alignment — system-spec-kit"
description: "Reconciled task list for closing the last system-spec-kit documentation gaps."
trigger_phrases: ["tasks", "skill alignment", "010 alignment"]
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Skill Alignment — system-spec-kit
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (target)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Pack Reconciliation

- [x] T001 Rewrite `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` so they all reflect the live 33-tool, 6-command memory surface (`./spec.md`, `./plan.md`, `./tasks.md`, `./checklist.md`, `./implementation-summary.md`)
- [x] T002 Remove stale command-surface count language and retired standalone retrieval-command framing from the canonical 010 docs (`./spec.md`, `./plan.md`, `./tasks.md`, `./checklist.md`, `./implementation-summary.md`)
- [x] T003 Preserve the documentation-only boundary for this phase (`./spec.md`, `./plan.md`, `./tasks.md`, `./checklist.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Skill-Guide Closeout

- [x] T004 Update `SKILL.md` to describe the live memory-command surface as 33 tools, 6 commands, and retrieval in `/memory:analyze` (`.opencode/skill/system-spec-kit/SKILL.md`)
- [x] T005 Add save-workflow governance and shared-memory framing to `SKILL.md` so the skill guide explains how shared-memory and save behavior fit together (`.opencode/skill/system-spec-kit/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Reference Closeout

- [x] T006 Add governance and shared-memory routing guidance to `references/memory/save_workflow.md` (`.opencode/skill/system-spec-kit/references/memory/save_workflow.md`)
- [x] T007 Add shared-space and governance framing to `references/memory/embedding_resilience.md` (`.opencode/skill/system-spec-kit/references/memory/embedding_resilience.md`)
<!-- /ANCHOR:phase-3 -->

---

## Phase 4: Asset Closeout

- [x] T008 Add campaign/shared-space/cross-phase dispatch guidance to `assets/parallel_dispatch_config.md` (`.opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md`)
- [x] T009 Add campaign/shared-space/cross-phase scoring guidance to `assets/complexity_decision_matrix.md` and `assets/level_decision_matrix.md` (`.opencode/skill/system-spec-kit/assets/complexity_decision_matrix.md`, `.opencode/skill/system-spec-kit/assets/level_decision_matrix.md`)
- [x] T010 Add campaign/shared-space/cross-phase template-routing guidance to `assets/template_mapping.md` (`.opencode/skill/system-spec-kit/assets/template_mapping.md`)

---

## Phase 5: Post-Research-Refinement Alignment (2026-03-22)

Drift reconciliation after session-capturing (009) and research-based-refinement (epic/011) phases.

- [x] T011 Add 9 graduated spec-011 flags to SKILL.md feature flags table (25 → 34 flags) (`.opencode/skill/system-spec-kit/SKILL.md`)
- [x] T012 Update feature catalog count in SKILL.md (194 → 220 documented features, 2 locations) (`.opencode/skill/system-spec-kit/SKILL.md`)
- [x] T013 Update testing playbook count in SKILL.md resource table (3 files → 19 categories, 226 per-test files) (`.opencode/skill/system-spec-kit/SKILL.md`)
- [x] T014 Add `memory_quick_search()` row to memory_system.md tool reference table (32 → 33 rows, matching header) (`.opencode/skill/system-spec-kit/references/memory/memory_system.md`)
- [x] T015 Add 9 graduated spec-011 flags to environment_variables.md section 8.2 (`.opencode/skill/system-spec-kit/references/config/environment_variables.md`)
- [x] T016 Verify agent definitions, command files, and command configs have no stale references [Evidence: all clean, no hardcoded counts]

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The canonical 010 docs use the live 33-tool, 6-command memory model
- [x] The canonical 010 docs no longer preserve obsolete command-surface or retired retrieval-command framing
- [x] The last observable `system-spec-kit` documentation drift is closed in the scoped live docs
- [x] Strict validation passes for the reconciled 010 pack
- [x] SKILL.md feature flags, catalog counts, and playbook counts reflect post-spec-011 state
- [x] memory_system.md tool table has 33 rows matching header count
- [x] environment_variables.md documents all graduated spec-011 flags
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `./spec.md`
- **Plan**: See `./plan.md`
- **Checklist**: See `./checklist.md`
- **Implementation Summary**: See `./implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---
