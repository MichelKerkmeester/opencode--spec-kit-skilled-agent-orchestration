---
title: "Tasks [033-fix-download-btn-transition-glitch/tasks]"
description: "tasks document for 033-fix-download-btn-transition-glitch."
trigger_phrases:
  - "tasks"
  - "033"
  - "fix"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Tasks

<!-- ANCHOR:phase-1 -->
- [x] Investigate download button HTML structure and CSS states
- [x] Reproduce glitch via bdg screenshots during state transitions
- [x] Identify root cause (simultaneous transitions on ready->idle)
- [x] Implement CSS fix (opacity on success SVG + fallback state)
- [x] Verify fix in browser (bdg rapid screenshot capture, all states tested)
- [x] Create implementation summary

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Regression Fix (2024-02-07)
- [x] Implement robust CSS fix (visibility: hidden + transition: none) to force instant hide
- [x] Verify fix with `bdg` simulation

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Specificity Fix (2024-02-07 - Attempt 2)
- [ ] Add `!important` to `btn_download.css` rules to override Webflow classes
- [ ] Verify class specificity conflict in exported code

<!-- /ANCHOR:phase-3 -->

