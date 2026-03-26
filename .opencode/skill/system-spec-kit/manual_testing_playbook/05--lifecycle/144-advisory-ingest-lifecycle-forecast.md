---
title: "144 -- Advisory ingest lifecycle forecast"
description: "This scenario validates Advisory ingest lifecycle forecast for `144`. It focuses on Verify `memory_ingest_status` exposes advisory forecast fields and degrades safely on sparse progress."
---

# 144 -- Advisory ingest lifecycle forecast

## 1. OVERVIEW

This scenario validates Advisory ingest lifecycle forecast for `144`. It focuses on Verify `memory_ingest_status` exposes advisory forecast fields and degrades safely on sparse progress.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `144` and confirm the expected signals without contradicting evidence.

- Objective: Verify `memory_ingest_status` exposes advisory forecast fields and degrades safely on sparse progress
- Prompt: `Validate ingest forecast contract and early-progress caveats. Capture the evidence needed to prove Status payloads always include a forecast object; sparse progress yields null or low-confidence fields plus caveat text; progressing jobs update ETA/risk fields without breaking the handler contract; optional telemetry remains additive. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Status payloads always include a `forecast` object; sparse progress yields null or low-confidence fields plus caveat text; progressing jobs update ETA/risk fields without breaking the handler contract; optional telemetry remains additive
- Pass/fail: PASS if forecast fields are always present, sparse states degrade safely, and progressing jobs update the advisory values without handler failure

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 144 | Advisory ingest lifecycle forecast | Verify `memory_ingest_status` exposes advisory forecast fields and degrades safely on sparse progress | `Validate ingest forecast contract and early-progress caveats. Capture the evidence needed to prove Status payloads always include a forecast object; sparse progress yields null or low-confidence fields plus caveat text; progressing jobs update ETA/risk fields without breaking the handler contract; optional telemetry remains additive. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_ingest_start({ paths:["specs/<target-spec>/memory/file1.md","specs/<target-spec>/memory/file2.md"] })` and capture `jobId` 2) Immediately call `memory_ingest_status({ jobId:"<job-id>" })` and verify `forecast` contains `etaSeconds`, `etaConfidence`, `failureRisk`, `riskSignals`, and `caveat` 3) Confirm early or queued states return a low-confidence caveat instead of throwing 4) Poll until indexing progresses and verify forecast values update while staying advisory 5) If extended telemetry is enabled, confirm lifecycle forecast diagnostics are attached without changing the status contract | Status payloads always include a `forecast` object; sparse progress yields null or low-confidence fields plus caveat text; progressing jobs update ETA/risk fields without breaking the handler contract; optional telemetry remains additive | Start/status transcript across early and progressing states + optional telemetry snapshot when enabled | PASS if forecast fields are always present, sparse states degrade safely, and progressing jobs update the advisory values without handler failure | Inspect `handlers/memory-ingest.ts`, `lib/ops/job-queue.ts`, and `lib/telemetry/retrieval-telemetry.ts` if forecast fields disappear or throw |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [05--lifecycle/05-async-ingestion-job-lifecycle.md](../../feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: 144
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `05--lifecycle/144-advisory-ingest-lifecycle-forecast.md`
