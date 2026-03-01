---
title: "Spec: Fix Download Button Transition Glitch [033-fix-download-btn-transition-glitch/spec]"
description: "The download button at /nl/locatie shows a visual glitch during the ready -> idle state transition. Both the checkmark (success) SVG and the download arrow SVG are briefly visib..."
trigger_phrases:
  - "spec"
  - "fix"
  - "download"
  - "button"
  - "transition"
  - "033"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 1 -->

<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Spec: Fix Download Button Transition Glitch

<!-- ANCHOR:problem -->
## Problem
The download button at `/nl/locatie` shows a visual glitch during the `ready -> idle` state transition. Both the checkmark (success) SVG and the download arrow SVG are briefly visible simultaneously, creating a ~200-400ms overlap flash.


<!-- /ANCHOR:problem -->

## Root Cause
The download button component uses `data-download-state` attribute with CSS-driven transitions across four states: `idle`, `downloading`, `ready`, `fallback`.

During the `ready -> idle` transition:
1. All CSS `transition-delay` values (defined only in the `[data-download-state="ready"]` rules) disappear
2. The clip-path opens (0.5s), arrow slides back (0.5s), and checkmark stroke hides (0.4s) all start simultaneously
3. For ~400ms both icons overlap visually

Secondary issue: No CSS rules exist for the `fallback` state (set when fetch fails), leaving it unstyled.

## Solution
CSS-only fix in `src/1_css/btn_download.css`:
1. Add `opacity: 0` to `[data-download-success]` in base state to hide checkmark by default
2. Add `opacity: 1` with delayed transition only in `ready` state rules
3. When leaving ready, opacity snaps to 0 instantly (no base transition), preventing overlap
4. Add defensive CSS for `fallback` state

<!-- ANCHOR:scope -->
## Scope
- `src/1_css/btn_download.css` - Add opacity rules for success SVG + fallback state


<!-- /ANCHOR:scope -->

## Out of Scope
- JavaScript changes (state machine logic is correct)
- Other button variants or pages

## Regression Analysis (2024-02-07)
User reported glitch persists after cache refresh. Screenshot shows checkmark still visible during transition.

**Root Cause:**
`opacity: 0` alone was insufficient because `transition` property persisted as `all` (browser default or inherited) in some contexts, preventing instant snap to 0.

**Fix:**
Enforce `visibility: hidden` and `transition: none` on the base state to guarantee instant disappearance of the checkmark when leaving `ready` state.

## Specificity Fix (2024-02-07 - Attempt 2)
The previous fix failed because Webflow's class selectors (e.g., `.icon--download.is--success`) have higher specificity (0,2,0) than the attribute selector `[data-download-success]` (0,1,0).
**New Fix:**
Add `!important` to all critical properties in `src/1_css/btn_download.css` to ensure they override Webflow's default styles regardless of specificity.

