---
title: "EX-014 -- Workspace scanning and indexing (memory_index_scan)"
description: "This scenario validates Workspace scanning and indexing (memory_index_scan) for `EX-014`. It focuses on Incremental sync run."
---

# EX-014 -- Workspace scanning and indexing (memory_index_scan)

## 1. OVERVIEW

This scenario validates Workspace scanning and indexing (memory_index_scan) for `EX-014`. It focuses on Incremental sync run.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-014` and confirm the expected signals without contradicting evidence.

- Objective: Incremental sync run
- Prompt: `Run index scan for changed docs`
- Expected signals: Scan summary and updated index state
- Pass/fail: PASS if changed files reflected

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-014 | Workspace scanning and indexing (memory_index_scan) | Incremental sync run | `Run index scan for changed docs` | `memory_index_scan(force:false)` -> `memory_stats()` | Scan summary and updated index state | Scan output | PASS if changed files reflected | Retry force:true if drift remains |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md](../../feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md)

---

## 5. SOURCE METADATA

- Group: Existing Features
- Playbook ID: EX-014
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--existing-features/014-workspace-scanning-and-indexing-memory-index-scan.md`
