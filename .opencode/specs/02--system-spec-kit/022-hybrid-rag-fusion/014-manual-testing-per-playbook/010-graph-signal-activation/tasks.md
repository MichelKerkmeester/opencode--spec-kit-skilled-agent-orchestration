---
title: "Tasks: manual-testing-per-playbook graph-signal-activation phase [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "graph signal activation tasks"
  - "phase 010 tasks"
  - "graph testing tasks"
  - "tasks core graph signal"
importance_tier: "high"
contextType: "general"
---
# Tasks: manual-testing-per-playbook graph-signal-activation phase

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Extract prompts, execution methods, evidence expectations, and pass criteria for all 15 scenarios from the manual testing playbook
- [ ] T002 Confirm feature catalog links for 016-022, 081, 091, 120, 156-158, 174, and 175 in the `10--graph-signal-activation` catalog group
- [ ] T003 Identify which scenarios are inspection-only (081) versus MCP-backed command-driven (016-022, 091, 120, 156-158, 174, 175)
- [ ] T004 [P] Verify MCP graph tool availability (`memory_causal_link`, `memory_drift_why`, `memory_causal_stats`, `memory_causal_unlink`)
- [ ] T005 [P] Confirm feature flag implementation status for SPECKIT_GRAPH_REFRESH_MODE, SPECKIT_LLM_GRAPH_BACKFILL, SPECKIT_GRAPH_CALIBRATION_PROFILE, SPECKIT_GRAPH_CONCEPT_ROUTING, SPECKIT_TYPED_TRAVERSAL
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Execute 016 -- Typed-weighted degree channel (R4): search with graph channel, inspect fusion trace
- [ ] T007 Execute 017 -- Co-activation boost strength increase (A7): trigger co-activation, verify boost magnitude
- [ ] T008 Execute 018 -- Edge density measurement: run `memory_causal_stats`, verify all fields
- [ ] T009 Execute 019 -- Weight history audit tracking: create link, update strength, inspect audit trail
- [ ] T010 Execute 020 -- Graph momentum scoring (N2a): search with graph channel, verify momentum contribution
- [ ] T011 Execute 021 -- Causal depth signal (N2b): create multi-hop chain, run `memory_drift_why`, verify depth signal
- [ ] T012 Execute 022 -- Community detection (N2c): trigger detection, inspect cluster assignments
- [ ] T013 Execute 081 -- Graph and cognitive memory fixes: inspect fix locations, verify corrected behavior
- [ ] T014 Execute 091 -- Graph centrality and ANCHOR-as-node verification: confirm ANCHOR tags in graph calculations
- [ ] T015 Execute 120 -- Unified graph rollback and explainability (Phase 3): create links, rollback, verify trace
- [ ] T016 Execute 156 -- Graph refresh mode (SPECKIT_GRAPH_REFRESH_MODE): set mode, trigger refresh, inspect log
- [ ] T017 Execute 157 -- LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL): enable flag, trigger backfill, verify edges
- [ ] T018 Execute 158 -- Graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE): set profiles, compare weights
- [ ] T019 Execute 174 -- Graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING): enable flag, run concept query
- [ ] T020 Execute 175 -- Typed traversal (SPECKIT_TYPED_TRAVERSAL): enable flag, run filtered `memory_drift_why`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Capture command transcripts, graph traces, causal stats, community output, and inspection notes for all 15 scenarios
- [ ] T022 Compare evidence against playbook PASS/FAIL criteria and assign PASS, PARTIAL, or FAIL verdict with rationale for each scenario
- [ ] T023 Validate documentation structure: confirm all required anchors, SPECKIT_LEVEL headers, and YAML frontmatter are intact across spec.md, plan.md, tasks.md, checklist.md
- [ ] T024 Confirm coverage is 15/15 with no missing test IDs against the parent phase map
- [ ] T025 Update `implementation-summary.md` when all 15 scenarios are executed and verdicts are recorded
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
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---
