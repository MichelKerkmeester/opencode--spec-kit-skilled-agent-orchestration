---
title: "Implementation Summary: Copilot Wrapper Schema Fix"
description: "The Copilot-safe wrapper-field patch landed in 162a6cb16c but commit 6cd00aa51b removed those fields from .claude/settings.local.json. Packet 010 now needs the top-level fields reapplied."
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/010-copilot-wrapper-schema-fix"
    last_updated_at: "2026-04-23T15:20:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Patch reverted in 6cd00aa51b — fields no longer present in settings.local.json"
    next_safe_action: "Reapply top-level type/bash/timeoutSec fields to all four matcher wrappers"
    completion_pct: 40
    status: "reverted-needs-reapply"
---
# Implementation Summary: Copilot Wrapper Schema Fix

<!-- SPECKIT_LEVEL: 1 -->

## Current State

Commit `162a6cb16c` landed the packet-010 patch and added the top-level `type`, `bash`, and `timeoutSec` fields to all four matcher wrappers in `.claude/settings.local.json`. Commit `6cd00aa51b` later removed those same top-level fields while normalizing the Claude hook config.

Current `.claude/settings.local.json` no longer carries those top-level fields. The live file has only the nested Claude `hooks[0].command` entries again, so the Copilot-safe wrapper shape described in the original packet is no longer present. Packet 010 is therefore partially complete history, not current reality.

## Verification

| Check | Result |
|---|---|
| `git log --oneline -- .claude/settings.local.json` | **PASS** — shows `162a6cb16c` adding the packet-010 patch and `6cd00aa51b` removing it later. |
| `git show 162a6cb16c -- .claude/settings.local.json` | **PASS** — commit adds top-level `type` / `bash` / `timeoutSec` to the wrappers. |
| `git show 6cd00aa51b -- .claude/settings.local.json` | **PASS** — commit removes the top-level wrapper fields. |
| `jq '.hooks' .claude/settings.local.json` | **PASS** — current file no longer includes the top-level Copilot-safe fields. |

## Reapply Shape

Once the revert is undone, `.claude/settings.local.json` will carry these top-level fields again on all four wrappers:

```diff
     "UserPromptSubmit": [
       {
+        "type": "command",
+        "bash": "true",
+        "timeoutSec": 3,
         "hooks": [
           { "type": "command", "command": "bash -c '...claude/user-prompt-submit.js'", "timeout": 3 }
         ]
       }
     ],
     "PreCompact":    [ { +"type"/+"bash"/+"timeoutSec", "hooks": [...] } ],
     "SessionStart":  [ { +"type"/+"bash"/+"timeoutSec", "hooks": [...] } ],
     "Stop":          [ { +"type"/+"bash"/+"timeoutSec", "hooks": [...] } ]
```

## Known Limitations

1. **Packet 010 is currently reverted.** Any downstream packet that depends on the Copilot-safe wrapper shape is blocked until the top-level fields are reapplied.
2. **Packet 011 also needs reapply.** Its writer commands landed in the same commit series and were removed by the same revert.
3. **`PreCompact` remains a defensive field-add.** The research evidence still suggested it was harmless insurance even if Copilot does not ingest that event.

## References

- Research: `../../research/007-deep-review-remediation-pt-03/research.md`
  - §2 root cause
  - §4.2 patch shape (this packet must now reapply it)
  - §3.3 Claude Code cross-runtime compatibility evidence
- Validator source: `~/.copilot/pkg/universal/1.0.34/app.js:1201:3732` (throw site)
- Revert commit: `6cd00aa51b`
