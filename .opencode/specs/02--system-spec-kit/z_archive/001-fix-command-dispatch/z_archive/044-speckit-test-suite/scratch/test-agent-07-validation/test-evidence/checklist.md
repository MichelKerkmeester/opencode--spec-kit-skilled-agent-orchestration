---
title: "Checklist [test-evidence/checklist]"
description: "checklist document for test-evidence."
trigger_phrases:
  - "checklist"
  - "test"
  - "evidence"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist

## P0
- [x] P0: Completed item WITHOUT evidence - should trigger warning
- [x] P0: Completed item with evidence [EVIDENCE: tested manually]

## P1
- [x] P1: Completed without evidence - should trigger warning
- [ ] P1: Not completed - exempt

## P2
- [x] P2: Completed without evidence - P2 is exempt from evidence requirement
