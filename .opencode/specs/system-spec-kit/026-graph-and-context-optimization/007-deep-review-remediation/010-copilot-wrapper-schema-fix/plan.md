---
title: "Implementation Plan: Copilot Wrapper Schema Fix"
description: "Minimal JSON patch + cross-runtime smoke tests. No code changes."
importance_tier: "high"
contextType: "spec"
---
# Implementation Plan

<!-- SPECKIT_LEVEL: 1 -->

## Approach

Single-file JSON patch. Reuse the exact shape empirically validated in `research/007-deep-review-remediation-pt-03/` iterations 5+6.

## Steps

1. Read `.claude/settings.local.json` to capture current state.
2. Apply patch — add `"type": "command"`, `"bash": "true"`, `"timeoutSec": 3` as siblings of `"hooks"` in each of:
   - `hooks.UserPromptSubmit[0]`
   - `hooks.SessionStart[0]`
   - `hooks.Stop[0]`
   - `hooks.PreCompact[0]` (defensive; Copilot unlikely to ingest but zero cost)
3. Validate JSON: `jq . .claude/settings.local.json >/dev/null`.
4. Claude-side smoke (negative): Claude Code will still run nested `command` on next hook fire; no action needed if already working in-session.
5. Copilot-side smoke: user runs `copilot -p "hook schema smoke"` from a fresh shell, then I inspect the new `~/.copilot/logs/process-*.log` for absence of the error string.
6. Write `implementation-summary.md` with evidence.

## Validation

- `jq` passes on the patched file.
- `~/.copilot/logs/process-*.log` (new session) has 0 matches for `"Neither 'bash' nor 'powershell'"`.
- Claude Code continues to operate (this conversation is a live smoke — UserPromptSubmit hook is firing every turn via the managed brief).

## Rollback

`git checkout -- .claude/settings.local.json`.
