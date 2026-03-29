---
title: "Tasks: Test and Scenario Remediation"
description: "Fix pre-existing test failures, triage doc consistency tests, and verify manual playbook scenarios."
trigger_phrases:
  - "test remediation tasks"
  - "023 phase 5 tasks"
  - "fix failing tests"
importance_tier: "standard"
contextType: "architecture"
---
# Tasks: Test and Scenario Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Description - WHY - Acceptance`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Step 1: Pre-Existing Test Fixes (Actionable)

- [ ] T001 [P] Fix `integration-causal-graph.vitest.ts` (T528-4, T528-7, T014-CS1) - WHY: handler error codes updated during 026 audit but tests not updated - Acceptance: update expected codes to E104/E105, tests pass
- [ ] T002 [P] Fix `integration-error-recovery.vitest.ts` (T532-4) - WHY: handleMemorySearch now returns structured error not isError:true - Acceptance: update assertion to check response content, test passes
- [ ] T003 [P] Fix `learning-stats-filters.vitest.ts` (T503-01/01b/01c) - WHY: broken DB symlink in test fixtures - Acceptance: use in-memory DB or fix symlink, tests pass
- [ ] T004 [P] Fix `transaction-manager-recovery.vitest.ts` (T007-R2/R3/R4) - WHY: recovery now aborts on missing DB file - Acceptance: mock DB existence or adjust test expectation, tests pass
- [ ] T005 [P] Fix `stdio-logging-safety.vitest.ts` - WHY: source walker stat fails on broken DB symlink - Acceptance: skip symlink or use filtered walker, test passes
- [ ] T006 Fix `modularization.vitest.ts` db-state line count - WHY: db-state.js is 449 lines, limit is 320 - Acceptance: raise limit to 500 or split module, test passes
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Step 2: Doc Consistency Test Triage

- [ ] T007 Triage `hydra-spec-pack-consistency.vitest.ts` - WHY: doc alignment test pre-dating ESM work - Acceptance: fix alignment or document as deferred with reason
- [ ] T008 Triage `feature-flag-reference-docs.vitest.ts` - WHY: feature flag doc references out of date - Acceptance: fix references or document as deferred with reason
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Step 3: Manual Playbook Scenario Fixes

- [ ] T009 Fix Scenario 1 (Memory save JSON mode) - WHY: minimal test payload rejected by sufficiency gate (INSUFFICIENT_CONTEXT_ABORT) - Acceptance: create a proper test fixture JSON with sufficient context (sessionSummary 100+ chars, 5+ trigger phrases, 2+ decisions, 1+ file), verify generate-context.js completes successfully
- [ ] T010 Fix Scenario 2 (Memory search) - WHY: test used session-local DB instead of live DB - Acceptance: document proper test setup for playbook scenarios OR create a test-fixture DB setup script
- [ ] T011 Verify all 10 playbook scenarios pass with proper fixtures - WHY: end-to-end proof of ESM migration - Acceptance: all 10 scenarios PASS
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Step 4: Final Test Report

- [ ] T012 Run full test suite and document final counts - WHY: baseline for merge decision - Acceptance: test report with pass/fail/skip counts, all ESM-caused = 0, pre-existing documented
- [ ] T013 Update parent implementation-summary.md with final evidence - WHY: spec closure requires evidence - Acceptance: summary includes test counts, playbook results, verification matrix
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T013 marked `[x]`
- [ ] Zero ESM-caused test failures
- [ ] Pre-existing failures reduced to <=3 (doc consistency deferred)
- [ ] All 10 playbook scenarios pass
- [ ] Final test report documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
- **Deep Review**: See `../review/`
- **Playbook Results**: See `../scratch/playbook-results.md`
<!-- /ANCHOR:cross-refs -->
