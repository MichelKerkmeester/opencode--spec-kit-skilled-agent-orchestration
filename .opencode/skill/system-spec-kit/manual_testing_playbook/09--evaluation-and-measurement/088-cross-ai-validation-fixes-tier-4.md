---
title: "088 -- Cross-AI validation fixes (Tier 4)"
description: "This scenario validates Cross-AI validation fixes (Tier 4) for `088`. It focuses on Confirm tier-4 fix pack behavior."
---

# 088 -- Cross-AI validation fixes (Tier 4)

## 1. OVERVIEW

This scenario validates Cross-AI validation fixes (Tier 4) for `088`. It focuses on Confirm tier-4 fix pack behavior.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `088` and confirm the expected signals without contradicting evidence.

- Objective: Confirm tier-4 fix pack behavior
- Prompt: `Validate Phase 018 Tier-4 cross-AI fixes. Capture the evidence needed to prove Each tier-4 fix location shows corrected behavior; representative flows produce expected outputs; no regressions in adjacent functionality. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Each tier-4 fix location shows corrected behavior; representative flows produce expected outputs; no regressions in adjacent functionality
- Pass/fail: PASS if all tier-4 fix locations produce corrected behavior and no regressions are observed

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 088 | Cross-AI validation fixes (Tier 4) | Confirm tier-4 fix pack behavior | `Validate Phase 018 Tier-4 cross-AI fixes. Capture the evidence needed to prove Each tier-4 fix location shows corrected behavior; representative flows produce expected outputs; no regressions in adjacent functionality. Return a concise user-facing pass/fail verdict with the main reason.` | 1) inspect each fix location 2) run representative flows 3) record behavior | Each tier-4 fix location shows corrected behavior; representative flows produce expected outputs; no regressions in adjacent functionality | Fix location inspection + representative flow outputs + regression check evidence | PASS if all tier-4 fix locations produce corrected behavior and no regressions are observed | Inspect each fix from Phase 018 tier-4 changelog; run targeted tests for each fix area; check for unintended side effects |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [09--evaluation-and-measurement/14-cross-ai-validation-fixes.md](../../feature_catalog/09--evaluation-and-measurement/14-cross-ai-validation-fixes.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 088
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `09--evaluation-and-measurement/088-cross-ai-validation-fixes-tier-4.md`
