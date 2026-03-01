---
title: "Checklist: Blog Sort Dropdown Fix [019-blog-sort-fix/checklist]"
description: "Evidence: Deep dive completed 2026-01-18. See research.md for full findings."
trigger_phrases:
  - "checklist"
  - "blog"
  - "sort"
  - "dropdown"
  - "fix"
  - "019"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Blog Sort Dropdown Fix

<!-- ANCHOR:pre-implementation -->
## Pre-Implementation

- [x] **P0** Understand current `input_select_fs_bridge.js` code
- [x] **P0** Confirm root cause: Finsweet behavior analyzed via deep dive
- [x] **P0** Review Finsweet fs-list documentation for API
- [x] **P0** Verify option values on live page (`date-asc`, `name-asc`, `category-asc`)
- [x] **P1** Research Finsweet Reactive API (`listInstance.sorting.value`)
- [x] **P1** Analyze bridge timing vs Finsweet initialization

**Evidence:** Deep dive completed 2026-01-18. See `research.md` for full findings.

---
<!-- /ANCHOR:pre-implementation -->

<!-- ANCHOR:phase-0-quick-fix-test -->
## Phase 0: Quick Fix Test

- [ ] **P0** Add `input` event dispatch to `sync_to_native()`
- [ ] **P0** Test on blog page
- [ ] **P0** Document result: Works / Does not work

---
<!-- /ANCHOR:phase-0-quick-fix-test -->

<!-- ANCHOR:phase-1-2-full-implementation-if-quick-fix-fails -->
## Phase 1-2: Full Implementation (if Quick Fix fails)

### Finsweet Instance Capture
- [ ] **P0** Add `capture_finsweet_instance()` function
- [ ] **P0** Call capture in `start()` before bridge init
- [ ] **P0** Verify console shows capture message
- [ ] **P0** Verify `window._finsweetListInstance` populated

### Reactive API Integration
- [ ] **P0** Rewrite `sync_to_native()` with Reactive API
- [ ] **P0** Add `update_url_param()` helper (pushState)
- [ ] **P0** Add `fallback_url_navigation()` helper
- [ ] **P1** Use `lastIndexOf('-')` for value parsing (handles hyphenated fields)
- [ ] **P1** Add direction validation (`asc`/`desc` only)
- [ ] **P1** Add try/catch with fallback on API failure

---
<!-- /ANCHOR:phase-1-2-full-implementation-if-quick-fix-fails -->

<!-- ANCHOR:functional-testing -->
## Functional Testing

### Sort Functionality
- [ ] **P0** Sort by Name works - list alphabetically sorted
- [ ] **P0** Sort by Category works - list grouped by category
- [ ] **P0** Sort by Date works - list chronologically sorted
- [ ] **P0** **NO PAGE RELOAD** during sort (instant)
- [ ] **P0** URL updates via pushState (`?sort=name-asc`)
- [ ] **P1** Page reload maintains sort order (reads URL param)
- [ ] **P1** Default sort works when no URL param

### Console Verification
- [ ] **P0** Console shows: `FinsweetBridge: Captured list instance`
- [ ] **P0** Console shows: `FinsweetBridge: Sorted by {field} ({direction})`
- [ ] **P0** No errors in console

---
<!-- /ANCHOR:functional-testing -->

<!-- ANCHOR:regression-testing -->
## Regression Testing

### Form Selects (Must NOT trigger URL navigation)
- [ ] **P0** Contact form select still works
- [ ] **P0** Werken bij form select still works
- [ ] **P0** Vacature form select still works
- [ ] **P1** No console errors on any page with CustomSelect

### Existing Functionality
- [ ] **P0** CustomSelect keyboard navigation works
- [ ] **P0** CustomSelect accessibility intact (ARIA)
- [ ] **P0** Hidden select syncs correctly (for fallback)

---
<!-- /ANCHOR:regression-testing -->

<!-- ANCHOR:browser-testing -->
## Browser Testing

- [ ] **P0** Chrome desktop (latest)
- [ ] **P1** Firefox desktop (latest)
- [ ] **P1** Safari desktop (latest)
- [ ] **P1** Chrome mobile (iOS)
- [ ] **P1** Chrome mobile (Android)

---
<!-- /ANCHOR:browser-testing -->

<!-- ANCHOR:deployment -->
## Deployment

- [ ] **P0** Minify using `minify-webflow.mjs`
- [ ] **P0** Verify minified file with `verify-minification.mjs`
- [ ] **P0** Test minified file locally
- [ ] **P0** Upload to R2 CDN (`input_select_fs_bridge.js?v=1.1.0`)
- [ ] **P0** Update `blog.html` version number (line 36)
- [ ] **P0** Test live blog page sorting

---
<!-- /ANCHOR:deployment -->

<!-- ANCHOR:post-deployment -->
## Post-Deployment

- [ ] **P1** Monitor for console errors (first 24 hours)
- [ ] **P1** Verify no performance regression
- [ ] **P1** Update implementation-summary.md

---
<!-- /ANCHOR:post-deployment -->

<!-- ANCHOR:sign-off -->
## Sign-Off

| Check | Status | Date | Notes |
|-------|--------|------|-------|
| Deep dive complete | ✅ | 2026-01-18 | 5 parallel agents |
| Spec updated to Level 3 | ✅ | 2026-01-18 | Added decision-record.md, research.md |
| Implementation complete | | | |
| Testing complete | | | |
| Deployed to production | | | |
| Verified in production | | | |
<!-- /ANCHOR:sign-off -->
