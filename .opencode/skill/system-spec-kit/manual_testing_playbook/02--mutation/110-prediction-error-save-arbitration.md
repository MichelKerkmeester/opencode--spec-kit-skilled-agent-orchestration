---
title: "110 -- Prediction-error save arbitration"
description: "This scenario validates Prediction-error save arbitration for `110`. It focuses on Confirm 5-action PE decision engine during save."
audited_post_018: true
phase_018_change: "PE arbitration scenario remains live on the post-018 continuity save path"
---

# 110 -- Prediction-error save arbitration

## 1. OVERVIEW

This scenario validates Prediction-error save arbitration for `110`. It focuses on Confirm 5-action PE decision engine during save.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm 5-action PE decision engine during save.
- Real user request: `Please validate Prediction-error save arbitration against memory_conflicts and tell me whether the expected signals are present: Each similarity band triggers the correct action (CREATE/REINFORCE/UPDATE/SUPERSEDE/CREATE_LINKED); memory_conflicts table records action/similarity/contradiction; force:true bypasses PE arbitration.`
- RCAF Prompt: `As a mutation validation operator, validate Prediction-error save arbitration against memory_conflicts. Verify each similarity band triggers the correct action (CREATE/REINFORCE/UPDATE/SUPERSEDE/CREATE_LINKED); memory_conflicts table records action/similarity/contradiction; force:true bypasses PE arbitration. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Each similarity band triggers the correct action (CREATE/REINFORCE/UPDATE/SUPERSEDE/CREATE_LINKED); memory_conflicts table records action/similarity/contradiction; force:true bypasses PE arbitration
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all 5 PE actions trigger at correct similarity thresholds and force:true bypasses the decision engine

---

## 3. TEST EXECUTION

### Prompt

```
As a mutation validation operator, confirm 5-action PE decision engine during save against memory_conflicts. Verify each similarity band triggers the correct action (CREATE/REINFORCE/UPDATE/SUPERSEDE/CREATE_LINKED); memory_conflicts table records action/similarity/contradiction; force:true bypasses PE arbitration. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. save a spec-doc record with unique content → expect CREATE action
2. save identical content → expect REINFORCE (similarity >=0.95)
3. save slightly modified content (no contradiction) → expect UPDATE (0.85-0.94)
4. save modified content with contradiction → expect SUPERSEDE (0.85-0.94 + contradiction)
5. save loosely related content → expect CREATE_LINKED (0.70-0.84)
6. query `memory_conflicts` table entries for action/similarity/contradiction columns
7. save with `force:true` → verify PE arbitration bypassed

### Expected

Each similarity band triggers the correct action (CREATE/REINFORCE/UPDATE/SUPERSEDE/CREATE_LINKED); memory_conflicts table records action/similarity/contradiction; force:true bypasses PE arbitration

### Evidence

Save output per action type + memory_conflicts table query + force:true bypass evidence

### Pass / Fail

- **Pass**: all 5 PE actions trigger at correct similarity thresholds and force:true bypasses the decision engine
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect similarity threshold constants; verify contradiction detection logic; check memory_conflicts table schema matches expected columns

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [02--mutation/08-prediction-error-save-arbitration.md](../../feature_catalog/02--mutation/08-prediction-error-save-arbitration.md)

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: 110
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--mutation/110-prediction-error-save-arbitration.md`
