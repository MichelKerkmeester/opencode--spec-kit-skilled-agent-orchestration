---
title: "Implementation Plan: Copilot Writer Wiring"
importance_tier: "high"
contextType: "spec"
---
# Plan

<!-- SPECKIT_LEVEL: 1 -->

## Approach
Two one-line edits in `.claude/settings.local.json` to re-aim the Copilot-side top-level `bash` fields at the real writers.

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
5. Standalone writer probe via `SPECKIT_COPILOT_INSTRUCTIONS_PATH` override — confirm managed block renders + `Refreshed:` is current.
6. User runs live Copilot smoke from a fresh shell.

## Rollback
`git checkout -- .claude/settings.local.json` reverts both packets 010 + 011 in one step (both changes live in the same file).
