---
title: "196 -- Tool-level TTL cache"
description: "This scenario validates tool-level TTL cache for `196`. It focuses on confirming per-tool cache hits, TTL expiry, and mutation-driven invalidation."
audited_post_018: true
---

# 196 -- Tool-level TTL cache

## 1. OVERVIEW

This scenario validates tool-level TTL cache for `196`. It focuses on confirming per-tool cache hits, TTL expiry, and mutation-driven invalidation.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm per-tool cache hits, TTL expiry, and mutation-driven invalidation.
- Real user request: `Please validate Tool-level TTL cache against memory_search and tell me whether the expected signals are present: first run records a cache miss for the tool/input combination; second identical run records a cache hit for the same SHA-256 key; cache stats reflect hits, misses, and invalidations; a relevant mutation or TTL expiry forces recomputation instead of returning stale results.`
- RCAF Prompt: `As a scoring validation operator, validate Tool-level TTL cache against memory_search. Verify per-tool cache hits, TTL expiry, and mutation-driven invalidation. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: first run records a cache miss for the tool/input combination; second identical run records a cache hit for the same SHA-256 key; cache stats reflect hits, misses, and invalidations; a relevant mutation or TTL expiry forces recomputation instead of returning stale results
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: identical repeat work hits the cache within TTL and recomputes after targeted invalidation or TTL expiry; FAIL: repeat work misses unexpectedly, stale data survives mutation/expiry, or cache accounting contradicts observed behavior

---

## 3. TEST EXECUTION

### Prompt

```
As a scoring validation operator, confirm per-tool cache hits, TTL expiry, and mutation-driven invalidation against memory_search. Verify first run is a miss; second identical run is a hit; cache key is stable for identical tool+input; stats show hit/miss/invalidation activity; post-mutation or post-expiry run recomputes instead of returning stale data. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Confirm current cache settings, including active TTL window
2. Run a repeatable expensive request such as the same `memory_search` twice with identical inputs
3. Inspect cache stats or trace output to confirm miss then hit on the same tool/input key
4. Perform a relevant mutation such as `memory_save`, `memory_update`, or `memory_delete`, or wait past TTL expiry
5. Re-run the same request and confirm recomputation plus invalidation or expiry accounting

### Expected

First run is a miss; second identical run is a hit; cache key is stable for identical tool+input; stats show hit/miss/invalidation activity; post-mutation or post-expiry run recomputes instead of returning stale data

### Evidence

Terminal transcript, cache stats or logs, repeated request output, and post-mutation or post-expiry rerun evidence

### Pass / Fail

- **Pass**: second identical run is a cache hit and the next run after invalidation or expiry recomputes cleanly
- **Fail**: repeated request misses inside TTL, stale results survive invalidation, or stats contradict the observed behavior

### Failure Triage

Verify TTL config and max-entry settings -> Confirm identical tool/input payloads were used -> Inspect cache-key hashing and per-tool scoping -> Check mutation hook invalidation path -> Review expiry cleanup timing and oldest-entry eviction behavior

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/15-tool-level-ttl-cache.md](../../feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 196
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/196-tool-level-ttl-cache.md`
