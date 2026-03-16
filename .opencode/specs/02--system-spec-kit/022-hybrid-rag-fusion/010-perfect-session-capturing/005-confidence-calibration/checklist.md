---
title: "Verification Checklist: Confidence Calibration [template:level_2/checklist.md]"
---
# Verification Checklist: Confidence Calibration

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
- [ ] CHK-003 [P1] Dependencies identified and available (R-04 type consolidation completed)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `CHOICE_CONFIDENCE` and `RATIONALE_CONFIDENCE` fields added to `DecisionRecord` type (REQ-001)
- [ ] CHK-011 [P0] Legacy `CONFIDENCE` derived as `Math.min(CHOICE_CONFIDENCE, RATIONALE_CONFIDENCE)` (REQ-002)
- [ ] CHK-012 [P0] All existing consumers that read `CONFIDENCE` continue to work without modification (REQ-002)
- [ ] CHK-013 [P1] Decision tree generator uses dual confidence for richer visualization when values diverge by > 0.1 (REQ-003)
- [ ] CHK-014 [P1] Template renderers display both confidence values when available (REQ-004)
- [ ] CHK-015 [P1] Dual confidence signals correctly computed: choice from alternatives/preference/specificity, rationale from text/trade-offs/citations
- [ ] CHK-016 [P2] Base confidence 0.50 with cap at 1.0 validated for edge cases
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Unit tests for dual confidence computation with various input combinations
- [ ] CHK-021 [P0] Regression tests verifying legacy `CONFIDENCE` = `Math.min(choice, rationale)` for all test cases
- [ ] CHK-022 [P1] Decision tree output includes split labels for divergent confidence cases
- [ ] CHK-023 [P1] Existing test baselines pass with the derived field (no behavioral regression)
- [ ] CHK-024 [P1] SC-001 validated: strong choice / weak rationale shows split (e.g., CHOICE=0.85, RATIONALE=0.45, legacy=0.45)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P2] No sensitive data exposed through confidence field additions
- [ ] CHK-031 [P2] Confidence values bounded within 0.0-1.0 range (no overflow/underflow)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md and plan.md updated with final implementation details
- [ ] CHK-041 [P2] implementation-summary.md written after completion
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Findings saved to memory/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | [ ]/7 |
| P1 Items | 10 | [ ]/10 |
| P2 Items | 5 | [ ]/5 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->
