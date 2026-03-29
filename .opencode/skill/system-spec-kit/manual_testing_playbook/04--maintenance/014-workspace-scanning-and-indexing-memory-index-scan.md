---
title: "EX-014 -- Workspace scanning and indexing (memory_index_scan)"
description: "This scenario validates Workspace scanning and indexing (memory_index_scan) for `EX-014`. It focuses on Incremental sync and atomic lease validation."
---

# EX-014 -- Workspace scanning and indexing (memory_index_scan)

## 1. OVERVIEW

This scenario validates Workspace scanning and indexing (memory_index_scan) for `EX-014`. It focuses on Incremental sync and atomic lease validation.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-014` and confirm the expected signals without contradicting evidence.

- Objective: Incremental sync run with spec-doc warn-only indexing plus atomic lease acquisition, rejection, expiry, and completion coverage
- Prompt: `Run the incremental scan flow and the targeted atomic lease checks for memory_index_scan. Capture the evidence needed to prove scan summary and updated index state, that spec documents remain indexed in warn-only quality mode, and that scan leases reserve scan_started_at atomically, reject overlapping fresh scans, expire stale crashed-scan leases, and only move to last_index_scan on completion. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Scan summary, updated index state, spec-doc warn-only indexing behavior, atomic lease reservation, rejection wait time, stale-lease expiry, and completion handoff to `last_index_scan`
- Pass/fail: PASS if changed files are reflected, spec docs remain indexed, and all targeted atomic lease checks pass

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-014 | Workspace scanning and indexing (memory_index_scan) | Incremental sync run with spec-doc warn-only indexing | `Run index scan for changed docs. Capture the evidence needed to prove Scan summary and updated index state, and that spec documents remain indexed in warn-only quality mode rather than being silently skipped. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_index_scan(force:false, includeSpecDocs:true)` -> `memory_stats()` | Scan summary, updated index state, and spec-doc warn-only indexing behavior | Scan output plus any warning metadata for touched spec docs | PASS if changed files are reflected and spec docs remain indexed | Retry `force:true`; inspect `handlers/memory-index.ts` for spec-doc `qualityGateMode: 'warn-only'` if spec docs disappear |
| EX-014 | Workspace scanning and indexing (memory_index_scan) | Atomic lease acquisition reserves the scan slot before work begins | `Run the targeted lease-acquisition validation. Capture the evidence needed to prove a fresh memory_index_scan reservation writes scan_started_at inside the lease transaction before the handler proceeds. Return a concise user-facing pass/fail verdict with the main reason.` | `cd .opencode/skill/system-spec-kit/mcp_server` -> `npm test -- --run tests/db-state.vitest.ts -t "acquires scan lease once and rejects a concurrent fresh lease"` | First lease acquisition succeeds and the lease timestamp is reserved immediately | Targeted test transcript showing the first acquisition passed before the concurrent check | PASS if the targeted test passes and the first reservation remains an acquired lease | Inspect `core/db-state.ts` transaction flow around `acquireIndexScanLease()` if the first acquisition no longer succeeds |
| EX-014 | Workspace scanning and indexing (memory_index_scan) | Overlapping fresh scans are rejected with an active-lease wait time | `Run the targeted active-lease rejection validation. Capture the evidence needed to prove a second fresh memory_index_scan attempt is rejected while the first lease is still active, with a positive wait time rather than a second reservation. Return a concise user-facing pass/fail verdict with the main reason.` | `cd .opencode/skill/system-spec-kit/mcp_server` -> `npm test -- --run tests/db-state.vitest.ts -t "acquires scan lease once and rejects a concurrent fresh lease"` | Second lease attempt is rejected with `reason: 'lease_active'` and a positive wait time | Targeted test transcript showing the second attempt failed for `lease_active` | PASS if the targeted test passes and the rejection path still reports `reason: 'lease_active'` with `waitSeconds > 0` | Inspect `core/db-state.ts` lease-activity branch and `handlers/memory-index.ts` E429 details if concurrent scans start slipping through |
| EX-014 | Workspace scanning and indexing (memory_index_scan) | Stale crashed-scan leases expire and allow a fresh reservation | `Run the stale-lease expiry validation. Capture the evidence needed to prove an expired scan_started_at lease is cleared and replaced by a fresh reservation so crashed scans do not block future indexing forever. Return a concise user-facing pass/fail verdict with the main reason.` | `cd .opencode/skill/system-spec-kit/mcp_server` -> `npm test -- --run tests/db-state.vitest.ts -t "expires stale scan lease and allows a fresh reservation"` | Expired `scan_started_at` is removed and the new reservation succeeds | Targeted test transcript showing stale-lease expiry and fresh reservation | PASS if the targeted test passes and the refreshed lease uses the current reservation timestamp | Inspect `core/db-state.ts` `clearStaleScanLease()` and `SPECKIT_INDEX_SCAN_LEASE_EXPIRY_MS` handling if expired leases keep blocking scans |
| EX-014 | Workspace scanning and indexing (memory_index_scan) | Completion converts the active lease into last_index_scan cooldown state | `Run the completion handoff validation. Capture the evidence needed to prove memory_index_scan completion writes last_index_scan and removes scan_started_at so cooldown begins after the scan finishes. Return a concise user-facing pass/fail verdict with the main reason.` | `cd .opencode/skill/system-spec-kit/mcp_server` -> `npm test -- --run tests/db-state.vitest.ts -t "completes lease by moving scan_started_at to last_index_scan"` | `last_index_scan` is updated and the active lease row is cleared on completion | Targeted test transcript showing `scan_started_at` removal and `last_index_scan` update | PASS if the targeted test passes and completion leaves no active lease behind | Inspect `completeIndexScanLease()` in `core/db-state.ts` and the post-response completion calls in `handlers/memory-index.ts` if cooldown starts too early or active leases linger |

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
