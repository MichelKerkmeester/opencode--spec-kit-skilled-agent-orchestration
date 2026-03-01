---
title: "Performance Optimization Plan - anobel.com [024-performance-optimization/plan]"
description: "Problem: Mobile LCP was 20.2s (target: <4s) due to page being hidden until hero JS completes."
trigger_phrases:
  - "performance"
  - "optimization"
  - "plan"
  - "anobel"
  - "com"
  - "024"
importance_tier: "important"
contextType: "decision"
---
# Performance Optimization Plan - anobel.com

<!-- ANCHOR:executive-summary -->
## Executive Summary

**Problem:** Mobile LCP was 20.2s (target: <4s) due to page being hidden until hero JS completes.

**Root Cause:** Cascading dependency chain:
1. Blocking TypeKit script (~500-2000ms)
2. jQuery + webflow.js without defer (~200-500ms)
3. Page hidden via CSS until hero JS completes (~1000-1500ms)
4. Motion.dev polling + HLS video streaming (~500-2000ms)

**Solution:** Phase 1 quick wins to reduce worst-case LCP.

---

<!-- /ANCHOR:executive-summary -->

<!-- ANCHOR:phase-1-implemented -->
## Phase 1: Implemented

### 1.1 LCP Safety Timeout
**Impact:** Prevents 20s+ white screen
**File:** `global.html` lines 83-92

Forces page visible after 3 seconds if hero animation fails to complete.

### 1.2 Preconnect Hints
**Impact:** -200-500ms connection time
**File:** `global.html` lines 45-47

Added preconnects for TypeKit and jQuery CDN to establish early connections.

### 1.3 Swiper CSS Async
**Impact:** -18KB render-blocking
**File:** `home.html` lines 30-32

Converted Swiper CSS to async loading since carousel is below fold.

### 1.4 GTM Delay
**Impact:** -200-400ms FCP
**File:** `global.html` lines 7-26

Delayed GTM with requestIdleCallback (3s timeout) + Safari fallback (2s setTimeout).

---

<!-- /ANCHOR:phase-1-implemented -->

<!-- ANCHOR:removed-from-scope-user-decision -->
## Removed from Scope (User Decision)

| Item | Original Impact | Reason Removed |
|------|-----------------|----------------|
| Video poster (T2) | -3-5s LCP | User preference |
| LCP preload (T3) | -300-800ms | Depends on T2 |
| Script bundling (T9, T10) | -13 requests | Easier to maintain individual scripts |
| CSS duplicates (T16) | ~4KB | Removed z__nobel_general.css from scope |

---

<!-- /ANCHOR:removed-from-scope-user-decision -->

<!-- ANCHOR:future-phases-not-yet-implemented -->
## Future Phases (Not Yet Implemented)

### Phase 2: Script Loading Optimization
- T5: Make TypeKit async (Webflow-managed)
- T6: Defer jQuery/Webflow.js (Webflow-managed)
- T11: Lazy load non-critical scripts

### Phase 3: Advanced Optimization
- T12-T13: Motion.dev tree-shaking and detection consolidation
- T14: requestIdleCallback for non-critical init
- T15, T17: Critical CSS inlining, page-specific CSS
- T18: Consent script duplication audit (requires legal review)
- T19: Swiper core-only build
- T20-T22: Animation optimization

---

<!-- /ANCHOR:future-phases-not-yet-implemented -->

<!-- ANCHOR:expected-results-phase-1 -->
## Expected Results (Phase 1)

| Metric | Before | Expected After | Target |
|--------|--------|----------------|--------|
| **LCP (Mobile)** | 20.2s | 8-12s | <4s |
| **FCP (Mobile)** | 6.2s | 4-5s | <3s |
| **LCP (Desktop)** | 3.7s | 2.5-3s | <2.5s |

**Note:** Safety timeout ensures worst-case LCP is ~3s rather than 20s+.

---

<!-- /ANCHOR:expected-results-phase-1 -->

<!-- ANCHOR:files-modified -->
## Files Modified

| File | Changes |
|------|---------|
| `src/0_html/global.html` | GTM delay, preconnects, safety timeout |
| `src/0_html/home.html` | Swiper CSS async |

---

<!-- /ANCHOR:files-modified -->

<!-- ANCHOR:webflow-constraints -->
## Webflow Constraints

These items require Webflow platform changes and were not implemented:
- TypeKit async loading (Webflow manages TypeKit)
- jQuery/webflow.js defer (Webflow auto-injects)
- Main CSS file optimization (Webflow generates)

Workarounds applied via custom code in global.html.

---

<!-- /ANCHOR:webflow-constraints -->

<!-- ANCHOR:next-steps -->
## Next Steps

1. **Run PageSpeed Insights** to measure Phase 1 impact
2. **Browser test** all functionality
3. **Evaluate** if Phase 2 optimizations are needed
4. **Consider** TypeKit removal if Silka fonts cover all needs

---

<!-- /ANCHOR:next-steps -->

<!-- ANCHOR:revision-history -->
## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-26 | Claude Opus 4.5 | Initial plan created (6 phases) |
| 2026-01-26 | Claude Opus 4.5 | Updated to reflect Phase 1 implementation only |

<!-- /ANCHOR:revision-history -->
