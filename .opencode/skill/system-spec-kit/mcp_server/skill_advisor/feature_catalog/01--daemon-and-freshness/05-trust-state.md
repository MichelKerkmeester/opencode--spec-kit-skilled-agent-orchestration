---
title: "Live / Stale / Absent / Unavailable Trust State"
description: "Fail-open trust state vocabulary that lets readers interpret freshness without blocking on the daemon."
trigger_phrases:
  - "trust state"
  - "live stale absent unavailable"
  - "freshness vocabulary"
  - "fail open trust"
---

# Live / Stale / Absent / Unavailable Trust State

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Give every consumer (native MCP tools, CLI hooks, plugin bridge, Python shim) a single shared vocabulary for describing whether advisor state is current, aged, missing, or unreadable, without ever blocking the reader.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/freshness/trust-state.ts` classifies state into `live`, `stale`, `absent`, or `unavailable`. The semantics are:

| State | Meaning |
| --- | --- |
| `live` | Daemon writer is active and generation is fresh. |
| `stale` | No live writer but a previous snapshot is readable. |
| `absent` | No snapshot exists for the workspace. |
| `unavailable` | Underlying storage is unreadable (corruption, permissions). |

All consumers fail open: a `stale`, `absent`, or `unavailable` state never crashes; the caller gets an explicit state and can decide whether to proceed.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/trust-state.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-freshness.vitest.ts` | Automated test | state transitions |
| `Playbook scenarios [NC-002](../../manual_testing_playbook/01--native-mcp-tools/002-native-status-transitions.md) and [OP-001..OP-003](../../manual_testing_playbook/04--operator-h5/).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Daemon and freshness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--daemon-and-freshness/05-trust-state.md`

Related references:

- [04-generation.md](./04-generation.md).
- [06-rebuild-from-source.md](./06-rebuild-from-source.md).
- [07-cache-invalidation.md](./07-cache-invalidation.md).
<!-- /ANCHOR:source-metadata -->
