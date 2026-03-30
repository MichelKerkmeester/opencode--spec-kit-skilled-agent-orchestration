# Plan: Hybrid Context Injection — Hook + Tool Architecture

## Implementation Strategy

Phased approach: each phase is independently deployable and testable. Phase 1 (Compaction Context Injection) delivers the highest-value feature immediately.

**CORRECTED (iteration 011, 014):** PreCompact stdout is NOT injected into model context. The design uses PreCompact for precomputation and SessionStart(source=compact) for injection.

## Implementation Order

1. **Immediate**: Fix `/spec_kit:resume` `profile: "resume"` (1 hour)
2. **Phase 1+2**: Hook scripts (PreCompact + SessionStart) with hook-state bridge (1 week)
3. **Phase 4**: `.claude/CLAUDE.md` + CLAUDE.md compaction section (2 days)
4. **Phase 008**: tree-sitter structural indexer for JS/TS/Python/Shell (3-4 days)
5. **Phase 009**: SQLite storage + code_graph_scan/query/status tools (2-3 days)
6. **Phase 010**: code_graph_context + CocoIndex bridge (3-4 days)
7. **Phase 011**: Working-set tracking + 3-source compaction merge (2-3 days)
8. **Phase 3**: Stop hook + token tracking (1 week)
9. **Phase 5-7**: Agent/command alignment, documentation, testing (2 weeks)

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

### Phase 008: Structural Indexer (P2 — 3-4 days)
**Goal:** Extract structural symbols from JS/TS/Python/Shell via tree-sitter.

**What to build:**
- tree-sitter parser with standardized capture vocabulary (@definition.function, @definition.class, etc.)
- Normalized node/edge extraction pipeline
- Content-hash-based incremental re-indexing
- Parser health metadata (clean parse vs recovered tree)

**LOC estimate:** 300-420 lines

### Phase 009: Code Graph Storage + Query (P2 — 2-3 days)
**Goal:** SQLite schema and MCP query tools for structural relationships.

**What to build:**
- `code-graph.sqlite` with `code_files`, `code_nodes`, `code_edges` tables
- Edge vocabulary: CONTAINS, CALLS, IMPORTS, EXPORTS, EXTENDS, IMPLEMENTS
- `code_graph_scan` MCP tool (build/refresh index)
- `code_graph_query` MCP tool (outline, calls_from, calls_to, imports_from, imports_to)
- `code_graph_status` MCP tool (freshness, coverage, errors)
- Directional indexes for hot queries

**LOC estimate:** 220-320 lines

### Phase 010: CocoIndex Bridge + code_graph_context (P2 — 3-4 days)
**Goal:** LLM-oriented compact graph neighborhoods with CocoIndex seed support.

**What to build:**
- `code_graph_context` MCP tool with 3 query modes (neighborhood, outline, impact)
- CocoIndex seed normalization (file:line → graph node resolution)
- Seed resolution: exact symbol → enclosing symbol → file anchor
- Reverse semantic augmentation (graph neighborhoods → scoped CocoIndex queries)
- Budget enforcement within tool (accept budgetTokens parameter)
- Compact repo-map style output with CocoIndex-boosted ranking

**LOC estimate:** 330-460 lines

### Phase 011: Compaction Working-Set Integration (P2 — 2-3 days)
**Goal:** Wire code graph + CocoIndex into the compaction pipeline.

**What to build:**
- Session working-set tracker (files/symbols touched during session)
- 3-source merge: Memory + CocoIndex + Code Graph under 4000-token budget
- Token budget allocator: floors + overflow pool (constitutional 700, graph 1200, CocoIndex 900, triggered 400, overflow 800)
- Priority order: constitutional > code graph > CocoIndex > triggered
- Structured output sections for merged compact brief
- Mixed-freshness coordination and metadata

**LOC estimate:** 200-300 lines

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
- Code Graph MVP depends on Phases 1-2 patterns; can start after Phase 2
- CocoIndex bridge is independent — CocoIndex already deployed as MCP server

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
| CocoIndex unavailable | Code graph still provides structural context independently; graceful degradation |
