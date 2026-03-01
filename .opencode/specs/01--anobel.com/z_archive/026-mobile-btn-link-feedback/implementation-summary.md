---
title: "Implementation Summary [028-mobile-btn-link-feedback/implementation-summary]"
description: "A scroll-aware system for button/link active states that eliminates unwanted visual feedback during scroll on touch devices while preserving instant tap feedback."
trigger_phrases:
  - "implementation"
  - "summary"
  - "implementation summary"
  - "028"
  - "mobile"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.0 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-mobile-btn-link-feedback |
| **Completed** | 2025-02-01 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-was-built -->
## What Was Built

A scroll-aware system for button/link active states that eliminates unwanted visual feedback during scroll on touch devices while preserving instant tap feedback.

**Approach (v2 - Scroll Guard):** A JavaScript module detects scroll gestures via touchmove and adds `[data-scrolling]` to body. CSS `:active` rules use `body:not([data-scrolling])` prefix to suppress active states during scroll while allowing instant feedback on actual taps.

### Why v1 Failed

The original click-based approach (`mobile_tap_feedback.js`) wrapped `:active` in `@media (hover: hover)` (desktop only) and added `[data-tap-active="true"]` on click. This failed because by the time the click event fires, the browser has already started navigation for links - users never saw the visual feedback.

### v2 Solution

The new approach uses native `:active` which triggers instantly on touchstart, but suppresses it when scroll is detected. This gives users immediate visual feedback on taps while preventing unwanted flashes during scroll.
<!-- /ANCHOR:what-was-built -->

---

<!-- ANCHOR:files-changed -->
## Files Changed

| File | Action | Purpose |
|------|--------|---------|
| src/2_javascript/global/touch_scroll_guard.js | Created | Touch scroll detection module (235 lines) |
| src/2_javascript/z_minified/global/touch_scroll_guard.js | Created | Minified version (1.5KB) |
| src/0_html/global.html | Modified | Script reference updated to touch_scroll_guard.js |
| src/1_css/button/btn_main.css | Modified | 14 button types: scroll-safe :active pattern |
| src/1_css/button/btn_text_link.css | Modified | 6 text link types: scroll-safe :active pattern |
| src/1_css/button/btn_nav.css | Modified | 3 nav button types: scroll-safe :active pattern |
| src/1_css/link_new/hover_state_machine.css | Modified | Scroll-safe :active pattern |

### Files Deleted

| File | Reason |
|------|--------|
| src/2_javascript/global/mobile_tap_feedback.js | Replaced by touch_scroll_guard.js (v1 approach failed) |
| src/2_javascript/z_minified/global/mobile_tap_feedback.js | Replaced by touch_scroll_guard.js |

### Staging Files Copied

| File | Location |
|------|----------|
| btn_main.css | src/3_staging/ |
| btn_text_link.css | src/3_staging/ |
| btn_nav.css | src/3_staging/ |
| btn_cta.css | src/3_staging/ |
| hover_state_machine.css | src/3_staging/ |
<!-- /ANCHOR:files-changed -->

---

<!-- ANCHOR:css-pattern -->
## CSS Pattern

### Old Pattern (v1 - Failed)
```css
/* Desktop only - no mobile feedback */
@media (hover: hover) {
  [selector]:active { ... }
}
/* Click-based - fires too late for navigation */
[selector][data-tap-active="true"] { ... }
```

### New Pattern (v2 - Working)
```css
/* Active (Scroll-Safe) - works instantly, suppressed during scroll */
body:not([data-scrolling]) [data-btn-type="Primary-Full"]:active {
  color: var(--_color-tokens---content-neutral--white);
  background-color: var(--_color-tokens---bg-neutral--black);
  border: 0;
}
```
<!-- /ANCHOR:css-pattern -->

---

<!-- ANCHOR:how-it-works -->
## How It Works

```
User touches button
    |
    v
:active triggers immediately (visual feedback!)
    |
    v
User starts moving finger (touchmove)
    |
    v
JS detects movement > 5px -> adds [data-scrolling] to body
    |
    v
CSS rule body:not([data-scrolling]) no longer matches
    |
    v
:active style removed -> scrolling without flash
    |
    v
User lifts finger (touchend)
    |
    v
100ms later -> [data-scrolling] removed
```
<!-- /ANCHOR:how-it-works -->

---

<!-- ANCHOR:key-decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Use scroll detection + :active (v2) instead of click events (v1) | :active triggers instantly; click fires too late for navigating links |
| 5px scroll threshold | Small enough to detect scroll early, large enough to ignore minor movement |
| 100ms clear delay | Prevents flicker during scroll momentum |
| Use body attribute | Single point of control for all elements |
| Passive event listeners | No scroll blocking, better performance |
<!-- /ANCHOR:key-decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Manual | Pending | Needs testing on actual touch device |
| Syntax | Pass | CSS parses correctly, JS minifies without errors |
| Desktop | Pass | :active states work normally (no [data-scrolling] ever added) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:known-limitations -->
## Known Limitations

- **Hybrid devices** (laptops with touchscreen): Will use touch behavior when touch input detected. This is acceptable as scroll-on-touch issue only affects touch input.
- **JavaScript dependency**: If JS fails to load, touch devices may get scroll-triggered :active flashes. This is acceptable degradation (visual feedback still works).
<!-- /ANCHOR:known-limitations -->

---

<!-- ANCHOR:api-reference -->
## API Reference

```javascript
// Public API exposed on window.TouchScrollGuard
window.TouchScrollGuard.init()           // Initialize (auto-called)
window.TouchScrollGuard.cleanup()        // Remove listeners, clear state
window.TouchScrollGuard.refresh()        // Cleanup + re-init
window.TouchScrollGuard.is_scrolling()   // Check if currently scrolling
window.TouchScrollGuard.is_touch_device() // Check if touch device
```
<!-- /ANCHOR:api-reference -->

---

<!-- ANCHOR:button-types-updated -->
## Button Types Updated

### btn_main.css (14 types)
1. Primary-Full
2. Primary-Ghost-Light
3. Primary-Ghost-Dark
4. Secondary-Full
5. Secondary-Ghost
6. Secondary-Transparent
7. Secondary-Transparent-Border
8. Tertiary-Ghost
9. Tertiary-Transparent
10. Tertiary-Transparent-Black
11. Tertiary-Transparent-Border
12. Warning-Full
13. Warning-Ghost
14. Warning-Transparent

### btn_text_link.css (6 types)
1. Blue
2. Black (Color variant)
3. Black (Underline variant)
4. Gray
5. White
6. Red

### btn_nav.css (3 types)
1. Nav Action
2. Nav Page
3. Nav Language
<!-- /ANCHOR:button-types-updated -->

---

<!-- ANCHOR:cdn-reference -->
## CDN Reference

```html
<!-- Touch Scroll Guard (prevents :active flash during scroll on touch devices) -->
<script src="https://pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev/touch_scroll_guard.js?v=1.0.0" defer></script>
```
<!-- /ANCHOR:cdn-reference -->

---
