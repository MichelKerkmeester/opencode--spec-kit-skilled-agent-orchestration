# Spec: Hybrid Context Injection — Hook + Tool Architecture

## Summary

Implement a hybrid context injection system that uses Claude Code hooks (PreCompact, SessionStart, Stop) for automated context preservation at lifecycle boundaries, with tool-based fallback for runtimes without hook support.

## Problem

Context compaction in long AI coding sessions causes loss of critical knowledge. Currently our system relies on AI-driven recovery (CLAUDE.md instructions telling the AI to call `memory_context({ mode: "resume" })`). Analysis (iteration 012) confirmed five gaps:

1. **No provider lifecycle hook** — `autoSurfaceAtCompaction()` only runs when the AI actively calls `memory_context(mode: "resume")`, not at the moment compaction happens
2. **No private Claude recovery layer** — `.claude/CLAUDE.md` doesn't exist; compaction rules are only in the shared root CLAUDE.md
3. **Envelope metadata is weaker than prompt injection** — auto-surface adds `hints` and `meta.autoSurface`, not guaranteed prompt-state restoration
4. **Session-start is generic, not recovery-aware** — startup instructions only announce memory stats, not last task or spec folder
5. **Archived hook design never graduated** — a `pre_compact.py` design existed in `z_archive` but was never implemented

## Solution: Hybrid Approach

### Layer 1 — Hook-based (Claude Code)

Based on Claude Code hooks API (25 lifecycle events, 4 handler types — iteration 011):

- **PreCompact** hook → **precomputes** critical context and caches to temp file
  - stdout is NOT injected on PreCompact (confirmed by official docs)
  - Receives: `session_id`, `transcript_path`, `trigger` (auto|manual), `custom_instructions`
- **SessionStart(source=compact)** → **injects** cached context via stdout into conversation
  - SessionStart supports matcher on `source`: `startup`, `resume`, `clear`, `compact`
  - Plain stdout or `hookSpecificOutput.additionalContext` becomes model-visible context
- **SessionStart(source=startup|resume)** → primes session with relevant prior work
- **Stop** (async) → saves session context + tracks token usage
  - Receives: `transcript_path`, `stop_hook_active`, `last_assistant_message`
  - Token totals NOT in payload — must parse transcript JSONL

### Layer 2 — Tool-based (all runtimes)

- Gate 1 in CLAUDE.md triggers `memory_match_triggers()` on each user message
- After compaction, CLAUDE.md instructions direct AI to call `memory_context({ mode: "resume" })`
- Works on any runtime that reads CLAUDE.md/CODEX.md

### Layer 3 — Code Graph + CocoIndex (structural + semantic)

Based on deep research (iterations 036-045) and existing CocoIndex deployment:

- **CocoIndex** (existing): Semantic code search via vector embeddings — finds code by concept/intent ("what resembles what"). Deployed as MCP server with `search` tool, supports 28+ languages, function-level chunking, incremental index updates.
- **Code Graph** (planned, phases 008+): Structural relationship index via tree-sitter + SQLite — maps imports, calls, hierarchy, containment ("what connects to what"). Designed in iterations 036-045.
- **Complementary, not competing**: CocoIndex finds semantic candidates, code graph expands structurally. Neither duplicates the other.

### Design Principle (iteration 013)

**Hooks are transport reliability, not separate business logic.** Claude hooks call the same tools other runtimes call explicitly. Only two retrieval primitives:
- Fast turn-start: `memory_match_triggers(prompt)`
- Continuation/compaction: `memory_context({ mode: "resume" })`

## Architecture

```
                          +----------------------------------+
                          |     Runtime-Specific Adapter     |
                          |----------------------------------|
User/Session Event ------>| Claude: hooks (SessionStart,     |
                          |   PreCompact, Stop)              |
                          | Codex/OpenCode/Copilot/Gemini:   |
                          |   Gate docs + wrapper prompts    |
                          +----------------+-----------------+
                                           |
                                           v
                          +----------------------------------+
                          | Shared Context Orchestrator      |
                          |   memory_match_triggers(prompt)  |
                          |   memory_context(mode:"resume")  |
                          +----------------+-----------------+
                                           |
                          +----------------+-----------------+
                          |                |                 |
                          v                v                 v
                  +-------------+  +---------------+  +-----------+
                  | Spec Kit    |  | Code Graph    |  | CocoIndex |
                  | Memory MCP  |  | (structural)  |  | Code MCP  |
                  | autoSurface |  | tree-sitter   |  | semantic  |
                  | triggers    |  | SQLite edges  |  | search    |
                  +-------------+  +---------------+  +-----------+
```

### Hook Script File Layout (iteration 014)

```
.opencode/skill/system-spec-kit/scripts/hooks/claude/
  session-prime.ts      → SessionStart injection
  compact-inject.ts     → PreCompact precompute + cache
  session-stop.ts       → Stop: token tracking + save
  shared.ts             → Common utilities
  hook-state.ts         → Session ID mapping, cache management
  claude-transcript.ts  → Transcript JSONL parsing

Compiled → scripts/dist/hooks/claude/*.js
```

### Hook State (iteration 014)

Per-session state at `${os.tmpdir()}/speckit-claude-hooks/<project-hash>/<session-id>.json`:
- `claudeSessionId` → `speckitSessionId` mapping
- `lastSpecFolder` for continuity
- `pendingCompactPrime` with cached context payload
- `metrics` for token estimation

## Related Systems

| System | Role | Status | Integration |
|--------|------|--------|-------------|
| **CocoIndex Code MCP** | Semantic code search via embeddings | Deployed | `mcp__cocoindex_code__search` tool, 28+ languages |
| **Spec Kit Memory MCP** | Memory search, auto-surface, constitutional memories | Deployed | `memory_context`, `memory_match_triggers` |
| **Code Graph** | Structural relationship index (imports, calls, hierarchy) | Designed (phases 008+) | tree-sitter + SQLite, `code_graph_query` tool |

## Key Findings from Research

| Finding | Source | Impact |
|---------|--------|--------|
| PreCompact stdout NOT injected | iter 011 (Claude docs) | Redesigned to precompute+cache model |
| SessionStart has `source=compact` matcher | iter 011 | Enables post-compact-specific injection |
| `memory_context(resume)` returns search results, not compact brief | iter 012 | Must also pass `profile: "resume"` for brief format |
| `autoSurfaceAtCompaction` only runs when AI calls it | iter 012 | Confirms need for hook trigger |
| Copilot CLI and Gemini CLI have hook systems | iter 011, 015 | v1: tool-fallback by policy; future: hook adapters |
| Existing `consumption_log` table for telemetry | iter 015 | Token tracking uses separate `session_token_snapshots` table |
| CocoIndex covers semantic code search | iter 036-045 | Code graph focuses purely on structural relationships; no embeddings/chunking needed |
| code_graph_context accepts file-range seeds from CocoIndex | iter 046 | Bridge uses native CocoIndex format; no intermediate symbol resolution needed |
| Token budget: floors + overflow pool across 3 sources | iter 049 | Constitutional 700, Graph 1200, CocoIndex 900, Triggered 400, Overflow 800 = 4000 total |
| Query-intent router separates structural vs semantic | iter 048 | Keyword heuristics for v1; structural→code_graph, semantic→CocoIndex, session→Memory |
| Code graph integrates into existing MCP server | iter 055 | Same process, separate code-graph.sqlite; CocoIndex stays external |

## Runtime Support Matrix

| Runtime | Hook Support | v1 Policy | Future |
|---------|-------------|-----------|--------|
| Claude Code | 25 events, 4 handler types | Full hooks | Ship now |
| Codex CLI | None confirmed | Tool fallback | Monitor |
| Copilot CLI | Has hooks (guardrails focus) | Tool fallback by policy | Hook adapter candidate |
| Gemini CLI | Has hooks (v0.33.1+) | Tool fallback by policy | Hook adapter candidate |

## Phases

| Phase | Name | Effort | Priority |
|-------|------|--------|----------|
| 001 | Compaction Context Injection | 2-3 days | P0 — highest impact |
| 002 | SessionStart Priming | 1-2 days | P1 — session priming |
| 003 | Stop Hook + Token Tracking | 2-3 days | P2 — observability |
| 004 | Cross-Runtime Fallback | 1-2 days | P1 — universal support |
| 005 | Command & Agent Alignment | 1-2 days | P1 — integration |
| 006 | Documentation Alignment | 1-2 days | P1 — docs |
| 007 | Testing & Validation | 2-3 days | P1 — quality assurance |
| 008 | Structural Indexer (tree-sitter JS/TS/Python/Shell) | 3-4 days | P2 — graph foundation |
| 009 | Code Graph Storage + Query (SQLite + MCP tools) | 2-3 days | P2 — structural query |
| 010 | CocoIndex Bridge + code_graph_context | 3-4 days | P2 — bridge integration |
| 011 | Compaction Working-Set Integration | 2-3 days | P2 — 3-source merge |

## Out of Scope

- Code graph implementation (phases 008+) — architecture designed in this spec (iterations 036-045), implementation follows hook phases
- Dual-Graph installation or graperoot integration — rejected per research
- Token tracking dashboard UI — future work
- Copilot/Gemini hook adapters — v2 after v1 ships
