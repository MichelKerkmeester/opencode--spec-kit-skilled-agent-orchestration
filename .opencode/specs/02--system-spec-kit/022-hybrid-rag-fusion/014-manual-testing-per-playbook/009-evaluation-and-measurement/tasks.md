---
title: "Tasks: manual-testing-per-playbook evaluation-and-measurement phase [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "evaluation and measurement tasks"
  - "phase 009 tasks"
  - "measurement testing tasks"
  - "tasks core evaluation"
importance_tier: "high"
contextType: "general"
---
# Tasks: manual-testing-per-playbook evaluation-and-measurement phase

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

- [x] T001 Extract prompts, execution methods, evidence expectations, and pass criteria for all 16 scenarios from `../../manual_testing_playbook/manual_testing_playbook.md`
- [x] T002 Confirm feature catalog links for NEW-005 through NEW-015, NEW-072, NEW-082, NEW-088, NEW-090, and NEW-126 in `../../feature_catalog/09--evaluation-and-measurement/`
- [x] T003 Identify which scenarios are inspection-only (NEW-009, NEW-010, NEW-072, NEW-088, NEW-090) versus MCP-backed command-driven (NEW-005, NEW-006, NEW-007, NEW-008, NEW-011, NEW-012, NEW-013, NEW-014, NEW-015, NEW-082, NEW-126)
- [ ] T004 [P] Prepare isolated eval/context DB paths and confirm MCP runtime access for command-driven scenarios
- [ ] T005 [P] Verify baseline corpus and fixture prerequisites for NEW-008, NEW-011, and NEW-014 comparison scenarios
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Draft `spec.md` with metadata, 16-row scenario mapping table, 16 P0 requirements, and acceptance scenarios A and B
- [x] T007 Draft `plan.md` with readiness gates, four execution phases, and testing strategy table covering all 16 test IDs
- [ ] T008 Run inspection-oriented scenarios: NEW-009 (quality proxy), NEW-010 (corpus audit), NEW-072 (test quality review), NEW-088 (cross-AI fix verification), NEW-090 (INT8 decision re-evaluation)
- [ ] T009 [P] Run reproducible runtime scenarios: NEW-006, NEW-007, NEW-008, NEW-011, NEW-012, NEW-013, NEW-014, NEW-015
- [ ] T010 Run isolated write-heavy scenarios: NEW-005 (eval DB schema), NEW-082 (housekeeping fixes), NEW-126 (baseline snapshot suite)
- [ ] T011 [P] Resolve open questions for shared-vs-disposable sandbox decision (NEW-005, NEW-082, NEW-126) and canonical fixture baseline (NEW-008, NEW-011, NEW-014)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Capture command transcripts, inspection notes, DB/log extracts, dashboard output, and test-suite results for all 16 scenarios
- [ ] T013 Compare evidence against playbook PASS/FAIL criteria and assign PASS, PARTIAL, or FAIL verdict with rationale for each scenario
- [x] T014 Validate documentation structure: confirm all required anchors, SPECKIT_LEVEL headers, and YAML frontmatter are intact across spec.md, plan.md, tasks.md, checklist.md
- [ ] T015 Confirm coverage is 16/16 with no missing test IDs against the parent phase map
- [ ] T016 Update `implementation-summary.md` when all 16 scenarios are executed and verdicts are recorded
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
