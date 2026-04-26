---
title: "081 -- Graph and cognitive memory fixes"
description: "This scenario validates Graph and cognitive memory fixes for `081`. It focuses on Confirm graph/cognitive fix bundle."
audited_post_018: true
---

# 081 -- Graph and cognitive memory fixes

## 1. OVERVIEW

This scenario validates Graph and cognitive memory fixes for `081`. It focuses on Confirm graph/cognitive fix bundle.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `081` and confirm the expected signals without contradicting evidence.

- Objective: Confirm graph/cognitive fix bundle
- Prompt: `As a graph-signal validation operator, validate Graph and cognitive memory fixes against the documented validation surface. Verify self-loops prevented; depth clamps enforced; cache invalidation triggers on mutation; no stale cognitive data returned. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Self-loops prevented; depth clamps enforced; cache invalidation triggers on mutation; no stale cognitive data returned
- Pass/fail: PASS if self-loops are blocked, depth stays within clamped bounds, and cache invalidates correctly on mutation

---

## 3. TEST EXECUTION

### Prompt

```
As a graph-signal validation operator, confirm graph/cognitive fix bundle against the documented validation surface. Verify self-loops prevented; depth clamps enforced; cache invalidation triggers on mutation; no stale cognitive data returned. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. trigger self-loop/depth/cache scenarios
2. verify clamps/invalidations
3. capture results

### Expected

Self-loops prevented; depth clamps enforced; cache invalidation triggers on mutation; no stale cognitive data returned

### Evidence

Self-loop attempt output + depth clamp evidence + cache invalidation trace

### Pass / Fail

- **Pass**: self-loops are blocked, depth stays within clamped bounds, and cache invalidates correctly on mutation
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect self-loop guard logic; verify depth clamp constants; check cache invalidation trigger points

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md](../../feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 081
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--graph-signal-activation/081-graph-and-cognitive-memory-fixes.md`
