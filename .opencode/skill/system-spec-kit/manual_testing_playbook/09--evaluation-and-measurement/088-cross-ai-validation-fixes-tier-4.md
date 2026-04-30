---
title: "088 -- Cross-AI validation fixes (Tier 4)"
description: "This scenario validates Cross-AI validation fixes (Tier 4) for `088`. It focuses on Confirm tier-4 fix pack behavior."
---

# 088 -- Cross-AI validation fixes (Tier 4)

## 1. OVERVIEW

This scenario validates Cross-AI validation fixes (Tier 4) for `088`. It focuses on Confirm tier-4 fix pack behavior.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm tier-4 fix pack behavior.
- Real user request: `Please validate Cross-AI validation fixes (Tier 4) against the documented validation surface and tell me whether the expected signals are present: Each tier-4 fix location shows corrected behavior; representative flows produce expected outputs; no regressions in adjacent functionality.`
- RCAF Prompt: `As an evaluation validation operator, validate Cross-AI validation fixes (Tier 4) against the documented validation surface. Verify each tier-4 fix location shows corrected behavior; representative flows produce expected outputs; no regressions in adjacent functionality. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Each tier-4 fix location shows corrected behavior; representative flows produce expected outputs; no regressions in adjacent functionality
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all tier-4 fix locations produce corrected behavior and no regressions are observed

---

## 3. TEST EXECUTION

### Prompt

```
As an evaluation validation operator, confirm tier-4 fix pack behavior against the documented validation surface. Verify each tier-4 fix location shows corrected behavior; representative flows produce expected outputs; no regressions in adjacent functionality. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. inspect each fix location
2. run representative flows
3. record behavior

### Expected

Each tier-4 fix location shows corrected behavior; representative flows produce expected outputs; no regressions in adjacent functionality

### Evidence

Fix location inspection + representative flow outputs + regression check evidence

### Pass / Fail

- **Pass**: all tier-4 fix locations produce corrected behavior and no regressions are observed
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect each fix from Phase 018 tier-4 changelog; run targeted tests for each fix area; check for unintended side effects

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [09--evaluation-and-measurement/14-cross-ai-validation-fixes.md](../../feature_catalog/09--evaluation-and-measurement/14-cross-ai-validation-fixes.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 088
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--evaluation-and-measurement/088-cross-ai-validation-fixes-tier-4.md`
- audited_post_018: true
