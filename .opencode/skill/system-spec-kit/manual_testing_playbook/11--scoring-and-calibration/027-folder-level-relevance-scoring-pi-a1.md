---
title: "027 -- Folder-level relevance scoring (PI-A1)"
description: "This scenario validates Folder-level relevance scoring (PI-A1) for `027`. It focuses on Confirm folder-first retrieval."
audited_post_018: true
---

# 027 -- Folder-level relevance scoring (PI-A1)

## 1. OVERVIEW

This scenario validates Folder-level relevance scoring (PI-A1) for `027`. It focuses on Confirm folder-first retrieval.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm folder-first retrieval.
- Real user request: `Please validate Folder-level relevance scoring (PI-A1) against the documented validation surface and tell me whether the expected signals are present: Folder pre-ranking scores computed; folder-level results appear before individual memory results in ranking.`
- RCAF Prompt: `As a scoring validation operator, validate Folder-level relevance scoring (PI-A1) against the documented validation surface. Verify folder pre-ranking scores computed; folder-level results appear before individual memory results in ranking. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Folder pre-ranking scores computed; folder-level results appear before individual memory results in ranking
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Folders ranked first; individual results ordered within folder context; global query returns folder-prioritized results; FAIL: Folder ranking missing or individual results ignore folder context

---

## 3. TEST EXECUTION

### Prompt

```
As a scoring validation operator, confirm folder-first retrieval against the documented validation surface. Verify folder pre-ranking scores computed; folder-level results appear before individual memory results in ranking. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Create varied folders
2. Run global query
3. Verify folder pre-ranking

### Expected

Folder pre-ranking scores computed; folder-level results appear before individual memory results in ranking

### Evidence

Query output showing folder-level ranking + individual result ordering within folders

### Pass / Fail

- **Pass**: Folders ranked first; individual results ordered within folder context; global query returns folder-prioritized results
- **Fail**: Folder ranking missing or individual results ignore folder context

### Failure Triage

Verify folder scoring algorithm → Check pre-ranking stage insertion point → Inspect folder metadata availability

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/05-folder-level-relevance-scoring.md](../../feature_catalog/11--scoring-and-calibration/05-folder-level-relevance-scoring.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 027
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/027-folder-level-relevance-scoring-pi-a1.md`
