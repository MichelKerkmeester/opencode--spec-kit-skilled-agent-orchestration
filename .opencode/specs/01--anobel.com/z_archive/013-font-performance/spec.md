---
title: "Specification: Font Performance Optimization [014-font-performance/spec]"
description: "This specification outlines the implementation of font performance optimizations for anobel.com. The goal is to improve the site's Core Web Vitals (specifically LCP) and user ex..."
trigger_phrases:
  - "specification"
  - "font"
  - "performance"
  - "optimization"
  - "spec"
  - "014"
importance_tier: "important"
contextType: "decision"
---
# Specification: Font Performance Optimization

<!-- ANCHOR:overview -->
## 1. Overview
This specification outlines the implementation of font performance optimizations for anobel.com. The goal is to improve the site's Core Web Vitals (specifically LCP) and user experience by eliminating "Flash of Invisible Text" (FOIT) and ensuring smoother font loading.

The optimizations include:
1.  **font-display: swap**: Ensuring text remains visible during font loading.
2.  **Font Preloading**: Prioritizing the loading of critical font files.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:goals -->
## 2. Goals
- Eliminate FOIT (Flash of Invisible Text) during page load.
- Improve Largest Contentful Paint (LCP) score.
- Enhance perceived performance for users.
- Provide a clear guide for the Webflow user to configure Adobe Fonts correctly.
<!-- /ANCHOR:goals -->

<!-- ANCHOR:implementation-details -->
## 3. Implementation Details

### 3.1 Font Loading Strategy
The site uses Adobe Fonts (Typekit) to load the "Silka Webfont" family.
- **Kit ID:** `grw1wnt`
- **Current Script:** `<script src="https://use.typekit.net/grw1wnt.js" type="text/javascript"></script>`

### 3.2 `font-display: swap`
Since Adobe Fonts controls the `@font-face` CSS generation, we cannot directly modify the CSS to add `font-display: swap`.
- **Solution:** Configure "Font Display: Swap" within the Adobe Fonts Project settings.
- **Action:** Provide a detailed "Webflow User Guide" for the site administrator to perform this one-time configuration.

### 3.3 Font Preloading
We need to preload the critical `.woff2` font file to ensure it starts downloading immediately.
- **File:** `src/0_html/global.html`
- **Change:** Add `<link rel="preload">` to the `<head>` section.
- **Attribute:** `crossorigin` is required as fonts are fetched via CORS.
- **URL Strategy:** Since the Typekit URL is dynamic/managed by Adobe, we will ask the user for the specific URL or use a placeholder if they cannot provide it immediately.
<!-- /ANCHOR:implementation-details -->

<!-- ANCHOR:verification-plan -->
## 4. Verification Plan
- **Manual Verification:** Inspect network waterfall to confirm font is preloaded.
- **Visual Verification:** Confirm text is visible immediately (system font) before swapping to custom font (simulated slow connection).
- **Lighthouse/DevTools:** Measure LCP impact.
<!-- /ANCHOR:verification-plan -->

<!-- ANCHOR:constraints-risks -->
## 5. Constraints & Risks
- **Adobe Fonts URL Stability:** If Adobe changes the font URL schema, the preload link might break (404). We should document how to update this.
- **CDN Caching:** Changes might take time to propagate if heavily cached.
<!-- /ANCHOR:constraints-risks -->

<!-- ANCHOR:resources -->
## 6. Resources
- [MDN: font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)
- [web.dev: Optimize WebFont loading](https://web.dev/optimize-webfont-loading/)
<!-- /ANCHOR:resources -->
