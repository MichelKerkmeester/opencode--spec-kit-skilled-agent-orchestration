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

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-010` and confirm the expected signals without contradicting evidence.

- Objective: Feedback learning loop
- Prompt: `As a mutation validation operator, validate Validation feedback (memory_validate) against memory_validate(memoryId,helpful:true,queryId). Verify confidence/promotion metadata updates. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Confidence/promotion metadata updates
- Pass/fail: PASS if feedback persisted and metadata returned

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-010 | Validation feedback (memory_validate) | Feedback learning loop | `As a mutation validation operator, validate Feedback learning loop against memory_validate(memoryId,helpful:true,queryId). Verify confidence/promotion metadata updates. Return a concise pass/fail verdict with the main reason and cited evidence.` | `memory_validate(memoryId,helpful:true,queryId)` | Confidence/promotion metadata updates | Validation response | PASS if feedback persisted and metadata returned | Retry with valid memoryId/queryId |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [02--mutation/05-validation-feedback-memoryvalidate.md](../../feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md)

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: EX-010
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--mutation/010-validation-feedback-memory-validate.md`
