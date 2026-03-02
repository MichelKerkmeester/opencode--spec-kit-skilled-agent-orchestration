---
title: "Tasks: Comprehensive MCP Server Remediation"
description: "Task Format: T### [P?] Description (file path)"
# SPECKIT_TEMPLATE_SOURCE: tasks-core + phase-child-header | v2.2
trigger_phrases:
  - "phase 010 tasks"
  - "remediation tasks"
  - "wave tracking"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Comprehensive MCP Server Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + phase-child-header | v2.2 -->

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

<!-- ANCHOR:wave-1 -->
## Wave 1 - Parallel Execution

- [x] T001 [P] WS1-B Database and schema safety
- [x] T002 [P] WS1-C and 1c scoring and ranking corrections
- [x] T003 [P] WS1-C2 causal-boost and ablation fixes
- [x] T004 [P] WS1-D search pipeline safety
- [x] T005 [P] WS1-E guards and edge cases
- [x] T006 [P] WS2-1 dead hot-path branch cleanup
- [x] T007 [P] WS2-3 dead module-state cleanup
- [x] T008 [P] WS2-4 dead function and export cleanup
- [x] T009 [P] WS3-P1 quick performance wins
- [x] T010 [P] WS3-P2 test-quality corrections
<!-- /ANCHOR:wave-1 -->

---

<!-- ANCHOR:wave-2 -->
## Wave 2 - Dependent Work

- [x] T011 WS1-A entity normalization
- [x] T012 WS2-2 dead flag-function removal
- [x] T013 WS3-P4 SQL-level performance work
- [x] T014 WS3-P3 entity-linker performance work
<!-- /ANCHOR:wave-2 -->

---

<!-- ANCHOR:wave-2-5 -->
## Wave 2.5 - Test Fixups

- [x] T015 Reconsolidation test updates for `importance_weight`
- [x] T016 Scoring test updates for citation fallback removal
- [x] T017 Working-memory/session-cleanup test updates
- [x] T018 Channel quality-floor test updates
- [x] T019 Entity extraction and adapter behavior updates
- [x] T020 Routing/parser cleanup tests
<!-- /ANCHOR:wave-2-5 -->

---

<!-- ANCHOR:wave-3 -->
## Wave 3 - Verification

- [x] T021 TypeScript compile check complete
- [x] T022 Full test suite passes
- [x] T023 Critical fix spot checks complete
- [x] T024 Dead code verification checks complete
- [x] T025 Implementation summary captured
<!-- /ANCHOR:wave-3 -->

---

<!-- ANCHOR:wave-4 -->
## Wave 4 - Phase 2 Remediation (25-Agent Review)

- [x] T026 [P] P0 blockers: withSpecFolderLock race, double normalization, sourceScores, index signature, chunking lock
- [x] T027 [P] P1 scoring: convergence bonus unique count, similarity normalization, preserve cosine similarity
- [x] T028 [P] P1 feature flags: isDegreeBoostEnabled, entity-linker/memory-summaries guards, shadow period
- [x] T029 [P] P1 mutation: cache invalidation, quality loop content, reconsolidation hash, BM25 re-index, attention clamp
- [x] T030 [P] P1 cache/transactions: affectedTools, AI-WHY documentation
- [x] T031 [P] P1 cognitive: causal-edges WHERE clause, co-activation fan-effect, ablation variable names
- [x] T032 [P] P1 eval: Precision@K, F1@K, shadow-scoring @deprecated
- [x] T033 [P] P1 standards: header conversion (109 files), comment prefixes, structural fixes, module.exports removal
- [x] T034 [P] P2 performance: Math.max loop, timeout guard, boost cap, mention cap, O(1) eviction
- [x] T035 [P] P2 safety: dead config removal, cache bounds, readFileSync try-catch, generic error, AI-WHY comments
- [x] T036 Documentation: checklists, impl-summary updates, flag docs, eval README, deprecation notes
<!-- /ANCHOR:wave-4 -->

---

<!-- ANCHOR:wave-5 -->
## Wave 5 - Phase 2 Verification

- [x] T037 TypeScript compile check (0 errors)
- [x] T038 Full test suite passes (226 files, 7,008/7,008 tests)
- [x] T039 Test fixups for changed behavior (7 failures fixed across waves)
<!-- /ANCHOR:wave-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All required validation-blocking documentation issues are resolved
- [x] Recursive spec validation exits with code 0 or 1
- [x] Any remaining warnings are non-blocking and documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
