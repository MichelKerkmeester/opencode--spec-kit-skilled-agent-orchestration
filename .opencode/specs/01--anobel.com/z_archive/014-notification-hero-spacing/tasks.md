---
title: "Tasks [015-notification-hero-spacing/tasks]"
description: "/* Notification Hero Spacer */"
trigger_phrases:
  - "tasks"
  - "015"
  - "notification"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks

<!-- ANCHOR:status-legend -->
## Status Legend

- [ ] Pending
- [x] Completed
- [-] Blocked
- [~] In Progress

---
<!-- /ANCHOR:status-legend -->

<!-- ANCHOR:webflow-designer-tasks -->
## Webflow Designer Tasks

### T1: Add Spacer Div to Hero
- [ ] Open Webflow Designer
- [ ] Navigate to hero section (component or page)
- [ ] Add div block as FIRST child of hero
- [ ] Add custom attribute: `data-notification-spacer` (no value needed)
- [ ] Set display: `none` in Webflow styles
- [ ] Publish to staging for testing

### T2: Determine Notification Height
- [ ] Measure notification bar height in browser DevTools
- [ ] Document height value (expected: ~50-70px)
- [ ] Note if height varies by content

---
<!-- /ANCHOR:webflow-designer-tasks -->

<!-- ANCHOR:css-tasks -->
## CSS Tasks

### T3: Add Conditional Visibility CSS
- [ ] Choose CSS location:
  - Option A: Webflow Site Settings > Custom Code > Head
  - Option B: Webflow Page Settings > Custom Code
  - Option C: External CSS file (src/1_css/)
- [ ] Add CSS code:

```css
/* Notification Hero Spacer */
[data-notification-spacer] {
  display: none;
  height: 0;
  transition: height 0.3s ease;
}

body:has([data-alert-container-active]) [data-notification-spacer] {
  display: block;
  height: 60px; /* Adjust to match notification height */
}
```

- [ ] Publish and verify CSS loads

---
<!-- /ANCHOR:css-tasks -->

<!-- ANCHOR:testing-tasks -->
## Testing Tasks

### T4: Functional Testing
- [ ] Test: No notifications active → spacer hidden
- [ ] Test: Notification visible → spacer shows
- [ ] Test: Dismiss notification → spacer hides
- [ ] Test: Page refresh with active notification → spacer visible

### T5: Office Hours Integration Testing
- [ ] Test: Office hours notification appears → spacer shows
- [ ] Test: Office hours notification hides → spacer hides

### T6: Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari
- [ ] Mobile Chrome

---
<!-- /ANCHOR:testing-tasks -->

<!-- ANCHOR:optional-legacy-browser-support -->
## Optional: Legacy Browser Support

### T7: Add Body Attribute (if needed)
- [ ] Edit `src/2_javascript/navigation/nav_notifications.js`
- [ ] Add line ~311: `document.body.toggleAttribute('data-notification-active', !!winner);`
- [ ] Update CSS to use `body[data-notification-active] [data-notification-spacer]` selector
- [ ] Minify and deploy updated JS
- [ ] Re-test all scenarios

---
<!-- /ANCHOR:optional-legacy-browser-support -->

<!-- ANCHOR:documentation-tasks -->
## Documentation Tasks

### T8: Update Component Documentation
- [ ] Document spacer in hero component notes
- [ ] Add to Webflow style guide (if exists)
- [ ] Update notification system docs if JS changed

---
<!-- /ANCHOR:documentation-tasks -->

<!-- ANCHOR:completion-checklist -->
## Completion Checklist

- [ ] All T1-T6 tasks completed
- [ ] T7 completed if legacy support required
- [ ] T8 documentation updated
- [ ] No console errors
- [ ] Verified on production site
<!-- /ANCHOR:completion-checklist -->
