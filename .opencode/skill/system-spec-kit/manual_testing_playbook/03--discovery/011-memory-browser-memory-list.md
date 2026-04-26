---
title: "EX-011 -- Memory browser (memory_list)"
description: "This scenario validates Memory browser (memory_list) for `EX-011`. It focuses on Folder inventory audit."
---

# EX-011 -- Memory browser (memory_list)

## 1. OVERVIEW

This scenario validates Memory browser (memory_list) for `EX-011`. It focuses on Folder inventory audit.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `EX-011` and confirm the expected signals without contradicting evidence.

- Objective: Folder inventory audit
- Prompt: `As a discovery validation operator, validate Memory browser (memory_list) against memory_list(specFolder,limit,offset). Verify paginated list and totals. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Paginated list and totals
- Pass/fail: PASS if browsable inventory returned

---

## 3. TEST EXECUTION

### Prompt

```
As a discovery validation operator, validate Folder inventory audit against memory_list(specFolder,limit,offset). Verify paginated list and totals. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_list(specFolder,limit,offset)

### Expected

Paginated list and totals

### Evidence

List output

### Pass / Fail

- **Pass**: browsable inventory returned
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Reduce filters; verify specFolder path

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [03--discovery/01-memory-browser-memorylist.md](../../feature_catalog/03--discovery/01-memory-browser-memorylist.md)

---

## 5. SOURCE METADATA

- Group: Discovery
- Playbook ID: EX-011
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--discovery/011-memory-browser-memory-list.md`
- audited_post_018: true
