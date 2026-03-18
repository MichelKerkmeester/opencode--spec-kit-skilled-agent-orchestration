# Verification Checklist: sk-deep-research Refinement via Self-Research

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available (3 external repos, spec 023 proposals)
- [ ] CHK-004 [P1] Research questions defined (RQ1-RQ8 in plan.md §4.1)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Deep research iterations produce valid JSONL state records
- [ ] CHK-011 [P0] Each iteration file follows iteration-NNN.md format with Assessment section
- [ ] CHK-012 [P1] Strategy.md updated correctly between iterations (Worked/Failed/Next Focus)
- [ ] CHK-013 [P1] Progressive synthesis updates to research.md are additive (no overwrites)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Deep research converges naturally (composite stop-score > 0.60)
- [ ] CHK-021 [P0] All 18 v2 proposals validated with status (confirmed/revised/deprecated/needs-data)
- [ ] CHK-022 [P1] At least 3 new improvement proposals discovered beyond v2 set
- [ ] CHK-023 [P1] All 3 external repos analyzed at source code level (not just README)
- [ ] CHK-024 [P1] Cross-runtime agent definition divergences documented
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No external repo credentials or tokens in research output
- [ ] CHK-031 [P0] WebFetch targets limited to the 3 approved GitHub repos
- [ ] CHK-032 [P1] Research output contains no sensitive internal paths or secrets
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] v3 improvement-proposals.md created with file-level change lists
- [ ] CHK-041 [P1] research.md synthesized from all iterations with cited sources
- [ ] CHK-042 [P2] Implementation sequencing updated for v3 proposals
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Iteration files in scratch/ only (iteration-NNN.md)
- [ ] CHK-051 [P1] State files in scratch/ (config.json, state.jsonl, strategy.md)
- [ ] CHK-052 [P2] Memory saved via generate-context.js to memory/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 0/7 |
| P1 Items | 10 | 0/10 |
| P2 Items | 3 | 0/3 |

**Verification Date**: 2026-03-18
<!-- /ANCHOR:summary -->
