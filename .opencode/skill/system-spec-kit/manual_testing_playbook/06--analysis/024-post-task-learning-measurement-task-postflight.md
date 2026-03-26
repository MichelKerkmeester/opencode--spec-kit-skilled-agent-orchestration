---
title: "EX-024 -- Post-task learning measurement (task_postflight)"
description: "This scenario validates Post-task learning measurement (task_postflight) for `EX-024`. It focuses on Learning closeout."
---

# EX-024 -- Post-task learning measurement (task_postflight)

## 1. OVERVIEW

This scenario validates Post-task learning measurement (task_postflight) for `EX-024`. It focuses on Learning closeout.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-024` and confirm the expected signals without contradicting evidence.

- Objective: Learning closeout
- Prompt: `Complete postflight for pipeline-v2-audit. Capture the evidence needed to prove Delta/learning record saved. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Delta/learning record saved
- Pass/fail: PASS if completion recorded

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-024 | Post-task learning measurement (task_postflight) | Learning closeout | `Complete postflight for pipeline-v2-audit. Capture the evidence needed to prove Delta/learning record saved. Return a concise user-facing pass/fail verdict with the main reason.` | `task_postflight(specFolder,taskId,knowledgeScore,uncertaintyScore,contextScore)` | Delta/learning record saved | Postflight output | PASS if completion recorded | Verify taskId matches preflight |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [06--analysis/06-post-task-learning-measurement-taskpostflight.md](../../feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md)

---

## 5. SOURCE METADATA

- Group: Analysis
- Playbook ID: EX-024
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `06--analysis/024-post-task-learning-measurement-task-postflight.md`
