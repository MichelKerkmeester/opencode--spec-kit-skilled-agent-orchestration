---
title: "028 -- Embedding cache (R18)"
description: "This scenario validates Embedding cache (R18) for `028`. It focuses on Confirm cache hit/miss behavior."
audited_post_018: true
---

# 028 -- Embedding cache (R18)

## 1. OVERVIEW

This scenario validates Embedding cache (R18) for `028`. It focuses on Confirm cache hit/miss behavior.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `028` and confirm the expected signals without contradicting evidence.

- Objective: Confirm cache hit/miss behavior
- Prompt: `As a scoring validation operator, validate Embedding cache (R18) against the documented validation surface. Verify cache hit returns instantly without embedding API call; cache miss triggers embedding; metadata timestamps updated on hit. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Cache hit returns instantly without embedding API call; cache miss triggers embedding; metadata timestamps updated on hit
- Pass/fail: PASS: Cache hit skips embedding call with <10ms latency; miss triggers embedding; hit updates lastAccessed timestamp; FAIL: Cache hit still calls embedding API or timestamps not updated

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 028 | Embedding cache (R18) | Confirm cache hit/miss behavior | `As a scoring validation operator, confirm cache hit/miss behavior against the documented validation surface. Verify cache hit returns instantly without embedding API call; cache miss triggers embedding; metadata timestamps updated on hit. Return a concise pass/fail verdict with the main reason and cited evidence.` | 1) Embed content/model pair 2) Repeat 3) Confirm hit and metadata update | Cache hit returns instantly without embedding API call; cache miss triggers embedding; metadata timestamps updated on hit | Cache hit/miss output + timing comparison + metadata timestamp verification | PASS: Cache hit skips embedding call with <10ms latency; miss triggers embedding; hit updates lastAccessed timestamp; FAIL: Cache hit still calls embedding API or timestamps not updated | Verify cache key computation (content+model) → Check cache storage backend → Inspect TTL/eviction policy |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/06-embedding-cache.md](../../feature_catalog/11--scoring-and-calibration/06-embedding-cache.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 028
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/028-embedding-cache-r18.md`
