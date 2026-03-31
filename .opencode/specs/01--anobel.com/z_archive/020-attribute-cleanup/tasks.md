---
title: "Tasks: Attribute Cleanup Deepdive [020-attribute-cleanup/tasks] [01--anobel.com/z_archive/020-attribute-cleanup/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "attribute"
  - "cleanup"
  - "deepdive"
  - "020"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Attribute Cleanup Deepdive

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.0 -->

---

<!-- ANCHOR:task-notation -->
<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:task-notation -->

---

<!-- ANCHOR:phase-1-setup -->
<!-- /ANCHOR:notation -->
## Phase 1: Setup

- [x] T001 Create spec folder (`.opencode/specs/01--anobel.com/z_archive/020-attribute-cleanup/`)
- [x] T002 Inventory local HTML pages in `src/0_html` (deepdive)
- [x] T003 [P] Extract value-based `data-*` attributes from `src/1_css`

<!-- /ANCHOR:phase-1-setup -->

---

<!-- ANCHOR:phase-2-implementation -->
## Phase 2: Implementation

- [x] T004 Update allowlist in `src/2_javascript/global/attribute_cleanup.js`
- [x] T005 Run jsdom smoke test for representative empty attrs
- [x] T006 (Optional) Update minified bundle + bump CDN version (out of scope unless requested)

<!-- /ANCHOR:phase-2-implementation -->

---

<!-- ANCHOR:phase-3-verification -->
## Phase 3: Verification

- [x] T007 Verify marker attributes are preserved (jsdom)
- [x] T008 Remove placeholders from spec docs
- [x] T009 If requested: browser verification on a representative page

<!-- /ANCHOR:phase-3-verification -->

---

<!-- ANCHOR:completion-criteria -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed

<!-- /ANCHOR:completion-criteria -->

---

<!-- ANCHOR:cross-references -->
<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

<!-- /ANCHOR:cross-references -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
<!-- /ANCHOR:cross-refs -->
