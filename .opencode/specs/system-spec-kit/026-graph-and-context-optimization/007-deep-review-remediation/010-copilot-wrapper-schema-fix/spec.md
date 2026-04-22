---
title: "Feature Specification: Copilot Wrapper Schema Fix for .claude/settings.local.json"
description: "Eliminate the 'Neither bash nor powershell specified in hook command configuration' error that Copilot CLI 1.0.34 throws on every user prompt by adding top-level Copilot-safe fields to the Claude-style matcher wrappers in .claude/settings.local.json. Cross-runtime compatibility with Claude Code was empirically verified in pt-03 research iter-6."
trigger_phrases:
  - "copilot wrapper schema fix"
  - "copilot claude settings collision"
  - "026/007/010"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/010-copilot-wrapper-schema-fix"
    last_updated_at: "2026-04-22T15:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Spec authored"
    next_safe_action: "Apply patch to .claude/settings.local.json"
    blockers: []
    completion_pct: 20
---
# Feature Specification: Copilot Wrapper Schema Fix

<!-- SPECKIT_LEVEL: 1 -->

---

## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-22 |
| **Parent** | `026-graph-and-context-optimization/007-deep-review-remediation/` |
| **Research** | `../research/007-deep-review-remediation-pt-03/research.md` |

---

## 2. PROBLEM

Copilot CLI 1.0.34 logs this error on every user prompt:
```
Hook execution failed: Error: Neither 'bash' nor 'powershell' specified in hook command configuration
```

Research packet `007-deep-review-remediation-pt-03` traced the root cause (8 iterations, converged at iter-8):

- Copilot merges hook configs from BOTH `.github/hooks/*.json` AND `.claude/settings.local.json`.
- `.claude/settings.local.json` uses Claude's *nested* matcher shape (`hooks.UserPromptSubmit[0].hooks[0].command`) — the outer matcher-group object has no top-level `bash`/`powershell`.
- Copilot normalizes Claude event names onto its own (e.g. `UserPromptSubmit` → `userPromptSubmitted`), hands the outer wrapper to its executor `g2()` at `~/.copilot/pkg/universal/1.0.34/app.js:1201`, and throws because the wrapper lacks a shell alias.
- `sessionStart` escapes this because it filters entries by `type === "command"` before `g2()`; `userPromptSubmitted` does not filter.

The error has existed since Copilot 1.0.14 (March 2026) — it's a long-standing cross-runtime collision, not a 1.0.34 regression.

This blocks per-prompt refresh of `$HOME/.copilot/copilot-instructions.md` (the managed `SPEC-KIT-COPILOT-CONTEXT` block) because the `userPromptSubmitted` hook crashes before the system-spec-kit writer can run.

---

## 3. SCOPE

### In Scope

- Patch `.claude/settings.local.json` to add top-level Copilot-safe fields (`type: "command"`, `bash: "true"`, `timeoutSec: 3`) to each matcher-group wrapper whose event name Copilot ingests.
- Events to patch: `UserPromptSubmit`, `SessionStart`, `Stop` (maps to Copilot's `sessionEnd`). Defensive: also `PreCompact` (Copilot unlikely to ingest but cheap insurance).
- Live smoke: run `copilot -p "smoke"` from a fresh shell; verify no `Neither 'bash' nor 'powershell'` error in the new `~/.copilot/logs/process-*.log`.

### Out of Scope

- Modifying `.github/hooks/superset-notify.json` — research proved it's schema-valid and executing correctly.
- Patching the Superset wrapper at `~/.superset/bin/copilot`.
- Fixing the secondary writer-wiring gap (current `superset-notify.json` routes to `copilot-hook.sh` which doesn't invoke the system-spec-kit writer). That's a follow-on concern; see `implementation-summary.md` §Limitations.
- Verifying `Refreshed:` timestamp advances per-prompt — depends on the writer-wiring fix above.

### Files Expected to Change

| Path | Change |
|---|---|
| `.claude/settings.local.json` | Add top-level `type`/`bash`/`timeoutSec` to 4 matcher wrappers |

---

## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-001 | Patch `.claude/settings.local.json` per research §4.2 | Diff shows top-level fields added to each matcher wrapper; file remains valid JSON. |
| REQ-002 | Claude Code still executes the nested `command` successfully after the patch | Claude Code `--debug hooks` shows `hook_success` for `UserPromptSubmit` (unchanged behavior). |
| REQ-003 | Copilot CLI no longer throws `Neither 'bash' nor 'powershell'` on `userPromptSubmitted` | New `~/.copilot/logs/process-*.log` (from a fresh Copilot session after the patch) has zero matches for that string on `userPromptSubmitted` events. |

### P1 — Recommended

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-004 | Update `007-copilot-hook-parity-remediation/implementation-summary.md` §Known Limitations to reflect the resolved schema collision | File edited with a note referencing this packet + research pt-03 |

---

## 5. SUCCESS CRITERIA

- **SC-001**: A fresh `copilot -p` session produces a log file with no `Neither 'bash' nor 'powershell'` lines.
- **SC-002**: Claude Code still runs the nested UserPromptSubmit hook (`dist/hooks/claude/user-prompt-submit.js`) every prompt.
- **SC-003**: `.claude/settings.local.json` remains syntactically valid (jq parses it cleanly).
