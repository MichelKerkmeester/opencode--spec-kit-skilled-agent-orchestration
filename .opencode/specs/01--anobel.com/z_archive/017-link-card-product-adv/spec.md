---
title: "Link Card Product/Adv - CTA Button Hover Animation [018-link-card-product-adv/spec]"
description: "Extend the link card ad hover state to trigger the CTA button Secondary-Full animations, including"
trigger_phrases:
  - "link"
  - "card"
  - "product"
  - "adv"
  - "cta"
  - "spec"
  - "018"
importance_tier: "important"
contextType: "decision"
---
# Link Card Product/Adv - CTA Button Hover Animation

<!-- ANCHOR:overview -->
## Overview
Extend the link card ad hover state to trigger the CTA button Secondary-Full animations, including:
- Main button border color change (neutral-dark → brand-dark)
- Icon button background color change (brand-base → brand-dark)
- Icon swap animation (static icon slides out, animated icon slides in)
<!-- /ANCHOR:overview -->

<!-- ANCHOR:requirements -->
## Requirements
1. When `[data-adv]` card is hovered, trigger CTA button hover styles
2. Use existing state machine pattern (`--_state---on` / `--_state---off`)
3. Support focus states for accessibility
4. Respect `prefers-reduced-motion`
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:scope -->
## Scope
- File: `src/1_css/animations/link_card_ad.css`
- Pattern: Extend existing state machine integration
<!-- /ANCHOR:scope -->

<!-- ANCHOR:out-of-scope -->
## Out of Scope
- Changes to `btn_cta.css` (existing styles remain unchanged)
- JavaScript modifications
<!-- /ANCHOR:out-of-scope -->
