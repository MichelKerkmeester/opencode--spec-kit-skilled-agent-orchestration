---
title: "Plan: Language Selector - Desktop Hover to Open [026-language-selector-hover/plan]"
description: "let hover_timeout = null"
trigger_phrases:
  - "plan"
  - "language"
  - "selector"
  - "desktop"
  - "hover"
  - "026"
importance_tier: "important"
contextType: "decision"
---
# Plan: Language Selector - Desktop Hover to Open

<!-- ANCHOR:implementation-changes -->
## Implementation Changes

### Change 1: Add hover timeout variable (~Line 49)
```javascript
let hover_timeout = null;
```

### Change 2: Modify mouseenter handler (~Line 207-212)
Replace color-only animation with dropdown open:
```javascript
language_btn.addEventListener('mouseenter', () => {
  if (!should_hide_dropdown()) return;
  clearTimeout(hover_timeout);
  is_hovering = true;
  if (!is_open) {
    // Close nav dropdowns when opening language selector
    close_nav_dropdowns();
    toggle_dropdown(true);
  }
});
```

### Change 3: Modify mouseleave handler (~Line 214-219)
Add delayed close:
```javascript
language_btn.addEventListener('mouseleave', () => {
  if (!should_hide_dropdown()) return;
  is_hovering = false;
  hover_timeout = setTimeout(() => {
    if (is_open) {
      toggle_dropdown(false);
    }
  }, 150);
});
```

### Change 4: Add dropdown hover handlers (new, after mouseleave)
Keep dropdown open when hovering over it:
```javascript
language_dropdown.addEventListener('mouseenter', () => {
  if (!should_hide_dropdown()) return;
  clearTimeout(hover_timeout);
});

language_dropdown.addEventListener('mouseleave', () => {
  if (!should_hide_dropdown()) return;
  hover_timeout = setTimeout(() => {
    if (is_open) {
      toggle_dropdown(false);
    }
  }, 150);
});
```

### Change 5: Modify click handler (~Line 222-226)
Click should close if open (allow hover to handle opening):
```javascript
language_btn.addEventListener('click', (e) => {
  if (!should_hide_dropdown()) return;
  e.stopPropagation();
  if (is_open) {
    toggle_dropdown(false);
  }
});
```

### Change 6: Add integration helper (new, in utility functions)
Close nav dropdowns when language selector opens:
```javascript
const close_nav_dropdowns = () => {
  // Dispatch event for nav_dropdown.js to listen to
  document.dispatchEvent(new CustomEvent('language-selector:open'));
};
```
<!-- /ANCHOR:implementation-changes -->

<!-- ANCHOR:post-implementation -->
## Post-Implementation
1. Run minification
2. Verify minification
3. Browser test on staging
4. Update CDN version if deploying
<!-- /ANCHOR:post-implementation -->
