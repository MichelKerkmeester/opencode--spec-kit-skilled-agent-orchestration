---
title: "110 -- Prediction-error save arbitration"
description: "This scenario validates Prediction-error save arbitration for `110`. It focuses on Confirm 5-action PE decision engine during save."
---

# 110 -- Prediction-error save arbitration

## 1. OVERVIEW

This scenario validates Prediction-error save arbitration for `110`. It focuses on Confirm 5-action PE decision engine during save.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `110` and confirm the expected signals without contradicting evidence.

- Objective: Confirm 5-action PE decision engine during save
- Prompt: `Validate prediction-error save arbitration actions. Capture the evidence needed to prove Each similarity band triggers the correct action (CREATE/REINFORCE/UPDATE/SUPERSEDE/CREATE_LINKED); memory_conflicts table records action/similarity/contradiction; force:true bypasses PE arbitration. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Each similarity band triggers the correct action (CREATE/REINFORCE/UPDATE/SUPERSEDE/CREATE_LINKED); memory_conflicts table records action/similarity/contradiction; force:true bypasses PE arbitration
- Pass/fail: PASS if all 5 PE actions trigger at correct similarity thresholds and force:true bypasses the decision engine

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 110 | Prediction-error save arbitration | Confirm 5-action PE decision engine during save | `Validate prediction-error save arbitration actions. Capture the evidence needed to prove Each similarity band triggers the correct action (CREATE/REINFORCE/UPDATE/SUPERSEDE/CREATE_LINKED); memory_conflicts table records action/similarity/contradiction; force:true bypasses PE arbitration. Return a concise user-facing pass/fail verdict with the main reason.` | 1) save a memory with unique content → expect CREATE action 2) save identical content → expect REINFORCE (similarity >=0.95) 3) save slightly modified content (no contradiction) → expect UPDATE (0.85-0.94) 4) save modified content with contradiction → expect SUPERSEDE (0.85-0.94 + contradiction) 5) save loosely related content → expect CREATE_LINKED (0.70-0.84) 6) query `memory_conflicts` table entries for action/similarity/contradiction columns 7) save with `force:true` → verify PE arbitration bypassed | Each similarity band triggers the correct action (CREATE/REINFORCE/UPDATE/SUPERSEDE/CREATE_LINKED); memory_conflicts table records action/similarity/contradiction; force:true bypasses PE arbitration | Save output per action type + memory_conflicts table query + force:true bypass evidence | PASS if all 5 PE actions trigger at correct similarity thresholds and force:true bypasses the decision engine | Inspect similarity threshold constants; verify contradiction detection logic; check memory_conflicts table schema matches expected columns |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [02--mutation/08-prediction-error-save-arbitration.md](../../feature_catalog/02--mutation/08-prediction-error-save-arbitration.md)

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: 110
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--mutation/110-prediction-error-save-arbitration.md`
