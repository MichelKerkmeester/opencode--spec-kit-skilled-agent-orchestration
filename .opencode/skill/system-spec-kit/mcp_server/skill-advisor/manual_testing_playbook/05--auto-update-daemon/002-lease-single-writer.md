---
title: "AU-002 Workspace Single-Writer Lease"
description: "Manual validation that the SQLite-backed workspace lease prevents concurrent daemon writes and reclaims stale leases through heartbeat expiry."
trigger_phrases:
  - "au-002"
  - "single writer lease"
  - "daemon lease heartbeat"
  - "lease reclaim stale"
---

# AU-002 Workspace Single-Writer Lease

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that only one daemon holds the workspace lease at a time and that a stale lease is reclaimed after heartbeat expiry per `lib/daemon/lease.ts`.

---

## 2. SETUP

- Disposable workspace copy so concurrent launches do not pollute the real DB.
- MCP server built.
- Two shells available to launch separate daemon processes.
- Operator can read `advisor_status` output without affecting the daemon lease.

---

## 3. STEPS

1. In shell A, trigger a daemon bring-up via an MCP status call:

```text
advisor_status({"workspaceRoot":"/tmp/path-to-copy"})
```

2. Capture the `trustState` and `lastScanAt` timestamp.
3. In shell B, attempt a second concurrent bring-up against the same workspace root with `advisor_status`.
4. Kill shell A's daemon process without allowing graceful shutdown (simulate crash).
5. Wait at least 90 seconds so the heartbeat ages beyond the reclaim threshold.
6. In shell B, call `advisor_status` again.

---

## 4. EXPECTED

- Step 3 concurrent call returns trust metadata consistent with a single owner; no two writers advance generation at the same timestamp.
- Step 6 call after stale heartbeat succeeds and the new daemon acquires the lease.
- `trustState.state` transitions from `stale` or `absent` back to `live` after reclaim.
- No raw prompt text or workspace paths other than the documented `workspaceRoot` appear in diagnostics.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Duplicate writers | Generation advances twice with near-identical timestamps | Inspect `lib/daemon/lease.ts` acquire path and heartbeat table. |
| Stale lease never reclaimed | Shell B remains `absent` after 90s | Verify heartbeat TTL and reclaim interval in `lease.ts`. |
| Lease corruption | Daemon crashes on acquire | Treat as HALT; quarantine DB and run rebuild-from-source per OP-003. |

---

## 6. RELATED

- Scenario [AU-003](./003-daemon-lifecycle-shutdown.md) — graceful shutdown and SIGTERM.
- Scenario [OP-003](../04--operator-h5/003-unavailable-daemon.md) — recovery from unreadable DB.
- Feature [`01--daemon-and-freshness/02-lease.md`](../../feature_catalog/01--daemon-and-freshness/02-lease.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/lease.ts`.
