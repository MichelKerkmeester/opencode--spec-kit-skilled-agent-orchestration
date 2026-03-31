---
title: "Phase 3: Stop Hook + Token Tracking [02--system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/spec]"
description: "Auto-save session context and track token usage when a Claude Code session ends, using the Stop lifecycle hook with async execution."
trigger_phrases:
  - "phase"
  - "stop"
  - "hook"
  - "token"
  - "tracking"
  - "spec"
  - "003"
importance_tier: "important"
contextType: "decision"
---
# Phase 3: Stop Hook + Token Tracking

## Summary
Auto-save session context and track token usage when a Claude Code session ends, using the Stop lifecycle hook with async execution.

## Claude Code Stop Hook API (iteration 011)

- Supports all 4 handler types: `command`, `http`, `prompt`, `agent`
- `async: true` supported for command hooks — runs in background without blocking
- Can return `decision: "block"` to prevent stopping (not needed for our use case)
- Default timeout: 600s (command), 30s (http)

**Stop hook stdin fields:**
- `session_id`, `transcript_path`, `cwd`, `hook_event_name`
- `stop_hook_active` — guard against recursive Stop hook execution
- `last_assistant_message` — the final assistant turn content

**Critical (iteration 011):** Token totals are NOT in the Stop payload. Must parse transcript JSONL to extract usage from assistant message objects.

## What Exists

- `generate-context.js` — saves session context to memory with semantic indexing
- `consumption_log` table — existing retrieval telemetry (iter 015: do NOT overload with token data)
- `collect-session-data.ts`, `input-normalizer.ts` — existing transcript/session provenance
- `detectSpecFolder()` — spec folder auto-detection

## What to Build

### 1. `scripts/hooks/claude/session-stop.ts`

```
Input:  stdin JSON from Claude Code Stop event
Output: stdout (brief summary, but not critical — async hook)
Mode:   async: true (runs in background)
```

**Logic (iteration 014):**
1. Parse stdin JSON, check `stop_hook_active` guard
2. Load hook-state for `session_id`
3. Parse transcript JSONL with incremental `.stopoffset` pattern:
   - Read from `lastSavedTranscriptSize` offset
   - Extract `usage` from assistant message objects
   - Sum: `input_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`, `output_tokens`
   - Extract `model` from first assistant message
4. Calculate cost estimate (model-aware pricing)
5. Write snapshot to `session_token_snapshots` table
6. If significant work done (>1000 output tokens):
   - Extract brief session summary from `last_assistant_message`
   - Trigger lightweight context save via `generate-context.js`
7. Update hook-state with save bookmark

### 2. `scripts/hooks/claude/claude-transcript.ts`

Transcript JSONL parser module:
- Streaming line-by-line read (handles large transcripts without OOM)
- Extracts usage objects from assistant messages
- Supports `.stopoffset` incremental parsing
- Returns normalized `{ promptTokens, completionTokens, cacheCreation, cacheRead, model }`

### 3. Token Storage Schema (iteration 015)

```sql
CREATE TABLE IF NOT EXISTS session_token_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  runtime TEXT NOT NULL DEFAULT 'claude-code',
  spec_folder TEXT,
  hook_event_name TEXT NOT NULL DEFAULT 'Stop',
  transcript_path TEXT,
  cwd TEXT,
  permission_mode TEXT,
  parse_status TEXT NOT NULL DEFAULT 'ok',
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  cache_creation_tokens INTEGER DEFAULT 0,
  cache_read_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  token_usage_ratio REAL,
  estimated_cost_usd REAL DEFAULT 0,
  assistant_message_hash TEXT,
  captured_at TEXT NOT NULL,
  parser_version TEXT NOT NULL DEFAULT '1.0.0',
  metadata TEXT
);

CREATE INDEX IF NOT EXISTS idx_sts_session ON session_token_snapshots (session_id, captured_at DESC);
CREATE INDEX IF NOT EXISTS idx_sts_runtime ON session_token_snapshots (runtime, captured_at DESC);
```

**Why append-only snapshots (iter 015):**
- Stop hooks can fire multiple times per session
- Resume flows are easier to debug with append-only data
- Multi-session reporting becomes a query problem, not an overwrite problem

### 4. Hook Registration

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "node .opencode/skill/system-spec-kit/scripts/dist/hooks/claude/session-stop.js",
        "async": true
      }]
    }]
  }
}
```

**`async: true`** — runs in background, doesn't block the user from exiting.

## Cost Calculation (per 1M tokens, approximate)

| Model | Input | Cache Write | Cache Read | Output |
|-------|-------|-------------|------------|--------|
| Opus 4.6 | $15 | $18.75 | $1.50 | $75 |
| Sonnet 4.6 | $3 | $3.75 | $0.30 | $15 |
| Haiku 4.5 | $0.80 | $1.00 | $0.08 | $4 |

## Acceptance Criteria
- [ ] Stop hook fires asynchronously on session end
- [ ] Transcript parsed for token usage (incremental, offset-based)
- [ ] Token snapshot stored in `session_token_snapshots` table
- [ ] Cost estimate calculated per model
- [ ] Script handles large transcripts without OOM (streaming parse)
- [ ] `stop_hook_active` guard prevents recursive execution
- [ ] Auto-save triggered when >1000 output tokens
- [ ] Hook-state updated with save bookmark

## Files Modified
- NEW: `scripts/hooks/claude/session-stop.ts`
- NEW: `scripts/hooks/claude/claude-transcript.ts`
- EDIT: `.claude/settings.local.json` (add Stop hook)
- EDIT: MCP database schema (add `session_token_snapshots` table)

## Observability Note

The Stop hook can optionally log whether CocoIndex was queried during the session for cross-system observability. This is informational — the Stop hook does not query CocoIndex itself.

## LOC Estimate
~200-250 lines (session-stop.ts + claude-transcript.ts) + ~20 lines (schema)
