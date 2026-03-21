---
title: "Feature Specification: Hero Video Card Image Flickering Fix [028-hero-flicker-debug/spec]"
description: "On mobile devices, when scrolling through video cards in the hero section (both \"hero cards\" and \"hero general\" variants), the thumbnail images flicker rapidly. This occurs on p..."
trigger_phrases:
  - "feature"
  - "specification"
  - "hero"
  - "video"
  - "card"
  - "spec"
  - "028"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Hero Video Card Image Flickering Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.0 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2025-01-21 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem--purpose -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On mobile devices, when scrolling through video cards in the hero section (both "hero cards" and "hero general" variants), the thumbnail images flicker rapidly. This occurs on pages like `/nl/werkenbij` and `/nl/contact`. The issue degrades user experience and makes the hero section appear broken.

### Purpose
Eliminate the image flickering during mobile scroll by fixing the underlying state management issues in the video hover player script.
<!-- /ANCHOR:problem--purpose -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix flickering in `video_background_hls_hover.js`
- Ensure smooth transitions between thumbnail and video states
- Add debouncing for viewport-triggered state changes
- Maintain existing functionality (hover, touch, autoplay)

### Out of Scope
- Changes to `hero_cards.js` - Confirmed not the cause
- Desktop behavior changes - Issue is mobile-specific
- HLS streaming logic - Not related to the visual flickering

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `src/2_javascript/video/video_background_hls_hover.js` | Modify | Fix visibility timing and add debouncing |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Eliminate image flickering on mobile scroll | No visible flickering when scrolling through hero video cards on iOS/Android |
| REQ-002 | Maintain video autoplay on viewport entry | Videos still autoplay when card scrolls into view on mobile |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Preserve hover behavior on desktop | Mouse hover still triggers video playback |
| REQ-004 | No regression on touch interactions | Tap to play/pause still works on mobile |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero visible flickering when scrolling hero section on mobile at any speed
- **SC-002**: Video cards maintain smooth fade transitions between thumbnail and video states
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks--dependencies -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Debounce too aggressive | Videos may not autoplay quickly enough | Use short debounce (100ms) only for pause, not play |
| Risk | Visibility delay causes flash | Could introduce different visual issue | Check state before applying delayed visibility |
<!-- /ANCHOR:risks--dependencies -->

---

<!-- ANCHOR:root-cause-analysis -->
## 7. ROOT CAUSE ANALYSIS

### Primary Cause: Immediate `visibility: hidden` During Transition

In the `show_thumbnail()` function (lines 346-375), when hiding the thumbnail:

```javascript
thumb.style.transition = `opacity ${thumb_duration} ease`;
thumb.style.opacity = visible ? '1' : '0';
thumb.style.visibility = visible ? 'visible' : 'hidden';  // IMMEDIATE!
```

**Problem**: Setting `visibility: hidden` immediately makes the thumbnail invisible BEFORE the opacity transition can complete. Combined with rapid state changes, this causes the image to flash in and out.

### Secondary Cause: No Debouncing on Viewport State Changes

The IntersectionObserver (lines 772-787) fires callbacks at multiple thresholds `[0, 0.1, 0.25]` with a very low threshold check (`intersectionRatio > 0.01`). During momentum scroll on mobile, this can trigger many rapid state changes:

1. Card at 0% → `pause_video('offscreen')` → thumbnail shows
2. Scroll bounces card to 10% → `try_viewport_autoplay()` → thumbnail hides
3. Scroll continues → Card at 0% again → thumbnail shows
4. Repeat rapidly = flickering
<!-- /ANCHOR:root-cause-analysis -->

---

<!-- ANCHOR:non-functional-requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No additional frame drops during scroll (<16ms per frame maintained)
- **NFR-P02**: Debounce timer memory properly cleaned up on detach

### Reliability
- **NFR-R01**: Fix must work on iOS Safari, Android Chrome, and mobile Firefox
- **NFR-R02**: No stale timers causing unexpected state changes
<!-- /ANCHOR:non-functional-requirements -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- Rapid scroll in/out: Debounce prevents rapid toggle, only last state applies
- Page navigation mid-transition: Cleanup handlers clear pending timers
- Multiple cards in viewport: Each card manages its own debounce independently

### Error Scenarios
- Visibility delay timer fires after state changed: Check current `data-thumb-visible` before applying
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity-assessment -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Single file, ~50 lines changed |
| Risk | 12/25 | High visibility feature, multiple mobile platforms |
| Research | 15/20 | Required deep code analysis and hypothesis testing |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity-assessment -->

---

<!-- ANCHOR:solution-design -->
## 10. SOLUTION DESIGN

### Fix 1: Delay `visibility: hidden` Until After Transition

```javascript
// When hiding thumbnail (visible = false):
// 1. Start opacity transition to 0
// 2. Set visibility: hidden AFTER transition completes
// 3. Check state hasn't changed before applying
```

### Fix 2: Debounce Viewport-Triggered Pause

```javascript
// Add debounce for offscreen pause only (not for play)
// This prevents rapid pause/resume cycles during momentum scroll
// Play should be immediate for responsive UX
```
<!-- /ANCHOR:solution-design -->

---
