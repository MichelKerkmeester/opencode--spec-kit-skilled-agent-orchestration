---
title: "OP-001 Degraded Daemon"
description: "H5 operator playbook for detecting and recovering a degraded native advisor daemon state."
---

# OP-001 Degraded Daemon

## 1. OVERVIEW

Validate the operator path for a degraded advisor daemon, usually caused by stale graph generation or a newer source file.

---

## 2. SETUP

- Use a disposable copy when simulating stale source timestamps.
- MCP status tool is available.
- Operator has access to MCP server logs or stderr.

---

## 3. STEPS

1. Detect:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

2. Confirm stale/degraded signals: `freshness: "stale"` or trust reason such as `SOURCE_NEWER_THAN_SKILL_GRAPH`.
3. Inspect logs for watcher or generation messages.
4. Remediate:

```text
skill_graph_scan({})
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

---

## 4. EXPECTED

- Degraded/stale state is visible without prompt text.
- Logs identify graph generation or source freshness, not raw prompts.
- After scan, `freshness` returns to `live` or the remaining reason is explicit.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Status hides stale state | Sources newer than DB but freshness remains live | Block release; freshness probe is incorrect. |
| Logs contain prompt text | Search logs for test prompt | Block release. |
| Scan cannot repair | Freshness remains stale | Inspect file permissions and daemon lease. |

---

## 6. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/`
