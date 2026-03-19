---
title: "NEW-097 -- Async ingestion job lifecycle (P0-3)"
description: "This scenario validates Async ingestion job lifecycle (P0-3) for `NEW-097`. It focuses on Confirm job state machine and crash recovery."
---

# NEW-097 -- Async ingestion job lifecycle (P0-3)

## 1. OVERVIEW

This scenario validates Async ingestion job lifecycle (P0-3) for `NEW-097`. It focuses on Confirm job state machine and crash recovery.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-097` and confirm the expected signals without contradicting evidence.

- Objective: Confirm job state machine and crash recovery
- Prompt: `Validate memory_ingest_start/status/cancel lifecycle. Capture the evidence needed to prove Job state transitions through queued→parsing→embedding→indexing→complete in order; cancel sets state to cancelled; job IDs match nanoid format; incomplete jobs re-enqueue after restart. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Job state transitions through queued→parsing→embedding→indexing→complete in order; cancel sets state to cancelled; job IDs match nanoid format; incomplete jobs re-enqueue after restart
- Pass/fail: PASS if state machine transitions correctly through all 5 states and cancel works

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-097 | Async ingestion job lifecycle (P0-3) | Confirm job state machine and crash recovery | `Validate memory_ingest_start/status/cancel lifecycle. Capture the evidence needed to prove Job state transitions through queued→parsing→embedding→indexing→complete in order; cancel sets state to cancelled; job IDs match nanoid format; incomplete jobs re-enqueue after restart. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_ingest_start({paths:["specs/<target-spec>/memory/file1.md","specs/<target-spec>/memory/file2.md"]})` → capture jobId (must be explicit `.md` file paths, not directories) 2) `memory_ingest_status({jobId})` → verify state transitions (queued→parsing→embedding→indexing→complete) 3) start a new job, then `memory_ingest_cancel({jobId})` → verify cancelled state 4) verify job IDs are nanoid-style (`job_` prefix + 12 alphanumeric chars) 5) restart server → verify incomplete jobs re-enqueue via `resetIncompleteJobsToQueued` | Job state transitions through queued→parsing→embedding→indexing→complete in order; cancel sets state to cancelled; job IDs match nanoid format; incomplete jobs re-enqueue after restart | Ingest tool outputs + job state sequence | PASS if state machine transitions correctly through all 5 states and cancel works | Inspect `lib/ops/job-queue.ts` for state machine logic and `resetIncompleteJobsToQueued` |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [05--lifecycle/05-async-ingestion-job-lifecycle.md](../../feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: NEW-097
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md`
