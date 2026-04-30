---
title: "097 -- Async ingestion job lifecycle (P0-3)"
description: "This scenario validates Async ingestion job lifecycle (P0-3) for `097`. It focuses on Confirm job state machine and crash recovery."
---

# 097 -- Async ingestion job lifecycle (P0-3)

## 1. OVERVIEW

This scenario validates Async ingestion job lifecycle (P0-3) for `097`. It focuses on Confirm job state machine and crash recovery.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm job state machine and crash recovery.
- Real user request: `Please validate Async ingestion job lifecycle (P0-3) against memory_ingest_start({paths:["specs/<target-spec>/decision-record.md","specs/<target-spec>/decision-record.md","specs/<target-spec>/implementation-summary.md"]}) and tell me whether the expected signals are present: Job state transitions through queued→parsing→embedding→indexing→complete in order; duplicate input paths are deduplicated before queueing with explicit reporting; cancel sets state to cancelled; job IDs match nanoid format; incomplete jobs re-enqueue after restart.`
- RCAF Prompt: `As a lifecycle validation operator, validate Async ingestion job lifecycle (P0-3) against memory_ingest_start({paths:["specs/<target-spec>/decision-record.md","specs/<target-spec>/decision-record.md","specs/<target-spec>/implementation-summary.md"]}). Verify job state transitions through queued→parsing→embedding→indexing→complete in order; duplicate input paths are deduplicated before queueing with explicit reporting; cancel sets state to cancelled; job IDs match nanoid format; incomplete jobs re-enqueue after restart. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Job state transitions through queued→parsing→embedding→indexing→complete in order; duplicate input paths are deduplicated before queueing with explicit reporting; cancel sets state to cancelled; job IDs match nanoid format; incomplete jobs re-enqueue after restart
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if state machine transitions correctly, duplicate inputs are deduplicated before queueing, and cancel works

---

## 3. TEST EXECUTION

### Prompt

```
As a lifecycle validation operator, confirm job state machine, duplicate-path dedup, and crash recovery against memory_ingest_start({paths:["specs/<target-spec>/decision-record.md","specs/<target-spec>/decision-record.md","specs/<target-spec>/implementation-summary.md"]}). Verify job state transitions through queued→parsing→embedding→indexing→complete in order; duplicate input paths are deduplicated before queueing with explicit reporting; cancel sets state to cancelled; job IDs match nanoid format; incomplete jobs re-enqueue after restart. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `memory_ingest_start({paths:["specs/<target-spec>/decision-record.md","specs/<target-spec>/decision-record.md","specs/<target-spec>/implementation-summary.md"]})` → capture `jobId`, `duplicatePathCount`, and the dedup hint (must be explicit `.md` file paths, not directories)
2. `memory_ingest_status({ jobId:"<job-id>" })` → verify state transitions (queued→parsing→embedding→indexing→complete)
3. start a new job, then `memory_ingest_cancel({ jobId:"<job-id>" })` → verify cancelled state
4. verify job IDs are nanoid-style (`job_` prefix + 12 alphanumeric chars)
5. restart server → verify incomplete jobs re-enqueue via `resetIncompleteJobsToQueued`

### Expected

Job state transitions through queued→parsing→embedding→indexing→complete in order; duplicate input paths are deduplicated before queueing with explicit reporting; cancel sets state to cancelled; job IDs match nanoid format; incomplete jobs re-enqueue after restart

### Evidence

Ingest tool outputs + duplicate-path reporting + job state sequence

### Pass / Fail

- **Pass**: state machine transitions correctly, duplicate inputs are removed before queueing, and cancel works
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `handlers/memory-ingest.ts` path canonicalization and dedup logic, `lib/ops/job-queue.ts` state machine, and `resetIncompleteJobsToQueued`

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [05--lifecycle/05-async-ingestion-job-lifecycle.md](../../feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: 097
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md`
- audited_post_018: true
