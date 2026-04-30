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


- Objective: Confirm graph hits are non-zero when edges exist.
- Real user request: `Please validate Graph channel ID fix (G1) against the documented validation surface and tell me whether the expected signals are present: Graph channel returns >0 hits when causal edges exist.`
- RCAF Prompt: `As a data-integrity validation operator, validate Graph channel ID fix (G1) against the documented validation surface. Verify graph hits are non-zero when edges exist. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Graph channel returns >0 hits when causal edges exist
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
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

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md](../../feature_catalog/08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: 001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--bug-fixes-and-data-integrity/001-graph-channel-id-fix-g1.md`
