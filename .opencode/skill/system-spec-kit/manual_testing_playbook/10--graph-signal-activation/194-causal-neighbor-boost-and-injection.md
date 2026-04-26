---
title: "194 -- Causal neighbor boost and injection"
description: "This scenario validates Causal neighbor boost and injection for `194`. It focuses on Confirm 2-hop causal amplification with shared ceiling enforcement."
audited_post_018: true
---

# 194 -- Causal neighbor boost and injection

## 1. OVERVIEW

This scenario validates Causal neighbor boost and injection for `194`. It focuses on Confirm 2-hop causal amplification with shared ceiling enforcement.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `194` and confirm the expected signals without contradicting evidence.

- Objective: Confirm 2-hop causal amplification with shared ceiling enforcement
- Prompt: `As a graph-signal validation operator, validate Causal neighbor boost and injection against SPECKIT_CAUSAL_BOOST. Verify 2-hop causal amplification with shared ceiling enforcement. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Stage 2 fusion seeds causal traversal from top-ranked results; traversal reaches up to 2 hops with relation-type weighting and per-hop cap behavior; combined causal plus session boost stays within the 0.20 ceiling; disabling SPECKIT_CAUSAL_BOOST removes graph-based score adjustment
- Pass/fail: PASS if top seeds inject causal neighbors with weighted amplification, traversal stops within 2 hops, combined causal plus session boost never exceeds 0.20, and flag-off mode bypasses adjustment. FAIL if boosts ignore relation types, exceed ceilings, or remain active when the flag is disabled.

---

## 3. TEST EXECUTION

### Prompt

```
As a graph-signal validation operator, confirm 2-hop causal amplification with shared ceiling enforcement against SPECKIT_CAUSAL_BOOST. Verify stage 2 fusion seeds causal traversal from top-ranked results; traversal reaches up to 2 hops with relation-type weighting and per-hop cap behavior; combined causal plus session boost stays within the 0.20 ceiling; disabling SPECKIT_CAUSAL_BOOST removes graph-based score adjustment. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Seed a ranked result set with causal_edges across relation types and hop depths
2. Run Stage 2 fusion with causal boost enabled
3. Inspect boosted neighbors, hop counts, relation weights, and the combined ceiling
4. Disable `SPECKIT_CAUSAL_BOOST` and rerun for comparison

### Expected

Stage 2 fusion seeds causal traversal from top-ranked results; traversal reaches up to 2 hops with relation-type weighting and per-hop cap behavior; combined causal plus session boost stays within the 0.20 ceiling; disabling SPECKIT_CAUSAL_BOOST removes graph-based score adjustment

### Evidence

Ranked results before/after boost + hop-depth trace + relation-type weighting evidence + flag-on/off comparison

### Pass / Fail

- **Pass**: top seeds inject causal neighbors with weighted amplification, traversal stops within 2 hops, combined causal plus session boost never exceeds 0.20, and flag-off mode bypasses adjustment
- **Fail**: boosts ignore relation types, exceed ceilings, or remain active when the flag is disabled.

### Failure Triage

Verify seed selection cap and top-result sampling → Inspect relation-type multipliers and edge-strength usage → Check shared causal/session ceiling enforcement → Confirm flag gating in Stage 2 invocation

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [10--graph-signal-activation/10-causal-neighbor-boost-and-injection.md](../../feature_catalog/10--graph-signal-activation/10-causal-neighbor-boost-and-injection.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 194
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `10--graph-signal-activation/194-causal-neighbor-boost-and-injection.md`
