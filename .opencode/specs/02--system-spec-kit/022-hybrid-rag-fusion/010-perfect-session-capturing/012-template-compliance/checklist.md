---
title: "Verification Checklist: Template Compliance [template:level_2/checklist.md]"
---
# Verification Checklist: Template Compliance

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
- [ ] CHK-004 [P1] Existing `check-template-headers.sh` and `check-anchors.sh` reviewed for extension points
- [ ] CHK-005 [P1] Delegation prompt builder file location confirmed (OQ-001 resolved)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `generate-fingerprint.sh` produces valid JSON with ordered `headers[]` and `anchors[]` arrays (REQ-001)
- [ ] CHK-011 [P0] `.fingerprint` sidecar files generated for all templates under `templates/core/` and `templates/extended/`
- [ ] CHK-012 [P0] `check-anchors.sh --fingerprint` exits non-zero when anchor sequence differs from template fingerprint (REQ-002)
- [ ] CHK-013 [P0] `check-anchors.sh --fingerprint` correctly identifies missing, extra, and reordered anchors
- [ ] CHK-014 [P1] `check-template-headers.sh` emits ERROR for missing required headers and wrong header order
- [ ] CHK-015 [P1] `check-template-headers.sh` retains WARN for non-critical deviations (extra custom headers)
- [ ] CHK-016 [P1] Delegation prompt builder embeds full template markdown inline, not path references (REQ-003)
- [ ] CHK-017 [P1] `validate.sh --strict` triggers fingerprint comparison after standard validation (REQ-004)
- [ ] CHK-018 [P1] `validate.sh --strict` returns exit code 2 on structural deviation
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Fingerprint generation unit test: output matches expected header/anchor sequence for each template
- [ ] CHK-021 [P0] Anchor comparison test: compliant file passes, non-compliant file fails with correct error output
- [ ] CHK-022 [P1] Header validator test: ERROR on missing required headers, WARN on extra custom headers
- [ ] CHK-023 [P1] `validate.sh --strict` integration test on compliant and non-compliant fixture files
- [ ] CHK-024 [P1] Delegation prompt test: generated prompt contains full template content, no path-only references
- [ ] CHK-025 [P1] Zero false negatives: `validate.sh --strict` passes on all existing compliant spec docs (SC-001)
- [ ] CHK-026 [P1] Structural deviations caught with ERROR-level output before indexing (SC-002)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P2] Fingerprint generator does not execute arbitrary content from template files
- [ ] CHK-031 [P2] `--strict` mode does not expose internal file paths in user-facing error messages
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md reflects final implementation scope
- [ ] CHK-041 [P1] plan.md updated with any deviations from original approach
- [ ] CHK-042 [P2] implementation-summary.md created after implementation completes
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
| P0 Items | 8 | [ ]/8 |
| P1 Items | 17 | [ ]/17 |
| P2 Items | 4 | [ ]/4 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->
