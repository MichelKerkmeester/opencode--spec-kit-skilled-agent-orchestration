---
title: "EX-012 -- System statistics (memory_stats)"
description: "This scenario validates System statistics (memory_stats) for `EX-012`. It focuses on System baseline snapshot."
---

# EX-012 -- System statistics (memory_stats)

## 1. OVERVIEW

This scenario validates System statistics (memory_stats) for `EX-012`. It focuses on System baseline snapshot.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-012` and confirm the expected signals without contradicting evidence.

- Objective: System baseline snapshot
- Prompt: `Return stats with composite ranking. Capture the evidence needed to prove Counts, tiers, folder ranking present. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Counts, tiers, folder ranking present
- Pass/fail: PASS if dashboard fields populated

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-012 | System statistics (memory_stats) | System baseline snapshot | `Return stats with composite ranking. Capture the evidence needed to prove Counts, tiers, folder ranking present. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_stats(folderRanking:composite,includeScores:true)` | Counts, tiers, folder ranking present | Stats output | PASS if dashboard fields populated | Retry with default ranking on scoring error |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [03--discovery/02-system-statistics-memorystats.md](../../feature_catalog/03--discovery/02-system-statistics-memorystats.md)

---

## 5. SOURCE METADATA

- Group: Discovery
- Playbook ID: EX-012
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--discovery/012-system-statistics-memory-stats.md`
