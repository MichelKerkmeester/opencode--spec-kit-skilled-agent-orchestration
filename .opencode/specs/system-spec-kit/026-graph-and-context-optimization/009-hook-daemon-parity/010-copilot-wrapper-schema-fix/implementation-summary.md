---
title: "Implementation Summary: Copilot Wrapper Schema Fix"
description: "The Copilot-safe wrapper-field patch has been reapplied in .claude/settings.local.json, restoring the top-level fields that packet 010 requires for Copilot-safe matcher wrappers."
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/010-copilot-wrapper-schema-fix"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Reapplied top-level type/bash/timeoutSec fields to all four Copilot matcher wrappers in .claude/settings.local.json"
    next_safe_action: "Run the cross-runtime smoke matrix and refresh any parent parity wording that still references packet 010 as reverted"
    completion_pct: 100
    status: "implemented"
---
# Implementation Summary: Copilot Wrapper Schema Fix

<!-- SPECKIT_LEVEL: 1 -->

## Current State

Commit `162a6cb16c` landed the packet-010 patch and added the top-level `type`, `bash`, and `timeoutSec` fields to all four matcher wrappers in `.claude/settings.local.json`. Commit `6cd00aa51b` later removed those same top-level fields while normalizing the Claude hook config.

Current `.claude/settings.local.json` again carries those top-level fields. `UserPromptSubmit` and `SessionStart` now expose top-level Copilot writer commands with `timeoutSec: 5`, while `PreCompact` and `Stop` expose the defensive `bash: "true"` wrappers with `timeoutSec: 3`. The nested Claude `hooks[0].command` entries remain unchanged, so the Copilot-safe wrapper shape described in the original packet is live again.

## Verification

| Check | Result |
|---|---|
| `git log --oneline -- .claude/settings.local.json` | **PASS** — shows `162a6cb16c` adding the packet-010 patch and `6cd00aa51b` removing it later. |
| `git show 162a6cb16c -- .claude/settings.local.json` | **PASS** — commit adds top-level `type` / `bash` / `timeoutSec` to the wrappers. |
| `git show 6cd00aa51b -- .claude/settings.local.json` | **PASS** — commit removes the top-level wrapper fields. |
| `python3 -m json.tool .claude/settings.local.json` | **PASS** — current settings JSON parses after the reapply. |
| `jq '.hooks.UserPromptSubmit[0] | {type, bash, timeoutSec}' .claude/settings.local.json` | **PASS** — current file restores the top-level Copilot writer wrapper on `UserPromptSubmit`. |
| `jq '.hooks.PreCompact[0] | {type, bash, timeoutSec}' .claude/settings.local.json` | **PASS** — current file restores the defensive top-level Copilot-safe wrapper on `PreCompact`. |
| `jq '.hooks.SessionStart[0] | {type, bash, timeoutSec}' .claude/settings.local.json` | **PASS** — current file restores the top-level Copilot writer wrapper on `SessionStart`. |
| `jq '.hooks.Stop[0] | {type, bash, timeoutSec}' .claude/settings.local.json` | **PASS** — current file restores the defensive top-level Copilot-safe wrapper on `Stop`. |

## Restored Shape

`.claude/settings.local.json` now carries these top-level fields again on all four wrappers:

```diff
     "UserPromptSubmit": [
       {
+        "type": "command",
+        "bash": "cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js",
+        "timeoutSec": 5,
         "hooks": [
           { "type": "command", "command": "bash -c '...claude/user-prompt-submit.js'", "timeout": 3 }
         ]
       }
     ],
     "PreCompact":    [ { +"type"/+"bash"/+"timeoutSec: 3", "hooks": [...] } ],
     "SessionStart":  [ { +"type"/+"bash"/+"timeoutSec: 5", "hooks": [...] } ],
     "Stop":          [ { +"type"/+"bash"/+"timeoutSec: 3", "hooks": [...] } ]
```

## Known Limitations

1. **Cross-runtime smoke still needs a fresh rerun.** The wrapper shape is restored, but the parent parity packet should still rerun its smoke matrix before claiming full operational closure.
2. **`PreCompact` remains a defensive field-add.** The research evidence still suggested it was harmless insurance even if Copilot does not ingest that event.
3. **Historical revert evidence remains relevant.** Packet 010 now documents both the original revert and the live reapply so future parity reviews can trace why this wrapper shape matters.

## References

- Research: `../../research/007-deep-review-remediation-pt-03/research.md`
  - §2 root cause
  - §4.2 patch shape (this packet must now reapply it)
  - §3.3 Claude Code cross-runtime compatibility evidence
- Validator source: `~/.copilot/pkg/universal/1.0.34/app.js:1201:3732` (throw site)
- Revert commit: `6cd00aa51b`
