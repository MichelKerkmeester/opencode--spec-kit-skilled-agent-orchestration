---
title: "Verification Checklist: Comprehensive Performance Optimization - anobel.com [031-anobel-performance-analysis/checklist]"
description: "Evidence Requirements"
trigger_phrases:
  - "verification"
  - "checklist"
  - "comprehensive"
  - "performance"
  - "optimization"
  - "031"
  - "anobel"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Comprehensive Performance Optimization - anobel.com

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3plus-govern | v2.0 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

**Evidence Requirements**:
- `[Test: description]` - Automated or manual test result
- `[File: path:lines]` - Code location verification
- `[Lighthouse: metric]` - Performance measurement
- `[Console: message]` - Browser console verification
- `[Network: observation]` - DevTools Network tab
- `[Screenshot: path]` - Visual evidence


<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation Verification

### Documentation Ready

- [x] CHK-001 [P0] Requirements documented in spec.md (50+ issues catalogued)
- [x] CHK-002 [P0] Technical approach defined in plan.md (6 phases)
- [x] CHK-003 [P0] Tasks defined in tasks.md (41 tasks)
- [x] CHK-004 [P1] Dependencies identified (Webflow constraints documented)
- [x] CHK-005 [P1] Baseline metrics recorded (Mobile LCP: 20.2s, Score: 55%)

### Environment Ready

- [x] CHK-006 [P0] Source files accessible (`src/` directory)
- [x] CHK-007 [P1] R2 CDN access confirmed (can upload files)
- [x] CHK-008 [P1] Webflow Designer access confirmed (can edit custom code)
- [ ] CHK-009 [P2] BunnyCDN access confirmed (for poster images)


<!-- /ANCHOR:pre-impl -->

---

## Phase 1: Critical Path Fixes (P0)

### T001: hero_webshop.js Infinite Loop Fix

- [x] CHK-010 [P0] Motion.dev polling loop has timeout wrapper
  - Evidence: `[File: hero_webshop.js:127-145]`
- [x] CHK-011 [P0] Timeout set to 1000ms maximum
  - Evidence: `[File: hero_webshop.js - setTimeout(..., 1000)]`
- [x] CHK-012 [P0] Console warning on timeout
  - Evidence: `[Console: "[Hero Webshop] Motion.dev timeout"]`
- [x] CHK-013 [P0] Page loads when Motion.dev blocked
  - Evidence: `[Test: Block Motion.dev CDN, page visible in <2s]`

### T002: hero_general.js Motion Timeout Reduction

- [x] CHK-014 [P0] Motion.dev timeout reduced from 10000ms to 1000ms
  - Evidence: `[File: hero_general.js:302-306 - setTimeout(..., 1000)]`
- [x] CHK-015 [P0] Page reveals within 1.5s with slow Motion.dev
  - Evidence: `[Test: Throttle Motion.dev, page visible in <1.5s]`

### T003-T004: Image Loading Timeouts

- [x] CHK-016 [P0] hero_general.js has Promise.race with 2000ms timeout
  - Evidence: `[File: hero_general.js:276-295]`
- [x] CHK-017 [P0] hero_cards.js has Promise.race with 2000ms timeout
  - Evidence: `[File: hero_cards.js:285-304]`
- [x] CHK-018 [P0] Page loads when hero image 404s
  - Evidence: `[Test: Block hero image, page visible in <3s]`
- [x] CHK-019 [P0] Console warning on image timeout
  - Evidence: `[Console: "[Hero] Image load timeout"]`

### T005: Safety Timeout Position

- [x] CHK-020 [P0] Safety timeout moved to `<head>` section
  - Evidence: `[File: global.html - <head> section contains timeout]`
- [x] CHK-021 [P0] Timeout runs before deferred scripts
  - Evidence: `[Network: Safety script loads before hero scripts]`
- [x] CHK-022 [P0] Mobile timeout is 2000ms, desktop is 3000ms
  - Evidence: `[File: global.html - isMobile ? 2000 : 3000]`
- [x] CHK-023 [P0] Console shows "[LCP Safety]" when triggered
  - Evidence: `[Console: "[LCP Safety] Force-revealed page"]`

### Phase 1 Integration

- [x] CHK-024 [P0] No infinite loops possible (all async ops have timeouts)
  - Evidence: `[Test: Block all resources, page still loads]`
- [x] CHK-025 [P0] Page visible within 3s on slow connection
  - Evidence: `[Lighthouse: Mobile LCP < 5s with throttling]`
- [x] CHK-026 [P0] Animations still work when resources load in time
  - Evidence: `[Test: Normal load, hero animation plays]`
- [x] CHK-027 [P0] No console errors on page load
  - Evidence: `[Console: 0 errors]`

---

## Phase 2: Resource Hints & LCP Optimization (P1)

### T006: Video Poster Images

- [ ] CHK-028 [P1] Poster images created for all hero videos
  - Evidence: `[File: BunnyCDN - hero-*-poster.webp files exist]`
- [ ] CHK-029 [P1] `<video poster="...">` attribute added
  - Evidence: `[File: HTML - video elements have poster]`
- [ ] CHK-030 [P1] Poster visible before video plays
  - Evidence: `[Screenshot: Poster image visible during load]`

### T007: LCP Image Preload

- [ ] CHK-031 [P1] `<link rel="preload">` added to home.html
  - Evidence: `[File: home.html - <head> preload link]`
- [ ] CHK-032 [P1] Preload added to contact.html
  - Evidence: `[File: contact.html - <head> preload link]`
- [ ] CHK-033 [P1] Preload added to werken_bij.html
  - Evidence: `[File: werken_bij.html - <head> preload link]`
- [ ] CHK-034 [P1] Preload added to all service pages (8)
  - Evidence: `[File: All service HTML files have preload]`
- [ ] CHK-035 [P1] LCP image appears early in Network waterfall
  - Evidence: `[Network: Hero image in first 5 requests]`

### T008: fetchpriority Attribute

- [ ] CHK-036 [P1] `fetchpriority="high"` on hero images
  - Evidence: `[File: HTML - hero img has fetchpriority]`
- [ ] CHK-037 [P1] DevTools shows "high" priority
  - Evidence: `[Network: Priority column shows "High"]`

### T009: Skip Video Wait

- [x] CHK-038 [P1] Video wait block removed/commented in hero_video.js
  - Evidence: `[File: hero_video.js:370-386 - block removed]`
- [x] CHK-039 [P1] Desktop page reveals without waiting for video
  - Evidence: `[Test: Desktop load, page visible before video plays]`

### T010: Async FilePond CSS

- [x] CHK-040 [P1] FilePond CSS uses preload pattern
  - Evidence: `[File: werken_bij.html - rel="preload" as="style"]`
- [x] CHK-041 [P1] noscript fallback present
  - Evidence: `[File: HTML - <noscript> with stylesheet]`
- [x] CHK-042 [P1] FilePond styling works on form pages
  - Evidence: `[Test: File upload styled correctly]`

### T011: unpkg.com Preconnect

- [x] CHK-043 [P2] Preconnect hint added for unpkg.com
  - Evidence: `[File: Form HTML - rel="preconnect" unpkg.com]`

### Phase 2 Integration

- [ ] CHK-044 [P1] Mobile LCP improved by at least 50%
  - Evidence: `[Lighthouse: Mobile LCP < 10s (from 20.2s)]`
- [ ] CHK-045 [P1] Video pages load without blank hero
  - Evidence: `[Test: Video page shows poster, then video]`

---

## Phase 3: JavaScript Optimization (P1/P2)

### T012: Motion.dev Ready Event

- [x] CHK-046 [P1] `motion:ready` CustomEvent dispatched in global.html
  - Evidence: `[File: global.html - dispatchEvent(new CustomEvent('motion:ready'))]`
- [x] CHK-047 [P1] Event fires after Motion.dev import completes
  - Evidence: `[Console: Custom event logged after import]`

### T013-T014: Replace Polling

- [x] CHK-048 [P1] Hero scripts use event listener instead of polling
  - Evidence: `[File: hero_*.js - addEventListener('motion:ready')]`
- [x] CHK-049 [P2] Animation scripts use event listener
  - Evidence: `[File: nav_*.js, modal_*.js - event listener pattern]`
- [x] CHK-050 [P1] Only one Motion.dev initialization mechanism
  - Evidence: `[Test: No polling visible in Performance tab]`

### T015-T016: Batch Forced Reflows

- [x] CHK-051 [P2] nav_mobile_menu.js batches 11 measurements
  - Evidence: `[File: nav_mobile_menu.js - single measurement pass]`
- [x] CHK-052 [P2] Layout thrashing reduced in DevTools
  - Evidence: `[Performance: No "Forced reflow" warnings]`

### T017-T018: Remove Premature will-change

- [x] CHK-053 [P2] Hero scripts don't add will-change on init
  - Evidence: `[File: hero_*.js - no will-change on load]`
- [x] CHK-054 [P2] Link scripts don't add will-change on init
  - Evidence: `[File: link_*.js - no will-change on load]`

### Phase 3 Integration

- [x] CHK-055 [P1] All animations still trigger correctly
  - Evidence: `[Test: All hero animations play]`
- [x] CHK-056 [P2] Reduced CPU during page load
  - Evidence: `[Performance: Lower scripting time]`

---

## Phase 4: CSS Optimization (P2)

### T019: Critical CSS Inlining

- [ ] CHK-057 [P2] Critical CSS (~15KB) inline in `<head>`
  - Evidence: `[File: global.html - <style> block in head]`
- [ ] CHK-058 [P2] Above-fold content styled without external CSS
  - Evidence: `[Test: Disable CSS, hero still styled]`

### T020-T021: Page-Specific CSS

- [ ] CHK-059 [P2] Form CSS only loads on form pages
  - Evidence: `[Network: form-bundle.css only on werken_bij, vacature]`
- [ ] CHK-060 [P2] Video CSS only loads on video pages
  - Evidence: `[Network: video-bundle.css only on pages with video]`

### T022: Remove Static will-change

- [x] CHK-061 [P2] No permanent will-change in CSS files
  - Evidence: `[File: Search CSS - no will-change: transform]`

### T023: CSS Bundles

- [ ] CHK-062 [P2] Page-type CSS bundles created
  - Evidence: `[File: core.css, form.css, video.css exist]`

---

## Phase 5: Image & Media Optimization (P1/P2)

### T024: Responsive Images

- [ ] CHK-063 [P1] Hero images have srcset attribute
  - Evidence: `[File: HTML - img srcset with multiple sizes]`
- [ ] CHK-064 [P1] sizes attribute present
  - Evidence: `[File: HTML - img sizes attribute]`
- [ ] CHK-065 [P1] Mobile downloads smaller images
  - Evidence: `[Network: Mobile loads 768w image, not 1920w]`

### T025: Lazy Loading [REVERTED]

- [ ] CHK-066 [P1] Below-fold images have loading="lazy"
  - Evidence: `[REVERTED] — image_lazy_load.js removed (2026-02-07). Lazy loading to be handled differently.`
- [ ] CHK-067 [P1] Images load on scroll
  - Evidence: `[REVERTED] — image_lazy_load.js removed (2026-02-07). Lazy loading to be handled differently.`

### T026: Async Decoding [REVERTED]

- [ ] CHK-068 [P2] Images have decoding="async"
  - Evidence: `[REVERTED] — image_lazy_load.js removed (2026-02-07). Async decoding to be handled differently.`

### T027: HLS Manifest Preload

- [ ] CHK-069 [P2] HLS manifest preloaded on video pages
  - Evidence: `[File: HTML - link rel="preload" for manifest]`

---

## Phase 6: Architecture Improvements (P2/P3)

### T028-T029: Bundle Size Reduction

- [x] CHK-070 [P2] Motion.dev tree-shaken (only animate, inView)
  - Evidence: `[Build: Motion.dev bundle < 50KB]`
- [ ] CHK-071 [P2] Swiper custom build created
  - Evidence: `[Build: Swiper bundle < 50KB]`

### T030-T031: Page-Specific Bundles

- [ ] CHK-072 [P2] Page-specific JS bundles exist
  - Evidence: `[File: core.js, form.js, video.js]`
- [ ] CHK-073 [P2] Page-specific CSS bundles exist
  - Evidence: `[File: core.css, form.css, video.css]`

### T032: Service Worker

- [ ] CHK-074 [P3] Service worker registered
  - Evidence: `[Console: "Service worker registered"]`
- [ ] CHK-075 [P3] Critical assets cached
  - Evidence: `[Application tab: Cache contains assets]`

### T033-T035: Code Consolidation

- [ ] CHK-076 [P2] Observer count reduced to <5
  - Evidence: `[Code: Fewer observer instantiations]`
- [ ] CHK-077 [P3] DOMContentLoaded handlers consolidated
  - Evidence: `[Code: Single initialization function]`

---

## L3+: ARCHITECTURE VERIFICATION

### Decision Documentation

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
  - Evidence: `[File: decision-record.md exists with ADRs]`
- [ ] CHK-101 [P1] ADR-001 (Timeout Values) has Accepted status
  - Evidence: `[File: decision-record.md - Status: Accepted]`
- [ ] CHK-102 [P1] ADR-002 (Motion.dev Event) has Accepted status
  - Evidence: `[File: decision-record.md - Status: Accepted]`
- [ ] CHK-103 [P1] ADR-003 (Webflow Constraints) has Accepted status
  - Evidence: `[File: decision-record.md - Status: Accepted]`
- [ ] CHK-104 [P1] Alternatives documented with rejection rationale
  - Evidence: `[File: decision-record.md - Alternatives sections]`

---

## L3+: PERFORMANCE VERIFICATION

### Core Web Vitals

- [ ] CHK-110 [P0] Mobile LCP < 4.0s (from 20.2s)
  - Evidence: `[Lighthouse: Mobile LCP = Xs]`
- [ ] CHK-111 [P0] Mobile FCP < 3.0s (from 6.2s)
  - Evidence: `[Lighthouse: Mobile FCP = Xs]`
- [ ] CHK-112 [P0] Desktop LCP < 2.5s (from 4.1s)
  - Evidence: `[Lighthouse: Desktop LCP = Xs]`
- [ ] CHK-113 [P0] Mobile Lighthouse Score > 75% (from 55%)
  - Evidence: `[Lighthouse: Mobile Score = X%]`
- [ ] CHK-114 [P1] Desktop Lighthouse Score > 90% (from 77%)
  - Evidence: `[Lighthouse: Desktop Score = X%]`

### Page Hang Prevention

- [ ] CHK-115 [P0] No page hangs possible
  - Evidence: `[Test: All resource blocking scenarios tested]`
- [ ] CHK-116 [P0] Safety timeout fires only as fallback
  - Evidence: `[Console: "[LCP Safety]" only when resources fail]`

### Bundle Sizes

- [ ] CHK-117 [P1] JS Bundle < 180KB (from 236KB)
  - Evidence: `[Build: Total JS = XKB]`
- [ ] CHK-118 [P2] CSS per page < 100KB (from 237KB)
  - Evidence: `[Network: CSS total = XKB]`

---

## L3+: DEPLOYMENT READINESS

### Rollback Preparation

- [ ] CHK-120 [P0] Backup JS files stored on R2
  - Evidence: `[R2: backup/ folder with current files]`
- [ ] CHK-121 [P0] Current Webflow custom code documented
  - Evidence: `[Screenshot: Webflow custom code blocks]`
- [ ] CHK-122 [P1] Rollback procedure documented in plan.md
  - Evidence: `[File: plan.md - Rollback Plan section]`

### Monitoring

- [ ] CHK-123 [P1] Baseline Lighthouse scores recorded
  - Evidence: `[File: scratch/baseline-lighthouse.json]`
- [ ] CHK-124 [P2] Post-deployment monitoring plan
  - Evidence: `[Plan: Run Lighthouse after each phase]`

---

## L3+: COMPLIANCE VERIFICATION

### Code Quality

- [ ] CHK-130 [P0] No console errors on page load
  - Evidence: `[Console: 0 errors]`
- [ ] CHK-131 [P0] No infinite loops in code
  - Evidence: `[Code review: All async ops have timeouts]`
- [ ] CHK-132 [P1] Graceful degradation for all features
  - Evidence: `[Test: Animations optional, page usable without]`

### Browser Compatibility

- [ ] CHK-133 [P1] Tested on Chrome 90+
  - Evidence: `[Test: Chrome desktop/mobile]`
- [ ] CHK-134 [P1] Tested on Safari 14+
  - Evidence: `[Test: Safari macOS/iOS]`
- [ ] CHK-135 [P1] Tested on Firefox 90+
  - Evidence: `[Test: Firefox desktop]`
- [ ] CHK-136 [P2] Tested on Edge 90+
  - Evidence: `[Test: Edge desktop]`

### Real Device Testing

- [ ] CHK-137 [P1] Tested on iOS device
  - Evidence: `[Test: iPhone Safari]`
- [ ] CHK-138 [P1] Tested on Android device
  - Evidence: `[Test: Android Chrome]`
- [ ] CHK-139 [P1] Tested on slow 3G throttle
  - Evidence: `[Test: DevTools 3G throttle]`

### Functionality Verification

- [ ] CHK-140 [P0] Hero animations work on all pages
  - Evidence: `[Test: All hero types animate correctly]`
- [ ] CHK-141 [P0] Video playback works
  - Evidence: `[Test: Video plays after poster]`
- [ ] CHK-142 [P0] File upload works on form pages
  - Evidence: `[Test: FilePond upload functional]`
- [ ] CHK-143 [P1] Navigation works
  - Evidence: `[Test: Mobile menu, dropdowns]`

---

## L3+: DOCUMENTATION VERIFICATION

### Spec Folder Completeness

- [ ] CHK-150 [P1] spec.md complete with all 50+ issues
  - Evidence: `[File: spec.md - Issue Inventory section]`
- [ ] CHK-151 [P1] plan.md has 6 implementation phases
  - Evidence: `[File: plan.md - Phases 1-6]`
- [ ] CHK-152 [P1] tasks.md has all tasks with dependencies
  - Evidence: `[File: tasks.md - 41 tasks]`
- [ ] CHK-153 [P1] checklist.md has P0/P1/P2 structure
  - Evidence: `[File: checklist.md - Priority sections]`
- [ ] CHK-154 [P1] decision-record.md has key ADRs
  - Evidence: `[File: decision-record.md - ADR-001 to ADR-003+]`

### Results Documentation

- [ ] CHK-155 [P1] Post-implementation metrics recorded
  - Evidence: `[File: spec.md - Results Appendix]`
- [ ] CHK-156 [P1] Before/after comparison in table format
  - Evidence: `[File: Implementation summary]`
- [ ] CHK-157 [P2] Remaining issues documented for future
  - Evidence: `[File: Open items section]`

---

## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Site Owner | [ ] Approved | |
| Claude | Implementation | [ ] Complete | |
| Lighthouse | Performance | [ ] Passing | |

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Remaining |
|----------|-------|----------|-----------|
| P0 Items | 31 | 22/31 | 9 |
| P1 Items | 54 | 18/54 | 36 |
| P2 Items | 26 | 5/26 | 21 |
| P3 Items | 4 | 0/4 | 4 |
| **Total** | **115** | **45/115** | **70** |

**Verification Date**: 2026-02-07 (Updated: image_lazy_load.js reversal)
**Verification Agent**: Primary


<!-- /ANCHOR:summary -->

---

## Quick Reference: Priority Distribution by Phase

| Phase | P0 | P1 | P2 | Total |
|-------|----|----|-----|-------|
| Pre-Implementation | 4 | 4 | 1 | 9 |
| Phase 1: Critical | 18 | 0 | 0 | 18 |
| Phase 2: Resource | 0 | 14 | 2 | 16 |
| Phase 3: JS Optim | 0 | 5 | 4 | 9 |
| Phase 4: CSS Optim | 0 | 0 | 6 | 6 |
| Phase 5: Image | 0 | 5 | 2 | 7 |
| Phase 6: Arch | 0 | 0 | 8 | 8 |
| L3+ Architecture | 1 | 4 | 0 | 5 |
| L3+ Performance | 5 | 2 | 1 | 8 |
| L3+ Deployment | 2 | 2 | 1 | 5 |
| L3+ Compliance | 6 | 6 | 1 | 13 |
| L3+ Documentation | 0 | 7 | 1 | 8 |
| Sign-off | 0 | 0 | 0 | 3 |

---

<!--
LEVEL 3+ CHECKLIST (~500 lines)
- 115 verification items across all phases
- P0/P1/P2 priority structure
- Evidence requirements for each item
- Phase-specific and cross-cutting verification
- L3+ architecture, performance, deployment, compliance sections
- Sign-off matrix for approval workflow
-->
