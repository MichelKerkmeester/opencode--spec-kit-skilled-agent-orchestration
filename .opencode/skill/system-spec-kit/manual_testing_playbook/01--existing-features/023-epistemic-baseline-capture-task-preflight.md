---
title: "EX-023 -- Epistemic baseline capture (task_preflight)"
description: "This scenario validates Epistemic baseline capture (task_preflight) for `EX-023`. It focuses on Pre-task baseline logging."
---

# EX-023 -- Epistemic baseline capture (task_preflight)

## 1. OVERVIEW

This scenario validates Epistemic baseline capture (task_preflight) for `EX-023`. It focuses on Pre-task baseline logging.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-023` and confirm the expected signals without contradicting evidence.

- Objective: Pre-task baseline logging
- Prompt: `Create preflight for pipeline-v2-audit`
- Expected signals: Baseline record created
- Pass/fail: PASS if baseline persisted

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-023 | Epistemic baseline capture (task_preflight) | Pre-task baseline logging | `Create preflight for pipeline-v2-audit` | `task_preflight(specFolder,taskId,knowledgeScore,uncertaintyScore,contextScore)` | Baseline record created | Preflight output | PASS if baseline persisted | Retry with complete fields |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [06--analysis/05-epistemic-baseline-capture-taskpreflight.md](../../feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md)

---

## 5. SOURCE METADATA

- Group: Existing Features
- Playbook ID: EX-023
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--existing-features/023-epistemic-baseline-capture-task-preflight.md`
