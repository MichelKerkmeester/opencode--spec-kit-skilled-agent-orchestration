---
title: "116 -- Chunking safe swap atomicity (P0-6)"
description: "This scenario validates Chunking safe swap atomicity (P0-6) for `116`. It focuses on Verify re-chunking indexes new chunks before deleting old ones, and old chunks survive if new indexing fails."
---

# 116 -- Chunking safe swap atomicity (P0-6)

## 1. OVERVIEW

This scenario validates Chunking safe swap atomicity (P0-6) for `116`. It focuses on Verify re-chunking indexes new chunks before deleting old ones, and old chunks survive if new indexing fails.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `116` and confirm the expected signals without contradicting evidence.

- Objective: Verify re-chunking indexes new chunks before deleting old ones, and old chunks survive if new indexing fails
- Prompt: `"Re-chunk a parent memory and verify old children survive indexing failure". Capture the evidence needed to prove New chunks indexed in staged state before old deletion; old chunks deleted only after successful new indexing; embedding failure preserves old children; handler returns error status on failure. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: New chunks indexed in staged state before old deletion; old chunks deleted only after successful new indexing; embedding failure preserves old children; handler returns error status on failure
- Pass/fail: PASS if new chunks are staged before old deletion and old children survive when new indexing fails

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 116 | Chunking safe swap atomicity (P0-6) | Verify re-chunking indexes new chunks before deleting old ones, and old chunks survive if new indexing fails | `"Re-chunk a parent memory and verify old children survive indexing failure". Capture the evidence needed to prove New chunks indexed in staged state before old deletion; old chunks deleted only after successful new indexing; embedding failure preserves old children; handler returns error status on failure. Return a concise user-facing pass/fail verdict with the main reason.` | **Precondition:** Create a parent memory with child chunks via `memory_save()`. 1) Trigger re-chunk on the parent 2) Verify new chunks are indexed in staged state before old deletion 3) Verify old children are deleted only after new chunks succeed 4) Simulate embedding failure for all new chunks 5) Verify old children remain intact and handler returns error status | New chunks indexed in staged state before old deletion; old chunks deleted only after successful new indexing; embedding failure preserves old children; handler returns error status on failure | Re-chunk output + staged chunk evidence + old chunk survival verification after failure | PASS if new chunks are staged before old deletion and old children survive when new indexing fails | Inspect chunking orchestrator swap logic; verify staged indexing precedes deletion; check error handling preserves old children |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md](../../feature_catalog/08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: 116
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--bug-fixes-and-data-integrity/116-chunking-safe-swap-atomicity-p0-6.md`
