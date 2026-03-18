---
title: "EX-004 -- Hybrid search pipeline"
description: "This scenario validates Hybrid search pipeline for `EX-004`. It focuses on Channel fusion sanity."
---

# EX-004 -- Hybrid search pipeline

## 1. OVERVIEW

This scenario validates Hybrid search pipeline for `EX-004`. It focuses on Channel fusion sanity.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-004` and confirm the expected signals without contradicting evidence.

- Objective: Channel fusion sanity
- Prompt: `Validate graph search fallback tiers behavior`
- Expected signals: Non-empty diverse results; fallback not empty
- Pass/fail: PASS if channels contribute and no empty tail

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-004 | Hybrid search pipeline | Channel fusion sanity | `Validate graph search fallback tiers behavior` | `memory_search(query,limit:25)` -> `memory_search(bypassCache:true)` | Non-empty diverse results; fallback not empty | Both run outputs | PASS if channels contribute and no empty tail | Force fallback tier, inspect flags |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [01--retrieval/04-hybrid-search-pipeline.md](../../feature_catalog/01--retrieval/04-hybrid-search-pipeline.md)

---

## 5. SOURCE METADATA

- Group: Existing Features
- Playbook ID: EX-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--existing-features/004-hybrid-search-pipeline.md`
