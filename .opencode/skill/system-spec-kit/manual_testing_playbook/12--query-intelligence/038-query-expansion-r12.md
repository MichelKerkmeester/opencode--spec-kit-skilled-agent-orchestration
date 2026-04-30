---
title: "038 -- Query expansion (R12)"
description: "This scenario validates Query expansion (R12) for `038`. It focuses on Confirm parallel expansion + dedup."
audited_post_018: true
---

# 038 -- Query expansion (R12)

## 1. OVERVIEW

This scenario validates Query expansion (R12) for `038`. It focuses on Confirm parallel expansion + dedup.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm parallel expansion + dedup.
- Real user request: `Please validate Query expansion (R12) against the documented validation surface and tell me whether the expected signals are present: Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion.`
- RCAF Prompt: `As a query-intelligence validation operator, validate Query expansion (R12) against the documented validation surface. Verify complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Complex query generates >=2 expansion variants; results deduplicated; simple queries bypass expansion; FAIL: No expansion or duplicate results in output

---

## 3. TEST EXECUTION

### Prompt

```
As a query-intelligence validation operator, confirm parallel expansion + dedup against the documented validation surface. Verify complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Complex query expansion
2. Parallel baseline+expanded
3. dedup + simple-query skip

### Expected

Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion

### Evidence

Expanded query variants + dedup count + simple-query skip confirmation

### Pass / Fail

- **Pass**: Complex query generates >=2 expansion variants; results deduplicated; simple queries bypass expansion
- **Fail**: No expansion or duplicate results in output

### Failure Triage

Verify expansion trigger threshold → Check dedup logic → Inspect simple-query detection

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [12--query-intelligence/06-query-expansion.md](../../feature_catalog/12--query-intelligence/06-query-expansion.md)

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 038
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `12--query-intelligence/038-query-expansion-r12.md`
