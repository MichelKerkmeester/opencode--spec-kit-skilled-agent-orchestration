---
title: "Research Summary: 10-Agent Performance Analysis - anobel.com [031-anobel-performance-analysis/research]"
description: "A comprehensive performance analysis was conducted using 10 parallel agents, each focusing on a specific performance domain. The analysis identified 50+ performance issues acros..."
trigger_phrases:
  - "research"
  - "summary"
  - "agent"
  - "performance"
  - "analysis"
  - "031"
  - "anobel"
importance_tier: "normal"
contextType: "research"
---
# Research Summary: 10-Agent Performance Analysis - anobel.com

<!-- SPECKIT_LEVEL: 3+ -->
<!-- RESEARCH_DATE: 2025-02-01 -->
<!-- METHODOLOGY: Parallel 10-agent dispatch with domain-specific focus -->

---

## Executive Summary

A comprehensive performance analysis was conducted using 10 parallel agents, each focusing on a specific performance domain. The analysis identified **50+ performance issues** across 7 categories, with the root cause of the 20-second mobile LCP traced to JavaScript timeout bugs in hero scripts.

**Key Finding**: The 3-second safety timeout implemented in Spec 024 is being **defeated** by longer timeouts (10 seconds) and infinite loops in hero JavaScript files.

---

## Research Methodology

### Agent Deployment

| Agent # | Focus Area | Session ID | Duration | Status |
|---------|------------|------------|----------|--------|
| 1 | LCP Elements Analysis | ses_3e5dd6698f | ~5 min | ✅ Complete |
| 2 | Hero JavaScript Deep Dive | ses_3e5dd4aebf | ~8 min | ✅ Complete |
| 3 | CSS Critical Path | ses_3e5dd353af | ~5 min | ✅ Complete |
| 4 | JS Bundle Analysis | (prior research) | N/A | ✅ Complete |
| 5 | Third-Party Scripts | ses_3e5dd0894f | ~5 min | ✅ Complete |
| 6 | Video/HLS Loading | ses_3e5dcf2f4f | ~5 min | ✅ Complete |
| 7 | Mobile Performance | ses_3e5dcdf2df | ~5 min | ✅ Complete |
| 8 | Animation Performance | ses_3e5dccbc2f | ~8 min | ✅ Complete |
| 9 | Network & Resource Hints | ses_3e5dcb810f | ~5 min | ✅ Complete |
| 10 | Webflow Constraints | (timeout) | N/A | ⚠️ Partial |

### Tools Used

- File analysis: Read tool, Grep tool
- Pattern matching: AST-like manual analysis
- Metrics: Lighthouse CLI (baseline from Spec 025)

---

## Agent 1: LCP Elements Analysis

### Focus
Identify what controls page visibility and LCP timing.

### Findings

**Page Visibility Mechanism**:
```css
/* From global CSS */
.page--wrapper {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.page--wrapper.page-ready {
  opacity: 1;
}
```

**LCP is blocked until**: `.page-ready` class is added by JavaScript after all hero resources load.

**Key Files**:
- Hero scripts add `.page-ready` class
- Safety timeout (currently in wrong position) also adds class

**Impact**: LCP cannot improve until page becomes visible via `.page-ready`.

---

## Agent 2: Hero JavaScript Deep Dive

### Focus
Analyze hero JavaScript files for timing issues.

### Critical Findings

#### 1. Infinite Loop in hero_webshop.js (Lines 127-138)

```javascript
const check_motion = () => {
  if (window.Motion && typeof window.Motion.animate === 'function') {
    resolve();
  } else {
    setTimeout(check_motion, INIT_DELAY_MS); // INFINITE if Motion.dev fails!
  }
};
check_motion();
```

**Issue**: No timeout - loops forever if Motion.dev never loads.
**Impact**: Page hidden **indefinitely**.
**Priority**: P0 - Blocker

#### 2. 10-Second Timeout in hero_general.js (Lines 302-306)

```javascript
setTimeout(() => finish('timeout'), 10000);
```

**Issue**: 10-second timeout defeats 3-second safety timeout.
**Impact**: Page hidden for up to 10 seconds on slow connections.
**Priority**: P0 - Blocker

#### 3. No Image Timeout in hero_general.js (Lines 276-286)

```javascript
promises.push(
  new Promise((resolve) => {
    img.addEventListener('load', resolve, { once: true });
    img.addEventListener('error', resolve, { once: true });
  }),
);
```

**Issue**: No timeout - waits forever if image fails to load or error event doesn't fire.
**Impact**: Page hidden indefinitely if image hangs.
**Priority**: P0 - Blocker

#### 4. Same Pattern in hero_cards.js (Lines 285-294)

Same infinite wait pattern for images.

### Recommendations

1. Add 1000ms timeout to Motion.dev polling loops
2. Reduce 10000ms timeout to 1000ms
3. Wrap image promises in Promise.race with 2000ms timeout
4. Move safety timeout to `<head>` before deferred scripts

---

## Agent 3: CSS Critical Path

### Focus
Analyze CSS loading and render-blocking behavior.

### Findings

**Total CSS**: 237KB custom + 339KB Webflow = 576KB total

**CSS Breakdown by Category**:

| Category | Files | Size | Used On |
|----------|-------|------|---------|
| Buttons | 12 | 80KB (33%) | All pages |
| Forms | 9 | 53KB | 3 pages |
| Video | 3 | 17KB | 6 pages |
| Hero | 6 | 25KB | All pages |
| Navigation | 4 | 18KB | All pages |
| Other | 13 | 44KB | Various |

**Issues Identified**:

1. **C-01**: No critical CSS inlining - all CSS render-blocking
2. **C-02**: Button CSS is 33% of total (80KB) - excessive
3. **C-03**: Form CSS loads globally (only needed on 3 pages)
4. **C-04**: Video CSS loads globally (only needed on 6 pages)
5. **C-05**: 9 static `will-change` declarations creating permanent layers
6. **C-06**: No CSS code splitting

### Recommendations

1. Inline critical CSS (~15KB) in `<head>`
2. Load form CSS only on form pages
3. Load video CSS only on video pages
4. Remove static `will-change` from stylesheets

---

## Agent 4: JS Bundle Analysis

### Focus
Analyze JavaScript bundle size and loading.

### Findings

**Total JS**: 48 files, 778KB source, 236KB minified

**Bundle Breakdown**:

| Category | Files | Source Size | Minified |
|----------|-------|-------------|----------|
| Hero | 6 | 89KB | ~35KB |
| Navigation | 5 | 45KB | ~18KB |
| Forms | 9 | 155KB | ~62KB |
| Video | 3 | 75KB | ~30KB |
| Modals | 4 | 38KB | ~15KB |
| Animations | 8 | 68KB | ~27KB |
| Other | 13 | 308KB | ~49KB |

**Issues Identified**:

1. **B-04**: Motion.dev loads 18 functions, uses only 2 (animate, inView)
2. **B-05**: Swiper full bundle loaded, uses ~30% of features
3. **B-06**: Form scripts (62KB) load on ALL pages
4. **B-10**: 48 separate HTTP requests for JS files
5. **B-11**: HLS.js (200KB) loads eagerly even if video doesn't need it

### Recommendations

1. Tree-shake Motion.dev to only needed functions
2. Create custom Swiper build with only used modules
3. Load form scripts only on form pages
4. Bundle 48 files into page-specific bundles

---

## Agent 5: Third-Party Scripts

### Focus
Analyze third-party script impact on performance.

### Findings

**Third-Party Scripts**:

| Script | Size | Loading | Impact |
|--------|------|---------|--------|
| jQuery | 87KB | Blocking | Cannot change (Webflow) |
| Webflow.js | 70KB | Blocking | Cannot change (Webflow) |
| TypeKit | ~25KB | **BLOCKING** | 800-1200ms FOIT |
| ConsentPro | 301KB | Defer | 212KB unused |
| GTM | ~50KB | Delayed 3.5s | ✅ Good |
| Motion.dev | ~90KB | ES Module | Required |

**Issues Identified**:

1. **E-01**: TypeKit is render-blocking, causes FOIT
2. **E-02**: ConsentPro is 301KB, 212KB unused (may duplicate custom modal)
3. **E-03/E-04**: jQuery/Webflow.js blocking (cannot change)
4. **E-05**: No preconnect to unpkg.com (FilePond latency)
5. **E-06**: GTM delayed correctly ✅

### Recommendations

1. Add `font-display: swap` to TypeKit (or self-host fonts)
2. Audit ConsentPro - consider replacing with custom modal
3. Add preconnect hint for unpkg.com

---

## Agent 6: Video/HLS Loading

### Focus
Analyze video loading behavior and optimization opportunities.

### Findings

**Video Loading Pattern**:

1. Page loads with opacity:0
2. Hero script waits for video `loadeddata` event (desktop only)
3. HLS.js loads and initializes
4. Video starts playing
5. Page revealed

**Issues Identified**:

1. **A-06/D-04**: No video poster images - blank hero during load
2. **A-05/D-05**: Desktop waits up to 3 seconds for video `loadeddata`
3. **D-06**: HLS manifest not preloaded
4. **B-11**: HLS.js loads eagerly even on non-video pages

**Code Location** (hero_video.js:370-386):
```javascript
if (!is_mobile) {
  // Desktop waits for video - blocks page!
  promises.push(new Promise(resolve => {
    video.addEventListener('loadeddata', resolve);
  }));
}
```

### Recommendations

1. Add poster images extracted from video first frames
2. Skip video wait on all devices (video plays async)
3. Preload HLS manifest on video pages
4. Lazy load HLS.js only when needed

---

## Agent 7: Mobile Performance

### Focus
Analyze mobile-specific performance issues.

### Findings

**Mobile vs Desktop Comparison**:

| Metric | Mobile | Desktop | Difference |
|--------|--------|---------|------------|
| LCP | 20.2s | 4.1s | 5x worse |
| FCP | 6.2s | 0.7s | 9x worse |
| Score | 55% | 77% | 22 points |

**Why Mobile is Worse**:

1. Same resources as desktop (no responsive optimization)
2. No srcset/sizes on hero images (mobile downloads desktop images)
3. No lazy loading (all images load immediately)
4. Same JavaScript bundle regardless of device
5. 3G connection emulation shows severe bottleneck

**Issues Identified**:

1. **D-01**: No responsive images (srcset) - mobile downloads desktop-sized
2. **D-02**: No `loading="lazy"` on below-fold images
3. **D-03/F-02**: No `fetchpriority="high"` on hero images
4. **D-07**: No `decoding="async"` on images

### Recommendations

1. Add srcset/sizes to all hero images
2. Add `loading="lazy"` to below-fold images
3. Add `fetchpriority="high"` to LCP candidate images
4. Add `decoding="async"` to non-critical images

---

## Agent 8: Animation Performance

### Focus
Analyze animation implementation and optimization opportunities.

### Findings

**Motion.dev Usage**:
- 17 scripts poll for Motion.dev availability
- Each polls every 50ms until library loads
- Creates potential race conditions

**Forced Reflows**:
- 64 `getBoundingClientRect()` calls interleaved with style changes
- 11 in `nav_mobile_menu.js` alone
- Causes layout thrashing

**will-change Usage**:
- 40+ premature `will-change` declarations in JavaScript
- 9 static `will-change` in CSS files
- Creates permanent compositor layers (memory overhead)

**Issues Identified**:

1. **B-01**: 17 parallel Motion.dev polling loops
2. **B-02**: 64 forced reflows causing layout thrashing
3. **B-03**: 40+ premature `will-change` declarations
4. **B-07**: 36 separate DOMContentLoaded handlers
5. **B-08/B-09**: 16 observers (8 Intersection, 8 Mutation) on load

### Code Examples

**Polling Pattern (repeated 17 times)**:
```javascript
const check_motion = () => {
  if (window.Motion) { init(); }
  else { setTimeout(check_motion, 50); }
};
```

**Forced Reflow Pattern**:
```javascript
el.style.height = el.getBoundingClientRect().height + 'px';  // Read
el.style.width = el.getBoundingClientRect().width + 'px';    // Read again (forced reflow!)
```

### Recommendations

1. Create single `motion:ready` event instead of 17 polling loops
2. Batch all measurements before writes
3. Apply `will-change` only during animation
4. Consolidate observers

---

## Agent 9: Network & Resource Hints

### Focus
Analyze resource hints and network optimization opportunities.

### Findings

**Existing Preconnects** (7 origins):
- ✅ cdn.jsdelivr.net
- ✅ anobel-zn.b-cdn.net
- ✅ p.typekit.net
- ✅ use.typekit.net
- ✅ fonts.googleapis.com
- ✅ fonts.gstatic.com
- ✅ google-analytics.com

**Missing Hints**:

| Hint | Target | Impact |
|------|--------|--------|
| `<link rel="preload">` | LCP image | Browser can't prioritize |
| `fetchpriority="high"` | Hero images | No priority signal |
| `<link rel="preconnect">` | unpkg.com | FilePond latency |
| `<link rel="modulepreload">` | Motion.dev | ES module latency |

**Issues Identified**:

1. **F-01**: No LCP image preload on any page
2. **F-02**: No fetchpriority attributes
3. **F-03**: No speculative prefetch for navigation
4. **F-04**: No modulepreload for Motion.dev ES module
5. **F-05**: FilePond CSS blocks form page FCP

### Recommendations

1. Add `<link rel="preload">` for each page's LCP image
2. Add `fetchpriority="high"` to hero images
3. Add preconnect to unpkg.com
4. Convert FilePond CSS to async loading

---

## Agent 10: Webflow Constraints

### Focus
Document Webflow platform constraints.

### Findings (Partial - Agent Timeout)

**Confirmed Constraints**:

| Resource | Size | Modifiable | Status |
|----------|------|------------|--------|
| jQuery | 87KB | ❌ No | Platform requirement |
| Webflow.js | 70KB | ❌ No | Platform requirement |
| Main CSS | 339KB | ❌ No | Regenerated on publish |
| Custom Code | Variable | ✅ Yes | Our optimization target |

**Webflow Custom Code Locations**:
- `<head>` custom code section
- Before `</body>` custom code section
- Per-page custom code sections

**Limitations**:
- Cannot modify platform-injected scripts
- Cannot change script loading order for platform scripts
- Limited `<head>` access (custom code area only)

---

## Issue Inventory Summary

### By Category

| Category | Issues | P0 | P1 | P2 | P3 |
|----------|--------|----|----|----|----|
| A: Critical Path | 7 | 4 | 3 | 0 | 0 |
| B: JavaScript | 12 | 0 | 2 | 9 | 1 |
| C: CSS | 9 | 0 | 1 | 7 | 1 |
| D: Image/Media | 8 | 0 | 5 | 2 | 1 |
| E: Third-Party | 6 | 0 | 1 | 2 | 0 |
| F: Network/Hints | 6 | 0 | 3 | 0 | 2 |
| G: Architecture | 5 | 0 | 0 | 4 | 1 |
| **Total** | **53** | **4** | **15** | **24** | **6** |

### By Impact

**Root Cause Chain**:
```
Motion.dev infinite loop (A-01)
         │
         ▼
10-second timeout (A-02) ───► Defeats 3-second safety
         │
         ▼
No image timeout (A-03) ───► Indefinite wait possible
         │
         ▼
Safety timeout too late (A-04) ───► Runs after problems occur
         │
         ▼
Mobile LCP: 20.2 seconds
```

---

## Key Insights

### 1. The Fallback Works (When It Fires)

The `handle_fallback()` function correctly reveals the page:
```javascript
function handle_fallback() {
  page_wrapper.classList.add('page-ready');
  console.log('[Hero] Fallback - showing page');
}
```

**Problem**: Timeouts prevent it from firing:
- Infinite loop = never fires
- 10s timeout = fires too late
- No image timeout = never fires

### 2. Mobile is 5x Worse Than Desktop

Same resources, no mobile optimization:
- Desktop: 4.1s LCP
- Mobile: 20.2s LCP

**Key factor**: Mobile network latency amplifies all timeout issues.

### 3. Quick Wins Available

Phase 1 fixes (timeout corrections) should deliver 50-80% improvement:
- Fix infinite loop → guaranteed reveal
- Reduce 10s→1s → 80% faster on slow Motion.dev
- Add image timeout → guaranteed reveal on image failure
- Move safety to head → guaranteed 3s maximum

---

## Appendix A: File Analysis Summary

### JavaScript Files Analyzed

| File | Lines | Issues Found |
|------|-------|--------------|
| hero_webshop.js | 289 | A-01 (infinite loop) |
| hero_general.js | 432 | A-02 (10s timeout), A-03 (no image timeout) |
| hero_cards.js | 378 | A-03 (no image timeout) |
| hero_video.js | 456 | A-05 (video wait), D-05 |
| nav_mobile_menu.js | 234 | B-02 (11 reflows) |
| global.html | 512 | A-04 (safety position), B-01 (no event) |

### CSS Files Analyzed

| Category | Files | Total Size | Optimization Potential |
|----------|-------|------------|----------------------|
| Buttons | 12 | 80KB | High - consolidate |
| Forms | 9 | 53KB | High - page-specific |
| Video | 3 | 17KB | Medium - page-specific |
| Hero | 6 | 25KB | Low - needed globally |

---

## Appendix B: Performance Baselines

### Lighthouse Scores (Pre-Optimization)

| Page | Mobile LCP | Mobile FCP | Mobile Score | Desktop LCP | Desktop Score |
|------|------------|------------|--------------|-------------|---------------|
| Home | 21.4s | 5.9s | 55% | 4.1s | 77% |
| Contact | 19.7s | 3.9s | 57% | 4.0s | 75% |
| Werken Bij | 20.0s | 7.5s | 56% | 4.2s | 74% |
| Blog | 18.5s | 4.2s | 58% | 3.8s | 79% |

### Network Analysis

| Resource Type | Requests | Transfer | Notes |
|---------------|----------|----------|-------|
| Document | 1 | ~40KB | HTML |
| Stylesheets | 12 | ~280KB | Custom CSS |
| Scripts | 48 | ~450KB | Custom + platform |
| Images | 15-25 | ~1.5MB | Varies by page |
| Fonts | 4-6 | ~100KB | TypeKit + custom |
| Video | 1-2 | Variable | HLS segments |

---

## Appendix C: Research Confidence

| Finding | Confidence | Evidence Quality |
|---------|------------|------------------|
| Infinite loop bug | HIGH | Code analysis confirmed |
| 10s timeout issue | HIGH | Code analysis confirmed |
| No image timeout | HIGH | Code analysis confirmed |
| Safety position | HIGH | Code analysis confirmed |
| CSS waste | MEDIUM | Estimated from file sizes |
| Bundle potential | MEDIUM | Estimated from analysis |
| Mobile delta | HIGH | Lighthouse measurements |

---

<!--
RESEARCH SUMMARY (~700 lines)
- 10-agent parallel analysis methodology
- Detailed findings per agent
- 53 issues identified across 7 categories
- Root cause chain analysis
- Key insights and quick wins
- Performance baselines
- Confidence ratings
-->
