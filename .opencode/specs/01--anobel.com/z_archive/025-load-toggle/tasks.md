---
title: "Tasks - Load Toggle Component [027-load-toggle/tasks] [01--anobel.com/z_archive/025-load-toggle/tasks]"
description: "1. Remove data-target=\"load-toggle\" from button--w"
trigger_phrases:
  - "tasks"
  - "load"
  - "toggle"
  - "component"
  - "027"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks - Load Toggle Component

<!-- ANCHOR:summary -->
## Summary

| Status | Count |
|--------|-------|
| ✅ Completed | 19 |
| ⏳ Pending | 3 |
| ❌ Blocked | 0 |
| **Total** | 22 |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:core-implementation -->
## Core Implementation

### T1: Create JavaScript IIFE ✅
- **Status:** Complete
- **File:** `src/2_javascript/menu/load_toggle.js`
- **Details:** Created self-executing function with configuration constants, state management, and modular structure

### T2: Implement click handler ✅
- **Status:** Complete
- **Details:** Event delegation pattern with `closest()` for trigger detection

### T3: Add text update function ✅
- **Status:** Complete
- **Details:** `update_text()` reads from button data attributes with fallback defaults

### T4: Create CSS visibility rules ✅
- **Status:** Complete
- **File:** `src/1_css/menu/menu_load_toggle.css`
- **Details:** State-based selectors: `[data-state="collapsed"]` hides, `[data-state="expanded"]` shows

### T5: Add icon rotation animation ✅
- **Status:** Complete
- **Details:** 180° rotation on expand, 300ms cubic-bezier transition

### T6: Add fade-in animation ✅
- **Status:** Complete
- **Details:** `@keyframes loadToggleFadeIn` with opacity and translateY
<!-- /ANCHOR:core-implementation -->

---

<!-- ANCHOR:cms-integration -->
## CMS Integration

### T7: Move text attributes to button ✅
- **Status:** Complete
- **Before:** Attributes on container (not CMS-bindable)
- **After:** Attributes on button (`data-load-collapsed`, `data-load-expanded`)

### T8: Update JavaScript to read from button ✅
- **Status:** Complete
- **Details:** Changed from `container.getAttribute()` to `trigger.getAttribute()`

### T9: Test with CMS collection items ✅
- **Status:** Complete
- **Tested:** Contact page with time-group instances
<!-- /ANCHOR:cms-integration -->

---

<!-- ANCHOR:webflow-integration -->
## Webflow Integration

### T10: Add Webflow.push integration ✅
- **Status:** Complete
- **Details:** `window.Webflow?.push(init)` for page transition compatibility

### T11: Implement cleanup function ✅
- **Status:** Complete
- **Details:** Removes all event listeners, resets handler array

### T12: Expose cleanup API ✅
- **Status:** Complete
- **Details:** `window.LoadToggle = { cleanup }`
<!-- /ANCHOR:webflow-integration -->

---

<!-- ANCHOR:debugging -->
## Debugging

### T13: Fix duplicate data-target issue ✅
- **Status:** Complete
- **Issue:** `button--w` wrapper had `data-target="load-toggle"`, same as container
- **Fix:** Documented for Webflow - only container should have the attribute

### T14: Fix missing icon attribute ✅
- **Status:** Complete
- **Issue:** Icon SVG missing rotation attribute
- **Fix:** Changed to `data-target="load-icon"` (simpler attribute name)

### T15: Update CSS for new icon attribute ✅
- **Status:** Complete
- **Before:** `[data-target="load-toggle-icon"]`
- **After:** `[data-target="load-icon"]`
<!-- /ANCHOR:debugging -->

---

<!-- ANCHOR:documentation -->
## Documentation

### T16: Create webflow-guide.md ✅
- **Status:** Complete (needs update for icon attribute)
- **File:** `.opencode/specs/01--anobel.com/z_archive/025-load-toggle/webflow-guide.md`

### T17: Create spec.md ✅
- **Status:** Complete
- **File:** `.opencode/specs/01--anobel.com/z_archive/025-load-toggle/spec.md`

### T18: Create plan.md ✅
- **Status:** Complete
- **File:** `.opencode/specs/01--anobel.com/z_archive/025-load-toggle/plan.md`

### T19: Create tasks.md ✅
- **Status:** Complete
- **File:** `.opencode/specs/01--anobel.com/z_archive/025-load-toggle/tasks.md`
<!-- /ANCHOR:documentation -->

---

<!-- ANCHOR:deployment -->
## Deployment

### T20: Minify JavaScript ✅
- **Status:** Complete
- **Command:** `npx terser src/2_javascript/menu/load_toggle.js --compress --mangle -o src/2_javascript/z_minified/menu/load_toggle.js`
- **Result:** ~1KB minified

### T21: Upload to CDN ⏳
- **Status:** Pending
- **Command:** `wrangler r2 object put anobel-cdn/load_toggle.js --file src/2_javascript/z_minified/menu/load_toggle.js`
- **Blocker:** Waiting for Webflow attribute fixes

### T22: Update Webflow version ⏳
- **Status:** Pending
- **Action:** Change `?v=1.0.0` to `?v=1.1.0` in script tag

### T23: Test on staging ⏳
- **Status:** Pending
- **URL:** `https://a-nobel-en-zn.webflow.io/nl/contact`
- **Blockers:** Need to fix Webflow attributes first:
  1. Remove `data-target="load-toggle"` from `button--w`
  2. Add `data-target="load-icon"` to icon SVG
<!-- /ANCHOR:deployment -->

---

<!-- ANCHOR:webflow-fixes-required -->
## Webflow Fixes Required

| Element | Attribute | Current | Should Be |
|---------|-----------|---------|-----------|
| `time--group` | `data-target` | `load-toggle` | `load-toggle` ✅ |
| `button--w` | `data-target` | `load-toggle` | **REMOVE** ❌ |
| `.icon--w` or SVG | `data-target` | (missing) | `load-icon` ❌ |
<!-- /ANCHOR:webflow-fixes-required -->

---

<!-- ANCHOR:files-modified -->
## Files Modified

| File | Status |
|------|--------|
| `src/2_javascript/menu/load_toggle.js` | ✅ Updated |
| `src/2_javascript/z_minified/menu/load_toggle.js` | ✅ Minified |
| `src/1_css/menu/menu_load_toggle.css` | ✅ Updated |
| `src/3_staging/src.js` | ✅ Copied |
| `src/3_staging/src.css` | ✅ Copied |
<!-- /ANCHOR:files-modified -->
