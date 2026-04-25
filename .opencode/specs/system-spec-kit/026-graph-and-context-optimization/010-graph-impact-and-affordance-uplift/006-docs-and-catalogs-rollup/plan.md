---
title: "Plan: Docs and Catalogs Rollup (012/006)"
description: "Umbrella doc updates after 012/002-005 ship."
importance_tier: "important"
contextType: "implementation"
---
# Plan: 012/006

<!-- SPECKIT_LEVEL: 2 -->

## Steps

### A. Read what shipped
1. Read `012/002/implementation-summary.md` — phase runner + detect_changes
2. Read `012/003/implementation-summary.md` — edge explanation + blast_radius uplift
3. Read `012/004/implementation-summary.md` — affordance evidence
4. Read `012/005/implementation-summary.md` — Memory trust display
5. List actual capabilities shipped (no aspirational text)

### B. Update umbrella docs (in order)
6. `/README.md` (root) — add new capabilities to features section
7. `.opencode/skill/system-spec-kit/SKILL.md` — update capability matrix
8. `.opencode/skill/system-spec-kit/README.md` — update feature index
9. `.opencode/skill/system-spec-kit/mcp_server/README.md` — add `detect_changes` to handler list; note enriched query/blast_radius/skill-advisor lanes/memory badges
10. `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` — add verification steps for each new capability

### C. Update catalog indexes
11. `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` — list new per-packet entries (categories 03, 06, 11, 13, 14)
12. `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` — list new per-packet playbook entries

### D. Update phase map
13. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/merged-phase-map.md` — add 012 entry

### E. DQI
14. Run sk-doc on each umbrella doc — score ≥85
15. Remediate any DQI issues
16. Link check (manual or via grep)

### F. Verification
17. INSTALL_GUIDE smoke tests run successfully
18. `validate.sh --strict` on `012/006/`
19. Populate `implementation-summary.md` with before/after diff summary

## Dependencies
- 012/002, 012/003, 012/004, 012/005 must be `complete`

## Effort
M (3-4h)

## References
- spec.md (this folder), tasks.md, checklist.md
- sk-doc skill
