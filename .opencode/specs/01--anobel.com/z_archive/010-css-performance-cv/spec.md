---
title: "Specification: CSS Performance Upgrade (Content Visibility) [011-css-performance-cv/spec]"
description: "The content-visibility CSS property is a powerful performance primitive that allows the browser to skip the rendering work of an element's subtree until it is needed (i.e., when..."
trigger_phrases:
  - "specification"
  - "css"
  - "performance"
  - "upgrade"
  - "content"
  - "spec"
  - "011"
importance_tier: "important"
contextType: "decision"
---
# Specification: CSS Performance Upgrade (Content Visibility)

<!-- ANCHOR:context -->
## 1. Context
The `content-visibility` CSS property is a powerful performance primitive that allows the browser to skip the rendering work of an element's subtree until it is needed (i.e., when it approaches the viewport). This significantly reduces the initial page load time and main thread work for long pages.
<!-- /ANCHOR:context -->

<!-- ANCHOR:requirements -->
## 2. Requirements
- **Global Utility**: Implement as a global CSS utility class.
- **Naming Convention**: Follow the project's BEM-like `.nobel--` convention (using `.nobel-perf--` for clarity).
- **Stability**: Use `contain-intrinsic-size` to prevent layout shifts (scroll jumping) when content is skipped.
- **Flexibility**: Provide modifiers for different section sizes (small, large).
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:implementation-details -->
## 3. Implementation Details
**File:** `src/1_css/global/performance.css`

**Classes:**
- `.nobel-perf--cv-section`: Base class with `content-visibility: auto`.
- `.nobel-perf--cv-section.is--small`: Estimate 400px height.
- `.nobel-perf--cv-section.is--large`: Estimate 1200px height.
- Default estimate: 800px.
<!-- /ANCHOR:implementation-details -->

<!-- ANCHOR:constraints -->
## 4. Constraints
- **Do not apply** to "Above the Fold" content (Hero).
- **Do not apply** to Header or Footer.
- **Do not apply** to parent containers of `position: sticky` elements (unless logic is verified).
<!-- /ANCHOR:constraints -->
