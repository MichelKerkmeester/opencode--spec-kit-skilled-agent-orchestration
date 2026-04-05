# Changelog: 024/018-non-hook-auto-priming

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 018-non-hook-auto-priming — 2026-03-31

Claude Code sessions already had a stronger startup path than the other runtimes when this phase landed. The remaining runtimes still needed an MCP-level fallback so they did not start completely cold whenever hooks or startup transport were unavailable. This phase introduced that fallback priming layer and added a health monitor; later packet phases then refined the public story toward `session_bootstrap()`, runtime-specific startup surfaces, and freshness-aware startup summaries.

> Spec folder: `.opencode/specs/system-spec-kit/024-compact-code-graph/018-non-hook-auto-priming/`

---

## New Features (3 items)

### First-call auto-priming for non-hook and degraded-hook flows

**Problem:** Claude Code had hooks that automatically loaded previous work context, but the repo still needed an MCP-level fallback for runtimes or situations where startup surfacing was unavailable. Without that fallback, sessions could start with no memory of what was active, no graph status, and no idea which spec folder was in play.

**Fix:** The MCP server now detects the first tool call in a session and can attach a Prime Package containing last active spec folder, current task status, graph freshness, CocoIndex availability, and recommended next calls. In the current packet state, this mechanism remains part of the fallback layer; public recovery guidance now centers on `session_bootstrap()` and runtime-specific startup surfaces rather than claiming one universal silent auto-prime path for every CLI.

### Session health monitor

**Problem:** Even after a session started with good context, there was no way to detect when that context had gone stale. Long pauses between interactions, switching spec folders mid-conversation, or context compaction events could all silently degrade the AI's awareness. The assistant would continue operating on outdated assumptions with no warning.

**Fix:** A new `session_health` tool returns a simple traffic-light score that any runtime can query at any time. **ok** means the session is fresh, context is loaded, and the code graph is recent. **warning** means the session may have drifted -- for example, there has been a long gap between tool calls or the spec folder changed. **stale** means probable context loss and recommends calling `memory_context` to recover. When health drops to warning or stale, the server also injects recovery hints into the responses of normal tool calls, so the AI can self-correct without the user having to intervene.

### Tool call timestamp tracking

**Problem:** The MCP server had no concept of session timing. It could not tell whether a tool call was the first one in a session or the hundredth, nor how much time had elapsed since the last interaction. Without this information, neither auto-priming nor health monitoring was possible.

**Fix:** Two new functions -- `recordToolCall()` and `getSessionTimestamps()` -- track the timestamps of the first and most recent tool call in each session. Every incoming tool call is recorded. The first-call timestamp drives the auto-prime trigger (if no first call has been recorded yet, this must be the first call). The elapsed time since the last call drives the health score calculation. Both functions are exported from the memory surface module so other parts of the server can use them.

---

## Architecture (2 items)

### Token-bounded prime payloads

**Problem:** The Prime Package assembles context from multiple sources -- spec folder state, code graph status, CocoIndex availability, recommended actions. Without a size limit, this payload could grow large enough to consume a meaningful portion of the AI's context window (the finite amount of text it can hold in memory during a conversation), crowding out the user's actual work.

**Fix:** All prime payloads are run through the existing `enforceAutoSurfaceTokenBudget` function, which caps the output at a predetermined token limit. This keeps priming context compact and predictable regardless of how much underlying data is available. The budget enforcement was already battle-tested for other auto-surfacing features, so reusing it here added no new risk.

### Session state flag to prevent re-priming

**Problem:** Without a guard, the priming logic would fire on every single tool call, repeatedly injecting the same startup context into every response. This would waste tokens and clutter the AI's view of the conversation.

**Fix:** A simple `sessionPrimed` boolean flag is set to `true` after the first successful prime injection. All subsequent tool calls check this flag and skip priming entirely. The flag resets when a new session begins (server restart or new connection), ensuring the next session gets its own fresh prime.

---

<details>
<summary>Files Changed (7 files)</summary>

| File | What changed |
|------|-------------|
| `mcp_server/hooks/memory-surface.ts` | Added `PrimePackage` type definition (the structured bundle of session context), plus `recordToolCall()` and `getSessionTimestamps()` exports for tracking session timing |
| `mcp_server/handlers/session-health.ts` | New file -- implements the `session_health` handler that computes and returns the ok/warning/stale traffic-light score |
| `mcp_server/context-server.ts` | Added `primeSessionIfNeeded()` function with `sessionPrimed` flag, and health warning injection into tool responses when session freshness degrades |
| `mcp_server/hooks/index.ts` | Re-exports for the new `recordToolCall` and `getSessionTimestamps` functions so other modules can import them |
| `mcp_server/tool-schemas.ts` | Registered the `session_health` tool definition so CLIs can discover and call it |
| `mcp_server/schemas/tool-input-schemas.ts` | Added the input schema for `session_health` (defines what parameters the tool accepts) |
| `mcp_server/tools/lifecycle-tools.ts` | Wired `session_health` into the tool dispatch router so incoming calls reach the correct handler |

</details>

---

## Deep Review Fixes (2026-04-01)

### Code Fix
- **session_health excluded from recordToolCall** -- diagnostic tools no longer reset the idle-gap timer, fixing self-referential timestamp reset

### Doc Fixes
- Phase status aligned to "Partial" with deferred items
- session_health timer reset documented as known limitation
- Spec-folder-change warning documented as not implemented
- Gate doc parity attributed to Phase 021
- F045/F046 updated from deferred to done
- Dual lastToolCallAt documented as tech debt

---

## Upgrade

No migration required. Auto-priming activates automatically on the next MCP server restart. The `session_health` tool is immediately available to all connected runtimes.

**3 items deferred to future phases (all P2):** sessionPrimed flag retry-on-failure (F045), CocoIndex path hardcoding (F046), and dual timestamp state consolidation (F047).
