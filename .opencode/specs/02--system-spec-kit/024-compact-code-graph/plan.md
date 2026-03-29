# Plan: Hybrid Context Injection — Hook + Tool Architecture

## Implementation Strategy

Phased approach: each phase is independently deployable and testable. Phase 1 (PreCompact) delivers the highest-value feature immediately.

## Phase Overview

### Phase 1: PreCompact Hook (P0 — 2-3 days)
**Goal:** Automatically inject critical context before Claude Code compacts the conversation.

**What exists:**
- `autoSurfaceAtCompaction(sessionContext, options)` in `hooks/memory-surface.ts`
- `COMPACTION_TOKEN_BUDGET = 4000` tokens
- Constitutional memories already auto-surface

**What to build:**
- `scripts/hooks/compact-inject.js` — Node.js script triggered by Claude Code PreCompact hook
- Script connects to MCP server via stdio or HTTP, calls `autoSurfaceAtCompaction()`
- Outputs surfaced memories to stdout (Claude Code injects this into the conversation)
- Register hook in `.claude/settings.local.json`

**Key decisions:**
- MCP communication: Use `memory_context({ mode: "resume" })` tool call via CLI, or direct function import?
- Recommendation: Direct import from compiled dist for speed (<2s requirement)

### Phase 2: SessionStart Hook (P1 — 1-2 days)
**Goal:** Auto-prime every new Claude Code session with relevant prior context.

**What to build:**
- `scripts/hooks/session-prime.js` — Node.js script triggered by SessionStart
- Calls `memory_context({ mode: "auto", input: "session start" })`
- Outputs concise context summary to stdout
- Register hook in `.claude/settings.local.json`

**Design considerations:**
- Token budget: ~2000 tokens (don't overwhelm the initial prompt)
- Should detect if resuming a prior session vs starting fresh
- Should surface constitutional memories + recent spec folder context

### Phase 3: Stop Hook + Token Tracking (P2 — 2-3 days)
**Goal:** Auto-save session context and track token usage on session end.

**What to build:**
- `scripts/hooks/session-stop.js` — Node.js script triggered by Stop
- Receives transcript path from Claude Code's Stop event
- Parses transcript for token usage (input, cache, output)
- Saves session summary via `generate-context.js` or lightweight alternative
- Stores token usage in MCP database (new table or existing telemetry)

**Design considerations:**
- Must handle large transcripts efficiently (streaming parse)
- Token tracking stored in SQLite alongside memory data
- Auto-detect spec folder from transcript content

### Phase 4: Cross-Runtime Fallback (P1 — 1-2 days)
**Goal:** Ensure all runtimes get context injection via tool-based approach.

**What to update:**
- CLAUDE.md: Enhance compaction recovery section with explicit `memory_context({ mode: "resume" })` call
- CODEX.md / runtime instruction files: Add equivalent instructions
- Gate 1: Ensure `memory_match_triggers()` fires reliably on first message after compact
- Consider adding a `compact_recovery` mode to `memory_context()`

**Validation:**
- Test with: Claude Code (hooks + tools), Codex CLI (tools only), Copilot (tools only)
- Verify compaction recovery works without hooks

## File Locations

```
.opencode/skill/system-spec-kit/mcp_server/
  scripts/hooks/
    compact-inject.js    ← Phase 1 (PreCompact)
    session-prime.js     ← Phase 2 (SessionStart)
    session-stop.js      ← Phase 3 (Stop)

.claude/
  settings.local.json    ← Hook registration (Phases 1-3)

CLAUDE.md                ← Phase 4 updates
```

## Dependencies

- Phase 1 has no dependencies — can start immediately
- Phase 2 depends on Phase 1 patterns (shared utilities)
- Phase 3 depends on Phase 1 patterns + transcript parsing
- Phase 4 can run in parallel with Phases 1-3

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Hook script timeout | Keep scripts fast (<2s), use direct imports not MCP calls |
| MCP server not running | Graceful fallback — output empty string, don't block Claude |
| Token budget overflow | Hard cap at COMPACTION_TOKEN_BUDGET (4000 tokens) |
| Cross-runtime divergence | CLAUDE.md instructions work everywhere as baseline |
| Settings.local.json conflict | Merge-safe hook registration (check existing hooks) |
