---
title: "EX-010 -- Validation feedback (memory_validate)"
description: "This scenario validates Validation feedback (memory_validate) for `EX-010`. It focuses on Feedback learning loop."
audited_post_018: true
phase_018_change: "Validation feedback scenario remains live with post-018 audit coverage"
---

# EX-010 -- Validation feedback (memory_validate)

## 1. OVERVIEW

This scenario validates Validation feedback (memory_validate) for `EX-010`. It focuses on Feedback learning loop.

---

## 2. SCENARIO CONTRACT


- Objective: Feedback learning loop.
- Real user request: `Please validate Validation feedback (memory_validate) against memory_validate(memoryId,helpful:true,queryId) and tell me whether the expected signals are present: Confidence/promotion metadata updates.`
- RCAF Prompt: `As a mutation validation operator, validate Validation feedback (memory_validate) against memory_validate(memoryId,helpful:true,queryId). Verify confidence/promotion metadata updates. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Confidence/promotion metadata updates
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if feedback persisted and metadata returned

---

## 3. TEST EXECUTION

### Prompt

```
As a mutation validation operator, validate Feedback learning loop against memory_validate(memoryId,helpful:true,queryId). Verify confidence/promotion metadata updates. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_validate(memoryId,helpful:true,queryId)

### Expected

Confidence/promotion metadata updates

### Evidence

Validation response

### Pass / Fail

- **Pass**: feedback persisted and metadata returned
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Retry with valid memoryId/queryId

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [02--mutation/05-validation-feedback-memoryvalidate.md](../../feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md)

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: EX-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--mutation/010-validation-feedback-memory-validate.md`
