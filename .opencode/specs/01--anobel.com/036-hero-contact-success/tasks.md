---
title: "Tasks [036-hero-contact-success/tasks]"
description: "Task tracking for hero_webshop.js selector scoping fix."
trigger_phrases:
  - "tasks"
  - "036"
  - "hero"
  - "webshop"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: v2.2 -->

# Tasks

<!-- ANCHOR:phase-1 -->
## Investigation
- [x] Inspect contact-success page DOM via Chrome DevTools (bdg)
- [x] Identify which hero_webshop.js selectors match on contact-success
- [x] Confirm root cause: broad class selectors match non-webshop hero elements
- [x] Compare with hero_cards.js selector pattern (data-target attributes)

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Implementation
- [x] Replace all 11 CSS class selectors with data-target attribute selectors
- [x] Add `.is--webshop` qualifier to section selector
- [ ] Minify updated script (`hero_webshop.min.js`)
- [ ] Deploy to Cloudflare R2 CDN with version bump
- [ ] Add `data-target` attributes to Webflow Designer elements

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Verification
- [ ] Verify contact-success page no longer shows blue bar
- [ ] Verify webshop page hero animation still works correctly
- [ ] Browser test on desktop and mobile

<!-- /ANCHOR:phase-3 -->
