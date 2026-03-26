---
title: "EX-011 -- Memory browser (memory_list)"
description: "This scenario validates Memory browser (memory_list) for `EX-011`. It focuses on Folder inventory audit."
---

# EX-011 -- Memory browser (memory_list)

## 1. OVERVIEW

This scenario validates Memory browser (memory_list) for `EX-011`. It focuses on Folder inventory audit.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-011` and confirm the expected signals without contradicting evidence.

- Objective: Folder inventory audit
- Prompt: `List memories in target spec folder. Capture the evidence needed to prove Paginated list and totals. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Paginated list and totals
- Pass/fail: PASS if browsable inventory returned

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-011 | Memory browser (memory_list) | Folder inventory audit | `List memories in target spec folder. Capture the evidence needed to prove Paginated list and totals. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_list(specFolder,limit,offset)` | Paginated list and totals | List output | PASS if browsable inventory returned | Reduce filters; verify specFolder path |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [03--discovery/01-memory-browser-memorylist.md](../../feature_catalog/03--discovery/01-memory-browser-memorylist.md)

---

## 5. SOURCE METADATA

- Group: Discovery
- Playbook ID: EX-011
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--discovery/011-memory-browser-memory-list.md`
