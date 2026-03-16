---
title: "Verification Checklist: Template Compliance"
description: "Verification Date: 2026-03-16"
trigger_phrases:
  - "template compliance"
importance_tier: "high"
contextType: "general"
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

- [x] CHK-001 [P0] Parent/phase context reviewed before edits [EVIDENCE: reviewed parent `010` docs and phases `001` through `009`]
- [x] CHK-002 [P0] Actual runtime prompt surfaces identified before implementation [EVIDENCE: `.agents`, `.opencode`, `.claude`, and `.gemini` agent docs plus `/spec_kit` assets located]
- [x] CHK-003 [P1] Codex runtime path checked explicitly [EVIDENCE: no separate Codex speckit agent document found under `/Users/michelkerkmeester/.codex`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Shared live template contract helper shipped [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`]
- [x] CHK-011 [P0] Missing/out-of-order required headers fail in normal validation [EVIDENCE: `check-template-headers.sh` + `validate.sh` updated]
- [x] CHK-012 [P0] Missing/out-of-order required anchors fail from the same shared contract [EVIDENCE: `check-anchors.sh` updated]
- [x] CHK-013 [P1] Extra custom sections remain warning-only in normal mode [EVIDENCE: `054-template-extra-header` returns warn]
- [x] CHK-014 [P1] Runtime speckit agents require inline scaffolds and strict post-write validation [EVIDENCE: `.agents`, OpenCode x2, Claude, and Gemini speckit docs updated]
- [x] CHK-015 [P1] `/spec_kit` plan/implement/complete flows embed scaffold contracts and strict validation [EVIDENCE: six YAML assets updated]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Template contract Vitest coverage passes [EVIDENCE: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/template-structure.vitest.ts`]
- [x] CHK-021 [P0] Runtime prompt/workflow assertion script passes [EVIDENCE: `node .opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js`]
- [x] CHK-022 [P0] Compliant fixture passes strict validation [EVIDENCE: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2 --strict`]
- [x] CHK-023 [P1] Warning path verified for extra custom sections [EVIDENCE: `bash .../validate.sh .../054-template-extra-header` returned warnings only]
- [x] CHK-024 [P1] Targeted shell suite categories pass for positive/template-header/evidence/placeholder lanes [EVIDENCE: targeted `test-validation.sh` and `test-validation-extended.sh` category runs passed]
- [x] CHK-025 [P1] Phase workflow assertion coverage includes every runtime speckit surface [EVIDENCE: `test-phase-command-workflows.js` now checks `.agents`, OpenCode x2, Claude, and Gemini speckit agent docs]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] No arbitrary template execution path introduced [EVIDENCE: helper performs read/parse only]
- [x] CHK-031 [P1] No fake Codex runtime file was created to satisfy parity claims [EVIDENCE: missing path recorded as limitation instead of creating a silent stub]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The specification doc reflects the repo-aligned design, not the sidecar draft [EVIDENCE: `.fingerprint` and stale prompt-builder references removed]
- [x] CHK-041 [P1] The implementation plan matches the shipped helper/validator/prompt architecture [EVIDENCE: architecture and testing sections updated]
- [x] CHK-042 [P1] The task list and implementation summary reflect completed work and actual verification [EVIDENCE: all tasks marked complete; summary authored after verification]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] New fixture and test files stay under the system-spec-kit test tree [EVIDENCE: additions limited to `scripts/test-fixtures/` and `scripts/tests/`]
- [x] CHK-051 [P1] No `.fingerprint` sidecar files were introduced [EVIDENCE: live-template helper replaces sidecar design]
- [ ] CHK-052 [P2] Session memory saved for this phase [DEFERRED: not part of this implementation turn]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-03-16
<!-- /ANCHOR:summary -->
