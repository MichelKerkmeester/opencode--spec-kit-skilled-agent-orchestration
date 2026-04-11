---
title: "Verification Checklist: Memory Deep Quality Investigation"
description: "P0/P1/P2 verification for the investigation phase — read-only root cause analysis."
trigger_phrases:
  - "memory investigation checklist"
  - "root cause verification"
  - "phase 005 verification"
importance_tier: "normal"
contextType: "research"
---
# Verification Checklist: Memory Deep Quality Investigation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `scratch/deep-findings.json` loaded and 562 findings confirmed
- [ ] CHK-002 [P0] Generator source tree inventoried and mapped to finding categories
- [ ] CHK-003 [P1] Sample files selected for each of the 16 categories (3 per category)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] the root-causes document has one section per finding category (16/16)
- [ ] CHK-011 [P0] Each root cause cites specific file path, function name, or line number
- [ ] CHK-012 [P0] Every category classified as: generator_bug / template_bug / upstream_bug / historical_accept
- [ ] CHK-013 [P1] the downstream-impact document quantifies blast radius per category
- [ ] CHK-014 [P1] the phase-006-proposal document drafted with P0/P1/P2 priorities
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Hypotheses verified against 3+ sample files per category
- [ ] CHK-021 [P0] No generator code modified (`git diff --stat` shows 0 changes outside this phase folder)
- [ ] CHK-022 [P0] No memory files modified
- [ ] CHK-023 [P1] Cross-category overlap analyzed (grouped by shared root cause)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Investigation is read-only — no file writes outside this phase folder
- [ ] CHK-031 [P1] No secrets or credentials referenced in root-causes.md
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, tasks.md, checklist.md synchronized
- [ ] CHK-041 [P1] implementation-summary.md written with evidence
- [ ] CHK-042 [P2] Phase 006 proposal is actionable and approvable
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Investigation artifacts in this phase folder only
- [ ] CHK-051 [P1] Baseline inputs retained in `scratch/`
- [ ] CHK-052 [P2] Findings saved to memory/ at phase close
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | [ ]/10 |
| P1 Items | 9 | [ ]/9 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->
