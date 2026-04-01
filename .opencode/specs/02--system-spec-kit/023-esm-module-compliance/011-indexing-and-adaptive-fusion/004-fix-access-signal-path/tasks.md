---
title: "Tasks: Fix Access Signal Path"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fix access signal tasks"
  - "batched access signal tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Fix Access Signal Path

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

- [x] T001 Trace the `trackAccess` branch in `mcp_server/lib/search/pipeline/stage2-fusion.ts`
- [x] T002 [P] Confirm adaptive schema bootstrap through `ensureAdaptiveTables(db)`
- [x] T003 [P] Confirm lifecycle coverage can verify stored access rows later
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `recordAdaptiveAccessSignals(db, results, query)` to `stage2-fusion.ts`
- [x] T005 Reuse one prepared insert statement for the full result batch
- [x] T006 Wrap access inserts in one transaction over the accessed results
- [x] T007 Pass `config.query` into stored access rows
- [x] T008 Keep failure handling non-blocking with warning logs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify the helper is called only when `trackAccess=true`
- [x] T010 Verify empty result sets exit before any write attempt
- [x] T011 Verify lifecycle coverage later consumes the stored access rows
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Access writes are batched and query-aware
- [x] Docs match the shipped stage-2 implementation
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Key files**: `mcp_server/lib/search/pipeline/stage2-fusion.ts`, `mcp_server/tests/adaptive-ranking-e2e.vitest.ts`
<!-- /ANCHOR:cross-refs -->

---
