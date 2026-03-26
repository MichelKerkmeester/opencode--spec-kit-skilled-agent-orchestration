---
title: "076 -- Activation window persistence"
description: "This scenario validates Activation window persistence for `076`. It focuses on Confirm warn-only window persistence."
---

# 076 -- Activation window persistence

## 1. OVERVIEW

This scenario validates Activation window persistence for `076`. It focuses on Confirm warn-only window persistence.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `076` and confirm the expected signals without contradicting evidence.

- Objective: Confirm warn-only window persistence
- Prompt: `Verify activation window persistence. Capture the evidence needed to prove Activation window timestamp persists across restart; warn-only mode respects persisted window; no timestamp reset on service restart. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Activation window timestamp persists across restart; warn-only mode respects persisted window; no timestamp reset on service restart
- Pass/fail: PASS if activation window timestamp survives restart and warn-only behavior is maintained

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 076 | Activation window persistence | Confirm warn-only window persistence | `Verify activation window persistence. Capture the evidence needed to prove Activation window timestamp persists across restart; warn-only mode respects persisted window; no timestamp reset on service restart. Return a concise user-facing pass/fail verdict with the main reason.` | 1) initialize window timestamp 2) restart 3) confirm no reset | Activation window timestamp persists across restart; warn-only mode respects persisted window; no timestamp reset on service restart | Pre-restart window state + post-restart window state comparison + warn-only behavior evidence | PASS if activation window timestamp survives restart and warn-only behavior is maintained | Check persistence mechanism for activation window; verify read-on-startup logic; inspect for unintentional reset paths |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [14--pipeline-architecture/09-activation-window-persistence.md](../../feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 076
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `14--pipeline-architecture/076-activation-window-persistence.md`
