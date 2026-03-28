---
title: "097 -- Async ingestion job lifecycle (P0-3)"
description: "This scenario validates Async ingestion job lifecycle (P0-3) for `097`. It focuses on Confirm job state machine and crash recovery."
---

# 097 -- Async ingestion job lifecycle (P0-3)

## 1. OVERVIEW

This scenario validates Async ingestion job lifecycle (P0-3) for `097`. It focuses on Confirm job state machine and crash recovery.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `097` and confirm the expected signals without contradicting evidence.

- Objective: Confirm job state machine and crash recovery
- Prompt: `Validate memory_ingest_start/status/cancel lifecycle. Capture the evidence needed to prove Job state transitions through queued→parsing→embedding→indexing→complete in order; duplicate input paths are deduplicated before queueing and reported via duplicatePathCount; cancel sets state to cancelled; job IDs match nanoid format; and incomplete jobs re-enqueue after restart. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Job state transitions through queued→parsing→embedding→indexing→complete in order; duplicate input paths are deduplicated before queueing with explicit reporting; cancel sets state to cancelled; job IDs match nanoid format; incomplete jobs re-enqueue after restart
- Pass/fail: PASS if state machine transitions correctly, duplicate inputs are deduplicated before queueing, and cancel works

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 097 | Async ingestion job lifecycle (P0-3) | Confirm job state machine, duplicate-path dedup, and crash recovery | `Validate memory_ingest_start/status/cancel lifecycle. Capture the evidence needed to prove Job state transitions through queued→parsing→embedding→indexing→complete in order; duplicate input paths are deduplicated before queueing and reported via duplicatePathCount; cancel sets state to cancelled; job IDs match nanoid format; and incomplete jobs re-enqueue after restart. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_ingest_start({paths:["specs/<target-spec>/memory/file1.md","specs/<target-spec>/memory/file1.md","specs/<target-spec>/memory/file2.md"]})` → capture `jobId`, `duplicatePathCount`, and the dedup hint (must be explicit `.md` file paths, not directories) 2) `memory_ingest_status({jobId})` → verify state transitions (queued→parsing→embedding→indexing→complete) 3) start a new job, then `memory_ingest_cancel({jobId})` → verify cancelled state 4) verify job IDs are nanoid-style (`job_` prefix + 12 alphanumeric chars) 5) restart server → verify incomplete jobs re-enqueue via `resetIncompleteJobsToQueued` | Job state transitions through queued→parsing→embedding→indexing→complete in order; duplicate input paths are deduplicated before queueing with explicit reporting; cancel sets state to cancelled; job IDs match nanoid format; incomplete jobs re-enqueue after restart | Ingest tool outputs + duplicate-path reporting + job state sequence | PASS if state machine transitions correctly, duplicate inputs are removed before queueing, and cancel works | Inspect `handlers/memory-ingest.ts` path canonicalization and dedup logic, `lib/ops/job-queue.ts` state machine, and `resetIncompleteJobsToQueued` |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [05--lifecycle/05-async-ingestion-job-lifecycle.md](../../feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: 097
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md`
