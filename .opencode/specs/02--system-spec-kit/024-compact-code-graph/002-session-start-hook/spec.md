# Phase 2: SessionStart Hook

## Summary
Auto-prime every new Claude Code session with relevant prior context by hooking into the SessionStart lifecycle event.

## What Exists
- `memory_context({ mode: "resume" })` — unified context retrieval with session recovery mode
- `memory_match_triggers(prompt)` — automatic context surfacing based on prompt content
- `autoSurfaceMemories()` — core memory surfacing function

## What to Build

### 1. `scripts/hooks/session-prime.js`
```
Input:  stdin JSON from Claude Code SessionStart event
        { "session_id": "...", "project_path": "...", ... }
Output: stdout text (injected into conversation at session start)
Timeout: <3 seconds (more lenient than PreCompact)
```

**Logic:**
1. Parse stdin JSON for project path
2. Check for existing session continuity (CONTEXT.md, recent memory saves)
3. Call `memory_context({ mode: "resume", input: "session start context priming" })`
4. Include constitutional memories
5. Format as concise context block (~2000 tokens max)
6. Output to stdout

**Detection: Resume vs Fresh:**
- If recent memory saves exist (< 24h) → resume mode, include task context
- If no recent saves → fresh start, include only constitutional + spec folder overview

### 2. Hook Registration
Add to `.claude/settings.local.json`:
```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "node .opencode/skill/system-spec-kit/mcp_server/scripts/hooks/session-prime.js"
      }]
    }]
  }
}
```

## Acceptance Criteria
- [ ] SessionStart hook fires on every new Claude Code session
- [ ] Output includes constitutional memories + relevant prior context
- [ ] Resume vs fresh start correctly detected
- [ ] Output ≤ 2000 tokens
- [ ] Script completes in < 3 seconds
- [ ] Graceful degradation when MCP unavailable

## Files Modified
- NEW: `.opencode/skill/system-spec-kit/mcp_server/scripts/hooks/session-prime.js`
- EDIT: `.claude/settings.local.json` (add SessionStart hook)

## LOC Estimate
~100-150 lines
