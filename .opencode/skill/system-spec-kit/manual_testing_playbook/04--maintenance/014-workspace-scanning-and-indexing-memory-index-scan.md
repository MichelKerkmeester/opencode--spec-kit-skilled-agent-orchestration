---
title: "EX-014 -- Workspace scanning and indexing (memory_index_scan)"
description: "This scenario validates Workspace scanning and indexing (memory_index_scan) for `EX-014`. It focuses on Incremental sync and atomic lease validation."
---

# EX-014 -- Workspace scanning and indexing (memory_index_scan)

## 1. OVERVIEW

This scenario validates Workspace scanning and indexing (memory_index_scan) for `EX-014`. It focuses on Incremental sync and atomic lease validation.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `EX-014` and confirm the expected signals without contradicting evidence.

- Objective: Incremental sync run with spec-doc warn-only indexing plus atomic lease acquisition, rejection, expiry, and completion coverage
- Prompt: `As a maintenance validation operator, validate Workspace scanning and indexing (memory_index_scan) against memory_index_scan(force:false, includeSpecDocs:true). Verify incremental sync run with spec-doc warn-only indexing plus atomic lease acquisition, rejection, expiry, and completion coverage. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Scan summary, updated index state, spec-doc warn-only indexing behavior, atomic lease reservation, rejection wait time, stale-lease expiry, and completion handoff to `last_index_scan`
- Pass/fail: PASS if changed files are reflected, spec docs remain indexed, and all targeted atomic lease checks pass

---

## 3. TEST EXECUTION

### Prompt

```
As a maintenance validation operator, validate Incremental sync run with spec-doc warn-only indexing against memory_index_scan(force:false, includeSpecDocs:true). Verify scan summary, updated index state, and spec-doc warn-only indexing behavior. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_index_scan(force:false, includeSpecDocs:true)
2. memory_stats()

### Expected

Scan summary, updated index state, and spec-doc warn-only indexing behavior

### Evidence

Scan output plus any warning metadata for touched spec docs

### Pass / Fail

- **Pass**: changed files are reflected and spec docs remain indexed
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Retry `force:true`; inspect `handlers/memory-index.ts` for spec-doc `qualityGateMode: 'warn-only'` if spec docs disappear

---

### Prompt

```
As a maintenance validation operator, validate Atomic lease acquisition reserves the scan slot before work begins against cd .opencode/skill/system-spec-kit/mcp_server. Verify first lease acquisition succeeds and the lease timestamp is reserved immediately. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server
2. npm test -- --run tests/db-state.vitest.ts -t "acquires scan lease once and rejects a concurrent fresh lease"

### Expected

First lease acquisition succeeds and the lease timestamp is reserved immediately

### Evidence

Targeted test transcript showing the first acquisition passed before the concurrent check

### Pass / Fail

- **Pass**: the targeted test passes and the first reservation remains an acquired lease
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `core/db-state.ts` transaction flow around `acquireIndexScanLease()` if the first acquisition no longer succeeds

---

### Prompt

```
As a maintenance validation operator, validate Overlapping fresh scans are rejected with an active-lease wait time against cd .opencode/skill/system-spec-kit/mcp_server. Verify second lease attempt is rejected with reason: 'lease_active' and a positive wait time. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server
2. npm test -- --run tests/db-state.vitest.ts -t "acquires scan lease once and rejects a concurrent fresh lease"

### Expected

Second lease attempt is rejected with `reason: 'lease_active'` and a positive wait time

### Evidence

Targeted test transcript showing the second attempt failed for `lease_active`

### Pass / Fail

- **Pass**: the targeted test passes and the rejection path still reports `reason: 'lease_active'` with `waitSeconds > 0`
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `core/db-state.ts` lease-activity branch and `handlers/memory-index.ts` E429 details if concurrent scans start slipping through

---

### Prompt

```
As a maintenance validation operator, validate Stale crashed-scan leases expire and allow a fresh reservation against cd .opencode/skill/system-spec-kit/mcp_server. Verify expired scan_started_at is removed and the new reservation succeeds. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server
2. npm test -- --run tests/db-state.vitest.ts -t "expires stale scan lease and allows a fresh reservation"

### Expected

Expired `scan_started_at` is removed and the new reservation succeeds

### Evidence

Targeted test transcript showing stale-lease expiry and fresh reservation

### Pass / Fail

- **Pass**: the targeted test passes and the refreshed lease uses the current reservation timestamp
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `core/db-state.ts` `clearStaleScanLease()` and `SPECKIT_INDEX_SCAN_LEASE_EXPIRY_MS` handling if expired leases keep blocking scans

---

### Prompt

```
As a maintenance validation operator, validate Completion converts the active lease into last_index_scan cooldown state against cd .opencode/skill/system-spec-kit/mcp_server. Verify last_index_scan is updated and the active lease row is cleared on completion. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server
2. npm test -- --run tests/db-state.vitest.ts -t "completes lease by moving scan_started_at to last_index_scan"

### Expected

`last_index_scan` is updated and the active lease row is cleared on completion

### Evidence

Targeted test transcript showing `scan_started_at` removal and `last_index_scan` update

### Pass / Fail

- **Pass**: the targeted test passes and completion leaves no active lease behind
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `completeIndexScanLease()` in `core/db-state.ts` and the post-response completion calls in `handlers/memory-index.ts` if cooldown starts too early or active leases linger

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md](../../feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md)

---

## 5. SOURCE METADATA

- Group: Maintenance
- Playbook ID: EX-014
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--maintenance/014-workspace-scanning-and-indexing-memory-index-scan.md`
- audited_post_018: true
- phase_018_change: post-018 audit verified against `mcp_server/handlers/memory-index.ts`, `mcp_server/handlers/memory-index-discovery.ts`, and `mcp_server/tests/db-state.vitest.ts`
