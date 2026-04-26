---
title: "017 -- Co-activation boost strength increase (A7)"
description: "This scenario validates Co-activation boost strength increase (A7) for `017`. It focuses on Confirm multiplier impact."
audited_post_018: true
---

# 017 -- Co-activation boost strength increase (A7)

## 1. OVERVIEW

This scenario validates Co-activation boost strength increase (A7) for `017`. It focuses on Confirm multiplier impact.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `017` and confirm the expected signals without contradicting evidence.

- Objective: Confirm multiplier impact and batched lookup behavior
- Prompt: `As a graph-signal validation operator, validate Co-activation boost strength increase (A7) against the documented validation surface. Verify increased co-activation strength produces measurably higher contribution delta vs baseline; related-memory hydration uses one batched WHERE id IN (...) fetch; causal-neighbor lookup uses one CTE + join query; Stage 2 calls the neighbor-count precompute once per boosted batch. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Increased co-activation strength produces measurably higher contribution delta vs baseline; related-memory hydration uses one batched `WHERE id IN (...)` fetch; causal-neighbor lookup uses one CTE + join query; Stage 2 calls the neighbor-count precompute once per boosted batch
- Pass/fail: PASS: Contribution delta >0 when strength increased and the batched lookup path eliminates per-row N+1 calls; FAIL: No measurable difference, inverse effect, or per-row lookup behavior persists

---

## 3. TEST EXECUTION

### Prompt

```
As a graph-signal validation operator, confirm multiplier impact against the documented validation surface. Verify increased co-activation strength produces measurably higher contribution delta vs baseline; related-memory hydration uses one batched WHERE id IN (...) fetch; causal-neighbor lookup uses one CTE + join query; Stage 2 calls the neighbor-count precompute once per boosted batch. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Baseline run
2. Increase strength
3. Compare contribution
4. Capture batching evidence for similarity-neighbor, causal-neighbor, and Stage 2 count lookup paths

### Expected

Increased co-activation strength produces measurably higher contribution delta vs baseline; related-memory hydration uses one batched `WHERE id IN (...)` fetch; causal-neighbor lookup uses one CTE + join query; Stage 2 calls the neighbor-count precompute once per boosted batch

### Evidence

Baseline vs increased strength output comparison + contribution delta calculation + test/instrumentation evidence for batched `WHERE id IN (...)`, joined causal lookup, and one-shot `getRelatedMemoryCounts()` usage

### Pass / Fail

- **Pass**: Contribution delta >0 when strength increased and the batched lookup path eliminates per-row N+1 calls
- **Fail**: No measurable difference, inverse effect, or per-row lookup behavior persists

### Failure Triage

Verify strength parameter propagation → Check co-activation hydration query shapes → Inspect Stage 2 batching/precompute path

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [10--graph-signal-activation/02-co-activation-boost-strength-increase.md](../../feature_catalog/10--graph-signal-activation/02-co-activation-boost-strength-increase.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 017
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--graph-signal-activation/017-co-activation-boost-strength-increase-a7.md`
