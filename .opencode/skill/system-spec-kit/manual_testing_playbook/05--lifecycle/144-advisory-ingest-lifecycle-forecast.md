---
title: "144 -- Advisory ingest lifecycle forecast"
description: "This scenario validates Advisory ingest lifecycle forecast for `144`. It focuses on Verify `memory_ingest_status` exposes advisory forecast fields and degrades safely on sparse progress."
---

# 144 -- Advisory ingest lifecycle forecast

## 1. OVERVIEW

This scenario validates Advisory ingest lifecycle forecast for `144`. It focuses on Verify `memory_ingest_status` exposes advisory forecast fields and degrades safely on sparse progress.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `144` and confirm the expected signals without contradicting evidence.

- Objective: Verify `memory_ingest_status` exposes advisory forecast fields and degrades safely on sparse progress
- Prompt: `As a lifecycle validation operator, validate Advisory ingest lifecycle forecast against memory_ingest_start({ paths:["specs/<target-spec>/decision-record.md","specs/<target-spec>/implementation-summary.md"] }). Verify memory_ingest_status exposes advisory forecast fields and degrades safely on sparse progress. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Status payloads always include a `forecast` object; sparse progress yields null or low-confidence fields plus caveat text; progressing jobs update ETA/risk fields without breaking the handler contract; optional telemetry remains additive
- Pass/fail: PASS if forecast fields are always present, sparse states degrade safely, and progressing jobs update the advisory values without handler failure

---

## 3. TEST EXECUTION

### Prompt

```
As a lifecycle validation operator, verify memory_ingest_status exposes advisory forecast fields and degrades safely on sparse progress against memory_ingest_start({ paths:["specs/<target-spec>/decision-record.md","specs/<target-spec>/implementation-summary.md"] }). Verify status payloads always include a forecast object; sparse progress yields null or low-confidence fields plus caveat text; progressing jobs update ETA/risk fields without breaking the handler contract; optional telemetry remains additive. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `memory_ingest_start({ paths:["specs/<target-spec>/decision-record.md","specs/<target-spec>/implementation-summary.md"] })` and capture `jobId`
2. Immediately call `memory_ingest_status({ jobId:"<job-id>" })` and verify `forecast` contains `etaSeconds`, `etaConfidence`, `failureRisk`, `riskSignals`, and `caveat`
3. Confirm early or queued states return a low-confidence caveat instead of throwing
4. Poll until indexing progresses and verify forecast values update while staying advisory
5. If extended telemetry is enabled, confirm lifecycle forecast diagnostics are attached without changing the status contract

### Expected

Status payloads always include a `forecast` object; sparse progress yields null or low-confidence fields plus caveat text; progressing jobs update ETA/risk fields without breaking the handler contract; optional telemetry remains additive

### Evidence

Start/status transcript across early and progressing states + optional telemetry snapshot when enabled

### Pass / Fail

- **Pass**: forecast fields are always present, sparse states degrade safely, and progressing jobs update the advisory values without handler failure
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `handlers/memory-ingest.ts`, `lib/ops/job-queue.ts`, and `lib/telemetry/retrieval-telemetry.ts` if forecast fields disappear or throw

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [05--lifecycle/05-async-ingestion-job-lifecycle.md](../../feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: 144
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--lifecycle/144-advisory-ingest-lifecycle-forecast.md`
- audited_post_018: true
