---
title: "Implementation Plan: Test and [02--system-spec-kit/023-esm-module-compliance/005-test-and-scenario-remediation/plan]"
description: "Fix pre-existing test failures, triage doc tests, verify playbook scenarios, produce final test report."
trigger_phrases:
  - "test remediation plan"
  - "023 phase 5 plan"
importance_tier: "important"
contextType: "planning"
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
- [x] Pre-existing test failures reduced to <=3
- [x] All 10 playbook scenarios pass
- [x] Final test report with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Verification-driven remediation. Fix the failing tests and playbook gaps first, then rerun the full suites to prove the branch reflects live runtime behavior.

### Key Components
- **Vitest suites**: Primary regression signal for `mcp_server` and `scripts`
- **Manual playbook fixtures**: End-to-end proof for memory save and retrieval scenarios
- **Final reporting docs**: `tasks.md` and `implementation-summary.md` capture the verified closeout state

### Data Flow
Targeted failing suites -> fixture or assertion repair -> full-suite rerun -> playbook rerun -> final evidence update.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Delivery

### Step 1: Fix Actionable Pre-Existing Tests (T001-T006)
- [x] Fix integration-causal-graph error codes
- [x] Fix integration-error-recovery error format
- [x] Fix learning-stats-filters DB fixture
- [x] Fix transaction-manager-recovery DB check
- [x] Fix stdio-logging-safety symlink issue
- [x] Fix modularization line count limit

### Step 2: Triage Doc Consistency Tests (T007-T008)
- [x] Triage hydra-spec-pack-consistency
- [x] Triage feature-flag-reference-docs

### Step 3: Fix Playbook Scenarios (T009-T011)
- [x] Create proper save test fixture JSON
- [x] Document playbook test setup requirements
- [x] Verify all 10 scenarios

### Step 4: Final Report (T012-T013)
- [x] Run full suite, document counts
- [x] Update implementation-summary
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
