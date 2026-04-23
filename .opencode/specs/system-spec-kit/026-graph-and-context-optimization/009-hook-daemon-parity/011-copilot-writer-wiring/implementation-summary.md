---
title: "Implementation Summary: Copilot Writer Wiring"
description: "The writer-wiring commands landed in 162a6cb16c but were removed by 6cd00aa51b along with packet 010's wrapper fields. Current .claude/settings.local.json no longer contains the Copilot writer commands."
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/011-copilot-writer-wiring"
    last_updated_at: "2026-04-23T15:20:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Wiring was applied then reverted along with 010 in 6cd00aa51b"
    next_safe_action: "Reapply UserPromptSubmit/SessionStart writer commands after 010 is reapplied"
    completion_pct: 35
    status: "reverted-needs-reapply"
---
# Implementation Summary: Copilot Writer Wiring

<!-- SPECKIT_LEVEL: 1 -->

## Current State

Commit `162a6cb16c` replaced the packet-010 no-op wrapper commands with the actual Copilot writer invocations for `UserPromptSubmit` and `SessionStart`. Commit `6cd00aa51b` later removed those top-level fields while normalizing `.claude/settings.local.json`.

Current `.claude/settings.local.json` no longer contains the Copilot writer commands on either wrapper. The live file has only the nested Claude commands:

```json
{
  "UserPromptSubmit": [
    {
      "hooks": [
        {
          "type": "command",
          "command": "bash -c '...claude/user-prompt-submit.js'",
          "timeout": 3
        }
      ]
    }
  ],
  "SessionStart": [
    {
      "hooks": [
        {
          "type": "command",
          "command": "bash -c '...claude/session-prime.js'",
          "timeout": 3
        }
      ]
    }
  ]
}
```

Packet 011 therefore depends on packet 010 being reapplied first, then reintroducing the two top-level writer commands.

## Verification

| Check | Result |
|---|---|
| `git show 162a6cb16c -- .claude/settings.local.json` | **PASS** — shows the packet-011 writer commands landing on `UserPromptSubmit` and `SessionStart`. |
| `git show 6cd00aa51b -- .claude/settings.local.json` | **PASS** — shows those top-level writer commands being removed. |
| `jq '.hooks.UserPromptSubmit[0]' .claude/settings.local.json` | **PASS** — current wrapper has only nested Claude hooks; no top-level writer command remains. |
| `jq '.hooks.SessionStart[0]' .claude/settings.local.json` | **PASS** — current wrapper has only nested Claude hooks; no top-level writer command remains. |
| Standalone writer probe evidence from 2026-04-22 | **HISTORICAL PASS** — confirms the dist writers work when invoked directly, but the live wrapper wiring is currently absent. |

## Historical Landing Shape

Once packet 010 is reapplied, packet 011 must restore these top-level commands:

```diff
     "UserPromptSubmit": [
       {
+        "type": "command",
+        "bash": "cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js",
+        "timeoutSec": 5,
         "hooks": [
           { "type": "command", "command": "...claude/user-prompt-submit.js", "timeout": 3 }
         ]
       }
     ],
     "SessionStart": [
       {
+        "type": "command",
+        "bash": "cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/session-prime.js",
+        "timeoutSec": 5,
         "hooks": [
           { "type": "command", "command": "...claude/session-prime.js", "timeout": 3 }
         ]
       }
     ],
```

## Known Limitations

1. **Packet 011 is currently reverted.** The wrapper commands are not present in the live file, so no live Copilot smoke can pass until the commands are restored.
2. **Dependent on packet 010.** Packet 010 must restore the top-level wrapper fields first; packet 011 then restores the real writer commands on two of those wrappers.
3. **Historical probe evidence still matters.** The standalone probe proves the writer implementation itself worked when the wrapper pointed at it, so the remaining gap is config reapply rather than code redesign.

## References

- Research: `../../research/007-deep-review-remediation-pt-03/research.md` §7 (writer-wiring secondary gap)
- Revert commit: `6cd00aa51b`
- Writer source: `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`
- Writer dist: `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js`
