---
title: "Implementation Summary: Copilot Writer Wiring"
description: "Replaced the Copilot-safe no-ops from packet 010 with real writer invocations for UserPromptSubmit and SessionStart. Standalone probe verified the writer renders the managed block correctly. Live Copilot smoke pending user execution."
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/011-copilot-writer-wiring"
    last_updated_at: "2026-04-22T15:42:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Applied writer-wiring edits + standalone probe verified"
    next_safe_action: "User runs live Copilot smoke (see §Smoke Instructions)"
    completion_pct: 85
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

## What Was Built

The packet-010 no-op `"bash": "true"` on two Claude matcher wrappers was replaced with the actual Copilot writer commands. Now Copilot's ingested `userPromptSubmitted` and `sessionStart` events refresh `$HOME/.copilot/copilot-instructions.md` via the compiled system-spec-kit writers — without touching the Superset-controlled `.github/hooks/superset-notify.json` or the Superset wrapper itself.

Top-level `timeoutSec` was bumped from 3s → 5s on both wrappers to match the precedent in `.github/hooks/superset-notify.json` and give Node startup + advisor lookup room.

`Stop` and `PreCompact` wrappers keep `"bash": "true"` — Copilot `sessionEnd` and `preCompact` (if ingested at all) have no writer to call.

## Diff

```diff
     "UserPromptSubmit": [
       {
         "type": "command",
-        "bash": "true",
-        "timeoutSec": 3,
+        "bash": "cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js",
+        "timeoutSec": 5,
         "hooks": [
           { "type": "command", "command": "...claude/user-prompt-submit.js", "timeout": 3 }
         ]
       }
     ],
     "SessionStart": [
       {
         "type": "command",
-        "bash": "true",
-        "timeoutSec": 3,
+        "bash": "cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/session-prime.js",
+        "timeoutSec": 5,
         "hooks": [
           { "type": "command", "command": "...claude/session-prime.js", "timeout": 3 }
         ]
       }
     ],
```

## Verification

| Check | Result |
|---|---|
| `jq . .claude/settings.local.json` | **PASS** |
| `jq '.hooks.UserPromptSubmit[0]'` — confirm shape | **PASS** — top-level `type`/`bash`/`timeoutSec` present + nested Claude command preserved |
| Standalone writer probe via `SPECKIT_COPILOT_INSTRUCTIONS_PATH` override | **PASS** — managed block rendered with fresh `Refreshed: 2026-04-22T15:38:47.691Z` and `Source: system-spec-kit copilot userPromptSubmitted hook`; diagnostic line emitted; `{}` returned on stdout |
| Claude Code continues to fire nested UserPromptSubmit | **PASS (live in-session)** — advisor briefs continue in every system-reminder |
| Live Copilot smoke (user-run, see below) | **PENDING** |

### Probe evidence

```
$ printf '{"prompt":"wiring probe","cwd":"...","session_id":"probe-011"}' \
  | SPECKIT_COPILOT_INSTRUCTIONS_PATH=$TMPF \
    node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js
{"timestamp":"2026-04-22T15:38:47.663Z","runtime":"copilot","status":"skipped","freshness":"unavailable","durationMs":1,"cacheHit":false,"errorDetails":"below_prompt_policy_threshold"}
{}

$ head -10 $TMPF
# control header

<!-- SPEC-KIT-COPILOT-CONTEXT:BEGIN -->
<!-- This block is managed by Spec Kit Memory. Keep human Copilot instructions outside these markers. -->
# Spec Kit Memory Auto-Generated Context

Refreshed: 2026-04-22T15:38:47.691Z
Source: system-spec-kit copilot userPromptSubmitted hook
```

The probe confirmed: stdin is parsed, the writer runs, managed block lands, external-to-markers content is preserved, stdout is `{}`. (The `status: skipped` in the diagnostic is because the 3-word probe prompt falls under the advisor's prompt-length policy — not a failure. Real prompts will produce live advisor briefs.)

## Smoke Instructions

Run from a fresh terminal at the repo root:

```bash
# 1. Note current Refreshed: timestamp (should be stale — 11:08 UTC or earlier)
grep "^Refreshed:" ~/.copilot/copilot-instructions.md

# 2. Fire a Copilot prompt that will exercise the userPromptSubmitted hook
copilot -p "wiring smoke test: please answer OK"

# 3. Check Refreshed: advanced and Source: changed
grep -E "^Refreshed:|^Source:" ~/.copilot/copilot-instructions.md

# 4. Confirm no schema errors in the new log
latest=$(ls -t ~/.copilot/logs/process-*.log | head -1)
grep -c "Neither 'bash' nor 'powershell'" "$latest" || echo "(zero matches — schema fix holds)"
```

### Expected
- Step 1: `Refreshed: 2026-04-22T11:08:14.595Z` (or earlier)
- Step 3: timestamp is NOW (within seconds of step 2) AND `Source: system-spec-kit copilot userPromptSubmitted hook`
- Step 4: 0 matches

If Step 3's Source still says `sessionStart hook`, the `userPromptSubmitted` path didn't fire — investigate by checking `$latest` log for hook-execution traces around the prompt timestamp.

## Known Limitations

1. **Dependent on packet 010.** If someone reverts packet 010's schema patch, these edits alone won't help — the wrapper will crash before executing the writer.
2. **Not yet live-verified under real Copilot.** Sandbox Keychain restriction blocks `copilot -p` from this session. Standalone writer probe proved the dist artifact works; the hook-chain integration needs a real Copilot launch.
3. **Per-prompt overhead.** The writer runs Node on every Copilot prompt — matches the existing Claude-side overhead. Advisor caching keeps it fast.
4. **`Stop` wrapper not wired.** Copilot `sessionEnd` has no writer; keeping `bash: "true"` is correct.

## References

- Research: `../research/007-deep-review-remediation-pt-03/research.md` §7 (writer-wiring secondary gap)
- Parent: `010-copilot-wrapper-schema-fix/implementation-summary.md` §Known Limitations item 1
- Writer source: `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`
- Writer dist: `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js`
