---
title: "Tasks: Post-Review Remediation"
description: "Task breakdown for 2-wave remediation of 21 P0/P1 findings."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "remediation tasks"
  - "T001 T010"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Post-Review Remediation

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
## Wave 1: P0 + Complex P1 Code Fixes

- [ ] T001 [P] Schema & DB fixes — P0-1, P0-2, P1-10 (`vector-index-impl.ts`, `reconsolidation.vitest.ts`)
- [ ] T002 [P] Pipeline V2 integration — P1-3, P1-4 (`memory-search.ts`, `mmr-reranker.ts`, `co-activation.ts`)
- [ ] T003 [P] Memory save SQL dedup — P1-5 (`memory-save.ts`)
- [ ] T004 [P] Search subsystem fixes — P1-6, P1-8, P1-9 (`query-expander.ts`, `graph-search-fn.ts`, `co-activation.ts`)
- [ ] T005 [P] Eval metrics fix — P1-7 (`eval-metrics.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Wave 2: P1 Standards + Documentation

- [ ] T006 [P] Error handling — P1-11, P1-12 (5 files + `stage3-rerank.ts`)
- [ ] T007 [P] Comment standards — P1-13, P1-16 (`save-quality-gate.ts`)
- [ ] T008 [P] Import & comment cleanup — P1-14, P1-15 (`memory-context.ts`, `hybrid-search.ts`, `memory-save.ts`)
- [ ] T009 [P] Section dividers — P1-17 (`composite-scoring.ts`, `tool-schemas.ts`)
- [ ] T010 [P] Documentation fixes — P1-18, P1-20, P1-21 (`summary_of_*.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 TypeScript compilation passes (`tsc --noEmit`)
- [ ] T012 Full test suite passes (`npm test`)
- [ ] T013 Build check passes (`npm run build`)
- [ ] T014 MCP smoke test passes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks marked `[x]`
- [ ] All P1 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Verification suite passed
- [ ] `implementation-summary.md` filled
- [ ] `checklist.md` verified
<!-- /ANCHOR:completion -->
