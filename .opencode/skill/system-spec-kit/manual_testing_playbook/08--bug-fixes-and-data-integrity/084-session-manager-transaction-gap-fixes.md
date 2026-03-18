---
title: "NEW-084 -- Session-manager transaction gap fixes"
description: "This scenario validates Session-manager transaction gap fixes for `NEW-084`. It focuses on Confirm transactional limit enforcement."
---

# NEW-084 -- Session-manager transaction gap fixes

## 1. OVERVIEW

This scenario validates Session-manager transaction gap fixes for `NEW-084`. It focuses on Confirm transactional limit enforcement.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-084` and confirm the expected signals without contradicting evidence.

- Objective: Confirm transactional limit enforcement
- Prompt: `Validate session-manager transaction gap fixes.`
- Expected signals: Concurrent writes are serialized via transactions; session limits enforced; no data corruption from concurrent access
- Pass/fail: PASS if concurrent writes are properly serialized, session limits hold, and no data corruption occurs

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-084 | Session-manager transaction gap fixes | Confirm transactional limit enforcement | `Validate session-manager transaction gap fixes.` | 1) simulate concurrent writes 2) inspect transactions 3) confirm limits enforced | Concurrent writes are serialized via transactions; session limits enforced; no data corruption from concurrent access | Concurrent write simulation output + transaction inspection + limit enforcement evidence | PASS if concurrent writes are properly serialized, session limits hold, and no data corruption occurs | Inspect transaction isolation level; verify session limit enforcement logic; check for race conditions in concurrent write paths |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md](../../feature_catalog/08--bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: NEW-084
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--bug-fixes-and-data-integrity/084-session-manager-transaction-gap-fixes.md`
