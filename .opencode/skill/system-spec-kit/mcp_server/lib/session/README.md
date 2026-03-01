---
title: "Session Layer"
description: "Session management for the Spec Kit Memory MCP server. Handles session deduplication, crash recovery and context persistence."
trigger_phrases:
  - "session management"
  - "session deduplication"
  - "crash recovery"
---

# Session Layer

> Session management for the Spec Kit Memory MCP server. Handles deduplication and crash recovery with context persistence.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FEATURES](#3--features)
- [4. USAGE EXAMPLES](#4--usage-examples)
- [5. TROUBLESHOOTING](#5--troubleshooting)
- [6. RELATED RESOURCES](#6--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The session layer provides all session-related operations for the Spec Kit Memory MCP server. It prevents duplicate context injection (saving ~50% tokens on follow-up queries) and enables crash recovery with immediate SQLite persistence.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 1 | `session-manager.ts` |
| Token Savings | ~50% | On follow-up queries via deduplication |
| Session TTL | 30 min | Configurable via `SESSION_TTL_MINUTES` |
| Max Entries | 100 | Per session cap (R7 mitigation) |

### Key Features

| Feature | Description |
|---------|-------------|
| **Session Deduplication** | Tracks sent memories to prevent duplicate context injection |
| **Crash Recovery** | Immediate SQLite persistence + CONTINUE_SESSION.md generation |
| **Token Savings** | ~50% reduction on follow-up queries |
| **State Persistence** | Zero data loss on crash via immediate saves |
| **Phase Awareness** | Session context includes phase metadata for phase-based specs (spec 139) |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
session/
 session-manager.ts  # Session deduplication, crash recovery, state management (~28KB)
 README.md           # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `session-manager.ts` | Core session tracking, deduplication, state persistence, CONTINUE_SESSION.md |

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### Session Deduplication (v1.2.0)

**Purpose**: Prevent sending the same memory content twice in a session, saving tokens.

| Aspect | Details |
|--------|---------|
| **Hash-based** | SHA-256 hash of memory content (truncated to 16 chars) |
| **Immediate Save** | SQLite persistence on each mark (crash resilient) |
| **Batch Support** | Efficient batch checking and marking |
| **Token Savings** | ~200 tokens per duplicate avoided |

```
Session Query Flow:
1. User queries memory_search
2. Results retrieved from index
3. filterSearchResults() removes already-sent memories
4. Filtered results returned to client
5. markResultsSent() records what was sent
```

### Crash Recovery (v1.2.0)

**Purpose**: Zero data loss on MCP server crash or context compaction.

| Aspect | Details |
|--------|---------|
| **Immediate Persistence** | State saved to SQLite instantly |
| **Interrupted Detection** | On startup, active sessions marked as interrupted |
| **State Recovery** | `recoverState()` returns state with `_recovered: true` flag |
| **CONTINUE_SESSION.md** | Human-readable recovery file in spec folder |

Session states:
- `active`: Session in progress
- `completed`: Session ended normally
- `interrupted`: Session crashed (detected on restart)

### CONTINUE_SESSION.md Generation

**Purpose**: Human-readable recovery file for smooth session continuation.

Generated on checkpoint with:
- Session ID and status
- Spec folder and current task
- Last action and context summary
- Pending work description
- Quick resume command

<!-- /ANCHOR:features -->

---

## 4. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Filter Search Results (Primary Integration)

```typescript
import { filterSearchResults, markResultsSent } from './session-manager';

// After retrieving search results
const { filtered, dedupStats } = filterSearchResults(sessionId, results);

console.log(`Filtered ${dedupStats.filtered} duplicates`);
console.log(`Token savings: ${dedupStats.tokenSavingsEstimate}`);

// Return filtered results to client, then mark as sent
markResultsSent(sessionId, filtered);
```

### Example 2: Crash Recovery on Startup

```typescript
import { init, resetInterruptedSessions, getInterruptedSessions } from './session-manager';

// Initialize session manager
init(database);

// Mark any active sessions as interrupted
const { interruptedCount } = resetInterruptedSessions();
console.log(`Found ${interruptedCount} interrupted sessions`);

// Get details for recovery UI
const { sessions } = getInterruptedSessions();
sessions.forEach(s => {
  console.log(`Session ${s.sessionId}: ${s.lastAction} in ${s.specFolder}`);
});
```

### Example 3: Save Session State with Checkpoint

```typescript
import { checkpointSession, saveSessionState } from './session-manager';

// Save state immediately (minimal)
saveSessionState(sessionId, {
  specFolder: 'specs/<###-spec-name>',
  currentTask: 'T071',
  lastAction: 'Implemented causal edges',
  contextSummary: 'Working on memory relationships...',
  pendingWork: 'Need to add traversal depth limit'
});

// Full checkpoint with CONTINUE_SESSION.md
checkpointSession(sessionId, {
  specFolder: 'specs/<###-spec-name>',
  currentTask: 'T072',
  contextSummary: 'Session checkpoint before break'
}, '/absolute/path/to/specs/<###-spec-name>');
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Check if should send | `shouldSendMemory(sessionId, memory)` | Before returning single memory |
| Batch check | `shouldSendMemoriesBatch(sessionId, memories)` | Before returning multiple memories |
| Mark single sent | `markMemorySent(sessionId, memory)` | After returning a memory |
| Mark batch sent | `markMemoriesSentBatch(sessionId, memories)` | After returning multiple memories |
| Clear session | `clearSession(sessionId)` | On explicit session end |
| Get session stats | `getSessionStats(sessionId)` | For debugging/logging |
| Recover state | `recoverState(sessionId)` | On session resume |
| Complete session | `completeSession(sessionId)` | On normal session end |

<!-- /ANCHOR:usage-examples -->

---

## 5. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Memories Being Filtered When They Shouldn't Be

**Symptom**: Expected memories not returned in search results.

**Cause**: Memories already marked as sent in this session.

**Solution**:
```typescript
import { getSessionStats, clearSession } from './session-manager';

// Check session stats
const stats = getSessionStats(sessionId);
console.log(`Total sent: ${stats.totalSent}`);

// Clear session to reset
clearSession(sessionId);
```

#### Session State Not Persisting

**Symptom**: Session state lost between queries.

**Cause**: Database not initialized or session ID changing.

**Solution**:
```typescript
import { getDb } from './session-manager';

// Verify initialization
const db = getDb();
if (!db) {
  console.error('Session manager not initialized');
}

// Ensure consistent session ID
console.log(`Using session: ${sessionId}`);
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Session dedup disabled | Check `DISABLE_SESSION_DEDUP` env var |
| TTL too short/long | Set `SESSION_TTL_MINUTES` env var |
| Max entries reached | Oldest entries auto-pruned (FIFO) |

### Diagnostic Commands

```typescript
import { isEnabled, getConfig, getSessionStats, getInterruptedSessions } from './session-manager';

// Check if deduplication enabled
console.log('Enabled:', isEnabled());
console.log('Config:', getConfig());

// Check session stats
console.log(getSessionStats(sessionId));

// Check for interrupted sessions
console.log(getInterruptedSessions());
```

### Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `SESSION_TTL_MINUTES` | 30 | Session timeout in minutes |
| `SESSION_MAX_ENTRIES` | 100 | Maximum entries per session |
| `DISABLE_SESSION_DEDUP` | false | Set 'true' to disable deduplication |

<!-- /ANCHOR:troubleshooting -->

---

## 6. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../README.md](../README.md) | Parent lib directory overview |
| [../storage/README.md](../storage/README.md) | Storage layer for persistence |

### Related Modules

| Module | Purpose |
|--------|---------|
| `context-server.ts` | MCP server that uses session layer |
| `storage/checkpoints.ts` | Checkpoint creation uses session state |

<!-- /ANCHOR:related -->

---

*Documentation version: 1.7.3 | Last updated: 2026-02-21 | Session layer v1.2.0*
