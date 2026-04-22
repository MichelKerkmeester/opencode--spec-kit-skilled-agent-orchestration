---
title: "Implementation Summary: Copilot Wrapper Schema Fix"
description: "Patched .claude/settings.local.json to add Copilot-safe top-level fields to all four matcher wrappers. Claude Code still runs the nested commands (live in-session evidence). Copilot live-smoke pending user execution."
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/010-copilot-wrapper-schema-fix"
    last_updated_at: "2026-04-22T15:20:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Applied JSON patch; Claude-side verified live in-session; awaiting user's Copilot smoke"
    next_safe_action: "User runs `copilot -p \"schema smoke\"` in fresh shell"
    completion_pct: 85
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

## What Was Built

`.claude/settings.local.json` was patched to neutralize the Copilot 1.0.34 wrapper-schema collision discovered in pt-03 research. Each of the four matcher-group wrappers (`UserPromptSubmit`, `PreCompact`, `SessionStart`, `Stop`) now carries top-level `type: "command"`, `bash: "true"`, `timeoutSec: 3` alongside the existing nested `hooks[0].command` — making the wrapper executable-looking to Copilot while Claude Code continues to run only the nested command.

## Diff

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

## Verification

| Check | Result |
|---|---|
| `jq . .claude/settings.local.json` | **PASS** (JSON syntactically valid) |
| `jq '.hooks \| keys'` | **PASS** — `["PreCompact","SessionStart","Stop","UserPromptSubmit"]` (all 4 events preserved) |
| Claude Code still fires `UserPromptSubmit` nested command | **PASS (live in-session)** — the advisor brief (`Advisor: stale; ...`) continues to arrive in every system-reminder on prompt submit, meaning `dist/hooks/claude/user-prompt-submit.js` is running after the patch. |
| Copilot live smoke (`copilot -p "schema smoke"` in fresh shell) | **PENDING** — requires user to run from a normal terminal (sandbox here can't reach Keychain). See §Smoke Instructions below. |

## Smoke Instructions

User runs these three commands from a fresh shell at the repo root:

```bash
# 1. Run a Copilot smoke
copilot -p "schema smoke — answer OK only"

# 2. Grab the new log file and check for the target error
latest=$(ls -t ~/.copilot/logs/process-*.log | head -1)
grep -n "Neither 'bash' nor 'powershell'" "$latest" || echo "NO MATCH — fix works"

# 3. Check if the managed block's Refreshed: advanced
grep "^Refreshed:" ~/.copilot/copilot-instructions.md
```

### Expected
- Command 2 prints `NO MATCH — fix works` (no error lines in the new log).
- Command 3 shows a timestamp more recent than `2026-04-22T11:08:14.595Z` (the previously-stuck value), IF the writer-wiring fix (§Limitations) is also in place.

### If the error persists
Rollback: `git checkout -- .claude/settings.local.json`

## Known Limitations

1. **Writer-wiring secondary issue remains unresolved.** Even with the schema crash fixed, the current `.github/hooks/superset-notify.json` (rewritten by the Superset wrapper on every launch) routes `userPromptSubmitted` to `~/.superset/hooks/copilot-hook.sh` — which only posts Superset notifications and does NOT invoke `dist/hooks/copilot/user-prompt-submit.js`. So the `Refreshed:` timestamp in `$HOME/.copilot/copilot-instructions.md` will still not advance per-prompt after this patch alone.

   **Options for follow-on packet**:
   - Replace `"bash": "true"` in the Claude wrapper with the Copilot writer command directly, making the per-prompt refresh independent of `.github/hooks/superset-notify.json`.
   - Patch the Superset wrapper generator at `~/.superset/bin/copilot:30-69` to emit the system-spec-kit wrapper script as the `userPromptSubmitted` target.

2. **Copilot smoke not executed in this session** — sandbox can't reach the Keychain. User must run it and surface evidence.

3. **`PreCompact` defensive patch may be redundant** — Copilot's event normalizer didn't list it as a merged event in the pt-03 research source trace. The extra fields are harmless either way.

## References

- Research: `../research/007-deep-review-remediation-pt-03/research.md`
  - §2 root cause
  - §4.2 patch shape (this packet applies it)
  - §3.3 Claude Code cross-runtime compatibility evidence
- Validator source: `~/.copilot/pkg/universal/1.0.34/app.js:1201:3732` (throw site)
- Parent packet: `../007-copilot-hook-parity-remediation/implementation-summary.md` (Known Limitations to be cross-linked)
