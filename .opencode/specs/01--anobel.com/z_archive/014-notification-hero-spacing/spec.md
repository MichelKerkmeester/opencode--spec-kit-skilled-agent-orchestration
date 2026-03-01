---
title: "Notification Hero Spacing [015-notification-hero-spacing/spec]"
description: "When the notification bar is visible at the top of the page, the hero section content may overlap or be partially hidden. A spacing mechanism is needed to push hero content down..."
trigger_phrases:
  - "notification"
  - "hero"
  - "spacing"
  - "spec"
  - "015"
importance_tier: "important"
contextType: "decision"
---
# Notification Hero Spacing

<!-- ANCHOR:problem-statement -->
## Problem Statement

When the notification bar is visible at the top of the page, the hero section content may overlap or be partially hidden. A spacing mechanism is needed to push hero content down when notifications are active.
<!-- /ANCHOR:problem-statement -->

<!-- ANCHOR:solution-overview -->
## Solution Overview

Use CSS to conditionally show a spacing div in the hero based on the notification system's existing state indicator.
<!-- /ANCHOR:solution-overview -->

<!-- ANCHOR:technical-context -->
## Technical Context

The notification system (`src/2_javascript/navigation/nav_notifications.js`) already provides a state indicator:

```javascript
// Line 298 - set when notification is active
container.setAttribute('data-alert-container-active', 'true');

// Line 301 - removed when no notifications
container.removeAttribute('data-alert-container-active');
```

This attribute is the hook we'll use for CSS targeting.
<!-- /ANCHOR:technical-context -->

<!-- ANCHOR:approach-options -->
## Approach Options

### Option 1: Pure CSS with `:has()` (Recommended)

**Browser Support:** 95%+ (Chrome 105+, Firefox 121+, Safari 15.4+)

```css
[data-notification-spacer] {
  display: none;
}

body:has([data-alert-container-active]) [data-notification-spacer] {
  display: block;
  height: var(--notification-height, 60px);
}
```

**Attribute:** `data-notification-spacer` on any div element

**Pros:**
- Zero JavaScript changes required
- Uses existing attribute from notification system
- Clean separation of concerns

**Cons:**
- Older browsers silently fail (graceful degradation)

### Option 2: Body Attribute (Legacy Support)

Add one line to `nav_notifications.js` at line ~311:

```javascript
document.body.toggleAttribute('data-notification-active', !!winner);
```

Then CSS:

```css
body[data-notification-active] [data-notification-spacer] {
  display: block;
}
```

**Pros:**
- Works in all browsers
- Explicit state on body element

**Cons:**
- Requires JavaScript modification
<!-- /ANCHOR:approach-options -->

<!-- ANCHOR:requirements -->
## Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| R1 | Spacing div hidden by default | P0 |
| R2 | Visible only when notification is active | P0 |
| R3 | Height matches notification bar | P1 |
| R4 | Smooth transition (no layout jump) | P2 |
| R5 | Works on all pages with hero sections | P1 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## Success Criteria

- [ ] Spacing div is invisible when no notifications active
- [ ] Spacing div appears when notification shows
- [ ] Spacing div hides when notification is dismissed
- [ ] No flash of unstyled content (FOUC)
- [ ] Works with notification office hours integration
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:out-of-scope -->
## Out of Scope

- Notification bar styling changes
- Hero section redesign
- Animation of notification bar itself
<!-- /ANCHOR:out-of-scope -->

<!-- ANCHOR:references -->
## References

- `src/2_javascript/navigation/nav_notifications.js` - Notification system
- `src/2_javascript/navigation/CMS Alert System (Notifications).md` - System documentation
<!-- /ANCHOR:references -->
