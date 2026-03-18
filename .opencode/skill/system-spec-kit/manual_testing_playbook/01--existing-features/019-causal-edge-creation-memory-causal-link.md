---
title: "EX-019 -- Causal edge creation (memory_causal_link)"
description: "This scenario validates Causal edge creation (memory_causal_link) for `EX-019`. It focuses on Causal provenance linking."
---

# EX-019 -- Causal edge creation (memory_causal_link)

## 1. OVERVIEW

This scenario validates Causal edge creation (memory_causal_link) for `EX-019`. It focuses on Causal provenance linking.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-019` and confirm the expected signals without contradicting evidence.

- Objective: Causal provenance linking
- Prompt: `Link source->target supports strength 0.8`
- Expected signals: Edge appears in chain trace
- Pass/fail: PASS if relation visible in trace

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-019 | Causal edge creation (memory_causal_link) | Causal provenance linking | `Link source->target supports strength 0.8` | `memory_causal_link({ sourceId:"<memory-id-a>", targetId:"<memory-id-b>", relation:"supports", strength:0.8 })` -> `memory_drift_why({ memoryId:"<memory-id-b>", direction:"both", maxDepth:4 })` | Edge appears in chain trace | Link + trace outputs | PASS if relation visible in trace | Validate IDs/relation type |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [06--analysis/01-causal-edge-creation-memorycausallink.md](../../feature_catalog/06--analysis/01-causal-edge-creation-memorycausallink.md)

---

## 5. SOURCE METADATA

- Group: Existing Features
- Playbook ID: EX-019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--existing-features/019-causal-edge-creation-memory-causal-link.md`
