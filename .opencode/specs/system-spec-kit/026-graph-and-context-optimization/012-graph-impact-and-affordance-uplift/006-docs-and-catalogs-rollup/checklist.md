---
title: "Checklist: 012/006"
description: "Docs and catalogs rollup verification."
importance_tier: "important"
contextType: "implementation"
---
# Checklist: 012/006

<!-- SPECKIT_LEVEL: 2 -->

## P2 — Doc Quality
- [ ] sk-doc DQI ≥85 on `/README.md`
- [ ] sk-doc DQI ≥85 on `system-spec-kit/SKILL.md`
- [ ] sk-doc DQI ≥85 on `system-spec-kit/README.md`
- [ ] sk-doc DQI ≥85 on `mcp_server/README.md`
- [ ] sk-doc DQI ≥85 on `mcp_server/INSTALL_GUIDE.md`
- [ ] No broken links in any updated doc

## P2 — Sync Discipline
- [ ] All updated docs reflect actual capabilities from 002, 003, 004, and 005 implementation-summary.md files (not aspirational)
- [ ] feature_catalog top-level index lists new per-packet entries with correct paths
- [ ] manual_testing_playbook top-level index lists new per-packet entries
- [ ] merged-phase-map.md updated with 012 entry

## P2 — INSTALL_GUIDE
- [ ] Verification steps include at least one smoke test per new capability (detect_changes, blast_radius enrichment, affordance evidence, memory trust badges)
- [ ] Smoke tests run successfully end-to-end

## Phase Hand-off
- [ ] `validate.sh --strict` passes
- [ ] `implementation-summary.md` populated with before/after diff summary
- [ ] All sibling sub-phases (002-005) referenced

## References
- spec.md §4 (requirements), §5 (verification)
- 012/decision-record.md ADR-012-007
