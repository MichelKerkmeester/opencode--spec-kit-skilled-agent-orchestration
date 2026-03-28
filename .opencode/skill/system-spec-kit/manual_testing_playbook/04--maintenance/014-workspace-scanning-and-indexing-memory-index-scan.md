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

- Objective: Incremental sync run with spec-doc warn-only indexing
- Prompt: `Run index scan for changed docs. Capture the evidence needed to prove Scan summary and updated index state, and that spec documents remain indexed in warn-only quality mode rather than being silently skipped. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Scan summary, updated index state, and spec-doc warn-only indexing behavior
- Pass/fail: PASS if changed files are reflected and spec docs remain indexed

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-014 | Workspace scanning and indexing (memory_index_scan) | Incremental sync run with spec-doc warn-only indexing | `Run index scan for changed docs. Capture the evidence needed to prove Scan summary and updated index state, and that spec documents remain indexed in warn-only quality mode rather than being silently skipped. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_index_scan(force:false, includeSpecDocs:true)` -> `memory_stats()` | Scan summary, updated index state, and spec-doc warn-only indexing behavior | Scan output plus any warning metadata for touched spec docs | PASS if changed files are reflected and spec docs remain indexed | Retry `force:true`; inspect `handlers/memory-index.ts` for spec-doc `qualityGateMode: 'warn-only'` if spec docs disappear |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md](../../feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md)

---

## 5. SOURCE METADATA

- Group: Maintenance
- Playbook ID: EX-014
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--maintenance/014-workspace-scanning-and-indexing-memory-index-scan.md`
