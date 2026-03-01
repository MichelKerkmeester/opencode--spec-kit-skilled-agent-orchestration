---
title: "Implementation Plan: Mobile Button/Link Tap Feedback [028-mobile-btn-link-feedback/plan]"
description: "Overview: This implementation splits the :active pseudo-class behavior between desktop and touch devices. Desktop continues to use :active via @media (hover: hover) query. Touch..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "mobile"
  - "button"
  - "link"
  - "028"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Mobile Button/Link Tap Feedback

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.0 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CSS, JavaScript (ES6+) |
| **Framework** | Vanilla JS, Webflow integration |
| **Storage** | None |

**Overview**: This implementation splits the `:active` pseudo-class behavior between desktop and touch devices. Desktop continues to use `:active` via `@media (hover: hover)` query. Touch devices receive tap feedback via a JavaScript module that applies `[data-tap-active="true"]` attribute on click events (which fire after scroll detection completes).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

**Ready When:**
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable

**Done When:**
- [x] All acceptance criteria met
- [x] Manual testing on touch device confirms no scroll-triggered flashes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:implementation-phases -->
## 3. IMPLEMENTATION PHASES

### Phase 1: JavaScript Module
- [x] Create mobile_tap_feedback.js with IIFE pattern
- [x] Implement touch device detection via media queries
- [x] Add click event listener for matching elements
- [x] Apply/remove data-tap-active attribute with timeout
- [x] Add CDN-safe initialization pattern
- [x] Minify to z_minified folder

### Phase 2: CSS Updates - Buttons
- [x] btn_main.css - 14 button types with inline structure
- [x] btn_text_link.css - 6 text link types
- [x] btn_nav.css - 3 nav button types
- [x] btn_cta.css - Icon swap active state

### Phase 3: CSS Updates - Links
- [x] hover_state_machine.css - Link card active states

### Phase 4: Staging
- [x] Copy updated CSS files to src/3_staging/
- [x] Verify file sizes and syntax
<!-- /ANCHOR:implementation-phases -->

---

<!-- ANCHOR:dependencies -->
## 4. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| @media (hover: hover) support | Green | Supported in all modern browsers |
| Webflow.push() API | Green | Fallback to DOMContentLoaded if unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 5. ROLLBACK

- **Trigger**: Active states not showing on desktop, or JS errors on mobile
- **Procedure**:
  1. Revert CSS files via `git checkout HEAD -- src/1_css/button/*.css src/1_css/link_new/hover_state_machine.css`
  2. Remove mobile_tap_feedback.js from CDN/deployment
  3. Clear staging folder
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:technical-approach -->
## 6. TECHNICAL APPROACH

### CSS Pattern

Each `:active` rule is transformed from:
```css
/* Active */
[data-btn-type="X"]:active {
  /* styles */
}
```

To:
```css
/* Active (Desktop) */
@media (hover: hover) {
  [data-btn-type="X"]:active {
    /* styles */
  }
}

/* Active (Touch) */
[data-btn-type="X"][data-tap-active="true"] {
  /* styles */
}
```

### JavaScript Logic

```
Touch Device Detection:
  - Primary: @media (hover: none)
  - Secondary: @media (pointer: coarse)
  - Tertiary: navigator.maxTouchPoints > 0

Event Handling:
  - Listen for 'click' on document (capture phase)
  - Click fires AFTER browser completes touch/scroll detection
  - Find closest matching element
  - Apply data-tap-active="true" for 150ms
```

### Element Targeting

JavaScript targets elements with:
- `[data-btn-type]` - All button components
- `[data-state~="hover"]` - Link cards with hover state machine
- `[data-state~="hover-if-clickable"]` - Conditional hover state machine
- `#btn-cta` - CTA container
<!-- /ANCHOR:technical-approach -->

---
