---
title: "Checklist: Font Performance [014-font-performance/checklist]"
description: "checklist document for 014-font-performance."
trigger_phrases:
  - "checklist"
  - "font"
  - "performance"
  - "014"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Font Performance

<!-- ANCHOR:blockers -->
## P0 - Blockers
- [x] `webflow_guide.md` created and accurate [Evidence: File exists]
- [x] `global.html` updated with preload tag [Evidence: File edit completed]
<!-- /ANCHOR:blockers -->

<!-- ANCHOR:required -->
## P1 - Required
- [x] Preload tag has `as="font"`, `type="font/woff2"`, and `crossorigin` attributes [Evidence: Verified in global.html]
- [x] Preload tag is placed in the correct section of `<head>` [Evidence: Verified in global.html]
<!-- /ANCHOR:required -->
