---
title: "...e/001-fix-command-dispatch/z_archive/044-speckit-test-suite/scratch/test-agent-07-validation/test-evidence/checklist]"
description: "checklist document for test-evidence."
trigger_phrases:
  - "checklist"
  - "test"
  - "evidence"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Checklist

<!-- ANCHOR:protocol -->
## P0
- [x] P0: Completed item WITHOUT evidence - should trigger warning
- [x] P0: Completed item with evidence [EVIDENCE: tested manually]

<!-- /ANCHOR:protocol -->
## P1
- [x] P1: Completed without evidence - should trigger warning
- [ ] P1: Not completed - exempt

## P2
- [x] P2: Completed without evidence - P2 is exempt from evidence requirement
