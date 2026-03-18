---
title: "Tool-result extraction to working memory"
description: "Covers the working memory module that captures salient tool results as session-scoped attention items for cross-turn continuity."
---

# Tool-result extraction to working memory

## 1. OVERVIEW

Covers the working memory module that captures salient tool results as session-scoped attention items for cross-turn continuity.

When the system finds something useful during a search, it keeps a mental note of it for the rest of your session. That way, if you ask a follow-up question a few turns later, the system still remembers what it found earlier. These notes gradually fade over time so the most recent findings stay prominent while older ones quietly step aside.

---

## 2. CURRENT REALITY

The working memory module (`lib/cognitive/working-memory.ts`) captures salient results from tool invocations and stores them as session-scoped attention items. When a retrieval tool returns results, the system extracts key findings and inserts them into the `working_memory` table with an attention score. These extracted items persist across turns within the same session, enabling cross-turn context continuity.

The checkpoint module (`lib/storage/checkpoints.ts`) also participates by preserving working memory state during checkpoint creation so that restored sessions retain their accumulated tool-result context. Attention scores decay with an event-distance model (0.85 per event elapsed) with a floor of 0.05 and explicit eviction at 0.01, ensuring that recent tool results remain prominent while older ones gracefully fade.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/working-memory.ts` | Lib | Working memory with tool-result extraction |
| `mcp_server/lib/storage/checkpoints.ts` | Lib | Checkpoint preservation of working memory |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/working-memory.vitest.ts` | Working memory tests |
| `mcp_server/tests/working-memory-event-decay.vitest.ts` | Working memory decay tests |
| `mcp_server/tests/checkpoint-working-memory.vitest.ts` | Checkpoint working memory tests |

---

## 4. SOURCE METADATA

- Group: Retrieval
- Source feature title: Tool-result extraction to working memory
- Current reality source: audit-D04 gap backfill
