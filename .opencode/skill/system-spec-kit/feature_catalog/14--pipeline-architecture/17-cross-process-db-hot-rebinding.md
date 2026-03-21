---
title: "Cross-process DB hot rebinding"
description: "Cross-process DB hot rebinding detects external database mutations via a marker file and reinitializes the DB connection with module rebinding."
---

# Cross-process DB hot rebinding

## 1. OVERVIEW

Cross-process DB hot rebinding detects external database mutations via a marker file and reinitializes the DB connection with module rebinding.

When another process changes the database while the server is running, the server needs to notice and reconnect. This feature watches for a signal file that says "the database changed" and automatically refreshes the connection. Without it, the server would keep using stale data until someone manually restarted it.

---

## 2. CURRENT REALITY

Process-lifetime DB connection manager via marker file (`DB_UPDATED_FILE`). When an external process mutates the database, it writes a timestamp to the marker file. On next `checkDatabaseUpdated()` call, if timestamp > lastDbCheck, triggers `reinitializeDatabase()`: closes the old DB handle, calls `vectorIndex.initializeDb()`, and rebinds 6 modules (vectorIndex, checkpoints, accessTracker, hybridSearch, sessionManager, incrementalIndex). Concurrency-safe via mutex with race-condition fix (P4-13). Also manages embedding model readiness (polling with timeout) and constitutional cache lifecycle.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/core/db-state.ts` | Core | Database state management and hot rebinding |
| `mcp_server/core/config.ts` | Core | Server configuration including DB_UPDATED_FILE |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/db-state-graph-reinit.vitest.ts` | DB state graph reinit |

---

## 4. SOURCE METADATA

- Group: Undocumented feature gap scan
- Source feature title: Cross-process DB hot rebinding
- Current reality source: 10-agent feature gap scan
- Playbook reference: 112
