---
title: "Tasks: Graph Testing and Playbook Alignment [006]"
description: "16 tasks across 3 parts covering integration tests, stress tests, playbook updates, and README alignment for coverage graph capabilities."
trigger_phrases:
  - "006"
  - "graph testing tasks"
  - "playbook alignment tasks"
importance_tier: "important"
contextType: "planning"
---
# Tasks: Graph Testing and Playbook Alignment

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

**Task Format**: `T### [P?] Description (file path)` -- REQ reference indicates requirement satisfied.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:part-a -->
## Part A: Integration and Stress Tests

- [ ] T001 Read CJS coverage-graph-core.cjs relation weights and TS coverage-graph-db.ts VALID_RELATIONS to identify alignment contract
- [ ] T002 Create `coverage-graph-integration.vitest.ts` with CJS-TS relation name alignment tests (REQ-GT-001, REQ-GT-002)
- [ ] T003 Add weight clamping consistency tests to integration suite (REQ-GT-003)
- [ ] T004 Add self-loop prevention tests for both layers (REQ-GT-004)
- [ ] T005 Add namespace isolation tests for research/review/improvement loop types (REQ-GT-005)
- [ ] T006 Add convergence signal alignment tests (REQ-GT-006)
- [ ] T007 Create `coverage-graph-stress.vitest.ts` with 1000+ node tests (REQ-GT-007)
- [ ] T008 Add contradiction scanning stress test (REQ-GT-008)
- [ ] T009 Add provenance traversal and cluster metrics stress tests
<!-- /ANCHOR:part-a -->

---

<!-- ANCHOR:part-b -->
## Part B: Manual Testing Playbooks

- [ ] T010 [P] Create `031-graph-convergence-signals.md` in sk-deep-research playbook (REQ-GT-009)
- [ ] T011 [P] Create `029-graph-events-emission.md` in sk-deep-research playbook (REQ-GT-010)
- [ ] T012 [P] Create `021-graph-convergence-review.md` in sk-deep-review playbook (REQ-GT-011)
- [ ] T013 [P] Create `015-graph-events-review.md` in sk-deep-review playbook (REQ-GT-012)
- [ ] T014 [P] Create agent-improver playbook test cases: mutation coverage, trade-off detection, candidate lineage (REQ-GT-013)
<!-- /ANCHOR:part-b -->

---

<!-- ANCHOR:part-c -->
## Part C: README Updates

- [ ] T015 [P] Update sk-deep-research and sk-deep-review READMEs with graph capability references (REQ-GT-014)
- [ ] T016 [P] Update sk-improve-agent README with graph capability references (REQ-GT-014)
<!-- /ANCHOR:part-c -->
