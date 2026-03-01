---
title: "Tasks: Plan-to-Implementation Gate Bypass Fix [134-command-adherence/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "plan"
  - "implementation"
  - "gate"
  - "bypass"
  - "134"
  - "command"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Plan-to-Implementation Gate Bypass Fix

<!-- SPECKIT_LEVEL: 3 -->
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
## Phase 1: CLAUDE.md Gate 3 Phase Boundary

- [ ] T001 [P] Read CLAUDE.md Gate 3 block (lines 127-149) to understand current structure
- [ ] T002 Add PHASE BOUNDARY RULE before Gate 3 closing line (~line 147)
- [ ] T003 Content: Explain Gate 3 answers apply only within current workflow phase
- [ ] T004 Content: Define phase transition (plan workflow → implementation workflow)
- [ ] T005 Content: Note Exception for Memory Save Rule (post-execution carry-over)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: CLAUDE.md Memory Save Rule Scoping

- [ ] T006 [P] Read Memory Save Rule section (lines 184-186) to understand current wording
- [ ] T007 Update line 185: Change "USE IT as the folder argument (do NOT re-ask the user)" to "USE IT as the folder argument for memory saves (do NOT re-ask)"
- [ ] T008 Add clarification line after 186: "NOTE: This carry-over applies ONLY to memory saves. New workflow phases (plan→implement) MUST re-evaluate Gate 3."
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Plan YAML Enforcement Blocks

- [ ] T009 [P] Read `spec_kit_plan_auto.yaml` termination section (lines 425-428)
- [ ] T010 Add `enforcement:` block after line 428 in spec_kit_plan_auto.yaml
- [ ] T011 Content (auto): "CRITICAL: If user requests implementation via free text (e.g., 'implement this', 'go ahead', 'start coding'), you MUST: 1) Route through /spec_kit:implement command, 2) Re-evaluate Gate 3, 3) NEVER skip gates because they were passed during plan phase. Plan and implementation are SEPARATE gate-checked workflows."
- [ ] T012 [P] Read `spec_kit_plan_confirm.yaml` termination section (lines 477-480)
- [ ] T013 Add `enforcement:` block after line 480 in spec_kit_plan_confirm.yaml
- [ ] T014 Content (confirm): Same enforcement text as T011
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: plan.md Command Enforcement Note

- [ ] T015 [P] Read `plan.md` command file (line 121 termination note)
- [ ] T016 Add enforcement note after line 121
- [ ] T017 Content: "> **ENFORCEMENT:** If the user requests implementation via free text (not via `/spec_kit:implement`), you MUST route through the implement command. Plan and implementation are separate gate-checked phases — gate answers do NOT carry over."
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification

- [ ] T018 Manual test: Run `/spec_kit:plan` workflow to completion
- [ ] T019 Manual test: Say "Implement the following plan:" (free text, not command)
- [ ] T020 Verify: Agent re-asks Gate 3 question (A/B/C/D) instead of writing code
- [ ] T021 Verify: Agent routes request through `/spec_kit:implement` command
- [ ] T022 [P] Regression: Test Memory Save Rule (session spec folder still used)
- [ ] T023 [P] Regression: Test `/spec_kit:complete` workflow (no phase boundary)
- [ ] T024 Edge case: Test different phrasings ("go ahead", "start coding")
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (T018-T021)
- [ ] Regression tests passed (T022-T023)
- [ ] Checklist.md items verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:task-dependencies -->
## L2: TASK DEPENDENCIES

| Task | Depends On | Blocks | Estimated Time |
|------|------------|--------|----------------|
| T001 | None | T002 | 5 min |
| T002 | T001 | T018 | 10 min |
| T003 | T002 | T018 | 5 min |
| T004 | T002 | T018 | 5 min |
| T005 | T002 | T018 | 5 min |
| T006 | None | T007 | 3 min |
| T007 | T006 | T018 | 5 min |
| T008 | T007 | T018 | 5 min |
| T009 | None | T010 | 3 min |
| T010 | T009 | T018 | 5 min |
| T011 | T010 | T018 | 5 min |
| T012 | None | T013 | 3 min |
| T013 | T012 | T018 | 5 min |
| T014 | T013 | T018 | 5 min |
| T015 | None | T016 | 3 min |
| T016 | T015 | T018 | 5 min |
| T017 | T016 | T018 | 5 min |
| T018 | T002-T017 | None | 10 min |
| T019 | T018 | T020 | 5 min |
| T020 | T019 | None | 5 min |
| T021 | T019 | None | 5 min |
| T022 | T018 | None | 10 min |
| T023 | T018 | None | 10 min |
| T024 | T018 | None | 10 min |

**Total Estimated Time**: 1.5-2 hours
<!-- /ANCHOR:task-dependencies -->

---

<!-- ANCHOR:parallel-groups -->
## L2: PARALLEL EXECUTION GROUPS

### Group 1 (Phases 1-4 - Parallel)

- T001-T005: Gate 3 Phase Boundary (parallel with other groups)
- T006-T008: Memory Save Rule Scoping (parallel)
- T009-T014: YAML Enforcement Blocks (parallel)
- T015-T017: plan.md Enforcement Note (parallel)

### Group 2 (Phase 5 - Sequential)

- T018: Complete plan workflow → T019 → T020, T021
- T022: Memory save regression (parallel with T023-T024)
- T023: Complete workflow regression (parallel)
- T024: Edge case testing (parallel)

**Critical Path**: T001 → T002 → T018 → T019 → T020 (40 minutes)
<!-- /ANCHOR:parallel-groups -->

---

<!-- ANCHOR:blockers -->
## L2: BLOCKER TRACKING

| Task | Blocker | Status | ETA | Mitigation |
|------|---------|--------|-----|------------|
| T018-T024 | Implementation (T002-T017) | Pending | N/A | Complete file changes first |
| No external blockers | N/A | N/A | N/A | N/A |

**No external blockers identified**
<!-- /ANCHOR:blockers -->

---

<!-- ANCHOR:workstream -->
## L3: WORKSTREAM BREAKDOWN

### WS-001: CLAUDE.md Updates (T001-T008)

**Owner**: Implementation agent
**Duration**: 25-30 minutes
**Dependencies**: None
**Deliverable**: Gate 3 phase boundary + Memory Save Rule scoping

### WS-002: YAML Enforcement (T009-T014)

**Owner**: Implementation agent
**Duration**: 20-25 minutes
**Dependencies**: None (parallel with WS-001)
**Deliverable**: Enforcement blocks in both plan YAML files

### WS-003: Command Documentation (T015-T017)

**Owner**: Implementation agent
**Duration**: 10-15 minutes
**Dependencies**: None (parallel with WS-001, WS-002)
**Deliverable**: plan.md enforcement note

### WS-004: Verification & Testing (T018-T024)

**Owner**: Implementation agent
**Duration**: 45-60 minutes
**Dependencies**: WS-001, WS-002, WS-003
**Deliverable**: All tests passing, no regressions
<!-- /ANCHOR:workstream -->

---

<!-- ANCHOR:risk-tasks -->
## L3: HIGH-RISK TASKS

| Task | Risk | Impact | Mitigation |
|------|------|--------|------------|
| T002-T005 | Gate 3 wording unclear | M | Clear examples (plan → implement), explicit exception for Memory Save |
| T007-T008 | Memory Save regression | M | Explicit scoping ("ONLY to memory saves"), regression test (T022) |
| T010-T014 | Over-aggressive enforcement | M | Exception for `/spec_kit:complete`, clear rationale in enforcement text |
| T020-T021 | Agent doesn't route properly | H | Comprehensive enforcement wording ("MUST route", "NEVER skip gates") |
<!-- /ANCHOR:risk-tasks -->

---

<!-- ANCHOR:acceptance -->
## L3: ACCEPTANCE TESTING PLAN

### AT-001: Free-Text Implement Routing

- **Test**: Run `/spec_kit:plan` → complete → say "implement this"
- **Expected**: Agent re-asks Gate 3 (A/B/C/D) and routes through `/spec_kit:implement`
- **Pass Criteria**: Gate 3 re-evaluation occurs, no direct coding

### AT-002: Memory Save Rule Preservation

- **Test**: Run `/spec_kit:plan` → answer Gate 3 → later run `/memory:save`
- **Expected**: Agent uses session spec folder without re-asking
- **Pass Criteria**: No Gate 3 re-prompt for memory save

### AT-003: Complete Workflow Unchanged

- **Test**: Run `/spec_kit:complete` → observe plan-to-implement transition
- **Expected**: No Gate 3 re-evaluation (single workflow phase)
- **Pass Criteria**: Smooth transition, no re-prompts

### AT-004: Edge Case Phrasings

- **Test**: Try "go ahead", "start coding", "implement now"
- **Expected**: All route through `/spec_kit:implement` with gate re-check
- **Pass Criteria**: Consistent enforcement across phrasings
<!-- /ANCHOR:acceptance -->

---

<!--
LEVEL 3 TASKS (~200 lines)
- Core + L2 + L3 addendums
- Task dependencies, parallel groups
- Workstream breakdown, risk tasks, acceptance tests
- Bug fix task list (pre-implementation)
-->
