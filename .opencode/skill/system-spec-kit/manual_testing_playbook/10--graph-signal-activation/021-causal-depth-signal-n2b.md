---
title: "021 -- Causal depth signal (N2b)"
description: "This scenario validates Causal depth signal (N2b) for `021`. It focuses on Confirm normalized depth scoring."
audited_post_018: true
---

# 021 -- Causal depth signal (N2b)

## 1. OVERVIEW

This scenario validates Causal depth signal (N2b) for `021`. It focuses on Confirm normalized depth scoring.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `021` and confirm the expected signals without contradicting evidence.

- Objective: Confirm normalized depth scoring
- Prompt: `As a graph-signal validation operator, validate Causal depth signal (N2b) against the documented validation surface. Verify depth score normalized to [0,1]; deeper chains produce higher normalized values; shortcut edges do not reduce longest-path depth; cycle members share one bounded depth layer. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Depth score normalized to [0,1]; deeper chains produce higher normalized values; shortcut edges do not reduce longest-path depth; cycle members share one bounded depth layer
- Pass/fail: PASS: All depth scores in [0,1]; deeper nodes score >= shallower nodes on the same chain; shortcut targets still reflect the deeper path; FAIL: Out-of-range values or incorrect depth ordering

---

## 3. TEST EXECUTION

### Prompt

```
As a graph-signal validation operator, confirm normalized depth scoring against the documented validation surface. Verify depth score normalized to [0,1]; deeper chains produce higher normalized values; shortcut edges do not reduce longest-path depth; cycle members share one bounded depth layer. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Build multi-level graph with a shortcut edge or rooted cycle
2. Score depth
3. Verify normalized output

### Expected

Depth score normalized to [0,1]; deeper chains produce higher normalized values; shortcut edges do not reduce longest-path depth; cycle members share one bounded depth layer

### Evidence

Depth scoring output across multi-level graph + normalization range verification

### Pass / Fail

- **Pass**: All depth scores in [0,1]; deeper nodes score >= shallower nodes on the same chain; shortcut targets still reflect the deeper path
- **Fail**: Out-of-range values or incorrect depth ordering

### Failure Triage

Verify normalization formula → Check SCC condensation / longest-path traversal → Inspect graph depth counting

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [10--graph-signal-activation/06-causal-depth-signal.md](../../feature_catalog/10--graph-signal-activation/06-causal-depth-signal.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 021
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `10--graph-signal-activation/021-causal-depth-signal-n2b.md`
