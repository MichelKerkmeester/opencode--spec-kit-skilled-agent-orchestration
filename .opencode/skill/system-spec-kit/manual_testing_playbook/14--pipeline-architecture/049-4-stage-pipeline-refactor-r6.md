---
title: "049 -- 4-stage pipeline refactor (R6)"
description: "This scenario validates 4-stage pipeline refactor (R6) for `049`. It focuses on Confirm stage flow and invariant."
audited_post_018: true
---

# 049 -- 4-stage pipeline refactor (R6)

## 1. OVERVIEW

This scenario validates 4-stage pipeline refactor (R6) for `049`. It focuses on Confirm stage flow and invariant.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm stage flow and invariant.
- Real user request: `Please validate 4-stage pipeline refactor (R6) against the documented validation surface and tell me whether the expected signals are present: Query traverses all 4 stages in order; stage transitions visible in verbose metadata; stage-4 scores immutable after final stage.`
- RCAF Prompt: `As a pipeline validation operator, validate 4-stage pipeline refactor (R6) against the documented validation surface. Verify query traverses all 4 stages in order; stage transitions visible in verbose metadata; stage-4 scores immutable after final stage. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Query traverses all 4 stages in order; stage transitions visible in verbose metadata; stage-4 scores immutable after final stage
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: All 4 stages execute in sequence; stage-4 scores unchanged after completion; FAIL: Stage skipped or stage-4 scores mutated

---

## 3. TEST EXECUTION

### Prompt

```
As a pipeline validation operator, confirm stage flow and invariant against the documented validation surface. Verify query traverses all 4 stages in order; stage transitions visible in verbose metadata; stage-4 scores immutable after final stage. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Run verbose stage metadata
2. inspect stage transitions
3. confirm stage-4 immutability

### Expected

Query traverses all 4 stages in order; stage transitions visible in verbose metadata; stage-4 scores immutable after final stage

### Evidence

Verbose stage metadata trace showing 4-stage flow + stage-4 immutability verification

### Pass / Fail

- **Pass**: All 4 stages execute in sequence; stage-4 scores unchanged after completion
- **Fail**: Stage skipped or stage-4 scores mutated

### Failure Triage

Verify stage ordering enforcement → Check verbose metadata emission → Inspect stage-4 immutability guard

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/01-4-stage-pipeline-refactor.md](../../feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 049
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/049-4-stage-pipeline-refactor-r6.md`
