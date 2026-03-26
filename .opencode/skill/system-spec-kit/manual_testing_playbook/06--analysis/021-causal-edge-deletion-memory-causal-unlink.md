---
title: "EX-021 -- Causal edge deletion (memory_causal_unlink)"
description: "This scenario validates Causal edge deletion (memory_causal_unlink) for `EX-021`. It focuses on Edge correction."
---

# EX-021 -- Causal edge deletion (memory_causal_unlink)

## 1. OVERVIEW

This scenario validates Causal edge deletion (memory_causal_unlink) for `EX-021`. It focuses on Edge correction.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-021` and confirm the expected signals without contradicting evidence.

- Objective: Edge correction
- Prompt: `Delete edge and re-trace. Capture the evidence needed to prove Removed edge absent in trace. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Removed edge absent in trace
- Pass/fail: PASS if edge removed and checkpoint exists

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-021 | Causal edge deletion (memory_causal_unlink) | Edge correction | `Delete edge and re-trace. Capture the evidence needed to prove Removed edge absent in trace. Return a concise user-facing pass/fail verdict with the main reason.` | `checkpoint_create({ name:"pre-ex021-causal-unlink", specFolder:"<sandbox-spec>" })` -> `memory_causal_unlink({ edgeId:"<edge-id>" })` -> `memory_drift_why({ memoryId:"<memory-id>", direction:"both", maxDepth:4 })` | Removed edge absent in trace | Unlink + trace outputs | PASS if edge removed and checkpoint exists | Verify edgeId exists; restore `pre-ex021-causal-unlink` if wrong edge removed |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [06--analysis/03-causal-edge-deletion-memorycausalunlink.md](../../feature_catalog/06--analysis/03-causal-edge-deletion-memorycausalunlink.md)

---

## 5. SOURCE METADATA

- Group: Analysis
- Playbook ID: EX-021
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `06--analysis/021-causal-edge-deletion-memory-causal-unlink.md`
