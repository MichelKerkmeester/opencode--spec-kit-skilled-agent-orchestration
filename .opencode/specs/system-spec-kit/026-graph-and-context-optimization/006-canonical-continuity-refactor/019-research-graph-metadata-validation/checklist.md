---
title: "Research: Graph Metadata Quality & Relationship Validation - Checklist"
status: planned
---

# Verification Checklist: Graph Metadata Quality & Relationship Validation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

## P1 (Should Fix)

- [ ] Command-shaped `key_files` entries = 0 after tightened filter
- [ ] Backfill test passes 3/3
- [ ] Root 019 + sub-phases 001-004 all pass `validate.sh --strict`

## P2 (Advisory)

- [ ] Entity path matching scoped to prevent cross-packet attribution
- [ ] Status normalization catches all known variants (done, completed, active, in-progress)
