---
title: "EX-013 -- Health diagnostics (memory_health)"
description: "This scenario validates Health diagnostics (memory_health) for `EX-013`. It focuses on Index/FTS integrity check."
---

# EX-013 -- Health diagnostics (memory_health)

## 1. OVERVIEW

This scenario validates Health diagnostics (memory_health) for `EX-013`. It focuses on Index/FTS integrity check.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-013` and confirm the expected signals without contradicting evidence.

- Objective: Index/FTS integrity check
- Prompt: `Run full health and divergent_aliases`
- Expected signals: healthy/degraded status and diagnostics
- Pass/fail: PASS if report completes with actionable diagnostics

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-013 | Health diagnostics (memory_health) | Index/FTS integrity check | `Run full health and divergent_aliases` | `memory_health(reportMode:full)` -> `memory_health(reportMode:divergent_aliases)` | healthy/degraded status and diagnostics | Health outputs | PASS if report completes with actionable diagnostics | Run index_scan(force) if FTS mismatch |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [03--discovery/03-health-diagnostics-memoryhealth.md](../../feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md)

---

## 5. SOURCE METADATA

- Group: Existing Features
- Playbook ID: EX-013
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--existing-features/013-health-diagnostics-memory-health.md`
