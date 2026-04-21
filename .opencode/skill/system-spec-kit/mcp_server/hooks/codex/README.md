---
title: "Codex Hooks"
description: "Codex user-prompt advisor and Bash-only PreToolUse policy hooks."
trigger_phrases:
  - "codex hooks"
  - "codex advisor hook"
---

# Codex Hooks

## 1. OVERVIEW

`hooks/codex/` contains the Codex runtime adapter slice from Phase 020.

- `user-prompt-submit.ts` parses Codex prompt JSON from stdin first and argv second, then emits `hookSpecificOutput.additionalContext` when a rendered advisor brief exists.
- `pre-tool-use.ts` applies a narrow Bash-only deny policy from `.codex/policy.json`.
- `prompt-wrapper.ts` adds an in-memory advisor preamble only when native hook detection reports `unavailable`.

The adapter code, tests, and repo-local registration files are live. `.codex/settings.json` registers `UserPromptSubmit` and `PreToolUse`; `.codex/policy.json` holds the Bash deny policy. Codex CLI still does not expose startup, compaction, or stop lifecycle hooks, so startup recovery remains explicit via `session_bootstrap`.

Prompt-hook smoke check:

```bash
printf '%s\n' '{"prompt":"implement TypeScript hook","cwd":"'"$PWD"'"}' \
  | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js
```

Expected stdout contains non-empty `hookSpecificOutput.additionalContext`. Cold-start timeouts return the prompt-safe `Advisor: stale (cold-start timeout)` advisory with a `status:"stale"` stderr diagnostic.

## 2. REGISTRATION

Checked-in `.codex/settings.json` shape:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "type": "command",
        "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js'",
        "timeout": 3
      }
    ],
    "PreToolUse": [
      {
        "type": "command",
        "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/pre-tool-use.js'",
        "timeout": 3
      }
    ]
  }
}
```

Documented `.codex/policy.json` snippet:

```json
{
  "bashDenylist": [
    {
      "pattern": "git reset --hard",
      "reason": "Refuse destructive reset without an explicit user request."
    }
  ]
}
```

Set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` to skip the prompt-time advisor path for the current process session. The flag does not empty `.codex/policy.json` or unregister `PreToolUse`.

## 3. RELATED

- `../README.md`
- `../claude/README.md`
- `../gemini/README.md`
- `../copilot/README.md`
- `../../../references/hooks/skill-advisor-hook.md`
