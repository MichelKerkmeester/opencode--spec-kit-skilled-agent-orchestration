---
title: "Implemen [system-spec-kit/026-graph-and-context-optimization/009-hook-package/010-copilot-wrapper-schema-fix/plan]"
description: "Reapply the reverted JSON patch so .claude/settings.local.json again carries the top-level Copilot-safe wrapper fields on all four matcher wrappers."
trigger_phrases:
  - "implemen"
  - "plan"
  - "010"
  - "copilot"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package/010-copilot-wrapper-schema-fix"
    last_updated_at: "2026-04-23T15:20:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Patch reverted in 6cd00aa51b — fields no longer present in settings.local.json"
    next_safe_action: "Reapply top-level type/bash/timeoutSec fields to all four matcher wrappers"
    completion_pct: 40
    status: "reverted-needs-reapply"
---
# Implementation Plan: Copilot Wrapper Schema Fix

<!-- SPECKIT_LEVEL: 1 -->

## Approach

Single-file JSON reapply. Reuse the exact wrapper shape that landed in `162a6cb16c`, because `6cd00aa51b` removed it later.

## Steps

1. Read `.claude/settings.local.json` to capture current state.
2. Reapply the patch — add `"type": "command"`, `"bash": "true"`, `"timeoutSec": 3` as siblings of `"hooks"` in each of:
   - `hooks.UserPromptSubmit[0]`
   - `hooks.SessionStart[0]`
   - `hooks.Stop[0]`
   - `hooks.PreCompact[0]` (defensive; Copilot unlikely to ingest but zero cost)
3. Validate JSON: `jq . .claude/settings.local.json >/dev/null`.
4. Confirm the live file now matches the `162a6cb16c` landing shape again.
5. Copilot-side smoke: user runs `copilot -p "hook schema smoke"` from a fresh shell, then inspect the new `~/.copilot/logs/process-*.log` for absence of the error string.
6. Refresh `implementation-summary.md` with post-reapply evidence.

## Validation

- `jq` passes on the patched file.
- `~/.copilot/logs/process-*.log` (new session) has 0 matches for `"Neither 'bash' nor 'powershell'"`.
- Claude Code continues to operate (this conversation is a live smoke — UserPromptSubmit hook is firing every turn via the managed brief).

## Rollback

`git checkout -- .claude/settings.local.json` reverts the reapply if the smoke disproves the packet.
