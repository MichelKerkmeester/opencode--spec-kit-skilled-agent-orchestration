---
title: "Feature Specification: manual-testing-per-playbook feature-flag-reference audit phase [template:level_2/spec.md]"
description: "Phase 020 documents the feature-flag-reference audit manual test packet for the Spec Kit Memory system. It groups three flag-inventory and flag-lifecycle scenarios from the central playbook so testers can verify flag inventory accuracy, graduated flag documentation, and flag removal workflow."
trigger_phrases:
  - "feature flag reference audit manual testing"
  - "phase 020 feature flag reference audit"
  - "flag inventory verification tests"
  - "hybrid rag fusion flag audit playbook"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook feature-flag-reference audit phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft — placeholder content, not yet a full testing packet |
| **Created** | 2026-03-24 |
| **Branch** | `main` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [019-feature-flag-reference](../019-feature-flag-reference/spec.md) |
| **Successor** | [021-remediation-revalidation](../021-remediation-revalidation/spec.md) |
| **Catalog Phase** | [007-code-audit-per-feature-catalog/020-feature-flag-reference](../../007-code-audit-per-feature-catalog/020-feature-flag-reference/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code audit for feature flag reference (catalog phase 020) identified that 7 flag categories were audited with 6 MATCH and 1 PARTIAL, plus a post-audit flag graduation event affecting 22 flags. Manual testing scenarios are needed to verify that the flag inventory matches code, graduated flag documentation is accurate, and the flag removal process works correctly.

### Purpose
Provide a single feature-flag-reference-audit-focused specification that maps three Phase 020 test scenarios to their feature context and acceptance criteria so manual execution and review remain consistent with the canonical playbook and the catalog audit findings.

**Draft Status Note:** This packet requires full testing scenarios before it can be considered complete.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Feature Catalog | Exact Prompt | Exact Command Sequence |
|---------|---------------|-----------------|--------------|------------------------|
| PB-020-01 | Flag inventory matches code | [`../../007-code-audit-per-feature-catalog/020-feature-flag-reference/spec.md`](../../007-code-audit-per-feature-catalog/020-feature-flag-reference/spec.md) | `Verify feature flag inventory matches code: count flags in environment_variables.md vs code grep.` | `1) Count SPECKIT_ flags documented in environment_variables.md 2) grep -r "SPECKIT_" in mcp_server/src for runtime references 3) Compare counts and list any undocumented or orphaned flags 4) Record delta as evidence` |
| PB-020-02 | Graduated flag set documentation accuracy | [`../../007-code-audit-per-feature-catalog/020-feature-flag-reference/spec.md`](../../007-code-audit-per-feature-catalog/020-feature-flag-reference/spec.md) | `Verify graduated flag set documentation is accurate after commit 09acbe8ce.` | `1) List all 22 flags graduated in commit 09acbe8ce 2) For each flag, verify catalog entry states default is ON 3) For each flag, verify runtime code reads default as true/enabled 4) Record any catalog entries still showing default OFF` |
| PB-020-03 | Flag removal process works | [`../../007-code-audit-per-feature-catalog/020-feature-flag-reference/spec.md`](../../007-code-audit-per-feature-catalog/020-feature-flag-reference/spec.md) | `Verify flag removal process: toggle off, verify behavior, remove.` | `1) Select one graduated flag as test subject 2) Set env var to false/off and restart MCP 3) Verify the feature is disabled (expected behavior change) 4) Unset the env var and verify default-ON behavior resumes 5) Document the toggle-off/toggle-on cycle as evidence` |

### Out of Scope
- Executing the three scenarios and assigning final run verdicts.
- Modifying the playbook or feature catalog content linked from this packet.
- Documenting non-feature-flag-reference phases from `001-retrieval/` through `019-feature-flag-reference/`.
- Retesting the 8 scenarios already covered by Phase 019 (EX-028 through EX-034 and 125).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 020 feature-flag-reference audit requirements, test inventory, and acceptance criteria |
| `description.json` | Create | Phase 020 metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Execute PB-020-01 flag inventory verification: compare documented flags against code grep results. | PASS if documented count matches code count within 5% tolerance and all active flags are documented |
| REQ-002 | Execute PB-020-02 graduated flag documentation accuracy: verify all 22 graduated flags show correct defaults in catalog. | PASS if all 22 graduated flags have catalog entries reflecting default ON and runtime code confirms enabled |
| REQ-003 | Execute PB-020-03 flag removal process: demonstrate toggle-off and toggle-on lifecycle for a graduated flag. | PASS if toggling off disables the feature and toggling on re-enables it, with evidence captured |

No P1 items are defined for this phase; all three flag-reference audit scenarios are mandatory for coverage.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 feature-flag-reference audit scenarios (PB-020-01 through PB-020-03) are executed with evidence captured per the review protocol.
- **SC-002**: Each scenario has a PASS, PARTIAL, or FAIL verdict with explicit rationale.
- **SC-003**: Coverage is reported as 3/3 with no skipped test IDs.
- **SC-004**: Any flag inventory deltas are recorded before cleanup.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Canonical source for exact prompts, commands, evidence targets, and pass/fail criteria | Treat the playbook as source of truth; update this phase packet only from that document |
| Dependency | [`../../007-code-audit-per-feature-catalog/020-feature-flag-reference/spec.md`](../../007-code-audit-per-feature-catalog/020-feature-flag-reference/spec.md) | Supplies audit findings context including the F05 PARTIAL verdict and 22-flag graduation event | Keep every test row linked to its mapped audit finding |
| Dependency | Commit `09acbe8ce` graduation event | PB-020-02 depends on verifying flags graduated in this specific commit | Pin verification to this SHA; if flags have changed since, document delta |
| Risk | Flag inventory count may differ between environment_variables.md and code due to documentation lag | Medium | Accept 5% tolerance and document exact delta for follow-up |
| Risk | MCP restart required for PB-020-03 toggle test may affect other test state | Low | Run PB-020-03 last in the phase; restore env to baseline after completion |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which specific graduated flag should be used as the test subject for PB-020-03? Recommend choosing one with clearly observable behavior change (e.g., a search pipeline feature flag).
- Should PB-020-01 inventory count include deprecated/inert flags or only active flags?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Flag inventory grep must complete within 30 seconds across the mcp_server source tree.

### Security
- **NFR-S01**: No real API keys may appear in evidence artifacts; use variable names only.

### Reliability
- **NFR-R01**: Evidence artifacts must be captured before any env var restoration so verdict review can proceed independently of runtime state.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Environment_variables.md lists flags not used in code: Document as orphaned documentation entries (not a FAIL).
- Code references flags not in environment_variables.md: Document as undocumented flags (potential PARTIAL).

### Error Scenarios
- Graduated flag toggle-off has no observable effect: Mark PB-020-03 as PARTIAL and investigate if the flag is truly inert.
- Grep returns false positives (e.g., flag name in comments only): Filter to runtime references (`process.env`, `getConfig`) before counting.

### State Transitions
- PB-020-03 env var unset after toggle-off: Default-ON behavior must resume without requiring code change or rebuild.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 3 scenarios, mix of static analysis and runtime toggle |
| Risk | 8/25 | Low risk — read-only audit plus one reversible toggle test |
| Research | 6/20 | Prompts and commands derived from catalog audit findings |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---
