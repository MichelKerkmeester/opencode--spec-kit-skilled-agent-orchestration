---
title: "058 -- Lightweight consolidation (N3-lite)"
description: "This scenario validates Lightweight consolidation (N3-lite) for `058`. It focuses on Confirm maintenance cycle behavior."
audited_post_018: true
---

# 058 -- Lightweight consolidation (N3-lite)

## 1. OVERVIEW

This scenario validates Lightweight consolidation (N3-lite) for `058`. It focuses on Confirm maintenance cycle behavior.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `058` and confirm the expected signals without contradicting evidence.

- Objective: Confirm maintenance cycle behavior
- Prompt: `As a retrieval-enhancement validation operator, validate Lightweight consolidation (N3-lite) against the documented validation surface. Verify consolidation cycle completes; contradiction detection, hebbian strengthening, and staleness decay all produce output; no runtime errors in logs. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Consolidation cycle completes; contradiction detection, hebbian strengthening, and staleness decay all produce output; no runtime errors in logs
- Pass/fail: PASS if all three consolidation sub-processes execute and produce expected outputs without errors

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 058 | Lightweight consolidation (N3-lite) | Confirm maintenance cycle behavior | `As a retrieval-enhancement validation operator, confirm maintenance cycle behavior against the documented validation surface. Verify consolidation cycle completes; contradiction detection, hebbian strengthening, and staleness decay all produce output; no runtime errors in logs. Return a concise pass/fail verdict with the main reason and cited evidence.` | 1) trigger cycle 2) inspect contradiction/hebbian/staleness outputs 3) verify logs | Consolidation cycle completes; contradiction detection, hebbian strengthening, and staleness decay all produce output; no runtime errors in logs | Consolidation cycle output + log entries for each sub-step (contradiction/hebbian/staleness) | PASS if all three consolidation sub-processes execute and produce expected outputs without errors | Check consolidation trigger mechanism; inspect individual sub-process logs; verify database state before and after cycle |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [15--retrieval-enhancements/04-lightweight-consolidation.md](../../feature_catalog/15--retrieval-enhancements/04-lightweight-consolidation.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 058
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `15--retrieval-enhancements/058-lightweight-consolidation-n3-lite.md`
