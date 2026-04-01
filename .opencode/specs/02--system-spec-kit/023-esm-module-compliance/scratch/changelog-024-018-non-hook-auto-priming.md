# Changelog: 024/018-non-hook-auto-priming

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 018-non-hook-auto-priming — 2026-03-31

Claude Code sessions start with full context automatically -- your last spec folder, code graph status, and recommended next steps are all injected via hooks before you even type. Every other CLI (Codex, Copilot, Gemini, OpenCode) started cold: no memory, no graph status, no prior work. You had to manually call `memory_context` every single time. This phase makes the MCP server itself detect "first call of a new session" and inject that same context automatically, closing the biggest usability gap between Claude Code and the other runtimes. It also adds a health monitor so any runtime can check whether its session context has gone stale.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/018-non-hook-auto-priming/`

---

## New Features (3 items)

### First-call auto-priming for non-hook CLIs

**Problem:** Claude Code has hooks that automatically load your previous work context the moment a session starts. Every other CLI -- Codex, Copilot, Gemini, and OpenCode -- had no equivalent mechanism. When you opened a session in any of those tools, you got nothing: no memory of what you were working on, no knowledge of whether your code graph was up to date, no idea which spec folder was active. The only workaround was to manually call `memory_context` at the start of every single session, which was easy to forget and tedious to repeat.

**Fix:** The MCP server (the background process that all CLIs talk to for memory and context tools) now detects when it receives the very first tool call in a new session. When that happens, it automatically assembles and injects a "Prime Package" -- a structured bundle containing the last active spec folder, current task status, code graph freshness, whether the CocoIndex semantic search engine is available, and a list of recommended next calls. This context is added directly to the tool response so the AI assistant sees it immediately. No manual step required. The function responsible is `primeSessionIfNeeded()` in the main server file.

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

## Upgrade

No migration required. Auto-priming activates automatically on the next MCP server restart. The `session_health` tool is immediately available to all connected runtimes.

**3 items deferred to future phases (all P2):** sessionPrimed flag retry-on-failure (F045), CocoIndex path hardcoding (F046), and dual timestamp state consolidation (F047).
