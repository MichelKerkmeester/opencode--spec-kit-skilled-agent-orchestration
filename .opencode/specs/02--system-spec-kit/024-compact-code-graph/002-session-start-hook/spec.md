---
title: "Phase 2: SessionStart Hook — Session Priming [02--system-spec-kit/024-compact-code-graph/002-session-start-hook/spec]"
description: "Auto-prime every new Claude Code session with relevant prior context by hooking into the SessionStart lifecycle event. Shares session-prime.ts with Phase 1's compact injection p..."
trigger_phrases:
  - "phase"
  - "sessionstart"
  - "hook"
  - "session"
  - "priming"
  - "spec"
  - "002"
importance_tier: "important"
contextType: "implementation"
---
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
  1. Output tool availability guidance (Spec Kit Memory tools, CocoIndex status, Code Graph tools)
  2. Check for stale code graph index (>24h) and warn if stale
  3. Output concise guidance (~2000 tokens)

SessionStart(source=resume):
  1. Load lastSpecFolder from hook state
  2. Output resume instructions (tells AI to call memory_context with resume profile)
  3. Output concise guidance (~2000 tokens)

SessionStart(source=clear):
  1. Output minimal guidance — tool availability reminder
  2. User explicitly cleared, don't over-inject
```

## Design Decision: Guidance-Emitter Pattern

The `startup`, `resume`, and `clear` handlers emit guidance text rather than performing active retrieval. That guidance lists tool availability, points to recommended commands, and tells the AI what to call next.

This is intentional. Hooks run as CLI commands with stdout capture, so they cannot call MCP tools directly during injection. Instead, the hook prints concise instructions into the session context, and the AI reads those instructions and acts on them. For example, the resume path tells the AI to call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` itself.

The one exception is `source=compact`, which reads a pre-cached payload produced in Phase 1 and injects that cached recovery context directly.

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

1. **One retrieval contract across all runtimes** — hooks point the AI at the same `memory_context()` and `memory_match_triggers()` flows that manual work uses
2. **Hooks are transport reliability, not business logic** — they improve reliability of the same workflow, not replace Gate 1/2/3
3. **`/spec_kit:resume` remains canonical** — the hybrid design keeps that contract and directs the AI to use `memory_context({ mode: "resume", profile: "resume" })` when a resume brief is needed

## Acceptance Criteria
- [ ] SessionStart hook fires on all sources (startup, resume, clear, compact)
- [ ] Source-aware routing produces appropriate context for each
- [ ] `profile: "resume"` passed for compact brief format (fixes gap from iter 012)
- [ ] startup/resume/clear output emits source-appropriate guidance text instead of active retrieval content
- [ ] Output ≤ 2000 tokens (startup/resume) or ≤ 4000 tokens (compact)

## SessionStart Budget Profile (Iteration 049)

For `source=startup` and `source=resume`, the 2000-token budget applies to concise guidance text, not loaded memory content. The hook should summarize available tools and next actions within that budget:

| Guidance Block | Floor | Notes |
|---|---:|---|
| Tool availability | 700 | Spec Kit Memory tools, CocoIndex status, Code Graph tools |
| Resume instructions | 700 | Tell the AI which `memory_context(..., profile: "resume")` call to make |
| Staleness / recovery notes | 400 | Warn when code graph index is stale or recovery is needed |
| Overflow Pool | 200 | Spare budget for short source-specific guidance |

For `source=clear`: minimal guidance only, mainly a tool-availability reminder after explicit user clear.
For `source=compact`: use full 4000-token compaction profile from Phase 001.

- [ ] Script completes in < 3 seconds
- [ ] Graceful degradation when MCP unavailable
- [ ] Shared with Phase 1 compact-inject (no code duplication)

## Files Modified
- SHARED: `scripts/hooks/claude/session-prime.ts` (with Phase 1)
- EDIT: `.claude/settings.local.json` (add SessionStart hook)

## LOC Estimate
~150-200 lines (session-prime.ts, including source routing)
