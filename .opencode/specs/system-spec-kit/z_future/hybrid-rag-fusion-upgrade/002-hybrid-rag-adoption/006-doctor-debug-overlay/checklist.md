---
title: "Checklis [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/006-doctor-debug-overlay/checklist]"
description: "checklist document for 006-doctor-debug-overlay."
trigger_phrases:
  - "checklis"
  - "checklist"
  - "006"
  - "doctor"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: 006-doctor-debug-overlay

## P0
- [ ] The overlay is summary-only and bounded.
- [ ] `memory_health` and `memory_save` remain the underlying authorities.
- [ ] Raw-content logging is rejected.

## P1
- [ ] Existing repair-confirmation and dry-run flows are preserved.
- [ ] Routing/debug hints are additive rather than authoritative.

