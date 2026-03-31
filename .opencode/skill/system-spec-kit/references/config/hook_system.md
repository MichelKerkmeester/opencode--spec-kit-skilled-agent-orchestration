# Hook System Reference

## Overview

The hook system provides automated context preservation at Claude Code lifecycle boundaries. Hooks are transport reliability — they call the same retrieval primitives that other runtimes call explicitly.

## Hook Registration

Hooks are registered in `.claude/settings.local.json`:

```json
{
  "hooks": {
    "PreCompact": [{ "hooks": [{ "type": "command", "command": "node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/compact-inject.js", "timeout": 3 }] }],
    "SessionStart": [{ "hooks": [{ "type": "command", "command": "node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js", "timeout": 3 }] }],
    "Stop": [{ "hooks": [{ "type": "command", "command": "node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js", "async": true, "timeout": 10 }] }]
  }
}
```

## Hook Lifecycle

1. **PreCompact** — Fires before context compaction. Precomputes critical context (active files, topics, recent transcript) and caches to temp state file. Stdout is NOT injected.
2. **SessionStart** — Fires on session start. Routes by source:
   - `compact`: Reads cached PreCompact payload, injects via stdout
   - `startup`: Primes with Spec Kit Memory overview
   - `resume`: Loads prior session state
   - `clear`: Minimal output
3. **Stop** (async) — Fires on session end. Parses transcript JSONL for token usage, calculates cost estimates, stores snapshots.

## Hook State

Per-session state stored at `${os.tmpdir()}/speckit-claude-hooks/<project-hash>/<session-id>.json`.

Fields: `claudeSessionId`, `speckitSessionId`, `lastSpecFolder`, `pendingCompactPrime`, `metrics` (prompt/completion tokens, transcript offset).

## Script Locations

Source: `mcp_server/hooks/claude/*.ts`
Compiled: `mcp_server/dist/hooks/claude/*.js`

## Token Budgets

- Compaction injection: 4000 tokens (`COMPACTION_TOKEN_BUDGET`)
- Session priming: 2000 tokens (`SESSION_PRIME_TOKEN_BUDGET`)
- Hook timeout: 1800ms (`HOOK_TIMEOUT_MS`, under 2s hard cap)

## Cross-Runtime Fallback

Runtimes without hook support (Codex CLI, Copilot CLI, Gemini CLI) use tool-based recovery via CLAUDE.md/CODEX.md instructions directing the AI to call `memory_context({ mode: "resume", profile: "resume" })` after compaction.

## Retrieval Primitives

Only two retrieval primitives exist across all runtimes:
1. `memory_match_triggers(prompt)` — Fast turn-start context
2. `memory_context({ mode: "resume", profile: "resume" })` — Continuation/compaction recovery
