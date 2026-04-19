# Claude Code Hook Scripts

Hook scripts for Claude Code lifecycle events. These run as external Node.js processes triggered by Claude Code, not as MCP server modules.

## Scripts

| File | Hook Event | Behavior |
|------|-----------|----------|
| `compact-inject.ts` | PreCompact | Precomputes context from transcript, caches to hook state |
| `session-prime.ts` | SessionStart | Injects context via stdout based on source (compact/startup/resume/clear) |
| `user-prompt-submit.ts` | UserPromptSubmit | Calls `buildSkillAdvisorBrief()` and emits JSON `additionalContext` when a brief is available |
| `session-stop.ts` | Stop (async) | Parses transcript for token usage, stores snapshots |
| `claude-transcript.ts` | (library) | JSONL transcript parser, token counting, cost estimation |
| `shared.ts` | (library) | Common utilities: stdin parsing, output formatting, timeout, logging |
| `hook-state.ts` | (library) | Per-session state management at temp directory |

## Lifecycle Flow

```
PreCompact → cache context → SessionStart(compact) → inject cached context
SessionStart(startup) → prime session with overview
SessionStart(resume) → load prior session state
Stop → parse transcript, save token snapshot
```

## Registration

Hooks registered in `.claude/settings.local.json`. Compiled JS at `dist/hooks/claude/`.

Advisor registration snippet:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js'",
            "timeout": 3
          }
        ]
      }
    ]
  }
}
```

Set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` to skip the advisor path for the current process session.

## Design Principle

Hooks are transport reliability, not separate business logic. They call the same retrieval primitives (`memory_match_triggers`, `memory_context`) that other runtimes call explicitly.
For packet work, the operator-facing recovery surface remains `/spec_kit:resume`, with continuity rebuilt from `handover.md -> _memory.continuity -> spec docs`.

The prompt-time advisor contract lives at `../../../references/hooks/skill-advisor-hook.md`.
