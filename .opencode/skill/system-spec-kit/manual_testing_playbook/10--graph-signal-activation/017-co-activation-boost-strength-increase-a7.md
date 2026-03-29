---
title: "017 -- Co-activation boost strength increase (A7)"
description: "This scenario validates Co-activation boost strength increase (A7) for `017`. It focuses on Confirm multiplier impact."
---

# 017 -- Co-activation boost strength increase (A7)

## 1. OVERVIEW

This scenario validates Co-activation boost strength increase (A7) for `017`. It focuses on Confirm multiplier impact.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `017` and confirm the expected signals without contradicting evidence.

- Objective: Confirm multiplier impact and batched lookup behavior
- Prompt: `Compare co-activation strength values for A7. Capture the evidence needed to prove Increased co-activation strength produces measurably higher contribution delta vs baseline; related-memory hydration batches detail fetches with one \`WHERE id IN (...)\` query; causal neighbors are hydrated with one joined SQL statement; and Stage 2 precomputes neighbor counts once per boosted batch. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Increased co-activation strength produces measurably higher contribution delta vs baseline; related-memory hydration uses one batched `WHERE id IN (...)` fetch; causal-neighbor lookup uses one CTE + join query; Stage 2 calls the neighbor-count precompute once per boosted batch
- Pass/fail: PASS: Contribution delta >0 when strength increased and the batched lookup path eliminates per-row N+1 calls; FAIL: No measurable difference, inverse effect, or per-row lookup behavior persists

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 017 | Co-activation boost strength increase (A7) | Confirm multiplier impact | `Compare co-activation strength values for A7. Capture the evidence needed to prove Increased co-activation strength produces measurably higher contribution delta vs baseline; related-memory hydration batches detail fetches with one \`WHERE id IN (...)\` query; causal neighbors are hydrated with one joined SQL statement; and Stage 2 precomputes neighbor counts once per boosted batch. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Baseline run 2) Increase strength 3) Compare contribution 4) Capture batching evidence for similarity-neighbor, causal-neighbor, and Stage 2 count lookup paths | Increased co-activation strength produces measurably higher contribution delta vs baseline; related-memory hydration uses one batched `WHERE id IN (...)` fetch; causal-neighbor lookup uses one CTE + join query; Stage 2 calls the neighbor-count precompute once per boosted batch | Baseline vs increased strength output comparison + contribution delta calculation + test/instrumentation evidence for batched `WHERE id IN (...)`, joined causal lookup, and one-shot `getRelatedMemoryCounts()` usage | PASS: Contribution delta >0 when strength increased and the batched lookup path eliminates per-row N+1 calls; FAIL: No measurable difference, inverse effect, or per-row lookup behavior persists | Verify strength parameter propagation → Check co-activation hydration query shapes → Inspect Stage 2 batching/precompute path |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [10--graph-signal-activation/02-co-activation-boost-strength-increase.md](../../feature_catalog/10--graph-signal-activation/02-co-activation-boost-strength-increase.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 017
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `10--graph-signal-activation/017-co-activation-boost-strength-increase-a7.md`
