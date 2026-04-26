---
title: "EX-021 -- Causal edge deletion (memory_causal_unlink)"
description: "This scenario validates Causal edge deletion (memory_causal_unlink) for `EX-021`. It focuses on Edge correction."
audited_post_018: true
---

# EX-021 -- Causal edge deletion (memory_causal_unlink)

## 1. OVERVIEW

This scenario validates Causal edge deletion (memory_causal_unlink) for `EX-021`. It focuses on Edge correction.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `EX-021` and confirm the expected signals without contradicting evidence.

- Objective: Edge correction
- Prompt: `As an analysis validation operator, validate Causal edge deletion (memory_causal_unlink) against checkpoint_create({ name:"pre-ex021-causal-unlink", specFolder:"<sandbox-spec>" }). Verify removed edge absent in trace. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Removed edge absent in trace
- Pass/fail: PASS if edge removed and checkpoint exists

---

## 3. TEST EXECUTION

### Prompt

```
As an analysis validation operator, validate Edge correction against checkpoint_create({ name:"pre-ex021-causal-unlink", specFolder:"<sandbox-spec>" }). Verify removed edge absent in trace. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. checkpoint_create({ name:"pre-ex021-causal-unlink", specFolder:"<sandbox-spec>" })
2. memory_causal_unlink({ edgeId:"<edge-id>" })
3. memory_drift_why({ memoryId:"<memory-id>", direction:"both", maxDepth:4 })

### Expected

Removed edge absent in trace

### Evidence

Unlink + trace outputs

### Pass / Fail

- **Pass**: edge removed and checkpoint exists
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify edgeId exists; restore `pre-ex021-causal-unlink` if wrong edge removed

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [06--analysis/03-causal-edge-deletion-memorycausalunlink.md](../../feature_catalog/06--analysis/03-causal-edge-deletion-memorycausalunlink.md)

---

## 5. SOURCE METADATA

- Group: Analysis
- Playbook ID: EX-021
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--analysis/021-causal-edge-deletion-memory-causal-unlink.md`
