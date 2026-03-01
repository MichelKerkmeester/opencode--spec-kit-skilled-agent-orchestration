---
title: "Implementation Summary - Load Toggle Component [027-load-toggle/implementation-summary]"
description: "This implementation provides a reusable expand/collapse component for Webflow with CMS-bindable button text, smooth animations, and multi-instance support. The component enables..."
trigger_phrases:
  - "implementation"
  - "summary"
  - "load"
  - "toggle"
  - "component"
  - "implementation summary"
  - "027"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary - Load Toggle Component

<!-- ANCHOR:overview -->
## Overview

This implementation provides a reusable expand/collapse component for Webflow with CMS-bindable button text, smooth animations, and multi-instance support. The component enables "View More / View Less" patterns with dynamic text controlled via data attributes on the button element.

**Key Feature:** Text attributes are placed on the button element (not the container), enabling CMS field binding in Webflow.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:changes-made -->
## Changes Made

### File: `src/2_javascript/menu/load_toggle.js`

| Section | Lines | Description |
|---------|-------|-------------|
| Configuration | 12-34 | Constants for selectors, states, defaults, attribute names |
| State | 40 | Handler tracking array for cleanup |
| Core Functions | 47-69 | `update_text()` and `toggle_state()` |
| Event Handlers | 75-104 | `handle_click()` and `bind_events()` |
| Cleanup | 111-120 | Remove listeners, reset state |
| Initialize | 126-148 | Init with Webflow.push support |

**Code Highlights:**

#### Configuration (lines 15-34)
```javascript
const SELECTORS = {
  container: '[data-target="load-toggle"]',
  trigger: '[data-target="load-toggle-trigger"]',
  text: '[data-target="load-toggle-text"]',
};

const ATTRS = {
  textCollapsed: 'data-load-collapsed',
  textExpanded: 'data-load-expanded',
};
```

#### Text Update (lines 47-56)
```javascript
function update_text(trigger, is_expanded) {
  const text_el = trigger.querySelector(SELECTORS.text);
  if (!text_el) return;

  const text_collapsed = trigger.getAttribute(ATTRS.textCollapsed) || DEFAULTS.textCollapsed;
  const text_expanded = trigger.getAttribute(ATTRS.textExpanded) || DEFAULTS.textExpanded;

  text_el.textContent = is_expanded ? text_expanded : text_collapsed;
}
```

**Impact:** CMS-bindable text that updates on state change with fallback defaults.

#### Webflow Integration (lines 143-148)
```javascript
if (window.Webflow?.push) {
  window.Webflow.push(init);
} else {
  init();
}
```

**Impact:** Proper initialization during Webflow page transitions.

---

### File: `src/1_css/menu/menu_load_toggle.css`

| Section | Lines | Description |
|---------|-------|-------------|
| Item Visibility | 10-17 | State-based show/hide for expanded items |
| Icon Rotation | 23-35 | 180° rotation animation for icon |
| Content Animation | 42-56 | Fade-in animation for expanded items |

**Code Highlights:**

#### Visibility Toggle (lines 10-17)
```css
[data-target="load-toggle" i][data-state="collapsed" i] [data-load="expanded" i] {
  display: none;
}

[data-target="load-toggle" i][data-state="expanded" i] [data-load="expanded" i] {
  display: flex;
}
```

#### Icon Rotation (lines 23-35)
```css
[data-target="load-toggle" i] [data-target="load-icon" i] {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

[data-target="load-toggle" i][data-state="expanded" i] [data-target="load-icon" i] {
  transform: rotate(180deg);
}
```

**Impact:** Smooth 300ms icon rotation with easeOutExpo timing.
<!-- /ANCHOR:changes-made -->

---

<!-- ANCHOR:data-attribute-structure -->
## Data Attribute Structure

| Attribute | Element | Purpose | CMS Bindable |
|-----------|---------|---------|--------------|
| `data-target="load-toggle"` | Container | Main wrapper | No |
| `data-target="load-toggle-trigger"` | Button | Click target | No |
| `data-target="load-toggle-text"` | Span | JS sets text | No |
| `data-target="load-icon"` | Icon/SVG | CSS rotates 180° | No |
| `data-load-collapsed` | Button | Collapsed text | **Yes** |
| `data-load-expanded` | Button | Expanded text | **Yes** |
| `data-load="expanded"` | Any child | Hidden when collapsed | No |
<!-- /ANCHOR:data-attribute-structure -->

---

<!-- ANCHOR:design-decisions -->
## Design Decisions

### D1: Text Attributes on Button
- **Decision:** Place `data-load-collapsed` and `data-load-expanded` on the button element
- **Rationale:** Webflow CMS binding only works on the same element as the collection item; putting attributes on button enables binding
- **Alternative:** Container-based attributes (rejected - not CMS-bindable)

### D2: Simplified Icon Attribute
- **Decision:** Use `data-target="load-icon"` instead of `data-target="load-toggle-icon"`
- **Rationale:** Shorter attribute name, consistent with other `data-target` patterns
- **Alternative:** `data-load="icon"` (rejected - mixing `data-load` purposes)

### D3: CSS-Only Icon Animation
- **Decision:** Handle icon rotation entirely in CSS via state selectors
- **Rationale:** No JavaScript overhead, smooth GPU-accelerated animation
- **Alternative:** JavaScript class toggle (rejected - unnecessary complexity)

### D4: Event Delegation
- **Decision:** Attach click handler to container, use `closest()` to find trigger
- **Rationale:** Works with dynamically added content, fewer event listeners
- **Alternative:** Direct button click handler (rejected - less flexible)
<!-- /ANCHOR:design-decisions -->

---

<!-- ANCHOR:files-modified -->
## Files Modified

| File | Lines Changed | Purpose |
|------|---------------|---------|
| `src/2_javascript/menu/load_toggle.js` | 151 | Full implementation |
| `src/2_javascript/z_minified/menu/load_toggle.js` | 1 | Minified (~1KB) |
| `src/1_css/menu/menu_load_toggle.css` | 57 | Styles and animations |
| `src/3_staging/src.js` | - | Staging copy |
| `src/3_staging/src.css` | - | Staging copy |
<!-- /ANCHOR:files-modified -->

---

<!-- ANCHOR:performance -->
## Performance

| Metric | Value |
|--------|-------|
| JavaScript (minified) | ~1KB |
| CSS | ~1KB |
| Animation duration | 300ms |
| Easing | cubic-bezier(0.22, 1, 0.36, 1) |
<!-- /ANCHOR:performance -->

---

<!-- ANCHOR:debugging-session-findings -->
## Debugging Session Findings

### Issue 1: Duplicate Container Attribute
- **Problem:** `button--w` wrapper had `data-target="load-toggle"`, same as actual container
- **Impact:** JS found wrong element as container
- **Resolution:** Document Webflow fix - remove attribute from `button--w`

### Issue 2: Missing Icon Attribute
- **Problem:** Icon SVG missing rotation attribute
- **Impact:** Icon didn't rotate on expand
- **Resolution:** Add `data-target="load-icon"` to icon element in Webflow
<!-- /ANCHOR:debugging-session-findings -->

---

<!-- ANCHOR:webflow-fixes-required -->
## Webflow Fixes Required

| Element | Attribute | Action |
|---------|-----------|--------|
| `button--w` | `data-target="load-toggle"` | **REMOVE** |
| `.icon--w` or SVG | `data-target` | **ADD** `load-icon` |
<!-- /ANCHOR:webflow-fixes-required -->

---

<!-- ANCHOR:verification-status -->
## Verification Status

- [x] JavaScript functionality verified
- [x] CSS animations verified
- [x] Multi-instance support verified
- [x] CMS bindability architecture verified
- [ ] Webflow attribute fixes pending
- [ ] CDN deployment pending
- [ ] Production testing pending
<!-- /ANCHOR:verification-status -->

---

<!-- ANCHOR:author -->
## Author

Claude Opus 4 | 2025-02-01
<!-- /ANCHOR:author -->
