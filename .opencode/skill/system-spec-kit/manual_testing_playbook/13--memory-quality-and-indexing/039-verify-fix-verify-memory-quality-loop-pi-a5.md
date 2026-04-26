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

Operators run the exact prompt and command sequence for `039` and confirm the expected signals without contradicting evidence.

- Objective: Confirm retry then reject path
- Prompt: `As a spec-doc record-quality validation operator, validate Verify-fix-verify memory quality loop (PI-A5) against the documented validation surface. Verify low-quality memory triggers retry cycle; final reject after max retries; rejection reason logged. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Low-quality memory triggers retry cycle; final reject after max retries; rejection reason logged
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

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md](../../feature_catalog/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 039
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/039-verify-fix-verify-memory-quality-loop-pi-a5.md`
