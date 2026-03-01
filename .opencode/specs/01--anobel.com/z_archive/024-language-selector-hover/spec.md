---
title: "Spec: Language Selector - Desktop Hover to Open [026-language-selector-hover/spec]"
description: "Modify nav_language_selector.js to open the dropdown on hover (desktop only), matching the behavior of nav_dropdown.js."
trigger_phrases:
  - "spec"
  - "language"
  - "selector"
  - "desktop"
  - "hover"
  - "026"
importance_tier: "important"
contextType: "decision"
---
# Spec: Language Selector - Desktop Hover to Open

<!-- ANCHOR:overview -->
## Overview
Modify `nav_language_selector.js` to open the dropdown on hover (desktop only), matching the behavior of `nav_dropdown.js`.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-behavior -->
## Current Behavior
| Viewport | Trigger | Action |
|----------|---------|--------|
| Desktop | Click | Opens/closes dropdown |
| Desktop | Hover | Only animates button color |
| Mobile | N/A | Dropdown always visible (accordion style) |
<!-- /ANCHOR:current-behavior -->

<!-- ANCHOR:desired-behavior -->
## Desired Behavior
| Viewport | Trigger | Action |
|----------|---------|--------|
| Desktop | Hover (enter) | Opens dropdown |
| Desktop | Hover (leave) | Closes dropdown after 150ms delay |
| Desktop | Hover on dropdown | Keeps dropdown open |
| Desktop | Click | Closes dropdown if open |
| Mobile | N/A | No change (accordion style) |
<!-- /ANCHOR:desired-behavior -->

<!-- ANCHOR:reference-implementation -->
## Reference Implementation
`nav_dropdown.js` lines 299-343 - hover pattern with timeout
<!-- /ANCHOR:reference-implementation -->

<!-- ANCHOR:files-to-modify -->
## Files to Modify
- `src/2_javascript/navigation/nav_language_selector.js`
- `src/2_javascript/z_minified/navigation/nav_language_selector.js` (regenerate)
<!-- /ANCHOR:files-to-modify -->

<!-- ANCHOR:success-criteria -->
## Success Criteria
- [ ] Desktop: Dropdown opens on mouseenter
- [ ] Desktop: Dropdown closes on mouseleave with 150ms delay
- [ ] Desktop: Dropdown stays open when cursor moves to dropdown
- [ ] Desktop: Click closes dropdown if open
- [ ] Desktop: Nav dropdowns close when language selector opens
- [ ] Mobile: No behavior change
- [ ] No console errors
- [ ] Minified version works correctly
<!-- /ANCHOR:success-criteria -->
