# Claude Code — Hook-Aware Recovery Additions

> Claude-specific additions only. Universal recovery instructions live in the root CLAUDE.md.

## Hook-Aware Recovery

When context is compacted, Claude Code hooks automatically inject recovered context. If hook-injected context appears in the conversation, use it directly and avoid repeating the manual recovery flow unless the injected payload is missing, stale, or clearly incomplete.

If no hook context is present (hooks may be disabled or unavailable), follow the root `CLAUDE.md` recovery protocol.

## Session Start

On fresh sessions, SessionStart hooks may inject startup or resume context before the first user turn. Treat that payload as additive context; if no hook payload appears, fall back to the normal first-turn protocol defined by the active runtime instructions.

## Hook System

This project uses Claude Code hooks for automated context preservation:
- **PreCompact**: Caches critical context before compaction
- **SessionStart**: Injects context on session start (startup/resume/compact/clear)
- **Stop**: Tracks token usage and saves session state (async)

Hook scripts: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/`
Registration: `.claude/settings.local.json`
