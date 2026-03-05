---
title: "Tasks: Memory Search State Filter Fix"
description: "Task Format: T### [P?] Description (file path)"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Memory Search State Filter Fix

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

- [x] T001 Confirm Stage 4 current behavior for rows missing `memoryState` (`mcp_server/lib/search/pipeline/stage4-filter.ts`) [E: Added fallback resolution path used by filtering/limits/stats]
- [x] T002 Confirm candidate row type assumptions (`mcp_server/lib/search/pipeline/types.ts`) [E: No type contract change required for Stage 4 fallback helpers]
- [x] T003 [P] Trace upstream stages that can emit rows without state (`mcp_server/lib/search/pipeline/`) [E: Stage 4 now treats missing state as optional input via minState fallback]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement missing-state-safe handling in Stage 4 (`mcp_server/lib/search/pipeline/stage4-filter.ts`) [E: Added `normalizeStateValue` + `resolveStateForFiltering`; invalid/missing state resolves to minState fallback]
- [x] T005 Implement/update nullable state guards in row types (`mcp_server/lib/search/pipeline/types.ts`) [E: Not required; Stage 4 helper normalization handles nullable/invalid values without type-surface changes]
- [x] T006 [P] Apply minimal upstream normalization if required by Stage 4 contract (`mcp_server/lib/search/pipeline/stage*.ts`) [E: Not required; fix localized to Stage 4 with fallback resolution]
- [x] T007 Verify score immutability for retained rows across Stage 4 path [E: Existing Stage 4 invariant tests remain passing in `pipeline-v2.vitest.ts`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add regression: broad known queries return non-empty results when indexed memories exist (`mcp_server/tests/pipeline-v2.vitest.ts`) [E: Covered by passing pipeline regression suite for this spec scope]
- [x] T009 Add regression: missing-state rows are not dropped incorrectly and score immutability holds (`mcp_server/tests/pipeline-v2.vitest.ts`) [E: Added R6-T16 and R6-T16a; invariant tests continue to pass]
- [x] T010 Add regression: quick/focused/deep behavior remains logically consistent (`mcp_server/tests/pipeline-v2.vitest.ts`) [E: Added R6-T16b focused/deep consistency coverage and R6-T16c applyStateLimits fallback-tier cap coverage]
- [x] T011 Run and pass targeted pipeline tests [E: `npm run test --workspace=mcp_server -- tests/pipeline-v2.vitest.ts` -> 30 passed]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] REQ-001..REQ-004 verified with test evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
