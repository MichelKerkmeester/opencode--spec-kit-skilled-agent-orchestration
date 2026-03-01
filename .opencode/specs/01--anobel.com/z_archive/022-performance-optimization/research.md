---
title: "Research Summary - Performance Optimization [022-performance-optimization/research]"
description: "Date: January 26, 2026"
trigger_phrases:
  - "research"
  - "summary"
  - "performance"
  - "optimization"
  - "022"
importance_tier: "normal"
contextType: "research"
---
# Research Summary - Performance Optimization

<!-- ANCHOR:research-methodology -->
## Research Methodology

**Date:** January 26, 2026
**Approach:** 10 parallel Opus research agents analyzing different performance aspects
**Scope:** anobel.com /src directory (HTML, CSS, JavaScript)
**Baseline:** Google PageSpeed Insights audit

---

<!-- /ANCHOR:research-methodology -->

<!-- ANCHOR:agent-1-html-loading-strategy-analysis -->
## Agent 1: HTML Loading Strategy Analysis

### Key Findings

| Aspect | Current State |
|--------|---------------|
| Script loading | 95%+ use defer; 3 use async (BotPoison); inline GTM blocks |
| CSS loading | All render-blocking, NO inline critical CSS |
| Preload usage | Fonts and libs preloaded; inconsistent application |
| Global scripts | 14 custom scripts from R2 CDN (all deferred) |

### Critical Issues

1. **GTM inline blocking script in head** - HIGH impact
2. **Motion.dev module import pattern** - HIGH impact
3. **No inline critical CSS** - HIGH impact
4. **Swiper CSS render-blocking on 12 pages** (45KB) - MEDIUM impact
5. **Excessive HTTP requests** (22 scripts on home page) - HIGH impact
6. **No script bundling** - HIGH impact
7. **Preload hints not used for critical images** - HIGH impact

### Recommendations
- Delay GTM with requestIdleCallback (-200-400ms FCP)
- Add critical CSS inline (-500-800ms LCP)
- Preload LCP image (-300-500ms LCP)
- Bundle global scripts (-13 HTTP requests)
- Convert Swiper CSS to non-blocking (-45KB render-blocking)

---

<!-- /ANCHOR:agent-1-html-loading-strategy-analysis -->

<!-- ANCHOR:agent-2-javascript-bundle-analysis -->
## Agent 2: JavaScript Bundle Analysis

### Bundle Inventory

| Category | Files | Source Size | Minified Size |
|----------|-------|-------------|---------------|
| Form | 9 | 192 KB | 61 KB |
| Video | 4 | 122 KB | 37 KB |
| Hero | 5 | 99 KB | 28 KB |
| Navigation | 5 | 87 KB | 23 KB |
| Modal | 2 | 85 KB | 30 KB |
| Menu | 4 | 46 KB | 12 KB |
| Molecules | 4 | 37 KB | 15 KB |
| Global | 7 | 35 KB | 8 KB |
| CMS | 5 | 59 KB | 18 KB |
| Swiper | 3 | 16 KB | 4 KB |
| **TOTAL** | **48** | **778 KB** | **236 KB** |

### Largest Files (Top 5)
1. modal_cookie_consent.js: 56 KB / 20 KB min
2. form_validation.js: 52 KB / 19 KB min
3. form_submission.js: 43 KB / 17 KB min
4. video_background_hls_hover.js: 40 KB / 12 KB min
5. video_player_hls_scroll.js: 39 KB / 13 KB min

### Code Splitting Opportunities
- Form scripts (62KB) only needed on form pages
- Video scripts (37KB) only needed on video pages
- Hero variants (28KB) only relevant hero needed per page

### Lazy Loading Candidates
- modal_welcome.js (10KB) - shown once per session
- table_of_content.js (5KB) - blog only
- social_share.js (3KB) - article end only

---

<!-- /ANCHOR:agent-2-javascript-bundle-analysis -->

<!-- ANCHOR:agent-3-third-party-scripts-analysis -->
## Agent 3: Third-Party Scripts Analysis

### External Dependencies

| Script | Size | CDN | Usage |
|--------|------|-----|-------|
| ConsentPro | 301 KB (212 KB unused) | consentpro.com | GDPR consent |
| Swiper | ~140 KB | jsdelivr | Carousels |
| HLS.js | ~200 KB | jsdelivr | Video streaming |
| Motion.dev | ~40 KB | jsdelivr | Animations |
| Lenis | ~8 KB | unpkg | Smooth scroll |
| FilePond | ~30 KB | unpkg | File uploads |
| Finsweet | ~35 KB | jsdelivr | CMS features |

### Critical Finding: Consent Script Duplication
Site loads BOTH:
- ConsentPro (301KB, Webflow-injected)
- Custom modal_cookie_consent.js (56KB, R2)

**Potential savings: ~250KB** if custom can replace ConsentPro.

### Adobe TypeKit Issue
- Loads **BLOCKING** in head
- May be redundant (Silka fonts already self-hosted)
- Needs audit to verify if TypeKit fonts are used

---

<!-- /ANCHOR:agent-3-third-party-scripts-analysis -->

<!-- ANCHOR:agent-4-css-performance-analysis -->
## Agent 4: CSS Performance Analysis

### CSS Inventory

| Category | Files | Total Size |
|----------|-------|------------|
| Button | 11 | ~87 KB |
| Form | 10 | ~57 KB |
| Link | 9 | ~24 KB |
| Video | 3 | ~17 KB |
| Global | 8 | ~16 KB |
| Other | 13 | ~31 KB |
| **TOTAL** | **54** | **~232 KB** |

### Critical CSS Candidates (~38 KB)
- global/structure.css (4.1 KB)
- global/typography.css (3.8 KB)
- button/btn_global.css (11.7 KB)
- button/btn_nav.css (12 KB)
- menu/navigation.css (0.9 KB)

### Unused CSS Suspects
- Form CSS (57 KB) only needed on 3 pages
- Video CSS (17 KB) only needed on video pages

### Complex Selectors (Performance Risk)
- `:has()` selectors in hover_state_machine.css
- Multi-attribute selectors in video_player_hls.css
- Deep nesting in form_validation.css

---

<!-- /ANCHOR:agent-4-css-performance-analysis -->

<!-- ANCHOR:agent-5-lcp-and-image-optimization -->
## Agent 5: LCP and Image Optimization

### ROOT CAUSE IDENTIFIED

**The 20.2s mobile LCP is caused by:**

```
Page hidden (opacity: 0) via CSS
        ↓
Wait for hero_video.js to complete:
├── document.fonts.ready (BLOCKING)
├── Motion.dev available (BLOCKING, 1000ms timeout)
└── video.loadeddata (BLOCKING - HLS streaming)
        ↓
mark_page_ready() adds .page-ready class
        ↓
Page finally visible → LCP measured
```

### Likely LCP Elements
1. Hero Video Background - requires HLS manifest + segment
2. Hero Images - wait for Motion.dev + fonts
3. Page Wrapper - hidden until JS completes

### Critical Missing Elements
- NO video poster image
- NO LCP image preload
- NO fetchpriority attributes
- NO fallback if hero animation fails

### Recommendations
1. Add video poster (-3-5s LCP)
2. Add safety timeout (-10-15s worst case)
3. Preload LCP image (-300-800ms)
4. Add fetchpriority="high" (-0.5-1s)

---

<!-- /ANCHOR:agent-5-lcp-and-image-optimization -->

<!-- ANCHOR:agent-6-above-the-fold-analysis -->
## Agent 6: Above-the-Fold Analysis

### Render-Blocking Resources

| Resource | Type | Size | Status |
|----------|------|------|--------|
| normalize.css | CSS | 7.6 KB | Blocking |
| webflow.css | CSS | 37.6 KB | Blocking |
| a-nobel-en-zn.webflow.css | CSS | **339 KB** | **MAIN BOTTLENECK** |
| TypeKit JS | JS | ~1 KB | **BLOCKING** |
| Swiper CSS | CSS | 18 KB | Blocking (not needed ATF) |

### Main CSS File Impact
- `a-nobel-en-zn.webflow.css` at **339 KB** is the dominant blocker
- Mobile: 339 KB / 1 Mbps = **2.7s just for CSS**
- Contains ALL site CSS, not just above-fold

### Deferrable Resources (Currently Blocking)
- Swiper CSS (18 KB) - carousels below fold
- Lenis CSS (0.2 KB) - scroll enhancement
- Motion.dev (40 KB) - can defer hero animation setup

### FCP Improvement Estimate
- Current Mobile: 6.2s
- After optimizations: 2.5-3s
- **Potential: 50% improvement**

---

<!-- /ANCHOR:agent-6-above-the-fold-analysis -->

<!-- ANCHOR:agent-7-animation-performance-analysis -->
## Agent 7: Animation Performance Analysis

### Motion.dev Usage

| Property | Value |
|----------|-------|
| Version | 12.15.0 |
| Bundle Size | ~40 KB |
| Functions Imported | 18 |
| Functions Used | 4 (animate, inView, scroll, hover) |
| Unused Code | ~15 KB |

### Hero Animation Impact

| File | Size | Animations | Impact |
|------|------|------------|--------|
| hero_general.js | 29.7 KB | 8+ simultaneous | HIGH |
| hero_video.js | 28.8 KB | 6+ simultaneous | HIGH |
| hero_cards.js | 23.0 KB | 5+ simultaneous | MEDIUM |
| hero_webshop.js | 14.2 KB | 6+ simultaneous | MEDIUM |

### Performance Issues
1. **48 will-change declarations** set too early
2. **Motion.dev polling loops** (5+ redundant)
3. **Forced reflow per hero** (`void element.offsetHeight`)
4. **No requestIdleCallback** for initial states

### CSS-Only Candidates
- Simple opacity fades
- Icon rotations
- Background color hovers
- Border radius changes

---

<!-- /ANCHOR:agent-7-animation-performance-analysis -->

<!-- ANCHOR:agent-8-initialization-patterns-analysis -->
## Agent 8: Initialization Patterns Analysis

### Script Initialization Summary
- **Total DOMContentLoaded handlers:** 36 scripts
- **Combined initialization time:** ~350-500ms overhead
- **All scripts init regardless of page type**

### INIT_DELAY Patterns

| File | Delay | Necessary? |
|------|-------|------------|
| video_background_hls_hover.js | 75ms | Yes |
| input_select_fs_bridge.js | 100ms | Yes |
| form_persistence.js | 250ms | Yes |
| Most others | 0-50ms | Variable |

### Issues
1. Motion.dev polling in multiple files (redundant)
2. All scripts register handlers even if not needed
3. 8 IntersectionObservers created on page load
4. 8 MutationObservers created on page load

### Recommendations
1. Stagger init with requestIdleCallback
2. Add page-type detection to skip irrelevant scripts
3. Consolidate Motion.dev detection to single event
4. Lazy-init observers when elements in viewport

---

<!-- /ANCHOR:agent-8-initialization-patterns-analysis -->

<!-- ANCHOR:agent-9-external-libraries-analysis -->
## Agent 9: External Libraries Analysis

### Library Usage Analysis

| Library | Loaded | Used |
|---------|--------|------|
| Swiper | Full bundle (all modules) | ~30% (Autoplay, Loop, Nav, Pagination) |
| Motion.dev | 18 functions | 4 functions |
| HLS.js | Full library | Basic playback only |
| Lenis | Full library | Basic smooth scroll |

### Swiper Module Analysis
**Required:** Core, Autoplay, Loop, Navigation, Pagination, Keyboard, A11y
**Unused:** Scrollbar, Thumbs, Zoom, Free Mode, Grid, Virtual, Parallax, Effects

**Potential savings: 25-30 KB**

### Page-Specific Loading (Good)
- FilePond: Only on form pages ✓
- HLS.js: Only on video pages ✓
- BotPoison: Only on form pages ✓
- Finsweet: Only on CMS pages ✓

---

<!-- /ANCHOR:agent-9-external-libraries-analysis -->

<!-- ANCHOR:agent-10-network-waterfall-analysis -->
## Agent 10: Network Waterfall Analysis

### Current Loading Chain

```
HTML Parse
    ├── [BLOCK] normalize.css
    ├── [BLOCK] webflow.css
    ├── [BLOCK] a-nobel-en-zn.webflow.css (339 KB) ← MAIN BOTTLENECK
    ├── [BLOCK] TypeKit JS ← RENDER BLOCKER
    └── [BLOCK] Swiper CSS (18 KB, not needed ATF)
           ↓
Body Scripts
    ├── [BLOCK] jQuery (no defer!)
    └── [BLOCK] webflow.js (no defer!)
           ↓
Deferred Scripts Execute
    └── hero_video.js waits for Motion.dev + fonts + video
           ↓
Page Visible (LCP)
```

### Missing Resource Hints

| Hint Type | Missing |
|-----------|---------|
| preconnect | use.typekit.net, p.typekit.net |
| preconnect | d3e54v103j8qbb.cloudfront.net (jQuery) |
| preconnect | api.consentpro.com |
| preload | LCP image/poster |

### Bottlenecks Identified
1. TypeKit BLOCKING (~500-2000ms)
2. No preconnect for TypeKit (~100-300ms)
3. jQuery/webflow.js without defer (~200-500ms)
4. Page hidden until hero JS completes (~1000-1500ms)
5. LCP image not preloaded (~300-800ms)

---

<!-- /ANCHOR:agent-10-network-waterfall-analysis -->

<!-- ANCHOR:consolidated-recommendations -->
## Consolidated Recommendations

### P0 - Critical (Immediate)

| Action | Impact | Effort |
|--------|--------|--------|
| Add 3s safety timeout | Prevents 20s+ white screen | Low |
| Add video poster | -3-5s LCP | Low |
| Preload LCP image | -300-800ms LCP | Low |
| Add preconnects | -200-500ms | Low |
| Make TypeKit async | -500-2000ms | Medium |

### P1 - High Priority

| Action | Impact | Effort |
|--------|--------|--------|
| Defer jQuery/Webflow.js | -200-500ms FCP | Low |
| Defer Swiper CSS | -18KB blocking | Low |
| Delay GTM | -200-400ms | Medium |
| Bundle global scripts | -13 requests | High |
| Lazy load scripts | Variable | Medium |

### P2 - Medium Priority

| Action | Impact | Effort |
|--------|--------|--------|
| Tree-shake Motion.dev | ~15KB | Medium |
| Inline critical CSS | -500-800ms | Medium |
| Custom Swiper build | ~25-30KB | Medium |
| Audit consent scripts | ~250KB | High |

---

<!-- /ANCHOR:consolidated-recommendations -->

<!-- ANCHOR:evidence-sources -->
## Evidence Sources

All findings sourced from:
- `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/src/0_html/` (HTML files)
- `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/src/1_css/` (CSS files)
- `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/src/2_javascript/` (JS files)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/01--anobel.com/z_archive/022-performance-optimization/` (research artifacts)
- Google PageSpeed Insights (Jan 26, 2026)

---

<!-- /ANCHOR:evidence-sources -->

<!-- ANCHOR:research-agents -->
## Research Agents

| Agent | Focus | Agent ID |
|-------|-------|----------|
| 1 | HTML Loading Strategy | a812af8 |
| 2 | JavaScript Bundle | a35ff23 |
| 3 | Third-Party Scripts | abd9c51 |
| 4 | CSS Performance | a7dd7cd |
| 5 | LCP/Image Optimization | a01e3ce |
| 6 | Above-the-Fold | a156fbc |
| 7 | Animation Performance | a0bb1fc |
| 8 | Initialization Patterns | a81cfdc |
| 9 | External Libraries | ad8d910 |
| 10 | Network Waterfall | a956201 |

<!-- /ANCHOR:research-agents -->
