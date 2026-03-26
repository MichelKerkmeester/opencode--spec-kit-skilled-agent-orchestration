---
title: "195 -- Temporal contiguity layer"
description: "This scenario validates Temporal contiguity layer for `195`. It focuses on Confirm Stage 1 temporal proximity reinforcement with cap and flag behavior."
---

# 195 -- Temporal contiguity layer

## 1. OVERVIEW

This scenario validates Temporal contiguity layer for `195`. It focuses on Confirm Stage 1 temporal proximity reinforcement with cap and flag behavior.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `195` and confirm the expected signals without contradicting evidence.

- Objective: Confirm Stage 1 temporal proximity reinforcement with cap and flag behavior
- Prompt: `Validate temporal contiguity layer. Capture the evidence needed to prove vectorSearchWithContiguity() applies pairwise temporal boosts inside the configured clamped window; closer-in-time memories receive stronger reinforcement than distant ones; cumulative boost per result stays within the 0.50 cap; disabling SPECKIT_TEMPORAL_CONTIGUITY removes the temporal layer. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: vectorSearchWithContiguity() applies pairwise temporal boosts inside the configured clamped window; closer-in-time memories receive stronger reinforcement than distant ones; cumulative boost per result stays within the 0.50 cap; disabling SPECKIT_TEMPORAL_CONTIGUITY removes the temporal layer
- Pass/fail: PASS if temporal boosts are distance-weighted within the clamped window, closer timestamps outrank distant ones on temporal contribution, the cumulative cap stays at or below 0.50, and flag-off mode removes the boost. FAIL if boosts ignore window boundaries, exceed the cap, or remain active when the flag is disabled.

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 195 | Temporal contiguity layer | Confirm Stage 1 temporal proximity reinforcement with cap and flag behavior | `Validate temporal contiguity layer. Capture the evidence needed to prove vectorSearchWithContiguity() applies pairwise temporal boosts inside the configured clamped window; closer-in-time memories receive stronger reinforcement than distant ones; cumulative boost per result stays within the 0.50 cap; disabling SPECKIT_TEMPORAL_CONTIGUITY removes the temporal layer. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Seed vector-search candidates with near and far timestamps 2) Run Stage 1 vector search with temporal contiguity enabled 3) Inspect pairwise boost contributions, clamped-window behavior, and the cumulative cap 4) Disable `SPECKIT_TEMPORAL_CONTIGUITY` and rerun for comparison | vectorSearchWithContiguity() applies pairwise temporal boosts inside the configured clamped window; closer-in-time memories receive stronger reinforcement than distant ones; cumulative boost per result stays within the 0.50 cap; disabling SPECKIT_TEMPORAL_CONTIGUITY removes the temporal layer | Vector result rankings + timestamp/boost comparison + cap verification + flag-on/off comparison | PASS if temporal boosts are distance-weighted within the clamped window, closer timestamps outrank distant ones on temporal contribution, the cumulative cap stays at or below 0.50, and flag-off mode removes the boost. FAIL if boosts ignore window boundaries, exceed the cap, or remain active when the flag is disabled. | Verify clamped-window configuration and default 3600-second behavior → Inspect pairwise distance weighting factor → Check cumulative cap accumulation logic → Confirm Stage 1 integration and feature-flag gating |

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
