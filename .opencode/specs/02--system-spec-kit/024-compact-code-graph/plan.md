# Plan: Hybrid Context Injection — Hook + Tool Architecture

## Implementation Strategy

Phased approach: each phase is independently deployable and testable. Phase 1 (Compaction Context Injection) delivers the highest-value feature immediately.

**CORRECTED (iteration 011, 014):** PreCompact stdout is NOT injected into model context. The design uses PreCompact for precomputation and SessionStart(source=compact) for injection.

## Phase Overview

### Phase 1: Compaction Context Injection (P0 — 2-3 days)
**Goal:** Automatically inject critical context when Claude Code compacts the conversation.

**Two-step flow (corrected per iteration 011):**
1. `PreCompact` hook → `compact-inject.ts` precomputes context, caches to temp file
2. `SessionStart(source=compact)` hook → `session-prime.ts` reads cache, outputs to stdout

**What exists:**
- `autoSurfaceAtCompaction(sessionContext, options)` in `hooks/memory-surface.ts`
- `COMPACTION_TOKEN_BUDGET = 4000` tokens
- Constitutional memories auto-surface infrastructure
- `context-server.ts` already treats `memory_context(resume)` as compaction lifecycle call (iter 012)

**What to build:**
- `scripts/hooks/claude/compact-inject.ts` — PreCompact precompute + cache
- `scripts/hooks/claude/session-prime.ts` — SessionStart injection (handles both compact and startup)
- `scripts/hooks/claude/shared.ts` — Common utilities (stdin parsing, error handling)
- `scripts/hooks/claude/hook-state.ts` — Per-session state management
- Register hooks in `.claude/settings.local.json`

**Key finding (iteration 012):** `memory_context({ mode: "resume" })` returns search results, not a compact brief. Must ALSO pass `profile: "resume"` for the brief `{ state, nextSteps, blockers }` format.

**Hook state (iteration 014):** Per-session state at `${os.tmpdir()}/speckit-claude-hooks/<project-hash>/<session-id>.json` bridges Claude's `session_id` → Spec Kit's `effectiveSessionId`, stores `pendingCompactPrime`, and tracks transcript deltas.

### Phase 2: SessionStart Hook (P1 — 1-2 days)
**Goal:** Auto-prime every new Claude Code session with relevant prior context.

**Shares `session-prime.ts` with Phase 1** — the same script handles both:
- `source=compact` → reads cached compact payload, injects
- `source=startup` → calls `memory_context({ mode: "resume", profile: "resume" })`
- `source=resume` → loads resume context with session continuity

**Design considerations (iteration 013):**
- Keep one retrieval contract across all runtimes — hooks call same tools as manual flows
- `/spec_kit:resume` remains the canonical continuation surface
- Token budget: ~2000 tokens (don't overwhelm the initial prompt)

### Phase 3: Stop Hook + Token Tracking (P2 — 2-3 days)
**Goal:** Auto-save session context and track token usage on session end.

**What to build:**
- `scripts/hooks/claude/session-stop.ts` — Async Stop hook
- `scripts/hooks/claude/claude-transcript.ts` — Transcript JSONL parser

**Stop hook input (iteration 011):** `transcript_path`, `stop_hook_active`, `last_assistant_message`
Token totals are NOT in the payload — must parse transcript JSONL.

**Token storage (iteration 015):** New `session_token_snapshots` table (not overloading `consumption_log`):
```sql
CREATE TABLE session_token_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  runtime TEXT NOT NULL,
  spec_folder TEXT,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  cache_creation_tokens INTEGER,
  cache_read_tokens INTEGER,
  total_tokens INTEGER,
  estimated_cost_usd REAL,
  captured_at TEXT NOT NULL
);
```

**Design: Append-only snapshots** (not mutable session rows) because Stop hooks can fire multiple times per session and resume flows are easier to debug.

### Phase 4: Cross-Runtime Fallback (P1 — 1-2 days)
**Goal:** Ensure all runtimes get context injection via tool-based approach.

**Runtime detection (iteration 015):** Two outputs, not one:
- `runtime`: `claude-code | codex-cli | copilot-cli | gemini-cli | unknown`
- `hookPolicy`: `enabled | disabled_by_scope | unavailable | unknown`

**What to update:**
- CLAUDE.md: Enhance compaction recovery with explicit `memory_context({ mode: "resume", profile: "resume" })`
- CODEX.md: Add equivalent recovery instructions
- Gate 1: Ensure `memory_match_triggers()` fires post-compaction
- Close Gap B (iteration 012): Create `.claude/CLAUDE.md` with Claude-specific recovery

**Validation (iteration 015):** 7-scenario test matrix across 4 runtimes

## File Locations (iteration 014)

```
.opencode/skill/system-spec-kit/scripts/hooks/claude/
  session-prime.ts       ← Phases 1+2 (SessionStart injection)
  compact-inject.ts      ← Phase 1 (PreCompact precompute)
  session-stop.ts        ← Phase 3 (Stop: save + tokens)
  shared.ts              ← Common utilities
  hook-state.ts          ← Session ID mapping, cache
  claude-transcript.ts   ← Transcript parsing

Compiled → scripts/dist/hooks/claude/*.js

.opencode/skill/system-spec-kit/mcp_server/api/
  hooks.ts               ← Hook-safe public API bridge

.claude/
  settings.local.json    ← Hook registration (Phases 1-3)

CLAUDE.md                ← Phase 4 updates
```

## Dependencies

- Phase 1 has no dependencies — can start immediately
- Phase 2 shares `session-prime.ts` with Phase 1 (tight coupling)
- Phase 3 depends on Phase 1 patterns + transcript parsing
- Phase 4 can run in parallel with Phases 1-3

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Hook script timeout | Keep scripts fast (<2s), direct imports not MCP calls |
| MCP server not running | Graceful fallback — empty output, don't block Claude |
| Token budget overflow | Hard cap at COMPACTION_TOKEN_BUDGET (4000 tokens) |
| Cross-runtime divergence | CLAUDE.md instructions work everywhere as baseline |
| Settings.local.json conflict | Merge-safe registration (user already has hooks at `~/.claude/settings.json`) |
| `profile: "resume"` not passed | Explicitly pass in all hook scripts (gap found in iter 012) |
| Session ID mismatch | Hook-state maps Claude `session_id` → Spec Kit `effectiveSessionId` |
