---
title: "Feature Specification: manual-testing-per-playbook remediation-revalidation phase [template:level_2/spec.md]"
description: "Phase 021 documents the remediation-revalidation manual test packet for the Spec Kit Memory system. It groups three remediation tracking and revalidation scenarios from the central playbook so testers can verify audit finding capture, revalidation checklist execution, and finding closure workflow."
trigger_phrases:
  - "remediation revalidation manual testing"
  - "phase 021 remediation revalidation"
  - "audit finding closure tests"
  - "hybrid rag remediation playbook"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook remediation-revalidation phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Not Started |
| **Created** | 2026-03-24 |
| **Branch** | `main` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [020-feature-flag-reference](../020-feature-flag-reference/spec.md) |
| **Successor** | [022-implement-and-remove-deprecated-features](../022-implement-and-remove-deprecated-features/spec.md) |
| **Catalog Phase** | [007-code-audit-per-feature-catalog/021-remediation-revalidation](../../007-code-audit-per-feature-catalog/021-remediation-revalidation/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code audit remediation and revalidation phase (catalog phase 021) synthesized findings from all 20 prior audit phases, identifying ~45 PARTIAL verdicts across 220+ features with 5 issue categories (source file list inflation, stale references, deprecated-as-active modules, flag default contradictions, and behavioral description mismatches). Manual testing scenarios are needed to verify that remediation tracking captures all findings, the revalidation checklist works against fixed items, and the finding closure workflow operates end-to-end.

### Purpose
Provide a single remediation-revalidation-focused specification that maps three Phase 021 test scenarios to their feature context and acceptance criteria so manual execution and review remain consistent with the canonical playbook and the meta-phase audit findings.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Feature Catalog | Exact Prompt | Exact Command Sequence |
|---------|---------------|-----------------|--------------|------------------------|
| PB-021-01 | Remediation tracking captures all audit findings | [`../../007-code-audit-per-feature-catalog/021-remediation-revalidation/spec.md`](../../007-code-audit-per-feature-catalog/021-remediation-revalidation/spec.md) | `Verify remediation tracking captures all audit findings across 20 phases.` | `1) Load remediation priority matrix from catalog phase 021 2) Count P0 items (4 flag defaults + 2 deprecated modules) and verify all are tracked 3) Count P1 items (3 behavioral mismatches) and verify all are tracked 4) Count P2 items (2 hygiene categories) and verify all are tracked 5) Record any untracked findings as evidence gaps` |
| PB-021-02 | Revalidation checklist runs against fixed items | [`../../007-code-audit-per-feature-catalog/021-remediation-revalidation/spec.md`](../../007-code-audit-per-feature-catalog/021-remediation-revalidation/spec.md) | `Verify revalidation checklist runs against items marked as fixed.` | `1) Identify items marked as remediated in the priority matrix 2) For each remediated P0 item, re-read the source code to verify the fix 3) For flag default contradictions (F07/F08/F13/F14), verify catalog header matches runtime default 4) For deprecated modules (F11/F15), verify catalog shows deprecation notice 5) Record PASS/FAIL per revalidated item` |
| PB-021-03 | Finding closure workflow end-to-end | [`../../007-code-audit-per-feature-catalog/021-remediation-revalidation/spec.md`](../../007-code-audit-per-feature-catalog/021-remediation-revalidation/spec.md) | `Verify finding closure workflow: finding to fix to verify to close.` | `1) Select one P1 behavioral mismatch (e.g., Scoring F22 function name mismatch) 2) Verify the catalog has been updated with the correct function name 3) Re-read the source file to confirm the function signature matches 4) Mark the finding as CLOSED with evidence of catalog-code alignment 5) Document the full finding-fix-verify-close lifecycle` |

### Out of Scope
- Executing the three scenarios and assigning final run verdicts.
- Modifying the playbook or feature catalog content linked from this packet.
- Documenting non-remediation-revalidation phases from `001-retrieval/` through `020-feature-flag-reference/`.
- Executing the DR-002 re-audit plan (27-38 hours estimated scope).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 021 remediation-revalidation requirements, test inventory, and acceptance criteria |
| `description.json` | Create | Phase 021 metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Execute PB-021-01 remediation tracking verification: confirm all audit findings are tracked in the priority matrix. | PASS if all P0 (6 items), P1 (3 items), and P2 (2 categories) are present in tracking with no orphaned findings |
| REQ-002 | Execute PB-021-02 revalidation checklist: re-verify items marked as fixed against source code. | PASS if every remediated item passes source-code re-read verification with matching catalog entries |
| REQ-003 | Execute PB-021-03 finding closure workflow: demonstrate the full lifecycle from finding to closure. | PASS if one finding is traced from identification through fix through verification to closure with evidence at each step |

No P1 items are defined for this phase; all three remediation-revalidation scenarios are mandatory for coverage.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 remediation-revalidation scenarios (PB-021-01 through PB-021-03) are executed with evidence captured per the review protocol.
- **SC-002**: Each scenario has a PASS, PARTIAL, or FAIL verdict with explicit rationale.
- **SC-003**: Coverage is reported as 3/3 with no skipped test IDs.
- **SC-004**: Any untracked findings discovered during PB-021-01 are recorded for follow-up.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Canonical source for exact prompts, commands, evidence targets, and pass/fail criteria | Treat the playbook as source of truth; update this phase packet only from that document |
| Dependency | [`../../007-code-audit-per-feature-catalog/021-remediation-revalidation/spec.md`](../../007-code-audit-per-feature-catalog/021-remediation-revalidation/spec.md) | Supplies the remediation priority matrix and cross-phase synthesis findings | Keep every test row linked to its mapped remediation finding |
| Dependency | All 20 prior audit phase specs must be complete | PB-021-01 cannot verify tracking completeness without the full finding set | Verify all 20 specs exist and have audit findings sections before executing |
| Risk | Some P0 items may not yet be remediated when testing begins | Medium | Mark unremediated items as OPEN in PB-021-02 evidence; do not mark FAIL for items still in progress |
| Risk | Deep research findings (DR-001 through DR-005) expand scope beyond the priority matrix | Low | Constrain PB-021-01 to the documented priority matrix; DR findings are out of scope for this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which P1 behavioral mismatch should be used as the test subject for PB-021-03? Recommend Scoring F22 (function name mismatch: `recalibrateWeights()` vs `adjustScoringWeights()`) as it is the most concrete and verifiable.
- Should PB-021-01 also verify tracking of the 6 uncataloged source files from DR-004, or constrain to the documented priority matrix only?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each revalidation source-code re-read (PB-021-02) must complete within the standard tool timeout window.

### Security
- **NFR-S01**: No real API keys or credentials may appear in evidence artifacts.

### Reliability
- **NFR-R01**: Evidence artifacts must capture the exact catalog text and source code text side-by-side so verdicts can be reviewed independently.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Priority matrix has items not yet remediated: Mark as OPEN in evidence, not FAIL.
- Source file referenced by finding no longer exists (renamed/deleted): Document as a new finding and flag for follow-up.

### Error Scenarios
- Catalog entry updated but source code reverted: Mark revalidation as FAIL with evidence of the regression.
- Multiple fixes applied to the same finding: Verify the most recent fix matches current code state.

### State Transitions
- PB-021-03 finding marked CLOSED but source code changes after closure: Out of scope for this phase; document as a revalidation cadence concern.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 3 scenarios, cross-phase synthesis review |
| Risk | 10/25 | Depends on remediation progress of prior phases |
| Research | 8/20 | Must cross-reference 20 audit phase specs for completeness |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---
