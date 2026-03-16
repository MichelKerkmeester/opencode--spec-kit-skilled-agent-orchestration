---
title: "Verification Checklist: Quality Scorer Unification [template:level_2/checklist.md]"
---
# Verification Checklist: Quality Scorer Unification

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
- [ ] CHK-003 [P1] Dependencies identified and available (none — foundational phase)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `QualityScoreResult` interface defines `score01` (canonical), `score100` (compat), typed flags, and dimensional breakdown (REQ-001)
- [ ] CHK-011 [P0] V2 scorer returns `QualityScoreResult` with `score01` used for all downstream comparisons (REQ-001)
- [ ] CHK-012 [P0] V1 scorer returns `QualityScoreResult` with `score01` used for all downstream comparisons (REQ-001)
- [ ] CHK-013 [P0] V2 contamination penalty: score drops by 0.25 and capped at 0.6 when `hadContamination` is true (REQ-002)
- [ ] CHK-014 [P0] V1 scorer accepts `hadContamination` parameter and applies equivalent penalty (REQ-003)
- [ ] CHK-015 [P0] `qualityAbortThreshold` validation updated from 1-100 to 0.0-1.0 (REQ-004)
- [ ] CHK-016 [P1] Backward compat: integer thresholds (>1) auto-converted by dividing by 100 (REQ-004)
- [ ] CHK-017 [P1] Deprecation warning logged when integer threshold is auto-converted
- [ ] CHK-018 [P1] `workflow.ts` compares `score01` against the migrated threshold (REQ-004)
- [ ] CHK-019 [P2] No `as any` or `as unknown` casts introduced during migration
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All quality scorer tests updated to 0.0-1.0 scale expectations (SC-001)
- [ ] CHK-021 [P0] Test cases for V2 contamination penalty application pass (REQ-002)
- [ ] CHK-022 [P0] Test cases for V1 contamination penalty application pass (REQ-003)
- [ ] CHK-023 [P1] Test cases for backward-compat integer threshold conversion pass (REQ-004)
- [ ] CHK-024 [P1] No silent scale mismatch in any test fixture (SC-001)
- [ ] CHK-025 [P1] Full Vitest suite passes with zero failures
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P2] No sensitive data exposed through quality score logging
- [ ] CHK-031 [P2] Threshold auto-conversion does not allow bypass of quality gates
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md and plan.md consistent with implementation
- [ ] CHK-041 [P2] implementation-summary.md created after completion
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
| P0 Items | 9 | [ ]/9 |
| P1 Items | 9 | [ ]/9 |
| P2 Items | 4 | [ ]/4 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->
