---
title: "196 -- Tool-level TTL cache"
description: "This scenario validates tool-level TTL cache for `196`. It focuses on confirming per-tool cache hits, TTL expiry, and mutation-driven invalidation."
---

# 196 -- Tool-level TTL cache

## 1. OVERVIEW

This scenario validates tool-level TTL cache for `196`. It focuses on confirming per-tool cache hits, TTL expiry, and mutation-driven invalidation.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `196` and confirm the expected signals without contradicting evidence.

- Objective: Confirm per-tool cache hits, TTL expiry, and mutation-driven invalidation
- Prompt: `Verify the tool-level TTL cache on a repeated expensive request. Run the same request twice within the active TTL window and confirm the second run is served from the per-tool cache using the same SHA-256 cache key. Then invalidate the relevant search path with a mutation or wait for TTL expiry and verify the next run recomputes instead of serving stale data. Capture hit, miss, eviction or invalidation evidence and return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: first run records a cache miss for the tool/input combination; second identical run records a cache hit for the same SHA-256 key; cache stats reflect hits, misses, and invalidations; a relevant mutation or TTL expiry forces recomputation instead of returning stale results
- Pass/fail: PASS: identical repeat work hits the cache within TTL and recomputes after targeted invalidation or TTL expiry; FAIL: repeat work misses unexpectedly, stale data survives mutation/expiry, or cache accounting contradicts observed behavior

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 196 | Tool-level TTL cache | Confirm per-tool cache hits, TTL expiry, and mutation-driven invalidation | `Verify the tool-level TTL cache on a repeated expensive request. Run the same request twice within the active TTL window and confirm the second run is served from the per-tool cache using the same SHA-256 cache key. Then invalidate the relevant search path with a mutation or wait for TTL expiry and verify the next run recomputes instead of serving stale data. Capture hit, miss, eviction or invalidation evidence and return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm current cache settings, including active TTL window 2) Run a repeatable expensive request such as the same `memory_search` twice with identical inputs 3) Inspect cache stats or trace output to confirm miss then hit on the same tool/input key 4) Perform a relevant mutation such as `memory_save`, `memory_update`, or `memory_delete`, or wait past TTL expiry 5) Re-run the same request and confirm recomputation plus invalidation or expiry accounting | First run is a miss; second identical run is a hit; cache key is stable for identical tool+input; stats show hit/miss/invalidation activity; post-mutation or post-expiry run recomputes instead of returning stale data | Terminal transcript, cache stats or logs, repeated request output, and post-mutation or post-expiry rerun evidence | PASS: second identical run is a cache hit and the next run after invalidation or expiry recomputes cleanly; FAIL: repeated request misses inside TTL, stale results survive invalidation, or stats contradict the observed behavior | Verify TTL config and max-entry settings -> Confirm identical tool/input payloads were used -> Inspect cache-key hashing and per-tool scoping -> Check mutation hook invalidation path -> Review expiry cleanup timing and oldest-entry eviction behavior |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/15-tool-level-ttl-cache.md](../../feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 196
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/196-tool-level-ttl-cache.md`
