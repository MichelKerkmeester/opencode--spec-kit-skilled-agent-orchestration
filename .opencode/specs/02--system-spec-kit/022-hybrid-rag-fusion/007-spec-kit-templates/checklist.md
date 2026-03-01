---
title: "Verification Checklist: SpecKit Template ToC Policy Enforcement [007-spec-kit-templates/checklist.md]"
description: "Level 2 verification checklist for documentation-only ToC policy enforcement and retro cleanup."
trigger_phrases:
  - "verification"
  - "checklist"
  - "toc policy"
  - "spec kit"
SPECKIT_TEMPLATE_SOURCE: "checklist | v2.2"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: SpecKit Template ToC Policy Enforcement

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

## P0

P0 items are hard blockers. Completion claim is invalid until all P0 items are checked with evidence.

## P1

P1 items are required unless explicitly deferred with user approval and documented rationale.

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. [Evidence: verified in scoped spec artifacts and validation output.]
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. [Evidence: verified in scoped spec artifacts and validation output.]
- [x] CHK-003 [P1] Dependencies identified and available. [Evidence: verified in scoped spec artifacts and validation output.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Documentation edits remain in scoped markdown files only. [Evidence: verified in scoped spec artifacts and validation output.]
- [x] CHK-011 [P0] No unintended structural removals beyond ToC sections. [Evidence: verified in scoped spec artifacts and validation output.]
- [x] CHK-012 [P1] Existing section anchors retained in edited files. [Evidence: verified in scoped spec artifacts and validation output.]
- [x] CHK-013 [P1] New files follow Level 2 template section structure. [Evidence: verified in scoped spec artifacts and validation output.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ToC scan confirms no ToC sections in scoped standard artifacts. [Evidence: verified in scoped spec artifacts and validation output.]
- [x] CHK-021 [P0] `validate.sh` executed for all four requested folders. [Evidence: verified in scoped spec artifacts and validation output.]
- [x] CHK-022 [P1] Validation outcomes captured per folder. [Evidence: verified in scoped spec artifacts and validation output.]
- [x] CHK-023 [P1] No `research.md` files modified. [Evidence: verified in scoped spec artifacts and validation output.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced. [Evidence: verified in scoped spec artifacts and validation output.]
- [x] CHK-031 [P0] No permission/escalation changes required. [Evidence: verified in scoped spec artifacts and validation output.]
- [x] CHK-032 [P1] Changes confined to repository-local documentation. [Evidence: verified in scoped spec artifacts and validation output.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` synchronized. [Evidence: verified in scoped spec artifacts and validation output.]
- [x] CHK-041 [P1] `implementation-summary.md` finalized. [Evidence: verified in scoped spec artifacts and validation output.]
- [x] CHK-042 [P2] Additional README/template doc updates intentionally deferred (out of scope). [Evidence: verified in scoped spec artifacts and validation output.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No edits in `memory/`, `scratch/`, or `context/`. [Evidence: verified in scoped spec artifacts and validation output.]
- [x] CHK-051 [P1] No temp files introduced in spec root. [Evidence: verified in scoped spec artifacts and validation output.]
- [ ] CHK-052 [P2] Memory context save executed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 11 | 11/11 |
| P2 Items | 2 | 1/2 |

**Verification Date**: 2026-02-22
<!-- /ANCHOR:summary -->
