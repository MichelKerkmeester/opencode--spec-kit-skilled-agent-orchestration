---
title: "Tasks: bug-fixes-and-data-integrity [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "bug fixes"
  - "data integrity"
  - "audit tasks"
  - "chunk deduplication"
  - "safe swap"
  - "timestamp fix"
importance_tier: "normal"
contextType: "general"
---
# Tasks: bug-fixes-and-data-integrity

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

| Priority | Count | Description |
|----------|-------|-------------|
| **P0** | 5 | FAIL findings requiring immediate correction |
| **P1** | 8 | WARN findings requiring behavior or coverage alignment |
| **P2** | 1 | WARN finding for test gap only |
| **Total** | 14 | Remediation tasks |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] [P0] Correct F-05 implementation table and B4 `.changes` claim — Agent 1: replaced generic config files with actual B1-B4 fix files (reconsolidation-bridge, checkpoints, causal-edges, pe-gating); B4 claim corrected to pe-gating.ts `.changes === 0` guard
- [x] T002 [P] [P0] Correct F-06 implementation/test pathing for E1/E2 — Agent 1: replaced `lib/errors/*` with `temporal-contiguity.ts` (E1 j=i+1 fix) and `extraction-adapter.ts` (E2 null-on-unresolved)
- [x] T003 [P] [P1] Add active dedup source/test references for F-02 — Agent 2: added `memory-search.ts` and `handler-memory-search.vitest.ts` to implementation/test tables
- [x] T004 [P] [P1] Add stage-2 co-activation source/test references for F-03 — Agent 2: added `stage2-fusion.ts` and Stage-2 test references
- [x] T005 [P] [P1] Add canonical-ID dedup source/test references for F-07 — Agent 2: added `hybrid-search.ts` (combinedLexicalSearch) and `hybrid-search.vitest.ts` to tables
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 [P] [P0] Replace wildcard barrel exports — ALREADY DONE: `lib/errors/index.ts` already uses explicit named exports, no `export *` found
- [x] T007 [P] [P0] Replace remaining spread-based `Math.max` calls — Agent 3: replaced 2 `Math.max(...spread)` with `reduce()` in `shared/scoring/folder-scoring.ts:200-207,269-271` + rebuilt dist
- [x] T008 [P] [P1] Add production-path content-hash dedup integration coverage — Agent 4: extended `content-hash-dedup.vitest.ts` (23 tests passing)
- [x] T009 [P] [P1] Extend safe-swap semantics to force path — Agent 3: documented force-path as intentionally destructive with AI-WHY comment at `chunking-orchestrator.ts:170-172`
- [x] T010 [P] [P1] Align F-11 working-memory naming — Agent 2: fixed table name from `working_memory_sessions` → `working_memory` in F-11 narrative
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 [P] [P0] Add large-array (>100k) `RangeError` regressions — Agent 4: `folder-scoring-overflow.vitest.ts` (2 tests: computeSingleFolderScore 150K, findLastActivity 150K) passing after dist rebuild
- [x] T012 [P] [P1] Add include-content-independent dedup regression — Agent 4: extended `handler-memory-search.vitest.ts` (18 tests passing)
- [x] T013 [P] [P1] Add staged-swap success/failure/rollback regressions — Agent 5: `chunking-orchestrator-swap.vitest.ts` (4 tests: success, rollback, partial-embedding, cache-key normalization) passing
- [x] T014 [P] [P2] Add session-manager entry-limit stress test — Agent 5: `session-manager-stress.vitest.ts` (2 tests: high-volume interleaved capacity, cleanup timestamp) passing
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — 14/14 complete
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed — TSC 0 errors, targeted audited suite 49/49 passing
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
