# Phase 018: Non-Hook CLI Auto-Priming & Session Health

## What This Is

Claude Code has hooks that automatically load context when a session starts. Other CLIs (OpenCode, Codex, Copilot, Gemini) don't have this. This phase makes the MCP server itself detect new sessions and inject context on the first tool call — no hooks needed.

## Plain-English Summary

**Problem:** When you start a session in Codex CLI or Copilot CLI, you get nothing — no memory, no code graph status, no prior work context. You have to manually call `memory_context` every time. Claude Code users get all this automatically via hooks.

**Solution:** Make the MCP server smart enough to detect "this is the first call of a new session" and automatically include session context in the response. Also add a `session_health` tool that any runtime can call to check if context has gone stale.

## What to Build

### Part 1: MCP First-Call Auto-Prime (from research iter 096)

When the MCP server receives its first tool call in a session, it automatically adds a "Prime Package" to the response containing:
- Last active spec folder
- Current task status
- Code graph freshness
- CocoIndex availability
- Recommended next calls

**How it works:**
1. `context-server.ts` tracks whether this session has been primed (a simple boolean flag)
2. On the first tool call, it runs `primeSessionIfNeeded()` which gathers context
3. The context is added to the response as structured `meta` + human-readable `hints`
4. Subsequent calls skip priming (flag is already set)

**Files to change:**
- `mcp_server/context-server.ts` — add priming check to tool dispatch
- `mcp_server/hooks/memory-surface.ts` — expose structured session context
- `mcp_server/lib/session/session-manager.ts` — provide recovery fields

### Part 2: Session Health Monitor (from research iter 097)

A new `session_health` tool that returns a simple traffic-light score:
- **ok** — session is fresh, context loaded, graph recent
- **warning** — session may have drifted (long gap between calls, spec folder changed)
- **stale** — probable context loss (should call `memory_context` to recover)

When health drops to `warning` or `stale`, the server also injects recovery hints into normal tool responses.

**Files to change:**
- New `mcp_server/handlers/session-health.ts`
- `mcp_server/tool-schemas.ts` — register new tool
- `mcp_server/context-server.ts` — inject health warnings into responses

### Part 3: Gate Doc Instructions

Update all runtime instruction files to include identical first-turn guidance:

> "On your first turn, call any Spec Kit Memory tool. The server will auto-prime your session with context. If you notice context drift, call `session_health` to check."

**Files to change:** `CLAUDE.md`, `CODEX.md`, `AGENTS.md`, `GEMINI.md`

## Cross-Runtime Impact

| Runtime | Before | After |
|---------|--------|-------|
| Claude Code | 100% | 100% (no change needed) |
| OpenCode | 60% | 85% |
| Codex CLI | 55% | 80% |
| Copilot CLI | 50% | 70% |
| Gemini CLI | 50% | 85% |

## Estimated LOC: 360-670
## Risk: LOW — additive feature, no existing behavior changed
## Dependencies: None

---

## Implementation Status (Post-Review Iterations 041-050)

| Item | Status | Evidence |
|------|--------|----------|
| Part 1: MCP First-Call Auto-Prime | DONE | primeSessionIfNeeded() in memory-surface.ts, PrimePackage struct, wired into context-server.ts |
| Part 2: Session Health Monitor | DONE | handlers/session-health.ts, session_health tool registered |
| Part 3: Gate Doc Instructions | DONE | Updated in Phase 021 (instruction parity) |
| recordToolCall/getSessionTimestamps exports | DONE | memory-surface.ts:101-107 |
| Token budget enforcement on prime | DONE | enforceAutoSurfaceTokenBudget applied |

### Review Findings (iter 042)
- F045 (P2): sessionPrimed flag set before try block — retry suppressed on failure. DEFERRED
- F046 (P2): cocoIndex path hardcoded via process.cwd(). DEFERRED
- F047 (P2): Dual lastToolCallAt state in memory-surface.ts and context-metrics.ts. DEFERRED
