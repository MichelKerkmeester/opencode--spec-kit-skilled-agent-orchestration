---
title: "EX-001 -- Unified context retrieval (memory_context)"
description: "This scenario validates Unified context retrieval (memory_context) for `EX-001`. It focuses on Intent-aware context pull."
---

# EX-001 -- Unified context retrieval (memory_context)

## 1. OVERVIEW

This scenario validates Unified context retrieval (memory_context) for `EX-001`. It focuses on Intent-aware context pull.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-001` and confirm the expected signals without contradicting evidence.

- Objective: Intent-aware context pull
- Prompt: `Use memory_context in auto mode for: fix flaky index scan retry logic`
- Expected signals: Relevant bounded context returned; no empty response
- Pass/fail: PASS if relevant context returned in both calls

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-001 | Unified context retrieval (memory_context) | Intent-aware context pull | `Use memory_context in auto mode for: fix flaky index scan retry logic` | `memory_match_triggers({ prompt:"fix flaky index scan retry logic", sessionId:"ex001" })` -> `memory_context({ mode:"auto", prompt:"fix flaky index scan retry logic", sessionId:"ex001" })` -> `memory_context({ mode:"focused", prompt:"fix flaky index scan retry logic", sessionId:"ex001" })` | Relevant bounded context returned; no empty response | Tool outputs + mode selection | PASS if relevant context returned in both calls | Check specFolder/intent mismatch, retry with explicit intent |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [01--retrieval/01-unified-context-retrieval-memorycontext.md](../../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md)

---

## 5. SOURCE METADATA

- Group: Existing Features
- Playbook ID: EX-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--existing-features/001-unified-context-retrieval-memory-context.md`
