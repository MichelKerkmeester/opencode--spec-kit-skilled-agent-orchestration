---
title: "Checklist: 016-Feature Catalog Code References"
description: "Verification checklist for feature catalog inline reference work."
trigger_phrases: ["checklist", "feature catalog references"]
importance_tier: "normal"
contextType: "general"
---
# Checklist: 016-Feature Catalog Code References

---

## P0 - Blockers

- [ ] **CHK-001**: Zero inline comments reference `Sprint \d+` in non-test `.ts` files
- [ ] **CHK-002**: Zero inline comments reference `Phase \d+` in non-test `.ts` files
- [ ] **CHK-003**: Zero inline comments reference specific spec folder numbers (e.g., `spec 013`, `specs/NNN`)
- [ ] **CHK-004**: All handler files have at least one `// Feature catalog: <name>` reference
- [ ] **CHK-005**: All `Feature catalog:` references use feature name only, no folder numbers

## P1 - Required

- [ ] **CHK-006**: Core lib modules in `lib/search/`, `lib/scoring/`, `lib/cognitive/` have feature catalog references
- [ ] **CHK-007**: Shared algorithm modules have feature catalog references
- [ ] **CHK-008**: No existing general-purpose comments were removed
- [ ] **CHK-009**: References follow the `// Feature catalog: <name>` format consistently

## P2 - Quality

- [ ] **CHK-010**: TypeScript compiles cleanly (`tsc --noEmit`)
- [ ] **CHK-011**: Comments are concise (single line where possible)
- [ ] **CHK-012**: Files implementing multiple features list all applicable catalog entries
- [ ] **CHK-013**: No feature catalog references point to non-existent feature names
