---
title: "EX-024 -- Post-task learning measurement (task_postflight)"
description: "This scenario validates Post-task learning measurement (task_postflight) for `EX-024`. It focuses on Learning closeout."
audited_post_018: true
---

# EX-024 -- Post-task learning measurement (task_postflight)

## 1. OVERVIEW

This scenario validates Post-task learning measurement (task_postflight) for `EX-024`. It focuses on Learning closeout.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `EX-024` and confirm the expected signals without contradicting evidence.

- Objective: Learning closeout
- Prompt: `As an analysis validation operator, validate Post-task learning measurement (task_postflight) against task_postflight(specFolder,taskId,knowledgeScore,uncertaintyScore,contextScore). Verify delta/learning record saved. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Delta/learning record saved
- Pass/fail: PASS if completion recorded

---

## 3. TEST EXECUTION

### Prompt

```
As an analysis validation operator, validate Learning closeout against task_postflight(specFolder,taskId,knowledgeScore,uncertaintyScore,contextScore). Verify delta/learning record saved. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. task_postflight(specFolder,taskId,knowledgeScore,uncertaintyScore,contextScore)

### Expected

Delta/learning record saved

### Evidence

Postflight output

### Pass / Fail

- **Pass**: completion recorded
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify taskId matches preflight

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [06--analysis/06-post-task-learning-measurement-taskpostflight.md](../../feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md)

---

## 5. SOURCE METADATA

- Group: Analysis
- Playbook ID: EX-024
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--analysis/024-post-task-learning-measurement-task-postflight.md`
