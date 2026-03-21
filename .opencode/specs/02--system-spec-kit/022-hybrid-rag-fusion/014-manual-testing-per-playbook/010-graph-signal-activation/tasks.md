---
title: "Tasks: manual-testing-per-playbook graph-signal-activation phase [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "graph signal activation tasks"
  - "phase 010 tasks"
  - "016 017 018 019 020 tasks"
  - "021 022 081 120 tasks"
importance_tier: "high"
contextType: "general"
---
# Tasks: manual-testing-per-playbook graph-signal-activation phase

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

- [x] T001 Extract graph-signal-activation prompts, commands, and pass criteria from `../../manual_testing_playbook/manual_testing_playbook.md`
- [x] T002 Confirm feature links for 016, 017, 018, 019, 020, 021, 022, 081, and 120 in `../../feature_catalog/10--graph-signal-activation/`
- [x] T003 Identify stateful scenarios (019, 081, 120) and confirm sandbox or checkpoint workflow availability for `plan.md`
- [ ] T004 [P] Prepare graph test data, edge type snapshots, community assignments, and degree baselines needed for Phase 2 and Phase 3 execution
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Draft `spec.md` with metadata, scope table, nine playbook-derived requirements, and acceptance criteria
- [x] T006 Draft `plan.md` with readiness gates, four execution phases, testing strategy table, and rollback plan
- [x] T007 Draft `tasks.md` and `checklist.md` to complete the Level 1 phase packet
- [ ] T008 [P] Run 016, 017, and 018 (bounded typed-degree, co-activation delta, edge-density gating) and capture evidence snapshots
- [ ] T009 [P] Run 020, 021, and 022 (momentum, causal depth, community boost) and capture evidence snapshots
- [ ] T010 Add evidence references and verdict outcomes to plan or a paired evidence log after non-destructive execution completes
- [ ] T011 Resolve open questions: confirm whether 019 and 120 must always use a disposable sandbox, and confirm bundled versus per-guardrail evidence format for 081
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run 019 (weight history audit and rollback) in a disposable sandbox and capture audit rows and rollback proof
- [ ] T013 Run 081 (graph and cognitive memory fix bundle) in a disposable sandbox and capture guardrail evidence per agreed format
- [ ] T014 Run 120 (unified graph rollback and explainability) in an isolated runtime, toggle `SPECKIT_GRAPH_UNIFIED`, and capture enabled versus disabled comparison evidence
- [ ] T015 Apply review protocol verdict rules to all nine scenarios and record PASS, PARTIAL, or FAIL with explicit rationale
- [x] T016 Validate documentation structure and required anchors across spec.md, plan.md, tasks.md, and checklist.md
- [ ] T017 Update `implementation-summary.md` when execution and verification are complete
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
