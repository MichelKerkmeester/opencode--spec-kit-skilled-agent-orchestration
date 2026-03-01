---
title: "Tasks: System-Spec-Kit Known Limitations Remediation [088-speckit-known-limitations-remediation/tasks]"
description: "Task Format: T### [P?] [Priority] Description (file path) → CHK-###"
trigger_phrases:
  - "tasks"
  - "system"
  - "spec"
  - "kit"
  - "known"
  - "088"
  - "speckit"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: System-Spec-Kit Known Limitations Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.0 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] [Priority] Description (file path) → CHK-###`

---

## Phase 1: SQLite Schema Unification (KL-1)

- [x] T001 [P0] Design unified memory_conflicts DDL merging Schema A + Schema C columns → CHK-010
- [x] T002 [P0] Add migration v12 to vector-index.js — DROP+recreate memory_conflicts with unified schema → CHK-011
- [x] T003 [P0] Update create_schema() in vector-index.js to use unified DDL → CHK-012
- [x] T004 [P0] Bump SCHEMA_VERSION from 11 to 12 (vector-index.js:155) → CHK-013
- [x] T005 [P0] Remove ensure_conflicts_table() from prediction-error-gate.js → CHK-014
- [x] T006 [P0] Fix INSERT in memory-save.js:270-289 to match unified columns → CHK-015
- [x] T007 [P0] Fix INSERT in prediction-error-gate.js log_conflict():336-366 to match unified columns → CHK-016
- [x] T008 [P0] Remove silent error swallowing in memory-save.js:292 and prediction-error-gate.js:369 → CHK-017

**Phase Gate**: All INSERT paths use unified column names; migration v12 tested

---

## Phase 2: Gate Numbering Fixes (KL-2)

### Phase 2a — Active files

- [x] T009 [P] [P1] Fix orchestrate.md line 231: Gate 4 → Gate 3 → CHK-020
- [x] T010 [P] [P1] Fix AGENTS.md line 503: Gate 4 Option B → Gate 3 Option B → CHK-021
- [x] T011 [P] [P1] Fix scripts-registry.json lines 45, 54: Gate 6 → Completion Verification Rule → CHK-022
- [x] T012 [P] [P1] Fix scripts/README.md lines 136, 244, 325: Gate 6 → Completion Verification Rule → CHK-023
- [x] T013 [P] [P1] Fix check-completion.sh line 44: Gate 6 → Completion Verification Rule → CHK-024

### Phase 2b — Legacy install guide

- [x] T014 [P1] Rewrite SET-UP - AGENTS.md gate table (lines 125-131) to current 3-gate scheme → CHK-025
- [x] T015 [P1] Rewrite SET-UP - AGENTS.md flow diagram (lines 135-168) to current scheme → CHK-025
- [x] T016 [P1] Update SET-UP - AGENTS.md validation checklist (line 968) and appendix (line 1057) → CHK-025

**Phase Gate**: Zero Gate 4/5/6 references in active files

---

## Phase 3: Script Documentation (KL-3)

- [x] T017 [P] [P1] Add archive.sh, check-completion.sh, recommend-level.sh to speckit.md Capability Scan → CHK-030
- [x] T018 [P] [P1] Add archive.sh, check-completion.sh, recommend-level.sh to SKILL.md Key Scripts → CHK-031

**Phase Gate**: All 6 spec scripts listed in both capability tables

---

## Phase 4: Signal Handler Cleanup (KL-4)

- [x] T019 [P] [P1] Add toolCache.stopCleanupInterval() to SIGINT/SIGTERM in context-server.js → CHK-040
- [x] T020 [P] [P1] Remove duplicate process.on('SIGINT'/'SIGTERM') from access-tracker.js:165-167 → CHK-041

**Phase Gate**: All background intervals cleaned up on shutdown

---

## Phase 5: Verification

- [x] T021 [P0] Verify migration v12: PRAGMA user_version = 12, .schema correct → CHK-050
- [x] T022 [P0] Verify zero Gate 4/5/6 refs: grep across active files → CHK-051
- [x] T023 [P1] Verify scripts in capability tables: grep speckit.md and SKILL.md → CHK-052
- [x] T024 [P1] Verify signal handlers: read context-server.js cleanup section → CHK-053

---

## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All P0 checklist items verified
- [x] Spec folder documentation complete

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Detailed analysis**: See `087-speckit-deep-analysis/known-limitations.md`

---

## L2: TASK-CHECKLIST MAPPING

| Task ID | Checklist Item | Priority | Status |
|---------|----------------|----------|--------|
| T001-T008 | CHK-010 to CHK-017 | P0 | [x] |
| T009-T016 | CHK-020 to CHK-025 | P1 | [x] |
| T017-T018 | CHK-030 to CHK-031 | P1 | [x] |
| T019-T020 | CHK-040 to CHK-041 | P1 | [x] |
| T021-T024 | CHK-050 to CHK-053 | P0/P1 | [x] |

---

## L2: PHASE COMPLETION GATES

### Gate 1: Schema Unification Complete
- [x] Migration v12 added and SCHEMA_VERSION bumped
- [x] Both INSERT paths use unified columns
- [x] Error swallowing removed

### Gate 2: Gate Numbering Fixed
- [x] Zero Gate 4/6 in active files
- [x] Legacy install guide updated

### Gate 3: Documentation & Cleanup Complete
- [x] Scripts in capability tables
- [x] Signal handlers clean
- [x] All verification greps pass
