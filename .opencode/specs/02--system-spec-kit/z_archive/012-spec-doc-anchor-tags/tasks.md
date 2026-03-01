---
title: "Tasks: Spec Document Anchor Tags [129-spec-doc-anchor-tags/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "spec"
  - "document"
  - "anchor"
  - "tags"
  - "129"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Spec Document Anchor Tags

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
## Phase 1: CORE Templates

- [x] T001 Add 7 anchors to spec-core.md (templates/core/spec-core.md)
- [x] T002 [P] Add 7 anchors to plan-core.md (templates/core/plan-core.md)
- [x] T003 [P] Add 6 anchors to tasks-core.md (templates/core/tasks-core.md)
- [x] T004 [P] Add 5 anchors to impl-summary-core.md (templates/core/impl-summary-core.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Addendum + Composed Templates

- [x] T005 Add anchors to level2-verify addendum (3 files)
- [x] T006 [P] Add anchors to level3-arch addendum (3 files)
- [x] T007 [P] Add anchors to level3plus-govern addendum (3 files)
- [x] T008 Propagate anchors to level_1/ composed templates (4 files)
- [x] T009 [P] Propagate anchors to level_2/ composed templates (5 files)
- [x] T010 [P] Propagate anchors to level_3/ composed templates (6 files)
- [x] T011 [P] Propagate anchors to level_3+/ composed templates (6 files)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Validation

- [x] T012 Update check-anchors.sh to scan spec document files (scripts/rules/check-anchors.sh)
- [x] T013 Run full test suite — verify no regressions
- [x] T014 Create spec folder documentation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
