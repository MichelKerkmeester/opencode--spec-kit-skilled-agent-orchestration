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

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Prevent duplicate daemon writers from corrupting the advisor graph by ensuring exactly one daemon holds the workspace lease, with automatic reclaim when the prior owner dies.

---

## 2. CURRENT REALITY

`lib/daemon/lease.ts` acquires a SQLite-backed lease keyed by workspace root. A heartbeat row is refreshed at a fixed interval; if the heartbeat ages past the reclaim threshold, a new daemon can acquire the lease. Readers never block on the lease — `advisor_status` and `advisor_recommend` continue to serve cached or source-driven results even when no writer is active. The lease cooperates with `lib/freshness/trust-state.ts` to expose `absent` or `unavailable` trust state when there is no live writer.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/lease.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/trust-state.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/daemon-freshness-foundation.vitest.ts` — lease acquire, heartbeat, and reclaim paths.
- Playbook scenario [AU-002](../../manual_testing_playbook/05--auto-update-daemon/002-lease-single-writer.md).

---

## 5. RELATED

- [01-watcher.md](./01-watcher.md) — scope of the writer's work.
- [03-lifecycle.md](./03-lifecycle.md) — lifecycle coordination.
- [05-trust-state.md](./05-trust-state.md) — reader-visible trust semantics.
