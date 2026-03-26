---
title: "039 -- Verify-fix-verify memory quality loop (PI-A5)"
description: "This scenario validates Verify-fix-verify memory quality loop (PI-A5) for `039`. It focuses on Confirm retry then reject path."
---

# 039 -- Verify-fix-verify memory quality loop (PI-A5)

## 1. OVERVIEW

This scenario validates Verify-fix-verify memory quality loop (PI-A5) for `039`. It focuses on Confirm retry then reject path.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `039` and confirm the expected signals without contradicting evidence.

- Objective: Confirm retry then reject path
- Prompt: `Verify PI-A5 quality loop behavior. Capture the evidence needed to prove Low-quality memory triggers retry cycle; final reject after max retries; rejection reason logged. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Low-quality memory triggers retry cycle; final reject after max retries; rejection reason logged
- Pass/fail: PASS: Quality loop retries up to max attempts then rejects with reason; FAIL: No retry attempted or infinite retry loop

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 039 | Verify-fix-verify memory quality loop (PI-A5) | Confirm retry then reject path | `Verify PI-A5 quality loop behavior. Capture the evidence needed to prove Low-quality memory triggers retry cycle; final reject after max retries; rejection reason logged. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Submit low-quality memory 2) Observe retries 3) Confirm final reject | Low-quality memory triggers retry cycle; final reject after max retries; rejection reason logged | Retry attempt log + final reject output + rejection reason message | PASS: Quality loop retries up to max attempts then rejects with reason; FAIL: No retry attempted or infinite retry loop | Verify quality check criteria → Check max retry configuration → Inspect rejection reason generation |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md](../../feature_catalog/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 039
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/039-verify-fix-verify-memory-quality-loop-pi-a5.md`
