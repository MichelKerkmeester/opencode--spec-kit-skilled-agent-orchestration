---
title: "021 -- Causal depth signal (N2b)"
description: "This scenario validates Causal depth signal (N2b) for `021`. It focuses on Confirm normalized depth scoring."
---

# 021 -- Causal depth signal (N2b)

## 1. OVERVIEW

This scenario validates Causal depth signal (N2b) for `021`. It focuses on Confirm normalized depth scoring.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `021` and confirm the expected signals without contradicting evidence.

- Objective: Confirm normalized depth scoring
- Prompt: `Test causal depth signal (N2b). Capture the evidence needed to prove Depth score normalized to [0,1]; deeper chains produce higher normalized values; shortcut edges do not reduce longest-path depth; cycle members share one bounded depth layer. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Depth score normalized to [0,1]; deeper chains produce higher normalized values; shortcut edges do not reduce longest-path depth; cycle members share one bounded depth layer
- Pass/fail: PASS: All depth scores in [0,1]; deeper nodes score >= shallower nodes on the same chain; shortcut targets still reflect the deeper path; FAIL: Out-of-range values or incorrect depth ordering

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 021 | Causal depth signal (N2b) | Confirm normalized depth scoring | `Test causal depth signal (N2b). Capture the evidence needed to prove Depth score normalized to [0,1]; deeper chains produce higher normalized values; shortcut edges do not reduce longest-path depth; cycle members share one bounded depth layer. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Build multi-level graph with a shortcut edge or rooted cycle 2) Score depth 3) Verify normalized output | Depth score normalized to [0,1]; deeper chains produce higher normalized values; shortcut edges do not reduce longest-path depth; cycle members share one bounded depth layer | Depth scoring output across multi-level graph + normalization range verification | PASS: All depth scores in [0,1]; deeper nodes score >= shallower nodes on the same chain; shortcut targets still reflect the deeper path; FAIL: Out-of-range values or incorrect depth ordering | Verify normalization formula → Check SCC condensation / longest-path traversal → Inspect graph depth counting |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [10--graph-signal-activation/06-causal-depth-signal.md](../../feature_catalog/10--graph-signal-activation/06-causal-depth-signal.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 021
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `10--graph-signal-activation/021-causal-depth-signal-n2b.md`
