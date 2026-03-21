---
title: "Feature Specification: Comprehensive Performance Optimization - anobel.com [029-anobel-performance-analysis/spec]"
description: "A 10-agent deep analysis of anobel.com identified 50+ performance issues across JavaScript, CSS, images, third-party scripts, and network optimization. The mobile LCP of 20.2 se..."
trigger_phrases:
  - "feature"
  - "specification"
  - "comprehensive"
  - "performance"
  - "optimization"
  - "spec"
  - "029"
  - "anobel"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Comprehensive Performance Optimization - anobel.com

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

A 10-agent deep analysis of anobel.com identified **50+ performance issues** across JavaScript, CSS, images, third-party scripts, and network optimization. The mobile LCP of 20.2 seconds (target <4s) is caused by critical JavaScript bugs that defeat existing safety mechanisms, compounded by unoptimized resource loading, lack of code splitting, and missing browser hints.

**Key Decisions**: 
1. Fix critical JS timeout bugs first (Phase 1)
2. Implement resource prioritization (Phase 2)
3. Optimize bundles and architecture (Phase 3-4)

**Critical Dependencies**: Webflow platform constraints (jQuery/Webflow.js blocking), R2 CDN for script hosting

<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec ID** | 031 |
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Analysis Complete - Ready for Implementation |
| **Created** | 2025-02-01 |
| **Author** | Claude Opus (10-Agent Parallel Analysis) |
| **Parent Specs** | 024-performance-optimization, 025-performance-review |
| **LOC Estimate** | ~500-800 (across multiple files) |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The anobel.com website has severe performance issues despite Phase 1 optimizations (Spec 024):
- **Mobile LCP**: 20.2 seconds (target: <4s) - 5x over budget
- **Mobile FCP**: 6.2 seconds (target: <3s) - 2x over budget
- **Mobile Score**: 55% (target: >75%) - failing Core Web Vitals
- **Desktop LCP**: 4.1 seconds (target: <2.5s) - 64% over budget

The 3-second safety timeout implemented in Spec 024 is being defeated by JavaScript bugs with longer timeouts (up to 10 seconds) and infinite loops.

### Purpose

Achieve passing Core Web Vitals scores by:
1. Eliminating critical JavaScript bugs causing page visibility delays
2. Implementing comprehensive resource optimization
3. Reducing bundle sizes through code splitting
4. Adding proper browser hints for resource prioritization

**Success looks like**: Mobile LCP <4s, Mobile Score >75%, Desktop LCP <2.5s

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Category A: Critical Path Fixes (P0)**
- Hero JavaScript timeout bugs (4 files)
- Safety timeout positioning
- Video poster images
- LCP image preloading

**Category B: JavaScript Optimization (P1)**
- Motion.dev polling consolidation
- Forced reflow elimination
- Bundle size reduction (tree-shaking)
- Page-specific script loading

**Category C: CSS Optimization (P1)**
- Critical CSS inlining
- Page-specific CSS loading
- FilePond CSS async loading
- will-change cleanup

**Category D: Image/Media Optimization (P1)**
- Responsive images (srcset)
- Lazy loading implementation
- Video loading optimization
- fetchpriority attributes

**Category E: Third-Party Optimization (P2)**
- TypeKit font-display fix
- ConsentPro audit
- Preconnect gaps

**Category F: Architecture Improvements (P2)**
- Page-specific bundles
- Observer consolidation
- Service worker caching

### Out of Scope

- Webflow platform scripts (jQuery, Webflow.js) - Cannot modify
- Main Webflow CSS (339KB) - Platform-generated
- Backend/server optimizations - Static site
- Complete site redesign - Optimization only

### Files to Change

#### Critical Priority (Phase 1)
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `src/2_javascript/hero/hero_webshop.js` | Modify | Add 1s timeout to infinite Motion.dev loop |
| `src/2_javascript/hero/hero_general.js` | Modify | Reduce 10s→1s timeout, add image timeout |
| `src/2_javascript/hero/hero_cards.js` | Modify | Add 2s image loading timeout |
| `src/2_javascript/hero/hero_video.js` | Modify | Skip video wait on all devices |
| `src/0_html/global.html` | Modify | Move safety timeout to `<head>` |

#### High Priority (Phase 2)
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `src/0_html/home.html` | Modify | Add video poster, LCP preload, fetchpriority |
| `src/0_html/contact.html` | Modify | Add LCP preload, fetchpriority |
| `src/0_html/werken_bij.html` | Modify | Add LCP preload, async FilePond CSS |
| All page HTML files | Modify | Add resource hints per page |

#### Medium Priority (Phase 3-4)
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `src/2_javascript/navigation/*.js` | Modify | Batch forced reflows |
| `src/2_javascript/hero/*.js` | Modify | Unified Motion.dev event |
| `src/1_css/global/*.css` | Modify | Remove premature will-change |
| Multiple | Create | Page-specific bundles |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix infinite Motion.dev loop in hero_webshop.js | Loop has 1000ms timeout, console warns on timeout |
| REQ-002 | Reduce hero_general.js Motion timeout to 1s | `setTimeout` changed from 10000 to 1000 |
| REQ-003 | Add image loading timeout (2s) | Promise.race wraps image load promises |
| REQ-004 | Move safety timeout to `<head>` | Timeout in head before deferred scripts |
| REQ-005 | Page visible within 3 seconds on timeout | Safety timeout triggers and reveals page |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Add video poster images | `<video poster="...">` on hero videos |
| REQ-007 | Add LCP image preload per page | `<link rel="preload">` in each page head |
| REQ-008 | Add fetchpriority="high" to hero images | Attribute present on LCP candidates |
| REQ-009 | Skip video wait on all devices | Video wait block removed/commented |
| REQ-010 | Async FilePond CSS on form pages | Preload pattern with onload handler |
| REQ-011 | Create unified Motion.dev ready event | Single `motion:ready` CustomEvent |
| REQ-012 | Eliminate Motion.dev polling loops | Event listener pattern, not polling |
| REQ-013 | Add responsive images (srcset) | Hero images have srcset/sizes |
| REQ-014 | Add loading="lazy" to below-fold images | Attribute present, verified in DOM |

### P2 - Optional (can defer without approval)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-015 | Tree-shake Motion.dev | Only animate, inView imported |
| REQ-016 | Custom Swiper build | Core + used modules only |
| REQ-017 | Batch forced reflows in nav scripts | Single measurement pass |
| REQ-018 | Critical CSS inlining | Above-fold CSS inline in head |
| REQ-019 | Page-specific JS bundles | Form scripts only on form pages |
| REQ-020 | Page-specific CSS bundles | Video CSS only on video pages |
| REQ-021 | ConsentPro audit | Determine if custom modal can replace |
| REQ-022 | TypeKit font-display: swap | Configure in Webflow or self-host |
| REQ-023 | Service worker for caching | SW registered, caches assets |
| REQ-024 | Observer consolidation | Reduce from 16 to <5 observers |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Metric | Current | Target | Measurement |
|----|--------|---------|--------|-------------|
| SC-001 | Mobile LCP | 20.2s | <4.0s | Lighthouse CLI |
| SC-002 | Mobile FCP | 6.2s | <3.0s | Lighthouse CLI |
| SC-003 | Desktop LCP | 4.1s | <2.5s | Lighthouse CLI |
| SC-004 | Mobile Score | 55% | >75% | PageSpeed Insights |
| SC-005 | Desktop Score | 77% | >90% | PageSpeed Insights |
| SC-006 | Page hangs | Possible | 0 | Manual testing |
| SC-007 | Safety timeout fires | Never | On failure only | Console log |
| SC-008 | JS Bundle Size | 236KB | <180KB | Build output |
| SC-009 | CSS per page | 237KB | <100KB | Network tab |

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Likelihood | Mitigation |
|------|------|--------|------------|------------|
| **Dependency** | Webflow platform | Cannot modify jQuery/Webflow.js | Certain | Work around with custom code |
| **Dependency** | R2 CDN | Script hosting | Low | Versioned URLs, fallbacks |
| **Dependency** | TypeKit | Font blocking | Medium | Preconnects, consider self-hosting |
| **Risk** | Hero animation incomplete | Medium | Low | CSS fallback for incomplete state |
| **Risk** | Video poster flash | Low | Medium | Match poster to first frame |
| **Risk** | Motion.dev features missing | Medium | Low | Graceful degradation exists |
| **Risk** | Webflow overwrites custom code | Medium | Medium | Document in webflow-guide.md |
| **Risk** | Bundle changes break functionality | High | Low | Test all pages, staged rollout |
| **Risk** | ConsentPro removal legal issues | High | Medium | Legal review before removal |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

| ID | Requirement | Target | Current |
|----|-------------|--------|---------|
| NFR-P01 | Mobile LCP | <4.0s | 20.2s |
| NFR-P02 | Mobile FCP | <3.0s | 6.2s |
| NFR-P03 | Desktop LCP | <2.5s | 4.1s |
| NFR-P04 | Time to Interactive | <5.0s | ~8s |
| NFR-P05 | Total Blocking Time | <200ms | ~130ms |
| NFR-P06 | Cumulative Layout Shift | <0.1 | 0.003 ✓ |
| NFR-P07 | JavaScript bundle size | <180KB | 236KB |
| NFR-P08 | CSS per page | <100KB | 237KB |
| NFR-P09 | Page weight (mobile) | <2MB | ~3MB |

### Reliability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-R01 | Page visibility guarantee | Within 3 seconds, always |
| NFR-R02 | Graceful degradation | Page usable without animations |
| NFR-R03 | No infinite loops | All async operations have timeouts |
| NFR-R04 | Console error-free | Zero errors on load |

### Compatibility

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-C01 | Browser support | Chrome 90+, Safari 14+, Firefox 90+, Edge 90+ |
| NFR-C02 | Mobile support | iOS 14+, Android 10+ |
| NFR-C03 | Webflow compatibility | All changes work within Webflow constraints |

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Critical Path Edge Cases

| Scenario | Current Behavior | Required Behavior |
|----------|------------------|-------------------|
| Motion.dev fails to load | hero_webshop hangs forever | Timeout after 1s, show static content |
| Hero images fail to load | hero_general waits forever | Timeout after 2s, reveal page |
| HLS video fails to load | Page waits 3s (desktop) | Skip video wait entirely |
| All resources fail | Page potentially hidden forever | Safety timeout reveals at 3s |
| Slow 3G connection | 20+ second LCP | Page visible in 3s, resources load async |

### Animation Edge Cases

| Scenario | Current Behavior | Required Behavior |
|----------|------------------|-------------------|
| Reduced motion preference | Skip animations | ✓ Already handled |
| Animation interrupted | May leave partial state | CSS transition fallback |
| Motion.dev timeout | Fallback to static | ✓ Already handled |
| Multiple heroes on page | All wait independently | Unified waiting mechanism |

### Error Scenarios

| Scenario | Handling |
|----------|----------|
| CDN unavailable | Serve from local fallback (future) |
| Script parse error | Isolate errors, don't block page |
| CSS load failure | Browser default styles acceptable |
| Video codec unsupported | Show poster image permanently |

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 20+, LOC: 500-800, Systems: JS/CSS/HTML/CDN |
| Risk | 18/25 | Performance-critical, user-facing, multiple pages |
| Research | 18/20 | 10-agent analysis complete, extensive investigation |
| Multi-Agent | 12/15 | 10 parallel agents used, multiple workstreams |
| Coordination | 10/15 | Dependencies between phases, staged rollout |
| **Total** | **80/100** | **Level 3+ Confirmed** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Score | Mitigation |
|---------|-------------|--------|------------|-------|------------|
| R-001 | Hero animation breaks | High | Low | 6 | Test all hero variants, CSS fallback |
| R-002 | Webflow overwrites code | Medium | Medium | 9 | Document in guide, version control |
| R-003 | Performance regression | High | Low | 6 | Lighthouse before/after, staged rollout |
| R-004 | Form upload breaks | High | Low | 6 | Test FilePond after CSS async |
| R-005 | Video playback issues | Medium | Low | 4 | Test HLS on all browsers |
| R-006 | TypeKit FOUT/FOIT | Low | High | 6 | font-display: swap |
| R-007 | ConsentPro legal | High | Medium | 12 | Legal review before changes |
| R-008 | Mobile-specific bugs | Medium | Medium | 9 | Test on real devices |
| R-009 | Bundle size increases | Medium | Low | 4 | Monitor build output |
| R-010 | Cache invalidation | Low | Medium | 4 | Version query strings |

**Risk Score Legend**: Impact (1-3) × Likelihood (1-3) = Score (1-9)
- 1-3: Accept
- 4-6: Monitor
- 7-9: Mitigate actively
- 10+: Escalate

<!-- /ANCHOR:risk-matrix -->

---

## 11. ISSUE INVENTORY

### Category A: Critical Path Issues (7 issues)

| ID | Issue | File(s) | Impact | Priority |
|----|-------|---------|--------|----------|
| A-01 | Infinite Motion.dev polling loop | hero_webshop.js | Page hidden forever | P0 |
| A-02 | 10-second Motion.dev timeout | hero_general.js | Defeats 3s safety | P0 |
| A-03 | No image loading timeout | hero_general.js, hero_cards.js | Indefinite wait | P0 |
| A-04 | Safety timeout in wrong position | global.html | Runs after blocking code | P0 |
| A-05 | Desktop waits 3s for video | hero_video.js | Blocks desktop LCP | P1 |
| A-06 | No video poster images | All video pages | Blank hero during load | P1 |
| A-07 | No LCP image preload | All pages | Browser can't prioritize | P1 |

### Category B: JavaScript Issues (12 issues)

| ID | Issue | File(s) | Impact | Priority |
|----|-------|---------|--------|----------|
| B-01 | 17 parallel Motion.dev polling loops | All hero, nav, modal | CPU waste, races | P1 |
| B-02 | 64 forced reflows | nav_mobile_menu.js (11), others | Layout thrashing | P1 |
| B-03 | 40+ premature will-change | Hero scripts, link scripts | Memory bloat | P2 |
| B-04 | Motion.dev loads 18 functions, uses 2 | global.html | 15KB wasted | P2 |
| B-05 | Swiper full bundle, uses ~30% | 11 pages | 25-30KB wasted | P2 |
| B-06 | Form scripts load on ALL pages | 9 form scripts (62KB) | Unnecessary on 15/18 pages | P2 |
| B-07 | 36 DOMContentLoaded handlers | Most scripts | Init overhead | P2 |
| B-08 | 8 IntersectionObservers on load | Various | Memory/CPU | P2 |
| B-09 | 8 MutationObservers on load | Various | Memory/CPU | P2 |
| B-10 | No script bundling | 48 files | 48 HTTP requests | P2 |
| B-11 | HLS.js loads eagerly | Video pages | 200KB even if not needed | P2 |
| B-12 | Lenis loads on desktop only | global.html | ✓ Good (no issue) | - |

### Category C: CSS Issues (9 issues)

| ID | Issue | File(s) | Impact | Priority |
|----|-------|---------|--------|----------|
| C-01 | No critical CSS inlining | global.html | Render-blocking | P2 |
| C-02 | Button CSS is 33% of total | 12 button CSS files (80KB) | Excessive size | P2 |
| C-03 | Form CSS loads globally | 9 form CSS files (53KB) | Only needed on 3 pages | P2 |
| C-04 | Video CSS loads globally | 3 video CSS files (17KB) | Only needed on 6 pages | P2 |
| C-05 | 9 will-change in stylesheets | Various button/link CSS | Permanent layers | P2 |
| C-06 | No CSS code splitting | All 237KB loads | All pages get all CSS | P2 |
| C-07 | Complex selectors (:has, nesting) | Various | Slower matching | P3 |
| C-08 | FilePond CSS blocking | werken_bij, vacature | Form page FCP | P1 |
| C-09 | Main Webflow CSS 339KB | Webflow-generated | Cannot change | - |

### Category D: Image/Media Issues (8 issues)

| ID | Issue | File(s) | Impact | Priority |
|----|-------|---------|--------|----------|
| D-01 | No responsive images (srcset) | All hero images | Mobile downloads desktop | P1 |
| D-02 | No loading="lazy" attributes | All images | All load immediately | P1 |
| D-03 | No fetchpriority="high" | Hero images | No priority signal | P1 |
| D-04 | No video poster images | Video pages | Blank during load | P1 |
| D-05 | Desktop waits for video loadeddata | hero_video.js | 3s block | P1 |
| D-06 | HLS manifest not preloaded | Video pages | Delayed streaming | P2 |
| D-07 | No decoding="async" | Images | Main thread blocking | P2 |
| D-08 | No image compression audit | All images | Potentially oversized | P3 |

### Category E: Third-Party Issues (6 issues)

| ID | Issue | File(s) | Impact | Priority |
|----|-------|---------|--------|----------|
| E-01 | TypeKit BLOCKING | Webflow-injected | 800-1200ms FOIT | P1 |
| E-02 | ConsentPro 301KB (212KB unused) | Webflow-injected | May duplicate custom | P2 |
| E-03 | jQuery blocking 87KB | Webflow platform | Cannot change | - |
| E-04 | Webflow.js blocking 70KB | Webflow platform | Cannot change | - |
| E-05 | No preconnect to unpkg.com | Form pages | FilePond latency | P2 |
| E-06 | GTM delay working correctly | global.html | ✓ Good (no issue) | - |

### Category F: Network/Hints Issues (6 issues)

| ID | Issue | File(s) | Impact | Priority |
|----|-------|---------|--------|----------|
| F-01 | No LCP image preload | All pages | Browser guesses | P1 |
| F-02 | No fetchpriority attributes | All pages | No hints | P1 |
| F-03 | No speculative prefetch | Navigation | Latency on click | P3 |
| F-04 | No modulepreload for Motion.dev | global.html | ES module latency | P3 |
| F-05 | FilePond CSS sync load | Form pages | Blocking | P1 |
| F-06 | Preconnects exist | global.html | ✓ Good (7 origins) | - |

### Category G: Architecture Issues (5 issues)

| ID | Issue | File(s) | Impact | Priority |
|----|-------|---------|--------|----------|
| G-01 | No page-specific JS bundles | All pages | All scripts everywhere | P2 |
| G-02 | No page-specific CSS bundles | All pages | All CSS everywhere | P2 |
| G-03 | No service worker | Site-wide | No caching strategy | P3 |
| G-04 | 16 observers on page load | Various | Memory overhead | P2 |
| G-05 | Webflow platform constraints | Multiple | Cannot modify core | - |

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | User | Pending | - |
| Phase 1 Implementation | User | Pending | - |
| Phase 2 Implementation | User | Pending | - |
| Performance Verification | Lighthouse | Pending | - |
| Production Deployment | User | Pending | - |

<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 13. COMPLIANCE CHECKPOINTS

### Performance Compliance
- [ ] Core Web Vitals passing (LCP <4s, FID <100ms, CLS <0.1)
- [ ] Mobile Lighthouse score >75
- [ ] Desktop Lighthouse score >90
- [ ] No console errors on page load

### Code Compliance
- [ ] All timeouts have maximum values
- [ ] No infinite loops possible
- [ ] Graceful degradation for all features
- [ ] Cross-browser testing complete

### Documentation Compliance
- [ ] spec.md complete with all issues
- [ ] plan.md has all implementation phases
- [ ] tasks.md has granular breakdown
- [ ] checklist.md has verification items
- [ ] decision-record.md documents key choices

<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Site Owner | Business | High - Performance affects SEO/UX | Summary reports |
| Developer | Implementation | High - Makes changes | This spec, daily updates |
| Webflow | Platform | Low - Constraints apply | N/A |
| Users | End users | High - Affected by performance | Faster load times |

<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 15. CHANGE LOG

### v1.0 (2025-02-01)
**Initial 10-agent analysis**
- Deployed 10 parallel agents for comprehensive analysis
- Identified 50+ performance issues across 7 categories
- Prioritized issues into P0/P1/P2/P3
- Created implementation phases

### v1.1 (2025-02-01)
**Expanded to Level 3+ documentation**
- Added complete issue inventory
- Added detailed requirements table
- Added risk matrix with scoring
- Added non-functional requirements

<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

1. **ConsentPro**: Can custom modal_cookie_consent.js fully replace ConsentPro (301KB)? Requires legal review.
2. **TypeKit**: Is TypeKit actually used, or are Silka fonts sufficient? Need font audit.
3. **Video posters**: Should posters be extracted from videos or designed separately?
4. **Bundle strategy**: Should we use Webpack/Rollup for bundling, or keep manual approach?

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Findings**: See `research.md`
- **Prior Specs**: `024-performance-optimization`, `025-performance-review`

---

## APPENDIX A: 10-AGENT ANALYSIS SUMMARY

| Agent | Focus | Key Finding | Session |
|-------|-------|-------------|---------|
| 1 | LCP Elements | Page hidden via opacity:0 until .page-ready | ses_3e5dd6698f |
| 2 | Hero JavaScript | Infinite loop, 10s timeout, no image timeout | ses_3e5dd4aebf |
| 3 | CSS Critical Path | 237KB CSS, 33% buttons, global form/video CSS | ses_3e5dd353af |
| 4 | JS Bundle | 48 files, 778KB source, form scripts global | (prior research) |
| 5 | Third-Party | GTM good, TypeKit blocking, ConsentPro bloat | ses_3e5dd0894f |
| 6 | Video/HLS | No posters, desktop waits 3s, no manifest preload | ses_3e5dcf2f4f |
| 7 | Mobile | 5x worse than desktop, same resources, no srcset | ses_3e5dcdf2df |
| 8 | Animation | 17 Motion loops, 64 reflows, 40+ will-change | ses_3e5dccbc2f |
| 9 | Network | No LCP preload, no fetchpriority, gaps in hints | ses_3e5dcb810f |
| 10 | Webflow | jQuery/Webflow.js blocking (cannot change) | (timeout) |

---

## APPENDIX B: METRICS BASELINE

### Pre-Optimization (Current State)

| Page | Mobile LCP | Mobile FCP | Mobile Score | Desktop LCP | Desktop Score |
|------|------------|------------|--------------|-------------|---------------|
| Home | 21.4s | 5.9s | 55% | 4.1s | 77% |
| Contact | 19.7s | 3.9s | 57% | 4.0s | 75% |
| Werken Bij | 20.0s | 7.5s | 56% | 4.2s | 74% |

### Target (Post-Optimization)

| Page | Mobile LCP | Mobile FCP | Mobile Score | Desktop LCP | Desktop Score |
|------|------------|------------|--------------|-------------|---------------|
| All | <4.0s | <3.0s | >75% | <2.5s | >90% |

---

<!--
LEVEL 3+ SPEC - COMPREHENSIVE PERFORMANCE OPTIMIZATION
- 50+ issues identified across 7 categories
- 10-agent parallel analysis
- Full governance controls
- ~400 lines
-->
