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

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All required validation-blocking documentation issues are resolved
- [ ] Recursive spec validation exits with code 0 or 1
- [ ] Any remaining warnings are non-blocking and documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
