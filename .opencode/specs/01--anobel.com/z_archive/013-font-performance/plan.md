---
title: "Implementation Plan - Font Performance [014-font-performance/plan]"
description: "plan document for 014-font-performance."
trigger_phrases:
  - "implementation"
  - "plan"
  - "font"
  - "performance"
  - "014"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan - Font Performance

> **Goal:** Optimize font loading to improve LCP and eliminate FOIT.

<!-- ANCHOR:phase-1-preparation-user-guidance -->
## Phase 1: Preparation & User Guidance
- [ ] Create `webflow_guide.md` with instructions for Adobe Fonts configuration.
- [ ] Request specific font URL from user (pending response).
<!-- /ANCHOR:phase-1-preparation-user-guidance -->

<!-- ANCHOR:phase-2-implementation -->
## Phase 2: Implementation
- [ ] Update `src/0_html/global.html`:
    - [ ] Add `<link rel="preload" ...>` for the Silka font.
    - [ ] Place it high in the `<head>` (after preconnects).
<!-- /ANCHOR:phase-2-implementation -->

<!-- ANCHOR:phase-3-verification -->
## Phase 3: Verification
- [ ] Verify `global.html` syntax.
- [ ] Provide instructions for user to verify in staging/production.
<!-- /ANCHOR:phase-3-verification -->
