---
title: "Verification Checklist: Integration Testing [template:level_2/checklist.md]"
---
# Verification Checklist: Integration Testing

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
- [ ] CHK-003 [P1] Dependencies identified and available (R-01, R-04 status confirmed, current interfaces usable)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `createTempRepo()` factory produces isolated temp directory with valid spec folder, `description.json`, and JSON input
- [ ] CHK-011 [P0] Test imports and calls the real workflow orchestrator (no mocks on file writer, quality scorer, or sufficiency evaluator)
- [ ] CHK-012 [P1] Factory cleanup (`afterEach`) reliably removes all temp artifacts even on test failure
- [ ] CHK-013 [P1] Fixture data is minimal but realistic (valid spec folder structure, correct frontmatter)
- [ ] CHK-014 [P2] Test timeout set appropriately for real I/O operations
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Test case 1: happy-path save completes, memory file exists, `description.json` updated, sequence incremented
- [ ] CHK-021 [P0] Test case 2: alignment block aborts with `ALIGNMENT_BLOCK`, no memory file, no description entry
- [ ] CHK-022 [P0] Test case 3: duplicate save skipped, only one memory file, sequence not double-incremented
- [ ] CHK-023 [P1] Post-write bookkeeping verified in each test case (description.json, filesystem, sequence numbers)
- [ ] CHK-024 [P1] `workflow-e2e.vitest.ts` discovered and runs green in `npm test`
- [ ] CHK-025 [P1] Existing unit and integration tests unaffected by new E2E suite
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P2] Temp repo factory does not write outside its temp directory
- [ ] CHK-031 [P2] Fixture data does not contain real credentials or sensitive paths
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md and plan.md up to date with final implementation
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
| P0 Items | 7 | [ ]/7 |
| P1 Items | 9 | [ ]/9 |
| P2 Items | 5 | [ ]/5 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->
