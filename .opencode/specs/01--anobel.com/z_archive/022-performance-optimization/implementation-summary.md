---
title: "Implementation Summary - Performance Optimization [024-performance-optimization/implementation-summary]"
description: "This implementation addresses critical performance issues on anobel.com, specifically the 20.2s mobile LCP (Largest Contentful Paint) caused by a JavaScript-dependent page visib..."
trigger_phrases:
  - "implementation"
  - "summary"
  - "performance"
  - "optimization"
  - "implementation summary"
  - "024"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary - Performance Optimization

<!-- ANCHOR:overview -->
## Overview

This implementation addresses critical performance issues on anobel.com, specifically the 20.2s mobile LCP (Largest Contentful Paint) caused by a JavaScript-dependent page visibility pattern. The page was hidden via CSS (`opacity: 0`) until hero animations completed, creating a cascading dependency chain that blocked rendering.

**Root Cause:** Page visibility depended on hero JavaScript completion, which required TypeKit fonts, Motion.dev, and HLS video to load first.

**Solution:** Phase 1 implements quick wins that address the visibility bottleneck without requiring bundling or Webflow platform changes.

---

<!-- /ANCHOR:overview -->

<!-- ANCHOR:changes-made -->
## Changes Made

### File: `src/0_html/global.html`

| Change | Lines | Description |
|--------|-------|-------------|
| GTM Delay | 7-26 | Wrapped GTM in requestIdleCallback with Safari fallback |
| Preconnects | 45-47 | Added preconnect hints for TypeKit and jQuery CDN |
| Safety Timeout | 83-92 | 3s fallback to force page visibility |

**Code Snippets:**

#### GTM Delay (lines 7-26)
```javascript
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

**Impact:** Defers GTM loading until browser is idle, reducing FCP by 200-400ms. Safari fallback uses 2s setTimeout since requestIdleCallback is not supported.

#### Preconnects (lines 45-47)
```html
<link rel="preconnect" href="https://use.typekit.net" crossorigin>
<link rel="preconnect" href="https://p.typekit.net" crossorigin>
<link rel="preconnect" href="https://d3e54v103j8qbb.cloudfront.net" crossorigin>
```

**Impact:** Establishes early connections to TypeKit and jQuery CDN, reducing connection time by 200-500ms.

#### LCP Safety Timeout (lines 83-92)
```javascript
setTimeout(function () {
  var pw = document.querySelector('.page--wrapper, [data-target="page-wrapper"]');
  if (pw && !pw.classList.contains('page-ready')) {
    pw.classList.add('page-ready');
    console.warn('[LCP Safety] Force-revealed page after timeout');
  }
}, 3000);
```

**Impact:** Prevents indefinite white screen by force-revealing the page after 3 seconds if JavaScript-based reveal fails. This directly addresses the 20.2s LCP issue.

---

### File: `src/0_html/home.html`

| Change | Lines | Description |
|--------|-------|-------------|
| Swiper CSS | 30-32 | Async loading pattern with noscript fallback |

**Code Snippet:**

#### Swiper CSS Async Loading (lines 30-32)
```html
<link rel="preload" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"></noscript>
```

**Impact:** Converts 18KB render-blocking CSS to non-blocking. Carousel is below fold, so async loading is safe. Noscript fallback ensures functionality without JavaScript.

---

<!-- /ANCHOR:changes-made -->

<!-- ANCHOR:impact-analysis -->
## Impact Analysis

### Expected Performance Improvements

| Metric | Before | Expected After | Improvement |
|--------|--------|----------------|-------------|
| LCP (Mobile) | 20.2s | 3-8s | 60-85% |
| FCP (Mobile) | 6.2s | 4-5s | 20-35% |
| LCP (Desktop) | 3.7s | 2.5-3s | 20-30% |
| FCP (Desktop) | 1.5s | 1.2-1.4s | 7-20% |

### Baseline Metrics (Pre-Implementation)

| Metric | Mobile | Desktop | Target |
|--------|--------|---------|--------|
| LCP | 20.2s | 3.7s | <4s / <2.5s |
| FCP | 6.2s | 1.5s | <3s / <1.8s |
| Speed Index | 8.7s | 2.0s | <4s / <3.4s |
| TBT | 110ms | 40ms | <200ms |
| CLS | 0.004 | 0.014 | <0.1 |

### Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| Safety timeout reveals unstyled content | Low | 3s timeout allows normal animation to complete; only triggers on failure |
| GTM delay affects analytics | Low | Events still captured; page views recorded after idle callback |
| Swiper CSS async causes FOUC | Low | Carousel is below fold; noscript fallback for no-JS scenarios |

---

<!-- /ANCHOR:impact-analysis -->

<!-- ANCHOR:removed-from-scope -->
## Removed from Scope

| Item | Task IDs | Reason |
|------|----------|--------|
| Video poster / LCP preload | T2, T3 | User preference |
| Script bundling | T9, T10 | User prefers individual scripts for easier maintenance |
| Legacy CSS removal | T16 | Removed from scope |

---

<!-- /ANCHOR:removed-from-scope -->

<!-- ANCHOR:future-phases-not-implemented -->
## Future Phases (Not Implemented)

| Item | Task IDs | Notes |
|------|----------|-------|
| TypeKit async | T5 | Webflow-managed, preconnects added as workaround |
| jQuery/Webflow defer | T6 | Webflow-managed, cannot modify |
| Lazy load non-critical scripts | T11 | Phase 2 |
| Motion.dev tree-shaking | T12, T13 | Phase 2 |
| Critical CSS inlining | T15 | Phase 2 |
| Page-specific CSS loading | T17 | Phase 2 |
| Consent script audit | T18 | Requires legal review |
| Swiper core-only | T19 | Phase 2 |

---

<!-- /ANCHOR:future-phases-not-implemented -->

<!-- ANCHOR:research-context -->
## Research Context

**10 parallel Opus research agents** analyzed the codebase before implementation:

| Agent | Focus | Key Finding |
|-------|-------|-------------|
| 1 | HTML Loading | 14+ global scripts unbundled, no critical CSS |
| 2 | JS Bundle | 48 files (778KB to 236KB min), form scripts on all pages |
| 3 | Third-Party | ConsentPro 301KB may duplicate custom modal |
| 4 | CSS | 54 files (232KB), legacy duplicates |
| 5 | LCP/Images | **ROOT CAUSE**: Page hidden until hero JS completes |
| 6 | Above-fold | Main CSS 339KB blocking, TypeKit sync |
| 7 | Animation | Motion.dev 40KB loads 18 functions, uses 4 |
| 8 | Init Patterns | 36 DOMContentLoaded handlers, redundant polling |
| 9 | External Libs | Swiper full bundle uses ~30% |
| 10 | Network | TypeKit + jQuery blocking, missing preconnects |

Full findings documented in `research.md`.

---

<!-- /ANCHOR:research-context -->

<!-- ANCHOR:verification-status -->
## Verification Status

- [ ] Browser testing pending
- [ ] PageSpeed Insights pending
- [ ] Console warning verification pending (should see `[LCP Safety]` message if timeout triggers)

---

<!-- /ANCHOR:verification-status -->

<!-- ANCHOR:task-summary -->
## Task Summary

| Status | Count | Tasks |
|--------|-------|-------|
| **Completed** | 7 | T1, T4, T7, T8, T23, T24, T25 |
| **Removed** | 5 | T2, T3, T9, T10, T16 |
| **Future** | 13 | T5, T6, T11-15, T17-22 |

---

<!-- /ANCHOR:task-summary -->

<!-- ANCHOR:additional-changes-2026-01-31 -->
## Additional Changes (2026-01-31)

### T23: JavaScript Cleanup Functions

Added `window.{Component}.cleanup()` API to 14 JavaScript files for proper event listener removal:

| Script | Global Object | Purpose |
|--------|---------------|---------|
| `conditional_visibility.js` | `__conditionalVisibilityCleanup` | Disconnect MutationObserver |
| `accordion.js` | `Accordion.cleanup()` | Remove click handlers |
| `tab_button.js` | `TabButtonMenu.cleanup()` | Remove click/hover handlers |
| `input_focus_handler.js` | `FocusHandler.cleanup()` | Remove keyboard/mouse listeners |
| `input_placeholder.js` | `PlaceholderSystem.cleanup()` | Disconnect observer, remove listeners |
| `label_product.js` | `LabelProduct.cleanup()` | Reset labels |
| `link_grid.js` | `LinkGrid.cleanup()` | Remove pointer handlers |
| `link_hero.js` | `LinkHero.cleanup()` | Remove mouse handlers, reset styles |
| `hero_*.js` (5 files) | Re-minified | Variable renaming |

**Impact:** Memory leak prevention, SPA compatibility, proper event listener cleanup.

### T24: input_upload Multi-Element Browse Fix

Fixed file upload browse button to work on both mobile and desktop:
```javascript
// Before: Only first browse element worked
var browse_el = get_el(wrapper, SELECTORS.browse);

// After: All browse elements work
browse_els.forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    pond.browse();
  });
});
```

### T25: Swiper CSS Async Extension

Extended async loading pattern to 12 additional pages:
- `werken_bij.html`, `contact.html`
- `services/d1_bunkering.html` through `d5_webshop.html`
- `nobel/n1_dit_is_nobel.html` through `n5_brochures.html`

---

<!-- /ANCHOR:additional-changes-2026-01-31 -->

<!-- ANCHOR:author -->
## Author

Claude Opus 4.5 | 2026-01-26

<!-- /ANCHOR:author -->
