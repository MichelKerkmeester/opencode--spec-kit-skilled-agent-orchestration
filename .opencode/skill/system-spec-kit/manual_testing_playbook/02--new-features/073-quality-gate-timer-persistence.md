---
title: "NEW-073 -- Quality gate timer persistence"
description: "This scenario validates Quality gate timer persistence for `NEW-073`. It focuses on Confirm restart persistence."
---

# NEW-073 -- Quality gate timer persistence

## 1. OVERVIEW

This scenario validates Quality gate timer persistence for `NEW-073`. It focuses on Confirm restart persistence.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-073` and confirm the expected signals without contradicting evidence.

- Objective: Confirm restart persistence
- Prompt: `Verify quality gate timer persistence.`
- Expected signals: Activation timestamp survives service restart; quality gate respects persisted timer; no timer reset on restart
- Pass/fail: PASS if activation timestamp persists across restart and quality gate honors the original timer

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-073 | Quality gate timer persistence | Confirm restart persistence | `Verify quality gate timer persistence.` | 1) set activation timestamp 2) restart service 3) verify persisted timestamp | Activation timestamp survives service restart; quality gate respects persisted timer; no timer reset on restart | Pre-restart timestamp + post-restart timestamp comparison + quality gate status | PASS if activation timestamp persists across restart and quality gate honors the original timer | Check persistence storage mechanism; verify timer read-on-startup logic; inspect for race conditions during restart |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/14-quality-gate-timer-persistence.md](../../feature_catalog/13--memory-quality-and-indexing/14-quality-gate-timer-persistence.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-073
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/073-quality-gate-timer-persistence.md`
