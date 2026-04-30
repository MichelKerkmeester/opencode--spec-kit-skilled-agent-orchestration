---
title: "EX-022 -- Causal chain tracing (memory_drift_why)"
description: "This scenario validates Causal chain tracing (memory_drift_why) for `EX-022`. It focuses on Decision why-trace."
audited_post_018: true
---

# EX-022 -- Causal chain tracing (memory_drift_why)

## 1. OVERVIEW

This scenario validates Causal chain tracing (memory_drift_why) for `EX-022`. It focuses on Decision why-trace.

---

## 2. SCENARIO CONTRACT


- Objective: Decision why-trace.
- Real user request: `Please validate Causal chain tracing (memory_drift_why) against memory_drift_why(memoryId,direction:both,maxDepth:4) and tell me whether the expected signals are present: Chain includes expected relations.`
- RCAF Prompt: `As an analysis validation operator, validate Causal chain tracing (memory_drift_why) against memory_drift_why(memoryId,direction:both,maxDepth:4). Verify chain includes expected relations. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Chain includes expected relations
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if causal path returned

---

## 3. TEST EXECUTION

### Prompt

```
As an analysis validation operator, validate Decision why-trace against memory_drift_why(memoryId,direction:both,maxDepth:4). Verify chain includes expected relations. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_drift_why(memoryId,direction:both,maxDepth:4)

### Expected

Chain includes expected relations

### Evidence

Trace output

### Pass / Fail

- **Pass**: causal path returned
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Lower depth/rel filters if empty

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [06--analysis/04-causal-chain-tracing-memorydriftwhy.md](../../feature_catalog/06--analysis/04-causal-chain-tracing-memorydriftwhy.md)

---

## 5. SOURCE METADATA

- Group: Analysis
- Playbook ID: EX-022
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--analysis/022-causal-chain-tracing-memory-drift-why.md`
