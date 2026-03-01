---
title: "Tasks: Fix Command Dispatch Vulnerability [118-fix-command-dispatch/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "fix"
  - "command"
  - "dispatch"
  - "vulnerability"
  - "118"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Fix Command Dispatch Vulnerability

<!-- SPECKIT_LEVEL: 3+ -->
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

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Audit (COMPLETED)

- [x] T001 Audit all 7 command files for V1-V6 vulnerability patterns (`.opencode/command/spec_kit/*.md`)
  - [x] T001a Audit `complete.md` for V1-V6 patterns
  - [x] T001b Audit `debug.md` for V1-V6 patterns
  - [x] T001c Audit `handover.md` for V1-V6 patterns
  - [x] T001d Audit `plan.md` for V1-V6 patterns
  - [x] T001e Audit `research.md` for V1-V6 patterns
  - [x] T001f Audit `resume.md` for V1-V6 patterns
  - [x] T001g Audit `implement.md` for V1-V6 patterns
- [x] T002 [P] Audit all 13 YAML workflow files for V5 routing issues (`.opencode/command/spec_kit/assets/*.yaml`)
- [x] T003 Document audit findings in scratch/audit-results.md

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Universal Fixes (A+B) — All 7 .md Files

- [ ] T004 Apply Fix A+B to all 7 command files (universal structural fix)
  - [ ] T004a Apply Fix A+B to `complete.md` - add guardrail + move YAML loading to first 15 lines
  - [ ] T004b Apply Fix A+B to `debug.md`
  - [ ] T004c Apply Fix A+B to `handover.md`
  - [ ] T004d Apply Fix A+B to `plan.md`
  - [ ] T004e Apply Fix A+B to `research.md`
  - [ ] T004f Apply Fix A+B to `resume.md`
  - [ ] T004g Apply Fix A+B to `implement.md`

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Targeted Fixes (C+D) — 4 .md Files

- [ ] T005 Apply Fix C to complete.md (fence 6 unfenced dispatch templates)
- [ ] T006 Apply Fix C to debug.md (fence 3 unfenced dispatch templates)
- [ ] T007 Apply Fix C to research.md (fence 2 unfenced dispatch templates)
- [ ] T008 Apply Fix C to plan.md (fence 2 unfenced dispatch templates)
- [ ] T009 Apply Fix D to complete.md (reduce 19 @refs to <10)
- [ ] T010 Apply Fix D to debug.md (reduce 13 @refs to <8)

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: YAML Fixes (E) — 13 .yaml Files

- [ ] T011 Apply Fix E to all 13 YAML files (add REFERENCE comments to agent_routing)
  - [ ] T011a Add REFERENCE comment to complete.yaml
  - [ ] T011b Add REFERENCE comment to debug.yaml
  - [ ] T011c Add REFERENCE comment to handover.yaml
  - [ ] T011d Add REFERENCE comment to plan.yaml
  - [ ] T011e Add REFERENCE comment to research.yaml
  - [ ] T011f Add REFERENCE comment to resume.yaml
  - [ ] T011g Add REFERENCE comment to implement.yaml
  - [ ] T011h Add REFERENCE comments to other 6 YAML files

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification

- [ ] T012 Test each command individually - verify no phantom dispatch
  - [ ] T012a Test `/spec_kit:complete`
  - [ ] T012b Test `/spec_kit:debug`
  - [ ] T012c Test `/spec_kit:handover`
  - [ ] T012d Test `/spec_kit:plan`
  - [ ] T012e Test `/spec_kit:research`
  - [ ] T012f Test `/spec_kit:resume`
  - [ ] T012g Test `/spec_kit:implement`
- [ ] T013 Verify cross-references (section numbers) still valid after restructure
- [ ] T014 Document patterns for future command creation
- [ ] T015 Update implementation-summary.md with results

<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 7 commands pass manual verification (no phantom dispatch)
- [ ] Cross-references validated after structural changes
- [ ] Pattern guide created for future reference
- [ ] All P0 checklist items verified

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` - REQ-001 through REQ-006
- **Plan**: See `plan.md` - V1-V6 vulnerability pattern catalog
- **Checklist**: See `checklist.md` - verification protocol

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3+ TASKS - Upgraded from Level 2
10 top-level tasks with subtasks
Phase 1: Audit (T001-T003), Phase 2: Fix (T004-T006), Phase 3: Verify (T007-T010)
-->
