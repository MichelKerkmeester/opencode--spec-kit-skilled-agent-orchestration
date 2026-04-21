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

## Runtime Hook Matrix

Prompt hooks and lifecycle hooks are separate capabilities. A runtime can support prompt-time advisor context without supporting startup/code-graph lifecycle injection.

| Runtime | Prompt hook | Lifecycle hook | Compaction | Stop |
| --- | --- | --- | --- | --- |
| Claude | yes | yes | yes | yes |
| Codex | yes | no | no | no |
| Copilot | yes | yes (wrapper) | yes | n/a |
| Gemini | yes | yes | yes | yes |
| OpenCode | n/a (advisor separate) | yes (plugin) | yes (plugin) | n/a |

## Cross-Runtime Fallback

Claude Code, Copilot CLI, and Gemini CLI use shell-script `session-prime.ts` style lifecycle hooks. OpenCode uses plugin-based hooks (`@opencode-ai/plugin` at `.opencode/plugins/spec-kit-compact-code-graph.js`). Codex CLI has prompt hooks but does not support lifecycle hooks; it relies on the explicit operator recovery path instead. If hook context is unavailable in any runtime for any reason, fall back to the canonical operator path: start with `/spec_kit:resume`, rebuild packet continuity from `handover.md -> _memory.continuity -> spec docs`, then use `session_bootstrap()` or `session_resume()` only when you need lower-level structural health or merged recovery detail.

## Retrieval Primitives

The same retrieval building blocks power both hook delivery and explicit recovery:
1. `memory_match_triggers(prompt)` — Fast turn-start context
2. `memory_context({ mode: "resume", profile: "resume" })` — Continuation and compaction recovery core
3. `session_bootstrap()` / `session_resume()` — Session-oriented wrappers that layer health and structural context around resume retrieval
