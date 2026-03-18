---
title: "NEW-016 -- Typed-weighted degree channel (R4)"
description: "This scenario validates Typed-weighted degree channel (R4) for `NEW-016`. It focuses on Confirm bounded typed-degree boost."
---

# NEW-016 -- Typed-weighted degree channel (R4)

## 1. OVERVIEW

This scenario validates Typed-weighted degree channel (R4) for `NEW-016`. It focuses on Confirm bounded typed-degree boost.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-016` and confirm the expected signals without contradicting evidence.

- Objective: Confirm bounded typed-degree boost
- Prompt: `Test typed-weighted degree channel (R4).`
- Expected signals: Typed-degree boost bounded within configured cap; fallback activates when edge types missing; varied types produce different scores
- Pass/fail: PASS: Boost values within [0, cap] range; fallback returns default when no typed edges; FAIL: Boost exceeds cap or fallback fails

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-016 | Typed-weighted degree channel (R4) | Confirm bounded typed-degree boost | `Test typed-weighted degree channel (R4).` | 1) Create varied edge types 2) Query 3) Verify caps/fallback | Typed-degree boost bounded within configured cap; fallback activates when edge types missing; varied types produce different scores | Query output with per-edge-type scores + cap verification + fallback behavior trace | PASS: Boost values within [0, cap] range; fallback returns default when no typed edges; FAIL: Boost exceeds cap or fallback fails | Verify edge type taxonomy → Check cap configuration → Inspect fallback default value → Validate degree computation |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [10--graph-signal-activation/01-typed-weighted-degree-channel.md](../../feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/016-typed-weighted-degree-channel-r4.md`
