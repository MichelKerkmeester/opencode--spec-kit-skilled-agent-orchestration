---
title: "Tasks: CMS-Driven Button in Notification Toast"
description: "Task breakdown for adding button visibility logic to nav_notifications.js and Webflow guide."
trigger_phrases:
  - "notification toast button tasks"
  - "alert button tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: CMS-Driven Button in Notification Toast

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

- [ ] T001 Add `button` selector to `CONFIG.selectors` (`nav_notifications.js:~33`)
- [ ] T002 Create `update_button_visibility()` function after `update_bullet_visibility()` (`nav_notifications.js:~383`)
- [ ] T003 Add external URL detection logic using `new URL()` hostname comparison (`nav_notifications.js`)
- [ ] T004 Call `update_button_visibility()` from `update_visibility()` after bullet update (`nav_notifications.js:~347`)
- [ ] T005 Call `update_button_visibility()` from `init()` alongside initial bullet check (`nav_notifications.js:~549`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 [P] Add `<a>` element inside alert item template in Webflow Designer
- [ ] T007 [P] Add `data-alert="button"` attribute to the link element
- [ ] T008 Bind link text to CMS `Button` field
- [ ] T009 Bind link `href` to CMS `URL` field
- [ ] T010 [P] Style link as text button matching toast typography
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Create `webflow_guide.md` with step-by-step Webflow Designer instructions
- [ ] T012 Test: Button with text + URL — button visible and clickable (REQ-001, REQ-002, REQ-003)
- [ ] T013 Test: Empty Button field — no button visible (REQ-001)
- [ ] T014 Test: External URL — opens in new tab with `rel="noopener noreferrer"` (REQ-005)
- [ ] T015 Test: Same-domain URL — navigates in same tab (REQ-005)
- [ ] T016 Test: Regression — dismissal, scheduling, office hours, bullet visibility unchanged
- [ ] T017 Deploy JS to CDN + publish Webflow site
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 4 acceptance scenarios from spec.md verified
- [ ] No console errors or warnings
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---
