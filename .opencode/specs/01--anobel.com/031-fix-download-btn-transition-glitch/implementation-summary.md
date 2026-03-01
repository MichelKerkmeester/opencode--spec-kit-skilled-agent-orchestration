---
title: "Implementation Summary [033-fix-download-btn-transition-glitch/implementation-summary]"
description: "Fixed visual glitch on the download button where the checkmark (success) and download arrow icons overlapped during the ready -> idle state transition."
trigger_phrases:
  - "implementation"
  - "summary"
  - "implementation summary"
  - "033"
  - "fix"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Implementation Summary

## Change
Fixed visual glitch on the download button where the checkmark (success) and download arrow icons overlapped during the `ready -> idle` state transition.

## Root Cause
The download button component uses CSS transitions driven by `data-download-state` attribute. When transitioning from `ready` back to `idle`:
- All `transition-delay` values (defined only in `ready` state rules) disappeared
- The clip-path opened (0.5s), arrow slid back (0.5s), and checkmark stroke animated back (0.4s) all simultaneously
- For ~400ms both icons were partially visible, creating the reported glitch

## Fix Applied
**File:** `src/1_css/btn_download.css` (105 -> 127 lines, +22 lines)

1. **Added `opacity: 0` to `[data-download-success]` in base state** (line 33-34)
   - Hides the checkmark SVG by default using opacity instead of relying solely on stroke-dashoffset

2. **Added `opacity: 1` with transition in ready state only** (lines 112-117)
   - Transition is only defined in the ready-state rule
   - When leaving ready, opacity snaps to 0 instantly (no base transition exists)
   - Prevents the overlap flash entirely

3. **Added defensive CSS for `fallback` state** (lines 119-126)
   - `pointer-events: none` during fallback to prevent double-clicks
   - Previously no CSS rules existed for this state (set when fetch fails)

<!-- ANCHOR:verification -->
## Verification
Tested via `bdg` browser-debugger-cli with rapid screenshot capture (300ms intervals):
- Idle state: download arrow visible, no checkmark leak
- Ready state: checkmark draws correctly with stroke animation
- Ready->idle transition: **no overlap glitch** - checkmark disappears instantly, arrow slides back cleanly
- Fallback state: button appearance matches idle (defensive)


<!-- /ANCHOR:verification -->

## No JS Changes
The JavaScript state machine (`btn_download.js`) was not modified - the fix is CSS-only.

## Deployment Note
This CSS file needs to be deployed to the CDN or embedded in Webflow. No JS minification needed.

## Regression Update (2024-02-07)
The initial fix (`opacity: 0`) was insufficient in some browser contexts where `transition` properties persisted, causing a ghosting effect.
**Robust Fix Applied:**
- Added `visibility: hidden` and `transition: none` to the base state of `[data-download-success]`.
- This ensures the element is removed from the visual flow instantly upon state change, regardless of opacity transition duration.

## Specificity Update (2024-02-07 - Attempt 2)
Webflow's generated CSS uses class selectors like `.icon--download.is--success` (specificity 0,2,0) which overrode our attribute selector `[data-download-success]` (specificity 0,1,0).
**Change:**
- Added `!important` to `opacity`, `visibility`, and `transition` properties in `src/1_css/btn_download.css` to guarantee override.

