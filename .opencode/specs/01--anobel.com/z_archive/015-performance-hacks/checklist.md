---
title: "Checklist: Performance Hacks [016-performance-hacks/checklist]"
description: "checklist document for 016-performance-hacks."
trigger_phrases:
  - "checklist"
  - "performance"
  - "hacks"
  - "016"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Performance Hacks

<!-- ANCHOR:blockers -->
## P0 - Blockers
- [ ] Typekit script removed from `global.html` [Evidence: File diff]
- [ ] Non-critical preloads removed from `global.html` [Evidence: File diff]
- [ ] Safety fallback script added to `global.html` [Evidence: File diff]
<!-- /ANCHOR:blockers -->

<!-- ANCHOR:required -->
## P1 - Required
- [ ] Marquee images set to `loading="lazy"` in `home.html` [Evidence: File diff]
<!-- /ANCHOR:required -->
