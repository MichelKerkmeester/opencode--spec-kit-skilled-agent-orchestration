---
title: "Implementation Plan: Test and Scenario Remediation"
description: "Fix pre-existing test failures, triage doc tests, verify playbook scenarios, produce final test report."
trigger_phrases:
  - "test remediation plan"
  - "023 phase 5 plan"
importance_tier: "standard"
contextType: "architecture"
---
# Implementation Plan: Test and Scenario Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Vitest, Node.js |
| **Framework** | OpenCode MCP server (npm workspaces) |
| **Storage** | SQLite (test fixtures) |
| **Testing** | Vitest test suite (335 files), manual playbook (10 scenarios) |

### Overview
Remediate all test failures and playbook scenario gaps discovered during the ESM migration. 8 pre-existing test failures need fixes or triage, 2 playbook scenarios need proper fixtures. Final test report documents the merge-ready state.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases 1-4 complete: all ESM runtime migration done
- [x] 30-iteration deep review complete: all P1/P2 resolved
- [x] 3 ESM-caused test failures already fixed

### Definition of Done
- [ ] Pre-existing test failures reduced to <=3
- [ ] All 10 playbook scenarios pass
- [ ] Final test report with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Fix Actionable Pre-Existing Tests (T001-T006)
- [ ] Fix integration-causal-graph error codes
- [ ] Fix integration-error-recovery error format
- [ ] Fix learning-stats-filters DB fixture
- [ ] Fix transaction-manager-recovery DB check
- [ ] Fix stdio-logging-safety symlink issue
- [ ] Fix modularization line count limit

### Step 2: Triage Doc Consistency Tests (T007-T008)
- [ ] Triage hydra-spec-pack-consistency
- [ ] Triage feature-flag-reference-docs

### Step 3: Fix Playbook Scenarios (T009-T011)
- [ ] Create proper save test fixture JSON
- [ ] Document playbook test setup requirements
- [ ] Verify all 10 scenarios

### Step 4: Final Report (T012-T013)
- [ ] Run full suite, document counts
- [ ] Update implementation-summary
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command |
|-----------|-------|---------|
| Full suite | All 335 test files | `npx vitest run` in mcp_server/ |
| Scripts suite | 44 test files | `npm run test --workspace=@spec-kit/scripts` |
| Playbook | 10 manual scenarios | Via MCP tools + generate-context.js |
| Targeted | Individual fixes | `npx vitest run tests/[file].vitest.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 1-4 complete | Internal | Green | All runtime work landed |
| Deep review complete | Internal | Green | All code findings resolved |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Test fix introduces new regressions
- **Procedure**: Revert individual test file changes; pre-existing failures are already documented
<!-- /ANCHOR:rollback -->
