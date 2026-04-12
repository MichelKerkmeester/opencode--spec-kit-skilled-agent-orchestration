---
title: "EX-020 -- Causal graph statistics (memory_causal_stats)"
description: "This scenario validates Causal graph statistics (memory_causal_stats) for `EX-020`. It focuses on Graph coverage review."
audited_post_018: true
---

# EX-020 -- Causal graph statistics (memory_causal_stats)

## 1. OVERVIEW

This scenario validates Causal graph statistics (memory_causal_stats) for `EX-020`. It focuses on Graph coverage review.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-020` and confirm the expected signals without contradicting evidence.

- Objective: Graph coverage review
- Prompt: `As an analysis validation operator, validate Causal graph statistics (memory_causal_stats) against memory_causal_stats(). Verify coverage and edge metrics present. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Coverage and edge metrics present
- Pass/fail: PASS if metrics returned

---

## 3. TEST EXECUTION

### Prompt

```
As an analysis validation operator, validate Graph coverage review against memory_causal_stats(). Verify coverage and edge metrics present. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_causal_stats()

### Expected

Coverage and edge metrics present

### Evidence

Stats output

### Pass / Fail

- **Pass**: metrics returned
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Rebuild causal edges if empty

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [06--analysis/02-causal-graph-statistics-memorycausalstats.md](../../feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md)

---

## 5. SOURCE METADATA

- Group: Analysis
- Playbook ID: EX-020
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `06--analysis/020-causal-graph-statistics-memory-causal-stats.md`
