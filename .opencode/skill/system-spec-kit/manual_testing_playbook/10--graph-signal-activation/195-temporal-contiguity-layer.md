---
title: "195 -- Temporal contiguity layer"
description: "This scenario validates Temporal contiguity layer for `195`. It focuses on Confirm Stage 1 temporal proximity reinforcement with cap and flag behavior."
---

# 195 -- Temporal contiguity layer

## 1. OVERVIEW

This scenario validates Temporal contiguity layer for `195`. It focuses on Confirm Stage 1 temporal proximity reinforcement plus bounded temporal-neighbor lookup behavior.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `195` and confirm the expected signals without contradicting evidence.

- Objective: Confirm Stage 1 temporal proximity reinforcement plus bounded temporal-neighbor lookup behavior
- Prompt: `Validate temporal contiguity layer. Capture the evidence needed to prove vectorSearchWithContiguity() applies pairwise temporal boosts inside the configured clamped window; closer-in-time memories receive stronger reinforcement than distant ones; cumulative boost per result stays within the 0.50 cap; disabling SPECKIT_TEMPORAL_CONTIGUITY removes the temporal layer; and getTemporalNeighbors() first narrows by spec_folder + created_at bounded range, then computes time_delta_seconds on the reduced set using the idx_spec_folder_created_at access path. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: vectorSearchWithContiguity() applies pairwise temporal boosts inside the configured clamped window; closer-in-time memories receive stronger reinforcement than distant ones; cumulative boost per result stays within the 0.50 cap; disabling SPECKIT_TEMPORAL_CONTIGUITY removes the temporal layer; getTemporalNeighbors() uses a bounded spec_folder/created_at query before computing time deltas
- Pass/fail: PASS if temporal boosts are distance-weighted within the clamped window, closer timestamps outrank distant ones on temporal contribution, the cumulative cap stays at or below 0.50, flag-off mode removes the boost, and temporal-neighbor lookup proves it narrows by bounded `created_at` range before computing `time_delta_seconds`. FAIL if boosts ignore window boundaries, exceed the cap, remain active when the flag is disabled, or neighbor lookup still computes deltas over an unbounded set.

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 195 | Temporal contiguity layer | Confirm Stage 1 temporal proximity reinforcement plus bounded temporal-neighbor lookup behavior | `Validate temporal contiguity layer. Capture the evidence needed to prove vectorSearchWithContiguity() applies pairwise temporal boosts inside the configured clamped window; closer-in-time memories receive stronger reinforcement than distant ones; cumulative boost per result stays within the 0.50 cap; disabling SPECKIT_TEMPORAL_CONTIGUITY removes the temporal layer; and getTemporalNeighbors() first narrows by spec_folder + created_at bounded range, then computes time_delta_seconds on the reduced set using the idx_spec_folder_created_at access path. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Seed vector-search candidates with near and far timestamps 2) Run Stage 1 vector search with temporal contiguity enabled 3) Inspect pairwise boost contributions, clamped-window behavior, and the cumulative cap 4) Seed an anchor memory plus in-range and out-of-range neighbors inside the same `spec_folder`, then call `getTemporalNeighbors()` 5) Capture query-plan or diagnostic evidence that the lookup uses `spec_folder` plus bounded `created_at >= ? AND created_at <= ?` filtering, backed by `idx_spec_folder_created_at`, before time deltas are computed 6) Confirm returned neighbors are sorted by computed `time_delta_seconds ASC` and exclude out-of-window rows 7) Disable `SPECKIT_TEMPORAL_CONTIGUITY` and rerun Stage 1 search for comparison | vectorSearchWithContiguity() applies pairwise temporal boosts inside the configured clamped window; closer-in-time memories receive stronger reinforcement than distant ones; cumulative boost per result stays within the 0.50 cap; disabling SPECKIT_TEMPORAL_CONTIGUITY removes the temporal layer; getTemporalNeighbors() uses a bounded spec_folder/created_at query before computing time deltas | Vector result rankings + timestamp/boost comparison + cap verification + query-plan/diagnostic evidence for bounded temporal lookup + returned neighbor ordering + flag-on/off comparison | PASS if temporal boosts are distance-weighted within the clamped window, closer timestamps outrank distant ones on temporal contribution, the cumulative cap stays at or below 0.50, flag-off mode removes the boost, and temporal-neighbor lookup proves it narrows by bounded `created_at` range before computing `time_delta_seconds`. FAIL if boosts ignore window boundaries, exceed the cap, remain active when the flag is disabled, or neighbor lookup still computes deltas over an unbounded set. | Verify clamped-window configuration and default 3600-second behavior -> inspect pairwise distance weighting factor -> check cumulative cap accumulation logic -> confirm `idx_spec_folder_created_at` exists and the bounded range predicate is used before delta computation |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [10--graph-signal-activation/11-temporal-contiguity-layer.md](../../feature_catalog/10--graph-signal-activation/11-temporal-contiguity-layer.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 195
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `10--graph-signal-activation/195-temporal-contiguity-layer.md`
