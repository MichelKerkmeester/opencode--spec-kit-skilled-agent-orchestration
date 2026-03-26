---
title: "PHASE-004 -- Phase link validation"
description: "This scenario validates Phase link validation for `PHASE-004`. It focuses on Run `check-phase-links.sh` on a phase folder and verify 4 link checks at warn severity."
---

# PHASE-004 -- Phase link validation

## 1. OVERVIEW

This scenario validates Phase link validation for `PHASE-004`. It focuses on Run `check-phase-links.sh` on a phase folder and verify 4 link checks at warn severity.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `PHASE-004` and confirm the expected signals without contradicting evidence.

- Objective: Run `check-phase-links.sh` on a phase folder and verify 4 link checks at warn severity
- Prompt: `Validate phase link integrity across parent and child folders. Capture the evidence needed to prove 4 link check types reported; well-formed folder produces exit 0; missing child produces warn on Phase Documentation Map; corrupted back-reference produces warn; all issues at warn severity. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: 4 link check types reported; well-formed folder produces exit 0; missing child produces warn on Phase Documentation Map; corrupted back-reference produces warn; all issues at warn severity
- Pass/fail: PASS if all 4 link types are checked, valid folders exit 0, missing/broken links exit 1 with warn-level messages, and no link issue produces error severity

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PHASE-004 | Phase link validation | Run `check-phase-links.sh` on a phase folder and verify 4 link checks at warn severity | `Validate phase link integrity across parent and child folders. Capture the evidence needed to prove 4 link check types reported; well-formed folder produces exit 0; missing child produces warn on Phase Documentation Map; corrupted back-reference produces warn; all issues at warn severity. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Use the phase folder from PHASE-002 2) `bash .opencode/skill/system-spec-kit/scripts/rules/check-phase-links.sh specs/<phase-parent>` 3) Verify output checks 4 link types: Phase Documentation Map, parent back-references, predecessor links, successor links 4) Confirm all links pass on a well-formed phase folder (exit code 0) 5) Remove a child folder and re-run; verify Phase Documentation Map check warns about missing child (exit code 1) 6) Edit a child spec.md to corrupt the parent back-reference and re-run; verify back-reference check warns (exit code 1) 7) Confirm all issues are reported at warn severity, not error | 4 link check types reported; well-formed folder produces exit 0; missing child produces warn on Phase Documentation Map; corrupted back-reference produces warn; all issues at warn severity | Command transcript + output for valid and invalid cases + exit codes | PASS if all 4 link types are checked, valid folders exit 0, missing/broken links exit 1 with warn-level messages, and no link issue produces error severity | Verify check-phase-links.sh exists and has execute permission; check spec.md contains expected link markers; verify child folder naming matches expected pattern |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md](../../feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: PHASE-004
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/004-phase-link-validation.md`
