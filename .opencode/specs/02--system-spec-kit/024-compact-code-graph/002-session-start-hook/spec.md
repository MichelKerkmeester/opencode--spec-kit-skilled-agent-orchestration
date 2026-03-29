# Phase 2: SessionStart Hook — Session Priming

## Summary
Auto-prime every new Claude Code session with relevant prior context by hooking into the SessionStart lifecycle event. Shares `session-prime.ts` with Phase 1's compact injection path.

## Claude Code Hook API (iteration 011)

SessionStart supports matcher on `source` field:
- `startup` — fresh session start
- `resume` — resuming a prior session
- `clear` — after `/clear` command
- `compact` — after auto/manual compaction (handled by Phase 1)

Only `command` handler type supported. Plain stdout or `hookSpecificOutput.additionalContext` is injected into model context.

**Extra stdin fields:** `source`, `model`, optional `agent_type`

## What Exists (iteration 012)

- `memory_context({ mode: "resume" })` — resume-tuned retrieval with 1200-token budget
- `autoSurfaceAtCompaction()` — already fires when resume mode is detected
- `SPECKIT_AUTO_RESUME` flag (default ON) — injects `systemPromptContext` when session is recognized as resumed
- Constitutional memories auto-surface on every `memory_context` call

**Key gap found (iteration 012):** `memory_context({ mode: "resume" })` returns search-style results, NOT a compact brief. Must also pass `profile: "resume"` for the brief `{ state, nextSteps, blockers }` format. Current `/spec_kit:resume` command does NOT pass `profile: "resume"`.

## What to Build

### `session-prime.ts` (shared with Phase 1)

This script handles ALL SessionStart events with source-aware routing:

```
SessionStart(source=compact):
  1. Read pendingCompactPrime from hook-state cache
  2. If cache exists + fresh → output cached context
  3. If no cache → fall through to resume flow
  4. Clean up cache after injection

SessionStart(source=startup):
  1. Call primeCompactionContext() with empty session context
  2. Surface constitutional memories + recent spec folder overview
  3. Output concise context (~2000 tokens)

SessionStart(source=resume):
  1. Call memory_context({ mode: "resume", profile: "resume" })
  2. Surface prior work, last spec folder, recent decisions
  3. Output resume brief (~2000 tokens)

SessionStart(source=clear):
  1. Minimal output — just constitutional memories
  2. User explicitly cleared, don't over-inject
```

### Hook Registration
```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "node .opencode/skill/system-spec-kit/scripts/dist/hooks/claude/session-prime.js"
      }]
    }]
  }
}
```

No matcher filter — script handles all sources internally with source-aware routing.

## Design Principles (iteration 013)

1. **One retrieval contract across all runtimes** — hooks call the same `memory_context()` and `memory_match_triggers()` that manual flows use
2. **Hooks are transport reliability, not business logic** — they improve reliability of the same workflow, not replace Gate 1/2/3
3. **`/spec_kit:resume` remains canonical** — the hybrid design keeps that contract and uses `memory_context({ mode: "resume" })` as the internal primitive

## Acceptance Criteria
- [ ] SessionStart hook fires on all sources (startup, resume, clear, compact)
- [ ] Source-aware routing produces appropriate context for each
- [ ] `profile: "resume"` passed for compact brief format (fixes gap from iter 012)
- [ ] Output includes constitutional memories
- [ ] Output ≤ 2000 tokens (startup/resume) or ≤ 4000 tokens (compact)
- [ ] Script completes in < 3 seconds
- [ ] Graceful degradation when MCP unavailable
- [ ] Shared with Phase 1 compact-inject (no code duplication)

## Files Modified
- SHARED: `scripts/hooks/claude/session-prime.ts` (with Phase 1)
- EDIT: `.claude/settings.local.json` (add SessionStart hook)

## LOC Estimate
~150-200 lines (session-prime.ts, including source routing)
