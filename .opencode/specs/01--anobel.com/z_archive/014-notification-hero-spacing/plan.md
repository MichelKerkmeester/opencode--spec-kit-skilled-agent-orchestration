---
title: "Implementation Plan [015-notification-hero-spacing/plan]"
description: "Implement conditional hero spacing that responds to notification bar visibility using CSS :has() selector with the existing data-alert-container-active attribute."
trigger_phrases:
  - "implementation"
  - "plan"
  - "015"
  - "notification"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan

<!-- ANCHOR:overview -->
## Overview

Implement conditional hero spacing that responds to notification bar visibility using CSS `:has()` selector with the existing `data-alert-container-active` attribute.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:phase-1-webflow-setup -->
## Phase 1: Webflow Setup

**Goal:** Add the spacing div element to hero sections

### Steps

1. Open Webflow Designer
2. Navigate to hero section component (or each page with hero)
3. Add a div block at the TOP of the hero section (first child)
4. Add custom attribute: `data-notification-spacer` (no value needed)
5. Set initial display to `none` in Webflow styles
6. Set height to match notification bar (e.g., 60px)

### Verification

- [ ] Div exists in hero section
- [ ] Div has `data-notification-spacer` attribute
- [ ] Div is hidden by default
<!-- /ANCHOR:phase-1-webflow-setup -->

<!-- ANCHOR:phase-2-css-implementation -->
## Phase 2: CSS Implementation

**Goal:** Add conditional visibility CSS

### CSS Code

```css
/* ─────────────────────────────────────────────────────────────
   HERO: Notification Spacer
   Shows spacing in hero when notification bar is active
   ───────────────────────────────────────────────────────────── */

[data-notification-spacer] {
  display: none;
  height: 0;
  transition: height 0.3s ease;
}

/* Show spacer when notification is active */
body:has([data-alert-container-active]) [data-notification-spacer] {
  display: block;
  height: var(--notification-height, 60px);
}
```

### Steps

1. Add CSS to Webflow custom code (Page or Site-level)
2. Or add to `src/1_css/global/` if using external CSS

### Verification

- [ ] CSS is loaded on page
- [ ] No syntax errors in console
<!-- /ANCHOR:phase-2-css-implementation -->

<!-- ANCHOR:phase-3-testing -->
## Phase 3: Testing

**Goal:** Verify correct behavior across all states

### Test Cases

| # | Scenario | Expected Result |
|---|----------|-----------------|
| 1 | No active notifications | Spacer hidden |
| 2 | Active notification visible | Spacer visible |
| 3 | Dismiss notification | Spacer hides |
| 4 | Office hours: notification appears | Spacer shows |
| 5 | Office hours: notification hides | Spacer hides |
| 6 | Page load with active notification | Spacer visible immediately |

### Testing Commands

```javascript
// Console commands for testing
AnobelAlerts.debug(true);  // Enable debug logging
AnobelAlerts.refresh();     // Force visibility update
AnobelAlerts.clearDismissals(); // Reset dismissed state
```
<!-- /ANCHOR:phase-3-testing -->

<!-- ANCHOR:phase-4-optional-js-enhancement -->
## Phase 4: Optional JS Enhancement

**Goal:** Add body attribute for legacy browser support (if needed)

### Code Change

In `src/2_javascript/navigation/nav_notifications.js`, add at line ~311:

```javascript
// Add body-level state indicator for CSS targeting
document.body.toggleAttribute('data-notification-active', !!winner);
```

### Alternative CSS

```css
body[data-notification-active] [data-notification-spacer] {
  display: block;
  height: var(--notification-height, 60px);
}
```
<!-- /ANCHOR:phase-4-optional-js-enhancement -->

<!-- ANCHOR:timeline -->
## Timeline

| Phase | Estimated Time |
|-------|----------------|
| Phase 1: Webflow Setup | 15 min |
| Phase 2: CSS Implementation | 10 min |
| Phase 3: Testing | 20 min |
| Phase 4: Optional JS | 5 min |
| **Total** | **~50 min** |
<!-- /ANCHOR:timeline -->

<!-- ANCHOR:risks-mitigations -->
## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| CSS `:has()` not supported | Low (95%+ support) | Fallback to Phase 4 JS approach |
| Notification height varies | Medium | Use CSS variable `--notification-height` |
| Layout shift on load | Low | CSS transition smooths change |
<!-- /ANCHOR:risks-mitigations -->

<!-- ANCHOR:dependencies -->
## Dependencies

- Notification system must set `data-alert-container-active` attribute (already implemented)
- Hero section must be accessible via CSS descendant selector from body
<!-- /ANCHOR:dependencies -->
