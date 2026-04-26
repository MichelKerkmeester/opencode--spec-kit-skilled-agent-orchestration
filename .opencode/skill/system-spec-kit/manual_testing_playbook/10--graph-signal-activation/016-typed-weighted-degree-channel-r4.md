---
title: "016 -- Typed-weighted degree channel (R4)"
description: "This scenario validates Typed-weighted degree channel (R4) for `016`. It focuses on Confirm bounded typed-degree boost."
audited_post_018: true
---

# 016 -- Typed-weighted degree channel (R4)

## 1. OVERVIEW

This scenario validates Typed-weighted degree channel (R4) for `016`. It focuses on Confirm bounded typed-degree boost.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `016` and confirm the expected signals without contradicting evidence.

- Objective: Confirm bounded typed-degree boost
- Prompt: `As a graph-signal validation operator, validate Typed-weighted degree channel (R4) against the documented validation surface. Verify typed-degree boost bounded within configured cap; cold-cache scoring batches uncached nodes in one SQL pass; cached global max prevents repeated normalization-base queries; fallback activates when edge types missing; varied types produce different scores. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Typed-degree boost bounded within configured cap; cold-cache scoring batches uncached nodes in one SQL pass; cached global max prevents repeated normalization-base queries; fallback activates when edge types missing; varied types produce different scores
- Pass/fail: PASS: Boost values within [0, cap] range; first cold-cache run shows one batched degree query plus cached max reuse on repeat; fallback returns default when no typed edges; FAIL: Boost exceeds cap, cold-cache path falls back to per-node/N+1 queries, or fallback fails

---

## 3. TEST EXECUTION

### Prompt

```
As a graph-signal validation operator, confirm bounded typed-degree boost against the documented validation surface. Verify typed-degree boost bounded within configured cap; cold-cache scoring batches uncached nodes in one SQL pass; cached global max prevents repeated normalization-base queries; fallback activates when edge types missing; varied types produce different scores. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Create varied edge types across multiple candidate memories
2. Clear the degree cache
3. Run the degree-scoring path once and capture SQL/query evidence for the cold-cache pass
4. Repeat without invalidation
5. Verify caps, cached-max reuse, and fallback behavior

### Expected

Typed-degree boost bounded within configured cap; cold-cache scoring batches uncached nodes in one SQL pass; cached global max prevents repeated normalization-base queries; fallback activates when edge types missing; varied types produce different scores

### Evidence

Query output with per-edge-type scores + cap verification + first-run batch SQL evidence + repeat-run cache reuse trace + fallback behavior trace

### Pass / Fail

- **Pass**: Boost values within [0, cap] range; first cold-cache run shows one batched degree query plus cached max reuse on repeat; fallback returns default when no typed edges
- **Fail**: Boost exceeds cap, cold-cache path falls back to per-node/N+1 queries, or fallback fails

### Failure Triage

Verify edge type taxonomy → Check cap configuration → Inspect cached global max state and invalidation path → Validate batch degree computation query shape

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [10--graph-signal-activation/01-typed-weighted-degree-channel.md](../../feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--graph-signal-activation/016-typed-weighted-degree-channel-r4.md`
