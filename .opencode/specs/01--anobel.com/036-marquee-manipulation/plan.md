---
title: "Implementation Plan: Marquee Drag/Swipe With Persistent Autoplay - anobel.com"
description: "Implement Swiper marquee interaction updates for desktop and mobile, preserve autoplay behavior, regenerate minified bundles, and propagate CDN query version bumps across all referencing HTML files."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
trigger_phrases:
  - "implementation"
  - "plan"
  - "marquee"
  - "swiper"
  - "autoplay"
  - "cdn"
  - "036"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Marquee Drag/Swipe With Persistent Autoplay - anobel.com

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | HTML + JavaScript (Webflow-hosted static pages with custom JS modules) |
| **Framework** | Swiper-based marquee components |
| **Storage** | None |
| **Testing** | Manual desktop/mobile interaction checks + HTML reference verification |

### Overview
This implementation changes the two marquee Swiper source modules so users can drag with mouse on desktop and swipe on mobile. It preserves autoplay continuity by keeping interaction-safe autoplay behavior and validating post-interaction recovery.

After source updates, the plan regenerates both minified marquee bundles and applies a consistent CDN query version bump in every HTML file that references those bundles.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope is locked to two marquee source modules, two minified outputs, and known HTML references.
- [x] Success criteria are measurable for interaction behavior, autoplay persistence, and version propagation.
- [x] Current reference baseline identified (`v=1.2.35` in HTML bundle URLs).

### Definition of Done
- [ ] Desktop drag works for brands and clients marquees.
- [ ] Mobile swipe works for brands and clients marquees.
- [ ] Autoplay continues after interaction and still responds to visibility observer start/stop events.
- [ ] Both minified files are regenerated from updated source.
- [ ] All known HTML references for touched bundles use the new shared query version.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Focused module update with release synchronization (source -> minified bundle -> HTML reference).

### Key Components
- **Marquee Source Modules**: `marquee_brands.js` and `marquee_clients.js` receive interaction config updates.
- **Minified CDN Bundles**: `marquee_brands.min.js` and `marquee_clients.min.js` are regenerated.
- **HTML Reference Set**: All pages that include these bundle URLs receive one consistent query version increment.

### Data Flow
1. Update Swiper configuration in both source marquee modules.
2. Build/regenerate minified marquee bundles from updated sources.
3. Update HTML script URL query versions for all referencing pages.
4. Verify interaction behavior and autoplay persistence in browser scenarios.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm final query version target for this release (single shared value).
- [ ] Confirm full HTML reference inventory for `marquee_brands.min.js` and `marquee_clients.min.js`.
- [ ] Capture current baseline behavior (drag/swipe disabled) for comparison.

### Phase 2: Core Implementation
- [ ] Update `src/2_javascript/swiper/marquee_brands.js` interaction settings.
- [ ] Update `src/2_javascript/swiper/marquee_clients.js` interaction settings.
- [ ] Regenerate `src/2_javascript/z_minified/swiper/marquee_brands.min.js`.
- [ ] Regenerate `src/2_javascript/z_minified/swiper/marquee_clients.min.js`.
- [ ] Bump query versions in all referencing HTML files.

### Phase 3: Verification
- [ ] Verify desktop click-drag and mobile swipe behavior on representative pages.
- [ ] Verify autoplay resumes/continues after interaction and still pauses off-screen.
- [ ] Verify no old query string remains for touched bundle references.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual Interaction | Desktop drag + mobile swipe on marquee components | Browser (desktop + mobile emulation/device) |
| Autoplay Behavior | Post-interaction autoplay continuity + visibility pause/resume | Browser DevTools + visual behavior checks |
| Asset Sync | Source/minified parity for touched bundles | File diff/review |
| Reference Integrity | Query version updates across all affected HTML files | Search/grep verification |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Swiper global runtime availability on target pages | Internal | Green | Interaction settings cannot be validated in browser |
| Minification workflow for `z_minified/swiper` outputs | Internal | Yellow | Source changes ship without CDN bundle updates |
| HTML template update access for all referencing pages | Internal | Green | Query-version rollout becomes inconsistent |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Drag/swipe breaks marquee behavior, autoplay remains stuck, or CDN version mismatch causes regressions.
- **Procedure**: Revert both source module changes, regenerate prior minified bundle versions, and restore previous bundle query values across HTML references.
<!-- /ANCHOR:rollback -->

---
