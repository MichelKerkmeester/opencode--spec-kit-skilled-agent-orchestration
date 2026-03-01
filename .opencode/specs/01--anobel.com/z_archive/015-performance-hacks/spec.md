---
title: "Specification: Additional Performance Hacks [016-performance-hacks/spec]"
description: "Implementation of high-impact, low-effort performance optimizations (\"hacks\") for anobel.com to improve LCP and FCP scores."
trigger_phrases:
  - "specification"
  - "additional"
  - "performance"
  - "hacks"
  - "spec"
  - "016"
importance_tier: "important"
contextType: "decision"
---
# Specification: Additional Performance Hacks

<!-- ANCHOR:overview -->
## 1. Overview
Implementation of high-impact, low-effort performance optimizations ("hacks") for anobel.com to improve LCP and FCP scores.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:problem -->
## 2. Problem
- **Blocked FCP:** The current implementation hides the page content (`opacity: 0`) until JavaScript loads and executes (`page-ready`), causing a white screen delay.
- **Unused Blocking Script:** The Adobe Fonts (Typekit) script is still present but unused (fonts are self-hosted).
- **Aggressive Preloading:** Interaction-heavy scripts (dropdown, mobile menu) are preloaded, competing with critical LCP assets.
- **Eager Loading Below Fold:** Marquee logos are set to `loading="eager"` but are likely below the fold on many devices.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:goals -->
## 3. Goals
- **Eliminate White Screen:** Ensure the hero section is visible immediately or significantly sooner.
- **Reduce Blocking Requests:** Remove Typekit.
- **Prioritize LCP:** Focus preloading on Hero assets only.
- **Defer Non-Critical:** Lazy load non-LCP images.
<!-- /ANCHOR:goals -->

<!-- ANCHOR:implementation-details -->
## 4. Implementation Details

### 4.1 Remove Typekit
- **Action:** Delete `<script src="https://use.typekit.net/grw1wnt.js"...>` from `src/0_html/global.html`.

### 4.2 Fix "White Screen" Fade-in
- **Context:** `hero_video.js` (and others) adds `.page-ready` class to `.page--wrapper` (which is `opacity: 0`).
- **Action:** Add an inline script in `global.html` (immediately after opening `<body>` or in `<head>`) that sets a safety timeout to add `page-ready` if it hasn't been added within 200ms-500ms. This prevents the user from staring at a blank screen if external scripts hang.
- **Better Action:** Change the CSS strategy? No, inline script is safer "hack" without breaking the animation logic intended by the developers.

### 4.3 Optimize Preloads
- **Action:** In `src/0_html/global.html`:
    - Remove preloads for `dropdown.js`, `mobile_menu.js`, `modal_cookie_consent.js`.
    - Keep preload for `lenis.css`, `motion` (ESM) if critical (it seems used for hero).

### 4.4 Lazy Load Marquee
- **Action:** Edit `src/0_html/home.html` (which seems to be the source of the marquee section) to set `loading="lazy"` on client logos.
<!-- /ANCHOR:implementation-details -->

<!-- ANCHOR:verification -->
## 5. Verification
- **Manual:** Check `global.html` and `home.html` for changes.
- **Logic:** Confirm the safety timeout script is syntactically correct.
<!-- /ANCHOR:verification -->
