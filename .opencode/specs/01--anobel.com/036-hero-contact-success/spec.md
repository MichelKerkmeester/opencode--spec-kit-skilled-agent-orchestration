---
title: "Spec: Hero Webshop Selector Scoping [036-hero-contact-success/spec]"
description: "hero_webshop.js uses broad CSS class selectors (.hero--section) that match hero sections on non-webshop pages like contact-success, causing unintended DOM manipulation and a persistent blue bar artifact."
trigger_phrases:
  - "spec"
  - "hero"
  - "webshop"
  - "contact-success"
  - "blue bar"
  - "selectors"
  - "036"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: v2.2 -->

# Spec: Hero Webshop Selector Scoping

<!-- ANCHOR:problem -->
## Problem
The `hero_webshop.js` script uses broad CSS class selectors (e.g., `.hero--section`, `.hero--header`, `.hero--pointer-line`) that match hero elements on **any** page, not just webshop pages. On `/en/contact-success`, the hero section exists but uses a different hero type — its `.hero--frame` lacks the `.is--webshop` class.

**Result:** The script finds `.hero--section`, skips most children (frame, card, headers not found), but still matches and manipulates `.hero--pointer-line` and `.hero--pointer-bullet` with inline styles (`height: 100%`, `transform: none`). This causes a persistent blue bar artifact at the top of the page.

**Root cause confirmed via Chrome DevTools (bdg):**
- `.hero--frame.is--webshop` → NOT found (frame is `.hero--frame` without `.is--webshop`)
- `.hero--pointer-line` → FOUND, receives inline `height: 100%; transform-origin: center top;` (extends 1908px, far beyond the 1000px section)
- `.hero--pointer-bullet` → FOUND, receives inline `transform: none;` with blue bg `rgb(6, 69, 140)`
- `<body>` has `background: rgb(6, 69, 140)` — any layout overflow exposes the blue body background
<!-- /ANCHOR:problem -->

## Root Cause
The `hero_cards.js` script (used on the contact page) correctly scopes its section selector with `[data-target='hero-section'].is--cards`, requiring both a `data-target` attribute AND a type-specific class. The `hero_webshop.js` script uses bare CSS class selectors without type scoping, causing it to match hero sections on unrelated pages.

## Solution
Migrate all selectors in `hero_webshop.js` from CSS class selectors to `data-target` attribute selectors, matching the established pattern in `hero_cards.js`. The section selector uses `[data-target='hero-section'].is--webshop` to scope exclusively to webshop hero sections.

<!-- ANCHOR:scope -->
## Scope
- `src/2_javascript/hero/hero_webshop.js` — Replace all CSS class selectors in `SELECTORS` config with `data-target` attribute selectors

<!-- /ANCHOR:scope -->

## Out of Scope
- Webflow HTML changes (adding `data-target` attributes to elements) — separate task
- Other hero scripts (`hero_cards.js`, `hero_video.js`)
- Minification and CDN deployment
