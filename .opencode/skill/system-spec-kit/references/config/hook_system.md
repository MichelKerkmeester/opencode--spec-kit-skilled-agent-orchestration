# Hook System Reference

## Overview

The hook system provides automated context preservation at hook-capable prompt-time and lifecycle boundaries. Prompt delivery, startup wiring, compaction, and shutdown handling differ by runtime, but they call the same retrieval primitives and fail open to the same operator recovery path.

## Hook Registration

Claude Code hooks are registered in `.claude/settings.local.json`. Under the normalized Claude schema, `UserPromptSubmit` is the prompt hook, while `PreCompact`, `SessionStart`, and `Stop` are lifecycle hooks:

```json
{
  "hooks": {
    "UserPromptSubmit": [{ "hooks": [{ "type": "command", "command": "node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js", "timeout": 3 }] }],
    "PreCompact": [{ "hooks": [{ "type": "command", "command": "node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/compact-inject.js", "timeout": 3 }] }],
    "SessionStart": [{ "hooks": [{ "type": "command", "command": "node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js", "timeout": 3 }] }],
    "Stop": [{ "hooks": [{ "type": "command", "command": "node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js", "async": true, "timeout": 10 }] }]
  }
}
```

When Copilot wrapper parity is enabled, the same `UserPromptSubmit` and `SessionStart` objects can also carry top-level `type`, `bash`, and `timeoutSec` fields for the Copilot writers, while the nested `hooks` array remains the Claude command registration surface.

## Canonical Runtime Hook Vocabulary

Use capability names first, then map to the runtime-local surface below when wiring or validating a specific runtime:

| Capability | Claude / Codex / Copilot | Gemini | OpenCode |
| --- | --- | --- | --- |
| Prompt-time advisor | `UserPromptSubmit` | `BeforeAgent` | `experimental.chat.system.transform` |
| Session priming | `SessionStart` | `SessionStart` | `event` startup handlers |
| Compaction | `PreCompact` | `PreCompress` plus `BeforeAgent` injection | `event` compact handlers / compact plugin |
| Session cleanup | `Stop` | `SessionEnd` | `event` cleanup handlers |

## Hook Lifecycle

1. **Prompt-time advisor** — `UserPromptSubmit` in Claude, Codex, and Copilot; `BeforeAgent` in Gemini; `experimental.chat.system.transform` in OpenCode. Claude, Gemini, Codex, and OpenCode can inject runtime-visible advisor context in-turn. Copilot uses the same logical surface to refresh managed custom instructions and returns `{}`.
2. **Compaction** — `PreCompact` in Claude, `PreCompress` plus `BeforeAgent` reinjection in Gemini, compact `event` handlers in OpenCode, and limited wrapper-only parity in Copilot. Stdout is not injected on the precompute phase.
3. **SessionStart** — Fires on session start. Routes by source:
   - `compact`: Reads cached PreCompact payload, injects via stdout
   - `startup`: Primes with Spec Kit Memory overview
   - `resume`: Loads prior session state
   - `clear`: Minimal output
   Gemini and Copilot keep runtime-specific transport output, but both can forward the same session and spec-folder startup scope used by Claude when that input is available. Codex only reports live native-hook readiness when `[features].codex_hooks = true` is enabled in `~/.codex/config.toml` and `~/.codex/hooks.json` is wired.
4. **Session cleanup** — `Stop` in Claude, `SessionEnd` in Gemini, and cleanup `event` handlers in OpenCode. Parses transcript JSONL for token usage, calculates cost estimates, and stores snapshots when the runtime supports it.

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

Prompt hooks and lifecycle hooks are separate capabilities. A runtime can support prompt-time advisor context without supporting startup/code-graph lifecycle injection, and Copilot's prompt-time parity is next-prompt fresh rather than in-turn injection.

| Runtime | Prompt hook | Lifecycle hook | Compaction | Stop |
| --- | --- | --- | --- | --- |
| Claude | yes (`UserPromptSubmit`) | yes (`SessionStart`) | yes (`PreCompact`) | yes (`Stop`) |
| Codex | yes (`UserPromptSubmit`) | yes (`SessionStart`, live only when `codex_hooks` and `hooks.json` are both present) | no | no |
| Copilot | yes (file-based custom instructions; next prompt) | yes (`SessionStart` writer via `.claude/settings.local.json`) | limited (wrapper field only; no model-visible injection) | n/a |
| Gemini | yes (`BeforeAgent`) | yes (`SessionStart`) | yes (`PreCompress`) | yes (`SessionEnd`) |
| OpenCode | yes (`experimental.chat.system.transform`) | yes (`event` startup handlers) | yes (`event` compact handlers / compact plugin) | yes (`event` cleanup handlers) |

## Cross-Runtime Fallback

Claude Code uses native `UserPromptSubmit`, `SessionStart`, `PreCompact`, and `Stop` hooks. Gemini CLI uses native `BeforeAgent`, `SessionStart`, `PreCompress`, and `SessionEnd` hooks. Copilot CLI uses the merged `.claude/settings.local.json` wrapper path: top-level `type`, `bash`, and `timeoutSec` fields on `UserPromptSubmit` and `SessionStart` invoke the Copilot writers, those writers refresh the Spec Kit managed block in `$HOME/.copilot/copilot-instructions.md`, and hook output remains `{}` with next-prompt freshness semantics. Generic `.github/hooks/*.json` files do not prove Spec Kit Copilot readiness on their own. OpenCode uses plugin-based transport rather than shell wrappers: `.opencode/plugins/spec-kit-skill-advisor.js` delivers prompt-time advisor briefs through `experimental.chat.system.transform`, while `.opencode/plugins/spec-kit-compact-code-graph.js` and plugin `event` handlers cover startup, compaction, readiness, and session cleanup. Codex CLI only reports live native-hook readiness when `[features].codex_hooks = true` is enabled in `~/.codex/config.toml` and `~/.codex/hooks.json` is wired; use `/spec_kit:resume` when those hooks are unavailable or disabled. If automatic hook delivery is unavailable in any runtime, or the advisor hook path is intentionally disabled (`SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`), fall back to the canonical operator path: start with `/spec_kit:resume`, rebuild packet continuity from `handover.md -> _memory.continuity -> spec docs`, then use `session_bootstrap()` or `session_resume()` only when you need lower-level structural health or merged recovery detail.

## Shared Startup Payload Parity

All four supported runtimes transport the same compact startup shared-payload through their runtime-specific hooks. The payload is produced by `buildStartupBrief()` in `mcp_server/lib/startup-brief.ts` and includes `graphQualitySummary` (detector provenance + edge-enrichment summary) alongside the `sharedPayloadTransport` envelope. Runtime-specific startup entrypoints:

| Runtime | Startup entrypoint | Transport |
| --- | --- | --- |
| Claude | `hooks/claude/session-prime.ts` | stdout context injection |
| Gemini | `hooks/gemini/session-prime.ts` | SessionStart injection |
| Copilot | `hooks/copilot/session-prime.ts` | refreshes managed block in `$HOME/.copilot/copilot-instructions.md` |
| Codex | `hooks/codex/session-start.ts` | native `SessionStart` hook (requires `[features].codex_hooks = true` + `~/.codex/hooks.json`) |

`graphQualitySummary` is also surfaced on `code_graph_status` and `session_bootstrap()` / startup-brief responses, so operators can inspect the same quality envelope regardless of transport. `session_bootstrap()` remains a manual fallback when native startup hooks are disabled — it is no longer a Codex-only substitute.

## Advisor Bridge and Threshold Contract

OpenCode delivers prompt-time advisor context through a plugin-helper bridge rather than a shell wrapper:

- Plugin: `.opencode/plugins/spec-kit-skill-advisor.js`
- Bridge entrypoint: `.opencode/skill/system-spec-kit/mcp_server/plugin-bridges/spec-kit-skill-advisor-bridge.mjs`
- Target: native compat entrypoint under `mcp_server/skill_advisor/compat/`

The bridge routes through the shared `renderAdvisorBrief(...)` invariants used by the Codex prompt-submit hook and prompt-wrapper fallback. The default OpenCode prompt-time threshold contract is **`0.8` confidence / `0.35` uncertainty**.

Packet 014 unified the public MCP contract:

- `advisor_recommend` and `advisor_validate` accept an explicit `workspaceRoot` argument; both responses surface the resolved `workspaceRoot` and `effectiveThresholds` used for routing.
- `advisor_validate` additionally publishes `thresholdSemantics` (aggregate vs runtime) plus a prompt-safe `telemetry.outcomes.totals` block (`accepted` / `corrected` / `ignored`).
- Hook diagnostics persist to bounded JSONL sinks under the temp metrics root (`${TMPDIR}/speckit-advisor-metrics/`), so `advisor_validate` can read the sinks back across processes.

## Retrieval Primitives

The same retrieval building blocks power both hook delivery and explicit recovery:
1. `memory_match_triggers(prompt)` — Fast turn-start context
2. `memory_context({ mode: "resume", profile: "resume" })` — Continuation and compaction recovery core
3. `session_bootstrap()` / `session_resume()` — Session-oriented wrappers that layer health and structural context around resume retrieval
