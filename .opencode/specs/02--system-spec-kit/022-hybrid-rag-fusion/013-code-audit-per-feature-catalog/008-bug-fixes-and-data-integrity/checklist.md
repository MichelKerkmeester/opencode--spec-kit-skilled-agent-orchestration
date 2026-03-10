---
title: "Verification Checklist: bug-fixes-and-data-integrity [template:level_2/checklist.md]"
description: "Verification Date: 2026-03-10"
trigger_phrases:
  - "verification"
  - "bug fixes"
  - "data integrity"
  - "hybrid rag fusion"
  - "regression tests"
  - "catalog alignment"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: bug-fixes-and-data-integrity

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
- [ ] CHK-014 [P0] Wildcard barrel exports removed in `mcp_server/lib/errors/index.ts`
- [ ] CHK-015 [P0] Spread-based `Math.max` removed in `mcp_server/shared/scoring/folder-scoring.ts`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
- [ ] CHK-024 [P0] Large-array (>100k) `RangeError` regression passes for scoring paths
- [ ] CHK-025 [P1] Include-content-independent dedup regression passes
- [ ] CHK-026 [P1] Stage-2 co-activation boost regression passes
- [ ] CHK-027 [P1] Production-path content-hash dedup integration passes
- [ ] CHK-028 [P1] Staged-swap success/failure/rollback regression passes
- [ ] CHK-029 [P2] Concurrent session-manager entry-limit stress test passes
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
- [ ] CHK-043 [P0] F-05 implementation table and B4 narrative aligned with actual module behavior
- [ ] CHK-044 [P0] F-06 implementation/test tables reference temporal-contiguity and extraction-adapter
- [ ] CHK-045 [P1] F-02 implementation/test tables include active dedup path coverage
- [ ] CHK-046 [P1] F-03 implementation table includes stage-2 hot-path source coverage
- [ ] CHK-047 [P1] F-07 canonical-ID dedup source/test linkage is explicit
- [ ] CHK-048 [P1] F-11 naming matches `working_memory` and timestamp regression is documented
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Findings saved to memory/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 0/5 |
| P1 Items | 8 | 0/8 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-03-10
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
