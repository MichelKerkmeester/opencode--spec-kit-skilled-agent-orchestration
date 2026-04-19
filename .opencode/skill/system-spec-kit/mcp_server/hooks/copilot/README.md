---
title: "Copilot Hooks"
description: "GitHub Copilot CLI hook scripts used by the MCP package."
trigger_phrases:
  - "copilot hooks"
  - "copilot session prime"
---

# Copilot Hooks

## 1. OVERVIEW

`hooks/copilot/` contains the Copilot CLI SessionStart banner hook and the Phase 020 prompt-time skill-advisor adapter.

- `session-prime.ts` drains stdin, loads the shared startup brief when available, and emits the same high-level startup banner shape used by the other CLI hook surfaces.
- `user-prompt-submit.ts` supports an SDK `onUserPromptSubmitted` path and a wrapper fallback. Both call `buildSkillAdvisorBrief()` and use the shared renderer.

The hook is intentionally read-only and does not mutate packet continuity state.

## 2. ADVISOR REGISTRATION

Prefer the SDK callback when the Copilot runtime exposes it:

```ts
import { handleCopilotSdkUserPromptSubmitted } from './dist/hooks/copilot/user-prompt-submit.js';

export async function onUserPromptSubmitted(input) {
  return handleCopilotSdkUserPromptSubmitted(input);
}
```

Use the command wrapper fallback when the SDK path is unavailable:

```json
{
  "userPromptSubmitted": [
    {
      "type": "command",
      "bash": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js'",
      "timeoutSec": 5
    }
  ]
}
```

Set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` to skip the advisor path for the current process session. Wrapper prompt text remains in memory only.

## 3. RELATED

- `../README.md`
- `../claude/README.md`
- `../gemini/README.md`
- `../../../references/hooks/skill-advisor-hook.md`
