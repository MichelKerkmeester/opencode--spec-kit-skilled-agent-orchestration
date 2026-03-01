---
title: "Performance Optimization - anobel.com [024-performance-optimization/spec]"
description: "Comprehensive performance analysis and optimization for anobel.com based on Google PageSpeed Insights results. The site had critical LCP issues (20.2s mobile) primarily caused b..."
trigger_phrases:
  - "performance"
  - "optimization"
  - "anobel"
  - "com"
  - "spec"
  - "024"
importance_tier: "important"
contextType: "decision"
---
# Performance Optimization - anobel.com

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec ID** | 024 |
| **Title** | Performance Optimization |
| **Status** | Phase 1 Implemented |
| **Level** | 3+ (Complex analysis with architectural changes) |
| **Created** | 2026-01-26 |
| **Author** | Claude Opus 4.5 |
| **LOC Estimate** | ~300 (Phase 1 + JS cleanup functions) |

---

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:overview -->
## Overview

Comprehensive performance analysis and optimization for anobel.com based on Google PageSpeed Insights results. The site had critical LCP issues (20.2s mobile) primarily caused by JavaScript-dependent page visibility and blocking resources.

### Problem Statement

The anobel.com website had severe performance issues on mobile devices:
- **LCP (Largest Contentful Paint):** 20.2s (target: <4s)
- **FCP (First Contentful Paint):** 6.2s (target: <3s)
- **Main Thread Work:** 3.7s (Script Evaluation: 1,479ms)
- **Unused JavaScript:** 382 KiB

### Root Cause

The page was hidden via CSS (`opacity: 0`) until hero JavaScript completed, creating a cascading dependency chain:
1. TypeKit blocks HTML parsing
2. jQuery/Webflow.js block without defer
3. Hero animation waits for Motion.dev + fonts + HLS video
4. Only then does page become visible

---

<!-- /ANCHOR:overview -->

<!-- ANCHOR:implementation-summary -->
## Implementation Summary

### Implemented (Phase 1)

| Task | File | Change | Impact |
|------|------|--------|--------|
| T1 | `global.html` | LCP safety timeout (3s) | Prevents 20s+ white screen |
| T4 | `global.html` | Preconnects (TypeKit, jQuery CDN) | -200-500ms connection time |
| T7 | 13 HTML files | Swiper CSS async loading | -18KB render-blocking per page |
| T8 | `global.html` | GTM delay (requestIdleCallback) | -200-400ms FCP |
| T23 | 14 JS files | Cleanup functions for event listeners | Memory leak prevention, SPA compatibility |
| T24 | `input_upload.js` | Multi-element browse support | Mobile/desktop file upload fix |

### Out of Scope (User Decision)

| Item | Reason |
|------|--------|
| Script bundling (T9, T10) | Individual scripts easier to maintain |
| Video poster/LCP preload (T2, T3) | Removed per user preference |

### Future Phases (Not Yet Implemented)

| Item | Notes |
|------|-------|
| TypeKit async (T5) | Webflow-managed, preconnects added as workaround |
| jQuery/Webflow defer (T6) | Webflow-managed, cannot modify |
| Motion.dev optimization (T12-T13) | Phase 2 |
| CSS optimization (T15-T17) | Phase 2 |

---

<!-- /ANCHOR:implementation-summary -->

<!-- ANCHOR:files-modified -->
## Files Modified

### `src/0_html/global.html`

**GTM Delay (lines 7-26):**
- Wrapped GTM in `requestIdleCallback` with 3s timeout
- Safari fallback: `setTimeout` with 2s delay
- Analytics still capture page views (just delayed)

**Preconnects (lines 45-47):**
```html
<link rel="preconnect" href="https://use.typekit.net" crossorigin>
<link rel="preconnect" href="https://p.typekit.net" crossorigin>
<link rel="preconnect" href="https://d3e54v103j8qbb.cloudfront.net" crossorigin>
```

**LCP Safety Timeout (lines 83-92):**
```javascript
setTimeout(function () {
  var pw = document.querySelector('.page--wrapper, [data-target="page-wrapper"]');
  if (pw && !pw.classList.contains('page-ready')) {
    pw.classList.add('page-ready');
    console.warn('[LCP Safety] Force-revealed page after timeout');
  }
}, 3000);
```

### `src/0_html/home.html` + 12 Additional Pages

**Swiper CSS Async (applied to all 13 pages with Swiper):**
```html
<link rel="preload" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"></noscript>
```

**Pages updated:**
- `home.html`, `werken_bij.html`, `contact.html`
- `services/d1_bunkering.html`, `d2_filtratie.html`, `d3_uitrusting.html`, `d4_maatwerk.html`, `d5_webshop.html`
- `nobel/n1_dit_is_nobel.html`, `n2_isps_kade.html`, `n3_de_locatie.html`, `n4_het_team.html`, `n5_brochures.html`

### JavaScript Files (Cleanup Functions)

**14 scripts updated with `window.{Component}.cleanup()` API:**

| Script | Global Object | Purpose |
|--------|---------------|---------|
| `conditional_visibility.js` | `__conditionalVisibilityCleanup` | Disconnect MutationObserver |
| `accordion.js` | `Accordion.cleanup()` | Remove click handlers |
| `tab_button.js` | `TabButtonMenu.cleanup()` | Remove click/hover handlers |
| `input_focus_handler.js` | `FocusHandler.cleanup()` | Remove keyboard/mouse listeners |
| `input_placeholder.js` | `PlaceholderSystem.cleanup()` | Disconnect observer, remove listeners |
| `input_upload.js` | N/A | Multi-element browse fix |
| `label_product.js` | `LabelProduct.cleanup()` | Reset labels |
| `link_grid.js` | `LinkGrid.cleanup()` | Remove pointer handlers |
| `link_hero.js` | `LinkHero.cleanup()` | Remove mouse handlers, reset styles |
| `hero_blog_article.js` | Re-minified | Variable renaming |
| `hero_cards.js` | Re-minified | Variable renaming |
| `hero_general.js` | Re-minified | Variable renaming |
| `hero_video.js` | Re-minified | Variable renaming |
| `hero_webshop.js` | Re-minified | Variable renaming |

**Impact:** Memory leak prevention, SPA compatibility, proper event listener cleanup on navigation.

---

<!-- /ANCHOR:files-modified -->

<!-- ANCHOR:research-summary -->
## Research Summary

**10 parallel Opus research agents** analyzed the codebase:

| Agent | Focus | Key Finding |
|-------|-------|-------------|
| 1 | HTML Loading | 14+ global scripts unbundled, no critical CSS |
| 2 | JS Bundle | 48 files (778KB→236KB min), form scripts on all pages |
| 3 | Third-Party | ConsentPro 301KB may duplicate custom modal |
| 4 | CSS | 54 files (232KB), legacy duplicates |
| 5 | LCP/Images | **ROOT CAUSE**: Page hidden until hero JS completes |
| 6 | Above-fold | Main CSS 339KB blocking, TypeKit sync |
| 7 | Animation | Motion.dev 40KB loads 18 functions, uses 4 |
| 8 | Init Patterns | 36 DOMContentLoaded handlers, redundant polling |
| 9 | External Libs | Swiper full bundle uses ~30% |
| 10 | Network | TypeKit + jQuery blocking, missing preconnects |

See `research.md` for complete findings.

---

<!-- /ANCHOR:research-summary -->

<!-- ANCHOR:baseline-metrics-pre-implementation -->
## Baseline Metrics (Pre-Implementation)

| Metric | Mobile | Desktop | Target |
|--------|--------|---------|--------|
| **LCP** | 20.2s | 3.7s | <4s / <2.5s |
| **FCP** | 6.2s | 1.5s | <3s / <1.8s |
| **Speed Index** | 8.7s | 2.0s | <4s / <3.4s |
| **TBT** | 110ms | 40ms | <200ms |
| **CLS** | 0.004 | 0.014 | <0.1 |

---

<!-- /ANCHOR:baseline-metrics-pre-implementation -->

<!-- ANCHOR:documentation -->
## Documentation

| Document | Purpose | Status |
|----------|---------|--------|
| `spec.md` | Requirements and scope | Updated |
| `plan.md` | Implementation plan | Updated |
| `tasks.md` | Task breakdown | Updated |
| `checklist.md` | QA checklist | Updated |
| `decision-record.md` | Architectural decisions | Updated |
| `research.md` | Research findings (10 agents) | Complete |
| `webflow-guide.md` | Webflow configuration guide | Complete |

---

<!-- /ANCHOR:documentation -->

<!-- ANCHOR:next-steps -->
## Next Steps

1. **Run PageSpeed Insights** to measure Phase 1 impact
2. **Browser testing** to verify no regressions
3. **Consider Phase 2** optimizations if needed:
   - TypeKit async (if Webflow allows)
   - Motion.dev tree-shaking
   - Critical CSS inlining

---

<!-- /ANCHOR:next-steps -->

<!-- ANCHOR:revision-history -->
## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-26 | Claude Opus 4.5 | Initial spec created |
| 2026-01-26 | Claude Opus 4.5 | Research complete (10 agents) |
| 2026-01-26 | Claude Opus 4.5 | Phase 1 implemented |
| 2026-01-26 | Claude Opus 4.5 | Updated to reflect final implementation |
| 2026-01-31 | Claude Opus 4.5 | Extended Swiper CSS async to 12 additional pages |
| 2026-01-31 | Claude Opus 4.5 | Added JS cleanup functions (T23) and input_upload fix (T24) |

<!-- /ANCHOR:revision-history -->
