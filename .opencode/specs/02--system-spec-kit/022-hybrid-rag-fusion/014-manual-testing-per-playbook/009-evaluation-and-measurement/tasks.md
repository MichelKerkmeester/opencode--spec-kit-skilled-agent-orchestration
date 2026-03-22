---
title: "Tasks: Manual Testing — Evaluation and Measurement"
description: "Task Format: T### [P?] Description (scenario ID)"
trigger_phrases:
  - "evaluation and measurement tasks"
  - "manual testing tasks"
  - "scenario execution tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Manual Testing — Evaluation and Measurement

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

**Task Format**: `T### [P?] Description (scenario ID)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm MCP server is running — `memory_health` call succeeds
- [ ] T002 Confirm SPECKIT_ABLATION=true is set in environment
- [ ] T003 Create pre-test checkpoint — `checkpoint_create({ name: "pre-009-testing" })`
- [ ] T004 Verify eval_metric_snapshots table exists
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Execute and record scenario 005 — Evaluation database and schema (R13-S1)
- [ ] T006 Execute and record scenario 006 — Core metric computation (R13-S1)
- [ ] T007 Execute and record scenario 007 — Observer effect mitigation (D4)
- [ ] T008 Execute and record scenario 008 — Full-context ceiling evaluation (A2)
- [ ] T009 Execute and record scenario 009 — Quality proxy formula (B7)
- [ ] T010 Execute and record scenario 010 — Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A)
- [ ] T011 Execute and record scenario 011 — BM25-only baseline (G-NEW-1)
- [ ] T012 Execute and record scenario 012 — Agent consumption instrumentation (G-NEW-2)
- [ ] T013 Execute and record scenario 013 — Scoring observability (T010)
- [ ] T014 Execute and record scenario 014 — Full reporting and ablation study framework (R13-S3)
- [ ] T015 Execute and record scenario 015 — Shadow scoring and channel attribution (R13-S2)
- [ ] T016 Execute and record scenario 072 — Test quality improvements
- [ ] T017 Execute and record scenario 082 — Evaluation and housekeeping fixes
- [ ] T018 Execute and record scenario 088 — Cross-AI validation fixes (Tier 4)
- [ ] T019 Execute and record scenario 090 — INT8 quantization evaluation (R5)
- [ ] T020 Execute and record scenario 126 — Memory roadmap baseline snapshot
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Confirm all 16 P0 checklist items checked with evidence
- [ ] T022 Fill in implementation-summary.md with overall results and date
- [ ] T023 Restore from checkpoint if DB was modified destructively
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001–T023 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 16 scenarios have PASS, FAIL, or SKIP-ENV in checklist.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Playbook source**: `.opencode/skill/system-spec-kit/manual_testing_playbook/09--evaluation-and-measurement/`
<!-- /ANCHOR:cross-refs -->
