---
title: "039 -- Verify-fix-verify memory quality loop (PI-A5)"
description: "This scenario validates Verify-fix-verify memory quality loop (PI-A5) for `039`. It focuses on Confirm retry then reject path."
audited_post_018: true
---

# 039 -- Verify-fix-verify memory quality loop (PI-A5)

## 1. OVERVIEW

This scenario validates Verify-fix-verify memory quality loop (PI-A5) for `039`. It focuses on Confirm retry then reject path.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm retry then reject path.
- Real user request: `Please validate Verify-fix-verify memory quality loop (PI-A5) against the documented validation surface and tell me whether the expected signals are present: Low-quality memory triggers retry cycle; final reject after max retries; rejection reason logged.`
- RCAF Prompt: `As a spec-doc record-quality validation operator, validate Verify-fix-verify memory quality loop (PI-A5) against the documented validation surface. Verify low-quality memory triggers retry cycle; final reject after max retries; rejection reason logged. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Low-quality memory triggers retry cycle; final reject after max retries; rejection reason logged
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Quality loop retries up to max attempts then rejects with reason; FAIL: No retry attempted or infinite retry loop

---

## 3. TEST EXECUTION

### Prompt

```
As a spec-doc record-quality validation operator, confirm retry then reject path against the documented validation surface. Verify low-quality memory triggers retry cycle; final reject after max retries; rejection reason logged. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Submit low-quality memory
2. Observe retries
3. Confirm final reject

### Expected

Low-quality memory triggers retry cycle; final reject after max retries; rejection reason logged

### Evidence

Retry attempt log + final reject output + rejection reason message

### Pass / Fail

- **Pass**: Quality loop retries up to max attempts then rejects with reason
- **Fail**: No retry attempted or infinite retry loop

### Failure Triage

Verify quality check criteria → Check max retry configuration → Inspect rejection reason generation

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md](../../feature_catalog/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 039
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `13--memory-quality-and-indexing/039-verify-fix-verify-memory-quality-loop-pi-a5.md`
