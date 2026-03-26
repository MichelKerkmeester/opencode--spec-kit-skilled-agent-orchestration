---
title: "009 -- Quality proxy formula (B7)"
description: "This scenario validates Quality proxy formula (B7) for `009`. It focuses on Confirm proxy formula correctness."
---

# 009 -- Quality proxy formula (B7)

## 1. OVERVIEW

This scenario validates Quality proxy formula (B7) for `009`. It focuses on Confirm proxy formula correctness.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `009` and confirm the expected signals without contradicting evidence.

- Objective: Confirm proxy formula correctness
- Prompt: `Compute and verify quality proxy formula (B7). Capture the evidence needed to prove Computed proxy value matches manual formula calculation within tolerance; formula components are all present. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Computed proxy value matches manual formula calculation within tolerance; formula components are all present
- Pass/fail: PASS: Stored quality proxy matches manual computation within 0.01 tolerance; FAIL: Deviation > 0.01 or missing formula components

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 009 | Quality proxy formula (B7) | Confirm proxy formula correctness | `Compute and verify quality proxy formula (B7). Capture the evidence needed to prove Computed proxy value matches manual formula calculation within tolerance; formula components are all present. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Export logs 2) Compute formula manually 3) Compare stored value | Computed proxy value matches manual formula calculation within tolerance; formula components are all present | Exported log data + manual computation worksheet + stored proxy value comparison | PASS: Stored quality proxy matches manual computation within 0.01 tolerance; FAIL: Deviation > 0.01 or missing formula components | Check formula component extraction from logs → Verify coefficient weights → Inspect stored value write path |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [09--evaluation-and-measurement/05-quality-proxy-formula.md](../../feature_catalog/09--evaluation-and-measurement/05-quality-proxy-formula.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 009
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `09--evaluation-and-measurement/009-quality-proxy-formula-b7.md`
