---
title: "001 -- Graph channel ID fix (G1)"
description: "This scenario validates Graph channel ID fix (G1) for `001`. It focuses on Confirm graph hits are non-zero when edges exist."
---

# 001 -- Graph channel ID fix (G1)

## 1. OVERVIEW

This scenario validates Graph channel ID fix (G1) for `001`. It focuses on Confirm graph hits are non-zero when edges exist.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `001` and confirm the expected signals without contradicting evidence.

- Objective: Confirm graph hits are non-zero when edges exist
- Prompt: `Verify Graph channel ID fix (G1) manually with causal-edge data. Capture the evidence needed to prove Graph channel returns >0 hits when causal edges exist. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Graph channel returns >0 hits when causal edges exist
- Pass/fail: PASS: Graph channel contributes >=1 hit when causal edges exist; FAIL: Graph hits = 0 despite valid edges

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 001 | Graph channel ID fix (G1) | Confirm graph hits are non-zero when edges exist | `Verify Graph channel ID fix (G1) manually with causal-edge data. Capture the evidence needed to prove Graph channel returns >0 hits when causal edges exist. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create linked memories 2) Run graph-capable query 3) Verify graph hits | Graph channel returns >0 hits when causal edges exist | Command transcript + search output showing non-zero graph hits | PASS: Graph channel contributes >=1 hit when causal edges exist; FAIL: Graph hits = 0 despite valid edges | Verify causal edges exist via `memory_causal_stats()` → Check graph channel ID matches schema → Inspect channel activation flags |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md](../../feature_catalog/08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: 001
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `08--bug-fixes-and-data-integrity/001-graph-channel-id-fix-g1.md`
