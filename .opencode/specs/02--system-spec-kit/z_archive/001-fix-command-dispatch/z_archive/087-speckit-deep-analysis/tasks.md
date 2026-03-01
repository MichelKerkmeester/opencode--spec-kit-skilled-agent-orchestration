---
title: "Tasks: System-Spec-Kit Deep Analysis & Remediation [087-speckit-deep-analysis/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "system"
  - "spec"
  - "kit"
  - "deep"
  - "087"
  - "speckit"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: System-Spec-Kit Deep Analysis & Remediation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3plus-govern | v2.0 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[ ]` | Pending |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

---

## Phase 0: Spec Folder

- [x] T001 Create spec folder `087-speckit-deep-analysis/` with Level 3+ templates

---

## Phase 1: Critical Bug Fixes

- [x] T002 Add `CREATE_LINKED` to CHECK constraint at line 431 (`vector-index.js`)
- [x] T003 Add `CREATE_LINKED` to CHECK constraint at line 1172 (`vector-index.js`)
- [x] T004 Rewrite MCP Tool Layers table to 7-layer architecture (`speckit.md:206-212`)
- [x] T005 Add 4 missing `/spec_kit:*` commands to Related Resources (`speckit.md:413-420`)
- [x] T006 Replace AGENTS.md -> AGENTS.md at line 12 (`SKILL.md`)
- [x] T007 Replace AGENTS.md -> AGENTS.md at line 254 (`SKILL.md`)
- [x] T008 Replace AGENTS.md -> AGENTS.md at line 423 (`SKILL.md`)
- [x] T009 Replace AGENTS.md -> AGENTS.md at lines 772-773 (`SKILL.md`)
- [x] T010 Replace AGENTS.md -> AGENTS.md at line 870 (`SKILL.md`)

---

## Phase 2: Moderate Misalignments

- [x] T011 Add tool prefix convention note in Section 8 (`AGENTS.md`)
- [x] T012 Fix Gate 4 Option B -> Gate 3 Option B (`AGENTS.md:503`)
- [x] T013 Add confidence threshold clarification note (`AGENTS.md:408-412`)
- [x] T014 Add two save pathways note in Memory Save Rule (`AGENTS.md:221`)
- [x] T015 [P] Update AGENTS.md references in `complete.md` (6 locations)
- [x] T016 Fix Gate 5 reference in `save.md:285`
- [x] T017 Fix AGENTS.md Gate 5 reference in `INSTALL_GUIDE.md:694`
- [x] T018 Correct gate numbering in Quick Reference table (`gate-enforcement.md:277-288`)
- [x] T019 Fix gate comment labels in trigger phrases (`gate-enforcement.md:16-24`)
- [x] T020 Update Gate 5 reference in `scripts-registry.json:20`
- [x] T021 [P] Standardize template counts in `speckit.md:198-201`
- [x] T022 [P] Standardize template counts in `SKILL.md:863-866`
- [x] T023 [P] Standardize template counts in `README.md:480-483`
- [x] T024 Boost memory INTENT_BOOSTER from 0.6 to 0.8 (`skill_advisor.py:168`)
- [x] T025 Boost context INTENT_BOOSTER from 0.5 to 0.6 (`skill_advisor.py:165`)
- [x] T026 Increase multi-skill boosters for context, save, session (`skill_advisor.py:296-303`)
- [x] T027 Lower debug boost from 1.0 to 0.6 for chrome-devtools (`skill_advisor.py:223`)
- [x] T028 Document shared-DB architecture in `opencode.json`

---

## Phase 2b: Extended AGENTS.md Migration

- [x] T029 [P] Replace AGENTS.md in `handover.md` (2 locations)
- [x] T030 [P] Replace AGENTS.md in `implement.md` (3 locations)
- [x] T031 [P] Replace AGENTS.md in `resume.md` (1 location)
- [x] T032 [P] Replace AGENTS.md in `research.md` (2 locations)
- [x] T033 [P] Replace AGENTS.md in `plan.md` (3 locations)
- [x] T034 [P] Replace AGENTS.md in `agent/research.md` (1 location)
- [x] T035 [P] Replace AGENTS.md in 9 YAML asset files (bulk sed)
- [x] T036 Replace AGENTS.md in `skill_advisor.py` comments (4 locations)
- [x] T037 Replace AGENTS.md in `README.md` (1 location)

---

## Phase 3: Verification

- [x] T038 Verify 0 AGENTS.md refs in SKILL.md
- [x] T039 Verify 0 ghost tools in speckit.md
- [x] T040 Verify 0 Gate 5 refs in active command/agent/skill files
- [x] T041 Verify 0 Gate 4 refs in AGENTS.md
- [x] T042 Verify CREATE_LINKED in both CHECK constraints
- [x] T043 Test `skill_advisor.py "save memory context"` >= 0.8
- [x] T044 Test `skill_advisor.py "debug this issue"` not routed to chrome-devtools
- [x] T045 Final comprehensive grep for remaining AGENTS.md in active files

---

## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All verification checks passing
- [x] Spec folder documentation complete

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
