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

The extraction adapter (`lib/extraction/extraction-adapter.ts`) is the primary caller for tool-result capture. After eligible tool responses are summarized and redaction-checked, it resolves a memory ID and calls `upsertExtractedEntry()` so salient findings are inserted into working memory with provenance fields.

The working-memory schema now adds two session-local performance indexes: `idx_wm_session_focus_lru` on `(session_id, last_focused ASC, id ASC)` for deterministic least-recently-focused eviction and `idx_wm_session_attention_focus` on `(session_id, attention_score DESC, last_focused DESC)` for attention-ordered reads. `upsertExtractedEntry()` also no longer performs a pre-upsert existence probe before writing. It relies on a single `INSERT ... ON CONFLICT(session_id, memory_id) DO UPDATE` statement, then checks the resulting row state to decide whether the capacity limiter should run only for newly inserted entries.

The context server (`context-server.ts`) wires this behavior into runtime startup by initializing the extraction adapter with the after-tool callback registry, making extraction automatic once the MCP server is running.

The checkpoint module (`lib/storage/checkpoints.ts`) also participates by preserving working memory state during checkpoint creation so that restored sessions retain their accumulated tool-result context. Attention scores decay with an event-distance model (0.85 per event elapsed) with a floor of 0.05 and explicit eviction at 0.01. During decay updates, `MENTION_BOOST_FACTOR = 0.05` adds a bounded per-mention boost before scores are clamped, ensuring that recent or repeatedly referenced tool results remain prominent while older ones gracefully fade.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/context-server.ts` | Core | Initializes the extraction adapter during MCP server startup |
| `mcp_server/lib/extraction/extraction-adapter.ts` | Lib | Extracts salient tool results and upserts them into working memory |
| `mcp_server/lib/cognitive/working-memory.ts` | Lib | Working memory with tool-result extraction, session-local query indexes, and `ON CONFLICT` extraction upserts |
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
