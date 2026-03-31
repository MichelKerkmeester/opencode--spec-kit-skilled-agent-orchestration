---
title: "Feature Specification: Test and [02--system-spec-kit/023-esm-module-compliance/005-test-and-scenario-remediation/spec]"
description: "Fix all ESM-caused test failures, pre-existing test regressions, and manual playbook scenario gaps discovered during the ESM migration verification."
trigger_phrases:
  - "test remediation"
  - "scenario fixes"
  - "023 phase 5"
  - "pre-existing test failures"
  - "playbook scenario gaps"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Test and Scenario Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 5** of the ESM Module Compliance specification.

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-verification-and-standards |
| **Successor** | None |
| **Handoff Criteria** | All ESM-caused failures fixed, pre-existing failures triaged, playbook scenarios passing |

**Scope Boundary**: Fix test failures and playbook scenario gaps. No new runtime code changes unless a test reveals a real bug.

**Dependencies**:
- Phases 1-4 complete: all runtime ESM migration and verification done
- 30-iteration deep review complete: all P1/P2 findings resolved

**Deliverables**:
- All ESM-caused test failures fixed
- Pre-existing test failures triaged (fix or document)
- Manual playbook scenarios for memory save pipeline verified
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Pending |
| **Created** | 2026-03-29 |
| **Branch** | `system-speckit/023-esm-module-compliance` |
| **Parent Spec** | 023-esm-module-compliance |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After completing the ESM migration (Phases 1-4), the test suite shows 11 failing test files (58 failed tests out of 8994). Three failures were ESM-caused and already fixed. Eight remain as pre-existing regressions unrelated to ESM. Additionally, 2 of 10 manual playbook scenarios failed due to environment/payload issues. These must be resolved or documented before the migration branch can be merged.

### Purpose
Ensure the ESM migration branch has no net-new test regressions and that manual playbook scenarios verify the full memory save pipeline works end-to-end under the new ESM runtime.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

#### Pre-Existing Test Failures (8 files, not caused by ESM)
1. `hydra-spec-pack-consistency.vitest.ts` — doc consistency checks (pre-existing from 026 audit)
2. `feature-flag-reference-docs.vitest.ts` — doc consistency checks (pre-existing from 026 audit)
3. `modularization.vitest.ts` — db-state.js line count exceeds 320 limit (pre-existing)
4. `integration-causal-graph.vitest.ts` — T528-4, T528-7, T014-CS1: handler error codes changed
5. `integration-error-recovery.vitest.ts` — T532-4: handler error format mismatch
6. `learning-stats-filters.vitest.ts` — T503-01/01b/01c: broken DB symlink in test env
7. `transaction-manager-recovery.vitest.ts` — T007-R2/R3/R4: recovery aborts on missing DB
8. `stdio-logging-safety.vitest.ts` — source walker hits broken DB symlink

#### Manual Playbook Scenario Failures (2 scenarios)
1. Scenario 1 (Memory save JSON mode): `INSUFFICIENT_CONTEXT_ABORT` with minimal test payload — sufficiency gate too strict for smoke tests
2. Scenario 2 (Memory search): Agent used session-local DB — need proper test fixture setup

### Out of Scope
- New ESM runtime changes (migration is complete)
- Test framework changes (vitest version, config)
- Unrelated test improvements beyond the failing set

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/tests/integration-causal-graph.vitest.ts` | Modify | Update expected error codes to current handler codes |
| `mcp_server/tests/integration-error-recovery.vitest.ts` | Modify | Update handler error format assertions |
| `mcp_server/tests/learning-stats-filters.vitest.ts` | Modify | Fix DB symlink or use in-memory DB fixture |
| `mcp_server/tests/transaction-manager-recovery.vitest.ts` | Modify | Fix recovery test to handle missing DB gracefully |
| `mcp_server/tests/stdio-logging-safety.vitest.ts` | Modify | Skip or fix broken symlink in source walker |
| `mcp_server/tests/modularization.vitest.ts` | Modify | Update db-state.js line limit or split module |
| `mcp_server/tests/hydra-spec-pack-consistency.vitest.ts` | Triage | Document as known pre-existing |
| `mcp_server/tests/feature-flag-reference-docs.vitest.ts` | Triage | Document as known pre-existing |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero net-new test regressions from ESM migration | All ESM-caused failures fixed (already done: 3 fixed in prior commit) |
| REQ-002 | Pre-existing failures triaged | Each failure classified as fix/skip/document with evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Fix actionable pre-existing failures | At least integration-causal-graph, learning-stats-filters, transaction-manager-recovery fixed |
| REQ-004 | Playbook save scenario works with proper payload | JSON mode save succeeds with sufficiently rich test payload |
| REQ-005 | Test suite regression count documented | Final test report with pass/fail/skip counts |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No ESM-caused test failures remain (already achieved)
- **SC-002**: Pre-existing failures reduced from 8 to <=3 (doc consistency tests may be deferred)
- **SC-003**: Manual playbook save scenario passes with proper test fixture
- **SC-004**: Final test report documents all remaining skips with justification
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Pre-existing failures have deep root causes | Medium | Triage first, fix what's tractable, document the rest |
| Risk | Broken DB symlink affects multiple test suites | High | Fix the symlink or switch to in-memory fixtures |
| Dependency | Phases 1-4 complete | Green | All runtime work landed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `hydra-spec-pack-consistency` and `feature-flag-reference-docs` be fixed (doc alignment) or deferred to a separate spec?
- Should `modularization.vitest.ts` db-state line count limit be raised or should the module be split?
<!-- /ANCHOR:questions -->
