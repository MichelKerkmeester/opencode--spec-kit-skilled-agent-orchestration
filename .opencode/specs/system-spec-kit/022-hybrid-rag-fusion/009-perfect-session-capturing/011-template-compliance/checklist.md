---
title: "Verification [system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/011-template-compliance/checklist]"
description: "Verification Date: 2026-03-17"
trigger_phrases:
  - "template compliance"
importance_tier: "important"
contextType: "general"
---
# Verification Checklist: Template Compliance

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## 1. VERIFICATION PROTOCOL

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## 2. PRE-IMPLEMENTATION

- [x] CHK-001 [P0] Parent/phase context reviewed before edits [Evidence: reviewed parent `010` docs and phases `001` through `009`]
- [x] CHK-002 [P0] Actual runtime prompt surfaces identified before implementation [Evidence: `.agents`, `.opencode`, `.claude`, and `.gemini` agent docs plus `/spec_kit` assets located]
- [x] CHK-003 [P1] Codex runtime path checked explicitly [Evidence: no separate Codex speckit agent document found under `/Users/michelkerkmeester/.codex`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## 3. CODE QUALITY

- [x] CHK-010 [P0] Shared live template contract helper shipped [Evidence: `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`]
- [x] CHK-011 [P0] Missing/out-of-order required headers fail in normal validation [Evidence: `check-template-headers.sh` + `validate.sh` updated]
- [x] CHK-012 [P0] Missing/out-of-order required anchors fail from the same shared contract [Evidence: `check-anchors.sh` updated]
- [x] CHK-013 [P1] Extra custom sections remain warning-only in normal mode [Evidence: `054-template-extra-header` returns warn]
- [x] CHK-014 [P1] Runtime speckit agents require inline scaffolds and strict post-write validation [Evidence: `.agents`, OpenCode x2, Claude, and Gemini speckit docs updated]
- [x] CHK-015 [P1] `/spec_kit` plan/implement/complete flows embed scaffold contracts and strict validation [Evidence: six YAML assets updated]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## 4. TESTING

- [x] CHK-020 [P0] Template contract Vitest coverage passes [Evidence: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/template-structure.vitest.ts`]
- [x] CHK-021 [P0] Runtime prompt/workflow assertion script passes [Evidence: `node .opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js`]
- [x] CHK-022 [P0] Compliant fixture passes strict validation [Evidence: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2 --strict`]
- [x] CHK-023 [P1] Warning path verified for extra custom sections [Evidence: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/054-template-extra-header` returned warnings only]
- [x] CHK-024 [P1] Targeted shell suite categories pass for positive/template-header/evidence/placeholder lanes [Evidence: targeted `test-validation.sh` and `test-validation-extended.sh` category runs passed]
- [x] CHK-025 [P1] Phase workflow assertion coverage includes every runtime speckit surface [Evidence: `test-phase-command-workflows.js` now checks `.agents`, OpenCode x2, Claude, and Gemini speckit agent docs]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## 5. SECURITY

- [x] CHK-030 [P1] No arbitrary template execution path introduced [Evidence: helper performs read/parse only]
- [x] CHK-031 [P1] No fake Codex runtime file was created to satisfy parity claims [Evidence: missing path recorded as limitation instead of creating a silent stub]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## 6. DOCUMENTATION

- [x] CHK-040 [P1] The specification doc reflects the repo-aligned design, not the sidecar draft [Evidence: `.fingerprint` and stale prompt-builder references removed]
- [x] CHK-041 [P1] The implementation plan matches the shipped helper/validator/prompt architecture [Evidence: architecture and testing sections updated]
- [x] CHK-042 [P1] The task list and implementation summary reflect completed work and actual verification [Evidence: all tasks marked complete, summary authored after verification]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## 7. FILE ORGANIZATION

- [x] CHK-050 [P1] New fixture and test files stay under the system-spec-kit test tree [Evidence: additions limited to `scripts/test-fixtures/` and `scripts/tests/`]
- [x] CHK-051 [P1] No `.fingerprint` sidecar files were introduced [Evidence: live-template helper replaces sidecar design]
- [x] CHK-052 [P2] Session memory saved for this phase [Evidence: `generate-context.js` closeout memory and refreshed `metadata.json` are present under `memory/` for this phase.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## 8. VERIFICATION SUMMARY

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-03-17
<!-- /ANCHOR:summary -->
