---
title: "001 -- Graph channel ID fix (G1)"
description: "This scenario validates Graph channel ID fix (G1) for `001`. It focuses on Confirm graph hits are non-zero when edges exist."
audited_post_018: true
---

# 001 -- Graph channel ID fix (G1)

## 1. OVERVIEW

This scenario validates Graph channel ID fix (G1) for `001`. It focuses on Confirm graph hits are non-zero when edges exist.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `001` and confirm the expected signals without contradicting evidence.

- Objective: Confirm graph hits are non-zero when edges exist
- Prompt: `As a data-integrity validation operator, validate Graph channel ID fix (G1) against the documented validation surface. Verify graph hits are non-zero when edges exist. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Graph channel returns >0 hits when causal edges exist
- Pass/fail: PASS: Graph channel contributes >=1 hit when causal edges exist; FAIL: Graph hits = 0 despite valid edges

---

## 3. TEST EXECUTION

### Prompt

```
As a data-integrity validation operator, confirm graph hits are non-zero when edges exist against the documented validation surface. Verify graph channel returns >0 hits when causal edges exist. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Create linked memories
2. Run graph-capable query
3. Verify graph hits

### Expected

Graph channel returns >0 hits when causal edges exist

### Evidence

Command transcript + search output showing non-zero graph hits

### Pass / Fail

- **Pass**: Graph channel contributes >=1 hit when causal edges exist
- **Fail**: Graph hits = 0 despite valid edges

### Failure Triage

Verify causal edges exist via `memory_causal_stats()` → Check graph channel ID matches schema → Inspect channel activation flags

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md](../../feature_catalog/08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: 001
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `08--bug-fixes-and-data-integrity/001-graph-channel-id-fix-g1.md`
