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

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Give operators a predictable daemon lifecycle: graceful boot, graceful SIGTERM shutdown, and always-available health reporting exposed through `advisor_status`.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/daemon/lifecycle.ts` orchestrates daemon boot by acquiring the workspace lease, starting the watcher, warming freshness state, and exposing `trustState` to readers. Shutdown responds to SIGTERM, flushes any pending reindex, releases the lease, and drains the watcher. `advisor_status` returns `generation`, `skillCount`, `lastScanAt`, `trustState`, and `laneWeights` regardless of whether the daemon has a live writer.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts` | Daemon | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts` | Handler | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-status.vitest.ts` | Automated test | status envelope assertions |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts` | Automated test | boot and shutdown sequence |
| `Playbook scenario [AU-003](../../manual_testing_playbook/05--auto-update-daemon/003-daemon-lifecycle-shutdown.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Daemon and freshness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--daemon-and-freshness/03-lifecycle.md`

Related references:

- [02-lease.md](./02-lease.md).
- [05-trust-state.md](./05-trust-state.md).
- [07-cache-invalidation.md](./07-cache-invalidation.md).
<!-- /ANCHOR:source-metadata -->
