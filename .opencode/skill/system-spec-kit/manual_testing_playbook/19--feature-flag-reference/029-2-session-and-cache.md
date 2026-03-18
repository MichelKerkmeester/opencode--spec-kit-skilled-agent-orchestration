---
title: "EX-029 -- 2. Session and Cache"
description: "This scenario validates 2. Session and Cache for `EX-029`. It focuses on Session policy audit."
---

# EX-029 -- 2. Session and Cache

## 1. OVERVIEW

This scenario validates 2. Session and Cache for `EX-029`. It focuses on Session policy audit.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-029` and confirm the expected signals without contradicting evidence.

- Objective: Session policy audit
- Prompt: `Retrieve dedup/cache policy settings`
- Expected signals: Session/cache controls found
- Pass/fail: PASS if all required keys surfaced

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-029 | 2. Session and Cache | Session policy audit | `Retrieve dedup/cache policy settings` | `memory_search({ query:"DISABLE_SESSION_DEDUP session cache policy settings", limit:20 })` | Session/cache controls found | Search output | PASS if all required keys surfaced | Expand query terms |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [19--feature-flag-reference/02-2-session-and-cache.md](../../feature_catalog/19--feature-flag-reference/02-2-session-and-cache.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: EX-029
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `19--feature-flag-reference/029-2-session-and-cache.md`
