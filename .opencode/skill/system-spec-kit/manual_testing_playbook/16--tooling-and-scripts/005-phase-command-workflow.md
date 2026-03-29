---
title: "PHASE-005 -- Phase command workflow"
description: "This scenario validates Phase command workflow for `PHASE-005`. It focuses on Execute `/spec_kit:plan :with-phases` command in auto mode and verify 7-step workflow."
---

# PHASE-005 -- Phase command workflow

## 1. OVERVIEW

This scenario validates Phase command workflow for `PHASE-005`. It focuses on Execute `/spec_kit:plan :with-phases` command in auto mode and verify 7-step workflow.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `PHASE-005` and confirm the expected signals without contradicting evidence.

- Objective: Execute `/spec_kit:plan :with-phases` command in auto mode and verify 7-step workflow
- Prompt: `Run the spec_kit:plan :with-phases command end-to-end and verify phase decomposition pre-workflow steps complete. Capture the evidence needed to prove All 7 steps execute in sequence; scoring output visible; folders created with correct structure; link validation passes; recursive validation passes; success summary with paths. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: All 7 steps execute in sequence; scoring output visible; folders created with correct structure; link validation passes; recursive validation passes; success summary with paths
- Pass/fail: PASS if all 7 workflow steps complete without error, created folders match expected structure, link validation reports no warnings, and recursive validation exits 0

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PHASE-005 | Phase command workflow | Execute `/spec_kit:plan :with-phases` command in auto mode and verify 7-step workflow | `Run the spec_kit:plan :with-phases command end-to-end and verify all 7 workflow steps complete. Capture the evidence needed to prove All 7 steps execute in sequence; scoring output visible; folders created with correct structure; link validation passes; recursive validation passes; success summary with paths. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Invoke `/spec_kit:plan :with-phases` in auto mode for a target spec folder 2) Verify Step 1: Phase scoring runs (recommend-level.sh --recommend-phases) 3) Verify Step 2: Phase count determination (from scoring or user input) 4) Verify Step 3: Phase naming (auto-generated or user-provided) 5) Verify Step 4: Phase folder creation (create.sh --phase) 6) Verify Step 5: Template population in all phase folders 7) Verify Step 6: Phase link validation (scripts/rules/check-phase-links.sh) 8) Verify Step 7: Recursive validation (validate.sh --recursive) passes 9) Verify final output reports success with folder paths | All 7 steps execute in sequence; scoring output visible; folders created with correct structure; link validation passes; recursive validation passes; success summary with paths | Command transcript covering all 7 steps + final output summary | PASS if all 7 workflow steps complete without error, created folders match expected structure, link validation reports no warnings, and recursive validation exits 0 | Run individual steps in isolation to identify failing step; verify script permissions; check for missing dependencies; inspect auto mode decision logic for phase count/naming |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md](../../feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: PHASE-005
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/005-phase-command-workflow.md`
