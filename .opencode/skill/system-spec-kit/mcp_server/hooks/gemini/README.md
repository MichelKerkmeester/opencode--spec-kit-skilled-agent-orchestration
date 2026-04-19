---
title: "Gemini Hooks"
description: "Gemini CLI startup, compaction, and stop-hook support."
trigger_phrases:
  - "gemini hooks"
  - "gemini session prime"
---

# Gemini Hooks

## 1. OVERVIEW

`hooks/gemini/` implements the Gemini CLI hook surface used by the package.

- `session-prime.ts` formats startup, resume, clear, and compact recovery context.
- `compact-inject.ts` prepares compaction-time recovery payloads.
- `user-prompt-submit.ts` runs the prompt-time skill-advisor hook and emits JSON `additionalContext` when the shared renderer returns a brief.
- `session-stop.ts` persists stop-hook session state.
- `compact-cache.ts` stores the short-lived compaction cache.
- `shared.ts` holds Gemini-specific stdin/stdout formatting helpers.

These hooks keep the canonical recovery chain aligned with `handover.md`, `_memory.continuity`, and packet docs.

## 2. ADVISOR REGISTRATION

Register the advisor under `BeforeAgent` in `.gemini/settings.json`:

```json
{
  "hooksConfig": {
    "enabled": true
  },
  "hooks": {
    "BeforeAgent": [
      {
        "hooks": [
          {
            "name": "speckit-user-prompt-advisor",
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/user-prompt-submit.js'",
            "timeout": 3000
          }
        ]
      }
    ]
  }
}
```

Set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` to skip the advisor path for the current process session. The full contract lives at `../../../references/hooks/skill-advisor-hook.md`.

## 3. RELATED

- `../README.md`
- `../claude/README.md`
