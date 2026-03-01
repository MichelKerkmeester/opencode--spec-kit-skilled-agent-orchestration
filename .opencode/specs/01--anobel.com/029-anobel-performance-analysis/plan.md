---
title: "Implementation Plan: Comprehensive Performance Optimization - anobel.com [031-anobel-performance-analysis/plan]"
description: "This plan addresses 50+ performance issues identified by 10-agent parallel analysis. The implementation is organized into 6 phases, progressing from critical P0 JavaScript bugs ..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "comprehensive"
  - "performance"
  - "optimization"
  - "031"
  - "anobel"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Comprehensive Performance Optimization - anobel.com

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ES Modules), CSS3, HTML5 |
| **Framework** | Webflow (platform-hosted), Motion.dev, HLS.js, Swiper |
| **Storage** | R2 CDN (Cloudflare), BunnyCDN (images/video) |
| **Testing** | Lighthouse CLI, Chrome DevTools, Real Device Testing |
| **Deployment** | Webflow Designer + R2 CDN for custom scripts |

### Overview

This plan addresses **50+ performance issues** identified by 10-agent parallel analysis. The implementation is organized into 6 phases, progressing from critical P0 JavaScript bugs that cause 20-second mobile LCP, through resource optimization, to architectural improvements. The primary goal is achieving Core Web Vitals compliance: Mobile LCP <4s (from 20.2s), Mobile Score >75% (from 55%).

**Key Technical Approach**:
1. Fix JavaScript timing bugs that defeat existing safety mechanisms
2. Implement browser resource hints (preload, fetchpriority)
3. Optimize Motion.dev initialization pattern
4. Add responsive images and lazy loading
5. Code-split CSS and JS by page type


<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md complete)
- [x] Success criteria measurable (9 success criteria defined)
- [x] Dependencies identified (Webflow constraints, R2 CDN)
- [x] All 50+ issues catalogued with priority (Issue Inventory complete)
- [x] 10-agent research complete with findings

### Definition of Done
- [ ] All P0 requirements met (REQ-001 to REQ-005)
- [ ] All P1 requirements met or deferred with approval (REQ-006 to REQ-014)
- [ ] Mobile LCP <4.0s (from 20.2s)
- [ ] Mobile Lighthouse Score >75% (from 55%)
- [ ] Desktop LCP <2.5s (from 4.1s)
- [ ] No page hangs possible (all async ops have timeouts)
- [ ] All changes tested on real mobile device
- [ ] Documentation updated (spec/plan/tasks/checklist)


<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
**Static Site + CDN-Hosted Custom Code**

Webflow generates static HTML/CSS, while custom JavaScript is hosted on Cloudflare R2. The architecture operates within Webflow platform constraints.

### Key Components

| Component | Purpose | Modification Level |
|-----------|---------|-------------------|
| **Webflow Core** | jQuery (87KB), Webflow.js (70KB), main CSS (339KB) | CANNOT MODIFY |
| **Custom JavaScript** | 48 files in `/src/2_javascript/` (236KB minified) | FULL CONTROL |
| **Custom CSS** | 47 files in `/src/1_css/` (237KB) | FULL CONTROL |
| **Page HTML** | 18 pages in `/src/0_html/` | PARTIAL (custom code areas) |
| **R2 CDN** | Script hosting, versioned URLs | FULL CONTROL |
| **BunnyCDN** | Image/video hosting | FULL CONTROL |

### Data Flow

```
Browser Request
    │
    ├──► Webflow CDN (HTML + platform assets)
    │     ├── jQuery (blocking)
    │     ├── Webflow.js (blocking)
    │     └── Main CSS (blocking)
    │
    ├──► R2 CDN (custom scripts - defer)
    │     ├── Motion.dev (ES module)
    │     ├── Hero scripts
    │     └── Page scripts
    │
    └──► BunnyCDN (media)
          ├── Hero images
          └── Video + HLS manifests
```

### Critical Path Analysis

```
Page Load
    │
    ├── 0ms: HTML parsing begins
    ├── 100ms: Webflow CSS (339KB blocking)
    ├── 200ms: jQuery + Webflow.js (157KB blocking)
    │
    ├── 300ms: Custom CSS (237KB - render-blocking)
    │   └── Page hidden via opacity:0
    │
    ├── 400ms: Motion.dev import (ES module)
    │   └── Triggers hero script initialization
    │
    ├── [PROBLEM] Hero scripts wait:
    │   ├── Motion.dev: up to 10s (hero_general.js)
    │   ├── Motion.dev: INFINITE (hero_webshop.js)
    │   ├── Images: INFINITE (no timeout)
    │   └── Video: 3s on desktop
    │
    └── [GOAL] Page visible via .page-ready class
        └── Safety timeout: 3s (in wrong position)
```


<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Critical Path Fixes (P0)
**Goal**: Eliminate JavaScript bugs causing page visibility delays
**Duration**: 2-4 hours
**Priority**: BLOCKER - Must complete first

| Task | File | Issue ID | Change |
|------|------|----------|--------|
| T001 | hero_webshop.js | A-01 | Add 1000ms timeout to infinite Motion.dev loop |
| T002 | hero_general.js | A-02 | Reduce Motion.dev timeout 10000→1000ms |
| T003 | hero_general.js | A-03 | Add 2000ms timeout to image promises |
| T004 | hero_cards.js | A-03 | Add 2000ms timeout to image promises |
| T005 | global.html | A-04 | Move safety timeout to `<head>` |

**Verification**:
- [ ] Page visible within 3s on throttled connection
- [ ] No infinite loops possible
- [ ] Console shows timeout warnings when triggered
- [ ] Animations still work when resources load in time


<!-- /ANCHOR:phases -->

---

### Phase 2: Resource Hints & LCP Optimization (P1)
**Goal**: Enable browser to prioritize critical resources
**Duration**: 2-4 hours
**Dependencies**: Phase 1 complete

| Task | File | Issue ID | Change |
|------|------|----------|--------|
| T006 | All video pages | A-06, D-04 | Add video poster images |
| T007 | All page HTML | A-07, F-01 | Add LCP image preload per page |
| T008 | All page HTML | F-02 | Add fetchpriority="high" to hero images |
| T009 | hero_video.js | A-05, D-05 | Skip video wait on all devices |
| T010 | Form pages | C-08, F-05 | Convert FilePond CSS to async loading |
| T011 | Form pages | E-05 | Add preconnect to unpkg.com |

**Verification**:
- [ ] Video poster visible before video plays
- [ ] LCP image appears early in Network waterfall
- [ ] Desktop no longer waits for video
- [ ] FilePond still works on form pages

---

### Phase 3: JavaScript Optimization (P1/P2)
**Goal**: Eliminate redundant work and reduce bundle size
**Duration**: 4-6 hours
**Dependencies**: Phase 1 complete (Phase 2 can run in parallel)

| Task | File | Issue ID | Change |
|------|------|----------|--------|
| T012 | global.html | B-01 | Add centralized Motion.dev ready event |
| T013 | All hero scripts | B-01 | Replace 17 polling loops with event listener |
| T014 | All animation scripts | B-01 | Replace polling with event listener |
| T015 | nav_mobile_menu.js | B-02 | Batch 11 forced reflows into single pass |
| T016 | Various nav scripts | B-02 | Batch remaining 53 forced reflows |
| T017 | Hero scripts | B-03 | Remove premature will-change (40+) |
| T018 | Link scripts | B-03 | Remove premature will-change |

**Verification**:
- [ ] Only one Motion.dev loading mechanism
- [ ] All animations still trigger correctly
- [ ] Reduced layout thrashing in DevTools
- [ ] No premature will-change on page load

---

### Phase 4: CSS Optimization (P2)
**Goal**: Reduce CSS payload and remove render-blocking
**Duration**: 4-8 hours
**Dependencies**: Phase 1-2 complete

| Task | File | Issue ID | Change |
|------|------|----------|--------|
| T019 | global.html | C-01 | Extract and inline critical CSS (~15KB) |
| T020 | Form pages | C-03 | Load form CSS only on form pages (53KB) |
| T021 | Video pages | C-04 | Load video CSS only on video pages (17KB) |
| T022 | All CSS | C-05 | Remove 9 static will-change declarations |
| T023 | All CSS | C-06 | Create page-type CSS bundles |

**Verification**:
- [ ] Above-fold content styled without external CSS
- [ ] Form CSS only loads on 3 form pages
- [ ] Video CSS only loads on 6 video pages
- [ ] No static will-change in stylesheets

---

### Phase 5: Image & Media Optimization (P1/P2)
**Goal**: Optimize media loading for mobile devices
**Duration**: 2-4 hours
**Dependencies**: Phase 2 complete (needs poster images created)

| Task | File | Issue ID | Change |
|------|------|----------|--------|
| T024 | All hero images | D-01 | Add srcset/sizes for responsive images |
| T025 | All below-fold images | D-02 | Add loading="lazy" attribute |
| T026 | All hero images | D-07 | Add decoding="async" attribute |
| T027 | Video pages | D-06 | Preload HLS manifest on video pages |

**Verification**:
- [ ] Mobile downloads smaller hero images
- [ ] Below-fold images load on scroll
- [ ] Image decoding doesn't block main thread
- [ ] HLS manifest fetched early on video pages

---

### Phase 6: Architecture Improvements (P2/P3)
**Goal**: Long-term performance architecture
**Duration**: 8-16 hours
**Dependencies**: Phase 1-5 complete

| Task | File | Issue ID | Change |
|------|------|----------|--------|
| T028 | Build system | B-04 | Tree-shake Motion.dev (18→2 functions) |
| T029 | Build system | B-05 | Custom Swiper build (30% usage) |
| T030 | Page HTML | B-06, G-01 | Page-specific JS bundles |
| T031 | Page HTML | G-02 | Page-specific CSS bundles |
| T032 | global.html | G-03 | Implement service worker caching |
| T033 | Various | G-04 | Consolidate 16 observers to <5 |
| T034 | Various | B-10 | Bundle 48 JS files into page bundles |
| T035 | Various | B-07 | Consolidate 36 DOMContentLoaded handlers |

**Verification**:
- [ ] Motion.dev bundle <50KB (from 90KB)
- [ ] Swiper bundle <50KB (from 150KB)
- [ ] Form scripts only on form pages
- [ ] Service worker caches critical assets
- [ ] Observer count reduced significantly

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Frequency |
|-----------|-------|-------|-----------|
| **Lighthouse Mobile** | LCP, FCP, Score | Lighthouse CLI | Per-phase |
| **Lighthouse Desktop** | LCP, FCP, Score | Lighthouse CLI | Per-phase |
| **Real Device** | iOS Safari, Android Chrome | Physical devices | Phase 2+, Final |
| **Throttled Network** | Slow 3G emulation | Chrome DevTools | Per-phase |
| **Console Errors** | Zero errors on load | Browser console | Every change |
| **Functionality** | Animations, video, forms | Manual testing | Per-phase |

### Test Commands

```bash
# Mobile Lighthouse
npx lighthouse https://anobel.com/nl/ --emulated-form-factor=mobile --output=json --output-path=./scratch/lighthouse-mobile.json

# Desktop Lighthouse
npx lighthouse https://anobel.com/nl/ --emulated-form-factor=desktop --output=json --output-path=./scratch/lighthouse-desktop.json

# Performance trace
npx lighthouse https://anobel.com/nl/ --gather-mode --output-path=./scratch/trace.json
```


<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Webflow Designer | External | Green | Cannot update HTML custom code |
| R2 CDN | External | Green | Cannot deploy JS changes |
| BunnyCDN | External | Green | Cannot add poster images |
| Motion.dev CDN | External | Green | Animation library unavailable |
| TypeKit | External | Yellow | Font blocking (existing issue) |
| ConsentPro | External | Yellow | Legal review needed before changes |

### Webflow Platform Constraints

| Constraint | Impact | Workaround |
|------------|--------|------------|
| Cannot modify jQuery | 87KB blocking | None - accept |
| Cannot modify Webflow.js | 70KB blocking | None - accept |
| Cannot modify main CSS | 339KB blocking | Add custom CSS |
| Limited `<head>` access | Safety timeout position | Use custom code block |
| No build process | Manual minification | Local build + upload |


<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any of: page hangs, animations broken, forms not working, video not playing
- **Procedure**: See Enhanced Rollback section below

### Quick Rollback Commands

```bash
# Revert to previous R2 version (if versioned)
# Or upload backup files
aws s3 cp s3://anobel-scripts/backup/ s3://anobel-scripts/current/ --recursive

# In Webflow: revert custom code blocks to previous version
# Publish site
```


<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
                        ┌─────────────────────────────────┐
                        │    Phase 1: Critical Fixes      │
                        │    (MUST complete first)        │
                        └───────────────┬─────────────────┘
                                        │
              ┌─────────────────────────┼─────────────────────────┐
              │                         │                         │
              ▼                         ▼                         ▼
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│  Phase 2: Resource  │   │  Phase 3: JS Optim  │   │  Phase 4: CSS Optim │
│  Hints & LCP        │   │  (can parallelize)  │   │  (can parallelize)  │
└──────────┬──────────┘   └──────────┬──────────┘   └──────────┬──────────┘
           │                         │                         │
           │                         ▼                         │
           │              ┌─────────────────────┐              │
           └─────────────►│  Phase 5: Image/    │◄─────────────┘
                          │  Media Optimization │
                          └──────────┬──────────┘
                                     │
                                     ▼
                          ┌─────────────────────┐
                          │  Phase 6: Arch      │
                          │  Improvements       │
                          └─────────────────────┘
```

| Phase | Depends On | Blocks | Parallelizable With |
|-------|------------|--------|---------------------|
| 1 - Critical Fixes | None | All others | None |
| 2 - Resource Hints | Phase 1 | Phase 5 | Phase 3, 4 |
| 3 - JS Optimization | Phase 1 | Phase 6 | Phase 2, 4 |
| 4 - CSS Optimization | Phase 1 | Phase 6 | Phase 2, 3 |
| 5 - Image/Media | Phase 2 | Phase 6 | Phase 3, 4 |
| 6 - Architecture | Phase 1-5 | None | None |


<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Issues Addressed | Estimated Effort | Cumulative |
|-------|------------|------------------|------------------|------------|
| 1 - Critical Fixes | High | 5 P0 issues | 2-4 hours | 2-4 hours |
| 2 - Resource Hints | Medium | 8 P1 issues | 2-4 hours | 4-8 hours |
| 3 - JS Optimization | High | 7 P1/P2 issues | 4-6 hours | 8-14 hours |
| 4 - CSS Optimization | Medium | 5 P2 issues | 4-8 hours | 12-22 hours |
| 5 - Image/Media | Low | 4 P1/P2 issues | 2-4 hours | 14-26 hours |
| 6 - Architecture | Very High | 8 P2/P3 issues | 8-16 hours | 22-42 hours |
| **Total** | | **37 issues** | **22-42 hours** | |

**Note**: Phases 2-4 can run in parallel, reducing total elapsed time to ~18-30 hours.


<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup current JS files to R2 backup folder
- [ ] Document current Webflow custom code (screenshots)
- [ ] Note current Lighthouse scores as baseline
- [ ] Test rollback procedure on staging (if available)

### Rollback Procedure

1. **Immediate** (< 5 min): Revert Webflow custom code to previous version, publish
2. **JS Rollback** (< 10 min): Upload backup JS files to R2, update version numbers
3. **Verify** (< 5 min): Test page load, hero animation, video, forms
4. **Notify**: Log issue in decision-record.md

### Rollback by Phase

| Phase | Rollback Procedure |
|-------|-------------------|
| Phase 1 | Restore backup hero_*.js files, revert global.html |
| Phase 2 | Remove preload/fetchpriority, remove poster attributes |
| Phase 3 | Restore original polling pattern, remove motion:ready |
| Phase 4 | Remove inline CSS, restore full CSS bundle |
| Phase 5 | Remove srcset/lazy, restore single image sources |
| Phase 6 | Restore original bundle structure, disable SW |

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (static site)


<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PHASE 1: CRITICAL FIXES                            │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │    T001      │  │    T002      │  │    T003      │  │    T004      │    │
│  │ webshop.js   │  │ general.js   │  │ general.js   │  │ cards.js     │    │
│  │ Motion loop  │  │ 10s→1s       │  │ img timeout  │  │ img timeout  │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                 │                 │            │
│         └────────────────┬┴─────────────────┴─────────────────┘            │
│                          │                                                  │
│                          ▼                                                  │
│                  ┌──────────────┐                                          │
│                  │    T005      │                                          │
│                  │ global.html  │                                          │
│                  │ safety→head  │                                          │
│                  └──────┬───────┘                                          │
└─────────────────────────┼───────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┬─────────────────┐
        │                 │                 │                 │
        ▼                 ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│   PHASE 2     │ │   PHASE 3     │ │   PHASE 4     │ │   PHASE 5     │
│ Resource Hints│ │ JS Optimize   │ │ CSS Optimize  │ │ Image/Media   │
│               │ │               │ │               │ │               │
│ T006-T011     │ │ T012-T018     │ │ T019-T023     │ │ T024-T027     │
│ (6 tasks)     │ │ (7 tasks)     │ │ (5 tasks)     │ │ (4 tasks)     │
└───────┬───────┘ └───────┬───────┘ └───────┬───────┘ └───────┬───────┘
        │                 │                 │                 │
        └─────────────────┴────────┬────────┴─────────────────┘
                                   │
                                   ▼
                          ┌───────────────┐
                          │   PHASE 6     │
                          │ Architecture  │
                          │               │
                          │ T028-T035     │
                          │ (8 tasks)     │
                          └───────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| T001 (webshop loop) | None | Safe Motion.dev wait | T012-T014 |
| T002 (general timeout) | None | 1s max wait | T012-T014 |
| T003-T004 (img timeout) | None | 2s max image wait | Phase 5 |
| T005 (safety head) | None | Guaranteed 3s reveal | All phases |
| T006 (video poster) | None | Poster images | T027 |
| T007-T008 (LCP hints) | T005 | Resource hints | T024-T026 |
| T012 (motion:ready) | T001-T002 | Single event pattern | T013-T014 |
| T019 (critical CSS) | Phase 1 | Inline CSS | T020-T023 |
| T028-T035 (arch) | Phase 1-5 | Optimized bundles | None |


<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The critical path determines minimum implementation time:

1. **T001-T005: Critical Fixes** - 2-4 hours - **CRITICAL**
2. **T006-T011: Resource Hints** - 2-4 hours - **CRITICAL** (for LCP target)
3. **T012-T014: Motion.dev Event** - 2-3 hours - **CRITICAL** (for reliability)
4. **Phase 4-5 Testing** - 1-2 hours - **CRITICAL**
5. **Final Lighthouse Validation** - 1 hour - **CRITICAL**

**Total Critical Path**: 8-14 hours

**Parallel Opportunities**:
- Phase 2 and Phase 3 can run simultaneously after Phase 1
- Phase 3 and Phase 4 can run simultaneously
- Phase 5 depends on Phase 2 poster images but other tasks are parallel
- Image optimization (T024-T026) can run parallel to JS/CSS optimization


<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| **M1** | Critical Bugs Fixed | No infinite loops, safety timeout in head | Phase 1 complete |
| **M2** | Resource Hints Added | LCP preload on all pages, video posters | Phase 2 complete |
| **M3** | Mobile LCP <8s | 60% improvement from baseline | After Phase 2 |
| **M4** | Motion.dev Optimized | Single event pattern, no polling | Phase 3 complete |
| **M5** | Mobile LCP <4s | Target achieved | After Phase 3-5 |
| **M6** | Mobile Score >75% | Core Web Vitals passing | After Phase 5 |
| **M7** | Architecture Complete | Page-specific bundles, SW caching | Phase 6 complete |
| **M8** | Desktop Score >90% | Stretch goal achieved | Final |


<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:architecture -->
## L3: ARCHITECTURE DECISION RECORDS

### ADR-001: Timeout Value Selection

**Status**: Accepted

**Context**: Hero scripts have timeouts ranging from none (infinite) to 10 seconds. Safety timeout is 3 seconds but runs too late.

**Decision**: Standardize on 1s for Motion.dev, 2s for images, 3s for safety (mobile: 2s)

**Rationale**:
- 1s Motion.dev: Library should load in <500ms on 3G; 1s is generous
- 2s images: Hero images should preload; 2s catches failures
- 3s safety: Final fallback; matches Core Web Vitals guidance

**Consequences**:
- Positive: Page visible in <3s guaranteed
- Negative: Fast animations may complete after timeout on slow connections
- Mitigation: CSS provides acceptable fallback state

**See**: `decision-record.md` ADR-001 for full details


<!-- /ANCHOR:architecture -->

---

### ADR-002: Motion.dev Ready Event Pattern

**Status**: Accepted

**Context**: 17 scripts poll for Motion.dev availability separately, causing races and wasted CPU.

**Decision**: Single `motion:ready` CustomEvent dispatched after Motion.dev loads.

**Rationale**:
- Event-driven: No polling, no CPU waste
- Single source of truth: One check, one event
- Backwards compatible: Fallback timeout still applies

**Consequences**:
- Positive: Eliminates 17 polling loops
- Positive: Reliable initialization order
- Negative: Requires updating all 17 scripts
- Mitigation: Phase rollout, script-by-script

**See**: `decision-record.md` ADR-002 for full details

---

### ADR-003: Webflow Constraint Acceptance

**Status**: Accepted

**Context**: jQuery (87KB), Webflow.js (70KB), and main CSS (339KB) are blocking resources we cannot modify.

**Decision**: Accept these constraints and optimize only custom code.

**Rationale**:
- Platform lock-in: Removing jQuery breaks Webflow functionality
- Diminishing returns: 500KB saved vs full Webflow rewrite
- Risk: Custom Webflow.js would break interactions

**Consequences**:
- Positive: Focus optimization effort on controllable resources
- Negative: ~500KB blocking payload is permanent
- Mitigation: Optimize everything else aggressively

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation (Phase 1)
**Files**: hero_webshop.js, hero_general.js, hero_cards.js, global.html
**Duration**: ~2-4 hours
**Agent**: Primary
**Execution**: Sequential - each file depends on understanding the pattern

**Pre-conditions**:
1. Read spec.md sections 1-3 for context
2. Read plan.md Phase 1 for specific changes
3. Verify understanding of timeout pattern

### Tier 2: Parallel Execution (Phase 2-4)

| Agent | Focus | Files | Duration |
|-------|-------|-------|----------|
| **Resource Agent** | Phase 2: LCP hints | All page HTML, hero_video.js | ~2-4h |
| **JS Agent** | Phase 3: Motion.dev | All hero scripts, nav scripts | ~4-6h |
| **CSS Agent** | Phase 4: CSS optim | All CSS files, global.html | ~4-8h |

**Duration**: ~4-8 hours (parallel execution)
**Coordination**: SYNC at phase boundaries

### Tier 3: Integration (Phase 5-6)
**Agent**: Primary
**Task**: Image optimization, architecture changes
**Duration**: ~10-20 hours

### Tier 4: Verification
**Agent**: Primary
**Task**: Lighthouse testing, real device testing, documentation
**Duration**: ~2-4 hours


<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| **W-A** | Critical Fixes | Primary | hero_*.js, global.html | Active |
| **W-B** | Resource Hints | Agent 1 | All page HTML | Blocked on W-A |
| **W-C** | JS Optimization | Agent 2 | All JS files | Blocked on W-A |
| **W-D** | CSS Optimization | Agent 3 | All CSS files | Blocked on W-A |
| **W-E** | Image/Media | Primary | HTML, CDN | Blocked on W-B |
| **W-F** | Architecture | Primary | Build system | Blocked on W-A-E |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-A complete | All | Begin parallel work |
| SYNC-002 | W-B, W-C, W-D complete | All | Integration test |
| SYNC-003 | W-E complete | All | Final Lighthouse |
| SYNC-004 | All complete | All | Documentation update |

### File Ownership Rules

| Workstream | Owns | Shared With |
|------------|------|-------------|
| W-A | hero_webshop.js, hero_cards.js | W-C |
| W-A | hero_general.js | W-C |
| W-A, W-B | global.html | W-C, W-D |
| W-B | Page HTML files | W-E |
| W-C | Nav scripts, modal scripts | None |
| W-D | All CSS files | None |
| W-E | CDN assets | None |
| W-F | Build config | All |

**Conflict Resolution**: Primary agent resolves conflicts at SYNC points.


<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per-Task**: Update tasks.md with status
- **Per-Phase**: Run Lighthouse, update checklist.md
- **Blockers**: Immediate escalation to user

### Status Reporting Format

```markdown

<!-- /ANCHOR:communication -->

## Status Update - [TIMESTAMP]
- **Phase**: [Current phase]
- **Workstream**: [W-A/B/C/D/E/F]
- **Task**: T### - [Description]
- **Status**: [IN_PROGRESS | COMPLETED | BLOCKED]
- **Lighthouse**: Mobile LCP: Xs, Score: X%
- **Evidence**: [Link to file/test/screenshot]
- **Blockers**: [None | Description]
- **Next**: T### - [Next task]
```

### Escalation Path
1. **Technical blockers** → Document in decision-record.md, continue with workaround
2. **Webflow constraints** → Document limitation, optimize alternative
3. **Performance not improving** → Run trace analysis, identify new bottleneck

### Decision Logging
All significant decisions logged in `decision-record.md` Session Decision Log with:
- Timestamp
- Gate/Decision point
- Decision made
- Confidence level
- Evidence/rationale

---

## REVISION HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-01 | Claude Opus | Initial 4-phase plan |
| 2.0 | 2025-02-01 | Claude | Level 3+ upgrade: 6 phases, AI Framework, workstreams |

---

<!--
LEVEL 3+ PLAN (~600 lines)
- Core + L2 + L3 + L3+ addendums
- 6 implementation phases covering all 50+ issues
- AI execution framework with 4 tiers
- Workstream coordination for parallel execution
- Full dependency graphs and critical path analysis
- 8 milestones with measurable criteria
- 3 inline ADRs with references to decision-record.md
-->
