---
title: "Tasks: Comprehensive Performance Optimization - anobel.com [031-anobel-performance-analysis/tasks]"
description: "Task Format: T### [Notation] Description (file path) — Issue ID"
trigger_phrases:
  - "tasks"
  - "comprehensive"
  - "performance"
  - "optimization"
  - "anobel"
  - "031"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Comprehensive Performance Optimization - anobel.com

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3plus-govern | v2.0 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable (can run with other [P] tasks in same phase) |
| `[B]` | Blocked (waiting on dependency) |
| `[S]` | Sequential (must complete before next task) |

**Task Format**: `T### [Notation] Description (file path) — Issue ID`

**Priority Legend**: P0 = Blocker, P1 = Required, P2 = Optional, P3 = Future


<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Critical Path Fixes (P0)

**Workstream**: W-A (Primary)
**Goal**: Fix JavaScript bugs causing infinite waits and defeating safety timeout
**Duration**: 2-4 hours
**Dependencies**: None

### T001-T005: Critical Bug Fixes

| Task | Status | Description | File | Issue | Priority |
|------|--------|-------------|------|-------|----------|
| T001 | [x] [S] | Add 1000ms timeout to infinite Motion.dev polling loop | `hero_webshop.js:127-145` | A-01 | P0 |
| T002 | [x] [P] | Reduce Motion.dev timeout from 10000ms to 1000ms | `hero_general.js:114` | A-02 | P0 |
| T003 | [x] [P] | Add 2000ms timeout to image loading promises | `hero_general.js:276-292` | A-03 | P0 |
| T004 | [x] [P] | Add 2000ms timeout to image loading promises | `hero_cards.js:285-300` | A-03 | P0 |
| T005 | [x] [S] | Move safety timeout to `<head>` + mobile detection | `global.html:93-107` | A-04 | P0 |

### Task Details

#### T001: Fix hero_webshop.js Infinite Loop
**File**: `src/2_javascript/hero/hero_webshop.js`
**Lines**: ~127-138
**Issue**: A-01 - Infinite Motion.dev polling loop

```javascript
// BEFORE: Infinite loop if Motion.dev never loads
const check_motion = () => {
  if (window.Motion && typeof window.Motion.animate === 'function') {
    resolve();
  } else {
    setTimeout(check_motion, INIT_DELAY_MS); // Loops forever!
  }
};
check_motion();

// AFTER: Add 1000ms maximum timeout
const motion_timeout = setTimeout(() => {
  console.warn('[Hero Webshop] Motion.dev timeout - proceeding without animations');
  resolve();
}, 1000);

const check_motion = () => {
  if (window.Motion && typeof window.Motion.animate === 'function') {
    clearTimeout(motion_timeout);
    resolve();
  } else {
    setTimeout(check_motion, INIT_DELAY_MS);
  }
};
check_motion();
```

**Verification**:
- [ ] Block Motion.dev in Network tab, page still loads in <2s
- [ ] Console shows warning when timeout fires
- [ ] Animations work normally when Motion.dev loads


<!-- /ANCHOR:phase-1 -->

---

#### T002: Reduce hero_general.js Motion Timeout
**File**: `src/2_javascript/hero/hero_general.js`
**Lines**: ~302-306
**Issue**: A-02 - 10-second timeout defeats 3-second safety

```javascript
// BEFORE
setTimeout(() => finish('timeout'), 10000);

// AFTER
setTimeout(() => finish('timeout'), 1000);
```

**Verification**:
- [ ] Page reveals within 1.5s even with slow Motion.dev
- [ ] Console logs show 'timeout' reason when triggered

---

#### T003: Add Image Timeout to hero_general.js
**File**: `src/2_javascript/hero/hero_general.js`
**Lines**: ~276-286
**Issue**: A-03 - No image loading timeout

```javascript
// BEFORE: Waits forever for images
promises.push(
  new Promise((resolve) => {
    img.addEventListener('load', resolve, { once: true });
    img.addEventListener('error', resolve, { once: true });
  }),
);

// AFTER: Maximum 2000ms wait
promises.push(
  Promise.race([
    new Promise((resolve) => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    }),
    new Promise(resolve => setTimeout(() => {
      console.warn('[Hero General] Image load timeout - proceeding');
      resolve();
    }, 2000))
  ])
);
```

**Verification**:
- [ ] Block hero image in Network tab, page still loads
- [ ] Console shows warning when timeout fires

---

#### T004: Add Image Timeout to hero_cards.js
**File**: `src/2_javascript/hero/hero_cards.js`
**Lines**: ~285-294
**Issue**: A-03 - No image loading timeout

Same pattern as T003.

**Verification**:
- [ ] Block hero image in Network tab, page still loads
- [ ] Console shows warning when timeout fires

---

#### T005: Move Safety Timeout to Head
**File**: `src/0_html/global.html`
**Lines**: Currently ~83-92 (in body), move to `<head>`
**Issue**: A-04 - Safety timeout runs too late

```html
<!-- Move to <head> section, BEFORE any deferred scripts -->
<script>
  // LCP Safety Timeout - Force page visible after timeout
  (function() {
    var isMobile = window.innerWidth < 992;
    var timeout = isMobile ? 2000 : 3000;
    
    setTimeout(function() {
      var pw = document.querySelector('.page--wrapper, [data-target="page-wrapper"]');
      if (pw && !pw.classList.contains('page-ready')) {
        pw.classList.add('page-ready');
        console.warn('[LCP Safety] Force-revealed page after ' + timeout + 'ms timeout');
      }
    }, timeout);
  })();
</script>
```

**Verification**:
- [ ] Safety timeout fires before any other scripts on slow connection
- [ ] Console shows "[LCP Safety]" message when triggered
- [ ] Page visible within 3s even if all resources fail

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Resource Hints & LCP Optimization (P1)

**Workstream**: W-B (Resource Agent)
**Goal**: Enable browser to prioritize critical resources
**Duration**: 2-4 hours
**Dependencies**: Phase 1 complete

### T006-T011: Resource Optimization

| Task | Status | Description | File | Issue | Priority |
|------|--------|-------------|------|-------|----------|
| T006 | [B] [P] | Add video poster images to all video pages | All video HTML | A-06, D-04 | P1 |
| T007 | [B] [P] | Add LCP image preload to each page | All page HTML | A-07, F-01 | P1 |
| T008 | [B] [P] | Add fetchpriority="high" to hero images | All page HTML | F-02, D-03 | P1 |
| T009 | [x] [S] | Skip video wait on ALL devices (not just mobile) | `hero_video.js:369-371` | A-05, D-05 | P1 |
| T010 | [x] [P] | Convert FilePond CSS to async loading | `werken_bij.html`, `vacature.html` | C-08, F-05 | P1 |
| T011 | [x] [P] | Add preconnect to unpkg.com for FilePond | Form page HTML | E-05 | P2 |

### Task Details

#### T006: Add Video Poster Images
**Files**: All pages with hero video (home, about, services)
**Issue**: A-06, D-04 - Blank hero during video load

1. Extract first frame from each hero video
2. Convert to WebP format (quality 80)
3. Upload to BunnyCDN
4. Add poster attribute to video elements

```html
<video poster="https://anobel-zn.b-cdn.net/hero-home-poster.webp" ...>
```

**Poster images needed**:
- [ ] home-poster.webp
- [ ] about-poster.webp (if applicable)
- [ ] services-poster.webp (if applicable)


<!-- /ANCHOR:phase-2 -->

---

#### T007: Add LCP Image Preload
**Files**: All 18 page HTML files
**Issue**: A-07, F-01 - No LCP preload hints

Add to each page's `<head>`:

```html
<link rel="preload" 
  href="https://anobel-zn.b-cdn.net/[page-specific-hero].webp" 
  as="image" 
  type="image/webp"
  fetchpriority="high">
```

**Pages to update**:
- [ ] home.html
- [ ] contact.html
- [ ] werken_bij.html
- [ ] vacature.html
- [ ] blog.html
- [ ] All service pages (8)
- [ ] Other pages (4)

---

#### T008: Add fetchpriority to Hero Images
**Files**: All page HTML or hero components
**Issue**: F-02, D-03 - No priority hints

```html
<img fetchpriority="high" src="..." alt="...">
```

**Note**: Only apply to above-the-fold hero images, not all images.

---

#### T009: Skip Video Wait on All Devices
**File**: `src/2_javascript/hero/hero_video.js`
**Lines**: ~370-386
**Issue**: A-05, D-05 - Desktop waits 3s for video

```javascript
// BEFORE: Desktop waits for video loadeddata
if (!is_mobile) {
  promises.push(new Promise(resolve => {
    video.addEventListener('loadeddata', resolve);
  }));
}

// AFTER: Remove entire block - video plays asynchronously
// Video will play when ready, doesn't block page visibility
// (Comment out or delete the block)
```

---

#### T010: Async FilePond CSS
**Files**: `werken_bij.html`, `vacature.html`, any other form pages
**Issue**: C-08, F-05 - FilePond CSS blocking

```html
<!-- BEFORE -->
<link href="https://unpkg.com/filepond@4.30.4/dist/filepond.min.css" rel="stylesheet">

<!-- AFTER -->
<link rel="preload" 
  href="https://unpkg.com/filepond@4.30.4/dist/filepond.min.css" 
  as="style" 
  onload="this.rel='stylesheet'">
<noscript>
  <link rel="stylesheet" href="https://unpkg.com/filepond@4.30.4/dist/filepond.min.css">
</noscript>
```

---

#### T011: Add preconnect to unpkg.com
**Files**: Form pages
**Issue**: E-05 - FilePond latency

```html
<link rel="preconnect" href="https://unpkg.com" crossorigin>
```

---

<!-- ANCHOR:phase-3 -->
## Phase 3: JavaScript Optimization (P1/P2)

**Workstream**: W-C (JS Agent)
**Goal**: Eliminate redundant polling and reduce CPU waste
**Duration**: 4-6 hours
**Dependencies**: Phase 1 complete (can run parallel with Phase 2, 4)

### T012-T018: JS Optimization

| Task | Status | Description | File | Issue | Priority |
|------|--------|-------------|------|-------|----------|
| T012 | [x] [S] | Add centralized Motion.dev ready event | `global.html:127-128` | B-01 | P1 |
| T013 | [x] [P] | Replace polling with event listener in hero scripts | All hero_*.js | B-01 | P1 |
| T014 | [x] [P] | Replace polling with event listener in animation scripts | nav_*, modal_*.js | B-01 | P1 |
| T015 | [x] [P] | Batch 11 forced reflows in nav_mobile_menu.js | `nav_mobile_menu.js:514-581` | B-02 | P2 |
| T016 | [~] [P] | Batch remaining forced reflows (already optimized) | Various nav scripts | B-02 | P2 |
| T017 | [x] [P] | Remove premature will-change from hero scripts | All hero_*.js | B-03 | P2 |
| T018 | [x] [P] | Remove premature will-change from link scripts | link_hero.js | B-03 | P2 |

### Task Details

#### T012: Add Centralized Motion.dev Ready Event
**File**: `src/0_html/global.html`
**Issue**: B-01 - 17 parallel polling loops

Add after Motion.dev import:

```javascript
<script type="module">
  const { animate, scroll, inView, hover, press, ... } 
    = await import("https://cdn.jsdelivr.net/npm/motion@12.15.0/+esm")
  window.Motion = { animate, scroll, inView, hover, press, ... }
  
  // ADD THIS: Dispatch ready event for all listeners
  window.dispatchEvent(new CustomEvent('motion:ready'));
</script>
```


<!-- /ANCHOR:phase-3 -->

---

#### T013: Replace Polling in Hero Scripts
**Files**: `hero_webshop.js`, `hero_general.js`, `hero_cards.js`, `hero_video.js`, etc.
**Issue**: B-01 - Redundant polling

Replace each polling pattern:

```javascript
// BEFORE (in each script)
const check_motion = () => {
  if (window.Motion && typeof window.Motion.animate === 'function') {
    init_hero();
  } else {
    setTimeout(check_motion, 50);
  }
};

// AFTER
if (window.Motion && typeof window.Motion.animate === 'function') {
  init_hero();
} else {
  window.addEventListener('motion:ready', init_hero, { once: true });
  // Fallback timeout from Phase 1 still applies
}
```

**Scripts to update** (17 total):
- [ ] hero_webshop.js
- [ ] hero_general.js
- [ ] hero_cards.js
- [ ] hero_video.js
- [ ] hero_home.js
- [ ] And 12 more...

---

#### T015: Batch Forced Reflows in nav_mobile_menu.js
**File**: `src/2_javascript/navigation/nav_mobile_menu.js`
**Issue**: B-02 - 11 forced reflows causing layout thrashing

```javascript
// BEFORE: Multiple getBoundingClientRect() calls
const rect1 = el1.getBoundingClientRect();
// ... other code
const rect2 = el2.getBoundingClientRect();
// ... more interleaved reads/writes

// AFTER: Batch all measurements first
const measurements = {
  rect1: el1.getBoundingClientRect(),
  rect2: el2.getBoundingClientRect(),
  // ... all other measurements
};
// Then do all writes
el1.style.height = measurements.rect1.height + 'px';
// ...
```

---

<!-- ANCHOR:phase-4 -->
## Phase 4: CSS Optimization (P2)

**Workstream**: W-D (CSS Agent)
**Goal**: Reduce CSS payload and eliminate render-blocking
**Duration**: 4-8 hours
**Dependencies**: Phase 1 complete (can run parallel with Phase 2, 3)

### T019-T023: CSS Optimization

| Task | Status | Description | File | Issue | Priority |
|------|--------|-------------|------|-------|----------|
| T019 | [x] [S] | Extract and inline critical CSS (~15KB above-fold) | `global.html` | C-01 | P2 |
| T020 | [x] [P] | Load form CSS only on form pages (53KB) | Form HTML | C-03 | P2 |
| T021 | [x] [P] | Load video CSS only on video pages (17KB) | Video HTML | C-04 | P2 |
| T022 | [x] [P] | Remove 6 static will-change declarations | 5 CSS files | C-05 | P2 |
| T023 | [CANCELLED] | ~~Create page-type CSS bundles~~ | Build system | C-06 | P2 |

### Task Details

#### T019: Extract and Inline Critical CSS
**File**: `global.html` `<head>`
**Issue**: C-01 - No critical CSS inlining

Steps:
1. Use Chrome Coverage tool to identify above-fold CSS
2. Extract ~15KB of critical rules
3. Inline in `<style>` tag in `<head>`
4. Defer remaining CSS load


<!-- /ANCHOR:phase-4 -->

---

#### T020: Load Form CSS Only on Form Pages
**Issue**: C-03 - 53KB form CSS loads globally

Form CSS files (9 files, 53KB total):
- form_*.css
- filepond_*.css

Only needed on 3 pages: werken_bij, vacature, contact (if form)

```html
<!-- On form pages only -->
<link rel="stylesheet" href="/css/form-bundle.css">
```

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Image & Media Optimization (P1/P2)

**Workstream**: W-E (Primary)
**Goal**: Optimize media loading for mobile
**Duration**: 2-4 hours
**Dependencies**: Phase 2 complete (needs poster images created)

### T024-T027: Image/Media Optimization

| Task | Status | Description | File | Issue | Priority |
|------|--------|-------------|------|-------|----------|
| T024 | [B] [P] | Add srcset/sizes for responsive hero images | All hero images | D-01 | P1 |
| T025 | [REVERTED] [P] | Add loading="lazy" via JS for below-fold images | NEW: image_lazy_load.js | D-02 | P1 |
| T026 | [REVERTED] [P] | Add decoding="async" via JS to images | NEW: image_lazy_load.js | D-07 | P2 |
| T027 | [x] [S] | Preload HLS manifest on video pages | Video page HTML | D-06 | P2 |

### Task Details

#### T024: Add Responsive Images
**Issue**: D-01 - Mobile downloads desktop-sized images

```html
<!-- BEFORE -->
<img src="hero-desktop.webp" alt="...">

<!-- AFTER -->
<img 
  srcset="hero-mobile.webp 768w, 
          hero-tablet.webp 1200w, 
          hero-desktop.webp 1920w"
  sizes="(max-width: 768px) 100vw, 
         (max-width: 1200px) 100vw, 
         100vw"
  src="hero-desktop.webp" 
  alt="...">
```

**Images to update**:
- [ ] All hero images (18 pages)
- [ ] Create mobile/tablet variants


<!-- /ANCHOR:phase-5 -->

---

#### T025: Add Lazy Loading [REVERTED]
**Issue**: D-02 - All images load immediately

**Status**: REVERTED on 2026-02-07. The `image_lazy_load.js` script that implemented this feature has been removed. Lazy loading and async decoding will be handled differently in the future.

**Original Implementation**:
Add `loading="lazy"` to all images NOT in the initial viewport:
- Team photos
- Product images
- Blog thumbnails
- Footer images

```html
<img loading="lazy" src="..." alt="...">
```

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Architecture Improvements (P2/P3)

**Workstream**: W-F (Primary)
**Goal**: Long-term performance architecture
**Duration**: 8-16 hours
**Dependencies**: Phase 1-5 complete

> **⚠️ SCOPE CHANGE - Bundling Approach Cancelled (2025-01-20)**
> 
> Tasks T023, T030, T031, and T034 (all bundling-related tasks) have been **CANCELLED**.
> 
> **Rationale:**
> - Bundling approach was evaluated but removed from scope
> - Individual script loading is preferred for this Webflow-based project
> - Webflow's deployment model and custom code injection points don't align well with bundled assets
> - The complexity of maintaining page-specific bundles outweighs the performance benefits
> 
> **Active Optimizations (unchanged):**
> - T033: SharedObservers consolidation ✅ COMPLETE
> - T028: Motion.dev tree-shaking ✅ COMPLETE  
> - T029: Custom Swiper build (still active)
> - T032: Service worker caching (still active)
> - T035: DOMContentLoaded consolidation (still active)
> 
> **See also:** ADR-005 in decision-record.md (updated to Superseded status)

### T028-T035: Architecture

| Task | Status | Description | File | Issue | Priority |
|------|--------|-------------|------|-------|----------|
| T028 | [x] [S] | Tree-shake Motion.dev (18→2 functions) | `global.html:116-122` | B-04 | P2 |
| T029 | [x] [P] | Custom Swiper build analysis (65% reduction possible) | Analysis complete | B-05 | P2 |
| T030 | [CANCELLED] | ~~Create page-specific JS bundles~~ | Build system | B-06, G-01 | P2 |
| T031 | [CANCELLED] | ~~Create page-specific CSS bundles~~ | Build system | G-02 | P2 |
| T032 | [x] [S] | Implement service worker caching | `global.html`, `service_worker.js` | G-03 | P3 |
| T033 | [x] [P] | Consolidate 16 observers to <5 | Various JS | G-04 | P2 |
| T034 | [CANCELLED] | ~~Bundle 48 JS files into page bundles~~ | Build system | B-10 | P2 |
| T035 | [x] [P] | DOMContentLoaded analysis (no consolidation needed) | Analysis complete | B-07 | P3 |

### Task Details

#### T028: Tree-Shake Motion.dev
**Issue**: B-04 - Motion.dev loads 18 functions, uses 2

Current import:
```javascript
const { animate, scroll, inView, hover, press, ... } = await import(...)
```

Only needed:
```javascript
const { animate, inView } = await import(...)
```

**Savings**: ~15KB (from 90KB to ~75KB)


<!-- /ANCHOR:phase-6 -->

---

#### T030: Page-Specific JS Bundles
**Issue**: B-06, G-01 - Form scripts load on ALL pages

Create bundles:
- `core.js` - Required on all pages (~50KB)
- `form.js` - Only on form pages (~62KB)
- `video.js` - Only on video pages (~30KB)
- `blog.js` - Only on blog pages

---

## Additional Issues (Deferred/Monitoring)

### Third-Party Issues (E-01 to E-06)

| Task | Status | Description | Issue | Priority | Status |
|------|--------|-------------|-------|----------|--------|
| T036 | [B] | Fix TypeKit blocking (font-display: swap) | E-01 | P1 | Needs Webflow config |
| T037 | [B] | Audit ConsentPro (301KB, 212KB unused) | E-02 | P2 | Needs legal review |

### Low Priority/Future (P3)

| Task | Status | Description | Issue | Priority |
|------|--------|-------------|-------|----------|
| T038 | [x] | Add speculative prefetch for navigation | F-03 | P3 |
| T039 | [x] | Add modulepreload for Motion.dev | F-04 | P3 |
| T040 | [ ] | Image compression audit | D-08 | P3 |
| T041 | [ ] | Complex CSS selector optimization | C-07 | P3 |

---

## AI Execution Protocol

### Pre-Task Checklist

Before starting each task, verify:

1. [ ] Load `spec.md` and verify scope hasn't changed
2. [ ] Load `plan.md` and identify current phase
3. [ ] Load `tasks.md` and find next uncompleted task
4. [ ] Verify task dependencies are satisfied (check workstream)
5. [ ] Load `checklist.md` and identify relevant P0/P1 items
6. [ ] Check for blocking issues in `decision-record.md`
7. [ ] Verify `memory/` folder for context from previous sessions
8. [ ] Confirm understanding of success criteria
9. [ ] Begin implementation only after all checks pass

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order within phase |
| TASK-PARALLEL | [P] tasks can run simultaneously with other [P] tasks |
| TASK-SCOPE | Stay within task boundary, no scope creep |
| TASK-VERIFY | Verify each task against its verification criteria |
| TASK-DOC | Update status immediately on completion |
| TASK-SYNC | Wait for SYNC point before cross-workstream changes |

### Status Reporting Format

```markdown
## Status Update - [TIMESTAMP]
- **Phase**: [1-6]
- **Workstream**: [W-A/B/C/D/E/F]
- **Task**: T### - [Description]
- **Status**: [IN_PROGRESS | COMPLETED | BLOCKED]
- **Evidence**: [Link to code/test/artifact]
- **Lighthouse**: Mobile LCP: Xs (was Ys), Score: X% (was Y%)
- **Blockers**: [None | Description]
- **Next**: T### - [Next task]
```

---

## Workstream Organization

### Workstream A: Critical Fixes (Primary)
**Phase 1 - Sequential execution required**

- [x] T001 [S] Fix hero_webshop.js infinite loop
- [x] T002 [P] Reduce hero_general.js Motion timeout
- [x] T003 [P] Add image timeout to hero_general.js
- [x] T004 [P] Add image timeout to hero_cards.js
- [x] T005 [S] Move safety timeout to head

### Workstream B: Resource Hints (Agent 1)
**Phase 2 - Mostly parallel**

- [B] T006 [P] Add video poster images (needs BunnyCDN)
- [B] T007 [P] Add LCP image preload (needs Webflow/CDN URLs)
- [B] T008 [P] Add fetchpriority to hero images (needs Webflow)
- [x] T009 [S] Skip video wait on all devices
- [x] T010 [P] Async FilePond CSS
- [x] T011 [P] Add unpkg.com preconnect

### Workstream C: JS Optimization (Agent 2)
**Phase 3 - Mostly parallel after T012**

- [x] T012 [S] Add Motion.dev ready event
- [x] T013 [P] Replace hero script polling
- [x] T014 [P] Replace animation script polling
- [x] T015 [P] Batch nav_mobile_menu.js reflows
- [~] T016 [P] Batch remaining reflows (already optimized)
- [x] T017 [P] Remove hero will-change
- [x] T018 [P] Remove link will-change

### Workstream D: CSS Optimization (Agent 3)
**Phase 4 - Sequential critical path, then parallel**

- [x] T019 [S] Inline critical CSS
- [x] T020 [P] Form CSS page-specific
- [x] T021 [P] Video CSS page-specific
- [x] T022 [P] Remove static will-change
- [CANCELLED] T023 ~~Create CSS bundles~~

### Workstream E: Image/Media (Primary)
**Phase 5 - Parallel**

- [B] T024 [P] Add responsive images (needs CDN variants)
- [REVERTED] T025 [P] Add lazy loading (via JS) — image_lazy_load.js deleted (2026-02-07)
- [REVERTED] T026 [P] Add decoding="async" (via JS) — image_lazy_load.js deleted (2026-02-07)
- [x] T027 [S] Preload HLS manifest

### Workstream F: Architecture (Primary)
**Phase 6 - Mixed**

- [x] T028 [S] Tree-shake Motion.dev
- [x] T029 [P] Custom Swiper build analysis (65% reduction documented)
- [CANCELLED] T030 ~~Page-specific JS bundles~~
- [CANCELLED] T031 ~~Page-specific CSS bundles~~
- [x] T032 [S] Service worker caching
- [x] T033 [P] Consolidate observers (SharedObservers)
- [CANCELLED] T034 ~~Bundle JS files~~
- [x] T035 [P] DOMContentLoaded analysis (no action needed)

---

<!-- ANCHOR:completion -->
## Completion Criteria

### Phase 1 Complete
- [x] All T001-T005 marked `[x]`
- [ ] No infinite loops possible (verified by blocking resources)
- [ ] Page visible within 3s on throttled connection
- [ ] Console shows timeout warnings when triggered

### Phase 2 Complete
- [ ] All T006-T011 marked `[x]`
- [ ] Video posters visible before video plays
- [ ] LCP images appear early in Network waterfall
- [ ] Desktop no longer waits for video

### Phase 3 Complete
- [ ] All T012-T018 marked `[x]`
- [ ] Only one Motion.dev initialization mechanism
- [ ] No polling loops in console/Performance tab
- [ ] Reduced layout thrashing

### Phase 4 Complete
- [ ] All T019-T023 marked `[x]`
- [ ] Critical CSS inline in head
- [ ] Form/video CSS only on relevant pages

### Phase 5 Complete
- [ ] All T024-T027 marked `[x]`
- [ ] Mobile downloads smaller images
- [ ] Below-fold images lazy loaded

### Phase 6 Complete
- [ ] All T028-T035 marked `[x]`
- [ ] Reduced bundle sizes
- [ ] Service worker active

### Final Criteria
- [ ] All tasks marked `[x]` (except [B] blocked and deferred)
- [ ] No `[B]` blocked tasks remaining (except external dependencies)
- [ ] Mobile LCP < 4.0s
- [ ] Mobile Score > 75%
- [ ] Desktop LCP < 2.5s
- [ ] Desktop Score > 90%
- [ ] All verification passed


<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (Issue Inventory sections 11)
- **Plan**: See `plan.md` (Phases section 4)
- **Checklist**: See `checklist.md` (Verification sections)
- **Decisions**: See `decision-record.md` (ADRs)
- **Research**: See `research.md` (10-agent findings)


<!-- /ANCHOR:cross-refs -->

---

## Task Statistics

| Category | Total | P0 | P1 | P2 | P3 | Cancelled |
|----------|-------|----|----|----|----|-----------|
| Phase 1 | 5 | 5 | 0 | 0 | 0 | 0 |
| Phase 2 | 6 | 0 | 5 | 1 | 0 | 0 |
| Phase 3 | 7 | 0 | 2 | 5 | 0 | 0 |
| Phase 4 | 5 | 0 | 0 | 5 | 0 | 1 (T023) |
| Phase 5 | 4 | 0 | 2 | 2 | 0 | 0 |
| Phase 6 | 8 | 0 | 0 | 6 | 2 | 3 (T030, T031, T034) |
| Deferred | 6 | 0 | 1 | 1 | 4 | 0 |
| **Total** | **41** | **5** | **10** | **20** | **6** | **4** |

> **Note**: 4 bundling-related tasks (T023, T030, T031, T034) were cancelled on 2025-01-20. 
> See Phase 6 scope change note for details.

## Progress Summary

*Last Updated: 2026-02-07 (image_lazy_load.js reversal)*

| Phase | Completed | Blocked | Cancelled | Skipped | Reverted | Pending | Total |
|-------|-----------|---------|-----------|---------|----------|---------|-------|
| 1 | 5 | 0 | 0 | 0 | 0 | 0 | 5 |
| 2 | 3 | 3 | 0 | 0 | 0 | 0 | 6 |
| 3 | 6 | 0 | 0 | 1 | 0 | 0 | 7 |
| 4 | 4 | 0 | 1 | 0 | 0 | 0 | 5 |
| 5 | 1 | 1 | 0 | 0 | 2 | 0 | 4 |
| 6 | 5 | 0 | 3 | 0 | 0 | 0 | 8 |
| **Total (T001-T035)** | **24** | **4** | **4** | **1** | **2** | **0** | **35** |

**Overall Progress**: 24/35 tasks completed (69%), 4 cancelled (11%), 4 blocked (11%), 1 skipped (3%), 2 reverted (6%)

### Additional Low-Priority Tasks (T036-T041)

| Task | Status | Description |
|------|--------|-------------|
| T036 | [B] | Fix TypeKit blocking (needs Webflow config) |
| T037 | [B] | Audit ConsentPro (needs legal review) |
| T038 | [x] | Speculative prefetch for navigation |
| T039 | [x] | Modulepreload for Motion.dev |
| T040 | [ ] | Image compression audit |
| T041 | [ ] | Complex CSS selector optimization |

### Cancelled Tasks (Bundling Removed from Scope)

| Task | Description | Reason |
|------|-------------|--------|
| T023 | Create page-type CSS bundles | Bundling approach removed - individual scripts preferred for Webflow |
| T030 | Create page-specific JS bundles | Bundling approach removed - individual scripts preferred for Webflow |
| T031 | Create page-specific CSS bundles | Bundling approach removed - individual scripts preferred for Webflow |
| T034 | Bundle 48 JS files into page bundles | Bundling approach removed - individual scripts preferred for Webflow |

---

<!--
LEVEL 3+ TASKS (~700 lines)
- All 50+ issues mapped to 41 tasks across 6 phases
- Workstream organization for parallel execution
- AI Execution Protocol with pre-task checklist
- Per-phase completion criteria
- Task notation with [P], [S], [B] markers
-->
