---
title: "138 -- MODULE: header compliance via verify_alignment_drift.py"
description: "This scenario validates MODULE: header compliance via verify_alignment_drift.py for `138`. It focuses on Verify `verify_alignment_drift.py` returns 0 TS-MODULE-HEADER findings."
---

# 138 -- MODULE: header compliance via verify_alignment_drift.py

## 1. OVERVIEW

This scenario validates MODULE: header compliance via verify_alignment_drift.py for `138`. It focuses on Verify `verify_alignment_drift.py` returns 0 TS-MODULE-HEADER findings.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `138` and confirm the expected signals without contradicting evidence.

- Objective: Verify `verify_alignment_drift.py` returns 0 TS-MODULE-HEADER findings
- Prompt: `Validate MODULE: header compliance across all non-test .ts files. Capture the evidence needed to prove verify_alignment_drift.py reports PASS with 0 TS-MODULE-HEADER findings. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: verify_alignment_drift.py reports PASS with 0 TS-MODULE-HEADER findings
- Pass/fail: PASS if 0 TS-MODULE-HEADER findings reported

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 138 | MODULE: header compliance via verify_alignment_drift.py | Verify `verify_alignment_drift.py` returns 0 TS-MODULE-HEADER findings | `Validate MODULE: header compliance across all non-test .ts files. Capture the evidence needed to prove verify_alignment_drift.py reports PASS with 0 TS-MODULE-HEADER findings. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit` 2) `python3 ../sk-code--opencode/scripts/verify_alignment_drift.py --root .` 3) Grep output for `TS-MODULE-HEADER` findings 4) Verify 0 findings | verify_alignment_drift.py reports PASS with 0 TS-MODULE-HEADER findings | Script output showing PASS verdict + finding count | PASS if 0 TS-MODULE-HEADER findings reported | Check for new .ts files without MODULE: header → Add 3-line header block → Re-run verifier |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/11-feature-catalog-code-references.md](../../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 138
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/138-module-header-compliance-via-verify-alignment-drift-py.md`
