---
title: "EX-005 -- 4-stage pipeline architecture"
description: "This scenario validates 4-stage pipeline architecture for `EX-005`. It focuses on Stage invariant verification."
---

# EX-005 -- 4-stage pipeline architecture

## 1. OVERVIEW

This scenario validates 4-stage pipeline architecture for `EX-005`. It focuses on Stage invariant verification.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-005` and confirm the expected signals without contradicting evidence.

- Objective: Stage invariant verification
- Prompt: `Search Stage4Invariant score snapshot verifyScoreInvariant. Capture the evidence needed to prove No invariant errors; stable final scoring. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: No invariant errors; stable final scoring
- Pass/fail: PASS if no score-mutation symptoms

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-005 | 4-stage pipeline architecture | Stage invariant verification | `Search Stage4Invariant score snapshot verifyScoreInvariant. Capture the evidence needed to prove No invariant errors; stable final scoring. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search(query,intent:understand)` | No invariant errors; stable final scoring | Output + logs | PASS if no score-mutation symptoms | Inspect stage metadata and flags |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [01--retrieval/05-4-stage-pipeline-architecture.md](../../feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: EX-005
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--retrieval/005-4-stage-pipeline-architecture.md`
