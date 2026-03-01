---
title: "Tasks - Performance Optimization [024-performance-optimization/tasks]"
description: "Status: Complete | Priority: P0"
trigger_phrases:
  - "tasks"
  - "performance"
  - "optimization"
  - "024"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks - Performance Optimization

<!-- ANCHOR:task-overview -->
## Task Overview

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| T1 | Add safety timeout for page visibility | `[x]` Complete | P0 | global.html lines 83-92 |
| T2 | Add video poster image | `[-]` Removed | P0 | Removed per user decision |
| T3 | Add LCP image/poster preload | `[-]` Removed | P0 | Removed per user decision |
| T4 | Add preconnect hints | `[x]` Complete | P0 | global.html lines 45-47 |
| T5 | Make TypeKit async | `[ ]` Future | P0 | Webflow-managed |
| T6 | Defer jQuery/Webflow.js | `[ ]` Future | P1 | Webflow-managed |
| T7 | Defer Swiper CSS | `[x]` Complete | P1 | home.html lines 30-32 |
| T8 | Delay GTM until after LCP | `[x]` Complete | P1 | global.html lines 7-26 |
| T9 | Bundle global scripts | `[-]` Removed | P1 | Removed per user decision |
| T10 | Create page-specific bundles | `[-]` Removed | P1 | Removed per user decision |
| T11 | Lazy load non-critical scripts | `[ ]` Future | P1 | Phase 2 |
| T12 | Tree-shake Motion.dev | `[ ]` Future | P2 | Phase 2 |
| T13 | Consolidate Motion.dev detection | `[ ]` Future | P2 | Phase 2 |
| T14 | Use requestIdleCallback for init | `[ ]` Future | P2 | Phase 2 |
| T15 | Inline critical CSS | `[ ]` Future | P2 | Phase 2 |
| T16 | Remove legacy CSS duplicates | `[-]` Removed | P2 | Removed from scope |
| T17 | Page-specific CSS loading | `[ ]` Future | P2 | Phase 2 |
| T18 | Audit consent script duplication | `[ ]` Future | P2 | Requires legal review |
| T19 | Use Swiper core only | `[ ]` Future | P2 | Phase 2 |
| T20 | Defer will-change timing | `[ ]` Future | P2 | Phase 2 |
| T21 | Replace simple animations with CSS | `[ ]` Future | P3 | Phase 3 |
| T22 | Batch forced reflows | `[ ]` Future | P3 | Phase 3 |
| T23 | Add cleanup functions to JS scripts | `[x]` Complete | P1 | Memory leak prevention |
| T24 | Fix input_upload multi-element browse | `[x]` Complete | P0 | Mobile/desktop file upload |
| T25 | Extend Swiper CSS async to all pages | `[x]` Complete | P1 | 12 additional pages |

---

<!-- /ANCHOR:task-overview -->

<!-- ANCHOR:completed-tasks -->
## Completed Tasks

### T1: Safety Timeout for Page Visibility
**Status:** Complete | **Priority:** P0

**Implementation:**
```javascript
// global.html lines 83-92
setTimeout(function () {
  var pw = document.querySelector('.page--wrapper, [data-target="page-wrapper"]');
  if (pw && !pw.classList.contains('page-ready')) {
    pw.classList.add('page-ready');
    console.warn('[LCP Safety] Force-revealed page after timeout');
  }
}, 3000);
```

**Verification:**
- [x] Safety timeout script added to global.html
- [x] Timeout value set to 3000ms
- [x] Console warning implemented for debugging

---

### T4: Add Preconnect Hints
**Status:** Complete | **Priority:** P0

**Implementation:**
```html
<!-- global.html lines 45-47 -->
<link rel="preconnect" href="https://use.typekit.net" crossorigin>
<link rel="preconnect" href="https://p.typekit.net" crossorigin>
<link rel="preconnect" href="https://d3e54v103j8qbb.cloudfront.net" crossorigin>
```

**Verification:**
- [x] Preconnect added for TypeKit (use.typekit.net, p.typekit.net)
- [x] Preconnect added for jQuery CDN (d3e54v103j8qbb.cloudfront.net)
- [x] crossorigin attribute set

---

### T7: Defer Swiper CSS
**Status:** Complete | **Priority:** P1

**Implementation:**
```html
<!-- home.html lines 30-32 -->
<link rel="preload" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"></noscript>
```

**Verification:**
- [x] Async loading pattern implemented
- [x] Noscript fallback added
- [x] Applied to home.html

---

### T8: Delay GTM Until After LCP
**Status:** Complete | **Priority:** P1

**Implementation:**
```javascript
// global.html lines 7-26
(function () {
  function loadGTM() {
    (function (w, d, s, l, i) {
      w[l] = w[l] || []; w[l].push({
        'gtm.start': new Date().getTime(), event: 'gtm.js'
      });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-KG3LQ9MH');
  }
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadGTM, { timeout: 3000 });
  } else {
    setTimeout(loadGTM, 2000);
  }
})();
```

**Verification:**
- [x] requestIdleCallback wrapper implemented
- [x] Fallback setTimeout for Safari (2s)
- [x] GTM ID preserved (GTM-KG3LQ9MH)

---

<!-- /ANCHOR:completed-tasks -->

<!-- ANCHOR:removed-tasks-user-decision -->
## Removed Tasks (User Decision)

### T2, T3: Video Poster / LCP Preload
**Reason:** User decided not to implement video poster optimization.

### T9, T10: Script Bundling
**Reason:** User prefers individual scripts for easier maintenance.

### T16: Remove Legacy CSS Duplicates
**Reason:** Removed z__nobel_general.css from scope.

---

### T23: Add Cleanup Functions to JS Scripts
**Status:** Complete | **Priority:** P1

**Implementation:**
Added `window.{Component}.cleanup()` API to 14 JavaScript files for proper event listener removal and memory management.

**Scripts Updated:**
- `conditional_visibility.js` - MutationObserver disconnect
- `accordion.js` - Click handler removal
- `tab_button.js` - Click/hover handler removal
- `input_focus_handler.js` - Keyboard/mouse listener removal
- `input_placeholder.js` - Observer disconnect, listener removal
- `label_product.js` - Label reset
- `link_grid.js` - Pointer handler removal
- `link_hero.js` - Mouse handler removal, style reset
- `hero_*.js` (5 files) - Re-minified with variable renaming

---

### T24: Fix input_upload Multi-Element Browse
**Status:** Complete | **Priority:** P0

**Implementation:**
Changed from single element query to multi-element query for browse buttons:
```javascript
// Before: Only first browse element worked
var browse_el = get_el(wrapper, SELECTORS.browse);

// After: All browse elements work (mobile + desktop)
browse_els.forEach(function (el) {
  el.addEventListener('click', ...);
});
```

---

### T25: Extend Swiper CSS Async to All Pages
**Status:** Complete | **Priority:** P1

**Implementation:**
Applied async loading pattern to 12 additional pages (13 total):
- `werken_bij.html`, `contact.html`
- `services/d1_bunkering.html` through `d5_webshop.html`
- `nobel/n1_dit_is_nobel.html` through `n5_brochures.html`

---

<!-- /ANCHOR:removed-tasks-user-decision -->

<!-- ANCHOR:progress-summary -->
## Progress Summary

**Completed:** 7 tasks (T1, T4, T7, T8, T23, T24, T25)
**Removed:** 5 tasks (T2, T3, T9, T10, T16)
**Future:** 13 tasks (Phase 2-3)

---

<!-- /ANCHOR:progress-summary -->

<!-- ANCHOR:revision-history -->
## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-26 | Claude Opus 4.5 | Initial tasks created |
| 2026-01-26 | Claude Opus 4.5 | Updated with implementation status |
| 2026-01-31 | Claude Opus 4.5 | Added T23 (cleanup functions), T24 (input_upload fix), T25 (Swiper CSS extension) |

<!-- /ANCHOR:revision-history -->
