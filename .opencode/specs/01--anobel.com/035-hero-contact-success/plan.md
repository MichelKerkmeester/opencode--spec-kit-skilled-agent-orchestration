---
title: "Plan: Hero Webshop Selector Scoping [036-hero-contact-success/plan]"
description: "Replace CSS class selectors with data-target attribute selectors in hero_webshop.js to prevent unintended DOM manipulation on non-webshop pages."
trigger_phrases:
  - "plan"
  - "hero"
  - "webshop"
  - "selectors"
  - "036"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: v2.2 -->

# Plan: Hero Webshop Selector Scoping

<!-- ANCHOR:summary -->
## Steps
1. Replace all CSS class selectors in the `SELECTORS` object with `data-target` attribute selectors
2. Scope the section selector with `.is--webshop` qualifier (matching `hero_cards.js` pattern)
3. Verify the selector mapping covers all 12 selectors
4. Minify and deploy updated script to CDN (separate step)
5. Add corresponding `data-target` attributes in Webflow Designer (separate step)

<!-- /ANCHOR:summary -->

<!-- ANCHOR:selector-mapping -->
## Selector Mapping

| Element          | Before (class)                        | After (attribute)                       |
| ---------------- | ------------------------------------- | --------------------------------------- |
| page_wrapper     | `[data-target='page-wrapper']`        | `[data-target='page-wrapper']` (no change) |
| section          | `.hero--section:not(...)`             | `[data-target='hero-section'].is--webshop:not(...)` |
| frame            | `.hero--frame.is--webshop`            | `[data-target='hero-frame']`            |
| list_wrapper     | `.hero--list-w.is--webshop`           | `[data-target='hero-list-w']`           |
| card_hero        | `.card--hero`                         | `[data-target='hero-card']`             |
| header           | `.hero--header`                       | `[data-target='hero-header']`           |
| pointer_line     | `.hero--pointer-line`                 | `[data-target='hero-pointer-line']`     |
| pointer_bullet   | `.hero--pointer-bullet`               | `[data-target='hero-pointer-bullet']`   |
| sub_heading      | `.hero--sub-heading`                  | `[data-target='hero-sub-heading']`      |
| desc_container   | `.hero--description .container`       | `[data-target='hero-desc-container']`   |
| cta_wrapper      | `.hero--btn-w`                        | `[data-target='hero-btn-w']`            |
| image            | `.hero--image.is--webshop`            | `[data-target='hero-image']`            |

<!-- /ANCHOR:selector-mapping -->

<!-- ANCHOR:what-built -->
## Files Modified
- `src/2_javascript/hero/hero_webshop.js`

<!-- /ANCHOR:what-built -->
