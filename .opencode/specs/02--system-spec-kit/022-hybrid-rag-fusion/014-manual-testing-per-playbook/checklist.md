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
- [x] CHK-005 [P1] Review and release-readiness rules resolve from `../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` [EVIDENCE: root playbook contains the scenario verdict and release-readiness rules used by this packet]
- [x] CHK-006 [P0] Exact-ID inventory established from the current playbook at `213` scenario IDs, while retaining `195` as the top-level-ID count only [EVIDENCE: exact-ID audit input reviewed against the current playbook text]
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

- [x] CHK-020 [P0] Exact-ID ownership audit across all 19 phase specs reports `213` exact scenario IDs with `0` missing IDs and `0` duplicate owners [EVIDENCE: audit rerun on 2026-03-17]
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
- [x] CHK-043 [P1] The parent `009` packet no longer contradicts itself about whether validator support was implemented in this closure pass [EVIDENCE: sibling `009-perfect-session-capturing/` packet reviewed after cleanup]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:normalization -->
## Normalization Alignment (2026-03-21)

- [x] CHK-060 [P0] All `NEW-NNN` provisional markers replaced with bare `NNN` IDs across 80 spec folder files [EVIDENCE: `grep -r 'NEW-[0-9]' | grep -v 'G-NEW-'` returns 0 matches]
- [x] CHK-061 [P0] Root-level count references updated from `211` to `213` exact scenario IDs [EVIDENCE: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md all reference `213`]
- [x] CHK-062 [P0] Phase 016 expanded with scenarios `153` and `154`, count updated from `21` to `23` [EVIDENCE: Phase 016 spec.md test inventory and root phase map both show 23 IDs]
- [x] CHK-063 [P0] `G-NEW-1`, `G-NEW-2`, `G-NEW-3` proper nouns preserved unchanged [EVIDENCE: `grep -r 'G-NEW-'` confirms 1 match in expected location]
- [x] CHK-064 [P0] `EX-NNN`, `PHASE-NNN`, `M-NNN` prefixes unchanged [EVIDENCE: grep confirms all prefixed IDs intact across phase folders]
<!-- /ANCHOR:normalization -->

---

<!-- ANCHOR:execution -->
## Execution + Remediation (2026-03-21)

- [x] CHK-070 [P0] All 209 scenarios across 19 phases verdicted (0 skipped) [EVIDENCE: Wave 0-3 agent outputs, per-phase scratch/execution-evidence.md]
- [x] CHK-071 [P0] 2 FAIL verdicts root-caused and fixed: graph FTS5 regression + calculateDocumentWeight undefined [EVIDENCE: graph-search-fn.ts Math.abs fix, handlers/index.ts pe-gating re-exports, 76 targeted tests pass]
- [x] CHK-072 [P0] GPT-5.4 ultra-think review completed: 5 findings identified and fixed [EVIDENCE: graph root cause corrected (eval init not score sign), K-sensitivity schema+data fixed, test migration completed, shadow-scoring flag aligned, 264 tests pass]
- [x] CHK-073 [P0] Memory generation scripts hardened: 7 source fixes applied and dist rebuilt [EVIDENCE: title-builder.ts, collect-session-data.ts, phase-classifier.ts, decision-extractor.ts, semantic-summarizer.ts, trigger-extractor.ts, embeddings.ts all fixed, workspace tests pass]
- [x] CHK-074 [P1] FUT-5 K-sensitivity reporting endpoint implemented [EVIDENCE: formatKValueReport() + k_sensitivity mode in eval handler, schema updated, score-normalization tests pass]
- [x] CHK-075 [P1] Sprint 3 trace field enrichment implemented [EVIDENCE: Sprint3PipelineMeta extended with routing.confidence, truncation.medianGap, tokenBudget.configValues]
- [x] CHK-076 [P1] 4 playbook documentation errors corrected [EVIDENCE: channel enums vector/bm25, script path rules/, field name recommended_phases, tier temporary]
- [ ] CHK-077 [P2] Re-test with SPECKIT_ABLATION=true to convert 10+ PARTIAL scenarios to PASS [DEFERRED: environment prerequisite]
- [ ] CHK-078 [P2] Seed indexed memories for phase 010 re-test [DEFERRED: data prerequisite]
<!-- /ANCHOR:execution -->

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
| P0 Items | 22 | 22/22 |
| P1 Items | 12 | 12/12 |
| P2 Items | 3 | 1/3 |

**Verification Date**: 2026-03-21

**Outstanding items**:
- Level 1 section-count warnings remain in the packet, but they are now documented truthfully as non-goals of this alignment pass.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Umbrella verification
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
