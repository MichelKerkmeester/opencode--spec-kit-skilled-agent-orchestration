# Claude Code — Context Recovery

> Claude-specific compaction recovery layer. This file supplements the root CLAUDE.md with hook-aware recovery instructions.

## After Context Compaction

When context is compacted, Claude Code hooks automatically inject recovered context. If hook-injected context appears in the conversation, use it directly.

If no hook context is present (hooks may be disabled or unavailable), manually recover:

1. **FIRST ACTION** after compaction — call: `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })`
2. Review the recovered state: current task, spec folder, blockers, next steps
3. Re-read this CLAUDE.md and the root CLAUDE.md
4. Present a summary to the user and WAIT for confirmation before proceeding

## After /clear

Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session context.

## Session Start

On fresh sessions, `memory_match_triggers()` fires automatically via Gate 1. Hook-based session priming provides additional context when available.

## Hook System

This project uses Claude Code hooks for automated context preservation:
- **PreCompact**: Caches critical context before compaction
- **SessionStart**: Injects context on session start (startup/resume/compact/clear)
- **Stop**: Tracks token usage and saves session state (async)

Hook scripts: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/`
Registration: `.claude/settings.local.json`
