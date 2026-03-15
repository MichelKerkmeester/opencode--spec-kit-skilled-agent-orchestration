---
title: "Implementation Summary [036-hero-contact-success/implementation-summary]"
description: "Replaced CSS class selectors with data-target attribute selectors in hero_webshop.js to fix persistent blue bar on contact-success page."
trigger_phrases:
  - "implementation"
  - "summary"
  - "036"
  - "hero"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: v2.2 -->

# Implementation Summary

## What Changed
Replaced all 11 CSS class selectors in `hero_webshop.js` `SELECTORS` config with `data-target` attribute selectors, matching the established pattern from `hero_cards.js`.

**Critical change:** Section selector now uses `[data-target='hero-section'].is--webshop` instead of `.hero--section`, ensuring the script only targets hero sections explicitly marked for webshop animations.

## Why
The broad `.hero--section` selector matched hero elements on the contact-success page, which has a different hero type (no `.is--webshop` frame). The script partially initialized that hero — setting inline styles on `.hero--pointer-line` (height: 100%, extending 1908px) and `.hero--pointer-bullet` (blue bg) — causing a persistent blue bar artifact at the top of the page.

## File Modified
- `src/2_javascript/hero/hero_webshop.js` — Lines 13-25 (SELECTORS object)

## Pending
- Minification and CDN deployment
- Adding `data-target` attributes in Webflow Designer
