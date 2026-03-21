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
- [x] T002 Confirm feature catalog links for 005 through 015, 072, 082, 088, 090, and 126 in `../../feature_catalog/09--evaluation-and-measurement/`
- [x] T003 Identify which scenarios are inspection-only (009, 010, 072, 088, 090) versus MCP-backed command-driven (005, 006, 007, 008, 011, 012, 013, 014, 015, 082, 126)
- [x] T004 [P] Prepare isolated eval/context DB paths and confirm MCP runtime access for command-driven scenarios
- [x] T005 [P] Verify baseline corpus and fixture prerequisites for 008, 011, and 014 comparison scenarios
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Draft `spec.md` with metadata, 16-row scenario mapping table, 16 P0 requirements, and acceptance scenarios A and B
- [x] T007 Draft `plan.md` with readiness gates, four execution phases, and testing strategy table covering all 16 test IDs
- [x] T008 Run inspection-oriented scenarios: 009 (quality proxy), 010 (corpus audit), 072 (test quality review), 088 (cross-AI fix verification), 090 (INT8 decision re-evaluation)
- [x] T009 [P] Run reproducible runtime scenarios: 006, 007, 008, 011, 012, 013, 014, 015
- [x] T010 Run isolated write-heavy scenarios: 005 (eval DB schema), 082 (housekeeping fixes), 126 (baseline snapshot suite)
- [x] T011 [P] Resolve open questions for shared-vs-disposable sandbox decision (005, 082, 126) and canonical fixture baseline (008, 011, 014)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Capture command transcripts, inspection notes, DB/log extracts, dashboard output, and test-suite results for all 16 scenarios
- [x] T013 Compare evidence against playbook PASS/FAIL criteria and assign PASS, PARTIAL, or FAIL verdict with rationale for each scenario
- [x] T014 Validate documentation structure: confirm all required anchors, SPECKIT_LEVEL headers, and YAML frontmatter are intact across spec.md, plan.md, tasks.md, checklist.md
- [x] T015 Confirm coverage is 16/16 with no missing test IDs against the parent phase map
- [x] T016 Update `implementation-summary.md` when all 16 scenarios are executed and verdicts are recorded
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
