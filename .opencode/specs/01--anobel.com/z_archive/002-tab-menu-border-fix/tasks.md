---
title: "Tasks: Tab Menu Border Fix [002-tab-menu-border-fix/tasks]"
description: "Priority: High"
trigger_phrases:
  - "tasks"
  - "tab"
  - "menu"
  - "border"
  - "fix"
  - "002"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Tab Menu Border Fix

<!-- ANCHOR:us-001-consistent-border-color-on-filter-buttons -->
## US-001: Consistent Border Color on Filter Buttons

### Task 1: Fix CSS Variable in tab_menu.js
**Priority:** High
**Estimate:** 5 minutes
**Status:** Pending

**Steps:**
- [ ] Open `src/2_javascript/menu/tab_menu.js`
- [ ] Replace `--_color-tokens---border-neutral--darkest` with `--_color-tokens---border-neutral--dark` (7 occurrences)
- [ ] Verify no syntax errors

**Files:**
- `src/2_javascript/menu/tab_menu.js`

---

### Task 2: Browser Verification
**Priority:** High
**Estimate:** 5 minutes
**Status:** Pending

**Steps:**
- [ ] Navigate to `/nl/blog` with bdg
- [ ] Click a filter button to activate it
- [ ] Click a different filter button
- [ ] Verify previously-active button has border `rgb(207, 207, 207)`
- [ ] Verify all inactive buttons have same border color
- [ ] Test hover states on inactive buttons

**Acceptance Criteria:**
- [ ] All inactive buttons: `borderColor: rgb(207, 207, 207)`
- [ ] No visual inconsistencies between buttons
- [ ] Hover animations work correctly
<!-- /ANCHOR:us-001-consistent-border-color-on-filter-buttons -->

---

<!-- ANCHOR:summary -->
## Summary

| Task | Status | Priority |
|------|--------|----------|
| Fix CSS Variable | Pending | High |
| Browser Verification | Pending | High |

**Total Estimated Time:** 10 minutes
<!-- /ANCHOR:summary -->
