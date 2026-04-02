---
title: "Tasks: Reindex Validator False Positives [02--system-spec-kit/023-esm-module-compliance/009-reindex-validator-false-positives/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "009 tasks"
  - "reindex validator tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Reindex Validator False Positives

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

- [x] T001 Reproduce V8/V12 false-positive behavior in batch indexing flow.
- [x] T002 Identify context-propagation gap between batch orchestrator and validation layer.
- [x] T003 Confirm context-type canonicalization drift across migration/runtime/schema.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Apply V8 scope fallback from file-path context where needed.
- [x] T005 Adjust V12 eligibility handling for memory/spec-doc index paths.
- [x] T006 [P] Thread file path context through validation bridge and batch handler.
- [x] T007 [P] Align frontmatter normalization with canonical context type aliases.
- [x] T008 [P] Update schema/migration handling for canonical context constraints.
- [x] T009 [P] Add rule metadata improvements for diagnostics.
- [ ] T010 Capture fresh end-to-end runtime evidence after structural doc remediation.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run recursive strict validator and confirm no Phase 009 structural errors.
- [ ] T012 Re-run targeted runtime checks for force reindex behavior.
- [ ] T013 Update checklist evidence with final validator/runtime artifacts.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
