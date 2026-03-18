---
title: "NEW-079 -- Scoring and fusion corrections"
description: "This scenario validates Scoring and fusion corrections for `NEW-079`. It focuses on Confirm phase-017 correction bundle."
---

# NEW-079 -- Scoring and fusion corrections

## 1. OVERVIEW

This scenario validates Scoring and fusion corrections for `NEW-079`. It focuses on Confirm phase-017 correction bundle.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-079` and confirm the expected signals without contradicting evidence.

- Objective: Confirm phase-017 correction bundle
- Prompt: `Validate phase-017 scoring and fusion corrections.`
- Expected signals: Scoring math produces correct values; normalization stays within bounds; fusion formula applies corrected weights
- Pass/fail: PASS if scoring corrections produce mathematically correct results with proper normalization bounds

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-079 | Scoring and fusion corrections | Confirm phase-017 correction bundle | `Validate phase-017 scoring and fusion corrections.` | 1) run correction-specific queries 2) inspect math/normalization 3) verify expected outputs | Scoring math produces correct values; normalization stays within bounds; fusion formula applies corrected weights | Query output with scoring trace + normalization range verification + fusion weight evidence | PASS if scoring corrections produce mathematically correct results with proper normalization bounds | Inspect scoring formula changes from phase-017; verify normalization min/max; check fusion weight configuration |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/13-scoring-and-fusion-corrections.md](../../feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-079
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/079-scoring-and-fusion-corrections.md`
