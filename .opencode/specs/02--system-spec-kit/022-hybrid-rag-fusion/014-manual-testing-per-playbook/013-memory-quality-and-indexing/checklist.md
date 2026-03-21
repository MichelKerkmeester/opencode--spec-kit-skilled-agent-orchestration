---
title: "Verification Checklist: manual-testing-per-playbook memory quality and indexing phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 013 memory-quality-and-indexing manual tests covering 42 exact IDs, including the dedicated memory sub-scenarios."
trigger_phrases:
  - "memory quality checklist"
  - "phase 013 verification"
  - "indexing checklist"
  - "M-005a M-006a M-007a verification"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook memory quality and indexing phase

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

- [x] CHK-001 [P0] Scope is locked to 42 exact IDs for Phase 013, including `M-005a..c`, `M-006a..c`, and `M-007a..j` [EVIDENCE: `spec.md` scope table lists the exact-ID inventory]
- [x] CHK-002 [P0] Exact prompts, command sequences, and pass criteria were extracted from the current playbook for all 42 exact IDs [EVIDENCE: `plan.md` testing strategy reflects the current playbook wording]
- [x] CHK-003 [P0] `M-005a..c` map to the dedicated outsourced-agent feature entry [EVIDENCE: `spec.md` scope table mappings]
- [x] CHK-004 [P0] `M-006a..c` map to the dedicated stateless-enrichment feature entry [EVIDENCE: `spec.md` scope table mappings]
- [x] CHK-005 [P0] `M-007` and `M-007a..j` map to the exact session-capturing feature entry under `../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md` [EVIDENCE: `spec.md` scope table mappings]
- [x] CHK-006 [P1] Level 1 template anchors and metadata blocks remain intact across all five phase documents [EVIDENCE: phase validator rerun on 2026-03-17]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `spec.md` explicitly names `M-005a`, `M-005b`, and `M-005c` rather than only the parent `M-005` row [EVIDENCE: `spec.md` scope and requirements]
- [x] CHK-011 [P0] `spec.md` explicitly names `M-006a`, `M-006b`, and `M-006c` rather than only the parent `M-006` row [EVIDENCE: `spec.md` scope and requirements]
- [x] CHK-012 [P0] `spec.md` explicitly names `M-007a` through `M-007j`, including literal `M-007g` and `M-007h` coverage [EVIDENCE: `spec.md` scope and requirements]
- [x] CHK-013 [P0] The packet now treats `42` exact IDs as the authoritative coverage unit for Phase 013 [EVIDENCE: `spec.md`, `plan.md`, and `tasks.md` count language]
- [x] CHK-014 [P1] `plan.md` testing strategy includes the dedicated-memory sub-scenarios as explicit rows [EVIDENCE: `plan.md` testing strategy]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All non-destructive exact IDs have execution evidence captured [EVIDENCE: `scratch/execution-evidence-partA.md` (Part A: 19 scenarios) and `scratch/execution-evidence-partB.md` (Part B: code-inspection lanes for 042,043,044,111,119,132,M-006 family)]
- [x] CHK-021 [P0] All destructive exact IDs have isolated sandbox evidence captured [EVIDENCE: `scratch/execution-evidence-partB.md` — checkpoint ID 20 created/restored; `.opencode/specs/test-sandbox-m008/` used and deleted; M-005a/b CLI runs via `/tmp/`; sandbox teardown confirmed]
- [x] CHK-022 [P0] Each of the 42 exact IDs has a PASS, PARTIAL, or FAIL verdict with explicit rationale [EVIDENCE: Part A verdict table in `scratch/execution-evidence-partA.md`; Part B verdict table in `scratch/execution-evidence-partB.md`; combined 42/42 coverage]
- [x] CHK-023 [P0] `M-007a` through `M-007j` each have distinct evidence traces and are not collapsed into the umbrella `M-007` row [EVIDENCE: `scratch/execution-evidence-partB.md` — each M-007a..j has individual evidence row with distinct rationale]
- [x] CHK-024 [P1] Coverage summary reports 42/42 exact IDs executed with no skipped dedicated-memory sub-scenarios [EVIDENCE: Part A (19) + Part B (23) = 42/42; M-005a/b/c, M-006a/b/c, M-007a..j all individually verdicted]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials were added to the Phase 013 documents [EVIDENCE: doc-only content review]
- [x] CHK-031 [P0] Destructive exact IDs are scoped to disposable sandboxes and `/tmp` paths in the draft execution plan [EVIDENCE: `plan.md` destructive-phase wording]
- [x] CHK-032 [P1] The canonical sandbox spec folder is documented before destructive execution starts [EVIDENCE: T016 resolved — `.opencode/specs/test-sandbox-m008/` used as disposable sandbox; teardown confirmed in `scratch/execution-evidence-partB.md`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` contain no template placeholder text [EVIDENCE: content review after rewrite]
- [x] CHK-041 [P0] Cross-document ID coverage is synchronized to the 42-ID model [EVIDENCE: matching count language across the rewritten packet]
- [ ] CHK-042 [P1] Open questions are resolved or explicitly deferred before phase execution begins [EVIDENCE: `spec.md` open questions updated]
- [x] CHK-043 [P1] `implementation-summary.md` reflects the exact-ID draft packet rather than the older 25/26-ID model [EVIDENCE: rewritten summary]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only the intended five phase docs were updated in `013-memory-quality-and-indexing/` for this alignment pass [EVIDENCE: edited-file list reviewed]
- [ ] CHK-051 [P2] Memory save is triggered after the alignment pass if future session continuity is needed [EVIDENCE: `/memory:save` run or deferred with reason]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 7 | 6/7 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-03-21 (Part B execution complete)
<!-- /ANCHOR:summary -->

---
