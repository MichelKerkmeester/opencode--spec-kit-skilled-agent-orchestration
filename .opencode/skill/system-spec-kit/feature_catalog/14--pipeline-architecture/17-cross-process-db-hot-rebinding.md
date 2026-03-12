# Cross-process DB hot rebinding

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Cross-process DB hot rebinding.

## 2. CURRENT REALITY

Process-lifetime DB connection manager via marker file (`DB_UPDATED_FILE`). When an external process mutates the database, it writes a timestamp to the marker file. On next `checkDatabaseUpdated()` call, if timestamp > lastDbCheck, triggers `reinitializeDatabase()`: closes the old DB handle, calls `vectorIndex.initializeDb()`, and rebinds 6 modules (vectorIndex, checkpoints, accessTracker, hybridSearch, sessionManager, incrementalIndex). Concurrency-safe via mutex with race-condition fix (P4-13). Also manages embedding model readiness (polling with timeout) and constitutional cache lifecycle.

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

## 4. SOURCE METADATA

- Group: Undocumented feature gap scan
- Source feature title: Cross-process DB hot rebinding
- Current reality source: 10-agent feature gap scan
- Playbook reference: NEW-112
