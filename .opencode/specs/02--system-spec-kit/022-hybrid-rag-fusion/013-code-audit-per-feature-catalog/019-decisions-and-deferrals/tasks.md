---
title: "Tasks: decisions-and-deferrals [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "decisions"
  - "deferrals"
  - "graph signals"
  - "entity regex"
  - "test gaps"
importance_tier: "normal"
contextType: "general"
---
# Tasks: decisions-and-deferrals

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

- [ ] T001 Validate all 5 feature entries and source inventories (`feature_catalog/19--decisions-and-deferrals/`)
- [ ] T002 Capture baseline status for F-01 through F-05 in verification checklist (`checklist.md`)
- [ ] T003 [P] Confirm audit criteria coverage (correctness, standards, behavior, tests) (`spec.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Update F-02 source inventory to include `mcp_server/lib/graph/graph-signals.ts` and migration-v19 touchpoints (`feature_catalog/19--decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md`)
- [ ] T005 Add/attach F-02 test references for `computeGraphMomentum` and `computeCausalDepth` plus migration-v19 expectations (`feature_catalog/19--decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md`)
- [ ] T006 Tighten Rule-3 continuation token to prevent cross-sentence key-phrase capture (`mcp_server/lib/extraction/entity-extractor.ts`)
- [ ] T007 Add negative tests asserting sentence-boundary termination in key-phrase extraction (`mcp_server/tests/entity-extractor.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Re-run targeted graph/entity extraction tests after updates (`mcp_server/tests/*.vitest.ts`)
- [ ] T009 Re-audit F-02 and F-03 status after remediation (`checklist.md`)
- [ ] T010 Update final PASS/WARN/FAIL outcomes and close deferred items (`tasks.md`)
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

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
