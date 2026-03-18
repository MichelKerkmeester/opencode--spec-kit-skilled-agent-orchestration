---
title: "NEW-027 -- Folder-level relevance scoring (PI-A1)"
description: "This scenario validates Folder-level relevance scoring (PI-A1) for `NEW-027`. It focuses on Confirm folder-first retrieval."
---

# NEW-027 -- Folder-level relevance scoring (PI-A1)

## 1. OVERVIEW

This scenario validates Folder-level relevance scoring (PI-A1) for `NEW-027`. It focuses on Confirm folder-first retrieval.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-027` and confirm the expected signals without contradicting evidence.

- Objective: Confirm folder-first retrieval
- Prompt: `Validate folder-level relevance scoring (PI-A1).`
- Expected signals: Folder pre-ranking scores computed; folder-level results appear before individual memory results in ranking
- Pass/fail: PASS: Folders ranked first; individual results ordered within folder context; global query returns folder-prioritized results; FAIL: Folder ranking missing or individual results ignore folder context

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-027 | Folder-level relevance scoring (PI-A1) | Confirm folder-first retrieval | `Validate folder-level relevance scoring (PI-A1).` | 1) Create varied folders 2) Run global query 3) Verify folder pre-ranking | Folder pre-ranking scores computed; folder-level results appear before individual memory results in ranking | Query output showing folder-level ranking + individual result ordering within folders | PASS: Folders ranked first; individual results ordered within folder context; global query returns folder-prioritized results; FAIL: Folder ranking missing or individual results ignore folder context | Verify folder scoring algorithm → Check pre-ranking stage insertion point → Inspect folder metadata availability |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/05-folder-level-relevance-scoring.md](../../feature_catalog/11--scoring-and-calibration/05-folder-level-relevance-scoring.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: NEW-027
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/027-folder-level-relevance-scoring-pi-a1.md`
