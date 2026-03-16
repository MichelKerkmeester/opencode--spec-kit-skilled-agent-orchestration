---
title: "Tasks: manual-testing-per-playbook tooling-and-scripts phase [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tooling and scripts tasks"
  - "phase 016 tasks"
  - "manual testing tasks"
  - "tasks core"
importance_tier: "high"
contextType: "general"
---
# Tasks: manual-testing-per-playbook tooling-and-scripts phase

<!-- SPECKIT_LEVEL: 1 -->
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
## Phase 1: Setup

- [x] T001 Extract prompts, command sequences, and pass criteria for all 20 phase-016 scenarios from `../../manual_testing_playbook/manual_testing_playbook.md`
- [x] T002 [P] Confirm feature catalog links for NEW-061, NEW-062, NEW-070, NEW-089, NEW-099, NEW-113, NEW-127, NEW-128, NEW-135, NEW-136, NEW-137, NEW-138, NEW-139, NEW-147, and NEW-149 in `../../feature_catalog/16--tooling-and-scripts/`
- [x] T003 [P] Confirm phase-system catalog anchors for PHASE-001, PHASE-002, PHASE-003, PHASE-004, and PHASE-005 in `../../feature_catalog/feature_catalog.md`
- [x] T004 Source the NEW-139 session-capturing scenario from the canonical `M-007` playbook section and record the sourcing choice in spec.md open questions
- [ ] T005 [P] Prepare sandbox targets: watcher temp files, admin CLI disposable scope, malformed memory sandbox files, and disposable phase parent/child folders
- [ ] T006 Confirm MCP runtime availability for `memory_save` and slash-command scenarios (NEW-147, NEW-149)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Draft `spec.md` with metadata, 20-scenario scope table, P0 requirements, success criteria, and risk register
- [x] T008 Draft `plan.md` with readiness gates, definition of done, execution phases (preconditions, non-destructive, destructive, verdict), and 20-row testing strategy table
- [x] T009 Draft `tasks.md` with setup, implementation, and verification phases covering all 20 scenarios
- [x] T010 Draft `checklist.md` with P0/P1/P2 items for pre-implementation, scenario documentation quality, testing execution, security, documentation, and file organization
- [ ] T011 [P] Resolve open questions: promote NEW-139 to main scenario table and add dedicated PHASE-005 catalog leaf
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Execute Phase 1 preconditions: source reference availability, sandbox setup, and MCP runtime check
- [ ] T013 [P] Run non-destructive scenarios: NEW-061, NEW-062, NEW-070, NEW-089, NEW-127, NEW-128, NEW-135, NEW-136, NEW-137, NEW-138, NEW-147, and PHASE-001
- [ ] T014 Run destructive scenarios in sandbox: NEW-099, NEW-113, NEW-139, NEW-149, PHASE-002, PHASE-003, PHASE-004, and PHASE-005
- [ ] T015 Capture named evidence artifacts for each scenario (transcripts, grep output, Vitest logs, manifests, JSON output)
- [ ] T016 Assign PASS, PARTIAL, or FAIL verdict per scenario with explicit rationale referencing review protocol acceptance rules
- [x] T017 Validate documentation structure and required anchors across spec.md, plan.md, tasks.md, and checklist.md
- [ ] T018 Create `implementation-summary.md` when execution and verification are complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 20 scenarios have evidence-backed verdicts
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
