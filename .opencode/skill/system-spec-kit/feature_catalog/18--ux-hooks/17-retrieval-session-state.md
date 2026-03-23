---
title: "Retrieval session state"
description: "Retrieval session state tracks per-session context enabling cross-turn deduplication, goal-aware refinement, and stateful question and anchor tracking, all in-memory with TTL-based cleanup, gated by the SPECKIT_SESSION_RETRIEVAL_STATE_V1 flag."
---

# Retrieval session state

## 1. OVERVIEW

Retrieval session state tracks per-session context enabling cross-turn deduplication, goal-aware refinement, and stateful question and anchor tracking, all in-memory with TTL-based cleanup, gated by the `SPECKIT_SESSION_RETRIEVAL_STATE_V1` flag.

When you search multiple times in a session, you keep seeing the same results. This feature remembers what you have already seen and deprioritizes those results on subsequent queries. It also lets you set a retrieval goal so results aligned with that goal get a boost. Open questions and preferred anchors are tracked across turns so the system can refine its responses as the conversation progresses. Everything is ephemeral by design — session state lives only in process memory and vanishes when the session ends.

---

## 2. CURRENT REALITY

The session state module provides a `SessionStateManager` class (singleton pattern) that manages sessions with the following capabilities:
- **Cross-turn deduplication**: seen result IDs are tracked per session. Seen results receive a score multiplier of `SEEN_DEDUP_FACTOR = 0.3` (deprioritized, not removed).
- **Goal-aware refinement**: an `activeGoal` can be set per session. Results aligned with the goal receive a boost up to `GOAL_BOOST_MAX = 1.2`.
- **Stateful tracking**: `openQuestions`, `preferredAnchors`, and `seenResultIds` accumulate across calls within a session.

Storage is in-memory only (no SQLite persistence, ephemeral by design). Sessions expire after `SESSION_TTL_MS = 30 minutes` of inactivity. LRU eviction kicks in at `MAX_SESSIONS = 100` concurrent sessions — the least-recently-updated session is evicted.

The live search handler preserves normal search output and adds `data.sessionState` plus `data.goalRefinement` on session-aware searches. When the legacy session manager is disabled, the score-based session-state deduplication path remains active as a fallback.

The manager exposes: `getOrCreate()`, `updateGoal()`, `markSeen()`, `addQuestion()`, `setAnchors()`, `clear()`, `clearAll()`, and a `size` property.

Canonical flag behavior is default ON (graduated). Set `SPECKIT_SESSION_RETRIEVAL_STATE_V1=false` to disable. Any older `session-state.ts` header text that says "default OFF" is stale and does not reflect the live runtime gate.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/session-state.ts` | Lib | SessionStateManager, deduplication, goal refinement, TTL/LRU eviction |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isSessionRetrievalStateEnabled()` flag accessor |
| `mcp_server/handlers/memory-search.ts` | Handler | Integrates session-state outputs into live search responses |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/session-state.vitest.ts` | Flag behavior, session CRUD, deduplication, goal refinement, TTL eviction, LRU eviction |
| `mcp_server/tests/memory-search-ux-hooks.vitest.ts` | Live handler integration for `data.sessionState` and `data.goalRefinement` |

---

## 4. SOURCE METADATA

- Group: UX hooks
- Source feature title: Retrieval session state
- Current reality source: `mcp_server/lib/search/session-state.ts`, `mcp_server/lib/search/search-flags.ts`, and `mcp_server/handlers/memory-search.ts`
