---
title: "Session: Runtime State And Deduplication"
description: "Session deduplication, checkpoint state, recovery metadata, and cleanup helpers for the Spec Kit Memory MCP server."
trigger_phrases:
  - "session manager"
  - "session deduplication"
  - "session recovery"
---

# Session: Runtime State And Deduplication

> Runtime session state, deduplication, checkpoint metadata, and cleanup helpers for the MCP server.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. DIRECTORY TREE](#4--directory-tree)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES AND FLOW](#6--boundaries-and-flow)
- [7. ENTRYPOINTS](#7--entrypoints)
- [8. VALIDATION](#8--validation)
- [9. RELATED](#9--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`lib/session/` owns runtime session state for the Spec Kit Memory MCP server. It tracks which spec-doc records were already sent to a caller, persists active session metadata, marks interrupted sessions after restarts, and clears stale session data from SQLite-backed tables.

Current state:

- `session-manager.ts` is the only implementation file in this folder.
- Session state supports `/spec_kit:resume`, but the canonical recovery ladder remains `handover.md` → `_memory.continuity` → spec docs.
- Session deduplication writes to `session_sent_memories` and session recovery state writes to `session_state`.
- Cleanup also touches `working_memory` through `../cognitive/working-memory.js` and governed retention through `../governance/memory-retention-sweep.js`.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                    lib/session/                                  │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌─────────────────────┐      ┌────────────────────┐
│ MCP handlers   │ ───▶ │ session-manager.ts  │ ───▶ │ SQLite session     │
│ memory tools   │      │ public functions    │      │ tables             │
└───────┬────────┘      └──────────┬──────────┘      └─────────┬──────────┘
        │                          │                           │
        │                          ▼                           ▼
        │                ┌─────────────────────┐       ┌───────────────────┐
        └──────────────▶ │ working-memory      │       │ retention sweep   │
                         │ cleanup             │       │ governance cleanup│
                         └─────────────────────┘       └───────────────────┘

Canonical recovery ladder:
session_state → /spec_kit:resume → handover.md → _memory.continuity → spec docs
```

Dependency direction: callers → `session-manager.ts` → SQLite, working memory, retention sweep.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
session/
+-- session-manager.ts  # Deduplication, persisted session state, recovery helpers, cleanup timers
`-- README.md           # Folder orientation
```

Allowed dependency direction:

```text
handlers and tools → lib/session/session-manager.ts
lib/session/session-manager.ts → lib/cognitive/working-memory.js
lib/session/session-manager.ts → lib/governance/memory-retention-sweep.js
lib/session/session-manager.ts → SQLite database handle
```

Disallowed dependency direction:

```text
lib/session/ → handler orchestration
lib/session/ → resume ladder ownership
lib/session/ → continuity record schema ownership
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
session/
+-- session-manager.ts  # Session schema setup, dedup hashes, persistence, checkpoint output, cleanup
`-- README.md           # This file
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `session-manager.ts` | Initializes session tables, filters duplicate search results, records sent memories, saves and recovers session state, writes `CONTINUE_SESSION.md`, and runs cleanup intervals. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Session ownership | Owns runtime session IDs, dedup hashes, active or interrupted state, and cleanup timers. |
| Continuity ownership | Does not own packet continuity truth. It only provides runtime state that resume surfaces can read. |
| Canonical ladder | Recovery should resolve through `handover.md`, then `_memory.continuity`, then spec docs. |
| Storage | Requires an initialized SQLite database handle before persistence and dedup helpers can run. |
| Cleanup | Can clear `session_sent_memories`, completed or interrupted `session_state`, and matching `working_memory` rows. |

Main deduplication flow:

```text
╭──────────────────────────────────────────╮
│ Caller has memory search results         │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ filterSearchResults(sessionId, results)  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ generateMemoryHash(memory)               │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ session_sent_memories check and reserve  │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Caller receives filtered results         │
╰──────────────────────────────────────────╯
```

Main recovery state flow:

```text
saveSessionState()
        │
        ▼
session_state row
        │
        ├──▶ recoverState() for a requested session ID
        │
        ├──▶ getInterruptedSessions() for restart recovery
        │
        └──▶ checkpointSession() for optional CONTINUE_SESSION.md output
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `init(database)` | Function | Stores the database handle, creates session schemas, and starts cleanup intervals. |
| `filterSearchResults(sessionId, results)` | Function | Removes and reserves duplicate memory results for a session. |
| `markResultsSent(sessionId, results)` | Function | Marks returned memory results after delivery. |
| `shouldSendMemory(sessionId, memory)` | Function | Checks one memory result against session dedup history. |
| `shouldSendMemoriesBatch(sessionId, memories, markAsSent)` | Function | Checks a batch and can reserve entries in one path. |
| `saveSessionState(sessionId, state)` | Function | Persists active session metadata in `session_state`. |
| `recoverState(sessionId, scope)` | Function | Reads persisted state and reactivates interrupted sessions when scope matches. |
| `resetInterruptedSessions()` | Function | Marks active sessions as interrupted during startup recovery. |
| `getInterruptedSessions(scope)` | Function | Lists interrupted sessions, filtered by tenant, user, or agent scope when provided. |
| `checkpointSession(sessionId, state, specFolderPath)` | Function | Saves state and optionally writes `CONTINUE_SESSION.md` under a spec folder. |
| `cleanupExpiredSessions()` | Function | Removes old sent-memory rows using `SESSION_TTL_MINUTES`. |
| `cleanupStaleSessions(thresholdMs)` | Function | Removes stale working memory, sent-memory, and completed or interrupted session-state rows. |
| `completeSession(sessionId)` | Function | Marks a session complete and clears matching working memory. |
| `shutdown()` | Function | Clears background cleanup intervals. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from the repository root unless noted.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/lib/session/README.md
```

Expected result: the README validation command exits with code `0`.

```bash
python3 .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/skill/system-spec-kit/mcp_server/lib/session/README.md
```

Expected result: the extracted structure reports README sections and no critical documentation issues.

For code changes in this folder, run the TypeScript or package-level checks used by the MCP server before claiming runtime behavior changed.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 9. RELATED

- [`../README.md`](../README.md)
- [`../resume/README.md`](../resume/README.md)
- [`../continuity/README.md`](../continuity/README.md)
- [`../storage/README.md`](../storage/README.md)

<!-- /ANCHOR:related -->
