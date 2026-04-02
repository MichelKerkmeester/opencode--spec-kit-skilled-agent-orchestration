# Hook System Reference

## Overview

The hook system provides automated context preservation at hook-capable runtime lifecycle boundaries. Hooks are transport reliability — they call the same retrieval primitives that other runtimes call explicitly.

## Hook Registration

Claude Code hooks are registered in `.claude/settings.local.json`:

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

Hook-capable runtimes include Claude Code, Codex CLI, Copilot CLI, and Gemini CLI when their adapters are available. OpenCode is the non-hook runtime and should use `session_bootstrap()` on fresh start or after `/clear`, then `session_resume()` only when a detailed follow-up recovery payload is needed. If hook context is unavailable in a hook-capable runtime for any reason, fall back to the same tool-based recovery path.

## Retrieval Primitives

The same retrieval building blocks power both hook delivery and explicit recovery:
1. `memory_match_triggers(prompt)` — Fast turn-start context
2. `memory_context({ mode: "resume", profile: "resume" })` — Continuation and compaction recovery core
3. `session_bootstrap()` / `session_resume()` — Session-oriented wrappers that layer health and structural context around resume retrieval
