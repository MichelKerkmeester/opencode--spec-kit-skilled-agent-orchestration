---
title: "Plan: Phase 3 — Stop Hook + Token Tracking [02--system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/plan]"
description: "1. Create claude-transcript.ts parser"
trigger_phrases:
  - "plan"
  - "phase"
  - "stop"
  - "hook"
  - "token"
  - "003"
importance_tier: "important"
contextType: "decision"
---
# Plan: Phase 3 — Stop Hook + Token Tracking

## Steps

1. **Create `claude-transcript.ts` parser:**
   - Streaming JSONL line reader
   - Extract usage from `msg.message.usage` in assistant messages
   - `.stopoffset` incremental parsing (only process new lines)
   - Return normalized token counts + model name
2. **Create `session_token_snapshots` table:**
   - Add migration to MCP server startup
   - Append-only snapshots with index on session_id + captured_at
3. **Implement `session-stop.ts`:**
   - Parse stdin, check `stop_hook_active` guard
   - Load hook-state for session
   - Parse transcript via `claude-transcript.ts`
   - Calculate cost estimate per model
   - Insert snapshot row into SQLite
   - If >1000 output tokens: trigger lightweight context save
   - Update hook-state with bookmark
4. **Register Stop hook with `async: true`**
5. **Test:**
   - End a session → verify token tracking
   - Multiple Stop fires per session → verify append-only
   - Large transcript (>10MB) → verify no OOM
   - Cost calculation accuracy per model

<!-- ANCHOR:dependencies -->
## Dependencies
- Phases 1-2 (shared utilities: `shared.ts`, `hook-state.ts`)
- SQLite database access from hook script (direct import)
<!-- /ANCHOR:dependencies -->
