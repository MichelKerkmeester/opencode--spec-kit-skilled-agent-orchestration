---
title: "PHASE-003 -- Recursive phase validation"
description: "This scenario validates Recursive phase validation for `PHASE-003`. It focuses on Run `validate.sh --recursive` on a phase parent folder and verify per-phase results."
---

# PHASE-003 -- Recursive phase validation

## 1. OVERVIEW

This scenario validates Recursive phase validation for `PHASE-003`. It focuses on Run `validate.sh --recursive` on a phase parent folder and verify per-phase results.

---

## 2. SCENARIO CONTRACT


- Objective: Run `validate.sh --recursive` on a phase parent folder and verify per-phase results.
- Real user request: `` Please validate Recursive phase validation against create.sh "Validate Test" --phase --level 2 --phases 2 and tell me whether the expected signals are present: Per-phase pass/fail in output; JSON `phases` array; combined exit code reflects worst child; error propagation works. ``
- RCAF Prompt: `As a tooling validation operator, validate Recursive phase validation against create.sh "Validate Test" --phase --level 2 --phases 2. Verify run validate.sh --recursive on a phase parent folder and verify per-phase results. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Per-phase pass/fail in output; JSON `phases` array; combined exit code reflects worst child; error propagation works
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if `--recursive` discovers all `[0-9][0-9][0-9]-*/` child folders, validates each independently, produces aggregated JSON with per-phase status, and combined exit code escalates to highest severity

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, run validate.sh --recursive on a phase parent folder and verify per-phase results against create.sh "Validate Test" --phase --level 2 --phases 2. Verify per-phase pass/fail in output; JSON phases array; combined exit code reflects worst child; error propagation works. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Use the phase folder created in PHASE-002 (or create one via `create.sh "Validate Test" --phase --level 2 --phases 2`)
2. `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --recursive specs/<phase-parent>`
3. Inspect output for per-phase validation results
4. Verify JSON output contains `phases` array with one entry per child folder
5. Verify combined exit code matches highest severity across children
6. Introduce a deliberate error in one child spec.md and re-run; verify aggregated exit code is 2 (error)

### Expected

Per-phase pass/fail in output; JSON `phases` array; combined exit code reflects worst child; error propagation works

### Evidence

Command transcript + validation output + JSON phases array + exit code after deliberate error

### Pass / Fail

- **Pass**: `--recursive` discovers all `[0-9][0-9][0-9]-*/` child folders, validates each independently, produces aggregated JSON with per-phase status, and combined exit code escalates to highest severity
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify parent folder contains child folders matching `[0-9][0-9][0-9]-*/` pattern; check validate.sh supports --recursive flag; inspect exit code handling logic

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md](../../feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: PHASE-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/003-recursive-phase-validation.md`
