---
title: "Tasks: decisions-and-deferrals [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
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

- [x] T001 Validate all 5 feature entries and source inventories (`feature_catalog/19--decisions-and-deferrals/`) [EVIDENCE: Catalog entries reconciled during re-audit and F-02 source table correction.]
- [x] T002 Capture baseline status for F-01 through F-05 in verification checklist (`checklist.md`) [EVIDENCE: Checklist status matrix updated with final PASS outcomes.]
- [x] T003 [P] Confirm audit criteria coverage (correctness, standards, behavior, tests) (`spec.md`) [EVIDENCE: Spec acceptance scenarios and requirements map to correctness, behavior, and tests.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update F-02 source inventory to include `mcp_server/lib/graph/graph-signals.ts` and migration-v19 touchpoints (`.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md`) [EVIDENCE: Implementation references now include graph-signals and vector-index-schema v19.]
- [x] T005 Add/attach F-02 test references for `computeGraphMomentum` and `computeCausalDepth` plus migration-v19 expectations (`.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md`) [EVIDENCE: Test table includes `graph-signals.vitest.ts` and deferred-features integration coverage.]
- [x] T006 Tighten Rule-3 continuation token to prevent cross-sentence key-phrase capture (`mcp_server/lib/extraction/entity-extractor.ts`) [EVIDENCE: Rule-3 regex updated to stop at sentence periods while preserving dotted tokens.]
- [x] T007 Add negative tests asserting sentence-boundary termination in key-phrase extraction (`mcp_server/tests/entity-extractor.vitest.ts`) [EVIDENCE: Regression tests now assert no `'. Implements'` capture and preserve `Node.js` extraction.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-run targeted graph/entity extraction tests after updates (`mcp_server/tests/*.vitest.ts`) [EVIDENCE: `npm run test -- tests/entity-extractor.vitest.ts tests/graph-signals.vitest.ts` passed (85/85).]
- [x] T009 Re-audit F-02 and F-03 status after remediation (`checklist.md`) [EVIDENCE: F-02 and F-03 both moved from WARN to PASS with linked source/test evidence.]
- [x] T010 Update final PASS/WARN/FAIL outcomes and close deferred items (`tasks.md`) [EVIDENCE: Task/checklist/spec now represent closure state and only residual open question remains.]
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

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
