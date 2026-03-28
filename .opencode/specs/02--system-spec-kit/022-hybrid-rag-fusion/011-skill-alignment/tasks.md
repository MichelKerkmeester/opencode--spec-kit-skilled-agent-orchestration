---
title: "Tasks: Skill Alignment — system-spec-kit"
description: "Reconciled task list for closing the last system-spec-kit documentation gaps."
trigger_phrases: ["tasks", "skill alignment", "011 alignment"]
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
## Phase 1: Setup
<!-- alias: Pack Reconciliation -->

- [x] T001 Rewrite `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` so they all reflect the live 33-tool, 6-command memory surface (`./spec.md`, `./plan.md`, `./tasks.md`, `./checklist.md`, `./implementation-summary.md`)
- [x] T002 Remove stale command-surface count language and retired standalone retrieval-command framing from the canonical 011 docs (`./spec.md`, `./plan.md`, `./tasks.md`, `./checklist.md`, `./implementation-summary.md`)
- [x] T003 Preserve the documentation-only boundary for this phase (`./spec.md`, `./plan.md`, `./tasks.md`, `./checklist.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- alias: Skill-Guide Closeout -->

- [x] T004 Update SKILL.md to describe the live memory-command surface as 33 tools, 4 commands, retrieval in `/memory:search`, and shared-memory lifecycle under `/memory:manage shared`
- [x] T005 Add save-workflow governance and shared-memory framing to SKILL.md so the skill guide explains how shared-memory and save behavior fit together
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- alias: Reference Closeout + Asset Closeout + Verification -->

- [x] T006 Add governance and shared-memory routing guidance to references/memory/save_workflow
- [x] T007 Add shared-space and governance framing to references/memory/embedding_resilience
<!-- /ANCHOR:phase-3 -->

---

### Phase 4: Asset Closeout

- [x] T008 Add campaign/shared-space/cross-phase dispatch guidance to assets/parallel_dispatch_config
- [x] T009 Add campaign/shared-space/cross-phase scoring guidance to assets/complexity_decision_matrix and assets/level_decision_matrix
- [x] T017 Add campaign/shared-space/cross-phase template-routing guidance to assets/template_mapping

---

### Phase 5: Post-Research-Refinement Alignment (2026-03-22)

Drift reconciliation after session-capturing (009) and research-based-refinement (epic/011) phases.

- [x] T011 Reconcile SKILL.md feature flags table count (25 -> 33 search/pipeline flags; 47 total including roadmap env vars)
- [x] T012 Update feature catalog count in SKILL.md (194 to 221 documented features, 2 locations)
- [x] T013 Update testing playbook count in SKILL.md resource table (3 files to 19 categories, 227 per-test files)
- [x] T014 Add `memory_quick_search()` row to memory_system tool reference table (32 to 33 rows, matching header)
- [x] T015 Add 9 graduated spec-011 flags to environment_variables section 8.2
- [x] T016 Verify agent definitions, command files, and command configs have no stale references [Evidence: all clean, no hardcoded counts]

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The canonical 011 docs use the live 33-tool, 6-command memory model
- [x] The canonical 011 docs no longer preserve obsolete command-surface or retired retrieval-command framing
- [x] The last observable `system-spec-kit` documentation drift is closed in the scoped live docs
- [x] Strict validation passes for the reconciled 011 pack
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
