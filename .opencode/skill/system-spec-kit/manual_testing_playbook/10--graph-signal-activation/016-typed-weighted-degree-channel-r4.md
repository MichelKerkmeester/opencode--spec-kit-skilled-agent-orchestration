---
title: "016 -- Typed-weighted degree channel (R4)"
description: "This scenario validates Typed-weighted degree channel (R4) for `016`. It focuses on Confirm bounded typed-degree boost."
---

# 016 -- Typed-weighted degree channel (R4)

## 1. OVERVIEW

This scenario validates Typed-weighted degree channel (R4) for `016`. It focuses on Confirm bounded typed-degree boost.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `016` and confirm the expected signals without contradicting evidence.

- Objective: Confirm bounded typed-degree boost
- Prompt: `Test typed-weighted degree channel (R4). Capture the evidence needed to prove Typed-degree boost bounded within configured cap; cold-cache scoring computes uncached nodes through one batched SQL pass and caches the global max for reuse; fallback activates when edge types missing; varied types produce different scores. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Typed-degree boost bounded within configured cap; cold-cache scoring batches uncached nodes in one SQL pass; cached global max prevents repeated normalization-base queries; fallback activates when edge types missing; varied types produce different scores
- Pass/fail: PASS: Boost values within [0, cap] range; first cold-cache run shows one batched degree query plus cached max reuse on repeat; fallback returns default when no typed edges; FAIL: Boost exceeds cap, cold-cache path falls back to per-node/N+1 queries, or fallback fails

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 016 | Typed-weighted degree channel (R4) | Confirm bounded typed-degree boost | `Test typed-weighted degree channel (R4). Capture the evidence needed to prove Typed-degree boost bounded within configured cap; cold-cache scoring computes uncached nodes through one batched SQL pass and caches the global max for reuse; fallback activates when edge types missing; varied types produce different scores. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create varied edge types across multiple candidate memories 2) Clear the degree cache 3) Run the degree-scoring path once and capture SQL/query evidence for the cold-cache pass 4) Repeat without invalidation 5) Verify caps, cached-max reuse, and fallback behavior | Typed-degree boost bounded within configured cap; cold-cache scoring batches uncached nodes in one SQL pass; cached global max prevents repeated normalization-base queries; fallback activates when edge types missing; varied types produce different scores | Query output with per-edge-type scores + cap verification + first-run batch SQL evidence + repeat-run cache reuse trace + fallback behavior trace | PASS: Boost values within [0, cap] range; first cold-cache run shows one batched degree query plus cached max reuse on repeat; fallback returns default when no typed edges; FAIL: Boost exceeds cap, cold-cache path falls back to per-node/N+1 queries, or fallback fails | Verify edge type taxonomy → Check cap configuration → Inspect cached global max state and invalidation path → Validate batch degree computation query shape |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [10--graph-signal-activation/01-typed-weighted-degree-channel.md](../../feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 016
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `10--graph-signal-activation/016-typed-weighted-degree-channel-r4.md`
