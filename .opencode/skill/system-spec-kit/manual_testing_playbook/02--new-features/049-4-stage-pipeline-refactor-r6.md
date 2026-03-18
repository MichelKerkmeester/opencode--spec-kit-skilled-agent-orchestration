---
title: "NEW-049 -- 4-stage pipeline refactor (R6)"
description: "This scenario validates 4-stage pipeline refactor (R6) for `NEW-049`. It focuses on Confirm stage flow and invariant."
---

# NEW-049 -- 4-stage pipeline refactor (R6)

## 1. OVERVIEW

This scenario validates 4-stage pipeline refactor (R6) for `NEW-049`. It focuses on Confirm stage flow and invariant.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-049` and confirm the expected signals without contradicting evidence.

- Objective: Confirm stage flow and invariant
- Prompt: `Trace one query through all 4 stages.`
- Expected signals: Query traverses all 4 stages in order; stage transitions visible in verbose metadata; stage-4 scores immutable after final stage
- Pass/fail: PASS: All 4 stages execute in sequence; stage-4 scores unchanged after completion; FAIL: Stage skipped or stage-4 scores mutated

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-049 | 4-stage pipeline refactor (R6) | Confirm stage flow and invariant | `Trace one query through all 4 stages.` | 1) Run verbose stage metadata 2) inspect stage transitions 3) confirm stage-4 immutability | Query traverses all 4 stages in order; stage transitions visible in verbose metadata; stage-4 scores immutable after final stage | Verbose stage metadata trace showing 4-stage flow + stage-4 immutability verification | PASS: All 4 stages execute in sequence; stage-4 scores unchanged after completion; FAIL: Stage skipped or stage-4 scores mutated | Verify stage ordering enforcement → Check verbose metadata emission → Inspect stage-4 immutability guard |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/01-4-stage-pipeline-refactor.md](../../feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-049
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/049-4-stage-pipeline-refactor-r6.md`
