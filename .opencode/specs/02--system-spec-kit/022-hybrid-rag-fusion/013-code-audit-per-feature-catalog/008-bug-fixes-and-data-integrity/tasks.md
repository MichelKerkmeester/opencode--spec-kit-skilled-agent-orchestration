---
title: "Tasks: bug-fixes-and-data-integrity [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
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

- [ ] T001 [P] [P0] Correct F-05 implementation table and B4 `.changes` claim (`feature_catalog/08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md`)
- [ ] T002 [P] [P0] Correct F-06 implementation/test pathing for E1/E2 (`feature_catalog/08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md`)
- [ ] T003 [P] [P1] Add active dedup source/test references for F-02 (`feature_catalog/08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md`)
- [ ] T004 [P] [P1] Add stage-2 co-activation source/test references for F-03 (`feature_catalog/08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md`)
- [ ] T005 [P] [P1] Add canonical-ID dedup source/test references for F-07 (`feature_catalog/08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 [P] [P0] Replace wildcard barrel exports with explicit exports (`mcp_server/lib/errors/index.ts`)
- [ ] T007 [P] [P0] Replace remaining spread-based `Math.max` calls (`mcp_server/shared/scoring/folder-scoring.ts`)
- [ ] T008 [P] [P1] Add production-path content-hash dedup integration coverage (`mcp_server/tests/content-hash-dedup.vitest.ts`)
- [ ] T009 [P] [P1] Extend safe-swap semantics to force path or document destructive behavior (`mcp_server/handlers/chunking-orchestrator.ts`)
- [ ] T010 [P] [P1] Align F-11 working-memory naming and timestamp comparison behavior (`feature_catalog/08--bug-fixes-and-data-integrity/11-working-memory-session-cleanup-timestamp-fix.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 [P] [P0] Add large-array (>100k) `RangeError` regressions for scoring paths (`mcp_server/tests/*folder-scoring*.vitest.ts`)
- [ ] T012 [P] [P1] Add include-content-independent dedup regression assertions (`mcp_server/tests/handler-memory-search.vitest.ts`)
- [ ] T013 [P] [P1] Add staged-swap success/failure/rollback regressions (`mcp_server/tests/*chunking-orchestrator*.vitest.ts`)
- [ ] T014 [P] [P2] Add concurrent session-manager entry-limit stress test (`mcp_server/tests/session-manager-extended.vitest.ts`)
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
