---
title: "AU-003 Daemon Lifecycle and SIGTERM"
description: "Manual validation that daemon boot, health reporting, and SIGTERM shutdown behave as documented in lib/daemon/lifecycle.ts."
trigger_phrases:
  - "au-003"
  - "daemon lifecycle"
  - "sigterm shutdown"
  - "daemon health"
---

# AU-003 Daemon Lifecycle and SIGTERM

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate graceful boot, health reporting, and SIGTERM-based shutdown for the advisor daemon in `lib/daemon/lifecycle.ts`.

---

## 2. SETUP

- Disposable workspace copy or isolated MCP server process.
- Operator can send signals to the daemon PID.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` unset.
- Log capture enabled.

---

## 3. STEPS

1. Bring the daemon up:

```text
advisor_status({"workspaceRoot":"/tmp/path-to-copy"})
```

2. Capture PID, generation, `skillCount`, and `trustState` from the response.
3. Send SIGTERM to the daemon process:

```bash
kill -TERM <daemon_pid>
```

4. After shutdown completes, re-run `advisor_status` to force a fresh boot.
5. Compare `skillCount` and `generation` against the pre-shutdown capture.

---

## 4. EXPECTED

- Step 1 response includes populated `generation`, `skillCount`, and `trustState.state = "live"` or `"stale"`.
- SIGTERM triggers graceful shutdown; no stack trace in stderr.
- Post-restart status matches pre-shutdown `skillCount` (same skills visible) and `generation` is at least equal to the prior value.
- No raw prompt text in lifecycle logs.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| SIGTERM ignored | Process survives signal | Inspect `lib/daemon/lifecycle.ts` signal handlers. |
| Fresh boot reports lower skillCount | Skills missing after restart | Confirm source discovery in `lifecycle.ts`; check for source-cache corruption. |
| Stack trace on shutdown | Stderr contains unhandled rejection | Block release; investigate teardown path. |

---

## 6. RELATED

- Scenario [AU-002](./002-lease-single-writer.md) — single-writer lease reclaim.
- Scenario [OP-001](../04--operator-h5/001-degraded-daemon.md) — degraded state detection.
- Feature [`01--daemon-and-freshness/03-lifecycle.md`](../../feature_catalog/01--daemon-and-freshness/03-lifecycle.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/lifecycle.ts`.
