---
title: "PHASE-003 -- Recursive phase validation"
description: "This scenario validates Recursive phase validation for `PHASE-003`. It focuses on Run `validate.sh --recursive` on a phase parent folder and verify per-phase results."
---

# PHASE-003 -- Recursive phase validation

## 1. OVERVIEW

This scenario validates Recursive phase validation for `PHASE-003`. It focuses on Run `validate.sh --recursive` on a phase parent folder and verify per-phase results.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `PHASE-003` and confirm the expected signals without contradicting evidence.

- Objective: Run `validate.sh --recursive` on a phase parent folder and verify per-phase results
- Prompt: `Run recursive validation on a phase parent and verify aggregated per-phase results. Capture the evidence needed to prove Per-phase pass/fail in output; JSON phases array; combined exit code reflects worst child; error propagation works. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Per-phase pass/fail in output; JSON `phases` array; combined exit code reflects worst child; error propagation works
- Pass/fail: PASS if `--recursive` discovers all `[0-9][0-9][0-9]-*/` child folders, validates each independently, produces aggregated JSON with per-phase status, and combined exit code escalates to highest severity

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PHASE-003 | Recursive phase validation | Run `validate.sh --recursive` on a phase parent folder and verify per-phase results | `Run recursive validation on a phase parent and verify aggregated per-phase results. Capture the evidence needed to prove Per-phase pass/fail in output; JSON phases array; combined exit code reflects worst child; error propagation works. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Use the phase folder created in PHASE-002 (or create one via `create.sh "Validate Test" --phase --level 2 --phases 2`) 2) `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --recursive specs/<phase-parent>` 3) Inspect output for per-phase validation results 4) Verify JSON output contains `phases` array with one entry per child folder 5) Verify combined exit code matches highest severity across children 6) Introduce a deliberate error in one child spec.md and re-run; verify aggregated exit code is 2 (error) | Per-phase pass/fail in output; JSON `phases` array; combined exit code reflects worst child; error propagation works | Command transcript + validation output + JSON phases array + exit code after deliberate error | PASS if `--recursive` discovers all `[0-9][0-9][0-9]-*/` child folders, validates each independently, produces aggregated JSON with per-phase status, and combined exit code escalates to highest severity | Verify parent folder contains child folders matching `[0-9][0-9][0-9]-*/` pattern; check validate.sh supports --recursive flag; inspect exit code handling logic |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md](../../feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: PHASE-003
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/003-recursive-phase-validation.md`
