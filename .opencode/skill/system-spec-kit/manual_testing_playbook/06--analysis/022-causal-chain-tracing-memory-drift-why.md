---
title: "EX-022 -- Causal chain tracing (memory_drift_why)"
description: "This scenario validates Causal chain tracing (memory_drift_why) for `EX-022`. It focuses on Decision why-trace."
---

# EX-022 -- Causal chain tracing (memory_drift_why)

## 1. OVERVIEW

This scenario validates Causal chain tracing (memory_drift_why) for `EX-022`. It focuses on Decision why-trace.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-022` and confirm the expected signals without contradicting evidence.

- Objective: Decision why-trace
- Prompt: `Trace both directions to depth 4. Capture the evidence needed to prove Chain includes expected relations. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Chain includes expected relations
- Pass/fail: PASS if causal path returned

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-022 | Causal chain tracing (memory_drift_why) | Decision why-trace | `Trace both directions to depth 4. Capture the evidence needed to prove Chain includes expected relations. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_drift_why(memoryId,direction:both,maxDepth:4)` | Chain includes expected relations | Trace output | PASS if causal path returned | Lower depth/rel filters if empty |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [06--analysis/04-causal-chain-tracing-memorydriftwhy.md](../../feature_catalog/06--analysis/04-causal-chain-tracing-memorydriftwhy.md)

---

## 5. SOURCE METADATA

- Group: Analysis
- Playbook ID: EX-022
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `06--analysis/022-causal-chain-tracing-memory-drift-why.md`
