---
title: "038 -- Query expansion (R12)"
description: "This scenario validates Query expansion (R12) for `038`. It focuses on Confirm parallel expansion + dedup."
---

# 038 -- Query expansion (R12)

## 1. OVERVIEW

This scenario validates Query expansion (R12) for `038`. It focuses on Confirm parallel expansion + dedup.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `038` and confirm the expected signals without contradicting evidence.

- Objective: Confirm parallel expansion + dedup
- Prompt: `Validate query expansion (R12). Capture the evidence needed to prove Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion
- Pass/fail: PASS: Complex query generates >=2 expansion variants; results deduplicated; simple queries bypass expansion; FAIL: No expansion or duplicate results in output

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 038 | Query expansion (R12) | Confirm parallel expansion + dedup | `Validate query expansion (R12). Capture the evidence needed to prove Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Complex query expansion 2) Parallel baseline+expanded 3) dedup + simple-query skip | Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion | Expanded query variants + dedup count + simple-query skip confirmation | PASS: Complex query generates >=2 expansion variants; results deduplicated; simple queries bypass expansion; FAIL: No expansion or duplicate results in output | Verify expansion trigger threshold → Check dedup logic → Inspect simple-query detection |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [12--query-intelligence/06-query-expansion.md](../../feature_catalog/12--query-intelligence/06-query-expansion.md)

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 038
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `12--query-intelligence/038-query-expansion-r12.md`
