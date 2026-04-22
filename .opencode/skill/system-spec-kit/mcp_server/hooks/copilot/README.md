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

Use repo-local wrappers so the writer runs before any notification-only hook:

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [
      {
        "type": "command",
        "bash": ".github/hooks/scripts/session-start.sh",
        "timeoutSec": 5
      }
    ],
    "userPromptSubmitted": [
      {
        "type": "command",
        "bash": ".github/hooks/scripts/user-prompt-submitted.sh",
        "timeoutSec": 5
      }
    ]
  }
}
```

Set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` to skip advisor generation for the current process. Set `SPECKIT_COPILOT_INSTRUCTIONS_DISABLED=1` to skip the custom-instructions writer. Set `SPECKIT_COPILOT_INSTRUCTIONS_PATH` when tests need an isolated target file.

## 3. RELATED

- `../README.md`
- `../claude/README.md`
- `../gemini/README.md`
- `../../../references/hooks/skill-advisor-hook.md`
