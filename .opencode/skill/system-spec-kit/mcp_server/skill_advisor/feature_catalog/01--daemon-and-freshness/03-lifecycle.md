---
title: "Daemon Lifecycle and Health Reporting"
description: "Daemon boot, shutdown, SIGTERM handling, and health reporting that make daemon state observable without coupling readers to writer state."
trigger_phrases:
  - "daemon lifecycle"
  - "daemon boot shutdown"
  - "sigterm daemon"
  - "daemon health"
---

# Daemon Lifecycle and Health Reporting

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Give operators a predictable daemon lifecycle: graceful boot, graceful SIGTERM shutdown, and always-available health reporting exposed through `advisor_status`.

---

## 2. CURRENT REALITY

`lib/daemon/lifecycle.ts` orchestrates daemon boot by acquiring the workspace lease, starting the watcher, warming freshness state, and exposing `trustState` to readers. Shutdown responds to SIGTERM, flushes any pending reindex, releases the lease, and drains the watcher. `advisor_status` returns `generation`, `skillCount`, `lastScanAt`, `trustState`, and `laneWeights` regardless of whether the daemon has a live writer.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-status.vitest.ts` — status envelope assertions.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts` — boot and shutdown sequence.
- Playbook scenario [AU-003](../../manual_testing_playbook/05--auto-update-daemon/003-daemon-lifecycle-shutdown.md).

---

## 5. RELATED

- [02-lease.md](./02-lease.md).
- [05-trust-state.md](./05-trust-state.md).
- [07-cache-invalidation.md](./07-cache-invalidation.md).
