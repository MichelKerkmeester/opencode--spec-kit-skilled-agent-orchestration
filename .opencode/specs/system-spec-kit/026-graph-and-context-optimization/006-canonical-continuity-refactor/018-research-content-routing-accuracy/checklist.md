---
title: "Research: Content Routing Classification Accuracy - Checklist"
status: planned
---

# Verification Checklist: Content Routing Classification Accuracy

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

## P1 (Should Fix)

- [ ] `metadata_only` saves always land in the implementation summary doc regardless of current file
- [ ] Zero mentions of `SPECKIT_TIER3_ROUTING` as conditional/opt-in in active docs
- [ ] Sub-phases 001-003 pass `validate.sh --strict`

## P2 (Advisory)

- [ ] Phase 004 verification sweep includes removed-flag check
