---
title: "Workspace Single-Writer Lease"
description: "SQLite-backed workspace lease with heartbeat and stale-lease reclaim that guarantees a single daemon writer per workspace."
trigger_phrases:
  - "daemon lease"
  - "single writer lease"
  - "heartbeat reclaim"
  - "workspace lease"
---

# Workspace Single-Writer Lease

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Prevent duplicate daemon writers from corrupting the advisor graph by ensuring exactly one daemon holds the workspace lease, with automatic reclaim when the prior owner dies.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/daemon/lease.ts` acquires a SQLite-backed lease keyed by workspace root. A heartbeat row is refreshed at a fixed interval; if the heartbeat ages past the reclaim threshold, a new daemon can acquire the lease. Readers never block on the lease — `advisor_status` and `advisor_recommend` continue to serve cached or source-driven results even when no writer is active. The lease cooperates with `lib/freshness/trust-state.ts` to expose `absent` or `unavailable` trust state when there is no live writer.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lease.ts` | Daemon | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/trust-state.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts` | Automated test | lease acquire, heartbeat, and reclaim paths |
| `Playbook scenario [AU-002](../../manual_testing_playbook/05--auto-update-daemon/002-lease-single-writer.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Daemon and freshness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--daemon-and-freshness/02-lease.md`

Related references:

- [01-watcher.md](./01-watcher.md) — scope of the writer's work.
- [03-lifecycle.md](./03-lifecycle.md) — lifecycle coordination.
- [05-trust-state.md](./05-trust-state.md) — reader-visible trust semantics.
<!-- /ANCHOR:source-metadata -->
