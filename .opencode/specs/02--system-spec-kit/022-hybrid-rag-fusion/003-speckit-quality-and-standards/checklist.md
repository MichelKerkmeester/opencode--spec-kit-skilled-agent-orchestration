---
title: "SpecKit Quality and Standards Checklist"
status: "in-progress"
level: 3
created: "2025-12-01"
updated: "2026-03-08"
description: "Consolidated from checklist.md (merged from the former templates phase) and checklist.md (merged from former phase 008)."
SPECKIT_TEMPLATE_SOURCE: "checklist + level2-verify | v2.2"
trigger_phrases:
  - "consolidated"
  - "003-speckit-quality-and-standards"
importance_tier: "important"
contextType: "implementation"
---
# Consolidated checklist.md

This document consolidates source documents from:
- `checklist.md (merged from the former templates phase)`
- `checklist.md (merged from former phase 008)`

## Source: `checklist.md (merged from the former templates phase)`

---
title: "Verification Checklist: SpecKit Template ToC Policy Enforcement [checklist.md (merged from the former templates phase)]"
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
- [x] CHK-023 [P1] No research documents modified. [Evidence: verified in scoped spec artifacts and validation output.]
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

## Source: `checklist.md (merged from former phase 008)`

---
title: "Verification Checklist: Spec Kit Code Quality Completion Run [checklist.md (merged from former phase 008)]"
description: "Level 3 checklist for phase 008 with blocking gates, evidence format requirements, and closure verification."
trigger_phrases:
  - "verification checklist"
  - "phase 008"
  - "quality gates"
  - "evidence format"
SPECKIT_TEMPLATE_SOURCE: "checklist + level3-arch | v2.2"
importance_tier: "critical"
contextType: "implementation"
---
# Verification Checklist: Spec Kit Code Quality Completion Run

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Completion claim invalid until all P0 items are checked with evidence |
| **[P1]** | Required | Must be completed or explicitly deferred with user approval |
| **[P2]** | Optional | May be deferred with rationale |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:evidence-format -->
## Evidence Format (Mandatory for Checked Items)

- Use `"[EVIDENCE: <command or artifact path>]"` for each checked item.
- For deferred P1/P2 items, use `"[DEFERRED: <reason>]"`.
- Accepted examples:
  - `[EVIDENCE: npm --prefix .opencode/skill/system-spec-kit/mcp_server run test -- tests/query-expander.vitest.ts (pass)]`
  - `[EVIDENCE: scratch/ (merged from former phase 008)review-lane-gap-note.md]`
  - `[EVIDENCE: node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 02--system-spec-kit/022-hybrid-rag-fusion/003-speckit-quality-and-standards]`
<!-- /ANCHOR:evidence-format -->

---

## P0

P0 items are blocking gates and must all be checked before completion is claimed.

<!-- ANCHOR:p0 -->
- [x] CHK-001 [P0] Locked baseline triad failures are fixed and reproduced as passing. [EVIDENCE: `npx vitest run tests/graph-search-fn.vitest.ts tests/query-expander.vitest.ts tests/memory-save-extended.vitest.ts` (pass)]
- [x] CHK-002 [P0] Full read-only review wave coverage completed with max six parallel lanes and bounded summaries. [EVIDENCE: `decision-record.md` ADR-001..ADR-003 + `implementation-summary.md` sections "What Was Built" and "How It Was Delivered"]
- [x] CHK-003 [P0] Moderate modularization completed and modularization gate passes. [EVIDENCE: `npx vitest run tests/modularization.vitest.ts` (pass, 91 tests)]
- [x] CHK-004 [P0] README modernization changed only repo-owned files under allowed scope. [EVIDENCE: README sweep command on 66 scoped files returned `FAILED=0`; see `implementation-summary.md` Verification]
- [x] CHK-005 [P0] Lint and full test matrix complete without unresolved P0 failures. [EVIDENCE: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run lint` (pass), `npm test` (pass), `bash scripts/tests/test-validation.sh` (55/55 pass), `bash scripts/tests/test-validation-extended.sh` (129/129 pass)]
- [x] CHK-006 [P0] Path security and MCP response contracts remain intact after edits. [EVIDENCE: `npx vitest run tests/unit-path-security.vitest.ts tests/mcp-error-format.vitest.ts` (pass)]
- [x] CHK-007 [P0] Phase documentation validates via `validate.sh` for this folder. [EVIDENCE: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/003-speckit-quality-and-standards` (pass)]
- [x] CHK-008 [P0] `implementation-summary.md` created only after implementation completion. [EVIDENCE: `implementation-summary.md (merged from former phase 008)`]
- [x] CHK-009 [P0] Context saved via official `generate-context.js` script. [EVIDENCE: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/003-speckit-quality-and-standards` created `memory/23-02-26_14-34__spec-kit-code-quality-session.md`]
<!-- /ANCHOR:p0 -->

---

## P1

P1 items are required unless explicitly deferred with user approval.

<!-- ANCHOR:p1 -->
- [x] CHK-101 [P1] `sk-code--opencode` propagation evaluated and updated when needed. [EVIDENCE: updated the `sk-code--opencode` skill guide and sk-code--opencode/README.md; updated the `system-spec-kit` skill guide verifier gate]
- [x] CHK-102 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` remain synchronized. [EVIDENCE: `validate.sh` pass with zero errors/warnings on merged phase-008 content]
- [x] CHK-103 [P1] Read-only review findings are prioritized and mapped to executed fixes. [EVIDENCE: code fix set + summaries documented in `implementation-summary.md` and ADR rationale in `decision-record.md`]
- [x] CHK-104 [P1] Rollback notes are updated for stabilized and modularized areas. [EVIDENCE: `decision-record.md` rollback guidance under ADR-003 ("How to roll back")]
- [x] CHK-105 [P1] Final closure report includes changed files and validation result summary. [EVIDENCE: `implementation-summary.md (merged from former phase 008)`]
<!-- /ANCHOR:p1 -->

---

## P2

P2 items are optional and may be deferred when documented.

<!-- ANCHOR:p2 -->
- [x] CHK-201 [P2] Additional low-priority cleanup opportunities from review wave are logged for follow-up. [EVIDENCE: `verify_alignment_drift.py --fail-on-warn` reports zero findings; no residual cleanup queue remains]
- [x] CHK-202 [P2] Supplemental README polish outside touched areas is deferred to a separate phase. [EVIDENCE: scope lock retained to touched README set in this phase; broad polish deferred by design]
<!-- /ANCHOR:p2 -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-301 [P0] ADRs document all major sequencing, refactor-boundary, and phase-merge continuity decisions. [EVIDENCE: `decision-record.md` (ADR-001..ADR-004)]
- [x] CHK-302 [P1] ADR alternatives include rejection rationale. [EVIDENCE: `decision-record.md`]
- [x] CHK-303 [P1] Consequence and risk sections are updated after implementation and merge continuity updates. [EVIDENCE: `decision-record.md` + `implementation-summary.md`]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-311 [P1] Runtime verification indicates no significant regressions versus baseline. [EVIDENCE: `implementation-summary.md` Verification table]
- [x] CHK-312 [P1] Hotspot refactor checks complete within expected runtime windows. [EVIDENCE: `implementation-summary.md` Verification table + `phase-009 scratch artifact "from-009-verification-log.md`]
- [ ] CHK-313 [P2] Optional benchmark table is captured for future trend analysis. [DEFERRED: No benchmark mandate for this phase]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-321 [P0] Rollback procedure is documented for core refactor batches. [EVIDENCE: `decision-record.md` rollback sections under ADR-001..ADR-003]
- [x] CHK-322 [P1] Final command matrix can be re-run from documented instructions. [EVIDENCE: `implementation-summary.md` Verification table]
- [x] CHK-323 [P1] Open blockers/deferred items are explicitly listed. [EVIDENCE: this checklist `CHK-313`, `CHK-333`, `CHK-343` + `implementation-summary.md` Known Limitations]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-331 [P1] Security-sensitive paths remain compliant with existing safeguards. [EVIDENCE: `checklist.md` CHK-006 + `implementation-summary.md` Verification]
- [x] CHK-332 [P1] License/ownership boundaries are respected for documentation changes. [EVIDENCE: phase scope lock in `spec.md` and merge artifact import under `phase-009 scratch artifact "from-009-*` only]
- [ ] CHK-333 [P2] Optional OWASP-style review notes are captured where relevant. [DEFERRED: Not required for this phase]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-341 [P1] All in-scope READMEs comply with latest workflow template structure. [EVIDENCE: `implementation-summary.md` Verification (`validate_document.py` pass)]
- [x] CHK-342 [P1] HVR style alignment is complete for in-scope READMEs. [EVIDENCE: README verification results in `implementation-summary.md` + imported `phase-009 scratch artifact "from-009-readme-audit-global.md`]
- [ ] CHK-343 [P2] Non-phase docs follow-up list is recorded for future work. [DEFERRED: No additional follow-up queue required after merged audits]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Spec Kit Maintainer | Technical Lead | [ ] Approved | |
| Quality Owner | Product Owner | [ ] Approved | |
| Verification Owner | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 15 | 15/15 |
| P2 Items | 5 | 2/5 (3 deferred) |

**Verification Date**: 2026-02-23
<!-- /ANCHOR:summary -->
