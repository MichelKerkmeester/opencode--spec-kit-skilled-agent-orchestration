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

The adapter code and tests are live. Repo-local `.codex/settings.json` and `.codex/policy.json` registration was deferred because the 020/008 sandbox blocked those writes with `EPERM`.

## 2. DEFERRED REGISTRATION

Documented `.codex/settings.json` snippet:

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
