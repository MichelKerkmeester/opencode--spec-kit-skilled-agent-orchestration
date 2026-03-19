---
title: "NEW-034 -- Relative score fusion in shadow mode (R14/N1)"
description: "This scenario validates Relative score fusion in shadow mode (R14/N1) for `NEW-034`. It focuses on Confirm RSF stays off the live ranking path."
---

# NEW-034 -- Relative score fusion in shadow mode (R14/N1)

## 1. OVERVIEW

This scenario validates Relative score fusion in shadow mode (R14/N1) for `NEW-034`. It focuses on Confirm RSF stays off the live ranking path.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-034` and confirm the expected signals without contradicting evidence.

- Objective: Confirm RSF stays off the live ranking path
- Prompt: `Check RSF shadow behavior post-cleanup. Capture the evidence needed to prove RRF remains the live fusion method; RSF does not affect returned rankings; any RSF comparison remains evaluation-only rather than a required runtime trace field. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: RRF remains the live fusion method; RSF does not affect returned rankings; any RSF comparison remains evaluation-only rather than a required runtime trace field
- Pass/fail: PASS: Live ranking uses RRF and no runtime RSF branch affects returned results; FAIL: RSF changes live ranking or a live RSF branch is still wired into returned results

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-034 | Relative score fusion in shadow mode (R14/N1) | Confirm RSF stays off the live ranking path | `Check RSF shadow behavior post-cleanup. Capture the evidence needed to prove RRF remains the live fusion method; RSF does not affect returned rankings; any RSF comparison remains evaluation-only rather than a required runtime trace field. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Inspect branch conditions 2) Run queries 3) Confirm RRF live ranking | RRF remains the live fusion method; RSF does not affect returned rankings; any RSF comparison remains evaluation-only rather than a required runtime trace field | Code-path evidence plus query output confirming stable RRF-ranked results | PASS: Live ranking uses RRF and no runtime RSF branch affects returned results; FAIL: RSF changes live ranking or a live RSF branch is still wired into returned results | Check RSF branch conditions → Verify live fusion method selection → Inspect evaluation-only logging path |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md](../../feature_catalog/12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md)

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: NEW-034
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `12--query-intelligence/034-relative-score-fusion-in-shadow-mode-r14-n1.md`
