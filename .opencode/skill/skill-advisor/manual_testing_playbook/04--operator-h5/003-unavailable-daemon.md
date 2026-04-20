---
title: "OP-003 Unavailable Daemon"
description: "H5 operator playbook for corrupted SQLite and rebuild-from-source recovery."
---

# OP-003 Unavailable Daemon

## 1. OVERVIEW

Validate the recovery path when the native advisor graph state is unavailable because SQLite is corrupt or unreadable.

---

## 2. SETUP

- Run corruption simulation only in a disposable copy.
- The operator has a backup of the original database in that copy.
- Rebuild-from-source tools are available.

---

## 3. STEPS

1. In a disposable copy, replace the copied `skill-graph.sqlite` with invalid bytes.
2. Detect:

```text
advisor_status({"workspaceRoot":"/tmp/path-to-copy"})
```

3. Confirm `freshness: "unavailable"` or trust reason indicating database failure.
4. Trigger rebuild:

```text
skill_graph_scan({})
advisor_status({"workspaceRoot":"/tmp/path-to-copy"})
```

5. If MCP scan is unavailable, restart the MCP server after deleting only the corrupt copied database.

---

## 4. EXPECTED

- Unavailable state is prompt-safe and does not crash the runtime.
- Native `advisor_recommend` either fails open or returns an explicit unavailable/absent trust state.
- Rebuild-from-source recreates a usable graph and restores `live` or `stale` freshness.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Runtime crashes on corrupt DB | MCP server exits or throws raw SQLite stack to user | Block release; recovery must fail open. |
| Rebuild uses stale JSON only | Status remains absent/unavailable after scan | Inspect rebuild-from-source path and file permissions. |
| Live DB corrupted | Real repo status remains unavailable | Restore from backup or rebuild immediately before other tests. |

---

## 6. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/rebuild-from-source.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/lifecycle.ts`
