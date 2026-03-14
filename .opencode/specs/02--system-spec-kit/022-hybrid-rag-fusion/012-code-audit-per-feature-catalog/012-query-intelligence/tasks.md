---
title: "Tasks: query-intelligence [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
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

- [x] T001 Build authoritative source-of-truth inventory for this synchronization task (verified changed files + verified outcomes)
- [x] T002 Confirm scope lock to in-scope artifact files only (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
- [x] T003 [P] Normalize verification evidence contract (tests, ESLint, alignment verifier, `npm run check` warning)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Fix real runtime `queryComplexity` propagation in `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- [x] T005 [P0] Replace synthetic trace test with production-path coverage in `.opencode/skill/system-spec-kit/mcp_server/tests/trace-propagation.vitest.ts`
- [x] T006 [P0] Fix embeddings mock path in `.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts`
- [x] T007 [P1] Correct stale default comment in `.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts`
- [x] T008 [P1] Correct stale test counts in `.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/03-channel-min-representation.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P] Run targeted test validation across `trace-propagation.vitest.ts`, `stage1-expansion.vitest.ts`, `search-results-format.vitest.ts`, and related suite files — 6 files, 165 tests passing
- [x] T010 Run targeted ESLint on changed in-scope files — passing
- [x] T011 Run alignment verifier — 0 findings
- [x] T012 Run `npm run check` for repo health signal — failed due to unrelated pre-existing repo-wide lint/type issues (out of scope)
- [x] T013 Reconcile checklist verification totals with checklist body
- [x] T014 Synchronize `implementation-summary.md` with verified review-fix outcomes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification evidence captured — tests (6 files, 165, including `search-results-format.vitest.ts` in the targeted pass set), targeted ESLint pass, alignment verifier pass, known out-of-scope `npm run check` warning
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
