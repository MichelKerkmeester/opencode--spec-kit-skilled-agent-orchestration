---
title: "Implementation Plan [018-link-card-product-adv/plan]"
description: "Leverage the existing state machine pattern to drive CTA button animations. The --_state---on variable toggles 0→1 on hover/focus, which can be used with calc() and color-mix() ..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "018"
  - "link"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan

<!-- ANCHOR:approach -->
## Approach
Leverage the existing state machine pattern to drive CTA button animations. The `--_state---on` variable toggles 0→1 on hover/focus, which can be used with `calc()` and `color-mix()` to interpolate between default and hover states.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:changes-required -->
## Changes Required

### 1. Add CTA Variables to `[data-adv]`
```css
[data-adv] {
  /* Existing variables... */
  
  /* CTA Main button */
  --adv-cta-border-default: var(--_color-tokens---border-neutral--dark);
  --adv-cta-border-hover: var(--_color-tokens---border-brand--dark);
  
  /* CTA Icon button */
  --adv-cta-icon-bg-default: var(--_color-tokens---bg-brand--base);
  --adv-cta-icon-bg-hover: var(--_color-tokens---bg-brand--dark);
}
```

### 2. Add CTA Main Border Animation
Target: `[data-adv][data-state] [data-hover="cta-main"]`
- Animate border-color from neutral-dark to brand-dark

### 3. Add CTA Icon Background Animation
Target: `[data-adv][data-state] [data-hover="cta-icon"]`
- Animate background-color from brand-base to brand-dark

### 4. Add Icon Swap Animation
Target: `[data-adv][data-state] [data-hover="cta-icon-static"]` and `[data-hover="cta-icon-animated"]`
- Static icon: opacity 1→0, translateX 0→100%
- Animated icon: opacity 0→1, translateX -100%→0

### 5. Update Reduced Motion
Add new selectors to the existing `@media (prefers-reduced-motion: reduce)` block.
<!-- /ANCHOR:changes-required -->

<!-- ANCHOR:dependencies -->
## Dependencies
- Webflow elements must have correct `data-hover` attributes
- Parent card must have `[data-adv][data-state]` attributes
<!-- /ANCHOR:dependencies -->
