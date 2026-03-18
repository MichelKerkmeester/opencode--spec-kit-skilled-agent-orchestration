---
title: "Verification Checklist: manual-testing-per-playbook [template:level_2/checklist.md]"
description: "Verification Date: 2026-03-17"
trigger_phrases:
  - "manual testing checklist"
  - "playbook verification"
  - "umbrella checklist"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] CHK-001 [P0] Parent spec.md exists and now uses the current exact-ID coverage model [EVIDENCE: parent `spec.md` reviewed after alignment]
- [x] CHK-002 [P0] Parent plan.md exists and now describes the alignment pass rather than the original generation wave [EVIDENCE: parent `plan.md` summary and phases reviewed]
- [x] CHK-003 [P0] All 19 phase directories still exist (`001-retrieval/` through `019-feature-flag-reference/`) [EVIDENCE: directory inventory confirmed for all `001-*` to `019-*` folders]
- [x] CHK-004 [P1] Manual testing playbook resolves at `../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` [EVIDENCE: relative path resolves and file exists]
- [x] CHK-005 [P1] Review protocol resolves at `../../../../skill/system-spec-kit/manual_testing_playbook/review_protocol.md` [EVIDENCE: relative path resolves and file exists]
- [x] CHK-006 [P0] Exact-ID inventory established from the current playbook at `211` scenario IDs, while retaining `195` as the top-level-ID count only [EVIDENCE: exact-ID audit input reviewed against the current playbook text]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Parent spec.md no longer presents `195` top-level IDs as the authoritative coverage model [EVIDENCE: parent `spec.md` problem statement and success criteria]
- [x] CHK-011 [P0] Parent phase map uses truthful exact-ID counts, including `42` exact IDs for Phase `013` and `18` exact IDs for Phase `014` [EVIDENCE: parent `spec.md` Phase Documentation Map]
- [x] CHK-012 [P0] Parent docs record the current validator truth instead of claiming an unrun or unresolved recursive-validation step [EVIDENCE: parent `tasks.md`, `checklist.md`, and `implementation-summary.md`]
- [x] CHK-013 [P1] The parent packet still follows the Level 1 template structure after the rewrite [EVIDENCE: `validate.sh --recursive` reports required sections present]
- [x] CHK-014 [P1] Parent `description.json` exists and is valid JSON [EVIDENCE: JSON parse succeeded for `description.json` on 2026-03-17]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Exact-ID ownership audit across all 19 phase specs reports `211` exact scenario IDs with `0` missing IDs and `0` duplicate owners [EVIDENCE: audit rerun on 2026-03-17]
- [x] CHK-021 [P0] Recursive `validate.sh --recursive` was rerun on `014-manual-testing-per-playbook/` and completed with `0` errors and `19` warnings [EVIDENCE: validator rerun on 2026-03-17]
- [x] CHK-022 [P0] `013-memory-quality-and-indexing/` validation was rerun after the exact-ID expansion [EVIDENCE: child validator rerun on 2026-03-17]
- [x] CHK-023 [P1] Cross-cutting ownership remains stable: `PHASE-001..005` in Phase `016`; `M-001..008` plus dedicated-memory sub-scenarios in Phase `013` [EVIDENCE: parent `spec.md` and child `013-memory-quality-and-indexing/spec.md` reviewed together]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials were introduced while aligning the documentation packet [EVIDENCE: doc-only changes reviewed]
- [x] CHK-031 [P1] Scope remained limited to the parent packet, Phase `013`, the `M-007` playbook block, and the narrow `010` truth-cleanup [EVIDENCE: edited-file list reviewed against approved scope]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Phase `013` explicitly documents `M-005a..c`, `M-006a..c`, and `M-007a..j` as literal scenario IDs [EVIDENCE: `013-memory-quality-and-indexing/spec.md` exact-ID scope and requirements]
- [x] CHK-041 [P0] The `M-007` playbook block now includes `tests/workflow-e2e.vitest.ts` in the JS verification suite list [EVIDENCE: `../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` command block]
- [x] CHK-042 [P1] The `M-007` playbook baseline wording now uses the focused proof-lane framing from the `010` closure docs instead of the old compressed aggregate buckets [EVIDENCE: `../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` latest automated baseline refresh]
- [x] CHK-043 [P1] The parent `010` packet no longer contradicts itself about whether validator support was implemented in this closure pass [EVIDENCE: sibling `010-perfect-session-capturing/` packet reviewed after cleanup]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Parent root contains the expected root docs plus valid `description.json` with no stray packet files added during alignment [EVIDENCE: root file inventory reviewed]
- [x] CHK-051 [P2] Existing Level 1 section-count warnings remain documented as out of scope for this pass rather than silently ignored [EVIDENCE: parent `spec.md` and `implementation-summary.md` record the warning truth]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-03-17

**Outstanding items**:
- Level 1 section-count warnings remain in the packet, but they are now documented truthfully as non-goals of this alignment pass.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Umbrella verification
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
