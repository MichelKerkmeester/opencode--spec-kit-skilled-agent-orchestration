---
title: "Feature Specification: Copilot Writer Wiring via Claude Wrapper"
description: "Route Copilot's userPromptSubmitted and sessionStart hooks to the system-spec-kit Copilot writers by replacing the 'bash: true' no-ops in .claude/settings.local.json with the actual writer commands. Bypasses the Superset-wrapper clobber of .github/hooks/superset-notify.json and makes the $HOME/.copilot/copilot-instructions.md Refreshed: timestamp advance per-prompt under Copilot."
trigger_phrases:
  - "copilot writer wiring"
  - "copilot refreshed timestamp"
  - "026/007/011"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/011-copilot-writer-wiring"
    last_updated_at: "2026-04-22T15:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Applied writer-wiring patch"
    next_safe_action: "User runs live Copilot smoke and verifies Refreshed: advances"
    blockers: []
    completion_pct: 85
---
# Feature Specification: Copilot Writer Wiring

<!-- SPECKIT_LEVEL: 1 -->

## METADATA

| Field | Value |
|---|---|
| **Level** | 1 |
| **Priority** | P1 |
| **Parent** | `026-graph-and-context-optimization/007-deep-review-remediation/` |
| **Depends on** | `010-copilot-wrapper-schema-fix/` (schema crash must already be resolved) |
| **Research** | `../research/007-deep-review-remediation-pt-03/research.md` §7 |

## PROBLEM

After packet 010 fixed the Copilot schema crash, the `userPromptSubmitted` hook still doesn't refresh the managed block in `$HOME/.copilot/copilot-instructions.md` because:

1. Copilot reads `.github/hooks/superset-notify.json` for `userPromptSubmitted`.
2. That file is rewritten on every Copilot launch by the Superset wrapper at `~/.superset/bin/copilot:30-69` — it routes the event to `~/.superset/hooks/copilot-hook.sh` which only posts Superset notifications.
3. The system-spec-kit Copilot writer at `dist/hooks/copilot/user-prompt-submit.js` never runs from the Copilot side.
4. Result: `Refreshed:` timestamp stays frozen at whatever last wrote the file (currently the sessionStart hook from a past session).

## SOLUTION

Option 1 from packet 010 §Known Limitations: replace the no-op `bash: "true"` on the `UserPromptSubmit` and `SessionStart` matcher wrappers in `.claude/settings.local.json` with the actual Copilot writer commands. Because `.claude/settings.local.json` is ALSO merged by Copilot (iter-4 source trace), Copilot executes this top-level `bash` on every prompt/session — pointing it at our writer makes the refresh happen.

Claude Code still executes only the nested `command` (empirically confirmed in pt-03 iter-6 F34).

## SCOPE

### In Scope
- `.claude/settings.local.json`: replace `"bash": "true"` with the Copilot writer invocation on:
  - `UserPromptSubmit` → `dist/hooks/copilot/user-prompt-submit.js`
  - `SessionStart` → `dist/hooks/copilot/session-prime.js`
- Bump `timeoutSec` from 3 to 5 to give the writer headroom (matches `.github/hooks/superset-notify.json` precedent).
- Leave `Stop` and `PreCompact` wrappers with `"bash": "true"` (no corresponding Copilot writers).

### Out of Scope
- Patching the Superset wrapper (option 2 from 010) — defers external-tool modification.
- Patching `.github/hooks/superset-notify.json` directly — gets clobbered on launch.
- Handling Copilot `sessionEnd`, `preToolUse`, `postToolUse` events — no writer needed.

## REQUIREMENTS

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-001 | Replace `bash: "true"` on UserPromptSubmit + SessionStart with the Copilot writer commands | Diff shows exact replacement; JSON still validates. |
| REQ-002 | Copilot writer runs successfully when invoked standalone with a stdin JSON payload | Standalone probe writes the `SPEC-KIT-COPILOT-CONTEXT` block with a fresh `Refreshed:` timestamp. |
| REQ-003 | Claude Code continues to execute the nested UserPromptSubmit command only | Live in-session evidence: advisor briefs continue to appear on every prompt. |
| REQ-004 | Live Copilot smoke: `Refreshed:` timestamp advances after a new `copilot -p` prompt | User-run smoke shows the managed block's timestamp newer than the pre-patch value (`2026-04-22T11:08:14.595Z`). |

## SUCCESS CRITERIA

- **SC-001**: `$HOME/.copilot/copilot-instructions.md` `Refreshed:` timestamp advances on every new Copilot prompt.
- **SC-002**: The managed block's `Source:` line reads `system-spec-kit copilot userPromptSubmitted hook` after a user prompt (not just sessionStart).
- **SC-003**: No new `Neither 'bash' nor 'powershell'` errors in `~/.copilot/logs/process-*.log` (packet 010 condition still holds).
