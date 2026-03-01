---
title: "Implementation Plan - Performance Hacks [016-performance-hacks/plan]"
description: "plan document for 016-performance-hacks."
trigger_phrases:
  - "implementation"
  - "plan"
  - "performance"
  - "hacks"
  - "016"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan - Performance Hacks

> **Goal:** Apply quick wins to boost LCP and FCP.

<!-- ANCHOR:phase-1-global-optimizations-globalhtml -->
## Phase 1: Global Optimizations (global.html)
- [ ] Remove Typekit script.
- [ ] Remove non-critical preloads (`dropdown`, `mobile_menu`, `cookie`).
- [ ] Add "Page Ready" safety fallback script (inline).
<!-- /ANCHOR:phase-1-global-optimizations-globalhtml -->

<!-- ANCHOR:phase-2-page-level-optimizations-homehtml -->
## Phase 2: Page-Level Optimizations (home.html)
- [ ] Change marquee logo loading from `eager` to `lazy`.
- [ ] Verify Hero video `fetchpriority` (already confirmed, but good to double check).
<!-- /ANCHOR:phase-2-page-level-optimizations-homehtml -->

<!-- ANCHOR:phase-3-verification -->
## Phase 3: Verification
- [ ] Review code changes.
<!-- /ANCHOR:phase-3-verification -->
