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

## TABLE OF CONTENTS

- [1. PURPOSE](#1-purpose)
- [2. CURRENT REALITY](#2-current-reality)
- [3. SOURCE FILES](#3-source-files)
- [4. TEST COVERAGE](#4-test-coverage)
- [5. RELATED](#5-related)

---

## 1. PURPOSE

Give every consumer (native MCP tools, CLI hooks, plugin bridge, Python shim) a single shared vocabulary for describing whether advisor state is current, aged, missing, or unreadable, without ever blocking the reader.

---

## 2. CURRENT REALITY

`lib/freshness/trust-state.ts` classifies state into `live`, `stale`, `absent`, or `unavailable`. The semantics are:

| State | Meaning |
| --- | --- |
| `live` | Daemon writer is active and generation is fresh. |
| `stale` | No live writer but a previous snapshot is readable. |
| `absent` | No snapshot exists for the workspace. |
| `unavailable` | Underlying storage is unreadable (corruption, permissions). |

All consumers fail open: a `stale`, `absent`, or `unavailable` state never crashes; the caller gets an explicit state and can decide whether to proceed.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/trust-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-freshness.vitest.ts` — state transitions.
- Playbook scenarios [NC-002](../../manual_testing_playbook/01--native-mcp-tools/002-native-status-transitions.md) and [OP-001..OP-003](../../manual_testing_playbook/04--operator-h5/).

---

## 5. RELATED

- [04-generation.md](./04-generation.md).
- [06-rebuild-from-source.md](./06-rebuild-from-source.md).
- [07-cache-invalidation.md](./07-cache-invalidation.md).
