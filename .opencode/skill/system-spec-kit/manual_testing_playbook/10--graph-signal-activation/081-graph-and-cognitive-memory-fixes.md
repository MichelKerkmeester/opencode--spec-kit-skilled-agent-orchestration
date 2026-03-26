---
title: "081 -- Graph and cognitive memory fixes"
description: "This scenario validates Graph and cognitive memory fixes for `081`. It focuses on Confirm graph/cognitive fix bundle."
---

# 081 -- Graph and cognitive memory fixes

## 1. OVERVIEW

This scenario validates Graph and cognitive memory fixes for `081`. It focuses on Confirm graph/cognitive fix bundle.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `081` and confirm the expected signals without contradicting evidence.

- Objective: Confirm graph/cognitive fix bundle
- Prompt: `Validate graph and cognitive memory fixes. Capture the evidence needed to prove Self-loops prevented; depth clamps enforced; cache invalidation triggers on mutation; no stale cognitive data returned. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Self-loops prevented; depth clamps enforced; cache invalidation triggers on mutation; no stale cognitive data returned
- Pass/fail: PASS if self-loops are blocked, depth stays within clamped bounds, and cache invalidates correctly on mutation

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 081 | Graph and cognitive memory fixes | Confirm graph/cognitive fix bundle | `Validate graph and cognitive memory fixes. Capture the evidence needed to prove Self-loops prevented; depth clamps enforced; cache invalidation triggers on mutation; no stale cognitive data returned. Return a concise user-facing pass/fail verdict with the main reason.` | 1) trigger self-loop/depth/cache scenarios 2) verify clamps/invalidations 3) capture results | Self-loops prevented; depth clamps enforced; cache invalidation triggers on mutation; no stale cognitive data returned | Self-loop attempt output + depth clamp evidence + cache invalidation trace | PASS if self-loops are blocked, depth stays within clamped bounds, and cache invalidates correctly on mutation | Inspect self-loop guard logic; verify depth clamp constants; check cache invalidation trigger points |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md](../../feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 081
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `10--graph-signal-activation/081-graph-and-cognitive-memory-fixes.md`
