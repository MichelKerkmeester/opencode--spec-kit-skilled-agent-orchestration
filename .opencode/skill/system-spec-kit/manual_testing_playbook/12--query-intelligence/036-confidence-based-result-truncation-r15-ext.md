---
title: "036 -- Confidence-based result truncation (R15-ext)"
description: "This scenario validates Confidence-based result truncation (R15-ext) for `036`. It focuses on Confirm relevance-cliff cutoff."
---

# 036 -- Confidence-based result truncation (R15-ext)

## 1. OVERVIEW

This scenario validates Confidence-based result truncation (R15-ext) for `036`. It focuses on Confirm relevance-cliff cutoff.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `036` and confirm the expected signals without contradicting evidence.

- Objective: Confirm relevance-cliff cutoff
- Prompt: `Verify confidence-based truncation (R15-ext). Capture the evidence needed to prove Results truncated at confidence cliff; minimum result count guaranteed; cutoff threshold documented in trace. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Results truncated at confidence cliff; minimum result count guaranteed; cutoff threshold documented in trace
- Pass/fail: PASS: Results cut at confidence cliff; >=min-count results always returned; threshold visible in trace; FAIL: No truncation or fewer than min-count results

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 036 | Confidence-based result truncation (R15-ext) | Confirm relevance-cliff cutoff | `Verify confidence-based truncation (R15-ext). Capture the evidence needed to prove Results truncated at confidence cliff; minimum result count guaranteed; cutoff threshold documented in trace. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Run long-tail query 2) Inspect cutoff math 3) Verify min-result guarantee | Results truncated at confidence cliff; minimum result count guaranteed; cutoff threshold documented in trace | Truncated output with cutoff point + min-result count verification + cliff threshold in trace | PASS: Results cut at confidence cliff; >=min-count results always returned; threshold visible in trace; FAIL: No truncation or fewer than min-count results | Verify cliff detection algorithm → Check min-result guarantee → Inspect confidence score distribution |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [12--query-intelligence/04-confidence-based-result-truncation.md](../../feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md)

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 036
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `12--query-intelligence/036-confidence-based-result-truncation-r15-ext.md`
