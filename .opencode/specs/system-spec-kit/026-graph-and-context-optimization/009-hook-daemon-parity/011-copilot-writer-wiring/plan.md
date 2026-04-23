---
title: "Implementation Plan: Copilot Writer Wiring"
description: "Reapply the reverted top-level Copilot writer commands on UserPromptSubmit and SessionStart after packet 010 restores the wrapper schema."
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
# Implementation Plan: Copilot Writer Wiring

<!-- SPECKIT_LEVEL: 1 -->

## Approach
Two top-level command reapplications in `.claude/settings.local.json` to restore the Copilot-side writer invocations that `6cd00aa51b` removed.

## Steps
1. Replace `"bash": "true"` in `hooks.UserPromptSubmit[0]` with:
   ```
   cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js
   ```
2. Replace `"bash": "true"` in `hooks.SessionStart[0]` with:
   ```
   cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/session-prime.js
   ```
3. Bump `timeoutSec` from 3 → 5 on both wrappers.
4. Validate: `jq . .claude/settings.local.json`.
5. Standalone writer probe via `SPECKIT_COPILOT_INSTRUCTIONS_PATH` override — confirm managed block renders + `Refreshed:` is current again.
6. User runs live Copilot smoke from a fresh shell after packet 010 is restored.

## Rollback
`git checkout -- .claude/settings.local.json` reverts both packet reapplications in one step if the smoke disproves the wiring.
