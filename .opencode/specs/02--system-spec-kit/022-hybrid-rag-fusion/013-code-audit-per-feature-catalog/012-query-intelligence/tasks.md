---
title: "Tasks: query-intelligence [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "query intelligence"
  - "query-intelligence"
  - "tasks"
  - "code audit"
  - "query complexity router"
  - "relative score fusion"
  - "channel representation"
  - "token budget"
  - "query expansion"
importance_tier: "normal"
contextType: "general"
---
# Tasks: query-intelligence

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

- [ ] T001 Build feature inventory and implementation/test mapping for F-01..F-06 (`feature_catalog/12--query-intelligence/*.md`)
- [ ] T002 Cross-reference playbook scenarios and mark per-feature coverage gaps (NEW-060+)
- [ ] T003 [P] Validate PASS/WARN/FAIL summary alignment across spec/tasks/checklist (`012-query-intelligence/*.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P0] Fix tier routing to reconcile `charCount`/`stopWordRatio` behavior with feature claims (`mcp_server/lib/search/query-classifier.ts`, `feature_catalog/12--query-intelligence/01-query-complexity-router.md`)
- [ ] T005 [P0] Resolve classifier default-state flag contradiction in code comments/docs (`mcp_server/lib/search/query-classifier.ts`)
- [ ] T006 [P0] Add `traceMetadata.queryComplexity` propagation tests and source-table mapping updates (`mcp_server/tests/query-classifier.vitest.ts`, `mcp_server/tests/query-router.vitest.ts`, `mcp_server/lib/search/hybrid-search.ts`)
- [ ] T007 [P0] Fix or explicitly document channel append-without-re-sort dependency (`mcp_server/lib/search/channel-representation.ts`, `mcp_server/lib/search/channel-enforcement.ts`, `feature_catalog/12--query-intelligence/03-channel-min-representation.md`)
- [ ] T008 [P0] Replace placeholder channel tests with behavioral assertions (`mcp_server/tests/channel.vitest.ts`, `mcp_server/tests/channel-representation.vitest.ts`)
- [ ] T009 [P0] Fix query-expansion source/test mapping and add Stage-1 orchestration coverage (`feature_catalog/12--query-intelligence/06-query-expansion.md`, `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`)
- [ ] T010 [P1] Clarify RSF shadow-mode status and add/update pipeline-level assertions (`mcp_server/lib/search/rsf-fusion.ts`, `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/tests/rsf-fusion*.vitest.ts`)
- [ ] T011 [P2] Add CHK-060 adjusted-budget tests and include `hybrid-search.ts` in feature source mapping (`feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md`, `mcp_server/tests/dynamic-token-budget.vitest.ts`, `mcp_server/tests/token-budget.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 [P] Run targeted Vitest coverage for classifier, router, channel, fusion, token-budget, and expansion paths (`mcp_server/tests/*.vitest.ts`)
- [ ] T013 Reconcile checklist verification counts and unresolved items after fixes (`012-query-intelligence/checklist.md`)
- [ ] T014 Synchronize feature-catalog implementation/test tables with resolved runtime reality (`feature_catalog/12--query-intelligence/*.md`)
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
