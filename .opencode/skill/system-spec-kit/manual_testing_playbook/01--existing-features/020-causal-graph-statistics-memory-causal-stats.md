---
title: "EX-020 -- Causal graph statistics (memory_causal_stats)"
description: "This scenario validates Causal graph statistics (memory_causal_stats) for `EX-020`. It focuses on Graph coverage review."
---

# EX-020 -- Causal graph statistics (memory_causal_stats)

## 1. OVERVIEW

This scenario validates Causal graph statistics (memory_causal_stats) for `EX-020`. It focuses on Graph coverage review.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-020` and confirm the expected signals without contradicting evidence.

- Objective: Graph coverage review
- Prompt: `Return causal stats and coverage`
- Expected signals: Coverage and edge metrics present
- Pass/fail: PASS if metrics returned

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-020 | Causal graph statistics (memory_causal_stats) | Graph coverage review | `Return causal stats and coverage` | `memory_causal_stats()` | Coverage and edge metrics present | Stats output | PASS if metrics returned | Rebuild causal edges if empty |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [06--analysis/02-causal-graph-statistics-memorycausalstats.md](../../feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md)

---

## 5. SOURCE METADATA

- Group: Existing Features
- Playbook ID: EX-020
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--existing-features/020-causal-graph-statistics-memory-causal-stats.md`
