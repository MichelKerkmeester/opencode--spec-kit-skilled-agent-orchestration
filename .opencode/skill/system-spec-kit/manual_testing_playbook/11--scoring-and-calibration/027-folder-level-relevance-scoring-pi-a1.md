---
title: "027 -- Folder-level relevance scoring (PI-A1)"
description: "This scenario validates Folder-level relevance scoring (PI-A1) for `027`. It focuses on Confirm folder-first retrieval."
audited_post_018: true
---

# 027 -- Folder-level relevance scoring (PI-A1)

## 1. OVERVIEW

This scenario validates Folder-level relevance scoring (PI-A1) for `027`. It focuses on Confirm folder-first retrieval.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `027` and confirm the expected signals without contradicting evidence.

- Objective: Confirm folder-first retrieval
- Prompt: `As a scoring validation operator, validate Folder-level relevance scoring (PI-A1) against the documented validation surface. Verify folder pre-ranking scores computed; folder-level results appear before individual memory results in ranking. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Folder pre-ranking scores computed; folder-level results appear before individual memory results in ranking
- Pass/fail: PASS: Folders ranked first; individual results ordered within folder context; global query returns folder-prioritized results; FAIL: Folder ranking missing or individual results ignore folder context

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 027 | Folder-level relevance scoring (PI-A1) | Confirm folder-first retrieval | `As a scoring validation operator, confirm folder-first retrieval against the documented validation surface. Verify folder pre-ranking scores computed; folder-level results appear before individual memory results in ranking. Return a concise pass/fail verdict with the main reason and cited evidence.` | 1) Create varied folders 2) Run global query 3) Verify folder pre-ranking | Folder pre-ranking scores computed; folder-level results appear before individual memory results in ranking | Query output showing folder-level ranking + individual result ordering within folders | PASS: Folders ranked first; individual results ordered within folder context; global query returns folder-prioritized results; FAIL: Folder ranking missing or individual results ignore folder context | Verify folder scoring algorithm → Check pre-ranking stage insertion point → Inspect folder metadata availability |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/05-folder-level-relevance-scoring.md](../../feature_catalog/11--scoring-and-calibration/05-folder-level-relevance-scoring.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 027
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/027-folder-level-relevance-scoring-pi-a1.md`
