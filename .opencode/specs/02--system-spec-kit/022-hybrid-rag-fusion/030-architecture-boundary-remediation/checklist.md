---
title: "Verification Checklist: Architecture Boundary Remediation"
description: "18 verification items across 6 categories for architecture boundary compliance remediation"
trigger_phrases:
  - "boundary remediation checklist"
  - "architecture verification"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Architecture Boundary Remediation

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
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `npx tsc --noEmit` passes after all import migrations
- [ ] CHK-011 [P0] No new forbidden-direction imports introduced
- [ ] CHK-012 [P1] Re-exports maintain backward compatibility (core/config re-exports DB_UPDATED_FILE)
- [ ] CHK-013 [P1] Import paths follow project conventions (@spec-kit/shared/* or @spec-kit/mcp-server/api/*)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:boundary-compliance -->
## Boundary Compliance

- [ ] CHK-020 [P0] `check-no-mcp-lib-imports.ts` passes with reduced allowlist
- [ ] CHK-021 [P0] `check-api-boundary.sh` passes (no lib/ to api/ reverse imports)
- [ ] CHK-022 [P0] `check-architecture-boundaries.ts` passes (shared/ neutrality intact)
- [ ] CHK-023 [P1] Allowlist reduced from 6 entries to 3 or fewer
- [ ] CHK-024 [P1] Removed allowlist entries have no remaining forbidden imports in codebase
<!-- /ANCHOR:boundary-compliance -->

---

<!-- ANCHOR:enforcement -->
## Enforcement Automation

- [ ] CHK-030 [P1] Pre-commit hook or CI step exists and runs boundary checks
- [ ] CHK-031 [P1] Enforcement completes in < 5 seconds
- [ ] CHK-032 [P2] Enforcement blocks merge on violation (CI exit code non-zero)
<!-- /ANCHOR:enforcement -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] ARCHITECTURE_BOUNDARIES.md exceptions table updated
- [ ] CHK-041 [P1] Allowlist `lastReviewedAt` dates current for retained entries
- [ ] CHK-042 [P2] implementation-summary.md created after completion
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 0/7 |
| P1 Items | 8 | 0/8 |
| P2 Items | 3 | 0/3 |

**Verification Date**: _pending_
<!-- /ANCHOR:summary -->

---
