---
title: "Copilot Hooks"
description: "GitHub Copilot CLI hook scripts used by the MCP package."
trigger_phrases:
  - "copilot hooks"
  - "copilot session prime"
  - "copilot custom instructions"
---

# Copilot Hooks

## 1. OVERVIEW

`hooks/copilot/` contains Copilot CLI hook helpers for the file-based Spec Kit context workaround.

GitHub's Copilot CLI hook contract currently ignores `sessionStart` output and ignores `userPromptSubmitted` output for prompt modification. Because of that, these hooks do not try to return model-visible `additionalContext`. They refresh Copilot's supported custom-instructions surface instead.

- `custom-instructions.ts` owns the managed block in `$HOME/.copilot/copilot-instructions.md`.
- `session-prime.ts` builds the startup context and refreshes the managed block during `sessionStart`.
- `user-prompt-submit.ts` builds the advisor brief during `userPromptSubmitted`, refreshes the same managed block, and returns `{}`.
- `compact-cache.ts` keeps compact recovery state available for wrapper surfaces.

The managed block is bounded by `SPEC-KIT-COPILOT-CONTEXT` markers so human instructions outside the block are preserved.

## 2. HOOK REGISTRATION

Use the shared `.claude/settings.local.json` matcher wrappers so Copilot can execute the top-level writer command while Claude keeps the nested `hooks` commands in the same matcher group:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "type": "command",
        "bash": "cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js",
        "timeoutSec": 5,
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js'",
            "timeout": 3
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "type": "command",
        "bash": "cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/session-prime.js",
        "timeoutSec": 5,
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js'",
            "timeout": 3
          }
        ]
      }
    ]
  }
}
```

For Copilot, the effective writer path is the outer `.claude/settings.local.json` wrapper. Claude continues to use the nested `hooks` entries in the same matcher groups.

Set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` to skip advisor generation for the current process. Set `SPECKIT_COPILOT_INSTRUCTIONS_DISABLED=1` to skip the custom-instructions writer. Set `SPECKIT_COPILOT_INSTRUCTIONS_PATH` when tests need an isolated target file.

## 3. RELATED

- `../README.md`
- `../claude/README.md`
- `../gemini/README.md`
- `../../../references/hooks/skill-advisor-hook.md`
