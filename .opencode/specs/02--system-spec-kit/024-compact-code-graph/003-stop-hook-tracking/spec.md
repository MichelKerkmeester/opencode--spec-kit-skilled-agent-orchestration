# Phase 3: Stop Hook + Token Tracking

## Summary
Auto-save session context and track token usage when a Claude Code session ends, using the Stop lifecycle hook.

## What Exists
- `generate-context.js` — saves session context to memory with semantic indexing
- `memory_save` MCP tool — saves memory entries
- Telemetry infrastructure in `lib/telemetry/scoring-observability.ts`
- SQLite database for storing metadata

## What to Build

### 1. `scripts/hooks/session-stop.js`
```
Input:  stdin JSON from Claude Code Stop event
        { "transcript_path": "/path/to/transcript.jsonl", "session_id": "..." }
Output: stdout (brief summary of what was saved)
Timeout: <10 seconds (can be slower, session is ending)
```

**Logic:**
1. Parse stdin JSON for transcript path
2. Parse transcript JSONL incrementally:
   - Extract token usage (input_tokens, cache_creation, cache_read, output_tokens)
   - Extract model name
   - Extract brief session summary (last user message + assistant actions)
3. Store token usage in SQLite:
   - New table `token_usage` or extend existing telemetry
   - Fields: session_id, timestamp, model, input_tokens, cache_tokens, output_tokens, cost_estimate
4. Optionally trigger lightweight context save:
   - Only if significant work was done (>1000 output tokens)
   - Use `generate-context.js` or direct memory_save

### 2. Token Usage Schema
```sql
CREATE TABLE IF NOT EXISTS token_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  model TEXT,
  input_tokens INTEGER DEFAULT 0,
  cache_creation_tokens INTEGER DEFAULT 0,
  cache_read_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  cost_estimate_usd REAL DEFAULT 0,
  project_path TEXT,
  spec_folder TEXT
);
```

### 3. Hook Registration
```json
{
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "node .opencode/skill/system-spec-kit/mcp_server/scripts/hooks/session-stop.js"
      }]
    }]
  }
}
```

## Acceptance Criteria
- [ ] Stop hook fires on Claude Code session end
- [ ] Transcript parsed for token usage
- [ ] Token usage stored in SQLite
- [ ] Session summary extracted (when significant work done)
- [ ] Cost estimate calculated (model-aware pricing)
- [ ] Script completes in < 10 seconds
- [ ] Large transcripts handled without OOM

## Files Modified
- NEW: `.opencode/skill/system-spec-kit/mcp_server/scripts/hooks/session-stop.js`
- EDIT: `.claude/settings.local.json` (add Stop hook)
- EDIT: Database schema (add token_usage table)

## LOC Estimate
~150-200 lines
