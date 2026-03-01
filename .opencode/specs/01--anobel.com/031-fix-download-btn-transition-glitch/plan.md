---
title: "Plan: Fix Download Button Transition Glitch [033-fix-download-btn-transition-glitch/plan]"
description: "1. Add opacity-based hiding for [data-download-success] SVG in base state"
trigger_phrases:
  - "plan"
  - "fix"
  - "download"
  - "button"
  - "transition"
  - "033"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Plan: Fix Download Button Transition Glitch

<!-- ANCHOR:summary -->
## Steps
1. Add opacity-based hiding for `[data-download-success]` SVG in base state
2. Add opacity reveal in `ready` state with appropriate delay
3. Add defensive CSS for `fallback` state (mirror idle behavior)
4. Verify in browser that transition no longer shows overlap glitch
5. Verify the drawing animation still works in ready state

<!-- /ANCHOR:summary -->

<!-- ANCHOR:what-built -->
## Files Modified
- `src/1_css/btn_download.css`

<!-- /ANCHOR:what-built -->
